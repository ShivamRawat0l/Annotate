import { Settings2, GripVertical } from "lucide-react";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import type { ToolDetailType } from "../tools/ToolManagerDynamic";

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
	const theme = getTheme();

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
			<div
				style={{
					padding: 10,
					borderRadius: 5,
				}}
			>
				<Settings2 />
			</div>
		</div>
	);
};
