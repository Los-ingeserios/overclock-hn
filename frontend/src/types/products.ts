import type { ApiBrand, ApiCategory, PaginatedResponse } from "./catalog";
import type { ProductPayload } from "../schemas/product.schema";

export type { ProductPayload };
export type CategoryOption = ApiCategory;
export type BrandOption = ApiBrand;

export interface AdminProduct {
	id_producto: number;
	codigo_sku: string;
	numero_lote?: string | null;
	id_categoria: number | ApiCategory;
	id_marca: number | ApiBrand;
	modelo: string;
	descripcion?: string | null;
	precio_costo?: string | number | null;
	precio_venta: string | number;
	stock: number;
	fecha_ingreso?: string;
	url_img: string | null;
	estado?: boolean;
}

export type PaginatedAdminProducts = PaginatedResponse<AdminProduct>;

export interface Product {
	id: number;
	name: string;
	brand: string;
	category: string;
	price: number;
	originalPrice?: number;
	badge?: string;
	image: string;
	sku?: string;
	stock?: number;
	categoryId?: number;
	brandId?: number;
	description?: string | null;
}
