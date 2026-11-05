import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useSession } from "@/entities/session";
import { getApi } from "@/shared/api";

type UseAppLayoutResult = {
  isManager: boolean;
  role: string;
  fullName: string;
  initials: string;
  email: string;
  section: string;
  signingOut: boolean;
  error: unknown;
  signOut: () => void;
  clearError: () => void;
};

export function useAppLayout(): UseAppLayoutResult {
  const { profile, identity } = useSession();
  const location = useLocation();
  const [error, setError] = useState<unknown>(null);
  const [signingOut, setSigningOut] = useState(false);
  const isManager: boolean = profile?.role === "manager";
  const fullName: string = profile?.full_name ?? "";
  const initials: string = fullName
    .split(" ")
    .map(part => part[0])
    .slice(0, 2)
    .join("");

  const clearError = (): void => {
    setError(null);
  };

  const signOut = (): void => {
    setSigningOut(true);
    void getApi()
      .signOut()
      .catch(setError)
      .finally(() => {
        setSigningOut(false);
      });
  };

  return {
    isManager,
    role: isManager ? "Постановщик" : "Исполнитель",
    fullName,
    initials,
    email: identity?.email ?? "",
    section: location.pathname.startsWith("/objects") ? "Объекты" : "Задачи",
    signingOut,
    error,
    signOut,
    clearError
  };
}
