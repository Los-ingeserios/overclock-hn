import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { citySchema, type CityFormInput, type CityPayload } from "../schemas/city.schema";
import { parseApiError } from "../lib/apiError";
import type { City } from "../types/city";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { cityService } from "../services/cityServices";
import type { Department } from "../types/department";

const CITY_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar las ciudades.",
	createSuccess: "Ciudad creada correctamente.",
	createError: "No se pudo crear la ciudad. Verifica que el código postal no esté repetido.",
	updateSuccess: (id) => `Ciudad #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la ciudad.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar la ciudad #${id}?`,
	deleteSuccess: (id) => `Ciudad #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la ciudad. Verifica que no tenga direcciones asociadas.",
};

const DEPARTMENTS_FALLBACK_ERROR = "No se pudieron cargar los departamentos para el formulario.";

export function useAdminCities() {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loadingDepartments, setLoadingDepartments] = useState(true);

	const departmentNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const d of departments) {
			map.set(d.id_departamento, d.nombre);
		}
		return map;
	}, [departments]);

	const getDepartmentName = useCallback(
		(id: number) => departmentNameMap.get(id) ?? `Depto #${id}`,
		[departmentNameMap],
	);

	const filterCity = useCallback(
		(item: City, q: string) =>
			item.nombre.toLowerCase().includes(q) ||
			item.codigo_postal.toLowerCase().includes(q) ||
			getDepartmentName(item.id_departamento).toLowerCase().includes(q),
		[getDepartmentName],
	);

	const crud = useCrudResource<City, CityPayload>({
		service: cityService,
		filterItem: filterCity,
		messages: CITY_MESSAGES,
	});

	const { setError } = crud;

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoadingDepartments(true);
				return cityService.getAllDepartments();
			})
			.then((list) => {
				if (!active || !list) return;
				setDepartments(list);
			})
			.catch((err) => {
				if (!active) return;
				setError(parseApiError(err, DEPARTMENTS_FALLBACK_ERROR));
			})
			.finally(() => {
				if (active) setLoadingDepartments(false);
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
	} = useForm<CityFormInput, unknown, CityPayload>({
		resolver: zodResolver(citySchema),
		defaultValues: {
			id_departamento: "",
			nombre: "",
			codigo_postal: "",
			estado: true,
		},
	});

	const estadoActual = useWatch({ control, name: "estado" });

	const resetForm = useCallback(() => {
		crud.setEditingId(null);
		reset({
			id_departamento: "",
			nombre: "",
			codigo_postal: "",
			estado: true,
		});
	}, [crud, reset]);

	const handleEdit = (item: City) => {
		crud.clearMessages();
		crud.setEditingId(item.id_ciudad);
		reset({
			id_departamento: String(item.id_departamento),
			nombre: item.nombre,
			codigo_postal: item.codigo_postal,
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
		onSubmit,
		filtered: crud.filtered,
		departments,
		loadingDepartments,
		getDepartmentName,
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
