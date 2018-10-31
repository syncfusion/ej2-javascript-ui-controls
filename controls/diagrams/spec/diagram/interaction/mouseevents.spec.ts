import { KeyboardEvents } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/index';
/**
 * Triggers the mouse events
 */
export class MouseEvents {

    public clickEvent(element: Element, x: number, y: number, ctrl?: boolean, shift?: boolean): void {
        this.mouseDownEvent(element, x, y, ctrl, shift);
        this.mouseUpEvent(element, x, y, ctrl, shift);
    }

    public mouseDownEvent(element: Element, cx: number, cy: number, ctrl?: boolean, shift?: boolean): void {
        let mousedown: MouseEvent = document.createEvent('MouseEvent');
        mousedown.initMouseEvent('mousedown', false, false, window, 1, 0, 0, cx, cy, ctrl, false, shift, false, 0, null);
        element.dispatchEvent(mousedown);
    }

    public mouseMoveEvent(element: Element, cx: number, cy: number, ctrl?: boolean, shift?: boolean): void {
        let mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, 0, 0, cx, cy, ctrl, false, shift, false, 0, null);
        element.dispatchEvent(mousemove);
    }

    public mouseUpEvent(element: Element, cx: number, cy: number, ctrl?: boolean, shift?: boolean): void {
        let mouseup: MouseEvent = document.createEvent('MouseEvent');
        mouseup.initMouseEvent('mouseup', true, false, window, 1, 0, 0, cx, cy, ctrl, false, shift, false, 0, null);
        element.dispatchEvent(mouseup);
    }

    public dragAndDropEvent(
        element: Element, startX: number, startY: number, endX: number, endY: number, ctrl?: boolean, shift?: boolean): void {
        this.mouseDownEvent(element, startX, startY, ctrl, shift);
        this.mouseMoveEvent(element, endX, endY, ctrl, shift);
        this.mouseUpEvent(element, endX, endY, ctrl, shift);
    }

    public dragEvent(element: Element, startX: number, startY: number, endX: number, endY: number): void {
        this.mouseDownEvent(element, startX, startY);
        this.mouseMoveEvent(element, endX, endY);
    }

    public mouseLeaveEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseleave', false, false);
        element.dispatchEvent(click);
    }

    public mouseOverEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseover', false, false);
        element.dispatchEvent(click);
    }

    public mouseWheelEvent(element: Element, cx: number, cy: number, ctrlKey: boolean = false, shift: boolean = false): void {
        let wheelEvent: MouseWheelEvent = document.createEvent('WheelEvent') as MouseWheelEvent;
        wheelEvent.initMouseEvent('mousewheel', false, false, window, 1, 0, 0, cx, cy, ctrlKey, false, shift, false, 0, null);
        element.dispatchEvent(wheelEvent);
    }

    public dblclickEvent(element: Element, x: number, y: number, ctrl?: boolean, shift?: boolean): void {
        let dblclick: MouseEvent = document.createEvent('MouseEvent');
        dblclick.initMouseEvent('dblclick', false, false, window, 2, 0, 0, x, y, ctrl, false, shift, false, 2, null);
        element.dispatchEvent(dblclick);
    }

    public inputEvent(element: Element): void {
        let event = new Event('input', { 'bubbles': true, 'cancelable': true });
        element.dispatchEvent(event);
    }

    public focusOutEdit(element: Element): void {
        let focus: FocusEvent = document.createEvent('FocusEvent');
        focus.initEvent("focusout", true, true);
        element.dispatchEvent(focus);
    }

    public keyDownEvent(element: HTMLElement, key: string, controlKey?: boolean, shiftKey?: boolean, altKey?: boolean): void {
        let keyDown: KeyboardEvent = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: key, ctrlKey: controlKey, shiftKey: shiftKey, altKey: altKey });
        element.dispatchEvent(keyDown);
    }

    public keyUpEvent(element: Element, key: string, modifierKey: string): void {
        let keyUp: KeyboardEvent = document.createEvent('KeyboardEvent') as KeyboardEvent;
        keyUp.initKeyboardEvent('keyup', false, false, window, key, undefined, modifierKey, false, undefined);
        element.dispatchEvent(keyUp);
    }

    public touchdraganddropEvent(diagram: Diagram, element: Element, startX: number, startY: number, endX: number, endY: number): void {
        diagram['eventHandler'].mouseDown(<PointerEvent>this.onTouchStart(element, 0, 0, startX, startY, startX, startY));
        diagram['eventHandler'].mouseMove(<PointerEvent>this.onTouchMove(element, 0, 0, startX, startY, endX, endY), null);
        diagram['eventHandler'].mouseUp(<PointerEvent>this.onTouchEnd(element, 0, 0, startX, startY, endX, endY));
    }
    public onTouchStart(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Object {
        let touches: Object[] = [
            { pageX: x1, pageY: y1, clientX: x1, clientY: y1 }
        ];
        if (x2 && y2) {
            touches.push({ pageX: x2, pageY: y2, clientX: x2, clientY: y2 });
        }
        return {
            target: elem,
            type: 'touchstart',
            touches: touches,
            changedTouches: [
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3 }
            ]
        };
    }

    public onTouchEnd(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Object {
        let touches: Object[] = [
            { pageX: x1, pageY: y1, clientX: x1, clientY: y1 }
        ];
        if (x2 && y2) {
            touches.push({ pageX: x2, pageY: y2, clientX: x2, clientY: y2 })
        }
        return {
            target: elem,
            type: 'touchend',
            touches: touches,
            changedTouches: [
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3 }
            ]
        };
    }

    public onTouchMove(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Object {
        let touches: Object[] = [
            { pageX: x1, pageY: y1, clientX: x1, clientY: y1 }
        ];
        if (x2 && y2) {
            touches.push({ pageX: x2, pageY: y2, clientX: x2, clientY: y2 })
        }
        return {
            target: elem,
            type: 'touchmove',
            touches: touches,
            changedTouches: [
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3 }
            ]
        };
    }

    public onTouchLeave(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Object {
        let touches: Object[] = [
            { pageX: x1, pageY: y1, clientX: x1, clientY: y1 }
        ];
        if (x2 && y2) {
            touches.push({ pageX: x2, pageY: y2, clientX: x2, clientY: y2 })
        }
        return {
            target: elem,
            type: 'touchleave',
            touches: touches,
            changedTouches: [
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3 }
            ]
        };
    }

}