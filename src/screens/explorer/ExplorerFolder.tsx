import {
  ChevronRight,
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
import { ExplorerContextMenu } from "./ExplorerContextMenu";
import { useFolder } from "@/src/context/FolderProvider";
import { useExplorer } from "@/src/context/ExplorerProvider";
import { globalStyles, type Style } from "@/src/constants/Styles";
import "./ExplorerFolder.css";
import { motion } from "framer-motion";
type FolderComponentProps = {
  folder: FolderType;
  padding: number;
};

type ExplorerFoldersType = {
  folders: FolderType[];
  padding: number;
};

const MotionChevronRight = motion(ChevronRight);

const FolderComponent = ({ folder, padding }: FolderComponentProps) => {
  const {
    createNewFolder,
    createNewNote,
    selectedNote,
    setSelectedNote,
    toggleFolderExpand,
    setSelectedFolder,
    selectedFolder,
    collapseSubFolders,
  } = useFolder();
  const { folderEditing, setFolderEditing } = useExplorer();
  const [hover, setHover] = useState(false);

  const renderSubFolders = (folder: FolderType) => {
    return (
      <CollapsibleContent asChild>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {folder.notes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ backgroundColor: "#aaffee33" }}
              transition={{ duration: 0.2 }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                paddingTop: 8,
                paddingLeft: padding + 20 + 10,
                paddingBottom: 8,
                gap: 10,
                backgroundColor:
                  selectedNote?.id === note.id ? "#aaffee33" : "#aaffee00",
              }}
              onClick={() => {
                setSelectedNote(note);
              }}
            >
              <NotebookPen size={18} />
              {note.title}
            </motion.div>
          ))}
          <ExplorerFolders folders={folder.subFolders} padding={padding + 20} />
        </div>
      </CollapsibleContent>
    );
  };

  const renderFolderOptions = () => {
    return (
      <div
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
          {folder.title}
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
          <motion.div
            initial={{ backgroundColor: "#aaffee00" }}
            whileHover={{ backgroundColor: "#aaffee33" }}
            transition={{ duration: 0.2 }}
            onContextMenu={() => setSelectedFolder(folder)}
            onClick={() => setSelectedFolder(folder)}
            onMouseOver={() => {
              setHover(true);
            }}
            // TODO: change to theme color
            style={{
              backgroundColor:
                selectedFolder?.id === folder.id ? "#aaffee33" : "#aaffee00",
              display: "flex",
              flex: 1,
              flexDirection: "row",
              paddingLeft: padding,
            }}
            onMouseOut={() => setHover(false)}
          >
            <div
              style={{
                ...globalStyles.flexRow,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <CollapsibleTrigger>
                <div style={styles.folderIcon}>
                  <MotionChevronRight
                    animate={{ rotate: folder.isExpanded ? 90 : 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
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
          </motion.div>
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

export const ExplorerFolders = ({
  folders,
  padding = 4,
}: ExplorerFoldersType) => {
  return (
    <>
      {folders.map((folder) => {
        return (
          <FolderComponent folder={folder} key={folder.id} padding={padding} />
        );
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
