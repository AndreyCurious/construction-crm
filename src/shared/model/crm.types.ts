export type UserRole = "manager" | "executor";
export type TaskStatus = "new" | "in_progress" | "in_review" | "accepted" | "revision";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
};

export type ConstructionObject = {
  id: string;
  name: string;
  address: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  revision: number;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  object_id: string;
  assignee_id: string;
  status: TaskStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  revision: number;
};

export type TaskHistoryEntry = {
  id: number;
  task_id: string;
  actor_id: string;
  actor_name: string;
  from_status: TaskStatus | null;
  to_status: TaskStatus;
  comment: string | null;
  created_at: string;
};

export type ObjectInput = {
  name: string;
  address: string;
};
export type TaskInput = Pick<Task, "title" | "description" | "object_id" | "assignee_id">;
export type Identity = {
  id: string;
  email: string;
};
export type SignInInput = {
  email: string;
  password: string;
};
