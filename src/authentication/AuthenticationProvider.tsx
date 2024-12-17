// NOTE: This is the root of all the providers so every provider can access the useAuth hook

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserType } from "../types/notes.type";
import { useAuthHook } from "./useAuthHook";

type AuthenticationContextType = {
	user: UserType | null;
	googleLogin: () => void;
	logout: () => void;
	isLoading: boolean;
};

const AuthenticationContext = createContext<
	AuthenticationContextType | undefined
>(undefined);

const AuthenticationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { user, googleLogin, logout, isLoading } = useAuthHook();

	const contextValue = useMemo(
		() => ({
			user,
			googleLogin,
			logout,
			isLoading,
		}),
		[user, isLoading]
	);

	return (
		<AuthenticationContext.Provider value={contextValue}>
			{children}
		</AuthenticationContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthenticationContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within a AuthenticationProvider");
	}
	return context;
};

export { AuthenticationProvider, useAuth };
