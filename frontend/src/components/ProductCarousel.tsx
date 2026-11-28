// frontend/src/components/ProductCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ProductCard } from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import type { CatalogProduct } from "../types/products";

interface ProductCarouselProps {
	title: string;
	products: CatalogProduct[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
	return (
		<section className="max-w-300 mx-auto px-5 py-14">
			<h2 className="text-4xl lg:text-[50px] font-bold text-brand-white mb-12 text-center lg:text-left">
				{title}
			</h2>

			<Swiper
				modules={[Navigation]}
				spaceBetween={30}
				loop
				navigation
				breakpoints={{
					0: { slidesPerView: 1 },
					520: { slidesPerView: 2 },
					950: { slidesPerView: 3 },
				}}
				className="px-6"
			>
				{products.map((product) => (
					<SwiperSlide key={product.id_producto} className="px-4 pb-6">
						<ProductCard product={product} />
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
}
