import { container } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { S3CompatibleStorageProvider } from "./implementations/S3CompatibleStorageProvider";
import { IStorageProvider } from "./IStorageProvider";

const storageType = {
  S3_COMPATIBLE: S3CompatibleStorageProvider,
  LOCAL: LocalStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  storageType[process.env.STORAGE_TYPE]
);
