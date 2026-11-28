import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Pencil,
	Percent,
	Plus,
	RefreshCw,
	Search,
	Trash2,
	X,
	XCircle,
} from "lucide-react";
import { useAdminPromotions } from "../../hooks/useAdminPromotions";

export function AdminPromotionsPage() {
	const {
		register,
		fieldErrors,
		isSubmitting,
		estadoActual,
		fechaInicioActual,
		onSubmit,
		filtered,
		promotionTypes,
		loadingTypes,
		getTypeName,
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
	} = useAdminPromotions();

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5 text-brand-primary mb-1">
						<Percent size={22} />
						<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
					</div>
					<h1 className="text-3xl font-bold text-brand-white">Gestión de Promociones</h1>
					<p className="text-brand-muted text-sm mt-1">
						Configura descuentos, vigencias y reglas de cantidad requerida y beneficio.
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
							{editingId ? `Editar Promoción #${editingId}` : "Nueva Promoción"}
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
							<label htmlFor="promo-tipo" className="block text-sm font-medium text-brand-white mb-1.5">
								Tipo de promoción *
							</label>
							<select
								id="promo-tipo"
								disabled={isSubmitting || loadingTypes}
								{...register("id_tipo_promocion")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							>
								<option value="">{loadingTypes ? "Cargando tipos..." : "Selecciona un tipo..."}</option>
								{promotionTypes.map((tipo) => (
									<option key={tipo.id_tipo_promocion} value={String(tipo.id_tipo_promocion)}>
										{tipo.nombre}
									</option>
								))}
							</select>
							{fieldErrors.id_tipo_promocion && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.id_tipo_promocion.message}</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label
									htmlFor="promo-inicio"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Fecha inicio *
								</label>
								<input
									id="promo-inicio"
									type="date"
									disabled={isSubmitting}
									{...register("fecha_inicio")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.fecha_inicio && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.fecha_inicio.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="promo-fin"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Vencimiento
								</label>
								<input
									id="promo-fin"
									type="date"
									min={fechaInicioActual || undefined}
									disabled={isSubmitting}
									{...register("fecha_vencimiento")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.fecha_vencimiento && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.fecha_vencimiento.message}</p>
								)}
							</div>
						</div>
						<p className="text-xs text-brand-muted -mt-2">
							Deja vencimiento vacío para descuentos permanentes (ej. tercera edad).
						</p>

						<div>
							<label
								htmlFor="promo-descuento"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Porcentaje de descuento (%) *
							</label>
							<input
								id="promo-descuento"
								type="number"
								step="0.01"
								min="0.01"
								max="100"
								disabled={isSubmitting}
								placeholder="Ej. 15.00"
								{...register("porcentaje_descuento")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							/>
							{fieldErrors.porcentaje_descuento && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.porcentaje_descuento.message}</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label
									htmlFor="promo-req"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Cant. requerida *
								</label>
								<input
									id="promo-req"
									type="number"
									step="1"
									min="1"
									disabled={isSubmitting}
									{...register("cantidad_requerida")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.cantidad_requerida && (
									<p className="text-xs text-red-400 mt-1">
										{fieldErrors.cantidad_requerida.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="promo-ben"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Cant. beneficio *
								</label>
								<input
									id="promo-ben"
									type="number"
									step="1"
									min="1"
									disabled={isSubmitting}
									{...register("cantidad_beneficio")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
								/>
								{fieldErrors.cantidad_beneficio && (
									<p className="text-xs text-red-400 mt-1">
										{fieldErrors.cantidad_beneficio.message}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Estado</p>
								<p className="text-xs text-brand-muted">
									{estadoActual ? "Promoción activa" : "Promoción inactiva"}
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
								disabled={isSubmitting || loadingTypes}
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
							>
								{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
								<span>
									{isSubmitting ? "Guardando..." : editingId ? "Guardar Cambios" : "Crear Promoción"}
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
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
						<div className="relative flex-1">
							<Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Buscar por tipo, descuento o fecha..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						<span className="text-xs text-brand-muted shrink-0">Total en BD: {totalCount} registros</span>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-16 text-brand-muted gap-3">
							<Loader2 className="w-7 h-7 text-brand-primary animate-spin" />
							<p className="text-sm">Cargando promociones...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
										<th className="py-3 px-3">ID / Tipo</th>
										<th className="py-3 px-3">Descuento</th>
										<th className="py-3 px-3">Regla</th>
										<th className="py-3 px-3">Vigencia</th>
										<th className="py-3 px-3">Estado</th>
										<th className="py-3 px-3 text-right">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-brand-divider/60 text-sm">
									{filtered.length > 0 ? (
										filtered.map((item) => (
											<tr
												key={item.id_promocion}
												className="hover:bg-brand-bg/40 transition-colors"
											>
												<td className="py-3.5 px-3">
													<p className="font-medium text-brand-white">
														{getTypeName(item.id_tipo_promocion)}
													</p>
													<span className="font-mono text-xs text-brand-muted">
														#{item.id_promocion}
													</span>
												</td>
												<td className="py-3.5 px-3">
													<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/20 text-brand-primary border border-brand-primary/30 whitespace-nowrap">
														{Number(item.porcentaje_descuento)}% OFF
													</span>
												</td>
												<td className="py-3.5 px-3 text-xs text-brand-muted whitespace-nowrap">
													Compra{" "}
													<strong className="text-brand-white">
														{item.cantidad_requerida}
													</strong>{" "}
													→ Benef.{" "}
													<strong className="text-brand-white">
														{item.cantidad_beneficio}
													</strong>
												</td>
												<td className="py-3.5 px-3 text-xs font-mono text-brand-muted whitespace-nowrap">
													<div className="inline-flex items-center gap-1.5">
														<Calendar size={12} className="text-brand-primary" />
														<span>{item.fecha_inicio}</span>
													</div>
													<p className="mt-0.5 text-brand-muted/80">
														{item.fecha_vencimiento
															? `Hasta ${item.fecha_vencimiento}`
															: "Sin vencimiento"}
													</p>
												</td>
												<td className="py-3.5 px-3">
													{item.estado ? (
														<span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
															<CheckCircle2 size={12} /> Activa
														</span>
													) : (
														<span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
															<XCircle size={12} /> Inactiva
														</span>
													)}
												</td>
												<td className="py-3.5 px-3">
													<div className="flex items-center justify-end gap-2">
														<button
															type="button"
															onClick={() => handleEdit(item)}
															disabled={deletingId === item.id_promocion}
															className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
															title="Editar"
														>
															<Pencil size={16} />
														</button>
														<button
															type="button"
															onClick={() => handleDelete(item.id_promocion)}
															disabled={deletingId === item.id_promocion}
															className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
															title="Eliminar"
														>
															{deletingId === item.id_promocion ? (
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
											<td colSpan={6} className="py-10 text-center text-brand-muted">
												No hay promociones que coincidan con la búsqueda.
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
