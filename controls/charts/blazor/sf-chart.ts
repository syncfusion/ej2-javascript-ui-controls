/**
 * Chart native blazor source file
 */
import { EventHandler, Browser, Touch, BlazorDotnetObject, TapEventArgs} from '@syncfusion/ej2-base';
//tslint:disable
let Chart: object = {
    getElementBoundsById(id: string): { width: number, height: number } {
        let element: HTMLElement = document.getElementById(id);
        return { width: element.clientWidth || element.offsetWidth, height: element.clientHeight || element.offsetHeight };
    },
    wireEvents(id: string, dotnetref: BlazorDotnetObject): void {
        let element: HTMLElement = document.getElementById(id);
        if (!element) {
            return;
        }
        /*! Find the Events type */

        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        /*! Bind the Event handler */
        EventHandler.add(element, Browser.touchStartEvent, this.chartOnMouseDown, {this: this, dotnetref: dotnetref});
        EventHandler.add(element, Browser.touchMoveEvent, this.mouseMove, {this: this, dotnetref: dotnetref});
        EventHandler.add(element, Browser.touchEndEvent, this.mouseEnd, {this: this, dotnetref: dotnetref});
        EventHandler.add(element, 'click', this.chartOnMouseClick, {this: this, dotnetref: dotnetref});
        EventHandler.add(element, 'contextmenu', this.chartRightClick, {this: this, dotnetref: dotnetref});
        EventHandler.add(element, cancelEvent, this.mouseLeave, {this: this, dotnetref: dotnetref});

        this.resizeBound = this.chartResize.bind({this: this, dotnetref: dotnetref});
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBound
        );

        this.longPressBound = this.longPress.bind({this: this, dotnetref: dotnetref});
        this.touchObject = new Touch(element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });

        /*! Apply the style for chart */
    },
    getEventArgs(e:PointerEvent): object {
        return {
            type: e.type,
            clientX: e.clientX,
            clientY: e.clientY,
            pointerType: e.pointerType,
            target: e.target,
            changedTouches: (<TouchEvent & PointerEvent>e).changedTouches
        }
    },
    chartOnMouseDown(e: PointerEvent): boolean {
        this.dotnetref.invokeMethodAsync("OnChartMouseDown", this.getEventArgs(e));
        return false;
    },
    mouseMove(e: PointerEvent): boolean {
        this.dotnetref.invokeMethodAsync("OnChartMouseMove", this.getEventArgs(e));
        return false;
    },
    mouseEnd(e: PointerEvent): boolean {
        this.dotnetref.invokeMethodAsync("OnChartMouseEnd", this.getEventArgs(e));
        return false;
    },
    chartOnMouseClick(e: PointerEvent): boolean {
        this.dotnetref.invokeMethodAsync("OnChartMouseClick", this.getEventArgs(e));
        return false;
    },
    chartRightClick(e: PointerEvent): boolean {
        this.dotnetref.invokeMethodAsync("OnChartRightClick", this.getEventArgs(e));
        return false;
    },
    mouseLeave(e: PointerEvent): boolean {
        this.dotnetref.invokeMethodAsync("OnChartMouseLeave", this.getEventArgs(e));
        return false;
    },
    chartResize(e: Event): boolean {
        this.dotnetref.invokeMethodAsync("OnChartResize");
        return false;
    },
    longPress(e: TapEventArgs): boolean {
        this.dotnetref.invokeMethodAsync("OnChartLongPress");
        return false;
    }
};
export default Chart;
