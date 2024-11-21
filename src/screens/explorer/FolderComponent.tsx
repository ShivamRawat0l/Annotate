import { useCallback, useMemo, useRef } from "react";

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
import { ErrorBoundary } from "react-error-boundary";

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
    folderDetails,
    moveFolder,
  } = useFolder();

  const { folderEditing, setFolderEditing } = useExplorer();
  const [hover, setHover] = useState(false);

  const folderPath = useMemo(
    () => [...parentId, folderId],
    [parentId, folderId]
  );
  const ref = useRef<HTMLDivElement>(null);

  const dragHover = useMotionValue(0);

  const renderSubFolders = () => {
    const filteredSubFolders = Object.fromEntries(
      Object.entries(subFolders).filter(([key]) => !key.endsWith(NOTES_SUFFIX))
    ) as FolderStructure;
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
            .map((noteId) => (
              <NoteBar
                noteId={noteId}
                key={noteId}
                padding={padding + 20}
                parentId={folderPath}
              />
            ))}
          <ExplorerFolders
            folders={filteredSubFolders}
            padding={padding + 20}
            parentId={folderPath}
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
              size={16}
              onClick={() => {
                createNewFolder(folderPath);
              }}
              style={{
                marginRight: 10,
              }}
            />
            <NotebookPen size={16} onClick={() => createNewNote(folderPath)} />
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
              folderDetails[folderId].title = (
                e.target as HTMLDivElement
              ).innerText;
              document.removeEventListener("click", handleClick);
            }
          }}
          style={{
            outline: "none",
            borderBottom: folderEditing === folderId ? "1px solid gray" : " ",
          }}
        >
          {folderDetails[folderId].title}
        </div>
      </div>
    );
  };

  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragHover.set(1);
  }, []);

  const onDragLeave = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragHover.set(0);
  }, []);

  const renderFolderIcons = () => {
    if (folderDetails[folderId].type === ElementType.NOTE) return null;
    return (
      <div style={styles.folderIcon}>
        <MotionChevronRight
          animate={{
            rotate: folderDetails[folderId].isExpanded ? 90 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
        {folderDetails.isExpanded ? (
          <FolderOpen size={20} />
        ) : folderDetails[folderId].count == 0 ? (
          <Folder size={20} />
        ) : (
          <Folders size={20} />
        )}
      </div>
    );
  };

  const renderCollapseSubFolders = () => {
    if (folderDetails[folderId].type === ElementType.NOTE) return null;
    return (
      <>
        {folderDetails[folderId].count > 0 &&
          folderDetails[folderId].isExpanded &&
          Object.keys(subFolders).find((subFolderId) => {
            const subFolderDetails = folderDetails[subFolderId];
            if (
              subFolderDetails == undefined ||
              subFolderDetails.type === ElementType.NOTE
            )
              return false;
            return subFolderDetails.isExpanded;
          }) &&
          selectedFolderPath?.join("") === folderPath.join("") && (
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
      </>
    );
  };

  return (
    <ErrorBoundary
      fallback={<p>Something went wrong in the Folder Component</p>}
    >
      {folderDetails[folderId] &&
        folderDetails[folderId].type === ElementType.FOLDER && (
          <motion.div
            style={{
              minWidth: 240,
              marginTop: 2,
              marginBottom: 2,
              borderRadius: 8,
              backgroundColor: useTransform(
                dragHover,
                [0, 1],
                ["rgba(0, 0, 0, 0)", "rgba(255, 0, 0, 1)"]
              ),
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => {
              e.stopPropagation();
              e.preventDefault();
              moveFolder(
                JSON.parse(e.dataTransfer.getData("application/json")).id,
                folderPath
              );
              dragHover.set(0);
            }}
          >
            <Collapsible
              open={folderDetails[folderId].isExpanded}
              onOpenChange={(open) => {
                toggleFolderExpand(folderId, open);
              }}
            >
              <ExplorerContextMenu>
                <motion.div
                  draggable
                  onDragStart={(e: any) => {
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({
                        id: folderPath,
                      })
                    );
                  }}
                  onContextMenu={() => setSelectedFolderPath(folderPath)}
                  onClick={() => setSelectedFolderPath(folderPath)}
                  onMouseOver={() => {
                    setHover(true);
                  }}
                  style={{
                    backgroundColor:
                      selectedFolderPath?.join("") === folderPath.join("")
                        ? ""
                        : "#aaffee00",
                    display: "flex",
                    borderRadius: 4,
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
                      {renderFolderIcons()}
                    </CollapsibleTrigger>
                    {renderTitle()}
                  </div>
                  {renderFolderOptions()}
                </motion.div>
              </ExplorerContextMenu>
              {renderCollapseSubFolders()}
              {renderSubFolders()}
            </Collapsible>
          </motion.div>
        )}
    </ErrorBoundary>
  );
};

const styles: Style = {
  folderIcon: {
    display: "flex",
    flexDirection: "row",
  },
};
