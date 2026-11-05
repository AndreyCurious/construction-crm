import type { ConstructionObject, ObjectInput } from "@/shared/model/crm.types";

import type { ObjectApi } from "../api.types";
import type { DemoStore } from "./demo.store";

export function createDemoObjectApi(store: DemoStore): ObjectApi {
  const { state, getVisibleObjects, getVisibleTasks, requireManager, getObjectForUpdate, saveState } = store;

  return {
    async getObjects(): Promise<ConstructionObject[]> {
      return structuredClone(getVisibleObjects());
    },

    async getObject(id: string): Promise<ConstructionObject | null> {
      return structuredClone(getVisibleObjects().find(item => item.id === id) ?? null);
    },

    async createObject(input: ObjectInput): Promise<string> {
      const profile = requireManager();
      const now = new Date().toISOString();
      const object = {
        ...input,
        id: crypto.randomUUID(),
        created_by: profile.id,
        created_at: now,
        updated_at: now,
        deleted_at: null,
        revision: 1
      };
      state.objects.push(object);
      saveState();

      return object.id;
    },

    async updateObject(object: ConstructionObject, input: ObjectInput): Promise<void> {
      const current = getObjectForUpdate(object);
      Object.assign(current, input, { revision: current.revision + 1, updated_at: new Date().toISOString() });
      saveState();
    },

    async deleteObject(object: ConstructionObject): Promise<void> {
      const current = getObjectForUpdate(object);

      if (getVisibleTasks().some(task => task.object_id === object.id)) {
        throw new Error("OBJECT_NOT_EMPTY");
      }

      current.deleted_at = new Date().toISOString();
      current.revision += 1;
      saveState();
    }
  };
}
