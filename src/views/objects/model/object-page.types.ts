import type { ConstructionObject } from "@/entities/object";
import type { Profile } from "@/entities/profile";
import type { Task } from "@/entities/task";

export type UseObjectPageResult = {
  object: ConstructionObject | null;
  tasks: Task[];
  profiles: Profile[];
  isManager: boolean;
  loading: boolean;
  error: Error | null;
  refreshError: Error | null;
  editing: boolean;
  creating: boolean;
  deleting: boolean;
  deletePending: boolean;
  deleteError: Error | null;
  retry: () => void;
  openEditor: () => void;
  closeEditor: () => void;
  openTaskEditor: () => void;
  closeTaskEditor: () => void;
  openDelete: () => void;
  closeDelete: () => void;
  confirmDelete: () => void;
  onTaskSaved: (taskId: string) => void;
};
