import { describe, it } from "vitest";

import { MANAGER_ID } from "../helpers/database.fixtures";
import { setupTestDatabase } from "../helpers/setup-test-database";

const { signIn, expectRejected } = setupTestDatabase();

describe("Создание объекта", () => {
  it.each(["", "   ", "\n\t\r", "\u00a0\u2003"])("отклоняет пустые название и адрес: %s", async value => {
    await signIn(MANAGER_ID);

    await expectRejected("select public.create_object($1, 'Адрес')", [value], "check constraint");
    await expectRejected("select public.create_object('Объект', $1)", [value], "check constraint");
  });
});
