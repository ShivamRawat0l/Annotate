import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { uuidv7 } from "uuidv7";

import { useFolder } from "../../context/FolderProvider";
import type { FolderType, NoteType } from "../../types/notes.type";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Home,
  MoreHorizontal,
  NotebookPen,
  PlusSquare,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Colors } from "../../constants/Colors";
import { getTheme, useTheme } from "@/components/theme-provider";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { Button } from "@/components/ui/button";
import { updateNote } from "@/src/appwrite/database";
import { toast } from "sonner";
import Logo from "@/assets/icon.png";

const RightClickMenu = () => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem>
        Create Folder
        <ContextMenuShortcut>⇧A</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Create Note
        <ContextMenuShortcut>⇧N</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Rename
        <ContextMenuShortcut>⇧R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Delete
        <ContextMenuShortcut>⇧D</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Toggle Expand
        <ContextMenuShortcut>⇧T</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>Info</ContextMenuItem>
      <ContextMenuItem>Copy Url</ContextMenuItem>
    </ContextMenuContent>
  );
};

const Header = () => {
  return (
    <div>
      <img src={Logo} alt="Annotate" />
      Annotate
    </div>
  );
};

const Explorer = () => {
  const { data, setData, setSelectedNote, selectedNote } = useFolder();
  const [folderSelected, setFolderSelected] = useState<FolderType | null>(null);
  const [folderEditing, setFolderEditing] = useState<string | null>(null);
  const { user, googleLogin, logout } = useAuth();
  const theme = getTheme();

  useEffect(() => {
    addShortcutEvent();
    return () => {
      document.removeEventListener("keydown", shortcuts);
    };
  }, [folderSelected]);

  const addShortcutEvent = () => {
    document.addEventListener("keydown", shortcuts);
  };

  const shortcuts = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key.toLowerCase() === "r" && e.shiftKey && folderSelected) {
      setFolderEditing(folderSelected.id);
    }
    if (e.key.toLowerCase() === "a" && e.shiftKey && folderSelected) {
      createNewFolder(folderSelected);
    }
    if (e.key.toLowerCase() === "n" && e.shiftKey && folderSelected) {
      createNewNote(folderSelected);
    }
  };

  const createNewFolder = (folder?: FolderType) => {
    const newFolder: FolderType = {
      title: "New Folder",
      subFolders: [],
      notes: [],
      id: uuidv7(),
      isExpanded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (folder) {
      folder.isExpanded = true;
      folder.subFolders.push(newFolder);
    } else {
      data.push(newFolder);
    }
    setData([...data]);
    toast(`Folder has been created.`);
  };

  const createNewNote = (folder: FolderType) => {
    const newNote: NoteType = {
      title: "New Note",
      excalidrawData: [],
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    folder.isExpanded = true;
    folder.notes.push(newNote);
    setData([...data]);
    toast(`Note has been created.`);
  };

  const FolderComponent = ({ folder }: { folder: FolderType }) => {
    const [hover, setHover] = useState(false);
    const [title, setTitle] = useState(folder.title);
    return (
      <div>
        <Collapsible
          className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          open={folder.isExpanded}
          onOpenChange={(open) => {
            folder.isExpanded = open;
            setData([...data]);
          }}
        >
          <div
            onClick={() => setFolderSelected(folder)}
            onDoubleClick={() => setFolderEditing(folder.id)}
            onMouseOver={() => {
              setHover(true);
            }}
            // TODO: change to theme color
            style={{
              backgroundColor:
                folderSelected?.id === folder.id ? "#aaffee33" : "transparent",
              display: "flex",
              flex: 1,
              flexDirection: "row",
            }}
            onMouseOut={() => setHover(false)}
          >
            <ContextMenu>
              <ContextMenuTrigger
                style={{ flex: 1, display: "flex", flexDirection: "row" }}
              >
                <div>
                  <CollapsibleTrigger>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <ChevronRight className="transition-transform" />
                      <Folder />
                    </div>
                  </CollapsibleTrigger>
                  {folderEditing !== folder.id ? (
                    title
                  ) : (
                    <Input
                      autoFocus
                      value={title}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setFolderEditing(null);
                          folder.title = title;
                          setData([...data]);
                        }
                      }}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  )}
                </div>
                {hover ? (
                  <div>
                    <Folder onClick={() => createNewFolder(folder)} />
                    <NotebookPen onClick={() => createNewNote(folder)} />
                  </div>
                ) : (
                  <div>{folder.notes.length + folder.subFolders.length}</div>
                )}
              </ContextMenuTrigger>
              <RightClickMenu />
            </ContextMenu>
          </div>
          <CollapsibleContent asChild>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 20,
              }}
            >
              {folder.notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor:
                      selectedNote?.id === note.id
                        ? "#aaffee33"
                        : "transparent",
                  }}
                  onClick={() => {
                    setSelectedNote(note);
                  }}
                  className="data-[active=true]:bg-transparent"
                >
                  <File />
                  {note.title}
                </div>
              ))}
              {renderFolder(folder.subFolders)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderFolder = (folders: FolderType[]) => {
    return (
      <>
        {folders.map((folder) => {
          return <FolderComponent folder={folder} key={folder.id} />;
        })}
      </>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: Colors[theme].background,
        flexDirection: "column",
      }}
    >
      <Header />
      <div>Annotate</div>
      {data.length != 0 ? (
        renderFolder(data)
      ) : (
        <Button onClick={() => createNewFolder()}>
          <PlusSquare />
          Create folder
        </Button>
      )}
      <Button onClick={() => updateNote(user?.id, data)}>Save All</Button>
      {!user ? (
        <Button onClick={() => googleLogin()}>Login</Button>
      ) : (
        <Button onClick={() => logout()}>Logout</Button>
      )}
    </div>
  );
};

export default Explorer;
