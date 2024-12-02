import { classHighlighter, highlightCode } from "@lezer/highlight";
import { uuidv7 } from "uuidv7";
import { LezerMapper, NightOwl } from "../themes/Highlight.NightOwl";
import { FontSize } from "../helper/Fonts";
import { loadParser, Languages } from "../helper/Parser";

type Line = {
	id: string;
	points: Point[];
	bezier: boolean;
};

type Point = {
	x: number;
	y: number;
};

enum TextType {
	heading1 = "heading1",
	heading2 = "heading2",
	heading3 = "heading3",
	paragraph = "paragraph",
	code = "code",
}

type Text = {
	id: string;
	position: Point;
	value: string;
	type: TextType;
	isEditing: boolean;
	language: Languages;
};

export class Canvas {
	private ctx: OffscreenCanvasRenderingContext2D;
	private lines: Line[] = [];
	private text: Text[] = [];
	private codeCache: { [key: string]: string } = {};

	constructor(ctx: OffscreenCanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	draw = () => {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.drawLineComponents();
		this.drawTextComponents();
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

	private handleTextPrefix = (text: Text, i: number) => {
		if (text.value === "# ") {
			this.text[i].value = "";
			this.text[i].type = TextType.heading1;
		} else if (text.value === "## ") {
			this.text[i].value = "";
			this.text[i].type = TextType.heading2;
		} else if (text.value === "### ") {
			this.text[i].value = "";
			this.text[i].type = TextType.heading3;
		} else if (text.value.startsWith("``` ") && text.value.endsWith(" ")) {
			const lang = text.value.slice(4, -1);
			if (Object.values(Languages).includes(lang as Languages)) {
				this.text[i].value = "";
				this.text[i].type = TextType.code;
				this.text[i].language = lang as Languages;
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
			this.handleTextPrefix(text, i);
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

	startTextDraw = (position: Point) => {
		this.text.push({
			id: uuidv7(),
			position,
			value: "",
			type: TextType.paragraph,
			isEditing: true,
			language: Languages.plain,
		});
	};

	changeTextType = (type: TextType) => {
		this.text[this.text.length - 1].type = type;
	};

	continueTextDraw = (value: string) => {
		const currentText = this.text[this.text.length - 1];
		if (value === "Backspace") {
			currentText.value = currentText.value.slice(0, -1);
		} else {
			currentText.value += value;
		}
	};

	endTextDraw = () => {
		this.text[this.text.length - 1].isEditing = false;
		this.draw();
		return this.text.pop();
	};

	startLineDraw = (points: { x: number; y: number }) => {
		this.lines.push({
			id: uuidv7(),
			points: [
				{ x: points.x, y: points.y },
				{ x: points.x, y: points.y },
			],
			bezier: false,
		});
	};

	continueLineDraw = (points: { x: number; y: number }) => {
		if (this.lines.length === 0) throw new Error("No line to continue");
		let lastLine = this.lines[this.lines.length - 1];
		let lastPoint = lastLine.points[lastLine.points.length - 1];
		lastPoint.x = points.x;
		lastPoint.y = points.y;
	};

	endLineDraw = (points: { x: number; y: number }) => {
		if (this.lines.length === 0) throw new Error("No line to end");
		let lastLine = this.lines[this.lines.length - 1];
		let lastPoint = lastLine.points[lastLine.points.length - 1];
		lastPoint.x = points.x;
		lastPoint.y = points.y;
		return this.lines.pop();
	};
}
