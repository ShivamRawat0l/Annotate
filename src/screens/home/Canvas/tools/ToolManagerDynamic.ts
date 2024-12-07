import type { CSSProperties } from "react";
import { GrabToolDynamic } from "./Grab/GrabTool";
import type {
	DynamicHandlerBaseClass,
	ToolDynamicBaseClass,
	ToolEventPermissions,
} from "./ToolManager.abstract";
import { LineToolDynamic } from "./Lines/LineTool";

export type ToolDetailType = {
	icon: React.ReactNode;
	name: string;
	description: string;
	id: string;
	staticPermissions: ToolEventPermissions[];
	dynamicPermissions: ToolEventPermissions[];
	cursor: CSSProperties["cursor"];
};

class ToolManager {
	private tools: ToolDynamicBaseClass[] = [];
	selectedTool: ToolDetailType | undefined;

	constructor() {
		// REGISTER TOOLS HERE.
		this.registerTool(new GrabToolDynamic());
		this.registerTool(new LineToolDynamic());
	}

	selectTool(tool: ToolDetailType) {
		this.selectedTool = tool;
	}

	fetchTool(id: string): ToolDynamicBaseClass | undefined {
		return this.tools.find((tool) => tool.id === id);
	}

	fetchToolDynamicHandler: () => DynamicHandlerBaseClass | undefined = () => {
		return this.tools.find((tool) => tool.id === this.selectedTool?.id)
			?.dynamicHandler;
	};

	private registerTool(tool: ToolDynamicBaseClass) {
		this.tools.push(tool);
	}

	public fetchRegisteredTools(): ToolDetailType[] {
		return this.tools.map((tool) => {
			return {
				icon: tool.icon,
				name: tool.name,
				description: tool.description,
				id: tool.id,
				staticPermissions: tool.staticPermissions,
				dynamicPermissions: tool.dynamicPermissions,
				cursor: tool.cursor,
			};
		});
	}
}

export const toolManager = new ToolManager();
