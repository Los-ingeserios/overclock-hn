import { Link } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
	const { register, errors, isSubmitting, showPassword, togglePassword, serverError, needsVerification, onSubmit } =
		useLogin();

	return (
		<section className="max-w-300 mx-auto px-5 py-16 lg:py-24 flex items-center justify-center">
			<div className="w-full max-w-md bg-brand-surface/40 border border-brand-divider rounded-2xl p-8 sm:p-10 shadow-2xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-brand-white">Iniciar Sesión</h1>
					<p className="text-brand-muted text-sm mt-2">
						Accede a tu cuenta de <span className="text-brand-primary font-semibold">Overclock HN</span>
					</p>
				</div>

				{serverError && (
					<div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-sm text-red-300">
						<AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
						<div>
							<p>{serverError}</p>
							{needsVerification && (
								<Link
									to="/verificar-cuenta"
									className="inline-block mt-2 text-brand-primary underline font-medium"
								>
									Reenviar correo de confirmación
								</Link>
							)}
						</div>
					</div>
				)}

				<form onSubmit={onSubmit} className="space-y-5" noValidate>
					{/* Usuario o Correo */}
					<div>
						<label htmlFor="identificador" className="block text-sm font-medium text-brand-white mb-2">
							Usuario o correo electrónico
						</label>
						<div className="relative">
							<User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								id="identificador"
								type="text"
								autoComplete="username"
								placeholder="ej. oscar1 o correo@ejemplo.com"
								{...register("identificador")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						{errors.identificador && (
							<p className="text-xs text-red-400 mt-1.5">{errors.identificador.message}</p>
						)}
					</div>

					{/* Contraseña */}
					<div>
						<label htmlFor="contrasena" className="block text-sm font-medium text-brand-white mb-2">
							Contraseña
						</label>
						<div className="relative">
							<Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								id="contrasena"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="********"
								{...register("contrasena")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-11 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							<button
								type="button"
								onClick={togglePassword}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-white transition-colors cursor-pointer"
								aria-label="Mostrar u ocultar contraseña"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.contrasena && (
							<p className="text-xs text-red-400 mt-1.5">{errors.contrasena.message}</p>
						)}
					</div>

					{/* Botón Submit */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-white font-semibold py-3.5 rounded-full transition-colors cursor-pointer mt-2"
					>
						{isSubmitting ? (
							<>
								<Loader2 size={18} className="animate-spin" />
								<span>Ingresando...</span>
							</>
						) : (
							<span>Iniciar Sesión</span>
						)}
					</button>
				</form>

				<p className="text-center text-sm text-brand-muted mt-7">
					¿Aún no tienes cuenta?{" "}
					<Link
						to="/registro"
						className="text-brand-primary hover:text-brand-primary-hover font-semibold transition-colors"
					>
						Crear cuenta
					</Link>
				</p>
			</div>
		</section>
	);
}
