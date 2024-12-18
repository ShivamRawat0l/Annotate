import { DETAILS_HANDLE_KEY, STRUCTURE_HANDLE_KEY, DATA_STORAGE_KEY, PREFERENCES_HANDLE_KEY, PROFILE_HANDLE_KEY } from "@/src/constants/constants"
import type { AnnotateData } from "../storage.types"
import { logger } from "@/src/utils/logger"

type FileHandlers = {
	annotateDetailsHandle: FileSystemFileHandle
	annotateStructureHandle: FileSystemFileHandle
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
				folderDetails: {}
			}
		}
	}

	public static saveFileHandlers(annotate: FileSystemFileHandle, config: FileSystemFileHandle, preferences: FileSystemFileHandle, profile: FileSystemFileHandle) {
		localStorage.setItem(DETAILS_HANDLE_KEY, JSON.stringify(annotate))
		localStorage.setItem(STRUCTURE_HANDLE_KEY, JSON.stringify(annotate))
		localStorage.setItem(PROFILE_HANDLE_KEY, JSON.stringify(profile))
		localStorage.setItem(PREFERENCES_HANDLE_KEY, JSON.stringify(preferences))
	}

	public static getFileHandlers(): FileHandlers {
		const annotateDetails = localStorage.getItem(DETAILS_HANDLE_KEY)
		const annotateStructure = localStorage.getItem(STRUCTURE_HANDLE_KEY)
		const profileData = localStorage.getItem(PROFILE_HANDLE_KEY)
		const preferencesData = localStorage.getItem(PREFERENCES_HANDLE_KEY)
		if (!annotateDetails || !annotateStructure || !profileData || !preferencesData) throw new Error("Handles not found")
		const annotateDetailsHandle = JSON.parse(annotateDetails)
		const annotateStructureHandle = JSON.parse(annotateStructure)
		const preferencesHandle = JSON.parse(preferencesData)
		const profileHandle = JSON.parse(profileData)
		return {
			annotateDetailsHandle, preferencesHandle, profileHandle, annotateStructureHandle
		}
	}
}
