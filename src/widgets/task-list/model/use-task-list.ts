import { useState } from "react";

import type { ConstructionObject } from "@/entities/object";
import type { Profile } from "@/entities/profile";
import type { Task } from "@/entities/task";
import { formatDate } from "@/shared/lib/format-date";

import type { TaskFilterChange, TaskListRow } from "./task-list.types";

type UseTaskListResult = {
  rows: TaskListRow[];
  search: string;
  status: string;
  emptyState: {
    title: string;
    description: string;
  };
  changeSearch: TaskFilterChange;
  changeStatus: TaskFilterChange;
};

export function useTaskList(
  tasks: Task[],
  objects: ConstructionObject[],
  profiles: Profile[]
): UseTaskListResult {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const query: string = search.trim().toLocaleLowerCase("ru");
  const objectNames = new Map(objects.map(object => [object.id, object.name]));
  const profileNames = new Map(profiles.map(profile => [profile.id, profile.full_name]));

  const rows: TaskListRow[] = tasks
    .filter(task => status === "all" || task.status === status)
    .filter(task => task.title.toLocaleLowerCase("ru").includes(query))
    .map(task => ({
      id: task.id,
      title: task.title,
      objectName: objectNames.get(task.object_id) ?? "Объект",
      assigneeName: profileNames.get(task.assignee_id) ?? "Исполнитель",
      status: task.status,
      createdAt: formatDate(task.created_at)
    }));

  const changeSearch: TaskFilterChange = event => {
    setSearch(event.target.value);
  };

  const changeStatus: TaskFilterChange = event => {
    setStatus(event.target.value);
  };

  const emptyState =
    tasks.length > 0
      ? { title: "Ничего не найдено", description: "Измените запрос или выберите другой статус." }
      : { title: "Задач пока нет", description: "Новые задачи появятся здесь после назначения." };

  return { rows, search, status, emptyState, changeSearch, changeStatus };
}
