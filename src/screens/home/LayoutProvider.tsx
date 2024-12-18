import { useStorage } from "@/src/storage/StorageContext";
import { createContext, useContext, useMemo, useState } from "react";

type LayoutContextType = {
	sidebarWidth: number;
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
	const { preferences } = useStorage()
	const [sidebarOpen, setSidebarOpen] = useState(preferences.sideBarOpenByDefault);
	const sidebarWidth = preferences.sideBarDefaultWidth;

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
