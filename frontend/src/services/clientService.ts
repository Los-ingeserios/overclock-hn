import type { Client, ClientPayload } from "../types/client";
import { createCrudService } from "./createCrudService";

export const clientService = createCrudService<Client, ClientPayload>("/clientes/");
