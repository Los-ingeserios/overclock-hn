import { Link } from "react-router-dom";
import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Loader2,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import { useAdminPromotionProducts } from "../../hooks/useAdminPromotionProducts";
import { PROMOTION_PRODUCT_ROLES, type PromotionProductRole } from "../../schemas/promotionProduct.schema";

const ROLE_BADGE_STYLES: Record<PromotionProductRole, string> = {
	Requerido: "bg-sky-500/15 text-sky-300 border-sky-500/30",
	Beneficio: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
	Ambos: "bg-brand-primary/20 text-brand-primary border-brand-primary/35",
};

export function AdminPromotionProductsPage() {
	const {
		register,
		fieldErrors,
		isSubmitting,
		onSubmit,
		filtered,
		promotions,
		products,
		loadingLookups,
		selectedPromotionId,
		setSelectedPromotionId,
		formatPromotionLabel,
		getPromotionInfo,
		getProductInfo,
		totalCount,
		search,
		setSearch,
		editingId,
		page,
		setPage,
		hasNext,
		hasPrevious,
		loading,
		deletingId,
		error,
		successMsg,
		clearMessages,
		resetForm,
		handleEdit,
		handleDelete,
		recargar,
	} = useAdminPromotionProducts();

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5 text-brand-primary mb-1">
						<Sparkles size={22} />
						<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
					</div>
					<h1 className="text-3xl font-bold text-brand-white">Productos en Promoción</h1>
					<p className="text-brand-muted text-sm mt-1">
						Vincula productos con promociones y define si actúan como requisito, beneficio o ambos.
					</p>
				</div>

				<button
					type="button"
					onClick={recargar}
					disabled={loading}
					className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary transition-colors disabled:opacity-50 cursor-pointer"
				>
					<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
					<span>Actualizar</span>
				</button>
			</div>

			{error && (
				<div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 text-sm text-red-300">
					<div className="flex items-center gap-2.5">
						<AlertCircle size={18} className="shrink-0 text-red-400" />
						<span>{error}</span>
					</div>
					<button
						type="button"
						onClick={clearMessages}
						className="text-red-300/80 hover:text-red-200 cursor-pointer"
					>
						<X size={16} />
					</button>
				</div>
			)}

			{successMsg && (
				<div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-sm text-emerald-300">
					<div className="flex items-center gap-2.5">
						<CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
						<span>{successMsg}</span>
					</div>
					<button
						type="button"
						onClick={clearMessages}
						className="text-emerald-300/80 hover:text-emerald-200 cursor-pointer"
					>
						<X size={16} />
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Asignación #${editingId}` : "Asignar Producto"}
						</h2>
						{editingId && (
							<button
								type="button"
								onClick={resetForm}
								className="text-brand-muted hover:text-brand-white cursor-pointer"
								title="Cancelar edición"
							>
								<X size={18} />
							</button>
						)}
					</div>

					<form onSubmit={onSubmit} className="space-y-4" noValidate>
						<div>
							<label htmlFor="pp-promo" className="block text-sm font-medium text-brand-white mb-1.5">
								Promoción *
							</label>
							<select
								id="pp-promo"
								disabled={isSubmitting || loadingLookups}
								{...register("id_promocion")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							>
								<option value="">
									{loadingLookups ? "Cargando promociones..." : "Selecciona una promoción..."}
								</option>
								{promotions.map((promo) => (
									<option key={promo.id_promocion} value={String(promo.id_promocion)}>
										{formatPromotionLabel(promo)}
									</option>
								))}
							</select>
							{fieldErrors.id_promocion && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.id_promocion.message}</p>
							)}
						</div>

						<div>
							<label htmlFor="pp-producto" className="block text-sm font-medium text-brand-white mb-1.5">
								Producto *
							</label>
							<select
								id="pp-producto"
								disabled={isSubmitting || loadingLookups}
								{...register("id_producto")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							>
								<option value="">
									{loadingLookups ? "Cargando productos..." : "Selecciona un producto..."}
								</option>
								{products.map((prod) => (
									<option key={prod.id_producto} value={String(prod.id_producto)}>
										[{prod.codigo_sku}] {prod.modelo}
									</option>
								))}
							</select>
							{fieldErrors.id_producto && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.id_producto.message}</p>
							)}
						</div>

						<div>
							<label htmlFor="pp-rol" className="block text-sm font-medium text-brand-white mb-1.5">
								Rol del producto *
							</label>
							<select
								id="pp-rol"
								disabled={isSubmitting}
								{...register("rol_producto")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							>
								{PROMOTION_PRODUCT_ROLES.map((rol) => (
									<option key={rol} value={rol}>
										{rol}
									</option>
								))}
							</select>
							<ul className="text-xs text-brand-muted mt-2 space-y-1">
								<li>
									<strong className="text-sky-300">Requerido:</strong> activa la promoción al
									comprarlo.
								</li>
								<li>
									<strong className="text-emerald-300">Beneficio:</strong> recibe el descuento.
								</li>
								<li>
									<strong className="text-brand-primary">Ambos:</strong> aplica en descuentos directos
									o 2x1.
								</li>
							</ul>
							{fieldErrors.rol_producto && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.rol_producto.message}</p>
							)}
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								disabled={isSubmitting || loadingLookups}
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
							>
								{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
								<span>
									{isSubmitting ? "Guardando..." : editingId ? "Guardar Cambios" : "Asignar Producto"}
								</span>
							</button>
							{editingId && (
								<button
									type="button"
									disabled={isSubmitting}
									onClick={resetForm}
									className="px-4 py-2.5 rounded-full border border-brand-divider text-sm text-brand-muted hover:text-brand-white transition-colors cursor-pointer"
								>
									Cancelar
								</button>
							)}
						</div>
					</form>
				</div>

				{/* Tabla */}
				<div className="lg:col-span-8 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
						<div className="relative flex-1">
							<Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Buscar por promoción, modelo, SKU o rol..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<select
							value={selectedPromotionId}
							onChange={(e) => setSelectedPromotionId(e.target.value)}
							aria-label="Filtrar por promoción"
							className="sm:w-60 bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
						>
							<option value="">Todas las promociones</option>
							{promotions.map((promo) => (
								<option key={promo.id_promocion} value={String(promo.id_promocion)}>
									{formatPromotionLabel(promo)}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end mb-3">
						<span className="text-xs text-brand-muted">Total en BD: {totalCount} registros</span>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-16 text-brand-muted gap-3">
							<Loader2 className="w-7 h-7 text-brand-primary animate-spin" />
							<p className="text-sm">Cargando asignaciones...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
										<th className="py-3 px-3">ID</th>
										<th className="py-3 px-3">Promoción</th>
										<th className="py-3 px-3">Producto</th>
										<th className="py-3 px-3">Rol</th>
										<th className="py-3 px-3 text-right">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-brand-divider/60 text-sm">
									{filtered.length > 0 ? (
										filtered.map((item) => {
											const promoInfo = getPromotionInfo(item.id_promocion);
											const prod = getProductInfo(item.id_producto);

											return (
												<tr
													key={item.id_promocion_producto}
													className="hover:bg-brand-bg/40 transition-colors"
												>
													<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
														#{item.id_promocion_producto}
													</td>
													<td className="py-3.5 px-3">
														{promoInfo ? (
															<div>
																<p className="font-medium text-brand-white">
																	{promoInfo.typeName}
																</p>
																<span className="font-mono text-xs text-brand-muted">
																	#{promoInfo.promo.id_promocion} ·{" "}
																	{Number(promoInfo.promo.porcentaje_descuento)}% OFF
																</span>
															</div>
														) : (
															<span className="text-brand-muted">
																Promoción #{item.id_promocion}
															</span>
														)}
													</td>
													<td className="py-3.5 px-3">
														<div className="flex items-center gap-2">
															<div>
																<p className="font-medium text-brand-white">
																	{prod
																		? prod.modelo
																		: `Producto #${item.id_producto}`}
																</p>
																{prod && (
																	<span className="font-mono text-xs text-brand-muted">
																		{prod.codigo_sku}
																	</span>
																)}
															</div>
															<Link
																to={`/producto/${item.id_producto}`}
																className="text-brand-muted hover:text-brand-primary transition-colors"
																title="Ver ficha pública"
															>
																<ExternalLink size={14} />
															</Link>
														</div>
													</td>
													<td className="py-3.5 px-3">
														<span
															className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${ROLE_BADGE_STYLES[item.rol_producto]}`}
														>
															{item.rol_producto}
														</span>
													</td>
													<td className="py-3.5 px-3">
														<div className="flex items-center justify-end gap-2">
															<button
																type="button"
																onClick={() => handleEdit(item)}
																disabled={deletingId === item.id_promocion_producto}
																className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
																title="Editar"
															>
																<Pencil size={16} />
															</button>
															<button
																type="button"
																onClick={() => handleDelete(item.id_promocion_producto)}
																disabled={deletingId === item.id_promocion_producto}
																className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
																title="Eliminar"
															>
																{deletingId === item.id_promocion_producto ? (
																	<Loader2 size={16} className="animate-spin" />
																) : (
																	<Trash2 size={16} />
																)}
															</button>
														</div>
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td colSpan={5} className="py-10 text-center text-brand-muted">
												No hay productos asignados que coincidan con la búsqueda.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}

					<div className="flex items-center justify-between pt-5 mt-4 border-t border-brand-divider text-sm">
						<span className="text-xs text-brand-muted">Página {page}</span>
						<div className="flex gap-2">
							<button
								type="button"
								disabled={!hasPrevious || loading}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
							>
								<ChevronLeft size={14} /> Anterior
							</button>
							<button
								type="button"
								disabled={!hasNext || loading}
								onClick={() => setPage((p) => p + 1)}
								className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
							>
								Siguiente <ChevronRight size={14} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
