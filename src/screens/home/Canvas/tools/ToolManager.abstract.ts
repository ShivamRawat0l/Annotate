import type { CSSProperties } from "react";
import type { CanvasProperties } from "../staticcanvas/StaticCanvasHandler";
import type { CapturedEvents } from "../postman/Post.types";
import type { Postman } from "../postman/Postman";

export enum ToolEventPermissions {
	mousedown = "mousedown",
	mouseup = "mouseup",
	mousemove = "mousemove",
	keydown = "keydown",
	wheel = "wheel",
	click = "click",
}

export abstract class StaticHandlerBaseClass {
	abstract render(ctx: OffscreenCanvasRenderingContext2D): void;
	abstract init(
		canvasProperties?: CanvasProperties,
		renderAll?: () => void,
		postman?: Postman
	): void;
	abstract deinit(): void;
	abstract onEvent(
		toolEvent: ToolEventPermissions,
		event: CapturedEvents
	): void;
}

export abstract class DynamicHandlerBaseClass {
	abstract render(ctx: CanvasRenderingContext2D, postman: Postman): void;
	abstract onEvent(
		toolEvent: ToolEventPermissions,
		event: CapturedEvents
	): void;
}

export abstract class ToolStaticBaseClass {
	id: string;
	abstract staticHandler: StaticHandlerBaseClass;

	constructor(id: string) {
		this.id = id;
	}
}

export abstract class ToolDynamicBaseClass {
	id: string;
	icon: React.ReactNode;
	name: string;
	description: string;
	staticPermissions: ToolEventPermissions[];
	dynamicPermissions: ToolEventPermissions[];
	cursor: CSSProperties["cursor"];
	abstract dynamicHandler: DynamicHandlerBaseClass;

	constructor(
		id: string,
		icon: React.ReactNode,
		name: string,
		description: string,
		staticPermissions: ToolEventPermissions[],
		dynamicPermissions: ToolEventPermissions[],
		cursor: CSSProperties["cursor"] = "default"
	) {
		this.id = id;
		this.icon = icon;
		this.name = name;
		this.description = description;
		this.staticPermissions = staticPermissions;
		this.dynamicPermissions = dynamicPermissions;
		this.cursor = cursor;
	}
}

export abstract class ToolRendererBaseClass {
	abstract render(): void;
}

export abstract class ToolHandlerBaseClass {}
