import { describe, expect, it, vi } from "vitest";

import { createDemoApi } from "./demo-api";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo.accounts";
import { setupDemoStorage } from "./testing/setup-demo-storage";

const [MANAGER, FIRST_EXECUTOR] = DEMO_ACCOUNTS;

setupDemoStorage();

describe("Авторизация в деморежиме", () => {
  it("не разрешает вход с произвольным паролем", async () => {
    const api = createDemoApi();

    await expect(api.signIn({ email: MANAGER.email, password: "wrong" })).rejects.toThrow(
      "Invalid login credentials"
    );

    const identity = await api.getIdentity();

    expect(identity).toBeNull();

    await expect(api.getTasks()).rejects.toThrow("FORBIDDEN");
  });

  it("восстанавливает сессию и отключает подписчика после отписки", async () => {
    const api = createDemoApi();
    const listener = vi.fn();
    const unsubscribe = api.subscribe(listener);

    const identity = await api.signIn({ email: MANAGER.email, password: DEMO_PASSWORD });
    const restored = createDemoApi();
    const restoredIdentity = await restored.getIdentity();

    expect(restoredIdentity).toEqual(identity);
    expect(listener).toHaveBeenLastCalledWith(identity);

    await api.signOut();

    const signedOutIdentity = await api.getIdentity();

    expect(signedOutIdentity).toBeNull();
    expect(listener).toHaveBeenLastCalledWith(null);

    unsubscribe();

    await api.signIn({ email: FIRST_EXECUTOR.email, password: DEMO_PASSWORD });

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
