import { useExplorer } from "@/src/context/ExplorerProvider";
import { useFolder } from "@/src/context/FolderProvider";
import { ElementType } from "@/src/types/notes.type";
import { motion } from "framer-motion";
import { NotebookPen } from "lucide-react";
import { useMemo, useRef } from "react";

type NoteBarProps = {
  noteId: string;
  padding: number;
  parentId: string[];
};

export const NoteBar = ({ noteId, padding, parentId }: NoteBarProps) => {
  const { folderDetails, selectedFolderPath, setSelectedFolderPath } =
    useFolder();
  const { folderEditing, setFolderEditing } = useExplorer();
  const noteDetails = useMemo(() => folderDetails[noteId], [noteId]);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setFolderEditing("");
      document.removeEventListener("click", handleClick);
    }
  };

  const render = () => {
    return (
      <motion.div
        key={noteId}
        whileHover={{ backgroundColor: "#aaffee33" }}
        transition={{ duration: 0.2 }}
        draggable
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingTop: 8,
          paddingLeft: padding + 20 + 6,
          paddingBottom: 8,
          borderRadius: 4,
          gap: 10,
          backgroundColor:
            selectedFolderPath?.join("-") === [...parentId, noteId].join("-")
              ? "#aaffee33"
              : "#aaffee00",
        }}
        onClick={() => {
          setSelectedFolderPath([...parentId, noteId]);
        }}
        onDragStart={(e: any) => {
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
              id: [...parentId, noteId],
            })
          );
        }}
      >
        <NotebookPen size={18} />
        <div
          ref={ref}
          contentEditable={folderEditing === noteId}
          onDoubleClick={(e) => {
            setFolderEditing(noteId);
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
              noteDetails.title = (e.target as HTMLDivElement).innerText;
              document.removeEventListener("click", handleClick);
            }
          }}
          style={{
            outline: "none",
            borderBottom: folderEditing === noteId ? "1px solid gray" : " ",
          }}
        >
          {noteDetails.title}
        </div>
      </motion.div>
    );
  };

  return (
    <>{noteDetails && noteDetails.type === ElementType.NOTE && render()}</>
  );
};
