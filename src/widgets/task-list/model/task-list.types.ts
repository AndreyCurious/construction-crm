import type { ChangeEvent } from "react";

import type { ConstructionObject } from "@/entities/object";
import type { Profile } from "@/entities/profile";
import type { Task, TaskStatus } from "@/entities/task";

export type TaskListProps = {
  tasks: Task[];
  objects: ConstructionObject[];
  profiles: Profile[];
  showObject?: boolean;
};

export type TaskListRow = {
  id: string;
  title: string;
  objectName: string;
  assigneeName: string;
  status: TaskStatus;
  createdAt: string;
};

export type TaskFilterChange = (event: ChangeEvent<HTMLInputElement>) => void;

export type TaskFiltersProps = {
  search: string;
  status: string;
  count: number;
  onSearchChange: TaskFilterChange;
  onStatusChange: TaskFilterChange;
};
