import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

type NoteType = {
  id: string;
  excalidrawData: ExcalidrawElement[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type FolderType = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  subFolders: FolderType[];
  notes: NoteType[];
  isExpanded: boolean;
};

type Data = FolderType[];

type UserType = {
  id: string;
  email: string;
  name: string;
  photoUrl: string;
};

export type { NoteType, FolderType, Data, UserType };
