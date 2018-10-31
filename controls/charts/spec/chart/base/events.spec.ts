import { Chart } from '../../../src/chart/chart';

/**
 * Chart Mouse and Touch Events for spec documents
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
    public draganddropEvent(element: Element, startX: number, startY: number, endX: number, endY: number): void {
        this.mousedownEvent(element, 0, 0, startX, startY);
        this.mousemoveEvent(element, 0, 0, endX, endY);
        this.mouseupEvent(element, 0, 0, endX, endY);
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
    public mouseoutEvent(element: Element): void {
        let click: Event = document.createEvent('MouseEvent');
        click.initEvent('mouseout', false, false);
        element.dispatchEvent(click);
    }

    public touchdraganddropEvent(chart: Chart, element: Element, startX: number, startY: number, endX: number, endY: number): void {
        chart.chartOnMouseDown(<PointerEvent>this.onTouchStart(element, 0, 0, startX, startY,  startX, startY));
        chart.mouseMove(<PointerEvent>this.onTouchMove(element, 0, 0, startX, startY,  endX, endY));
        chart.mouseEnd(<PointerEvent>this.onTouchEnd(element, 0, 0, startX, startY,  endX, endY));
    }
    public onTouchStart(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, isScrollbar? : boolean): Object {
        let touches: Object[] = [
            { pageX: x1, pageY: y1, clientX: x1, clientY: y1 }
        ];
        if (x2 && y2) {
            touches.push({ pageX: x2, pageY: y2, clientX: x2, clientY: y2 })
        }
        return {
            target: elem,
            type: isScrollbar ? 'mousedown':'touchstart',
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
                { pageX: x3, pageY: y3, clientX: x3, clientY: y3  }
            ]
        };
    }

    public doDoubleTab(elem: Element, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, chart: Chart): void {
        chart.chartOnMouseDown(<PointerEvent>this.onTouchStart(elem, x1, y1, null, null, x3, y3));
        chart.mouseEnd(<PointerEvent>this.onTouchEnd(elem, x1, y1, null, null, x3, y3));
        chart.chartOnMouseDown(<PointerEvent>this.onTouchStart(elem, x1, y1, null, null, x3, y3));
        chart.mouseEnd(<PointerEvent>this.onTouchEnd(elem, x1, y1, null, null, x3, y3));
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
            ],
            preventDefault: function(){
                
            }
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

    public onPointerStart(elem: Element, x1: number, y1: number, pointerId: number): Object {
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: 'touch'
        };
    }

    public onPointerMove(elem: Element, x1: number, y1: number, pointerId: number): Object {
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: 'touch'
        };
    }

    public onPointerEnd(elem: Element, x1: number, y1: number, pointerId: number): Object {
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: 'touch'
        };
    }

    public onPointerLeave(elem: Element, x1: number, y1: number, pointerId: number): Object {
        return {
            target: elem,
            pageX: x1,
            pageY: y1, clientX: x1, clientY: y1,
            pointerId: pointerId,
            pointerType: 'touch'
        };
    } 
    public mouseoverEvent(element: Element): void {
        let mouseover: Event = document.createEvent('MouseEvent');
        mouseover.initEvent('mouseover', false, false);
        element.dispatchEvent(mouseover);
    }
    public mousemovetEvent(element: Element, pageX: number, pageY: number): void {
        let move = document.createEvent('MouseEvent');
        move.initMouseEvent('mousemove', true, true, window, 1, 100, 100, pageX, pageY,
                            false, false, false, false, 0, null);
        element.dispatchEvent(move);
    }
      public mouseleavetEvent(element: Element, pageX: number, pageY: number): void {
        let move = document.createEvent('MouseEvent');
        move.initMouseEvent('mouseleave', true, true, window, 1, 100, 100, pageX, pageY,
                            false, false, false, false, 0, null);
        element.dispatchEvent(move);
    }
     public touchEvent(event: string, element: Element, pageX: number, pageY: number): void {
        let move = document.createEvent('TouchEvent');
        move.initEvent(event, true, false);
        element.dispatchEvent(move);
    }
    public mouseuptEvent(element: Element, pageX: number, pageY: number): void {
        let move = document.createEvent('MouseEvent');
        move.initMouseEvent('mouseup', true, true, window, 1, 100, 100, pageX, pageY,
                            false, false, false, false, 0, null);
        element.dispatchEvent(move);
    }

}