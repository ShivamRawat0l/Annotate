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

const App = () => {
  const { sidebarOpen } = useLayout();

  const motionValue = useMotionValue(DEFAULT_SIDEBAR_WIDTH);
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
