import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

type NoteType = {
  id: string;
  excalidrawData: ExcalidrawElement[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type FolderType = {
  // NOTE: NOte this in notes app [key: string] = folder name
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  subFolders: FolderType[];
  notes: NoteType[];
  isExpanded: boolean;
};

type Data = FolderType[];

export type { NoteType, FolderType, Data };
