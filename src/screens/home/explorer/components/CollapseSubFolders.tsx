import { Colors } from "@/src/theme/Colors";
import type { Style } from "@/src/constants/styles";
import { ElementType, type FolderStructure } from "@/src/types/notes.type";
import { useFolder } from "../../FolderProvider";
import { useTheme } from "@/src/theme/ThemeProvider";

type CollapseSubFoldersType = {
	folderId: string;
	subFolders: FolderStructure;
	padding: number;
	folderPath: string[];
};

export const CollapseSubFolders = ({
	folderId,
	subFolders,
	padding,
	folderPath,
}: CollapseSubFoldersType) => {
	const { folderDetails, collapseSubFolders, selectedFolderPath } =
		useFolder();

	const { theme } = useTheme()

	if (folderDetails[folderId].type === ElementType.NOTE) return null;
	const hasExpandedSubFolders = Object.keys(subFolders).find(
		(subFolderId) => {
			const subFolderDetails = folderDetails[subFolderId];
			if (
				subFolderDetails == undefined ||
				subFolderDetails.type === ElementType.NOTE
			)
				return false;
			return subFolderDetails.isExpanded;
		}
	);

	return (
		<>
			{folderDetails[folderId].count > 0 &&
				folderDetails[folderId].isExpanded &&
				hasExpandedSubFolders &&
				selectedFolderPath?.join("") === folderPath.join("") && (
					<div
						className="cursor-pointer"
						style={{
							...styles.collapseButton,
							paddingLeft: padding + 20,
							backgroundColor: Colors[theme].collpaseButton,
						}}
						onClick={() => {
							collapseSubFolders(folderPath);
						}}
					>
						Collapse subfolders
					</div>
				)}
		</>
	);
};

const styles: Style = Object.freeze({
	collapseButton: {
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		paddingTop: 2,
		paddingBottom: 2,
		fontSize: 10,
	},
});
