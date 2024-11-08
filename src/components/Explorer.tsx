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

import {
  Sidebar,
  SidebarMenuSubItem,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupContent,
  SidebarGroup,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { useFolder } from "../context/FolderProvider";
import type { FolderType, NoteType } from "../types/notes.type";
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

const RightClickMenu = () => {
  return (
    <ContextMenuContent>
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
      <ContextMenuItem>Info</ContextMenuItem>
      <ContextMenuItem>Copy Url</ContextMenuItem>
    </ContextMenuContent>
  );
};

const SideBarHeaderComponent = () => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            Annotate
            <ChevronDown className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

const Explorer = () => {
  const { data, setData, setSelectedNote } = useFolder();
  const [folderSelected, setFolderSelected] = useState<FolderType | null>(null);
  const [folderEditing, setFolderEditing] = useState<string | null>(null);

  useEffect(() => {
    shortcuts();
    return () => {
      document.removeEventListener("keydown", shortcuts);
    };
  }, [folderSelected]);

  const shortcuts = () => {
    document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "r" && e.shiftKey && folderSelected) {
        setFolderEditing(folderSelected.id);
      }
      if (e.key.toLowerCase() === "a" && e.shiftKey && folderSelected) {
        createNewFolder(folderSelected);
      }
      if (e.key.toLowerCase() === "n" && e.shiftKey && folderSelected) {
        createNewNote(folderSelected);
      }
    });
  };

  const createNewFolder = (folder?: FolderType) => {
    const newFolder: FolderType = {
      title: "New Folder",
      subFolders: [],
      notes: [],
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (folder) {
      folder.subFolders.push(newFolder);
    } else {
      data.push(newFolder);
    }
    setData([...data]);
  };

  const createNewNote = (folder: FolderType) => {
    const newNote: NoteType = {
      title: "New Note",
      excalidrawData: [],
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    folder.notes.push(newNote);
    setData([...data]);
  };

  const FolderComponent = ({ folder }: { folder: FolderType }) => {
    const [hover, setHover] = useState(false);
    const [title, setTitle] = useState(folder.title);
    return (
      <SidebarMenuItem style={{ width: "250px" }}>
        <Collapsible
          className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          defaultOpen={true}
        >
          <CollapsibleTrigger
            asChild
            onMouseOver={() => {
              setHover(true);
            }}
            style={{
              backgroundColor:
                folderSelected?.id === folder.id ? "red" : "transparent",
            }}
            onMouseOut={() => setHover(false)}
            onClick={() => setFolderSelected(folder)}
          >
            <ContextMenu>
              <ContextMenuTrigger>
                <SidebarMenuButton>
                  <ChevronRight className="transition-transform" />
                  <Folder />
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
                </SidebarMenuButton>
              </ContextMenuTrigger>
              <RightClickMenu />
              {hover ? (
                <SidebarMenuAction>
                  <Folder onClick={() => createNewFolder(folder)} />
                  <NotebookPen onClick={() => createNewNote(folder)} />
                </SidebarMenuAction>
              ) : (
                <SidebarMenuBadge>
                  {folder.notes.length + folder.subFolders.length}
                </SidebarMenuBadge>
              )}
            </ContextMenu>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {renderFolder(folder.subFolders)}
              {folder.notes.map((note) => (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedNote(note);
                    }}
                    className="data-[active=true]:bg-transparent"
                  >
                    <File />
                    {note.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
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
    <Sidebar>
      <SideBarHeaderComponent />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Annotate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.length != 0 ? (
                renderFolder(data)
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => createNewFolder()}>
                    <PlusSquare />
                    Create folder
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default Explorer;
