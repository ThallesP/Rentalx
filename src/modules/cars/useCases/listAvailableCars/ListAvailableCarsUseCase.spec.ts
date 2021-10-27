import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("list available cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car example",
      daily_rate: 140,
      license_plate: "DEF-1234",
      fine_amount: 100,
      brand: "Car Brand example",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car by name",
      description: "Car name",
      daily_rate: 140,
      license_plate: "DEF-12342",
      fine_amount: 100,
      brand: "Car Brand example name",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: car.name,
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car by brand",
      description: "Car brand",
      daily_rate: 140,
      license_plate: "DEF-12345",
      fine_amount: 100,
      brand: "Car Brand example brand",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: car.brand,
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category_id", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car by category_id",
      description: "Car category_id",
      daily_rate: 140,
      license_plate: "DEF-12314",
      fine_amount: 100,
      brand: "Car Brand example category_id",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: car.category_id,
    });

    expect(cars).toEqual([car]);
  });
});
