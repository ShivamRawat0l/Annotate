import type { Point } from "../../../Events.type";

export const findBoundaries = (point1: Point, point2: Point) => {
	let minBoundingX, maxBoundingX, minBoundingY, maxBoundingY;
	if (point1.x < point2.x) {
		minBoundingX = point1.x;
		maxBoundingX = point2.x;
	} else {
		minBoundingX = point2.x;
		maxBoundingX = point1.x;
	}
	if (point1.y < point2.y) {
		minBoundingY = point1.y;
		maxBoundingY = point2.y;
	} else {
		minBoundingY = point2.y;
		maxBoundingY = point1.y;
	}
	return { minBoundingX, maxBoundingX, minBoundingY, maxBoundingY };
};
