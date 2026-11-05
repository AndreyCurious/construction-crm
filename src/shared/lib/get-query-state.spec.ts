import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { getQueryState } from "./get-query-state";

async function failedQuery(data?: unknown) {
  const client = new QueryClient();
  const error = new Error("Failed to fetch");
  const queryKey = ["test-query"];

  if (data !== undefined) {
    client.setQueryData(queryKey, data);
  }

  const observer = new QueryObserver(client, {
    queryKey,
    queryFn: () => Promise.reject(error),
    retry: false
  });
  const result = await observer.refetch();

  client.clear();

  return { result, error };
}

describe("Ошибки загрузки и обновления данных", () => {
  it("блокирует первичную загрузку без данных", async () => {
    const { result, error } = await failedQuery();

    expect(getQueryState([result])).toEqual({ loading: false, error, refreshError: null });
  });

  it.each([{ id: "task" }, [], null])("сохраняет ранее загруженные данные: %j", async data => {
    const { result, error } = await failedQuery(data);

    expect(result.data).toEqual(data);
    expect(getQueryState([result])).toEqual({ loading: false, error: null, refreshError: error });
  });

  it("не скрывает отсутствие данных одного запроса за кэшем другого", async () => {
    const existing = await failedQuery([{ id: "object" }]);
    const missing = await failedQuery();

    expect(getQueryState([existing.result, missing.result])).toEqual({
      loading: false,
      error: missing.error,
      refreshError: existing.error
    });
  });
});
