import type { TaskStatus, UserRole } from "@/shared/model/crm.types";
import { EXECUTOR_ID, MANAGER_ID, TASK_STATUSES } from "../helpers/database.fixtures";

type TransitionCase = {
  role: UserRole;
  userId: string;
  from: TaskStatus;
  to: TaskStatus;
  allowed: boolean;
};

const ALLOWED_TRANSITIONS: Record<UserRole, Partial<Record<TaskStatus, TaskStatus[]>>> = {
  manager: {
    in_review: ["accepted", "revision"]
  },
  executor: {
    new: ["in_progress"],
    revision: ["in_progress"],
    in_progress: ["in_review"]
  }
};

const USERS: {
  role: UserRole;
  id: string;
}[] = [
  { role: "manager", id: MANAGER_ID },
  { role: "executor", id: EXECUTOR_ID }
];

export const TRANSITION_CASES: TransitionCase[] = USERS.flatMap(user =>
  TASK_STATUSES.flatMap(from =>
    TASK_STATUSES.map(to => ({
      role: user.role,
      userId: user.id,
      from,
      to,
      allowed: ALLOWED_TRANSITIONS[user.role][from]?.includes(to) ?? false
    }))
  )
);
