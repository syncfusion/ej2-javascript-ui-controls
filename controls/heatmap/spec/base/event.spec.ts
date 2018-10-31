export class MouseEvents {
    public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousemove);
    }
    public clickEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let click: MouseEvent = document.createEvent('MouseEvent');
        click.initMouseEvent('click', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(click);
    }
    public onTouchStart(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Object {
        let touches: Object[] = [
            { pageX: x1, pageY: y1, clientX: x1, clientY: y1 }
        ];
        if (x2 && y2) {
            touches.push({ pageX: x2, pageY: y2, clientX: x2, clientY: y2 })
        }
        return {
            target: elem,
            type: 'touchstart',
            touches: touches,
            changedTouches: [
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3 }
            ],
            preventDefault: function () {

            }
        };
    }
}