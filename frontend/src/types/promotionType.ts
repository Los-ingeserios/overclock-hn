import type { PromotionTypePayload } from "../schemas/promotionType.schema";

export type { PromotionTypePayload };

export interface PromotionType extends PromotionTypePayload {
	id_tipo_promocion: number;
}
