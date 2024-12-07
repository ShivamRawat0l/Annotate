const wheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
	staticCanvas?.panCanvas(0, -event.deltaY);
};
