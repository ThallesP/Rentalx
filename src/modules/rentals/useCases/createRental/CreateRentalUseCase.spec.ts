import dayjs from "dayjs";

import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
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
    const car = await carsRepositoryInMemory.create({
      name: "Test car",
      description: "Test car description",
      daily_rate: 100,
      license_plate: "ABC-12345",
      fine_amount: 40,
      category_id: "1234",
      brand: "Test",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dateAfterOneDay,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there's an opened rental for the user", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "12345-685",
      expected_return_date: dateAfterOneDay,
      user_id: "12345",
    });

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "776678",
        expected_return_date: dateAfterOneDay,
      });
    }).rejects.toEqual(
      new AppException("There's already a rental for this user.")
    );
  });

  it("should not be able to create a new rental if there's an opened rental for the car", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "5674",
      car_id: "1234-9871",
      expected_return_date: dateAfterOneDay,
    });

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "5675",
        car_id: "1234-9871",
        expected_return_date: dateAfterOneDay,
      });
    }).rejects.toEqual(new AppException("Car is unavailable for rental."));
  });

  it("should not be able to create a new rental if expected return time is less than 24 hours", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "1111",
        car_id: "911",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toEqual(new AppException("Invalid return time."));
  });
});
