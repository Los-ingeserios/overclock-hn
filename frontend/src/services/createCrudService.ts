import { api } from "../lib/api";
import type { PaginatedResponse } from "../types/catalog";

export interface CrudService<TItem, TPayload> {
	getAll: (page?: number) => Promise<PaginatedResponse<TItem>>;
	getAllPages: () => Promise<TItem[]>;
	create: (payload: TPayload) => Promise<TItem>;
	update: (id: number, payload: Partial<TPayload>) => Promise<TItem>;
	remove: (id: number) => Promise<void>;
}

function normalizeEndpoint(endpoint: string): string {
	const withLeading = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export function createCrudService<TItem, TPayload>(endpoint: string): CrudService<TItem, TPayload> {
	const base = normalizeEndpoint(endpoint);

	return {
		async getAll(page = 1) {
			const { data } = await api.get<PaginatedResponse<TItem>>(base, {
				params: { page },
			});
			return data;
		},

		async getAllPages() {
			const all: TItem[] = [];
			let currentPage = 1;
			let hasNext = true;

			while (hasNext && currentPage <= 50) {
				const { data } = await api.get<PaginatedResponse<TItem>>(base, {
					params: { page: currentPage },
				});
				all.push(...data.results);
				hasNext = Boolean(data.next);
				currentPage += 1;
			}

			return all;
		},

		async create(payload) {
			const { data } = await api.post<TItem>(base, payload);
			return data;
		},

		async update(id, payload) {
			const { data } = await api.patch<TItem>(`${base}${id}/`, payload);
			return data;
		},

		async remove(id) {
			await api.delete(`${base}${id}/`);
		},
	};
}
