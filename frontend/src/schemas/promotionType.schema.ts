import { z } from "zod";

export const promotionTypeSchema = z.object({
	nombre: z
		.string()
		.trim()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede superar los 100 caracteres"),
	descripcion: z
		.string()
		.trim()
		.max(500, "La descripción no puede superar los 500 caracteres")
		.nullable()
		.optional()
		.transform((val) => val || null),
});

export type PromotionTypeFormInput = z.input<typeof promotionTypeSchema>;
export type PromotionTypePayload = z.output<typeof promotionTypeSchema>;
