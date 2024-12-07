import {
	ToolEventPermissions,
	ToolDynamicBaseClass,
	ToolStaticBaseClass,
} from "../ToolManager.abstract";
import { Hand, Minus, TextIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { LineDynamicHandler } from "./LineDynamicHandler";
import { LineStaticHandler } from "./LineStaticHandler";

let id = "text";
let icon: React.ReactNode = <TextIcon />;
let name: string = "Text";
let description: string = "Text tool";
let staticPermissions: ToolEventPermissions[] = [];
let dynamicPermissions: ToolEventPermissions[] = [
	ToolEventPermissions.mousedown,
	ToolEventPermissions.keydown,
];
let cursor: CSSProperties["cursor"] = "text";

export class TextToolDynamic extends ToolDynamicBaseClass {
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
