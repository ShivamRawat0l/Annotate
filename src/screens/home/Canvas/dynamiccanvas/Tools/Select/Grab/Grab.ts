import { uuidv7 } from "uuidv7";

export class GrabRenderer {
	private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
	translateX: number = 0;
	translateY: number = 0;

	constructor(
		ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
	) {
		this.ctx = ctx;
	}
}

export class GrabHandler extends GrabRenderer {
	constructor(ctx: OffscreenCanvasRenderingContext2D) {
		super(ctx);
	}
}
