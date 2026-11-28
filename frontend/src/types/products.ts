import type { ProductPayload } from "../schemas/product.schema";
import type { Specification } from "./specification";
import type { Category } from "./category";
import type { Brand } from "./brand";

export type { ProductPayload };

export type CategoryRef = Pick<Category, "id_categoria" | "nombre">;
export type BrandRef = Pick<Brand, "id_marca" | "nombre">;

export interface ProductBase {
	id_producto: number;
	codigo_sku: string;
	modelo: string;
	precio_venta: string | number;
	stock: number;
	url_img: string | null;
}

export type ProductOption = Pick<ProductBase, "id_producto" | "codigo_sku" | "modelo">;

export interface CatalogProduct extends ProductBase {
	id_categoria: CategoryRef;
	id_marca: BrandRef;
}

export interface ProductDetail extends CatalogProduct {
	descripcion: string | null;
	especificaciones: Specification[];
}

export interface AdminProduct extends ProductBase {
	id_categoria: number | CategoryRef;
	id_marca: number | BrandRef;
	numero_lote?: string | null;
	descripcion?: string | null;
	precio_costo?: string | number | null;
	fecha_ingreso?: string;
	estado?: boolean;
}

export interface PromoProduct extends CatalogProduct {
	precio_original?: number;
	etiqueta?: string;
}
