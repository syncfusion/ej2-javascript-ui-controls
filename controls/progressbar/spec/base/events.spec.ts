
export class MouseEvents {
    public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        const mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousemove);
    }
    public mouseupEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mouseup: MouseEvent = document.createEvent('MouseEvent');
        mouseup.initMouseEvent('mouseup', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mouseup);
    }
    public mousedownEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousedown: MouseEvent = document.createEvent('MouseEvent');
        mousedown.initMouseEvent('mousedown', false, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousedown);
    }
    public mouseLeaveEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseleave', false, false);
        element.dispatchEvent(click);
    }
    public clickEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('click', true, false);
        element.dispatchEvent(click);
    }

}
