export interface ApiAddress {
  id_direccion: number;
  id_ciudad: number;
  calle: string;
  referencias: string | null;
}

export interface CreateAddressPayload {
  id_ciudad: number;
  calle: string;
  referencias?: string | null;
}

export interface CityOption {
  id_ciudad: number;
  nombre: string;
}