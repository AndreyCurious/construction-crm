import { describe, expect, it } from "vitest";

import {
  EXECUTOR_ID,
  MANAGER_ID,
  SECOND_MANAGER_ID,
  TASK_ID,
  OTHER_EXECUTOR_ID,
  OTHER_OBJECT_ID
} from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { db, signIn, readRows, expectRejected } = setupTestDatabase();

describe("Переназначение задачи", () => {
  it("сохраняет автора и статус при переназначении, закрывает прежний доступ", async () => {
    await signIn(SECOND_MANAGER_ID);
    await db.query("select public.update_task($1, 'Новое название', 'Описание', $2, $3, 1)", [
      TASK_ID,
      OTHER_OBJECT_ID,
      OTHER_EXECUTOR_ID
    ]);

    const updatedTasks = await readRows(
      "select author_id, status, revision from public.tasks where id = $1",
      [TASK_ID]
    );

    expect(updatedTasks).toEqual([{ author_id: MANAGER_ID, status: "new", revision: 2 }]);

    await signIn(EXECUTOR_ID);

    const tasks = await readRows("select * from public.tasks");
    const objects = await readRows("select * from public.construction_objects");
    const history = await readRows("select * from public.task_history");

    expect(tasks).toHaveLength(0);
    expect(objects).toHaveLength(0);
    expect(history).toHaveLength(0);

    await expectRejected("select public.transition_task($1, 'in_progress', 2)", [TASK_ID], "TASK_NOT_FOUND");
  });
});
