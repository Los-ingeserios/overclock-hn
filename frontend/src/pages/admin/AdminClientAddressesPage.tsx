import { useState, type FormEvent } from "react";
import { MapPinHouse, Star, Pencil, Trash2, Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ClientOption {
	id_cliente: number;
	nombre_completo: string;
}

interface AddressOption {
	id_direccion: number;
	calle: string;
}

interface ClientAddressItem {
	id_direccion_cliente: number;
	id_direccion: number;
	id_cliente: number;
	predeterminada: boolean;
}

interface ClientAddressPayload {
	id_direccion: number | null;
	id_cliente: number | null;
	predeterminada: boolean;
}

// TODO: Cargar clientes con GET /api/v1/clientes/
const MOCK_CLIENTS: ClientOption[] = [
	{ id_cliente: 1, nombre_completo: "Carlos Eduardo Mejia Pineda" },
	{ id_cliente: 2, nombre_completo: "Valeria Sofia Herrera Lagos" },
	{ id_cliente: 3, nombre_completo: "Diego Ramos" },
];

// TODO: Cargar direcciones con GET /api/v1/direcciones/
const MOCK_ADDRESSES: AddressOption[] = [
	{ id_direccion: 1, calle: "Keji South 12th Rd, Nanshan District" },
	{ id_direccion: 2, calle: "Tianfu Ave South, Wuhou District" },
];

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/direcciones-clientes/?page=...
const INITIAL_MOCK: ClientAddressItem[] = [
	{
		id_direccion_cliente: 1,
		id_direccion: 1,
		id_cliente: 1,
		predeterminada: true,
	},
	{
		id_direccion_cliente: 2,
		id_direccion: 2,
		id_cliente: 2,
		predeterminada: true,
	},
];

export function AdminClientAddressesPage() {
	const [relations, setRelations] = useState<ClientAddressItem[]>(INITIAL_MOCK);
	const [clients] = useState<ClientOption[]>(MOCK_CLIENTS);
	const [addresses] = useState<AddressOption[]>(MOCK_ADDRESSES);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [idCliente, setIdCliente] = useState<string>("");
	const [idDireccion, setIdDireccion] = useState<string>("");
	const [predeterminada, setPredeterminada] = useState(false);

	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const getClientLabel = (id: number) =>
		clients.find((c) => c.id_cliente === id)?.nombre_completo ?? `Cliente #${id}`;

	const getAddressLabel = (id: number) => addresses.find((a) => a.id_direccion === id)?.calle ?? `Dirección #${id}`;

	const filtered = relations.filter((r) => {
		const q = search.toLowerCase();
		return (
			getClientLabel(r.id_cliente).toLowerCase().includes(q) ||
			getAddressLabel(r.id_direccion).toLowerCase().includes(q)
		);
	});

	const resetForm = () => {
		setEditingId(null);
		setIdCliente("");
		setIdDireccion("");
		setPredeterminada(false);
	};

	const handleEdit = (item: ClientAddressItem) => {
		setEditingId(item.id_direccion_cliente);
		setIdCliente(String(item.id_cliente));
		setIdDireccion(String(item.id_direccion));
		setPredeterminada(item.predeterminada);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!idCliente || !idDireccion) return;

		const payload: ClientAddressPayload = {
			id_direccion: idDireccion ? Number(idDireccion) : null,
			id_cliente: idCliente ? Number(idCliente) : null,
			predeterminada,
		};

		if (editingId !== null && payload.id_cliente !== null && payload.id_direccion !== null) {
			// TODO: PATCH /api/v1/direcciones-clientes/${editingId}/ con payload
			setRelations((prev) =>
				prev.map((r) =>
					r.id_direccion_cliente === editingId
						? {
								...r,
								id_cliente: payload.id_cliente!,
								id_direccion: payload.id_direccion!,
								predeterminada: payload.predeterminada,
							}
						: r,
				),
			);
		} else if (payload.id_cliente !== null && payload.id_direccion !== null) {
			// TODO: POST /api/v1/direcciones-clientes/ con payload
			const nextId = relations.length > 0 ? Math.max(...relations.map((r) => r.id_direccion_cliente)) + 1 : 1;
			setRelations((prev) => [
				...prev,
				{
					id_direccion_cliente: nextId,
					id_cliente: payload.id_cliente!,
					id_direccion: payload.id_direccion!,
					predeterminada: payload.predeterminada,
				},
			]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/direcciones-clientes/${id}/
		setRelations((prev) => prev.filter((r) => r.id_direccion_cliente !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<MapPinHouse size={22} />
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Direcciones de Clientes</h1>
				<p className="text-brand-muted text-sm mt-1">
					Asocia direcciones registradas a cada cliente y define su dirección de envío predeterminada.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Relación #${editingId}` : "Asignar Dirección"}
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
							<label htmlFor="dc-cliente" className="block text-sm font-medium text-brand-white mb-1.5">
								Cliente *
							</label>
							<select
								id="dc-cliente"
								required
								value={idCliente}
								onChange={(e) => setIdCliente(e.target.value)}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
							>
								<option value="" disabled>
									Selecciona un cliente...
								</option>
								{clients.map((cli) => (
									<option key={cli.id_cliente} value={cli.id_cliente}>
										#{cli.id_cliente} — {cli.nombre_completo}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="dc-direccion" className="block text-sm font-medium text-brand-white mb-1.5">
								Dirección *
							</label>
							<select
								id="dc-direccion"
								required
								value={idDireccion}
								onChange={(e) => setIdDireccion(e.target.value)}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
							>
								<option value="" disabled>
									Selecciona una dirección...
								</option>
								{addresses.map((dir) => (
									<option key={dir.id_direccion} value={dir.id_direccion}>
										#{dir.id_direccion} — {dir.calle}
									</option>
								))}
							</select>
							<p className="text-xs text-brand-muted mt-1">
								Cada dirección solo puede asignarse a un cliente (restricción UNIQUE).
							</p>
						</div>

						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Predeterminada</p>
								<p className="text-xs text-brand-muted">
									{predeterminada ? "Dirección principal de envío" : "Dirección secundaria"}
								</p>
							</div>
							<label className="inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={predeterminada}
									onChange={(e) => setPredeterminada(e.target.checked)}
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
								<span>{editingId ? "Guardar Cambios" : "Asignar"}</span>
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
								placeholder="Buscar por nombre del cliente o calle..."
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
									<th className="py-3 px-3">Cliente</th>
									<th className="py-3 px-3">Dirección</th>
									<th className="py-3 px-3">Tipo</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr
											key={item.id_direccion_cliente}
											className="hover:bg-brand-bg/40 transition-colors"
										>
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
												#{item.id_direccion_cliente}
											</td>
											<td className="py-3.5 px-3 font-medium text-brand-white">
												{getClientLabel(item.id_cliente)}
											</td>
											<td className="py-3.5 px-3 text-brand-muted max-w-60 truncate">
												{getAddressLabel(item.id_direccion)}
											</td>
											<td className="py-3.5 px-3">
												{item.predeterminada ? (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/40">
														<Star size={12} className="fill-brand-primary" />
														Principal
													</span>
												) : (
													<span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-brand-bg border border-brand-divider text-brand-muted">
														Secundaria
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
														onClick={() => handleDelete(item.id_direccion_cliente)}
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
											No hay direcciones asignadas a clientes.
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
