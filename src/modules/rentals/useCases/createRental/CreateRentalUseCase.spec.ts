import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayJSDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJSDateProvider";
import { AppException } from "@shared/exceptions/AppException";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJSDateProvider: DayJSDateProvider;

describe("Create Rental", () => {
  const dateAfterOneDay = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJSDateProvider = new DayJSDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dayJSDateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "121212",
      expected_return_date: dateAfterOneDay,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there's an opened rental for the user", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "15261",
        expected_return_date: dateAfterOneDay,
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "19281",
        expected_return_date: dateAfterOneDay,
      });
    }).rejects.toBeInstanceOf(AppException);
  });

  it("should not be able to create a new rental if there's an opened rental for the car", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1920",
        car_id: "121212",
        expected_return_date: dateAfterOneDay,
      });

      await createRentalUseCase.execute({
        user_id: "5674",
        car_id: "121212",
        expected_return_date: dateAfterOneDay,
      });
    }).rejects.toBeInstanceOf(AppException);
  });

  it("should not be able to create a new rental if expected return time is less than 24 hours", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1111",
        car_id: "911",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppException);
  });
});
