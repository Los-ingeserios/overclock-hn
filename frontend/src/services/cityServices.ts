import type { City, CityPayload, DepartamentOption } from "../types/city";
import { createCrudService } from "./createCrudService";

const departamentLookupService = createCrudService<DepartamentOption, never>("/departamentos");

export const cityService = {
	...createCrudService<City, CityPayload>("/ciudades/"),
	getAllDepartments: departamentLookupService.getAllPages,
};
