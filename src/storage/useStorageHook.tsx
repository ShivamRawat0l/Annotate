import { useEffect, useState } from "react";
import { useAuth } from "../authentication/AuthenticationProvider";
import { CONFIG_STORAGE_KEY, DATA_STORAGE_KEY, GUEST_USER_ID } from "../constants/constants";
import { LocalStorage } from "./webStorage/LocalStorage";
import { type Preferences, type AnnotateData, type Configuration, type Profile } from "./storage.types";

export const useStorageHook = () => {
	const { user } = useAuth()
	const [config, setConfig] = useState<Configuration>()
	const [preferences, setPreferences] = useState<Preferences>()
	const [profile, setProfile] = useState<Profile>()
	const [annotateData, setAnnotateData] = useState<AnnotateData>()

	useEffect(() => {
		let config = LocalStorage.getConfig()
		if (config.isUsingGoogleStorage) {
			fetchAppwriteFolders(user.id);
		}
		if (config.isUsingLocalStorage) {
		}
		window.addEventListener('beforeunload', save)
		return (() => {
			window.removeEventListener('beforeunload', save)
		})
	}, [])

	useEffect(() => {
		if (!user) return;
		const dataStorageKey = localStorage.getItem(DATA_STORAGE_KEY);
		if (dataStorageKey) {
			const data = JSON.parse(dataStorageKey);
		}, [user]);

	const createLocalStorage = () => {
		window.showDirectoryPicker();
	}

	const readLocalStorageFile = () => {

	}

	const save = () => { }

	const restore = () => { }
	return { createLocalStorage, save, restore }
}
