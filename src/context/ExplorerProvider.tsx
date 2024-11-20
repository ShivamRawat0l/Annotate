import { createContext, useContext, useEffect, useState } from "react";
import { updateNote } from "../appwrite/database";
import { useFolder } from "./FolderProvider";
import { useAuth } from "./AuthenticationProvider";
import { throttle } from "../utils/throttle";
type ExplorerContextType = {
  folderEditing: string;
  setFolderEditing: (folderPath: string) => void;
  isSyncing: boolean;
  syncNotesOnline: () => void;
};

const ExplorerContext = createContext<ExplorerContextType | undefined>(
  undefined
);

export const ExplorerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [folderEditing, setFolderEditing] = useState<string>("");
  const { user } = useAuth();
  const { folderStructure, folderDetails } = useFolder();
  const [isSyncing, setIsSyncing] = useState(false);

  const throttleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    await updateNote(
      user.id,
      JSON.stringify(folderStructure),
      JSON.stringify(folderDetails)
    ).then(() => {
      setIsSyncing(false);
    });
  };
  const syncNotesOnline = throttle(throttleSync, 5000);

  return (
    <ExplorerContext.Provider
      value={{
        folderEditing,
        setFolderEditing,
        isSyncing,
        syncNotesOnline,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (context === undefined) {
    throw new Error("useExplorer must be used within a ExplorerProvider");
  }
  return context;
};
