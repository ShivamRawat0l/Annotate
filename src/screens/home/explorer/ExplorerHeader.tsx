import Logo from "@/assets/icon.png";
import { Colors } from "@/src/constants/Colors";
import { globalStyles, type Style } from "@/src/constants/Styles";
import { useTheme } from "@/src/theme/ThemeProvider";
import { motion } from "framer-motion";

export const ExploerHeader = () => {
	const { theme } = useTheme()
	return (
		<div
			style={{
				...styles.explorerHeader,
				backgroundColor: Colors[theme].background,
			}}
		>
			<div>
				<div style={styles.annotate}>Annotate</div>
				<motion.div
					style={styles.annotateDescription}
					whileHover={{ color: Colors[theme].primary }}
				>
					A note taking app for everyone
				</motion.div>
			</div>
			<img style={styles.logo} src={Logo} alt="Annotate" />
		</div>
	);
};

const styles: Style = Object.freeze({
	logo: {
		height: 68,
		width: 68,
	},
	annotate: {
		fontSize: 30,
		fontFamily: "Recursive",
		fontWeight: "900",
	},
	annotateDescription: {
		fontSize: 18,
		color: "gray",
		fontFamily: "Schoolbell",
		fontWeight: "300",
	},
	explorerHeader: {
		...globalStyles.flexRow,
		flexShrink: 0,
		flex: 0,
		marginLeft: 30,
		marginRight: 30,
		marginTop: 22,
		marginBottom: 22,
		justifyContent: "space-between",
		alignItems: "center",
	},
});
