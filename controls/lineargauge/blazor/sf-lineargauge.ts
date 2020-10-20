import { BlazorDotnetObject, EventHandler } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';

/**
 * LinearGauge Blazor introp module
 */
class SfLinearGauge {
    public id: string;
    public element: BlazorLinearGaugeElement;
    public dotNetRef: BlazorDotnetObject;
    public options: ILinearGaugeOptions;
    public individualId: string;
    private pointerCheck : boolean;
    // tslint:disable-next-line:max-line-length
    constructor(id: string, element: BlazorLinearGaugeElement, options: ILinearGaugeOptions, dotnetRef: BlazorDotnetObject, individualId: string) {
        this.id = id;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.element.blazor__instance = this;
        this.individualId = individualId;
    }
    public render(): void {
        this.wireEvents();
    }
    private wireEvents(): void {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.gaugeOnMouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.gaugeOnMouseEnd, this);
        EventHandler.add(this.element, Browser.touchCancelEvent, this.gaugeOnMouseEnd, this);
        EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        EventHandler.add(this.element, 'mouseleave', this.gaugeOnMouseLeave, this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.gaugeOnResize.bind(this)
        );
    }
    private gaugeOnResize(): void {
        let elementBounds: HTMLElement = document.getElementById(this.element.id);
        if (elementBounds != null) {
            elementBounds = elementBounds.parentElement;
            let width: number = elementBounds.clientWidth || elementBounds.offsetWidth;
            let height: number = elementBounds.clientHeight || elementBounds.offsetHeight;
            this.dotNetRef.invokeMethodAsync('TriggerResizeEvent', width, height);
        }
    }

    private gaugeOnMouseClick(element: PointerEvent): void {
        let targetId: string = (element.target as HTMLElement).id;
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1) {
            this.pointerCheck = false;
        }
    }
    private gaugeOnMouseLeave(element: PointerEvent): void {
        this.dotNetRef.invokeMethodAsync('TriggerMouseLeaveEvent', element.x, element.y);
    }
    private gaugeOnMouseDown(element: PointerEvent): void {
        let targetId: string = (element.target as HTMLElement).id;
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1) {
            this.pointerCheck = true;
            let axisIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            let pointerIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            this.dotNetRef.invokeMethodAsync('TriggerDragStart', axisIndex, pointerIndex);
        } else {
            this.dotNetRef.invokeMethodAsync('TriggerMouseDownEvent', element.x, element.y);
        }
    }
    /* tslint:disable:no-string-literal */
    private gaugeOnMouseMove(element: PointerEvent): void {
        let targetId: string = (element.target as HTMLElement).id;
        if ((targetId.indexOf('Bar') > -1 && this.pointerCheck) || (targetId.indexOf('Marker') > -1 && this.pointerCheck)) {
            let svgBounds: ClientRect = this.svgClient(targetId);
            let axisIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            let pointerIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            this.dotNetRef.invokeMethodAsync('TriggerDragMove', targetId, axisIndex, pointerIndex, (element.clientX - svgBounds.left),
                                             (element.clientY - svgBounds.top));
        }
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1 || targetId.indexOf('Range') > -1) {
            let svgBounds: ClientRect  = this.svgClient(targetId);
            let axisIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            let pointerIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            let parentId: string = targetId.split('_')[0];
            let parentElement: ClientRect = document.getElementById(parentId).getBoundingClientRect();
            let parentEle: IClientOptions = {
                Bottom: parentElement['bottom'],
                Height: parentElement['height'],
                Left: parentElement['left'],
                Right: parentElement['right'],
                Top: parentElement['top'],
                Width: parentElement['width'],
                X: parentElement['x'],
                Y: parentElement['y']
            };
            let lineElement: ClientRect = document.getElementById(parentId + '_AxisLine_' + axisIndex).getBoundingClientRect();
            let lineEle: IClientOptions = {
                Bottom: lineElement['bottom'],
                Height: lineElement['height'],
                Left: lineElement['left'],
                Right: lineElement['right'],
                Top: lineElement['top'],
                Width: lineElement['width'],
                X: lineElement['x'],
                Y: lineElement['y']
            };
            let tickElement: ClientRect = document.getElementById(parentId + '_MajorTicksLine_' + axisIndex).getBoundingClientRect();
            let tickEle: IClientOptions = {
                Bottom: tickElement['bottom'],
                Height: tickElement['height'],
                Left: tickElement['left'],
                Right: tickElement['right'],
                Top: tickElement['top'],
                Width: tickElement['width'],
                X: tickElement['x'],
                Y: tickElement['y']
            };
            let pointElement: ClientRect = document.getElementById(targetId).getBoundingClientRect();
            let pointEle: IClientOptions = {
                Bottom: pointElement['bottom'],
                Height: pointElement['height'],
                Left: pointElement['left'],
                Right: pointElement['right'],
                Top: pointElement['top'],
                Width: pointElement['width'],
                X: pointElement['x'],
                Y: pointElement['y']
            };
            let elementId: string = targetId.split('_')[0];
            let tooltipElement: HTMLElement = document.getElementById(elementId + '_Tooltip');
            if (tooltipElement != null) {
                tooltipElement.style.visibility = 'visible';
            }
            this.dotNetRef.invokeMethodAsync('TriggerTooltip', targetId, axisIndex, pointerIndex, (element.clientX - svgBounds.left),
                                             (element.clientY - svgBounds.top), parentEle, lineEle, tickEle, pointEle);
        } else {
            let elementId: string = targetId.split('_')[0];
            let tooltipElement: HTMLElement = document.getElementById(elementId + '_Tooltip');
            if (tooltipElement != null) {
                tooltipElement.style.visibility = 'hidden';
            }
        }
    }
    private gaugeOnMouseEnd(element: PointerEvent): void {
        let targetId: string = (element.target as HTMLElement).id;
        this.pointerCheck = false;
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1) {
            this.pointerCheck = false;
            let svgBounds: ClientRect = this.svgClient(targetId);
            let parentId: string = targetId.split('_AxisIndex_')[0].split('_')[0];
            let axisIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            let pointerIndex: number = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            this.dotNetRef.invokeMethodAsync('TriggerDragEnd', axisIndex, pointerIndex, parentId, targetId,
                                             (element.clientX - svgBounds.left), (element.clientY - svgBounds.top));
        } else {
            this.dotNetRef.invokeMethodAsync('TriggerMouseUpEvent', element.x, element.y);
        }
    }
    private svgClient(targetId: string): ClientRect {
        let svg: HTMLElement = document.getElementById(targetId.split('_AxisIndex_')[0] + '_svg');
        return svg.getBoundingClientRect();
    }
}
interface ILinearGaugeOptions {
    width: string;
    height: string;
}
interface IClientOptions {
    Bottom: number;
    Height: number;
    Left: number;
    Right: number;
    Top: number;
    Width: number;
    X: number;
    Y: number;
}
interface BlazorLinearGaugeElement extends HTMLElement {
    blazor__instance: SfLinearGauge;
}
// tslint:disable
let LinearGauge: object = {
    initialize(element: BlazorLinearGaugeElement, options: ILinearGaugeOptions, dotnetRef: BlazorDotnetObject, individualId: string): object {
        let instance: SfLinearGauge = new SfLinearGauge(element.id, element, options, dotnetRef, individualId);
        instance.render();
        return this.getElementSize(element);
    },
    getElementSize(element: BlazorLinearGaugeElement): object {
        let elementWidth: number;
        let elementHeight: number;
        if (element != null) {
            let elementRect: ClientRect = element.getBoundingClientRect();
            elementWidth = elementRect.width;
            elementHeight = elementRect.height;
        }
        return { width: elementWidth, height: elementHeight, isIE: Browser.isIE };
    },

    setPathAttribute(id : string, type: string, path: string, x: number, y: number): void {
        let pathElement: HTMLElement = document.getElementById(id);
        if (type === '') {
            pathElement.setAttribute('d', path);
        } else {
            pathElement.setAttribute('x', x.toString());
            pathElement.setAttribute('y', y.toString());
        }
    },
    getElementBounds(id: string): object {
        let htmlElement: Element = document.getElementById(id);
        if (htmlElement) {
            let bounds: ClientRect = htmlElement.getBoundingClientRect();
            return {
                width: bounds.width, height: bounds.height, top: bounds.top, bottom: bounds.bottom,
                left: bounds.left, right: bounds.right
            };
        }
        return null;
    },
};
export default LinearGauge;