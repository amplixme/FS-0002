import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string({
      required_error: "El título es obligatorio",
    })
    .min(3, "El título debe tener al menos 3 caracteres"),

  content: z
    .string({
      required_error: "El contenido es obligatorio",
    })
    .min(10, "El contenido debe tener al menos 10 caracteres"),
});