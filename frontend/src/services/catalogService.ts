import { api } from "../lib/api";
import type {
	ApiBrand,
	ApiCategory,
	ApiCountry,
	ApiProduct,
	CreateProductPayload,
	PaginatedResponse,
} from "../types/catalog";

export const catalogService = {
	async getProducts(page = 1): Promise<PaginatedResponse<ApiProduct>> {
		const { data } = await api.get<PaginatedResponse<ApiProduct>>("/productos/", {
			params: { page },
		});

		return data;
	},

	async getCategories(page = 1): Promise<PaginatedResponse<ApiCategory>> {
		const { data } = await api.get<PaginatedResponse<ApiCategory>>("/categorias/", {
			params: { page },
		});

		return data;
	},

	async getBrands(page = 1): Promise<PaginatedResponse<ApiBrand>> {
		const { data } = await api.get<PaginatedResponse<ApiBrand>>("/marcas/", {
			params: { page },
		});

		return data;
	},

	async getCountries(page = 1): Promise<PaginatedResponse<ApiCountry>> {
		const { data } = await api.get<PaginatedResponse<ApiCountry>>("/paises/", {
			params: { page },
		});

		return data;
	},

	async createProduct(payload: CreateProductPayload): Promise<ApiProduct> {
		const { data } = await api.post<ApiProduct>("/productos/", payload);
		return data;
	},

	async updateProduct(id: number, payload: Partial<CreateProductPayload>): Promise<ApiProduct> {
		const { data } = await api.patch<ApiProduct>(`/productos/${id}`, payload);
		return data;
	},

	async deleteProduct(id: number): Promise<void> {
		await api.delete(`/productos/${id}`);
	},
};
