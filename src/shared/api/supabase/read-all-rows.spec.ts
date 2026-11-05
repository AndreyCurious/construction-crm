import { describe, expect, it, vi } from "vitest";

import { readAllRows } from "./read-all-rows";

describe("Постраничное чтение Supabase", () => {
  it("возвращает больше тысячи строк без пропусков и повторов", async () => {
    const rows = Array.from({ length: 1257 }, (_, id) => ({ id }));
    const fetchPage = vi.fn(async (from: number, to: number) => ({
      data: rows.slice(from, to + 1),
      error: null
    }));

    await expect(readAllRows(fetchPage)).resolves.toEqual(rows);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  it("завершает чтение на пустой или неполной странице", async () => {
    for (const length of [0, 17, 500]) {
      const rows = Array.from({ length }, (_, id) => ({ id }));
      const fetchPage = vi.fn(async (from: number, to: number) => ({
        data: rows.slice(from, to + 1),
        error: null
      }));

      await expect(readAllRows(fetchPage)).resolves.toEqual(rows);
      expect(fetchPage).toHaveBeenCalledTimes(length === 500 ? 2 : 1);
    }
  });

  it("отклоняет весь запрос при ошибке следующей страницы", async () => {
    const rows = Array.from({ length: 1200 }, (_, id) => ({ id }));
    const fetchPage = vi.fn(async (from: number, to: number) =>
      from === 0
        ? { data: rows.slice(from, to + 1), error: null }
        : { data: null, error: { message: "Нет соединения с сервером" } }
    );

    await expect(readAllRows(fetchPage)).rejects.toThrow("Нет соединения с сервером");
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });
});
