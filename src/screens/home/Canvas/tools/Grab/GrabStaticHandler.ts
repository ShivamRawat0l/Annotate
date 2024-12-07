import type { CapturedEvents } from "../../postman/Post.types";
import type { CanvasProperties } from "../../staticcanvas/StaticCanvasHandler";
import {
	StaticHandlerBaseClass,
	ToolEventPermissions,
} from "../ToolManager.abstract";

export class GrabStaticHandler extends StaticHandlerBaseClass {
	private isCanvasHolding: boolean = false;
	private canvasProperties: CanvasProperties | undefined;
	private renderAll: (() => void) | undefined;
	private ctx: OffscreenCanvasRenderingContext2D | undefined;

	render(
		ctx: OffscreenCanvasRenderingContext2D,
		canvasProperties: CanvasProperties
	) {
		this.ctx = ctx;
	}

	init(canvasProperties?: CanvasProperties, renderAll?: () => void) {
		this.canvasProperties = canvasProperties;
		this.renderAll = renderAll;
	}

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents) {
		switch (toolEvent) {
			case ToolEventPermissions.mousedown:
				this.isCanvasHolding = true;
				break;
			case ToolEventPermissions.mousemove:
				if (this.isCanvasHolding) {
					this.onmousemove(event as MouseEvent);
				}
				break;
			case ToolEventPermissions.mouseup:
				this.isCanvasHolding = false;
				break;
		}
	}

	private onmousemove = (event: MouseEvent) => {
		this.pan(event.movementX, event.movementY);
	};

	private pan = (x: number, y: number) => {
		if (!this.canvasProperties) return;
		if (
			this.canvasProperties.translateX + x <= 100 ||
			this.canvasProperties.translateY + y <= 100
		) {
			this.canvasProperties.translateX += x;
			this.canvasProperties.translateY += y;
			this.ctx?.translate(x, y);
			this.renderAll?.();
		}
	};
}
