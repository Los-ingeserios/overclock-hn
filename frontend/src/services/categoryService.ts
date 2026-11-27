import type { Category, CategoryPayload } from "../types/category";
import { createCrudService } from "./createCrudService";

export const categoryService = createCrudService<Category, CategoryPayload>("/categorias/");
