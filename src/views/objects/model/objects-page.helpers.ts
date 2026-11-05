import type { ConstructionObject } from "@/entities/object";
import type { Task } from "@/entities/task";

import type { ObjectCardData, ObjectStatistic } from "./objects-page.types";

export function getObjectStatistics(objects: ConstructionObject[], tasks: Task[]): ObjectStatistic[] {
  return [
    { label: "Объектов", value: objects.length },
    { label: "Открытых задач", value: tasks.filter(task => task.status !== "accepted").length },
    { label: "Ожидают проверки", value: tasks.filter(task => task.status === "in_review").length }
  ];
}

export function getObjectCards(objects: ConstructionObject[], tasks: Task[]): ObjectCardData[] {
  const tasksByObject = new Map<string, Task[]>();

  for (const task of tasks) {
    const assignedTasks = tasksByObject.get(task.object_id) ?? [];

    assignedTasks.push(task);
    tasksByObject.set(task.object_id, assignedTasks);
  }

  return objects.map(object => {
    const assignedTasks = tasksByObject.get(object.id) ?? [];
    const taskCount = assignedTasks.length;
    const acceptedCount = assignedTasks.filter(task => task.status === "accepted").length;
    const reviewCount = assignedTasks.filter(task => task.status === "in_review").length;
    const progress = taskCount > 0 ? (acceptedCount / taskCount) * 100 : 0;

    return { object, taskCount, acceptedCount, reviewCount, progress };
  });
}
