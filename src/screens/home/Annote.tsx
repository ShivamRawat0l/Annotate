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
import type { Theme } from "@excalidraw/excalidraw/types/element/types";

type AnnoteProps = {
  sidebarWidth: MotionValue<number>;
};

const Annote = ({ sidebarWidth }: AnnoteProps) => {
  const { selectedFolderPath, folderDetails, setFolderDetails } = useFolder();
  const [currentNoteId, setCurrentNoteId] = useState<string>("");
  const theme = getTheme();

  const initialAppState = {
    viewBackgroundColor: Colors[theme].background,
    theme: "dark" as Theme,
    currentItemStrokeColor: "#eee",
  };

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
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: selectedNote?.excalidrawData,
        appState: initialAppState,
      });
      setCurrentNoteId(selectedNote?.id || "");
    }
  }, [selectedNote]);

  const throttleSave = useMemo(
    () =>
      throttle(() => {
        setFolderDetails({ ...folderDetails });
      }, 3000),
    []
  );

  if (!selectedNote) return <></>;

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
              clearCanvas: false,
            },
            tools: {
              image: false,
            },
          }}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          renderTopRightUI={() => <div></div>}
          initialData={{
            elements: selectedNote.excalidrawData,
            appState: initialAppState,
          }}
          onChange={(excalidrawData) => {
            if (selectedNote?.id === currentNoteId) {
              selectedNote.excalidrawData = [...excalidrawData];
              throttleSave();
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
