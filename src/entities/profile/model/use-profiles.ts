import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { useSession } from "@/entities/session";
import { getApi } from "@/shared/api";
import type { Profile } from "@/shared/model/crm.types";

export function useProfiles(): UseQueryResult<Profile[]> {
  const { identity } = useSession();

  return useQuery({
    queryKey: ["crm", identity?.id, "profiles"],
    queryFn: () => getApi().getProfiles()
  });
}
