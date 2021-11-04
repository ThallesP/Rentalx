import { Connection, createConnection, getConnectionOptions } from "typeorm";

createConnection();

export default async (): Promise<Connection> => {
  const options = await getConnectionOptions();

  Object.assign(options, {
    database: process.env.NODE_ENV === "test" ? "rentx_test" : options.database,
  });

  return createConnection(options);
};
