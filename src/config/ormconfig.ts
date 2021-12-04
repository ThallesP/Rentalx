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

export default {
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
      `${codeFolder}/shared/infra/typeorm`,
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
    migrationsDir: `${codeFolder}/migrations`,
  },
  synchronize: false,
} as PostgresConnectionOptions;
