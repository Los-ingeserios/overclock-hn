import { useCallback, useEffect, useMemo, useState } from "react";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import type { Specification, SpecificationPayload } from "../types/specification";
import { specificationService } from "../services/specificationService";
import { specificationSchema, type SpecificationFromInput } from "../schemas/specification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { parseApiError } from "../lib/apiError";
import type { ProductOption } from "../types/products";

const SPECIFICATION_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar las especificaciones.",
	createSuccess: "Especificación creada correctamente.",
	createError: "No se pudo crear la especificación.",
	updateSuccess: (id) => `Especificación #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la especificación.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar la especificación #${id}?`,
	deleteSuccess: (id) => `Especificación #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la especificación.",
};

const PRODUCTS_FALLBACK_ERROR = "No se pudieron cargar los productos para el selector.";

export function useAdminSpecifications() {
	const [products, setProducts] = useState<ProductOption[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [selectedProductId, setSelectedProductId] = useState<string>("");

	const productMap = useMemo(() => {
		const map = new Map<number, ProductOption>();
		for (const p of products) map.set(p.id_producto, p);
		return map;
	}, [products]);

	const getProductInfo = useCallback((id: number) => productMap.get(id) ?? null, [productMap]);

	const filterSpecification = useCallback(
		(item: Specification, q: string) => {
			const prod = productMap.get(item.id_producto);
			return (
				item.especificacion.toLowerCase().includes(q) ||
				(prod?.modelo.toLowerCase().includes(q) ?? false) ||
				(prod?.codigo_sku.toLowerCase().includes(q) ?? false)
			);
		},
		[productMap],
	);

	const crud = useCrudResource<Specification, SpecificationPayload>({
		service: specificationService,
		filterItem: filterSpecification,
		messages: SPECIFICATION_MESSAGES,
	});

	const { setError, setEditingId } = crud;

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoadingProducts(true);
				return specificationService.getAllProducts();
			})
			.then((list) => {
				if (!active || !list) return;
				setProducts(list);
			})
			.catch((err) => {
				if (!active) return;
				setError(parseApiError(err, PRODUCTS_FALLBACK_ERROR));
			})
			.finally(() => {
				if (active) setLoadingProducts(false);
			});

		return () => {
			active = false;
		};
	}, [setError]);

	const filtered = useMemo(() => {
		if (!selectedProductId) return crud.filtered;
		const targetId = Number(selectedProductId);
		return crud.filtered.filter((item) => item.id_producto === targetId);
	}, [crud.filtered, selectedProductId]);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<SpecificationFromInput, unknown, SpecificationPayload>({
		resolver: zodResolver(specificationSchema),
		defaultValues: {
			id_producto: "",
			especificacion: "",
		},
	});

	const especificacionActual = useWatch({ control, name: "especificacion" }) ?? "";

	const resetForm = useCallback(() => {
		setEditingId(null);
		reset({ id_producto: "", especificacion: "" });
	}, [setEditingId, reset]);

	const handleEdit = (item: Specification) => {
		crud.clearMessages();
		setEditingId(item.id_especificacion);
		reset({
			id_producto: String(item.id_producto),
			especificacion: item.especificacion,
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
		especificacionActual,
		onSubmit,
		filtered,
		products,
		loadingProducts,
		selectedProductId,
		setSelectedProductId,
		getProductInfo,
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
