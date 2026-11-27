import {MapPin,Pencil,Trash2,Search,Plus, X,ChevronLeft,ChevronRight,AlertCircle,CheckCircle2,Loader2,RefreshCw,
} from "lucide-react";
import { useAdminAddresses } from "../../hooks/useAdminAddresses";

export function AdminAddressesPage() {
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
    cities,
    loadingCities,
    getCityName,
  } = useAdminAddresses();

  return (
    <section className="max-w-300 mx-auto px-5 py-8">
      {/* Encabezado */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-brand-primary mb-1">
            <MapPin size={22} />
            <span className="text-xs font-semibold uppercase tracking-wider">Panel Administrativo</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-white">Gestión de Direcciones</h1>
          <p className="text-brand-muted text-sm mt-1">
            Registra direcciones físicas asociadas a una ciudad para clientes, sucursales y proveedores.
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

      {/* Alertas */}
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

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Selección de Ciudad */}
            <div>
              <label htmlFor="dir-ciudad" className="block text-sm font-medium text-brand-white mb-1.5">
                Ciudad *
              </label>
              <select
                id="dir-ciudad"
                disabled={loadingCities}
                {...register("id_ciudad")}
                className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
              >
                <option value="">
                  {loadingCities ? "Cargando ciudades..." : "Selecciona una ciudad..."}
                </option>
                {cities.map((ciudad) => (
                  <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
              {fieldErrors.id_ciudad && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.id_ciudad.message}</p>
              )}
            </div>

            {/* Calle / Colonia */}
            <div>
              <label htmlFor="dir-calle" className="block text-sm font-medium text-brand-white mb-1.5">
                Calle / Colonia *
              </label>
              <input
                id="dir-calle"
                type="text"
                maxLength={100}
                {...register("calle")}
                placeholder="Ej. Blvd. Morazán, Col. Palmira..."
                className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
              />
              {fieldErrors.calle && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.calle.message}</p>
              )}
            </div>

            {/* Referencias */}
            <div>
              <label htmlFor="dir-referencias" className="block text-sm font-medium text-brand-white mb-1.5">
                Referencias
              </label>
              <textarea
                id="dir-referencias"
                rows={3}
                maxLength={200}
                {...register("referencias")}
                placeholder="Ej. Casa de dos pisos color crema, frente al parque..."
                className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors resize-none"
              />
              {fieldErrors.referencias && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.referencias.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
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
            <span className="text-xs text-brand-muted shrink-0">Total: {totalCount} registros</span>
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-brand-muted">
                      <div className="inline-flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin text-brand-primary" />
                        <span>Cargando direcciones...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
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
                            disabled={deletingId === item.id_direccion}
                            className="p-2 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                            title="Eliminar"
                          >
                            {deletingId === item.id_direccion ? (
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