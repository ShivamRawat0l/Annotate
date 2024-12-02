import type { ToolsID } from "../tools/Tools";

export enum EventState {
	starting,
	continuing,
	ending,
}

export type EventData =
	| {
			type: ToolsID;
			points?: { x: number; y: number };
			state: EventState;
			value?: string;
	  }
	| {
			type: "draw";
			offscreen: OffscreenCanvas;
	  };

export type Line = {
	id: string;
	points: Point[];
	bezier: boolean;
};

export type Point = {
	x: number;
	y: number;
};

export enum Languages {
	cpp = "cpp",
	css = "css",
	go = "go",
	html = "html",
	java = "java",
	javascript = "javascript",
	json = "json",
	markdown = "markdown",
	php = "php",
	python = "python",
	rust = "rust",
	sass = "sass",
	xml = "xml",
	yaml = "yaml",
	closure = "closure",
	plain = "plain",
}

export enum TextType {
	heading1 = "heading1",
	heading2 = "heading2",
	heading3 = "heading3",
	paragraph = "paragraph",
	code = "code",
}

export type Text = {
	id: string;
	position: Point;
	value: string;
	type: TextType;
	isEditing: boolean;
	language: Languages;
};
