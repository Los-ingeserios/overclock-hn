import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/authService";

export function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();
	const { user, isAuthenticated, refreshToken, logout } = useAuthStore();
	const cartCount = 0;
	const handleLogout = async () => {
		try {
			await authService.logout(refreshToken);
		} finally {
			logout();
			setMenuOpen(false);
			navigate("/login");
		}
	};

	return (
		<header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-divider">
			<div className="max-w-300 mx-auto px-5 py-4 flex items-center justify-between">
				{/* Botón menú móvil */}
				<button
					type="button"
					onClick={() => setMenuOpen(!menuOpen)}
					className="lg:hidden text-brand-white hover:text-brand-primary transition-colors cursor-pointer"
					aria-label="Abrir menú"
				>
					{menuOpen ? <X size={26} /> : <Menu size={26} />}
				</button>

				{/* Logo Overclock HN */}
				<Link to="/" className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-brand-primary">
					Overclock <span className="text-brand-white">HN</span>
				</Link>

				{/* Navegación Desktop */}
				<nav className="hidden lg:flex items-center gap-8">
					<Link to="/" className="text-[17px] text-brand-white hover:text-brand-primary transition-colors">
						Inicio
					</Link>
					<Link
						to="/catalogo"
						className="text-[17px] text-brand-white hover:text-brand-primary transition-colors"
					>
						Catálogo
					</Link>
					<a
						href="/#promociones"
						className="text-[17px] text-brand-white hover:text-brand-primary transition-colors"
					>
						Promociones
					</a>
					<a
						href="/#contacto"
						className="text-[17px] text-brand-white hover:text-brand-primary transition-colors"
					>
						Contacto
					</a>
				</nav>

				{/* Actions (Session + Cart) */}
				<div className="flex items-center gap-3 sm:gap-4">
					{isAuthenticated && user ? (
						<div className="hidden sm:flex items-center gap-3">
							{user.administrador && (
								<Link
									to="/admin"
									className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide bg-brand-primary/20 text-brand-primary border border-brand-primary/40 px-3 py-1.5 rounded-full hover:bg-brand-primary hover:text-brand-white transition-colors"
								>
									<Shield size={14} />
									<span>Admin</span>
								</Link>
							)}

							<Link
								to="/mi-cuenta"
								className="inline-flex items-center gap-2 text-sm font-medium text-brand-white hover:text-brand-primary transition-colors"
							>
								<User size={16} className="text-brand-primary" />
								<span className="max-w-20 truncate">{user.nombre}</span>
							</Link>

							<button
								type="button"
								onClick={handleLogout}
								className="p-2 text-brand-muted hover:text-red-400 transition-colors cursor-pointer"
								title="Cerrar sesión"
								aria-label="Cerrar sesión"
							>
								<LogOut size={18} />
							</button>
						</div>
					) : (
						<Link
							to="/login"
							className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-white border border-brand-primary px-4 py-2 rounded-full hover:bg-brand-primary-hover transition-colors"
						>
							<User size={16} />
							<span>Ingresar</span>
						</Link>
					)}

					<Link
						to="/carrito"
						className="relative p-2 text-brand-white hover:text-brand-primary transition-colors"
						aria-label="Carrito de compras"
					>
						<ShoppingCart size={24} />
						<span className="absolute -top-1 -right-1 bg-brand-primary text-brand-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
							{cartCount}
						</span>
					</Link>
				</div>
			</div>

			{/* Mobile drop-down menu */}
			{menuOpen && (
				<nav className="lg:hidden bg-brand-surface border-t border-brand-glass">
					<ul className="flex flex-col text-center">
						<li>
							<Link
								to="/"
								onClick={() => setMenuOpen(false)}
								className="block py-4 text-brand-white border-b border-brand-glass hover:text-brand-primary"
							>
								Inicio
							</Link>
						</li>
						<li>
							<Link
								to="/catalogo"
								onClick={() => setMenuOpen(false)}
								className="block py-4 text-brand-white border-b border-brand-glass hover:text-brand-primary"
							>
								Catálogo
							</Link>
						</li>
						<li>
							<a
								href="/#promociones"
								onClick={() => setMenuOpen(false)}
								className="block py-4 text-brand-white border-b border-brand-glass hover:text-brand-primary"
							>
								Promociones
							</a>
						</li>

						{isAuthenticated && user ? (
							<>
								{user.administrador && (
									<li>
										<Link
											to="/admin"
											onClick={() => setMenuOpen(false)}
											className="block py-4 text-brand-primary font-semibold border-b border-brand-glass"
										>
											Panel Administrador
										</Link>
									</li>
								)}
								<li>
									<Link
										to="/mi-cuenta"
										onClick={() => setMenuOpen(false)}
										className="block py-4 text-brand-white border-b border-brand-glass hover:text-brand-primary"
									>
										Mi Cuenta ({user.nombre})
									</Link>
								</li>
								<li>
									<button
										type="button"
										onClick={handleLogout}
										className="w-full py-4 font-semibold text-red-400 hover:bg-brand-bg/40 cursor-pointer"
									>
										Cerrar Sesión
									</button>
								</li>
							</>
						) : (
							<li>
								<Link
									to="/login"
									onClick={() => setMenuOpen(false)}
									className="block py-4 font-semibold text-brand-primary hover:bg-brand-bg/40"
								>
									Iniciar Sesión
								</Link>
							</li>
						)}
					</ul>
				</nav>
			)}
		</header>
	);
}
