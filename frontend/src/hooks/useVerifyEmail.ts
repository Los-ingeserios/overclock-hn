import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/api";
export type VerifyStatus = "idle" | "verifying" | "success" | "error";

export function useVerifyEmail() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const hasCalledRef = useRef(false);
	const [status, setStatus] = useState<VerifyStatus>(token ? "verifying" : "idle");
	const [message, setMessage] = useState<string>(
		token
			? "Verificando tu cuenta, por favor espere..."
			: "Ingresa tu correo electronico para enviar un enlace de confirmacion.",
	);
	const [resendEmail, setResendEmail] = useState("");
	const [isResending, setIsResending] = useState(false);
	const [resendFeedback, setResendFeedback] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	useEffect(() => {
		if (!token || hasCalledRef.current) return;

		hasCalledRef.current = true;

		const verify = async () => {
			try {
				const response = await authService.verifyEmail(token);
				setStatus("success");
				setMessage(response.mensaje);
			} catch (err) {
				const axiosErr = err as AxiosError<ApiErrorResponse>;
				setStatus("error");
				setMessage(axiosErr.response?.data?.detail ?? "El enlace de verificacion no es valido o ha expirado.");
			}
		};
		verify();
	}, [token]);

	const handleResend = async (e: FormEvent) => {
		e.preventDefault();
		if (!resendEmail.trim()) return;

		setIsResending(true);
		setResendFeedback(null);

		try {
			const response = await authService.resendVerification(resendEmail.trim());
			setResendFeedback({ type: "success", text: response.mensaje });
			setResendEmail("");
		} catch (err) {
			const axiosErr = err as AxiosError<ApiErrorResponse>;
			setResendFeedback({
				type: "error",
				text:
					axiosErr.response?.data?.detail ??
					"No pudimos reenviar el correo. Verifica la dirección ingresada.",
			});
		} finally {
			setIsResending(false);
		}
	};

	return {
		status,
		message,
		resendEmail,
		setResendEmail,
		isResending,
		resendFeedback,
		handleResend,
	};
}
