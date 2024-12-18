import { ChevronRight, FolderOpen, Folders } from "lucide-react";

import { Folder } from "lucide-react";
import { ExplorerConstants } from "../constants/ExplorerConstants";
import { motion } from "framer-motion";
import type { Style } from "@/src/constants/styles";
import { useFolder } from "../../FolderProvider";
import { ElementType } from "@/src/storage/storage.types";

type FolderIconsProps = {
	folderId: string;
};

const MotionChevronRight = motion(ChevronRight);

export const FolderIcons = ({ folderId }: FolderIconsProps) => {
	const { folderDetails } = useFolder();

	if (folderDetails[folderId].type === ElementType.NOTE) return null;

	return (
		<div style={styles.folderIcon}>
			<MotionChevronRight
				style={{
					marginRight: 8,
				}}
				size={18}
				animate={{
					rotate: folderDetails[folderId].isExpanded ? 90 : 0,
				}}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
			/>
			{folderDetails.isExpanded ? (
				<FolderOpen size={ExplorerConstants.ICON_SIZE} />
			) : folderDetails[folderId].count == 0 ? (
				<Folder size={ExplorerConstants.ICON_SIZE} />
			) : (
				<Folders size={ExplorerConstants.ICON_SIZE} />
			)}
		</div>
	);
};

const styles: Style = Object.freeze({
	folderIcon: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
});
