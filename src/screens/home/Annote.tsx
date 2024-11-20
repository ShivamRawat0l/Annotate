import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { useFolder } from "@/src/context/FolderProvider";
import { useEffect, useState, useRef, useMemo } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { motion, MotionValue } from "framer-motion";
import { ElementType, type NoteType } from "@/src/types/notes.type";
import { NOTES_SUFFIX } from "@/src/constants/Constants";

type AnnoteProps = {
  sidebarWidth: MotionValue<number>;
};

const Annote = ({ sidebarWidth }: AnnoteProps) => {
  const { selectedFolderPath, getFolderDetails } = useFolder();
  const currentNote = useRef<string | undefined>(undefined);
  const theme = getTheme();
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const selectedNote: NoteType | undefined = useMemo(() => {
    let selectedNoteId = selectedFolderPath.last;
    if (
      selectedFolderPath &&
      selectedNoteId &&
      selectedNoteId.endsWith(NOTES_SUFFIX) &&
      getFolderDetails(selectedNoteId).type === ElementType.NOTE
    ) {
      return getFolderDetails(selectedNoteId) as NoteType;
    }
    return undefined;
  }, [selectedFolderPath]);

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: selectedNote?.excalidrawData,
      });
      currentNote.current = selectedNote?.id;
    }
  }, [selectedNote]);

  if (!selectedNote) {
    return null;
  }

  return (
    <div>
      <motion.div
        style={{
          height: "96vh",
          width: sidebarWidth,
        }}
      >
        <Excalidraw
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              toggleTheme: false,
            },
          }}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          renderTopRightUI={() => <div></div>}
          initialData={{
            elements: selectedNote.excalidrawData,
            appState: {
              viewBackgroundColor: Colors[theme].background,
              theme: "dark",
              currentItemStrokeColor: "#eee",
            },
          }}
          onChange={(excalidrawData) => {
            if (currentNote.current === selectedNote.id) {
              selectedNote.excalidrawData = [...excalidrawData];
            }
          }}
        >
          <WelcomeScreen>
            <WelcomeScreen.Hints.ToolbarHint>
              <p> ToolBar </p>
            </WelcomeScreen.Hints.ToolbarHint>
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
      </motion.div>
    </div>
  );
};

export default Annote;
