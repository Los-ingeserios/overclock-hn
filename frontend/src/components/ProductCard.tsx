import { Link } from "react-router-dom";
import type { CatalogProduct } from "../types/products";
import { formatLempira, getProductImage } from "../lib/format";

interface ProductCardProps {
	product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
	const outOfStock = product.stock <= 0;

	return (
		<article className="text-center flex flex-col items-center p-5 rounded-2xl border border-transparent hover:border-brand-divider transition-colors">
			<Link to={`/producto/${product.id_producto}`}>
				<img
					src={getProductImage(product.url_img)}
					alt={product.modelo}
					loading="lazy"
					className="w-40 h-40 object-contain rounded-xl mb-4"
				/>
			</Link>

			<div className="flex flex-col items-center flex-1">
				<Link to={`/producto/${product.id_producto}`}>
					<h3 className="text-lg font-semibold text-brand-white hover:text-brand-primary transition-colors mb-2 line-clamp-2 min-h-14">
						{product.modelo}
					</h3>
				</Link>

				<p className="text-sm text-brand-muted mb-2">{product.id_marca?.nombre ?? "Sin marca"}</p>
				<p className="text-lg font-bold text-brand-primary mb-4">{formatLempira(product.precio_venta)}</p>
				<button
					type="button"
					disabled={outOfStock}
					className="mt-auto inline-block text-sm text-brand-white border border-brand-primary hover:bg-brand-primary-hover px-7 py-3 rounded-full transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
				>
					{outOfStock ? "Agotado" : "Agregar al carrito"}
				</button>
			</div>
		</article>
	);
}
