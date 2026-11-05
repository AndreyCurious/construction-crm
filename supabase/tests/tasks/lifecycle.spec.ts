import { describe, expect, it } from "vitest";

import { EXECUTOR_ID, MANAGER_ID, SECOND_MANAGER_ID, TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { db, signIn, readRows } = setupTestDatabase();

describe("Полный цикл задачи", () => {
  it("проводит задачу через доработку до приёмки", async () => {
    await signIn(EXECUTOR_ID);
    await db.query("select public.transition_task($1, 'in_progress', 1)", [TASK_ID]);
    await db.query("select public.transition_task($1, 'in_review', 2)", [TASK_ID]);

    await signIn(SECOND_MANAGER_ID);
    await db.query("select public.transition_task($1, 'revision', 3, $2)", [TASK_ID, "Исправить дефект"]);

    await signIn(EXECUTOR_ID);
    await db.query("select public.transition_task($1, 'in_progress', 4)", [TASK_ID]);
    await db.query("select public.transition_task($1, 'in_review', 5)", [TASK_ID]);

    await signIn(MANAGER_ID);
    await db.query("select public.transition_task($1, 'accepted', 6)", [TASK_ID]);

    const history = await readRows(
      `select from_status, to_status
       from public.task_history
       where task_id = $1
       order by id`,
      [TASK_ID]
    );
    const tasks = await readRows("select status, revision from public.tasks where id = $1", [TASK_ID]);

    expect(history).toHaveLength(7);
    expect(tasks).toEqual([{ status: "accepted", revision: 7 }]);
  });
});
