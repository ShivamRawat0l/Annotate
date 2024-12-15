import {
	ToolEventPermissions,
	ToolDynamicBaseClass,
	ToolStaticBaseClass,
} from "../ToolManager.abstract";
import { Hand } from "lucide-react";
import { GrabDynamicHandler } from "./GrabDynamicHandler";
import { GrabStaticHandler } from "./GrabStaticHandler";
import type { CSSProperties } from "react";

let id = "grab";
let icon: React.ReactNode = <Hand />;
let name: string = "Grab";
let description: string = "Grab tool";
let staticPermissions: ToolEventPermissions[] = [
	ToolEventPermissions.mousedown,
	ToolEventPermissions.mousemove,
	ToolEventPermissions.mouseup,
];
let dynamicPermissions: ToolEventPermissions[] = [];
let cursor: CSSProperties["cursor"] = "grab";

export class GrabToolDynamic extends ToolDynamicBaseClass {
	dynamicHandler: GrabDynamicHandler;

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
		this.dynamicHandler = new GrabDynamicHandler();
	}
}

export class GrabToolStatic extends ToolStaticBaseClass {
	staticHandler: GrabStaticHandler;

	constructor() {
		super(id);
		this.staticHandler = new GrabStaticHandler();
	}
}
