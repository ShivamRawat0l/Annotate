import { type FolderStructure } from "@/src/types/notes.type";
import { FolderComponent } from "./FolderComponent";
import { memo } from "react";

type ExplorerFoldersType = {
  folders: FolderStructure;
  padding?: number;
  parentId?: string[];
};

export const ExplorerFolders = memo(
  ({ folders, padding = 4, parentId = [] }: ExplorerFoldersType) => {
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
  }
);
