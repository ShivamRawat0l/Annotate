import type { ToolsID } from "../tools/ToolsDetails";

export enum EventState {
	starting,
	continuing,
	ending,
}

export enum DrawEvents {
	draw,
	redraw,
}

export type EventData =
	| {
			type: ToolsID;
			points?: { x: number; y: number };
			state: EventState;
			value?: string;
	  }
	| {
			type: DrawEvents;
			offscreen?: OffscreenCanvas;
	  };

export type Point = {
	x: number;
	y: number;
};
