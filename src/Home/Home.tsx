import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import { useEffect, useState } from "react";

type NOTE = {
  id: number;
  excalidrawData: ExcalidrawElement[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type Folder = {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  notes: NOTE[];
};

type Parent = {
  // NOTE: NOte this in notes app [key: string] = folder name
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  folders: Folder[];
};

type Data = Parent[];

type Settings = {
  saveInterval: number;
};

const Home = () => {
  const [data, setData] = useState<Data>([]);
  const [newParentTitle, setNewParentTitle] = useState<string>("");
  const [newFolderTitle, setNewFolderTitle] = useState<string>("");
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedNote, setSelectedNote] = useState<NOTE | null>(null);

  useEffect(() => {
    loadData();
    setInterval(() => {
      saveData(data);
    }, 1000_000_0);
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    saveConfig();
  }, [selectedParent, selectedFolder, selectedNote]);

  const saveConfig = () => {
    localStorage.setItem(
      "config",
      JSON.stringify({
        initialSavedParentId: selectedParent?.id,
        initialSavedFolderId: selectedFolder?.id,
        initialSavedNoteId: selectedNote?.id,
      })
    );
  };
  const handleFileDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.json";
    document.body.appendChild(element);
    element.click();
  };

  const saveData = (data: Data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  const loadConfig = (initialData: Data) => {
    const config = localStorage.getItem("config");
    if (config) {
      const parsedConfig = JSON.parse(config);
      console.log(parsedConfig, initialData);
      const savedSelectedParent =
        initialData?.find((p) => p.id === parsedConfig.initialSavedParentId) ??
        null;

      const savedSelectedFolder =
        savedSelectedParent?.folders.find(
          (f) => f.id === parsedConfig.initialSavedFolderId
        ) ?? null;

      const savedSelectedNote =
        savedSelectedFolder?.notes.find(
          (n) => n.id === parsedConfig.initialSavedNoteId
        ) ?? null;

      setSelectedParent(savedSelectedParent);
      setSelectedFolder(savedSelectedFolder);
      setSelectedNote(savedSelectedNote);
    }
  };

  const loadData = () => {
    const data = localStorage.getItem("data");
    if (data) {
      const fetchedData = JSON.parse(data);
      setData(fetchedData);
      loadConfig(fetchedData);
    }
  };

  return (
    <div style={styles.container}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div style={styles.parents}>
        {data.map((parent) => (
          <div key={parent.id} onClick={() => setSelectedParent(parent)}>
            {parent.title}
          </div>
        ))}
        <input
          value={newParentTitle}
          onChange={(e) => setNewParentTitle(e.target.value)}
          type="text"
          // NOTE: Check why on submit does not work and this works
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setData((e) => {
                return [
                  ...e,
                  {
                    id: e.length + 1,
                    title: newParentTitle,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    folders: [],
                  },
                ];
              });
            }
          }}
        />
      </div>
      {selectedParent && (
        <div style={styles.folders}>
          {selectedParent.folders.map((folder) => (
            <div key={folder.id} onClick={() => setSelectedFolder(folder)}>
              {folder.title}
            </div>
          ))}
          <input
            value={newFolderTitle}
            onChange={(e) => setNewFolderTitle(e.target.value)}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                selectedParent.folders.push({
                  id: selectedParent.folders.length + 1,
                  title: newFolderTitle,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  notes: [],
                });
                setData((e) => [...e]);
              }
            }}
          />
        </div>
      )}
      {selectedFolder && (
        <div style={styles.notes}>
          {selectedFolder.notes.map((note) => (
            <div key={note.id} onClick={() => setSelectedNote(note)}>
              {note.title}
            </div>
          ))}
          <input
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                selectedFolder.notes.push({
                  id: selectedFolder.notes.length + 1,
                  excalidrawData: [],
                  title: newNoteTitle,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
                setData((e) => [...e]);
              }
            }}
          />
        </div>
      )}
      {selectedNote && (
        <div style={{ height: "800px", width: "1500px" }}>
          <Excalidraw
            renderTopRightUI={() => (
              <div>
                <button onClick={() => saveData(data)}>Save focus</button>
                <button
                  onClick={() => {
                    handleFileDownload();
                  }}
                >
                  Export Temp
                </button>
                <button onClick={() => saveData(data)}>Save</button>
              </div>
            )}
            initialData={{
              elements: selectedNote.excalidrawData,
            }}
            onChange={(excalidrawData) => {
              selectedNote.excalidrawData = [...excalidrawData];
            }}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  parents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  folders: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  notes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
} as const;

export default Home;
