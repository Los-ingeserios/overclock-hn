import {
  MapPinHouse,Star, Pencil, Trash2, Search,Plus, X,ChevronLeft,ChevronRight,AlertCircle,CheckCircle2, Loader2, RefreshCw,
} from "lucide-react";
import { useAdminClientAddresses } from "../../hooks/useAdminClientAddresses";

export function AdminClientAddressesPage() {
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
    clients,
    addresses,
    loadingOptions,
    getClientLabel,
    getAddressLabel,
  } = useAdminClientAddresses();

  return (
    <section className="max-w-300 mx-auto px-5 py-8">
  
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-brand-primary mb-1">
            <MapPinHouse size={22} />
            <span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-white">Direcciones por Cliente</h1>
          <p className="text-brand-muted text-sm mt-1">
            Asigna y gestiona las direcciones registradas para cada cliente del sistema.
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
          <button type="button" onClick={clearMessages} className="text-red-300/80 hover:text-red-200 cursor-pointer">
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
          <button type="button" onClick={clearMessages} className="text-emerald-300/80 hover:text-emerald-200 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Formulario */}
        <div className="lg:col-span-4 bg-brand-surface/40 border border-brand-divider rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-brand-white">
              {editingId ? `Editar Asignación #${editingId}` : "Asignar Dirección"}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-brand-muted hover:text-brand-white cursor-pointer" title="Cancelar edición">
                <X size={18} />
              </button>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Selección de Cliente */}
            <div>
              <label htmlFor="dc-cliente" className="block text-sm font-medium text-brand-white mb-1.5">
                Cliente *
              </label>
              <select
                id="dc-cliente"
                disabled={loadingOptions}
                {...register("id_cliente")}
                className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
              >
                <option value="">
                  {loadingOptions ? "Cargando clientes..." : "Selecciona un cliente..."}
                </option>
                {clients.map((cli) => {
                  const fullName = [cli.primer_nombre, cli.segundo_nombre, cli.primer_apellido, cli.segundo_apellido]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <option key={cli.id_cliente} value={String(cli.id_cliente)}>
                      #{cli.id_cliente} — {fullName}
                    </option>
                  );
                })}
              </select>
              {fieldErrors.id_cliente && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.id_cliente.message}</p>
              )}
            </div>

       
            <div>
              <label htmlFor="dc-direccion" className="block text-sm font-medium text-brand-white mb-1.5">
                Dirección *
              </label>
              <select
                id="dc-direccion"
                disabled={loadingOptions}
                {...register("id_direccion")}
                className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
              >
                <option value="">
                  {loadingOptions ? "Cargando direcciones..." : "Selecciona una dirección..."}
                </option>
                {addresses.map((dir) => (
                  <option key={dir.id_direccion} value={String(dir.id_direccion)}>
                    #{dir.id_direccion} — {dir.calle}
                  </option>
                ))}
              </select>
              {fieldErrors.id_direccion && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.id_direccion.message}</p>
              )}
            </div>

    
            <div className="flex items-center justify-between bg-brand-bg/60 border border-brand-divider rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-brand-white">Predeterminada</p>
                <p className="text-xs text-brand-muted">Dirección principal de envío</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("predeterminada")} className="sr-only peer" />
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
                <span>{editingId ? "Guardar Cambios" : "Asignar"}</span>
              </button>
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
            <span className="text-xs text-brand-muted shrink-0">Total: {totalCount} registros</span>
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-brand-muted">
                      <div className="inline-flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin text-brand-primary" />
                        <span>Cargando asignaciones...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id_direccion_cliente} className="hover:bg-brand-bg/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-xs text-brand-muted">#{item.id_direccion_cliente}</td>
                      <td className="py-3.5 px-3 font-medium text-brand-white">{getClientLabel(item.id_cliente)}</td>
                      <td className="py-3.5 px-3 text-brand-muted max-w-60 truncate">{getAddressLabel(item.id_direccion)}</td>
                      <td className="py-3.5 px-3">
                        {item.predeterminada ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/40">
                            <Star size={12} className="fill-brand-primary" /> Principal
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-brand-bg border border-brand-divider text-brand-muted">
                            Secundaria
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => handleEdit(item)} className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer" title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => handleDelete(item.id_direccion_cliente)} disabled={deletingId === item.id_direccion_cliente} className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50" title="Eliminar">
                            {deletingId === item.id_direccion_cliente ? <Loader2 size={16} className="animate-spin text-red-400" /> : <Trash2 size={16} />}
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
              <button type="button" disabled={!hasPrevious} onClick={() => setPage((p) => Math.max(1, p - 1))} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <ChevronLeft size={14} /> Anterior
              </button>
              <button type="button" disabled={!hasNext} onClick={() => setPage((p) => p + 1)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-divider text-xs text-brand-white hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                Siguiente <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
