import { NextFunction, Request, Response } from "express";

export async function cloudflareSupport(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  Object.defineProperty(request, "ip", {
    configurable: true,
    enumerable: true,
    get: () => {
      return request.headers["cf-connecting-ip"] as string;
    },
  });

  return next();
}
