import {
	ToolEventPermissions,
	ToolDynamicBaseClass,
	ToolStaticBaseClass,
} from "../ToolManager.abstract";
import { Hand, Minus, MousePointer, MousePointer2 } from "lucide-react";
import type { CSSProperties } from "react";
import { SelectDynamicHandler } from "./SelectDynamicHandler";
import { SelectStaticHandler } from "./SelectStaticHandler";

let id = "select";
let icon: React.ReactNode = <MousePointer2 />;
let name: string = "Select";
let description: string = "Select tool";
let staticPermissions: ToolEventPermissions[] = [ToolEventPermissions.click];
let dynamicPermissions: ToolEventPermissions[] = [
	ToolEventPermissions.mousedown,
	ToolEventPermissions.mousemove,
	ToolEventPermissions.mouseup,
];
let cursor: CSSProperties["cursor"] = "default";

export class SelectToolDynamic extends ToolDynamicBaseClass {
	dynamicHandler: SelectDynamicHandler;

	constructor() {
		super(
			id,
			icon,
			name,
			description,
			staticPermissions,
			dynamicPermissions,
			cursor
		);
		this.dynamicHandler = new SelectDynamicHandler();
	}
}

export class SelectToolStatic extends ToolStaticBaseClass {
	staticHandler: SelectStaticHandler;

	constructor() {
		super(id);
		this.staticHandler = new SelectStaticHandler();
	}
}
