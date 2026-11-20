import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import ClientLayout from "./components/ClientLayout";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

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
					<Route path="/" element={<HomePage />} />
					<Route path="/catalogo" element={<PlaceholderPage title="Catalogo de Hardware" />} />
					<Route path="/carrito" element={<PlaceholderPage title="Carritos de Compras" />} />
					<Route path="/login" element={<PlaceholderPage title="Iniciar Sesion" />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
