import { useCallback, useEffect, useMemo, useState } from "react";
import { productSchema, type ProductFormInput, type ProductPayload } from "../schemas/product.schema";
import type { AdminProduct } from "../types/products";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { adminProductService } from "../services/adminProductService";
import { parseApiError } from "../lib/apiError";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "../types/category";
import type { Brand } from "../types/brand";

const PRODUCT_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar los productos.",
	createSuccess: "Producto creado correctamente.",
	createError: "No se pudo crear el producto. Verifica que el SKU y número de lote sean únicos.",
	updateSuccess: (id) => `Producto #${id} actualizado correctamente.`,
	updateError: "No se pudo actualizar el producto.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar el producto #${id}?`,
	deleteSuccess: (id) => `Producto #${id} eliminado correctamente.`,
	deleteError: "No se pudo eliminar el producto. Verifica que no esté asociado a pedidos, facturas o compras.",
};

const LOOKUPS_FALLBACK_ERROR = "No se pudieron cargar las categorías y marcas para el formulario.";

const EMPTY_FORM_VALUES: ProductFormInput = {
	id_categoria: "",
	id_marca: "",
	codigo_sku: "",
	numero_lote: "",
	modelo: "",
	descripcion: "",
	precio_costo: "",
	precio_venta: "",
	stock: "0",
	url_img: "",
	estado: true,
};

function extractCategoryId(cat: AdminProduct["id_categoria"] | null | undefined): string {
	if (typeof cat === "number") return String(cat);
	if (cat && typeof cat === "object" && "id_categoria" in cat) {
		return String(cat.id_categoria);
	}
	return "";
}

function extractBrandId(brand: AdminProduct["id_marca"] | null | undefined): string {
	if (typeof brand === "number") return String(brand);
	if (brand && typeof brand === "object" && "id_marca" in brand) {
		return String(brand.id_marca);
	}
	return "";
}

function toNumericString(value: string | number | null | undefined): string {
	if (value === undefined || value === null || value === "") return "";
	const n = Number(value);
	return Number.isFinite(n) ? String(n) : "";
}

export function useAdminProducts() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loadingLookups, setLoadingLookups] = useState(true);

	const categoryNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const c of categories) map.set(c.id_categoria, c.nombre);
		return map;
	}, [categories]);

	const brandNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const b of brands) map.set(b.id_marca, b.nombre);
		return map;
	}, [brands]);

	const getCategoryName = useCallback(
		(cat: AdminProduct["id_categoria"]) => {
			if (typeof cat !== "number") return cat.nombre;
			return categoryNameMap.get(cat) ?? `Cat #${cat}`;
		},
		[categoryNameMap],
	);

	const getBrandName = useCallback(
		(brand: AdminProduct["id_marca"]) => {
			if (typeof brand !== "number") return brand.nombre;
			return brandNameMap.get(brand) ?? `Marca #${brand}`;
		},
		[brandNameMap],
	);

	const filterProduct = useCallback(
		(item: AdminProduct, q: string) =>
			item.modelo.toLowerCase().includes(q) ||
			item.codigo_sku.toLowerCase().includes(q) ||
			(item.numero_lote ?? "").toLowerCase().includes(q) ||
			getCategoryName(item.id_categoria).toLowerCase().includes(q) ||
			getBrandName(item.id_marca).toLowerCase().includes(q),
		[getCategoryName, getBrandName],
	);

	const crud = useCrudResource<AdminProduct, ProductPayload>({
		service: adminProductService,
		filterItem: filterProduct,
		messages: PRODUCT_MESSAGES,
	});

	const { setError } = crud;

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoadingLookups(true);
				return Promise.all([adminProductService.getAllCategories(), adminProductService.getAllBrands()]);
			})
			.then((result) => {
				if (!active || !result) return;
				const [catList, brandList] = result;
				setCategories(catList);
				setBrands(brandList);
			})
			.catch((err) => {
				if (!active) return;
				setError(parseApiError(err, LOOKUPS_FALLBACK_ERROR));
			})
			.finally(() => {
				if (active) setLoadingLookups(false);
			});

		return () => {
			active = false;
		};
	}, [setError]);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<ProductFormInput, unknown, ProductPayload>({
		resolver: zodResolver(productSchema),
		defaultValues: EMPTY_FORM_VALUES,
	});

	const estadoActual = useWatch({ control, name: "estado" });
	const urlImgActual = useWatch({ control, name: "url_img" });

	const resetForm = useCallback(() => {
		crud.setEditingId(null);
		reset(EMPTY_FORM_VALUES);
	}, [crud, reset]);

	const handleEdit = (item: AdminProduct) => {
		crud.clearMessages();
		crud.setEditingId(item.id_producto);

		reset({
			id_categoria: extractCategoryId(item.id_categoria),
			id_marca: extractBrandId(item.id_marca),
			codigo_sku: item.codigo_sku ?? "",
			numero_lote: item.numero_lote ?? "",
			modelo: item.modelo ?? "",
			descripcion: item.descripcion ?? "",
			precio_costo: toNumericString(item.precio_costo),
			precio_venta: toNumericString(item.precio_venta),
			stock: item.stock !== undefined && item.stock !== null ? String(item.stock) : "0",
			url_img: item.url_img ?? "",
			estado: item.estado ?? true,
		});
	};

	const onSubmit = handleSubmit(async (payload) => {
		const saved = await crud.saveItem(payload);
		if (saved) resetForm();
	});

	const handleDelete = (id: number) => crud.deleteItem(id, resetForm);

	return {
		register,
		fieldErrors,
		isSubmitting,
		estadoActual,
		urlImgActual,
		onSubmit,
		filtered: crud.filtered,
		categories,
		brands,
		loadingLookups,
		loadingEditId: null as number | null,
		getCategoryName,
		getBrandName,
		totalCount: crud.totalCount,
		search: crud.search,
		setSearch: crud.setSearch,
		editingId: crud.editingId,
		page: crud.page,
		setPage: crud.setPage,
		hasNext: crud.hasNext,
		hasPrevious: crud.hasPrevious,
		loading: crud.loading,
		deletingId: crud.deletingId,
		error: crud.error,
		successMsg: crud.successMsg,
		clearMessages: crud.clearMessages,
		resetForm,
		handleEdit,
		handleDelete,
		recargar: crud.recargar,
	};
}
