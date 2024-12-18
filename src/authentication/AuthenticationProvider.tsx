// NOTE: This is the root of all the providers so every provider can access the useAuth hook

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuthHook } from "./useAuthHook";
import type { UserType } from "./authentication.types";

type AuthenticationContextType = {
	user: UserType | null | undefined;
	login: () => void;
	logout: () => void;
};

const AuthenticationContext = createContext<
	AuthenticationContextType | undefined
>(undefined);

const AuthenticationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { user, login, logout } = useAuthHook()

	return (
		<AuthenticationContext.Provider value={{
			user,
			login,
			logout,
		}}>
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
