/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEventArgs, Draggable } from '@syncfusion/ej2-base';
import { Predicate, Query } from '@syncfusion/ej2-data';
import { CurrentAction } from './type';

/**
 * Kanban Interface
 */

/**
 * Provides information about a ActionBegin, ActionComplete, ActionFailure event.
 *
 * @interface ActionEventArgs
 */
export interface ActionEventArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** Defines the cancel option for the action taking place. */
    cancel?: boolean;
    /** Returns the target HTML element. */
    target?: HTMLElement;
    /** Returns the appropriate added data based on the action. */
    addedRecords?: Record<string, any>[];
    /** Returns the appropriate changed data based on the action. */
    changedRecords?: Record<string, any>[];
    /** Returns the appropriate deleted data based on the action. */
    deletedRecords?: Record<string, any>[];
}

/**
 * Provides information about a Card Click/Double Click event.
 *
 * @interface CardClickEventArgs
 */
export interface CardClickEventArgs extends BaseEventArgs {
    /** Returns the object of the element which is currently being clicked or double clicked. */
    data: Record<string, any>;
    /** Defines the cancel option for the action taking place. */
    cancel?: boolean;
    /** Returns the actual HTML element on which the required custom styling can be applied. */
    element: Element;
    /** Defines the type of the event. */
    event?: Event | MouseEvent | KeyboardEvent;
}

/**
 * Provides information about a QueryCellInfo event.
 *
 * @interface QueryCellInfoEventArgs
 */
export interface QueryCellInfoEventArgs extends BaseEventArgs {
    /** Returns the object of the elements which is currently being rendered on the UI. */
    data?: HeaderArgs[];
    /** Returns the actual HTML element on which the required custom styling can be applied. */
    element: Element;
    /** Defines the cancel option for the action taking place. */
    cancel: boolean;
    /** Defines the request type of column rendering. */
    requestType: string;
}

/**
 * Provides information about a CardRendered event.
 *
 * @interface CardRenderedEventArgs
 */
export interface CardRenderedEventArgs extends BaseEventArgs {
    /** Returns the object of the elements which is currently being rendered on the UI. */
    data?: Record<string, any>;
    /** Returns the actual HTML element on which the required custom styling can be applied. */
    element: Element;
    /** Defines the cancel option for the action taking place. */
    cancel: boolean;
}

/**
 * Provides information about a Drag, Drag Start/End event.
 *
 * @interface DragEventArgs
 */
export interface DragEventArgs extends BaseEventArgs {
    /** Returns the drag element. */
    element: HTMLElement | HTMLElement[];
    /** Returns the dragged event data. */
    data: Record<string, any>[];
    /** Returns the mouse event. */
    event: MouseEvent;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Defines the dropped card position. */
    dropIndex?: number;
}

/**
 * Provides information about a DialogOpen event.
 *
 * @interface DialogEventArgs
 */
export interface DialogEventArgs extends BaseEventArgs {
    /** Returns the cell or event data. */
    data: Record<string, any>;
    /** Returns the target element on which the popup is getting opened. */
    target?: Element;
    /** Returns the popup wrapper element. */
    element?: Element;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Defines the dialog actions. */
    requestType?: CurrentAction;
}

/**
 * Provides information about a DialogClose event.
 *
 * @interface DialogCloseEventArgs
 */
export interface DialogCloseEventArgs extends DialogEventArgs {
    /** Defines the dialog interaction. */
    interaction?: string;
}

/** @private */
export interface SaveChanges {
    addedRecords: Record<string, any>[];
    changedRecords: Record<string, any>[];
    deletedRecords: Record<string, any>[];
}

/** @private */
export interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line camelcase
    ej2_instances: Record<string, any>[];
}

/** @private */
export interface DragArgs extends BaseEventArgs {
    element?: HTMLElement;
    cloneElement?: HTMLElement;
    targetClone?: HTMLElement;
    draggedClone?: HTMLElement;
    targetCloneMulti?: HTMLElement;
    selectedCards?: HTMLElement | HTMLElement[];
    instance?: Draggable;
    pageX?: number;
    pageY?: number;
    navigationInterval?: number;
    cardDetails?: Record<string, any>[];
    modifiedData?: Record<string, any>[];
}

/** Provide information about Swimlane HeaderArgs */ 
export interface HeaderArgs {
    /** Defines the Swimlane key field */
    keyField: string | number;
    /** Defines the Swimlane header text field */
    textField: string;
    /** Defines the number of Cards */
    count?: number;
}

/** @private */
export interface DragEdges {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

/** @private */
export interface ScrollPosition {
    content: ScrollOffset;
    column: { [key: string]: ScrollOffset };
}

/** @private */
export interface ScrollOffset {
    left?: number;
    top?: number;
}

/** Custom Sort Compare Function to sort Swimlane rows */
export interface SortComparerFunction {
    /** Defines the Swimlane Header Arguments */
    (param: HeaderArgs[]): HeaderArgs[];
}

/** Custom data service event types */
export interface DataStateChangeEventArgs {
    /** Defines the filter criteria  */
    where?: Predicate[];
    /** Defines the Kanban action details */
    action?: ActionEventArgs;
    /** Defines the remote table name */
    table?: string;
    /** Defines the selected field names */
    select?: string[];
}
export interface PendingState {
    /**
     * The function which resolves the current action's promise.
     */
    resolver?: Function;
    /**
     * Defines the current state of the action.
     */
    isPending?: boolean;
    /**
     *  DataSource changed through set model
     */
    isDataChanged?: boolean;
}
/**
 * Provides information about changed the data event.
 *
 * @interface DataSourceChangedEventArgs
 */
export interface DataSourceChangedEventArgs {
    /** Defines the current action type. */
    requestType?: string;
    /** Defines the state of the performed action */
    state?: DataStateChangeEventArgs;
    /** Returns the appropriate added data based on the action. */
    addedRecords?: Record<string, any>[];
    /** Returns the appropriate changed data based on the action. */
    changedRecords?: Record<string, any>[];
    /** Returns the appropriate deleted data based on the action. */
    deletedRecords?: Record<string, any>[];
    /** Defines the index value */
    index?: number;
    /** Defines the end of editing function. */
    endEdit?: Function;
    /** Defines the Cancel of editing process */
    cancelEdit?: Function;
    /** Defines the query */
    query?: Query;
    /** Defines the promise object. */
    promise?: Promise<object>
}