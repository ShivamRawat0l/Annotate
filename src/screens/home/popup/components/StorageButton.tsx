import { HardDrive } from "lucide-react";
import "./GoogleButton.css";
import { memo, type CSSProperties } from "react";
import type { Style } from "@/src/constants/styles";

type StorageButtonType = {
	onClick: () => void;
	style?: CSSProperties
};

export const StorageButton = memo(({ onClick, style }: StorageButtonType) => {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				...style,
				...styles.storageButton
			}}
		>
			<HardDrive />
			<div style={{
				flex: 1
			}}>
				Use local storage
			</div>
		</button>
	);
});

const styles: Style = {
	storageButton: {
		flex: 1,
		flexDirection: "row",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		fontFamily: "Josefin",
		fontSize: 20,
		fontWeight: "bold",
		paddingTop: 12,
		paddingBottom: 12,
		paddingLeft: 16,
		paddingRight: 42,
	}
}
