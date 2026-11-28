import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import type { AxiosError } from "axios";
import { authService } from "../services/authService";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ApiErrorResponse } from "../types/api";

export function useLogin() {
	const navigate = useNavigate();
	const location = useLocation();
	const setSession = useAuthStore((state) => state.setSession);

	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [needsVerification, setNeedsVerification] = useState(false);

	const from = (location.state as { from?: string } | null)?.from ?? "/";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			identificador: "",
			contrasena: "",
		},
	});

	const onSubmit = handleSubmit(async (values) => {
		setServerError(null);
		setNeedsVerification(false);

		try {
			const response = await authService.login(values);
			setSession(response.usuario, response.tokens);
			navigate(response.usuario.administrador ? "/admin" : from, { replace: true });
		} catch (err) {
			const axiosErr = err as AxiosError<ApiErrorResponse>;
			const data = axiosErr.response?.data;

			if (data?.code === "EMAIL_NOT_VERIFIED") {
				setNeedsVerification(true);
			}

			setServerError(data?.detail ?? "No se puede iniciar sesion. Intenta denuevo.");
		}
	});

	return {
		register,
		errors,
		isSubmitting,
		showPassword,
		togglePassword: () => setShowPassword((prev) => !prev),
		serverError,
		needsVerification,
		onSubmit,
	};
}
