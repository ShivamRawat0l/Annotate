import { globalStyles } from "@/src/constants/Styles";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Colors } from "@/src/constants/Colors";
import { NotebookPenIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/src/theme/ThemeProvider";

export const PinnedNotes = () => {
	const [popupOpened, setPopupOpened] = useState(false);
	const { theme } = useTheme()

	useEffect(() => {
		document.addEventListener("keydown", shortcuts);
		return () => {
			document.removeEventListener("keydown", shortcuts);
		};
	}, []);

	const shortcuts = (e: KeyboardEvent) => {
		if (e.key === "p" && e.ctrlKey) {
			setPopupOpened((e) => !e);
		}
	};

	return (
		<Popover open={popupOpened}>
			<PopoverTrigger onClick={() => setPopupOpened((e) => !e)}>
				{popupOpened ? "📌" : "📌"}
			</PopoverTrigger>
			<PopoverContent
				style={{
					backgroundColor: Colors[theme].background,
					marginTop: 30,
				}}
			>
				<div
					style={{
						...globalStyles.flexRow,
						alignItems: "center",
						backgroundColor: Colors[theme].background,
					}}
				>
					<NotebookPenIcon />
					Javascript
					<Trash2Icon />
				</div>
			</PopoverContent>
		</Popover>
	);
};
