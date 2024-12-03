import type { Point } from "./Events.type";
import { LineRenderer } from "./Tools/Lines/Line";
import type { Line } from "./Tools/Lines/Line.type";
import type { GrabHandler } from "./Tools/Select/Grab/Grab";
import { TextRenderer } from "./Tools/Texts/Text/Text";
import type { Text } from "./Tools/Texts/Text/Text.type";

export class StaticCanvasHandler {
	private ctx: CanvasRenderingContext2D;
	private textRenderer: TextRenderer;
	private lineRenderer: LineRenderer;
	translateX: number = 0;
	translateY: number = 0;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.textRenderer = new TextRenderer(ctx);
		this.lineRenderer = new LineRenderer(ctx);
	}

	draw = () => {
		this.ctx.clearRect(
			-this.translateX,
			-this.translateY,
			this.ctx.canvas.width,
			this.ctx.canvas.height
		);
		this.lineRenderer.drawLineComponents();
		this.textRenderer.drawTextComponents();
	};

	addLine = (line: Line) => {
		line.points.forEach((point) => {
			point.x -= this.translateX;
			point.y -= this.translateY;
		});
		this.lineRenderer.addLine(line);
		requestAnimationFrame(this.draw);
	};

	addText = (text: Text) => {
		text.position.x -= this.translateX;
		text.position.y -= this.translateY;
		this.textRenderer.addText(text);
		requestAnimationFrame(this.draw);
	};

	panCanvas = (x: number, y: number) => {
		this.translateX += x;
		this.translateY += y;
		this.ctx.translate(x, y);
		requestAnimationFrame(this.draw);
	};
}
