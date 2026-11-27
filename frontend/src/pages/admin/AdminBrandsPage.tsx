import { useState, type FormEvent } from "react";
import { Tag, Pencil, Trash2, Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CountryOption {
	id_pais: number;
	nombre: string;
}

interface BrandItem {
	id_marca: number;
	nombre: string;
	id_pais: number;
}

interface BrandPayload {
	nombre: string;
	id_pais: number | null;
}

// TODO: Cargar países con GET /api/v1/paises/
const MOCK_COUNTRIES: CountryOption[] = [
	{ id_pais: 1, nombre: "China" },
	{ id_pais: 2, nombre: "Taiwan" },
	{ id_pais: 3, nombre: "Estados Unidos" },
];

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/marcas/?page=...
const INITIAL_MOCK: BrandItem[] = [
	{ id_marca: 2, nombre: "ASUS", id_pais: 2 },
	{ id_marca: 5, nombre: "Apple", id_pais: 3 },
	{ id_marca: 4, nombre: "DELL", id_pais: 3 },
	{ id_marca: 3, nombre: "HP", id_pais: 3 },
	{ id_marca: 1, nombre: "Lenovo", id_pais: 1 },
];

export function AdminBrandsPage() {
	const [brands, setBrands] = useState<BrandItem[]>(INITIAL_MOCK);
	const [countries] = useState<CountryOption[]>(MOCK_COUNTRIES);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [nombre, setNombre] = useState("");
	const [idPais, setIdPais] = useState<string>("");

	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const getCountryName = (id: number) => countries.find((c) => c.id_pais === id)?.nombre ?? `País #${id}`;

	const filtered = brands.filter(
		(b) =>
			b.nombre.toLowerCase().includes(search.toLowerCase()) ||
			getCountryName(b.id_pais).toLowerCase().includes(search.toLowerCase()),
	);

	const resetForm = () => {
		setEditingId(null);
		setNombre("");
		setIdPais("");
	};

	const handleEdit = (item: BrandItem) => {
		setEditingId(item.id_marca);
		setNombre(item.nombre);
		setIdPais(String(item.id_pais));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!nombre.trim() || !idPais) return;

		const payload: BrandPayload = {
			nombre: nombre.trim(),
			id_pais: idPais ? Number(idPais) : null,
		};

		if (editingId !== null && payload.id_pais !== null) {
			// TODO: PATCH /api/v1/marcas/${editingId}/ con payload
			setBrands((prev) =>
				prev.map((b) =>
					b.id_marca === editingId ? { ...b, nombre: payload.nombre, id_pais: payload.id_pais! } : b,
				),
			);
		} else if (payload.id_pais !== null) {
			// TODO: POST /api/v1/marcas/ con payload
			const nextId = brands.length > 0 ? Math.max(...brands.map((b) => b.id_marca)) + 1 : 1;
			setBrands((prev) => [...prev, { id_marca: nextId, nombre: payload.nombre, id_pais: payload.id_pais! }]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/marcas/${id}/
		setBrands((prev) => prev.filter((b) => b.id_marca !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-[1200px] mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<Tag size={22} />
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Gestión de Marcas</h1>
				<p className="text-brand-muted text-sm mt-1">
					Administra los fabricantes y marcas vinculadas a su país de origen.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Marca #${editingId}` : "Nueva Marca"}
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
							<label htmlFor="marca-nombre" className="block text-sm font-medium text-brand-white mb-1.5">
								Nombre de la marca *
							</label>
							<input
								id="marca-nombre"
								type="text"
								required
								maxLength={100}
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="Ej. ASUS, Corsair, NVIDIA..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<div>
							<label htmlFor="marca-pais" className="block text-sm font-medium text-brand-white mb-1.5">
								País de origen *
							</label>
							<select
								id="marca-pais"
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

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors cursor-pointer"
							>
								<Plus size={16} />
								<span>{editingId ? "Guardar Cambios" : "Crear Marca"}</span>
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
								placeholder="Buscar marca o país..."
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
									<th className="py-3 px-3">Marca</th>
									<th className="py-3 px-3">País</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr key={item.id_marca} className="hover:bg-brand-bg/40 transition-colors">
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
												#{item.id_marca}
											</td>
											<td className="py-3.5 px-3 font-medium text-brand-white">{item.nombre}</td>
											<td className="py-3.5 px-3 text-brand-muted">
												<span className="px-2.5 py-1 rounded-full text-xs bg-brand-bg border border-brand-divider text-brand-white">
													{getCountryName(item.id_pais)}
												</span>
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
														onClick={() => handleDelete(item.id_marca)}
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
										<td colSpan={4} className="py-10 text-center text-brand-muted">
											No hay marcas registradas.
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
