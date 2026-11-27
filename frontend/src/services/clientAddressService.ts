import { createCrudService } from "./createCrudService";
import type { ApiClientAddress, CreateClientAddressPayload, AddressOption } from "../types/clientAddress";
import type { ApiClient } from "../types/client";

const clientLookupService = createCrudService<ApiClient, never>("/clientes/");
const addressLookupService = createCrudService<AddressOption, never>("/direcciones/");

export const clientAddressService = {
  ...createCrudService<ApiClientAddress, CreateClientAddressPayload>("/direcciones-clientes/"),
  getAllClients: clientLookupService.getAllPages,
  getAllAddresses: addressLookupService.getAllPages,
};