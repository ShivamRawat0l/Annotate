import type { Point } from "framer-motion";
import type { ToolData } from "../ToolManager.abstract";

export enum LineType {
    straight,
    curve,
}

export enum LineStroke {
    dotted,
    solid,
}

export enum LineThickness {
    thin = 1,
    medium = 2,
    thick = 3,
    black = 4,
}

export type LineStyle = {
    strokeWidth: LineThickness;
    color: string;
    lineType: LineType;
    strokeType: LineStroke;
};

export interface Line extends ToolData {
    points: Point[];
    style: LineStyle;
    toolname: "line"
};

export enum LineEventType {
    ADD_LINE = "add_line",
}
