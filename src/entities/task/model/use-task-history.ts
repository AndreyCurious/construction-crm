import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { useSession } from "@/entities/session";
import { getApi } from "@/shared/api";
import type { TaskHistoryEntry } from "@/shared/model/crm.types";

export function useTaskHistory(id: string): UseQueryResult<TaskHistoryEntry[]> {
  const { identity } = useSession();

  return useQuery({
    queryKey: ["crm", identity?.id, "history", id],
    queryFn: () => getApi().getTaskHistory(id)
  });
}
