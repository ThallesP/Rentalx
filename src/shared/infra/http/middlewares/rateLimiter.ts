import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "redis";

import { AppException } from "@shared/exceptions/AppException";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  enable_offline_queue: false,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 10,
  duration: 5,
});

export async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (error) {
    throw new AppException("Too many requests.", 429);
  }
}
