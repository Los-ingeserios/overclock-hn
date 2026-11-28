import type { DepartmentPayload } from "../schemas/department.schema";

export type { DepartmentPayload };

export interface Department extends DepartmentPayload {
	id_departamento: number;
}
