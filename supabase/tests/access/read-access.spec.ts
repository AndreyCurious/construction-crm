import { describe, expect, it } from "vitest";

import {
  EXECUTOR_ID,
  MANAGER_ID,
  OBJECT_ID,
  OTHER_TASK_ID,
  SECOND_MANAGER_ID,
  TASK_ID
} from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { signIn, readRows, expectRejected } = setupTestDatabase();

describe("Чтение данных и RLS", () => {
  it("скрывает чужие задачи, объекты, историю и профили исполнителей", async () => {
    await signIn(EXECUTOR_ID);

    const tasks = await readRows("select id from public.tasks");
    const objects = await readRows("select id from public.construction_objects");
    const history = await readRows("select distinct task_id from public.task_history");
    const profiles = await readRows("select id from public.profiles order by id");
    const otherTask = await readRows("select id from public.tasks where id = $1", [OTHER_TASK_ID]);

    expect(tasks).toEqual([{ id: TASK_ID }]);
    expect(objects).toEqual([{ id: OBJECT_ID }]);
    expect(history).toEqual([{ task_id: TASK_ID }]);
    expect(profiles).toEqual([{ id: MANAGER_ID }, { id: EXECUTOR_ID }]);
    expect(otherTask).toEqual([]);
  });

  it.each([MANAGER_ID, SECOND_MANAGER_ID])("показывает все данные каждому постановщику: %s", async id => {
    await signIn(id);

    const tasks = await readRows("select id from public.tasks");
    const objects = await readRows("select id from public.construction_objects");

    expect(tasks).toHaveLength(2);
    expect(objects).toHaveLength(3);
  });

  it("запрещает исполнителю менять чужую задачу", async () => {
    await signIn(EXECUTOR_ID);

    await expectRejected(
      "select public.transition_task($1, 'in_progress', 1)",
      [OTHER_TASK_ID],
      "TASK_NOT_FOUND"
    );
  });
});
