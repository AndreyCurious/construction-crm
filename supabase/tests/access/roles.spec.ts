import { describe, expect, it } from "vitest";

import { setupTestDatabase } from "../helpers/setup-test-database";

const { db, readRows } = setupTestDatabase();

describe("Назначение роли", () => {
  it("не повышает роль через пользовательские метаданные", async () => {
    const fakeManagerId = "10000000-0000-4000-8000-000000000005";

    const metadata = { role: "manager", crm_role: "manager" };

    await db.query(
      `insert into auth.users (id, email, raw_user_meta_data)
       values ($1, $2, $3::jsonb)`,
      [fakeManagerId, "fake@test.local", JSON.stringify(metadata)]
    );

    const profiles = await readRows("select role from public.profiles where id = $1", [fakeManagerId]);

    expect(profiles).toEqual([{ role: "executor" }]);
  });
});
