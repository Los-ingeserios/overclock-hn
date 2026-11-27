import { useState, type FormEvent } from "react";
import { Users, Pencil, Trash2, Search, Plus, X, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface ClientItem {
	id_cliente: number;
	dni: string;
	rtn: string | null;
	primer_nombre: string;
	segundo_nombre: string;
	primer_apellido: string;
	segundo_apellido: string;
	fecha_nacimiento: string;
	telefono: string;
	correo: string;
	fecha_registro: string;
	razon_social: string;
	estado: boolean;
}

interface ClientPayload {
	dni: string;
	rtn: string | null;
	primer_nombre: string;
	segundo_nombre: string;
	primer_apellido: string;
	segundo_apellido: string;
	fecha_nacimiento: string | null;
	telefono: string;
	correo: string;
	razon_social: string;
	estado: boolean;
}

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/clientes/?page=...
const INITIAL_MOCK: ClientItem[] = [
	{
		id_cliente: 1,
		dni: "0801199804521",
		rtn: "08011998045214",
		primer_nombre: "Carlos",
		segundo_nombre: "Eduardo",
		primer_apellido: "Mejia",
		segundo_apellido: "Pineda",
		fecha_nacimiento: "1998-04-15",
		telefono: "+504 9812-3456",
		correo: "carlos.mejia@ejemplo.hn",
		fecha_registro: "2026-11-26T22:41:12.087606Z",
		razon_social: "",
		estado: true,
	},
	{
		id_cliente: 2,
		dni: "0501199211890",
		rtn: "05011992118902",
		primer_nombre: "Valeria",
		segundo_nombre: "Sofia",
		primer_apellido: "Herrera",
		segundo_apellido: "Lagos",
		fecha_nacimiento: "1992-09-22",
		telefono: "+504 9944-7788",
		correo: "compras@tecnoexpress.hn",
		fecha_registro: "2026-11-26T22:41:18.276277Z",
		razon_social: "TecnoExpress HN S. de R.L.",
		estado: true,
	},
	{
		id_cliente: 3,
		dni: "0801200109334",
		rtn: "08012001093349",
		primer_nombre: "Diego",
		segundo_nombre: "",
		primer_apellido: "Ramos",
		segundo_apellido: "",
		fecha_nacimiento: "2001-01-10",
		telefono: "+504 3210-9876",
		correo: "diego.ramos2001@correo.com",
		fecha_registro: "2026-11-26T22:41:24.944088Z",
		razon_social: "",
		estado: true,
	},
];

// Fecha máxima permitida para cumplir el CHECK de mayor de 18 años en PostgreSQL
const MAX_BIRTH_DATE = `${new Date().getFullYear() - 18}-12-31`;

export function AdminClientsPage() {
	const [clients, setClients] = useState<ClientItem[]>(INITIAL_MOCK);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [dni, setDni] = useState("");
	const [rtn, setRtn] = useState("");
	const [primerNombre, setPrimerNombre] = useState("");
	const [segundoNombre, setSegundoNombre] = useState("");
	const [primerApellido, setPrimerApellido] = useState("");
	const [segundoApellido, setSegundoApellido] = useState("");
	const [fechaNacimiento, setFechaNacimiento] = useState("");
	const [telefono, setTelefono] = useState("");
	const [correo, setCorreo] = useState("");
	const [razonSocial, setRazonSocial] = useState("");
	const [estado, setEstado] = useState(true);

	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const getFullName = (c: ClientItem) =>
		[c.primer_nombre, c.segundo_nombre, c.primer_apellido, c.segundo_apellido].filter(Boolean).join(" ");

	const filtered = clients.filter((c) => {
		const q = search.toLowerCase();
		return (
			getFullName(c).toLowerCase().includes(q) ||
			c.dni.toLowerCase().includes(q) ||
			(c.rtn ?? "").toLowerCase().includes(q) ||
			c.correo.toLowerCase().includes(q) ||
			c.razon_social.toLowerCase().includes(q)
		);
	});

	const resetForm = () => {
		setEditingId(null);
		setDni("");
		setRtn("");
		setPrimerNombre("");
		setSegundoNombre("");
		setPrimerApellido("");
		setSegundoApellido("");
		setFechaNacimiento("");
		setTelefono("");
		setCorreo("");
		setRazonSocial("");
		setEstado(true);
	};

	const handleEdit = (item: ClientItem) => {
		setEditingId(item.id_cliente);
		setDni(item.dni);
		setRtn(item.rtn ?? "");
		setPrimerNombre(item.primer_nombre);
		setSegundoNombre(item.segundo_nombre ?? "");
		setPrimerApellido(item.primer_apellido);
		setSegundoApellido(item.segundo_apellido ?? "");
		setFechaNacimiento(item.fecha_nacimiento);
		setTelefono(item.telefono);
		setCorreo(item.correo);
		setRazonSocial(item.razon_social ?? "");
		setEstado(item.estado);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const cleanDni = dni.trim();
		const cleanRtn = rtn.trim();

		if (
			cleanDni.length !== 13 ||
			(cleanRtn.length > 0 && cleanRtn.length !== 14) ||
			!primerNombre.trim() ||
			!primerApellido.trim() ||
			!fechaNacimiento ||
			!telefono.trim() ||
			!correo.trim()
		) {
			return;
		}

		const payload: ClientPayload = {
			dni: cleanDni,
			// Si el RTN queda vacío se envía null para respetar CHECK(length(rtn) = 14)
			rtn: cleanRtn || null,
			primer_nombre: primerNombre.trim(),
			segundo_nombre: segundoNombre.trim(),
			primer_apellido: primerApellido.trim(),
			segundo_apellido: segundoApellido.trim(),
			fecha_nacimiento: fechaNacimiento || null,
			telefono: telefono.trim(),
			correo: correo.trim(),
			razon_social: razonSocial.trim(),
			estado,
		};

		if (editingId !== null) {
			// TODO: PATCH /api/v1/clientes/${editingId}/ con payload
			setClients((prev) =>
				prev.map((c) =>
					c.id_cliente === editingId
						? {
								...c,
								...payload,
								fecha_nacimiento: payload.fecha_nacimiento ?? c.fecha_nacimiento,
							}
						: c,
				),
			);
		} else {
			// TODO: POST /api/v1/clientes/ con payload
			const nextId = clients.length > 0 ? Math.max(...clients.map((c) => c.id_cliente)) + 1 : 1;
			setClients((prev) => [
				...prev,
				{
					id_cliente: nextId,
					...payload,
					fecha_nacimiento: payload.fecha_nacimiento ?? "",
					fecha_registro: new Date().toISOString(),
				},
			]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/clientes/${id}/
		setClients((prev) => prev.filter((c) => c.id_cliente !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-300 mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<Users size={22} />
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Gestión de Clientes</h1>
				<p className="text-brand-muted text-sm mt-1">
					Registra y administra los clientes naturales y corporativos (RTN / SAR).
				</p>
			</div>

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

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* DNI y RTN */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label htmlFor="cli-dni" className="block text-sm font-medium text-brand-white mb-1.5">
									DNI (13 dígitos) *
								</label>
								<input
									id="cli-dni"
									type="text"
									required
									minLength={13}
									maxLength={13}
									value={dni}
									onChange={(e) => setDni(e.target.value)}
									placeholder="0801199804521"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm font-mono text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
							</div>

							<div>
								<label htmlFor="cli-rtn" className="block text-sm font-medium text-brand-white mb-1.5">
									RTN (14 dígitos)
								</label>
								<input
									id="cli-rtn"
									type="text"
									minLength={14}
									maxLength={14}
									value={rtn}
									onChange={(e) => setRtn(e.target.value)}
									placeholder="08011998045214"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm font-mono text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
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
									required
									maxLength={100}
									value={primerNombre}
									onChange={(e) => setPrimerNombre(e.target.value)}
									placeholder="Carlos"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
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
									value={segundoNombre}
									onChange={(e) => setSegundoNombre(e.target.value)}
									placeholder="Eduardo (opcional)"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
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
									required
									maxLength={100}
									value={primerApellido}
									onChange={(e) => setPrimerApellido(e.target.value)}
									placeholder="Mejía"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
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
									value={segundoApellido}
									onChange={(e) => setSegundoApellido(e.target.value)}
									placeholder="Pineda (opcional)"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
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
									required
									max={MAX_BIRTH_DATE}
									value={fechaNacimiento}
									onChange={(e) => setFechaNacimiento(e.target.value)}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors"
								/>
							</div>

							<div>
								<label htmlFor="cli-tel" className="block text-sm font-medium text-brand-white mb-1.5">
									Teléfono *
								</label>
								<input
									id="cli-tel"
									type="tel"
									required
									maxLength={20}
									value={telefono}
									onChange={(e) => setTelefono(e.target.value)}
									placeholder="+504 9812-3456"
									className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
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
								required
								maxLength={100}
								value={correo}
								onChange={(e) => setCorreo(e.target.value)}
								placeholder="cliente@ejemplo.hn"
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
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
								value={razonSocial}
								onChange={(e) => setRazonSocial(e.target.value)}
								placeholder="Ej. TecnoExpress HN S. de R.L."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						{/* Estado */}
						<div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
							<div>
								<p className="text-sm font-medium text-brand-white">Estado</p>
								<p className="text-xs text-brand-muted">
									{estado ? "Cliente activo" : "Cliente inactivo"}
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
						<span className="text-xs text-brand-muted shrink-0">Total: {filtered.length} registros</span>
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
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr key={item.id_cliente} className="hover:bg-brand-bg/40 transition-colors">
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted align-top">
												#{item.id_cliente}
											</td>
											<td className="py-3.5 px-3 align-top">
												<p className="font-medium text-brand-white">{getFullName(item)}</p>
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
