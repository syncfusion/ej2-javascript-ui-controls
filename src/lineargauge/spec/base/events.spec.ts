import { LinearGauge } from '../../src/linear-gauge/linear-gauge';

/**
 * Gauge Mouse and Touch Events for spec documents
 */
export class MouseEvents {
    public clickEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('click', true, false);
        element.dispatchEvent(click);
    }
    public mousedownEvent(element: Element, sx: number, sy: number, cx: number, cy: number): void {
        let mousedown: MouseEvent = document.createEvent('MouseEvent');
        mousedown.initMouseEvent('mousedown', false, false, window, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
        element.dispatchEvent(mousedown);
    }
    public rightClick(element: Element, x: number, y: number, type: string, no: number, gauge: LinearGauge): void {
        gauge.gaugeRightClick(<PointerEvent>this.onPointerLeave(element, x, y, 20, type, no));
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
    public dragAndDropEvent(
        element: Element, startX: number, startY: number,
        endX: number, endY: number, type: string, gauge: LinearGauge
    ): void {
        gauge.gaugeOnMouseDown(<PointerEvent>this.onPointerStart(element, startX, startY, 0, type));
        gauge.mouseMove(<PointerEvent>this.onPointerMove(element, endX, endY, 0, type));
        gauge.mouseEnd(<PointerEvent>this.onPointerEnd(element, endX, endY, 0, type));
    }
    public dragEvent(element: Element, startX: number, startY: number, endX: number, endY: number): void {
        this.mousedownEvent(element, 0, 0, startX, startY);
        this.mousemoveEvent(element, 0, 0, endX, endY);
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

    public doTouchEnd(
        elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
        gauge: LinearGauge
    ): void {
        gauge.mouseEnd(<PointerEvent>this.onTouchEnd(elem, x1, y1, null, null, x3, y3));
    }


    public touchDragAndDropEvent(gauge: LinearGauge, element: Element, startX: number, startY: number, endX: number, endY: number): void {
        gauge.gaugeOnMouseDown(<PointerEvent>this.onTouchStart(element, 0, 0, startX, startY, startX, startY));
        gauge.mouseMove(<PointerEvent>this.onTouchMove(element, 0, 0, startX, startY, endX, endY));
        gauge.mouseEnd(<PointerEvent>this.onTouchEnd(element, 0, 0, startX, startY, endX, endY));
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

    public doDoubleTab(
        elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
        gauge: LinearGauge
    ): void {
        gauge.gaugeOnMouseDown(<PointerEvent>this.onTouchStart(elem, x1, y1, null, null, x3, y3));
        gauge.mouseEnd(<PointerEvent>this.onTouchEnd(elem, x1, y1, null, null, x3, y3));
        gauge.gaugeOnMouseDown(<PointerEvent>this.onTouchStart(elem, x1, y1, null, null, x3, y3));
        gauge.mouseEnd(<PointerEvent>this.onTouchEnd(elem, x1, y1, null, null, x3, y3));
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

    public onPointerStart(elem: Element, x1: number, y1: number, pointerId: number, type: string): Object {
        if (type === 'touchstart') {
            return this.onTouchStart(elem, x1, y1, x1, y1, x1, y1);
        }
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: type,
            type: type
        };
    }

    public onPointerMove(elem: Element, x1: number, y1: number, pointerId: number, type: string): Object {
        if (type === 'touchmove') {
            return this.onTouchMove(elem, x1, y1, x1, y1, x1, y1);
        } else {
            return {
                target: elem,
                pageX: x1,
                pageY: y1, clientX: x1, clientY: y1,
                pointerId: pointerId,
                pointerType: type,
                type: type
            };
        }
    }

    public onPointerEnd(elem: Element, x1: number, y1: number, pointerId: number, type: string): Object {
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: type,
            type: type
        };
    }

    public onPointerLeave(elem: Element, x1: number, y1: number, pointerId: number, type: string, no: number): Object {
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: type,
            buttons: no,
            preventDefault: new Function(),
            stopPropagation: new Function(),
        };
    }

}