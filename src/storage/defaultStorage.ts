import { GUEST_USER_ID } from "../constants/constants";
import type { AnnotateData, Preferences, Profile } from "./storage.types";

export const DEFAULT_PREFERENCE_STORAGE: Preferences = {
	sideBarOpenByDefault: true,
	sideBarDefaultWidth: 400,
	rememberLastSidebarPosition: true,
	automaticSaveInterval: null,
	toolsPreferences: {
		text: {
			defaultTextSize: 20,
			defaultHeading1Size: 32,
			defaultHeading2Size: 28,
			defaultHeading3Size: 24,
			defaultTheme: "night Owl"
		}
	}


}

export const DEFAULT_PROFILE_STORAGE: Profile = {
	id: "-1",
	email: GUEST_USER_ID,
	name: "",
	photoUrl: null
}

export const DEFAULT_ANNOTATE_STORAGE: AnnotateData = {
	folderStructure: {},
	folderDetails: {}
}
