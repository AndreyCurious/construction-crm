import type {
  ConstructionObject,
  Profile,
  Task,
  TaskHistoryEntry,
  TaskStatus,
  UserRole
} from "../model/crm.types";

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};
type Rpc<Args, Returns = undefined> = {
  Args: Args;
  Returns: Returns;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      construction_objects: Table<ConstructionObject>;
      tasks: Table<Task>;
      task_history: Table<TaskHistoryEntry>;
    };
    Views: Record<string, never>;
    Enums: {
      user_role: UserRole;
      task_status: TaskStatus;
    };
    CompositeTypes: Record<string, never>;
    Functions: {
      create_object: Rpc<
        {
          p_name: string;
          p_address: string;
        },
        string
      >;
      update_object: Rpc<{
        p_id: string;
        p_name: string;
        p_address: string;
        p_revision: number;
      }>;
      delete_object: Rpc<{
        p_id: string;
        p_revision: number;
      }>;
      create_task: Rpc<
        {
          p_title: string;
          p_description: string;
          p_object_id: string;
          p_assignee_id: string;
        },
        string
      >;
      update_task: Rpc<{
        p_id: string;
        p_title: string;
        p_description: string;
        p_object_id: string;
        p_assignee_id: string;
        p_revision: number;
      }>;
      delete_task: Rpc<{
        p_id: string;
        p_revision: number;
      }>;
      transition_task: Rpc<{
        p_id: string;
        p_status: TaskStatus;
        p_revision: number;
        p_comment?: string;
      }>;
    };
  };
};
