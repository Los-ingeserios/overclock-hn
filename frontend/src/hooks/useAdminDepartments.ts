import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departmentService } from "../services/departmentService";
import type { Department, DepartmentPayload, CountryOption } from "../types/department";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { departmentSchema, type DepartmentFormInput } from "../schemas/department.schema";
import { parseApiError } from "../lib/apiError";

const DEPARTMENT_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar los departamentos.",
	createSuccess: "Departamento creado correctamente.",
	createError: "No se pudo crear el departamento.",
	updateSuccess: (id) => `Departamento #${id} actualizado correctamente.`,
	updateError: "No se pudo actualizar el departamento.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar el departamento #${id}?`,
	deleteSuccess: (id) => `Departamento #${id} eliminado correctamente.`,
	deleteError: "No se pudo eliminar el departamento. Verifica que no tenga ciudades asociadas.",
};

export function useAdminDepartments() {
	const [countries, setCountries] = useState<CountryOption[]>([]);
	const [loadingCountries, setLoadingCountries] = useState(false);

	const countryNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const c of countries) {
			map.set(c.id_pais, c.nombre);
		}
		return map;
	}, [countries]);

	const getCountryName = useCallback(
		(id: number) => countryNameMap.get(id) ?? `País #${id}`,
		[countryNameMap],
	);

	const filterDepartment = useCallback(
		(item: Department, q: string) =>
			item.nombre.toLowerCase().includes(q) ||
			getCountryName(item.id_pais).toLowerCase().includes(q),
		[getCountryName],
	);

	const crud = useCrudResource<Department, DepartmentPayload>({
		service: departmentService,
		filterItem: filterDepartment,
		messages: DEPARTMENT_MESSAGES,
	});

	const { setError } = crud;

	useEffect(() => {
		let active = true;
		setLoadingCountries(true);
		departmentService
			.getAllCountries()
			.then((list) => {
				if (active && list) setCountries(list);
			})
			.catch((err) => {
				if (active) setError(parseApiError(err, "No se pudieron cargar los países."));
			})
			.finally(() => {
				if (active) setLoadingCountries(false);
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
	} = useForm<DepartmentFormInput, unknown, DepartmentPayload>({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			id_pais: "",
			nombre: "",
			estado: true,
		},
	});

	const estadoActual = useWatch({ control, name: "estado" });

	const resetForm = useCallback(() => {
		crud.setEditingId(null);
		reset({
			id_pais: "",
			nombre: "",
			estado: true,
		});
	}, [crud, reset]);

	const handleEdit = (item: Department) => {
		crud.clearMessages();
		crud.setEditingId(item.id_departamento);
		reset({
			id_pais: String(item.id_pais),
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
		countries,
		loadingCountries,
		getCountryName,
		estadoActual,
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