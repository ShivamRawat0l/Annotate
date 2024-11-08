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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import Annote from "./Annote";
import type { Data, FolderType, NoteType } from "../../types/notes.type";
import { useFolder } from "@/src/context/FolderProvider";
import { Colors } from "@/src/context/Colors";
import { getTheme } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const Home = () => {
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
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: Colors[theme].background,
      }}
    >
      <SidebarTrigger />
      <div style={styles.container}>
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
        <Annote />
      </div>
      <Toaster />
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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
