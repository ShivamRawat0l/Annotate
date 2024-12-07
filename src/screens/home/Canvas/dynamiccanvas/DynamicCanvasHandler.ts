import { Postman } from "../postman/Postman";
import { CanvasType } from "../eventmanager/Events.type";
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
		const capturedEvent: CapturedEvents = {
			clientX: "clientX" in event ? (event.clientX as number) : undefined,
			clientY: "clientY" in event ? (event.clientY as number) : undefined,
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
