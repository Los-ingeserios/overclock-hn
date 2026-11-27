import type { DepartmentPayload } from "../schemas/department.schema";
import type { PaginatedResponse } from "./catalog";

export type { DepartmentPayload };

export interface Department extends DepartmentPayload {
    id_departamento: number;

}
export interface CountryOption {
    id_pais: number;
    nombre: string;
    estado: boolean;
}

export type PaginatedDepartments = PaginatedResponse<Department>;