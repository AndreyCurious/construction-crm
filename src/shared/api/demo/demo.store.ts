import type { ConstructionObject, Identity, Profile, Task, TaskStatus } from "@/shared/model/crm.types";

import type { AuthListener } from "../api.types";
import { DEMO_ACCOUNTS } from "./demo.accounts";
import { createDemoData } from "./demo.data";
import { demoStateSchema } from "./demo.schema";
import type { DemoState } from "./demo.schema";

const STORAGE_KEY = "construction-crm-demo-v1";
const SESSION_KEY = "construction-crm-demo-session";

export type DemoStore = {
  state: DemoState;
  readonly identity: Identity | null;
  setIdentity: (value: Identity | null) => void;
  subscribe: (listener: AuthListener) => () => void;
  getCurrentProfile: () => Profile;
  requireManager: () => Profile;
  getVisibleTasks: () => Task[];
  getVisibleObjects: () => ConstructionObject[];
  getTaskForUpdate: (task: Task) => Task;
  getObjectForUpdate: (object: ConstructionObject) => ConstructionObject;
  validateAssignment: (objectId: string, assigneeId: string) => void;
  recordStatusChange: (task: Task, from: TaskStatus | null, comment: string | null) => void;
  saveState: () => void;
};

function loadDemoState(): DemoState {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createDemoData();
  }

  try {
    return demoStateSchema.parse(JSON.parse(stored));
  } catch {
    return createDemoData();
  }
}

export function createDemoStore(): DemoStore {
  const state = loadDemoState();

  const account = DEMO_ACCOUNTS.find(item => item.id === sessionStorage.getItem(SESSION_KEY));

  let identity: Identity | null = account ? { id: account.id, email: account.email } : null;

  const listeners = new Set<(value: Identity | null) => void>();

  function getCurrentProfile(): Profile {
    const profile = state.profiles.find(item => item.id === identity?.id);

    if (!profile) {
      throw new Error("FORBIDDEN");
    }

    return profile;
  }

  function requireManager(): Profile {
    const profile = getCurrentProfile();

    if (profile.role !== "manager") {
      throw new Error("FORBIDDEN");
    }

    return profile;
  }

  function getVisibleTasks(): Task[] {
    const profile = getCurrentProfile();

    return state.tasks.filter(
      task => !task.deleted_at && (profile.role === "manager" || task.assignee_id === profile.id)
    );
  }

  function getVisibleObjects(): ConstructionObject[] {
    const profile = getCurrentProfile();
    const objectIds = new Set(getVisibleTasks().map(task => task.object_id));

    return state.objects.filter(
      object => !object.deleted_at && (profile.role === "manager" || objectIds.has(object.id))
    );
  }

  function getTaskForUpdate(task: Task): Task {
    const current = getVisibleTasks().find(item => item.id === task.id);

    if (!current) {
      throw new Error("TASK_NOT_FOUND");
    }
    if (current.revision !== task.revision) {
      throw new Error("STALE_RECORD");
    }

    return current;
  }

  function getObjectForUpdate(object: ConstructionObject): ConstructionObject {
    requireManager();
    const current = getVisibleObjects().find(item => item.id === object.id);

    if (!current || current.revision !== object.revision) {
      throw new Error("STALE_RECORD");
    }

    return current;
  }

  function validateAssignment(objectId: string, assigneeId: string): void {
    if (!getVisibleObjects().some(object => object.id === objectId)) {
      throw new Error("OBJECT_NOT_FOUND");
    }
    if (!state.profiles.some(profile => profile.id === assigneeId && profile.role === "executor")) {
      throw new Error("INVALID_ASSIGNEE");
    }
  }

  function saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function recordStatusChange(task: Task, from: TaskStatus | null, comment: string | null): void {
    const profile = getCurrentProfile();
    state.history.push({
      id: state.history.length + 1,
      task_id: task.id,
      actor_id: profile.id,
      actor_name: profile.full_name,
      from_status: from,
      to_status: task.status,
      comment,
      created_at: new Date().toISOString()
    });
  }

  function setIdentity(value: Identity | null): void {
    identity = value;

    if (value) {
      sessionStorage.setItem(SESSION_KEY, value.id);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }

    listeners.forEach(listener => {
      listener(value);
    });
  }

  function subscribe(listener: AuthListener): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    state,
    get identity(): Identity | null {
      return identity;
    },
    setIdentity,
    subscribe,
    getCurrentProfile,
    requireManager,
    getVisibleTasks,
    getVisibleObjects,
    getTaskForUpdate,
    getObjectForUpdate,
    validateAssignment,
    recordStatusChange,
    saveState
  };
}
