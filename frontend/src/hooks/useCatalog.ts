import { useCallback, useEffect, useMemo, useState } from "react";
import { catalogService } from "../services/catalogService";
import { parseApiError } from "../lib/apiError";
import type { Category } from "../types/category";
import type { Brand } from "../types/brand";
import type { CatalogProduct } from "../types/products";

interface CatalogData {
	products: CatalogProduct[];
	totalCount: number;
	hasNext: boolean;
	hasPrevious: boolean;
	categories: Category[];
	brands: Brand[];
}

async function requestCatalogData(targetPage: number): Promise<CatalogData> {
	const [prodRes, catRes, brandRes] = await Promise.all([
		catalogService.getProducts(targetPage),
		catalogService.getCategories(),
		catalogService.getBrands(),
	]);

	return {
		products: prodRes.results,
		totalCount: prodRes.count,
		hasNext: Boolean(prodRes.next),
		hasPrevious: Boolean(prodRes.previous),
		categories: catRes.results,
		brands: brandRes.results,
	};
}

const CATALOG_FALLBACK_ERROR = "No se pudo cargar el catalogo desde el servidor.";

export function useCatalog() {
	const [products, setProducts] = useState<CatalogProduct[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);

	const [busqueda, setBusqueda] = useState("");
	const [categoriaSel, setCategoriaSel] = useState<number | "Todas">("Todas");
	const [marcaSel, setMarcaSel] = useState<number | "Todas">("Todas");

	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrevious, setHasPrevious] = useState(false);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const applyCatalogData = useCallback((data: CatalogData) => {
		setProducts(data.products);
		setTotalCount(data.totalCount);
		setHasNext(data.hasNext);
		setHasPrevious(data.hasPrevious);
		setCategories(data.categories);
		setBrands(data.brands);
	}, []);

	const fetchCatalog = useCallback(
		async (targetPage: number) => {
			setLoading(true);
			setError(null);

			try {
				const data = await requestCatalogData(targetPage);
				applyCatalogData(data);
			} catch (err) {
				setError(parseApiError(err, CATALOG_FALLBACK_ERROR));
			} finally {
				setLoading(false);
			}
		},
		[applyCatalogData],
	);

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoading(true);
				setError(null);
				return requestCatalogData(page);
			})
			.then((data) => {
				if (!active || !data) return;
				applyCatalogData(data);
			})
			.catch((err) => {
				if (!active) return;
				setError(
					parseApiError(
						err,
						"No se pudo cargar el catalogo desde el servidor. Verificar que Django este corriendo en el puerto 8000.",
					),
				);
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, [page, applyCatalogData]);

	const productosFiltrados = useMemo(() => {
		const q = busqueda.trim().toLowerCase();

		return products.filter((prod) => {
			const coincideTexto =
				!q ||
				prod.modelo.toLowerCase().includes(q) ||
				prod.id_marca.nombre.toLowerCase().includes(q) ||
				(prod.codigo_sku?.toLowerCase().includes(q) ?? false);

			const coincideCategoria = categoriaSel === "Todas" || prod.id_categoria.id_categoria === categoriaSel;
			const coincideMarca = marcaSel === "Todas" || prod.id_marca.id_marca === marcaSel;

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
