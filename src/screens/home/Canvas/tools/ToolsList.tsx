import {
	Hand,
	MousePointer2,
	Type,
	RectangleHorizontal,
	Minus,
	Circle,
	Diamond,
	Cylinder,
	Box,
	Cone,
	Pentagon,
	Slash,
	ChartPie,
	ArrowLeftToLine,
	Pencil,
	Highlighter,
	TableProperties,
	Sword,
	Shapes,
	MoveRight,
	Eraser,
} from "lucide-react";
import { ToolsID, type ToolDetails } from "./Tools";

export const Tools: ToolDetails[] = [
	{
		id: ToolsID.grab,
		toolName: "grab",
		icon: <Hand />,
	},
	{
		id: ToolsID.cursor,
		toolName: "cursor",
		icon: <MousePointer2 />,
	},
	{
		id: ToolsID.text,
		toolName: "text",
		icon: <Type />,
	},
	{
		id: ToolsID.rectangle,
		toolName: "rectangle",
		icon: <RectangleHorizontal />,
	},
	{
		id: ToolsID.line,
		toolName: "line",
		icon: <Minus />,
	},
	{
		id: ToolsID.directionalLine,
		toolName: "directional line",
		icon: <MoveRight />,
	},
	{
		id: ToolsID.circle,
		toolName: "circle",
		icon: <Circle />,
	},
	{
		id: ToolsID.pencil,
		toolName: "pencil",
		icon: <Pencil />,
	},
	{
		id: ToolsID.highlighter,
		toolName: "highlighter",
		icon: <Highlighter />,
	},
	{
		id: ToolsID.lazer,
		toolName: "lazer",
		icon: <Sword />,
	},
	{
		id: ToolsID.shape,
		toolName: "shape",
		icon: <Shapes />,
		subTools: [
			{
				id: ToolsID.circle,
				toolName: "circle",
				icon: <Circle />,
			},
			{
				id: ToolsID.diamond,
				toolName: "diamond",
				icon: <Diamond />,
			},
			{
				id: ToolsID.cylinder,
				toolName: "cylinder",
				icon: <Cylinder />,
			},
			{
				id: ToolsID.box,
				toolName: "box",
				icon: <Box />,
			},
			{
				id: ToolsID.cone,
				toolName: "cone",
				icon: <Cone />,
			},
			{
				id: ToolsID.pentagon,
				toolName: "pentagon",
				icon: <Pentagon />,
			},
		],
	},
	{
		id: ToolsID.chart,
		toolName: "chart",
		icon: <ChartPie />,
	},
	{
		id: ToolsID.slash,
		toolName: "slash",
		icon: <Slash />,
	},
	{
		id: ToolsID.table,
		toolName: "table",
		icon: <TableProperties />,
	},
	{
		id: ToolsID.arrow,
		toolName: "arrow",
		icon: <ArrowLeftToLine />,
	},
	{
		id: ToolsID.segment,
		toolName: "segment",
		icon: <Minus rotate={90} />,
	},
	{
		id: ToolsID.eraser,
		toolName: "eraser",
		icon: <Eraser />,
	},
];
