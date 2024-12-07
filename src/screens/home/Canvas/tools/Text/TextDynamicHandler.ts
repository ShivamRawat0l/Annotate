import { highlightCode } from "@lezer/highlight";
import { classHighlighter } from "@lezer/highlight";

import { loadParser } from "./Parser";
import { v7 as uuidv7 } from "uuid";
import { handleTextPrefix } from "./Utils/PrefixHandler";
import { Languages, type Text } from "./Text.type";
import type { EventData, Point } from "../../../Events.type";
import { DrawEvents, TextEventState } from "../../../Events.type";
import { TextType } from "./Text.type";
import { ToolsID } from "../../../../tools/ToolsDetails";

export class TextHandler extends TextRenderer {
	private codeCache: { [key: string]: string } = {};
	private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
	public text: Text | undefined;

	constructor(
		ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
	) {
		this.ctx = ctx;
	}

	handleTextEvent(data: EventData, onEndTextDraw: (element: Text) => void) {
		if (data.type === ToolsID.text) {
			if (data.state === TextEventState.select) {
				if (!data.points) throw new Error("No points to place text");
				this.startTextDraw(data.points);
			} else if (data.state === TextEventState.type) {
				if (!data.value)
					throw new Error("No value to continue text draw");
				this.continueTextDraw(data.value);
			} else if (data.state === TextEventState.end) {
				const element = this.endTextDraw();
				if (!element) throw new Error("No text to end");
				onEndTextDraw(element);
			}
		}
	}

	detectKeyPress = (event: KeyboardEvent) => {
		console.log(toolEvent);
		if (event.key === "Enter" || event.key === "Escape") {
			endSelectedToolFunction();
		} else if (
			(validCharacters.includes(event.key) ||
				event.key === "Backspace") &&
			toolEvent === ToolEvents.text
		) {
			postMessage({
				type: ToolsID.text,
				value: event.key,
				state: TextEventState.type,
			});
		}
	};
	private startTextDraw = (position: Point) => {
		this.text.push({
			id: uuidv7(),
			position,
			value: "",
			type: TextType.paragraph,
			isEditing: true,
			language: Languages.plain,
			boundingBox: [position, position],
			selected: false,
			toolType: ToolsID.text,
		});
	};

	private continueTextDraw = (value: string) => {
		const currentText = this.text[this.text.length - 1];
		if (value === "Backspace") {
			currentText.value = currentText.value.slice(0, -1);
		} else {
			currentText.value += value;
			const checkTextPrefix = handleTextPrefix(currentText.value);
			if (checkTextPrefix) {
				currentText.value = checkTextPrefix.value;
				currentText.type = checkTextPrefix.type;
				currentText.language = checkTextPrefix.language;
			}
		}
	};

	private endTextDraw = () => {
		if (this.text.length === 0) throw new Error("No text to end");
		this.text[this.text.length - 1].isEditing = false;
		return this.text.pop();
	};
}
