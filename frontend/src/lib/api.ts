import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

interface RetryableRequest extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config as RetryableRequest | undefined;
		const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
		const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthEndpoint &&
			refreshToken
		) {
			originalRequest._retry = true;

			try {
				const { data } = await axios.post<{ access: string }>(`${API_BASE_URL}/auth/token/refresh/`, {
					refresh: refreshToken,
				});

				setAccessToken(data.access);
				originalRequest.headers.Authorization = `Bearer ${data.access}`;
				return api(originalRequest);
			} catch {
				logout();
			}
		}

		return Promise.reject(error);
	},
);
