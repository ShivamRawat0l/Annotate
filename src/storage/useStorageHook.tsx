import { useState } from "react";

export const useStorageHook = () => {
	const isAppwriteStorage = useState(true);
	const isLocalStorage = useState(false);

	const createLocalStorage = () => {
		window.showDirectoryPicker();
	}

	const readLocalStorageFile = () => {

	}

	const save = () => {

	}

	const restore = () => {
	}
	return { createLocalStorage, save, restore }
}
