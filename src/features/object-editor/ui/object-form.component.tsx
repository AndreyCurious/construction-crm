import { TextField } from "@mui/material";
import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { ObjectInput } from "@/entities/object";

export const ObjectForm: FC = () => {
  const { control } = useFormContext<ObjectInput>();

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Название объекта"
            autoFocus
            required
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { maxLength: 150 } }}
          />
        )}
      />
      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Адрес"
            required
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { maxLength: 300 } }}
          />
        )}
      />
    </>
  );
};
