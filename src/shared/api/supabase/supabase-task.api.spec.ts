import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import type { Task } from "@/shared/model/crm.types";

import type { Database } from "../database.types";
import { createSupabaseTaskApi } from "./supabase-task.api";

describe("Чтение задач через Supabase API", () => {
  it("получает весь список при серверном лимите в тысячу строк", async () => {
    const rows: Task[] = Array.from({ length: 1205 }, (_, index) => ({
      id: `task-${index.toString()}`,
      title: "Задача",
      description: "",
      object_id: "object-id",
      assignee_id: "executor-id",
      author_id: "manager-id",
      status: "new",
      created_at: "2026-11-05T08:00:00.000Z",
      updated_at: "2026-11-05T08:00:00.000Z",
      deleted_at: null,
      revision: 1
    }));
    const requests: URL[] = [];
    const client = createClient<Database>("https://example.supabase.co", "test-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: async input => {
          const url = new URL(input instanceof Request ? input.url : input);
          const from = Number(url.searchParams.get("offset") ?? 0);
          const limit = Math.min(Number(url.searchParams.get("limit") ?? 1000), 1000);

          requests.push(url);

          return new Response(JSON.stringify(rows.slice(from, from + limit)), {
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    });

    await expect(createSupabaseTaskApi(client).getTasks()).resolves.toEqual(rows);
    expect(requests.every(request => request.searchParams.get("order") === "created_at.desc,id.desc")).toBe(
      true
    );
  });
});
