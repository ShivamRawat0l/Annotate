import { useEffect, useState } from "react";
import type { UserType } from "../types/notes.type";
import { DATA_STORAGE_KEY, GUEST_USER_ID } from "../constants/Constants";
import { createUser, getDBData, getUserDB } from "../appwrite/database";
import { getUser, getUserData, loginWithGoogle, logoutUser } from "../appwrite/authentication";

export const useAuthHook = () => {
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		checkLogin().then(() => {
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!user) return;
		const dataStorageKey = localStorage.getItem(DATA_STORAGE_KEY);
		if (dataStorageKey) {
			const data = JSON.parse(dataStorageKey);
			if (
				data.userEmail !== user.email &&
				data.userEmail !== GUEST_USER_ID
			) {
				logout();
			} else if (
				Object.keys(data.folderDetails).length === 0 ||
				Object.keys(data.folderStructure).length === 0
			) {
				fetchAppwriteFolders(user.id);
			}
		} else {
			fetchAppwriteFolders(user.id);
		}
	}, [user]);


	const checkLogin = async () => {
		try {
			const user = await getUser();
			let userData = await getUserData(user);
			try {
				await createUser(user.$id, userData);
			} catch {
				console.log("User already exists");
			}
			const annotatedUser = await getUserDB(user.$id);
			setUser(annotatedUser);
		} catch (error) {
			logout();
		}
	};

	const googleLogin = async () => {
		await loginWithGoogle();
		await checkLogin();
	};

	const logout = async () => {
		await logoutUser();
		resetData();
		setUser(null);
	};

	return { googleLogin, user, logout, isLoading }
}
