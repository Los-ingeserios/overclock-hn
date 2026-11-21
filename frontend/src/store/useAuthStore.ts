import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthTokens, AuthUser } from "../types/auth";

interface AuthState {
	user: AuthUser | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	setSession: (user: AuthUser, tokens: AuthTokens) => void;
	setAccessToken: (accessToken: string) => void;
	updateUser: (user: AuthUser) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,

			setSession: (user, tokens) =>
				set({
					user,
					accessToken: tokens.access,
					refreshToken: tokens.refresh,
					isAuthenticated: true,
				}),

			setAccessToken: (accessToken) =>
				set({
					accessToken,
				}),

			updateUser: (user) =>
				set({
					user,
				}),

			logout: () =>
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: "overclock-hn-auth",
			storage: createJSONStorage(() => localStorage),
			partialize: (state: AuthState) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
