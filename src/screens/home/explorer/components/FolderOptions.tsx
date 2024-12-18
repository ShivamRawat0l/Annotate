import { globalStyles, type Style } from "@/src/constants/styles";
import { Folder } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { ExplorerConstants } from "../constants/ExplorerConstants";
import { Colors } from "@/src/theme/Colors";
import { useFolder } from "../../FolderProvider";
import { useTheme } from "@/src/theme/ThemeProvider";

type FolderOptionsProps = {
	hover: boolean;
	folderPath: string[];
	subFolders: Record<string, any>;
};

export const FolderOptions = ({
	hover,
	folderPath,
	subFolders,
}: FolderOptionsProps) => {
	const { createNewFolder, createNewNote } = useFolder();
	const { theme } = useTheme();

	return (
		<div
			style={{
				...globalStyles.flexRow,
				marginRight: ExplorerConstants.PADDING_RIGHT_SIDEBAR,
				justifyContent: "flex-end",
				alignItems: "center",
			}}
		>
			{hover ? (
				<>
					<Folder
						size={18}
						onClick={() => {
							createNewFolder(folderPath);
						}}
						style={{
							marginRight: 10,
						}}
					/>
					<NotebookPen
						size={18}
						onClick={() => createNewNote(folderPath)}
					/>
				</>
			) : (
				<div
					style={{
						backgroundColor: Colors[theme].secondary,
						...styles.badge,
					}}
				>
					{Object.keys(subFolders).length}
				</div>
			)}
		</div>
	);
};

const styles: Style = Object.freeze({
	badge: {
		borderRadius: 8,
		fontFamily: "Recursive",
		color: "white",
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
		fontSize: 10,
		lineHeight: "20px",
		alignSelf: "center",
		height: 20,
		width: 20,
	},
});
