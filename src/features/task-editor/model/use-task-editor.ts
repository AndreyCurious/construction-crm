import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { useObjects } from "@/entities/object";
import type { ConstructionObject } from "@/entities/object";
import { useProfiles } from "@/entities/profile";
import type { Profile } from "@/entities/profile";
import type { Task, TaskInput } from "@/entities/task";
import { getApi } from "@/shared/api";
import { getQueryState } from "@/shared/lib/get-query-state";
import { useCrmMutation } from "@/shared/lib/use-crm-mutation";

import { taskSchema } from "./task.schema";

type UseTaskEditorOptions = {
  task?: Task;
  objectId?: string;
  onSuccess: (id: string) => void;
};

type UseTaskEditorResult = {
  formMethods: UseFormReturn<TaskInput>;
  objects: ConstructionObject[];
  executors: Profile[];
  loading: boolean;
  loadError: Error | null;
  refreshError: Error | null;
  saveError: Error | null;
  pending: boolean;
  canSubmit: boolean;
  retry: () => void;
  submit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export function useTaskEditor({
  task: initialTask,
  objectId,
  onSuccess
}: UseTaskEditorOptions): UseTaskEditorResult {
  const [task] = useState(initialTask);
  const objectsQuery = useObjects();
  const profilesQuery = useProfiles();
  const queryState = getQueryState([objectsQuery, profilesQuery]);
  const executors: Profile[] = profilesQuery.data?.filter(profile => profile.role === "executor") ?? [];

  const formMethods = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      object_id: task?.object_id ?? objectId ?? "",
      assignee_id: task?.assignee_id ?? ""
    }
  });

  const mutation = useCrmMutation(async (input: TaskInput): Promise<string> => {
    if (task) {
      await getApi().updateTask(task, input);

      return task.id;
    }

    return getApi().createTask(input);
  });

  const retry = (): void => {
    void objectsQuery.refetch();
    void profilesQuery.refetch();
  };

  const onSubmit = (input: TaskInput): void => {
    mutation.mutate(input, { onSuccess });
  };

  const submit = (event: SubmitEvent<HTMLFormElement>): void => {
    void formMethods.handleSubmit(onSubmit)(event);
  };

  return {
    formMethods,
    objects: objectsQuery.data ?? [],
    executors,
    loading: queryState.loading,
    loadError: queryState.error,
    refreshError: queryState.refreshError,
    saveError: mutation.error,
    pending: mutation.isPending,
    canSubmit: !queryState.loading && !queryState.error && executors.length > 0 && !mutation.isPending,
    retry,
    submit
  };
}
