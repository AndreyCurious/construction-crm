import { describe, expect, it } from "vitest";

import { MANAGER_ID, OBJECT_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { db, signIn, expectRejected } = setupTestDatabase();

describe("Конфликты изменений объекта", () => {
  it("возвращает HTTP 409 для устаревшей версии без повторных транзакций", async () => {
    await signIn(MANAGER_ID);

    await expect(
      db.query("select public.update_object($1, 'Изменённый', 'Адрес', 0)", [OBJECT_ID])
    ).rejects.toMatchObject({ code: "PT409", message: "STALE_RECORD" });
  });

  it("отклоняет изменение и удаление объекта с устаревшей версией", async () => {
    await signIn(MANAGER_ID);

    await db.query("select public.update_object($1, 'Изменённый', 'Адрес', 1)", [OBJECT_ID]);

    await expectRejected(
      "select public.update_object($1, 'Потерянная правка', 'Адрес', 1)",
      [OBJECT_ID],
      "STALE_RECORD"
    );

    await expectRejected("select public.delete_object($1, 1)", [OBJECT_ID], "STALE_RECORD");
  });
});
