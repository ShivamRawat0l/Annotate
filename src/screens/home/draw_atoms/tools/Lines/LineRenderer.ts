import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Line } from "./Line.type";

export const renderLine = (
    line?: Line,
    ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    roughCanvas?: RoughCanvas
) => {
    if (!line || !ctx || !roughCanvas || line.selected) return;
    const path: [number, number][] = [];
    for (let j = 0; j < line.points.length; j++) {
        path.push([line.points[j].x + line.position.x, line.points[j].y + line.position.y]);
    }
    roughCanvas.linearPath(path, {
        stroke: line.style.color,
        strokeWidth: line.style.strokeWidth,
    });
};
