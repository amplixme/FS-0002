import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es obligatorio",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres"),

  email: z
    .string({
      required_error: "El email es obligatorio",
    })
    .email("Debe ser un correo electrónico válido"),

  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});
