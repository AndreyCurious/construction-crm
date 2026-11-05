import type { FC } from "react";
import { Navigate } from "react-router-dom";

import { useSession } from "@/entities/session";

export const StartPage: FC = () => {
  const { profile } = useSession();
  const destination: string = profile?.role === "executor" ? "/tasks" : "/objects";

  return <Navigate to={destination} replace />;
};
