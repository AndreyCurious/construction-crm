import type { ConstructionObject } from "@/entities/object";
import type { Profile } from "@/entities/profile";
import type { Task } from "@/entities/task";

export type UseTasksPageResult = {
  objects: ConstructionObject[];
  tasks: Task[];
  profiles: Profile[];
  isManager: boolean;
  loading: boolean;
  error: Error | null;
  refreshError: Error | null;
  creating: boolean;
  retry: () => void;
  openEditor: () => void;
  closeEditor: () => void;
  onTaskSaved: (taskId: string) => void;
};
