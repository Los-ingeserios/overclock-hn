import { Link, useParams } from "react-router-dom";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	Cpu,
	Loader2,
	Minus,
	PackageCheck,
	PackageX,
	Plus,
	RefreshCw,
	ShoppingCart,
	Tag,
} from "lucide-react";
import { useProductDetail } from "../hooks/useProductDetail";
import { formatLempira, getProductImage, parseSpecification } from "../lib/format";

export function ProductDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { product, quantity, incrementQty, decrementQty, loading, notFound, error, recargar } = useProductDetail(id);

	if (loading) {
		return (
			<section className="max-w-300 mx-auto px-5 py-24 flex flex-col items-center justify-center text-brand-muted gap-3">
				<Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
				<p className="text-sm">Cargando ficha del producto...</p>
			</section>
		);
	}

	if (notFound) {
		return (
			<section className="max-w-300 mx-auto px-5 py-20 text-center">
				<div className="max-w-md mx-auto bg-brand-surface/40 border border-brand-divider rounded-2xl p-8">
					<PackageX size={40} className="mx-auto text-brand-muted mb-3" />
					<h1 className="text-2xl font-bold text-brand-white mb-2">Producto no encontrado</h1>
					<p className="text-sm text-brand-muted mb-6">
						El producto que buscas no existe o fue retirado del catálogo.
					</p>
					<Link
						to="/catalogo"
						className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
					>
						<ArrowLeft size={16} />
						Volver al catálogo
					</Link>
				</div>
			</section>
		);
	}

	if (error || !product) {
		return (
			<section className="max-w-300 mx-auto px-5 py-20">
				<div className="max-w-lg mx-auto p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-4">
					<AlertCircle size={32} className="mx-auto text-red-400" />
					<p className="text-sm text-red-300">{error ?? "Ocurrió un error al cargar el producto."}</p>
					<div className="flex items-center justify-center gap-3">
						<button
							type="button"
							onClick={recargar}
							className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary transition-colors cursor-pointer"
						>
							<RefreshCw size={14} /> Reintentar
						</button>
						<Link
							to="/catalogo"
							className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-primary text-xs text-brand-white font-semibold"
						>
							Ir al catálogo
						</Link>
					</div>
				</div>
			</section>
		);
	}

	const isAvailable = product.stock > 0;
	const isLowStock = product.stock > 0 && product.stock <= 5;
	const parsedSpecs = (product.especificaciones ?? []).map(parseSpecification).filter((s) => s.raw.length > 0);

	return (
		<section className="max-w-300 mx-auto px-5 py-10">
			{/* Navegación de regreso */}
			<div className="mb-6">
				<Link
					to="/catalogo"
					className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-white transition-colors"
				>
					<ArrowLeft size={16} />
					<span>Volver al catálogo</span>
				</Link>
			</div>

			{/* Tarjeta principal del producto */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-brand-surface/40 border border-brand-divider rounded-3xl p-6 lg:p-10 shadow-xl">
				{/* Imagen */}
				<div className="lg:col-span-6 flex items-center justify-center bg-brand-bg/70 border border-brand-divider rounded-2xl p-6 min-h-80">
					<img
						src={getProductImage(product.url_img)}
						alt={product.modelo}
						className="max-h-96 w-full object-contain rounded-xl"
					/>
				</div>

				{/* Información y compra */}
				<div className="lg:col-span-6 flex flex-col justify-between gap-6">
					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
								<Tag size={12} />
								{product.id_categoria?.nombre ?? "Sin categoría"}
							</span>
							{product.id_marca?.nombre && (
								<span className="text-xs font-medium px-3 py-1 rounded-full bg-brand-bg border border-brand-divider text-brand-muted">
									{product.id_marca.nombre}
								</span>
							)}
							{product.codigo_sku && (
								<span className="font-mono text-xs px-3 py-1 rounded-full bg-brand-bg border border-brand-divider text-brand-muted">
									SKU: {product.codigo_sku}
								</span>
							)}
						</div>

						<h1 className="text-3xl lg:text-4xl font-bold text-brand-white leading-tight">
							{product.modelo}
						</h1>

						<p className="text-3xl font-bold text-brand-primary">{formatLempira(product.precio_venta)}</p>

						{/* Estado de stock */}
						<div>
							{isAvailable ? (
								<span
									className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
										isLowStock
											? "bg-amber-500/15 text-amber-300 border-amber-500/30"
											: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
									}`}
								>
									<PackageCheck size={14} />
									{isLowStock
										? `Últimas ${product.stock} unidades disponibles`
										: `En stock (${product.stock} disponibles)`}
								</span>
							) : (
								<span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
									<PackageX size={14} />
									Agotado temporalmente
								</span>
							)}
						</div>

						{product.descripcion && (
							<p className="text-sm text-brand-muted leading-relaxed pt-2 border-t border-brand-divider">
								{product.descripcion}
							</p>
						)}
					</div>

					{/* Controles de cantidad + carrito */}
					<div className="pt-5 border-t border-brand-divider flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
						{isAvailable && (
							<div className="inline-flex items-center justify-between bg-brand-bg border border-brand-glass rounded-full px-2 py-1.5 sm:w-36">
								<button
									type="button"
									onClick={decrementQty}
									disabled={quantity <= 1}
									className="p-1.5 rounded-full text-brand-muted hover:text-brand-white disabled:opacity-30 cursor-pointer"
									aria-label="Disminuir cantidad"
								>
									<Minus size={16} />
								</button>
								<span className="text-sm font-semibold text-brand-white font-mono">{quantity}</span>
								<button
									type="button"
									onClick={incrementQty}
									disabled={quantity >= product.stock}
									className="p-1.5 rounded-full text-brand-muted hover:text-brand-white disabled:opacity-30 cursor-pointer"
									aria-label="Aumentar cantidad"
								>
									<Plus size={16} />
								</button>
							</div>
						)}

						<button
							type="button"
							disabled={!isAvailable}
							onClick={() => {
								// TODO: Conectar con useCartStore cuando se implemente el carrito en LocalStorage
							}}
							className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
						>
							<ShoppingCart size={18} />
							<span>{isAvailable ? "Agregar al carrito" : "Sin existencias"}</span>
						</button>
					</div>
				</div>
			</div>

			{/* Ficha técnica / Especificaciones */}
			<div className="mt-8 bg-brand-surface/40 border border-brand-divider rounded-3xl p-6 lg:p-8 shadow-xl">
				<div className="flex items-center gap-2.5 mb-6">
					<Cpu size={20} className="text-brand-primary" />
					<h2 className="text-xl font-bold text-brand-white">Especificaciones Técnicas</h2>
				</div>

				{parsedSpecs.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{parsedSpecs.map((spec) => (
							<div
								key={spec.id}
								className="flex items-start gap-3 bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3.5"
							>
								<CheckCircle2 size={17} className="shrink-0 text-brand-primary mt-0.5" />
								<div className="text-sm">
									{spec.label ? (
										<>
											<span className="font-semibold text-brand-white">{spec.label}: </span>
											<span className="text-brand-muted">{spec.value}</span>
										</>
									) : (
										<span className="text-brand-white">{spec.value}</span>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-brand-muted italic">
						Este producto aún no tiene especificaciones técnicas registradas.
					</p>
				)}
			</div>
		</section>
	);
}
