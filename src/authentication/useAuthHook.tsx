import { useEffect, useState } from "react";
import { createUser, getUserDB } from "../appwrite/database";
import { getLoggedUser, getUserData, loginWithGoogle, logoutUser } from "../appwrite/authentication";
import { logger } from "../utils/logger";
import type { UserType } from "./authentication.types";

export const useAuthHook = () => {
	const [user, setUser] = useState<UserType | null>();

	useEffect(() => { checkLogin() }, []);

	const checkLogin = async () => {
		try {
			const user = await getLoggedUser();
			let userData = await getUserData(user);
			try {
				await createUser(user.$id, userData);
			} catch {
				logger.info("User already created")
			}
			const annotatedUser = await getUserDB(user.$id);
			setUser(annotatedUser);
		} catch (error) {
			logger.error("Error occured when fetching user and userDB")
			logout();
		}
	};

	const login = async () => {
		await loginWithGoogle();
		await checkLogin();
	};

	const logout = async () => {
		try {
			await logoutUser();
			setUser(null);
		} catch {
			logger.info("User logged out")
		}
	};

	return { login, user, logout }
}
