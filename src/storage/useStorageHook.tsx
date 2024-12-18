import { useEffect, useState } from "react";
import { useAuth } from "../authentication/AuthenticationProvider";
import { LocalStorage } from "./webStorage/localStorage";
import { type Preferences, type Profile, type FolderStructure, type FolderDetails } from "./storage.types";
import { getDBData } from "../appwrite/database";
import { logger } from "../utils/logger";
import { toast } from "sonner";
import { DEFAULT_PREFERENCE_STORAGE, DEFAULT_PROFILE_STORAGE } from "./defaultStorage";
import { fileSystem } from "./webStorage/fileSystem";

export const useStorageHook = () => {
	const { user } = useAuth()
	const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCE_STORAGE)
	const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE_STORAGE)
	const [annotateDetails, setAnnotateDetails] = useState<FolderDetails>({})
	const [annotateStructure, setAnnotateStructure] = useState<FolderStructure>({})
	const [$isGoogle, setIsGoogle] = useState(false)
	const [$isLocalStorage, setIsLocalStorage] = useState(false)

	const fetchAppwriteFolders = async (userId: string) => {
		try {
			const data = await getDBData(userId);
			setIsGoogle(true)
			setAnnotateDetails(data.folderDetails);
			setAnnotateStructure(data.folderStructure);
		} catch {
			logger.error("Annotate data not found")
		}
	};

	const onMount = async () => {
		if (user === undefined) return;
		if (user !== null) {
			await fetchAppwriteFolders(user.id)
		} else {
			logger.info("User not logged in")
		}
		try {
			LocalStorage.getFileHandlers()
			setIsLocalStorage(true)
		} catch {
			logger.info("Local Handlers not found")
		}
		window.addEventListener('beforeunload', save)
	}

	useEffect(() => {
		onMount()
		return (() => {
			window.removeEventListener('beforeunload', save)
		})
	}, [user])

	const createLocalStorage = () => {
		fileSystem.pickFolderToSaveData()
	}

	const save = () => {
		if ($isGoogle && $isLocalStorage) {
			toast("Prioritizing Google Storage then Local Storage")
		}

	}

	const restore = () => { }

	return { createLocalStorage, save, restore, annotateDetails, annotateStructure, profile, preferences }
}
