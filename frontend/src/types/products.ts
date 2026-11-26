export interface Product {
	id: number;
	name: string;
	brand: string;
	category: string;
	price: number;
	originalPrice?: number;
	badge?: string;
	image: string;
}
