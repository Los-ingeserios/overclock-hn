import { createCrudService } from "./createCrudService";
import type { Address, AddressPayload, CityOption } from "../types/address";

const cityLookupService = createCrudService<CityOption, never>("/ciudades");

export const addressService = {
	...createCrudService<Address, AddressPayload>("/direcciones/"),
	getAllCities: cityLookupService.getAllPages,
};
