import { createContext, useContext, useEffect, useState } from "react";
import {
  SCREEN_WIDTH,
  DEFAULT_SIDEBAR_STATUS,
  DEFAULT_SIDEBAR_WIDTH,
} from "../constants/Constants";
import { MotionValue, useMotionValue } from "framer-motion";

type LayoutContextType = {
  sidebarWidth: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
  sidebarOpen: true,
  setSidebarOpen: () => {},
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(DEFAULT_SIDEBAR_STATUS);
  const sidebarWidth = DEFAULT_SIDEBAR_WIDTH;

  return (
    <LayoutContext.Provider
      value={{ sidebarWidth, sidebarOpen, setSidebarOpen }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  return useContext(LayoutContext);
};
