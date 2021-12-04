import { join } from "path";
import { parse } from "pg-connection-string";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const {
  database,
  host,
  password,
  port,
  user: username,
} = parse(process.env.DATABASE_URL);

const codeFolder = process.env.NODE_ENV === "production" ? "dist" : "src";

export const ormconfig: PostgresConnectionOptions = {
  type: "postgres",
  host,
  username,
  password,
  port: Number(port),
  database,
  migrationsRun: true,
  entities: [
    join(process.cwd(), `${codeFolder}/modules/**/entities/*.{ts,js}`),
  ],
  migrations: [
    join(
      process.cwd(),
      `${codeFolder}/infra/typeorm`,
      "/migrations/**/*{.ts,.js}"
    ),
  ],
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  cli: {
    migrationsDir: "src/migrations",
  },
  synchronize: false,
};
