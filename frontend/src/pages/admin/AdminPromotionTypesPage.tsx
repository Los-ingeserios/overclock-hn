import {
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Tags,
	Trash2,
	X,
} from "lucide-react";
import { useAdminPromotionTypes } from "../../hooks/useAdminPromotionTypes";

export function AdminPromotionTypesPage() {
	const {
		register,
		fieldErrors,
		isSubmitting,
		onSubmit,
		filtered,
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
	} = useAdminPromotionTypes();

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5 text-brand-primary mb-1">
						<Tags size={22} />
						<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
					</div>
					<h1 className="text-3xl font-bold text-brand-white">Tipos de Promoción</h1>
					<p className="text-brand-muted text-sm mt-1">
						Define las campañas o categorías de descuento (temporada, combos, tercera edad, etc.).
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
							{editingId ? `Editar Tipo #${editingId}` : "Nuevo Tipo de Promoción"}
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
								htmlFor="tpromo-nombre"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Nombre *
							</label>
							<input
								id="tpromo-nombre"
								type="text"
								maxLength={100}
								disabled={isSubmitting}
								placeholder="Ej. Promoción de Invierno, 2x1 Gaming..."
								{...register("nombre")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-60"
							/>
							{fieldErrors.nombre && (
								<p className="text-xs text-red-400 mt-1.5">{fieldErrors.nombre.message}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="tpromo-descripcion"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Descripción
							</label>
							<textarea
								id="tpromo-descripcion"
								rows={4}
								maxLength={500}
								disabled={isSubmitting}
								placeholder="Condiciones o detalle de este tipo de promoción (opcional)..."
								{...register("descripcion")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors resize-none disabled:opacity-60"
							/>
							{fieldErrors.descripcion && (
								<p className="text-xs text-red-400 mt-1.5">{fieldErrors.descripcion.message}</p>
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
									{isSubmitting ? "Guardando..." : editingId ? "Guardar Cambios" : "Crear Tipo"}
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
								placeholder="Buscar por nombre o descripción..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						<span className="text-xs text-brand-muted shrink-0">Total en BD: {totalCount} registros</span>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-16 text-brand-muted gap-3">
							<Loader2 className="w-7 h-7 text-brand-primary animate-spin" />
							<p className="text-sm">Cargando tipos de promoción...</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
										<th className="py-3 px-3">ID</th>
										<th className="py-3 px-3">Nombre</th>
										<th className="py-3 px-3">Descripción</th>
										<th className="py-3 px-3 text-right">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-brand-divider/60 text-sm">
									{filtered.length > 0 ? (
										filtered.map((item) => (
											<tr
												key={item.id_tipo_promocion}
												className="hover:bg-brand-bg/40 transition-colors"
											>
												<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
													#{item.id_tipo_promocion}
												</td>
												<td className="py-3.5 px-3 font-medium text-brand-white">
													{item.nombre}
												</td>
												<td className="py-3.5 px-3 text-brand-muted max-w-xs truncate">
													{item.descripcion || (
														<span className="italic opacity-60">Sin descripción</span>
													)}
												</td>
												<td className="py-3.5 px-3">
													<div className="flex items-center justify-end gap-2">
														<button
															type="button"
															onClick={() => handleEdit(item)}
															disabled={deletingId === item.id_tipo_promocion}
															className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
															title="Editar"
														>
															<Pencil size={16} />
														</button>
														<button
															type="button"
															onClick={() => handleDelete(item.id_tipo_promocion)}
															disabled={deletingId === item.id_tipo_promocion}
															className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
															title="Eliminar"
														>
															{deletingId === item.id_tipo_promocion ? (
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
											<td colSpan={4} className="py-10 text-center text-brand-muted">
												No hay tipos de promoción que coincidan con la búsqueda.
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
