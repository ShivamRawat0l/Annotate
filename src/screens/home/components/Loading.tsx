import { Progress } from "@/components/ui/progress";
import { Colors } from "@/src/theme/Colors";
import { useMemo, useState, type CSSProperties } from "react";
import type { Style } from "@/src/constants/styles";
import { useAuth } from "@/src/authentication/AuthenticationProvider";
import { useFolder } from "../FolderProvider";
import { useTheme } from "@/src/theme/ThemeProvider";

export const Loading = () => {
	const { theme } = useTheme();
	const { isLoading } = useAuth();
	const { isLoading: isLoadingFolder } = useFolder();

	const progress = useMemo(() => {
		return (isLoading ? 50 : 0) + (isLoadingFolder ? 50 : 0);
	}, [isLoading, isLoadingFolder]);

	const render = () => {
		return (
			<div
				style={{
					...styles.loading,
					background: Colors[theme].background,
				}}
			>
				<div style={styles.title}>Downloading your workspace</div>
				<Progress value={progress} style={{ width: "200px" }} />
				<p style={{ fontSize: "22px", color: Colors[theme].text }}>
					Made with ❤️ by{" "}
					<a
						href="https://github.com/ShivamRawat0l"
						target="_blank"
						style={{ textDecoration: "underline" }}
					>
						me
					</a>
				</p>
				<p style={{ fontSize: "18px", color: Colors[theme].text }}>
					Contribute to this project on{" "}
					<a
						href="https://github.com/ShivamRawat0l/Annotate"
						target="_blank"
						style={{
							fontSize: "18px",
							textDecoration: "underline",
							color: Colors[theme].text,
						}}
					>
						Open Source
					</a>
				</p>
			</div>
		);
	};

	return <>{(isLoading || isLoadingFolder) && render()}</>;
};

const styles: Style = {
	loading: {
		width: "100vw",
		height: "100vh",
		position: "absolute",
		top: 0,
		left: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		gap: 20,
		zIndex: 1000,
	},
	title: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		fontWeight: "bold",
		fontSize: "24px",
	},
};
