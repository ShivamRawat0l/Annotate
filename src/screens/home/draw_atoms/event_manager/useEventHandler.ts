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
	let removeEventListeners: (() => void)[] = [];

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
			const func = fn(CanvasType.both);
			dynamicRef.current?.addEventListener(permission, func);
			removeEventListeners.push(() => {
				dynamicRef.current?.removeEventListener(permission, func);
			});
		} else if (staticPermission) {
			const func = fn(CanvasType.static);
			dynamicRef.current?.addEventListener(permission, func);
			removeEventListeners.push(() => {
				dynamicRef.current?.removeEventListener(permission, func);
			});
		} else if (dynamicPermission) {
			const func = fn(CanvasType.dynamic);
			dynamicRef.current?.addEventListener(permission, func);
			removeEventListeners.push(() => {
				dynamicRef.current?.removeEventListener(permission, func);
			});
		}
	};

	useEffect(() => {
		if (!eventHandler) return;
		// NOTE: Not reading in the dismount because deregistering event in the else case
		removeEventListeners.forEach((fn) => fn());
		removeEventListeners = [];
		registerEventIfPermission(
			ToolEventPermissions.click,
			(canvasType: CanvasType) => {
				return (event: Event) => {
					eventHandler.click(event, canvasType);
				};
			}
		);
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
		return () => {
			removeEventListeners.forEach((fn) => fn());
		};
	}, [toolSelected, eventHandler]);

	return { toolSelected, onToolSelect, tools };
};
