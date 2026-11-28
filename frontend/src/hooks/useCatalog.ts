import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "../types/products";
import { mapApiProductToUi } from "../types/catalog";
import type { ApiBrand, ApiCategory } from "../types/catalog";
import { catalogService } from "../services/catalogService";

export function useCatalog() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<ApiCategory[]>([]);
	const [brands, setBrands] = useState<ApiBrand[]>([]);

	const [busqueda, setBusqueda] = useState("");
	const [categoriaSel, setCategoriaSel] = useState<number | "Todas">("Todas");
	const [marcaSel, setMarcaSel] = useState<number | "Todas">("Todas");

	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrevious, setHasPrevious] = useState(false);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCatalog = useCallback(async (targetPage: number) => {
		setLoading(true);
		setError(null);

		try {
			const [prodRes, catRes, brandRes] = await Promise.all([
				catalogService.getProducts(targetPage),
				catalogService.getCategories(),
				catalogService.getBrands(),
			]);

			setProducts(prodRes.results.map(mapApiProductToUi));
			setTotalCount(prodRes.count);
			setHasNext(Boolean(prodRes.next));
			setHasPrevious(Boolean(prodRes.previous));

			setCategories(catRes.results);
			setBrands(brandRes.results);
		} catch {
			setError(
				"No se pudo cargar el catalogo desde el servidor. Verificar que Django este corriendo en el puerto 8000.",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			void fetchCatalog(page);
		}, 0);

		return () => clearTimeout(timeoutId);
	}, [page, fetchCatalog]);

	const productosFiltrados = useMemo(() => {
		const q = busqueda.trim().toLowerCase();

		return products.filter((prod) => {
			const coincideTexto =
				!q ||
				prod.name.toLowerCase().includes(q) ||
				prod.brand.toLowerCase().includes(q) ||
				(prod.sku?.toLowerCase().includes(q) ?? false);

			const coincideCategoria = categoriaSel === "Todas" || prod.categoryId === categoriaSel;
			const coincideMarca = marcaSel === "Todas" || prod.brandId === marcaSel;

			return coincideTexto && coincideCategoria && coincideMarca;
		});
	}, [products, busqueda, categoriaSel, marcaSel]);

	const limpiarFiltros = () => {
		setBusqueda("");
		setCategoriaSel("Todas");
		setMarcaSel("Todas");
	};

	return {
		productosFiltrados,
		categories,
		brands,
		busqueda,
		setBusqueda,
		categoriaSel,
		setCategoriaSel,
		marcaSel,
		setMarcaSel,
		limpiarFiltros,
		page,
		setPage,
		totalCount,
		hasNext,
		hasPrevious,
		loading,
		error,
		recargar: () => fetchCatalog(page),
	};
}
