import { createCrudService } from "./createCrudService";
import type { Country, CountryPayload } from "../types/country";
export const countryService = createCrudService<Country, CountryPayload>("/paises/");
