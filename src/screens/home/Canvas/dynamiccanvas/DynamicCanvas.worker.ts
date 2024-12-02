import { Canvas } from "./DynamicCanvasHandler";
import { EventState, type EventData } from "./Events";
enum ToolsID {
	grab,
	cursor,
	text,
	rectangle,
	line,
	circle,
	pencil,
	highlighter,
	lazer,
	shape,
	chart,
	slash,
	table,
	arrow,
	segment,
	eraser,
	directionalLine,
	diamond,
	cylinder,
	box,
	cone,
	pentagon,
}
export enum MessageType {
	draw,
	startLine,
	continueLine,
	endLine,
	startText,
	continueText,
	endText,
}
let canvas: Canvas | undefined;
let context: OffscreenCanvasRenderingContext2D | null;
let isDrawing = false;
let lastDrawTime = 0;

const draw = (time: number) => {
	if (lastDrawTime == 0) {
		lastDrawTime = time;
	}
	const timePassed = time - lastDrawTime;
	if (!canvas) return;
	if (isDrawing && timePassed > 3) {
		canvas.draw();
		lastDrawTime = time;
	}
	requestAnimationFrame(draw);
};
requestAnimationFrame(draw);

const startDrawing = () => {
	canvas?.draw();
	isDrawing = true;
};

const stopDrawing = () => {
	canvas?.draw();
	isDrawing = false;
};

onmessage = (event: MessageEvent<EventData>) => {
	console.log(event.data, "HERE2222");
	switch (event.data.type) {
		case "draw":
			console.log(event.data);
			const offscreen = event.data.offscreen;
			context = offscreen.getContext("2d");
			if (!context) return;
			canvas = new Canvas(context);
			const fontFace = new FontFace(
				"Schoolbell",
				"url('../../../fonts/Schoolbell.woff2')"
			);
			const mononoki = new FontFace(
				"Mononoki",
				"url('../../../fonts/Mononoki.woff2')"
			);
			(self as any).fonts?.add(fontFace);
			(self as any).fonts?.add(mononoki);
			fontFace.load();
			mononoki.load();
			break;
		case ToolsID.line:
			if (!event.data.points) return;
			if (event.data.state === EventState.starting) {
				startDrawing();
				canvas?.startLineDraw(event.data.points);
			} else if (event.data.state === EventState.continuing) {
				canvas?.continueLineDraw(event.data.points);
			} else if (event.data.state === EventState.ending) {
				stopDrawing();
				postMessage({
					type: ToolsID.line,
					element: canvas?.endLineDraw(event.data.points),
				});
			}
			break;

		case ToolsID.text:
			if (event.data.state === EventState.starting) {
				startDrawing();
				if (!event.data.points) return;
				canvas?.startTextDraw(event.data.points);
			} else if (event.data.state === EventState.continuing) {
				if (!event.data.value) return;
				canvas?.continueTextDraw(event.data.value);
			} else if (event.data.state === EventState.ending) {
				stopDrawing();
				postMessage({
					type: ToolsID.text,
					element: canvas?.endTextDraw(),
				});
			}
			break;
		case ToolsID.line:
			if (!event.data.points) return;
			if (event.data.state === EventState.starting) {
				startDrawing();
				canvas?.startLineDraw(event.data.points);
			} else if (event.data.state === EventState.continuing) {
				canvas?.continueLineDraw(event.data.points);
			} else if (event.data.state === EventState.ending) {
				stopDrawing();
				postMessage({
					type: ToolsID.line,
					element: canvas?.endLineDraw(event.data.points),
				});
			}
			break;

		case ToolsID.text:
			if (event.data.state === EventState.starting) {
				startDrawing();
				if (!event.data.points) return;
				canvas?.startTextDraw(event.data.points);
			} else if (event.data.state === EventState.continuing) {
				if (!event.data.value) return;
				canvas?.continueTextDraw(event.data.value);
			} else if (event.data.state === EventState.ending) {
				const poppedElement = canvas?.endTextDraw();
				postMessage({
					type: ToolsID.text,
					element: poppedElement,
				});
				stopDrawing();
			}
			break;
	}
};
