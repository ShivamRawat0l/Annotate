import type { Point } from "../../Events.type";

export type Line = {
	id: string;
	points: Point[];
	bezier: boolean;
};
