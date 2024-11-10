import Home from "./home/Home";
import { Toaster } from "@/components/ui/sonner";

import Explorer from "./components/Explorer";
import { ThemeProvider } from "@/components/theme-provider";
import { FolderProvider } from "../context/FolderProvider";
import { Colors } from "../constants/Colors";
import { AuthenticationProvider } from "../context/AuthenticationProvider";
import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { LayoutProvider, useLayout } from "../context/LayoutProvider";
import { useEffect } from "react";
import { SCREEN_WIDTH } from "../constants/Constants";

const App = () => {
  const { sidebarOpen } = useLayout();

  const motionValue = useMotionValue(200);
  const remainingWidth = useTransform(
    motionValue,
    (value) => SCREEN_WIDTH - value
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LayoutProvider>
        <FolderProvider>
          <AuthenticationProvider>
            <div style={{ display: "flex" }}>
              <motion.div style={{ width: motionValue }}>
                <Explorer />
              </motion.div>
              {sidebarOpen && (
                <motion.div
                  className="app-sidebar-resizer"
                  style={{
                    width: "4px",
                    backgroundColor: "black",
                    height: "100vh",
                  }}
                  whileHover={{ scaleX: 2, backgroundColor: "red" }}
                  onPan={(e, info) => {
                    motionValue.set(info.point.x);
                  }}
                />
              )}
              <Home sidebarWidth={remainingWidth} />
            </div>
          </AuthenticationProvider>
        </FolderProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
};

export default App;
