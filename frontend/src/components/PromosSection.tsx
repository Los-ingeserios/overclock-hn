import { formatLempira, getProductImage } from "../lib/format";
import type { PromoProduct } from "../types/products";

interface PromosSectionProps {
	products: PromoProduct[];
}

export default function PromosSection({ products }: PromosSectionProps) {
	return (
		<section id="promociones" className="max-w-300 mx-auto px-5 py-14">
			<h2 className="text-4xl lg:text-[50px] font-bold text-brand-white text-center mb-10">Promociones</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{products.map((item) => (
					<article
						key={item.id_producto}
						className="flex flex-col-reverse lg:flex-row items-center justify-between gap-6 p-7 lg:p-9 rounded-2xl bg-brand-divider/40 border border-brand-divider hover:border-brand-primary/40 transition-colors text-center lg:text-left"
					>
						<div className="w-full lg:w-1/2">
							{item.etiqueta && (
								<span className="inline-block text-xs font-semibold uppercase bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full mb-3">
									{item.etiqueta}
								</span>
							)}
							<h3 className="text-xl font-semibold text-brand-white leading-snug">{item.modelo}</h3>

							<div className="flex flex-col lg:flex-row items-center lg:items-baseline gap-1 lg:gap-4 my-4">
								{item.precio_original !== undefined && (
									<p className="text-lg text-brand-muted line-through">
										{formatLempira(item.precio_original)}
									</p>
								)}
								<p className="text-xl font-semibold text-brand-primary">
									{formatLempira(item.precio_venta)}
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
								src={getProductImage(item.url_img)}
								alt={item.modelo}
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
