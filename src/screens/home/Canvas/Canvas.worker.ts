import { Canvas } from "./Canvas";

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
let context: OffscreenCanvasRenderingContext2D | undefined;

const draw = (time: number) => {
	if (!canvas) return;
	canvas.draw(time);
	requestAnimationFrame(draw);
};
requestAnimationFrame(draw);

onmessage = (event) => {
	switch (event.data.type) {
		case MessageType.draw:
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
		case MessageType.startLine:
			canvas?.startLineDraw(event.data.points);
			break;
		case MessageType.continueLine:
			canvas?.continueLineDraw(event.data.points);
			break;
		case MessageType.endLine:
			canvas?.endLineDraw(event.data.points);
			break;
		case MessageType.startText:
			canvas?.startTextDraw(event.data.points);
			break;
		case MessageType.continueText:
			canvas?.continueTextDraw(event.data.value);
			break;
		case MessageType.endText:
			canvas?.endTextDraw();
			break;
	}
};
