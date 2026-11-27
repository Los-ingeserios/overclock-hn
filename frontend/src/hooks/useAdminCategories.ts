import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryService } from "../services/categoryService";
import type { Category, CategoryPayload } from "../types/category";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { categorySchema, type CategoryFormInput } from "../schemas/category.schema";

const CATEGORY_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar las categorías.",
	createSuccess: "Categoría creada correctamente.",
	createError: "No se pudo crear la categoría.",
	updateSuccess: (id) => `Categoría #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la categoría.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar la categoría #${id}?`,
	deleteSuccess: (id) => `Categoría #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la categoría. Verifica que no tenga productos asociados.",
};

const filterCategory = (item: Category, q: string) =>
	item.nombre.toLowerCase().includes(q) || (item.descripcion ?? "").toLowerCase().includes(q);

export function useAdminCategories() {
	const crud = useCrudResource<Category, CategoryPayload>({
		service: categoryService,
		filterItem: filterCategory,
		messages: CATEGORY_MESSAGES,
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<CategoryFormInput, unknown, CategoryPayload>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			nombre: "",
			descripcion: "",
		},
	});

	const resetForm = useCallback(() => {
		crud.setEditingId(null);
		reset({ nombre: "", descripcion: "" });
	}, [crud, reset]);

	const handleEdit = (item: Category) => {
		crud.clearMessages();
		crud.setEditingId(item.id_categoria);
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
