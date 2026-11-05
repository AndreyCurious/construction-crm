import type { Task, TaskHistoryEntry, TaskInput, TaskStatus } from "@/shared/model/crm.types";

import type { TaskApi } from "../api.types";
import { readAllRows } from "./read-all-rows";
import { requireData, unwrap } from "./supabase.helpers";
import type { CrmSupabaseClient } from "./supabase.types";

export function createSupabaseTaskApi(client: CrmSupabaseClient): TaskApi {
  return {
    async getTasks(): Promise<Task[]> {
      return readAllRows((from, to) =>
        client
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to)
      );
    },

    async getTask(id: string): Promise<Task | null> {
      const response = await client.from("tasks").select("*").eq("id", id).maybeSingle();

      return unwrap(response);
    },

    async getTaskHistory(id: string): Promise<TaskHistoryEntry[]> {
      return readAllRows((from, to) =>
        client
          .from("task_history")
          .select("*")
          .eq("task_id", id)
          .order("id", { ascending: false })
          .range(from, to)
      );
    },

    async createTask(input: TaskInput): Promise<string> {
      const response = await client.rpc("create_task", {
        p_title: input.title,
        p_description: input.description,
        p_object_id: input.object_id,
        p_assignee_id: input.assignee_id
      });

      return requireData(unwrap(response));
    },

    async updateTask(task: Task, input: TaskInput): Promise<void> {
      const response = await client.rpc("update_task", {
        p_id: task.id,
        p_revision: task.revision,
        p_title: input.title,
        p_description: input.description,
        p_object_id: input.object_id,
        p_assignee_id: input.assignee_id
      });

      unwrap(response);
    },

    async deleteTask(task: Task): Promise<void> {
      const response = await client.rpc("delete_task", { p_id: task.id, p_revision: task.revision });

      unwrap(response);
    },

    async transitionTask(task: Task, status: TaskStatus, comment: string): Promise<void> {
      const response = await client.rpc("transition_task", {
        p_id: task.id,
        p_revision: task.revision,
        p_status: status,
        p_comment: comment
      });

      unwrap(response);
    }
  };
}
