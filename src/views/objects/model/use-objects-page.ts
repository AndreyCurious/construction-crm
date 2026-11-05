import { useState } from "react";

import { useObjects } from "@/entities/object";
import { useSession } from "@/entities/session";
import { useTasks } from "@/entities/task";
import { getQueryState } from "@/shared/lib/get-query-state";

import { getObjectCards, getObjectStatistics } from "./objects-page.helpers";
import type { UseObjectsPageResult } from "./objects-page.types";

export function useObjectsPage(): UseObjectsPageResult {
  const { profile } = useSession();
  const objectsQuery = useObjects();
  const tasksQuery = useTasks();
  const [editing, setEditing] = useState(false);
  const objects = objectsQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];

  const statistics = getObjectStatistics(objects, tasks);
  const cards = getObjectCards(objects, tasks);

  const retry = (): void => {
    void objectsQuery.refetch();
    void tasksQuery.refetch();
  };

  const openEditor = (): void => {
    setEditing(true);
  };

  const closeEditor = (): void => {
    setEditing(false);
  };

  return {
    cards,
    statistics,
    isManager: profile?.role === "manager",
    ...getQueryState([objectsQuery, tasksQuery]),
    editing,
    retry,
    openEditor,
    closeEditor
  };
}
