import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { AlertCircle, CreditCard, Eye, EyeOff, Loader2, Lock, Mail, MailCheck, RefreshCw, User } from "lucide-react";

export function RegisterPage() {
	const {
		register,
		errors,
		isSubmitting,
		showPassword,
		togglePassword,
		showConfirmPassword,
		toggleConfirmPassword,
		serverError,
		registeredEmail,
		resendMessage,
		isResending,
		handleResend,
		onSubmit,
	} = useRegister();

	if (registeredEmail) {
		return (
			<section className="max-w-300 mx-auto px-5 py-16 lg:py-24 flex items-center justify-center">
				<div className="w-full max-w-md bg-brand-surface/40 border border-brand-divider rounded-2xl p-8 sm:p-10 text-center shadow-2xl">
					<div className="w-16 h-16 rounded-full bg-brand-primary/15 border border-brand-primary/40 flex items-center justify-center text-brand-primary mx-auto mb-6">
						<MailCheck size={32} />
					</div>

					<h1 className="text-2xl font-bold text-brand-white">¡Revisa tu correo!</h1>
					<p className="text-brand-muted text-sm mt-3 leading-relaxed">
						Enviamos un enlace de confirmación a{" "}
						<span className="text-brand-white font-semibold">{registeredEmail}</span>. Ábrelo para activar
						tu cuenta en Overclock HN.
					</p>

					{resendMessage && (
						<p className="mt-4 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
							{resendMessage}
						</p>
					)}

					<div className="mt-8 flex flex-col gap-3">
						<button
							type="button"
							onClick={handleResend}
							disabled={isResending}
							className="w-full inline-flex items-center justify-center gap-2 border border-brand-primary hover:bg-brand-primary-hover disabled:opacity-60 text-brand-white text-sm font-medium py-3 rounded-full transition-colors cursor-pointer"
						>
							{isResending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
							<span>Reenviar correo de confirmación</span>
						</button>

						<Link
							to="/login"
							className="w-full inline-block bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-semibold py-3 rounded-full transition-colors"
						>
							Ir a Iniciar Sesión
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="max-w-300 mx-auto px-5 py-14 lg:py-20 flex items-center justify-center">
			<div className="w-full max-w-lg bg-brand-surface/40 border border-brand-divider rounded-2xl p-8 sm:p-10 shadow-2xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-brand-white">Crear Cuenta</h1>
					<p className="text-brand-muted text-sm mt-2">
						Regístrate en <span className="text-brand-primary font-semibold">Overclock HN</span> para
						comprar hardware y gestionar tus pedidos
					</p>
				</div>

				{serverError && (
					<div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-sm text-red-300">
						<AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
						<p>{serverError}</p>
					</div>
				)}

				<form onSubmit={onSubmit} className="space-y-4" noValidate>
					{/* First Name and Last Name */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="primer_nombre"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Primer nombre
							</label>
							<input
								id="primer_nombre"
								type="text"
								placeholder="Juan"
								{...register("primer_nombre")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							{errors.primer_nombre && (
								<p className="text-xs text-red-400 mt-1">{errors.primer_nombre.message}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="primer_apellido"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Primer apellido
							</label>
							<input
								id="primer_apellido"
								type="text"
								placeholder="Méndez"
								{...register("primer_apellido")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							{errors.primer_apellido && (
								<p className="text-xs text-red-400 mt-1">{errors.primer_apellido.message}</p>
							)}
						</div>
					</div>

					{/* User */}
					<div>
						<label htmlFor="nombre_usuario" className="block text-sm font-medium text-brand-white mb-1.5">
							Nombre de usuario
						</label>
						<div className="relative">
							<User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								id="nombre_usuario"
								type="text"
								autoComplete="username"
								placeholder="ej. juan_dev"
								{...register("nombre_usuario")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						{errors.nombre_usuario && (
							<p className="text-xs text-red-400 mt-1">{errors.nombre_usuario.message}</p>
						)}
					</div>

					{/* Mail */}
					<div>
						<label htmlFor="correo" className="block text-sm font-medium text-brand-white mb-1.5">
							Correo electrónico
						</label>
						<div className="relative">
							<Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								id="correo"
								type="email"
								autoComplete="email"
								placeholder="correo@ejemplo.com"
								{...register("correo")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						{errors.correo && <p className="text-xs text-red-400 mt-1">{errors.correo.message}</p>}
					</div>

					{/* RTN (Optional) */}
					<div>
						<label htmlFor="rtn" className="block text-sm font-medium text-brand-white mb-1.5">
							RTN{" "}
							<span className="text-xs font-normal text-brand-muted">
								(opcional — 14 dígitos para facturación SAR)
							</span>
						</label>
						<div className="relative">
							<CreditCard
								size={18}
								className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
							/>
							<input
								id="rtn"
								type="text"
								maxLength={14}
								placeholder="08011999123456"
								{...register("rtn")}
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-4 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
						</div>
						{errors.rtn && <p className="text-xs text-red-400 mt-1">{errors.rtn.message}</p>}
					</div>

					{/* Password and Confirmation */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="contrasena" className="block text-sm font-medium text-brand-white mb-1.5">
								Contraseña
							</label>
							<div className="relative">
								<Lock
									size={18}
									className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
								/>
								<input
									id="contrasena"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									placeholder="••••••••"
									{...register("contrasena")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-10 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								<button
									type="button"
									onClick={togglePassword}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-white cursor-pointer"
									aria-label="Mostrar contraseña"
								>
									{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
								</button>
							</div>
							{errors.contrasena && (
								<p className="text-xs text-red-400 mt-1">{errors.contrasena.message}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="confirmar_contrasena"
								className="block text-sm font-medium text-brand-white mb-1.5"
							>
								Confirmar contraseña
							</label>
							<div className="relative">
								<Lock
									size={18}
									className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
								/>
								<input
									id="confirmar_contrasena"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									placeholder="••••••••"
									{...register("confirmar_contrasena")}
									className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-11 pr-10 py-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
								/>
								<button
									type="button"
									onClick={toggleConfirmPassword}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-white cursor-pointer"
									aria-label="Mostrar confirmación"
								>
									{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
								</button>
							</div>
							{errors.confirmar_contrasena && (
								<p className="text-xs text-red-400 mt-1">{errors.confirmar_contrasena.message}</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-white font-semibold py-3.5 rounded-full transition-colors cursor-pointer mt-3"
					>
						{isSubmitting ? (
							<>
								<Loader2 size={18} className="animate-spin" />
								<span>Creando cuenta...</span>
							</>
						) : (
							<span>Crear cuenta</span>
						)}
					</button>
				</form>

				<p className="text-center text-sm text-brand-muted mt-7">
					¿Ya tienes una cuenta?{" "}
					<Link
						to="/login"
						className="text-brand-primary hover:text-brand-primary-hover font-semibold transition-colors"
					>
						Iniciar sesión
					</Link>
				</p>
			</div>
		</section>
	);
}
