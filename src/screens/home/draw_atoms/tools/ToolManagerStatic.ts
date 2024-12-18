import type {
	StaticHandlerBaseClass,
	ToolStaticBaseClass,
} from "./ToolManager.abstract";
import { GrabToolStatic } from "./Grab/GrabTool";
import { LineToolStatic } from "./Lines/LineTool";
import { SelectToolStatic } from "./Select/SelectTool";
import { TextToolStatic } from "./Text/TextTool";

export class ToolManagerStatic {
	private tools: ToolStaticBaseClass[] = [];

	constructor() {
		// REGISTER TOOLS HERE.
		this.registerTool(new GrabToolStatic());
		this.registerTool(new SelectToolStatic());
		this.registerTool(new LineToolStatic());
		this.registerTool(new TextToolStatic());
	}

	fetchAllToolsData = (): any[] => {
		return this.tools.flatMap((tool) => tool.staticHandler.data);
	};

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
