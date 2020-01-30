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
const positionProp: string[] = ['offsetLeft', 'offsetTop'];
const axisMapper: string[] = ['x', 'y'];
const axisValueMapper: string[] = ['left', 'top'];
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
 * @private
 */
export interface DragPosition {
    left?: string;
    top?: string;
}

/**
 * Used for accessing the interface.
 * @private
 */
export interface Instance extends HTMLElement {
    /**
     * Specifies current instance collection in element
     */
    ej2_instances: { [key: string]: Object }[];
}
/**
 * Droppable function to be invoked from draggable
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
}

/**
 * Used for accessing the BlazorEventArgs.
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
     * Specifies the callback function for drag event.
     * @event
     */
    @Event()
    public drag: Function;
    /**
     * Specifies the callback function for dragStart event.
     * @event
     */
    @Event()
    public dragStart: Function;
    /**
     * Specifies the callback function for dragStop event.
     * @event
     */
    @Event()
    public dragStop: Function;
    /**
     * Defines the minimum distance draggable element to be moved to trigger the drag operation.
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
     * @private
     */
    @Property()
    public queryPositionInfo: Function;
    /**
     * Defines whether the drag clone element will be split form the cursor pointer.
     * @private
     */
    @Property(false)
    public enableTailMode: boolean;
    /**
     * Defines whether to skip the previous drag movement comparison.
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
     * @private
     */
    @Property(false)
    public enableAutoScroll: boolean;
    /**
     * Defines whether to enable taphold  on mobile devices.
     * enableAutoScroll
     * @private
     */
    @Property(false)
    public enableTapHold: boolean;
    /**
     * Specifies the time delay for tap hold.
     * @default 750
     *  @private
     */
    @Property(750)
    public tapHoldThreshold: number;
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
    /* tslint:disable no-any */
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
        let handler: Function = (this.enableTapHold && Browser.isDevice && Browser.isTouch) ? this.mobileInitialize : this.initialize;
        if (isUnWire) {
            EventHandler.remove(ele || this.element, Browser.touchStartEvent, handler);
        } else {
            EventHandler.add(ele || this.element, Browser.touchStartEvent, handler, this);
        }
    }
    /* istanbul ignore next */
    private mobileInitialize(evt: MouseEvent & TouchEvent): void {
        let target: EventTarget = evt.currentTarget;
        this.tapHoldTimer = setTimeout(
            () => {
                this.externalInitialize = true;
                this.removeTapholdTimer();
                this.initialize(evt, target);
            },
            this.tapHoldThreshold);
        EventHandler.add(document, Browser.touchMoveEvent, this.removeTapholdTimer, this);
        EventHandler.add(document, Browser.touchEndEvent, this.removeTapholdTimer, this);
    }
    /* istanbul ignore next */
    private removeTapholdTimer(): void {
        clearTimeout(this.tapHoldTimer);
        EventHandler.remove(document, Browser.touchMoveEvent, this.removeTapholdTimer);
        EventHandler.remove(document, Browser.touchEndEvent, this.removeTapholdTimer);
    }
    /* istanbul ignore next */
    private getScrollableParent(element: HTMLElement, axis: string): HTMLElement {
        let scroll: Object = { 'vertical': 'scrollHeight', 'horizontal': 'scrollWidth' };
        let client: Object = { 'vertical': 'clientHeight', 'horizontal': 'clientWidth' };
        if (isNullOrUndefined(element)) {
            return null;
        }
        if (element[scroll[axis]] > element[client[axis]]) {
            if (axis === 'vertical' ? element.scrollTop > 0 : element.scrollLeft > 0) {
                if (axis === 'vertical') {
                    this.parentScrollY = this.parentScrollY +
                        (this.parentScrollY === 0 ? element.scrollTop : element.scrollTop - this.parentScrollY);
                } else {
                    this.parentScrollX = this.parentScrollX +
                        (this.parentScrollX === 0 ? element.scrollLeft : element.scrollLeft - this.parentScrollX);
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
        let isModalDialog: boolean = this.element.classList.contains('e-dialog') && this.element.classList.contains('e-dlg-modal');
        let verticalScrollParent: HTMLElement = this.getScrollableParent(this.element.parentNode as HTMLElement, 'vertical');
        let horizontalScrollParent: HTMLElement = this.getScrollableParent(this.element.parentNode as HTMLElement, 'horizontal');
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
            /* tslint:disable no-any */
            let abortSelectors: any = this.abort;
            if (typeof abortSelectors === 'string') {
                abortSelectors = [abortSelectors];
            }
            for (let i: number = 0; i < abortSelectors.length; i++) {
                if (!isNullOrUndefined(closest((evt.target as Element), abortSelectors[i]))) {
                    /* istanbul ignore next */
                    if (this.isDragStarted()) {
                        this.isDragStarted(true);
                    }
                    return;
                }
            }
        }
        if (this.preventDefault && !isUndefined(evt.changedTouches)) {
            evt.preventDefault();
        }
        this.element.setAttribute('aria-grabbed', 'true');
        let intCoord: Coordinates = this.getCoordinates(evt);
        this.initialPosition = { x: intCoord.pageX, y: intCoord.pageY };
        if (!this.clone) {
            let pos: PositionModel = this.element.getBoundingClientRect();
            this.getScrollableValues();
            if (evt.clientX === evt.pageX) { this.parentScrollX = 0; }
            if (evt.clientY === evt.pageY) { this.parentScrollY = 0; }
            this.relativeXPosition = intCoord.pageX - (pos.left + this.parentScrollX);
            this.relativeYPosition = intCoord.pageY - (pos.top + this.parentScrollY);
        }
        if (this.externalInitialize) {
            this.intDragStart(evt);
        } else {
            EventHandler.add(document, Browser.touchMoveEvent, this.intDragStart, this);
            EventHandler.add(document, Browser.touchEndEvent, this.intDestroy, this);
        }
        this.toggleEvents(true);
        document.body.classList.add('e-prevent-select');
        this.externalInitialize = false;
        EventHandler.trigger(document.documentElement, Browser.touchStartEvent, evt);
    }
    private intDragStart(evt: MouseEvent & TouchEvent): void {
        this.removeTapholdTimer();
        let isChangeTouch: boolean = !isUndefined(evt.changedTouches);
        if (isChangeTouch && (evt.changedTouches.length !== 1)) {
            return;
        }
        if (isChangeTouch) {
            evt.preventDefault();
        }
        let intCordinate: Coordinates = this.getCoordinates(evt);
        let pos: PositionModel;
        let styleProp: CSSStyleDeclaration = getComputedStyle(this.element);
        this.margin = {
            left: parseInt(styleProp.marginLeft, 10),
            top: parseInt(styleProp.marginTop, 10),
            right: parseInt(styleProp.marginRight, 10),
            bottom: parseInt(styleProp.marginBottom, 10),
        };
        let element: HTMLElement = this.element;
        if (this.clone && this.dragTarget) {
            let intClosest: HTMLElement = <HTMLElement>closest(evt.target as Element, this.dragTarget);
            if (!isNullOrUndefined(intClosest)) {
                element = intClosest;
            }
        }
        this.offset = this.calculateParentPosition(element);
        this.position = this.getMousePosition(evt, this.isDragScroll);
        let x: number = this.initialPosition.x - intCordinate.pageX;
        let y: number = this.initialPosition.y - intCordinate.pageY;
        let distance: number = Math.sqrt((x * x) + (y * y));
        if ((distance >= this.distance || this.externalInitialize)) {
            let ele: HTMLElement = this.getHelperElement(evt);
            if (!ele || isNullOrUndefined(ele)) {
                return;
            }
            let dragTargetElement: HTMLElement = this.helperElement = ele;
            this.parentClientRect = this.calculateParentPosition(dragTargetElement.offsetParent);
            if (this.dragStart) {
                let curTarget: Element = this.getProperTargetElement(evt);
                let args: { [key: string]: object } = {
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
            let posValue: DragPosition = this.getProcessedPositionValue({
                top: (pos.top - this.diffY) + 'px',
                left: (pos.left - this.diffX) + 'px'
            });
            this.dragElePosition = { top: pos.top, left: pos.left };
            setStyleAttribute(dragTargetElement, this.getDragPosition({ position: 'absolute', left: posValue.left, top: posValue.top }));
            EventHandler.remove(document, Browser.touchMoveEvent, this.intDragStart);
            EventHandler.remove(document, Browser.touchEndEvent, this.intDestroy);
            if (!isBlazor()) {
                this.bindDragEvents(dragTargetElement);
            }
        }
    }

    private bindDragEvents(dragTargetElement: HTMLElement): void {
        if (isVisible(dragTargetElement)) {
            EventHandler.add(document, Browser.touchMoveEvent, this.intDrag, this);
            EventHandler.add(document, Browser.touchEndEvent, this.intDragStop, this);
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
        let rect: ClientRect = ele.getBoundingClientRect();
        let style: CSSStyleDeclaration = getComputedStyle(ele);
        return {
            left: (rect.left + window.pageXOffset) - parseInt(style.marginLeft, 10),
            top: (rect.top + window.pageYOffset) - parseInt(style.marginTop, 10)
        };
    }
    // tslint:disable-next-line:max-func-body-length
    private intDrag(evt: MouseEvent & TouchEvent): void {
        if (!isUndefined(evt.changedTouches) && (evt.changedTouches.length !== 1)) {
            return;
        }
        let left: number;
        let top: number;
        this.position = this.getMousePosition(evt, this.isDragScroll);
        let docHeight: number = this.getDocumentWidthHeight('Height');
        if (docHeight < this.position.top) {
            this.position.top = docHeight;
        }
        let docWidth: number = this.getDocumentWidthHeight('Width');
        if (docWidth < this.position.left) {
            this.position.left = docWidth;
        }
        if (this.drag) {
            let curTarget: HTMLElement = this.getProperTargetElement(evt);
            this.trigger('drag', { event: evt, element: this.element, target: curTarget });
        }
        let eleObj: DropObject = this.checkTargetElement(evt);
        if (eleObj.target && eleObj.instance) {
            /* tslint:disable no-any */
            let flag: Boolean = true;
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
        let helperElement: HTMLElement = this.droppables[this.scope].helper;
        this.parentClientRect = this.calculateParentPosition(this.helperElement.offsetParent);
        let tLeft: number = this.parentClientRect.left;
        let tTop: number = this.parentClientRect.top;
        let intCoord: Coordinates = this.getCoordinates(evt);
        let pagex: number = intCoord.pageX;
        let pagey: number = intCoord.pageY;
        let dLeft: number = this.position.left - this.diffX;
        let dTop: number = this.position.top - this.diffY;
        if (this.dragArea) {
            let styles: CSSStyleDeclaration = getComputedStyle(helperElement);
            if (this.pageX !== pagex || this.skipDistanceCheck) {
                let helperWidth: number = helperElement.offsetWidth + (parseFloat(styles.marginLeft)
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
                let helperHeight: number = helperElement.offsetHeight + (parseFloat(styles.marginTop)
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
        let iTop: number = tTop + this.borderWidth.top;
        let iLeft: number = tLeft + this.borderWidth.left;
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
        if (this.dragArea) {
            draEleTop = (top - iTop) < 0 ? this.dragLimit.top : (top - iTop);
            draEleLeft = (left - iLeft) < 0 ? this.dragElePosition.left : (left - iLeft);
        } else {
            draEleTop = top - iTop;
            draEleLeft = left - iLeft;
        }

        let dragValue: DragPosition = this.getProcessedPositionValue({ top: draEleTop + 'px', left: draEleLeft + 'px' });
        setStyleAttribute(helperElement, this.getDragPosition(dragValue));
        if (!this.elementInViewport(helperElement) && this.enableAutoScroll) {
            this.helperElement.scrollIntoView();
        }
        this.dragProcessStarted = true;
        this.prevLeft = left;
        this.prevTop = top;
        this.position.left = left;
        this.position.top = top;
        this.pageX = pagex;
        this.pageY = pagey;
    }
    private triggerOutFunction(evt: MouseEvent & TouchEvent, eleObj: DropObject): void {
        this.hoverObject.instance.intOut(evt, eleObj.target);
        this.hoverObject.instance.dragData[this.scope] = null;
        this.hoverObject = null;
    }
    private getDragPosition(dragValue: DragPosition & { position?: string }): {
        [key: string]: Object;
    } {
        let temp: {
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
        let docBody: any = document.body;
        let docEle: any = document.documentElement;
        let returnValue: number = Math.max(
            docBody['scroll' + str], docEle['scroll' + str],
            docBody['offset' + str], docEle['offset' + str], docEle['client' + str]);
        return returnValue;
    }
    private intDragStop(evt: MouseEvent & TouchEvent): void {
        this.dragProcessStarted = false;
        if (!isUndefined(evt.changedTouches) && (evt.changedTouches.length !== 1)) {
            return;
        }
        let type: string[] = ['touchend', 'pointerup', 'mouseup'];
        if (type.indexOf(evt.type) !== -1) {
            if (this.dragStop) {
                let curTarget: Element = this.getProperTargetElement(evt);
                this.trigger('dragStop', { event: evt, element: this.element, target: curTarget, helper: this.helperElement });
            }
            this.intDestroy(evt);
        } else {
            this.element.setAttribute('aria-grabbed', 'false');
        }
        let eleObj: DropObject = this.checkTargetElement(evt);
        if (eleObj.target && eleObj.instance) {
            eleObj.instance.dragStopCalled = true;
            (<any>eleObj).instance.dragData[this.scope] = this.droppables[this.scope];
            eleObj.instance.intDrop(evt, eleObj.target);
        }
        this.setGlobalDroppables(true);
        document.body.classList.remove('e-prevent-select');
    }
    /**
     * @private
     */
    public intDestroy(evt: MouseEvent & TouchEvent): void {
        this.dragProcessStarted = false;
        this.toggleEvents();
        document.body.classList.remove('e-prevent-select');
        this.element.setAttribute('aria-grabbed', 'false');
        EventHandler.remove(document, Browser.touchMoveEvent, this.intDragStart);
        EventHandler.remove(document, Browser.touchEndEvent, this.intDragStop);
        EventHandler.remove(document, Browser.touchEndEvent, this.intDestroy);
        EventHandler.remove(document, Browser.touchMoveEvent, this.intDrag);
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
        let type: string = typeof this.dragArea;
        if (type === 'string') {
            ele = <HTMLElement>select(<string>this.dragArea);
        } else {
            ele = <HTMLElement>this.dragArea;
        }
        if (ele) {
            let elementArea: ClientRect = ele.getBoundingClientRect();
            eleWidthBound = ele.scrollWidth ? ele.scrollWidth : elementArea.right - elementArea.left;
            eleHeightBound = ele.scrollHeight ? ele.scrollHeight : elementArea.bottom - elementArea.top;
            let keys: string[] = ['Top', 'Left', 'Bottom', 'Right'];
            let styles: any = getComputedStyle(ele);
            for (let i: number = 0; i < keys.length; i++) {
                let key: string = keys[i];
                let tborder: string = styles['border' + key + 'Width'];
                let tpadding: string = styles['padding' + key];
                let lowerKey: string = key.toLowerCase();
                (<any>this.borderWidth)[lowerKey] = isNaN(parseFloat(tborder)) ? 0 : parseFloat(tborder);
                (<any>this.padding)[lowerKey] = isNaN(parseFloat(tpadding)) ? 0 : parseFloat(tpadding);
            }
            top = elementArea.top;
            left = elementArea.left;
            this.dragLimit.left = left + this.borderWidth.left + this.padding.left;
            this.dragLimit.top = ele.offsetTop + this.borderWidth.top + this.padding.top;
            this.dragLimit.right = left + eleWidthBound - (this.borderWidth.right + this.padding.right);
            this.dragLimit.bottom = top + eleHeightBound - (this.borderWidth.bottom + this.padding.bottom);
        }
    }
    private getProperTargetElement(evt: MouseEvent & TouchEvent): HTMLElement {
        let intCoord: Coordinates = this.getCoordinates(evt);
        let ele: HTMLElement;
        let prevStyle: string = this.helperElement.style.pointerEvents || '';
        if (compareElementParent(evt.target as Element, this.helperElement) || evt.type.indexOf('touch') !== -1) {
            this.helperElement.style.pointerEvents = 'none';
            ele = <HTMLElement>document.elementFromPoint(intCoord.clientX, intCoord.clientY);
            this.helperElement.style.pointerEvents = prevStyle;
        } else {
            ele = <HTMLElement>evt.target;
        }
        return ele;
    }
    private getMousePosition(evt: MouseEvent & TouchEvent, isdragscroll?: boolean): PositionModel {
        /* tslint:disable no-any */
        let dragEle: any = evt.srcElement !== undefined ? evt.srcElement : evt.target;
        let intCoord: Coordinates = this.getCoordinates(evt);
        let pageX: number;
        let pageY: number;
        let isOffsetParent: boolean = isNullOrUndefined(dragEle.offsetParent);
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
        let target: Element = this.getProperTargetElement(evt);
        let dropIns: DropOption = this.getDropInstance(target);
        if (!dropIns && target && !isNullOrUndefined(target.parentNode)) {
            let parent: Element = closest(target.parentNode, '.e-droppable') || target.parentElement;
            if (parent) {
                dropIns = this.getDropInstance(parent);
            }
        }
        return { target: (<HTMLElement>target), instance: dropIns };
    }
    private getDropInstance(ele: Element): DropOption {
        let name: string = 'getModuleName';
        let drop: Object;
        let eleInst: { [key: string]: Object }[] = ele && (<Instance>ele).ej2_instances;
        if (eleInst) {
            for (let inst of eleInst) {
                if ((<Function>inst[name])() === 'droppable') {
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
