import { v7 as uuidv7 } from "uuid";
import {
	LineEventType,
	LineStroke,
	LineThickness,
	LineType,
	type Line,
} from "./Line.type";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import {
	DynamicHandlerBaseClass,
	ToolEventPermissions,
} from "../ToolManager.abstract";
import { renderLine } from "./LineRenderer";
import type { CapturedEvents } from "../../postman/Post.types";
import type { Postman } from "../../postman/Postman";

export class LineDynamicHandler extends DynamicHandlerBaseClass {
	private line: Line | undefined;
	private roughCanvas: RoughCanvas | undefined;
	private ctx: CanvasRenderingContext2D | undefined;
	private postman: Postman | undefined;

	render(ctx: CanvasRenderingContext2D, postman: Postman) {
		this.ctx = ctx;
		this.roughCanvas = rough.canvas(ctx);
		this.postman = postman;
	}

	draw = () => {
		requestAnimationFrame(() => {
			this.ctx?.clearRect(
				0,
				0,
				this.ctx.canvas.width,
				this.ctx.canvas.height
			);
			renderLine(this.line, this.ctx, this.roughCanvas);
		});
	};

	deinit() { }

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents) {
		switch (toolEvent) {
			case ToolEventPermissions.mousedown:
				this.onMouseDown(event);
				break;
			case ToolEventPermissions.mousemove:
				this.onMouseMove(event);
				break;
			case ToolEventPermissions.mouseup:
				this.onMouseUp(event);
				break;
		}
	}

	private onMouseUp = (_: CapturedEvents) => {
		this.endLineDraw();
	};

	private onMouseMove = (event: CapturedEvents) => {
		console.log(event.clientX, event.clientY);
		if (event.clientX === undefined || event.clientY === undefined) return;
		this.continueLineDraw(event.clientX, event.clientY);
	};

	private onMouseDown = (event: CapturedEvents) => {
		if (event.clientX === undefined || event.clientY === undefined) return;
		this.startLineDraw(event.clientX, event.clientY);
	};

	private startLineDraw = (x: number, y: number) => {
		this.line = {
			id: uuidv7(),
			points: [
				{ x: x, y: y },
				{ x: x, y: y },
			],
			style: {
				strokeWidth: LineThickness.thin,
				color: "white",
				lineType: LineType.straight,
				strokeType: LineStroke.solid,
			},
			selected: false,
			toolname: "line",
			boundingbox: [
				{ x: x, y: y },
				{ x: x, y: y },
			],
			position: { x: 0, y: 0 },
		};
		this.draw();
	};

	private continueLineDraw = (x: number, y: number) => {
		if (!this.line) return;
		let lastPoint = this.line.points[this.line.points.length - 1];
		lastPoint.x = x;
		lastPoint.y = y;
		this.draw();
	};

	private endLineDraw = () => {
		if (!this.line) return;
		this.draw();
		if (!this.postman) return;
		let lastPoints = this.line.points[this.line.points.length - 1];
		this.line.boundingbox[0].x = lastPoints.x;
		this.line.boundingbox[0].y = lastPoints.y;
		this.postman.sendEvents({
			type: LineEventType.ADD_LINE,
			line: this.line,
		});
		this.line = undefined;
	};
}
