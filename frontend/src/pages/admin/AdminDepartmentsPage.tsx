import { useState, type FormEvent } from "react";
import { Pencil, Trash2, Search, Plus, X, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface CountryOption {
	id_pais: number;
	nombre: string;
}

interface DepartmentItem {
	id_departamento: number;
	id_pais: number;
	nombre: string;
	estado: boolean;
}

interface DepartmentPayload {
	id_pais: number | null;
	nombre: string;
	estado: boolean;
}

// TODO: Cargar países con GET /api/v1/paises/
const MOCK_COUNTRIES: CountryOption[] = [
	{ id_pais: 1, nombre: "China" },
	{ id_pais: 2, nombre: "Taiwan" },
	{ id_pais: 3, nombre: "Estados Unidos" },
];

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/departamentos/?page=...
const INITIAL_MOCK: DepartmentItem[] = [
	{ id_departamento: 1, id_pais: 1, nombre: "Guangdong", estado: true },
	{ id_departamento: 2, id_pais: 1, nombre: "Sichuan", estado: true },
	{ id_departamento: 3, id_pais: 2, nombre: "Taipéi", estado: true },
	{ id_departamento: 4, id_pais: 2, nombre: "Hsinchu", estado: true },
	{ id_departamento: 5, id_pais: 3, nombre: "California", estado: true },
	{ id_departamento: 6, id_pais: 3, nombre: "Texas", estado: true },
];

export function AdminDepartmentsPage() {
	const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_MOCK);
	const [countries] = useState<CountryOption[]>(MOCK_COUNTRIES);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [idPais, setIdPais] = useState<string>("");
	const [nombre, setNombre] = useState("");
	const [estado, setEstado] = useState(true);

	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const getCountryName = (id: number) => countries.find((c) => c.id_pais === id)?.nombre ?? `País #${id}`;

	const filtered = departments.filter(
		(d) =>
			d.nombre.toLowerCase().includes(search.toLowerCase()) ||
			getCountryName(d.id_pais).toLowerCase().includes(search.toLowerCase()),
	);

	const resetForm = () => {
		setEditingId(null);
		setIdPais("");
		setNombre("");
		setEstado(true);
	};

	const handleEdit = (item: DepartmentItem) => {
		setEditingId(item.id_departamento);
		setIdPais(String(item.id_pais));
		setNombre(item.nombre);
		setEstado(item.estado);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!nombre.trim() || !idPais) return;

		const payload: DepartmentPayload = {
			id_pais: idPais ? Number(idPais) : null,
			nombre: nombre.trim(),
			estado,
		};

		if (editingId !== null && payload.id_pais !== null) {
			// TODO: PATCH /api/v1/departamentos/${editingId}/ con payload
			setDepartments((prev) =>
				prev.map((d) =>
					d.id_departamento === editingId
						? {
								...d,
								id_pais: payload.id_pais!,
								nombre: payload.nombre,
								estado: payload.estado,
							}
						: d,
				),
			);
		} else if (payload.id_pais !== null) {
			// TODO: POST /api/v1/departamentos/ con payload
			const nextId = departments.length > 0 ? Math.max(...departments.map((d) => d.id_departamento)) + 1 : 1;
			setDepartments((prev) => [
				...prev,
				{
					id_departamento: nextId,
					id_pais: payload.id_pais!,
					nombre: payload.nombre,
					estado: payload.estado,
				},
			]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/departamentos/${id}/
		setDepartments((prev) => prev.filter((d) => d.id_departamento !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Gestión de Departamentos</h1>
				<p className="text-brand-muted text-sm mt-1">
					Administra los departamentos o estados vinculados a cada país.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Departamento #${editingId}` : "Nuevo Departamento"}
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

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="depto-pais" className="block text-sm font-medium text-brand-white mb-1.5">
								País *
							</label>
							<select
								id="depto-pais"
								required
								value={idPais}
								onChange={(e) => setIdPais(e.target.value)}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
							>
								<option value="" disabled>
									Selecciona un país...
								</option>
								{countries.map((pais) => (
									<option key={pais.id_pais} value={pais.id_pais}>
										{pais.nombre}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="depto-nombre" className="block text-sm font-medium text-brand-white mb-1.5">
								Nombre del departamento *
							</label>
							<input
								id="depto-nombre"
								type="text"
								required
								maxLength={100}
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="Ej. Francisco Morazán, Cortés..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Estado</p>
								<p className="text-xs text-brand-muted">
									{estado ? "Departamento activo" : "Departamento inactivo"}
								</p>
							</div>
							<label className="inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={estado}
									onChange={(e) => setEstado(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="relative w-11 h-6 bg-brand-surface rounded-full peer peer-checked:bg-brand-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-brand-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
							</label>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors cursor-pointer"
							>
								<Plus size={16} />
								<span>{editingId ? "Guardar Cambios" : "Crear Departamento"}</span>
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
				<div className="lg:col-span-8 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
						<div className="relative flex-1">
							<Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Buscar departamento o país..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						<span className="text-xs text-brand-muted shrink-0">Total: {filtered.length} registros</span>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-brand-divider text-xs uppercase tracking-wider text-brand-muted">
									<th className="py-3 px-3">ID</th>
									<th className="py-3 px-3">Departamento</th>
									<th className="py-3 px-3">País</th>
									<th className="py-3 px-3">Estado</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr
											key={item.id_departamento}
											className="hover:bg-brand-bg/40 transition-colors"
										>
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
												#{item.id_departamento}
											</td>
											<td className="py-3.5 px-3 font-medium text-brand-white">{item.nombre}</td>
											<td className="py-3.5 px-3">
												<span className="px-2.5 py-1 rounded-full text-xs bg-brand-bg border border-brand-divider text-brand-white">
													{getCountryName(item.id_pais)}
												</span>
											</td>
											<td className="py-3.5 px-3">
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
											<td className="py-3.5 px-3">
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
														onClick={() => handleDelete(item.id_departamento)}
														className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
														title="Eliminar"
													>
														<Trash2 size={16} />
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} className="py-10 text-center text-brand-muted">
											No hay departamentos registrados.
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
