import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import ClientLayout from "./components/ClientLayout";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { GuestRoute } from "./components/auth/GuestRoute";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { CatalogPage } from "./pages/CatalogPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminCountriesPage } from "./pages/admin/AdminCountriesPage";
import { AdminBrandsPage } from "./pages/admin/AdminBrandsPage";
import { AdminDepartmentsPage } from "./pages/admin/AdminDepartmentsPage";
import { AdminCitiesPage } from "./pages/admin/AdminCitiesPage";
import { AdminAddressesPage } from "./pages/admin/AdminAddressesPage";
import { AdminClientsPage } from "./pages/admin/AdminClientsPage";
import { AdminClientAddressesPage } from "./pages/admin/AdminClientAddressesPage";

function PlaceholderPage({ title }: { title: string }) {
	return (
		<div className="max-w-300 mx-auto px-5 py-24 text-center">
			<h1 className="text-4xl font-bold text-brand-white mb-4">{title}</h1>
			<p className="text-brand-muted">Vista en construccion - Overclock HN</p>
		</div>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<ClientLayout />}>
					{/* Public routes */}
					<Route path="/" element={<HomePage />} />
					<Route path="/catalogo" element={<CatalogPage />} />
					<Route path="/carrito" element={<PlaceholderPage title="Carritos de Compras" />} />
					<Route path="/verificar-cuenta" element={<VerifyEmailPage />} />
					{/* Visitors not logged in only */}
					<Route element={<GuestRoute />}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/registro" element={<RegisterPage />} />
					</Route>
					{/* Protected routes (require a session) */}
					<Route element={<ProtectedRoute />}>
						<Route path="/mi-cuenta" element={<PlaceholderPage title="Mi Cuenta e Historial" />} />
					</Route>
					{/* Administrator-only routes */}
					<Route element={<ProtectedRoute requireAdmin />}>
						<Route path="/admin" element={<PlaceholderPage title="Panel Administrativo" />} />
						<Route path="/admin/categorias" element={<AdminCategoriesPage />} />
						<Route path="/admin/paises" element={<AdminCountriesPage />} />
						<Route path="/admin/marcas" element={<AdminBrandsPage />} />
						<Route path="/admin/departamentos" element={<AdminDepartmentsPage />} />
						<Route path="/admin/ciudades" element={<AdminCitiesPage />} />
						<Route path="/admin/direcciones" element={<AdminAddressesPage />} />
						<Route path="/admin/clientes" element={<AdminClientsPage />} />
						<Route path="/admin/direcciones-clientes" element={<AdminClientAddressesPage />} />
					</Route>
					{/* 404 Error */}
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
