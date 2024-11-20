import type { Style } from "@/src/constants/Styles";
import { type FolderStructure, ElementType } from "@/src/types/notes.type";
import { FolderComponent } from "./FolderComponent";

type ExplorerFoldersType = {
  folders: FolderStructure;
  padding?: number;
  parentId?: string[];
};

export const ExplorerFolders = ({
  folders,
  padding = 4,
  parentId = [],
}: ExplorerFoldersType) => {
  return (
    <>
      {Object.keys(folders).map((folder) => {
        return (
          <FolderComponent
            folderId={folder}
            subFolders={folders[folder]}
            key={folder}
            padding={padding}
            parentId={parentId}
          />
        );
      })}
    </>
  );
};
