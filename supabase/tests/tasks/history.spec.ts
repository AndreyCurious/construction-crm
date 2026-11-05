import { describe, expect, it } from "vitest";

import { EXECUTOR_ID, TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

type HistoryRow = {
  actor_id: string;
  from_status: string;
  to_status: string;
  comment: string;
  created_at: Date;
};

const { db, signIn, readRows, expectRejected } = setupTestDatabase();

describe("История задачи", () => {
  it("сохраняет автора, переход, время и комментарий одной транзакцией", async () => {
    await signIn(EXECUTOR_ID);
    await db.query("select public.transition_task($1, 'in_progress', 1, $2)", [TASK_ID, "  Проверяю  "]);

    const [entry] = await readRows<HistoryRow>(
      `select actor_id, from_status, to_status, comment, created_at
       from public.task_history
       where task_id = $1
       order by id desc
       limit 1`,
      [TASK_ID]
    );

    expect(entry).toMatchObject({
      actor_id: EXECUTOR_ID,
      from_status: "new",
      to_status: "in_progress",
      comment: "Проверяю"
    });
    expect(entry?.created_at).toBeTruthy();

    await expectRejected("select public.transition_task($1, 'in_review', 1)", [TASK_ID], "STALE_RECORD");

    const history = await readRows("select id from public.task_history where task_id = $1", [TASK_ID]);

    expect(history).toHaveLength(2);
  });

  it("запрещает редактирование истории триггером", async () => {
    await expectRejected("update public.task_history set comment = 'Подмена'", [], "HISTORY_IMMUTABLE");
    await expectRejected("delete from public.task_history", [], "HISTORY_IMMUTABLE");
  });
});
