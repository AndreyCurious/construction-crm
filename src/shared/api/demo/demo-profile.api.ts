import type { Profile } from "@/shared/model/crm.types";

import type { ProfileApi } from "../api.types";
import type { DemoStore } from "./demo.store";

export function createDemoProfileApi(store: DemoStore): ProfileApi {
  const { state, getCurrentProfile, getVisibleTasks } = store;

  return {
    async getProfile(id: string): Promise<Profile> {
      const profile = getCurrentProfile();

      if (id !== profile.id) {
        throw new Error("FORBIDDEN");
      }

      return structuredClone(profile);
    },

    async getProfiles(): Promise<Profile[]> {
      const profile = getCurrentProfile();
      const tasks = getVisibleTasks();

      return structuredClone(
        state.profiles.filter(
          item =>
            profile.role === "manager" ||
            item.id === profile.id ||
            tasks.some(task => task.author_id === item.id)
        )
      );
    }
  };
}
