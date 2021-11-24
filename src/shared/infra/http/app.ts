import "reflect-metadata";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "@shared/infra/typeorm";
import "@shared/container";
import upload from "@config/upload";
import { AppException } from "@shared/exceptions/AppException";
import { router } from "@shared/infra/http/routes";

import swaggerFile from "../../../swagger.json";
import { rateLimiter } from "./middlewares/rateLimiter";

const app = express();

if (process.env.ENABLE_TRANSLATE_PROXY_REAL_IP === "true") {
  app.set("trust proxy", () => true);
}

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/avatars", express.static(`${upload.tmpFolder}/avatars`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));
app.use(cors());
app.use(rateLimiter);
app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppException) {
      return response.status(err.statusCode).json({ message: err.message });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
