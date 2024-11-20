import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { useFolder } from "@/src/context/FolderProvider";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { motion, MotionValue } from "framer-motion";
import { ElementType, type NoteType } from "@/src/types/notes.type";
import { NOTES_SUFFIX } from "@/src/constants/Constants";
import { throttle } from "@/src/utils/throttle";
import { debounce } from "@/src/utils/debounce";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type AnnoteProps = {
  sidebarWidth: MotionValue<number>;
};

const Annote = ({ sidebarWidth }: AnnoteProps) => {
  const { selectedFolderPath, folderDetails, setFolderDetails } = useFolder();
  const theme = getTheme();
  const [currentNoteId, setCurrentNoteId] = useState<string | undefined>(
    undefined
  );
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const selectedNote: NoteType | undefined = useMemo(() => {
    let selectedNoteId = selectedFolderPath.last;
    if (
      selectedFolderPath &&
      selectedNoteId &&
      selectedNoteId.endsWith(NOTES_SUFFIX) &&
      folderDetails[selectedNoteId].type === ElementType.NOTE
    ) {
      return folderDetails[selectedNoteId] as NoteType;
    }
    return undefined;
  }, [selectedFolderPath]);

  useEffect(() => {
    console.log("currentNoteId", currentNoteId, selectedNote?.id);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: selectedNote?.excalidrawData,
      });
      setCurrentNoteId(selectedNote?.id);
    }
  }, [selectedNote]);

  const throttleSave = useMemo(
    () =>
      throttle(() => {
        console.log("throttle save");
        setFolderDetails({ ...folderDetails });
      }, 3000),
    []
  );

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
            selectedNote.excalidrawData = [...excalidrawData];
            throttleSave();
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
