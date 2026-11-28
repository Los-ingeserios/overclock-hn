import type { AddressPayload } from "../schemas/address.schema";
import type { City } from "./city";

export type { AddressPayload };

export interface Address extends AddressPayload {
	id_direccion: number;
}

export type CityOption = Pick<City, "id_ciudad" | "nombre">;
