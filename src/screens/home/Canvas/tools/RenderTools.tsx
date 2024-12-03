import { Wrench } from "lucide-react";

import { GripVertical } from "lucide-react";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import { ToolDetails, type ToolsID } from "./ToolsDetails";
import { useTools } from "./useTools";
import { ToolsIcon } from "./ToolsIcon";

type RenderToolsProps = {
	onChangeToolSelected: (tool: ToolsID) => void;
	toolSelected: ToolsID;
};

export const RenderTools = ({
	onChangeToolSelected,
	toolSelected,
}: RenderToolsProps) => {
	const theme = getTheme();
	const { tools } = useTools();
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
				const toolDetails = ToolDetails[tool];
				return (
					<div
						key={toolDetails.name}
						onClick={() => {
							onChangeToolSelected(tool);
						}}
						style={{
							background:
								tool === toolSelected
									? Colors[theme].primary
									: "transparent",
							padding: 10,
							borderRadius: 5,
						}}
					>
						{ToolsIcon[tool]}
					</div>
				);
			})}
			<div
				style={{
					padding: 10,
					borderRadius: 5,
				}}
			>
				<Wrench />
			</div>
			<div
				style={{
					padding: 10,
					borderRadius: 5,
				}}
			>
				<GripVertical />
			</div>
		</div>
	);
};
