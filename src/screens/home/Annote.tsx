import { useFolder } from "@/src/context/FolderProvider";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { motion, MotionValue } from "framer-motion";
import { ElementType, type NoteType } from "@/src/types/notes.type";
import { NOTES_SUFFIX, SCREEN_HEIGHT } from "@/src/constants/Constants";
import {
	Circle,
	Diamond,
	Hand,
	Highlighter,
	Minus,
	MousePointer2,
	MoveRight,
	Pencil,
	RectangleHorizontal,
	SprayCan,
	Type,
} from "lucide-react";
import { validCharacters } from "./Canvas/Utils";
// @ts-ignore
import myWorkerUrl from "./Canvas/Canvas.worker?worker&url";
import { MessageType } from "./Canvas/Canvas.worker";

type AnnoteProps = {
	sidebarWidth: MotionValue<number>;
};

const Annote = ({ sidebarWidth }: AnnoteProps) => {
	const { selectedFolderPath, folderDetails } = useFolder();
	const theme = getTheme();

	const selectedNote: NoteType | undefined = useMemo(() => {
		let selectedNoteId = selectedFolderPath.last;
		if (
			selectedFolderPath &&
			selectedNoteId &&
			selectedNoteId.endsWith(NOTES_SUFFIX) &&
			folderDetails[selectedNoteId].type === ElementType.NOTE
		) {
			return folderDetails[selectedNoteId] as NoteType;
		}
		return undefined;
	}, [selectedFolderPath]);

	const ref = useRef<HTMLCanvasElement>(null);

	enum Tools {
		grab,
		cursor,
		text,
		rectangle,
		line,
		circle,
		pencil,
		highlighter,
		lazer,
	}

	const [toolSelected, setToolSelected] = useState<Tools>(Tools.cursor);
	const [isDrawingLine, setIsDrawingLine] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [isEngineRunning, setIsEngineRunning] = useState(false);
	const [worker, setWorker] = useState<Worker | undefined>();

	useEffect(() => {
		if (isEngineRunning) return;
		setIsEngineRunning(true);
		const offscreen = ref.current?.transferControlToOffscreen();
		if (!offscreen) return;
		console.log(
			ref.current?.width,
			ref.current?.height,
			ref.current?.offsetWidth,
			ref.current?.offsetHeight
		);
		offscreen.width = sidebarWidth.get();
		offscreen.height = SCREEN_HEIGHT * 0.9;
		const worker = new Worker(new URL(myWorkerUrl, import.meta.url), {
			type: "module",
		});
		setWorker(worker);
		worker.postMessage(
			{
				type: MessageType.draw,
				offscreen: offscreen,
			},
			[offscreen]
		);
	}, []);

	const detectKeyPress = (event: KeyboardEvent) => {
		if (isTyping) {
			if (event.key === "Enter") {
				setIsTyping(false);
				worker?.postMessage({
					type: MessageType.endText,
				});
			} else if (validCharacters.includes(event.key)) {
				worker?.postMessage({
					type: MessageType.continueText,
					value: event.key,
				});
			} else if (event.key == "Backspace") {
				worker?.postMessage({
					type: MessageType.continueText,
					value: "Backspace",
				});
			} else if (event.key === "Escape") {
				setIsTyping(false);
				worker?.postMessage({
					type: MessageType.endText,
				});
			}
		}
	};

	useEffect(() => {
		console.log("isTyping", isTyping);
		if (!isTyping) {
			document.removeEventListener("keydown", detectKeyPress);
		} else {
			document.addEventListener("keydown", detectKeyPress);
		}
		return () => {
			document.removeEventListener("keydown", detectKeyPress);
		};
	}, [isTyping]);

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
				}}
			>
				{toolSelected}
				<Hand onClick={() => setToolSelected(Tools.grab)} />
				<MousePointer2 onClick={() => setToolSelected(Tools.cursor)} />
				<Type onClick={() => setToolSelected(Tools.text)} />
				<RectangleHorizontal
					onClick={() => setToolSelected(Tools.rectangle)}
				/>
				<Minus onClick={() => setToolSelected(Tools.line)} />
				<MoveRight onClick={() => setToolSelected(Tools.line)} />
				<Circle onClick={() => setToolSelected(Tools.circle)} />
				<Diamond onClick={() => setToolSelected(Tools.circle)} />
				<Pencil onClick={() => setToolSelected(Tools.pencil)} />
				<Highlighter
					onClick={() => setToolSelected(Tools.highlighter)}
				/>
				<SprayCan onClick={() => setToolSelected(Tools.lazer)} />
			</div>
			<motion.canvas
				ref={ref}
				height={SCREEN_HEIGHT * 0.9}
				width={sidebarWidth.get()}
				style={{
					margin: 0,
					background: Colors[theme].background,
				}}
				onMouseMove={(event) => {
					let rect = ref.current?.getBoundingClientRect();
					if (!rect) return;
					let x = Math.floor(event.clientX - rect.left);
					let y = Math.floor(event.clientY - rect.top);
					if (toolSelected === Tools.line && isDrawingLine) {
						worker?.postMessage({
							type: MessageType.continueLine,
							points: { x, y },
						});
					}
				}}
				onMouseDown={(event) => {
					let rect = ref.current?.getBoundingClientRect();
					if (!rect) return;
					let x = Math.floor(event.clientX - rect.left);
					let y = Math.floor(event.clientY - rect.top);
					if (toolSelected === Tools.line) {
						worker?.postMessage({
							type: MessageType.startLine,
							points: { x, y },
						});
						setIsDrawingLine(true);
					} else if (toolSelected === Tools.text && !isTyping) {
						worker?.postMessage({
							type: MessageType.startText,
							points: { x, y },
						});
						setIsTyping(true);
					}
				}}
				onMouseUp={(event) => {
					let rect = ref.current?.getBoundingClientRect();
					if (!rect) return;
					let x = Math.floor(event.clientX - rect.left);
					let y = Math.floor(event.clientY - rect.top);
					if (toolSelected === Tools.line) {
						setIsDrawingLine(false);
						worker?.postMessage({
							type: MessageType.endLine,
							points: { x, y },
						});
					}
				}}
			>
				<div>Browser not supported</div>
			</motion.canvas>
		</motion.div>
	);
};

export default Annote;
