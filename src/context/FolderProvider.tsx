import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  ElementType,
  type FolderData,
  type FolderPath,
  type FolderStructure,
  type FolderType,
  type NoteType,
} from "../types/notes.type";
import { toast } from "sonner";
import { uuidv7 } from "uuidv7";
import { DATA_STORAGE_KEY } from "../constants/Constants";
import { getChainedObject } from "../utils/array";
import { getDBData, updateNote } from "../appwrite/database";

type FolderContextType = {
  folderStructure: FolderStructure;
  setFolderStructure: React.Dispatch<React.SetStateAction<FolderStructure>>;
  resetData: () => void;
  createNewFolder: (folderPath: string[]) => void;
  createNewNote: (folderPath: string[]) => void;
  deleteFolder: (folderPath: string[]) => void;
  selectedFolderPath: string[];
  setSelectedFolderPath: React.Dispatch<React.SetStateAction<string[]>>;
  toggleFolderExpand: (folderId: string, status?: boolean) => void;
  renameFolder: (folderId: string, newTitle: string) => void;
  collapseSubFolders: (folderPath: string[]) => void;
  isLoading: boolean;
  getFolderDetails: (id: string) => FolderType | NoteType;
  getFolderStorageObject: () => string;
  fetchAppwriteFolders: (userId: string) => void;
  folderDetails: FolderData;
};

const FolderContext = createContext<FolderContextType | undefined>(undefined);

const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [folderDetails, setFolderDetails] = useState<FolderData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolderPath, setSelectedFolderPath] = useState<string[]>([]);

  const isLocalDataFetched = useRef(false);

  useEffect(() => {
    loadConfig();
    loadData();
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    saveFolderData();
  }, [folderStructure, folderDetails]);

  const fetchAppwriteFolders = async (userId: string) => {
    if (
      userId &&
      !isLocalDataFetched.current &&
      Object.keys(folderStructure).length === 0 &&
      Object.keys(folderDetails).length === 0
    ) {
      const notes = await getDBData(userId);
      setFolderStructure(notes.structure);
      setFolderDetails(notes.details);
    }
  };

  const getFolderStorageObject = () => {
    return JSON.stringify({ folderStructure, folderDetails });
  };

  const saveConfig = () => {
    localStorage.setItem("config", JSON.stringify({}));
  };

  const saveFolderData = () => {
    localStorage.setItem(
      DATA_STORAGE_KEY,
      JSON.stringify({ folderStructure, folderDetails })
    );
  };

  const loadConfig = async () => {
    const config = localStorage.getItem("config");
  };

  const loadData = () => {
    const data = localStorage.getItem(DATA_STORAGE_KEY);
    if (data) {
      console.log("Local Data", data);
      const fetchedData = JSON.parse(data);
      console.log("Fetched Data", fetchedData);
      setFolderStructure(fetchedData.folderStructure);
      setFolderDetails(fetchedData.folderDetails);
      isLocalDataFetched.current = true;
    }
  };

  const resetData = () => {
    setFolderStructure({});
    setFolderDetails({});
    setSelectedFolderPath([]);
  };

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
      item.isExpanded = !item.isExpanded;
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
    console.log(item, folderPath.last, folderPath, folderDetails);
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
    (folderDetails[folderPath[folderPath.length - 1]] as FolderType).count += 1;
    setFolderStructure({ ...folderStructure });
    toast(`Note has been created.`);
  };

  const deleteFolder = (folderPath: string[]) => {
    const folder = getChainedObject(folderStructure, folderPath.slice(0, -1));
    delete folder[folderPath[folderPath.length - 1]];
    delete folderDetails[folderPath[folderPath.length - 1]];
    setFolderStructure({ ...folderStructure });
    setFolderDetails({ ...folderDetails });
    toast(`Folder has been deleted.`);
  };

  const renameFolder = (folderId: string, newTitle: string) => {
    folderDetails[folderId].title = newTitle;
    setFolderDetails({ ...folderDetails });
  };

  const getFolderDetails = (id: string) => {
    return folderDetails[id];
  };

  return (
    <FolderContext.Provider
      value={{
        folderStructure,
        setFolderStructure,
        resetData,
        createNewFolder,
        createNewNote,
        fetchAppwriteFolders,
        deleteFolder,
        selectedFolderPath,
        setSelectedFolderPath,
        toggleFolderExpand,
        renameFolder,
        collapseSubFolders,
        isLoading,
        getFolderDetails,
        getFolderStorageObject,
        folderDetails,
      }}
    >
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
