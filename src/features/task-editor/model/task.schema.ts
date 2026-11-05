import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Введите название").max(200, "Не более 200 символов"),
  description: z.string().trim().max(5000, "Не более 5000 символов"),
  object_id: z.string().min(1, "Выберите объект"),
  assignee_id: z.string().min(1, "Выберите исполнителя")
});
