import { api } from "../lib/api";
import type { ProductDetail } from "../types/products";

export const productDetailService = {
	async getById(id: number): Promise<ProductDetail> {
		const { data } = await api.get<ProductDetail>(`/productos/${id}/`);
		return data;
	},
};
