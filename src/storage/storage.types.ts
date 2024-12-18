
type CommonType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	title: string;
};

export enum ElementType {
	NOTE = "NOTE",
	FOLDER = "FOLDER",
}


export type NoteType = CommonType & {
	type: ElementType.NOTE;
	drawAtoms: any[]
};

export type FolderType = CommonType & {
	type: ElementType.FOLDER;
	isExpanded: boolean;
	count: number;
};

export type FolderStructure = {
	[key: string]: FolderStructure;
};

export type FolderPath = string[];

export type FolderDetails = {
	[key: string]: FolderType | NoteType;

};


export type Preferences = {
	sideBarDefaultWidth: number,
	sideBarOpenByDefault: boolean,
	automaticSaveInterval: number | null,
	rememberLastSidebarPosition: boolean,
	toolsPreferences: {
		text: {
			defaultTextSize: number,
			defaultHeading1Size: number,
			defaultHeading2Size: number,
			defaultHeading3Size: number,
			defaultTheme: string,
		}
	}
}

export type Profile = {
	id: string;
	email: string;
	name: string;
	photoUrl: string | null;
}

export type AnnotateData = {
	folderStructure: FolderStructure,
	folderDetails: FolderDetails
}

