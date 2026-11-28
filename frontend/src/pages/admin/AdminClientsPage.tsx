import {
	Users,
	Pencil,
	Trash2,
	Search,
	Plus,
	X,
	CheckCircle2,
	XCircle,
	ChevronLeft,
	ChevronRight,
	AlertCircle,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useAdminClients } from "../../hooks/useAdminClients";
import { MAX_BIRTH_DATE } from "../../schemas/client.schema";
import { formatClientName } from "../../lib/format";

export function AdminClientsPage() {
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
	} = useAdminClients();

	return (
		<section className="max-w-full mx-auto px-5 py-8">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5 text-brand-primary mb-1">
						<Users size={22} />
						<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
					</div>
					<h1 className="text-3xl font-bold text-brand-white">Gestión de Clientes</h1>
					<p className="text-brand-muted text-sm mt-1">
						Registra y administra los clientes naturales y corporativos (RTN / SAR).
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

			{/* Alertas de Feedback */}
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
							{editingId ? `Editar Cliente #${editingId}` : "Nuevo Cliente"}
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

					<form onSubmit={onSubmit} className="space-y-4">
						{/* DNI y RTN */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label htmlFor="cli-dni" className="block text-sm font-medium text-brand-white mb-1.5">
									DNI (13 dígitos) *
								</label>
								<input
									id="cli-dni"
									type="text"
									maxLength={13}
									{...register("dni")}
									placeholder="0801199804521"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm font-mono text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.dni && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.dni.message}</p>
								)}
							</div>

							<div>
								<label htmlFor="cli-rtn" className="block text-sm font-medium text-brand-white mb-1.5">
									RTN (14 dígitos)
								</label>
								<input
									id="cli-rtn"
									type="text"
									maxLength={14}
									{...register("rtn")}
									placeholder="08011998045214"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm font-mono text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.rtn && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.rtn.message}</p>
								)}
							</div>
						</div>

						{/* Nombres */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label
									htmlFor="cli-pnombre"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Primer nombre *
								</label>
								<input
									id="cli-pnombre"
									type="text"
									maxLength={100}
									{...register("primer_nombre")}
									placeholder="Carlos"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.primer_nombre && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.primer_nombre.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="cli-snombre"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Segundo nombre
								</label>
								<input
									id="cli-snombre"
									type="text"
									maxLength={100}
									{...register("segundo_nombre")}
									placeholder="Eduardo (opcional)"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.segundo_nombre && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.segundo_nombre.message}</p>
								)}
							</div>
						</div>

						{/* Apellidos */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label
									htmlFor="cli-papellido"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Primer apellido *
								</label>
								<input
									id="cli-papellido"
									type="text"
									maxLength={100}
									{...register("primer_apellido")}
									placeholder="Mejía"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.primer_apellido && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.primer_apellido.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="cli-sapellido"
									className="block text-sm font-medium text-brand-white mb-1.5"
								>
									Segundo apellido
								</label>
								<input
									id="cli-sapellido"
									type="text"
									maxLength={100}
									{...register("segundo_apellido")}
									placeholder="Pineda (opcional)"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.segundo_apellido && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.segundo_apellido.message}</p>
								)}
							</div>
						</div>

						{/* Fecha de nacimiento y Teléfono */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label htmlFor="cli-fnac" className="block text-sm font-medium text-brand-white mb-1.5">
									Fecha nacimiento *
								</label>
								<input
									id="cli-fnac"
									type="date"
									max={MAX_BIRTH_DATE}
									{...register("fecha_nacimiento")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.fecha_nacimiento && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.fecha_nacimiento.message}</p>
								)}
							</div>

							<div>
								<label htmlFor="cli-tel" className="block text-sm font-medium text-brand-white mb-1.5">
									Teléfono *
								</label>
								<input
									id="cli-tel"
									type="tel"
									maxLength={20}
									{...register("telefono")}
									placeholder="+504 9812-3456"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								{fieldErrors.telefono && (
									<p className="text-xs text-red-400 mt-1">{fieldErrors.telefono.message}</p>
								)}
							</div>
						</div>

						{/* Correo */}
						<div>
							<label htmlFor="cli-correo" className="block text-sm font-medium text-brand-white mb-1.5">
								Correo electrónico *
							</label>
							<input
								id="cli-correo"
								type="email"
								maxLength={100}
								{...register("correo")}
								placeholder="cliente@ejemplo.hn"
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							{fieldErrors.correo && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.correo.message}</p>
							)}
						</div>

						{/* Razón Social */}
						<div>
							<label htmlFor="cli-razon" className="block text-sm font-medium text-brand-white mb-1.5">
								Razón social{" "}
								<span className="text-xs font-normal text-brand-muted">
									(opcional, clientes corporativos)
								</span>
							</label>
							<input
								id="cli-razon"
								type="text"
								maxLength={50}
								{...register("razon_social")}
								placeholder="Ej. TecnoExpress HN S. de R.L."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							{fieldErrors.razon_social && (
								<p className="text-xs text-red-400 mt-1">{fieldErrors.razon_social.message}</p>
							)}
						</div>

						{/* Estado */}
						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Estado</p>
								<p className="text-xs text-brand-muted">Estado del cliente en el sistema</p>
							</div>
							<label className="inline-flex items-center cursor-pointer">
								<input type="checkbox" {...register("estado")} className="sr-only peer" />
								<div className="relative w-11 h-6 bg-brand-surface rounded-full peer peer-checked:bg-brand-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-brand-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
							</label>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
							>
								{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
								<span>{editingId ? "Guardar Cambios" : "Crear Cliente"}</span>
							</button>
							{editingId && (
								<button
									type="button"
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
								placeholder="Buscar por nombre, DNI, RTN, correo o empresa..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						<span className="text-xs text-brand-muted shrink-0">Total: {totalCount} registros</span>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
									<th className="py-3 px-3">ID</th>
									<th className="py-3 px-3">Cliente</th>
									<th className="py-3 px-3">DNI / RTN</th>
									<th className="py-3 px-3">Contacto</th>
									<th className="py-3 px-3">Estado</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{loading ? (
									<tr>
										<td colSpan={6} className="py-12 text-center text-brand-muted">
											<div className="inline-flex items-center justify-center gap-2">
												<Loader2 size={18} className="animate-spin text-brand-primary" />
												<span>Cargando clientes...</span>
											</div>
										</td>
									</tr>
								) : filtered.length > 0 ? (
									filtered.map((item) => (
										<tr key={item.id_cliente} className="hover:bg-brand-bg/40 transition-colors">
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted align-top">
												#{item.id_cliente}
											</td>
											<td className="py-3.5 px-3 align-top">
												<p className="font-medium text-brand-white">{formatClientName(item)}</p>
												{item.razon_social && (
													<p className="text-xs text-brand-primary mt-0.5">
														{item.razon_social}
													</p>
												)}
											</td>
											<td className="py-3.5 px-3 font-mono text-xs align-top">
												<p className="text-brand-white">{item.dni}</p>
												<p className="text-brand-muted mt-0.5">{item.rtn || "Sin RTN"}</p>
											</td>
											<td className="py-3.5 px-3 text-xs align-top">
												<p className="text-brand-white">{item.correo}</p>
												<p className="text-brand-muted mt-0.5">{item.telefono}</p>
											</td>
											<td className="py-3.5 px-3 align-top">
												{item.estado ? (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
														<CheckCircle2 size={13} /> Activo
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
														<XCircle size={13} /> Inactivo
													</span>
												)}
											</td>
											<td className="py-3.5 px-3 align-top">
												<div className="flex items-center justify-end gap-2">
													<button
														type="button"
														onClick={() => handleEdit(item)}
														className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
														title="Editar"
													>
														<Pencil size={16} />
													</button>
													<button
														type="button"
														onClick={() => handleDelete(item.id_cliente)}
														disabled={deletingId === item.id_cliente}
														className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
														title="Eliminar"
													>
														{deletingId === item.id_cliente ? (
															<Loader2 size={16} className="animate-spin text-red-400" />
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
											No hay clientes registrados.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Paginación */}
					<div className="flex items-center justify-between pt-5 mt-4 border-t border-brand-divider text-sm">
						<span className="text-xs text-brand-muted">Página {page}</span>
						<div className="flex gap-2">
							<button
								type="button"
								disabled={!hasPrevious}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
							>
								<ChevronLeft size={14} /> Anterior
							</button>
							<button
								type="button"
								disabled={!hasNext}
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
