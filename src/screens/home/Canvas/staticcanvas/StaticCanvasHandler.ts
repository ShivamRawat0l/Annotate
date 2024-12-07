import type { CapturedEvents } from "../postman/Post.types";
import { Postman } from "../postman/Postman";
import type {
	StaticHandlerBaseClass,
	ToolEventPermissions,
	ToolStaticBaseClass,
} from "../tools/ToolManager.abstract";
import { toolManagerStatic } from "../tools/ToolManagerStatic";

export type CanvasProperties = {
	translateX: number;
	translateY: number;
	scale: number;
};

export class StaticCanvasHandler {
	private ctx: OffscreenCanvasRenderingContext2D;
	private toolStaticHandler: StaticHandlerBaseClass | undefined;
	private canvasProperties: CanvasProperties;
	private postman: Postman;

	constructor(ctx: OffscreenCanvasRenderingContext2D, worker: Worker) {
		this.ctx = ctx;
		this.canvasProperties = {
			translateX: 0,
			translateY: 0,
			scale: 1,
		};
		this.postman = new Postman(worker);
	}

	renderAll = () => {
		this.ctx.clearRect(
			-this.canvasProperties.translateX,
			-this.canvasProperties.translateY,
			this.ctx.canvas.width,
			this.ctx.canvas.height
		);
		const staticHandlers = toolManagerStatic.fetchAllStaticHandlers();
		staticHandlers.forEach((handler) => {
			handler.render(this.ctx);
		});
	};

	onSelectTool = (toolId: string) => {
		this.toolStaticHandler?.deinit();
		this.toolStaticHandler = toolManagerStatic.fetchStaticHandler(toolId);
		this.toolStaticHandler?.init(
			this.canvasProperties,
			this.renderAll,
			this.postman
		);
	};

	onEvent = (toolEvent: ToolEventPermissions, event: CapturedEvents) => {
		if (!this.toolStaticHandler) return;
		this.toolStaticHandler.onEvent(toolEvent, event);
	};
}
