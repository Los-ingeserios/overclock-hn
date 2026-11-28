import type { PromoProduct } from "../types/products";

interface MockInput {
	id: number;
	sku: string;
	model: string;
	brandId: number;
	brandName: string;
	categoryId: number;
	categoryName: string;
	price: number;
	originalPrice?: number;
	badge?: string;
	image: string | null;
	stock?: number;
}

function makeMock({
	id,
	sku,
	model,
	brandId,
	brandName,
	categoryId,
	categoryName,
	price,
	originalPrice,
	badge,
	image,
	stock = 15,
}: MockInput): PromoProduct {
	return {
		id_producto: id,
		codigo_sku: sku,
		modelo: model,
		precio_venta: price,
		stock,
		url_img: image,
		id_categoria: {
			id_categoria: categoryId,
			nombre: categoryName,
		},
		id_marca: {
			id_marca: brandId,
			nombre: brandName,
		},
		...(originalPrice !== undefined ? { precio_original: originalPrice } : {}),
		...(badge !== undefined ? { etiqueta: badge } : {}),
	};
}

export const HERO_PRODUCTS: PromoProduct[] = [
	makeMock({
		id: 1,
		sku: "SKU-4070S-TUF",
		model: "NVIDIA GeForce RTX 4070 Super 12GB",
		brandId: 1,
		brandName: "ASUS TUF",
		categoryId: 1,
		categoryName: "Tarjetas Gráficas",
		originalPrice: 18500,
		price: 16200,
		image: "https://placehold.co/500x360/2e2e3e/7270ec?text=RTX+4070+Super",
	}),
	makeMock({
		id: 2,
		sku: "SKU-LAT-5420",
		model: "Laptop Dell Latitude 5420 Core i7 16GB",
		brandId: 2,
		brandName: "Dell",
		categoryId: 2,
		categoryName: "Laptops",
		originalPrice: 11200,
		price: 9500,
		image: "https://placehold.co/500x360/2e2e3e/7270ec?text=Dell+Latitude+5420",
	}),
	makeMock({
		id: 3,
		sku: "SKU-HYP-ALLOY",
		model: "Teclado Mecánico HyperX Alloy Origins RGB",
		brandId: 3,
		brandName: "HyperX",
		categoryId: 3,
		categoryName: "Periféricos",
		originalPrice: 2800,
		price: 2150,
		image: "https://placehold.co/500x360/2e2e3e/7270ec?text=HyperX+Alloy+RGB",
	}),
];

export const PROMO_PRODUCTS: PromoProduct[] = [
	makeMock({
		id: 4,
		sku: "SKU-LOG-G502",
		model: "Mouse Gamer Logitech G502 HERO",
		brandId: 4,
		brandName: "Logitech",
		categoryId: 3,
		categoryName: "Periféricos",
		originalPrice: 1650,
		price: 1290,
		badge: "Descuento",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=G502+HERO",
	}),
	makeMock({
		id: 5,
		sku: "SKU-SNY-DS5",
		model: "Control DualSense PS5 Midnight Black",
		brandId: 5,
		brandName: "Sony",
		categoryId: 4,
		categoryName: "Consolas y Mandos",
		originalPrice: 2100,
		price: 1750,
		badge: "2do al 50%",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=DualSense+PS5",
	}),
	makeMock({
		id: 6,
		sku: "SKU-KNG-NV2-1TB",
		model: "SSD NVMe Kingston NV2 1TB PCIe 4.0",
		brandId: 6,
		brandName: "Kingston",
		categoryId: 5,
		categoryName: "Almacenamiento",
		originalPrice: 1950,
		price: 1490,
		badge: "Oferta Flash",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=NVMe+1TB",
	}),
	makeMock({
		id: 7,
		sku: "SKU-HYP-CLOUD2W",
		model: "Headset HyperX Cloud II Wireless",
		brandId: 3,
		brandName: "HyperX",
		categoryId: 6,
		categoryName: "Audio Gaming",
		originalPrice: 3400,
		price: 2790,
		badge: "Combo Gamer",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=Cloud+II+Wireless",
	}),
];

export const NEW_PRODUCTS: PromoProduct[] = [
	makeMock({
		id: 8,
		sku: "SKU-AMD-7800X3D",
		model: "Procesador AMD Ryzen 7 7800X3D",
		brandId: 7,
		brandName: "AMD",
		categoryId: 7,
		categoryName: "Procesadores",
		price: 11800,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=Ryzen+7+7800X3D",
	}),
	makeMock({
		id: 9,
		sku: "SKU-CRS-VNG-32D5",
		model: "Memoria RAM Corsair Vengeance 32GB DDR5",
		brandId: 8,
		brandName: "Corsair",
		categoryId: 8,
		categoryName: "Memorias RAM",
		price: 3250,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=32GB+DDR5",
	}),
	makeMock({
		id: 10,
		sku: "SKU-LG-UG27-144",
		model: 'Monitor LG UltraGear 27" 144Hz IPS',
		brandId: 9,
		brandName: "LG",
		categoryId: 9,
		categoryName: "Monitores",
		price: 7400,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=LG+UltraGear+27",
	}),
	makeMock({
		id: 11,
		sku: "SKU-CRS-RM850E",
		model: "Fuente Corsair RM850e 850W 80+ Gold",
		brandId: 8,
		brandName: "Corsair",
		categoryId: 10,
		categoryName: "Fuentes de Poder",
		price: 3600,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=PSU+850W+Gold",
	}),
];

export const FEATURED_PRODUCTS: PromoProduct[] = [
	makeMock({
		id: 12,
		sku: "SKU-MS-XBOX-BLK",
		model: "Control Xbox Series X|S Carbon Black",
		brandId: 10,
		brandName: "Microsoft",
		categoryId: 4,
		categoryName: "Consolas y Mandos",
		price: 1650,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=Xbox+Controller",
	}),
	makeMock({
		id: 13,
		sku: "SKU-MSI-B650-TOM",
		model: "Motherboard MSI B650 Tomahawk WiFi",
		brandId: 11,
		brandName: "MSI",
		categoryId: 11,
		categoryName: "Placas Base",
		price: 5900,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=MSI+B650",
	}),
	makeMock({
		id: 14,
		sku: "SKU-NZXT-H5F-RGB",
		model: "Case NZXT H5 Flow RGB Vidrio Templado",
		brandId: 12,
		brandName: "NZXT",
		categoryId: 12,
		categoryName: "Gabinetes",
		price: 2950,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=NZXT+H5+Flow",
	}),
	makeMock({
		id: 15,
		sku: "SKU-SS-QCK-L",
		model: "Mousepad SteelSeries QcK Large",
		brandId: 13,
		brandName: "SteelSeries",
		categoryId: 3,
		categoryName: "Periféricos",
		price: 580,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=QcK+Large",
	}),
];
