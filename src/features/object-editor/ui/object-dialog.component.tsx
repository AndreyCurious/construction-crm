import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { FC } from "react";
import { FormProvider } from "react-hook-form";

import type { ConstructionObject } from "@/entities/object";
import { ErrorState } from "@/shared/ui/page-state";

import { useObjectEditor } from "../model/use-object-editor";
import { ObjectForm } from "./object-form.component";

import styles from "./object-dialog.module.css";

type ObjectDialogProps = {
  object?: ConstructionObject;
  onClose: () => void;
};

export const ObjectDialog: FC<ObjectDialogProps> = ({ object, onClose }) => {
  const { formMethods, pending, error, submit } = useObjectEditor(object, onClose);
  const title: string = object ? "Редактировать объект" : "Новый объект";

  return (
    <Dialog
      open
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="object-editor-title"
    >
      <FormProvider {...formMethods}>
        <form onSubmit={submit} noValidate>
          <DialogTitle id="object-editor-title">{title}</DialogTitle>
          <DialogContent>
            <div className={styles.fields}>
              {error && <ErrorState error={error} />}
              <ObjectForm />
            </div>
          </DialogContent>
          <DialogActions>
            <Button disabled={pending} onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};
