import type {
  ConstructionObject,
  Identity,
  ObjectInput,
  Profile,
  SignInInput,
  Task,
  TaskHistoryEntry,
  TaskInput,
  TaskStatus
} from "@/shared/model/crm.types";

export type AuthListener = (identity: Identity | null) => void;

export interface AuthApi {
  getIdentity(): Promise<Identity | null>;
  subscribe(listener: AuthListener): () => void;
  signIn(input: SignInInput): Promise<Identity>;
  signOut(): Promise<void>;
}

export interface ProfileApi {
  getProfile(id: string): Promise<Profile>;
  getProfiles(): Promise<Profile[]>;
}

export interface ObjectApi {
  getObjects(): Promise<ConstructionObject[]>;
  getObject(id: string): Promise<ConstructionObject | null>;
  createObject(input: ObjectInput): Promise<string>;
  updateObject(object: ConstructionObject, input: ObjectInput): Promise<void>;
  deleteObject(object: ConstructionObject): Promise<void>;
}

export interface TaskApi {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  getTaskHistory(id: string): Promise<TaskHistoryEntry[]>;
  createTask(input: TaskInput): Promise<string>;
  updateTask(task: Task, input: TaskInput): Promise<void>;
  deleteTask(task: Task): Promise<void>;
  transitionTask(task: Task, status: TaskStatus, comment: string): Promise<void>;
}

export interface CrmApi extends AuthApi, ProfileApi, ObjectApi, TaskApi {}
