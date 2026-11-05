import { z } from "zod";

export const objectSchema = z.object({
  name: z.string().trim().min(1, "Введите название").max(150, "Не более 150 символов"),
  address: z.string().trim().min(1, "Введите адрес").max(300, "Не более 300 символов")
});
