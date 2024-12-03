import { uuidv7 } from "uuidv7";
import type { Line } from "./Line.type";
import { EventState, type EventData } from "../../Events.type";
import { ToolsID } from "../../../tools/ToolsDetails";

export class LineRenderer {
	private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
	protected lines: Line[] = [];

	constructor(
		ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
	) {
		this.ctx = ctx;
	}

	addLine = (line: Line) => {
		this.lines.push(line);
	};

	drawLineComponents = () => {
		for (let i = 0; i < this.lines.length; i++) {
			const line = this.lines[i];
			this.ctx.beginPath();
			this.ctx.moveTo(line.points[0].x, line.points[0].y);
			for (let j = 1; j < line.points.length; j++) {
				this.ctx.lineTo(line.points[j].x, line.points[j].y);
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = "#fff";
				this.ctx.stroke();
			}
		}
	};
}

export class LineHandler extends LineRenderer {
	constructor(ctx: OffscreenCanvasRenderingContext2D) {
		super(ctx);
	}

	handleLineEvent(data: EventData, onEndLineDraw: (element: Line) => void) {
		if (data.type === ToolsID.line) {
			if (data.state === EventState.ending) {
				const element = this.endLineDraw();
				if (!element) throw new Error("No line to end");
				onEndLineDraw(element);
			}
			if (!data.points) throw new Error("No Points to draw line");
			if (data.state === EventState.starting) {
				this.startLineDraw(data.points);
			} else if (data.state === EventState.continuing) {
				this.continueLineDraw(data.points);
			}
		}
	}

	private startLineDraw = (points: { x: number; y: number }) => {
		this.lines.push({
			id: uuidv7(),
			points: [
				{ x: points.x, y: points.y },
				{ x: points.x, y: points.y },
			],
			bezier: false,
		});
	};

	private continueLineDraw = (points: { x: number; y: number }) => {
		if (this.lines.length === 0) throw new Error("No line to continue");
		let lastLine = this.lines[this.lines.length - 1];
		let lastPoint = lastLine.points[lastLine.points.length - 1];
		lastPoint.x = points.x;
		lastPoint.y = points.y;
	};

	private endLineDraw = () => {
		if (this.lines.length === 0) throw new Error("No line to end");
		return this.lines.pop();
	};
}
