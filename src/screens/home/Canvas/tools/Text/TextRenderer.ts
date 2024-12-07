import rough from "roughjs";
import { findBoundaries } from "../Select/Select.util";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Line } from "./Line.type";
import { highlightCode } from "@lezer/highlight";

export const renderLine = (
	text?: Text,
	ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
) => {

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
};
