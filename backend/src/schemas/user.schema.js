import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),

  bio: z
    .string()
    .max(300, "La bio no puede superar los 300 caracteres")
    .nullable()
    .optional(),

  avatarUrl: z
    .string()
    .url("Debe ser una URL válida")
    .nullable()
    .optional(),
});