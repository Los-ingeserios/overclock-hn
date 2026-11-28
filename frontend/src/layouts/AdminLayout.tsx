import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, Search, Shield, X } from "lucide-react";
import { ADMIN_NAV_GROUPS, ALL_ADMIN_NAV_ITEMS } from "../config/adminNav";

export function AdminLayout() {
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [toggledGroups, setToggledGroups] = useState<Record<string, boolean>>({});

	const activeItem = useMemo(
		() => ALL_ADMIN_NAV_ITEMS.find((item) => location.pathname.startsWith(`/admin/${item.path}`)),
		[location.pathname],
	);

	const activeGroupId = useMemo(
		() =>
			ADMIN_NAV_GROUPS.find((group) =>
				group.items.some((item) => location.pathname.startsWith(`/admin/${item.path}`)),
			)?.id ?? "inventario",
		[location.pathname],
	);

	const filteredGroups = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return ADMIN_NAV_GROUPS;

		return ADMIN_NAV_GROUPS.map((group) => ({
			...group,
			items: group.items.filter(
				(item) =>
					item.label.toLowerCase().includes(q) ||
					item.table.toLowerCase().includes(q) ||
					group.title.toLowerCase().includes(q),
			),
		})).filter((group) => group.items.length > 0);
	}, [search]);

	const isGroupOpen = (groupId: string) => {
		if (search.trim().length > 0) return true;
		return toggledGroups[groupId] ?? groupId === activeGroupId;
	};

	const toggleGroup = (groupId: string) => {
		setToggledGroups((prev) => ({
			...prev,
			[groupId]: !(prev[groupId] ?? groupId === activeGroupId),
		}));
	};

	const renderNavGroups = (isCompact: boolean, onNavigate?: () => void) => (
		<nav aria-label="Navegación del panel administrativo" className="space-y-2">
			{filteredGroups.length === 0
				? !isCompact && (
						<p className="px-3 py-6 text-center text-xs text-brand-muted">
							No se encontraron módulos para "{search}".
						</p>
					)
				: filteredGroups.map((group) => {
						const open = isCompact ? true : isGroupOpen(group.id);

						return (
							<div key={group.id} className="space-y-1">
								{!isCompact ? (
									<button
										type="button"
										onClick={() => toggleGroup(group.id)}
										className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-brand-muted hover:text-brand-white hover:bg-brand-bg/50 transition-colors cursor-pointer"
									>
										<span>{group.title}</span>
										{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
									</button>
								) : (
									<div className="my-2 border-t border-brand-divider first:hidden" />
								)}

								{open && (
									<ul className="space-y-0.5">
										{group.items.map(({ path, label, icon: Icon, status }) => (
											<li key={path}>
												<NavLink
													to={`/admin/${path}`}
													onClick={onNavigate}
													title={isCompact ? label : undefined}
													className={({ isActive }) =>
														`flex items-center ${
															isCompact ? "justify-center px-2" : "justify-between px-3"
														} py-2 rounded-xl text-sm transition-colors ${
															isActive
																? "bg-brand-primary text-brand-white font-semibold shadow-md"
																: "text-brand-muted hover:text-brand-white hover:bg-brand-bg/60"
														}`
													}
												>
													{({ isActive }) => (
														<>
															<span className="flex items-center gap-2.5 min-w-0">
																<Icon size={16} className="shrink-0" />
																{!isCompact && (
																	<span className="truncate">{label}</span>
																)}
															</span>
															{!isCompact && (
																<span
																	className={`w-1.5 h-1.5 rounded-full shrink-0 ${
																		status === "ready"
																			? isActive
																				? "bg-brand-white"
																				: "bg-emerald-400"
																			: isActive
																				? "bg-brand-white/50"
																				: "bg-brand-muted/40"
																	}`}
																	title={
																		status === "ready"
																			? "Módulo disponible"
																			: "Pendiente de conexión"
																	}
																/>
															)}
														</>
													)}
												</NavLink>
											</li>
										))}
									</ul>
								)}
							</div>
						);
					})}
		</nav>
	);

	return (
		<div className="flex flex-col lg:flex-row flex-1">
			{/* Barra móvil del panel admin (< lg) */}
			<div className="lg:hidden sticky top-16.25 z-30 bg-brand-surface/90 backdrop-blur-md border-b border-brand-divider px-4 py-3 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2.5 min-w-0">
					<Shield size={18} className="text-brand-primary shrink-0" />
					<span className="text-sm font-semibold text-brand-white truncate">
						Admin · {activeItem?.label ?? "Panel"}
					</span>
				</div>
				<button
					type="button"
					onClick={() => setMobileOpen(true)}
					className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-bg border border-brand-glass text-xs font-medium text-brand-white hover:border-brand-primary transition-colors cursor-pointer shrink-0"
				>
					<Menu size={15} />
					<span>Módulos</span>
				</button>
			</div>

			{/* Drawer móvil */}
			{mobileOpen && (
				<div className="lg:hidden fixed inset-0 z-50 flex">
					<button
						type="button"
						aria-label="Cerrar menú admin"
						onClick={() => setMobileOpen(false)}
						className="fixed inset-0 bg-black/60 backdrop-blur-xs"
					/>
					<aside className="relative z-10 w-72 max-w-[85vw] bg-brand-bg border-r border-brand-divider flex flex-col h-full shadow-2xl">
						<div className="p-4 border-b border-brand-divider flex items-center justify-between">
							<div className="flex items-center gap-2 text-brand-primary">
								<Shield size={18} />
								<span className="text-xs font-bold uppercase tracking-wider">Panel Admin</span>
							</div>
							<button
								type="button"
								onClick={() => setMobileOpen(false)}
								className="p-1.5 rounded-lg text-brand-muted hover:text-brand-white hover:bg-brand-surface/60 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						<div className="p-3 border-b border-brand-divider">
							<div className="relative">
								<Search
									size={15}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
								/>
								<input
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Buscar módulo o tabla..."
									className="w-full bg-brand-surface/50 border border-brand-glass rounded-xl pl-9 pr-3 py-2 text-xs text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary"
								/>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto p-3">
							{renderNavGroups(false, () => setMobileOpen(false))}
						</div>
					</aside>
				</div>
			)}

			{/* Sidebar Desktop (sticky debajo del Navbar) */}
			<aside
				className={`hidden lg:flex flex-col shrink-0 bg-brand-surface/35 border-r border-brand-divider sticky top-18.25 h-[calc(100vh-73px)] transition-all duration-200 ${
					collapsed ? "w-18" : "w-64"
				}`}
			>
				{/* Encabezado del Sidebar */}
				<div className="p-3.5 border-b border-brand-divider flex items-center justify-between gap-2">
					{!collapsed && (
						<div className="flex items-center gap-2 text-brand-primary pl-1 min-w-0">
							<Shield size={18} className="shrink-0" />
							<span className="text-xs font-bold uppercase tracking-wider truncate">Panel Admin</span>
						</div>
					)}
					<button
						type="button"
						onClick={() => setCollapsed((prev) => !prev)}
						title={collapsed ? "Expandir menú" : "Colapsar menú"}
						className={`p-2 rounded-lg text-brand-muted hover:text-brand-white hover:bg-brand-bg/60 transition-colors cursor-pointer ${
							collapsed ? "mx-auto" : ""
						}`}
					>
						{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
					</button>
				</div>

				{/* Buscador rápido */}
				{!collapsed && (
					<div className="p-3 border-b border-brand-divider">
						<div className="relative">
							<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Buscar módulo o tabla..."
								className="w-full bg-brand-bg border border-brand-glass rounded-xl pl-9 pr-7 py-2 text-xs text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
							/>
							{search && (
								<button
									type="button"
									onClick={() => setSearch("")}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-white cursor-pointer"
									aria-label="Limpiar búsqueda"
								>
									<X size={13} />
								</button>
							)}
						</div>
					</div>
				)}

				{/* Lista de grupos y enlaces */}
				<div className="flex-1 overflow-y-auto p-3">{renderNavGroups(collapsed)}</div>

				{/* Leyenda inferior */}
				{!collapsed && (
					<div className="px-4 py-3 border-t border-brand-divider flex items-center justify-between text-[11px] text-brand-muted">
						<span className="inline-flex items-center gap-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
							Listo
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-brand-muted/40" />
							Pendiente
						</span>
					</div>
				)}
			</aside>

			{/* Contenido de la página admin activa (min-w-0 evita desborde de tablas) */}
			<div className="flex-1 min-w-0">
				<Outlet />
			</div>
		</div>
	);
}
