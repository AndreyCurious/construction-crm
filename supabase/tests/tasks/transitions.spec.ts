import { describe, expect, it } from "vitest";

import { EXECUTOR_ID, MANAGER_ID, TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";
import { TRANSITION_CASES } from "./transition.fixtures";

const { db, signIn, readRows, expectRejected } = setupTestDatabase();

describe("Разрешённые переходы статусов", () => {
  it.each(TRANSITION_CASES)("$role: $from → $to", async ({ userId, from, to, allowed }) => {
    await db.query("update public.tasks set status = $1 where id = $2", [from, TASK_ID]);
    await signIn(userId);

    if (!allowed) {
      await expectRejected(
        "select public.transition_task($1, $2, 1, $3)",
        [TASK_ID, to, "Комментарий"],
        "INVALID_TRANSITION"
      );

      return;
    }

    await db.query("select public.transition_task($1, $2, 1, $3)", [TASK_ID, to, "Проверить примыкание"]);

    const tasks = await readRows("select status, revision from public.tasks where id = $1", [TASK_ID]);

    expect(tasks).toEqual([{ status: to, revision: 2 }]);
  });

  it.each([null, "", "   ", "\n\t\r", "\u00a0", "\u2003\u202f\u3000", "\ufeff"])(
    "требует непустой комментарий для доработки: %s",
    async comment => {
      await db.query("update public.tasks set status = 'in_review' where id = $1", [TASK_ID]);
      await signIn(MANAGER_ID);

      await expectRejected(
        "select public.transition_task($1, 'revision', 1, $2)",
        [TASK_ID, comment],
        "COMMENT_REQUIRED"
      );

      const tasks = await readRows("select status from public.tasks where id = $1", [TASK_ID]);

      expect(tasks).toEqual([{ status: "in_review" }]);
    }
  );

  it("убирает пробельные символы по краям комментария перед сохранением истории", async () => {
    await db.query("update public.tasks set status = 'in_review' where id = $1", [TASK_ID]);
    await signIn(MANAGER_ID);

    await db.query("select public.transition_task($1, 'revision', 1, $2)", [
      TASK_ID,
      "\n\tИсправить примыкание\u00a0\u2003"
    ]);

    const history = await readRows(
      "select comment from public.task_history where task_id = $1 and to_status = 'revision'",
      [TASK_ID]
    );

    expect(history).toEqual([{ comment: "Исправить примыкание" }]);
  });

  it("отклоняет длинный комментарий и отсутствующий статус", async () => {
    await signIn(EXECUTOR_ID);

    await expectRejected(
      "select public.transition_task($1, 'in_progress', 1, $2)",
      [TASK_ID, "x".repeat(2001)],
      "COMMENT_TOO_LONG"
    );
    await expectRejected("select public.transition_task($1, null, 1)", [TASK_ID], "INVALID_TRANSITION");
  });
});
