import { highlightCode } from "@lezer/highlight";
import { classHighlighter } from "@lezer/highlight";
import { LezerMapper } from "../../../../themes/Highlight.NightOwl";
import { NightOwl } from "../../../../themes/Highlight.NightOwl";

import { loadParser } from "./Parser";
import { FontSize } from "../Fonts";
import { uuidv7 } from "uuidv7";
import { handleTextPrefix } from "./Utils";
import { Languages, type Text } from "./Text.type";
import type { EventData, Point } from "../../../Events.type";
import { DrawEvents, EventState } from "../../../Events.type";
import { TextType } from "./Text.type";
import { ToolsID } from "../../../../tools/ToolsDetails";

export class TextRenderer {
	private codeCache: { [key: string]: string } = {};
	private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
	protected text: Text[] = [];

	constructor(
		ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
	) {
		this.ctx = ctx;
	}

	addText = (text: Text) => {
		this.text.push(text);
	};

	private drawCode = async (text: Text) => {
		let result: { value: string; className: string }[] = [];
		if (this.codeCache[text.value]) {
			result = JSON.parse(this.codeCache[text.value]);
		} else {
			function emit(text: string, classes: string) {
				result.push({ value: text, className: classes });
			}
			function emitBreak() {
				result.push({ value: "\n", className: "" });
			}

			highlightCode(
				text.value,
				(await loadParser(text.language)).parse(text.value),
				classHighlighter,
				emit,
				emitBreak
			);
			this.codeCache[text.value] = JSON.stringify(result);
		}
		let x = 0;
		for (let i = 0; i < result.length; i++) {
			const item = result[i];
			this.ctx.fillStyle =
				NightOwl[LezerMapper[item.className.split(" ")[0]]]?.color ??
				"#fff";
			this.ctx.fillText(item.value, text.position.x + x, text.position.y);
			x += this.ctx.measureText(item.value).width;
		}
	};

	drawTextComponents = () => {
		for (let i = 0; i < this.text.length; i++) {
			let text = this.text[i];
			switch (text.type) {
				case TextType.heading1:
					this.ctx.font = `${FontSize.heading1}px Schoolbell`;
					break;
				case TextType.heading2:
					this.ctx.font = `${FontSize.heading2}px Schoolbell`;
					break;
				case TextType.heading3:
					this.ctx.font = `${FontSize.heading3}px Schoolbell`;
					break;
				case TextType.paragraph:
					this.ctx.font = `${FontSize.paragraph}px Schoolbell`;
					break;
				case TextType.code:
					this.ctx.font = `${FontSize.code}px Mononoki`;
					break;
			}
			if (text.type === TextType.code) {
				this.drawCode(text);
			} else {
				this.ctx.fillStyle = "#fff";
				this.ctx.fillText(text.value, text.position.x, text.position.y);
			}
			let width = this.ctx.measureText(text.value).width;
			if (text.isEditing) {
				this.ctx.beginPath();
				this.ctx.rect(
					text.position.x + width,
					text.position.y - FontSize[text.type],
					10,
					FontSize[text.type]
				);
				this.ctx.fillStyle = "#fff";
				this.ctx.fill();
			}
		}
	};
}

export class TextHandler extends TextRenderer {
	constructor(ctx: OffscreenCanvasRenderingContext2D) {
		super(ctx);
	}

	handleTextEvent(data: EventData, onEndTextDraw: (element: Text) => void) {
		if (data.type === ToolsID.text) {
			if (data.state === EventState.starting) {
				if (!data.points) throw new Error("No points to place text");
				this.startTextDraw(data.points);
			} else if (data.state === EventState.continuing) {
				if (!data.value)
					throw new Error("No value to continue text draw");
				this.continueTextDraw(data.value);
			} else if (data.state === EventState.ending) {
				const element = this.endTextDraw();
				if (!element) throw new Error("No text to end");
				onEndTextDraw(element);
			}
		}
	}

	private startTextDraw = (position: Point) => {
		this.text.push({
			id: uuidv7(),
			position,
			value: "",
			type: TextType.paragraph,
			isEditing: true,
			language: Languages.plain,
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
