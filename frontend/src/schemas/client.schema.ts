import { z } from "zod";

export const MAX_BIRTH_DATE = `${new Date().getFullYear() - 18}-12-31`;

export const clientSchema = z.object({
	dni: z
		.string()
		.trim()
		.length(13, "El DNI debe tener exactamente 13 dígitos numéricos")
		.regex(/^\d+$/, "El DNI solo debe contener números"),
	rtn: z
		.string()
		.trim()
		.optional()
		.transform((val) => val || null)
		.refine(
			(val) => !val || (val.length === 14 && /^\d+$/.test(val)),
			"El RTN debe contener exactamente 14 dígitos numéricos",
		),
	primer_nombre: z.string().trim().min(1, "El primer nombre es obligatorio").max(100),
	segundo_nombre: z
		.string()
		.trim()
		.max(100)
		.optional()
		.transform((val) => val || null),
	primer_apellido: z.string().trim().min(1, "El primer apellido es obligatorio").max(100),
	segundo_apellido: z
		.string()
		.trim()
		.max(100)
		.optional()
		.transform((val) => val || null),
	fecha_nacimiento: z
		.string()
		.min(1, "La fecha de nacimiento es obligatoria")
		.refine((val) => val <= MAX_BIRTH_DATE, "El cliente debe ser mayor de 18 años"),
	telefono: z
		.string()
		.trim()
		.min(8, "El teléfono debe tener al menos 8 dígitos")
		.max(20, "El teléfono no puede superar los 20 caracteres"),
	correo: z
		.email("Ingrese un correo electrónico válido")
		.refine((val) => val.length <= 100, "El correo no puede superar los 100 caracteres"),
	razon_social: z
		.string()
		.trim()
		.max(50, "La razón social no puede superar los 50 caracteres")
		.optional()
		.transform((val) => val || null),
	estado: z.boolean(),
});

export type ClientFormInput = z.input<typeof clientSchema>;
export type ClientPayload = z.output<typeof clientSchema>;
