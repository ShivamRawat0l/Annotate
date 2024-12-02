export enum ToolsID {
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

export enum DOMEvents {
	onmousedown,
	onmousemove,
	onmousemoveaftersingleclick,
	onmouseup,
	onkeydown,
	onpressenter,
	onpressescape,
}

export type ToolEventDetails = {
	start: DOMEvents[];
	continue: DOMEvents[];
	end: DOMEvents[];
};

export type ToolDetails = {
	id: ToolsID;
	toolName: string;
	icon: React.ReactNode;
	subTools?: ToolDetails[];
};

export const GetTypePermissions = (tool: ToolsID) => {
	switch (tool) {
		case ToolsID.text:
			return {
				start: [DOMEvents.onmousedown],
				continue: [DOMEvents.onkeydown],
				end: [DOMEvents.onpressenter, DOMEvents.onpressescape],
			};
		case ToolsID.line:
			return [
				{
					start: [DOMEvents.onmousedown],
					continue: [DOMEvents.onmousemove],
					end: [DOMEvents.onmouseup],
				},
				{
					start: [DOMEvents.onmousedown],
					continue: [DOMEvents.onmousemoveaftersingleclick],
					end: [DOMEvents.onpressescape, DOMEvents.onpressenter],
				},
			];
		default:
			return {
				start: [],
				continue: [],
				end: [],
			};
	}
};
