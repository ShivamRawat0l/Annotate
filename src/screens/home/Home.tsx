import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Annote from "./Annote";
import { useFolder } from "@/src/context/FolderProvider";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { motion, MotionValue } from "framer-motion";
import { Input } from "@/components/ui/input";
import { globalStyles } from "@/src/constants/Styles";
import { Search } from "../search/Search";
import { PinnedNotes } from "./components/PinnedNotes";
import { Slash } from "lucide-react";
import React from "react";

const Home = ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
  const { selectedFolderPath, folderDetails } = useFolder();
  const theme = getTheme();

  return (
    <motion.div
      style={{
        height: "100vh",
        width: sidebarWidth,
        backgroundColor: Colors[theme].background,
      }}
    >
      <motion.div
        style={{
          height: "4vh",
          ...globalStyles.flexRow,
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: sidebarWidth,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              {selectedFolderPath.map((folderId) => (
                <React.Fragment key={folderId}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      {folderDetails[folderId].title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {false && (
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
        )}
      </motion.div>
      {selectedFolderPath.length > 0 ? (
        <Annote sidebarWidth={sidebarWidth} />
      ) : (
        <Search sidebarWidth={sidebarWidth} />
      )}
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
