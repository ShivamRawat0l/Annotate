import { useFolder } from "../../context/FolderProvider";
import { PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { getTheme, useTheme } from "@/components/theme-provider";
import { ExploerHeader } from "./ExplorerHeader";
import { ExplorerFooter } from "./ExplorerFooter";
import { ExplorerFolders } from "./components/ExplorerFolder";
import { globalStyles, type Style } from "@/src/constants/Styles";
import { useExplorer } from "@/src/context/ExplorerProvider";
import { Separator } from "@/components/ui/separator";
import "../css/Scrollbar.css";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { ExplorerConstants } from "./constants/ExplorerConstants";

export const Explorer = () => {
	const {
		folderStructure,
		selectedFolderPath,
		createNewFolder,
		createNewNote,
		toggleFolderExpand,
		deleteFolder,
	} = useFolder();
	const { user } = useAuth();
	const { folderEditing, setFolderEditing, syncNotesOnline } = useExplorer();

	const theme = getTheme();

	useEffect(() => {
		document.addEventListener("keydown", authShortcuts);
		return () => {
			document.removeEventListener("keydown", authShortcuts);
		};
	}, [user, folderStructure]);

	useEffect(() => {
		if (folderEditing) return;
		document.addEventListener("keydown", shortcuts);
		return () => {
			document.removeEventListener("keydown", shortcuts);
		};
	}, [selectedFolderPath, folderEditing]);

	const shortcuts = (e: KeyboardEvent) => {
		if (e.repeat) return;
		if (e.key.toLowerCase() === "r" && e.shiftKey && selectedFolderPath) {
			setFolderEditing(selectedFolderPath.last ?? "");
		}
		if (e.key.toLowerCase() === "a" && e.shiftKey && selectedFolderPath) {
			createNewFolder(selectedFolderPath);
		}
		if (e.key.toLowerCase() === "n" && e.shiftKey && selectedFolderPath) {
			createNewNote(selectedFolderPath);
		}
		if (e.key.toLowerCase() === "t" && e.shiftKey && selectedFolderPath) {
			toggleFolderExpand(selectedFolderPath.last);
		}
		if (e.key.toLowerCase() === "d" && e.shiftKey && selectedFolderPath) {
			deleteFolder(selectedFolderPath);
		}
	};

	const authShortcuts = (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === "s" && e.ctrlKey) {
			syncNotesOnline();
		}
	};

	const renderNotesTitle = () => {
		return (
			<div style={styles.notesTitle}>
				<div style={styles.explorerTitle}>Explorer</div>
				<PlusSquare size={16} onClick={() => createNewFolder([])} />
			</div>
		);
	};

	return (
		<div
			style={{
				...globalStyles.flexColumn,
				backgroundColor: Colors[theme].background,
				height: "100vh",
			}}
		>
			<ExploerHeader />
			<Separator />
			{renderNotesTitle()}
			<div style={styles.folderContainer}>
				<ExplorerFolders folders={folderStructure} />
				{Object.keys(folderStructure).length === 0 && (
					<div
						style={styles.createNewFolder}
						onClick={() => createNewFolder([])}
					>
						<PlusSquare style={{ marginRight: 10 }} />
						Create folder
					</div>
				)}
			</div>
			<Separator />
			<ExplorerFooter />
		</div>
	);
};

const styles: Style = Object.freeze({
	notesTitle: {
		...globalStyles.flexRow,
		flex: 0,
		alignItems: "center",
		justifyContent: "space-between",
		marginLeft: ExplorerConstants.PADDING_LEFT_SIDEBAR,
		marginRight: ExplorerConstants.PADDING_RIGHT_SIDEBAR,
	},
	createNewFolder: {
		fontFamily: "Mononoki",
		border: "2px dashed gray",
		borderRadius: 8,
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		flex: 1,
		paddingTop: 20,
		paddingBottom: 20,
		marginLeft: ExplorerConstants.PADDING_LEFT_SIDEBAR,
		marginRight: ExplorerConstants.PADDING_RIGHT_SIDEBAR,
	},
	folderContainer: {
		flex: 1,
		overflow: "scroll",
		minWidth: 240,
	},
	explorerTitle: {
		paddingTop: 10,
		paddingBottom: 20,
		fontSize: 14,
		fontWeight: 400,
		fontFamily: "Josefin",
	},
});
