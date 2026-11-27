export interface ApiClientAddress {
  id_direccion_cliente: number;
  id_direccion: number;
  id_cliente: number;
  predeterminada: boolean;
}

export interface CreateClientAddressPayload {
  id_direccion: number;
  id_cliente: number;
  predeterminada: boolean;
}

export interface AddressOption {
  id_direccion: number;
  calle: string;
}