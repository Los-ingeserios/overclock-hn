import { useState, type FormEvent } from "react";
import { FolderTree, Pencil, Trash2, Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryItem {
	id_categoria: number;
	nombre: string;
	descripcion: string;
}

interface CategoryPayload {
	nombre: string;
	descripcion: string;
}

// TODO: Reemplazar estado inicial por [] y cargar con GET /api/v1/categorias/?page=...
const INITIAL_MOCK: CategoryItem[] = [
	{ id_categoria: 1, nombre: "Laptops", descripcion: "Equipos portátiles" },
	{ id_categoria: 2, nombre: "Laptops Convertible / 2-en-1", descripcion: "" },
];

export function AdminCategoriesPage() {
	const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_MOCK);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Campos del POST/PATCH
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");

	// Paginación (conectar con count, next, previous de DRF)
	const [page, setPage] = useState(1);
	const hasPrevious = page > 1;
	const hasNext = false;

	const filtered = categories.filter(
		(c) =>
			c.nombre.toLowerCase().includes(search.toLowerCase()) ||
			c.descripcion.toLowerCase().includes(search.toLowerCase()),
	);

	const resetForm = () => {
		setEditingId(null);
		setNombre("");
		setDescripcion("");
	};

	const handleEdit = (item: CategoryItem) => {
		setEditingId(item.id_categoria);
		setNombre(item.nombre);
		setDescripcion(item.descripcion ?? "");
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!nombre.trim()) return;

		const payload: CategoryPayload = {
			nombre: nombre.trim(),
			descripcion: descripcion.trim(),
		};

		if (editingId !== null) {
			// TODO: PATCH /api/v1/categorias/${editingId}/ con payload
			setCategories((prev) => prev.map((c) => (c.id_categoria === editingId ? { ...c, ...payload } : c)));
		} else {
			// TODO: POST /api/v1/categorias/ con payload
			const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id_categoria)) + 1 : 1;
			setCategories((prev) => [...prev, { id_categoria: nextId, ...payload }]);
		}

		resetForm();
	};

	const handleDelete = (id: number) => {
		// TODO: DELETE /api/v1/categorias/${id}/
		setCategories((prev) => prev.filter((c) => c.id_categoria !== id));
		if (editingId === id) resetForm();
	};

	return (
		<section className="max-w-[1200px] mx-auto px-5 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-2.5 text-brand-primary mb-1">
					<FolderTree size={22} />
					<span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
				</div>
				<h1 className="text-3xl font-bold text-brand-white">Gestión de Categorías</h1>
				<p className="text-brand-muted text-sm mt-1">Crea, edita y administra las categorías del inventario.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Formulario */}
				<div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-brand-white">
							{editingId ? `Editar Categoría #${editingId}` : "Nueva Categoría"}
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
							<label htmlFor="cat-nombre" className="block text-sm font-medium text-brand-white mb-1.5">
								Nombre *
							</label>
							<input
								id="cat-nombre"
								type="text"
								required
								maxLength={100}
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="Ej. Procesadores, Laptops..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						<div>
							<label
								htmlFor="cat-descripcion"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Descripción
							</label>
							<textarea
								id="cat-descripcion"
								rows={4}
								maxLength={500}
								value={descripcion}
								onChange={(e) => setDescripcion(e.target.value)}
								placeholder="Descripción breve de la categoría (opcional)..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors resize-none"
							/>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors cursor-pointer"
							>
								<Plus size={16} />
								<span>{editingId ? "Guardar Cambios" : "Crear Categoría"}</span>
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
								placeholder="Buscar categoría por nombre o descripción..."
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
									<th className="py-3 px-3">Nombre</th>
									<th className="py-3 px-3">Descripción</th>
									<th className="py-3 px-3 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-divider/60 text-sm">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr key={item.id_categoria} className="hover:bg-brand-bg/40 transition-colors">
											<td className="py-3.5 px-3 font-mono text-xs text-brand-muted">
												#{item.id_categoria}
											</td>
											<td className="py-3.5 px-3 font-medium text-brand-white">{item.nombre}</td>
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
														className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
														title="Editar"
													>
														<Pencil size={16} />
													</button>
													<button
														type="button"
														onClick={() => handleDelete(item.id_categoria)}
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
											No hay categorías registradas.
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
