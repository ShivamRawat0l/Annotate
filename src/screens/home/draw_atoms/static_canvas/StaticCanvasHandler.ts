import type { CapturedEvents } from "../postman/Post.types";
import { Postman } from "../postman/Postman";
import {
	InitToolData,
	type InitProperties,
	type StaticHandlerBaseClass,
	type ToolEventPermissions,
	type ToolStaticBaseClass,
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
			handler.render();
		});
	};

	onSelectTool = (toolId: string) => {
		this.toolStaticHandler?.deinit();
		this.toolStaticHandler = toolManagerStatic.fetchStaticHandler(toolId);
		let properties: InitProperties = {};
		if (
			this.toolStaticHandler?.permissions.includes(InitToolData.toolsdata)
		) {
			properties[InitToolData.toolsdata] =
				toolManagerStatic.fetchAllToolsData();
		}
		if (
			this.toolStaticHandler?.permissions.includes(
				InitToolData.canvasproperties
			)
		) {
			properties[InitToolData.canvasproperties] = this.canvasProperties;
		}
		if (
			this.toolStaticHandler?.permissions.includes(InitToolData.renderall)
		) {
			properties[InitToolData.renderall] = this.renderAll;
		}
		if (
			this.toolStaticHandler?.permissions.includes(InitToolData.postman)
		) {
			properties[InitToolData.postman] = this.postman;
		}
		if (
			this.toolStaticHandler?.permissions.includes(InitToolData.ctx)
		) {
			properties[InitToolData.ctx] = this.ctx;
		}
		this.toolStaticHandler?.init(properties);
	};

	onEvent = (toolEvent: ToolEventPermissions, event: CapturedEvents) => {
		console.log("onEvent", toolEvent, event);
		if (!this.toolStaticHandler) return;
		this.toolStaticHandler.onEvent(toolEvent, event);
	};
}
