/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, NextFunction, Response } from "express";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppException } from "@shared/exceptions/AppException";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);

  if (!user.is_admin) {
    throw new AppException("User isn't admin.");
  }

  return next();
}
