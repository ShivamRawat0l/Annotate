import type { CapturedEvents } from "../../postman/Post.types";
import {
	DynamicHandlerBaseClass,
	type ToolEventPermissions,
} from "../ToolManager.abstract";

export class GrabDynamicHandler extends DynamicHandlerBaseClass {
	render(ctx: CanvasRenderingContext2D) {}
	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents) {}
}
