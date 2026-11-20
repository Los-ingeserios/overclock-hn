import type { Product } from "../types/products";

interface PromosSectionProps {
	products: Product[];
}

export default function PromosSection({ products }: PromosSectionProps) {
	return (
		<section id="promociones" className="max-w-300 mx-auto px-5 py-14">
			<h2 className="text-4xl lg:text-[50px] font-bold text-brand-white text-center mb-10">Promociones</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{products.map((item) => (
					<article
						key={item.id}
						className="flex flex-col-reverse lg:flex-row items-center justify-between gap-6 p-7 lg:p-9 rounded-2xl bg-brand-divider/40 border border-brand-divider hover:border-brand-primary/40 transition-colors text-center lg:text-left"
					>
						<div className="w-full lg:w-1/2">
							{item.badge && (
								<span className="inline-block text-xs font-semibold uppercase bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full mb-3">
									{item.badge}
								</span>
							)}
							<h3 className="text-xl font-semibold text-brand-white leading-snug">{item.name}</h3>

							<div className="flex flex-col lg:flex-row items-center lg:items-baseline gap-1 lg:gap-4 my-4">
								{item.originalPrice && (
									<p className="text-lg text-brand-muted line-through">
										L. {item.originalPrice.toLocaleString("es-HN")}
									</p>
								)}
								<p className="text-xl font-semibold text-brand-primary">
									L. {item.price.toLocaleString("es-HN")}
								</p>
							</div>

							<button
								type="button"
								className="inline-block text-sm text-brand-white border border-brand-primary hover:bg-brand-primary-hover px-7 py-3 rounded-full transition-colors cursor-pointer"
							>
								Agregar al carrito
							</button>
						</div>

						<div className="w-full lg:w-1/2 flex justify-center">
							<img
								src={item.image}
								alt={item.name}
								loading="lazy"
								className="w-40 h-40 object-contain rounded-xl"
							/>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
