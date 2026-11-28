import { z } from "zod";

export const PROMOTION_PRODUCT_ROLES = ["Requerido", "Beneficio", "Ambos"] as const;
export type PromotionProductRole = (typeof PROMOTION_PRODUCT_ROLES)[number];

export const promotionProductSchema = z.object({
	id_promocion: z
		.string()
		.min(1, "Debes seleccionar una promoción")
		.refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Promoción inválida")
		.transform(Number),
	id_producto: z
		.string()
		.min(1, "Debes seleccionar un producto")
		.refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Producto inválido")
		.transform(Number),
	rol_producto: z.enum(PROMOTION_PRODUCT_ROLES),
});

export type PromotionProductFormInput = z.input<typeof promotionProductSchema>;
export type PromotionProductPayload = z.output<typeof promotionProductSchema>;
