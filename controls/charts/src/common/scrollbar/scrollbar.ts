/* eslint-disable @typescript-eslint/ban-types */
import { EventHandler, Browser, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DateFormatOptions  } from '@syncfusion/ej2-base';
import { ScrollElements, createScrollSvg } from './scrollbar-elements';
import { getElement, minMax, logBase  } from '../utils/helper';
import { Chart } from '../../chart/chart';
import { Axis, IScrollbarThemeStyle, IScrollEventArgs, VisibleRangeModel } from '../../chart/index';
import { getScrollbarThemeColor } from '../model/theme';
import { ScrollbarSettingsRangeModel, ScrollbarSettingsModel } from '../../chart/model/chart-base-model';
import { scrollChanged, scrollEnd, scrollStart } from '../model/constants';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

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
    /** @private */
    public actualRange: number;
    /** @private */
    public scrollRange: VisibleRangeModel = { max: null, min: null, interval: null, delta: null };
    /** @private */
    public isLazyLoad: boolean;
    /** @private */
    public previousStart: number;
    /** @private */
    public previousEnd: number;

    private scrollElements: ScrollElements;

    private isResizeLeft: boolean;

    private isResizeRight: boolean;

    private previousXY: number;

    private previousWidth: number;

    private previousRectX: number;

    private mouseMoveListener: EventListener;

    private mouseUpListener: EventListener;
    private valueType: string;
    public axes: Axis[];
    private startZoomPosition: number;
    private startZoomFactor: number;
    private startRange: VisibleRangeModel;
    private scrollStarted: boolean;
    private isScrollEnd: boolean;
    private isCustomHeight: boolean;    //this varible used to check whether the height for component is set or not

    /**
     * Constructor for creating scrollbar
     *
     * @param component
     * @param axis
     */

    constructor(component: Chart, axis?: Axis) {
        this.component = component;
        this.elements = [];
        this.scrollElements = new ScrollElements(component);
        this.axis = axis;
        this.mouseMoveListener = this.scrollMouseMove.bind(this);
        this.mouseUpListener = this.scrollMouseUp.bind(this);
        this.animateDuration = 500;
        this.isPointer = Browser.isPointer;
        this.browserName = Browser.info.name;
    }

    /**
     * To Mouse x and y position
     *
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
        const svgRect: ClientRect = getElement(this.component.element.id + '_scrollBar_svg' + this.axis.name).getBoundingClientRect();
        this.mouseX = pageX - Math.max(svgRect.left, 0);
        this.mouseY = pageY - Math.max(svgRect.top, 0);
    }
    /**
     * Method to bind events for scrollbar svg object
     *
     * @param element
     * @returns {void}
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
     *
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
     * Handles the mouse down on scrollbar.
     *
     * @param e
     */

    public scrollMouseDown(e: PointerEvent): void {
        const id: string = (<Element>e.target).id;
        const elem: ScrollElements = this.scrollElements;
        const isInverse: boolean = this.axis.isAxisInverse;
        this.getMouseXY(e);
        this.isResizeLeft = this.isExist(id, '_leftCircle_') || this.isExist(id, '_leftArrow_');
        this.isResizeRight = this.isExist(id, '_rightCircle_') || this.isExist(id, '_rightArrow_');
        //  this.previousXY = this.isVertical ? this.mouseY : this.mouseX;
        this.previousXY = (this.isVertical && isInverse) ? this.mouseY : this.isVertical ? this.width -
        this.mouseY : isInverse ? this.width - this.mouseX : this.mouseX;
        this.previousWidth = elem.thumbRectWidth;
        this.previousRectX = elem.thumbRectX;
        this.startZoomPosition = this.axis.zoomPosition;
        this.startZoomFactor = this.axis.zoomFactor;
        this.startRange = this.axis.visibleRange;
        this.scrollStarted = true;
        this.component.trigger(scrollStart, this.getArgs(scrollStart));
        if (this.isExist(id, 'scrollBarThumb_') || this.isExist(id, 'gripCircle')) {
            this.isThumbDrag = true;
            if (this.axis.scrollbarSettings.height >= 12) {
                (this.svgObject as HTMLElement).style.cursor = '-webkit-grabbing';
            }
        } else if (this.isExist(id, 'scrollBarBackRect_')) {
            const currentX: number = this.moveLength(this.previousXY, this.previousRectX);
            elem.thumbRectX = this.isWithIn(currentX) ? currentX : elem.thumbRectX;
            this.positionThumb(elem.thumbRectX, elem.thumbRectWidth);
            this.setZoomFactorPosition(elem.thumbRectX, elem.thumbRectWidth, false);
            this.axis.zoomPosition = this.zoomPosition < 0 ? 0 : this.zoomPosition > 0.9 ? 1 : this.zoomPosition;
            if (this.isLazyLoad) {
                const thumbMove: string = elem.thumbRectX > this.previousRectX ? 'RightMove' : 'LeftMove';
                const args: IScrollEventArgs = this.calculateLazyRange(elem.thumbRectX, elem.thumbRectWidth, thumbMove);
                if (args) {
                    this.component.trigger(scrollEnd, args);
                }
            }
        }

        /**
         * Customer issue
         * Task ID - EJ2-28898
         * Issue: While element's height is smaller than chart'height, html scroll bar presents. On that case while moving chart scrollbar,
         * html scrollbar goes up due to chart's svg removed from the dom when zoomFactor and zoomPosition chnaged
         * Fix: Only for scrolling purpose, height for element is set to chart's available height
         */
        if (this.component.element.style.height === '') {
            this.isCustomHeight = true;
            this.component.element.style.height =  this.component.availableSize.height + 'px';
        }
    }

    /**
     * To check the matched string
     *
     * @param id
     * @param match
     */

    private isExist(id: string, match: string): boolean {
        return id.indexOf(match) > -1;
    }
    /**
     * To check current poisition is within scrollbar region
     *
     * @param currentX
     */

    private isWithIn(currentX: number): boolean {
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        return (currentX - circleRadius >= 0 &&
            currentX + this.scrollElements.thumbRectWidth + circleRadius <= this.width);
    }

    /**
     * Method to find move length of thumb
     *
     * @param mouseXY
     * @param thumbX
     * @param circleRadius
     */

    private moveLength(mouseXY: number, thumbX: number, circleRadius: number = this.axis.scrollbarSettings.height / 2): number {
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
     *
     * @param currentX
     * @param currentWidth
     */

    private setZoomFactorPosition(currentX: number, currentWidth: number, isRequire: boolean = true): void {
        this.isScrollUI = true;
        const axis: Axis = this.axis;
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        const circleWidth: number = 1;
        const currentScrollWidth: number = currentX + currentWidth + circleRadius + circleWidth;
        const currentZPWidth: number = circleRadius + (circleWidth / 2);
        const axisSize: number = this.isVertical ? axis.rect.height : this.width;
        this.zoomFactor = (currentWidth + (currentScrollWidth >= this.width ? circleRadius + circleWidth : 0)) / axisSize;
        this.zoomPosition = currentScrollWidth > axisSize ? (1 - axis.zoomFactor) : currentX < (circleRadius + circleWidth) ? 0 :
            (currentX - (currentX - currentZPWidth <= 0 ? currentZPWidth : 0)) / axisSize;
    }
    /**
     * Handles the mouse move on scrollbar.
     *
     * @param e
     */

    public scrollMouseMove(e: PointerEvent): void {
        const target: Element = <Element>e.target;
        const elem: ScrollElements = this.scrollElements;
        const isInverse: boolean = this.axis.isAxisInverse;
        if (!getElement(this.svgObject.id)) {
            return null;
        }
        this.getMouseXY(e);
        if (!isNullOrUndefined(target.id)) {
            this.setCursor(target);
            this.setTheme(target);
        }
        //let mouseXY: number = this.isVertical ? this.mouseY : this.mouseX;
        let mouseXY: number = (this.isVertical && isInverse) ? this.width - this.mouseY : this.isVertical ?
            this.mouseY : this.mouseX ;
        const range: VisibleRangeModel = this.axis.visibleRange;
        const zoomPosition: number = this.zoomPosition;
        const zoomFactor: number = this.zoomFactor;
        const moveLength: number = this.previousRectX - elem.thumbRectX;
        const thumbMove: string = moveLength < 0 ? 'RightMove' : 'LeftMove';
        let args: IScrollEventArgs;
        if (this.isLazyLoad && (this.isThumbDrag || this.isResizeLeft || this.isResizeRight)) {
            args = this.calculateLazyRange(elem.thumbRectX, elem.thumbRectWidth, thumbMove);
        }
        const currentRange: ScrollbarSettingsRangeModel = args ? args.currentRange : null;
        if (this.isThumbDrag) {
            this.component.isScrolling = this.isThumbDrag;
            mouseXY = (this.isVertical || isInverse) ? this.width - mouseXY : mouseXY;
            const currentX: number = elem.thumbRectX + (mouseXY - this.previousXY);
            if ( mouseXY >= currentX + elem.thumbRectWidth) {
                this.setCursor(target);
            } else {
                if (this.axis.scrollbarSettings.height >= 12) {
                    (this.svgObject as HTMLElement).style.cursor = '-webkit-grabbing';
                }
            }
            if (mouseXY >= 0 && mouseXY <= currentX + elem.thumbRectWidth) {
                elem.thumbRectX = this.isWithIn(currentX) ? currentX : elem.thumbRectX;
                this.positionThumb(elem.thumbRectX, elem.thumbRectWidth);
                this.previousXY = mouseXY;
                this.setZoomFactorPosition(currentX, elem.thumbRectWidth, false);
                this.axis.zoomPosition = this.zoomPosition < 0 ? 0 : this.zoomPosition > 0.9 ? 1 : this.zoomPosition;
            }
            this.component.trigger(scrollChanged, this.getArgs(scrollChanged, range, zoomPosition, zoomFactor, currentRange));
        } else if (this.isResizeLeft || this.isResizeRight) {
            this.resizeThumb();
        }
    }
    /**
     * Handles the mouse wheel on scrollbar.
     *
     * @param e
     */

    public scrollMouseWheel(e: WheelEvent): void {
        if (!this.axis.scrollbarSettings.enableZoom) {
            return null;
        }
        const svgRect: ClientRect = getElement(this.component.element.id + '_scrollBar_svg' + this.axis.name).getBoundingClientRect();
        this.mouseX = e.clientX - Math.max(svgRect.left, 0);
        this.mouseY = e.clientY - Math.max(svgRect.top, 0);
        let origin: number = 0.5;
        const elem: ScrollElements = this.scrollElements;
        const axis: Axis = this.axis;
        const direction: number = (this.browserName === 'mozilla' && !this.isPointer) ?
            -(e.detail) / 3 > 0 ? 1 : -1 : (e['wheelDelta'] / 120) > 0 ? 1 : -1;
        const cumulative: number = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * direction), 1);
        const range: VisibleRangeModel = this.axis.visibleRange;
        const zoomPosition: number = this.zoomPosition;
        const zoomFactor: number = this.zoomFactor;
        let args: IScrollEventArgs;
        if (cumulative >= 1) {
            origin = axis.orientation === 'Horizontal' ? this.mouseX / axis.rect.width : 1 - (this.mouseY / axis.rect.height);
            origin = origin > 1 ? 1 : origin < 0 ? 0 : origin;
            this.zoomFactor = (cumulative === 1) ? 1 : minMax(1 / cumulative, 0, 1);
            this.zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - this.zoomFactor) * origin);
        }
        elem.thumbRectX = this.isWithIn(this.zoomPosition * this.width) ? this.zoomPosition * this.width : elem.thumbRectX;
        this.isScrollUI = true;
        this.positionThumb(elem.thumbRectX, elem.thumbRectWidth);
        if (this.isLazyLoad) {
            this.setZoomFactorPosition(elem.thumbRectX, elem.thumbRectWidth);
            this.axis.zoomFactor = this.zoomFactor;
            this.axis.zoomPosition = this.zoomPosition < 0 ? 0 : this.zoomPosition > 0.9 ? 1 : this.zoomPosition;
        }
        axis.zoomFactor = this.zoomFactor;
        axis.zoomPosition = this.zoomPosition;
        if (this.isLazyLoad) {
            args = this.calculateMouseWheelRange(elem.thumbRectX, elem.thumbRectWidth);
            if (args) {
                if ((args.currentRange.minimum !== args.previousAxisRange.minimum) && (args.currentRange.maximum !==
                    args.previousAxisRange.maximum)) {
                    this.component.trigger(scrollEnd, args);
                    this.isScrollEnd = false;
                }
            }
        }
        if ( !this.isLazyLoad ) {
            this.component.trigger(scrollChanged, this.getArgs(scrollChanged, range, zoomPosition, zoomFactor));
        }
    }
    /**
     * Handles the mouse up on scrollbar.
     *
     * @param e
     */

    public scrollMouseUp(): void {
        let args: IScrollEventArgs;
        this.startX = this.scrollElements.thumbRectX;
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        const circleWidth: number = 1;
        const currentScrollWidth: number = this.startX + this.scrollElements.thumbRectWidth + circleRadius + circleWidth;
        const currentZPWidth: number = circleRadius + (circleWidth / 2);
        if ((this.isResizeLeft || this.isResizeRight) && !this.isLazyLoad) {
            this.axis.zoomFactor = (currentScrollWidth >= this.width - 1 && (this.startX - currentZPWidth) <= 0) ? 1 : this.zoomFactor;
        }
        if ( this.isLazyLoad ) {
            const moveLength: number = this.previousRectX -  this.startX;
            if ((moveLength > 0 || moveLength < 0) && this.isThumbDrag ) {
                const thumbMove: string = moveLength < 0 ? 'RightMove' : 'LeftMove';
                if (thumbMove === 'RightMove') {
                    this.startX = ( this.startX + Math.abs(moveLength)) < this.width - circleRadius ? this.startX :
                        this.width - circleRadius - this.scrollElements.thumbRectWidth ;
                } else {
                    this.startX = (this.startX + this.scrollElements.thumbRectWidth - Math.abs(moveLength)) > circleRadius ?
                        this.startX : circleRadius;
                }
                args = this.calculateLazyRange(this.startX, this.scrollElements.thumbRectWidth, thumbMove);
                if (args) {
                    this.component.trigger(scrollEnd, args);
                    this.scrollStarted = false;
                }
            }
            if (this.isResizeLeft || this.isResizeRight) {
                args = this.calculateLazyRange(this.startX, this.scrollElements.thumbRectWidth);
                if (args ) {
                    this.component.trigger(scrollEnd, args);
                    this.scrollStarted = false;
                }
            }
        }

        this.isThumbDrag = false;
        this.isResizeLeft = false;
        this.isResizeRight = false;
        this.isScrollEnd = false;
        this.component.isScrolling = false;
        if (this.scrollStarted && !this.isLazyLoad) {
            this.component.trigger(
                scrollEnd, this.getArgs(scrollChanged, this.startRange, this.startZoomPosition, this.startZoomFactor)
            );
            this.scrollStarted = false;
        }

        /**
         * Customer issue
         * Task ID - EJ2-28898
         * Chart's height setted is removed here.
         */
        if (this.isCustomHeight) {
            this.component.element.style.height =  null;
        }
    }

    public calculateMouseWheelRange (scrollThumbX : number, scrollThumbWidth : number) : IScrollEventArgs  {
        let zoomFactor: number;
        let zoomPosition: number;
        let args: IScrollEventArgs;
        const range: VisibleRangeModel = this.scrollRange;
        const previousRange: ScrollbarSettingsRangeModel = this.getStartEnd(this.previousStart, this.previousEnd, false);
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        if ((scrollThumbX + scrollThumbWidth + circleRadius) <= this.width) {
            zoomPosition = (scrollThumbX - circleRadius) / this.width;
            zoomFactor = scrollThumbWidth / (this.width);
        }
        const currentStart: number | Date = range.min + zoomPosition * range.delta;
        const currentEnd: number | Date = currentStart + zoomFactor * range.delta;

        if (currentEnd) {
            args = { axis: this.axis, currentRange: this.getStartEnd(currentStart, currentEnd, true), previousAxisRange: previousRange };
        }
        return args;

    }

    /**
     * Range calculation for lazy loading.
     *
     * @param scrollThumbX
     * @param scrollThumbWidth
     * @param thumbMove
     * @param scrollThumbX
     * @param scrollThumbWidth
     * @param thumbMove
     * @param scrollThumbX
     * @param scrollThumbWidth
     * @param thumbMove
     */

    public calculateLazyRange(scrollThumbX: number, scrollThumbWidth: number, thumbMove?: string): IScrollEventArgs {
        let currentScrollWidth: number = scrollThumbWidth;
        let zoomFactor: number;
        let zoomPosition: number;
        let currentStart: number | Date;
        let currentEnd: number | Date;
        let args: IScrollEventArgs;
        const range: VisibleRangeModel = this.scrollRange;
        const previousRange: ScrollbarSettingsRangeModel = this.getStartEnd(this.previousStart, this.previousEnd, false);
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        const circleWidth: number = 16;
        if (this.isResizeRight || thumbMove === 'RightMove') {
            currentScrollWidth = this.isResizeRight ? currentScrollWidth + circleWidth : currentScrollWidth;
            zoomFactor = (currentScrollWidth) / this.width;
            zoomPosition = thumbMove === 'RightMove' ? (scrollThumbX + circleRadius) / this.width : this.axis.zoomPosition;
            currentStart = thumbMove === 'RightMove' ? (range.min + zoomPosition * range.delta) : this.previousStart;
            currentEnd = currentStart + zoomFactor * range.delta;
        } else if (this.isResizeLeft || thumbMove === 'LeftMove') {
            zoomPosition = (scrollThumbX - circleRadius) / this.width;
            zoomFactor = currentScrollWidth / this.width;
            currentStart = range.min + zoomPosition * range.delta;
            currentStart = currentStart >= range.min ? currentStart : range.min;
            currentEnd = thumbMove === 'LeftMove' ? (currentStart + zoomFactor * range.delta) : this.previousEnd;
        } else if (this.isThumbDrag) {
            zoomPosition = thumbMove === 'RightMove' ? (scrollThumbX + circleRadius) / this.width : (scrollThumbX - circleRadius) / this.width ;
            zoomFactor = (this.scrollElements.thumbRectWidth) / this.width;
            currentStart = range.min + zoomPosition * range.delta;
            currentStart = currentStart >= range.min ? currentStart : range.min;
            currentEnd = currentStart + zoomFactor * range.delta;
        }
        if (currentEnd) {
            args = { axis: (this.component.isBlazor ? {} : this.axis) as Axis, currentRange:
            this.getStartEnd(currentStart, currentEnd, true),
            previousAxisRange: previousRange };
        }
        return args;
    }
    /**
     * Get start and end values
     *
     * @param start
     * @param end
     * @param isCurrentStartEnd
     * @param start
     * @param end
     * @param isCurrentStartEnd
     * @param start
     * @param end
     * @param isCurrentStartEnd
     */

    private getStartEnd(start: number | Date, end: number | Date, isCurrentStartEnd: boolean): ScrollbarSettingsRangeModel {
        const valueType: string = this.valueType;
        if ((valueType === 'DateTime' || valueType === 'DateTimeCategory') && isCurrentStartEnd) {
            this.previousStart = start as number;
            this.previousEnd = end as number;
        } else if (isCurrentStartEnd) {
            let currentStart: number = Math.round(start as number);
            let currentEnd: number = Math.ceil(end as number);
            if (this.axis.valueType === 'Category') {
                currentEnd -= (!this.axis.scrollbarSettings.enableZoom && currentEnd - currentStart > this.previousEnd - this.previousStart) ? (currentEnd - currentStart) - (this.previousEnd - this.previousStart) : 0;
            }
            this.previousStart = start = currentStart;
            this.previousEnd = end = currentEnd;
        }
        switch (valueType) {
        case 'Double':
        case 'Category':
        case 'Logarithmic':
            start = Math.round(start as number);
            end = Math.ceil(end as number);
            break;
        case 'DateTime':
        case 'DateTimeCategory':
            start = new Date(start as number);
            end = new Date(end as number);
            break;
        }
        return { minimum: start, maximum: end };
    }

    /**
     * To render scroll bar
     *
     * @param isScrollExist
     * @private
     */

    public render(isScrollExist: boolean): Element {
        if (this.component.zoomModule || (isScrollExist && this.axis.scrollbarSettings.enable)) {
            this.getDefaults();
        }
        this.getTheme();
        this.removeScrollSvg();
        createScrollSvg(this, this.component.svgRenderer as SvgRenderer);
        this.wireEvents(this.svgObject);
        this.svgObject.appendChild(
            this.scrollElements.renderElements(
                this, this.component.svgRenderer as SvgRenderer
            )
        );
        return this.svgObject;
    }
    /**
     * Theming for scrollabr
     *
     * @returns {void}
     */

    private getTheme(): void {
        this.scrollbarThemeStyle = getScrollbarThemeColor(this.component.theme);
    }
    /**
     * Method to remove existing scrollbar.
     *
     * @returns {void}
     */

    public removeScrollSvg(): void {
        if (document.getElementById(this.component.element.id + '_scrollBar_svg' + this.axis.name)) {
            remove(document.getElementById(this.component.element.id + '_scrollBar_svg' + this.axis.name));
        }
    }
    /**
     * Method to set cursor fpr scrollbar
     *
     * @param target
     */

    private setCursor(target: Element): void {
        const id: string = target.id;
        (this.svgObject as HTMLElement).style.cursor = ((id.indexOf('scrollBarThumb_') > -1 || id.indexOf('_gripCircle') > -1) && this.axis.scrollbarSettings.height >= 12) ?
            '-webkit-grab' : (id.indexOf('Circle_') > -1 || id.indexOf('Arrow_') > -1) ? this.isVertical ? 'ns-resize' :
                'ew-resize' : 'auto';
    }
    /**
     * Method to set theme for sollbar
     *
     * @param target
     */

    private setTheme(target: Element): void {
        const id: string = target.id;
        const isLeftHover: boolean = id.indexOf('_leftCircle_') > -1 || id.indexOf('_leftArrow_') > -1;
        const isRightHover: boolean = id.indexOf('_rightCircle_') > -1 || id.indexOf('_rightArrow_') > -1;
        const style: IScrollbarThemeStyle = this.scrollbarThemeStyle;
        const leftArrowEle: HTMLElement = this.scrollElements.leftArrowEle as HTMLElement;
        const rightArrowEle: HTMLElement = this.scrollElements.rightArrowEle as HTMLElement;
        const leftCircleEle: HTMLElement = this.scrollElements.leftCircleEle as HTMLElement;
        const rightCircleEle: HTMLElement = this.scrollElements.rightCircleEle as HTMLElement;
        const isAxis: boolean = this.isCurrentAxis(target, leftArrowEle);
        leftCircleEle.style.fill = isLeftHover && isAxis ? style.circleHover : style.circle;
        rightCircleEle.style.fill = isRightHover && isAxis ? style.circleHover : style.circle;
        leftCircleEle.style.stroke = isLeftHover && isAxis ? style.circleHover : style.circle;
        rightCircleEle.style.stroke = isRightHover && isAxis ? style.circleHover : style.circle;
        if (this.component.theme === 'HighContrastLight') {
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
     *
     * @param target
     * @param ele
     */

    private isCurrentAxis(target: Element, ele: Element): boolean {
        return (target.id.split('_')[2] === ele.id.split('_')[2]);
    }
    /**
     * Method to resize thumb
     *
     * @param e
     */

    private resizeThumb(): void {
        let currentWidth: number;
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        const padding: number = 5;
        const gripWidth: number = 14;
        const minThumbWidth: number = circleRadius * 2 + padding * 2 + gripWidth;
        const thumbX: number = this.previousRectX;
        const isInverse: boolean = this.axis.isAxisInverse;
        // let mouseXY: number = this.isVertical ? this.mouseY : this.mouseX;
        const mouseXY: number = (this.isVertical && isInverse) ? this.mouseY : this.isVertical ? this.width -
            this.mouseY : isInverse ? this.width - this.mouseX : this.mouseX;
        const diff: number = Math.abs(this.previousXY - mouseXY);
        if (this.isResizeLeft && mouseXY >= 0) {
            let currentX: number = thumbX + (mouseXY > this.previousXY ? diff : -diff);
            currentWidth = currentX - circleRadius >= 0 ? this.previousWidth + (mouseXY > this.previousXY ? -diff : diff) :
                this.previousWidth;
            currentX = currentX - circleRadius >= 0 ? currentX : thumbX;
            if (currentWidth >= minThumbWidth && mouseXY < currentX + currentWidth) {
                this.scrollElements.thumbRectX = this.previousRectX = currentX;
                this.scrollElements.thumbRectWidth = this.previousWidth = currentWidth;
                this.previousXY = mouseXY;
                this.setZoomFactorPosition(currentX, currentWidth);
                const argsData: IScrollEventArgs = {
                    axis: (this.component.isBlazor ? {} : this.axis) as Axis,
                    name: scrollChanged,
                    range: this.axis.visibleRange,
                    zoomFactor: this.zoomFactor,
                    zoomPosition: this.zoomPosition,
                    previousRange: this.axis.visibleRange,
                    previousZoomFactor: this.axis.zoomFactor,
                    previousZoomPosition: this.axis.zoomPosition,
                    currentRange: null,
                    cancel: false
                };
                this.component.trigger(scrollChanged, argsData);
                if (!argsData.cancel) {
                    this.positionThumb(currentX, currentWidth);
                    this.axis.zoomFactor = argsData.zoomFactor;
                    this.axis.zoomPosition = argsData.zoomPosition;
                }
                else {
                    this.zoomFactor = argsData.previousZoomFactor;
                    this.zoomPosition = argsData.previousZoomPosition;
                }
            }
        } else if (this.isResizeRight) {
            currentWidth = mouseXY >= minThumbWidth + this.scrollElements.thumbRectX && mouseXY <= this.width - circleRadius ?
                mouseXY - this.scrollElements.thumbRectX : this.previousWidth;
            this.scrollElements.thumbRectWidth = this.previousWidth = currentWidth;
            this.previousXY = mouseXY;
            this.setZoomFactorPosition(this.startX, currentWidth);
            if (!this.isLazyLoad) {
                this.setZoomFactorPosition(this.startX, currentWidth);
            }
            const argsData: IScrollEventArgs = {
                axis: (this.component.isBlazor ? {} : this.axis) as Axis,
                name: scrollChanged,
                range: this.axis.visibleRange,
                zoomFactor: this.zoomFactor,
                zoomPosition: this.zoomPosition,
                previousRange: this.axis.visibleRange,
                previousZoomFactor: this.axis.zoomFactor,
                previousZoomPosition: this.axis.zoomPosition,
                currentRange: null,
                cancel: false
            };
            this.component.trigger(scrollChanged, argsData);
            if (!argsData.cancel) {
                this.positionThumb(this.startX, currentWidth);
                this.axis.zoomFactor = argsData.zoomFactor;
                this.axis.zoomPosition = argsData.zoomPosition;
            }
            else {
                this.zoomFactor = argsData.previousZoomFactor;
                this.zoomPosition = argsData.previousZoomPosition;
            }
        }
    }
    /**
     * Method to position the scrollbar thumb
     *
     * @param currentX
     * @param currentWidth
     */

    private positionThumb(currentX: number, currentWidth: number): void {
        const elem: ScrollElements = this.scrollElements;
        const gripWidth: number = 14;
        const gripCircleDiameter: number = 2;
        const padding: number = gripWidth / 2 - gripCircleDiameter;
        elem.slider.setAttribute('x',  this.axis.scrollbarSettings.enableZoom ? currentX.toString() : (currentX - this.axis.scrollbarSettings.height / 2).toString());
        elem.slider.setAttribute('width', this.axis.scrollbarSettings.enableZoom ? currentWidth.toString() : (currentWidth + this.axis.scrollbarSettings.height).toString());
        elem.leftCircleEle.setAttribute('cx', currentX.toString());
        elem.rightCircleEle.setAttribute('cx', (currentX + currentWidth).toString());
        elem.setArrowDirection(currentX, currentWidth, this.height);
        elem.gripCircle.setAttribute(
            'transform', 'translate(' + (currentX + currentWidth / 2 + ((this.isVertical ? 1 : -1) * padding)) +
            ',' + (this.isVertical ? (this.axis.scrollbarSettings.height / 2 + padding / 2) - 0.5 : (this.axis.scrollbarSettings.height / 2 - padding / 2) - 0.5) + ') rotate(' + (this.isVertical ? '180' : '0') + ')'
        );
    }
    /**
     * Method to get default values
     *
     * @returns {void}
     */

    private getDefaults(): void {
        const axis: Axis = this.axis;
        const circleRadius: number = this.axis.scrollbarSettings.height / 2;
        const padding: number = 5;
        const gripWidth: number = 14;
        const minThumbWidth: number = circleRadius * 2 + padding * 2 + gripWidth;
        if (this.axis.scrollbarSettings.enable) {
            this.isLazyLoad = true;
            this.getLazyDefaults(axis);
        }
        this.isVertical = axis.orientation === 'Vertical';
        this.zoomFactor = this.isLazyLoad ? this.zoomFactor : axis.zoomFactor;
        this.zoomPosition = this.isLazyLoad ? this.zoomPosition : axis.zoomPosition;
        let currentWidth: number = this.zoomFactor * (this.isVertical ? axis.rect.height : axis.rect.width);
        currentWidth = (this.isLazyLoad && !this.axis.scrollbarSettings.enableZoom) || currentWidth > minThumbWidth ? currentWidth : minThumbWidth;
        this.scrollX = axis.rect.x;
        this.scrollY = axis.rect.y;
        this.width = this.isVertical ? axis.rect.height : axis.rect.width;
        this.height = this.axis.scrollbarSettings.height;
        const currentX: number = this.zoomPosition * (this.isVertical ? axis.rect.height : this.width);
        const minThumbX: number = (this.width - minThumbWidth - circleRadius);
        this.scrollElements.thumbRectX = currentX > minThumbX ? minThumbX : currentX < circleRadius ? circleRadius : currentX;
        this.scrollElements.thumbRectWidth = this.isThumbDrag ? this.scrollElements.thumbRectWidth : ((currentWidth + this.scrollElements.thumbRectX) < this.width - (circleRadius * 2))
            ? currentWidth : this.width - this.scrollElements.thumbRectX - circleRadius;
    }

    /**
     * Lazy load default values.
     *
     * @param axis
     */

    public getLazyDefaults(axis: Axis): void {
        let start: number;
        let end: number;
        let valueType: string = axis.valueType;
        const scrollbarSettings: ScrollbarSettingsModel = axis.scrollbarSettings;
        const range: ScrollbarSettingsRangeModel = axis.scrollbarSettings.range;
        const visibleRange: VisibleRangeModel = axis.visibleRange;
        const pointsLength: number = axis.scrollbarSettings.pointsLength;
        this.valueType = valueType = (!scrollbarSettings.range.minimum || !scrollbarSettings.range.maximum) &&
            scrollbarSettings.pointsLength ? 'Double' : valueType;
        const option: DateFormatOptions = {
            skeleton: 'full',
            type: 'dateTime'
        };
        const dateParser: Function = this.component.intl.getDateParser(option);
        const dateFormatter: Function = this.component.intl.getDateFormat(option);
        switch (valueType) {
        case 'Double':
        case 'Category':
        case 'Logarithmic':
            start = range.minimum ? range.minimum as number : pointsLength ? 0 : visibleRange.min;
            end = range.maximum ? range.maximum as number : pointsLength ? (pointsLength - 1) : visibleRange.max;
            break;
        case 'DateTime':
        case 'DateTimeCategory':
            start = range.minimum ? Date.parse(dateParser(dateFormatter(range.minimum))) : visibleRange.min;
            end = range.maximum ? Date.parse(dateParser(dateFormatter(range.maximum))) : visibleRange.max;
            break;
        }
        start = Math.min(start, visibleRange.min); end = Math.max(end, visibleRange.max);
        const zoomFactor: number = (visibleRange.max - visibleRange.min) / (end - start);
        const zoomPosition: number = (visibleRange.min - start) / (end - start);
        this.zoomFactor = range.minimum || range.maximum ? zoomFactor : (this.axis.maxPointLength / axis.scrollbarSettings.pointsLength);
        this.zoomPosition = range.minimum || range.maximum ? zoomPosition : axis.zoomPosition;
        this.scrollRange.min = start;
        this.scrollRange.max = end;
        this.scrollRange.delta = end - start;
        this.previousStart = visibleRange.min;
        this.previousEnd = visibleRange.max;
    }
    /**
     * Method to get log range
     *
     * @param axis
     */

    public getLogRange(axis: Axis): ScrollbarSettingsRangeModel {
        const range: ScrollbarSettingsRangeModel = axis.scrollbarSettings.range;
        let start: number = logBase(<number>range.minimum, axis.logBase);
        let end: number = logBase(<number>range.maximum, axis.logBase);
        start = isFinite(start) ? start : <number>range.minimum;
        end = isFinite(start) ? end : <number>range.maximum;
        return { minimum: Math.floor(start / 1), maximum: Math.ceil(end / 1) };
    }

    /**
     * Method for injecting scrollbar module.
     *
     * @param axis
     * @param component
     */

    public injectTo(axis: Axis, component: Chart): void {
        axis.zoomingScrollBar = new ScrollBar(component, axis);
    }

    /**
     * Method to destroy scrollbar.
     *
     * @returns {void}
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
     * Method to get scrollbar module name.
     *
     * @returns {string}
     */

    public getModuleName(): string {
        return 'ScrollBar';
    }

    private getArgs(
        eventName: string, range?: VisibleRangeModel, zoomPosition?: number,
        zoomFactor?: number, currentRanges?: ScrollbarSettingsRangeModel
    ): IScrollEventArgs {
        const scrollArgs: IScrollEventArgs = {
            axis: (this.component.isBlazor ? {} : this.axis) as Axis,
            name: eventName,
            range: this.axis.visibleRange,
            zoomFactor: this.axis.zoomFactor,
            zoomPosition: this.axis.zoomPosition,
            previousRange: range,
            previousZoomFactor: zoomFactor,
            previousZoomPosition: zoomPosition,
            currentRange: currentRanges

        };
        return scrollArgs;
    }

}
