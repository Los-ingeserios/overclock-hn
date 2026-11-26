import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { FEATURED_PRODUCTS, NEW_PRODUCTS, PROMO_PRODUCTS, } from "../data/mockProducts";
import { Filter, Search } from "lucide-react";

const MOCK_PRODUCTS = [...NEW_PRODUCTS, ...FEATURED_PRODUCTS, ...PROMO_PRODUCTS];

export function CatalogPage() {

    const [busqueda, setBusqueda] = useState("");
    const [categoriaSel, setCategoriaSel] = useState("Todas");
    const categorias = ["Todas", "Procesadores", "Tarjetas Graficas", "Memorias RAM", "Almacenamiento", "Placas Base"];


    const productosFiltrados = MOCK_PRODUCTS.filter((prod) => {
        const coincideNombre = prod.name.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSel === "Todas" || prod.category === categoriaSel;
        return coincideNombre && coincideCategoria;
    });


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-brand-white mb-2">
                Catálogo de Hardware
            </h1>
            <p className="text-brand-muted mb-8">
                Explora nuestro inventario de componentes y equipos de alto rendimiento.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="bg-brand-surface/40 p-6 rounded-2xl border border-brand-divider backdrop-blur-sm h-fit shadow-xl">
                    <div className="flex items-center gap-2 mb-4 text-brand-white font-semibold">
                        <Filter className="w-5 h-5 text-brand-primary" />
                        <span>Filtros</span>
                    </div>

                    <div>
                        <h3 className="text-xs uppercase tracking-wider font-semibold  text-brand-muted mb-3">
                            Categorias
                        </h3>
                        <div className="space-y-1">
                            {categorias.map((cat) => (
                                <button key={cat}
                                    onClick={() => setCategoriaSel(cat)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${categoriaSel === cat
                                            ? "bg-brand-primary text-brand-white font-semibold shadow-md"
                                            : "text-brand-muted hover:text-brand-white hover:bg-brand-primary/10"
                                        }`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
                <main className="md:col-span-3">

                    <div className="relative mb-6">
                        <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o marca (ej. Ryzen, RTX, Corsair)..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-brand-surface/40 border border-brand-divider rounded-xl
                             text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-primary transition shadow-inner"
                        />
                    </div>
                    {productosFiltrados.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productosFiltrados.map((producto) => (
                                <ProductCard key={producto.id} product={producto} />
                            ))}
                        </div>
                    ): (
                        <div className="text-center py-12 text-brand-muted bg-brand-surface/20 rounded-2xl border border-brand-divider">
                            No se encontraron productos que coincidan con la busqueda.
                        </div>
                    )}
                </main>
            </div>
        </div>

    );

}