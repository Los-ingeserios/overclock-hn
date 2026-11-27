import type { CountryPayload } from "../schemas/country.schema";
import type { PaginatedResponse } from "./catalog";

export type { CountryPayload };

export interface Country extends CountryPayload {
    id_pais: number;
}

export type PaginatedCountries = PaginatedResponse<Country>;
