import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    const oldAvatarFile = user.avatar;

    user.avatar = avatar_file;

    await this.storageProvider.save(avatar_file, "avatars");

    await this.usersRepository.create(user);

    if (oldAvatarFile) {
      await this.storageProvider.delete(oldAvatarFile, "avatars");
    }
  }
}
