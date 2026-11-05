import { describe, expect, it } from "vitest";

import { createDemoApi } from "./demo-api";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo.accounts";
import { setupDemoStorage } from "./testing/setup-demo-storage";

const [MANAGER] = DEMO_ACCOUNTS;

setupDemoStorage();

describe("Начальные данные деморежима", () => {
  it("содержит три аккаунта и задачи во всех статусах", async () => {
    const api = createDemoApi();

    await api.signIn({ email: MANAGER.email, password: DEMO_PASSWORD });

    const objects = await api.getObjects();
    const profiles = await api.getProfiles();
    const tasks = await api.getTasks();
    const statuses = new Set(tasks.map(task => task.status));

    expect(objects).toHaveLength(3);
    expect(profiles).toHaveLength(3);
    expect(tasks).toHaveLength(6);
    expect(statuses).toEqual(new Set(["new", "in_progress", "in_review", "revision", "accepted"]));
  });
});
