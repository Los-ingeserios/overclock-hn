import { z } from "zod";

export const addressSchema = z.object({
  id_ciudad: z
    .string()
    .min(1, "Debes seleccionar una ciudad")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Ciudad inválida")
    .transform(Number),

  calle: z
    .string()
    .trim()
    .min(1, "La calle o colonia es obligatoria")
    .max(100, "La calle no puede superar los 100 caracteres"),

  referencias: z
    .string()
    .trim()
    .max(200, "Las referencias no pueden superar los 200 caracteres")
    .optional()
    .transform((val) => val || null),
});

export type AddressFormInput = z.input<typeof addressSchema>;
export type AddressPayload = z.output<typeof addressSchema>;