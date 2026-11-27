import type { CityPayload } from "../schemas/city.schema";
import type { PaginatedResponse } from "./catalog";

export type { CityPayload };

export interface City extends CityPayload {
	id_ciudad: number;
}

export interface DepartamentOption {
	id_departamento: number;
	id_pais: number;
	nombre: string;
	estado: boolean;
}

export type PaginatedCities = PaginatedResponse<City>;
export type PaginatedDepartments = PaginatedResponse<DepartamentOption>;
