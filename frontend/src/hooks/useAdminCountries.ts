import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { countryService } from "../services/countryService";
import type { Country, CountryPayload } from "../types/country";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { countrySchema, type CountryFormInput } from "../schemas/country.schema";

const COUNTRY_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar los países.",
	createSuccess: "País creado correctamente.",
	createError: "No se pudo crear el país.",
	updateSuccess: (id) => `País #${id} actualizado correctamente.`,
	updateError: "No se pudo actualizar el país.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar el país #${id}?`,
	deleteSuccess: (id) => `País #${id} eliminado correctamente.`,
	deleteError: "No se pudo eliminar el país. Verifica que no tenga departamentos ni marcas asociadas.",
};

const filterCountry = (item: Country, q: string) => item.nombre.toLowerCase().includes(q);

export function useAdminCountries() {
	const crud = useCrudResource<Country, CountryPayload>({
		service: countryService,
		filterItem: filterCountry,
		messages: COUNTRY_MESSAGES,
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<CountryFormInput, unknown, CountryPayload>({
		resolver: zodResolver(countrySchema),
		defaultValues: {
			nombre: "",
			estado: true,
		},
	});

	const resetForm = useCallback(() => {
		crud.setEditingId(null);
		reset({ nombre: "", estado: true });
	}, [crud, reset]);

	const handleEdit = (item: Country) => {
		crud.clearMessages();
		crud.setEditingId(item.id_pais);
		reset({
			nombre: item.nombre,
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