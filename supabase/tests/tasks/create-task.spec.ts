import { describe, expect, it } from "vitest";

import { EXECUTOR_ID, MANAGER_ID, OBJECT_ID, SECOND_MANAGER_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { signIn, readRows, expectRejected } = setupTestDatabase();

describe("Создание задачи", () => {
  it("записывает автора и начальный статус при создании", async () => {
    await signIn(SECOND_MANAGER_ID);

    const [created] = await readRows<{ id: string }>(
      "select public.create_task('  Задача  ', 'Описание', $1, $2) as id",
      [OBJECT_ID, EXECUTOR_ID]
    );
    const tasks = await readRows("select title, author_id, status from public.tasks where id = $1", [
      created?.id
    ]);
    const history = await readRows(
      `select actor_id, from_status, to_status
       from public.task_history
       where task_id = $1`,
      [created?.id]
    );

    expect(tasks).toEqual([{ title: "Задача", author_id: SECOND_MANAGER_ID, status: "new" }]);
    expect(history).toEqual([{ actor_id: SECOND_MANAGER_ID, from_status: null, to_status: "new" }]);
  });

  it("отклоняет назначение постановщику и пустое название задачи", async () => {
    await signIn(MANAGER_ID);

    await expectRejected(
      "select public.create_task('Задача', '', $1, $2)",
      [OBJECT_ID, MANAGER_ID],
      "INVALID_ASSIGNEE"
    );

    await expectRejected(
      "select public.create_task($1, '', $2, $3)",
      ["\u00a0\n\t", OBJECT_ID, EXECUTOR_ID],
      "check constraint"
    );
  });
});
