import type { BrandPayload } from "../schemas/brand.schema";

export type { BrandPayload };

export interface Brand extends BrandPayload {
	id_marca: number;
}
