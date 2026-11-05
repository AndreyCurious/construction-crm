import { Button } from "@mui/material";
import { Plus } from "lucide-react";
import type { FC } from "react";

import { TaskDialog } from "@/features/task-editor";
import { PageHeader } from "@/shared/ui/page-header";
import { ErrorState, LoadingState } from "@/shared/ui/page-state";
import { TaskList } from "@/widgets/task-list";

import { useTasksPage } from "../model/use-tasks-page";

export const TasksPage: FC = () => {
  const page = useTasksPage();
  const title: string = page.isManager ? "Все задачи" : "Мои задачи";
  const description: string = page.isManager
    ? "Назначайте работу, проверяйте результат и следите за статусами"
    : "Назначенные вам задачи по всем объектам";

  if (page.loading) {
    return <LoadingState />;
  }

  if (page.error) {
    return <ErrorState error={page.error} retry={page.retry} />;
  }

  return (
    <>
      {page.refreshError && <ErrorState error={page.refreshError} retry={page.retry} />}
      <PageHeader
        title={title}
        description={description}
        actions={
          page.isManager && (
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              disabled={page.objects.length === 0}
              onClick={page.openEditor}
            >
              Добавить задачу
            </Button>
          )
        }
      />
      <TaskList tasks={page.tasks} objects={page.objects} profiles={page.profiles} />
      {page.creating && <TaskDialog onClose={page.closeEditor} onSaved={page.onTaskSaved} />}
    </>
  );
};
