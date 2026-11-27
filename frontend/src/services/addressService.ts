import { createCrudService } from "./createCrudService";
import type { ApiAddress, CreateAddressPayload, CityOption } from "../types/address";

const cityLookupService = createCrudService<CityOption, never>("/ciudades");

export const addressService = {
  ...createCrudService<ApiAddress, CreateAddressPayload>("/direcciones/"),
  getAllCities: cityLookupService.getAllPages,
};