import { NextFunction, Request, Response } from "express";

export async function cloudflareSupport(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  request.ip = request.headers["cf-connecting-ip"] as string;

  return next();
}
