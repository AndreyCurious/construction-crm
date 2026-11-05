import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { useSession } from "@/entities/session";
import { getApi } from "@/shared/api";
import type { ConstructionObject } from "@/shared/model/crm.types";

export function useObjects(): UseQueryResult<ConstructionObject[]> {
  const { identity } = useSession();

  return useQuery({
    queryKey: ["crm", identity?.id, "objects"],
    queryFn: () => getApi().getObjects()
  });
}
