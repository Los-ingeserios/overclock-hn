import { createCrudService } from "./createCrudService";
import type { ApiClient, CreateClientPayload } from "../types/client";

export const clientService = createCrudService<ApiClient, CreateClientPayload>("/clientes/");