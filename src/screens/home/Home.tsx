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

const Home = ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
  const { data, setData } = useFolder();
  const theme = getTheme();
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData(data);
    saveConfig();
  }, [data]);

  const saveConfig = () => {
    localStorage.setItem("config", JSON.stringify({}));
  };

  const saveData = (data: Data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  const loadConfig = (initialData: Data) => {
    const config = localStorage.getItem("config");
  };

  const loadData = () => {
    const data = localStorage.getItem("data");
    if (data) {
      const fetchedData = JSON.parse(data);
      setData(fetchedData);
      loadConfig(fetchedData);
    }
  };

  return (
    <motion.div
      style={{
        height: "100vh",
        width: sidebarWidth,
        backgroundColor: Colors[theme].background,
      }}
    >
      <div style={styles.container}>
        <div style={{ height: "10vh" }}>
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
        <Annote sidebarWidth={sidebarWidth} />
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
