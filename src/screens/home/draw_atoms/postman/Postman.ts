import {
	DynamicToStaticCanvasMessageEvents,
	type DynamicToStaticCanvasMessage,
} from "./Post.types";

export class Postman {
	worker: Worker;

	constructor(worker: Worker) {
		this.worker = worker;
	}

	sendEvents = (event: DynamicToStaticCanvasMessage) => {
		this.postMessage(event);
	};

	loadStaticCanvas = (offscreen: OffscreenCanvas) => {
		this.postMessage(
			{
				type: DynamicToStaticCanvasMessageEvents.START,
				offscreen: offscreen,
			},
			[offscreen]
		);
	};

	registerCanvasMessage = <T>(callback: (event: T) => void) => {
		const postmanEvent = (event: MessageEvent<T>) => {
			callback(event.data);
		};
		this.worker.addEventListener("message", postmanEvent);
		return () => {
			this.worker.removeEventListener("message", postmanEvent);
		};
	};

	private postMessage(event: DynamicToStaticCanvasMessage, args?: any[]) {
		if (args && args.length > 0) {
			this.worker.postMessage(event, args);
		} else {
			this.worker.postMessage(event);
		}
	}
}
