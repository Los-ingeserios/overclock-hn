import type { CategoryPayload } from "../schemas/category.schema";

export type { CategoryPayload };

export interface Category extends Omit<CategoryPayload, "descripcion"> {
	id_categoria: number;
	descripcion: string | null;
}
