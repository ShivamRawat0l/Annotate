import type { Point } from "framer-motion";

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

export type Line = {
	id: string;
	points: Point[];
	style: LineStyle;
	selected: boolean;
	position: Point;
	boundingBox: [Point, Point];
};

export enum LineEventType {
	ADD_LINE = "add_line",
}
