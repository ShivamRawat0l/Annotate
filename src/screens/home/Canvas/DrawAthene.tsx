import { useEffect, useState, useRef } from "react";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { motion, MotionValue } from "framer-motion";
import { SCREEN_HEIGHT } from "@/src/constants/Constants";
import { validCharacters } from "./helper/Utils";
// @ts-ignore
import myWorkerUrl from "./dynamiccanvas/DynamicCanvas.worker.ts?worker&url";
import { GetTypePermissions, ToolPermissions, ToolsID } from "./tools/Tools";
import { Tools } from "./tools/ToolsList";
import { Canvas } from "./dynamiccanvas/DynamicCanvasHandler";
import { EventState, type EventData } from "./dynamiccanvas/Events";

type DrawAtheneProps = {
	sidebarWidth: MotionValue<number>;
};

export const DrawAthene = ({ sidebarWidth }: DrawAtheneProps) => {
	const theme = getTheme();

	const ref = useRef<HTMLCanvasElement>(null);
	const mainRef = useRef<HTMLCanvasElement>(null);

	const [toolSelected, setToolSelected] = useState<ToolsID>(ToolsID.cursor);
	const [startedToolPermission, setStartedToolPermission] =
		useState<ToolPermissions | null>(null);
	const [worker, setWorker] = useState<Worker | undefined>();

	useEffect(() => {
		const offscreen = ref.current?.transferControlToOffscreen();
		if (!offscreen) return;
		offscreen.height = SCREEN_HEIGHT * 0.9;
		offscreen.width = sidebarWidth.get();
		const worker = new Worker(new URL(myWorkerUrl, import.meta.url), {
			type: "module",
		});
		setWorker(worker);
		worker.postMessage(
			{
				type: "draw",
				offscreen: offscreen,
			},
			[offscreen]
		);
		worker.onmessage = (event) => {
			switch (event.data.type) {
				case ToolsID.line:
					console.log(event.data.element);
					break;
			}
		};
	}, []);

	function postMessage(event: EventData) {
		worker?.postMessage(event);
	}

	const detectKeyPress = (event: KeyboardEvent) => {
		if (event.key === "Enter" || event.key === "Escape") {
			setStartedToolPermission(null);
			postMessage({
				type: toolSelected,
				state: EventState.ending,
			});
		} else if (
			validCharacters.includes(event.key) ||
			event.key === "Backspace"
		) {
			postMessage({
				type: toolSelected,
				value: event.key,
				state: EventState.continuing,
			});
		}
	};

	useEffect(() => {
		if (startedToolPermission?.onkeydown) {
			document.addEventListener("keydown", detectKeyPress);
		} else {
			document.removeEventListener("keydown", detectKeyPress);
		}
		return () => {
			document.removeEventListener("keydown", detectKeyPress);
		};
	}, [startedToolPermission]);

	const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!startedToolPermission?.onmousemove) return;
		let rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		let x = Math.floor(event.clientX - rect.left);
		let y = Math.floor(event.clientY - rect.top);
		postMessage({
			type: toolSelected,
			points: { x, y },
			state: EventState.continuing,
		});
	};

	const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
		let rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		let x = Math.floor(event.clientX - rect.left);
		let y = Math.floor(event.clientY - rect.top);
		setStartedToolPermission(GetTypePermissions(toolSelected));
		postMessage({
			type: toolSelected,
			points: { x, y },
			state: EventState.starting,
		});
	};

	const onMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!startedToolPermission?.onmouseup) return;
		let rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		let x = Math.floor(event.clientX - rect.left);
		let y = Math.floor(event.clientY - rect.top);
		setStartedToolPermission(null);
		postMessage({
			type: toolSelected,
			points: { x, y },
			state: EventState.ending,
		});
	};

	const renderStaticCanvas = () => {
		return (
			<canvas
				ref={mainRef}
				height={SCREEN_HEIGHT * 0.9}
				width={sidebarWidth.get()}
				style={{
					background: "transparent",
					position: "absolute",
					zIndex: 10,
				}}
				onMouseMove={onMouseMove}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
			>
				<div>Browser not supported</div>
			</canvas>
		);
	};

	const renderDynamicCanvas = () => {
		return (
			<canvas
				ref={ref}
				height={SCREEN_HEIGHT * 0.9}
				width={sidebarWidth.get()}
				style={{
					background: Colors[theme].background,
					position: "absolute",
					zIndex: 9,
				}}
			>
				<div>Browser not supported</div>
			</canvas>
		);
	};

	return (
		<motion.div
			style={{
				flex: 1,
				flexGrow: 1,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					position: "absolute",
					background: "#000",
					zIndex: 11,
				}}
			>
				{toolSelected}
				{Tools.map((tool) => {
					return (
						<div
							key={tool.toolName}
							onClick={() => {
								setToolSelected(tool.id);
							}}
						>
							{tool.icon}
						</div>
					);
				})}
			</div>
			<motion.div
				style={{
					height: SCREEN_HEIGHT * 0.9,
					width: sidebarWidth,
				}}
			>
				{renderStaticCanvas()}
				{renderDynamicCanvas()}
			</motion.div>
		</motion.div>
	);
};
