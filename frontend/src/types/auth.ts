export interface AuthUser {
	id_usuario: number;
	nombre: string;
	correo: string;
	administrador: boolean;
	verificado: boolean;
	url_foto: string | null;
	id_cliente: number | null;
}

export interface AuthTokens {
	access: string;
	refresh: string;
}

export interface LoginResponse {
	tokens: AuthTokens;
	usuario: AuthUser;
}

export interface RegisterPayload {
	nombre_usuario: string;
	correo: string;
	contrasena: string;
	primer_nombre: string;
	primer_apellido: string;
	rtn?: string;
}

export interface RegisterResponse {
	mensaje: string;
	correo: string;
	requiere_verificacion: boolean;
}

export interface ApiErrorResponse {
	code?: string;
	detail?: string;
	[field: string]: unknown;
}
