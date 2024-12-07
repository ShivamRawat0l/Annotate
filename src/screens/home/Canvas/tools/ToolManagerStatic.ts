import type {
	StaticHandlerBaseClass,
	ToolStaticBaseClass,
} from "./ToolManager.abstract";
import { GrabToolStatic } from "./Grab/GrabTool";
import { LineToolStatic } from "./Lines/LineTool";

export class ToolManagerStatic {
	private tools: ToolStaticBaseClass[] = [];

	constructor() {
		// REGISTER TOOLS HERE.
		this.registerTool(new GrabToolStatic());
		this.registerTool(new LineToolStatic());
	}

	fetchAllStaticHandlers = (): StaticHandlerBaseClass[] => {
		return this.tools.map((tool) => tool.staticHandler);
	};

	fetchStaticHandler = (id: string): StaticHandlerBaseClass | undefined => {
		return this.tools.find((tool) => tool.id === id)?.staticHandler;
	};

	private registerTool(tool: ToolStaticBaseClass) {
		this.tools.push(tool);
	}
}

export const toolManagerStatic = new ToolManagerStatic();
