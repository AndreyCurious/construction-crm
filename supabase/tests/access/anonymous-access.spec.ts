import { describe, it } from "vitest";

import { TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { signIn, expectRejected } = setupTestDatabase();

describe("Доступ без авторизации", () => {
  it("запрещает чтение и изменение без авторизации", async () => {
    await signIn(null, "anon");

    for (const table of ["profiles", "construction_objects", "tasks", "task_history"]) {
      await expectRejected(`select * from public.${table}`, [], "permission denied");
    }

    await expectRejected("select public.create_object('Взлом', 'Адрес')", [], "permission denied");
    await expectRejected(
      "select public.transition_task($1, 'in_progress', 1)",
      [TASK_ID],
      "permission denied"
    );
  });
});
