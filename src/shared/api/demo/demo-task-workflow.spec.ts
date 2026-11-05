import { describe, expect, it } from "vitest";

import { createDemoApi } from "./demo-api";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo.accounts";
import { setupDemoStorage } from "./testing/setup-demo-storage";

const [MANAGER, FIRST_EXECUTOR] = DEMO_ACCOUNTS;

setupDemoStorage();

describe("Полный цикл задачи в деморежиме", () => {
  it("сохраняет полный цикл задачи и отклоняет устаревшие изменения", async () => {
    const api = createDemoApi();

    await api.signIn({ email: MANAGER.email, password: DEMO_PASSWORD });

    const objectId = await api.createObject({ name: "Тестовый объект", address: "Тестовый адрес" });
    const taskId = await api.createTask({
      title: "Тестовая задача",
      description: "Описание",
      object_id: objectId,
      assignee_id: FIRST_EXECUTOR.id
    });

    await api.signOut();
    await api.signIn({ email: FIRST_EXECUTOR.email, password: DEMO_PASSWORD });

    const initial = await api.getTask(taskId);

    if (!initial) {
      throw new Error("Задача не создана");
    }

    await api.transitionTask(initial, "in_progress", "Начал работу");
    await expect(api.transitionTask(initial, "in_progress", "")).rejects.toThrow("STALE_RECORD");

    const inProgress = await api.getTask(taskId);

    if (!inProgress) {
      throw new Error("Задача не найдена");
    }

    await api.transitionTask(inProgress, "in_review", "Готово");
    await api.signOut();
    await api.signIn({ email: MANAGER.email, password: DEMO_PASSWORD });

    const inReview = await api.getTask(taskId);

    if (!inReview) {
      throw new Error("Задача не найдена");
    }

    await expect(api.transitionTask(inReview, "revision", "   ")).rejects.toThrow("COMMENT_REQUIRED");
    await api.transitionTask(inReview, "accepted", "Принято");

    const restored = createDemoApi();
    const restoredTask = await restored.getTask(taskId);
    const restoredHistory = await restored.getTaskHistory(taskId);
    const restoredObject = await restored.getObject(objectId);

    expect(restoredTask?.status).toBe("accepted");
    expect(restoredHistory).toHaveLength(4);

    if (!restoredObject) {
      throw new Error("Объект не найден");
    }

    await expect(restored.deleteObject(restoredObject)).rejects.toThrow("OBJECT_NOT_EMPTY");
  });
});
