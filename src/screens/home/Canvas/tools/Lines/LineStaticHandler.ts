import rough from "roughjs";
import type { CapturedEvents } from "../../postman/Post.types";
import type { Postman } from "../../postman/Postman";
import type { CanvasProperties } from "../../staticcanvas/StaticCanvasHandler";
import {
	StaticHandlerBaseClass,
	ToolEventPermissions,
} from "../ToolManager.abstract";
import type { Line } from "./Line.type";
import { renderLine } from "./LineRenderer";

export class LineStaticHandler extends StaticHandlerBaseClass {
	private lines: Line[] = [];
	private removeListener?: () => void;

	private addLine = (line: Line) => {
		this.lines.push(line);
	};

	render(ctx: OffscreenCanvasRenderingContext2D) {
		const roughCanvas = rough.canvas(ctx);
		for (let i = 0; i < this.lines.length; i++) {
			renderLine(this.lines[i], ctx, roughCanvas);
		}
	}

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents): void {}

	deinit() {
		this.removeListener?.();
	}

	init(
		canvasProperties: CanvasProperties,
		renderAll?: () => void,
		postman?: Postman
	): void {
		this.removeListener = postman?.registerCanvasMessage((event: any) => {
			if ("line" in event) {
				const line = event.line;

				line.points.forEach((point: any) => {
					point.x -= canvasProperties.translateX;
					point.y -= canvasProperties.translateY;
				});
				this.addLine(line);
				renderAll?.();
			}
		});
	}
}
