import type { FC, PropsWithChildren } from "react";

import { SessionContext, useSessionState } from "@/entities/session";

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const session = useSessionState();

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};
