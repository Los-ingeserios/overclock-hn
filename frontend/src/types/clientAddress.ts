import type { ClientAddressPayload } from "../schemas/clientAddress.schema";
import type { Address } from "./address";

export type { ClientAddressPayload };

export interface ClientAddress extends ClientAddressPayload {
	id_direccion_cliente: number;
}

export type AddressOption = Pick<Address, "id_direccion" | "calle">;
