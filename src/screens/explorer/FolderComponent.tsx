import { useMemo, useRef } from "react";

import { useExplorer } from "@/src/context/ExplorerProvider";
import { useFolder } from "@/src/context/FolderProvider";
import { ElementType, type FolderStructure } from "@/src/types/notes.type";

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  Folders,
  NotebookPen,
} from "lucide-react";
import { useState } from "react";
import { NOTES_SUFFIX } from "@/src/constants/Constants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NoteBar } from "./NoteBar";
import { ExplorerFolders } from "./ExplorerFolder";
import { ExplorerContextMenu } from "./ExplorerContextMenu";
import { globalStyles, type Style } from "@/src/constants/Styles";

type FolderComponentProps = {
  folderId: string;
  padding: number;
  parentId: string[];
  subFolders: FolderStructure;
};

const MotionChevronRight = motion(ChevronRight);

export const FolderComponent = ({
  folderId,
  padding,
  parentId,
  subFolders,
}: FolderComponentProps) => {
  const {
    createNewFolder,
    createNewNote,
    toggleFolderExpand,
    setSelectedFolderPath,
    selectedFolderPath,
    collapseSubFolders,
    folderDetails: folderDetailsState,
  } = useFolder();

  const { folderEditing, setFolderEditing } = useExplorer();
  const [hover, setHover] = useState(false);

  const folderPath = useMemo(
    () => [...parentId, folderId],
    [parentId, folderId]
  );
  const ref = useRef<HTMLDivElement>(null);

  const folderDetails = useMemo(() => {
    return folderDetailsState[folderId];
  }, [folderId, folderDetailsState]);

  const dragHover = useMotionValue(0);

  const renderSubFolders = () => {
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
            .map((note) => (
              <NoteBar
                note={note}
                key={note}
                padding={padding + 20}
                parentId={[...parentId, folderId]}
              />
            ))}
          <ExplorerFolders
            folders={subFolders}
            padding={padding + 20}
            parentId={[...parentId, folderId]}
          />
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
            <Folder
              size={18}
              onClick={() => {
                createNewFolder(folderPath);
              }}
              style={{
                marginRight: 10,
              }}
            />
            <NotebookPen size={18} onClick={() => createNewNote(folderPath)} />
          </>
        ) : (
          <div>{Object.keys(subFolders).length}</div>
        )}
      </div>
    );
  };

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setFolderEditing("");
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
          contentEditable={folderEditing === folderId}
          onDoubleClick={(e) => {
            setFolderEditing(folderId);
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
              setFolderEditing("");
              folderDetails.title = (e.target as HTMLDivElement).innerText;
              document.removeEventListener("click", handleClick);
            }
          }}
          style={{
            outline: "none",
            borderBottom: folderEditing === folderId ? "1px solid gray" : " ",
          }}
        >
          {folderDetails.title}
        </div>
      </div>
    );
  };

  if (folderDetails.type === ElementType.NOTE) return null;

  return (
    <motion.div
      style={{
        minWidth: 240,
        marginTop: 2,
        marginBottom: 2,
        marginRight: 4,
        marginLeft: 4,
        borderRadius: 8,
        backgroundColor: useTransform(
          dragHover,
          [0, 1],
          ["rgba(0, 0, 0, 0)", "rgba(255, 0, 0, 1)"]
        ),
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragHover.set(1);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragHover.set(0);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(e.dataTransfer.getData("application/json"));
        console.log(folderId);
        dragHover.set(0);
      }}
    >
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        open={folderDetails.isExpanded}
        onOpenChange={(open) => {
          toggleFolderExpand(folderId, open);
        }}
      >
        <ExplorerContextMenu>
          <motion.div
            draggable
            //data-folder-id={[...parentId, folder.id]}
            onDragStart={(e: any) => {
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({
                  id: folderPath,
                })
              );
            }}
            whileHover={{ backgroundColor: "#aaffee33" }}
            transition={{ duration: 0.2 }}
            onContextMenu={() => setSelectedFolderPath(folderPath)}
            onClick={() => setSelectedFolderPath(folderPath)}
            onMouseOver={() => {
              setHover(true);
            }}
            // TODO: change to theme color
            style={{
              backgroundColor:
                selectedFolderPath?.join("") === folderPath.join("")
                  ? "#aaffee33"
                  : "#aaffee00",
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
                    animate={{ rotate: folderDetails.isExpanded ? 90 : 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                  />
                  {folderDetails.isExpanded ? (
                    <FolderOpen size={20} />
                  ) : folderDetails.count == 0 ? (
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

        {folderDetails.count > 0 &&
          folderDetails.isExpanded &&
          Object.keys(subFolders).find((subFolderId) => {
            const subFolderDetails = folderDetailsState[subFolderId];
            if (subFolderDetails.type === ElementType.NOTE) return false;
            return subFolderDetails.isExpanded;
          }) &&
          selectedFolderPath?.join("-") == folderPath.join("-") && (
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
                collapseSubFolders(folderPath);
              }}
            >
              Collapse subfolders
            </div>
          )}
        {renderSubFolders()}
      </Collapsible>
    </motion.div>
  );
};

const styles: Style = {
  folderIcon: {
    display: "flex",
    flexDirection: "row",
  },
};
