import { createContext, useContext, useState } from "react";
import type { Data, FolderType, NoteType } from "../types/notes.type";
import { toast } from "sonner";
import { uuidv7 } from "uuidv7";

type FolderContextType = {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  folderPath: FolderType[];
  setFolderPath: React.Dispatch<React.SetStateAction<FolderType[]>>;
  selectedNote: NoteType | null;
  resetData: () => void;
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteType | null>>;
  createNewFolder: (folder?: FolderType) => void;
  createNewNote: (folder: FolderType | null) => void;
  deleteFolder: (folder: FolderType) => void;
  selectedFolder: FolderType | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType | null>>;
  toggleFolderExpand: (folder: FolderType, isExpanded: boolean) => void;
  renameFolder: (folder: FolderType, newTitle: string) => void;
};

const FolderContext = createContext<FolderContextType | undefined>(undefined);

const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Data>([]);
  const [folderPath, setFolderPath] = useState<FolderType[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);

  const resetData = () => {
    setData([]);
    setFolderPath([]);
    setSelectedNote(null);
    setSelectedFolder(null);
  };

  const toggleFolderExpand = (folder: FolderType, isExpanded: boolean) => {
    folder.isExpanded = isExpanded;
    setData([...data]);
  };

  const createNewFolder = (folder?: FolderType) => {
    const newFolder: FolderType = {
      title: "New Folder",
      subFolders: [],
      notes: [],
      id: uuidv7(),
      isExpanded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (folder) {
      folder.isExpanded = true;
      folder.subFolders.push(newFolder);
    } else {
      data.push(newFolder);
    }
    setData([...data]);
    toast(`Folder has been created.`);
  };

  const createNewNote = (folder: FolderType | null) => {
    if (!folder) return;
    const newNote: NoteType = {
      title: "New Note",
      excalidrawData: [],
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    folder.isExpanded = true;
    folder.notes.push(newNote);
    setData([...data]);
    toast(`Note has been created.`);
  };

  // TODO: Update logic for this
  const deleteFolder = (folder: FolderType) => {
    folder.subFolders.forEach((subFolder) => {
      deleteFolder(subFolder);
    });
  };

  const renameFolder = (folder: FolderType, newTitle: string) => {
    folder.title = newTitle;
    setData([...data]);
  };

  return (
    <FolderContext.Provider
      value={{
        data,
        setData,
        folderPath,
        setFolderPath,
        selectedNote,
        setSelectedNote,
        resetData,
        createNewFolder,
        createNewNote,
        deleteFolder,
        selectedFolder,
        setSelectedFolder,
        toggleFolderExpand,
        renameFolder,
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
