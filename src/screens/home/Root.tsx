import { getTheme, ThemeProvider } from "@/components/theme-provider";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/src/utils/prototype";
import { LayoutProvider, useLayout } from "@/src/context/LayoutProvider";
import { FolderProvider } from "@/src/context/FolderProvider";
import { AuthenticationProvider } from "@/src/context/AuthenticationProvider";
import useScreen from "@/src/hooks/useScreen";
import { DEFAULT_SIDEBAR_WIDTH } from "@/src/constants/Constants";
import { Loading } from "./components/Loading";
import { LoginPopup } from "./popup/LoginPopup";
import { ExplorerProvider } from "@/src/context/ExplorerProvider";
import { Explorer } from "./explorer/Explorer";
import { Colors } from "@/src/constants/Colors";
import Home from "./Home";
import type { Style } from "@/src/constants/Styles";

export const Root = () => {
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
	const { SCREEN_WIDTH } = useScreen();
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
							style={styles.sidebarResizer}
							whileHover={{
								scaleX: 2,
								backgroundColor: Colors[theme].primary,
							}}
							onPan={(_, info) => {
								if (
									info.point.x > SCREEN_WIDTH * 0.2 &&
									info.point.x < SCREEN_WIDTH * 0.9
								) {
									motionValue.set(info.point.x);
								}
							}}
						/>
					</>
				)}
				<Home sidebarWidth={remainingWidth} />
			</div>
		</>
	);
};

const styles: Style = Object.freeze({
	sidebarResizer: {
		width: 4,
		backgroundColor: "black",
		height: "100vh",
	},
});

