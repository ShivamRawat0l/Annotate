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
      {Object.keys(folders).map((folderId) => {
        return (
          <FolderComponent
            folderId={folderId}
            subFolders={folders[folderId]}
            parentId={parentId}
            key={folderId}
            padding={padding}
          />
        );
      })}
    </>
  );
};
