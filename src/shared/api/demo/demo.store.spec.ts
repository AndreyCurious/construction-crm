import { describe, expect, it } from "vitest";

import { createDemoApi } from "./demo-api";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo.accounts";
import { setupDemoStorage } from "./testing/setup-demo-storage";

const [MANAGER] = DEMO_ACCOUNTS;

setupDemoStorage();

describe("Восстановление демохранилища", () => {
  it("восстанавливает демоданные при повреждённом локальном хранилище", async () => {
    localStorage.setItem("construction-crm-demo-v1", "{broken");

    const api = createDemoApi();

    await api.signIn({ email: MANAGER.email, password: DEMO_PASSWORD });

    const objects = await api.getObjects();
    const tasks = await api.getTasks();

    expect(objects).toHaveLength(3);
    expect(tasks).toHaveLength(6);
  });
});
