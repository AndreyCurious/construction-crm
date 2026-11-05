import type { Profile } from "@/shared/model/crm.types";

import type { ProfileApi } from "../api.types";
import { readAllRows } from "./read-all-rows";
import { requireData, unwrap } from "./supabase.helpers";
import type { CrmSupabaseClient } from "./supabase.types";

export function createSupabaseProfileApi(client: CrmSupabaseClient): ProfileApi {
  return {
    async getProfile(id: string): Promise<Profile> {
      const response = await client.from("profiles").select("*").eq("id", id).single();

      return requireData(unwrap(response));
    },

    async getProfiles(): Promise<Profile[]> {
      return readAllRows((from, to) =>
        client.from("profiles").select("*").order("full_name").order("id").range(from, to)
      );
    }
  };
}
