import { createCrudService } from "./createCrudService";
import type { Promotion, PromotionPayload } from "../types/promotion";
import type { PromotionType } from "../types/promotionType";

const promotionTypeLookupService = createCrudService<PromotionType, never>("/tipo-promociones/");

export const promotionService = {
	...createCrudService<Promotion, PromotionPayload>("/promociones/"),
	getAllPromotionTypes: promotionTypeLookupService.getAllPages,
};
