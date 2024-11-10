import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import type { NoteType } from "../../types/notes.type";
import type { Data } from "../../types/notes.type";
import { useFolder } from "@/src/context/FolderProvider";
import { useEffect, useState, useRef } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { useLayout } from "@/src/context/LayoutProvider";
import { SCREEN_WIDTH } from "@/src/constants/Constants";
import { motion, MotionValue } from "framer-motion";

type Props = {};

const Annote = ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
  const { data, setData, selectedNote } = useFolder();
  const currentNote = useRef<string | undefined>(undefined);
  const theme = getTheme();
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const handleFileDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.json";
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: selectedNote?.excalidrawData,
      });
      currentNote.current = selectedNote?.id;
    }
  }, [selectedNote]);

  return (
    <div>
      {selectedNote && (
        <motion.div
          style={{
            height: "88vh",
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
            renderTopRightUI={() => (
              <div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(JSON.stringify(data))
                  }
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    handleFileDownload();
                  }}
                >
                  Export Temp
                </button>
                <button onClick={() => setData(data)}>Save</button>
              </div>
            )}
            initialData={{
              elements: selectedNote.excalidrawData,
              appState: {
                viewBackgroundColor: Colors[theme].background,
                theme: "dark",
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
                <p> ToolBar Hints </p>
              </WelcomeScreen.Hints.ToolbarHint>
              <WelcomeScreen.Hints.HelpHint />
            </WelcomeScreen>
          </Excalidraw>
        </motion.div>
      )}
    </div>
  );
};

export default Annote;
