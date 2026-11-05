import { Button, Link, Typography } from "@mui/material";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { StatusChip } from "@/entities/task";
import { TaskDialog } from "@/features/task-editor";
import { TransitionDialog } from "@/features/task-transition";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/page-state";
import { TaskHistory } from "@/widgets/task-history";

import { useTaskPage } from "../model/use-task-page";
import { TaskDetails } from "./task-details.component";

import styles from "./task-page.module.css";

export const TaskPage: FC = () => {
  const page = useTaskPage();
  const { task } = page;

  if (page.loading) {
    return <LoadingState />;
  }

  if (page.error) {
    return <ErrorState error={page.error} retry={page.retry} />;
  }

  if (!task) {
    return (
      <EmptyState
        title="Задача недоступна"
        description="Задача удалена, назначена другому исполнителю или у вас нет доступа."
      />
    );
  }

  return (
    <>
      {page.refreshError && <ErrorState error={page.refreshError} retry={page.retry} />}
      <Link
        component={RouterLink}
        to={`/objects/${task.object_id}`}
        color="text.secondary"
        underline="hover"
        className={styles.back}
      >
        <ArrowLeft size={16} />
        {page.objectName}
      </Link>
      <div className={styles.header}>
        <div>
          <div className={styles.status}>
            <Typography variant="caption" color="text.secondary">
              ЗАДАЧА · {task.id.slice(-6).toUpperCase()}
            </Typography>
            <StatusChip status={task.status} />
          </div>
          <Typography variant="h4" component="h1" className={styles.title}>
            {task.title}
          </Typography>
        </div>
        {page.isManager && (
          <div className={styles.actions}>
            <Button variant="outlined" startIcon={<Pencil size={16} />} onClick={page.openEditor}>
              Изменить
            </Button>
            <Button color="error" aria-label="Удалить задачу" onClick={page.openDelete}>
              <Trash2 size={18} />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <TaskDetails
          task={task}
          objectName={page.objectName}
          details={page.details}
          actions={page.actions}
          actionHint={page.actionHint}
          onTransition={page.openTransition}
        />
        <TaskHistory entries={page.history} />
      </div>
      {page.editing && <TaskDialog task={task} onClose={page.closeEditor} onSaved={page.closeEditor} />}
      {page.transition && (
        <TransitionDialog task={task} status={page.transition} onClose={page.closeTransition} />
      )}
      <ConfirmDialog
        open={page.deleting}
        title="Удалить задачу?"
        description="Задача исчезнет из рабочих списков. История изменений сохранится в базе."
        pending={page.deletePending}
        error={page.deleteError}
        onClose={page.closeDelete}
        onConfirm={page.confirmDelete}
      />
    </>
  );
};
