import type { PromotionPayload } from "../schemas/promotion.schema";

export type { PromotionPayload };

export interface Promotion extends Omit<PromotionPayload, "porcentaje_descuento"> {
	id_promocion: number;
	porcentaje_descuento: string | number;
}
