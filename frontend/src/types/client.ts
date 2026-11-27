
export interface ApiClient {
    id_cliente: number;
    dni: string;
    rtn: string | null;
    primer_nombre: string;
    segundo_nombre: string | null;
    primer_apellido: string;
    segundo_apellido: string | null;
    fecha_nacimiento: string;
    telefono: string;
    correo: string;
    fecha_registro: string;
    razon_social: string | null;
    estado: boolean;
}

export interface CreateClientPayload{
    dni: string;
    rtn?: string | null;
    primer_nombre: string;
    segundo_nombre?: string | null;
    primer_apellido: string;
    segundo_apellido?: string | null;
    fecha_nacimiento: string;
    telefono: string;
    correo: string;
    razon_social?: string | null;
    estado: boolean;
}