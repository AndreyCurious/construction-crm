import type { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";

import { MANAGER_ID, TEST_OBJECTS, TEST_TASKS, TEST_USERS } from "./database.fixtures";

export async function prepareDatabase(database: PGlite): Promise<void> {
  const schema = await readFile(new URL("../fixtures/auth-schema.sql", import.meta.url), "utf8");
  await database.exec(schema);

  const migration = await readFile(
    new URL("../../migrations/202611050001_initial_schema.sql", import.meta.url),
    "utf8"
  );
  await database.exec(migration);

  for (const user of TEST_USERS) {
    await database.query(
      `insert into auth.users (id, email, raw_app_meta_data)
       values ($1, $2, $3::jsonb)`,
      [user.id, user.email, JSON.stringify({ crm_role: user.role })]
    );
  }

  await database.query("select set_config('request.jwt.claim.sub', $1, false)", [MANAGER_ID]);

  for (const object of TEST_OBJECTS) {
    await database.query(
      `insert into public.construction_objects (id, name, address, created_by)
       values ($1, $2, $3, $4)`,
      [object.id, object.name, object.address, MANAGER_ID]
    );
  }

  for (const task of TEST_TASKS) {
    await database.query(
      `insert into public.tasks (id, title, object_id, assignee_id, author_id)
       values ($1, $2, $3, $4, $5)`,
      [task.id, task.title, task.objectId, task.assigneeId, MANAGER_ID]
    );
  }
}
