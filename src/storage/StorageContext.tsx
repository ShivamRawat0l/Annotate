import React, { useContext, type ReactElement } from "react"
import { logger } from "../utils/logger"
import { useStorageHook } from "./useStorageHook"
import type { FolderDetails, FolderStructure, Preferences, Profile } from "./storage.types"

type StorageContextType = {
	createLocalStorage: () => void,
	save: () => void,
	restore: () => void,
	annotateDetails: FolderDetails,
	annotateStructure: FolderStructure,
	profile: Profile,
	preferences: Preferences
} | undefined

const StorageContext = React.createContext<StorageContextType>(undefined)

export const StorageProvider = ({ children }: { children: ReactElement }) => {

	const { createLocalStorage, save, restore, annotateDetails, annotateStructure, preferences, profile } = useStorageHook()

	return <StorageContext.Provider value={{
		createLocalStorage,
		save,
		restore,
		annotateStructure,
		annotateDetails,
		preferences,
		profile
	}}>
		{children}
	</StorageContext.Provider>
}

export const useStorage = () => {
	const context = useContext(StorageContext)
	if (context === undefined) {
		throw new Error("Storage Context Not Found")
	}
	return context
}
