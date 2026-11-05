import type { CrmApi } from "../api.types";
import { createDemoAuthApi } from "./demo-auth.api";
import { createDemoObjectApi } from "./demo-object.api";
import { createDemoProfileApi } from "./demo-profile.api";
import { createDemoTaskApi } from "./demo-task.api";
import { createDemoStore } from "./demo.store";

export function createDemoApi(): CrmApi {
  const store = createDemoStore();

  return {
    ...createDemoAuthApi(store),
    ...createDemoProfileApi(store),
    ...createDemoObjectApi(store),
    ...createDemoTaskApi(store)
  };
}
