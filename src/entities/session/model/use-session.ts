import { useContext } from "react";

import { SessionContext } from "./session.context";
import type { SessionState } from "./session.context";

export function useSession(): SessionState {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("SessionProvider is required");
  }

  return session;
}
