import type { ClientPayload } from "../schemas/client.schema";

export type { ClientPayload };

export interface Client extends ClientPayload {
	id_cliente: number;
	fecha_registro: string;
}
