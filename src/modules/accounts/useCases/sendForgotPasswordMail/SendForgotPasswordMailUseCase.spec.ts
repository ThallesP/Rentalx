import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayJSDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJSDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppException } from "@shared/exceptions/AppException";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayJSDateProvider;
let mailProviderInMemory: MailProviderInMemory;

describe("Send forgot Mail", () => {
  beforeEach(() => {
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayJSDateProvider();
    mailProviderInMemory = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProviderInMemory
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, "sendMail");

    await usersRepositoryInMemory.create({
      email: "pimeh@civsunme.ps",
      driver_license: "616579",
      name: "Mathilda Fisher",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("pimeh@civsunme.ps");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send a forgot password mail if user doesn't exists", async () => {
    await expect(async () => {
      await sendForgotPasswordMailUseCase.execute("vodmitha@comedpu.tn");
    }).rejects.toEqual(new AppException("User does not exists."));
  });

  it("should be able to create an user token", async () => {
    const createTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      email: "hukwa@saw.tz",
      driver_license: "635680",
      name: "Edith Mendez",
      password: "12345",
    });

    await sendForgotPasswordMailUseCase.execute("hukwa@saw.tz");

    expect(createTokenMail).toHaveBeenCalled();
  });
});
