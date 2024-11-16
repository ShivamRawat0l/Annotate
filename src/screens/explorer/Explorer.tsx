import { uuidv7 } from "uuidv7";
import { useFolder } from "../../context/FolderProvider";
import { Plus, PlusSquare } from "lucide-react";
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
import { useAuth } from "@/src/context/AuthenticationProvider";
export const Explorer = () => {
  const {
    data,
    selectedFolder,
    createNewFolder,
    createNewNote,
    toggleFolderExpand,
  } = useFolder();
  const { user } = useAuth();
  const { folderEditing, setFolderEditing, syncNotesOnline } = useExplorer();
  const theme = getTheme();

  useEffect(() => {
    document.addEventListener("keydown", authShortcuts);
    return () => {
      document.removeEventListener("keydown", authShortcuts);
    };
  }, [user, data]);

  useEffect(() => {
    document.addEventListener("keydown", shortcuts);
    return () => {
      document.removeEventListener("keydown", shortcuts);
    };
  }, [selectedFolder]);

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
    if (e.key.toLowerCase() === "t" && e.shiftKey && selectedFolder) {
      toggleFolderExpand(selectedFolder, !selectedFolder.isExpanded);
    }
    if (e.key.toLowerCase() === "d" && e.shiftKey && selectedFolder) {
      // deleteFolder(selectedFolder);
    }
  };

  const authShortcuts = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "s" && e.ctrlKey) {
      syncNotesOnline();
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
      <div
        style={{
          ...globalStyles.flexRow,
          flex: 0,
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 12,
          marginRight: 12,
        }}
      >
        <div style={{ margin: 10, fontSize: 10, fontWeight: "thin" }}>
          Notes
        </div>
        <PlusSquare size={16} onClick={() => createNewFolder()} />
      </div>
      <div
        style={{
          flex: 1,
          overflow: "scroll",
          minWidth: 240,
        }}
      >
        <ExplorerFolders folders={data} />
        {data.length === 0 && (
          <div
            style={{
              border: "2px dashed gray",
              borderRadius: 5,
              marginTop: 50,
              marginBottom: 20,
              marginLeft: 14,
              marginRight: 14,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              flex: 1,
              padding: 20,
            }}
            onClick={() => createNewFolder()}
          >
            <PlusSquare style={{ marginRight: 10 }} />
            Create folder
          </div>
        )}
      </div>
      <Separator />
      <ExplorerFooter />
    </div>
  );
};
