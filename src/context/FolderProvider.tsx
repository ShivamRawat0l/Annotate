import { createContext, useContext, useState } from "react";
import type { Data, FolderType, NoteType } from "../types/notes.type";

type FolderContextType = {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  folderPath: string[];
  setFolderPath: React.Dispatch<React.SetStateAction<string[]>>;
  selectedNote: NoteType | null;
  resetData: () => void;
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteType | null>>;
};

const FolderContext = createContext<FolderContextType | undefined>(undefined);

const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Data>([]);
  const [folderPath, setFolderPath] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);

  const resetData = () => {
    setData([]);
    setFolderPath([]);
    setSelectedNote(null);
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
