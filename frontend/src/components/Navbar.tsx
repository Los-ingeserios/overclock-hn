import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/authService";

// TODO: Cambiar a false cuando se conecte el Login real y los permisos de administrador
const SHOW_ADMIN_SHORTCUT = true;

export function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { user, isAuthenticated, refreshToken, logout } = useAuthStore();

	const cartCount = 0;
	const canAccessAdmin = SHOW_ADMIN_SHORTCUT || Boolean(user?.administrador);
	const isInAdmin = location.pathname.startsWith("/admin");

	const handleLogout = async () => {
		try {
			await authService.logout(refreshToken);
		} finally {
			logout();
			setMenuOpen(false);
			navigate("/login");
		}
	};

	const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
		`text-[16px] font-medium transition-colors ${
			isActive ? "text-brand-primary" : "text-brand-white hover:text-brand-primary"
		}`;

	return (
		<header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-divider">
			<div className="max-w-300 mx-auto px-5 py-4 flex items-center justify-between gap-4">
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
				<Link
					to="/"
					className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-brand-primary shrink-0"
				>
					Overclock <span className="text-brand-white">HN</span>
				</Link>

				{/* Navegación Desktop */}
				<nav className="hidden lg:flex items-center gap-8">
					<NavLink to="/" end className={desktopNavLinkClass}>
						Inicio
					</NavLink>
					<NavLink to="/catalogo" className={desktopNavLinkClass}>
						Catálogo
					</NavLink>
					<a
						href="/#promociones"
						className="text-[16px] font-medium text-brand-white hover:text-brand-primary transition-colors"
					>
						Promociones
					</a>
					<a
						href="/#contacto"
						className="text-[16px] font-medium text-brand-white hover:text-brand-primary transition-colors"
					>
						Contacto
					</a>
				</nav>

				{/* Acciones (Admin + Sesión + Carrito) */}
				<div className="flex items-center gap-2.5 sm:gap-3.5">
					{canAccessAdmin && (
						<Link
							to="/admin"
							className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full border transition-colors ${
								isInAdmin
									? "bg-brand-primary text-brand-white border-brand-primary shadow-md"
									: "bg-brand-primary/15 text-brand-primary border-brand-primary/40 hover:bg-brand-primary hover:text-brand-white"
							}`}
						>
							<Shield size={14} />
							<span>Admin</span>
						</Link>
					)}

					{isAuthenticated && user ? (
						<div className="hidden sm:flex items-center gap-2.5">
							<Link
								to="/mi-cuenta"
								className="inline-flex items-center gap-2 text-sm font-medium text-brand-white hover:text-brand-primary transition-colors"
							>
								<User size={16} className="text-brand-primary" />
								<span className="max-w-24 truncate">{user.nombre}</span>
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
						<ShoppingCart size={23} />
						<span className="absolute -top-1 -right-1 bg-brand-primary text-brand-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
							{cartCount}
						</span>
					</Link>
				</div>
			</div>

			{/* Menú desplegable móvil */}
			{menuOpen && (
				<nav className="lg:hidden bg-brand-surface border-t border-brand-glass">
					<ul className="flex flex-col text-center">
						<li>
							<NavLink
								to="/"
								end
								onClick={() => setMenuOpen(false)}
								className={({ isActive }) =>
									`block py-3.5 border-b border-brand-glass transition-colors ${
										isActive
											? "text-brand-primary font-semibold"
											: "text-brand-white hover:text-brand-primary"
									}`
								}
							>
								Inicio
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/catalogo"
								onClick={() => setMenuOpen(false)}
								className={({ isActive }) =>
									`block py-3.5 border-b border-brand-glass transition-colors ${
										isActive
											? "text-brand-primary font-semibold"
											: "text-brand-white hover:text-brand-primary"
									}`
								}
							>
								Catálogo
							</NavLink>
						</li>
						<li>
							<a
								href="/#promociones"
								onClick={() => setMenuOpen(false)}
								className="block py-3.5 text-brand-white border-b border-brand-glass hover:text-brand-primary"
							>
								Promociones
							</a>
						</li>
						<li>
							<a
								href="/#contacto"
								onClick={() => setMenuOpen(false)}
								className="block py-3.5 text-brand-white border-b border-brand-glass hover:text-brand-primary"
							>
								Contacto
							</a>
						</li>

						{canAccessAdmin && (
							<li>
								<Link
									to="/admin"
									onClick={() => setMenuOpen(false)}
									className="flex items-center justify-center gap-2 py-3.5 text-brand-primary font-semibold border-b border-brand-glass hover:bg-brand-bg/30"
								>
									<Shield size={16} />
									<span>Panel Administrador</span>
								</Link>
							</li>
						)}

						{isAuthenticated && user ? (
							<>
								<li>
									<Link
										to="/mi-cuenta"
										onClick={() => setMenuOpen(false)}
										className="block py-3.5 text-brand-white border-b border-brand-glass hover:text-brand-primary"
									>
										Mi Cuenta ({user.nombre})
									</Link>
								</li>
								<li>
									<button
										type="button"
										onClick={handleLogout}
										className="w-full py-3.5 font-semibold text-red-400 hover:bg-brand-bg/40 cursor-pointer"
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
									className="block py-3.5 font-semibold text-brand-primary hover:bg-brand-bg/40"
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
