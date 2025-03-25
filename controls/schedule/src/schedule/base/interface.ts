/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEventArgs } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { PopupType, ExcelFormat, View, NavigationDirection } from './type';
import { ResourcesModel, ViewsModel } from '../models/models';
import { Worksheets } from '@syncfusion/ej2-excel-export';

/**
 * Interface
 */

/** An interface that holds options to control the actions of scheduler such as editing, navigation, and more. */
export interface ActionEventArgs extends ToolbarActionArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** Defines the type of the event. */
    event?: Event;
    /** Defines the cancel option for the action taking place. */
    cancel?: boolean;
    /** Returns the appropriate data based on the action. */
    data?: Record<string, any> | Record<string, any>[];
    /** Returns the clicked resource row index. */
    groupIndex?: number;
    /** Returns the appropriate added data based on the action. */
    addedRecords?: Record<string, any>[];
    /** Returns the appropriate changed data based on the action. */
    changedRecords?: Record<string, any>[];
    /** Returns the appropriate deleted data based on the action. */
    deletedRecords?: Record<string, any>[];
    /**
     * A Promise that, when provided, checks for overlapping events on the server.
     * If the promise resolves with overlapping events, the action (add/update) will be
     * canceled, and an alert will be displayed to the user.
     * If no overlapping events are found, the scheduler proceeds with the action.
     */
    promise?: Promise<boolean>;
}

/** @deprecated */
export interface ToolbarActionArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** Returns the toolbar items present in the Schedule header bar. */
    items?: ItemModel[];
}

/** An interface that holds options to control the cell click action. */
export interface CellClickEventArgs extends BaseEventArgs {
    /** Returns the start time of the cell. */
    startTime: Date;
    /** Returns the end time of the cell. */
    endTime: Date;
    /** Returns true or false, based on whether the clicked cell is all-day or not. */
    isAllDay: boolean;
    /** Returns the single or collection of HTML element(s). */
    element?: HTMLElement | HTMLElement[];
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Defines the type of the event. */
    event?: Event;
    /** Returns the group index of the cell. */
    groupIndex?: number;
}

/** An interface that holds options to control the actions on clicking the more event indicator. */
export interface MoreEventsClickArgs extends BaseEventArgs {
    /** Returns the start time of the cell. */
    startTime: Date;
    /** Returns the end time of the cell. */
    endTime: Date;
    /** Returns the single or collection of HTML element(s). */
    element: Element;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Defines the type of the event. */
    event: Event;
    /** Returns the group index of the cell. */
    groupIndex?: number;
    /** Defines the option to show/hide the popup. */
    isPopupOpen: boolean;
    /** Defines the option to navigate the particular view */
    viewName: View;
}

/** An interface that holds options to control the select action. */
export interface SelectEventArgs extends BaseEventArgs {
    /** Returns the request type of the current action. */
    requestType: string;
    /** Defines the type of the event. */
    event?: Event;
    /** Returns the single or collection of HTML element(s). */
    element: HTMLElement | HTMLElement[];
    /** Determines whether to open the quick popup on multiple cell selection. */
    showQuickPopup?: boolean;
    /** Determines whether to select multiple row. */
    allowMultipleRow?: boolean;
    /** Return the appropriate cell or event data based on the action. */
    data?: Record<string, any> | Record<string, any>[];
    /** Returns the clicked resource row index. */
    groupIndex?: number;
}

/** An interface that holds options to control the event click action. */
export interface EventClickArgs extends BaseEventArgs {
    /** Returns the date of the event. */
    date?: Date;
    /** Returns a single or collection of selected or clicked events. */
    event: Record<string, any> | Record<string, any>[];
    /** Returns the single or collection of HTML element(s). */
    element: HTMLElement | HTMLElement[];
    /** Defines the cancel option. */
    cancel?: boolean;
}

/** An interface that holds options to control the hover action. */
export interface HoverEventArgs extends BaseEventArgs {
    /** Returns the mouse event. */
    event: MouseEvent;
    /** Returns the single or collection of HTML element(s). */
    element: HTMLElement;
}

/** An interface that holds options to control the events (appointments) rendering in Scheduler. */
export interface EventRenderedArgs extends BaseEventArgs {
    /** Returns the event data. */
    data: Record<string, any>;
    /** Returns the event element which is currently being rendered on the UI. */
    element: HTMLElement;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Returns the type of the event element which is currently being rendered on the Scheduler. */
    type?: string;
}

/** An interface that holds options to control the popup open action. */
export interface PopupOpenEventArgs extends BaseEventArgs {
    /**
     * Returns the type of the popup which is currently being opted to open.
     * The available type values are as follows,
     * * `DeleteAlert`: Denotes the popup showing delete confirmation message.
     * * `EditEventInfo`: Denotes the quick popup on the events in responsive mode.
     * * `Editor`: Denotes the detailed editor window.
     * * `EventContainer`: Denotes the more indicator popup.
     * * `OverlapAlert`: Denotes the popup showing overlap events.
     * * `QuickInfo`: Denotes the quick popup.
     * * `RecurrenceAlert`: Denotes the popup showing recurrence alerts.
     * * `RecurrenceValidationAlert`: Denotes the popup showing recurrence validation alerts.
     * * `ValidationAlert`: Denotes the popup showing validation alerts.
     * * `ViewEventInfo`: Denotes the quick popup on the cells in responsive mode.
     */
    type: PopupType;
    /** Returns the cell or event data. */
    data?: Record<string, any>;
    /** Returns the target element on which the popup is getting opened. */
    target?: Element;
    /** Returns the popup wrapper element. */
    element: Element;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Allows to specify the time duration to be used on editor window,
     *  based on which the start and end time fields will display the time values. By default, it
     *  will be processed based on the `interval` value within the `timeScale` property.
     */
    duration?: number;
    /**
     * Returns the collection of appointment data that overlaps with the active time range in the Scheduler.
     * The `overlapEvents` array includes only the appointments that conflict with the time range of the appointment being created or updated.
     */
    overlapEvents?: Record<string, any>[];
}

/** An interface that holds options to control the popup close action. */
export interface PopupCloseEventArgs extends BaseEventArgs {
    /** Return the current interaction event. */
    event?: Event;
    /**
     * Returns the type of the popup which is currently being opted to open.
     * The available type values are as follows,
     * * `DeleteAlert`: Denotes the popup showing delete confirmation message.
     * * `EditEventInfo`: Denotes the quick popup on the events in responsive mode.
     * * `Editor`: Denotes the detailed editor window.
     * * `EventContainer`: Denotes the more indicator popup.
     * * `QuickInfo`: Denotes the quick popup.
     * * `RecurrenceAlert`: Denotes the popup showing recurrence alerts.
     * * `RecurrenceValidationAlert`: Denotes the popup showing recurrence validation alerts.
     * * `ValidationAlert`: Denotes the popup showing validation alerts.
     * * `ViewEventInfo`: Denotes the quick popup on the cells in responsive mode.
     */
    type: PopupType;
    /** Returns the cell or event data. */
    data?: Record<string, any>;
    /** Returns the target element on which the popup is getting opened. */
    target?: Element;
    /** Returns the popup wrapper element. */
    element: Element;
    /** Defines the cancel option. */
    cancel: boolean;
}

/**  An interface that holds options to control the date and view navigations. */
export interface NavigatingEventArgs extends BaseEventArgs {
    /** Returns the action type either as `date` or `view` due to which the navigation takes place. */
    action: string;
    /** Defines the cancel option. */
    cancel: boolean;
    /** Returns the date value before date navigation takes place. */
    previousDate?: Date;
    /** Returns the current date value after navigation takes place. */
    currentDate?: Date;
    /** Returns the view name before the view navigation takes place. */
    previousView?: string;
    /** Returns the active view name after the view navigation takes place. */
    currentView?: string;
    /** Returns the active view index after the view navigation takes place. */
    viewIndex?: number;
}

/** An interface that holds options to control the rendering of all cells (work, time, resource, header, and more). */
export interface RenderCellEventArgs extends BaseEventArgs {
    /** Returns the type of the elements which is currently being rendered on the UI. */
    elementType: string;
    /** Returns the actual HTML element on which the required custom styling can be applied. */
    element: Element;
    /** Returns the date value of the cell that is currently rendering on UI. */
    date?: Date;
    /** Returns the group index of the cell. */
    groupIndex?: number;
}

/** An interface that holds options to control resize action on appointments. */
export interface ResizeEventArgs extends BaseEventArgs {
    /** Returns the resize element. */
    element: HTMLElement;
    /** Returns the resize event data. */
    data: Record<string, any>;
    /** Returns the mouse event. */
    event: MouseEvent;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Returns the start time of the clone element. */
    startTime?: Date;
    /** Returns the end time of the clone element. */
    endTime?: Date;
    /** Returns the group index of the clone element. */
    groupIndex?: number;
    /** Allows to define the interval in minutes for resizing the appointments. */
    interval?: number;
    /** Allows to define the scroll related actions while resizing to the edges of scheduler. */
    scroll?: ScrollOptions;
}

/** An interface that holds options to control drag action on appointments. */
export interface DragEventArgs extends BaseEventArgs {
    /** Returns the drag element. */
    element: HTMLElement;
    /** Returns the dragged event data. */
    data: Record<string, any>;
    /** Returns the multiple dragged events data */
    selectedData: Record<string, any>[];
    /** Returns the mouse event. */
    event: MouseEvent;
    /** Defines the cancel option. */
    cancel?: boolean;
    /** Returns the start time of the clone element. */
    startTime?: Date;
    /** Returns the end time of the clone element. */
    endTime?: Date;
    /** Returns the target element on which the event is dropped. */
    target?: HTMLElement;
    /** Returns the group index of the clone element. */
    groupIndex?: number;
    /** Defines the selectors to cancel the drop on selector target. */
    excludeSelectors?: string;
    /** Allows to define the interval in minutes for dragging the appointments. */
    interval?: number;
    /** Allows to define the scroll related actions while dragging to the edges of scheduler. */
    scroll?: ScrollOptions;
    /** Defines the date range navigation action while dragging. */
    navigation?: NavigateOptions;
    /** Allows to drag the events outside the currently rendered date range */
    dragWithinRange?: boolean;
}

/** An interface that holds options of virtual scroll action. */
export interface ScrollEventArgs extends BaseEventArgs {
    /** Returns the group index of last resource which is currently being rendered. */
    endIndex: number;
    /** Returns the end date from the active view of scheduler. */
    endDate: Date;
    /** Returns the group index of first resource which is currently being rendered. */
    startIndex: number;
    /** Returns the start date from the active view of scheduler. */
    startDate: Date;
    /** Returns the resource data collection which is currently rendered. */
    resourceData: Record<string, any>[];
    /** Allows to define the event data collection that needs to be rendered on every virtual scroll action only when enableLazyLoading property is enabled. */
    eventData?: Record<string, any>[];
}

/** An interface that holds options to control the navigation, while performing drag action on appointments. */
export interface NavigateOptions {
    /** Allows to enable or disable the auto navigation while performing drag action on appointments. */
    enable: boolean;
    /** Allows to define the time delay value while navigating. */
    timeDelay: number;
}

/** An interface that holds options to control the scrolling action while performing drag and resizing action on appointments. */
export interface ScrollOptions {
    /** Allows to enable or disable the auto scrolling while performing drag and resizing action on appointments. */
    enable: boolean;
    /** Allows to define the scroll step value. */
    scrollBy: number;
    /** Allows to define the time delay value while scrolling. */
    timeDelay: number;
}

/** An interface that holds the properties for the before Excel expoprt event. */
export interface ExcelExportEventArgs {
    /** Specifies the Worksheets that will be exported. */
    worksheets: Worksheets;
    /** Specifies whether to cancel the export operation. */
    cancel: boolean;
}

/** An interface that holds options for the before print event. */
export interface BeforePrintEventArgs {
    /**
     * The HTML element that will be printed.
     * This element can be modified to customize the print output.
     */
    printElement?: HTMLElement
    /**
     * Indicates whether to cancel the print operation.
     * Set to `true` to prevent the schedule from being printed.
     */
    cancel?: boolean;
}

/** An interface that holds export options. */
export interface ExportOptions {
    /** The fileName denotes the name to be given for the exported file. */
    fileName?: string;
    /** The exportType allows you to set the format of an Excel file to be exported either as .xlsx or .csv. */
    exportType?: ExcelFormat;
    /** The custom or specific field collection of event dataSource to be exported can be provided through fields option. */
    fields?: string[];
    /** Specifies the collection of field name and its header text to export to excel. If this list is empty, the scheduler exports based on fields. If both fieldsInfo and fields are empty then the scheduler exported all the fields. */
    fieldsInfo?: ExportFieldInfo[];
    /** The custom data collection can be exported by passing them through the customData option. */
    customData?: Record<string, any>[];
    /** There also exists option to export each individual instances of the recurring events to an Excel file,
     * by setting true or false to the `includeOccurrences` option, denoting either to include or exclude
     * the occurrences as separate instances on an exported Excel file.
     */
    includeOccurrences?: boolean;
    /**
     * Defines the delimiter for csv file export.
     * By default, csv files are using comma(,) as separator. You can specify this property to change the delimiter in csv file.
     */
    separator?: string;
}

/** An interface that holds the options for the tooltip event in the Schedule component. */
export interface TooltipOpenEventArgs {
    /**
     * Determines whether the tooltip should be canceled or not.
     */
    cancel?: boolean;
    /**
     * The data associated with the tooltip.
     */
    data?: Record<string, any>;
    /**
     * The target element that triggered the tooltip.
     */
    target?: HTMLElement;
    /**
     * The content to be displayed in the tooltip. Can be an HTMLElement.
     */
    content?: HTMLElement;
}

/** An interface that holds the field name and its header text to export to excel. */
export interface ExportFieldInfo {
    /** Defines the header display text. */
    text: string;
    /** Defines the field name to export. */
    name: string;
}

/** An interface that holds the details of a resource. */
export interface ResourceDetails {
    /** Returns the resource model data such as the field mapping options used within it. */
    resource: ResourcesModel;
    /** Returns the child resource data. */
    resourceData: Record<string, any>;
    /** Returns the respective resource fields data. */
    groupData?: Record<string, any>;
    /** It returns the child level resources in compact mode. */
    resourceChild?: ResourceDetails[];
    /** It returns the Id of current resource in compact mode. */
    resourceId?: string;
    /** It returns the Name of current resource in compact mode. */
    resourceName?: string;
}

/** An interface that represents time zone and display text for scheduler.  */
export interface TimezoneFields {
    /** Assigns the timezone display text. */
    Text: string;
    /** Assigns the [`IANA`](https://docs.actian.com/ingres/11.0/index.html#page/Ing_Install/IANA_World_Regions_and_Time_Zone_Names.htm) timezone value. */
    Value: string;
}

/** An interface that holds options of events once it bound to scheduler. */
export interface DataBoundEventArgs extends BaseEventArgs {
    result: Record<string, any>[];
    count?: number;
    aggregates?: Record<string, any>;
}

/** An interface that holds options of events before it binds to scheduler. */
export interface DataBindingEventArgs extends BaseEventArgs {
    result: Record<string, any>[];
    count?: number;
    aggregates?: Record<string, any>;
}

/** An interface that holds the custom sort comparer function. */
export interface SortComparerFunction {
    (param: Record<string, any>[]): Record<string, any>[];
}

/** @private */
export interface InlineClickArgs extends BaseEventArgs {
    data?: Record<string, any>;
    element: HTMLElement;
    groupIndex?: number;
    type: string;
}

/** @private */
export interface TdData {
    date?: Date;
    renderDates?: Date[];
    groupOrder?: string[];
    groupIndex?: number;
    className?: string[];
    colSpan?: number;
    rowSpan?: number;
    type: string;
    resourceLevelIndex?: number;
    resource?: ResourcesModel;
    resourceData?: Record<string, any>;
    startHour?: Date;
    endHour?: Date;
    workDays?: number[];
    cssClass?: string;
    template?: NodeList | Element[];
}

/** @private */
export interface TimeSlotData extends TdData {
    first: boolean;
    middle: boolean;
    last: boolean;
}

/** @private */
export interface KeyEventArgs {
    element: HTMLTableElement;
    rowIndex: number;
    columnIndex: number;
    maxIndex: number;
}

/** @private */
export interface CellTemplateArgs {
    date: Date;
    type: string;
    day?: string;
    groupIndex?: number;
}

/** @private */
export interface DateRangeTemplateArgs {
    startDate: Date;
    endDate: Date;
    currentView: View;
}

/** @private */
export interface CrudArgs extends ActionEventArgs {
    promise?: Promise<any>;
    editParams?: SaveChanges;
}

/** An interface that holds the options of pasted events data */

export interface BeforePasteEventArgs {

    /** Returns the event data which is currently being pasted on the Scheduler. */

    data?: Record<string, any>[] | string;

    /** Defines the cancel option. */

    cancel: boolean;

    /** Returns the target element on which the cell is getting pasted. */

    target?: Element;

}

/** @private */
export interface IRenderer {
    element: HTMLElement;
    renderDates: Date[];
    viewClass: string;
    isInverseTableSelect: boolean;
    isCurrentDate(date: Date): boolean;
    startDate(): Date;
    endDate(): Date;
    getStartDate?(): Date;
    getEndDate?(): Date;
    scrollToHour?(hour: string, scrollDate?: Date): void;
    scrollToDate?(scrollDate?: Date): void;
    highlightCurrentTime?(): void;
    getStartHour(): Date;
    getEndHour(): Date;
    getLabelText(view: string): string;
    getDateRangeText(date?: Date, dateCollection?: Date[]): string;
    getEndDateFromStartDate(date: Date): Date;
    addEventListener(): void;
    removeEventListener(): void;
    getRenderDates(workDays?: number[], selectedDate?: Date): Date[];
    getContentRows(): Element[];
    getEventRows(trCount: number): Element[];
    getDateSlots(renderDates: Date[], workDays: number[]): TdData[];
    getNextPreviousDate(type: NavigationDirection): Date;
    refreshHeader(): void;
    refreshResourceHeader(): void;
    renderLayout(type: string): void;
    renderResourceMobileLayout(): void;
    setPanel(panel: HTMLElement): void;
    getPanel(): HTMLElement;
    generateColumnLevels(): TdData[][];
    getColumnLevels(): TdData[][];
    createTableLayout(className?: string): Element;
    setResourceHeaderContent(tdElement: Element, tdData: TdData, className: string): void;
    destroy(): void;
    isTimelineView(): boolean;
    setColWidth(content: HTMLElement): void;
    resetColWidth(): void;
    getAdjustedDate?(date: Date): Date;
    viewIndex: number;
    colLevels: TdData[][];
    getGroupIndices(dataCollection?: TdData[]): number[];
}

/** @private */
export interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line camelcase
    ej2_instances: Record<string, any>[];
}

/** @private */
export interface ScrollCss {
    padding?: string;
    border?: string;
    rtlPadding?: string;
    rtlBorder?: string;
}

/** @private */
export interface NotifyEventArgs {
    module?: string;
    cssProperties?: ScrollCss;
    processedData?: Record<string, any>[];
    isPreventScrollUpdate?: boolean;
    scrollPosition?: Record<string, any>;
}

/** @private */
export interface LayoutData {
    element: HTMLElement;
    selectedDate: Date;
    renderDates: Date[];
    colLevels: TdData[][];
}

/** @private */
export interface EventFieldsMapping {
    id?: string;
    isBlock?: string;
    subject?: string;
    startTime?: string;
    endTime?: string;
    startTimezone?: string;
    endTimezone?: string;
    location?: string;
    description?: string;
    isAllDay?: string;
    recurrenceID?: string;
    recurrenceRule?: string;
    recurrenceException?: string;
    isReadonly?: string;
    followingID?: string;
}

/** @private */
export interface ElementData {
    index: number;
    left: string;
    width: string;
    day: number;
    dayIndex: number;
    record: Record<string, any>;
    resource: number;
}

/** @private */
export interface SaveChanges {
    addedRecords: Record<string, any>[];
    changedRecords: Record<string, any>[];
    deletedRecords: Record<string, any>[];
}

/** @private */
export interface UIStateArgs {
    expand?: boolean;
    isInitial?: boolean;
    left?: number;
    top?: number;
    isGroupAdaptive?: boolean;
    isIgnoreOccurrence?: boolean;
    groupIndex?: number;
    action?: boolean;
    isBlock?: boolean;
    isCustomMonth?: boolean;
    isPreventTimezone?: boolean;
    isPreventEventRefresh?: boolean;
    scheduleHeight?: number;
    isTapHold?: boolean;
    isTouchScroll?: boolean;
    isTransformed?: boolean;
    isSwipeScroll?: boolean;
}

/**
 *  @private
 *  @deprecated
 */
export interface TreeViewArgs {
    resourceChild?: TreeViewArgs[];
    resourceId?: string;
    resourceName?: string;
}

/** @private */
export interface ResizeEdges {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

/** @private */
export interface ActionBaseArgs {
    X?: number;
    Y?: number;
    pageX?: number;
    pageY?: number;
    target?: EventTarget;
    scrollInterval?: number;
    start?: Date;
    end?: Date;
    isAllDay?: boolean;
    action?: string;
    navigationInterval?: number;
    index?: number;
    height?: number;
    width?: number;
    interval?: number;
    cellWidth?: number;
    cellHeight?: number;
    groupIndex?: number;
    actionIndex?: number;
    slotInterval?: number;
    clone?: HTMLElement;
    element?: HTMLElement;
    cloneElement?: HTMLElement[];
    originalElement?: HTMLElement[];
    event?: Record<string, any>;
    excludeSelectors?: string;
    scroll?: ScrollOptions;
    navigation?: NavigateOptions;
}

/** @private */
export interface StateArgs {
    isRefresh: boolean;
    isResource: boolean;
    isView: boolean;
    isDate: boolean;
    isLayout: boolean;
    isDataManager: boolean;
}

/** @private */
export interface ViewsData extends ViewsModel {
    cellHeaderTemplateName?: string;
    dateHeaderTemplateName?: string;
    cellTemplateName?: string;
    resourceHeaderTemplateName?: string;
    headerIndentTemplateName?: string;
    eventTemplateName?: string;
    dayHeaderTemplateName?: string;
    monthHeaderTemplateName?: string;
    dateRangeTemplateName?: string;
}

/** @private */
export interface CrudAction {
    isCrudAction: boolean;
    sourceEvent: TdData[];
    targetEvent: TdData[];
}

/** @private */
export interface CallbackFunction extends Function {
    // eslint-disable-next-line max-len
    bind<T, A0, A1, A2, A3, A extends any[], R>(this: (this: T, args0: A0, args1: A1, args2: A2, args3: A3, ...args: A[]) => R, thisArgs: T, args0: A0, args1: A1, args2: A2, args3: A3): (...args: A[]) => R;
}


