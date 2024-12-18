import React, { useContext, type ReactElement } from "react"
import { logger } from "../utils/logger"
import { useStorageHook } from "./useStorageHook"

type StorageContextType = {
	createLocalStorage: () => void,
	save: () => void,
	restore: () => void,
} | undefined

const StorageContext = React.createContext<StorageContextType>(undefined)

export const StorageProvider = ({ children }: { children: ReactElement }) => {

	const { createLocalStorage, save, restore } = useStorageHook()

	return <StorageContext.Provider value={{
		createLocalStorage,
		save,
		restore
	}}>
		{children}
	</StorageContext.Provider>
}

export const useStorage = () => {
	const storage = useContext(StorageContext)
	if (storage === undefined || storage === null) {
		logger.error("Storage Context Not Found")
	}
	return storage
}
