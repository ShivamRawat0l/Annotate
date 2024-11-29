import { type FolderStructure } from "@/src/types/notes.type";
import { memo } from "react";
import { FolderComponent } from "./FolderComponent";

type ExplorerFoldersType = {
	folders: FolderStructure;
	padding?: number;
	parentId?: string[];
};

export const ExplorerFolders = memo(
	({ folders, padding = 20, parentId = [] }: ExplorerFoldersType) => {
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
