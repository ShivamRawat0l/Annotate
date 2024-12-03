import { useEffect, useState } from "react";
import { ToolsID } from "./ToolsDetails";

export const useTools = () => {
	const [tools, setTools] = useState<ToolsID[]>([]);

	useEffect(() => {
		setTools([
			ToolsID.grab,
			ToolsID.cursor,
			ToolsID.text,
			ToolsID.pencil,
			ToolsID.rectangle,
			ToolsID.line,
		]);
	}, []);

	return { tools };
};
