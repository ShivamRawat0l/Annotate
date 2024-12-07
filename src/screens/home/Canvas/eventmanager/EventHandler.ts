import { DynamicCanvasHandler } from "../dynamiccanvas/DynamicCanvasHandler";
// @ts-ignore
import myWorkerUrl from "../staticcanvas/StaticCanvas.worker.ts?worker&url";
import type { CanvasType } from "./Events.type";
import { ToolEventPermissions } from "../tools/ToolManager.abstract";

export class EventHandler {
	toolSelected: string | undefined;
	dynamicCanvas: DynamicCanvasHandler;

	constructor(
		dynamicRef: React.RefObject<HTMLCanvasElement>,
		staticRef: React.RefObject<HTMLCanvasElement>
	) {
		const context = dynamicRef.current?.getContext("2d");
		const offscreen = staticRef.current?.transferControlToOffscreen();
		const worker = new Worker(new URL(myWorkerUrl, import.meta.url), {
			type: "module",
		});
		if (!context || !offscreen) throw new Error("Canvas not found");
		this.dynamicCanvas = new DynamicCanvasHandler(
			context,
			worker,
			offscreen
		);
	}

	onSelectTool = () => {
		this.dynamicCanvas.onSelectTool();
	};

	keydown = (event: Event, canvasType: CanvasType) => {
		this.dynamicCanvas.onEvent(
			ToolEventPermissions.keydown,
			event,
			canvasType
		);
	};

	mousedown = (event: Event, canvasType: CanvasType) => {
		this.dynamicCanvas.onEvent(
			ToolEventPermissions.mousedown,
			event,
			canvasType
		);
	};

	mouseup = (event: Event, canvasType: CanvasType) => {
		this.dynamicCanvas.onEvent(
			ToolEventPermissions.mouseup,
			event,
			canvasType
		);
	};

	mousemove = (event: Event, canvasType: CanvasType) => {
		this.dynamicCanvas.onEvent(
			ToolEventPermissions.mousemove,
			event,
			canvasType
		);
	};
}
