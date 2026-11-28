import type { ProductOption } from "../types/products";
import type { Specification, SpecificationPayload } from "../types/specification";
import { createCrudService } from "./createCrudService";

const productLookupService = createCrudService<ProductOption, never>("/productos-admin/");

export const specificationService = {
	...createCrudService<Specification, SpecificationPayload>("/especificaciones/"),
	getAllProducts: productLookupService.getAllPages,
};
