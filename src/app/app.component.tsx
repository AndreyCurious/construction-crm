import type { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { isConfigured } from "@/shared/config/environment";
import { EmptyState } from "@/shared/ui/page-state";
import { LoginPage } from "@/views/login";
import { ObjectPage, ObjectsPage } from "@/views/objects";
import { TaskPage, TasksPage } from "@/views/tasks";
import { AppLayout } from "@/widgets/app-layout";

import { SessionProvider } from "./providers/session.provider";
import { ProtectedRoute } from "./router/protected-route.component";
import { StartPage } from "./router/start-page.component";
import { ConnectionSetup } from "./ui/connection-setup.component";

export const App: FC = () => {
  if (!isConfigured) {
    return <ConnectionSetup />;
  }

  return (
    <SessionProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<StartPage />} />
            <Route path="objects" element={<ObjectsPage />} />
            <Route path="objects/:id" element={<ObjectPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/:id" element={<TaskPage />} />
            <Route
              path="*"
              element={
                <EmptyState
                  title="Страница не найдена"
                  description="Перейдите к объектам или задачам через меню."
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </SessionProvider>
  );
};
