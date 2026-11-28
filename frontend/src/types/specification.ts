import type { SpecificationPayload } from "../schemas/specification.schema";
import type { PaginatedResponse } from "./api";

export type { SpecificationPayload };

export interface Specification extends SpecificationPayload {
	id_especificacion: number;
}

export interface ParsedSpecification {
	id: number;
	raw: string;
	label: string | null;
	value: string;
}

export type PaginatedSpecifications = PaginatedResponse<Specification>;
