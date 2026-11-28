import { createCrudService } from "./createCrudService";
import type { Department, DepartmentPayload } from "../types/department";
import type { Country } from "../types/country";

const countryLookupService = createCrudService<Country, never>("/paises/");

export const departmentService = {
	...createCrudService<Department, DepartmentPayload>("/departamentos/"),
	getAllCountries: countryLookupService.getAllPages,
};
