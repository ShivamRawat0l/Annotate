import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Folders,
  NotebookPen,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { FolderType } from "@/src/types/notes.type";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ExplorerContextMenu } from "./ExplorerContextMenu";
import { useFolder } from "@/src/context/FolderProvider";
import { useExplorer } from "@/src/context/ExplorerProvider";
import { globalStyles, type Style } from "@/src/constants/Styles";

type FolderComponentProps = {
  folder: FolderType;
};

const FolderComponent = ({ folder }: FolderComponentProps) => {
  const {
    createNewFolder,
    createNewNote,
    selectedNote,
    setSelectedNote,
    toggleFolderExpand,
    setSelectedFolder,
    selectedFolder,
    collapseSubFolders,
    renameFolder,
  } = useFolder();
  const { folderEditing, setFolderEditing } = useExplorer();
  const [hover, setHover] = useState(false);
  const [title, setTitle] = useState(folder.title);

  const renderSubFolders = (folder: FolderType) => {
    return (
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
                paddingTop: 8,
                paddingLeft: 4,
                paddingBottom: 8,
                gap: 10,
                backgroundColor:
                  selectedNote?.id === note.id ? "#aaffee33" : "transparent",
              }}
              onClick={() => {
                setSelectedNote(note);
              }}
            >
              <NotebookPen size={18} />
              {note.title}
            </div>
          ))}
          <ExplorerFolders folders={folder.subFolders} />
        </div>
      </CollapsibleContent>
    );
  };

  const renderFolderOptions = () => {
    return (
      <div
        onDrag={(e) => {
          e.preventDefault();
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          console.log("dropped");
        }}
        style={{
          ...globalStyles.flexRow,
          marginRight: 8,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {hover ? (
          <>
            <Folder size={18} onClick={() => createNewFolder(folder)} />
            <NotebookPen size={18} onClick={() => createNewNote(folder)} />
          </>
        ) : (
          <div>{folder.notes.length + folder.subFolders.length}</div>
        )}
      </div>
    );
  };

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setFolderEditing(null);
      document.removeEventListener("click", handleClick);
    }
  };

  const renderTitle = () => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          marginLeft: 10,
          whiteSpace: "nowrap",
        }}
      >
        <div
          ref={ref}
          contentEditable={folderEditing === folder.id}
          onDoubleClick={(e) => {
            setFolderEditing(folder.id);
            document.addEventListener("click", handleClick);

            setTimeout(() => {
              const range = document.createRange();
              range.selectNodeContents(e.target as HTMLElement);
              const selection = window.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(range);
            }, 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFolderEditing(null);
              folder.title = (e.target as HTMLDivElement).innerText;
              document.removeEventListener("click", handleClick);
            }
          }}
          style={{
            outline: "none",
            borderBottom: folderEditing === folder.id ? "1px solid gray" : " ",
          }}
        >
          {title}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minWidth: 240,
        marginTop: 2,
        marginBottom: 2,
        marginRight: 4,
        marginLeft: 4,
        borderRadius: 8,
      }}
    >
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        open={folder.isExpanded}
        onOpenChange={(open) => {
          toggleFolderExpand(folder, open);
        }}
      >
        <ExplorerContextMenu>
          <div
            onContextMenu={() => setSelectedFolder(folder)}
            onClick={() => setSelectedFolder(folder)}
            onMouseOver={() => {
              setHover(true);
            }}
            // TODO: change to theme color
            style={{
              backgroundColor:
                selectedFolder?.id === folder.id ? "#aaffee33" : "transparent",
              display: "flex",
              flex: 1,
              flexDirection: "row",
            }}
            onMouseOut={() => setHover(false)}
          >
            <div
              style={{
                ...globalStyles.flexRow,
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <CollapsibleTrigger>
                <div style={styles.folderIcon}>
                  <ChevronRight
                    style={{
                      transform: folder.isExpanded ? "rotate(90deg)" : "",
                    }}
                  />
                  {folder.isExpanded ? (
                    <FolderOpen size={20} />
                  ) : folder.subFolders.length == 0 ? (
                    <Folder size={20} />
                  ) : (
                    <Folders size={20} />
                  )}
                </div>
              </CollapsibleTrigger>
              {renderTitle()}
            </div>
            {renderFolderOptions()}
          </div>
        </ExplorerContextMenu>

        {folder.subFolders.length > 0 &&
          folder.isExpanded &&
          folder.subFolders.find((subFolder) => subFolder.isExpanded) &&
          selectedFolder?.id == folder.id && (
            <div
              className="cursor-pointer"
              style={{
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                paddingLeft: 20,
                paddingTop: 1,
                paddingBottom: 1,
                fontSize: 8,
                backgroundColor: "skyblue",
              }}
              onClick={() => {
                collapseSubFolders(folder);
              }}
            >
              Collapse subfolders
            </div>
          )}
        {renderSubFolders(folder)}
      </Collapsible>
    </div>
  );
};

type ExplorerFoldersType = {
  folders: FolderType[];
};

export const ExplorerFolders = ({ folders }: ExplorerFoldersType) => {
  return (
    <>
      {folders.map((folder) => {
        return <FolderComponent folder={folder} key={folder.id} />;
      })}
    </>
  );
};

const styles: Style = {
  folderIcon: {
    display: "flex",
    flexDirection: "row",
  },
};
