import { createClient } from "@supabase/supabase-js";

import { supabaseKey, supabaseUrl } from "@/shared/config/environment";

import type { CrmApi } from "../api.types";
import type { Database } from "../database.types";
import { createSupabaseAuthApi } from "./supabase-auth.api";
import { createSupabaseObjectApi } from "./supabase-object.api";
import { createSupabaseProfileApi } from "./supabase-profile.api";
import { createSupabaseTaskApi } from "./supabase-task.api";

export function createSupabaseApi(): CrmApi {
  const client = createClient<Database>(supabaseUrl, supabaseKey);

  return {
    ...createSupabaseAuthApi(client),
    ...createSupabaseProfileApi(client),
    ...createSupabaseObjectApi(client),
    ...createSupabaseTaskApi(client)
  };
}
