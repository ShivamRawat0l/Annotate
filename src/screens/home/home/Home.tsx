import { Colors } from "@/src/theme/colors";
import { Toaster } from "@/components/ui/sonner";
import { motion, MotionValue } from "framer-motion";
import { globalStyles } from "@/src/constants/styles";
import { useMemo } from "react";
import { DrawAtoms } from "../draw_atoms/DrawAtoms";
import { NOTES_SUFFIX } from "@/src/constants/constants";
import { HomeHeader } from "./HomeHeader";
import { useFolder } from "../FolderProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { ElementType, type NoteType } from "@/src/storage/storage.types";

const Home = ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
	const { selectedFolderPath, folderDetails } = useFolder();
	const { theme } = useTheme();

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
				...styles.container,
				width: sidebarWidth,
				backgroundColor: Colors[theme].background,
			}}
		>
			<motion.div
				style={{
					...styles.header,
					width: sidebarWidth
				}}
			>
				<HomeHeader />
			</motion.div>
			{
				selectedFolderPath.length > 0 ? (
					<DrawAtoms sidebarWidth={sidebarWidth} />
				) : (
					<></>
				)
			}
			<Toaster />
		</motion.div >
	);
};

const styles = Object.freeze({
	container: {
		height: "100vh",
	},
	header: {
		height: "4vh",
		...globalStyles.flexRow,
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 40,
		paddingRight: 40,
	},
})

export default Home;
