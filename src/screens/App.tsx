import Home from "./home/Home";
import { getTheme, ThemeProvider } from "@/components/theme-provider";
import { FolderProvider } from "../context/FolderProvider";
import { AuthenticationProvider } from "../context/AuthenticationProvider";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { LayoutProvider, useLayout } from "../context/LayoutProvider";
import { DEFAULT_SIDEBAR_WIDTH, SCREEN_WIDTH } from "../constants/Constants";
import { ExplorerProvider } from "../context/ExplorerProvider";
import { Explorer } from "./explorer/Explorer";
import { LoginPopup } from "./popup/LoginPopup";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loading } from "./home/components/Loading";
import "@/src/utils/prototype";
import { Colors } from "../constants/Colors";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <LayoutProvider>
          <FolderProvider>
            <AuthenticationProvider>
              <ProviderWrapper />
            </AuthenticationProvider>
          </FolderProvider>
        </LayoutProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const ProviderWrapper = () => {
  const { sidebarOpen } = useLayout();
  const theme = getTheme();
  const motionValue = useMotionValue(DEFAULT_SIDEBAR_WIDTH);
  const remainingWidth = useTransform(
    motionValue,
    (value) => SCREEN_WIDTH - value - 4
  );

  useEffect(() => {
    if (sidebarOpen) {
      motionValue.set(DEFAULT_SIDEBAR_WIDTH);
    } else {
      motionValue.set(0);
    }
  }, [sidebarOpen]);

  return (
    <>
      <Loading />
      <div style={{ display: "flex", height: "100vh" }}>
        {sidebarOpen && (
          <>
            <LoginPopup />
            <motion.div style={{ width: motionValue }}>
              <ExplorerProvider>
                <Explorer />
              </ExplorerProvider>
            </motion.div>
            <motion.div
              className="app-sidebar-resizer"
              style={{
                width: 4,
                backgroundColor: "black",
                height: "100vh",
              }}
              whileHover={{ scaleX: 2, backgroundColor: Colors[theme].primary }}
              onPan={(e, info) => {
                motionValue.set(info.point.x);
              }}
            />
          </>
        )}
        <Home sidebarWidth={remainingWidth} />
      </div>
    </>
  );
};

export default App;
