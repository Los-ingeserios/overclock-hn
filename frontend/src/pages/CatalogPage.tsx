import { AlertCircle, ChevronLeft, ChevronRight, Filter, Loader2, RefreshCw, Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useCatalog } from "../hooks/useCatalog";

export function CatalogPage() {
	const {
		productosFiltrados,
		categories,
		brands,
		busqueda,
		setBusqueda,
		categoriaSel,
		setCategoriaSel,
		marcaSel,
		setMarcaSel,
		limpiarFiltros,
		page,
		setPage,
		totalCount,
		hasNext,
		hasPrevious,
		loading,
		error,
		recargar,
	} = useCatalog();

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
				<div>
					<h1 className="text-3xl font-bold text-brand-white mb-2">Catálogo de Hardware</h1>
					<p className="text-brand-muted">
						Explora nuestro inventario de componentes y equipos de alto rendimiento.
					</p>
				</div>
				{!loading && !error && (
					<span className="text-xs text-brand-muted">
						Mostrando {productosFiltrados.length} de {totalCount} productos
					</span>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Sidebar de Filtros */}
				<aside className="bg-brand-surface/40 p-6 rounded-2xl border border-brand-divider backdrop-blur-sm h-fit shadow-xl space-y-6">
					<div className="flex items-center justify-between text-brand-white font-semibold">
						<div className="flex items-center gap-2">
							<Filter className="w-5 h-5 text-brand-primary" />
							<span>Filtros</span>
						</div>
						{(categoriaSel !== "Todas" || marcaSel !== "Todas" || busqueda) && (
							<button
								type="button"
								onClick={limpiarFiltros}
								className="text-xs text-brand-primary hover:underline cursor-pointer"
							>
								Limpiar
							</button>
						)}
					</div>

					{/* Categorías desde BD */}
					<div>
						<h3 className="text-xs uppercase tracking-wider font-semibold text-brand-muted mb-3">
							Categorías
						</h3>
						<div className="space-y-1">
							<button
								type="button"
								onClick={() => setCategoriaSel("Todas")}
								className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
									categoriaSel === "Todas"
										? "bg-brand-primary text-brand-white font-semibold shadow-md"
										: "text-brand-muted hover:text-brand-white hover:bg-brand-primary/10"
								}`}
							>
								Todas
							</button>
							{categories.map((cat) => (
								<button
									type="button"
									key={cat.id_categoria}
									onClick={() => setCategoriaSel(cat.id_categoria)}
									className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
										categoriaSel === cat.id_categoria
											? "bg-brand-primary text-brand-white font-semibold shadow-md"
											: "text-brand-muted hover:text-brand-white hover:bg-brand-primary/10"
									}`}
								>
									{cat.nombre}
								</button>
							))}
						</div>
					</div>

					{/* Marcas desde BD */}
					<div>
						<h3 className="text-xs uppercase tracking-wider font-semibold text-brand-muted mb-3">Marcas</h3>
						<div className="space-y-1">
							<button
								type="button"
								onClick={() => setMarcaSel("Todas")}
								className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
									marcaSel === "Todas"
										? "bg-brand-primary text-brand-white font-semibold shadow-md"
										: "text-brand-muted hover:text-brand-white hover:bg-brand-primary/10"
								}`}
							>
								Todas
							</button>
							{brands.map((brand) => (
								<button
									type="button"
									key={brand.id_marca}
									onClick={() => setMarcaSel(brand.id_marca)}
									className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
										marcaSel === brand.id_marca
											? "bg-brand-primary text-brand-white font-semibold shadow-md"
											: "text-brand-muted hover:text-brand-white hover:bg-brand-primary/10"
									}`}
								>
									{brand.nombre}
								</button>
							))}
						</div>
					</div>
				</aside>

				{/* Listado Principal */}
				<main className="md:col-span-3">
					<div className="relative mb-6">
						<Search className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-muted" />
						<input
							type="text"
							placeholder="Buscar por modelo, marca o SKU (ej. ThinkPad, ASUS, LP-LN-01)..."
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
							className="w-full pl-11 pr-4 py-2.5 bg-brand-surface/40 border border-brand-divider rounded-xl text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-primary transition shadow-inner"
						/>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-20 text-brand-muted gap-3">
							<Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
							<p className="text-sm">Cargando inventario desde PostgreSQL...</p>
						</div>
					) : error ? (
						<div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col items-center text-center gap-4">
							<AlertCircle className="w-8 h-8 text-red-400" />
							<p className="text-sm text-red-300 max-w-md">{error}</p>
							<button
								type="button"
								onClick={recargar}
								className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-medium transition-colors cursor-pointer"
							>
								<RefreshCw className="w-4 h-4" />
								<span>Reintentar</span>
							</button>
						</div>
					) : productosFiltrados.length > 0 ? (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{productosFiltrados.map((producto) => (
									<ProductCard key={producto.id_producto} product={producto} />
								))}
							</div>

							{(hasPrevious || hasNext) && (
								<div className="flex items-center justify-center gap-4 mt-10">
									<button
										type="button"
										disabled={!hasPrevious}
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-divider text-sm text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
									>
										<ChevronLeft className="w-4 h-4" />
										<span>Anterior</span>
									</button>
									<span className="text-sm text-brand-muted">Página {page}</span>
									<button
										type="button"
										disabled={!hasNext}
										onClick={() => setPage((p) => p + 1)}
										className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-divider text-sm text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
									>
										<span>Siguiente</span>
										<ChevronRight className="w-4 h-4" />
									</button>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-12 text-brand-muted bg-brand-surface/20 rounded-2xl border border-brand-divider">
							No se encontraron productos que coincidan con la búsqueda.
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
