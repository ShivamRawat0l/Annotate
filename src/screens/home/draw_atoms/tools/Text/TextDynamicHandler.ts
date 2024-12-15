import { v7 as uuidv7 } from "uuid";
import { Languages, type TextTool } from "./Text.type";
import { TextType } from "./Text.type";
import {
	DynamicHandlerBaseClass,
	ToolEventPermissions,
} from "../ToolManager.abstract";
import type { Postman } from "../../postman/Postman";
import type { CapturedEvents } from "../../postman/Post.types";
import type { Point } from "../Tool.type";
import { ToolsID } from "../../ui/ToolsDetails";
import { handleTextPrefix } from "./Utils/PrefixHandler";
import { addStyleToHTML, renderDynamicText } from "./TextRenderer";
import { drawCodeHTML } from "./Code/CodeHighliter";
import { Pi } from "lucide-react";

export class TextDynamicHandler extends DynamicHandlerBaseClass {
	private postman: Postman | undefined;
	private text: TextTool | undefined;
	private preElement: HTMLPreElement | undefined;
	private codeElement: HTMLPreElement | undefined;


	render(ctx: CanvasRenderingContext2D, postman: Postman) {
		this.postman = postman;
	}

	deinit() { }

	onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents): void {
		switch (toolEvent) {
			case ToolEventPermissions.click:
				if (event.originalX === undefined || event.originalY === undefined) return;
				if (this.text !== undefined) {
					// TODO: Handle test case where text is already drawn
				} else {
					this.startTextDraw({ x: event.originalX, y: event.originalY });
				}
		}
	}

	private addEventListener = () => {
		if (this.preElement === undefined) return;
		this.preElement.addEventListener('focus', () => {
			if (this.preElement === undefined) return;
			this.preElement.style.outline = 'none';
		});
		this.preElement.addEventListener("blur", (event) => {
			this.endTextDraw()
		});
		this.preElement.addEventListener("keydown", async (event) => {
			if ("key" in event) {
				if ((event.key == "Enter" && !event.shiftKey) || event.key == "Escape") {
					this.endTextDraw()
				}
			}
		})
		this.preElement.addEventListener("input", async (event) => {
			if (this.text === undefined || this.preElement === undefined) return;
			const rawText = this.preElement.textContent ?? ""
			this.text.value = this.preElement.textContent ?? ""
			if (this.text.type === TextType.code && this.codeElement !== undefined) {
				await drawCodeHTML(this.codeElement, this.preElement.textContent ?? "", this.text.language);
			}
			if (rawText.length <= 20 && this.text.type === TextType.default) {
				const prefix = handleTextPrefix(rawText);
				if (prefix !== undefined) {
					this.text.type = prefix.type;
					this.text.language = prefix.language;
					this.text.value = prefix.value;
					this.preElement.innerHTML = prefix.value
					renderDynamicText(this.text, this.preElement);
					if (this.codeElement) {
						this.codeElement.style.fontSize = this.preElement.style.fontSize
					}
					if (this.text.type === TextType.code) {
						this.preElement.style.color = "#00000000"
						this.preElement.style.caretColor = "#fff"
					}
				}
			}
		});
		this.preElement.focus();
	}

	private startTextDraw = (position: Point) => {
		this.text = {
			id: uuidv7(),
			position,
			value: "",
			type: TextType.default,
			isEditing: true,
			language: Languages.plain,
			boundingbox: [position, position],
			selected: false,
			toolType: ToolsID.text,
		};
		this.preElement = document.createElement("pre");
		document.body.appendChild(this.preElement);
		this.preElement.contentEditable = "true";
		this.codeElement = document.createElement("pre");
		document.body.appendChild(this.codeElement);
		addStyleToHTML(this.preElement, position.x, position.y);
		addStyleToHTML(this.codeElement, position.x, position.y);
		this.addEventListener()
	};

	private endTextDraw = () => {
		this.postman?.sendEvents({
			type: "text",
			text: this.text
		});
		if (this.preElement) {
			this.preElement.blur();
			this.preElement.remove();
		}
		if (this.codeElement) {
			this.codeElement.remove()
		}
		this.text = undefined;
	};
}
