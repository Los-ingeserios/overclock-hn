import { NavLink, Outlet } from "react-router-dom";
import {
	Building2,
	FolderTree,
	Globe,
	Map,
	MapPin,
	MapPinHouse,
	Package,
	Shield,
	Tag,
	Users,
	type LucideIcon,
} from "lucide-react";

interface AdminNavItem {
	to: string;
	label: string;
	icon: LucideIcon;
}

const ADMIN_NAV_GROUPS: { title: string; items: AdminNavItem[] }[] = [
	{
		title: "Inventario",
		items: [
			{ to: "/admin/productos", label: "Productos", icon: Package },
			{ to: "/admin/categorias", label: "Categorías", icon: FolderTree },
			{ to: "/admin/marcas", label: "Marcas", icon: Tag },
		],
	},
	{
		title: "Ubicaciones",
		items: [
			{ to: "/admin/paises", label: "Países", icon: Globe },
			{ to: "/admin/departamentos", label: "Departamentos", icon: Map },
			{ to: "/admin/ciudades", label: "Ciudades", icon: Building2 },
			{ to: "/admin/direcciones", label: "Direcciones", icon: MapPin },
		],
	},
	{
		title: "Clientes",
		items: [
			{ to: "/admin/clientes", label: "Clientes", icon: Users },
			{ to: "/admin/direcciones-clientes", label: "Dir. Clientes", icon: MapPinHouse },
		],
	},
];

export function AdminLayout() {
	return (
		<div className="flex flex-col flex-1">
			{/* Sub-Navbar del Panel Administrativo */}
			<div className="bg-brand-surface/50 border-b border-brand-divider backdrop-blur-sm">
				<div className="max-w-fit mx-auto px-5 py-3 flex items-center gap-5 overflow-x-auto">
					<div className="hidden xl:flex items-center gap-2 pr-4 border-r border-brand-divider text-brand-primary shrink-0">
						<Shield size={18} />
						<span className="text-xs font-bold uppercase tracking-wider">Admin</span>
					</div>

					<nav aria-label="Navegación del panel administrativo" className="flex items-center gap-3">
						{ADMIN_NAV_GROUPS.map((group, groupIdx) => (
							<div
								key={group.title}
								className={`flex items-center gap-1.5 shrink-0 ${
									groupIdx > 0 ? "pl-3 border-l border-brand-divider" : ""
								}`}
							>
								{group.items.map(({ to, label, icon: Icon }) => (
									<NavLink
										key={to}
										to={to}
										className={({ isActive }) =>
											`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
												isActive
													? "bg-brand-primary text-brand-white shadow-md"
													: "text-brand-muted hover:text-brand-white hover:bg-brand-bg/60"
											}`
										}
									>
										<Icon size={15} />
										<span>{label}</span>
									</NavLink>
								))}
							</div>
						))}
					</nav>
				</div>
			</div>

			{/* Contenido de la pagina admin activa */}
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
