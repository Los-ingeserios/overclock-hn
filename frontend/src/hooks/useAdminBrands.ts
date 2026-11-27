import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandService } from "../services/brandService";
import type { Brand, BrandPayload } from "../types/brand";
import type { CountryOption } from "../types/department";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { brandSchema, type BrandFormInput } from "../schemas/brand.schema";
import { parseApiError } from "../lib/apiError";

const BRAND_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar las marcas.",
	createSuccess: "Marca creada correctamente.",
	createError: "No se pudo crear la marca.",
	updateSuccess: (id) => `Marca #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la marca.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar la marca #${id}?`,
	deleteSuccess: (id) => `Marca #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la marca. Verifica que no tenga productos asociados.",
};

export function useAdminBrands() {
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

	const filterBrand = useCallback(
		(item: Brand, q: string) =>
			item.nombre.toLowerCase().includes(q) ||
			getCountryName(item.id_pais).toLowerCase().includes(q),
		[getCountryName],
	);

	const crud = useCrudResource<Brand, BrandPayload>({
		service: brandService,
		filterItem: filterBrand,
		messages: BRAND_MESSAGES,
	});

	const { setError } = crud;

	useEffect(() => {
		let active = true;
		setLoadingCountries(true);
		brandService
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
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<BrandFormInput, unknown, BrandPayload>({
		resolver: zodResolver(brandSchema),
		defaultValues: {
			id_pais: "",
			nombre: "",
		},
	});

	const resetForm = useCallback(() => {
		crud.setEditingId(null);
		reset({
			id_pais: "",
			nombre: "",
		});
	}, [crud, reset]);

	const handleEdit = (item: Brand) => {
		crud.clearMessages();
		crud.setEditingId(item.id_marca);
		reset({
			id_pais: String(item.id_pais),
			nombre: item.nombre,
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