
export class MouseEvents {
    public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        const mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousemove);
    }

}
