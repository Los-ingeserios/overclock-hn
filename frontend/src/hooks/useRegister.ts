import { useState } from "react";
import { useForm } from "react-hook-form";
import { type RegisterFormValues, registerSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/authService";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/auth";

export function useRegister() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [isResending, setIsResending] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			primer_nombre: "",
			primer_apellido: "",
			nombre_usuario: "",
			correo: "",
			rtn: "",
			contrasena: "",
			confirmar_contrasena: "",
		},
	});

	const onSubmit = handleSubmit(async (values) => {
		setServerError(null);
		setResendMessage(null);

		try {
			const response = await authService.register({
				primer_nombre: values.primer_nombre,
				primer_apellido: values.primer_apellido,
				nombre_usuario: values.nombre_usuario,
				correo: values.correo,
				contrasena: values.contrasena,
				rtn: values.rtn ? values.rtn : undefined,
			});

			setRegisteredEmail(response.correo);
		} catch (err) {
			const axiosErr = err as AxiosError<ApiErrorResponse>;
			const data = axiosErr.response?.data;
			setServerError(
				data?.detail ?? "No se puede crear la cuenta. Verifica que el usuario o correo no esten registrados",
			);
		}
	});

	const handleResend = async () => {
		if (!registeredEmail) return;
		setIsResending(true);
		setResendMessage(null);

		try {
			const res = await authService.resendVerification(registeredEmail);
			setResendMessage(res.mensaje);
		} catch {
			setResendMessage("No se pudo reenviar el correo. Intente denuevo mas tarde.");
		} finally {
			setIsResending(false);
		}
	};

	return {
		register,
		errors,
		isSubmitting,
		showPassword,
		togglePassword: () => setShowPassword((prev) => !prev),
		showConfirmPassword,
		toggleConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
		serverError,
		registeredEmail,
		resendMessage,
		isResending,
		handleResend,
		onSubmit,
	};
}
