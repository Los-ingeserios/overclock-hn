import { Link } from "react-router-dom";
import { ArrowLeft, Database, Server, Wrench } from "lucide-react";
import type { AdminNavItem } from "../../config/adminNav";

interface AdminModulePlaceholderPageProps {
	module: AdminNavItem;
}

export function AdminModulePlaceholderPage({ module }: AdminModulePlaceholderPageProps) {
	const Icon = module.icon;

	return (
		<section className="max-w-300 mx-auto px-5 py-14">
			<div className="bg-brand-surface/40 border border-brand-divider rounded-2xl p-8 sm:p-10 text-center shadow-xl">
				<div className="w-16 h-16 mx-auto rounded-2xl bg-brand-primary/15 border border-brand-primary/35 flex items-center justify-center text-brand-primary mb-5">
					<Icon size={30} />
				</div>

				<span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-4">
					<Wrench size={13} />
					Módulo en construcción
				</span>

				<h1 className="text-3xl font-bold text-brand-white">{module.label}</h1>

				{module.description && (
					<p className="text-brand-muted text-sm max-w-lg mx-auto mt-2">{module.description}</p>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mt-7 text-left">
					<div className="bg-brand-bg/70 border border-brand-divider rounded-xl p-4">
						<div className="flex items-center gap-2 text-xs text-brand-muted mb-1">
							<Database size={14} className="text-brand-primary" />
							<span>Tabla PostgreSQL</span>
						</div>
						<code className="text-sm font-mono text-brand-white">{module.table}</code>
					</div>

					<div className="bg-brand-bg/70 border border-brand-divider rounded-xl p-4">
						<div className="flex items-center gap-2 text-xs text-brand-muted mb-1">
							<Server size={14} className="text-brand-primary" />
							<span>Endpoint esperado</span>
						</div>
						<code className="text-sm font-mono text-brand-white">{module.endpoint}</code>
					</div>
				</div>

				<div className="mt-8">
					<Link
						to="/admin/productos"
						className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-brand-primary text-sm font-medium text-brand-white hover:bg-brand-primary-hover transition-colors"
					>
						<ArrowLeft size={16} />
						<span>Volver a Productos</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
