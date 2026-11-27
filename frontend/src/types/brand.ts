import type { BrandPayload } from "../schemas/brand.schema";
import type { PaginatedResponse } from "./catalog";

export type { BrandPayload };

export interface Brand extends BrandPayload {
    id_marca: number;
}

export type PaginatedBrands = PaginatedResponse<Brand>;
