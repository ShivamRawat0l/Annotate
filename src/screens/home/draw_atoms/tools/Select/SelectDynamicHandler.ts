import type { RoughCanvas } from "roughjs/bin/canvas";
import type { CapturedEvents } from "../../postman/Post.types";
import type { Postman } from "../../postman/Postman";
import { renderLine } from "../Lines/LineRenderer";
import {
    DynamicHandlerBaseClass,
    ToolEventPermissions,
    type ToolData,
} from "../ToolManager.abstract";
import rough from "roughjs";
import type { Line } from "../Lines/Line.type";
import { renderSelectedElementBorder } from "./SelectRenderer";

export class SelectDynamicHandler extends DynamicHandlerBaseClass {
    private tooldata: ToolData | undefined;
    private removeListener: (() => void) | undefined;
    private ctx: CanvasRenderingContext2D | undefined;
    private roughCanvas: RoughCanvas | undefined;
    private isMouseDown = false;
    private postman: Postman | undefined;

    render(ctx: CanvasRenderingContext2D, postman: Postman) {
        this.ctx = ctx;
        this.roughCanvas = rough.canvas(ctx);
        this.postman = postman;
        this.removeListener = postman.registerCanvasMessage((event: any) => {
            if (event.type === "select") {
                this.tooldata = event.element;
                this.tooldata.selected = false;
                this.renderSelectedElement();
            }
        });
    }

    deinit() {
        this.postman?.sendEvents({
            type: "deselect",
            element: this.tooldata,
        });
        if (this.removeListener) this.removeListener();
    }

    renderSelectedElement = () => {
        if (this.tooldata && this.tooldata.toolname === "line") {
            requestAnimationFrame(() => {
                if (!this.ctx) return;
                this.ctx.clearRect(
                    0,
                    0,
                    this.ctx.canvas.width,
                    this.ctx.canvas.height
                );
                renderLine(this.tooldata as Line, this.ctx, this.roughCanvas);
                renderSelectedElementBorder(this.ctx, this.tooldata);
            });
        }
    };

    onEvent(toolEvent: ToolEventPermissions, event: CapturedEvents): void {
        switch (toolEvent) {
            case ToolEventPermissions.mousedown:
                this.onMouseDown();
                break;
            case ToolEventPermissions.mousemove:
                this.onMouseMove(event);
                break;
            case ToolEventPermissions.mouseup:
                this.onMouseUp();
                break;
        }
    }

    private onMouseDown = () => {
        this.isMouseDown = true;
    };

    private onMouseMove = (event: CapturedEvents) => {
        if (!this.isMouseDown) return;
        const { movementX, movementY } = event;
        if (this.tooldata) {
            this.tooldata.position.x += movementX ?? 0;
            this.tooldata.position.y += movementY ?? 0;
            this.renderSelectedElement();
        }
    };

    private onMouseUp = () => {
        this.isMouseDown = false;
        this.postman?.sendEvents({
            type: "deselect",
            element: this.tooldata,
        });
    };
}
