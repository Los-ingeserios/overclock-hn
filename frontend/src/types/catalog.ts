import type { Product } from "./products";

export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

export interface ApiCountry {
	id_pais: number;
	nombre: string;
	estado: boolean;
}

export interface ApiCategory {
	id_categoria: number;
	nombre: string;
	desripcion: string | null;
}

export interface ApiBrand {
	id_marca: number;
	nombre: string;
	id_pais: number;
}

export interface ApiProduct {
	id_producto: number;
	codigo_sku: string;
	id_categoria: ApiCategory;
	id_marca: ApiBrand;
	modelo: string;
	descripcion?: string | null;
	precio_venta: string;
	stock: number;
	url_img: string | null;
}

export interface CreateProductPayload {
	id_categoria: number;
	id_marca: number;
	codigo_sku: string;
	numero_lote: string;
	modelo: string;
	descripcion?: string;
	precio_costo: number | string;
	precio_venta: number | string;
	stock: number;
	url_img?: string;
	estado?: boolean;
}

const FALLBACK_IMAGE = "https://placehold.co/300x300/2e2e3e/7270ec?text=Overclock+HN";

export function mapApiProductToUi(item: ApiProduct): Product {
	return {
		id: item.id_producto,
		sku: item.codigo_sku,
		name: item.modelo,
		brand: item.id_marca?.nombre ?? "Sin Marca",
		brandId: item.id_marca?.id_marca,
		category: item.id_categoria?.nombre ?? "Sin Categoria",
		categoryId: item.id_categoria?.id_categoria,
		price: Number(item.precio_venta),
		stock: item.stock,
		description: item.descripcion ?? null,
		image: item.url_img?.trim() ? item.url_img : FALLBACK_IMAGE,
	};
}
