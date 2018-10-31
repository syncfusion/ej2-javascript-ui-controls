/**
 * To create mouse events for spec
 */
export class MouseEvents {
    public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousemove);
    }
    public mouseLeaveEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseleave', false, false);
        element.dispatchEvent(click);
    }
    public mouseupEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mouseup: MouseEvent = document.createEvent('MouseEvent');
        mouseup.initMouseEvent('mouseup', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mouseup);
    }
    public mouseclickEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let click: MouseEvent = document.createEvent('MouseEvent');
        click.initMouseEvent('click', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(click);
    }
}