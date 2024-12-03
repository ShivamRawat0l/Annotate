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

export enum ToolEvents {
	text,
	line,
	shape,
	select,
}

type ToolDetailType = {
	event: ToolEvents;
	name: string;
};

export const ToolDetails: { [key in ToolsID]: ToolDetailType } = {
	[ToolsID.grab]: {
		event: ToolEvents.select,
		name: "Grab",
	},
	[ToolsID.cursor]: {
		event: ToolEvents.select,
		name: "Cursor",
	},
	[ToolsID.text]: {
		event: ToolEvents.text,
		name: "Text",
	},
	[ToolsID.line]: {
		event: ToolEvents.line,
		name: "Line",
	},
	[ToolsID.rectangle]: {
		event: ToolEvents.shape,
		name: "Rectangle",
	},
	[ToolsID.circle]: {
		event: ToolEvents.shape,
		name: "Circle",
	},
	[ToolsID.diamond]: {
		event: ToolEvents.shape,
		name: "Diamond",
	},
	[ToolsID.cylinder]: {
		event: ToolEvents.shape,
		name: "Cylinder",
	},
	[ToolsID.box]: {
		event: ToolEvents.shape,
		name: "Box",
	},
	[ToolsID.cone]: {
		event: ToolEvents.shape,
		name: "Cone",
	},
	[ToolsID.pentagon]: {
		event: ToolEvents.shape,
		name: "Pentagon",
	},
	[ToolsID.chart]: {
		event: ToolEvents.shape,
		name: "Chart",
	},
	[ToolsID.slash]: {
		event: ToolEvents.shape,
		name: "Slash",
	},
	[ToolsID.table]: {
		event: ToolEvents.shape,
		name: "Table",
	},
	[ToolsID.arrow]: {
		event: ToolEvents.select,
		name: "Arrow",
	},
	[ToolsID.eraser]: {
		event: ToolEvents.select,
		name: "Eraser",
	},
	[ToolsID.directionalLine]: {
		event: ToolEvents.line,
		name: "Directional Line",
	},
	[ToolsID.segment]: {
		event: ToolEvents.line,
		name: "Segment",
	},
	[ToolsID.pencil]: {
		event: ToolEvents.select,
		name: "Pencil",
	},
	[ToolsID.highlighter]: {
		event: ToolEvents.select,
		name: "Highlighter",
	},
	[ToolsID.lazer]: {
		event: ToolEvents.select,
		name: "Lazer",
	},
	[ToolsID.shape]: {
		event: ToolEvents.shape,
		name: "Shape",
	},
};
