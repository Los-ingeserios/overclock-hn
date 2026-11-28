import { api } from "../lib/api";
import type { PaginatedResponse } from "../types/api";
import type { Brand } from "../types/brand";
import type { Category } from "../types/category";
import type { Country } from "../types/country";
import type { CatalogProduct } from "../types/products";

export const catalogService = {
	async getProducts(page = 1): Promise<PaginatedResponse<CatalogProduct>> {
		const { data } = await api.get<PaginatedResponse<CatalogProduct>>("/productos/", {
			params: { page },
		});

		return data;
	},

	async getCategories(page = 1): Promise<PaginatedResponse<Category>> {
		const { data } = await api.get<PaginatedResponse<Category>>("/categorias/", {
			params: { page },
		});

		return data;
	},

	async getBrands(page = 1): Promise<PaginatedResponse<Brand>> {
		const { data } = await api.get<PaginatedResponse<Brand>>("/marcas/", {
			params: { page },
		});

		return data;
	},

	async getCountries(page = 1): Promise<PaginatedResponse<Country>> {
		const { data } = await api.get<PaginatedResponse<Country>>("/paises/", {
			params: { page },
		});

		return data;
	},
};
