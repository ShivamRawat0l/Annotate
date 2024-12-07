import { useEffect, useMemo, useState } from "react";
import { EventHandler } from "./EventHandler";
import { toolManager, type ToolDetailType } from "../tools/ToolManagerDynamic";
import { ToolEventPermissions } from "../tools/ToolManager.abstract";
import { CanvasType } from "./Events.type";

export const useEventHandler = (
	dynamicRef: React.RefObject<HTMLCanvasElement>,
	staticRef: React.RefObject<HTMLCanvasElement>
) => {
	const [toolSelected, setToolSelected] = useState<ToolDetailType>();
	const [eventHandler, setEventHandler] = useState<EventHandler>();
	const tools = useMemo(() => toolManager.fetchRegisteredTools(), []);

	useEffect(() => {
		if (!eventHandler) {
			setEventHandler(new EventHandler(dynamicRef, staticRef));
		}
	}, []);

	const onToolSelect = (tool: ToolDetailType) => {
		toolManager.selectTool(tool);
		eventHandler?.onSelectTool();
		setToolSelected(tool);
	};

	const registerEventIfPermission = (
		permission: ToolEventPermissions,
		fn: (canvasType: CanvasType) => (event: Event) => void
	) => {
		const staticPermission =
			toolSelected?.staticPermissions.includes(permission);
		const dynamicPermission =
			toolSelected?.dynamicPermissions.includes(permission);

		if (staticPermission && dynamicPermission) {
			dynamicRef.current?.addEventListener(
				permission,
				fn(CanvasType.both)
			);
		} else if (staticPermission) {
			dynamicRef.current?.addEventListener(
				permission,
				fn(CanvasType.static)
			);
		} else if (dynamicPermission) {
			dynamicRef.current?.addEventListener(
				permission,
				fn(CanvasType.dynamic)
			);
		} else {
			dynamicRef.current?.removeEventListener(
				permission,
				fn(CanvasType.both)
			);
			dynamicRef.current?.removeEventListener(
				permission,
				fn(CanvasType.dynamic)
			);
			dynamicRef.current?.removeEventListener(
				permission,
				fn(CanvasType.static)
			);
		}
	};

	useEffect(() => {
		if (!eventHandler) return;
		// NOTE: Not reading in the dismount because deregistering event in the else case
		registerEventIfPermission(
			ToolEventPermissions.keydown,
			(canvasType: CanvasType) => {
				return (event: Event) => {
					eventHandler.keydown(event, canvasType);
				};
			}
		);
		registerEventIfPermission(
			ToolEventPermissions.mousedown,
			(canvasType: CanvasType) => {
				return (event: Event) => {
					eventHandler.mousedown(event as MouseEvent, canvasType);
				};
			}
		);
		registerEventIfPermission(
			ToolEventPermissions.mouseup,
			(canvasType: CanvasType) => {
				return (event: Event) => {
					eventHandler.mouseup(event as MouseEvent, canvasType);
				};
			}
		);
		registerEventIfPermission(
			ToolEventPermissions.mousemove,
			(canvasType: CanvasType) => {
				return (event: Event) => {
					eventHandler.mousemove(event as MouseEvent, canvasType);
				};
			}
		);
	}, [toolSelected, eventHandler]);

	return { toolSelected, onToolSelect, tools };
};
