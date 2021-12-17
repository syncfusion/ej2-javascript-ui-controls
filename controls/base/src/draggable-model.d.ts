import { Base } from './base';import { Browser } from './browser';import { isVisible } from './dom';import { Property, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';import { EventHandler } from './event-handler';import { ChildProperty } from './child-property';import { select, closest, setStyleAttribute, addClass, createElement } from './dom';import { extend, isUndefined, isNullOrUndefined, compareElementParent, isBlazor } from './util';
import {DragDirection} from "./draggable";

/**
 * Interface for a class Position
 */
export interface PositionModel {

    /**
     * Specifies the left position of cursor in draggable.
     */
    left?: number;

    /**
     * Specifies the left position of cursor in draggable.
     */
    top?: number;

}

/**
 * Interface for a class Draggable
 */
export interface DraggableModel {

    /**
     * Defines the distance between the cursor and the draggable element.
     */
    cursorAt?: PositionModel;

    /**
     * If `clone` set to true, drag operations are performed in duplicate element of the draggable element. 
     * @default true
     */
    clone?: boolean;

    /**
     * Defines the parent  element in which draggable element movement will be restricted.
     */
    dragArea?: HTMLElement | string;

    /**
     * Defines the dragArea is scrollable or not.
     */
    isDragScroll?: boolean;

    /**
     * Defines wheather need to replace drag element by currentstateTarget.
     * @private
     */
    isReplaceDragEle?: boolean;

    /**
     * Defines wheather need to add prevent select class to body or not.
     * @private
     */
    isPreventSelect?: boolean;

    /**
     * Specifies the callback function for drag event.

     * @event
     */
    drag?: Function;

    /**
     * Specifies the callback function for dragStart event.
     * @event
     */
    dragStart?: Function;

    /**
     * Specifies the callback function for dragStop event.
     * @event
     */
    dragStop?: Function;

    /**
     * Defines the minimum distance draggable element to be moved to trigger the drag operation.
     * @default 1
     */
    distance?: number;

    /**
     * Defines the child element selector which will act as drag handle.
     */
    handle?: string;

    /**
     * Defines the child element selector which will prevent dragging of element.
     */
    abort?: string | string[];

    /**
     * Defines the callback function for customizing the cloned  element.
     */
    helper?: Function;

    /**
     * Defines the scope value to group sets of draggable and droppable items. 
     * A draggable with the same scope value will be accepted by the droppable.
     */
    scope?: string;

    /**
     * Specifies the dragTarget by which the clone element is positioned if not given current context element will be considered.
     * @private
     */
    dragTarget?: string;

    /**
     * Defines the axis to limit the draggable element drag path.The possible axis path values are   
     * * `x` - Allows drag movement in horizontal direction only. 
     * * `y` - Allows drag movement in vertical direction only.
     */
    axis?: DragDirection;

    /**
     * Defines the function to change the position value.
     * @private
     */
    queryPositionInfo?: Function;

    /**
     * Defines whether the drag clone element will be split form the cursor pointer.
     * @private
     */
    enableTailMode?: boolean;

    /**
     * Defines whether to skip the previous drag movement comparison.
     * @private
     */
    skipDistanceCheck?: boolean;

    /**
     * @private
     */
    preventDefault?: boolean;

    /**
     * Defines whether to enable autoscroll on drag movement of draggable element.
     * enableAutoScroll
     * @private
     */
    enableAutoScroll?: boolean;

    /**
     * Defines whether to enable taphold  on mobile devices.
     * enableAutoScroll
     * @private
     */
    enableTapHold?: boolean;

    /**
     * Specifies the time delay for tap hold.
     * @default 750
     *  @private
     */
    tapHoldThreshold?: number;

    /**
     * @private
     */
    enableScrollHandler?: boolean;

}