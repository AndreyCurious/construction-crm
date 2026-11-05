import { MenuItem, TextField } from "@mui/material";
import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { ConstructionObject } from "@/entities/object";
import type { Profile } from "@/entities/profile";
import type { TaskInput } from "@/entities/task";

type TaskFormProps = {
  objects: ConstructionObject[];
  executors: Profile[];
};

export const TaskForm: FC<TaskFormProps> = ({ objects, executors }) => {
  const { control } = useFormContext<TaskInput>();

  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Название задачи"
            autoFocus
            required
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { maxLength: 200 } }}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Описание"
            multiline
            minRows={4}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { maxLength: 5000 } }}
          />
        )}
      />
      <Controller
        name="object_id"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            required
            label="Объект"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          >
            {objects.map(object => (
              <MenuItem key={object.id} value={object.id}>
                {object.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="assignee_id"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            required
            label="Исполнитель"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          >
            {executors.map(profile => (
              <MenuItem key={profile.id} value={profile.id}>
                {profile.full_name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </>
  );
};
