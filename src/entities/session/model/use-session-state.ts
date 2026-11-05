import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { getApi } from "@/shared/api";
import { getQueryState } from "@/shared/lib/get-query-state";
import type { Identity } from "@/shared/model/crm.types";

import type { SessionState } from "./session.context";

export function useSessionState(): SessionState {
  const queryClient = useQueryClient();
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    let authEventReceived = false;
    let currentUserId: string | undefined;

    const updateIdentity = (next: Identity | null): void => {
      if (!active) {
        return;
      }

      if (currentUserId !== next?.id) {
        queryClient.clear();
      }

      currentUserId = next?.id;
      setIdentity(next);
      setError(null);
      setReady(true);
    };

    const unsubscribe = getApi().subscribe(next => {
      authEventReceived = true;
      updateIdentity(next);
    });
    void getApi()
      .getIdentity()
      .then(next => {
        if (active && !authEventReceived) {
          updateIdentity(next);
        }
      })
      .catch((cause: unknown) => {
        if (active && !authEventReceived) {
          setError(cause instanceof Error ? cause : new Error("Ошибка сессии"));
          setReady(true);
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [queryClient]);

  const profile = useQuery({
    queryKey: ["profile", identity?.id],
    queryFn: () => getApi().getProfile(identity?.id ?? ""),
    enabled: Boolean(identity),
    retry: false
  });
  const profileState = getQueryState([profile]);

  const retryProfile = (): void => {
    void profile.refetch();
  };

  return {
    identity,
    profile: profile.data ?? null,
    loading: !ready || (Boolean(identity) && profileState.loading),
    error: error ?? profileState.error,
    refreshError: profileState.refreshError,
    retryProfile
  };
}
