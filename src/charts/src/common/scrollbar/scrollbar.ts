import { EventHandler, Browser, remove } from '@syncfusion/ej2-base';
import { Animation, AnimationOptions, createElement } from '@syncfusion/ej2-base';
import { ScrollElements, createScrollSvg } from './scrollbar-elements';
import { getElement, minMax } from '../utils/helper';
import { Chart } from '../../chart/chart';
import { Axis, linear, IScrollbarThemeStyle, IScrollEventArgs, VisibleRangeModel } from '../../chart/index';
import { getScrollbarThemeColor } from '../model/theme';
import { scrollChanged, scrollEnd, scrollStart } from '../model/constants';

/**
 * Scrollbar Base
 */

export class ScrollBar {

    public axis: Axis;

    public component: Chart;

    public zoomFactor: number;

    public zoomPosition: number;

    public svgObject: Element;

    public width: number;

    public height: number;
    /** @private */
    public elements: Element[];
    /** @private */
    public isVertical: boolean;
    /** @private */
    public isThumbDrag: boolean;
    /** @private */
    public mouseX: number;
    /** @private */
    public mouseY: number;
    /** @private */
    public startX: number;
    /** @private */
    public scrollX: number;
    /** @private */
    public scrollY: number;
    /** @private */
    public animateDuration: number;
    /** @private */
    public browserName: string;
    /** @private */
    public isPointer: Boolean;
    /** @private */
    public isScrollUI: boolean;
    /** @private */
    public scrollbarThemeStyle: IScrollbarThemeStyle;

    private scrollElements: ScrollElements;

    private isResizeLeft: boolean;

    private isResizeRight: boolean;

    private previousXY: number;

    private previousWidth: number;

    private previousRectX: number;

    private mouseMoveListener: EventListener;

    private mouseUpListener: EventListener;
    public axes: Axis[];
    private startZoomPosition: number;
    private startZoomFactor: number;
    private startRange: VisibleRangeModel;
    private scrollStarted: boolean;


    /**
     * Constructor for creating scrollbar
     * @param component 
     * @param axis 
     */
    constructor(component: Chart, axis?: Axis) {
        this.component = component;
        this.elements = [];
        this.scrollElements = new ScrollElements();
        this.axis = axis;
        this.mouseMoveListener = this.scrollMouseMove.bind(this);
        this.mouseUpListener = this.scrollMouseUp.bind(this);
        this.animateDuration = 500;
        this.isPointer = Browser.isPointer;
        this.browserName = Browser.info.name;
    }

    /**
     * To Mouse x and y position
     * @param e 
     */
    private getMouseXY(e: PointerEvent | MouseWheelEvent): void {
        let pageX: number;
        let pageY: number;
        let touchArg: TouchEvent;
        if (e.type.indexOf('touch') > -1) {
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        } else {
            pageX = e.clientX;
            pageY = e.clientY;
        }
        let svgRect: ClientRect = getElement('scrollBar_svg' + this.axis.name).getBoundingClientRect();
        this.mouseX = pageX - Math.max(svgRect.left, 0);
        this.mouseY = pageY - Math.max(svgRect.top, 0);
    }
    /**
     * Method to bind events for scrollbar svg object
     * @param element 
     */
    private wireEvents(element: Element): void {
        EventHandler.add(element, Browser.touchStartEvent, this.scrollMouseDown, this);
        EventHandler.add(element, Browser.touchMoveEvent, this.scrollMouseMove, this);
        EventHandler.add(element, Browser.touchEndEvent, this.scrollMouseUp, this);
        EventHandler.add(element, 'mousewheel', this.scrollMouseWheel, this);
        window.addEventListener('mousemove', this.mouseMoveListener, false);
        window.addEventListener('mouseup', this.mouseUpListener, false);
    }
    /**
     * Method to remove events for srcollbar svg object
     * @param element 
     */
    private unWireEvents(element: Element): void {
        EventHandler.remove(element, Browser.touchStartEvent, this.scrollMouseDown);
        EventHandler.remove(element, Browser.touchMoveEvent, this.scrollMouseMove);
        EventHandler.remove(element, Browser.touchEndEvent, this.scrollMouseUp);
        EventHandler.remove(element, 'mousewheel', this.scrollMouseWheel);
        window.removeEventListener('mousemove', this.mouseMoveListener, false);
        window.removeEventListener('mouseup', this.mouseUpListener, false);
    }

    /**
     * Handles the mouse down on scrollbar
     * @param e 
     */
    public scrollMouseDown(e: PointerEvent): void {
        let id: string = (<Element>e.target).id;
        let elem: ScrollElements = this.scrollElements;
        this.getMouseXY(e);
        this.isResizeLeft = this.isExist(id, '_leftCircle_') || this.isExist(id, '_leftArrow_');
        this.isResizeRight = this.isExist(id, '_rightCircle_') || this.isExist(id, '_rightArrow_');
        this.previousXY = this.isVertical ? this.mouseY : this.mouseX;
        this.previousWidth = elem.thumbRectWidth;
        this.previousRectX = elem.thumbRectX;
        this.startZoomPosition = this.axis.zoomPosition;
        this.startZoomFactor = this.axis.zoomFactor;
        this.startRange = this.axis.visibleRange;
        this.scrollStarted = true;
        this.component.trigger(scrollStart, this.getArgs(scrollStart));
        if (this.isExist(id, 'scrollBarThumb_')) {
            this.isThumbDrag = true;
            (this.svgObject as HTMLElement).style.cursor = '-webkit-grabbing';
        } else if (this.isExist(id, 'scrollBarBackRect_')) {
            let currentX: number = this.moveLength(this.previousXY, this.previousRectX, 8);
            if (this.animateDuration) {
                currentX = this.isWithIn(currentX) ? currentX : elem.thumbRectX;
                this.performAnimation(elem.thumbRectX, currentX);
            } else {
                elem.thumbRectX = this.isWithIn(currentX) ? currentX : elem.thumbRectX;
                this.positionThumb(elem.thumbRectX, elem.thumbRectWidth);
                this.setZoomFactorPosition(elem.thumbRectX, elem.thumbRectWidth);
            }
        }
    }
    /**
     * To check the matched string
     * @param id 
     * @param match 
     */
    private isExist(id: string, match: string): boolean {
        return id.indexOf(match) > -1;
    }
    /**
     * To check current poisition is within scrollbar region
     * @param currentX 
     */
    private isWithIn(currentX: number): boolean {
        let circleRadius: number = 8;
        return (currentX - circleRadius >= 0 &&
            currentX + this.scrollElements.thumbRectWidth + circleRadius <= this.width);
    }

    /**
     * Method to find move length of thumb
     * @param mouseXY 
     * @param thumbX 
     * @param circleRadius 
     */
    private moveLength(mouseXY: number, thumbX: number, circleRadius: number): number {
        let moveLength: number = (10 / 100) * (this.width - circleRadius * 2);
        if (mouseXY < thumbX) {
            moveLength = thumbX - (thumbX - moveLength > circleRadius ? moveLength : circleRadius);
        } else {
            moveLength = thumbX + (thumbX + this.scrollElements.thumbRectWidth + moveLength < this.width - circleRadius ?
                moveLength : circleRadius);
        }
        return moveLength;
    }
    /**
     * Method to calculate zoom factor and position
     * @param currentX 
     * @param currentWidth 
     */
    private setZoomFactorPosition(currentX: number, currentWidth: number): void {
        let axis: Axis = this.axis;
        this.isScrollUI = true;
        let circleRadius: number = 8;
        let circleWidth: number = 1;
        let currentScrollWidth: number = currentX + currentWidth + circleRadius + circleWidth;
        let currentZPWidth: number = circleRadius + (circleWidth / 2);
        this.zoomPosition = (currentX - (currentX - currentZPWidth <= 0 ? currentZPWidth : 0)) / (this.isVertical
            ? axis.rect.height : this.width);
        this.zoomFactor = (currentWidth + (currentScrollWidth === this.width ? circleRadius + circleWidth : 0)) / (this.isVertical
            ? axis.rect.height : this.width);
        axis.zoomPosition = this.zoomPosition;
        axis.zoomFactor = this.zoomFactor;
    }
    /**
     * Handles the mouse move on scrollbar
     * @param e 
     */
    public scrollMouseMove(e: PointerEvent): void {
        let target: Element = <Element>e.target;
        let elem: ScrollElements = this.scrollElements;
        this.getMouseXY(e);
        this.setCursor(target);
        this.setTheme(target);
        let mouseXY: number = this.isVertical ? this.mouseY : this.mouseX;
        let range: VisibleRangeModel = this.axis.visibleRange;
        let zoomPosition: number = this.zoomPosition;
        let zoomFactor: number = this.zoomFactor;
        if (this.isThumbDrag) {
            (this.svgObject as HTMLElement).style.cursor = '-webkit-grabbing';
            let currentX: number = elem.thumbRectX + (mouseXY - this.previousXY);
            if (mouseXY >= 0 && mouseXY <= currentX + elem.thumbRectWidth) {
                elem.thumbRectX = this.isWithIn(currentX) ? currentX : elem.thumbRectX;
                this.positionThumb(elem.thumbRectX, elem.thumbRectWidth);
                this.previousXY = mouseXY;
                this.setZoomFactorPosition(currentX, elem.thumbRectWidth);
            }
            this.component.trigger(scrollChanged, this.getArgs(scrollChanged, range, zoomPosition, zoomFactor));
        } else if (this.isResizeLeft || this.isResizeRight) {
            this.resizeThumb(e);
            this.component.trigger(scrollChanged, this.getArgs(scrollChanged, range, zoomPosition, zoomFactor));
        }
    }
    /**
     * Handles the mouse wheel on scrollbar
     * @param e 
     */
    public scrollMouseWheel(e: WheelEvent): void {
        let svgRect: ClientRect = getElement('scrollBar_svg' + this.axis.name).getBoundingClientRect();
        this.mouseX = e.clientX - Math.max(svgRect.left, 0);
        this.mouseY = e.clientY - Math.max(svgRect.top, 0);
        let origin: number = 0.5;
        let elem: ScrollElements = this.scrollElements;
        let axis: Axis = this.axis;
        let direction: number = (this.browserName === 'mozilla' && !this.isPointer) ?
            -(e.detail) / 3 > 0 ? 1 : -1 : (e.wheelDelta / 120) > 0 ? 1 : -1;
        let cumulative: number;
        cumulative = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * direction), 1);
        let range: VisibleRangeModel = this.axis.visibleRange;
        let zoomPosition: number = this.zoomPosition;
        let zoomFactor: number = this.zoomFactor;
        if (cumulative >= 1) {
            origin = axis.orientation === 'Horizontal' ? this.mouseX / axis.rect.width : 1 - (this.mouseY / axis.rect.height);
            origin = origin > 1 ? 1 : origin < 0 ? 0 : origin;
            this.zoomFactor = (cumulative === 1) ? 1 : minMax(1 / cumulative, 0, 1);
            this.zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - this.zoomFactor) * origin);
        }
        elem.thumbRectX = this.isWithIn(this.zoomPosition * this.width) ? this.zoomPosition * this.width : elem.thumbRectX;
        this.isScrollUI = true;
        this.positionThumb(elem.thumbRectX, elem.thumbRectWidth);
        axis.zoomFactor = this.zoomFactor;
        axis.zoomPosition = this.zoomPosition;
        this.component.trigger(scrollChanged, this.getArgs(scrollChanged, range, zoomPosition, zoomFactor));
    }
    /**
     * Handles the mouse up on scrollbar
     * @param e 
     */
    public scrollMouseUp(e: PointerEvent): void {
        let circleRadius: number = 8;
        let circleWidth: number = 1;
        this.startX = this.scrollElements.thumbRectX;
        let currentScrollWidth: number = this.startX + this.scrollElements.thumbRectWidth + circleRadius + circleWidth;
        let currentZPWidth: number = circleRadius + (circleWidth / 2);
        if (this.isResizeLeft || this.isResizeRight) {
            this.axis.zoomFactor = (currentScrollWidth >= this.width - 1 && (this.startX - currentZPWidth) <= 0) ? 1 : this.zoomFactor;
        }
        this.isThumbDrag = false;
        this.isResizeLeft = false;
        this.isResizeRight = false;
        if (this.scrollStarted) {
            this.component.trigger(
                scrollEnd, this.getArgs(scrollChanged, this.startRange, this.startZoomPosition, this.startZoomFactor)
            );
            this.scrollStarted = false;
        }
    }

    /**
     * To render scroll bar
     * @private
     */
    public render(): Element {
        this.getDefaults();
        this.getTheme();
        this.removeScrollSvg();
        createScrollSvg(this, this.component.renderer);
        this.wireEvents(this.svgObject);
        this.svgObject.appendChild(
            this.scrollElements.renderElements(
                this, this.component.renderer
            )
        );
        return this.svgObject;
    }
    /**
     * Theming for scrollabr
     */
    private getTheme(): void {
        this.scrollbarThemeStyle = getScrollbarThemeColor(this.component.theme);
    }
    /**
     * Method to remove existing scrollbar
     */
    public removeScrollSvg(): void {
        if (document.getElementById('scrollBar_svg' + this.axis.name)) {
            remove(document.getElementById('scrollBar_svg' + this.axis.name));
        }
    }
    /**
     * Method to set cursor fpr scrollbar
     * @param target 
     */
    private setCursor(target: Element): void {
        let id: string = target.id;
        (this.svgObject as HTMLElement).style.cursor = id.indexOf('scrollBarThumb_') > -1 || id.indexOf('_gripCircle') > -1 ?
            '-webkit-grab' : (id.indexOf('Circle_') > -1 || id.indexOf('Arrow_') > -1) ? this.isVertical ? 'ns-resize' :
                'ew-resize' : 'auto';
    }
    /**
     * Method to set theme for sollbar
     * @param target 
     */
    private setTheme(target: Element): void {
        let id: string = target.id;
        let isLeftHover: boolean = id.indexOf('_leftCircle_') > -1 || id.indexOf('_leftArrow_') > -1;
        let isRightHover: boolean = id.indexOf('_rightCircle_') > -1 || id.indexOf('_rightArrow_') > -1;
        let style: IScrollbarThemeStyle = this.scrollbarThemeStyle;
        let leftArrowEle: HTMLElement = this.scrollElements.leftArrowEle as HTMLElement;
        let rightArrowEle: HTMLElement = this.scrollElements.rightArrowEle as HTMLElement;
        let leftCircleEle: HTMLElement = this.scrollElements.leftCircleEle as HTMLElement;
        let rightCircleEle: HTMLElement = this.scrollElements.rightCircleEle as HTMLElement;
        let isAxis: boolean = this.isCurrentAxis(target, leftArrowEle);
        leftCircleEle.style.fill = isLeftHover && isAxis ? style.circleHover : style.circle;
        rightCircleEle.style.fill = isRightHover && isAxis ? style.circleHover : style.circle;
        leftCircleEle.style.stroke = isLeftHover && isAxis ? style.circleHover : style.circle;
        rightCircleEle.style.stroke = isRightHover && isAxis ? style.circleHover : style.circle;
        if (this.component.theme === 'Highcontrast') {
            leftArrowEle.style.fill = isLeftHover && isAxis ? style.arrowHover : style.arrow;
            leftArrowEle.style.stroke = isLeftHover && isAxis ? style.arrowHover : style.arrow;
            rightArrowEle.style.fill = isRightHover && isAxis ? style.arrowHover : style.arrow;
            rightArrowEle.style.stroke = isRightHover && isAxis ? style.arrowHover : style.arrow;
            leftCircleEle.style.stroke = isLeftHover && isAxis ? style.circleHover : style.circle;
            rightCircleEle.style.stroke = isRightHover && isAxis ? style.circleHover : style.circle;
        }
    }
    /**
     * To check current axis
     * @param target 
     * @param ele 
     */
    private isCurrentAxis(target: Element, ele: Element): boolean {
        return (target.id.split('_')[2] === ele.id.split('_')[2]);
    }
    /**
     * Method to resize thumb
     * @param e 
     */
    private resizeThumb(e: PointerEvent): void {
        let currentWidth: number;
        let circleRadius: number = 8;
        let padding: number = 5;
        let gripWidth: number = 14;
        let minThumbWidth: number = circleRadius * 2 + padding * 2 + gripWidth;
        let thumbX: number = this.previousRectX;
        let mouseXY: number = this.isVertical ? this.mouseY : this.mouseX;
        let diff: number = Math.abs(this.previousXY - mouseXY);
        if (this.isResizeLeft && mouseXY >= 0) {
            let currentX: number = thumbX + (mouseXY > this.previousXY ? diff : -diff);
            currentWidth = currentX - circleRadius >= 0 ? this.previousWidth + (mouseXY > this.previousXY ? -diff : diff) :
                this.previousWidth;
            currentX = currentX - circleRadius >= 0 ? currentX : thumbX;
            if (currentWidth >= minThumbWidth && mouseXY < currentX + currentWidth) {
                this.scrollElements.thumbRectX = this.previousRectX = currentX;
                this.scrollElements.thumbRectWidth = this.previousWidth = currentWidth;
                this.previousXY = mouseXY;
                this.positionThumb(currentX, currentWidth);
                this.setZoomFactorPosition(currentX, currentWidth);
            }
        } else if (this.isResizeRight) {
            currentWidth = mouseXY >= minThumbWidth + this.scrollElements.thumbRectX && mouseXY <= this.width - circleRadius ?
                mouseXY - this.scrollElements.thumbRectX : this.previousWidth;
            this.scrollElements.thumbRectWidth = this.previousWidth = currentWidth;
            this.previousXY = mouseXY;
            this.positionThumb(this.startX, currentWidth);
            this.setZoomFactorPosition(this.startX, currentWidth);
        }
    }
    /**
     * Method to position the scrollbar thumb
     * @param currentX 
     * @param currentWidth 
     */
    private positionThumb(currentX: number, currentWidth: number): void {
        let circlePadding: number = 3;
        let elem: ScrollElements = this.scrollElements;
        let gripWidth: number = 14;
        let gripCircleDiameter: number = 2;
        let padding: number = gripWidth / 2 - gripCircleDiameter;
        elem.slider.setAttribute('x', currentX.toString());
        elem.slider.setAttribute('width', currentWidth.toString());
        elem.leftCircleEle.setAttribute('cx', currentX.toString());
        elem.rightCircleEle.setAttribute('cx', (currentX + currentWidth).toString());
        elem.setArrowDirection(currentX, currentWidth, this.height);
        elem.gripCircle.setAttribute(
            'transform', 'translate(' + (currentX + currentWidth / 2 + ((this.isVertical ? 1 : -1) * padding)) +
            ',' + (this.isVertical ? '10' : '5') + ') rotate(' + (this.isVertical ? '180' : '0') + ')'
        );
    }
    /**
     * Method to get default values
     */
    private getDefaults(): void {
        let circleRadius: number = 8;
        let padding: number = 5;
        let gripWidth: number = 14;
        let minThumbWidth: number = circleRadius * 2 + padding * 2 + gripWidth;
        let axis: Axis = this.axis;
        this.isVertical = axis.orientation === 'Vertical';
        let currentWidth: number = axis.zoomFactor * (this.isVertical ? axis.rect.height : axis.rect.width);
        currentWidth = currentWidth > minThumbWidth ? currentWidth : minThumbWidth;
        this.scrollX = axis.rect.x;
        this.scrollY = axis.rect.y;
        this.width = this.isVertical ? axis.rect.height : axis.rect.width;
        this.height = 16;
        let currentX: number = axis.zoomPosition * (this.isVertical ? axis.rect.height : this.width);
        this.scrollElements.thumbRectX = currentX > circleRadius ? currentX : circleRadius;
        this.scrollElements.thumbRectWidth = ((currentWidth + this.scrollElements.thumbRectX) < this.width - (circleRadius * 2))
            ? currentWidth : this.width - this.scrollElements.thumbRectX - circleRadius;
    }
    /**
     * Method for injecting scrollbar module
     * @param axis 
     * @param component
     */
    public injectTo(axis: Axis, component: Chart): void {
        axis.zoomingScrollBar = new ScrollBar(component, axis);
    }

    /**
     * Animation Calculation for scrollbar
     * @param previous
     * @param current
     */
    private performAnimation(previous: number, current: number): void {
        let currentX: number;
        let width: number = this.scrollElements.thumbRectWidth;
        let range: VisibleRangeModel = this.axis.visibleRange;
        let zoomPosition: number = this.zoomPosition;
        let zoomFactor: number = this.zoomFactor;
        new Animation({}).animate(createElement('div'), {
            duration: this.animateDuration,
            progress: (args: AnimationOptions): void => {
                currentX = linear(args.timeStamp, 0, current - previous, args.duration) + previous;
                this.positionThumb(currentX, width);
                range = this.axis.visibleRange;
                zoomPosition = this.zoomPosition;
                zoomFactor = this.zoomFactor;
                this.setZoomFactorPosition(currentX, width);
                this.component.trigger(
                    scrollChanged,
                    this.getArgs(scrollChanged, range, zoomPosition, zoomFactor)
                );
            },
            end: () => {
                this.scrollElements.thumbRectX = current;
                this.startX = current;
                this.positionThumb(current, width);
                this.setZoomFactorPosition(current, width);
                this.component.trigger(
                    scrollEnd,
                    this.getArgs(scrollEnd, range, zoomPosition, zoomFactor)
                );
            }
        });
    }
    /**
     * Method to destroy scrollbar
     */
    public destroy(): void {
        if (this.axes) {
            this.axes.map((axis: Axis) => {
                axis.zoomingScrollBar.destroy();
            });
        } else {
            this.elements.map((element: Element) => {
                this.unWireEvents(element);
                remove(element.firstChild);
            });
            this.elements = [];
        }
    }
    /**
     * Method to get scrollbar module name
     */
    public getModuleName(): string {
        return 'ScrollBar';
    }

    private getArgs(
        eventName: string, range?: VisibleRangeModel, zoomPosition?: number,
        zoomFactor?: number
    ): IScrollEventArgs {
        let scrollArgs: IScrollEventArgs = {
            axis: this.axis,
            name: eventName,
            range: this.axis.visibleRange,
            zoomFactor: this.axis.zoomFactor,
            zoomPosition: this.axis.zoomPosition,
            previousRange: range,
            previousZoomFactor: zoomFactor,
            previousZoomPosition: zoomPosition
        };
        return scrollArgs;
    }

}