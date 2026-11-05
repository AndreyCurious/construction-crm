import type { Profile, Task, TaskStatus } from "@/shared/model/crm.types";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  in_review: "На проверке",
  accepted: "Принята",
  revision: "На доработке"
};

export type TaskAction = {
  status: TaskStatus;
  label: string;
};

export function getTaskActions(task: Task, profile: Profile): TaskAction[] {
  if (task.deleted_at) {
    return [];
  }
  if (profile.role === "manager") {
    return task.status === "in_review"
      ? [
          { status: "accepted", label: "Принять задачу" },
          { status: "revision", label: "На доработку" }
        ]
      : [];
  }
  if (profile.id !== task.assignee_id) {
    return [];
  }
  if (task.status === "new" || task.status === "revision") {
    return [
      { status: "in_progress", label: task.status === "revision" ? "Вернуться к работе" : "Взять в работу" }
    ];
  }

  return task.status === "in_progress" ? [{ status: "in_review", label: "Отправить на проверку" }] : [];
}
