import { createCrudService } from "./createCrudService";
import type { Brand, BrandPayload } from "../types/brand";
import type { CountryOption } from "../types/department";

const countryLookupService = createCrudService<CountryOption, never>("/paises/");

export const brandService = {
    ...createCrudService<Brand, BrandPayload>("/marcas/"),
    getAllCountries: countryLookupService.getAllPages,
};
