import Home from "./home/Home";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Explorer from "../components/Explorer";
import { ThemeProvider } from "@/components/theme-provider";
import { FolderProvider } from "../context/FolderProvider";
import { Colors } from "../context/Colors";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FolderProvider>
        <SidebarProvider>
          <Explorer />
          <Home />
        </SidebarProvider>
      </FolderProvider>
    </ThemeProvider>
  );
};

export default App;
