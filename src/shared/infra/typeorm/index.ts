import { Connection, createConnection } from "typeorm";

import ormconfig from "@config/ormconfig";

export default async (): Promise<Connection> => {
  Object.assign(ormconfig, {
    database:
      process.env.NODE_ENV === "test" ? "rentx_test" : ormconfig.database,
  });

  return createConnection(ormconfig);
};
