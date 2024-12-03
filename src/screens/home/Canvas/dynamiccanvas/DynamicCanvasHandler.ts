import { TextHandler } from "./Tools/Texts/Text/Text";
import { LineHandler } from "./Tools/Lines/Line";
import { GrabHandler } from "./Tools/Select/Grab/Grab";

export class DynamicCanvasHandler {
	private ctx: OffscreenCanvasRenderingContext2D;
	public textHandler: TextHandler;
	public lineHandler: LineHandler;
	public grabHandler: GrabHandler;

	constructor(ctx: OffscreenCanvasRenderingContext2D) {
		this.ctx = ctx;
		this.textHandler = new TextHandler(ctx);
		this.lineHandler = new LineHandler(ctx);
		this.grabHandler = new GrabHandler(ctx);
	}

	draw = () => {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.lineHandler.drawLineComponents();
		this.textHandler.drawTextComponents();
	};
}
