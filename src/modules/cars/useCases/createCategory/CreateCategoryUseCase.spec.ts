import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppException } from "@shared/exceptions/AppException";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create new category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("Should be able to create a new category", async () => {
    const category = {
      name: "Category test",
      description: "Category description test",
    };

    await createCategoryUseCase.execute(category);

    const categoryExists = await categoriesRepositoryInMemory.findByName(
      category.name
    );

    expect(categoryExists).toHaveProperty("id");
  });

  it("Should not be able to create a new category if name already exists", async () => {
    const category = {
      name: "Category test",
      description: "Category description test",
    };

    await createCategoryUseCase.execute(category);

    await expect(async () => {
      await createCategoryUseCase.execute(category);
    }).rejects.toEqual(new AppException("Category already exists."));
  });
});
