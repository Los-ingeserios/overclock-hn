import { api } from "../lib/api";
import type { LoginFormValues } from "../schemas/auth.schema";
import type { AuthUser, LoginResponse, RegisterPayload, RegisterResponse } from "../types/auth";

const USE_MOCK_AUTH = true;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const authService = {
	async login(credentials: LoginFormValues): Promise<LoginResponse> {
		if (USE_MOCK_AUTH) {
			await delay(700);
			if (credentials.contrasena !== "12345678") {
				throw {
					response: {
						status: 401,
						data: {
							code: "INVALID_CREDENTIALS",
							detail: "Usuario o contraseña incorrectos (Mock: usa clave 123456).",
						},
					},
				};
			}
			return {
				tokens: {
					access: "mock-access-token-overclock-hn",
					refresh: "mock-refresh-token-overclock-hn",
				},
				usuario: {
					id_usuario: 1,
					nombre: credentials.identificador,
					correo: "cliente@overclockhn.com",
					administrador: credentials.identificador.toLowerCase() === "admin",
					verificado: true,
					url_foto: null,
					id_cliente: 1,
				},
			};
		}

		const { data } = await api.post<LoginResponse>("/auth/login/", credentials);
		return data;
	},

	async register(payload: RegisterPayload): Promise<RegisterResponse> {
		if (USE_MOCK_AUTH) {
			await delay(800);
			return {
				mensaje: "Cuenta creada. Revisa tu correo para activar tu acceso.",
				correo: payload.correo,
				requiere_verificacion: true,
			};
		}

		const { data } = await api.post<RegisterResponse>("/auth/register/", payload);
		return data;
	},

	async verifyEmail(token: string): Promise<{ mensaje: string }> {
		if (USE_MOCK_AUTH) {
			await delay(800);
			if (token === "invalido") {
				throw {
					response: {
						status: 400,
						data: {
							code: "TOKEN_EXPIRED",
							detail: "El enlace de verificación expiró o no es válido.",
						},
					},
				};
			}
			return { mensaje: "Tu cuenta ha sido verificada exitosamente." };
		}

		const { data } = await api.post<{ mensaje: string }>("/auth/verify-email/", {
			token,
		});
		return data;
	},

	async resendVerification(correo: string): Promise<{ mensaje: string }> {
		if (USE_MOCK_AUTH) {
			await delay(600);
			return { mensaje: `Nuevo enlace enviado a ${correo}.` };
		}

		const { data } = await api.post<{ mensaje: string }>("/auth/resend-verification/", { correo });
		return data;
	},

	async getMe(): Promise<AuthUser> {
		const { data } = await api.get<AuthUser>("/auth/me/");
		return data;
	},

	async logout(refreshToken: string | null): Promise<void> {
		if (USE_MOCK_AUTH || !refreshToken) return;
		await api.post("/auth/logout/", { refresh: refreshToken });
	},
};
