import {
	useEffect,
	useState,
	useRef,
	type CSSProperties,
	useCallback,
} from "react";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { motion, MotionValue } from "framer-motion";
// @ts-ignore
import myWorkerUrl from "./dynamiccanvas/DynamicCanvas.worker.ts?worker&url";
import { ToolDetails, ToolEvents, ToolsID } from "./tools/ToolsDetails";
import {
	DrawEvents,
	EventState,
	type EventData,
	type Point,
} from "./dynamiccanvas/Events.type";
import { RenderTools } from "./tools/RenderTools";
import useScreen from "@/src/hooks/useScreen";
import { StaticCanvasHandler } from "./dynamiccanvas/StaticCanvasHandler";
import { validCharacters } from "./dynamiccanvas/Tools/Texts/Text/Utils";

type DrawAtomProps = {
	sidebarWidth: MotionValue<number>;
};

export const DrawAtom = ({ sidebarWidth }: DrawAtomProps) => {
	const theme = getTheme();
	const { SCREEN_HEIGHT } = useScreen();
	const ref = useRef<HTMLCanvasElement>(null);
	const mainRef = useRef<HTMLCanvasElement>(null);

	const [toolSelected, setToolSelected] = useState<ToolsID>(ToolsID.cursor);
	const [toolEvent, setToolEvent] = useState<ToolEvents | null>(null);
	const [worker, setWorker] = useState<Worker | undefined>();
	const [isEngineRunning, setIsEngineRunning] = useState(false);
	const [staticCanvas, setCanvas] = useState<
		StaticCanvasHandler | undefined
	>();

	useEffect(() => {
		if (isEngineRunning) return;
		setIsEngineRunning(true);
		const context = mainRef.current?.getContext("2d");
		if (!context) return;
		const canvas = new StaticCanvasHandler(context);
		setCanvas(canvas);
		const offscreen = ref.current?.transferControlToOffscreen();
		if (!offscreen) return;
		const worker = new Worker(new URL(myWorkerUrl, import.meta.url), {
			type: "module",
		});
		setWorker(worker);
		worker.postMessage(
			{
				type: DrawEvents.draw,
				offscreen: offscreen,
			},
			[offscreen]
		);
		worker.onmessage = (event) => {
			switch (event.data.type) {
				case ToolsID.line:
					canvas.addLine(event.data.element);
					break;
				case ToolsID.text:
					canvas.addText(event.data.element);
					break;
			}
		};
	}, []);

	function postMessage(event: EventData) {
		worker?.postMessage(event);
	}

	const detectKeyPress = (event: KeyboardEvent) => {
		console.log(toolEvent);
		if (event.key === "Enter" || event.key === "Escape") {
			endSelectedToolFunction();
		} else if (
			(validCharacters.includes(event.key) ||
				event.key === "Backspace") &&
			toolEvent === ToolEvents.text
		) {
			postMessage({
				type: ToolsID.text,
				value: event.key,
				state: EventState.continuing,
			});
		}
	};

	const endSelectedToolFunction = () => {
		setToolEvent(null);
		postMessage({
			type: toolSelected,
			state: EventState.ending,
		});
	};

	const startSelectedToolFunction = (points: Point) => {
		setToolEvent(ToolDetails[toolSelected].event);
		postMessage({
			type: toolSelected,
			points: points,
			state: EventState.starting,
		});
	};

	useEffect(() => {
		document.addEventListener("keydown", detectKeyPress);
		return () => {
			document.removeEventListener("keydown", detectKeyPress);
		};
	}, [toolEvent]);

	const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (toolEvent === ToolEvents.select) {
			if (toolSelected === ToolsID.grab) {
				staticCanvas?.panCanvas(event.movementX, event.movementY);
				return;
			}
		}
		if (toolEvent === ToolEvents.line) {
			let rect = ref.current?.getBoundingClientRect();
			if (!rect) return;
			let x = Math.floor(event.clientX - rect.left);
			let y = Math.floor(event.clientY - rect.top);
			postMessage({
				type: toolSelected,
				points: {
					x: x,
					y: y,
				},
				state: EventState.continuing,
			});
		}
	};

	const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (toolEvent !== null) return;
		let rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		let x = Math.floor(event.clientX - rect.left);
		let y = Math.floor(event.clientY - rect.top);
		startSelectedToolFunction({ x, y });
	};

	const onMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (toolEvent === ToolEvents.line || toolEvent === ToolEvents.select) {
			endSelectedToolFunction();
		}
	};

	const renderStaticCanvas = () => {
		return (
			<canvas
				ref={mainRef}
				height={SCREEN_HEIGHT * 0.9}
				width={screen.width}
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
				width={screen.width}
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

	const getCursor = useCallback((): CSSProperties["cursor"] => {
		if (toolSelected === ToolsID.grab) return "grab";
		else if (toolSelected === ToolsID.cursor) return "default";
		else if (toolSelected === ToolsID.text) return "text";
		else return "crosshair";
	}, [toolSelected]);

	return (
		<motion.div
			style={{
				flex: 1,
				flexGrow: 1,
				height: SCREEN_HEIGHT * 0.9,
				width: sidebarWidth,
				cursor: getCursor(),
			}}
		>
			<RenderTools
				onChangeToolSelected={(tool) => {
					endSelectedToolFunction();
					setToolSelected(tool);
				}}
				toolSelected={toolSelected}
			/>
			{renderStaticCanvas()}
			{renderDynamicCanvas()}
		</motion.div>
	);
};
