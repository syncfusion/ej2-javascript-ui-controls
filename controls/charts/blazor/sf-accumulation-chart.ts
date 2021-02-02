/**
 * AccumulationChart blazor source file
 */

import { Animation, createElement, AnimationOptions, TapEventArgs, BlazorDotnetObject, Browser, EventHandler } from '@syncfusion/ej2-base';
import { Touch, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TooltipModel, Tooltip, TooltipLocation, ITooltipAnimationCompleteArgs } from '@syncfusion/ej2-svg-base';
// tslint:disable
let throttle: Function = window['_'].throttle;

class ChartLocation {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class SfAccumulationChart
{
    public id: string;
    public element: BlazorAccChartElement;
    public dotnetref: BlazorDotnetObject;
    public chartOnMouseDownRef: any = null;
    public mouseMoveRef: any = null;
    public mouseEndRef: any = null;
    public chartOnMouseClickRef: any = null;
    public chartRightClickRef: any = null;
    public mouseLeaveRef: any = null;
    public chartMouseWheelRef: any = null;
    public domMouseMoveRef: any = null;
    public domMouseUpRef: any = null;
    public longPressBound: any = null;
    public touchObject: any = null;  
    public mouseY: number = 0;
    public mouseX: number = 0;
    public isTouch: boolean;
    public eventInterval: number = 80; 
    public tooltip: Tooltip;
    constructor(id: string, element: BlazorAccChartElement, dotnetRef: BlazorDotnetObject) {
        this.id = id;
        this.element = element;
        this.dotnetref = dotnetRef;
        this.element.blazor__instance = this;
    }
    public render(): void {
        this.unWireEvents();
        this.wireEvents();
    }
    public destroy(): void {
        this.unWireEvents();
    }
    private wireEvents(): void {
        let element: HTMLElement = document.getElementById(this.id);
        if (!element) {
            return;
        }
        AccumulationChart.dotnetrefCollection.push({id: this.id, dotnetref: this.dotnetref});
        /*! Find the Events type */
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        this.chartOnMouseDownRef = this.chartOnMouseDown.bind(this, this.dotnetref, this.id);
        this.mouseMoveRef = this.mouseMove.bind(this, this.dotnetref, this.id);
        this.mouseEndRef = this.mouseEnd.bind(this, this.dotnetref, this.id);
        this.chartOnMouseClickRef = this.chartOnMouseClick.bind(this, this.dotnetref, this.id);
        this.chartRightClickRef = this.chartRightClick.bind(this, this.dotnetref, this.id);
        this.mouseLeaveRef = this.mouseLeave.bind(this, this.dotnetref, this.id);

        /*! Bind the Event handler */
        element.addEventListener('mousemove', throttle((e: PointerEvent) => {
            this.mouseMoveRef(e);
          }, this.eventInterval));
        element.addEventListener('touchmove', throttle((e: TouchEvent) => {
            this.mouseMoveRef(e);
          }, this.eventInterval));
        EventHandler.add(element, Browser.touchEndEvent, this.mouseEndRef);
        EventHandler.add(element, 'click', this.chartOnMouseClickRef);
        EventHandler.add(element, 'contextmenu', this.chartRightClickRef);
        EventHandler.add(element, cancelEvent, this.mouseLeaveRef);
        AccumulationChart.resizeBound = AccumulationChart.chartResize.bind(this, AccumulationChart.dotnetrefCollection);
        let resize: string = (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' :
        'resize';
        EventHandler.add(window as any, resize, AccumulationChart.resizeBound);
        this.longPressBound = this.longPress.bind(this, this.dotnetref, this.id);
        this.touchObject = new Touch(element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });
        /*! Apply the style for chart */
    }
    private unWireEvents(): void {
        let element: HTMLElement = document.getElementById(this.id);
        if (!element) {
            return;
        }
        AccumulationChart.dotnetrefCollection = AccumulationChart.dotnetrefCollection.filter((item: {id: string, dotnetref: BlazorDotnetObject}): boolean  => {
            return item.id !== this.id;
          });
        /*! Find the Events type */
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.remove(element, Browser.touchStartEvent, this.chartOnMouseDownRef);
        element.removeEventListener('mousemove', this.mouseMoveRef);
        element.removeEventListener('touchmove', this.mouseMoveRef);
        EventHandler.remove(element, Browser.touchEndEvent, this.mouseEndRef);
        EventHandler.remove(element, 'click', this.chartOnMouseClickRef);
        EventHandler.remove(element, 'contextmenu', this.chartRightClickRef);
        EventHandler.remove(element, cancelEvent, this.mouseLeaveRef);
        let resize: string = Browser.isTouch && 'orientation' in window && 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.remove(window as any, resize, AccumulationChart.resizeBound);
        if (this.touchObject) {
            this.touchObject.destroy();
            this.touchObject = null;
        }
        /*! Apply the style for chart */
    }
    private getEventArgs(e: PointerEvent | TouchEvent): object {
        return {
            type: e.type,
            clientX: (e as PointerEvent).clientX,
            clientY: (e as PointerEvent).clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            pointerType: (e as PointerEvent).pointerType,
            target: (e.target as Element).id,
            changedTouches: {
                clientX: (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientX : 0,
                clientY: (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientY : 0
            }
        };
    }
    private setMouseXY(pageX: number, pageY: number): void {
        let svgRect: ClientRect = document.getElementById(this.id + '_svg').getBoundingClientRect();
        let rect: ClientRect = document.getElementById(this.id).getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }
    private chartOnMouseDown(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseDown', this.getEventArgs(e));
        return false;
    }
    private mouseMove(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            touchArg = e as TouchEvent;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            this.isTouch = (e as PointerEvent).pointerType === 'touch' || (e as PointerEvent).pointerType === '2' || this.isTouch;
            pageX = (e as PointerEvent).clientX;
            pageY = (e as PointerEvent).clientY;
        }
        if (document.getElementById(this.id + '_svg')) {
            this.setMouseXY(pageX, pageY);
            this.dotnetref.invokeMethodAsync('OnChartMouseMove', this.getEventArgs(e));
        }
        return false;
    }
    private mouseEnd(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseEnd', this.getEventArgs(e));
        return false;
    }
    private chartOnMouseClick(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseClick', this.getEventArgs(e));
        return false;
    }
    private chartRightClick(dotnetref: BlazorDotnetObject, id: string, event: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartRightClick', this.getEventArgs(event));
        return false;
    }
    private mouseLeave(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseLeave', this.getEventArgs(e));
        return false;
    }

    private longPress(dotnetref: BlazorDotnetObject, id: string, e: TapEventArgs): boolean {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartLongPress', e);
        return false;
    }
}

interface IAccumulationChartoptions {
    initialize: Function;
    destroy: Function;
    getElementBoundsById: Function;
    measureText: Function;
    getCharSizeByFontKeys: Function;
    getCharSizeByCharKey: Function;
    performAnimation: Function;
    setElementTransform: Function;
    chartResize: Function;
    linear: Function;
    setElementAttribute: Function;
    getElementAttribute: Function;
    createStyleElement: Function;
    renderTooltip: Function;
    animateRedrawElement: Function;
    doAnimation: Function;
    getPathArc: Function;
    getPiePath: Function;
    getDoughnutPath: Function;
    degreeToLocation: Function;
    ChangePiePath: Function;
    GetPathOption: Function;
    ChangePointPath: Function;
    getAllCharacters: Function;
    fadeOut: Function;
    resizeBound: any;
    resize: any; 
    dotnetref: object;
    dotnetrefCollection: {id: string, dotnetref: BlazorDotnetObject}[];
    charCollection: string[];
    id: string;
}

interface BlazorAccChartElement extends HTMLElement {
    blazor__instance: SfAccumulationChart;
}

let AccumulationChart: IAccumulationChartoptions = {
    initialize(element: BlazorAccChartElement, dotnetRef: BlazorDotnetObject): void {
        let instance: SfAccumulationChart = new SfAccumulationChart(element.id, element, dotnetRef);
        this.getAllCharacters();
        instance.render();
    },
    destroy(element: BlazorAccChartElement): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    },
    id: '',
    getElementBoundsById(id: string, isSetId: boolean = true):
    { width: number, height: number, left: number, top: number, right: number, bottom: number } {
        if (isSetId) {
            this.id = id;
        }
        let element: HTMLElement = document.getElementById(id);
        if(element)
        {
            let elementRect: ClientRect = element.getBoundingClientRect();
            return {
                width: element.clientWidth || element.offsetWidth,
                height: element.clientHeight || element.offsetHeight,
                left: elementRect.left,
                top: elementRect.top,
                right: elementRect.right,
                bottom: elementRect.bottom
            };
        }
        return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    },
    charCollection:[],
    getAllCharacters() : void {
        this.charCollection = [];
        for (var i = 33; i < 591; i++) {
            this.charCollection.push(String.fromCharCode(i));
        }
    },
    measureText(text: string, size: string, fontWeight: string, fontStyle: string, fontFamily: string): { Width: number, Height: number } {
        let textObject: HTMLElement = document.getElementById('chartmeasuretext');
        if (textObject === null) {
            textObject = createElement('text', { id: 'chartmeasuretext' });
            document.body.appendChild(textObject);
        }
        if (text === ' ') {
            text = '&nbsp;';
        }
        textObject.innerHTML = text;
        textObject.style.position = 'fixed';
        textObject.style.fontSize = '100px';
        textObject.style.fontWeight = fontWeight;
        textObject.style.fontStyle = fontStyle;
        textObject.style.fontFamily = fontFamily;
        textObject.style.visibility = 'hidden';
        textObject.style.top = '-100';
        textObject.style.left = '0';
        textObject.style.whiteSpace = 'nowrap';
        textObject.style.lineHeight = 'normal';
        return {
            Width: textObject.clientWidth,
            Height: textObject.clientHeight
        };
    },
    getCharSizeByFontKeys(fontkeys: string[]): string {
        let charSizeList: { [k: string]: { width: number, height: number } } = {};
        let charList: string[] = this.charCollection;
        let charLength: number = charList.length;
        let fontKeysLength: number = fontkeys.length;
        for (let i: number = 0; i < fontKeysLength; i++) {
            let fontValues: string[] = fontkeys[i].split('_');
            let size: string = fontValues[0]; let fontWeight: string = fontValues[1];
            let fontStyle: string = fontValues[2]; let fontFamily: string = fontValues[3];
            let charKey: string = '_' + fontWeight + fontStyle + fontFamily;
            for (let j: number = 0; j < charLength; j++) {
                charSizeList[charList[j] + charKey] = this.measureText(charList[j], size, fontWeight, fontStyle, fontFamily);
            }
        }
        let result: string = JSON.stringify(charSizeList);
        return result;
    },
    getCharSizeByCharKey(charkey: string): { Width: number, Height: number } {
        let fontValues: string[] = charkey.split('_');
        let char: string = fontValues[0]; let size: string  = fontValues[1];
        let fontWeight: string = fontValues[2]; let fontStyle: string = fontValues[3]; let fontFamily: string = fontValues[4];
        return this.measureText(char, size, fontWeight, fontStyle, fontFamily);
    },
    dotnetref: {},
    dotnetrefCollection: [],
    resizeBound : {},
    resize: {},
    chartResize(dotnetrefCollection: {id: string, dotnetref: BlazorDotnetObject}[], e: Event): boolean {
        if (this.resize) {
            clearTimeout(this.resize);
        }
        this.resize = setTimeout(() => {
            let count: number = dotnetrefCollection.length;
            let tempDotnetref: BlazorDotnetObject;
            for (let i: number = 0; i < count; i++) {
                tempDotnetref = dotnetrefCollection[i].dotnetref;
                tempDotnetref.invokeMethodAsync('RemoveElements');
            }
            for (let i: number = 0; i < count; i++) {
                tempDotnetref = dotnetrefCollection[i].dotnetref;
                tempDotnetref.invokeMethodAsync('OnChartResize', e);
            }
            clearTimeout(this.resize);
        }, 500);
        return false;
    },
    performAnimation(
        index: number, sliceId: string, startX: number, startY: number, endX: number, endY: number,
        duration: number, transform: string, isReverse?: boolean
    ): void {
        let result: RegExpExecArray = /translate\((-?\d+\.?\d*),?\s*(-?\d+[.]?\d*)?\)/.exec(transform);
        if (!isNullOrUndefined(transform) && transform !== '') {
            endX = +result[1];
            endY = +result[2];
        }
        if (duration <= 0) {
            this.setElementTransform(sliceId, index, 'transform', 'translate(' + (endX) + ', ' + (endY) + ')');
            return null;
        }
        let xValue: number;
        let yValue: number;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            progress: (args: AnimationOptions) => {
                xValue = this.linear(args.timeStamp, startX, endX, args.duration);
                yValue = this.linear(args.timeStamp, startY, endY, args.duration);
                this.setElementTransform(
                    sliceId, index, 'transform',
                    'translate(' + (isReverse ? endX - xValue : xValue) + ', ' + (isReverse ? endY - yValue : yValue) + ')');
            },
            end: (model: AnimationOptions) => {
                this.setElementTransform(
                    sliceId, index, 'transform',
                    'translate(' + (isReverse ? startX : endX) + ', ' + (isReverse ? startX : endY) + ')');
            }
        });
    },
    setElementTransform(sliceId: string, index: number, attribute: string, value: string): void {
        let chartID: string = sliceId.replace('Series_0', 'datalabel').replace('Point', 'Series_0');
        this.setElementAttribute(sliceId + index, 'transform', value);
        this.setElementAttribute(chartID + 'shape_' + index, 'transform', value);
        this.setElementAttribute(chartID + 'text_' + index, 'transform', value);
        this.setElementAttribute(chartID + 'connector_' + index, 'transform', value);
    },
    linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
        return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
    },
    setElementAttribute(id: string, attribute: string, value: string): void {
        let element: Element = document.getElementById(id);
        if (element) {
            element.setAttribute(attribute, value);
        }
    },
    getElementAttribute(id: string, attribute: string): string {
        let element: Element = document.getElementById(id);
        if (element) {
            return (element.getAttribute(attribute));
        }
        return '';
    },
    createStyleElement(styleId: string, styleInnerHTML: string): void {
        document.body.appendChild(createElement('style', { id: styleId, innerHTML: styleInnerHTML }));
    },
    renderTooltip(tooltipOptions: string, elementId: string, tooltipModule: any, element: BlazorAccChartElement) {
        let svgElement: Element = document.getElementById(elementId + '_svg');
        let firstRender: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0) ? false : true;
        let options: TooltipModel = JSON.parse(tooltipOptions);       
        let currentInstance: SfAccumulationChart = element.blazor__instance;
        if (firstRender && !isNullOrUndefined(currentInstance)) {
            currentInstance.tooltip = new Tooltip(options);
            currentInstance.tooltip.tooltipRender = () => {
                tooltipModule.invokeMethodAsync('TooltipRender');
            };
            currentInstance.tooltip.animationComplete = (args: ITooltipAnimationCompleteArgs) => {
                if (args.tooltip.fadeOuted) {
                    tooltipModule.invokeMethodAsync('TooltipAnimationComplete');
                }
            };
            currentInstance.tooltip.appendTo('#' + elementId);
        } else if (!isNullOrUndefined(currentInstance.tooltip)) {
            currentInstance.tooltip.location = new TooltipLocation(options.location.x, options.location.y);
            currentInstance.tooltip.content = options.content;
            currentInstance.tooltip.header = options.header;
            currentInstance.tooltip.offset = options.offset;
            currentInstance.tooltip.palette = options.palette;
            currentInstance.tooltip.shapes = options.shapes;
            currentInstance.tooltip.data = options.data;
            currentInstance.tooltip.template = options.template;
            currentInstance.tooltip.textStyle.color = options.textStyle.color || this.tooltip.textStyle.color;
            currentInstance.tooltip.textStyle.fontFamily = options.textStyle.fontFamily || this.tooltip.textStyle.fontFamily;
            currentInstance.tooltip.textStyle.fontStyle = options.textStyle.fontStyle || this.tooltip.textStyle.fontStyle;
            currentInstance.tooltip.textStyle.fontWeight = options.textStyle.fontWeight || this.tooltip.textStyle.fontWeight;
            currentInstance.tooltip.textStyle.opacity = options.textStyle.opacity || this.tooltip.textStyle.opacity;
            currentInstance.tooltip.textStyle.size = options.textStyle.size || this.tooltip.textStyle.size;
            currentInstance.tooltip.isNegative = options.isNegative;
            currentInstance.tooltip.clipBounds = new TooltipLocation(options.clipBounds.x, options.clipBounds.y);
            currentInstance.tooltip.arrowPadding = options.arrowPadding;
            currentInstance.tooltip.dataBind();
        }
    }, 
    fadeOut(element: BlazorAccChartElement): void {
        if (isNullOrUndefined(element.blazor__instance) ||
        (!isNullOrUndefined(element.blazor__instance) && isNullOrUndefined(element.blazor__instance.tooltip))) {
            return;
        }
        element.blazor__instance.tooltip.fadeOut();
    },
    animateRedrawElement(
        elementId: string, duration: number, startX: number, startY: number,
        endX: number, endY: number, x: string = 'x', y: string = 'y'): void {
        let element: Element = document.getElementById(elementId);
        if (!element) {
            return null;
        }
        let isDiv: boolean = element.tagName === 'DIV';
        let setStyle: Function = (xValue: number, yValue: number): void => {
            if (isDiv) {
                (element as HTMLElement).style[x] = xValue + 'px';
                (element as HTMLElement).style[y] = yValue + 'px';
            } else {
                element.setAttribute(x, xValue + '');
                element.setAttribute(y, yValue + '');
            }
        };
        setStyle(startX, startY);
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            progress: (args: AnimationOptions): void => {
                setStyle(
                    this.linear(args.timeStamp, startX, endX - startX, args.duration),
                    this.linear(args.timeStamp, startY, endY - startY, args.duration));
            },
            end: (): void => {
                setStyle(endX, endY);
            }
        });
    },
    //Pie Animation starts here
    doAnimation(
        sliceId: string,
        startAngle: number,
        totalAngle: number,
        animationDuration: number,
        animationDelay: number,
        legendDuration: number,
        radius: number,
        center: ChartLocation): void {
        let slice: Element = document.getElementById(sliceId);
        startAngle -= 90;
        let duration: number = legendDuration ? legendDuration : animationDuration;
        let value:  number;
        center['x'] += 1;
        radius += radius * (0.414); // formula r + r / 2 * (1.414 -1)
        // need to check animation type
        new Animation({}).animate(<HTMLElement>slice, {
            duration: duration,
            delay: animationDelay,
            progress: (args: AnimationOptions): void => {
                value = this.linear(args.timeStamp, startAngle, totalAngle, args.duration);
                slice.setAttribute('d', this.getPathArc(center, startAngle, value, radius, 0));
            },
            end: (args: AnimationOptions): void => {
                center.x -= 1;
                slice.setAttribute('d', this.getPathArc(center, startAngle, startAngle - 0.00009, radius, 0));
				let datalabels: Element = document.getElementById(slice.id.split('_')[0] + '_datalabel_Series_0');
                if (datalabels) {
                    datalabels.setAttribute('style', 'visibility: visible');
                }
            }
        });
    },
    getPathArc(center: ChartLocation, start: number, end: number, radius: number, innerRadius: number): string {
        let degree: number = end - start;
        degree = degree < 0 ? (degree + 360) : degree;
        let flag: number = (degree < 180) ? 0 : 1;
        if (!innerRadius && innerRadius === 0) {
            return this.getPiePath(
                center, this.degreeToLocation(start, radius, center), this.degreeToLocation(end, radius, center), radius, flag);
        } else {
            return this.getDoughnutPath(
                center, this.degreeToLocation(start, radius, center), this.degreeToLocation(end, radius, center), radius,
                this.degreeToLocation(start, innerRadius, center), this.degreeToLocation(end, innerRadius, center), innerRadius, flag);
        }
    },
    getPiePath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number, clockWise: number): string {
        return 'M ' + center.x + ' ' + center.y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y + ' Z';
    },
    getDoughnutPath(center: ChartLocation, start: ChartLocation, end: ChartLocation, radius: number,
                    innerStart: ChartLocation, innerEnd: ChartLocation, innerRadius: number, clockWise: number): string {
        return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
            ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
            ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
    },
    degreeToLocation(degree: number, radius: number, center: ChartLocation): ChartLocation {
        let radian: number = (degree * Math.PI) / 180;
        return new ChartLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
    },
    //Pie Animation end here
    /**
     * Pie Series Legend Click Animation
     */
    ChangePiePath(pointOptions: any, center: ChartLocation, duration: number): void {
        for (let point of pointOptions){
            this.ChangePointPath(point.point, point.degree, point.start, point.pathOption, duration,
                                 center, point.radius, point.innerRadius);
        }
    },
    GetPathOption(center: ChartLocation, degree: number, startAngle: number, radius: number, innerRadius: number): string {
        if (!degree) {
            return '';
        }
        return this.getPathArc(center, startAngle, (startAngle + degree) % 360, radius, innerRadius);
    },
    ChangePointPath(point: any, degree: number, start: number, option: any, duration: number,
                    center: ChartLocation, radius : number, innerRadius: number): void {
        let seriesElement: Element = document.getElementById(option.id);
        let currentStartAngle: number;
        let curentDegree: number;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                curentDegree = this.linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                currentStartAngle = this.linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                seriesElement.setAttribute('d', this.GetPathOption(center, curentDegree, currentStartAngle, radius, innerRadius));
                if (point.isExplode) {
                    //chart.accBaseModule.explodePoints(point.index, chart, true);
                }
                (seriesElement as HTMLElement).style.visibility = 'visible';
            },
            end: (args: AnimationOptions): void => {
                (seriesElement as HTMLElement).style.visibility = point.visible ? 'visible' : 'hidden';
                seriesElement.setAttribute('d', option.direction);
                point.degree = degree;
                point.start = start;
            }
        });
    }
};
export default AccumulationChart;
