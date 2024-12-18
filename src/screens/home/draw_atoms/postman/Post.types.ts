import type { ToolEventPermissions } from "../tools/ToolManager.abstract";

export enum DynamicToStaticCanvasMessageEvents {
	START = "start",
	SELECT_TOOL = "selectTool",
}

export type CapturedEvents = {
	originalX?: number;
	originalY?: number;
	clientX?: number;
	clientY?: number;
	movementX?: number;
	movementY?: number;
	deltaX?: number;
	deltaY?: number;
	key?: string;
};

export type DynamicToStaticCanvasMessage =
	| {
		type: DynamicToStaticCanvasMessageEvents;
		offscreen?: OffscreenCanvas;
		id?: string;
	}
	| {
		event: CapturedEvents;
		type: ToolEventPermissions;
	}
	| {
		[key: string]: any;
	};
