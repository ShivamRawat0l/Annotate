import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { uuidv7 } from "uuidv7";
import { DATA_STORAGE_KEY, GUEST_USER_ID } from "@/src/constants/constants";
import { getChainedObject } from "@/src/utils/array";
import { ElementType, type FolderData, type FolderStructure, type FolderType, type NoteType } from "@/src/storage/storage.types";

type FolderContextType = {
	folderStructure: FolderStructure;
	setFolderStructure: React.Dispatch<React.SetStateAction<FolderStructure>>;
	createNewFolder: (folderPath: string[]) => void;
	createNewNote: (folderPath: string[]) => void;
	deleteFolder: (folderPath: string[]) => void;
	selectedFolderPath: string[];
	setSelectedFolderPath: React.Dispatch<React.SetStateAction<string[]>>;
	toggleFolderExpand: (folderId: string, status?: boolean) => void;
	renameFolder: (folderId: string, newTitle: string) => void;
	collapseSubFolders: (folderPath: string[]) => void;
	isLoading: boolean;
	folderDetails: FolderData;
	setFolderDetails: React.Dispatch<React.SetStateAction<FolderData>>;
	userEmail: string;
	setUserEmail: React.Dispatch<React.SetStateAction<string>>;
	moveFolder: (folderPath: string[], newParentPath: string[]) => void;
};

const FolderContext = createContext<FolderContextType | undefined>(undefined);

const FolderProvider = ({ children }: { children: React.ReactNode }) => {
	const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
	const [folderDetails, setFolderDetails] = useState<FolderData>({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedFolderPath, setSelectedFolderPath] = useState<string[]>([]);
	const [userEmail, setUserEmail] = useState<string>(GUEST_USER_ID);


	const collapseSubFolders = (folderPath: FolderPath) => {
		const subFolders = getChainedObject(folderStructure, folderPath);
		Object.keys(subFolders).forEach((subFolder) => {
			const item = folderDetails[subFolder];
			if (item.type === ElementType.FOLDER) {
				item.isExpanded = false;
			}
		});
		setFolderDetails({ ...folderDetails });
	};

	const toggleFolderExpand = (folderId: string, status?: boolean) => {
		const item = folderDetails[folderId];
		if (item.type === ElementType.FOLDER) {
			item.isExpanded = status ?? !item.isExpanded;
			setFolderDetails({ ...folderDetails });
		}
	};

	const createNewFolder = (folderPath: string[] = []) => {
		const newFolder: FolderType = {
			type: ElementType.FOLDER,
			title: "New Folder",
			id: uuidv7(),
			isExpanded: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			count: 0,
		};
		folderDetails[newFolder.id] = newFolder;
		const item = folderDetails[folderPath.last];
		if (item && item.type === ElementType.FOLDER) {
			item.isExpanded = true;
			item.count += 1;
		}
		const folder = getChainedObject(folderStructure, folderPath);
		folder[newFolder.id] = {};
		setFolderStructure({ ...folderStructure });
		setFolderDetails({ ...folderDetails });
		toast(`Folder has been created.`);
	};

	const createNewNote = (folderPath: string[]) => {
		const newNote: NoteType = {
			type: ElementType.NOTE,
			title: "New Note",
			excalidrawData: [],
			id: uuidv7() + "$NOTE$",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		folderDetails[newNote.id] = newNote;
		const folder = getChainedObject(folderStructure, folderPath);
		folder[newNote.id] = {};
		(
			folderDetails[folderPath[folderPath.length - 1]] as FolderType
		).count += 1;
		setFolderStructure({ ...folderStructure });
		toast(`Note has been created.`);
	};

	const deleteFolder = (folderPath: string[]) => {
		const folder = getChainedObject(folderStructure, folderPath, -1);
		delete folder[folderPath.last];
		delete folderDetails[folderPath.last];
		setSelectedFolderPath([]);
		setFolderStructure({ ...folderStructure });
		toast(`Folder has been deleted.`);
	};

	const renameFolder = (folderId: string, newTitle: string) => {
		folderDetails[folderId].title = newTitle;
		setFolderDetails({ ...folderDetails });
	};

	const moveFolder = (folderPath: string[], newParentPath: string[]) => {
		if (folderPath.last === newParentPath.last) return;
		if (
			folderPath.length > 1 &&
			folderPath.slice(0, -1).last === newParentPath.last
		)
			return;
		const folder = getChainedObject(folderStructure, folderPath, -1);
		const newParentFolder = getChainedObject(
			folderStructure,
			newParentPath
		);
		newParentFolder[folderPath.last] = folder[folderPath.last];
		delete folder[folderPath.last];
		setFolderStructure({ ...folderStructure });
	};


	const contextValue = useMemo(
		() => ({
			folderStructure,
			setFolderStructure,
			createNewFolder,
			createNewNote,
			deleteFolder,
			selectedFolderPath,
			setSelectedFolderPath,
			toggleFolderExpand,
			renameFolder,
			collapseSubFolders,
			isLoading,
			folderDetails,
			setFolderDetails,
			userEmail,
			setUserEmail,
			moveFolder,
		}),
		[
			folderStructure,
			folderDetails,
			isLoading,
			selectedFolderPath,
			userEmail,
		]
	);

	return (
		<FolderContext.Provider value={contextValue}>
			{children}
		</FolderContext.Provider>
	);
};

const useFolder = () => {
	const context = useContext(FolderContext);
	if (context === undefined) {
		throw new Error("useFolder must be used within a FolderProvider");
	}
	return context;
};

export { FolderProvider, useFolder };
