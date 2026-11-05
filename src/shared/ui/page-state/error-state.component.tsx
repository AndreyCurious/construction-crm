import { Alert, Button } from "@mui/material";
import type { FC } from "react";

import { getErrorMessage } from "@/shared/lib/errors";

type ErrorStateProps = {
  error: unknown;
  retry?: () => void;
};

export const ErrorState: FC<ErrorStateProps> = ({ error, retry }) => (
  <Alert
    severity="error"
    action={
      retry && (
        <Button color="inherit" onClick={retry}>
          Повторить
        </Button>
      )
    }
  >
    {getErrorMessage(error)}
  </Alert>
);
