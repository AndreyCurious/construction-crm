import type { Task, TaskAction, TaskHistoryEntry, TaskStatus } from "@/entities/task";

export type TaskDetail = {
  label: string;
  value: string;
};

export type UseTaskPageResult = {
  task: Task | null;
  history: TaskHistoryEntry[];
  objectName: string;
  details: TaskDetail[];
  actions: TaskAction[];
  actionHint: string;
  isManager: boolean;
  loading: boolean;
  error: Error | null;
  refreshError: Error | null;
  editing: boolean;
  deleting: boolean;
  deletePending: boolean;
  deleteError: Error | null;
  transition: TaskStatus | null;
  retry: () => void;
  openEditor: () => void;
  closeEditor: () => void;
  openDelete: () => void;
  closeDelete: () => void;
  confirmDelete: () => void;
  openTransition: (status: TaskStatus) => void;
  closeTransition: () => void;
};
