import type { Profile } from "@/entities/profile";
import type { Task } from "@/entities/task";
import { formatDate } from "@/shared/lib/format-date";

import type { TaskDetail } from "./task-page.types";

export function getTaskDetails(task: Task | null, profiles: Profile[]): TaskDetail[] {
  if (!task) {
    return [];
  }

  const assignee = profiles.find(profile => profile.id === task.assignee_id);
  const author = profiles.find(profile => profile.id === task.author_id);

  return [
    { label: "Исполнитель", value: assignee?.full_name ?? "Исполнитель" },
    { label: "Постановщик", value: author?.full_name ?? "Постановщик" },
    { label: "Создана", value: formatDate(task.created_at) }
  ];
}

export function getTaskActionHint(task: Task | null, isManager: boolean): string {
  if (task?.status === "accepted") {
    return "Задача принята. Работа завершена.";
  }

  return isManager ? "Следующее действие — за исполнителем." : "Задача ожидает проверки постановщиком.";
}
