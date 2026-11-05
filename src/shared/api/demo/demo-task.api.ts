import { getTaskActions } from "@/shared/lib/task-workflow";
import type { Task, TaskHistoryEntry, TaskInput, TaskStatus } from "@/shared/model/crm.types";

import type { TaskApi } from "../api.types";
import type { DemoStore } from "./demo.store";

export function createDemoTaskApi(store: DemoStore): TaskApi {
  const {
    state,
    getCurrentProfile,
    getVisibleTasks,
    requireManager,
    getTaskForUpdate,
    validateAssignment,
    recordStatusChange,
    saveState
  } = store;

  return {
    async getTasks(): Promise<Task[]> {
      return structuredClone(getVisibleTasks().toSorted((a, b) => b.created_at.localeCompare(a.created_at)));
    },

    async getTask(id: string): Promise<Task | null> {
      return structuredClone(getVisibleTasks().find(item => item.id === id) ?? null);
    },

    async getTaskHistory(id: string): Promise<TaskHistoryEntry[]> {
      if (!getVisibleTasks().some(task => task.id === id)) {
        return [];
      }

      return structuredClone(state.history.filter(item => item.task_id === id).toReversed());
    },

    async createTask(input: TaskInput): Promise<string> {
      const profile = requireManager();
      validateAssignment(input.object_id, input.assignee_id);
      const now = new Date().toISOString();
      const task: Task = {
        ...input,
        id: crypto.randomUUID(),
        status: "new",
        author_id: profile.id,
        created_at: now,
        updated_at: now,
        deleted_at: null,
        revision: 1
      };
      state.tasks.push(task);
      recordStatusChange(task, null, null);
      saveState();

      return task.id;
    },

    async updateTask(task: Task, input: TaskInput): Promise<void> {
      requireManager();
      validateAssignment(input.object_id, input.assignee_id);
      const current = getTaskForUpdate(task);
      Object.assign(current, input, { revision: current.revision + 1, updated_at: new Date().toISOString() });
      saveState();
    },

    async deleteTask(task: Task): Promise<void> {
      requireManager();
      const current = getTaskForUpdate(task);
      current.deleted_at = new Date().toISOString();
      current.revision += 1;
      saveState();
    },

    async transitionTask(task: Task, status: TaskStatus, comment: string): Promise<void> {
      const current = getTaskForUpdate(task);

      if (!getTaskActions(current, getCurrentProfile()).some(action => action.status === status)) {
        throw new Error("INVALID_TRANSITION");
      }
      if (status === "revision" && !comment.trim()) {
        throw new Error("COMMENT_REQUIRED");
      }
      if (comment.trim().length > 2000) {
        throw new Error("COMMENT_TOO_LONG");
      }

      const previous = current.status;
      current.status = status;
      current.revision += 1;
      current.updated_at = new Date().toISOString();
      recordStatusChange(current, previous, comment.trim() || null);
      saveState();
    }
  };
}
