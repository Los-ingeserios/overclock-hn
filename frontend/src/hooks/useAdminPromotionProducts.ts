import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	promotionProductSchema,
	type PromotionProductFormInput,
	type PromotionProductPayload,
} from "../schemas/promotionProduct.schema";
import { promotionProductService } from "../services/promotionProductService";
import { parseApiError } from "../lib/apiError";
import type { Promotion } from "../types/promotion";
import type { PromotionProduct } from "../types/promotionProduct";
import type { PromotionType } from "../types/promotionType";
import type { ProductOption } from "../types/products";
import { useCrudResource, type CrudMessages } from "./useCrudResource";

const PROMOTION_PRODUCT_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar los productos en promoción.",
	createSuccess: "Producto asignado a la promoción correctamente.",
	createError: "No se pudo asignar el producto a la promoción. Verifica los datos seleccionados.",
	updateSuccess: (id) => `Asignación #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la asignación.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar la asignación #${id}?`,
	deleteSuccess: (id) => `Asignación #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la asignación.",
};

const LOOKUPS_FALLBACK_ERROR = "No se pudieron cargar las promociones y productos para el formulario.";

const DEFAULT_VALUES: PromotionProductFormInput = {
	id_promocion: "",
	id_producto: "",
	rol_producto: "Requerido",
};

export function useAdminPromotionProducts() {
	const [promotions, setPromotions] = useState<Promotion[]>([]);
	const [promotionTypes, setPromotionTypes] = useState<PromotionType[]>([]);
	const [products, setProducts] = useState<ProductOption[]>([]);
	const [loadingLookups, setLoadingLookups] = useState(true);
	const [selectedPromotionId, setSelectedPromotionId] = useState("");

	const typeNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const t of promotionTypes) map.set(t.id_tipo_promocion, t.nombre);
		return map;
	}, [promotionTypes]);

	const promotionMap = useMemo(() => {
		const map = new Map<number, Promotion>();
		for (const p of promotions) map.set(p.id_promocion, p);
		return map;
	}, [promotions]);

	const productMap = useMemo(() => {
		const map = new Map<number, ProductOption>();
		for (const p of products) map.set(p.id_producto, p);
		return map;
	}, [products]);

	const formatPromotionLabel = useCallback(
		(promo: Promotion) => {
			const typeName = typeNameMap.get(promo.id_tipo_promocion) ?? `Tipo #${promo.id_tipo_promocion}`;
			return `#${promo.id_promocion} — ${typeName} (${Number(promo.porcentaje_descuento)}% OFF)`;
		},
		[typeNameMap],
	);

	const getPromotionInfo = useCallback(
		(id: number) => {
			const promo = promotionMap.get(id);
			if (!promo) return null;
			return {
				promo,
				typeName: typeNameMap.get(promo.id_tipo_promocion) ?? `Tipo #${promo.id_tipo_promocion}`,
				label: formatPromotionLabel(promo),
			};
		},
		[promotionMap, typeNameMap, formatPromotionLabel],
	);

	const getProductInfo = useCallback((id: number) => productMap.get(id) ?? null, [productMap]);

	const filterItem = useCallback(
		(item: PromotionProduct, q: string) => {
			const promoInfo = getPromotionInfo(item.id_promocion);
			const prod = productMap.get(item.id_producto);
			return (
				item.rol_producto.toLowerCase().includes(q) ||
				(promoInfo?.label.toLowerCase().includes(q) ?? false) ||
				(prod?.modelo.toLowerCase().includes(q) ?? false) ||
				(prod?.codigo_sku.toLowerCase().includes(q) ?? false)
			);
		},
		[getPromotionInfo, productMap],
	);

	const crud = useCrudResource<PromotionProduct, PromotionProductPayload>({
		service: promotionProductService,
		filterItem,
		messages: PROMOTION_PRODUCT_MESSAGES,
	});

	const { setError, setEditingId } = crud;

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoadingLookups(true);
				return Promise.all([
					promotionProductService.getAllPromotions(),
					promotionProductService.getAllPromotionTypes(),
					promotionProductService.getAllProducts(),
				]);
			})
			.then((res) => {
				if (!active || !res) return;
				const [promoList, typeList, prodList] = res;
				setPromotions(promoList);
				setPromotionTypes(typeList);
				setProducts(prodList);
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

	const filtered = useMemo(() => {
		if (!selectedPromotionId) return crud.filtered;
		const targetId = Number(selectedPromotionId);
		return crud.filtered.filter((item) => item.id_promocion === targetId);
	}, [crud.filtered, selectedPromotionId]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<PromotionProductFormInput, unknown, PromotionProductPayload>({
		resolver: zodResolver(promotionProductSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const resetForm = useCallback(() => {
		setEditingId(null);
		reset(DEFAULT_VALUES);
	}, [setEditingId, reset]);

	const handleEdit = (item: PromotionProduct) => {
		crud.clearMessages();
		setEditingId(item.id_promocion_producto);
		reset({
			id_promocion: String(item.id_promocion),
			id_producto: String(item.id_producto),
			rol_producto: item.rol_producto,
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
		onSubmit,
		filtered,
		promotions,
		products,
		loadingLookups,
		selectedPromotionId,
		setSelectedPromotionId,
		formatPromotionLabel,
		getPromotionInfo,
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
