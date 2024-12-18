import { CollapsibleContent } from "@/components/ui/collapsible";
import { NOTES_SUFFIX } from "@/src/constants/constants";
import type { FolderStructure } from "@/src/types/notes.type";
import { NoteBar } from "./NoteComponent";
import { ExplorerFolders } from "./ExplorerFolder";
import { ExplorerConstants } from "../constants/ExplorerConstants";

type SubFoldersType = {
    subFolders: FolderStructure;
    padding: number;
    folderPath: string[];
};

export const SubFolders = ({
    subFolders,
    padding,
    folderPath,
}: SubFoldersType) => {
    const filteredSubFolders = Object.fromEntries(
        Object.entries(subFolders).filter(
            ([key]) => !key.endsWith(NOTES_SUFFIX)
        )
    ) as FolderStructure;

    return (
        <CollapsibleContent asChild>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {Object.keys(subFolders)
                    .filter((e) => e.endsWith(NOTES_SUFFIX))
                    .map((noteId) => (
                        <NoteBar
                            noteId={noteId}
                            key={noteId}
                            padding={
                                padding + ExplorerConstants.INDENTATION_SIZE
                            }
                            parentId={folderPath}
                        />
                    ))}
                <ExplorerFolders
                    folders={filteredSubFolders}
                    padding={padding + ExplorerConstants.INDENTATION_SIZE}
                    parentId={folderPath}
                />
            </div>
        </CollapsibleContent>
    );
};
