import type { PromotionProductPayload, PromotionProductRole } from "../schemas/promotionProduct.schema";

export type { PromotionProductPayload, PromotionProductRole };

export interface PromotionProduct extends PromotionProductPayload {
	id_promocion_producto: number;
}
