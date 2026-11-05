import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useObjects } from "@/entities/object";
import { useProfiles } from "@/entities/profile";
import { useSession } from "@/entities/session";
import { useTasks } from "@/entities/task";
import { getQueryState } from "@/shared/lib/get-query-state";

import type { UseTasksPageResult } from "./tasks-page.types";

export function useTasksPage(): UseTasksPageResult {
  const navigate = useNavigate();
  const { profile } = useSession();
  const objectsQuery = useObjects();
  const tasksQuery = useTasks();
  const profilesQuery = useProfiles();
  const [creating, setCreating] = useState(false);

  const retry = (): void => {
    void objectsQuery.refetch();
    void tasksQuery.refetch();
    void profilesQuery.refetch();
  };

  const openEditor = (): void => {
    setCreating(true);
  };

  const closeEditor = (): void => {
    setCreating(false);
  };

  const onTaskSaved = (id: string): void => {
    setCreating(false);
    void navigate(`/tasks/${id}`);
  };

  return {
    objects: objectsQuery.data ?? [],
    tasks: tasksQuery.data ?? [],
    profiles: profilesQuery.data ?? [],
    isManager: profile?.role === "manager",
    ...getQueryState([objectsQuery, tasksQuery, profilesQuery]),
    creating,
    retry,
    openEditor,
    closeEditor,
    onTaskSaved
  };
}
