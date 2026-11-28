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
