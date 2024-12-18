import { CONFIG_HANDLE_KEY, DATA_HANDLE_KEY, DATA_STORAGE_KEY, PREFERENCES_HANDLE_KEY, PROFILE_HANDLE_KEY } from "@/src/constants/constants"
import type { AnnotateData } from "../storage.types"
import { logger } from "@/src/utils/logger"

type FileHandlers = {
	annotateHandle: FileSystemFileHandle
	configHandle: FileSystemFileHandle
	profileHandle: FileSystemFileHandle
	preferencesHandle: FileSystemFileHandle
}

export abstract class LocalStorage {

	public static saveAnnotateData(data: AnnotateData) {
		localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data))
	}

	public static getAnnotateData(): AnnotateData {
		const data = localStorage.getItem(DATA_STORAGE_KEY)
		if (data) {
			return JSON.parse(data)
		} else {
			logger.info("Annotate Data not present")
			return {
				folderStructure: {},
				folderData: {}
			}
		}
	}

	public static saveFileHandlers(annotate: FileSystemFileHandle, config: FileSystemFileHandle, preferences: FileSystemFileHandle, profile: FileSystemFileHandle) {
		localStorage.setItem(DATA_HANDLE_KEY, JSON.stringify(annotate))
		localStorage.setItem(CONFIG_HANDLE_KEY, JSON.stringify(config))
		localStorage.setItem(PROFILE_HANDLE_KEY, JSON.stringify(profile))
		localStorage.setItem(PREFERENCES_HANDLE_KEY, JSON.stringify(preferences))
	}

	public static getFileHandlers(): FileHandlers {
		const annotateData = localStorage.getItem(DATA_HANDLE_KEY)
		const configData = localStorage.getItem(CONFIG_HANDLE_KEY)
		const profileData = localStorage.getItem(PROFILE_HANDLE_KEY)
		const preferencesData = localStorage.getItem(PREFERENCES_HANDLE_KEY)
		if (!annotateData || !configData || !profileData || !preferencesData) throw new Error("Handles not found")
		const annotateHandle = JSON.parse(annotateData)
		const preferencesHandle = JSON.parse(preferencesData)
		const profileHandle = JSON.parse(profileData)
		const configHandle = JSON.parse(configData)
		return {
			annotateHandle,
			configHandle,
			profileHandle,
			preferencesHandle
		}
	}
}
