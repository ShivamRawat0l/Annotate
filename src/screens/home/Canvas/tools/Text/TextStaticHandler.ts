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

	private addLine = (line: Line) => {
		this.lines.push(line);
	};
	addText = (text: Text) => {
		this.text.push(text);
	};

	render(
		ctx: OffscreenCanvasRenderingContext2D,
		canvasProperties: CanvasProperties
	) {
		const roughCanvas = rough.canvas(ctx);
		for (let i = 0; i < this.lines.length; i++) {
			renderLine(this.lines[i], ctx, roughCanvas);
		}
	}

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents): void {}

	init(
		canvasProperties: CanvasProperties,
		renderAll?: () => void,
		postman?: Postman
	): void {
		postman?.registerCanvasMessage((event: any) => {
			if ("line" in event) {
				this.addLine(event.line);
				renderAll?.();
			}
		});
	}
}
