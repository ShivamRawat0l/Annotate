import { classHighlighter, highlightCode } from "@lezer/highlight";
import { FontSize } from "../helper/Fonts";
import { LezerMapper, NightOwl } from "../themes/Highlight.NightOwl";
import { TextType, type Line, type Text } from "./Events";
import { handleTextPrefix, loadParser } from "../helper/Parser";

export class Canvas {
	private ctx: OffscreenCanvasRenderingContext2D;
	private lines: Line[] = [];
	private text: Text[] = [];
	private lastDrawTime: number = 0;
	private codeCache: { [key: string]: string } = {};

	constructor(ctx: OffscreenCanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	draw = (time: number) => {
		if (this.lastDrawTime == 0) {
			this.lastDrawTime = time;
		}
		const timePassed = time - this.lastDrawTime;
		if (timePassed < 0) return;
		this.lastDrawTime = time;
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.drawLineComponents();
		this.drawTextComponents();
		this.lastDrawTime = time;
	};

	private parserCache: { [key: string]: any } = {};

	private drawLineComponents = () => {
		for (let i = 0; i < this.lines.length; i++) {
			const line = this.lines[i];
			if (i === this.lines.length - 1) {
				this.ctx.beginPath();
			}
			this.ctx.moveTo(line.points[0].x, line.points[0].y);
			for (let j = 1; j < line.points.length; j++) {
				this.ctx.lineTo(line.points[j].x, line.points[j].y);
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = "#fff";
				this.ctx.stroke();
			}
		}
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
			if (!this.parserCache[text.language]) {
				this.parserCache[text.language] = await loadParser(
					text.language
				);
			}
			highlightCode(
				text.value,
				this.parserCache[text.language].parse(text.value),
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

	private drawTextComponents = () => {
		for (let i = 0; i < this.text.length; i++) {
			const text = this.text[i];
			handleTextPrefix(text, i);
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
