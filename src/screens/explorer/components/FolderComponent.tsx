import { useCallback, useMemo, useRef } from "react";
import { useExplorer } from "@/src/context/ExplorerProvider";
import { useFolder } from "@/src/context/FolderProvider";
import { ElementType, type FolderStructure } from "@/src/types/notes.type";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExplorerContextMenu } from "./ExplorerContextMenu";
import { globalStyles, type Style } from "@/src/constants/Styles";
import { ErrorBoundary } from "react-error-boundary";
import { ExplorerConstants } from "../constants/ExplorerConstants";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import { CollapseSubFolders } from "./CollapseSubFolders";
import { SubFolders } from "./SubFolders";
import { FolderOptions } from "./FolderOptions";
import { FolderIcons } from "./FolderIcons";

type FolderComponentProps = {
	folderId: string;
	padding: number;
	parentId: string[];
	subFolders: FolderStructure;
};

export const FolderComponent = ({
	folderId,
	padding,
	parentId,
	subFolders,
}: FolderComponentProps) => {
	const {
		toggleFolderExpand,
		setSelectedFolderPath,
		selectedFolderPath,
		folderDetails,
		moveFolder,
	} = useFolder();

	const { folderEditing, setFolderEditing } = useExplorer();
	const [hover, setHover] = useState(false);
	const theme = getTheme();

	const folderPath = useMemo(
		() => [...parentId, folderId],
		[parentId, folderId]
	);
	const ref = useRef<HTMLDivElement>(null);

	const dragHover = useMotionValue(0);

	const handleClick = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
			setFolderEditing("");
			document.removeEventListener("click", handleClick);
		}
	};

	const onDoubleClick = (e: any) => {
		setFolderEditing(folderId);
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
			folderDetails[folderId].title = (
				e.target as HTMLDivElement
			).innerText;
			document.removeEventListener("click", handleClick);
		}
	};

	const onDragOver = useCallback((e: any) => {
		e.preventDefault();
		e.stopPropagation();
		dragHover.set(1);
	}, []);

	const onDragLeave = useCallback((e: any) => {
		e.preventDefault();
		e.stopPropagation();
		dragHover.set(0);
	}, []);

	const onDragStart = (e: any) => {
		e.dataTransfer.setData(
			"application/json",
			JSON.stringify({
				id: folderPath,
			})
		);
	};

	const onDrop = (e: any) => {
		e.stopPropagation();
		e.preventDefault();
		moveFolder(
			JSON.parse(e.dataTransfer.getData("application/json")).id,
			folderPath
		);
		dragHover.set(0);
	};

	const renderTitle = () => {
		return (
			<div style={styles.folderTitle}>
				<div
					ref={ref}
					contentEditable={folderEditing === folderId}
					onDoubleClick={onDoubleClick}
					onKeyDown={onKeyDown}
					style={{
						...styles.folderTitleText,
						borderBottom:
							folderEditing === folderId ? "1px solid gray" : " ",
					}}
				>
					{folderDetails[folderId].title}
				</div>
			</div>
		);
	};

	return (
		<ErrorBoundary
			fallback={<p>Something went wrong in the Folder Component</p>}
		>
			{folderDetails[folderId] &&
				folderDetails[folderId].type === ElementType.FOLDER && (
					<motion.div
						style={{
							...styles.folderContainer,
							backgroundColor: useTransform(
								dragHover,
								[0, 1],
								["transparent", Colors[theme].dragAndDrop]
							),
						}}
						onDragOver={onDragOver}
						onDragLeave={onDragLeave}
						onDrop={onDrop}
					>
						<Collapsible
							open={folderDetails[folderId].isExpanded}
							onOpenChange={(open) => {
								toggleFolderExpand(folderId, open);
							}}
						>
							<ExplorerContextMenu>
								<motion.div
									draggable={
										selectedFolderPath?.join("") ==
										folderPath.join("")
									}
									onDragStart={onDragStart}
									onContextMenu={() =>
										setSelectedFolderPath(folderPath)
									}
									onClick={() =>
										setSelectedFolderPath(folderPath)
									}
									onMouseOver={() => {
										setHover(true);
									}}
									style={{
										backgroundColor:
											selectedFolderPath?.join("") ===
											folderPath.join("")
												? Colors[theme].selected
												: "transparent",
										paddingLeft: padding,
										...styles.folderBar,
									}}
									transition={{ duration: 0 }}
									onMouseOut={() => setHover(false)}
									whileHover={{
										backgroundColor: Colors[theme].hover,
									}}
								>
									<div style={styles.folderTitleContainer}>
										<CollapsibleTrigger>
											<FolderIcons folderId={folderId} />
										</CollapsibleTrigger>
										{renderTitle()}
									</div>
									<FolderOptions
										hover={hover}
										folderPath={folderPath}
										subFolders={subFolders}
									/>
								</motion.div>
							</ExplorerContextMenu>
							<CollapseSubFolders
								folderId={folderId}
								subFolders={subFolders}
								padding={padding}
								folderPath={folderPath}
							/>
							<SubFolders
								subFolders={subFolders}
								padding={padding}
								folderPath={folderPath}
							/>
						</Collapsible>
					</motion.div>
				)}
		</ErrorBoundary>
	);
};

const styles: Style = {
	folderTitleContainer: {
		...globalStyles.flexRow,
		paddingTop: ExplorerConstants.PADDING_TOP_FOLDER_BAR,
		paddingBottom: ExplorerConstants.PADDING_BOTTOM_FOLDER_BAR,
	},
	folderTitle: {
		flex: 1,
		display: "flex",
		marginLeft: 10,
		whiteSpace: "nowrap",
	},
	folderContainer: {
		minWidth: 240,
		marginTop: 2,
		marginBottom: 2,
		borderRadius: 8,
	},
	folderBar: {
		display: "flex",
		borderRadius: 4,
		flex: 1,
		flexDirection: "row",
	},
	folderTitleText: {
		outline: "none",
		fontFamily: ExplorerConstants.FONT_FAMILY,
		fontSize: ExplorerConstants.FONT_SIZE,
	},
};
