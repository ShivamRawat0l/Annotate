import {
	ToolEventPermissions,
	ToolDynamicBaseClass,
	ToolStaticBaseClass,
} from "../ToolManager.abstract";
import { Minus } from "lucide-react";
import type { CSSProperties } from "react";
import { LineDynamicHandler } from "./LineDynamicHandler";
import { LineStaticHandler } from "./LineStaticHandler";

let id = "line";
let icon: React.ReactNode = <Minus />;
let name: string = "Line";
let description: string = "Line tool";
let staticPermissions: ToolEventPermissions[] = [];
let dynamicPermissions: ToolEventPermissions[] = [
	ToolEventPermissions.mousedown,
	ToolEventPermissions.mousemove,
	ToolEventPermissions.mouseup,
];
let cursor: CSSProperties["cursor"] = "crosshair";

export class LineToolDynamic extends ToolDynamicBaseClass {
	dynamicHandler: LineDynamicHandler;

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
		this.dynamicHandler = new LineDynamicHandler();
	}
}

export class LineToolStatic extends ToolStaticBaseClass {
	staticHandler: LineStaticHandler;

	constructor() {
		super(id);
		this.staticHandler = new LineStaticHandler();
	}
}
