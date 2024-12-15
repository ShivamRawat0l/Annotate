import { Postman } from "../postman/Postman";
import { CanvasType } from "../event_manager/Events.type";
import {
	DynamicHandlerBaseClass,
	ToolEventPermissions,
} from "../tools/ToolManager.abstract";
import { toolManager } from "../tools/ToolManagerDynamic";
import {
	DynamicToStaticCanvasMessageEvents,
	type CapturedEvents,
} from "../postman/Post.types";

export class DynamicCanvasHandler {
	private ctx: CanvasRenderingContext2D;
	public postman: Postman;
	private toolDynamicHandler: DynamicHandlerBaseClass | undefined;

	constructor(
		ctx: CanvasRenderingContext2D,
		worker: Worker,
		offscreen: OffscreenCanvas
	) {
		this.ctx = ctx;
		this.postman = new Postman(worker);
		this.postman.loadStaticCanvas(offscreen);
	}

	onSelectTool = () => {
		this.toolDynamicHandler?.deinit();
		this.toolDynamicHandler = toolManager.fetchToolDynamicHandler();
		this.postman.sendEvents({
			type: DynamicToStaticCanvasMessageEvents.SELECT_TOOL,
			id: toolManager.selectedTool?.id,
		});
		this.toolDynamicHandler?.render(this.ctx, this.postman);
	};

	onEvent = (
		toolEvent: ToolEventPermissions,
		event: Event,
		canvasType: CanvasType
	) => {
		const rect = document
			.getElementsByClassName("dynamic-canvas")[0]
			?.getBoundingClientRect();
		if (!rect) return;
		const x = Math.floor(((event as any).clientX ?? 0) - rect.left);
		const y = Math.floor(((event as any).clientY ?? 0) - rect.top);
		const capturedEvent: CapturedEvents = {
			originalX: "clientX" in event ? event.clientX as number : undefined,
			originalY: "clientY" in event ? event.clientY as number : undefined,
			clientX: "clientX" in event ? x : undefined,
			clientY: "clientY" in event ? y : undefined,
			movementX:
				"movementX" in event ? (event.movementX as number) : undefined,
			movementY:
				"movementY" in event ? (event.movementY as number) : undefined,
			deltaX: "deltaX" in event ? (event.deltaX as number) : undefined,
			deltaY: "deltaY" in event ? (event.deltaY as number) : undefined,
			key: "key" in event ? (event.key as string) : undefined,
		};

		if (canvasType === CanvasType.dynamic) {
			toolManager
				.fetchToolDynamicHandler()
				?.onEvent(toolEvent, capturedEvent);
		} else if (canvasType === CanvasType.static) {
			this.postman.sendEvents({
				type: toolEvent,
				event: capturedEvent,
			});
		} else if (canvasType === CanvasType.both) {
			toolManager
				.fetchToolDynamicHandler()
				?.onEvent(toolEvent, capturedEvent);
			this.postman.sendEvents({
				type: toolEvent,
				event: capturedEvent,
			});
		}
	};
}
