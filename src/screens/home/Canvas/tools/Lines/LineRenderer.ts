import rough from "roughjs";
import { findBoundaries } from "../Select/Select.util";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Line } from "./Line.type";

export const renderLine = (
	line?: Line,
	ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
	roughCanvas?: RoughCanvas
) => {
	if (!line) throw new Error("No line to draw");
	if (!ctx) throw new Error("No context to draw");
	if (!roughCanvas) throw new Error("No rough canvas to draw");
	const path: [number, number][] = [];
	for (let j = 0; j < line.points.length; j++) {
		path.push([line.points[j].x, line.points[j].y]);
	}
	roughCanvas.linearPath(path, {
		stroke: line.style.color,
		strokeWidth: line.style.strokeWidth,
	});
	if (line.selected) {
		const { minBoundingX, maxBoundingX, minBoundingY, maxBoundingY } =
			findBoundaries(line.points[0], line.points[1]);
		ctx.strokeStyle = "red";
		ctx.rect(
			minBoundingX,
			minBoundingY,
			maxBoundingX - minBoundingX,
			maxBoundingY - minBoundingY
		);
		ctx.stroke();
	}
};
