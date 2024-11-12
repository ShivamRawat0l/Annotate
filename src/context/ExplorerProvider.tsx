import { createContext, useContext, useState } from "react";
type ExplorerContextType = {
  folderEditing: string | null;
  setFolderEditing: (id: string | null) => void;
};

const ExplorerContext = createContext<ExplorerContextType | undefined>(
  undefined
);

export const ExplorerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [folderEditing, setFolderEditing] = useState<string | null>(null);

  return (
    <ExplorerContext.Provider
      value={{
        folderEditing,
        setFolderEditing,
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
