import { createCrudService } from "./createCrudService";
import type { PromotionType, PromotionTypePayload } from "../types/promotionType";

export const promotionTypeService = createCrudService<PromotionType, PromotionTypePayload>("/tipo-promociones/");
