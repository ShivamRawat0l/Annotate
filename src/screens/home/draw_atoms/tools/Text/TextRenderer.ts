import { classHighlighter, highlightCode } from "@lezer/highlight";
import { LezerMapper } from "./Code/themes/nightowl";
import { loadParser } from "./Code/Parser";
import { NightOwl } from "./Code/themes/nightowl";
import { Languages, TextType, type TextTool } from "./Text.type";
import { FontSize } from "./Utils/Fonts";

export const renderText = (
	text?: TextTool,
	ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
) => {
	if (!text || !ctx) return;
	const drawCode = async () => {
		let result: { value: string; className: string }[] = [];
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
		let x = 0;
		for (let i = 0; i < result.length; i++) {
			const item = result[i];
			ctx.fillStyle =
				NightOwl[LezerMapper[item.className.split(" ")[0]]]?.color ??
				"#fff";
			ctx.fillText(item.value, text.position.x + x, text.position.y);
			x += ctx.measureText(item.value).width;
		}
	};

	const drawTextComponents = () => {
		console.log("Drawing")
		switch (text.type) {
			case TextType.heading1:
				ctx.font = `${FontSize.heading1}px Schoolbell`;
				break;
			case TextType.heading2:
				ctx.font = `${FontSize.heading2}px Schoolbell`;
				break;
			case TextType.heading3:
				ctx.font = `${FontSize.heading3}px Schoolbell`;
				break;
			case TextType.paragraph:
				ctx.font = `${FontSize.paragraph}px Schoolbell`;
				break;
			case TextType.code:
				ctx.font = `${FontSize.code}px Mononoki`;
				break;
		}
		if (text.type === TextType.code) {
			drawCode();
		} else {
			ctx.fillStyle = "#fff";
			ctx.fillText(text.value, text.position.x, text.position.y);
		}
	};
	drawTextComponents()
};

export const addStyleToHTML = (element: HTMLElement, x: number, y: number) => {
	element.style.position = "absolute";
	element.style.width = "200px";
	element.style.zIndex = "100";
	element.style.textAlign = "left";
	element.style.padding = "0px";
	element.style.margin = "0px";
	element.style.whiteSpace = "pre"
	element.style.top = y + "px";
	element.style.left = x + "px";
}

export const renderDynamicText = (text: TextTool, element1: HTMLElement) => {
	if (text.type === TextType.heading1) {
		element1.style.fontSize = `${FontSize.heading1}px`;
	} else if (text.type === TextType.heading2) {
		element1.style.fontSize = `${FontSize.heading2}px`;
	} else if (text.type === TextType.heading3) {
		element1.style.fontSize = `${FontSize.heading3}px`;
	} else if (text.type === TextType.paragraph) {
		element1.style.fontSize = `${FontSize.paragraph}px`;
	} else if (text.type === TextType.code) {
		element1.style.fontSize = `${FontSize.code}px`;
	}
}
