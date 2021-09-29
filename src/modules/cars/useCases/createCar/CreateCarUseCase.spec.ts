import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppException } from "@shared/exceptions/AppException";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create new car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new car", async () => {
    const car = {
      name: "Test car",
      description: "Test car description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Tester",
      category_id: "category",
    };

    await createCarUseCase.execute(car);
  });

  it("should not be able to create a new car if license plate already exists", async () => {
    await expect(async () => {
      await createCarUseCase.execute({
        name: "Car1",
        description: "Test car1 description",
        daily_rate: 60,
        license_plate: "ABC-1234",
        fine_amount: 30,
        brand: "Tester exists1",
        category_id: "category",
      });

      await createCarUseCase.execute({
        name: "Car2",
        description: "Test car2 description",
        daily_rate: 120,
        license_plate: "ABC-1234",
        fine_amount: 90,
        brand: "Tester exists2",
        category_id: "category",
      });
    }).rejects.toBeInstanceOf(AppException);
  });

  it("should be able to create a new car where available is true by default", async () => {
    const car = {
      name: "Test car available",
      description: "Test car available description",
      daily_rate: 100,
      license_plate: "ABCD-12345",
      fine_amount: 60,
      brand: "Tester available",
      category_id: "category",
    };

    const carCreated = await createCarUseCase.execute(car);

    expect(carCreated.available).toBe(true);
  });
});
