import type { CapturedEvents } from "../../postman/Post.types";
import {
	InitToolData,
	StaticHandlerBaseClass,
	ToolEventPermissions,
	type InitProperties,
} from "../ToolManager.abstract";
import type { TextTool } from "./Text.type";
import { renderText } from "./TextRenderer";

export class TextStaticHandler extends StaticHandlerBaseClass {
	data: TextTool[] = [];
	public permissions: InitToolData[] = [InitToolData.postman, InitToolData.ctx];
	private ctx: OffscreenCanvasRenderingContext2D | undefined

	private addText = (text: TextTool) => {
		this.data.push(text);
		renderText(text, this.ctx)
	};

	render() {
		for (let i = 0; i < this.data.length; i++) {
			renderText(this.data[i], this.ctx);
		}
	}

	onEvent(_toolEvent: ToolEventPermissions, _event: CapturedEvents): void { }

	deinit() { }

	init(properties: InitProperties): void {
		const { ctx, postman } = properties;
		this.ctx = ctx;
		postman?.registerCanvasMessage((event: any) => {
			if ("text" in event) {
				this.addText(event.text);
			}
		});
	}
}
