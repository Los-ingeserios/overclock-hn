import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { promotionSchema, type PromotionFormInput, type PromotionPayload } from "../schemas/promotion.schema";
import { promotionService } from "../services/promotionService";
import { parseApiError } from "../lib/apiError";
import type { Promotion } from "../types/promotion";
import type { PromotionType } from "../types/promotionType";
import { useCrudResource, type CrudMessages } from "./useCrudResource";

const PROMOTION_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar las promociones.",
	createSuccess: "Promoción creada correctamente.",
	createError: "No se pudo crear la promoción. Verifica las fechas y el porcentaje ingresado.",
	updateSuccess: (id) => `Promoción #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la promoción.",
	deleteConfirm: (id) =>
		`¿Seguro que deseas eliminar la promoción #${id}? También se eliminarán sus productos asociados.`,
	deleteSuccess: (id) => `Promoción #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la promoción.",
};

const TYPES_FALLBACK_ERROR = "No se pudieron cargar los tipos de promoción para el selector.";

const DEFAULT_VALUES: PromotionFormInput = {
	id_tipo_promocion: "",
	fecha_inicio: "",
	fecha_vencimiento: "",
	porcentaje_descuento: "",
	cantidad_requerida: "1",
	cantidad_beneficio: "1",
	estado: true,
};

export function useAdminPromotions() {
	const [promotionTypes, setPromotionTypes] = useState<PromotionType[]>([]);
	const [loadingTypes, setLoadingTypes] = useState(true);

	const typeNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const t of promotionTypes) map.set(t.id_tipo_promocion, t.nombre);
		return map;
	}, [promotionTypes]);

	const getTypeName = useCallback((id: number) => typeNameMap.get(id) ?? `Tipo #${id}`, [typeNameMap]);

	const filterPromotion = useCallback(
		(item: Promotion, q: string) =>
			getTypeName(item.id_tipo_promocion).toLowerCase().includes(q) ||
			String(item.id_promocion).includes(q) ||
			String(item.porcentaje_descuento).includes(q) ||
			item.fecha_inicio.includes(q) ||
			(item.fecha_vencimiento ?? "sin vencimiento").toLowerCase().includes(q),
		[getTypeName],
	);

	const crud = useCrudResource<Promotion, PromotionPayload>({
		service: promotionService,
		filterItem: filterPromotion,
		messages: PROMOTION_MESSAGES,
	});

	const { setError, setEditingId } = crud;

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoadingTypes(true);
				return promotionService.getAllPromotionTypes();
			})
			.then((list) => {
				if (!active || !list) return;
				setPromotionTypes(list);
			})
			.catch((err) => {
				if (!active) return;
				setError(parseApiError(err, TYPES_FALLBACK_ERROR));
			})
			.finally(() => {
				if (active) setLoadingTypes(false);
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
	} = useForm<PromotionFormInput, unknown, PromotionPayload>({
		resolver: zodResolver(promotionSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const estadoActual = useWatch({ control, name: "estado" });
	const fechaInicioActual = useWatch({ control, name: "fecha_inicio" });

	const resetForm = useCallback(() => {
		setEditingId(null);
		reset(DEFAULT_VALUES);
	}, [setEditingId, reset]);

	const handleEdit = (item: Promotion) => {
		crud.clearMessages();
		setEditingId(item.id_promocion);
		reset({
			id_tipo_promocion: String(item.id_tipo_promocion),
			fecha_inicio: item.fecha_inicio,
			fecha_vencimiento: item.fecha_vencimiento ?? "",
			porcentaje_descuento: String(Number(item.porcentaje_descuento)),
			cantidad_requerida: String(item.cantidad_requerida),
			cantidad_beneficio: String(item.cantidad_beneficio),
			estado: item.estado,
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
		fechaInicioActual,
		onSubmit,
		filtered: crud.filtered,
		promotionTypes,
		loadingTypes,
		getTypeName,
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
