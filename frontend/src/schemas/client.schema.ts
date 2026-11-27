import { z } from "zod";

const MAX_BIRTH_DATE = `${new Date().getFullYear() - 18}-12-31`;

export const clientSchema = z.object({
  dni: z
    .string()
    .length(13, "El DNI debe tener exactamente 13 dígitos numéricos")
    .regex(/^\d+$/, "El DNI solo debe contener números"),

  rtn: z
    .string()
    .optional()
    .transform((val) => val || null)
    .refine(
      (val) => !val || (val.length === 14 && /^\d+$/.test(val)),
      "El RTN debe contener exactamente 14 digitos numericos"
    ),

  primer_nombre: z.string().min(1, "El primer nombre es obligatorio").max(100),
  segundo_nombre: z.string().max(100).optional().transform((val) => val || null),
  primer_apellido: z.string().min(1, "El primer apellido es obligatorio").max(100),
  segundo_apellido: z.string().max(100).optional().transform((val) => val || null),

  fecha_nacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((val) => val <= MAX_BIRTH_DATE, "El cliente debe ser mayor de 18 años"),

  telefono: z.string().min(8, "El telefono debe tener al menos 8 digitos"),
  correo: z.string().email("Ingrese un correo electrónico válido"),
  razon_social: z.string().max(200).optional().transform((val) => val || null),
  estado: z.boolean().default(true),
});

export type ClientFormInput = z.input<typeof clientSchema>;
export type ClientPayload = z.infer<typeof clientSchema>;