import { Link } from "react-router-dom";
import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Cpu,
	ExternalLink,
	Loader2,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useAdminSpecifications } from "../../hooks/useAdminSpecifications";

export function AdminSpecificationsPage() {
	const {
		register,
		fieldErrors,
		isSubmitting,
		especificacionActual,
		onSubmit,
		filtered,
		products,
		loadingProducts,
		selectedProductId,
		setSelectedProductId,
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
	} = useAdminSpecifications();

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5 text-brand-primary mb-1">
						<Cpu size={22} />
						<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
					</div>
					<h1 className="text-3xl font-bold text-brand-white">Gestión de Especificaciones</h1>
					<p className="text-brand-muted text-sm mt-1">
						Administra la ficha técnica de cada producto (procesador, RAM, almacenamiento, pantalla, etc.).
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
							{editingId ? `Editar Especificación #${editingId}` : "Nueva Especificación"}
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
							<label
								htmlFor="spec-producto"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Producto *
							</label>
							<select
								id="spec-producto"
								disabled={isSubmitting || loadingProducts}
								{...register("id_producto")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							>
								<option value="">
									{loadingProducts ? "Cargando productos..." : "Selecciona un producto..."}
								</option>
								{products.map((prod) => (
									<option key={prod.id_producto} value={prod.id_producto}>
										[{prod.codigo_sku}] {prod.modelo}
									</option>
								))}
							</select>
							{fieldErrors.id_producto && (
								<p className="text-xs text-red-400 mt-1.5">{fieldErrors.id_producto.message}</p>
							)}
						</div>

						<div>
							<div className="flex items-center justify-between mb-1.5">
								<label htmlFor="spec-texto" className="block text-sm font-medium text-brand-white">
									Especificación *
								</label>
								<span className="text-xs text-brand-muted">{especificacionActual.length}/100</span>
							</div>
							<textarea
								id="spec-texto"
								rows={3}
								maxLength={100}
								disabled={isSubmitting}
								placeholder="Ej. RAM: 32GB DDR5 o Pantalla: 14'' OLED 2.8K 120Hz"
								{...register("especificacion")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors resize-none disabled:opacity-60"
							/>
							<p className="text-xs text-brand-muted mt-1">
								Tip: usa formato <span className="text-brand-white font-mono">Clave: Valor</span> para
								que resalte mejor en la ficha pública.
							</p>
							{fieldErrors.especificacion && (
								<p className="text-xs text-red-400 mt-1.5">{fieldErrors.especificacion.message}</p>
							)}
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
							>
								{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
								<span>
									{isSubmitting
										? "Guardando..."
										: editingId
											? "Guardar Cambios"
											: "Crear Especificación"}
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
								placeholder="Buscar por especificación, modelo o SKU..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<select
							value={selectedProductId}
							onChange={(e) => setSelectedProductId(e.target.value)}
							aria-label="Filtrar por producto"
							className="sm:w-56 bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
						>
							<option value="">Todos los productos</option>
							{products.map((prod) => (
								<option key={prod.id_producto} value={prod.id_producto}>
									{prod.modelo}
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
							<p className="text-sm">Cargando especificaciones...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
										<th className="py-3 px-3">ID</th>
										<th className="py-3 px-3">Producto</th>
										<th className="py-3 px-3">Especificación</th>
										<th className="py-3 px-3 text-right">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-brand-divider/60 text-sm">
									{filtered.length > 0 ? (
										filtered.map((item) => {
											const prod = getProductInfo(item.id_producto);
											return (
												<tr
													key={item.id_especificacion}
													className="hover:bg-brand-bg/40 transition-colors"
												>
													<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
														#{item.id_especificacion}
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
													<td className="py-3.5 px-3 text-brand-white">
														{item.especificacion}
													</td>
													<td className="py-3.5 px-3">
														<div className="flex items-center justify-end gap-2">
															<button
																type="button"
																onClick={() => handleEdit(item)}
																disabled={deletingId === item.id_especificacion}
																className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
																title="Editar"
															>
																<Pencil size={16} />
															</button>
															<button
																type="button"
																onClick={() => handleDelete(item.id_especificacion)}
																disabled={deletingId === item.id_especificacion}
																className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
																title="Eliminar"
															>
																{deletingId === item.id_especificacion ? (
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
											<td colSpan={4} className="py-10 text-center text-brand-muted">
												No hay especificaciones que coincidan con la búsqueda.
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
