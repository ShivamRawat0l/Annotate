type ColorsType = {
	primary: string;
	secondary: string;
	tertiary: string;
	background: string;
	text: string;
	secondaryText: string;
	input: string;
	border: string;
	hover: string;
	selected: string;
	dragAndDrop: string;
	collpaseButton: string;
};

export type ThemeColors = {
	dark: ColorsType;
	light: ColorsType;
	custom: ColorsType;
};

const zinc_950 = "#09090b";
const zinc_900 = "#171717";
const zinc_800 = "#27272a";
const zinc_700 = "#3f3f46";

export const Colors: ThemeColors = {
	custom: {
		primary: "#ff9f5c",
		secondary: "#333",
		tertiary: zinc_700,
		background: zinc_950,
		text: "#fff",
		secondaryText: "#aaa",
		input: zinc_800,
		border: zinc_900,
		hover: "#ff9f5c22",
		selected: "#ff9f5c77",
		dragAndDrop: "#ff9f5c22",
		collpaseButton: "#3e144f",
	},
	dark: {
		primary: "#ff9f5c",
		secondary: "#333",
		tertiary: zinc_700,
		background: zinc_950,
		text: "#fff",
		secondaryText: "#aaa",
		input: zinc_800,
		border: zinc_900,
		hover: "#ff9f5c22",
		selected: "#ff9f5c77",
		dragAndDrop: "#ff9f5c22",
		collpaseButton: "#3e144f",
	},
	light: {
		primary: "#fff",
		secondary: "#eee",
		tertiary: "#ddd",
		background: "#f9f9f9",
		text: "#000",
		secondaryText: "#666",
		input: "#fff",
		border: "#ccc",
		hover: "#ff9f5c22",
		selected: "#ff9f5c77",
		dragAndDrop: "#ff9f5c22",
		collpaseButton: "#9e94af",
	},
};
