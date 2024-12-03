import type { Point } from "../../../DynamicCanvasHandler";

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
