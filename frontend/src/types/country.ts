import type { CountryPayload } from "../schemas/country.schema";

export type { CountryPayload };

export interface Country extends CountryPayload {
	id_pais: number;
}
