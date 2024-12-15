import { findBoundaries } from "./Select.util";
import {
	InitToolData,
	StaticHandlerBaseClass,
	ToolEventPermissions,
	type InitProperties,
	type ToolData,
} from "../ToolManager.abstract";
import type { CapturedEvents } from "../../postman/Post.types";
import type { Postman } from "../../postman/Postman";

export class SelectStaticHandler extends StaticHandlerBaseClass {
	data = [];
	public permissions = [
		InitToolData.toolsdata,
		InitToolData.renderall,
		InitToolData.postman,
	];
	private renderall: (() => void) | undefined;
	private toolsdata: ToolData[] = [];
	private postman?: Postman;
	private selectedElement: ToolData | undefined;
	private mouseMoving: boolean = false;
	private dynamicCanvasElement: ToolData | undefined;

	render() { }

	init(properties: InitProperties) {
		const { renderall, toolsdata, postman } = properties;
		this.renderall = renderall;
		this.toolsdata = toolsdata || [];
		this.postman = postman;
		this.postman?.registerCanvasMessage((event: any) => {
			console.log("event", event);
			if (event.type === "deselect") {
				if (this.dynamicCanvasElement) {
					this.dynamicCanvasElement.position = event.element.position;
					this.dynamicCanvasElement.selected = false;
					this.dynamicCanvasElement = undefined;
				}
			}
		});
	}

	deinit() { }

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents): void {
		switch (toolEvent) {
			case ToolEventPermissions.click:
				if (!this.mouseMoving) {
					const { clientX, clientY } = event;
					if (clientX && clientY) {
						this.onSelectElement(clientX, clientY);
						this.renderall?.();
					}
					break;
				}
		}
	}

	onSelectElement = (x: number, y: number) => {
		let toolData = this.toolsdata.find((toolData) => {
			if (!("boundingbox" in toolData)) return;
			let { minBoundingX, maxBoundingX, minBoundingY, maxBoundingY } =
				findBoundaries(
					toolData.boundingbox[0],
					toolData.boundingbox[1]
				);

			minBoundingX += toolData.position.x;
			maxBoundingX += toolData.position.x;
			minBoundingY += toolData.position.y;
			maxBoundingY += toolData.position.y;
			let isLeftBound = x > minBoundingX;
			let isRightBound = x < maxBoundingX;
			let isTopBound = y > minBoundingY;
			let isBottomBound = y < maxBoundingY;
			if (isLeftBound && isRightBound && isTopBound && isBottomBound) {
				if (this.selectedElement?.id === toolData?.id) {
				} else {
					return true;
				}
			}
			return false;
		});
		if (toolData.id != this.selectedElement?.id) {
			this.dynamicCanvasElement = toolData;
			if (this.dynamicCanvasElement) {
				this.dynamicCanvasElement.selected = true;
				this.postman?.sendEvents({
					type: "select",
					element: this.dynamicCanvasElement,
				});
			}
		}
	};
}
