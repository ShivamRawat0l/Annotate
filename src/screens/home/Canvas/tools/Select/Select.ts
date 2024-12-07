import { v7 as uuidv7 } from "uuid";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import { ToolsID } from "../../../../tools/ToolsDetails";
import {
	type EventData,
	type Point,
	SelectEventState,
	type ToolElements,
} from "../../../Events.type";
import type { Line } from "../../Lines/Line.type";
import type { Text } from "../../Texts/Text/Text.type";
import { findBoundaries } from "./Select.util";

export class SelectRenderer {
	private worker: Worker;

	constructor(worker: Worker) {
		this.worker = worker;
	}

	onSelectElement = (points: Point, lines: Line[], text: Text[]) => {
		let oldLine: Line | null = null;
		const line = lines.find((line) => {
			const { minBoundingX, maxBoundingX, minBoundingY, maxBoundingY } =
				findBoundaries(line.points[0], line.points[1]);
			let isLeftBound = points.x > minBoundingX;
			let isRightBound = points.x < maxBoundingX;
			let isTopBound = points.y > minBoundingY;
			let isBottomBound = points.y < maxBoundingY;
			console.log(isLeftBound, isRightBound, isTopBound, isBottomBound);
			if (isLeftBound && isRightBound && isTopBound && isBottomBound) {
				if (line.selected) {
					oldLine = line;
				} else {
					return true;
				}
			}
			return false;
		});
		let selectedLine = line || oldLine;
		if (!selectedLine) return;
		selectedLine.selected = true;
		if (line || oldLine) {
			this.worker.postMessage({
				type: ToolsID.select,
				element: selectedLine,
			});
		}
	};
}

export class SelectHandler {
	private element: ToolElements | null = null;

	handleSelectEvent(
		data: EventData,
		onElementEnd: (element: ToolElements) => void
	) {
		if (data.type === ToolsID.select) {
			if (data.state === SelectEventState.end) {
				const element = this.endSelect();
				onElementEnd(element);
			}
			if (!data.element || !data.points)
				throw new Error("No Points to draw line");
			if (data.state === SelectEventState.select) {
				this.selectElement(data.element);
			} else if (data.state === SelectEventState.move) {
				this.moveElement(data.points.x, data.points.y);
			}
		}
	}

	private selectElement = (element: ToolElements) => {
		element.selected = true;
		this.element = element;
	};

	private moveElement = (x: number, y: number) => {
		if (!this.element) throw new Error("No element to move");
		this.element.position.x += x;
		this.element.position.y += y;
	};

	private endSelect = () => {
		if (!this.element) throw new Error("No element to end");
		this.element.selected = false;
		let element = this.element;
		this.element = null;
		return element;
	};
}
