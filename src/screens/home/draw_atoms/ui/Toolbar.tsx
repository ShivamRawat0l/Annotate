import { Settings2, GripVertical } from "lucide-react";
import { Colors } from "@/src/theme/colors";
import type { ToolDetailType } from "../tools/ToolManagerDynamic";
import { Link } from "react-router";
import { useTheme } from "@/src/theme/ThemeProvider";

type RenderToolsProps = {
	tools: ToolDetailType[];
	toolSelected?: ToolDetailType;
	onChangeToolSelected: (tool: ToolDetailType) => void;
};

export const ToolBar = ({
	tools,
	toolSelected,
	onChangeToolSelected,
}: RenderToolsProps) => {

	const { theme } = useTheme()

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				position: "absolute",
				background: "#000",
				zIndex: 11,
			}}
		>
			{tools.map((tool) => {
				return (
					<div
						key={tool.name}
						onClick={() => {
							onChangeToolSelected(tool);
						}}
						style={{
							background:
								tool.id === toolSelected?.id
									? Colors[theme].primary
									: "transparent",
							padding: 10,
							borderRadius: 5,
						}}
					>
						{tool.icon}
					</div>
				);
			})}
			<Link
				to="/settings"
				style={{
					padding: 10,
					borderRadius: 5,
				}}
			>
				<Settings2 />
			</Link>
		</div >
	);
};
