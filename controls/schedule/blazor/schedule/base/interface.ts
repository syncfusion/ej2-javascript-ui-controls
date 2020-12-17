import { BaseEventArgs } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';

/**
 * Interface
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Year' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' |
    'TimelineWorkWeek' | 'TimelineMonth' | 'TimelineYear';

export type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' |
    'ValidationAlert' | 'RecurrenceValidationAlert';

export type HeaderRowType = 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';

export type Orientation = 'Vertical' | 'Horizontal';

export interface CellClickEventArgs extends BaseEventArgs {
    startTime: Date;
    endTime: Date;
    isAllDay: boolean;
    element?: HTMLElement;
    cancel?: boolean;
    mouseEventArgs?: MouseArgs;
    groupIndex?: number;
}

export interface EventClickArgs extends BaseEventArgs {
    element: HTMLElement | HTMLElement[];
    guid: string[];
    cancel?: boolean;
}

export interface MouseArgs {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    detail: number;
    metaKey: boolean;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
    type: string;
}

export interface ResizeEventArgs extends BaseEventArgs {
    data?: { [key: string]: Object };
    cancel?: boolean;
    startTime?: Date;
    endTime?: Date;
    groupIndex?: number;
    interval?: number;
    scroll?: ScrollOptions;
}

export interface DragEventArgs extends BaseEventArgs {
    element?: HTMLElement;
    data?: { [key: string]: Object };
    event?: MouseEvent;
    cancel?: boolean;
    startTime?: Date;
    endTime?: Date;
    target?: HTMLElement;
    groupIndex?: number;
    excludeSelectors?: string;
    interval?: number;
    scroll?: ScrollOptions;
    navigation?: NavigateOptions;
}

export interface NavigateOptions {
    enable: boolean;
    timeDelay: number;
}

export interface ScrollOptions {
    enable: boolean;
    scrollBy: number;
    timeDelay: number;
}

export interface KeyEventArgs {
    element: HTMLTableElement;
    rowIndex: number;
    columnIndex: number;
    maxIndex: number;
}

export interface IRenderer {
    element: HTMLElement;
    renderDates: Date[];
    isInverseTableSelect: boolean;
    isCurrentDate(date: Date): boolean;
    scrollToHour?(hour: string, scrollDate?: Date): void;
    scrollToDate?(scrollDate?: Date): void;
    highlightCurrentTime?(): void;
    getStartHour(): Date;
    getEndHour(): Date;
    getEndDateFromStartDate(date: Date): Date;
    getRenderDates(workDays?: number[]): Date[];
    renderLayout(): void;
    destroy(): void;
    setColWidth(content: HTMLElement): void;
    resetColWidth(): void;
    onDataReady(args: NotifyEventArgs, count?: number, isScrollTop?: boolean): void;
    onScrollUiUpdate(args: NotifyEventArgs): void;
    getPanel(): HTMLElement;
}

export interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}

export interface ScrollCss {
    padding?: string;
    border?: string;
    rtlPadding?: string;
    rtlBorder?: string;
}

export interface NotifyEventArgs {
    module?: string;
    cssProperties?: ScrollCss;
    processedData?: Object[];
    isPreventScrollUpdate?: boolean;
    scrollPosition?: { [key: string]: Object };
}

export interface ElementData {
    index: number;
    left: string;
    width: string;
    day: number;
    dayIndex: number;
    record: { [key: string]: Object };
    resource: number;
}

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
}

export interface ResizeEdges {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

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
    event?: { [key: string]: Object };
    excludeSelectors?: string;
    scroll?: ScrollOptions;
    navigation?: NavigateOptions;
}
export interface WorkHoursModel {
    highlight?: boolean;
    start?: string;
    end?: string;
}
export interface GroupModel {
    byDate?: boolean;
    allowGroupEdit?: boolean;
    resources?: string[];
    enableCompactView?: boolean;
}
export interface TimeScaleModel {
    enable?: boolean;
    interval?: number;
    slotCount?: number;
}
export interface HeaderRowsModel {
    option?: HeaderRowType;
}
export interface ViewsModel {
    readonly?: boolean;
    startHour?: string;
    endHour?: string;
    allowVirtualScrolling?: boolean;
    showWeekend?: boolean;
    interval?: number;
    firstDayOfWeek?: number;
    workDays?: number[];
    orientation?: Orientation;
    timeScale?: TimeScaleModel;
    group?: GroupModel;
    headerRows?: HeaderRowsModel[];
}
export interface IScheduleOptions {
    height: string;
    enableRtl: boolean;
    showTimeIndicator: boolean;
    workHours: WorkHoursModel;
    selectedDate: Date;
    currentView: View;
    allowKeyboardInteraction: boolean;
    allowMultiCellSelection : boolean;
    allowMultiRowSelection: boolean;
    quickInfoOnSelectionEnd: boolean;
    eventDragArea: string;
    locale: string;
    rowAutoHeight : boolean;
    allowDragAndDrop: boolean;
    allowResizing: boolean;
    allowInline: boolean;
    minDate: Date;
    maxDate: Date;
    timeFormat : string;
    enableIndicator: boolean;
    enableMaxHeight: boolean;
    ignoreWhitespace: boolean;
    enablePersistence: boolean;
}

export interface BlazorScheduleElement extends HTMLElement {
    blazor__instance: SfSchedule;
}