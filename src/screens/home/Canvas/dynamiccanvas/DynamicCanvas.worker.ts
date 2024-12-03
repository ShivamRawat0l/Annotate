import { ToolsID } from "../tools/ToolsDetails";
import { DynamicCanvasHandler } from "./DynamicCanvasHandler";
import { DrawEvents, EventState, type EventData } from "./Events.type";
import type { Line } from "./Tools/Lines/Line.type";
import type { Text } from "./Tools/Texts/Text/Text.type";

let canvas: DynamicCanvasHandler | undefined;
let context: OffscreenCanvasRenderingContext2D | null;

const draw = () => {
	if (!canvas) return;
	requestAnimationFrame(canvas.draw);
};

const loadFonts = () => {
	const fontFace = new FontFace(
		"Schoolbell",
		"url('../../../../fonts/Schoolbell.woff2')"
	);
	const mononoki = new FontFace(
		"Mononoki",
		"url('../../../../fonts/Mononoki.woff2')"
	);
	(self as any).fonts?.add(fontFace);
	(self as any).fonts?.add(mononoki);
	fontFace.load();
	mononoki.load();
};

const onEndLineDraw = (element: Line) => {
	postMessage({
		type: ToolsID.line,
		element: element,
	});
};

const onEndTextDraw = (element: Text) => {
	postMessage({
		type: ToolsID.text,
		element: element,
	});
};

onmessage = (event: MessageEvent<EventData>) => {
	switch (event.data.type) {
		case DrawEvents.draw:
			if (!event.data.offscreen) return;
			const offscreen = event.data.offscreen;
			context = offscreen.getContext("2d");
			if (!context) return;
			canvas = new DynamicCanvasHandler(context);
			loadFonts();
			break;
		case ToolsID.line:
			canvas?.lineHandler.handleLineEvent(event.data, onEndLineDraw);
			draw();
			setTimeout(() => {
				draw();
			}, 500);
			break;
		case ToolsID.text:
			canvas?.textHandler.handleTextEvent(event.data, onEndTextDraw);
			draw();
			break;
	}
};
