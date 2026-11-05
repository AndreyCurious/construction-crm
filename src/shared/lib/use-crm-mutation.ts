import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";

export function useCrmMutation<Input, Output>(
  mutationFn: (input: Input) => Promise<Output>
): UseMutationResult<Output, Error, Input> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["crm"] })
  });
}
