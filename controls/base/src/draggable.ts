/* eslint-disable @typescript-eslint/no-explicit-any */
import { Base } from './base';
import { Browser } from './browser';
import { isVisible } from './dom';
import { Property, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';
import { EventHandler } from './event-handler';
import { ChildProperty } from './child-property';
import { PositionModel, DraggableModel } from './draggable-model';
import { select, closest, setStyleAttribute, addClass, createElement } from './dom';
import { extend, isUndefined, isNullOrUndefined, compareElementParent, isBlazor } from './util';
const defaultPosition: PositionCoordinates = { left: 0, top: 0, bottom: 0, right: 0 };
const isDraggedObject: DragObject = { isDragged: false };

/**
 * Specifies the Direction in which drag movement happen.
 */
export type DragDirection = 'x' | 'y';

interface PositionCoordinates {
    left?: number;
    top?: number;
    bottom?: number;
    right?: number;
}

interface DragObject {
    isDragged: boolean;
}
/**
 * Specifies the position coordinates
 */
export class Position extends ChildProperty<Position> {
    /**
     * Specifies the left position of cursor in draggable.
     */
    @Property(0)
    public left: number;
    /**
     * Specifies the left position of cursor in draggable.
     */
    @Property(0)
    public top: number;

}
interface PageInfo {
    x: number;
    y: number;
}
/**
 * Coordinates for element position
 *
 * @private
 */
export interface Coordinates {
    /**
     * Defines the x Coordinate of page.
     */
    pageX: number;
    /**
     * Defines the y Coordinate of page.
     */
    pageY: number;
    /**
     * Defines the x Coordinate of client.
     */
    clientX: number;
    /**
     * Defines the y Coordinate of client.
     */
    clientY: number;
}
/**
 * Interface to specify the drag data in the droppable.
 */
export interface DropInfo {
    /**
     * Specifies the current draggable element
     */
    draggable?: HTMLElement;
    /**
     * Specifies the current helper element.
     */
    helper?: HTMLElement;
    /**
     * Specifies the drag target element
     */
    draggedElement?: HTMLElement;
}

export interface DropObject {
    target: HTMLElement;
    instance: DropOption;
}

/**
 * Used to access values
 *
 * @private
 */
export interface DragPosition {
    left?: string;
    top?: string;
}

/**
 * Used for accessing the interface.
 *
 * @private
 */
export interface Instance extends HTMLElement {
    /**
     * Specifies current instance collection in element
     */
    // eslint-disable-next-line camelcase
    ej2_instances: { [key: string]: Object }[];
}
/**
 * Droppable function to be invoked from draggable
 *
 * @private
 */
export interface DropOption {
    /**
     * Used to triggers over function while draggable element is over the droppable element.
     */
    intOver: Function;
    /**
     * Used to triggers out function while draggable element is out of the droppable element.
     */
    intOut: Function;
    /**
     * Used to triggers  out function while draggable element is dropped on the droppable element.
     */
    intDrop: Function;
    /**
     * Specifies the information about the drag element.
     */
    dragData: DropInfo;
    /**
     * Specifies the status of the drag of drag stop calling.
     */
    dragStopCalled: boolean;
}
/**
 * Drag Event arguments
 */
export interface DragEventArgs {
    /**
     * Specifies the actual event.
     */
    event?: MouseEvent & TouchEvent;
    /**
     * Specifies the current drag element.
     */
    element?: HTMLElement;
    /**
     * Specifies the current target element.
     */
    target?: HTMLElement;
    /**
     * 'true' if the drag or drop action is to be prevented; otherwise false.
     */
    cancel?: boolean;
}

/**
 * Used for accessing the BlazorEventArgs.
 *
 * @private
 */
export interface BlazorDragEventArgs {
    /**
     * bind draggable element for Blazor Components
     */
    bindEvents: Function;
    /**
     * Draggable element to which draggable events are to be binded in Blazor.
     */
    dragElement: HTMLElement;
}

/**
 * Draggable Module provides support to enable draggable functionality in Dom Elements.
 * ```html
 * <div id='drag'>Draggable</div>
 * <script>
 * var ele = document.getElementById('drag');
 * var drag:Draggable = new Draggable(ele,{
 *     clone:false,
 *     drag: function(e) {
 *      //drag handler code.
 *      },
 *     handle:'.class'
 * });
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Draggable extends Base<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines the distance between the cursor and the draggable element.
     */
    @Complex<PositionModel>({}, Position)
    public cursorAt: PositionModel;
    /**
     * If `clone` set to true, drag operations are performed in duplicate element of the draggable element.
     *
     * @default true
     */
    @Property(true)
    public clone: boolean;
    /**
     * Defines the parent  element in which draggable element movement will be restricted.
     */
    @Property()
    public dragArea: HTMLElement | string;
    /**
     * Defines the dragArea is scrollable or not.
     */
    @Property()
    public isDragScroll: boolean;
    /**
     * Defines wheather need to replace drag element by currentstateTarget.
     *
     * @private
     */
    @Property()
    public isReplaceDragEle: boolean;
    /**
     * Defines wheather need to add prevent select class to body or not.
     *
     * @private
     */
    @Property(true)
    public isPreventSelect: boolean;
    /**
     * Specifies the callback function for drag event.
     *
     * @event drag
     */
    @Event()
    public drag: Function;
    /**
     * Specifies the callback function for dragStart event.
     *
     * @event dragStart
     */
    @Event()
    public dragStart: Function;
    /**
     * Specifies the callback function for dragStop event.
     *
     * @event dragStop
     */
    @Event()
    public dragStop: Function;
    /**
     * Defines the minimum distance draggable element to be moved to trigger the drag operation.
     *
     * @default 1
     */
    @Property(1)
    public distance: number;
    /**
     * Defines the child element selector which will act as drag handle.
     */
    @Property()
    public handle: string;
    /**
     * Defines the child element selector which will prevent dragging of element.
     */
    @Property()
    public abort: string | string[];
    /**
     * Defines the callback function for customizing the cloned  element.
     */
    @Property()
    public helper: Function;
    /**
     * Defines the scope value to group sets of draggable and droppable items.
     * A draggable with the same scope value will be accepted by the droppable.
     */
    @Property('default')
    public scope: string;
    /**
     * Specifies the dragTarget by which the clone element is positioned if not given current context element will be considered.
     *
     * @private
     */
    @Property('')
    public dragTarget: string;
    /**
     * Defines the axis to limit the draggable element drag path.The possible axis path values are
     * * `x` - Allows drag movement in horizontal direction only.
     * * `y` - Allows drag movement in vertical direction only.
     */
    @Property()
    public axis: DragDirection;
    /**
     * Defines the function to change the position value.
     *
     * @private
     */
    @Property()
    public queryPositionInfo: Function;
    /**
     * Defines whether the drag clone element will be split form the cursor pointer.
     *
     * @private
     */
    @Property(false)
    public enableTailMode: boolean;
    /**
     * Defines whether to skip the previous drag movement comparison.
     *
     * @private
     */
    @Property(false)
    public skipDistanceCheck: boolean;
    /**
     * @private
     */
    @Property(true)
    public preventDefault: boolean;
    /**
     * Defines whether to enable autoscroll on drag movement of draggable element.
     * enableAutoScroll
     *
     * @private
     */
    @Property(false)
    public enableAutoScroll: boolean;
    /**
     * Defines whether to enable taphold  on mobile devices.
     * enableAutoScroll
     *
     * @private
     */
    @Property(false)
    public enableTapHold: boolean;
    /**
     * Specifies the time delay for tap hold.
     *
     * @default 750
     *  @private
     */
    @Property(750)
    public tapHoldThreshold: number;
    /**
     * @private
     */
    @Property(false)
    public enableScrollHandler: boolean;
    private target: HTMLElement;
    /**
     * @private
     */
    public initialPosition: PageInfo;
    private relativeXPosition: number;
    private relativeYPosition: number;
    private margin: PositionCoordinates;
    private offset: PositionCoordinates;
    private position: PositionCoordinates;
    private dragLimit: PositionCoordinates = Draggable.getDefaultPosition();
    private borderWidth: PositionCoordinates = Draggable.getDefaultPosition();
    private padding: PositionCoordinates = Draggable.getDefaultPosition();
    private left: number;
    private top: number;
    private width: number;
    private height: number;
    private pageX: number;
    private diffX: number = 0;
    private prevLeft: number = 0;
    private prevTop: number = 0;
    private dragProcessStarted: boolean = false;
    private eleTop: number = 0;
    private tapHoldTimer: any = 0;
    private dragElePosition: any;
    public currentStateTarget: any;
    private externalInitialize: boolean = false;
    private diffY: number = 0;
    private pageY: number;
    private helperElement: HTMLElement;
    private hoverObject: DropObject;
    private parentClientRect: PositionModel;
    private parentScrollX: number = 0;
    private parentScrollY: number = 0;
    private tempScrollHeight: number;
    private tempScrollWidth: number;
    public droppables: { [key: string]: DropInfo } = {};
    constructor(element: HTMLElement, options?: DraggableModel) {
        super(options, element);
        this.bind();
    }
    protected bind(): void {
        this.toggleEvents();
        if (Browser.isIE) {
            addClass([this.element], 'e-block-touch');
        }
        this.droppables[this.scope] = {};
    }
    private static getDefaultPosition(): PositionCoordinates {
        return extend({}, defaultPosition);
    }
    private toggleEvents(isUnWire?: boolean): void {
        let ele: Element;
        if (!isUndefined(this.handle)) {
            ele = select(this.handle, this.element);
        }
        const handler: Function = (this.enableTapHold && Browser.isDevice && Browser.isTouch) ? this.mobileInitialize : this.initialize;
        if (isUnWire) {
            EventHandler.remove(ele || this.element, Browser.isSafari() ? 'touchstart' : Browser.touchStartEvent, handler);
        } else {
            EventHandler.add(ele || this.element, Browser.isSafari() ? 'touchstart' : Browser.touchStartEvent, handler, this);
        }
    }
    /* istanbul ignore next */
    private mobileInitialize(evt: MouseEvent & TouchEvent): void {
        const target: EventTarget = evt.currentTarget;
        this.tapHoldTimer = setTimeout(
            () => {
                this.externalInitialize = true;
                this.removeTapholdTimer();
                this.initialize(evt, target);
            },
            this.tapHoldThreshold);
        EventHandler.add(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.removeTapholdTimer, this);
        EventHandler.add(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.removeTapholdTimer, this);
    }
    /* istanbul ignore next */
    private removeTapholdTimer(): void {
        clearTimeout(this.tapHoldTimer);
        EventHandler.remove(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.removeTapholdTimer);
        EventHandler.remove(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.removeTapholdTimer);
    }
    /* istanbul ignore next */
    private getScrollableParent(element: HTMLElement, axis: string): HTMLElement {
        const scroll: Object = { 'vertical': 'scrollHeight', 'horizontal': 'scrollWidth' };
        const client: Object = { 'vertical': 'clientHeight', 'horizontal': 'clientWidth' };
        if (isNullOrUndefined(element)) {
            return null;
        }
        if (element[scroll[`${axis}`]] > element[client[`${axis}`]]) {
            if (axis === 'vertical' ? element.scrollTop > 0 : element.scrollLeft > 0) {
                if (axis === 'vertical') {
                    this.parentScrollY = this.parentScrollY +
                        (this.parentScrollY === 0 ? element.scrollTop : element.scrollTop - this.parentScrollY);
                    this.tempScrollHeight = element.scrollHeight;
                } else {
                    this.parentScrollX = this.parentScrollX +
                        (this.parentScrollX === 0 ? element.scrollLeft : element.scrollLeft - this.parentScrollX);
                    this.tempScrollWidth = element.scrollWidth;
                }
                if (!isNullOrUndefined(element)) {
                    return this.getScrollableParent(element.parentNode as HTMLElement, axis);
                } else {
                    return element;
                }
            } else {
                return this.getScrollableParent(element.parentNode as HTMLElement, axis);
            }
        } else {
            return this.getScrollableParent(element.parentNode as HTMLElement, axis);
        }
    }
    private getScrollableValues(): void {
        this.parentScrollX = 0;
        this.parentScrollY = 0;
        const isModalDialog: boolean = this.element.classList.contains('e-dialog') && this.element.classList.contains('e-dlg-modal');
        const verticalScrollParent: HTMLElement = this.getScrollableParent(this.element.parentNode as HTMLElement, 'vertical');
        const horizontalScrollParent: HTMLElement = this.getScrollableParent(this.element.parentNode as HTMLElement, 'horizontal');
    }
    private initialize(evt: MouseEvent & TouchEvent, curTarget?: EventTarget): void {
        this.currentStateTarget = evt.target;
        if (this.isDragStarted()) {
            return;
        } else {
            this.isDragStarted(true);
            this.externalInitialize = false;
        }
        this.target = <HTMLElement>(evt.currentTarget || curTarget);
        this.dragProcessStarted = false;
        if (this.abort) {
            let abortSelectors: any = this.abort;
            if (typeof abortSelectors === 'string') {
                abortSelectors = [abortSelectors];
            }
            for (let i: number = 0; i < abortSelectors.length; i++) {
                if (!isNullOrUndefined(closest((evt.target as Element), abortSelectors[parseInt(i.toString(), 10)]))) {
                    /* istanbul ignore next */
                    if (this.isDragStarted()) {
                        this.isDragStarted(true);
                    }
                    return;
                }
            }
        }
        if (this.preventDefault && !isUndefined(evt.changedTouches) && evt.type !== 'touchstart') {
            evt.preventDefault();
        }
        this.element.setAttribute('aria-grabbed', 'true');
        const intCoord: Coordinates = this.getCoordinates(evt);
        this.initialPosition = { x: intCoord.pageX, y: intCoord.pageY };
        if (!this.clone) {
            const pos: PositionModel = this.element.getBoundingClientRect();
            this.getScrollableValues();
            if (evt.clientX === evt.pageX) { this.parentScrollX = 0; }
            if (evt.clientY === evt.pageY) { this.parentScrollY = 0; }
            this.relativeXPosition = intCoord.pageX - (pos.left + this.parentScrollX);
            this.relativeYPosition = intCoord.pageY - (pos.top + this.parentScrollY);
        }
        if (this.externalInitialize) {
            this.intDragStart(evt);
        } else {
            EventHandler.add(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.intDragStart, this);
            EventHandler.add(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.intDestroy, this);
        }
        this.toggleEvents(true);
        if (evt.type !== 'touchstart' && this.isPreventSelect) {
            document.body.classList.add('e-prevent-select');
        }
        this.externalInitialize = false;
        EventHandler.trigger(document.documentElement, Browser.isSafari() ? 'touchstart' : Browser.touchStartEvent, evt);
    }
    private intDragStart(evt: MouseEvent & TouchEvent): void {
        this.removeTapholdTimer();
        const isChangeTouch: boolean = !isUndefined(evt.changedTouches);
        if (isChangeTouch && (evt.changedTouches.length !== 1)) {
            return;
        }
        const intCordinate: Coordinates = this.getCoordinates(evt);
        let pos: PositionModel;
        const styleProp: CSSStyleDeclaration = getComputedStyle(this.element);
        this.margin = {
            left: parseInt(styleProp.marginLeft, 10),
            top: parseInt(styleProp.marginTop, 10),
            right: parseInt(styleProp.marginRight, 10),
            bottom: parseInt(styleProp.marginBottom, 10)
        };
        let element: HTMLElement = this.element;
        if (this.clone && this.dragTarget) {
            const intClosest: HTMLElement = <HTMLElement>closest(evt.target as Element, this.dragTarget);
            if (!isNullOrUndefined(intClosest)) {
                element = intClosest;
            }
        }
        /* istanbul ignore next */
        if (this.isReplaceDragEle) {
            element = this.currentStateCheck(evt.target as any, element);
        }
        this.offset = this.calculateParentPosition(element);
        this.position = this.getMousePosition(evt, this.isDragScroll);
        const x: number = this.initialPosition.x - intCordinate.pageX;
        const y: number = this.initialPosition.y - intCordinate.pageY;
        const distance: number = Math.sqrt((x * x) + (y * y));
        if ((distance >= this.distance || this.externalInitialize)) {
            const ele: HTMLElement = this.getHelperElement(evt);
            if (!ele || isNullOrUndefined(ele)) {
                return;
            }
            if (isChangeTouch) {
                evt.preventDefault();
            }
            const dragTargetElement: HTMLElement = this.helperElement = ele;
            this.parentClientRect = this.calculateParentPosition(dragTargetElement.offsetParent);
            if (this.dragStart) {
                const curTarget: Element = this.getProperTargetElement(evt);
                const args: { [key: string]: object } = {
                    event: evt,
                    element: element,
                    target: curTarget,
                    bindEvents: isBlazor() ? this.bindDragEvents.bind(this) : null,
                    dragElement: dragTargetElement
                };
                this.trigger('dragStart', args);
            }
            if (this.dragArea) {
                this.setDragArea();
            } else {
                this.dragLimit = { left: 0, right: 0, bottom: 0, top: 0 };
                this.borderWidth = { top: 0, left: 0 };
            }
            pos = { left: this.position.left - this.parentClientRect.left, top: this.position.top - this.parentClientRect.top };
            if (this.clone && !this.enableTailMode) {
                this.diffX = this.position.left - this.offset.left;
                this.diffY = this.position.top - this.offset.top;
            }
            this.getScrollableValues();
            // when drag element has margin-top
            const styles: CSSStyleDeclaration = getComputedStyle(element);
            const marginTop: number = parseFloat(styles.marginTop);
            /* istanbul ignore next */
            if (this.clone && marginTop !== 0) {
                pos.top += marginTop;
            }
            this.eleTop = !isNaN(parseFloat(styles.top)) ? parseFloat(styles.top) - this.offset.top : 0;
            /* istanbul ignore next */
            // if (this.eleTop > 0) {
            //     pos.top += this.eleTop;
            // }
            if (this.enableScrollHandler && !this.clone) {
                pos.top -= this.parentScrollY;
                pos.left -= this.parentScrollX;
            }
            const posValue: DragPosition = this.getProcessedPositionValue({
                top: (pos.top - this.diffY) + 'px',
                left: (pos.left - this.diffX) + 'px'
            });
            if (this.dragArea && typeof this.dragArea !== 'string' && this.dragArea.classList.contains('e-kanban-content') && this.dragArea.style.position === 'relative') {
                pos.top += this.dragArea.scrollTop;
            }
            this.dragElePosition = { top: pos.top, left: pos.left };
            setStyleAttribute(dragTargetElement, this.getDragPosition({ position: 'absolute', left: posValue.left, top: posValue.top }));
            EventHandler.remove(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.intDragStart);
            EventHandler.remove(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.intDestroy);
            if (!isBlazor()) {
                this.bindDragEvents(dragTargetElement);
            }
        }
    }

    private bindDragEvents(dragTargetElement: HTMLElement): void {
        if (isVisible(dragTargetElement)) {
            EventHandler.add(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.intDrag, this);
            EventHandler.add(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.intDragStop, this);
            this.setGlobalDroppables(false, this.element, dragTargetElement);
        } else {
            this.toggleEvents();
            document.body.classList.remove('e-prevent-select');
        }
    }

    private elementInViewport(el: HTMLElement): boolean {
        this.top = el.offsetTop;
        this.left = el.offsetLeft;
        this.width = el.offsetWidth;
        this.height = el.offsetHeight;

        while (el.offsetParent) {
            el = <HTMLElement>el.offsetParent;
            this.top += el.offsetTop;
            this.left += el.offsetLeft;
        }

        return (
            this.top >= window.pageYOffset &&
            this.left >= window.pageXOffset &&
            (this.top + this.height) <= (window.pageYOffset + window.innerHeight) &&
            (this.left + this.width) <= (window.pageXOffset + window.innerWidth)
        );
    }

    private getProcessedPositionValue(value: DragPosition): DragPosition {
        if (this.queryPositionInfo) {
            return this.queryPositionInfo(value);
        }
        return value;
    }

    private calculateParentPosition(ele: Element): PositionModel {
        if (isNullOrUndefined(ele)) {
            return { left: 0, top: 0 };
        }
        const rect: ClientRect = ele.getBoundingClientRect();
        const style: CSSStyleDeclaration = getComputedStyle(ele);
        return {
            left: (rect.left + window.pageXOffset) - parseInt(style.marginLeft, 10),
            top: (rect.top + window.pageYOffset) - parseInt(style.marginTop, 10)
        };
    }
    private intDrag(evt: MouseEvent & TouchEvent): void {
        if (!isUndefined(evt.changedTouches) && (evt.changedTouches.length !== 1)) {
            return;
        }
        if (this.clone && evt.changedTouches && Browser.isDevice && Browser.isTouch) {
            evt.preventDefault();
        }
        let left: number;
        let top: number;
        this.position = this.getMousePosition(evt, this.isDragScroll);
        const docHeight: number = this.getDocumentWidthHeight('Height');
        if (docHeight < this.position.top) {
            this.position.top = docHeight;
        }
        const docWidth: number = this.getDocumentWidthHeight('Width');
        if (docWidth < this.position.left) {
            this.position.left = docWidth;
        }
        if (this.drag) {
            const curTarget: HTMLElement = this.getProperTargetElement(evt);
            this.trigger('drag', { event: evt, element: this.element, target: curTarget });
        }
        const eleObj: DropObject = this.checkTargetElement(evt);
        if (eleObj.target && eleObj.instance) {
            let flag: boolean = true;
            if (this.hoverObject) {
                if (this.hoverObject.instance !== eleObj.instance) {
                    this.triggerOutFunction(evt, eleObj);
                } else {
                    flag = false;
                }
            }
            if (flag) {
                (<any>eleObj).instance.dragData[this.scope] = this.droppables[this.scope];
                eleObj.instance.intOver(evt, eleObj.target);
                this.hoverObject = eleObj;
            }
        } else if (this.hoverObject) {
            this.triggerOutFunction(evt, eleObj);
        }
        const helperElement: HTMLElement = this.droppables[this.scope].helper;
        this.parentClientRect = this.calculateParentPosition(this.helperElement.offsetParent);
        const tLeft: number = this.parentClientRect.left;
        const tTop: number = this.parentClientRect.top;
        const intCoord: Coordinates = this.getCoordinates(evt);
        const pagex: number = intCoord.pageX;
        const pagey: number = intCoord.pageY;
        const dLeft: number = this.position.left - this.diffX;
        const dTop: number = this.position.top - this.diffY;
        const styles: CSSStyleDeclaration = getComputedStyle(helperElement);
        if (this.dragArea) {
            if (this.enableAutoScroll) {
                this.setDragArea();
            }
            if (this.pageX !== pagex || this.skipDistanceCheck) {
                const helperWidth: number = helperElement.offsetWidth + (parseFloat(styles.marginLeft)
                    + parseFloat(styles.marginRight));
                if (this.dragLimit.left > dLeft && dLeft > 0) {
                    left = this.dragLimit.left;
                } else if (this.dragLimit.right + window.pageXOffset < dLeft + helperWidth && dLeft > 0) {
                    left = dLeft - (dLeft - this.dragLimit.right) + window.pageXOffset - helperWidth;
                } else {
                    left = dLeft < 0 ? this.dragLimit.left : dLeft;
                }
            }
            if (this.pageY !== pagey || this.skipDistanceCheck) {
                const helperHeight: number = helperElement.offsetHeight + (parseFloat(styles.marginTop)
                    + parseFloat(styles.marginBottom));
                if (this.dragLimit.top > dTop && dTop > 0) {
                    top = this.dragLimit.top;
                } else if (this.dragLimit.bottom + window.pageYOffset < dTop + helperHeight && dTop > 0) {
                    top = dTop - (dTop - this.dragLimit.bottom) + window.pageYOffset - helperHeight;
                } else {
                    top = dTop < 0 ? this.dragLimit.top : dTop;
                }
            }
        } else {
            left = dLeft;
            top = dTop;
        }
        const iTop: number = tTop + this.borderWidth.top;
        const iLeft: number = tLeft + this.borderWidth.left;
        if (this.dragProcessStarted) {
            if (isNullOrUndefined(top)) {
                top = this.prevTop;
            }
            if (isNullOrUndefined(left)) {
                left = this.prevLeft;
            }
        }
        let draEleTop: number;
        let draEleLeft: number;
        if (this.helperElement.classList.contains('e-treeview')){
            if (this.dragArea) {
                this.dragLimit.top = this.clone ? this.dragLimit.top : 0;
                draEleTop = (top - iTop) < 0 ? this.dragLimit.top : (top - this.borderWidth.top);
                draEleLeft = (left - iLeft) < 0 ? this.dragLimit.left : (left - this.borderWidth.left);
            } else {
                draEleTop = top - this.borderWidth.top;
                draEleLeft = left - this.borderWidth.left;
            }
        } else {
            if (this.dragArea) {
                const isDialogEle: boolean = this.helperElement.classList.contains('e-dialog');
                this.dragLimit.top = this.clone ? this.dragLimit.top : 0;
                draEleTop = (top - iTop) < 0 ? this.dragLimit.top : (top - iTop);
                draEleLeft = (left - iLeft) < 0 ? isDialogEle ? (left - (iLeft - this.borderWidth.left)) :
                    this.dragElePosition.left : (left - iLeft);
            } else {
                draEleTop = top - iTop;
                draEleLeft = left - iLeft;
            }
        }
        const marginTop: number = parseFloat(getComputedStyle(this.element).marginTop);
        // when drag-element has margin-top
        /* istanbul ignore next */
        if (marginTop > 0) {
            if (this.clone) {
                draEleTop += marginTop;
                if (dTop < 0) {
                    if ((marginTop + dTop) >= 0) {
                        draEleTop = marginTop + dTop;
                    } else {
                        draEleTop -= marginTop;
                    }
                }
                if (this.dragArea) {
                    draEleTop = (this.dragLimit.bottom < draEleTop) ? this.dragLimit.bottom : draEleTop;
                }
            }
            if ((top - iTop) < 0) {
                if (dTop + marginTop + (helperElement.offsetHeight - iTop) >= 0) {
                    const tempDraEleTop: number = this.dragLimit.top + dTop - iTop;
                    if ((tempDraEleTop + marginTop + iTop) < 0) {
                        draEleTop -= marginTop + iTop;
                    } else {
                        draEleTop = tempDraEleTop;
                    }
                } else {
                    draEleTop -= marginTop + iTop;
                }
            }
        }

        if (this.dragArea && this.helperElement.classList.contains('e-treeview')) {
            const helperHeight: number = helperElement.offsetHeight + (parseFloat(styles.marginTop)
                    + parseFloat(styles.marginBottom));
            draEleTop = (draEleTop + helperHeight) > this.dragLimit.bottom ? (this.dragLimit.bottom - helperHeight) : draEleTop;
        }
        /* istanbul ignore next */
        // if(this.eleTop > 0) {
        //      draEleTop += this.eleTop;
        // }
        if (this.enableScrollHandler && !this.clone) {
            draEleTop -= this.parentScrollY;
            draEleLeft -= this.parentScrollX;
        }
        if (this.dragArea && typeof this.dragArea !== 'string' && this.dragArea.classList.contains('e-kanban-content') && this.dragArea.style.position === 'relative') {
            draEleTop += this.dragArea.scrollTop;
        }
        const dragValue: DragPosition = this.getProcessedPositionValue({ top: draEleTop + 'px', left: draEleLeft + 'px' });
        setStyleAttribute(helperElement, this.getDragPosition(dragValue));
        if (!this.elementInViewport(helperElement) && this.enableAutoScroll && !this.helperElement.classList.contains('e-treeview')) {
            this.helperElement.scrollIntoView();
        }

        let elements: NodeList | Element[] = document.querySelectorAll(':hover');
        if (this.enableAutoScroll && this.helperElement.classList.contains('e-treeview')) {
            if (elements.length === 0) {
                elements = this.getPathElements(evt);
            }
            let scrollParent: any = this.getScrollParent(elements, false);
            if (this.elementInViewport(this.helperElement)) {
                this.getScrollPosition(scrollParent, draEleTop);
            }
            else if (!this.elementInViewport(this.helperElement)) {
                elements = [].slice.call(document.querySelectorAll(':hover'));
                if (elements.length === 0) {
                    elements = this.getPathElements(evt);
                }
                scrollParent = this.getScrollParent(elements, true);
                this.getScrollPosition(scrollParent, draEleTop);
            }
        }

        this.dragProcessStarted = true;
        this.prevLeft = left;
        this.prevTop = top;
        this.position.left = left;
        this.position.top = top;
        this.pageX = pagex;
        this.pageY = pagey;
    }
    private getScrollParent(node: any, reverse: boolean): any {
        const nodeEl: any = reverse ? node.reverse() : node;
        let hasScroll: string;
        for (let i: number = nodeEl.length - 1; i >= 0; i--) {
            hasScroll = window.getComputedStyle(nodeEl[parseInt(i.toString(), 10)])['overflow-y'];
            if ((hasScroll === 'auto' || hasScroll === 'scroll')
                && nodeEl[parseInt(i.toString(), 10)].scrollHeight > nodeEl[parseInt(i.toString(), 10)].clientHeight) {
                return nodeEl[parseInt(i.toString(), 10)];
            }
        }
        hasScroll = window.getComputedStyle(document.scrollingElement)['overflow-y'];
        if (hasScroll === 'visible') {
            (document.scrollingElement as HTMLElement).style.overflow = 'auto';
            return document.scrollingElement;
        }
    }
    private getScrollPosition(nodeEle: HTMLElement, draEleTop: number): void {
        if (nodeEle && nodeEle === document.scrollingElement) {
            if ((nodeEle.clientHeight + document.scrollingElement.scrollTop - this.helperElement.clientHeight) < draEleTop
                && nodeEle.getBoundingClientRect().height + this.parentClientRect.top > draEleTop) {
                nodeEle.scrollTop += this.helperElement.clientHeight;
            }else if (nodeEle.scrollTop > draEleTop - this.helperElement.clientHeight) {
                nodeEle.scrollTop -= this.helperElement.clientHeight;
            }
        }else if (nodeEle && nodeEle !== document.scrollingElement) {
            const docScrollTop: number = document.scrollingElement.scrollTop;
            const helperClientHeight: number = this.helperElement.clientHeight;
            if ((nodeEle.clientHeight + nodeEle.getBoundingClientRect().top - helperClientHeight + docScrollTop ) < draEleTop) {
                nodeEle.scrollTop += this.helperElement.clientHeight;
            } else if (nodeEle.getBoundingClientRect().top  > (draEleTop - helperClientHeight - docScrollTop )) {
                nodeEle.scrollTop -= this.helperElement.clientHeight;
            }
        }
    }
    private getPathElements(evt: MouseEvent & TouchEvent): Element[] {
        const elementTop: number = evt.clientX > 0 ? evt.clientX : 0;
        const elementLeft: number = evt.clientY > 0 ? evt.clientY : 0;
        return document.elementsFromPoint(elementTop, elementLeft);
    }
    private triggerOutFunction(evt: MouseEvent & TouchEvent, eleObj: DropObject): void {
        this.hoverObject.instance.intOut(evt, eleObj.target);
        this.hoverObject.instance.dragData[this.scope] = null;
        this.hoverObject = null;
    }
    private getDragPosition(dragValue: DragPosition & { position?: string }): {
        [key: string]: Object;
    } {
        const temp: {
            [key: string]: Object;
        } = extend({}, dragValue) as {
            [key: string]: Object;
        };
        if (this.axis) {
            if (this.axis === 'x') {
                delete temp.top;
            } else if (this.axis === 'y') {
                delete temp.left;
            }
        }
        return temp;
    }
    private getDocumentWidthHeight(str: string): number {
        const docBody: HTMLElement | null = document.body;
        const docEle: HTMLElement | null = document.documentElement;
        const returnValue: number = Math.max(
            docBody['scroll' + str], docEle['scroll' + str],
            docBody['offset' + str], docEle['offset' + str], docEle['client' + str]);
        return returnValue;
    }
    private intDragStop(evt: MouseEvent & TouchEvent): void {
        this.dragProcessStarted = false;
        if (!isUndefined(evt.changedTouches) && (evt.changedTouches.length !== 1)) {
            return;
        }
        const type: string[] = ['touchend', 'pointerup', 'mouseup'];
        if (type.indexOf(evt.type) !== -1) {
            if (this.dragStop) {
                const curTarget: Element = this.getProperTargetElement(evt);
                this.trigger('dragStop', { event: evt, element: this.element, target: curTarget, helper: this.helperElement });
            }
            this.intDestroy(evt);
        } else {
            this.element.setAttribute('aria-grabbed', 'false');
        }
        const eleObj: DropObject = this.checkTargetElement(evt);
        if (eleObj.target && eleObj.instance) {
            eleObj.instance.dragStopCalled = true;
            (<any>eleObj).instance.dragData[this.scope] = this.droppables[this.scope];
            eleObj.instance.intDrop(evt, eleObj.target);
        }
        this.setGlobalDroppables(true);
        document.body.classList.remove('e-prevent-select');
    }
    /**
     * @param {MouseEvent | TouchEvent} evt ?
     * @returns {void}
     * @private
     */
    public intDestroy(evt: MouseEvent & TouchEvent): void {
        this.dragProcessStarted = false;
        this.toggleEvents();
        document.body.classList.remove('e-prevent-select');
        this.element.setAttribute('aria-grabbed', 'false');
        EventHandler.remove(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.intDragStart);
        EventHandler.remove(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.intDragStop);
        EventHandler.remove(document, Browser.isSafari() ? 'touchend' : Browser.touchEndEvent, this.intDestroy);
        EventHandler.remove(document, Browser.isSafari() ? 'touchmove' : Browser.touchMoveEvent, this.intDrag);
        if (this.isDragStarted()) {
            this.isDragStarted(true);
        }
    }
    // triggers when property changed
    public onPropertyChanged(newProp: DraggableModel, oldProp: DraggableModel): void {
        //No Code to handle
    }
    public getModuleName(): string {
        return 'draggable';
    }

    private isDragStarted(change?: boolean): boolean {
        if (change) { isDraggedObject.isDragged = !isDraggedObject.isDragged; }
        return isDraggedObject.isDragged;
    }

    private setDragArea(): void {
        let eleWidthBound: number;
        let eleHeightBound: number;
        let top: number = 0;
        let left: number = 0;
        let ele: HTMLElement;
        const type: string = typeof this.dragArea;
        if (type === 'string') {
            ele = <HTMLElement>select(<string>this.dragArea);
        } else {
            ele = <HTMLElement>this.dragArea;
        }
        if (ele) {
            const elementArea: ClientRect = ele.getBoundingClientRect();
            eleWidthBound = ele.scrollWidth ? ele.scrollWidth : elementArea.right - elementArea.left;
            eleHeightBound = ele.scrollHeight ? (this.dragArea && !isNullOrUndefined(this.helperElement) && this.helperElement.classList.contains('e-treeview')) ? ele.clientHeight : ele.scrollHeight : elementArea.bottom - elementArea.top;
            const keys: string[] = ['Top', 'Left', 'Bottom', 'Right'];
            const styles: any = getComputedStyle(ele);
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[parseInt(i.toString(), 10)];
                const tborder: string = styles['border' + key + 'Width'];
                const tpadding: string = styles['padding' + key];
                const lowerKey: string = key.toLowerCase();
                (<any>this.borderWidth)[`${lowerKey}`] = isNaN(parseFloat(tborder)) ? 0 : parseFloat(tborder);
                (<any>this.padding)[`${lowerKey}`] = isNaN(parseFloat(tpadding)) ? 0 : parseFloat(tpadding);
            }
            if (this.dragArea && !isNullOrUndefined(this.helperElement) && this.helperElement.classList.contains('e-treeview')) {
                top = elementArea.top + document.scrollingElement.scrollTop;
            } else {
                top = elementArea.top;
            }
            left = elementArea.left;
            this.dragLimit.left = left + this.borderWidth.left + this.padding.left;
            this.dragLimit.top = ele.offsetTop + this.borderWidth.top + this.padding.top;
            this.dragLimit.right = left + eleWidthBound - (this.borderWidth.right + this.padding.right);
            this.dragLimit.bottom = top + eleHeightBound - (this.borderWidth.bottom + this.padding.bottom);
        }
    }
    private getProperTargetElement(evt: MouseEvent & TouchEvent): HTMLElement {
        const intCoord: Coordinates = this.getCoordinates(evt);
        let ele: HTMLElement;
        const prevStyle: string = this.helperElement.style.pointerEvents || '';
        const isPointer: boolean = evt.type.indexOf('pointer') !== -1 && Browser.info.name === 'safari' && parseInt(Browser.info.version, 10) > 12 ;
        if (compareElementParent(evt.target as Element, this.helperElement) || evt.type.indexOf('touch') !== -1 || isPointer) {
            this.helperElement.style.pointerEvents = 'none';
            ele = <HTMLElement>document.elementFromPoint(intCoord.clientX, intCoord.clientY);
            this.helperElement.style.pointerEvents = prevStyle;
        } else {
            ele = <HTMLElement>evt.target;
        }
        return ele;
    }
    /* istanbul ignore next */
    private currentStateCheck(ele: HTMLElement, oldEle?: HTMLElement): HTMLElement {
        let elem: HTMLElement;
        if (!isNullOrUndefined(this.currentStateTarget) && this.currentStateTarget !== ele) {
            elem = this.currentStateTarget;
        } else {
            elem = !isNullOrUndefined(oldEle) ? oldEle : ele;
        }
        return elem;
    }
    private getMousePosition(evt: MouseEvent & TouchEvent, isdragscroll?: boolean): PositionModel {
        const dragEle: any = evt.srcElement !== undefined ? evt.srcElement : evt.target;
        const intCoord: Coordinates = this.getCoordinates(evt);
        let pageX: number;
        let pageY: number;
        const isOffsetParent: boolean = isNullOrUndefined(dragEle.offsetParent);
        /* istanbul ignore next */
        if (isdragscroll) {
            pageX = this.clone ? intCoord.pageX :
                (intCoord.pageX + (isOffsetParent ? 0 : dragEle.offsetParent.scrollLeft)) - this.relativeXPosition;
            pageY = this.clone ? intCoord.pageY :
                (intCoord.pageY + (isOffsetParent ? 0 : dragEle.offsetParent.scrollTop)) - this.relativeYPosition;
        } else {
            pageX = this.clone ? intCoord.pageX : (intCoord.pageX + window.pageXOffset) - this.relativeXPosition;
            pageY = this.clone ? intCoord.pageY : (intCoord.pageY + window.pageYOffset) - this.relativeYPosition;
        }
        if (document.scrollingElement && (!isdragscroll && !this.clone)) {
            const ele: Element = document.scrollingElement;
            const isVerticalScroll: boolean = ele.scrollHeight > 0 && ele.scrollHeight > ele.clientHeight && ele.scrollTop > 0;
            const isHorrizontalScroll: boolean = ele.scrollWidth > 0 && ele.scrollWidth > ele.clientWidth && ele.scrollLeft > 0;
            pageX = isHorrizontalScroll ? pageX - ele.scrollLeft : pageX;
            pageY = isVerticalScroll ? pageY - ele.scrollTop : pageY;
        }
        return {
            left: pageX - (this.margin.left + this.cursorAt.left),
            top: pageY - (this.margin.top + this.cursorAt.top)
        };
    }
    private getCoordinates(evt: MouseEvent & TouchEvent): Coordinates {
        if (evt.type.indexOf('touch') > -1) {
            return evt.changedTouches[0];
        }
        return evt;
    }
    private getHelperElement(evt: MouseEvent & TouchEvent): HTMLElement {
        let element: HTMLElement;
        if (this.clone) {
            if (this.helper) {
                element = this.helper({ sender: evt, element: this.target });
            } else {
                element = createElement('div', { className: 'e-drag-helper e-block-touch', innerHTML: 'Draggable' });
                document.body.appendChild(element);
            }
        } else {
            element = this.element;
        }
        return element;
    }
    private setGlobalDroppables(reset: boolean, drag?: HTMLElement, helper?: HTMLElement): void {
        this.droppables[this.scope] = reset ? null : {
            draggable: drag,
            helper: helper,
            draggedElement: this.element
        };
    }
    private checkTargetElement(evt: MouseEvent & TouchEvent): DropObject {
        const target: Element = this.getProperTargetElement(evt);
        let dropIns: DropOption = this.getDropInstance(target);
        if (!dropIns && target && !isNullOrUndefined(target.parentNode)) {
            const parent: Element = closest(target.parentNode, '.e-droppable') || target.parentElement;
            if (parent) {
                dropIns = this.getDropInstance(parent);
            }
        }
        return { target: (<HTMLElement>target), instance: dropIns };
    }
    private getDropInstance(ele: Element): DropOption {
        const name: string = 'getModuleName';
        let drop: Object;
        const eleInst: { [key: string]: Object }[] = ele && (<Instance>ele).ej2_instances;
        if (eleInst) {
            for (const inst of eleInst) {
                if ((<Function>inst[`${name}`])() === 'droppable') {
                    drop = inst;
                    break;
                }
            }
        }
        return <DropOption>drop;
    }
    public destroy(): void {
        this.toggleEvents(true);
        super.destroy();
    }
}
