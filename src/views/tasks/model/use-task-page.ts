import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useObjects } from "@/entities/object";
import { useProfiles } from "@/entities/profile";
import { useSession } from "@/entities/session";
import { getTaskActions, useTask, useTaskHistory } from "@/entities/task";
import type { Task, TaskAction, TaskStatus } from "@/entities/task";
import { getApi } from "@/shared/api";
import { getQueryState } from "@/shared/lib/get-query-state";
import { useCrmMutation } from "@/shared/lib/use-crm-mutation";

import { getTaskActionHint, getTaskDetails } from "./task-page.helpers";
import type { UseTaskPageResult } from "./task-page.types";

export function useTaskPage(): UseTaskPageResult {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { profile } = useSession();
  const taskQuery = useTask(id);
  const historyQuery = useTaskHistory(id);
  const profilesQuery = useProfiles();
  const objectsQuery = useObjects();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [transition, setTransition] = useState<TaskStatus | null>(null);
  const deletion = useCrmMutation((target: Task) => getApi().deleteTask(target));

  const task = taskQuery.data ?? null;
  const isManager: boolean = profile?.role === "manager";
  const objectName = objectsQuery.data?.find(object => object.id === task?.object_id)?.name ?? "Объект";
  const actions: TaskAction[] = task && profile ? getTaskActions(task, profile) : [];
  const profiles = profilesQuery.data ?? [];

  const details = getTaskDetails(task, profiles);
  const actionHint = getTaskActionHint(task, isManager);

  const retry = (): void => {
    void taskQuery.refetch();
    void historyQuery.refetch();
    void profilesQuery.refetch();
    void objectsQuery.refetch();
  };

  const openEditor = (): void => {
    setEditing(true);
  };

  const closeEditor = (): void => {
    setEditing(false);
  };

  const closeDelete = (): void => {
    setDeleting(null);
  };

  const closeTransition = (): void => {
    setTransition(null);
  };

  const openDelete = (): void => {
    deletion.reset();
    setDeleting(task);
  };

  const confirmDelete = (): void => {
    if (!deleting) {
      return;
    }

    deletion.mutate(deleting, {
      onSuccess: () => {
        void navigate(`/objects/${deleting.object_id}`);
      }
    });
  };

  const openTransition = (status: TaskStatus): void => {
    setTransition(status);
  };

  return {
    task,
    history: historyQuery.data ?? [],
    objectName,
    details,
    actions,
    actionHint,
    isManager,
    ...getQueryState([taskQuery, historyQuery, profilesQuery, objectsQuery]),
    editing,
    deleting: Boolean(deleting),
    deletePending: deletion.isPending,
    deleteError: deletion.error,
    transition,
    retry,
    openEditor,
    closeEditor,
    openDelete,
    closeDelete,
    confirmDelete,
    openTransition,
    closeTransition
  };
}
