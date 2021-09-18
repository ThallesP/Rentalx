import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppException } from "../exceptions/AppException";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppException("Token is missing.", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "1852ca7f66f74c0899182da4b49fe477"
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const userExists = await usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppException("User does not exists.", 401);
    }

    request.user = {
      id: user_id,
    };

    next();
  } catch (error) {
    throw new AppException("Token is invalid.", 401);
  }
}
