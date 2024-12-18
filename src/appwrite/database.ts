import { Permission, Role } from "appwrite";
import { databases } from "./client";
import type { UserType } from "../authentication/authentication.types";

const databaseId = process.env.APPWRITE_DATABASE_ID as string;
const notesCollectionId = process.env.APPWRITE_NOTES_COLLECTION_ID as string;
const userCollectionId = process.env.APPWRITE_USER_COLLECTION_ID as string;

export const updateNote = async (
	userId: string,
	structure: string,
	details: string
) => {
	await databases.updateDocument(databaseId, notesCollectionId, userId, {
		structure,
		details,
	});
};

export const getUserDB: (userId: string) => Promise<UserType> = async (
	userId: string
) => {
	const user = await databases.getDocument(
		databaseId,
		userCollectionId,
		userId
	);
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		photoUrl: user.photoUrl,
	};
};

export const getDBData = async (userId: string) => {
	const notes = await databases.getDocument(
		databaseId,
		notesCollectionId,
		userId
	);
	try {
		return {
			structure: JSON.parse(notes.structure),
			details: JSON.parse(notes.details),
		};
	} catch (error) {
		return {
			structure: {},
			details: {},
		};
	}
};

const createUserDocument = async (userId: string, user: UserType) => {
	return databases.createDocument(
		databaseId,
		userCollectionId,
		userId,
		{
			...user,
		},
		[Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
	);
};

const createNotesDocument = async (userId: string) => {
	return databases.createDocument(
		databaseId,
		notesCollectionId,
		userId,
		{
			structure: JSON.stringify({}),
			details: JSON.stringify({}),
		},
		[Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
	);
};

export const createUser = async (userId: string, user: UserType) => {
	const createUserDb = createUserDocument(userId, user);
	const createNotesDb = createNotesDocument(userId);
	await Promise.all([createUserDb, createNotesDb]);
};
