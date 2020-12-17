
/**
 * Chart native blazor source file
 */
import {
    EventHandler, Browser, Touch, BlazorDotnetObject, TapEventArgs, createElement, remove,
    Animation, AnimationOptions, isNullOrUndefined, Effect,
} from '@syncfusion/ej2-base';
import {
    TooltipModel, Tooltip, TooltipLocation, ITooltipAnimationCompleteArgs,
    measureText as textMeasure, TextStyleModel, Rect
} from '@syncfusion/ej2-svg-base';
//tslint:disable
let throttle: Function = window['_'].throttle;

let Chart: object = {
    id: '',
    mouseY: 0,
    mouseX: 0,
    eventInterval: 80,
    getElementBoundsById(id: string, isSetId: boolean = true):
    { width: number, height: number, left: number, top: number, right: number, bottom: number } {
        if (isSetId) {
            this.id = id;
        }
        let element: HTMLElement = document.getElementById(id);
        let elementRect: ClientRect = element.getBoundingClientRect();
        return {
            width: element.clientWidth || element.offsetWidth,
            height: element.clientHeight || element.offsetHeight,
            left: elementRect.left,
            top: elementRect.top,
            right: elementRect.right,
            bottom: elementRect.bottom
        };
    },
    getBrowserDeviceInfo(): object {
        return {
            browserName: Browser.info.name,
            isPointer: Browser.isPointer,
            isDevice: Browser.isDevice,
            isTouch: Browser.isTouch,
            isIos: Browser.isIos || Browser.isIos7
        };
    },
    setZoomingCipPath(seriesCollection: string, indicator: string, clipUrl: string): void  {
        let seriesEle: Element = document.getElementById(seriesCollection);
        let indicatorEle: Element = document.getElementById(indicator);
        if (seriesEle) {
            seriesEle.setAttribute('clip-path', clipUrl);
        }
        if (indicatorEle) {
            seriesEle.setAttribute('clip-path', clipUrl);
        }
    },
    setZoomingElementAttributes(
        translate: string, category: string, seriesG: Element, errorbarG: Element, symbolG: Element,
        textG: Element, shapeG: Element, element: HTMLElement): void {
        if (category === 'Indicator' && seriesG && seriesG.parentElement) {
            seriesG.parentElement.setAttribute('transform', translate);
        }
        if (seriesG) {
            seriesG.setAttribute('transform', translate);
        }
        if (errorbarG) {
            errorbarG.setAttribute('transform', translate);
        }
        if (symbolG) {
            symbolG.setAttribute('transform', translate);
        }
        if (textG) {
            textG.setAttribute('visibility', 'hidden');
        }
        if (shapeG) {
            shapeG.setAttribute('visibility', 'hidden');
        }
        if (element) {
            element.style.visibility = 'hidden';
        }
    },
    measureBreakText(
        text: string, size: string, color: string, fontFamily: string,
        fontWeight: string, fontStyle: string, opacity: string): { width: number, height: number } {
        let font: TextStyleModel = {
            color: color, size: size, fontFamily: fontFamily,
            fontWeight: fontWeight, fontStyle: fontStyle, opacity: parseInt(opacity, 10)
        };
        return textMeasure(text, font);
    },
    charCollection: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '"', '#', '$', '%', '&', '\\', '(', ')', '*', '+', ',', '-', '.', '/', ':',
        ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', ' ',
    ],
    measureText(text: string, size: string, fontWeight: string, fontStyle: string, fontFamily: string): { Width: number, Height: number } {
        let textObject: HTMLElement = document.getElementById('sfchartmeasuretext');
        if (textObject === null) {
            textObject = createElement('text', { id: 'sfchartmeasuretext' });
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
    resizeTo: {},
    getElementRect(id: string):  { Left: number, Right: number, Top: number, Bottom: number, Width: number, Height: number } {
        let element: Element = document.getElementById(id);
        let rect: ClientRect = element.getBoundingClientRect();
        remove(element);
        return {
            Left: rect.left,
            Right: rect.right,
            Top: rect.top,
            Bottom: rect.bottom,
            Width: rect.width,
            Height: rect.height
        };
    },
    dotnetref: {},
    dotnetrefCollection: [],
    unWireEvents(id: string, dotnetref: BlazorDotnetObject, isZooming: boolean = false, isScrollbar: boolean = false): void {
        let element: HTMLElement = document.getElementById(id);
        if (!element) {
            return;
        }
        this.dotnetref = dotnetref;
        this.dotnetrefCollection = this.dotnetrefCollection.filter((item: {id: string, dotnetref: BlazorDotnetObject}): boolean  => {
          return item.id !== id;
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
        if (isZooming) {
            let wheelEvent: string = Browser.info.name === 'mozilla' ? (Browser.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
            element.removeEventListener(wheelEvent, this.chartMouseWheelRef);
        }
        if (isScrollbar) {
            window.removeEventListener('mousemove', this.domMouseMoveRef);
            window.removeEventListener('mouseup', this.domMouseUpRef, false);
        }
        let resize: string = Browser.isTouch && 'orientation' in window && 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.remove(window as any, resize, this.resizeBound[id]);
        if (this.touchObject) {
            this.touchObject.destroy();
            this.touchObject = null;
        }
        /*! Apply the style for chart */
    },
    chartOnMouseDownRef: null,
    mouseMoveRef: null,
    mouseEndRef: null,
    chartOnMouseClickRef: null,
    chartRightClickRef: null,
    mouseLeaveRef: null,
    chartMouseWheelRef: null,
    domMouseMoveRef: null,
    domMouseUpRef: null,
    resizeBound: [],
    longPressBound: null,
    touchObject: null,
    wireEvents(id: string, dotnetref: BlazorDotnetObject, isZooming: boolean = false, isScrollbar: boolean = false): void {
        let element: HTMLElement = document.getElementById(id);
        if (!element) {
            return;
        }
        this.dotnetref = dotnetref;
        this.dotnetrefCollection.push({id: id, dotnetref: dotnetref});
        /*! Find the Events type */
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        this.chartOnMouseDownRef = this.chartOnMouseDown.bind(this, dotnetref, id);
        this.mouseMoveRef = this.mouseMove.bind(this, dotnetref, id);
        this.mouseEndRef = this.mouseEnd.bind(this, dotnetref, id);
        this.chartOnMouseClickRef = this.chartOnMouseClick.bind(this, dotnetref, id);
        this.chartRightClickRef = this.chartRightClick.bind(this, dotnetref, id);
        this.mouseLeaveRef = this.mouseLeave.bind(this, dotnetref, id);
        /*! Bind the Event handler */
        EventHandler.add(element, Browser.touchStartEvent, this.chartOnMouseDownRef);
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
        if (isZooming) {
            this.chartMouseWheelRef = this.chartMouseWheel.bind(this, dotnetref, id);
            let wheelEvent: string = Browser.info.name === 'mozilla' ? (Browser.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
            element.addEventListener(wheelEvent, throttle((e: WheelEvent) => {
                this.chartMouseWheelRef(e);
              }, this.eventInterval));
        }
        if (isScrollbar) {
            this.domMouseMoveRef = this.domMouseMove.bind(this, dotnetref, id);
            this.domMouseUpRef = this.domMouseUp.bind(this, dotnetref, id);
            window.addEventListener('mousemove', throttle((e: PointerEvent) => {
                this.domMouseMoveRef(e);
              }, this.eventInterval));
            window.addEventListener('mouseup', this.domMouseUpRef, false);
        }
        this.resizeBound[id] = this.chartResize.bind(this, dotnetref, id);
        let resize: string = Browser.isTouch && 'orientation' in window && 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.add(window as any, resize, this.resizeBound[id]);

        this.longPressBound = this.longPress.bind(this, dotnetref, id);
        this.touchObject = new Touch(element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });
        /*! Apply the style for chart */
    },
    getEventArgs(e: PointerEvent | TouchEvent, id: string): object {
        let clientX: number = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientX : (e as PointerEvent).clientX;
        let clientY: number = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientY : (e as PointerEvent).clientY;
        this.setMouseXY(clientX, clientY, id);
        let touches: TouchList = (<TouchEvent & PointerEvent>e).touches; //pointerId
        let touchList: object[] = [];
        if (e.type.indexOf('touch') > -1) {
            for (let i: number = 0, length: number = touches.length; i < length; i++) {
                touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: (e as PointerEvent).pointerId || 0 });
            }
        }
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
            },
            touches: touchList,
            pointerId: (e as PointerEvent).pointerId
        };
    },
    getWheelArgs(e: WheelEvent, id: string): object {
        this.setMouseXY(e.clientX, e.clientY, id);
        return {
            detail: e.detail,
            wheelDelta: e['wheelDelta'],
            target: e.currentTarget ? e.currentTarget['id'] : e.srcElement ? e.srcElement['id'] : e.target ? e.target['id'] : '',
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            browserName: Browser.info.name,
            isPointer: Browser.isPointer
        };
    },
    setMouseXY(pageX: number, pageY: number, id: string): void {
        let svgRect: ClientRect = document.getElementById(id + '_svg').getBoundingClientRect();
        let rect: ClientRect = document.getElementById(id).getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    },
    pinchStyle: 'opacity: 0; position: absolute; display: block; width: 100px; height: 100px; background: transparent; border: 2px solid blue;',
    pinchtarget: null,
    chartOnMouseDown(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        if (e.type.indexOf('touch') > -1) {
            let clientX: number = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientX :
            (e as PointerEvent).clientX;
            let clientY: number = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientY :
            (e as PointerEvent).clientY;
            this.pinchtarget = document.getElementById('pinchtarget');
            this.pinchtarget.setAttribute('style', this.pinchStyle + ' top: ' + (clientY - 50) + 'px; left: ' + (clientX - 50) + 'px;');
        }
        dotnetref.invokeMethodAsync('OnChartMouseDown', this.getEventArgs(e, id));
        return false;
    },
    chartMouseWheel(dotnetref: BlazorDotnetObject, id: string, e: WheelEvent): boolean {
        this.dotnetref = dotnetref;
        dotnetref.invokeMethodAsync('OnChartMouseWheel', this.getWheelArgs(e, id));
        e.preventDefault();
        return false;
    },
    mouseMove(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            touchArg = e as TouchEvent;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
            if (this.pinchtarget) {
                this.pinchtarget.setAttribute('style', this.pinchStyle + ' top: ' + (pageY - 50) + 'px; left: ' + (pageX - 50) + 'px;');
            }
            e.preventDefault();
        } else {
            this.isTouch = (e as PointerEvent).pointerType === 'touch' || (e as PointerEvent).pointerType === '2' || this.isTouch;
            pageX = (e as PointerEvent).clientX;
            pageY = (e as PointerEvent).clientY;
        }
        this.dotnetref = dotnetref;
        if (document.getElementById(id + '_svg')) {
            this.setMouseXY(pageX, pageY, id);
            dotnetref.invokeMethodAsync('OnChartMouseMove', this.getEventArgs(e, id));
        }
        return false;
    },
    mouseEnd(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        if (this.pinchtarget) {
            this.pinchtarget.setAttribute('style', this.pinchStyle + ' top: -100px; left: -100px;');
        }
        dotnetref.invokeMethodAsync('OnChartMouseEnd', this.getEventArgs(e, id));
        return false;
    },
    chartOnMouseClick(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        dotnetref.invokeMethodAsync('OnChartMouseClick', this.getEventArgs(e, id));
        return false;
    },
    chartRightClick(dotnetref: BlazorDotnetObject, id: string, event: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        event.preventDefault();
        event.stopPropagation();
        return false;
    },
    mouseLeave(dotnetref: BlazorDotnetObject, id: string, e: PointerEvent | TouchEvent): boolean {
        this.dotnetref = dotnetref;
        dotnetref.invokeMethodAsync('OnChartMouseLeave', this.getEventArgs(e, id));
        return false;
    },
    chartResize(dotnetref: BlazorDotnetObject, id: string, e: Event): boolean {
        if (this.resizeTo[id]) {
            clearTimeout(this.resizeTo[id]);
        }
        this.resizeTo[id] = setTimeout(() => {
            let count: number = this.dotnetrefCollection.length;
            let tempDotnetref: BlazorDotnetObject;
            for (let i: number = 0; i < count; i++) {
                tempDotnetref = this.dotnetrefCollection[i].dotnetref;
                tempDotnetref.invokeMethodAsync('RemoveElements');
            }
            dotnetref.invokeMethodAsync('OnChartResize', e);
        }, 500);
        return false;
    },
    longPress(dotnetref: BlazorDotnetObject, id: string, e: TapEventArgs): boolean {
        this.dotnetref = dotnetref;
        let clientX: number = e && e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].clientX : 0;
        let clientY: number = e && e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].clientY : 0;
        this.setMouseXY(clientX, clientY, id);
        let args: object = {
            type: 'TapHold',
            clientX: clientX,
            clientY: clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            pointerType: '',
            target: '',
            changedTouches: {
                clientX: clientX,
                clientY: clientY
            },
            touches: [],
            pointerId: 0
        };
        dotnetref.invokeMethodAsync('OnChartLongPress', args);
        return false;
    },
    tooltip: {},
    renderTooltip(tooltipOptions: string, elementId: string, tooltipModule: BlazorDotnetObject): void {
        let svgElement: Element = document.getElementById(elementId + '_svg');
        let firstRender: boolean = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0 ? false : true;
        let options: TooltipModel = JSON.parse(tooltipOptions);
        if (firstRender) {
            this.tooltip = new Tooltip(options);
            this.tooltip.appendTo('#' + elementId);
            this.tooltip.tooltipRender = () => {
                tooltipModule.invokeMethodAsync('TooltipRender');
            };
            this.tooltip.animationComplete = (args: ITooltipAnimationCompleteArgs) => {
                if (args.tooltip.fadeOuted) {
                    tooltipModule.invokeMethodAsync('TooltipAnimationComplete');
                }
            };
        } else {
            this.tooltip.location = new TooltipLocation(options.location.x, options.location.y);
            this.tooltip.content = options.content;
            this.tooltip.header = options.header;
            this.tooltip.offset = options.offset;
            this.tooltip.palette = options.palette;
            this.tooltip.shapes = options.shapes;
            this.tooltip.data = options.data;
            this.tooltip.template = options.template;
            this.tooltip.textStyle.color = options.textStyle.color || this.tooltip.textStyle.color;
            this.tooltip.textStyle.fontFamily = options.textStyle.fontFamily || this.tooltip.textStyle.fontFamily;
            this.tooltip.textStyle.fontStyle = options.textStyle.fontStyle || this.tooltip.textStyle.fontStyle;
            this.tooltip.textStyle.fontWeight = options.textStyle.fontWeight || this.tooltip.textStyle.fontWeight;
            this.tooltip.textStyle.opacity = options.textStyle.opacity || this.tooltip.textStyle.opacity;
            this.tooltip.textStyle.size = options.textStyle.size || this.tooltip.textStyle.size;
            this.tooltip.isNegative = options.isNegative;
            this.tooltip.clipBounds = new TooltipLocation(options.clipBounds.x, options.clipBounds.y);
            this.tooltip.arrowPadding = options.arrowPadding;
            this.tooltip.dataBind();
        }
    },
    getElement(id: string): Element {
        return document.getElementById(id);
    },
    drawTrackBall(svgId: string, option: object, tagName: string, className: string, clipPath: string, transform: string): void {
        let parentElement: Element = this.getElement(svgId);
        if (parentElement) {
            let childElement: Element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
            let keys: string[] = Object.keys(option);
            let key: string = '';
            for (let i: number = 0; i < keys.length; i++) {
                key = (keys[i] === 'strokeWidth') ? 'stroke-width' : (keys[i] === 'strokeDashArray') ?
                'stroke-dashArray' : (keys[i] === 'direction') ? 'd' : keys[i];
                childElement.setAttribute(key, option[keys[i]]);
            }
            childElement.setAttribute('class', className);
            childElement.setAttribute('clip-path', clipPath);
            childElement.setAttribute('transform', transform);
            parentElement.appendChild(childElement);
        }
    },
    removeHighLightedMarker(className: string): void {
        let elements: HTMLCollectionOf<Element> = document.getElementsByClassName(className);
        for (let i: number = 0, len: number = elements.length; i < len; i++) {
            remove(elements[0]);
        }
    },
    setAttribute(id: string, attribute: string, value: string): void {
        let element: Element = this.getElement(id);
        if (element) {
            element.setAttribute(attribute, value);
        }
    },
    createTooltip(id: string, text: string, top: string, left: string, fontSize: string): void {
        let tooltip: Element = document.getElementById(id);
        let style: string = 'top:' + top.toString() + 'px;' +
            'left:' + left.toString() + 'px;' +
            'color:black !important; ' +
            'background:#FFFFFF !important; ' +
            'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px; z-index:1';
        if (!tooltip) {
            tooltip = createElement('div', {
                id: id, innerHTML: '&nbsp;' + text + '&nbsp;', styles: style
            });
            document.body.appendChild(tooltip);
        } else {
            tooltip.setAttribute('innerHTML', '&nbsp;' + text + '&nbsp;');
            tooltip.setAttribute('styles', style);
        }
    },
    removeElement(id: string): void {
        let element: Element = this.getElement(id);
        if (element) {
            remove(element);
        }
    },
    applySelection(id: string, color: string): void {
        let elements: Element = document.getElementById(id);
        let childNodes: NodeList;
        if (elements && elements.childNodes) {
            childNodes = elements.childNodes;
            for (let i: number = 1, length: number = childNodes.length; i < length; i++) {
                if (childNodes[i] && (childNodes[i] as HTMLElement).tagName !== 'rect' && (childNodes[i]  as HTMLElement).setAttribute) {
                    (childNodes[i] as HTMLElement).setAttribute('fill', color);
                }
            }
        }
    },
    getAndSetTextContent(id: string, get: boolean, value: string): string {
        let element: Element = document.getElementById(id);
        if (element) {
            if (get) {
                return element.textContent;
            } else {
                element.textContent = value;
            }
        }
        return null;
    },
    doProgressiveAnimation(id: string, clipId: string, duration: number, delay: number): void {
        let clipElement: Element = this.getElement(clipId);
        let path: Element = this.getElement(id);
        let animation: Animation = new Animation({});
        let strokeDashArray: string = path.getAttribute('stroke-dasharray');
        let pathLength: number = (<SVGPathElement>path).getTotalLength();
        let currentTime: number;
        path.setAttribute('visibility', 'hidden');
        animation.animate(<HTMLElement>path, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void =>  {
                clipElement.setAttribute('visibility', 'visible');
                if (args.timeStamp >= args.delay) {
                    path.setAttribute('visibility', 'visible');
                    currentTime = Math.abs(Math.round(((args.timeStamp - args.delay) * pathLength) / args.duration));
                    path.setAttribute('stroke-dasharray', currentTime + ',' + pathLength);
                }
            },
            end: (model: AnimationOptions): void => {
                path.setAttribute('stroke-dasharray', strokeDashArray);
            }
        });
    },
    linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
        return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
    },
    doLinearAnimation(id: string, duration: number, delay: number, isInverted: boolean): void {
        let clipRect: Element = this.getElement(id);
        let animation: Animation = new Animation({});
        let effect: Function = this.linear;
        let elementHeight: number = +clipRect.getAttribute('height');
        let elementWidth: number = +clipRect.getAttribute('width');
        let xCenter: number = +clipRect.getAttribute('x');
        let yCenter: number = isInverted ? +clipRect.getAttribute('height') + +clipRect.getAttribute('y') :
            +clipRect.getAttribute('y');
        let value: number;
        animation.animate(<HTMLElement>clipRect, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void =>  {
                if (args.timeStamp >= args.delay) {
                    clipRect.setAttribute('visibility', 'visible');
                    if (isInverted) {
                        value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(1,' + (value / elementHeight) + ') translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    } else {
                        value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(' + (value / elementWidth) + ', 1) translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    }
                }
            },
            end: (model: AnimationOptions): void =>  {
                clipRect.setAttribute('transform', 'translate(0,0)');
            }
        });
    },
    doRectAnimation(
        id: string, clipId: string, duration: number, delay: number,
        index: number, centerX: number, centerY: number, elementWidth: number, elementHeight: number, isInverted: boolean): void {
        let clipElement: Element = this.getElement(clipId);
        let element: Element = this.getElement(id).children[index];
        let effect: Function = this.linear;
        let value: number;
        if (!isNullOrUndefined(element)) {
            element.setAttribute('visibility', 'hidden');
            new Animation({}).animate(<HTMLElement>element, {
                duration: duration,
                delay: delay,
                progress: (args: AnimationOptions): void => {
                    clipElement.setAttribute('visibility', 'visible');
                    if (args.timeStamp >= args.delay) {
                        element.setAttribute('visibility', 'visible');
                        if (!isInverted) {
                            elementHeight = elementHeight ? elementHeight : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(1,' + (value / elementHeight) + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        } else {
                            elementWidth = elementWidth ? elementWidth : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(' + (value / elementWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                    }
                },
                end: (model: AnimationOptions): void => {
                    element.setAttribute('transform', 'translate(0,0)');
                }
            });
        }
    },
    doMarkerAnimate(id: string, clipId: string, duration: number, delay: number, index: number, centerX: number, centerY: number
        ): void {
        let clipElement: Element = this.getElement(clipId);
        let element: Element = this.getElement(id).children[index];
        let height: number = 0;
        element.setAttribute('visibility', 'hidden');
        new Animation({}).animate(<HTMLElement>element, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                clipElement.setAttribute('visibility', 'visible');
                if (args.timeStamp > args.delay) {
                    element.setAttribute('visibility', 'visible');
                    height = ((args.timeStamp - args.delay) / args.duration);
                    element.setAttribute('transform', 'translate(' + centerX
                        + ' ' + centerY + ') scale(' + height + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                }
            },
            end: (model: AnimationOptions): void => {
                element.setAttribute('visibility', '');
            }
        });
    },
    doPolarRadarAnimation(id: string, clipId: string, duration: number, delay: number, chartcenterX: number, chartcenterY: number): void {
        let clipElement: Element = this.getElement(clipId);
        let length: number = this.getElement(id).children.length;
        for (let count: number = 1; count < length; count++) {
            let element: Element = document.getElementById(id).children[count];
            let elementHeight: number = 0;
            element.setAttribute('visibility', 'hidden');
            new Animation({}).animate(<HTMLElement>element, {
                duration: duration,
                delay: delay,
                progress: (args: AnimationOptions): void => {
                    clipElement.setAttribute('visibility', 'visible');
                    if (args.timeStamp > args.delay) {
                        element.setAttribute('visibility', 'visible');
                        elementHeight = ((args.timeStamp - args.delay) / args.duration);
                        element.setAttribute('transform', 'translate(' + chartcenterX + ' ' + chartcenterY +
                        ') scale(' + elementHeight + ') translate(' + (-chartcenterX) + ' ' + (-chartcenterY) + ')');
                    }
                },
                end: (model: AnimationOptions): void => {
                    element.setAttribute('visibility', 'visible');
                    element.removeAttribute('transform');
                }
            });
        }
    },
    templateAnimate(element: Element, delay: number, duration: number, name: Effect, isRemove?: boolean, clipElement?: Element): void {
        new Animation({}).animate(<HTMLElement>element, {
            duration: duration,
            delay: delay,
            name: name,
            progress: (args: AnimationOptions): void => {
                if (clipElement) {
                    clipElement.setAttribute('visibility', 'visible');
                }
                args.element.style.visibility = 'visible';
            },
            end: (args: AnimationOptions): void => {
                if (isRemove) {
                    remove(args.element);
                } else {
                    args.element.style.visibility = 'visible';
                }
            },
        });
    },
    doDataLabelAnimation(shapeId: string, textId: string, tempId: string, clipId: string, duration: number, delay: number): void {
        let shapeElements: Element = this.getElement(shapeId);
        let textElements: Element = this.getElement(textId);
        let tempElement: HTMLElement = this.getElement(tempId);
        let centerX: number;
        let centerY: number;
        let length: number = tempElement ? 1 : textElements.children.length;
        let element: Element;
        for (let i: number = 0; i < length; i++) {
            if (tempElement) {
                tempElement.style.visibility = 'hidden';
                this.templateAnimate(tempElement, delay, duration, 'ZoomIn');
            } else {
                element = textElements.children[i];
                centerX = (+element.getAttribute('x')) + ((+element.getAttribute('width')) / 2);
                centerY = (+element.getAttribute('y')) + ((+element.getAttribute('height')) / 2);
                this.doMarkerAnimate(textId, clipId, duration, delay, i, centerX, centerY);
                if (shapeElements.children[i]) {
                    element = shapeElements.children[i];
                    centerX = (+element.getAttribute('x')) + ((+element.getAttribute('width')) / 2);
                    centerY = (+element.getAttribute('y')) + ((+element.getAttribute('height')) / 2);
                    this.doMarkerAnimate(shapeId, clipId, duration, delay, i, centerX, centerY);
                }
            }
        }
    },
    pathAnimation(id: string, direction: string, redraw: boolean, previousDirection: string, animateDuration: number
        ): void {
        let element: Element = this.getElement(id);
        if (!redraw || element == null) {
            return null;
        }
        let duration: number = 300;
        if (animateDuration) {
            duration = animateDuration;
        }
        let startDirections: string = previousDirection || element.getAttribute('d');
        let splitDirections: string[] = startDirections.split(/(?=[LMCZAQ])/);
        let endDirections: string[] = direction.split(/(?=[LMCZAQ])/);
        let currentDireciton: string;
        let startPath: string[] = [];
        let endPath: string[] = [];
        let c: number;
        let end: number;
        element.setAttribute('d', startDirections);
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            progress: (args: AnimationOptions): void => {
                currentDireciton = '';
                splitDirections.map((directions: string, index: number) => {
                    startPath = directions.split(' ');
                    endPath = endDirections[index] ? endDirections[index].split(' ') : startPath;
                    if (startPath[0] === 'Z') {
                        currentDireciton += 'Z' + ' ';
                    } else {
                        currentDireciton += startPath[0] + ' ' +
                            this.linear(args.timeStamp, +startPath[1], (+endPath[1] - +startPath[1]), args.duration) + ' ' +
                            this.linear(args.timeStamp, +startPath[2], (+endPath[2] - +startPath[2]), args.duration) + ' ';
                    }
                    if (startPath[0] === 'C' || startPath[0] === 'Q') {
                        c = 3;
                        end = startPath[0] === 'Q' ? 4 : 6;
                        while (c < end) {
                            currentDireciton += this.linear(args.timeStamp, +startPath[c], (+endPath[c] - +startPath[c]), args.duration)
                            + ' ' + this.linear(args.timeStamp, +startPath[++c], (+endPath[c] - +startPath[c]), args.duration) + ' ';
                            ++c;
                        }
                    }
                    if (startPath[0] === 'A') {
                        currentDireciton += 0 + ' ' + 0 + ' ' + 1 + ' ' +
                            this.linear(args.timeStamp, +startPath[6], (+endPath[6] - +startPath[6]), args.duration) + ' ' +
                            this.linear(args.timeStamp, +startPath[7], (+endPath[7] - +startPath[7]), args.duration) + ' ';
                    }
                });
                element.setAttribute('d', currentDireciton);
            },
            end: (): void => {
                element.setAttribute('d', direction);
            }
        });
    },
    getPreviousDirection(id: string): string {
        let element: Element = this.getElement(id);
        let previousDirection: string = element ? element.getAttribute('d') : null;
        return previousDirection;
    },
    getPreviousLocation(id: string, circlePath: string) {
        let element: Element = this.getElement(id);
        let x: number = element ? +element.getAttribute(circlePath + 'x') : 0;
        let y: number = element ? +element.getAttribute(circlePath + 'y') : 0;
        return { X: x, Y: y };
    },
    animateRectElement(
        element: Element, delay: number, duration: number, currentRect: Rect, previousRect: Rect
        ): void {
        let setStyle: Function = (rect: Rect): void => {
            element.setAttribute('x', rect.x + '');
            element.setAttribute('y', rect.y + '');
            element.setAttribute('width', rect.width + '');
            element.setAttribute('height', rect.height + '');
        };
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                setStyle(
                    new Rect(
                        this.linear(args.timeStamp, previousRect.x, currentRect.x - previousRect.x, args.duration),
                        this.linear(args.timeStamp, previousRect.y, currentRect.y - previousRect.y, args.duration),
                        this.linear(args.timeStamp, previousRect.width, currentRect.width - previousRect.width, args.duration),
                        this.linear(args.timeStamp, previousRect.height, currentRect.height - previousRect.height, args.duration)
                        ));
            },
            end: (): void => {
                setStyle(currentRect);
            },
        });
    },
     animateRedrawElement(
         elementId: string, duration: number, startX: number, startY: number,
         endX: number, endY: number, x: string = 'x', y: string = 'y'
        ): void  {
        let element: Element = this.getElement(elementId);
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
    appendChildElement(
        parent: HTMLElement, childElement: HTMLElement,
        redraw?: boolean, isAnimate: boolean = false, x: string = 'x', y: string = 'y',
        start?: TooltipLocation, direction?: string, forceAnimate: boolean = false,
        isRect: boolean = false, previousRect: Rect = null, animateDuration?: number
    ): void {
        let existChild: HTMLElement = parent.querySelector('#' + childElement.id);
        let element: HTMLElement = existChild || this.getElement(childElement.id);
        let child: HTMLElement = childElement;
        let duration: number = animateDuration ? animateDuration : 300;
        if (redraw && isAnimate && element) {
            start = start || (element.tagName === 'DIV' ?
                new TooltipLocation(+(element.style[x].split('px')[0]), +(element.style[y].split('px')[0])) :
                new TooltipLocation(+element.getAttribute(x), +element.getAttribute(y)));
            if (direction !== '' && direction !== null) {
                this.pathAnimation(childElement, childElement.getAttribute('d'), redraw, direction, duration);
            } else if (isRect && previousRect) {
                this.animateRectElement(
                    child, 0, duration, new Rect(
                        +element.getAttribute('x'), +element.getAttribute('y'),
                        +element.getAttribute('width'), +element.getAttribute('height')
                    ),
                    previousRect
                );
            } else {
                let end: TooltipLocation = child.tagName === 'DIV' ?
                    new TooltipLocation(+(child.style[x].split('px')[0]), +(child.style[y].split('px')[0])) :
                    new TooltipLocation(+child.getAttribute(x), +child.getAttribute(y));
                this.animateRedrawElement(child, duration, start, end, x, y);
            }
        } else if (redraw && isAnimate && !element && forceAnimate) {
            this.templateAnimate(child, 0, 600, 'FadeIn');
        }
    },
    processAppendChild(
        parentId: string, childId: string, locationX: number, locationY: number, rectX: number, rectY: number,
        rectWidth: number, rectHeight: number, redraw?: boolean, isAnimate: boolean = false, x: string = 'x', y: string = 'y',
        direction?: string, forceAnimate: boolean = false, isRect: boolean = false, animateDuration?: number): void {
        let parentElement: HTMLElement = <HTMLElement>this.getElement(parentId);
        let childElement: HTMLElement = <HTMLElement>this.getElement(childId);
        let start: TooltipLocation = new TooltipLocation(locationX, locationY);
        let rect: Rect = new Rect(rectX, rectY, rectWidth, rectHeight);
        this.appendChildElement(parentElement, childElement, redraw, isAnimate, x, y, start, direction, forceAnimate, isRect, rect, animateDuration);
    },
    createStyleElement(styleId: string, styleInnerHTML: string): void {
      document.body.appendChild(createElement('style', {
        id: styleId,
        innerHTML: styleInnerHTML
      }));
    },
    isLassoId(x: number, y: number): string {
        let lassoEle: Element = document.elementFromPoint(x, y);
        return lassoEle ? lassoEle.id : '';
    },
    doErrorBarAnimation(id: string, clipId: string, delay: number, isInverted: boolean): void {
        let errorBarElements: Element = this.getElement(id);
        let clipElement: Element = this.getElement(clipId);
        if (!errorBarElements) {
            return null;
        }
        let j: number = 1;
        while (j < errorBarElements.children.length) {
            (<HTMLElement>errorBarElements.children[j]).style.visibility = 'hidden';
            this.templateAnimate(errorBarElements.children[j]  as HTMLElement, delay, 350, isInverted ? 'SlideLeftIn' : 'SlideBottomIn', false, clipElement);
            j++;
        }
    },
    getTemplateSize(id: string): {width: number, height: number} {
        let element: HTMLElement = this.getElement(id);
        if (element) {
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        }
        return null;
    },
    getScrollEventArgs(e: PointerEvent | TouchEvent, lastScrollbar: boolean = false ): object {
        let clientX: number = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientX : (e as PointerEvent).clientX;
        let clientY: number = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].clientY : (e as PointerEvent).clientY;
        let mouseXY: { mouseX: number, mouseY: number } = this.setScrollMouseXY(clientX, clientY, e.target['id'], lastScrollbar);
        let touches: TouchList = (<TouchEvent & PointerEvent>e).touches; //pointerId
        let touchList: object[] = [];
        if (e.type.indexOf('touch') > -1) {
            for (let i: number = 0, length: number = touches.length; i < length; i++) {
                touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: (e as PointerEvent).pointerId || 0 });
            }
        }
        let id: string = (e.target as Element).id;
        id = id.indexOf('scrollBar') > -1 ? id : this.svgId;
        return {
            type: e.type,
            clientX: (e as PointerEvent).clientX,
            clientY: (e as PointerEvent).clientY,
            mouseX: mouseXY.mouseX,
            mouseY: mouseXY.mouseY,
            pointerType: (e as PointerEvent).pointerType,
            target: id,
            changedTouches: {
                clientX: (<TouchEvent & PointerEvent>e).changedTouches ? (<TouchEvent & PointerEvent>e).changedTouches[0].clientX : 0,
                clientY: (<TouchEvent & PointerEvent>e).changedTouches ? (<TouchEvent & PointerEvent>e).changedTouches[0].clientY : 0
            },
            touches: touchList,
            pointerId: (e as PointerEvent).pointerId
        };
    },
    getScrollWheelArgs(e: WheelEvent): object {
        let mouseXY: { mouseX: number, mouseY: number } = this.setScrollMouseXY(e.clientX, e.clientY, e.currentTarget['id']);
        return {
            detail: e.detail,
            wheelDelta: e['wheelDelta'],
            target: e.currentTarget ? e.currentTarget['id'] : e.srcElement ? e.srcElement['id'] : e.target ? e.target['id'] : '',
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: mouseXY.mouseX,
            mouseY: mouseXY.mouseY,
            browserName: Browser.info.name,
            isPointer: Browser.isPointer
        };
    },
    svgId: null,
    setScrollMouseXY(pageX: number, pageY: number, id: string, lastScrollbar: boolean = false): { mouseX: number, mouseY: number } {
        this.svgId = !lastScrollbar ? id : this.svgId;
        if (!lastScrollbar && id.indexOf('_scrollBar_svg') === -1) {
            let chartId: string = id.split('_scrollBar')[0];
            let splitId: string[] = id.split('_');
            this.svgId = chartId + '_scrollBar_svg' + splitId[splitId.length - 1];
        }
        let svgRect: ClientRect = this.getElement(this.svgId).getBoundingClientRect();
        let mouseX: number = pageX - Math.max(svgRect.left, 0);
        let mouseY: number = pageY - Math.max(svgRect.top, 0);
        return { mouseX: mouseX, mouseY: mouseY };
    },
    domMouseMove(dotnetref: BlazorDotnetObject, id: string, event: MouseEvent | TouchEvent | PointerEvent): boolean {
        if (!isNullOrUndefined(this.svgId)) {
            let evtArgs: object = this.getScrollEventArgs(event, true);
            dotnetref.invokeMethodAsync('ScrollMouseMove', evtArgs);
        }
        return false;
    },
    domMouseUp(dotnetref: BlazorDotnetObject, id: string, event: MouseEvent | TouchEvent | PointerEvent): boolean {
        if (!isNullOrUndefined(this.svgId)) {
            let evtArgs: object = this.getScrollEventArgs(event, true);
            dotnetref.invokeMethodAsync('ScrollMouseUp', evtArgs);
            this.svgId = null;
        }
        return false;
    },
    scrollMouseDown(event: MouseEvent | TouchEvent | PointerEvent): boolean {
        let evtArgs: object = this.getScrollEventArgs(event);
        this.dotnetref.invokeMethodAsync('ScrollMouseDown', evtArgs);
        return false;
    },
    scrollMouseMove(event: MouseEvent | TouchEvent | PointerEvent): boolean {
        throttle(() => {
            let evtArgs: object = this.getScrollEventArgs(event);
            this.dotnetref.invokeMethodAsync('ScrollMouseMove', evtArgs);
        }, this.eventInterval);
        return false;
    },
    scrollMouseUp(event: MouseEvent | TouchEvent | PointerEvent): boolean {
        let evtArgs: object = this.getScrollEventArgs(event);
        this.dotnetref.invokeMethodAsync('ScrollMouseUp', evtArgs);
        this.svgId = null;
        return false;
    },
    scrollMouseWheel(event: WheelEvent): boolean {
        throttle(() => {
            let evtArgs: object = this.getScrollWheelArgs(event);
            this.dotnetref.invokeMethodAsync('ScrollMouseWheel', evtArgs);
        }, this.eventInterval);
        return false;
    }
};
export default Chart;