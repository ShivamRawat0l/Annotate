import {
	DynamicToStaticCanvasMessageEvents,
	type DynamicToStaticCanvasMessage,
} from "../postman/Post.types";
import { StaticCanvasHandler } from "./StaticCanvasHandler";

let context: OffscreenCanvasRenderingContext2D | null;
let staticCanvasHandler: StaticCanvasHandler | undefined;

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

const sendMessageToDynamicCanvas = (message: any) => {
	postMessage(message);
};

onmessage = (event: MessageEvent<DynamicToStaticCanvasMessage>) => {
	if (event.data.type === DynamicToStaticCanvasMessageEvents.START) {
		if ("offscreen" in event.data) {
			const offscreen = event.data.offscreen;
			context = offscreen.getContext("2d");
			if (!context) return;
			loadFonts();
			staticCanvasHandler = new StaticCanvasHandler(
				context,
				self as unknown as Worker
			);
		}
	} else if (
		event.data.type === DynamicToStaticCanvasMessageEvents.SELECT_TOOL
	) {
		if ("id" in event.data) {
			staticCanvasHandler?.onSelectTool(event.data.id);
		}
	} else {
		if ("event" in event.data) {
			staticCanvasHandler?.onEvent(event.data.type, event.data.event);
		}
	}
};
