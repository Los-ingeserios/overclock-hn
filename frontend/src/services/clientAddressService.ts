import { createCrudService } from "./createCrudService";
import type { AddressOption, ClientAddress, ClientAddressPayload } from "../types/clientAddress";
import type { Client } from "../types/client";

const clientLookupService = createCrudService<Client, never>("/clientes/");
const addressLookupService = createCrudService<AddressOption, never>("/direcciones/");

export const clientAddressService = {
	...createCrudService<ClientAddress, ClientAddressPayload>("/direcciones-clientes/"),
	getAllClients: clientLookupService.getAllPages,
	getAllAddresses: addressLookupService.getAllPages,
};
