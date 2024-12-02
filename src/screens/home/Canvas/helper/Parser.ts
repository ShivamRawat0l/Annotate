import { TextType, type Text } from "../dynamiccanvas/Events";

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

let parserCache: { [key: string]: any } = {};

export const loadParser = async (language: Languages) => {
	if (parserCache[language]) {
		return parserCache[language];
	}
	switch (language) {
		case Languages.cpp:
			parserCache[language] = (await import("@lezer/cpp")).parser;
			break;
		case Languages.css:
			parserCache[language] = (await import("@lezer/css")).parser;
			break;
		case Languages.go:
			parserCache[language] = (await import("@lezer/go")).parser;
			break;
		case Languages.html:
			parserCache[language] = (await import("@lezer/html")).parser;
			break;
		case Languages.java:
			parserCache[language] = (await import("@lezer/java")).parser;
			break;
		case Languages.javascript:
			parserCache[language] = (await import("@lezer/javascript")).parser;
			break;
		case Languages.json:
			parserCache[language] = (await import("@lezer/json")).parser;
			break;
		case Languages.markdown:
			parserCache[language] = (await import("@lezer/markdown")).parser;
			break;
		case Languages.php:
			// @ts-ignore
			parserCache[language] = (await import("@lezer/php")).parser;
			break;
		case Languages.python:
			parserCache[language] = (await import("@lezer/python")).parser;
			break;
		case Languages.rust:
			parserCache[language] = (await import("@lezer/rust")).parser;
			break;
		case Languages.sass:
			parserCache[language] = (await import("@lezer/sass")).parser;
			break;
		case Languages.xml:
			parserCache[language] = (await import("@lezer/xml")).parser;
			break;
		case Languages.yaml:
			parserCache[language] = (await import("@lezer/yaml")).parser;
			break;
		case Languages.closure:
			parserCache[language] = //@ts-ignore
				(await import("@nextjournal/lezer-clojure")).parser;
			break;
		default:
			parserCache[language] = null;
	}
	if (!parserCache[language]) {
		throw new Error(`Unsupported language: ${language}`);
	}
	return parserCache[language];
};

export const handleTextPrefix = (text: Text, i: number) => {
	var newText = { value: "", type: TextType.paragraph };
	if (text.value === "# ") {
		text.value = "";
		text.type = TextType.heading1;
	} else if (text.value === "## ") {
		text.value = "";
		text.type = TextType.heading2;
	} else if (text.value === "### ") {
		text.value = "";
		text.type = TextType.heading3;
	} else if (text.value.startsWith("``` ") && text.value.endsWith(" ")) {
		const lang = text.value.slice(4, -1);
		if (Object.values(Languages).includes(lang as Languages)) {
			text.value = "";
			text.type = TextType.code;
			text.language = lang as Languages;
		}
	}
};
