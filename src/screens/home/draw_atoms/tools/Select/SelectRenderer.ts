import type { Line } from "../Lines/Line.type";
import { findBoundaries } from "./Select.util";

export const renderSelectedElementBorder = (ctx: CanvasRenderingContext2D, tooldata: any) => {
    if (tooldata && tooldata.toolname === "line") {
        let line = tooldata as Line;
        let { minBoundingX, maxBoundingX, minBoundingY, maxBoundingY } =
            findBoundaries(
                line.boundingbox[0],
                line.boundingbox[1]
            );
        minBoundingX += line.position.x;
        maxBoundingX += line.position.x;
        minBoundingY += line.position.y;
        maxBoundingY += line.position.y;
        ctx.beginPath()
        ctx.strokeStyle = "#ff0000";
        ctx.rect(
            minBoundingX,
            minBoundingY,
            maxBoundingX - minBoundingX,
            maxBoundingY - minBoundingY
        );
        ctx.stroke();
    }
};
