import { useState, type FormEvent } from "react";
import {
	Building2,
	Pencil,
	Trash2,
	Search,
	Plus,
	X,
	CheckCircle2,
	XCircle,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

interface DepartmentOption {
	id_departamento: number;
	nombre: string;
}

interface CityItem {
	id_ciudad: number;
	id_departamento: number;
	nombre: string;
	codigo_postal: string;
	estado: boolean;
}

interface CityPayload {
	id_departamento: number | null;
	nombre: string;
	codigo_postal: string;
	estado: boolean;
}

// TODO: Cargar departamentos con GET /api/v1/departamentos/
const MOCK_DEPARTMENTS: DepartmentOption[] = [
	{ id_departamento: 1, nombre: "Guangdong" },
	{ id_departamento: 2, nombre: "Sichuan" },
	{ id_departamento: 3, nombre: "Taipéi" },
	{ id_departamento: 4, nombre: "Hsinchu" },
	{ id_departamento: 5, nombre: "California" },
	{ id_departamento: 6, nombre: "Texas" },
];

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/ciudades/?page=...
const INITIAL_MOCK: CityItem[] = [
	{ id_ciudad: 1, id_departamento: 1, nombre: "Shenzhen", codigo_postal: "12345", estado: true },
	{ id_ciudad: 2, id_departamento: 2, nombre: "Chengdu", codigo_postal: "61000", estado: true },
	{ id_ciudad: 3, id_departamento: 3, nombre: "Ciudad de Taipéi", codigo_postal: "10000", estado: true },
	{ id_ciudad: 4, id_departamento: 4, nombre: "Ciudad de Hsinchu", codigo_postal: "30000", estado: true },
	{ id_ciudad: 5, id_departamento: 5, nombre: "San Francisco", codigo_postal: "94102", estado: true },
	{ id_ciudad: 6, id_departamento: 6, nombre: "Austin", codigo_postal: "73301", estado: true },
];

export function AdminCitiesPage() {
	const [cities, setCities] = useState<CityItem[]>(INITIAL_MOCK);
	const [departments] = useState<DepartmentOption[]>(MOCK_DEPARTMENTS);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [idDepartamento, setIdDepartamento] = useState<string>("");
	const [nombre, setNombre] = useState("");
	const [codigoPostal, setCodigoPostal] = useState("");
	const [estado, setEstado] = useState(true);

	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const getDepartmentName = (id: number) =>
		departments.find((d) => d.id_departamento === id)?.nombre ?? `Depto #${id}`;

	const filtered = cities.filter(
		(c) =>
			c.nombre.toLowerCase().includes(search.toLowerCase()) ||
			c.codigo_postal.toLowerCase().includes(search.toLowerCase()) ||
			getDepartmentName(c.id_departamento).toLowerCase().includes(search.toLowerCase()),
	);

	const resetForm = () => {
		setEditingId(null);
		setIdDepartamento("");
		setNombre("");
		setCodigoPostal("");
		setEstado(true);
	};

	const handleEdit = (item: CityItem) => {
		setEditingId(item.id_ciudad);
		setIdDepartamento(String(item.id_departamento));
		setNombre(item.nombre);
		setCodigoPostal(item.codigo_postal);
		setEstado(item.estado);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const cp = codigoPostal.trim();
		if (!nombre.trim() || !idDepartamento || cp.length !== 5) return;

		const payload: CityPayload = {
			id_departamento: idDepartamento ? Number(idDepartamento) : null,
			nombre: nombre.trim(),
			codigo_postal: cp,
			estado,
		};

		if (editingId !== null && payload.id_departamento !== null) {
			// TODO: PATCH /api/v1/ciudades/${editingId}/ con payload
			setCities((prev) =>
				prev.map((c) =>
					c.id_ciudad === editingId
						? {
								...c,
								id_departamento: payload.id_departamento!,
								nombre: payload.nombre,
								codigo_postal: payload.codigo_postal,
								estado: payload.estado,
							}
						: c,
				),
			);
		} else if (payload.id_departamento !== null) {
			// TODO: POST /api/v1/ciudades/ con payload
			const nextId = cities.length > 0 ? Math.max(...cities.map((c) => c.id_ciudad)) + 1 : 1;
			setCities((prev) => [
				...prev,
				{
					id_ciudad: nextId,
					id_departamento: payload.id_departamento!,
					nombre: payload.nombre,
					codigo_postal: payload.codigo_postal,
					estado: payload.estado,
				},
			]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/ciudades/${id}/
		setCities((prev) => prev.filter((c) => c.id_ciudad !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<Building2 size={22} />
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Gestión de Ciudades</h1>
				<p className="text-brand-muted text-sm mt-1">
					Administra las ciudades y sus códigos postales por departamento.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Ciudad #${editingId}` : "Nueva Ciudad"}
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
							<label htmlFor="ciudad-depto" className="block text-sm font-medium text-brand-white mb-1.5">
								Departamento *
							</label>
							<select
								id="ciudad-depto"
								required
								value={idDepartamento}
								onChange={(e) => setIdDepartamento(e.target.value)}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
							>
								<option value="" disabled>
									Selecciona un departamento...
								</option>
								{departments.map((depto) => (
									<option key={depto.id_departamento} value={depto.id_departamento}>
										{depto.nombre}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor="ciudad-nombre"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Nombre de la ciudad *
							</label>
							<input
								id="ciudad-nombre"
								type="text"
								required
								maxLength={100}
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="Ej. Tegucigalpa, San Pedro Sula..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<div>
							<label htmlFor="ciudad-cp" className="block text-sm font-medium text-brand-white mb-1.5">
								Código postal (5 caracteres) *
							</label>
							<input
								id="ciudad-cp"
								type="text"
								required
								minLength={5}
								maxLength={5}
								value={codigoPostal}
								onChange={(e) => setCodigoPostal(e.target.value)}
								placeholder="Ej. 11101"
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm font-mono text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							<p className="text-xs text-brand-muted mt-1">Debe tener exactamente 5 caracteres únicos.</p>
						</div>

						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Estado</p>
								<p className="text-xs text-brand-muted">
									{estado ? "Ciudad activa" : "Ciudad inactiva"}
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
								<span>{editingId ? "Guardar Cambios" : "Crear Ciudad"}</span>
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
								placeholder="Buscar por ciudad, código postal o departamento..."
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
									<th className="py-3 px-3">Ciudad</th>
									<th className="py-3 px-3">Departamento</th>
									<th className="py-3 px-3">Cód. Postal</th>
									<th className="py-3 px-3">Estado</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr key={item.id_ciudad} className="hover:bg-brand-bg/40 transition-colors">
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
												#{item.id_ciudad}
											</td>
											<td className="py-3.5 px-3 font-medium text-brand-white">{item.nombre}</td>
											<td className="py-3.5 px-3">
												<span className="px-2.5 py-1 rounded-full text-xs bg-brand-bg border border-brand-divider text-brand-white">
													{getDepartmentName(item.id_departamento)}
												</span>
											</td>
											<td className="py-3.5 px-3 font-mono text-xs text-brand-white">
												{item.codigo_postal}
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
														onClick={() => handleDelete(item.id_ciudad)}
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
										<td colSpan={6} className="py-10 text-center text-brand-muted">
											No hay ciudades registradas.
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
