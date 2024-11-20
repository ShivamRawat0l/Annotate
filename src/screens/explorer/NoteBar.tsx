import { useFolder } from "@/src/context/FolderProvider";
import { ElementType } from "@/src/types/notes.type";
import { motion } from "framer-motion";
import { NotebookPen } from "lucide-react";
import { useMemo } from "react";

type NoteBarProps = {
  note: string;
  padding: number;
  parentId: string[];
};

export const NoteBar = ({ note, padding, parentId }: NoteBarProps) => {
  const { folderDetails, selectedFolderPath, setSelectedFolderPath } =
    useFolder();

  const noteDetails = useMemo(() => folderDetails[note], [note]);

  if (noteDetails.type === ElementType.FOLDER) return null;

  return (
    <motion.div
      key={note}
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
          selectedFolderPath?.join("-") === [...parentId, note].join("-")
            ? "#aaffee33"
            : "#aaffee00",
      }}
      onClick={() => {
        console.log("clicked", parentId, note);
        setSelectedFolderPath([...parentId, note]);
      }}
    >
      <NotebookPen size={18} />
      {noteDetails.title}
    </motion.div>
  );
};
