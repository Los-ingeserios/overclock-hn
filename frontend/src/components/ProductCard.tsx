import type { Product } from "../types/products";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<article className="text-center flex flex-col items-center p-5 rounded-2xl border border-transparent hover:border-brand-divider transition-colors">
			<img
				src={product.image}
				alt={product.name}
				loading="lazy"
				className="w-40 h-40 object-contain rounded-xl mb-4"
			/>
			<div className="flex flex-col items-center flex-1">
				<h3 className="text-lg font-semibold text-brand-white mb-2 line-clamp-2 min-h-14">{product.name}</h3>
				<p className="text-sm text-brand-muted mb-2">{product.brand}</p>
				<p className="text-lg font-bold text-brand-primary mb-4">L. {product.price.toLocaleString("es-HN")}</p>
				<button
					type="button"
					className="mt-auto inline-block text-sm text-brand-white border border-brand-primary hover:bg-brand-primary-hover px-7 py-3 rounded-full transition-colors cursor-pointer"
				>
					Agregar al carrito
				</button>
			</div>
		</article>
	);
}
