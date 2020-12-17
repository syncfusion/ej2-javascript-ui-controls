import { EventHandler, Browser, BlazorDotnetObject, Internationalization, isNullOrUndefined, Animation, AnimationOptions, createElement, remove } from '@syncfusion/ej2-base';
import { TooltipModel, Tooltip, TooltipLocation } from '@syncfusion/ej2-svg-base';

/**
 * RangeNavigator blazor script file.
 */
class SfRangeNavigator {
    public element: BlazorRangeNavigatorElement;
    public dotNetRef: BlazorDotnetObject;
    public mouseY: number = 0;
    public mouseX: number = 0;
    public id: string;
    public sliderChangeValue: SliderChangeValues;
    public reSizeTo: number = 0;
    public isTooltipHide: boolean = true;
    public toolTipInterval: number;
    public isDrag: boolean;
    public tooltip: Tooltip[] = [];
    constructor(id: string, element: BlazorRangeNavigatorElement, dotNetRef: BlazorDotnetObject) {
        this.id = id;
        this.element = element;
        this.dotNetRef = dotNetRef;
        this.element.blazor__instance = this;
    }
    public unWireEvents(): void {
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, Browser.touchStartEvent, this.rangeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.rangeOnMouseClick);
        EventHandler.remove(this.element, cancelEvent, this.mouseLeave);
        // tslint:disable-next-line:max-line-length
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.rangeResize.bind(this));
    }
    public wireEvents(): void {
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, Browser.touchStartEvent, this.rangeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.rangeOnMouseClick, this);
        EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);
        // tslint:disable-next-line:max-line-length
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.rangeResize.bind(this));
    }
    private rangeOnMouseDown(e: PointerEvent): void {
        this.setMouseX(this.getPageX(e));
        this.element.blazor__instance.isDrag = true;
        this.dotNetRef.invokeMethodAsync('OnRangeMouseDown', this.getEventArgs(e));
    }
    private mouseMove(e: PointerEvent): void {
        if (document.getElementById(this.id + '_svg')) {
            this.setMouseX(this.getPageX(e));
            if (this.element.blazor__instance.isDrag && this.sliderChangeValue)
               this.element.blazor__instance.changeSlider();
        }
    }
    private changeSlider() {
        let start: number;
        let end: number;
        if (this.sliderChangeValue.isDrag && this.mouseX >= this.sliderChangeValue.boundsX) {
            switch (this.sliderChangeValue.currentSlider) {
                case "Left":
                    this.sliderChangeValue.startValue = this.getRangeValue(Math.abs(this.mouseX - this.sliderChangeValue.boundsX));
                    break;
                case "Right":
                    this.sliderChangeValue.endValue = this.getRangeValue(Math.abs(this.mouseX - this.sliderChangeValue.boundsX));
                    break;
                case "Middle":
                    start = Math.max(this.getRangeValue(Math.abs(this.sliderChangeValue.startX - (this.sliderChangeValue.previousMoveX - this.mouseX) - this.sliderChangeValue.boundsX)), this.sliderChangeValue.rangeMin);
                    end = Math.min(this.getRangeValue(Math.abs(this.sliderChangeValue.endX - (this.sliderChangeValue.previousMoveX - this.mouseX) - this.sliderChangeValue.boundsX)), this.sliderChangeValue.rangeMax);
                    if (Math.floor(Math.abs(this.getXLocation(end) - this.getXLocation(start))) == Math.floor(this.sliderChangeValue.sliderWidth)) {
                        this.sliderChangeValue.startValue = start;
                        this.sliderChangeValue.endValue = end;
                    }
                    break;
            }
            this.setSlider(this.sliderChangeValue.startValue, this.sliderChangeValue.endValue, !this.sliderChangeValue.defferedUpdate, this.sliderChangeValue.enableTooltip);
            this.sliderChangeValue.previousMoveX = this.mouseX;
        }
    }
    private setSlider(start: number, end: number, trigger: boolean, showTooltip: boolean): void {
        let selectedElement = document.getElementById(this.element.blazor__instance.id + '_SelectedArea');
        let leftUnSelectedElement = document.getElementById(this.element.blazor__instance.id + '_leftUnSelectedArea');
        let rightUnSelectedElement = document.getElementById(this.element.blazor__instance.id + '_rightUnSelectedArea');
        let leftSlider = document.getElementById(this.element.blazor__instance.id + '_LeftSlider');
        let rightSlider = document.getElementById(this.element.blazor__instance.id + '_RightSlider');
        if (!(end >= start)) {
            start = [end, end = start][0];
        }
        let padding = this.sliderChangeValue.boundsX;
        start = end >= start ? start : [end, end = start][0];
        start = Math.max(start, this.sliderChangeValue.rangeMin);
        end = Math.min(end, this.sliderChangeValue.rangeMax);
        this.sliderChangeValue.startX = padding + this.getXLocation(start);
        this.sliderChangeValue.endX = padding + this.getXLocation(end);
        let selectedX: number = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.endX : this.sliderChangeValue.startX;
        let rightPadding: number = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.startX : this.sliderChangeValue.endX;
        this.sliderChangeValue.sliderWidth = Math.abs(this.sliderChangeValue.endX - this.sliderChangeValue.startX);
        selectedElement.setAttribute('x', (selectedX) + '');
        selectedElement.setAttribute('width', this.sliderChangeValue.sliderWidth + '');
        leftUnSelectedElement.setAttribute('width', (selectedX - padding) + '');
        rightUnSelectedElement.setAttribute('x', rightPadding + '');
        rightUnSelectedElement.setAttribute('width', (this.sliderChangeValue.boundsWidth - (rightPadding - padding)) + '');
        leftSlider.setAttribute('transform', 'translate(' + (this.sliderChangeValue.startX - this.sliderChangeValue.thumpPadding) + ', 0)');
        rightSlider.setAttribute('transform', 'translate(' + (this.sliderChangeValue.endX - this.sliderChangeValue.thumpPadding) + ', 0)');
        let left: number = 0;
        let leftX: number = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.endX : this.sliderChangeValue.startX;
        let rightX: number = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.startX : this.sliderChangeValue.endX;
        let leftRect = {
            x: this.sliderChangeValue.isLeightWeight ? left + padding : padding,
            y: this.sliderChangeValue.isLeightWeight ? 0 : this.sliderChangeValue.boundsY,
            width: this.sliderChangeValue.isLeightWeight ? leftX - padding : leftX,
            height: this.sliderChangeValue.isLeightWeight ? this.sliderChangeValue.thumpY : this.sliderChangeValue.boundsHeight
        };
        let rightRect = {
            x: this.sliderChangeValue.isLeightWeight ? left + rightX : rightX,
            y: this.sliderChangeValue.isLeightWeight ? 0 : this.sliderChangeValue.boundsY,
            width: (this.sliderChangeValue.boundsWidth - (rightPadding - padding)),
            height: this.sliderChangeValue.isLeightWeight ? this.sliderChangeValue.thumpY : this.sliderChangeValue.boundsHeight
        };
        let midRect = {
            x: this.sliderChangeValue.isLeightWeight ? leftX + left : 0,
            y: this.sliderChangeValue.isLeightWeight ? 0 : this.sliderChangeValue.boundsY,
            width: this.sliderChangeValue.isLeightWeight ? Math.abs(this.sliderChangeValue.endX - this.sliderChangeValue.startX) : rightX,
            height: this.sliderChangeValue.isLeightWeight ? this.sliderChangeValue.thumpY : this.sliderChangeValue.boundsHeight
        };
        if (this.element.blazor__instance.tooltip.length > 0)
            this.updateTooltip(leftRect, rightRect, midRect, this.sliderChangeValue.startX, this.sliderChangeValue.endX);
    }
    private updateTooltip(leftRect: any, rightRect: any, midRect: any, start: number, end: number): void {
        let content: string = this.getTooltipContent(this.sliderChangeValue.endValue);
        let rect: any = this.sliderChangeValue.enableRtl ? leftRect : rightRect;
        this.element.blazor__instance.tooltip[0].location.x = end;
        this.element.blazor__instance.tooltip[0].areaBounds = rect;
        this.element.blazor__instance.tooltip[0].content = [content];
        this.element.blazor__instance.tooltip[0].dataBind();
        content = this.getTooltipContent(this.sliderChangeValue.startValue);
        rect = this.sliderChangeValue.enableRtl ? rightRect : leftRect;
        this.element.blazor__instance.tooltip[1].location.x = start;
        this.element.blazor__instance.tooltip[1].content = [content];
        this.element.blazor__instance.tooltip[1].areaBounds = rect;
        this.element.blazor__instance.tooltip[1].dataBind();
    }
    private getTooltipContent(point: number): string {
        let format: string = this.sliderChangeValue.format;
        let isCustom: boolean = format.match('{value}') !== null;
        if (this.sliderChangeValue.valueType === 'DateTime') {
            return (new Internationalization().getDateFormat({ format: format || 'MM/dd/yyyy' })(new Date(point)));
        }
        else {
            return new Internationalization().getNumberFormat({
                format: isCustom ? '' : format,
            })(this.sliderChangeValue.valueType === 'Logarithmic' ? Math.pow(this.sliderChangeValue.logBase, point) : point);
        }
    }
    private getRangeValue(x: number): number {
        return (!this.sliderChangeValue.enableRtl ? x / this.sliderChangeValue.boundsWidth : (1 - (x / this.sliderChangeValue.boundsWidth))) * this.sliderChangeValue.rangeDelta + this.sliderChangeValue.rangeMin;
    }
    private getXLocation(x: number): number {
        let result: number = (x - this.sliderChangeValue.rangeMin) / this.sliderChangeValue.rangeDelta;
        return (this.sliderChangeValue.enableRtl ? (1 - result) : result) * this.sliderChangeValue.boundsWidth;
    }
    private mouseEnd(e: PointerEvent): void {
        this.setMouseX(this.getPageX(e));
        if (this.element.blazor__instance.isDrag && this.sliderChangeValue) {
            this.dotNetRef.invokeMethodAsync("GetStartEndValue", this.sliderChangeValue.startValue, this.sliderChangeValue.endValue, true, this.sliderChangeValue.enableTooltip)
            this.element.blazor__instance.isDrag = false;
        }
        this.dotNetRef.invokeMethodAsync('OnRangeMouseEnd', this.getEventArgs(e));
    }
    private rangeOnMouseClick(e: PointerEvent): void {
        this.dotNetRef.invokeMethodAsync('OnRangeMouseClick', this.getEventArgs(e));
    }
    private mouseLeave(e: PointerEvent): void {
        this.setMouseX(this.getPageX(e));
        this.element.blazor__instance.isDrag = false;
        this.dotNetRef.invokeMethodAsync('OnRangeMouseLeave', this.getEventArgs(e));
        if (this.isTooltipHide) {
          this.fadeOutTooltip();
        }
    }
    private fadeOutTooltip(): void {
        if (this.sliderChangeValue && this.sliderChangeValue.isTooltipHide) {
            window.clearInterval(this.toolTipInterval);
            if (this.element.blazor__instance.tooltip[1]) {
                this.toolTipInterval = window.setTimeout(
                    (): void => {
                        this.element.blazor__instance.tooltip[0].fadeOut();
                        this.element.blazor__instance.tooltip[1].fadeOut();
                    },
                    1000
                );
            }
        }
    }
    private getPageX(e: PointerEvent): number {
        if (e.type === 'touchmove') {
            return (<TouchEvent & PointerEvent>e).changedTouches[0].clientX;
        } else {
            return e.clientX;
        }
    }
    private rangeResize(e: Event): void {
        this.element.blazor__instance.isDrag = false;
        if (this.reSizeTo) {
            clearTimeout(this.reSizeTo);
        }
        this.reSizeTo = window.setTimeout(
            (): void => {
                this.dotNetRef.invokeMethodAsync('OnRangeResize', e);
            },
            500);
    }
    private setMouseX(pageX: number): void {
        let svgRect: ClientRect = document.getElementById(this.id + '_svg').getBoundingClientRect();
        let rect: ClientRect = document.getElementById(this.id).getBoundingClientRect();
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }
    private getEventArgs(e: PointerEvent): object {
        return {
            type: e.type,
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            pointerType: e.pointerType,
            target: (e.target as Element).id,
            changedTouches: {
                clientX: (<TouchEvent & PointerEvent>e).changedTouches ? (<TouchEvent & PointerEvent>e).changedTouches[0].clientX : 0,
                clientY: (<TouchEvent & PointerEvent>e).changedTouches ? (<TouchEvent & PointerEvent>e).changedTouches[0].clientY : 0
            }
        };
    }
}

interface BlazorRangeNavigatorElement extends HTMLElement {
    blazor__instance: SfRangeNavigator;
}

interface SliderChangeValues {
    rangeMin: number;
    rangeMax: number;
    rangeDelta: number;
    boundsX: number;
    boundsWidth: number;
    enableRtl: boolean;
    startX: number;
    endX: number;
    sliderWidth: number;
    defferedUpdate: boolean;
    enableTooltip: boolean;
    valueType: string;
    isDrag: boolean;
    previousMoveX: number;
    currentSlider: string;
    isTooltipHide: boolean;
    startValue: number;
    endValue: number;
    isLeightWeight: boolean;
    thumpPadding: number;
    thumpY: number;
    boundsY: number;
    boundsHeight: number;
    format: string;
    logBase: number;
}
// tslint:disable
let RangeNavigator: object = {
    getElementBoundsById(id: string, dotNetRef: BlazorDotnetObject, element: BlazorRangeNavigatorElement): { width: number, height: number } {
        if (element) {
            let navigator = new SfRangeNavigator(id, element, dotNetRef);
            navigator.unWireEvents();
            navigator.wireEvents();
            return { width: element.clientWidth || element.offsetWidth, height: element.clientHeight || element.offsetHeight };
        }
        return { width: 0, height: 0 };
    },
    charCollection: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', ':',
        ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', ' '
    ],
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
        let charList = this.charCollection;
        let fontKeysLength: number = fontkeys.length;
        for (let i: number = 0; i < fontKeysLength; i++) {
            let fontValues: string[] = fontkeys[i].split('_');
            let fontWeight: string = fontValues[1];
            let fontStyle: string = fontValues[2];
            let fontFamily: string = fontValues[3];
            let charKey: string = '_' + fontWeight + fontStyle + fontFamily;
            for (let j: number = 0; j < charList.length; j++) {
                charSizeList[charList[j] + charKey] = this.measureText(charList[j], fontValues[0], fontWeight, fontStyle, fontFamily);
            }
        }
        return JSON.stringify(charSizeList);
    },
    getCharSizeByCharKey(charkey: string): { Width: number, Height: number } {
        let fontValues: string[] = charkey.split('_');
        return this.measureText(fontValues[0], fontValues[1], fontValues[2], fontValues[3], fontValues[4]);
    },
    
    getValueForSliderChange(element: BlazorRangeNavigatorElement, sliderChangeValue: SliderChangeValues) {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.sliderChangeValue = sliderChangeValue;
              element.blazor__instance.isTooltipHide = sliderChangeValue.isTooltipHide;
              element.blazor__instance.isDrag = true;
        }
    },
    getElementRect(id: string): { Left: number, Right: number, Top: number, Bottom: number, Width: number, Height: number } {
        let element: Element = document.getElementById(id);
        let rect: ClientRect;
        if (element) {
            rect = element.getBoundingClientRect() as ClientRect;
            remove(element);
        }
        return {
            Left: rect.left,
            Right: rect.right,
            Top: rect.top,
            Bottom: rect.bottom,
            Width: rect.width,
            Height: rect.height
        };
    },
    tooltip: [],
    renderTooltip(leftTooltipOption: string, rightTooltipOption: string, leftElementId: string, rightElementId: string, element: BlazorRangeNavigatorElement): void {
        let svgElement: Element;
        let firstRender: boolean;
        let idCollection: string[] = [leftElementId, rightElementId];
        let tooltipOptions: string[] = [leftTooltipOption, rightTooltipOption];
        let id: string;
        let options: TooltipModel 
        for (var i = 1; i >= 0; i--) {
            id = idCollection[i];
            svgElement = document.getElementById(id + '_svg');
            firstRender = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0 ? false : true;
            options = JSON.parse(tooltipOptions[i]);
            this.tooltip[id] = new Tooltip(options);
            this.tooltip[id].appendTo('#' + id);
            element.blazor__instance.tooltip[i] = this.tooltip[id];
            element.blazor__instance.tooltip[i] = this.tooltip[id];
        }        
    },
    setAttribute(id: string, attribute: string, value: string): void {
        let element: Element = document.getElementById(id);
        if (element) {
            element.setAttribute(attribute, value);
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
    }
};
export default RangeNavigator;