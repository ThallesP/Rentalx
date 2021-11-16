import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const passwordHash = await hash("admin", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, driver_license, is_admin, created_at)
      values('${id}', 'Admin', 'admin@admin.com', '${passwordHash}', 'ABC-12345', true, now())
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@admin.com",
      password: "admin",
    });

    const { refreshToken } = responseToken.body;

    const response = await request(app)
      .post("/categories/")
      .set("Authorization", `Bearer ${refreshToken}`)
      .send({
        name: "Category name SuperTest",
        description: "Category description SuperTest",
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new category if name already exists", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@admin.com",
      password: "admin",
    });

    const { refreshToken } = responseToken.body;

    await request(app)
      .post("/categories/")
      .set("Authorization", `Bearer ${refreshToken}`)
      .send({
        name: "Category name duplicated SuperTest",
        description: "Category description not duplicated SuperTest",
      });

    const response = await request(app)
      .post("/categories/")
      .set("Authorization", `Bearer ${refreshToken}`)
      .send({
        name: "Category name duplicated SuperTest",
        description: "Category description SuperTest",
      });

    expect(response.status).toBe(400);
  });
});
