import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import type { FC } from "react";

import { ErrorState } from "@/shared/ui/page-state";

import styles from "./confirm-dialog.module.css";

type ConfirmDialogProps = {
  title: string;
  description: string;
  open: boolean;
  pending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  description,
  open,
  pending,
  error,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-title"
    >
      <DialogTitle id="confirm-title">{title}</DialogTitle>
      <DialogContent>
        <div className={styles.content}>
          <DialogContentText>{description}</DialogContentText>
          {Boolean(error) && <ErrorState error={error} />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>
          Отмена
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={pending}>
          {pending ? "Удаление…" : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
