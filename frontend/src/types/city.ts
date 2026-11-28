import type { CityPayload } from "../schemas/city.schema";

export type { CityPayload };

export interface City extends CityPayload {
	id_ciudad: number;
}
