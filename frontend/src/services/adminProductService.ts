import { api } from "../lib/api";
import type { Brand } from "../types/brand";
import type { Category } from "../types/category";
import type { AdminProduct, ProductPayload } from "../types/products";
import { createCrudService } from "./createCrudService";

const categoryLookupService = createCrudService<Category, never>("/categorias/");
const brandLookupService = createCrudService<Brand, never>("/marcas/");

export const adminProductService = {
	...createCrudService<AdminProduct, ProductPayload>("/productos-admin/"),

	async getById(id: number): Promise<AdminProduct> {
		const { data } = await api.get<AdminProduct>(`/productos/${id}/`);
		return data;
	},

	getAllCategories: categoryLookupService.getAllPages,
	getAllBrands: brandLookupService.getAllPages,
};
