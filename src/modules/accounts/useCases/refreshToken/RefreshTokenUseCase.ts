import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppException } from "@shared/exceptions/AppException";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayJSDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { email, sub: userId } = verify(
      refresh_token,
      auth.secret_refresh_token
    ) as IPayload;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        userId,
        refresh_token
      );

    if (!userToken) {
      throw new AppException("Refresh token does not exists.");
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const newRefreshToken = sign({ email }, auth.secret_refresh_token, {
      subject: userId,
      expiresIn: auth.expires_in_refresh_token,
    });

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      expires_date: refreshTokenExpiresDate,
      user_id: userId,
      refresh_token: newRefreshToken,
    });

    const newToken = sign({ email }, auth.secret_token, {
      subject: userId,
      expiresIn: auth.expires_in_token,
    });

    return { token: newToken, refresh_token: newRefreshToken };
  }
}
