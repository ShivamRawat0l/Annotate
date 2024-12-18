import type { FolderPath, FolderStructure } from "@/src/types/notes.type";

export const getChainedObject = (
    object: FolderStructure,
    path: FolderPath,
    level?: number
) => {
    if (!level) level = path.length;
    return path.slice(0, level).reduce((acc, key) => acc[key], object);
};
