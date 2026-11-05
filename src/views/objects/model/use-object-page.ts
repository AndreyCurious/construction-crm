import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useObject } from "@/entities/object";
import type { ConstructionObject } from "@/entities/object";
import { useProfiles } from "@/entities/profile";
import { useSession } from "@/entities/session";
import { useTasks } from "@/entities/task";
import { getApi } from "@/shared/api";
import { getQueryState } from "@/shared/lib/get-query-state";
import { useCrmMutation } from "@/shared/lib/use-crm-mutation";

import type { UseObjectPageResult } from "./object-page.types";

export function useObjectPage(): UseObjectPageResult {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { profile } = useSession();
  const objectQuery = useObject(id);
  const tasksQuery = useTasks();
  const profilesQuery = useProfiles();
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ConstructionObject | null>(null);
  const deletion = useCrmMutation((target: ConstructionObject) => getApi().deleteObject(target));

  const retry = (): void => {
    void objectQuery.refetch();
    void tasksQuery.refetch();
    void profilesQuery.refetch();
  };

  const openEditor = (): void => {
    setEditing(true);
  };

  const closeEditor = (): void => {
    setEditing(false);
  };

  const openTaskEditor = (): void => {
    setCreating(true);
  };

  const closeTaskEditor = (): void => {
    setCreating(false);
  };

  const closeDelete = (): void => {
    setDeleting(null);
  };

  const openDelete = (): void => {
    deletion.reset();
    setDeleting(objectQuery.data ?? null);
  };

  const confirmDelete = (): void => {
    if (!deleting) {
      return;
    }

    deletion.mutate(deleting, {
      onSuccess: () => {
        void navigate("/objects");
      }
    });
  };

  const onTaskSaved = (taskId: string): void => {
    setCreating(false);
    void navigate(`/tasks/${taskId}`);
  };

  return {
    object: objectQuery.data ?? null,
    tasks: tasksQuery.data?.filter(task => task.object_id === id) ?? [],
    profiles: profilesQuery.data ?? [],
    isManager: profile?.role === "manager",
    ...getQueryState([objectQuery, tasksQuery, profilesQuery]),
    editing,
    creating,
    deleting: Boolean(deleting),
    deletePending: deletion.isPending,
    deleteError: deletion.error,
    retry,
    openEditor,
    closeEditor,
    openTaskEditor,
    closeTaskEditor,
    openDelete,
    closeDelete,
    confirmDelete,
    onTaskSaved
  };
}
