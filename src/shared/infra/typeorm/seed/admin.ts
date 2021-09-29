import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import createConnection from "@shared/infra/typeorm";

async function create() {
  const connection = await createConnection();

  const id = uuidV4();
  const passwordHash = await hash("admin", 8);

  await connection.query(
    `INSERT INTO users(id, name, email, password, driver_license, is_admin, created_at)
      values('${id}', 'Admin', 'admin@admin.com', '${passwordHash}', 'ABC-12345', true, now())
    `
  );

  await connection.close();
}

create().then(() => console.log("[Seed] An Admin user has been created"));
