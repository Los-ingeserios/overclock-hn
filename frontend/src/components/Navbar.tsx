import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";

export function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const cartCount = 0;

	return (
		<header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-divider">
			<div className="max-w-300 mx-auto px-5 py-4 flex items-center justify-between">
				{/* Mobile menu button */}
				<button
					type="button"
					onClick={() => setMenuOpen(!menuOpen)}
					className="lg:hidden text-brand-white hover:text-brand-primary transition-colors cursor-pointer"
					aria-label="Abrir menú"
				>
					{menuOpen ? <X size={26} /> : <Menu size={26} />}
				</button>

				{/* Overclock HN Logo */}
				<Link to="/" className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-brand-primary">
					Overclock <span className="text-brand-white">HN</span>
				</Link>

				{/* Desktop Navigation */}
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
						href="#promociones"
						className="text-[17px] text-brand-white hover:text-brand-primary transition-colors"
					>
						Promociones
					</a>
					<a
						href="#contacto"
						className="text-[17px] text-brand-white hover:text-brand-primary transition-colors"
					>
						Contacto
					</a>
				</nav>

				{/* Actions (Login + Cart) */}
				<div className="flex items-center gap-4">
					<Link
						to="/login"
						className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-white border border-brand-primary px-4 py-2 rounded-full hover:bg-brand-primary-hover transition-colors"
					>
						<User size={16} />
						<span>Ingresar</span>
					</Link>

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
								href="#promociones"
								onClick={() => setMenuOpen(false)}
								className="block py-4 text-brand-white border-b border-brand-glass hover:text-brand-primary"
							>
								Promociones
							</a>
						</li>
						<li>
							<Link
								to="/login"
								onClick={() => setMenuOpen(false)}
								className="block py-4 font-semibold text-brand-primary hover:bg-brand-bg/40"
							>
								Iniciar Sesión
							</Link>
						</li>
					</ul>
				</nav>
			)}
		</header>
	);
}
