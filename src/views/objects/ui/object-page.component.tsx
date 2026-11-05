import { Button, Link } from "@mui/material";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { ObjectDialog } from "@/features/object-editor";
import { TaskDialog } from "@/features/task-editor";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/page-state";
import { TaskList } from "@/widgets/task-list";

import { useObjectPage } from "../model/use-object-page";

import styles from "./object-page.module.css";

export const ObjectPage: FC = () => {
  const page = useObjectPage();
  const { object } = page;

  if (page.loading) {
    return <LoadingState />;
  }

  if (page.error) {
    return <ErrorState error={page.error} retry={page.retry} />;
  }

  if (!object) {
    return (
      <EmptyState
        title="Объект недоступен"
        description="Объект удалён или у вас нет доступа к его задачам."
      />
    );
  }

  return (
    <>
      {page.refreshError && <ErrorState error={page.refreshError} retry={page.retry} />}
      <Link
        component={RouterLink}
        to="/objects"
        color="text.secondary"
        underline="hover"
        className={styles.back}
      >
        <ArrowLeft size={16} />
        Все объекты
      </Link>
      <PageHeader
        title={object.name}
        description={object.address}
        actions={
          page.isManager && (
            <div className={styles.actions}>
              <Button variant="outlined" startIcon={<Pencil size={16} />} onClick={page.openEditor}>
                Изменить
              </Button>
              <Button color="error" aria-label="Удалить объект" onClick={page.openDelete}>
                <Trash2 size={18} />
              </Button>
            </div>
          )
        }
      />
      {page.isManager && (
        <div className={styles.toolbar}>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={page.openTaskEditor}>
            Добавить задачу
          </Button>
        </div>
      )}
      <TaskList tasks={page.tasks} objects={[object]} profiles={page.profiles} showObject={false} />
      {page.editing && <ObjectDialog object={object} onClose={page.closeEditor} />}
      {page.creating && (
        <TaskDialog objectId={object.id} onClose={page.closeTaskEditor} onSaved={page.onTaskSaved} />
      )}
      <ConfirmDialog
        open={page.deleting}
        title="Удалить объект?"
        description="Удалить можно только объект без задач. Его запись сохранится в архиве базы."
        pending={page.deletePending}
        error={page.deleteError}
        onClose={page.closeDelete}
        onConfirm={page.confirmDelete}
      />
    </>
  );
};
