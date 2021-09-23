import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { deleteFile } from "@utils/file";

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    const oldAvatarFile = user.avatar;

    user.avatar = avatar_file;

    await this.usersRepository.create(user);

    if (user.avatar) {
      // If some request happens to get the old avatar between this update, it may be null, so it better to delete after updating.
      await deleteFile(`./tmp/avatar/${oldAvatarFile}`);
    }
  }
}
