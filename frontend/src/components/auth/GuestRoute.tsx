import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export function GuestRoute() {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to={user?.administrador ? "/admin" : "/"} replace />;
	}

	return <Outlet />;
}
