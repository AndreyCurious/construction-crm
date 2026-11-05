import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";
import type { FC } from "react";

import { STATUS_LABELS } from "@/entities/task";
import type { Task, TaskStatus } from "@/entities/task";
import { ErrorState } from "@/shared/ui/page-state";

import { useTaskTransition } from "../model/use-task-transition";

import styles from "./transition-dialog.module.css";

type TransitionDialogProps = {
  task: Task;
  status: TaskStatus;
  onClose: () => void;
};

export const TransitionDialog: FC<TransitionDialogProps> = ({ task, status, onClose }) => {
  const transition = useTaskTransition(task, status, onClose);
  const title: string = transition.required ? "Вернуть на доработку" : "Изменить статус задачи";
  const description: string = transition.required
    ? "Опишите, что нужно исправить. Исполнитель увидит комментарий в истории задачи."
    : `«${transition.task.title}» перейдёт в статус «${STATUS_LABELS[status]}».`;
  const helperText: string = transition.invalid ? "Укажите причину возврата" : "До 2000 символов";

  return (
    <Dialog
      open
      onClose={transition.pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="transition-title"
    >
      <form onSubmit={transition.submit} noValidate>
        <DialogTitle id="transition-title">{title}</DialogTitle>
        <DialogContent>
          <div className={styles.content}>
            {transition.error && <ErrorState error={transition.error} />}
            <DialogContentText>{description}</DialogContentText>
            <TextField
              autoFocus
              multiline
              minRows={3}
              label={transition.required ? "Причина возврата" : "Комментарий"}
              required={transition.required}
              value={transition.comment}
              onChange={transition.changeComment}
              error={transition.invalid}
              helperText={helperText}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={transition.pending}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={transition.pending}>
            {transition.pending ? "Сохранение…" : "Подтвердить"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
