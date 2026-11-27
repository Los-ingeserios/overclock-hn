import { api } from "../lib/api";
import type { AdminProduct, BrandOption, CategoryOption, ProductPayload } from "../types/products";
import { createCrudService } from "./createCrudService";

const categoryLookupService = createCrudService<CategoryOption, never>("/categorias/");
const brandLookupService = createCrudService<BrandOption, never>("/marcas/");

export const adminProductService = {
	...createCrudService<AdminProduct, ProductPayload>("/productos-admin/"),

	async getById(id: number): Promise<AdminProduct> {
		const { data } = await api.get<AdminProduct>(`/productos/${id}/`);
		return data;
	},

	getAllCategories: categoryLookupService.getAllPages,
	getAllBrands: brandLookupService.getAllPages,
};
