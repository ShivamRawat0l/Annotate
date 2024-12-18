import { useRef } from "react";
import { motion, MotionValue } from "framer-motion";
import useScreen from "@/src/hooks/useScreen";
import { ToolBar } from "./ui/Toolbar";
import { useEventHandler } from "@/src/screens/home/draw_atoms/event_manager/useEventHandler";
import { useTheme } from "@/src/theme/ThemeProvider";

type DrawAtomProps = {
	sidebarWidth: MotionValue<number>;
};

export const DrawAtoms = ({ sidebarWidth }: DrawAtomProps) => {
	const { theme } = useTheme()
	const { SCREEN_HEIGHT } = useScreen();
	const dynamicRef = useRef<HTMLCanvasElement>(null);
	const staticRef = useRef<HTMLCanvasElement>(null);
	const { toolSelected, onToolSelect, tools } = useEventHandler(
		dynamicRef,
		staticRef
	);

	const renderStaticCanvas = () => {
		return (
			<canvas
				className="static-canvas"
				ref={staticRef}
				height={SCREEN_HEIGHT * 0.9}
				width={screen.width}
				style={{
					background: "transparent",
					position: "absolute",
					zIndex: 5,
				}}
			></canvas>
		);
	};

	const renderDynamicCanvas = () => {
		return (
			<canvas
				className="dynamic-canvas"
				ref={dynamicRef}
				height={SCREEN_HEIGHT * 0.9}
				width={screen.width}
				style={{
					background: "transparent",
					position: "absolute",
					zIndex: 10,
				}}
			></canvas>
		);
	};

	return (
		<motion.div
			style={{
				flex: 1,
				flexGrow: 1,
				height: SCREEN_HEIGHT * 0.9,
				width: sidebarWidth,
				cursor: toolSelected?.cursor,
			}}
		>
			<ToolBar
				tools={tools}
				toolSelected={toolSelected}
				onChangeToolSelected={onToolSelect}
			/>
			{renderStaticCanvas()}
			{renderDynamicCanvas()}
		</motion.div>
	);
};
