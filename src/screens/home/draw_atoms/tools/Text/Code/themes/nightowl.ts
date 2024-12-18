type Theme = {
	".hljs": { background: string; color: string };
	".hljs-doctag": { color: string };
	".hljs-symbol": { color: string };
	".hljs-attribute": { color: string };
	".hljs-built_in": { color: string; fontStyle: string };
	".hljs-variable": { color: string };
	".hljs-title": { color: string; fontStyle: string };
	".hljs-class": { color: string };
	".hljs-addition": { color: string; fontStyle: string };
	".hljs-deletion": { color: string; fontStyle: string };
	".hljs-regexp": { color: string };
	".hljs-type": { color: string };
	".hljs-function": { color: string };
	".hljs-quote": { color: string; fontStyle: string };
	".hljs-link": { color: string };
	".hljs-emphasis": { color: string; fontStyle: string };
	".hljs-strong": { color: string; fontWeight: string };
	".hljs-keyword": { color: string; fontStyle: string };
	".hljs-literal": { color: string };
	".hljs-string": { color: string };
	".hljs-number": { color: string };
	".hljs-comment": { color: string; fontStyle: string };
	".hljs-meta": { color: string };
};

export const NightOwl: Theme = {
	".hljs": { background: "#011627", color: "#d6deeb" },
	".hljs-doctag": { color: "#7fdbca" }, // macroName
	".hljs-symbol": { color: "#82aaff" }, // variableName2 operator
	".hljs-attribute": { color: "#80cbc4" }, //labelName
	".hljs-built_in": { color: "#addb67", fontStyle: "italic" }, // atom
	".hljs-variable": { color: "#addb67" }, //variableName local
	".hljs-title": { color: "#DCDCAA", fontStyle: "italic" }, // heading
	".hljs-class": { color: "#ffcb8b" }, // classname
	".hljs-addition": { color: "#addb67ff", fontStyle: "italic" }, // inserted
	".hljs-deletion": { color: "#EF535090", fontStyle: "italic" }, // deleted invalid
	".hljs-regexp": { color: "#5ca7e4" }, // string2
	".hljs-type": { color: "#82aaff" }, // typeName namespace
	".hljs-function": { color: "#82AAFF" }, // propertyname definition;
	".hljs-quote": { color: "#697098", fontStyle: "italic" }, // punctuation
	".hljs-link": { color: "#ff869a" }, // url
	".hljs-emphasis": { color: "#c792ea", fontStyle: "italic" },
	".hljs-strong": { color: "#addb67", fontWeight: "bold" },
	".hljs-keyword": { color: "#c792ea", fontStyle: "italic" },
	".hljs-literal": { color: "#ff5874" }, //  bool
	".hljs-string": { color: "#ecc48d" },
	".hljs-number": { color: "#F78C6C" },
	".hljs-comment": { color: "#637777", fontStyle: "italic" },
	".hljs-meta": { color: "#82aaff" },
};

export const LezerMapper: { [key: string]: keyof Theme } = {
	"tok-link": ".hljs-link",
	"tok-macroName": ".hljs-doctag",
	"tok-operator": ".hljs-symbol",
	"tok-variableName2": ".hljs-symbol",
	"tok-labelName": ".hljs-attribute",
	"tok-atom": ".hljs-built_in",
	"tok-variableName": ".hljs-variable",
	"tok-local": ".hljs-variable",
	"tok-heading": ".hljs-title",
	"tok-className": ".hljs-class",
	"tok-inserted": ".hljs-addition",
	"tok-deleted": ".hljs-deletion",
	"tok-invalid": ".hljs-deletion",
	"tok-propertyName": ".hljs-function",
	"tok-definition": ".hljs-function",
	"tok-string2": ".hljs-regexp",
	"tok-punctuation": ".hljs-quote",
	"tok-url": ".hljs-link",
	"tok-typeName": ".hljs-type",
	"tok-namespace": ".hljs-type",
	"tok-emphasis": ".hljs-emphasis",
	"tok-strong": ".hljs-strong",
	"tok-keyword": ".hljs-keyword",
	"tok-literal": ".hljs-literal",
	"tok-bool": ".hljs-literal",
	"tok-string": ".hljs-string",
	"tok-number": ".hljs-number",
	"tok-comment": ".hljs-comment",
	"tok-meta": ".hljs-meta",
};
