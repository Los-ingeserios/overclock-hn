import type { City, CityPayload } from "../types/city";
import type { Department } from "../types/department";
import { createCrudService } from "./createCrudService";

const departamentLookupService = createCrudService<Department, never>("/departamentos");

export const cityService = {
	...createCrudService<City, CityPayload>("/ciudades/"),
	getAllDepartments: departamentLookupService.getAllPages,
};
