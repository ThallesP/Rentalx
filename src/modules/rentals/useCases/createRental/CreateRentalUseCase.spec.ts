import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppException } from "@shared/exceptions/AppException";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;

describe("Create Rental", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "121212",
      expected_return_date: new Date(),
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there's an opened rental for the user", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "15261",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "19281",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppException);
  });

  it("should not be able to create a new rental if there's an opened rental for the car", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1920",
        car_id: "121212",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: "5674",
        car_id: "121212",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppException);
  });
});
