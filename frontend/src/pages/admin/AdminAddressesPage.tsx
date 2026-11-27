import { useState, type FormEvent } from "react";
import { MapPin, Pencil, Trash2, Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CityOption {
	id_ciudad: number;
	nombre: string;
}

interface AddressItem {
	id_direccion: number;
	id_ciudad: number;
	calle: string;
	referencias: string;
}

interface AddressPayload {
	id_ciudad: number | null;
	calle: string;
	referencias: string;
}

// TODO: Cargar ciudades con GET /api/v1/ciudades/
const MOCK_CITIES: CityOption[] = [
	{ id_ciudad: 1, nombre: "Shenzhen" },
	{ id_ciudad: 2, nombre: "Chengdu" },
	{ id_ciudad: 3, nombre: "Ciudad de Taipéi" },
	{ id_ciudad: 4, nombre: "Ciudad de Hsinchu" },
	{ id_ciudad: 5, nombre: "San Francisco" },
	{ id_ciudad: 6, nombre: "Austin" },
];

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/direcciones/?page=...
const INITIAL_MOCK: AddressItem[] = [
	{
		id_direccion: 1,
		id_ciudad: 1,
		calle: "Keji South 12th Rd, Nanshan District",
		referencias: "Cerca de Hi-Tech Park, edificio tecnológico de 15 pisos",
	},
	{
		id_direccion: 2,
		id_ciudad: 2,
		calle: "Tianfu Ave South, Wuhou District",
		referencias: "Frente a Tianfu Software Park, acceso por entrada sur",
	},
];

export function AdminAddressesPage() {
	const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_MOCK);
	const [cities] = useState<CityOption[]>(MOCK_CITIES);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [idCiudad, setIdCiudad] = useState<string>("");
	const [calle, setCalle] = useState("");
	const [referencias, setReferencias] = useState("");

	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const getCityName = (id: number) => cities.find((c) => c.id_ciudad === id)?.nombre ?? `Ciudad #${id}`;

	const filtered = addresses.filter(
		(a) =>
			a.calle.toLowerCase().includes(search.toLowerCase()) ||
			a.referencias.toLowerCase().includes(search.toLowerCase()) ||
			getCityName(a.id_ciudad).toLowerCase().includes(search.toLowerCase()),
	);

	const resetForm = () => {
		setEditingId(null);
		setIdCiudad("");
		setCalle("");
		setReferencias("");
	};

	const handleEdit = (item: AddressItem) => {
		setEditingId(item.id_direccion);
		setIdCiudad(String(item.id_ciudad));
		setCalle(item.calle);
		setReferencias(item.referencias ?? "");
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!calle.trim() || !idCiudad) return;

		const payload: AddressPayload = {
			id_ciudad: idCiudad ? Number(idCiudad) : null,
			calle: calle.trim(),
			referencias: referencias.trim(),
		};

		if (editingId !== null && payload.id_ciudad !== null) {
			// TODO: PATCH /api/v1/direcciones/${editingId}/ con payload
			setAddresses((prev) =>
				prev.map((a) =>
					a.id_direccion === editingId
						? {
								...a,
								id_ciudad: payload.id_ciudad!,
								calle: payload.calle,
								referencias: payload.referencias,
							}
						: a,
				),
			);
		} else if (payload.id_ciudad !== null) {
			// TODO: POST /api/v1/direcciones/ con payload
			const nextId = addresses.length > 0 ? Math.max(...addresses.map((a) => a.id_direccion)) + 1 : 1;
			setAddresses((prev) => [
				...prev,
				{
					id_direccion: nextId,
					id_ciudad: payload.id_ciudad!,
					calle: payload.calle,
					referencias: payload.referencias,
				},
			]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/direcciones/${id}/
		setAddresses((prev) => prev.filter((a) => a.id_direccion !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<MapPin size={22} />
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Gestión de Direcciones</h1>
				<p className="text-brand-muted text-sm mt-1">
					Registra direcciones físicas asociadas a una ciudad para clientes, sucursales y proveedores.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Dirección #${editingId}` : "Nueva Dirección"}
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
							<label htmlFor="dir-ciudad" className="block text-sm font-medium text-brand-white mb-1.5">
								Ciudad *
							</label>
							<select
								id="dir-ciudad"
								required
								value={idCiudad}
								onChange={(e) => setIdCiudad(e.target.value)}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
							>
								<option value="" disabled>
									Selecciona una ciudad...
								</option>
								{cities.map((ciudad) => (
									<option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
										{ciudad.nombre}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="dir-calle" className="block text-sm font-medium text-brand-white mb-1.5">
								Calle / Colonia *
							</label>
							<input
								id="dir-calle"
								type="text"
								required
								maxLength={100}
								value={calle}
								onChange={(e) => setCalle(e.target.value)}
								placeholder="Ej. Blvd. Morazán, Col. Palmira..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<div>
							<label
								htmlFor="dir-referencias"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Referencias
							</label>
							<textarea
								id="dir-referencias"
								rows={4}
								maxLength={500}
								value={referencias}
								onChange={(e) => setReferencias(e.target.value)}
								placeholder="Puntos de referencia, edificio, portón (opcional)..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors resize-none"
							/>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors cursor-pointer"
							>
								<Plus size={16} />
								<span>{editingId ? "Guardar Cambios" : "Crear Dirección"}</span>
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
								placeholder="Buscar por calle, referencias o ciudad..."
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
									<th className="py-3 px-3">Calle</th>
									<th className="py-3 px-3">Referencias</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr key={item.id_direccion} className="hover:bg-brand-bg/40 transition-colors">
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
												#{item.id_direccion}
											</td>
											<td className="py-3.5 px-3 shrink-0">
												<span className="px-2.5 py-1 rounded-full text-xs bg-brand-bg border border-brand-divider text-brand-white whitespace-nowrap">
													{getCityName(item.id_ciudad)}
												</span>
											</td>
											<td className="py-3.5 px-3 font-medium text-brand-white max-w-50 truncate">
												{item.calle}
											</td>
											<td className="py-3.5 px-3 text-brand-muted max-w-55 truncate">
												{item.referencias || (
													<span className="italic opacity-60">Sin referencias</span>
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
														onClick={() => handleDelete(item.id_direccion)}
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
											No hay direcciones registradas.
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
