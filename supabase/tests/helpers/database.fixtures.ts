export const MANAGER_ID = "10000000-0000-4000-8000-000000000001";
export const EXECUTOR_ID = "10000000-0000-4000-8000-000000000002";
export const OTHER_EXECUTOR_ID = "10000000-0000-4000-8000-000000000003";
export const SECOND_MANAGER_ID = "10000000-0000-4000-8000-000000000004";
export const OBJECT_ID = "20000000-0000-4000-8000-000000000001";
export const OTHER_OBJECT_ID = "20000000-0000-4000-8000-000000000002";
const EMPTY_OBJECT_ID = "20000000-0000-4000-8000-000000000003";
export const TASK_ID = "30000000-0000-4000-8000-000000000001";
export const OTHER_TASK_ID = "30000000-0000-4000-8000-000000000002";

export const TASK_STATUSES = ["new", "in_progress", "in_review", "accepted", "revision"] as const;

export const TEST_USERS = [
  { id: MANAGER_ID, email: "manager@test.local", role: "manager" },
  { id: EXECUTOR_ID, email: "executor@test.local", role: "executor" },
  { id: OTHER_EXECUTOR_ID, email: "other@test.local", role: "executor" },
  { id: SECOND_MANAGER_ID, email: "manager2@test.local", role: "manager" }
];

export const TEST_OBJECTS = [
  { id: OBJECT_ID, name: "Первый объект", address: "Адрес 1" },
  { id: OTHER_OBJECT_ID, name: "Второй объект", address: "Адрес 2" },
  { id: EMPTY_OBJECT_ID, name: "Пустой объект", address: "Адрес 3" }
];

export const TEST_TASKS = [
  { id: TASK_ID, title: "Своя задача", objectId: OBJECT_ID, assigneeId: EXECUTOR_ID },
  { id: OTHER_TASK_ID, title: "Чужая задача", objectId: OTHER_OBJECT_ID, assigneeId: OTHER_EXECUTOR_ID }
];
