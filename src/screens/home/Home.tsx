import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import Annote from "./Annote";
import type { Data, FolderType, NoteType } from "../../types/notes.type";
import { useFolder } from "@/src/context/FolderProvider";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SCREEN_WIDTH } from "@/src/constants/Constants";
import { useLayout } from "@/src/context/LayoutProvider";
import { motion, MotionValue } from "framer-motion";
import { Input } from "@/components/ui/input";
import { globalStyles } from "@/src/constants/Styles";
import { Search } from "../search/Search";
import { PinnedNotes } from "./components/PinnedNotes";

const Home = ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
  const { selectedNote } = useFolder();
  const theme = getTheme();

  return (
    <motion.div
      style={{
        height: "100vh",
        width: sidebarWidth,
        backgroundColor: Colors[theme].background,
      }}
    >
      <div style={styles.container}>
        <motion.div
          style={{
            height: "4vh",
            ...globalStyles.flexRow,
            justifyContent: "space-between",
            alignItems: "center",
            width: sidebarWidth,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div
            style={{ ...globalStyles.flexRow, flex: 0, alignItems: "center" }}
          >
            <div style={{ whiteSpace: "nowrap", marginRight: 24 }}>
              <PinnedNotes />
            </div>
            <Input
              placeholder="Press CTRL + F to search"
              style={{ width: "260px" }}
            />
          </div>
        </motion.div>
        {selectedNote ? (
          <Annote sidebarWidth={sidebarWidth} />
        ) : (
          <Search sidebarWidth={sidebarWidth} />
        )}
      </div>
      <Toaster />
    </motion.div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    height: "100vh",
  },
  parents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  folders: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  notes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
} as const;

export default Home;
