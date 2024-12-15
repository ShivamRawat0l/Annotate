import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useFolder } from "@/src/context/FolderProvider";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { motion, MotionValue } from "framer-motion";
import { Input } from "@/components/ui/input";
import { globalStyles } from "@/src/constants/Styles";
import { PinnedNotes } from "./components/PinnedNotes";
import { SidebarClose, SidebarIcon, Slash } from "lucide-react";
import React, { useMemo } from "react";
import { useLayout } from "@/src/context/LayoutProvider";
import { DrawAtoms } from "./draw_atoms/DrawAtoms";
import { ElementType } from "@/src/types/notes.type";
import type { NoteType } from "@/src/types/notes.type";
import { NOTES_SUFFIX } from "@/src/constants/Constants";
import { HomeHeader } from "./HomeHeader";

const Home = ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
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

	return (
		<motion.div
			style={{
				height: "100vh",
				width: sidebarWidth,
				backgroundColor: Colors[theme].background,
			}}
		>
			<motion.div
				style={{
					height: "4vh",
					...globalStyles.flexRow,
					justifyContent: "space-between",
					alignItems: "center",
					width: sidebarWidth,
					paddingLeft: 40,
					paddingRight: 40,
				}}
			>
				<HomeHeader />
			</motion.div>
			{selectedFolderPath.length > 0 ? (
				<DrawAtoms sidebarWidth={sidebarWidth} />
			) : (
				<></>
			)}
			<Toaster />
		</motion.div>
	);
};

const styles = {
	container: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		height: "100vh",
	},
	parents: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	folders: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	notes: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
} as const;

export default Home;
