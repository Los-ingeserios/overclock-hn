import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientService } from "../services/clientService";
import type { Client, ClientPayload } from "../types/client";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import { clientSchema, type ClientFormInput } from "../schemas/client.schema";
import { formatClientName } from "../lib/format";

const CLIENT_MESSAGES: CrudMessages = {
	loadError: "No se pudieron cargar los clientes.",
	createSuccess: "Cliente registrado correctamente.",
	createError: "No se pudo registrar el cliente. Verifica que el DNI o correo no estén duplicados.",
	updateSuccess: (id) => `Cliente #${id} actualizado correctamente.`,
	updateError: "No se pudo actualizar la información del cliente.",
	deleteConfirm: (id) => `¿Seguro que deseas eliminar al cliente #${id}?`,
	deleteSuccess: (id) => `Cliente #${id} eliminado correctamente.`,
	deleteError: "No se pudo eliminar el cliente. Verifica si tiene pedidos o direcciones asociadas.",
};

const DEFAULT_VALUES: ClientFormInput = {
	dni: "",
	rtn: "",
	primer_nombre: "",
	segundo_nombre: "",
	primer_apellido: "",
	segundo_apellido: "",
	fecha_nacimiento: "",
	telefono: "",
	correo: "",
	razon_social: "",
	estado: true,
};

const filterClient = (item: Client, q: string) =>
	formatClientName(item).toLowerCase().includes(q) ||
	item.dni.includes(q) ||
	(item.rtn ?? "").includes(q) ||
	item.correo.toLowerCase().includes(q) ||
	item.telefono.toLowerCase().includes(q) ||
	(item.razon_social ?? "").toLowerCase().includes(q);

export function useAdminClients() {
	const crud = useCrudResource<Client, ClientPayload>({
		service: clientService,
		filterItem: filterClient,
		messages: CLIENT_MESSAGES,
	});

	const { setEditingId } = crud;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: fieldErrors, isSubmitting },
	} = useForm<ClientFormInput, unknown, ClientPayload>({
		resolver: zodResolver(clientSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const resetForm = useCallback(() => {
		setEditingId(null);
		reset(DEFAULT_VALUES);
	}, [setEditingId, reset]);

	const handleEdit = (item: Client) => {
		crud.clearMessages();
		setEditingId(item.id_cliente);
		reset({
			dni: item.dni,
			rtn: item.rtn ?? "",
			primer_nombre: item.primer_nombre,
			segundo_nombre: item.segundo_nombre ?? "",
			primer_apellido: item.primer_apellido,
			segundo_apellido: item.segundo_apellido ?? "",
			fecha_nacimiento: item.fecha_nacimiento ?? "",
			telefono: item.telefono,
			correo: item.correo,
			razon_social: item.razon_social ?? "",
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
