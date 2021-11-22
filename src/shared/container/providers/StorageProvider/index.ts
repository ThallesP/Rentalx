import { container } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { S3StorageProvider } from "./implementations/S3StorageProvider";
import { IStorageProvider } from "./IStorageProvider";

const storageType = {
  S3: S3StorageProvider,
  LOCAL: LocalStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  storageType[process.env.STORAGE_TYPE]
);
