import { createContext, useContext, useMemo, useState } from "react";
import {
  DEFAULT_SIDEBAR_STATUS,
  DEFAULT_SIDEBAR_WIDTH,
} from "../constants/Constants";

type LayoutContextType = {
  sidebarWidth: number;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(DEFAULT_SIDEBAR_STATUS);
  const sidebarWidth = DEFAULT_SIDEBAR_WIDTH;

  const contextValue = useMemo(
    () => ({ sidebarWidth, sidebarOpen, setSidebarOpen }),
    [sidebarWidth, sidebarOpen]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
