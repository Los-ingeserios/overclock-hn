import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	ImageIcon,
	Loader2,
	Package,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useAdminProducts } from "../../hooks/useAdminProducts";

const FALLBACK_THUMB = "https://placehold.co/80x80/2e2e3e/7270ec?text=HW";

export function AdminProductsPage() {
	const {
		register,
		fieldErrors,
		isSubmitting,
		estadoActual,
		urlImgActual,
		onSubmit,
		filtered,
		categories,
		brands,
		loadingLookups,
		loadingEditId,
		getCategoryName,
		getBrandName,
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
	} = useAdminProducts();

	return (
		<section className="max-w-full mx-auto px-5 py-8">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5 text-brand-primary mb-1">
						<Package size={22} />
						<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
					</div>
					<h1 className="text-3xl font-bold text-brand-white">Gestión de Productos</h1>
					<p className="text-brand-muted text-sm mt-1">
						Administra el inventario de hardware, precios, stock y categorías en PostgreSQL.
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

			{/* Alertas de feedback */}
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
				<div className="lg:col-span-5 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Producto #${editingId}` : "Nuevo Producto"}
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
						{/* Categoría y Marca */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label
									htmlFor="prod-categoria"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Categoría *
								</label>
								<select
									id="prod-categoria"
									disabled={isSubmitting || loadingLookups}
									{...register("id_categoria")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								>
									<option value="">{loadingLookups ? "Cargando..." : "Seleccionar..."}</option>
									{categories.map((cat) => (
										<option key={cat.id_categoria} value={String(cat.id_categoria)}>
											{cat.nombre}
										</option>
									))}
								</select>
								{fieldErrors.id_categoria && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.id_categoria.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="prod-marca"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Marca *
								</label>
								<select
									id="prod-marca"
									disabled={isSubmitting || loadingLookups}
									{...register("id_marca")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								>
									<option value="">{loadingLookups ? "Cargando..." : "Seleccionar..."}</option>
									{brands.map((brand) => (
										<option key={brand.id_marca} value={String(brand.id_marca)}>
											{brand.nombre}
										</option>
									))}
								</select>
								{fieldErrors.id_marca && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.id_marca.message}</p>
								)}
							</div>
						</div>

						{/* SKU y Lote */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label htmlFor="prod-sku" className="block text-sm font-medium text-brand-white mb-1.5">
									Código SKU (máx. 8) *
								</label>
								<input
									id="prod-sku"
									type="text"
									maxLength={8}
									disabled={isSubmitting}
									placeholder="LP-AS-03"
									{...register("codigo_sku")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.codigo_sku && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.codigo_sku.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="prod-lote"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Número de lote *
								</label>
								<input
									id="prod-lote"
									type="text"
									maxLength={20}
									disabled={isSubmitting}
									placeholder="LOTE-2026-01"
									{...register("numero_lote")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm font-mono text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.numero_lote && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.numero_lote.message}</p>
								)}
							</div>
						</div>

						{/* Modelo */}
						<div>
							<label htmlFor="prod-modelo" className="block text-sm font-medium text-brand-white mb-1.5">
								Modelo / Nombre del producto *
							</label>
							<input
								id="prod-modelo"
								type="text"
								maxLength={100}
								disabled={isSubmitting}
								placeholder="Ej. ROG Zephyrus G14 (2026)"
								{...register("modelo")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							/>
							{fieldErrors.modelo && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.modelo.message}</p>
							)}
						</div>

						{/* Descripción */}
						<div>
							<label
								htmlFor="prod-descripcion"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Descripción (máx. 200)
							</label>
							<textarea
								id="prod-descripcion"
								rows={3}
								maxLength={200}
								disabled={isSubmitting}
								placeholder="Resumen breve de características principales (opcional)..."
								{...register("descripcion")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors resize-none disabled:opacity-60"
							/>
							{fieldErrors.descripcion && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.descripcion.message}</p>
							)}
						</div>

						{/* Precios y Stock */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<div>
								<label
									htmlFor="prod-costo"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Precio costo *
								</label>
								<input
									id="prod-costo"
									type="number"
									step="0.01"
									min="0"
									disabled={isSubmitting}
									placeholder="0.00"
									{...register("precio_costo")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.precio_costo && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.precio_costo.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="prod-venta"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Precio venta *
								</label>
								<input
									id="prod-venta"
									type="number"
									step="0.01"
									min="0"
									disabled={isSubmitting}
									placeholder="0.00"
									{...register("precio_venta")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.precio_venta && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.precio_venta.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="prod-stock"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Stock *
								</label>
								<input
									id="prod-stock"
									type="number"
									step="1"
									min="0"
									disabled={isSubmitting}
									placeholder="0"
									{...register("stock")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.stock && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.stock.message}</p>
								)}
							</div>
						</div>

						{/* URL Imagen + preview */}
						<div>
							<label htmlFor="prod-img" className="block text-sm font-medium text-brand-white mb-1.5">
								URL de imagen (máx. 500)
							</label>
							<div className="flex items-center gap-3">
								<input
									id="prod-img"
									type="url"
									maxLength={500}
									disabled={isSubmitting}
									placeholder="https://.../imagen.png"
									{...register("url_img")}
									className="flex-1 bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								<div className="w-11 h-11 rounded-xl bg-brand-bg border border-brand-divider flex items-center justify-center overflow-hidden shrink-0">
									{urlImgActual?.trim() ? (
										<img
											src={urlImgActual}
											alt="Preview"
											className="w-full h-full object-contain"
										/>
									) : (
										<ImageIcon size={18} className="text-brand-muted" />
									)}
								</div>
							</div>
							{fieldErrors.url_img && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.url_img.message}</p>
							)}
						</div>

						{/* Estado */}
						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Estado</p>
								<p className="text-xs text-brand-muted">
									{estadoActual ? "Visible y activo en catálogo" : "Producto inactivo"}
								</p>
							</div>
							<label className="inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									disabled={isSubmitting}
									{...register("estado")}
									className="sr-only peer"
								/>
								<div className="relative w-11 h-6 bg-brand-surface rounded-full peer peer-checked:bg-brand-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-brand-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
							</label>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								disabled={isSubmitting || loadingLookups}
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
							>
								{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
								<span>
									{isSubmitting ? "Guardando..." : editingId ? "Guardar Cambios" : "Crear Producto"}
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
				<div className="lg:col-span-7 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
						<div className="relative flex-1">
							<Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Buscar por modelo, SKU, marca o categoría..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						<span className="text-xs text-brand-muted shrink-0">Total en BD: {totalCount} registros</span>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-16 text-brand-muted gap-3">
							<Loader2 className="w-7 h-7 text-brand-primary animate-spin" />
							<p className="text-sm">Cargando productos...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
										<th className="py-3 px-3">Producto</th>
										<th className="py-3 px-3">Cat. / Marca</th>
										<th className="py-3 px-3">Precio Venta</th>
										<th className="py-3 px-3">Stock</th>
										<th className="py-3 px-3 text-right">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-brand-divider/60 text-sm">
									{filtered.length > 0 ? (
										filtered.map((item) => (
											<tr
												key={item.id_producto}
												className="hover:bg-brand-bg/40 transition-colors"
											>
												<td className="py-3.5 px-3">
													<div className="flex items-center gap-3">
														<img
															src={item.url_img?.trim() || FALLBACK_THUMB}
															alt={item.modelo}
															className="w-11 h-11 rounded-lg object-contain bg-brand-bg border border-brand-divider shrink-0"
														/>
														<div className="min-w-0">
															<p className="font-medium text-brand-white truncate max-w-50">
																{item.modelo}
															</p>
															<p className="font-mono text-xs text-brand-muted">
																#{item.id_producto} · {item.codigo_sku}
															</p>
														</div>
													</div>
												</td>
												<td className="py-3.5 px-3">
													<p className="text-xs font-medium text-brand-white">
														{getCategoryName(item.id_categoria)}
													</p>
													<p className="text-xs text-brand-muted mt-0.5">
														{getBrandName(item.id_marca)}
													</p>
												</td>
												<td className="py-3.5 px-3 font-semibold text-brand-primary whitespace-nowrap">
													L.{" "}
													{Number(item.precio_venta).toLocaleString("es-HN", {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</td>
												<td className="py-3.5 px-3">
													<span
														className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
															item.stock === 0
																? "bg-red-500/15 text-red-300 border-red-500/30"
																: item.stock <= 3
																	? "bg-amber-500/15 text-amber-300 border-amber-500/30"
																	: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
														}`}
													>
														{item.stock} uds
													</span>
												</td>
												<td className="py-3.5 px-3">
													<div className="flex items-center justify-end gap-2">
														<button
															type="button"
															onClick={() => handleEdit(item)}
															disabled={
																deletingId === item.id_producto ||
																loadingEditId === item.id_producto
															}
															className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
															title="Editar"
														>
															{loadingEditId === item.id_producto ? (
																<Loader2 size={16} className="animate-spin" />
															) : (
																<Pencil size={16} />
															)}
														</button>
														<button
															type="button"
															onClick={() => handleDelete(item.id_producto)}
															disabled={deletingId === item.id_producto}
															className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
															title="Eliminar"
														>
															{deletingId === item.id_producto ? (
																<Loader2 size={16} className="animate-spin" />
															) : (
																<Trash2 size={16} />
															)}
														</button>
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={5} className="py-10 text-center text-brand-muted">
												No hay productos que coincidan con la búsqueda.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}

					{/* Paginación */}
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
