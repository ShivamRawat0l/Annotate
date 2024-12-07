import { globalStyles, type Style } from "@/src/constants/Styles";
import { useExplorer } from "@/src/context/ExplorerProvider";
import { useFolder } from "@/src/context/FolderProvider";
import { ElementType } from "@/src/types/notes.type";
import { motion } from "framer-motion";
import {
	CircleSlash,
	Dot,
	Ellipsis,
	FileText,
	List,
	Minus,
	NotebookPen,
} from "lucide-react";
import { useMemo, useRef } from "react";
import { ExplorerConstants } from "../constants/ExplorerConstants";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";

type NoteBarProps = {
	noteId: string;
	padding: number;
	parentId: string[];
};

export const NoteBar = ({ noteId, padding, parentId }: NoteBarProps) => {
	const { folderDetails, selectedFolderPath, setSelectedFolderPath } =
		useFolder();
	const { folderEditing, setFolderEditing } = useExplorer();

	const theme = getTheme();

	const noteDetails = useMemo(() => folderDetails[noteId], [noteId]);
	const ref = useRef<HTMLDivElement>(null);

	const handleClick = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
			setFolderEditing("");
			document.removeEventListener("click", handleClick);
		}
	};

	const onDoubleClick = (e: any) => {
		setFolderEditing(noteId);
		document.addEventListener("click", handleClick);
		setTimeout(() => {
			const range = document.createRange();
			range.selectNodeContents(e.target as HTMLElement);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}, 0);
	};

	const onKeyDown = (e: any) => {
		if (e.key === "Enter") {
			setFolderEditing("");
			noteDetails.title = (e.target as HTMLDivElement).innerText;
			document.removeEventListener("click", handleClick);
		}
	};

	const render = () => {
		return (
			<motion.div
				key={noteId}
				whileHover={{ backgroundColor: Colors[theme].hover }}
				transition={{ duration: 0 }}
				draggable
				style={{
					...globalStyles.flexRow,
					alignItems: "center",
					paddingTop: ExplorerConstants.PADDING_TOP_FOLDER_BAR,
					paddingLeft: padding,
					paddingBottom: ExplorerConstants.PADDING_BOTTOM_FOLDER_BAR,
					borderRadius: 4,
					gap: 10,
					backgroundColor:
						selectedFolderPath?.join("-") ===
						[...parentId, noteId].join("-")
							? Colors[theme].selected
							: "transparent",
				}}
				onClick={() => {
					setSelectedFolderPath([...parentId, noteId]);
				}}
				onDragStart={(e: any) => {
					e.dataTransfer.setData(
						"application/json",
						JSON.stringify({
							id: [...parentId, noteId],
						})
					);
				}}
			>
				<Minus size={ExplorerConstants.ICON_SIZE - 6} />
				<FileText size={ExplorerConstants.ICON_SIZE} />
				<div
					ref={ref}
					contentEditable={folderEditing === noteId}
					onDoubleClick={onDoubleClick}
					onKeyDown={onKeyDown}
					style={{
						...styles.noteBar,
						borderBottom:
							folderEditing === noteId ? "1px solid gray" : " ",
					}}
				>
					{noteDetails.title}
				</div>
			</motion.div>
		);
	};

	return (
		<>{noteDetails && noteDetails.type === ElementType.NOTE && render()}</>
	);
};

const styles: Style = Object.freeze({
	noteBar: {
		outline: "none",
		fontFamily: ExplorerConstants.FONT_FAMILY,
		fontSize: ExplorerConstants.FONT_SIZE,
	},
});
