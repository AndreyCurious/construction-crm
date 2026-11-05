import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { FC } from "react";
import { FormProvider } from "react-hook-form";

import type { Task } from "@/entities/task";
import { ErrorState, LoadingState } from "@/shared/ui/page-state";

import { useTaskEditor } from "../model/use-task-editor";
import { TaskForm } from "./task-form.component";

import styles from "./task-dialog.module.css";

type TaskDialogProps = {
  task?: Task;
  objectId?: string;
  onClose: () => void;
  onSaved: (id: string) => void;
};

export const TaskDialog: FC<TaskDialogProps> = ({ task, objectId, onClose, onSaved }) => {
  const editor = useTaskEditor({ task, objectId, onSuccess: onSaved });
  const title: string = task ? "Редактировать задачу" : "Новая задача";

  return (
    <Dialog
      open
      onClose={editor.pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="task-editor-title"
    >
      <FormProvider {...editor.formMethods}>
        <form onSubmit={editor.submit} noValidate>
          <DialogTitle id="task-editor-title">{title}</DialogTitle>
          <DialogContent>
            <div className={styles.fields}>
              {editor.saveError && <ErrorState error={editor.saveError} />}
              {editor.loading && <LoadingState />}
              {editor.loadError && <ErrorState error={editor.loadError} retry={editor.retry} />}
              {editor.refreshError && <ErrorState error={editor.refreshError} retry={editor.retry} />}
              {!editor.loading && !editor.loadError && (
                <>
                  {editor.executors.length === 0 && (
                    <Alert severity="warning">
                      Нет исполнителей. Добавьте пользователя перед созданием задачи.
                    </Alert>
                  )}
                  <TaskForm objects={editor.objects} executors={editor.executors} />
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={editor.pending}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={!editor.canSubmit}>
              {editor.pending ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};
