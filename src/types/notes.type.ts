
export enum ElementType {
	NOTE = "NOTE",
	FOLDER = "FOLDER",
}

type CommonType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	title: string;
};

export type NoteType = CommonType & {
	type: ElementType.NOTE;
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

export type FolderData = {
	[key: string]: FolderType | NoteType;
};

export type UserType = {
	id: string;
	email: string;
	name: string;
	photoUrl: string;
};
