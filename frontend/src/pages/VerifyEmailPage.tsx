import { CheckCircle2, Loader2, Mail, Send, XCircle } from "lucide-react";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { Link } from "react-router-dom";

export function VerifyEmailPage() {
	const { status, message, resendEmail, setResendEmail, isResending, resendFeedback, handleResend } =
		useVerifyEmail();

	return (
		<section className="max-w-300 mx-auto px-5 py-16 lg:py-24 flex items-center justify-center">
			<div className="w-full max-w-md bg-brand-surface/40 border border-brand-divider rounded-2xl p-8 sm:p-10 text-center shadow-2xl">
				{/* Status icon */}
				<div className="flex justify-center mb-6">
					{status === "verifying" && (
						<div className="w-16 h-16 rounded-full bg-brand-primary/15 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
							<Loader2 size={32} className="animate-spin" />
						</div>
					)}
					{status === "success" && (
						<div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
							<CheckCircle2 size={34} />
						</div>
					)}
					{status === "error" && (
						<div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400">
							<XCircle size={34} />
						</div>
					)}
					{status === "idle" && (
						<div className="w-16 h-16 rounded-full bg-brand-primary/15 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
							<Mail size={32} />
						</div>
					)}
				</div>

				{/* Title */}
				<h1 className="text-2xl font-bold text-brand-white">
					{status === "verifying" && "Confirmando tu cuenta"}
					{status === "success" && "¡Cuenta confirmada!"}
					{status === "error" && "No se pudo verificar"}
					{status === "idle" && "Confirmación de correo"}
				</h1>

				<p className="text-brand-muted text-sm mt-3 leading-relaxed">{message}</p>

				{/* Action if verification was successful */}
				{status === "success" && (
					<Link
						to="/login"
						className="mt-8 w-full inline-block bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-semibold py-3.5 rounded-full transition-colors"
					>
						Iniciar Sesión ahora
					</Link>
				)}

				{/* Formulario de reenvío si expiró el token o entró sin token */}
				{(status === "error" || status === "idle") && (
					<form onSubmit={handleResend} className="mt-7 space-y-4 text-left">
						<div>
							<label htmlFor="resendEmail" className="block text-sm font-medium text-brand-white mb-1.5">
								Solicitar nuevo enlace de verificación
							</label>
							<input
								id="resendEmail"
								type="email"
								required
								value={resendEmail}
								onChange={(e) => setResendEmail(e.target.value)}
								placeholder="tu-correo@ejemplo.com"
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>

						{resendFeedback && (
							<p
								className={`text-xs rounded-xl p-3 border ${
									resendFeedback.type === "success"
										? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
										: "text-red-300 bg-red-500/10 border-red-500/30"
								}`}
							>
								{resendFeedback.text}
							</p>
						)}

						<button
							type="submit"
							disabled={isResending}
							className="w-full inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-60 text-brand-white font-semibold py-3 rounded-full transition-colors cursor-pointer"
						>
							{isResending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
							<span>Enviar enlace</span>
						</button>

						<div className="text-center pt-2">
							<Link
								to="/login"
								className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
							>
								Volver a Iniciar Sesión
							</Link>
						</div>
					</form>
				)}
			</div>
		</section>
	);
}
