import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime";
import { resolve } from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

export class S3CompatibleStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_BUCKET_REGION,
    });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalName);

    const contentType = mime.getType(originalName);

    await this.client
      .putObject({
        Bucket: `${process.env.S3_BUCKET}/${folder}`,
        Key: file,
        ACL: "public-read",
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalName);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${process.env.S3_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}
