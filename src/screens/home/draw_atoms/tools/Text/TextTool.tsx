import {
	ToolEventPermissions,
	ToolDynamicBaseClass,
	ToolStaticBaseClass,
} from "../ToolManager.abstract";
import { Hand, Minus, TextIcon, Type } from "lucide-react";
import type { CSSProperties } from "react";
import { TextDynamicHandler } from "./TextDynamicHandler";
import { TextStaticHandler } from "./TextStaticHandler";

let id = "text";
let icon: React.ReactNode = <Type />;
let name: string = "Text";
let description: string = "Text tool";
let staticPermissions: ToolEventPermissions[] = [];
let dynamicPermissions: ToolEventPermissions[] = [
	ToolEventPermissions.click,
];
let cursor: CSSProperties["cursor"] = "text";

export class TextToolDynamic extends ToolDynamicBaseClass {
	dynamicHandler: TextDynamicHandler;

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
		this.dynamicHandler = new TextDynamicHandler();
	}
}

export class TextToolStatic extends ToolStaticBaseClass {
	staticHandler: TextStaticHandler;

	constructor() {
		super(id);
		this.staticHandler = new TextStaticHandler();
	}
}
