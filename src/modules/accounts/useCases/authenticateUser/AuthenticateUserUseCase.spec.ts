import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { AppException } from "@shared/exceptions/AppException";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Test user",
      email: "test@testuser.com",
      password: "test1234",
      driver_license: "00-00-00",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate an nonexistent user", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@nonexistent.com",
        password: "1234",
      });
    }).rejects.toEqual(new AppException("Email/password is incorrect.", 401));
  });

  it("Should not be able to authenticate an user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "Test user password",
      email: "test@incorrectpassword.com",
      password: "test1234",
      driver_license: "99-00-00",
    };

    await createUserUseCase.execute(user);

    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toEqual(new AppException("Email/password is incorrect.", 401));
  });
});
