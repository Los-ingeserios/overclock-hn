import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressService } from "../services/addressService";
import type { Address, AddressPayload, CityOption } from "../types/address";
import { addressSchema, type AddressFormInput } from "../schemas/address.schema";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { parseApiError } from "../lib/apiError";

const ADDRESS_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar las direcciones.",
	createSuccess: "Dirección registrada correctamente.",
	createError: "No se pudo registrar la dirección. Verifica los datos ingresados.",
	updateSuccess: (id) => `Dirección #${id} actualizada correctamente.`,
	updateError: "No se pudo actualizar la dirección.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar la dirección #${id}?`,
	deleteSuccess: (id) => `Dirección #${id} eliminada correctamente.`,
	deleteError: "No se pudo eliminar la dirección. Verifica que no esté asignada a un cliente o envío activo.",
};

const CITIES_FALLBACK_ERROR = "No se pudieron cargar las ciudades para el formulario.";

export function useAdminAddresses() {
	const [cities, setCities] = useState<CityOption[]>([]);
	const [loadingCities, setLoadingCities] = useState(true);

	const cityNameMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const c of cities) {
			map.set(c.id_ciudad, c.nombre);
		}
		return map;
	}, [cities]);

	const getCityName = useCallback((id: number) => cityNameMap.get(id) ?? `Ciudad #${id}`, [cityNameMap]);

	const filterAddress = useCallback(
		(item: Address, q: string) =>
			item.calle.toLowerCase().includes(q) ||
			(item.referencias ?? "").toLowerCase().includes(q) ||
			getCityName(item.id_ciudad).toLowerCase().includes(q),
		[getCityName],
	);

	const crud = useCrudResource<Address, AddressPayload>({
		service: addressService,
		filterItem: filterAddress,
		messages: ADDRESS_MESSAGES,
	});

	const { setError, setEditingId } = crud;

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoadingCities(true);
				return addressService.getAllCities();
			})
			.then((list) => {
				if (!active || !list) return;
				setCities(list);
			})
			.catch((err) => {
				if (!active) return;
				setError(parseApiError(err, CITIES_FALLBACK_ERROR));
			})
			.finally(() => {
				if (active) setLoadingCities(false);
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
	} = useForm<AddressFormInput, unknown, AddressPayload>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			id_ciudad: "",
			calle: "",
			referencias: "",
		},
	});

	const resetForm = useCallback(() => {
		setEditingId(null);
		reset({
			id_ciudad: "",
			calle: "",
			referencias: "",
		});
	}, [setEditingId, reset]);

	const handleEdit = (item: Address) => {
		crud.clearMessages();
		setEditingId(item.id_direccion);
		reset({
			id_ciudad: String(item.id_ciudad),
			calle: item.calle,
			referencias: item.referencias ?? "",
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
		cities,
		loadingCities,
		getCityName,
	};
}
