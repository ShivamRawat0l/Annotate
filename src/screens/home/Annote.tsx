import { useFolder } from "@/src/context/FolderProvider";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { motion, MotionValue } from "framer-motion";
import { ElementType, type NoteType } from "@/src/types/notes.type";
import { NOTES_SUFFIX } from "@/src/constants/Constants";
import { throttle } from "@/src/utils/throttle";
import type { Theme } from "@excalidraw/excalidraw/types/element/types";

type AnnoteProps = {
	sidebarWidth: MotionValue<number>;
};

const Annote = ({ sidebarWidth }: AnnoteProps) => {
	const { selectedFolderPath, folderDetails, setFolderDetails } = useFolder();
	const theme = getTheme();

	const initialAppState = {
		viewBackgroundColor: Colors[theme].background,
		theme: "dark" as Theme,
		currentItemStrokeColor: "#eee",
	};

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

	const throttleSave = useMemo(
		() =>
			throttle(() => {
				setFolderDetails({ ...folderDetails });
			}, 3000),
		[]
	);

	const ref = useRef<HTMLCanvasElement>(null);
	const scaleRef = useRef(1);

	const zoomOut = () => {
		const ctx = getContext();
		if (!ctx) return;
		ctx.scale(0.95, 0.95);
		ctx.stroke();
	};

	const zoomIn = () => {
		const ctx = getContext();
		if (!ctx) return;
		ctx.scale(1.05, 1.05);
		ctx.stroke();
	};

	const getContext = () => {
		const canvas = ref.current;
		const context = canvas?.getContext("2d");
		return context;
	};

	useEffect(() => {
		const canvas = ref.current;
		const context = canvas?.getContext("2d");
		if (context) {
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(200, 100);
			context.lineWidth = 10;
			context.strokeStyle = "#fff";
			context.stroke();
		}
	}, []);

	if (!selectedNote) return <></>;
	return (
		<div>
			<motion.canvas
				ref={ref}
				style={{
					height: "96vh",
					width: sidebarWidth,
					background: "#000",
				}}
				onWheel={(e) => {
					if (e.deltaY > 0) {
						zoomOut();
					} else if (e.deltaY < 0) {
						zoomIn();
					}
				}}
			></motion.canvas>
		</div>
	);
};

export default Annote;
