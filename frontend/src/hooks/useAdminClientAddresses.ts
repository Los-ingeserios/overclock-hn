import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientAddressService } from "../services/clientAddressService";
import type { ApiClientAddress,  AddressOption } from "../types/clientAddress";
import type { ApiClient } from "../types/client";
import { useCrudResource, type CrudMessages } from "./useCrudResource";
import {
  clientAddressSchema,
  type ClientAddressFormInput,
  type ClientAddressPayload,
} from "../schemas/clientAddress.schema";
import { parseApiError } from "../lib/apiError";

const CLIENT_ADDRESS_MESSAGES: CrudMessages = {
  loadError: "No se pudieron cargar las asignaciones de direcciones.",
  createSuccess: "Dirección asignada al cliente correctamente.",
  createError: "No se pudo asignar la dirección. Verifica que la dirección no esté asignada a otro cliente.",
  updateSuccess: (id) => `Asignación #${id} actualizada correctamente.`,
  updateError: "No se pudo actualizar la asignación.",
  deleteConfirm: (id) => `¿Seguro que deseas eliminar la asignación #${id}?`,
  deleteSuccess: (id) => `Asignación #${id} eliminada correctamente.`,
  deleteError: "No se pudo eliminar la asignación.",
};

export function useAdminClientAddresses() {
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const clientNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of clients) {
      const fullName = [c.primer_nombre, c.segundo_nombre, c.primer_apellido, c.segundo_apellido]
        .filter(Boolean)
        .join(" ");
      map.set(c.id_cliente, fullName);
    }
    return map;
  }, [clients]);

  const addressCalleMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const a of addresses) {
      map.set(a.id_direccion, a.calle);
    }
    return map;
  }, [addresses]);

  const getClientLabel = useCallback(
    (id: number) => clientNameMap.get(id) ?? `Cliente #${id}`,
    [clientNameMap]
  );

  const getAddressLabel = useCallback(
    (id: number) => addressCalleMap.get(id) ?? `Dirección #${id}`,
    [addressCalleMap]
  );

  const filterRelation = useCallback(
    (item: ApiClientAddress, q: string) =>
      getClientLabel(item.id_cliente).toLowerCase().includes(q.toLowerCase()) ||
      getAddressLabel(item.id_direccion).toLowerCase().includes(q.toLowerCase()),
    [getClientLabel, getAddressLabel]
  );

  const crud = useCrudResource<ApiClientAddress, ClientAddressPayload>({
    service: clientAddressService,
    filterItem: filterRelation,
    messages: CLIENT_ADDRESS_MESSAGES,
  });

  const { setError } = crud;

  useEffect(() => {
    let active = true;
    setLoadingOptions(true);

    Promise.all([clientAddressService.getAllClients(), clientAddressService.getAllAddresses()])
      .then(([clientsList, addressesList]) => {
        if (!active) return;
        setClients(clientsList);
        setAddresses(addressesList);
      })
      .catch((err) => {
        if (!active) return;
        setError(parseApiError(err, "No se pudieron cargar los clientes o direcciones para el formulario."));
      })
      .finally(() => {
        if (active) setLoadingOptions(false);
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
  } = useForm<ClientAddressFormInput, unknown, ClientAddressPayload>({
    resolver: zodResolver(clientAddressSchema),
    defaultValues: {
      id_cliente: "",
      id_direccion: "",
      predeterminada: false,
    },
  });

  const resetForm = useCallback(() => {
    crud.setEditingId(null);
    reset({
      id_cliente: "",
      id_direccion: "",
      predeterminada: false,
    });
  }, [crud, reset]);

  const handleEdit = (item: ApiClientAddress) => {
    crud.clearMessages();
    crud.setEditingId(item.id_direccion_cliente);
    reset({
      id_cliente: String(item.id_cliente),
      id_direccion: String(item.id_direccion),
      predeterminada: item.predeterminada,
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
    clients,
    addresses,
    loadingOptions,
    getClientLabel,
    getAddressLabel,
  };
}