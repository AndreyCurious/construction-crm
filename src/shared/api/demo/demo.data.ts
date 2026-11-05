import { DEMO_ACCOUNTS } from "./demo.accounts";
import { DEMO_OBJECTS, DEMO_TASKS } from "./demo.fixtures";
import type { DemoState } from "./demo.schema";

export function createDemoData(): DemoState {
  const manager = DEMO_ACCOUNTS[0];

  const date = (offset: number): string => new Date(Date.now() - offset * 3600000).toISOString();

  const common = { created_at: date(72), updated_at: date(12), deleted_at: null, revision: 1 };
  const profiles = DEMO_ACCOUNTS.map(account => ({
    id: account.id,
    full_name: account.name,
    role: account.role,
    created_at: date(100)
  }));
  const objects = DEMO_OBJECTS.map(object => ({ ...object, created_by: manager.id, ...common }));

  const state: DemoState = { profiles, objects, tasks: [], history: [] };
  DEMO_TASKS.forEach((definition, index) => {
    const object = objects[definition.object];
    const status = definition.statuses.at(-1);

    if (!object || !status) {
      return;
    }

    const id = `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
    state.tasks.push({
      id,
      title: definition.title,
      description: definition.description,
      object_id: object.id,
      assignee_id: definition.assignee,
      author_id: manager.id,
      status,
      ...common,
      revision: definition.statuses.length
    });
    definition.statuses.forEach((next, step) => {
      const actorId =
        next === "new" || next === "accepted" || next === "revision" ? manager.id : definition.assignee;
      const actorName = profiles.find(profile => profile.id === actorId)?.full_name ?? manager.name;
      state.history.push({
        id: state.history.length + 1,
        task_id: id,
        actor_id: actorId,
        actor_name: actorName,
        from_status: definition.statuses[step - 1] ?? null,
        to_status: next,
        comment:
          next === "revision"
            ? "Остались зазоры на примыкании правого откоса. Устраните их и отправьте задачу повторно."
            : null,
        created_at: date(72 - step * 16)
      });
    });
  });

  return state;
}
