import rough from "roughjs";
import type { CapturedEvents } from "../../postman/Post.types";
import type { Postman } from "../../postman/Postman";
import type { CanvasProperties } from "../../staticcanvas/StaticCanvasHandler";
import {
	InitToolData,
	StaticHandlerBaseClass,
	ToolEventPermissions,
	type InitProperties,
} from "../ToolManager.abstract";
import type { Line } from "./Line.type";
import { renderLine } from "./LineRenderer";
import type { RoughCanvas } from "roughjs/bin/canvas";

export class LineStaticHandler extends StaticHandlerBaseClass {
	data: Line[] = [];
	permissions = [
		InitToolData.toolsdata,
		InitToolData.renderall,
		InitToolData.postman,
		InitToolData.canvasproperties,
		InitToolData.ctx
	];
	private removeListener?: () => void;
	private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | undefined
	private roughCanvas: RoughCanvas | undefined

	private addLine = (line: Line) => {
		this.data.push(line);
		renderLine(line, this.ctx, this.roughCanvas);
	};

	render() {
		for (let i = 0; i < this.data.length; i++) {
			renderLine(this.data[i], this.ctx, this.roughCanvas);
		}
	}

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents): void { }

	deinit() {
		this.removeListener?.();
	}

	init(properties: InitProperties): void {
		const { ctx, canvasproperties, renderall, postman } = properties;
		this.ctx = ctx;
		this.roughCanvas = rough.canvas(this.ctx);
		if (!canvasproperties) return;
		this.removeListener = postman?.registerCanvasMessage((event: any) => {
			if ("line" in event) {
				const line = event.line;

				line.points.forEach((point: any) => {
					point.x -= canvasproperties.translateX;
					point.y -= canvasproperties.translateY;
				});
				this.addLine(line);
			}
		});
	}
}
