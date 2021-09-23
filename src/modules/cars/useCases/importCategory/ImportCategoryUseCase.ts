import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
export class ImportCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const parseFile = csvParse();
      const categories: IImportCategory[] = [];

      stream.pipe(parseFile);

      parseFile.on("data", async (line) => {
        const [name, description] = line;

        categories.push({
          name,
          description,
        });
      });

      parseFile.on("end", async () => {
        await fs.promises.unlink(file.path);
        resolve(categories);
      });

      parseFile.on("error", reject);
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.forEach(async (category) => {
      const { name, description } = category;

      const existsCategory = await this.categoriesRepository.findByName(name);

      if (!existsCategory) {
        await this.categoriesRepository.create({
          name,
          description,
        });
      }
    });
  }
}
