import Home from "./home/Home";
import { ThemeProvider } from "@/components/theme-provider";
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
const App = () => {
  const { sidebarOpen } = useLayout();

  const motionValue = useMotionValue(DEFAULT_SIDEBAR_WIDTH);
  const remainingWidth = useTransform(
    motionValue,
    (value) => SCREEN_WIDTH - value - 4
  );

  useEffect(() => {
    window.addEventListener("resize", function () {
      "use strict";
      window.location.reload();
    });
    return () => {
      window.removeEventListener("resize", function () {
        "use strict";
        window.location.reload();
      });
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <LayoutProvider>
          <FolderProvider>
            <AuthenticationProvider>
              <Loading />
              <div style={{ display: "flex" }}>
                <LoginPopup />
                <motion.div style={{ width: motionValue }}>
                  <ExplorerProvider>
                    <Explorer />
                  </ExplorerProvider>
                </motion.div>
                {sidebarOpen && (
                  <motion.div
                    className="app-sidebar-resizer"
                    style={{
                      width: 4,
                      backgroundColor: "black",
                      height: "100vh",
                    }}
                    whileHover={{ scaleX: 2, backgroundColor: "skyblue" }}
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
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
