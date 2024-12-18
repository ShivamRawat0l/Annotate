import { classHighlighter, highlightCode } from "@lezer/highlight";
import { loadParser } from "./Parser";
import type { Languages, TextTool } from "../Text.type";
import { LezerMapper, NightOwl } from "./themes/nightowl";


export const drawCodeHTML = async (result: HTMLPreElement, text: string, language: Languages) => {
	result.innerHTML = ""
	function emit(text: string, classes: string) {
		let node: any = document.createTextNode(text)
		if (classes) {
			let span = document.createElement("span")
			span.style.color = NightOwl[LezerMapper[classes.split(" ")[0]]]?.color ?? "#fff"
			span.appendChild(node)
			node = span
		}
		result.appendChild(node)
	}
	function emitBreak() {
		result.appendChild(document.createElement("br"))
	}
	highlightCode(
		text,
		(await loadParser(language)).parse(text),
		classHighlighter,
		emit,
		emitBreak
	);
};

export const drawCodeCanvas = async (text: TextTool, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => {
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

