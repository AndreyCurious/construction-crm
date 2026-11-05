import { createContext } from "react";

import type { Identity, Profile } from "@/shared/model/crm.types";

export type SessionState = {
  identity: Identity | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refreshError: Error | null;
  retryProfile: () => void;
};

export const SessionContext = createContext<SessionState | null>(null);
