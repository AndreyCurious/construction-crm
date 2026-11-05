import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { useSession } from "@/entities/session";
import { getApi } from "@/shared/api";
import type { Task } from "@/shared/model/crm.types";

export function useTask(id: string): UseQueryResult<Task | null> {
  const { identity } = useSession();

  return useQuery({
    queryKey: ["crm", identity?.id, "tasks", id],
    queryFn: () => getApi().getTask(id)
  });
}
