import { describe, it } from "vitest";

import { EXECUTOR_ID, MANAGER_ID, OBJECT_ID, TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { db, signIn, expectRejected } = setupTestDatabase();

describe("Конфликты изменений задачи", () => {
  it("отклоняет устаревшую и отсутствующую версию задачи", async () => {
    await signIn(MANAGER_ID);

    await db.query("select public.update_task($1, 'Изменённая', '', $2, $3, 1)", [
      TASK_ID,
      OBJECT_ID,
      EXECUTOR_ID
    ]);

    await expectRejected("select public.delete_task($1, 1)", [TASK_ID], "STALE_RECORD");

    await expectRejected(
      "select public.update_task($1, 'Старая', '', $2, $3, 1)",
      [TASK_ID, OBJECT_ID, EXECUTOR_ID],
      "STALE_RECORD"
    );

    await signIn(EXECUTOR_ID);

    await expectRejected("select public.transition_task($1, 'in_progress', null)", [TASK_ID], "STALE_RECORD");
  });
});
