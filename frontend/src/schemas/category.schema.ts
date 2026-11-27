import z from "zod";

export const categorySchema = z.object({
	nombre: z
		.string()
		.trim()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede superar los 100 caracteres"),
	descripcion: z
		.string()
		.trim()
		.max(500, "La descripcion no puede superar los 500 caracteres")
		.nullable()
		.optional()
		.transform((val) => val ?? ""),
});

export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryPayload = z.output<typeof categorySchema>;
