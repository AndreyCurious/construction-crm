import { Paper, useMediaQuery } from "@mui/material";
import type { FC } from "react";

import { EmptyState } from "@/shared/ui/page-state";

import type { TaskListProps } from "../model/task-list.types";
import { useTaskList } from "../model/use-task-list";
import { TaskCards } from "./task-cards.component";
import { TaskFilters } from "./task-filters.component";
import { TaskTable } from "./task-table.component";

import styles from "./task-list.module.css";

export const TaskList: FC<TaskListProps> = ({ tasks, objects, profiles, showObject = true }) => {
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const { rows, search, status, emptyState, changeSearch, changeStatus } = useTaskList(
    tasks,
    objects,
    profiles
  );

  return (
    <Paper variant="outlined" className={styles.container}>
      <TaskFilters
        search={search}
        status={status}
        count={rows.length}
        onSearchChange={changeSearch}
        onStatusChange={changeStatus}
      />
      {rows.length === 0 ? (
        <EmptyState title={emptyState.title} description={emptyState.description} />
      ) : isDesktop ? (
        <TaskTable rows={rows} showObject={showObject} />
      ) : (
        <TaskCards rows={rows} showObject={showObject} />
      )}
    </Paper>
  );
};
