import { Link } from "react-router-dom";

export function Footer() {
	return (
		<footer id="contacto" className="border-t border-brand-divider mt-10">
			<div className="max-w-300 mx-auto px-5 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
				<div>
					<h3 className="text-lg font-semibold text-brand-white mb-4">Navegación</h3>
					<ul className="space-y-2.5">
						<li>
							<Link to="/" className="text-brand-muted hover:text-brand-primary transition-colors">
								Inicio
							</Link>
						</li>
						<li>
							<Link
								to="/catalogo"
								className="text-brand-muted hover:text-brand-primary transition-colors"
							>
								Catálogo
							</Link>
						</li>
						<li>
							<a
								href="#promociones"
								className="text-brand-muted hover:text-brand-primary transition-colors"
							>
								Promociones
							</a>
						</li>
						<li>
							<Link to="/login" className="text-brand-muted hover:text-brand-primary transition-colors">
								Mi Cuenta
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-semibold text-brand-white mb-4">Categorías</h3>
					<ul className="space-y-2.5">
						<li>
							<Link
								to="/catalogo"
								className="text-brand-muted hover:text-brand-primary transition-colors"
							>
								Tarjetas Gráficas
							</Link>
						</li>
						<li>
							<Link
								to="/catalogo"
								className="text-brand-muted hover:text-brand-primary transition-colors"
							>
								Procesadores
							</Link>
						</li>
						<li>
							<Link
								to="/catalogo"
								className="text-brand-muted hover:text-brand-primary transition-colors"
							>
								Laptops & PCs
							</Link>
						</li>
						<li>
							<Link
								to="/catalogo"
								className="text-brand-muted hover:text-brand-primary transition-colors"
							>
								Periféricos Gaming
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-semibold text-brand-white mb-4">Soporte</h3>
					<ul className="space-y-2.5">
						<li>
							<span className="text-brand-muted">Facturación Legal SAR</span>
						</li>
						<li>
							<span className="text-brand-muted">Garantía de Hardware</span>
						</li>
						<li>
							<span className="text-brand-muted">Envíos a nivel nacional</span>
						</li>
						<li>
							<span className="text-brand-muted">Tegucigalpa, Honduras</span>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-extrabold uppercase text-brand-primary mb-4">Overclock HN</h3>
					<p className="text-brand-muted text-sm leading-relaxed">
						Tu tienda especializada en componentes de alto rendimiento, periféricos gaming, computadoras y
						accesorios de TI con respaldo garantizado en Honduras.
					</p>
				</div>
			</div>

			<div className="border-t border-brand-divider py-4 text-center text-xs text-brand-muted">
				© {new Date().getFullYear()} Overclock HN. Todos los derechos reservados.
			</div>
		</footer>
	);
}
