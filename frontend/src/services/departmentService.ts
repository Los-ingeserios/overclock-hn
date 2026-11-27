import { createCrudService } from "./createCrudService";
import type { Department, DepartmentPayload, CountryOption } from "../types/department";

const countryLookupService = createCrudService<CountryOption, never>("/paises/");

export const departmentService = {
    ...createCrudService<Department, DepartmentPayload>("/departamentos/"),
    getAllCountries: countryLookupService.getAllPages,
};
