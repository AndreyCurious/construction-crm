import { PGlite } from "@electric-sql/pglite";
import { afterAll, afterEach, beforeAll, beforeEach, expect } from "vitest";

import { prepareDatabase } from "./prepare-database";

type DatabaseRole = "anon" | "authenticated";

type DatabaseTestContext = {
  db: PGlite;
  signIn: (userId: string | null, role?: DatabaseRole) => Promise<void>;
  readRows: <Row = Record<string, unknown>>(sql: string, parameters?: unknown[]) => Promise<Row[]>;
  expectRejected: (sql: string, parameters?: unknown[], message?: string) => Promise<void>;
};

export function setupTestDatabase(): DatabaseTestContext {
  const db = new PGlite();

  beforeAll(async () => {
    await prepareDatabase(db);
  });

  beforeEach(async () => {
    await db.exec("begin");
  });

  afterEach(async () => {
    await db.exec("rollback");
  });

  afterAll(async () => {
    await db.close();
  });

  async function signIn(userId: string | null, role: DatabaseRole = "authenticated"): Promise<void> {
    await db.exec(`set local role ${role}`);
    await db.query("select set_config('request.jwt.claim.sub', $1, true)", [userId ?? ""]);
  }

  async function readRows<Row = Record<string, unknown>>(
    sql: string,
    parameters: unknown[] = []
  ): Promise<Row[]> {
    const result = await db.query<Row>(sql, parameters);

    return result.rows;
  }

  async function expectRejected(sql: string, parameters: unknown[] = [], message?: string): Promise<void> {
    await db.exec("savepoint rejected_operation");
    await expect(db.query(sql, parameters)).rejects.toThrow(message);
    await db.exec("rollback to savepoint rejected_operation");
  }

  return { db, signIn, readRows, expectRejected };
}
