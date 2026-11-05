import { describe, expect, it } from "vitest";

import { EXECUTOR_ID, MANAGER_ID, OBJECT_ID, TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { db, signIn, readRows, expectRejected } = setupTestDatabase();

describe("Удаление объекта и сохранение истории", () => {
  it("сохраняет историю и запрещает удаление непустого объекта", async () => {
    await signIn(MANAGER_ID);
    await expectRejected("select public.delete_object($1, 1)", [OBJECT_ID], "OBJECT_NOT_EMPTY");

    await db.query("select public.delete_task($1, 1)", [TASK_ID]);

    const tasks = await readRows("select * from public.tasks where id = $1", [TASK_ID]);
    const history = await readRows("select * from public.task_history where task_id = $1", [TASK_ID]);

    expect(tasks).toHaveLength(0);
    expect(history).toHaveLength(1);

    await db.query("select public.delete_object($1, 1)", [OBJECT_ID]);

    const objects = await readRows("select * from public.construction_objects where id = $1", [OBJECT_ID]);

    expect(objects).toHaveLength(0);

    await expectRejected(
      "select public.create_task('Задача', '', $1, $2)",
      [OBJECT_ID, EXECUTOR_ID],
      "OBJECT_NOT_FOUND"
    );
    await signIn(EXECUTOR_ID);

    const executorHistory = await readRows("select * from public.task_history");

    expect(executorHistory).toHaveLength(0);
  });
});
