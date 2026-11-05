import { afterEach, beforeEach, vi } from "vitest";

import { MemoryStorage } from "./memory-storage";

export function setupDemoStorage(): void {
  beforeEach(() => {
    vi.stubGlobal("localStorage", new MemoryStorage());
    vi.stubGlobal("sessionStorage", new MemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
}
