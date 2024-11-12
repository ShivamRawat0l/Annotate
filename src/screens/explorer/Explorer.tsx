import { uuidv7 } from "uuidv7";
import { useFolder } from "../../context/FolderProvider";
import { PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { getTheme, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ExploerHeader } from "./ExplorerHeader";
import { ExplorerFooter } from "./ExplorerFooter";
import { ExplorerFolders } from "./ExplorerFolder";
import { globalStyles } from "@/src/constants/Styles";
import { ExplorerProvider, useExplorer } from "@/src/context/ExplorerProvider";
import { Separator } from "@/components/ui/separator";
import "../css/Scrollbar.css";
export const Explorer = () => {
  const { data, selectedFolder, createNewFolder, createNewNote } = useFolder();
  const { folderEditing, setFolderEditing } = useExplorer();
  const theme = getTheme();

  useEffect(() => {
    addShortcutEvent();
    return () => {
      document.removeEventListener("keydown", shortcuts);
    };
  }, [selectedFolder]);

  const addShortcutEvent = () => {
    document.addEventListener("keydown", shortcuts);
  };

  const shortcuts = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key.toLowerCase() === "r" && e.shiftKey && selectedFolder) {
      setFolderEditing(selectedFolder.id);
    }
    if (e.key.toLowerCase() === "a" && e.shiftKey && selectedFolder) {
      createNewFolder(selectedFolder);
    }
    if (e.key.toLowerCase() === "n" && e.shiftKey && selectedFolder) {
      createNewNote(selectedFolder);
    }
  };

  return (
    <div
      style={{
        ...globalStyles.flexColumn,
        backgroundColor: Colors[theme].background,
        height: "100vh",
      }}
    >
      <ExploerHeader />
      <Separator />
      <div style={{ margin: 10, fontSize: 10, fontWeight: "thin" }}>Notes</div>
      <div
        style={{
          flex: 1,
          overflow: "scroll",
          minWidth: 240,
        }}
      >
        <ExplorerFolders folders={data} />
        <div
          style={{
            border: "2px dashed gray",
            borderRadius: 5,
            marginTop: 12,
            marginBottom: 20,
            marginLeft: 14,
            marginRight: 14,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            padding: 20,
          }}
          onClick={() => createNewFolder()}
        >
          <PlusSquare style={{ marginRight: 10 }} />
          Create folder
        </div>
      </div>
      <Separator />
      <ExplorerFooter />
    </div>
  );
};
