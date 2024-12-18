import type { ToolsID } from "../../ui/ToolsDetails";
import type { ToolData } from "../ToolManager.abstract";

export enum TextType {
	heading1 = "heading1",
	heading2 = "heading2",
	heading3 = "heading3",
	paragraph = "paragraph",
	default = "default",
	code = "code",
}
export interface TextTool extends ToolData {
	value: string;
	type: TextType;
	isEditing: boolean;
	language: Languages;
	toolType: ToolsID.text;
}

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
