import { isConfigured, isDemo } from "@/shared/config/environment";

import type { CrmApi } from "./api.types";

async function createApi(): Promise<CrmApi | null> {
  if (isDemo) {
    const { createDemoApi } = await import("./demo/demo-api");

    return createDemoApi();
  }

  if (isConfigured) {
    const { createSupabaseApi } = await import("./supabase/supabase-api");

    return createSupabaseApi();
  }

  return null;
}

const api = await createApi();

export function getApi(): CrmApi {
  if (!api) {
    throw new Error("Приложение не настроено");
  }

  return api;
}
