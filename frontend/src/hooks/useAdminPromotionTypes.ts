import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promotionTypeService } from "../services/promotionTypeService";
import type { PromotionType, PromotionTypePayload } from "../types/promotionType";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { promotionTypeSchema, type PromotionTypeFormInput } from "../schemas/promotionType.schema";

const PROMOTION_TYPE_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar los tipos de promoción.",
	createSuccess: "Tipo de promoción creado correctamente.",
	createError: "No se pudo crear el tipo de promoción.",
	updateSuccess: (id) => `Tipo de promoción #${id} actualizado correctamente.`,
	updateError: "No se pudo actualizar el tipo de promoción.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar el tipo de promoción #${id}?`,
	deleteSuccess: (id) => `Tipo de promoción #${id} eliminado correctamente.`,
	deleteError: "No se pudo eliminar el tipo de promoción. Verifica que no tenga promociones asociadas.",
};

const filterPromotionType = (item: PromotionType, q: string) =>
	item.nombre.toLowerCase().includes(q) || (item.descripcion ?? "").toLowerCase().includes(q);

export function useAdminPromotionTypes() {
	const crud = useCrudResource<PromotionType, PromotionTypePayload>({
		service: promotionTypeService,
		filterItem: filterPromotionType,
		messages: PROMOTION_TYPE_MESSAGES,
	});

	const { setEditingId } = crud;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<PromotionTypeFormInput, unknown, PromotionTypePayload>({
		resolver: zodResolver(promotionTypeSchema),
		defaultValues: {
			nombre: "",
			descripcion: "",
		},
	});

	const resetForm = useCallback(() => {
		setEditingId(null);
		reset({ nombre: "", descripcion: "" });
	}, [setEditingId, reset]);

	const handleEdit = (item: PromotionType) => {
		crud.clearMessages();
		setEditingId(item.id_tipo_promocion);
		reset({
			nombre: item.nombre,
			descripcion: item.descripcion ?? "",
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
		filtered: crud.filtered,
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
