import { logger } from "@/src/utils/logger"
import { LocalStorage } from "./localStorage"

class FileSystem {
	private annotateHandle: FileSystemFileHandle | undefined
	private configHandle: FileSystemFileHandle | undefined
	private profileHandle: FileSystemFileHandle | undefined
	private preferencesHandle: FileSystemFileHandle | undefined

	constructor() {
		this.annotateHandle = undefined
	}

	public async pickFolderToSaveData() {
		const dir = await window.showDirectoryPicker()
		// TOOD: Handle this error to show popup
		for await (const entry of dir.values()) {
			throw new Error("Directory not empty")
		}
		const annotateStructureHandle = await dir.getFileHandle("annotateStructure.json", { create: true })
		const annotateDetailsHandle = await dir.getFileHandle("annotateDetails.json", { create: true })
		const profileHandle = await dir.getFileHandle("profile.json", { create: true })
		const preferencesHandle = await dir.getFileHandle("preferences.json", { create: true })
		LocalStorage.saveFileHandlers(annotateStructureHandle, annotateDetailsHandle, preferencesHandle, profileHandle)
	}

	public async saveAnnotateData() {
		if (!this.annotateHandle) throw new Error("Annotate handle is undefined")
		const writable = await this.annotateHandle.createWritable()
		await writable.write("something")
		await writable.close()
	}

	public async saveProfileData() {
		if (!this.profileHandle) throw new Error("Profile handle is undefined")
		const writable = await this.profileHandle.createWritable()
		await writable.write("something")
		await writable.close()
	}
	public async savePreferencesData() {
		if (!this.preferencesHandle) throw new Error("Preferences handle is undefined")
		const writable = await this.preferencesHandle.createWritable()
		await writable.write("something")
		await writable.close()
	}
	public async saveConfigData() {
		if (!this.configHandle) throw new Error("Config handle is undefined")
		const writable = await this.configHandle.createWritable()
		await writable.write("something")
		await writable.close()
	}

	public getData() {
		const { annotateHandle, configHandle, profileHandle, preferencesHandle } = LocalStorage.getFileHandlers()
		this.annotateHandle = annotateHandle
		this.profileHandle = profileHandle
		this.configHandle = configHandle
		this.preferencesHandle = preferencesHandle
		return {}
	}

	public async pickFolderToRestoreData() {
		try {
			const dir = await window.showDirectoryPicker()
			const annotateHandle = await dir.getFileHandle("annotate.json", { create: false })
			const configHandle = await dir.getFileHandle("config.json", { create: false })
			const profileHandle = await dir.getFileHandle("profile.json", { create: false })
			const preferencesHandle = await dir.getFileHandle("preferences.json", { create: false })
			var size = Buffer.byteLength(JSON.stringify(annotateHandle))
			logger.info(`Size: ${size}`)
			LocalStorage.saveFileHandlers(annotateHandle, configHandle, preferencesHandle, profileHandle)
		} catch {
			logger.error("File missing")
		}
	}
}

export const fileSystem = new FileSystem()
