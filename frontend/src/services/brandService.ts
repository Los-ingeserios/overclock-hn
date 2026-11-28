import { createCrudService } from "./createCrudService";
import type { Brand, BrandPayload } from "../types/brand";
import type { Country } from "../types/country";

const countryLookupService = createCrudService<Country, never>("/paises/");

export const brandService = {
	...createCrudService<Brand, BrandPayload>("/marcas/"),
	getAllCountries: countryLookupService.getAllPages,
};
