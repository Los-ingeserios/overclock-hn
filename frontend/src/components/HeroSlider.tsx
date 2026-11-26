import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Product } from "../types/products";

interface HeroSliderProps {
	products: Product[];
}

export function HeroSlider({ products }: HeroSliderProps) {
	return (
		<section className="min-h-[70vh] flex items-center py-12 lg:py-20">
			<div className="max-w-300 w-full mx-auto px-5">
				<Swiper
					modules={[Navigation, Pagination]}
					slidesPerView={1}
					spaceBetween={30}
					loop
					navigation
					pagination={{ clickable: true }}
					className="pb-12"
				>
					{products.map((item) => (
						<SwiperSlide key={item.id} className="px-6 lg:px-20 pb-12">
							<div className="flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
								{/* Texto */}
								<div className="w-full lg:w-1/2">
									<span className="inline-block text-xs uppercase tracking-widest text-brand-primary font-semibold mb-3">
										{item.category} • {item.brand}
									</span>
									<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-white leading-tight">
										{item.name}
									</h1>

									<div className="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 lg:gap-6 my-6">
										{item.originalPrice && (
											<p className="text-2xl lg:text-[30px] text-brand-muted line-through">
												L. {item.originalPrice.toLocaleString("es-HN")}
											</p>
										)}
										<p className="text-2xl lg:text-[30px] font-semibold text-brand-primary">
											L. {item.price.toLocaleString("es-HN")}
										</p>
									</div>

									<Link
										to={`/catalogo`}
										className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-base lg:text-lg font-medium px-9 py-3.5 rounded-full transition-colors mt-2 lg:mt-6"
									>
										Más información
									</Link>
								</div>

								{/* Imagen */}
								<div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
									<img
										src={item.image}
										alt={item.name}
										loading="lazy"
										className="w-60 sm:w-80 lg:w-115 rounded-2xl object-contain"
									/>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}
