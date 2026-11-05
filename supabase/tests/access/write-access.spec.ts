import { describe, it } from "vitest";

import { EXECUTOR_ID, MANAGER_ID, OBJECT_ID, OTHER_TASK_ID, TASK_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { signIn, expectRejected } = setupTestDatabase();

describe("Прямая запись и права исполнителя", () => {
  it.each([MANAGER_ID, EXECUTOR_ID])("запрещает прямую запись в таблицы: %s", async id => {
    await signIn(id);

    await expectRejected(
      "update public.tasks set status = 'accepted' where id = $1",
      [TASK_ID],
      "permission denied"
    );
    await expectRejected(
      "update public.tasks set assignee_id = $1 where id = $2",
      [EXECUTOR_ID, OTHER_TASK_ID],
      "permission denied"
    );
    await expectRejected("delete from public.tasks where id = $1", [TASK_ID], "permission denied");
    await expectRejected(
      `insert into public.tasks (title, object_id, assignee_id, author_id)
       values ('Fake', $1, $2, $3)`,
      [OBJECT_ID, EXECUTOR_ID, MANAGER_ID],
      "permission denied"
    );
    await expectRejected(
      "update public.profiles set role = 'manager' where id = $1",
      [EXECUTOR_ID],
      "permission denied"
    );
    await expectRejected(
      `insert into public.task_history (task_id, actor_id, actor_name, to_status)
       values ($1, $2, 'Fake', 'accepted')`,
      [TASK_ID, MANAGER_ID],
      "permission denied"
    );
    await expectRejected("update public.task_history set comment = 'Fake'", [], "permission denied");
    await expectRejected("delete from public.task_history", [], "permission denied");
    await expectRejected("truncate public.task_history", [], "permission denied");
  });

  it("запрещает исполнителю управление через RPC", async () => {
    await signIn(EXECUTOR_ID);

    await expectRejected("select public.create_object('Название', 'Адрес')", [], "FORBIDDEN");
    await expectRejected("select public.update_object($1, 'Название', 'Адрес', 1)", [OBJECT_ID], "FORBIDDEN");
    await expectRejected("select public.delete_object($1, 1)", [OBJECT_ID], "FORBIDDEN");
    await expectRejected(
      "select public.create_task('Название', '', $1, $2)",
      [OBJECT_ID, EXECUTOR_ID],
      "FORBIDDEN"
    );
    await expectRejected(
      "select public.update_task($1, 'Название', '', $2, $3, 1)",
      [TASK_ID, OBJECT_ID, EXECUTOR_ID],
      "FORBIDDEN"
    );
    await expectRejected("select public.delete_task($1, 1)", [TASK_ID], "FORBIDDEN");
  });
});
