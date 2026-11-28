import { createCrudService } from "./createCrudService";
import type { Promotion } from "../types/promotion";
import type { PromotionProduct, PromotionProductPayload } from "../types/promotionProduct";
import type { PromotionType } from "../types/promotionType";
import type { ProductOption } from "../types/products";

const promotionLookupService = createCrudService<Promotion, never>("/promociones/");
const promotionTypeLookupService = createCrudService<PromotionType, never>("/tipo-promociones/");
const productLookupService = createCrudService<ProductOption, never>("/productos-admin/");

export const promotionProductService = {
	...createCrudService<PromotionProduct, PromotionProductPayload>("/promociones-productos/"),
	getAllPromotions: promotionLookupService.getAllPages,
	getAllPromotionTypes: promotionTypeLookupService.getAllPages,
	getAllProducts: productLookupService.getAllPages,
};
