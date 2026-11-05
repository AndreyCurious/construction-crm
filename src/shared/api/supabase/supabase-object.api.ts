import type { ConstructionObject, ObjectInput } from "@/shared/model/crm.types";

import type { ObjectApi } from "../api.types";
import { readAllRows } from "./read-all-rows";
import { requireData, unwrap } from "./supabase.helpers";
import type { CrmSupabaseClient } from "./supabase.types";

export function createSupabaseObjectApi(client: CrmSupabaseClient): ObjectApi {
  return {
    async getObjects(): Promise<ConstructionObject[]> {
      return readAllRows((from, to) =>
        client
          .from("construction_objects")
          .select("*")
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to)
      );
    },

    async getObject(id: string): Promise<ConstructionObject | null> {
      const response = await client.from("construction_objects").select("*").eq("id", id).maybeSingle();

      return unwrap(response);
    },

    async createObject(input: ObjectInput): Promise<string> {
      const response = await client.rpc("create_object", { p_name: input.name, p_address: input.address });

      return requireData(unwrap(response));
    },

    async updateObject(object: ConstructionObject, input: ObjectInput): Promise<void> {
      const response = await client.rpc("update_object", {
        p_id: object.id,
        p_revision: object.revision,
        p_name: input.name,
        p_address: input.address
      });

      unwrap(response);
    },

    async deleteObject(object: ConstructionObject): Promise<void> {
      const response = await client.rpc("delete_object", { p_id: object.id, p_revision: object.revision });

      unwrap(response);
    }
  };
}
