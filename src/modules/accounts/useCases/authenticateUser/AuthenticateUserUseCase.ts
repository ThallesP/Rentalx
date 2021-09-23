import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppException } from "@exceptions/AppException";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppException("Email/password is incorrect.", 401);
    }

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch) {
      throw new AppException("Email/password is incorrect.", 401);
    }

    const token = sign({ email }, "1852ca7f66f74c0899182da4b49fe477", {
      subject: userExists.id,
      expiresIn: "1d",
    });

    return {
      user: {
        name: userExists.name,
        email: userExists.email,
      },
      token,
    };
  }
}
