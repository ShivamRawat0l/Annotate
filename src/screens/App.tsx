import Home from "./home/Home";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import Explorer from "../components/Explorer";
import { ThemeProvider } from "@/components/theme-provider";
import { FolderProvider } from "../context/FolderProvider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FolderProvider>
        <SidebarProvider>
          <Explorer />
          <main>
            <Home />
            <Toaster />
          </main>
        </SidebarProvider>
      </FolderProvider>
    </ThemeProvider>
  );
};

export default App;
