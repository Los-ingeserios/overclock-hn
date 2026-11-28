import {
	Banknote,
	Briefcase,
	Building,
	Building2,
	Cpu,
	CreditCard,
	FileSpreadsheet,
	FileText,
	FolderTree,
	Globe,
	LayoutDashboard,
	Map,
	MapPin,
	MapPinHouse,
	Package,
	Percent,
	ShieldCheck,
	ShoppingBag,
	ShoppingCart,
	Sparkles,
	Store,
	Tag,
	Tags,
	Truck,
	UserCheck,
	UserCog,
	Users,
	Wallet,
	type LucideIcon,
} from "lucide-react";

export type AdminModuleStatus = "ready" | "pending";

export interface AdminNavItem {
	/** Ruta relativa dentro de /admin (ej. "productos" -> "/admin/productos") */
	path: string;
	label: string;
	icon: LucideIcon;
	table: string;
	endpoint: string;
	status: AdminModuleStatus;
	description?: string;
}

export interface AdminNavGroup {
	id: string;
	title: string;
	items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
	{
		id: "resumen",
		title: "Resumen",
		items: [
			{
				path: "dashboard",
				label: "Dashboard",
				icon: LayoutDashboard,
				table: "v_clientes_top / vistas SQL",
				endpoint: "/api/v1/dashboard/",
				status: "pending",
				description: "Indicadores gerenciales, rotación por marca y vista v_clientes_top.",
			},
		],
	},
	{
		id: "inventario",
		title: "Inventario y Catálogo",
		items: [
			{
				path: "productos",
				label: "Productos",
				icon: Package,
				table: "productos",
				endpoint: "/api/v1/productos-admin/",
				status: "ready",
			},
			{
				path: "especificaciones",
				label: "Especificaciones",
				icon: Cpu,
				table: "especificaciones",
				endpoint: "/api/v1/especificaciones/",
				status: "ready",
				description: "Ficha técnica y atributos detallados por producto.",
			},
			{
				path: "categorias",
				label: "Categorías",
				icon: FolderTree,
				table: "categorias",
				endpoint: "/api/v1/categorias/",
				status: "ready",
			},
			{
				path: "marcas",
				label: "Marcas",
				icon: Tag,
				table: "marcas",
				endpoint: "/api/v1/marcas/",
				status: "ready",
			},
			{
				path: "garantias",
				label: "Garantías",
				icon: ShieldCheck,
				table: "garantias",
				endpoint: "/api/v1/garantias/",
				status: "pending",
				description: "Control de garantías vigentes por cliente y producto.",
			},
		],
	},
	{
		id: "promociones",
		title: "Promociones",
		items: [
			{
				path: "tipos-promocion",
				label: "Tipos de Promoción",
				icon: Tags,
				table: "tipo_promocion",
				endpoint: "/api/v1/tipo-promociones/",
				status: "ready",
				description: "Catálogo de tipos de descuentos, combos y 2x1.",
			},
			{
				path: "promociones",
				label: "Promociones",
				icon: Percent,
				table: "promociones",
				endpoint: "/api/v1/promociones/",
				status: "ready",
				description: "Reglas, porcentajes y fechas de vigencia de promociones.",
			},
			{
				path: "promociones-productos",
				label: "Productos en Promo",
				icon: Sparkles,
				table: "promociones_productos",
				endpoint: "/api/v1/promociones-productos/",
				status: "ready",
				description: "Asignación de productos con rol Requerido, Beneficio o Ambos.",
			},
		],
	},
	{
		id: "ventas",
		title: "Ventas y Facturación SAR",
		items: [
			{
				path: "pedidos",
				label: "Pedidos",
				icon: ShoppingBag,
				table: "pedidos + detalles_pedidos",
				endpoint: "/api/v1/pedidos/",
				status: "pending",
				description: "Órdenes de compra, detalle de ítems y estados de preparación.",
			},
			{
				path: "facturas",
				label: "Facturas SAR",
				icon: FileText,
				table: "facturas + detalles_factura",
				endpoint: "/api/v1/facturas/",
				status: "pending",
				description: "Emisión legal SAR, CAI, ISV 15% y desglose de factura.",
			},
			{
				path: "comprobantes-fiscales",
				label: "Comprobantes SAR",
				icon: FileSpreadsheet,
				table: "comprobantes_fiscales",
				endpoint: "/api/v1/comprobantes-fiscales/",
				status: "pending",
				description: "Rangos correlativos autorizados y fecha límite de emisión.",
			},
			{
				path: "pagos",
				label: "Pagos",
				icon: Banknote,
				table: "pagos + detalles_pagos_tarjetas",
				endpoint: "/api/v1/pagos/",
				status: "pending",
				description: "Registro de pagos aplicados a facturas y códigos de autorización.",
			},
			{
				path: "metodos-pago",
				label: "Métodos de Pago",
				icon: Wallet,
				table: "metodos_pago",
				endpoint: "/api/v1/metodos-pago/",
				status: "pending",
				description: "Catálogo de formas y condiciones de pago (Contado / Crédito).",
			},
			{
				path: "tarjetas",
				label: "Tarjetas",
				icon: CreditCard,
				table: "tarjetas",
				endpoint: "/api/v1/tarjetas/",
				status: "pending",
				description: "Tarjetas de crédito y débito registradas por los clientes.",
			},
		],
	},
	{
		id: "operaciones",
		title: "Compras y Logística",
		items: [
			{
				path: "proveedores",
				label: "Proveedores",
				icon: Building,
				table: "proveedores",
				endpoint: "/api/v1/proveedores/",
				status: "pending",
				description: "Directorio de proveedores de hardware con RTN y dirección.",
			},
			{
				path: "compras",
				label: "Compras",
				icon: ShoppingCart,
				table: "compras + detalles_compras",
				endpoint: "/api/v1/compras/",
				status: "pending",
				description: "Órdenes de abastecimiento a proveedores e ingreso de inventario.",
			},
			{
				path: "envios",
				label: "Envíos",
				icon: Truck,
				table: "envios",
				endpoint: "/api/v1/envios/",
				status: "pending",
				description: "Seguimiento de guías, repartidores asignados y estado de entrega.",
			},
			{
				path: "empresas-repartidoras",
				label: "Emp. Repartidoras",
				icon: Store,
				table: "empresas_repartidoras",
				endpoint: "/api/v1/empresas-repartidoras/",
				status: "pending",
				description: "Empresas externas de paquetería y logística contratadas.",
			},
			{
				path: "repartidores",
				label: "Repartidores",
				icon: UserCheck,
				table: "repartidores",
				endpoint: "/api/v1/repartidores/",
				status: "pending",
				description: "Personal repartidor asociado a empresas externas.",
			},
		],
	},
	{
		id: "personas",
		title: "Clientes y Empresa",
		items: [
			{
				path: "clientes",
				label: "Clientes",
				icon: Users,
				table: "clientes",
				endpoint: "/api/v1/clientes/",
				status: "ready",
			},
			{
				path: "direcciones-clientes",
				label: "Dir. de Clientes",
				icon: MapPinHouse,
				table: "direcciones_clientes",
				endpoint: "/api/v1/direcciones-clientes/",
				status: "ready",
			},
			{
				path: "usuarios",
				label: "Usuarios",
				icon: UserCog,
				table: "usuarios + usuarios_clientes",
				endpoint: "/api/v1/usuarios/",
				status: "pending",
				description: "Cuentas de acceso, permisos de administrador y vínculo con clientes.",
			},
			{
				path: "vendedores",
				label: "Vendedores",
				icon: Briefcase,
				table: "vendedores",
				endpoint: "/api/v1/vendedores/",
				status: "pending",
				description: "Equipo de ventas interno asociado a la facturación.",
			},
			{
				path: "sucursales",
				label: "Sucursales",
				icon: Store,
				table: "sucursales",
				endpoint: "/api/v1/sucursales/",
				status: "pending",
				description: "Tiendas físicas, horarios y datos fiscales de sucursal.",
			},
		],
	},
	{
		id: "ubicaciones",
		title: "Ubicaciones",
		items: [
			{
				path: "paises",
				label: "Países",
				icon: Globe,
				table: "paises",
				endpoint: "/api/v1/paises/",
				status: "ready",
			},
			{
				path: "departamentos",
				label: "Departamentos",
				icon: Map,
				table: "departamentos",
				endpoint: "/api/v1/departamentos/",
				status: "ready",
			},
			{
				path: "ciudades",
				label: "Ciudades",
				icon: Building2,
				table: "ciudades",
				endpoint: "/api/v1/ciudades/",
				status: "ready",
			},
			{
				path: "direcciones",
				label: "Direcciones",
				icon: MapPin,
				table: "direcciones",
				endpoint: "/api/v1/direcciones/",
				status: "ready",
			},
		],
	},
];

export const ALL_ADMIN_NAV_ITEMS = ADMIN_NAV_GROUPS.flatMap((group) => group.items);
