import type { FolderPath, FolderStructure } from "@/src/types/notes.type";

export const getChainedObject = (object: FolderStructure, path: FolderPath) => {
  return path.reduce((acc, key) => acc[key], object);
};
