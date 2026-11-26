import type { Product } from "../types/products";

export const HERO_PRODUCTS: Product[] = [
	{
		id: 1,
		name: "NVIDIA GeForce RTX 4070 Super 12GB",
		brand: "ASUS TUF",
		category: "Tarjetas Gráficas",
		originalPrice: 18500,
		price: 16200,
		image: "https://placehold.co/500x360/2e2e3e/7270ec?text=RTX+4070+Super",
	},
	{
		id: 2,
		name: "Laptop Dell Latitude 5420 Core i7 16GB",
		brand: "Dell",
		category: "Laptops",
		originalPrice: 11200,
		price: 9500,
		image: "https://placehold.co/500x360/2e2e3e/7270ec?text=Dell+Latitude+5420",
	},
	{
		id: 3,
		name: "Teclado Mecánico HyperX Alloy Origins RGB",
		brand: "HyperX",
		category: "Periféricos",
		originalPrice: 2800,
		price: 2150,
		image: "https://placehold.co/500x360/2e2e3e/7270ec?text=HyperX+Alloy+RGB",
	},
];

export const PROMO_PRODUCTS: Product[] = [
	{
		id: 4,
		name: "Mouse Gamer Logitech G502 HERO",
		brand: "Logitech",
		category: "Periféricos",
		originalPrice: 1650,
		price: 1290,
		badge: "Descuento",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=G502+HERO",
	},
	{
		id: 5,
		name: "Control DualSense PS5 Midnight Black",
		brand: "Sony",
		category: "Consolas y Mandos",
		originalPrice: 2100,
		price: 1750,
		badge: "2do al 50%",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=DualSense+PS5",
	},
	{
		id: 6,
		name: "SSD NVMe Kingston NV2 1TB PCIe 4.0",
		brand: "Kingston",
		category: "Almacenamiento",
		originalPrice: 1950,
		price: 1490,
		badge: "Oferta Flash",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=NVMe+1TB",
	},
	{
		id: 7,
		name: "Headset HyperX Cloud II Wireless",
		brand: "HyperX",
		category: "Audio Gaming",
		originalPrice: 3400,
		price: 2790,
		badge: "Combo Gamer",
		image: "https://placehold.co/220x220/2e2e3e/7270ec?text=Cloud+II+Wireless",
	},
];

export const NEW_PRODUCTS: Product[] = [
	{
		id: 8,
		name: "Procesador AMD Ryzen 7 7800X3D",
		brand: "AMD",
		category: "Procesadores",
		price: 11800,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=Ryzen+7+7800X3D",
	},
	{
		id: 9,
		name: "Memoria RAM Corsair Vengeance 32GB DDR5",
		brand: "Corsair",
		category: "Memorias RAM",
		price: 3250,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=32GB+DDR5",
	},
	{
		id: 10,
		name: 'Monitor LG UltraGear 27" 144Hz IPS',
		brand: "LG",
		category: "Monitores",
		price: 7400,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=LG+UltraGear+27",
	},
	{
		id: 11,
		name: "Fuente Corsair RM850e 850W 80+ Gold",
		brand: "Corsair",
		category: "Fuentes de Poder",
		price: 3600,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=PSU+850W+Gold",
	},
];

export const FEATURED_PRODUCTS: Product[] = [
	{
		id: 12,
		name: "Control Xbox Series X|S Carbon Black",
		brand: "Microsoft",
		category: "Consolas y Mandos",
		price: 1650,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=Xbox+Controller",
	},
	{
		id: 13,
		name: "Motherboard MSI B650 Tomahawk WiFi",
		brand: "MSI",
		category: "Placas Base",
		price: 5900,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=MSI+B650",
	},
	{
		id: 14,
		name: "Case NZXT H5 Flow RGB Vidrio Templado",
		brand: "NZXT",
		category: "Gabinetes",
		price: 2950,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=NZXT+H5+Flow",
	},
	{
		id: 15,
		name: "Mousepad SteelSeries QcK Large",
		brand: "SteelSeries",
		category: "Periféricos",
		price: 580,
		image: "https://placehold.co/220x220/2e2e3e/feffff?text=QcK+Large",
	},
];
