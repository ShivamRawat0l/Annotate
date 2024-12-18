import { memo } from "react";
import { FolderComponent } from "./FolderComponent";
import type { FolderStructure } from "@/src/storage/storage.types";

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
