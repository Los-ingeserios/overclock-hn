import { ArrowBigDown, Cpu, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function NotFoundPage() {
	const location = useLocation();
	const navigate = useNavigate();
	return (
		<section className="max-w-300 mx-auto px-5 py-20 lg:py-28 flex flex-col items-center justify-center text-center">
			{/* Ícono decorativo */}
			<div className="w-20 h-20 rounded-full bg-brand-primary/15 border border-brand-primary/40 flex items-center justify-center text-brand-primary mb-6">
				<Cpu size={40} />
			</div>

			{/* 404 Code */}
			<h1 className="text-7xl sm:text-8xl font-extrabold text-brand-primary tracking-tight leading-none">404</h1>

			<h2 className="text-2xl sm:text-3xl font-bold text-brand-white mt-4">Página no encontrada</h2>

			<p className="text-brand-muted max-w-md mt-3 text-base leading-relaxed">
				La ruta{" "}
				<code className="text-brand-white bg-brand-surface px-2 py-0.5 rounded text-sm">
					{location.pathname}
				</code>{" "}
				no existe o fue movida dentro de Overclock HN.
			</p>

			{/* Standard buttons from the Design System */}
			<div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
				<Link
					to="/"
					className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-medium px-8 py-3.5 rounded-full transition-colors"
				>
					<Home size={18} />
					<span>Volver al Inicio</span>
				</Link>

				<button
					type="button"
					onClick={() => navigate(-1)}
					className="inline-flex items-center gap-2 border border-brand-primary hover:bg-brand-primary-hover text-brand-white font-medium px-8 py-3.5 rounded-full transition-colors cursor-pointer"
				>
					<ArrowBigDown size={18} />
					<span>Página anterior</span>
				</button>
			</div>
		</section>
	);
}
