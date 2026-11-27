import type { CategoryPayload } from "../schemas/category.schema";
import type { PaginatedResponse } from "./catalog";

export type { CategoryPayload };

export interface Category extends Omit<CategoryPayload, "descripcion"> {
	id_categoria: number;
	descripcion: string | null;
}

export type PaginatedCategories = PaginatedResponse<Category>;
