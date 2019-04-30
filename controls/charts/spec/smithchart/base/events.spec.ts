import { Smithchart } from '../../../src/smithchart/index';
/**
 * Smithchart Mouse and Touch Events for spec documents
 */
let prevent: Function = (): void => {
    //Prevent Function
};
export class MouseEvents {

    public clickEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('click', true, false);
        element.dispatchEvent(click);
    }
    public rightClickEvent(element: Element): void {
        let contextmenu: Event = document.createEvent('MouseEvent');
        contextmenu.initEvent('contextmenu', true, false);
        element.dispatchEvent(contextmenu);
    }
    public doubleClickEvent(element: Element): void {
        let double: Event = document.createEvent('MouseEvent');
        double.initEvent('dblclick', true, false);
        element.dispatchEvent(double);
    }
    public resizeEvent(): void {
        window.dispatchEvent(new Event('resize'));
    }
    public mousedownEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousedown: MouseEvent = document.createEvent('MouseEvent');
        mousedown.initMouseEvent('mousedown', false, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousedown);
    }
    public mousemoveEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousemove: MouseEvent = document.createEvent('MouseEvent');
        mousemove.initMouseEvent('mousemove', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousemove);
    }
    public mouseupEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mouseup: MouseEvent = document.createEvent('MouseEvent');
        mouseup.initMouseEvent('mouseup', true, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mouseup);
    }

    public mouseLeaveEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseleave', false, false);
        element.dispatchEvent(click);
    }
    public mouseoverEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseover', false, false);
        element.dispatchEvent(click);
    }
    public mouseoutEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseout', false, false);
        element.dispatchEvent(click);
    }

    public onPointerStart(elem: Element, x1: number, y1: number, pointerId: number, type: string): Object {
        if (type === 'touch') {
            return this.onTouchStart(elem, x1, y1, x1, y1, x1, y1);
        }
        return {
            target: elem,
            pageX: x1,
            preventDefault: prevent,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: type,
            type: type
        };
    }

    public onPointerMove(elem: Element, x1: number, y1: number, pointerId: number, type: string): Object {
        if (type === 'touch') {
            return this.onTouchMove(elem, x1, y1, x1, y1, x1, y1);
        } else {
            return {
                target: elem,
                pageX: x1,
                preventDefault: prevent,
                pageY: y1, clientX: x1, clientY: y1,
                pointerId: pointerId,
                pointerType: type,
                type: type
            };
        }
    }

    public onPointerEnd(elem: Element, x1: number, y1: number, pointerId: number, type: string): Object {
        if (type === 'touch') {
            return this.onTouchEnd(elem, x1, y1, x1, y1, x1, y1);
        } else {
            return {
                target: elem,
                pageX: x1,
                preventDefault: prevent,
                pageY: y1, clientX: x1, clientY: y1,
                pointerId: pointerId,
                pointerType: type,
                type: type
            };
        }
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
            preventDefault: prevent,
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
            preventDefault: prevent,
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
            preventDefault: prevent,
            touches: touches,
            changedTouches: [
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3 }
            ]
        };
    }

}
