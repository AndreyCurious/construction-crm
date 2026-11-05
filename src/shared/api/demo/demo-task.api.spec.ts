import { describe, expect, it } from "vitest";

import { createDemoApi } from "./demo-api";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo.accounts";
import { setupDemoStorage } from "./testing/setup-demo-storage";

const [, FIRST_EXECUTOR, SECOND_EXECUTOR] = DEMO_ACCOUNTS;

setupDemoStorage();

describe("Доступ к задачам в деморежиме", () => {
  it("показывает исполнителям только назначенные задачи и их объекты", async () => {
    const api = createDemoApi();

    await api.signIn({ email: FIRST_EXECUTOR.email, password: DEMO_PASSWORD });

    const firstTasks = await api.getTasks();
    const firstObjects = await api.getObjects();

    expect(firstTasks).toHaveLength(3);
    expect(firstObjects).toHaveLength(2);

    await api.signOut();
    await api.signIn({ email: SECOND_EXECUTOR.email, password: DEMO_PASSWORD });

    const secondTasks = await api.getTasks();
    const firstTaskIds = new Set(firstTasks.map(task => task.id));
    const hasSharedTasks = secondTasks.some(task => firstTaskIds.has(task.id));
    const otherTask = await api.getTask(firstTasks[0]?.id ?? "");
    const otherHistory = await api.getTaskHistory(firstTasks[0]?.id ?? "");

    expect(secondTasks).toHaveLength(3);
    expect(hasSharedTasks).toBe(false);
    expect(otherTask).toBeNull();
    expect(otherHistory).toEqual([]);
  });
});
