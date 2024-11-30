export const StartDraw = (
	from: { x: number; y: number },
	ctx?: CanvasRenderingContext2D
) => {
	if (!ctx) return;
	console.log("Strarting Draw", from);
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
};

export const ContinueDraw = (
	to: { x: number; y: number },
	ctx?: CanvasRenderingContext2D
) => {
	if (!ctx) return;
	console.log("Continuing Draw", to);
	ctx.save();
	ctx.lineTo(to.x, to.y);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#fff";
	ctx.stroke();
	ctx.restore();
};

export const EndDraw = (
	to: { x: number; y: number },
	ctx?: CanvasRenderingContext2D
) => {
	if (!ctx) return;
	console.log("Ending Draw", to);
	ctx.lineTo(to.x, to.y);
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#fff";
	ctx.stroke();
};
