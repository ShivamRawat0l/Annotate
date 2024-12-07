import { TextType, Languages } from "../Text.type";

export const validCharacters =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=`~{}[]:\";',./<>?\\| ";

export const handleTextPrefix = (prefix: string) => {
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
	if (prefix.startsWith("``` ") && prefix.endsWith(" ")) {
		const lang = prefix.slice(4, -1);
		if (Object.values(Languages).includes(lang as Languages)) {
			return {
				value: "",
				type: TextType.code,
				language: lang as Languages,
			};
		}
	}
};
