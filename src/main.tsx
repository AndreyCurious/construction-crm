import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "@/app/app.component";
import { ErrorBoundary } from "@/app/providers/error-boundary.component";
import { theme } from "@/app/theme";

import "@/app/styles/variables.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 15000, retry: 1, refetchOnWindowFocus: true },
    mutations: { retry: false }
  }
});
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element is missing");
}

createRoot(container).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
