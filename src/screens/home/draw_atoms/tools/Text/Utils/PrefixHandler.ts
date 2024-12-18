import { Languages, TextType } from "../Text.type";

export const validCharacters =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=`~{}[]:\";',./<>?\\| ";

// NOTE: Here the space is &nbsp; space and not the not the default space
export const handleTextPrefix = (prefix: string) => {
	prefix.replaceAll(" ", " ")
	switch (prefix) {
		case "# ":
			return {
				value: "",
				type: TextType.heading1,
				language: Languages.plain,
			};
		case "## ":
			return {
				value: "",
				type: TextType.heading2,
				language: Languages.plain,
			};
		case "### ":
			return {
				value: "",
				type: TextType.heading3,
				language: Languages.plain,
			};
	}
	if (prefix.startsWith("```") && prefix.endsWith(" ")) {
		const lang = prefix.slice(3, -1);
		if (Object.values(Languages).includes(lang as Languages)) {
			return {
				value: "",
				type: TextType.code,
				language: lang as Languages,
			};
		}
	}
};
