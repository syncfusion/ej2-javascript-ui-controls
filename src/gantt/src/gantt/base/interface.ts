import { PdfTreeGridCell } from './../export/pdf-base/pdf-grid-table';
import { PdfBorders } from './../export/pdf-base/pdf-borders';
import { ColumnModel } from './../models/column';
import { PointF, PdfColor, PdfFontFamily, PdfFontStyle, PdfStringFormat, PdfTrueTypeFont, PdfStandardFont, PdfTextWebLink, PdfImage  } from '@syncfusion/ej2-pdf-export';
import {
    ContextMenuType, PdfPageSize, PageOrientation, ExportType, PdfTheme, TaskType, ContentType, PdfPageNumberType, PdfDashStyle,
    PdfHAlign, PdfVAlign
} from './enum';
import { ContextMenuOpenEventArgs as GridContextMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { ContextMenuClickEventArgs as GridContextMenuClickEventArgs } from '@syncfusion/ej2-grids';
import { RecordDoubleClickEventArgs as GridRecordDoubleClickEventArgs } from '@syncfusion/ej2-grids';
import { RowSelectingEventArgs as GridRowSelectingEventArgs } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs as GridCellSelectingEventArgs } from '@syncfusion/ej2-grids';
import { RowDeselectEventArgs as GridRowDeselectEventArgs } from '@syncfusion/ej2-grids';
import { RowSelectEventArgs as GridRowSelectEventArgs, RowDataBoundEventArgs as GridRowDataBoundEventArgs } from '@syncfusion/ej2-grids';
import { Column } from '../models/column';
import { TooltipEventArgs } from '@syncfusion/ej2-popups';
import { TimelineViewMode } from '../base/enum';
import { TimelineTierSettingsModel } from '../models/timeline-settings-model';
import { EventMarkerModel } from '../models/event-marker-model';
import { PdfPaddings } from '../export/pdf-base/index';
/**
 * Specifies Gantt-chart interfaces
 *
 */

export interface IGanttData {
    /** Defines the child records of task. */
    childRecords?: IGanttData[];
    /** Defines the expanded state of task. */
    expanded?: boolean;
    /** Defines the properties which used in internal calculations. */
    ganttProperties?: ITaskData;
    /** Defines gantt data has child records or not. */
    hasChildRecords?: boolean;
    /** Defines the index of task. */
    index?: number;
    /** Defines the level of task. */
    level?: number;
    /** Defines the direct parent item of task. */
    parentItem?: IParent;
    /** Defines the parent unique id of task. */
    parentUniqueID?: string;
    /** Defines the data which specified in data source.
     *
     * @isGenericType true
     */
    taskData?: Object;
    /** Defines the unique id of task. */
    uniqueID?: string;
    /** Defines the indicators value of task. */
    indicators?: IIndicator[];
    /** Defines the delete . */
    isDelete?: boolean;
    /** Defines the critical path of task. */
    isCritical?: boolean;
    /** Defines the slack value of critical path task. */
    slack?: string | number;
}

export interface IParent {
    /** Defines the unique id of task. */
    uniqueID?: string;
    /** Defines the expanded state of task. */
    expanded?: boolean;
    /** Defines the level of task. */
    level?: number;
    /** Defines the id of task. */
    taskId?: string;
    /** Defines the index of task. */
    index?: number;
}

export interface ITaskData {
    /** Defines the baselineleft of task. */
    baselineLeft?: number;
    /** Defines the baseline startdate of task. */
    baselineStartDate?: Date;
    /** Defines the baseline enddate of task. */
    baselineEndDate?: Date;
    /** Defines the baseline width of task. */
    baselineWidth?: number;
    /** Defines the end date of task. */
    endDate?: Date;
    /** Defines the css class of task. */
    cssClass?: string;
    /** Defines the duration of task. */
    duration?: number;
    /** Defines the duration unit of task. */
    durationUnit?: string;
    /** Defines the task is auto schedule-able or not. */
    isAutoSchedule?: boolean;
    /** Defines the task is milestone or not. */
    isMilestone?: boolean;
    /** Defines the left of task. */
    left?: number;
    /** Defines the critical path of task. */
    isCritical?: boolean;
    /** Defines the slack value of critical path task. */
    slack?: string | number;
    /** Defines the progress of task. */
    progress?: number;
    /** Defines the progress width of task. */
    progressWidth?: number;
    /** Defines the resource info of task. */
    resourceInfo?: Object[];
    /** Defines the resource names of task. */
    resourceNames?: string;
    /** Defines the start date of task. */
    startDate?: Date;
    /** Defines the notes of task. */
    notes?: string;
    /** Defines the predecessors name of task. */
    predecessorsName?: string | number | object[];
    /** Defines the predecessor of task. */
    predecessor?: IPredecessor[];
    /** Defines the id of task. */
    taskId?: string;
    /** Defines the parent id of task. */
    parentId?: string;
    /** Defines the name of task. */
    taskName?: string;
    /** Defines the width of task. */
    width?: number;
    /** Defines the indicators of task. */
    indicators?: IIndicator[];
    /** Defines the unique id of task. */
    uniqueID?: string;
    /** Defines the total progress of task. */
    totalProgress?: number;
    /** Defines the total duration of task. */
    totalDuration?: number;
    /** Defines the work of the task. */
    work?: number;
    /** Defines the work unit of task. */
    workUnit?: string;
    /** Defines task type */
    taskType?: TaskType;
    /** Defines the auto scheduled task's start date. */
    autoStartDate?: Date;
    /** Defines the auto scheduled task's end date. */
    autoEndDate?: Date;
    /** Defines the auto scheduled task's duration */
    autoDuration?: number;
    /** Defines the auto scheduled task's left. */
    autoLeft?: number;
    /** Defines the auto scheduled task's width. */
    autoWidth?: number;
    /** It have taskId for ProjectView and uniqueID for resourceView */
    rowUniqueID?: string;
    /** Defines work timeline ranges. */
    workTimelineRanges?: IWorkTimelineRanges[];
    /** Defines overlap index. */
    eOverlapIndex?: number;
    /** Defines whether overlapped with other taskbar or not. */
    eOverlapped?: boolean;
    /** Defines task segments. */
    segments?: ITaskSegment[];
    /**
     * Defines shared task unique ids.
     */
    sharedTaskUniqueIds?: string[];
}

export interface ITaskSegment {
    /** Defines start date of the segment */
    startDate?: Date;
    /** Defines end date of the segment */
    endDate?: Date;
    /** Defines the duration of the segment. */
    duration?: number;
    /** Defines the width of a segment. */
    width?: number;
    /** Defines the progress width of a segment. */
    progressWidth?: number;
    /** Defines the left position of a segment. */
    left?: number;
    /** Defines the segment index */
    segmentIndex?: number;
    /** Defines the duration between 2 segments */
    offsetDuration?: number;
    /** Set for displaying progress in split taskbar */
    showProgress?: boolean;
}
export interface IWorkTimelineRanges {
    /** Defines start date of task */
    startDate?: Date;
    /** Defines end date of task */
    endDate?: Date;
    /** Defines left value of resource usage/resource histogram. */
    left?: number;
    /** Defines width of the resource usage/resource histogram. */
    width?: number;
    /** Defines height of the resource usage/resource histogram. */
    height?: number;
    /** Defines per day work. */
    workPerDay?: number;
    /** Defines whether resource is over allocate or not. */
    isOverAllocated?: boolean;
    /** Defines the task. */
    task?: IGanttData;

    /** Defines start date of task */
    from?: Date;
    /** Defines start date of task */
    to?: Date;
}

export interface IGanttColumn {
    /** Defines column name */
    field?: string;
    /** Defines header text of column */
    headerText?: string;
    /** Defines edit type of column */
    editType?: string;
    /** Defines mapping name of column */
    mappingName?: string;
    /** Defines whether editing is enabled or not */
    allowEditing: boolean;
    /** Defines width of column */
    width: number;
    /** Defines format of column */
    format: string;
    /** Defines whether column is visible or not */
    visible: boolean;
}

export interface IIndicator {
    /** Defines the date of indicator. */
    date?: Date | string;
    /** Defines the icon class of indicator. */
    iconClass?: string;
    /** Defines the pdf image of indicator. */
    base64?: string;
    /** Defines the name of indicator. */
    name?: string;
    /** Defines the tooltip of indicator. */
    tooltip?: string;
}

export interface IWorkingTimeRange {
    /** Defines the from date. */
    from?: number;
    /** Defines the to date. */
    to?: number;
    /** Defines whether it is working day or not. */
    isWorking?: boolean;
    /** Defines the color to render. */
    color?: string;
    /** Defines the interval between from and to dates. */
    interval?: number;
}

export interface IQueryTaskbarInfoEventArgs {
    /** Defines the data. */
    data: IGanttData;
    /** Defines the row element. */
    rowElement: Element;
    /** Defines the taskbar element. */
    taskbarElement: Element;
    /** Defines the taskbar background color. */
    taskbarBgColor?: string;
    /** Defines the taskbar border color. */
    taskbarBorderColor?: string;
    /** Defines the progressbar background color. */
    progressBarBgColor?: string;
    /** Defines the milestone color. */
    //progressBarBorderColor?: string;
    milestoneColor?: string;
    /** Defines the right label color. */
    rightLabelColor?: string;
    /** Defines the left label color. */
    leftLabelColor?: string;
    /** Defines the task label color. */
    taskLabelColor?: string;
    /** Defines the baseline color. */
    baselineColor?: string;
    /** Defines the taskbar type. */
    taskbarType: string;
}

export interface IGanttCellFormatter {
    /** Method to format the cell value of date columns. */
    getValue(column: Column, data: Object): Object;
}

export interface ITaskbarEditedEventArgs {
    /** Defines the editingFields. */
    editingFields?: ITaskData;
    /** Defines the data. */
    data?: IGanttData;
    /** Defines the index of edited task. */
    recordIndex?: number;
    /** Defines the previous value of editing task. */
    previousData?: ITaskData;
    /** Defines the type of taskbar edit action. */
    taskBarEditAction?: string;
    /** Defines the duration roundoff. */
    roundOffDuration?: boolean;
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
    /** Defines the action. */
    action?: string;
    /** Defines the target element. */
    target?: Element;
    /** Defines the segment index. */
    segmentIndex?: number;
}
export interface IKeyPressedEventArgs {
    /** Defines the request type. */
    requestType?: string;
    /** Defines the key action. */
    action?: string;
    /** Defines the event. */
    keyEvent?: Event;
}

export interface ITaskDeletedEventArgs {
    /** Defines the deleted records */
    deletedRecordCollection?: IGanttData[];
    /** Defines the updated records */
    updatedRecordCollection?: IGanttData[];
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
    /** Defines the event action. */
    action?: string;
}

export interface IDependencyEditData {
    id?: string;
    text?: string;
    value?: string;
}

export interface IPredecessor {
    /** Defines the from value of predecessor. */
    from?: string;
    /** Defines the to value of predecessor. */
    to?: string;
    /** Defines the type of predecessor. */
    type?: string;
    /** Defines the offset value of predecessor. */
    offset?: number;
    /** Defines the offset unit of predecessor. */
    offsetUnit?: string;
    /** Defines the predecessor is drawn-able or not. */
    isDrawn?: boolean;
}

export interface IValidateArgs {
    /** Defines the gantt data. */
    data?: IGanttData;
    /** Defines the record index. */
    recordIndex?: number;
    /** Defines the request type */
    requestType?: string;
    /** Defines whether to cancel the action or not */
    cancel?: boolean;
    /** Defines the validation mode. */
    validateMode?: IValidateMode;
    /** Defines the edited arguments. */
    editEventArgs?: object;
}

export interface ITimeSpanEventArgs {
    /** Defines the project start date. */
    projectStartDate?: Date;
    /** Defines the project end date. */
    ProjectEndDate?: Date;
    /** Defines the timeline roundoff state. */
    isTimelineRoundOff?: boolean;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
    /** Defines the action. */
    action?: string;
}

export interface IValidateMode {
    respectLink?: boolean;
    removeLink?: boolean;
    preserveLinkWithEditing?: boolean;
}
export interface IActionBeginEventArgs {
    /** Defines the action type. */
    requestType?: string;
    /** Defines the gantt record. */
    data?: IGanttData | IGanttData[];
    /** Defines the modified records. */
    modifiedRecords?: IGanttData[];
    /** Defines the modified task data. */
    modifiedTaskData?: object[] | object;
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
    /** Defines the taskbar edit action. */
    taskBarEditAction?: string;
    /** Defines the event action. */
    action?: string;
    /** Defines the target element. */
    target?: Element;
}

export interface IValidateLinkedTaskArgs {
    editMode?: string;
    data?: IGanttData;
    requestType?: string;
    validateMode?: IValidateMode;
    cancel?: boolean;
}

export interface IConnectorLineObject {
    parentLeft?: number;
    childLeft?: number;
    parentWidth?: number;
    childWidth?: number;
    parentIndex?: number;
    childIndex?: number;
    rowHeight?: number;
    type?: string;
    connectorLineId?: string;
    milestoneParent?: boolean;
    milestoneChild?: boolean;
    parentIndexInCurrentView?: number;
    childIndexInCurrentView?: number;
    isCritical?: boolean;
    parentEndPoint?: number;
    childEndPoint?: number;
}

export interface ISplitterResizedEventArgs {
    /** Defines the element. */
    element?: HTMLElement;
    /** Defines the event. */
    event?: Event;
    /** Defines the size of resized pane. */
    paneSize?: number[];
    /** Defines the pane. */
    pane?: HTMLElement[];
    /** Defines the index of resizing pane. */
    index?: number[];
    /** Defines the separator. */
    separator?: HTMLElement;
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
}

export interface PredecessorTooltip {
    /** Defines the from id of predecessor. */
    fromId?: string;
    /** Defines the to id of predecessor. */
    toId?: string;
    /** Defines the from name of predecessor. */
    fromName?: string;
    /** Defines the to name of predecessor. */
    toName?: string;
    /** Defines the link type of predecessor. */
    linkType?: string;
    /** Defines the link text of predecessor. */
    linkText?: string;
    /** Defines the offset value of predecessor. */
    offset?: number;
    /** Defines the offset unit of predecessor. */
    offsetUnit?: string;
    /** Defines the offset string value of predecessor. */
    offsetString?: string;
}

export interface BeforeTooltipRenderEventArgs {
    /** Defines the data. */
    data?: BeforeTooltipRenderEventArgsData;
    /** Defines the original event arguments of tooltip control. */
    args?: TooltipEventArgs;
    /** Defines the content. */
    content?: string | Element | Function;
    /** Cancel the tooltip */
    cancel?: boolean;
}

export interface QueryCellInfoEventArgs {
    /** Defines the row data associated with this cell. */
    data?: IGanttData;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the column object associated with this cell. */
    column?: Column;
    /** Defines the no. of columns to be spanned */
    colSpan?: number;
    /** Defines the no. of rows to be spanned */
    rowSpan?: number;
    /** Defines the current action. */
    requestType?: string;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
}

/**
 * Extending IGanttData and PredecessorTooltip interfaces for data used in BeforeTooltipRenderEventArgs interface.
 */
export interface BeforeTooltipRenderEventArgsData extends IGanttData, PredecessorTooltip {

}

export interface IDependencyEventArgs {
    /** Specifies the predecessor task of dependency. */
    fromItem?: IGanttData;
    /** Specifies the successor task of dependency. */
    toItem?: IGanttData;
    /** Defines the new predecessor string. */
    newPredecessorString?: string;
    /** Defines the dependency link is valid or not */
    isValidLink?: boolean;
    /** Defines the request type. */
    requestType?: string;
    /** Defines predecessor object */
    predecessor?: IPredecessor;
}

export interface ITaskAddedEventArgs {
    /** Specifies the newly added task data with Gantt properties. */
    data?: IGanttData[] | IGanttData;
    /** Specifies the newly added task data without custom Gantt properties. */
    newTaskData?: object[] | object;
    /** Defines the modified records. */
    modifiedRecords?: IGanttData[];
    /** Defines the modified task data. */
    modifiedTaskData?: object[] | object;
    /** Defines the record index. */
    recordIndex?: number | number[];
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
    /** Defines the action. */
    action?: string;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the row position. */
    rowPosition?: string;
}
export interface ICollapsingEventArgs {
    /** Defines the TreeGrid row element */
    gridRow: Node;
    /** Defines the Gantt chart row element */
    chartRow: Node;
    /** Defines the name of the action. */
    name?: string;
    /** Defines the parent row data. */
    data?: IGanttData;
    /** Cancel the row expanding action */
    cancel?: boolean;

}
export interface ContextMenuOpenEventArgs extends GridContextMenuOpenEventArgs {
    /** Defines the TreeGrid row element */
    gridRow?: Element;
    /** Defines the chart row element */
    chartRow?: Element;
    /** Defines the selected row record */
    rowData?: IGanttData;
    /** Defines the context menu type */
    type?: ContextMenuType;
    /** Defines the hidden items collection */
    hideItems?: string[];
    /** Defines the sub menu hidden items collection */
    hideChildItems?: string[];
    /** Defines the disabled items collection */
    disableItems?: string[];
    /** Defines the target element. */
    target?: Element;
    top?: number;
    left?: number;
}

export interface ContextMenuClickEventArgs extends GridContextMenuClickEventArgs {
    /** Defines the selected row record */
    rowData?: IGanttData;
    /** Defines the context menu type */
    type?: ContextMenuType;
}

export type ITimelineFormatter = (date?: Date, format?: string, tier?: string, mode?: string) => string;

export interface ZoomEventArgs {
    /** Defines the request type. */
    requestType?: string;
    /** Defines the zoom action. */
    action?: string;
    /** Defines Zoom timeline settings.  */
    timeline?: ZoomTimelineSettings;
    /** Defines the cancel option value. */
    cancel?: boolean;
}

export interface ZoomTimelineSettings {
    /** Defines the timeline view mode. */
    timelineViewMode?: TimelineViewMode;
    /** Defines top tier values. */
    topTier?: TimelineTierSettingsModel;
    /** Defines bottom tier values. */
    bottomTier?: TimelineTierSettingsModel;
    /** Defines timeline unit size. */
    timelineUnitSize?: number;
    /** Defines the week start day. */
    weekStartDay?: number;
    /** Defines weekend background color. */
    weekendBackground?: string;
    /** Defines showTooltip whether the tooltip will rendered or not. */
    showTooltip?: boolean;
    /** Defines perDay width. */
    perDayWidth?: number;
    /** Defines zooming level. */
    level?: number;
    /** Defines the updateTimescaleView. */
    updateTimescaleView?: boolean;
}
/** @private */
export interface MousePoint {
    pageX?: number;
    pageY?: number;
}

/** @private */
export interface ITemplateData {
    expanded?: boolean;
    hasChildRecords?: boolean;
    index?: number;
    level?: number;
    baselineLeft?: number;
    baselineWidth?: number;
    taskStartDate?: Date;
    taskEndDate?: Date;
    taskDuration?: number;
    taskDurationUnit?: string;
    taskPredecessorsName?: string;
    taskResourceNames?: string;
    isAutoSchedule?: boolean;
    isMilestone?: boolean;
    left?: number;
    progressWidth?: number;
    width?: number;
}

export interface RowSelectingEventArgs extends GridRowSelectingEventArgs {
    /** Defines the data collections. */
    data: IGanttData;
}

export interface RowSelectEventArgs extends GridRowSelectEventArgs {
    /** Defines the data collections. */
    data: IGanttData;
}

export interface RowDataBoundEventArgs extends GridRowDataBoundEventArgs {
    /** Defines the data collections. */
    data: IGanttData;
    /** Defines the row element. */
    row?: Element;
}

export interface RowDeselectEventArgs extends GridRowDeselectEventArgs {
    /** Defines the selected/deselected row index. */
    rowIndex?: number;
    /** Defines the data collections. */
    data?: IGanttData[];
    /** Defines the selected/deselected row. */
    row?: Element;
}

export interface IEventMarkerInfo{
    id?: number;
    left?: number;
    label?: string;
    date?: Date;
}
export interface ActionCompleteArgs extends ZoomEventArgs, IKeyPressedEventArgs {
    element?: HTMLElement;
    requestType?: string;
    data?: IGanttData[];
    modifiedRecords?: IGanttData[];
    modifiedTaskData?: IGanttData[];
    cancel?: boolean;
    /** Specifies the newly added task data without custom Gantt properties.
     *
     * @isGenericType true
     */
    newTaskData?: object;
    /** Defines the record index. */
    recordIndex?: number;
    /** Defines the action. */
    action?: string;
    /** Defines the type of event. */
    type?: string;
}

export interface ActionBeginArgs extends IDependencyEventArgs {
    rowData?: IGanttData;
    name?: string;
    requestType?: string;
    cancel?: boolean;
    data?:  IGanttData[];
    modifiedRecords?: IGanttData[];
    /**
     * @isGenericType true
     */
    modifiedTaskData?: object[];
    /** Specifies the newly added task data without custom Gantt properties.
     *
     * @isGenericType true
     */
    newTaskData?: object;
    /** Defines the split date on context click action */
    splitDate?: Date;
    /** Defines the array of merge items indexes on context click action */
    mergeSegmentIndexes?: {firstSegmentIndex: number, secondSegmentIndex: number}[];
    /** Defines the record index. */
    recordIndex?: number;
    /** Defines the action. */
    action?: string;
    /** Defines the type of event. */
    type?: string;
    /** Defines the target element. */
    target?: Element;
}

export interface CellEditArgs  {
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the current row. */
    row?: Element;
    /** Defines the validation rules. */
    validationRules?: Object;
    /** Defines the name of the event. */
    type?: string;
    /** Defines foreign data object */
    foreignKeyData?: Object;
    /** Defines the row data object. */
    rowData?: IGanttData;
    /** Defines the column name. */
    columnName?: string;
    /** Defines the cell object. */
    cell?: Element;
    /** Defines the column object. */
    columnObject?: Column;
    /** Defines the cell value. */
    value?: string;
    /** Defines isForeignKey option value. */
    isForeignKey?: boolean;
    /** Defines the primaryKey. */
    primaryKey?: string[];
}

export interface CellSelectingEventArgs extends GridCellSelectingEventArgs {
    /** Defines the previously selected cell index */
    previousRowCellIndex?: number;
}

export interface ScrollArgs {
    /** Defines the action. */
    action?: string;
    /** Defines the action type. */
    requestType?: string;
    /** Defines the scroll direction. */
    scrollDirection?: string;
    /** Defines the scroll left value. */
    scrollLeft?: number;
    /** Defines the scroll top value. */
    scrollTop?: number;
    /** Defines the previous scroll top value. */
    previousScrollTop?: number;
    /** Defines the previous scroll left value. */
    previousScrollLeft?: number;
}

export interface ITaskbarClickEventArgs {
    /** Defines the taskbar element. */
    taskbarElement?: Element;
    /** Defines the data of record. */
    data?: IGanttData;
    /** Defines the row index of record. */
    rowIndex?: number;
    /** Defines the target element. */
    target?: Element;
}

export interface RecordDoubleClickEventArgs extends GridRecordDoubleClickEventArgs {
    /** Defines the row element. */
    row?: Element;
    /** Defines the data of record. */
    rowData?: IGanttData;
    /** Defines the row index of record. */
    rowIndex?: number;
    /** Defines the target element. */
    target?: Element;
}

export interface RowDropEventArgs {
    /** Defines the selected row's element. */
    rows?: Element[];
    /** Defines the target element from which drag starts. */
    target?: Element;
    /** Defines the type of the element to be dragged.
     *
     * @hidden
     */
    draggableType?: string;
    /** Defines the selected row data.
     *
     * @isGenericType true
     */
    data?: Object[];
    /** Defines the drag element from index. */
    fromIndex?: number;
    /** Defines the target element from index. */
    dropIndex?: number;
    /** Define the mouse event */
    originalEvent?: object;
    cancel?: boolean;
    /** Defines drop position of the dragged record */
    dropPosition?: string;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the modified records. */
    modifiedRecords?: IGanttData[];
    /** Defines the modified records. */
    dropRecord?: IGanttData;
}

export interface IMouseMoveEventArgs {
    /** Defines the row data. */
    data?: IGanttData;
    /** Defines the column. */
    column?: Object;
    /** Defines the timeline date. */
    date?: Date;
    /** Defines the original event. */
    originalEvent?: Object;
    /** Defines the predecessor. */
    predecessor?: PredecessorTooltip;
    /** Defines the indicator. */
    indicator?: IIndicator;
    /** Defines the event markers. */
    eventMarkers?: EventMarkerModel;
}

export interface PdfExportProperties {
    /** Defines the Pdf orientation. */
    pageOrientation?: PageOrientation;
    /** Defines the Pdf page size. */
    pageSize?: PdfPageSize;
    /** Enable the footer. */
    enableFooter?: boolean;
    /** Enable the header. */
    enableHeader?: boolean;
    /** Indicates whether to show the hidden columns in exported Pdf */
    includeHiddenColumn?: boolean;
    /** Defines the theme for exported Gantt  */
    theme?: PdfTheme;
    /** Defines the style for exported Gantt  */
    ganttStyle?: IGanttStyle;
    /** Defines the file name for the exported file  */
    fileName?: string;
    /** Indicates to export current data or all data */
    exportType?: ExportType;
    /** Indicates whether to show the predecessors in exported Pdf */
    showPredecessorLines?: boolean;
    /** Defines the export options in rendering each row fit to the PDF page width */
    fitToWidthSettings?: FitToWidthSettings;
    /** Defines the Pdf header. */
    header?: PdfHeader;
    /** Defines the Pdf footer. */
    footer?: PdfFooter;
}
export interface PdfQueryCellInfoEventArgs {
    /** Defines the column of the current cell. */
    column?: ColumnModel;
    /** Defines the style of the current cell. */
    style?: PdfGanttCellStyle;
    /** Defines the value of the current cell. */
    value?: Date | string | number | boolean | PdfTextWebLink  | PdfImage;
    /** Defines the data of the cell */
    data?: Object;
    /** Defines the current PDF cell */
    cell?: PdfTreeGridCell;
    /** Defines the image details */
    image?: Image;
    /** Defines the hyperlink of the cell */
    hyperLink?: Hyperlink;
}
export interface Image {
    /**  Defines the base 64 string for image */
    base64: string;
    /**  Defines the height for the image */
    height?: number;
    /**  Defines the height for the image */
    width?: number;

}
export interface Hyperlink {
    /** Defines the Url for hyperlink */
    target?: string;
    /** Defines the display text for hyperlink */
    displayText?: string;
}
export interface TimelineDetails {
    startPoint?: number;
    endPoint?: number;
    startDate?: Date;
    endDate?: Date;
    dayStartDate?: Date;
    totalWidth?: number;
    startIndex?: number;
    endIndex?: number;
    pageStartPoint?: PointF;
}
export interface PageDetail {
    startPoint?: PointF;
    width?: number;
    height?: number;
    pageStartX?: number;
}
export interface TimelineFormat {
    width?: number;
    height?: number;
    value?: string;
    isWeekend?: boolean;
    style?: PdfGanttCellStyle;
    isFinished?: boolean;
    completedWidth?: number;
    startDate?: Date;
    endDate?: Date;
}

export interface PdfGanttFontStyle {
    /** Defines the font size */
    fontSize?: number;
    /** Defines the font style */
    fontStyle?: PdfFontStyle;
    /** Defines the font color */
    fontColor?: PdfColor;
    /** Defines the background color of the cell */
    backgroundColor?: PdfColor;
    /** Defines the border color of the cell */
    borderColor?: PdfColor;
    /** Defines the format of the cell value */
    format?: PdfStringFormat;
    /** Defines the fontFamily*/
    fontFamily?: PdfFontFamily;
    /** Defines the fontBrush*/
    fontBrush?: PdfColor;
}

export interface PdfGanttCellStyle extends PdfGanttFontStyle {
    /** Defines the cell borders */
    borders?: PdfBorders;
    /** Defines the cell padding */
    padding?: PdfPaddings;
}

export interface ITaskbarStyle {
    /** Defines the parent taskbar background color */
    parentTaskColor?: PdfColor;
    /** Defines the parent progressbar background color */
    parentProgressColor?: PdfColor;
    /** Defines the parent taskbar border color */
    parentTaskBorderColor?: PdfColor;
    /** Defines the child taskbar background color */
    taskColor?: PdfColor;
    /** Defines the child progressbar background color */
    progressColor?: PdfColor;
    /** Defines the child taskbar border color */
    taskBorderColor?: PdfColor;
    /** Defines the milestone background color */
    milestoneColor?: PdfColor;
    /** Defines the progress text color */
    progressFontColor?: PdfColor;
    /** Defines the critical task color */
    criticalTaskColor?: PdfColor;
    /** Defines the critical child progressbar background color */
    criticalProgressColor?: PdfColor;
    /** Defines the child taskbar border color */
    criticalTaskBorderColor?: PdfColor;
    /** Defines the baseline  color */
    baselineColor?: PdfColor;
    /** Defines the baseline border color */
    baselineBorderColor?: PdfColor;
    /** Defines the split line background color */
    splitLineBackground?: PdfColor;
    /** Defines the unscheduled taskbar background color */
    unscheduledTaskBarColor?: PdfColor;
    /** Defines the manualParent Background color */
    manualParentBackground?: PdfColor;
    /** Defines the manualParent Progress color */
    manualParentProgress?: PdfColor;
    /** Defines the manualChild Background color */
    manualChildBackground?: PdfColor;
    /** Defines the manualChild Progress color */
    manualChildProgress?: PdfColor;
    /** Defines the manual line color */
    manualLineColor?: PdfColor;
    /** Defines the manualParent Background color */
    manualParentBorder?: PdfColor;
    /** Defines the manualChild Background color */
    manualChildBorder?: PdfColor;
}

export interface FitToWidthSettings{
    /** Specifies whether to export gantt data where each row is adjusted and rendered to fit the PDF document page size. */
    isFitToWidth?: boolean;
    /** Specifies the grid width in percentage while exporting. */
    gridWidth?: string;
    /** Specifies the chart width in percentage while exporting. */
    chartWidth?: string;
}

export interface IGanttStyle {
    /** Defines the columnHeader style. */
    columnHeader?: PdfGanttCellStyle;
    /** Defines the font family. */
    fontFamily?: PdfFontFamily;
    /** Defines the cell style. */
    cell?: PdfGanttCellStyle;
    /** Defines the taskbar style. */
    taskbar?: ITaskbarStyle;
    /** Defines the font style. */
    label?: PdfGanttCellStyle;
    /** Defines the timeline style. */
    timeline?: PdfGanttCellStyle;
    /** Defines the chart line color. */
    chartGridLineColor?: PdfColor;
    /** Defines the connector line color. */
    connectorLineColor?: PdfColor;
    /** Defines the critical connector line color. */
    criticalConnectorLineColor?: PdfColor;
    /** Defines the footer format. */
    footer?: PdfGanttCellStyle;
    /** Defines the font of the theme. */
    font?: PdfTrueTypeFont;
}

export interface PdfQueryTimelineCellInfoEventArgs {
    /** Defines the timeline cell */
    timelineCell?: PdfGanttCellStyle;
    /** Specify the value of the timeline cell */
    value?: string;
}


export interface PdfQueryTaskbarInfoEventArgs {
    /** Defines the Taskbar style */
    taskbar?: ITaskbarStyle;
    /** Specify the value of the task data */
    data?: IGanttData;
    /** Defines the Indicator */
    indicators?: IIndicator[];
    /**
     *  Defines the customized string content or image for the left, right and task label
     * */
    labelSettings?: ILabel;
    /**
     * Defines the taskbar element appearance customizations and provides options to add image and string in taskbar
     * */
    taskbarTemplate?: ITemplateDetails;
}

export interface ILabel {
    /**
     * Defines the customized string content or image for the leftLabel
     * */
    leftLabel?: ITemplateDetails;
    /**
     * Defines the customized string content or image for the rightLabel
     *  */
    rightLabel?: ITemplateDetails;
    /**
     * Defines the customized string content or image for the task label
     *  */
    taskLabel?: ITemplateDetails;
    /**
     * Specifies the label of left.
     *
     * @private
     */
    left?: number;
    /**
     * Specifies the isLeftCalculated or not.
     *
     * @private
     */
    isLeftCalculated?: boolean;
}

export interface ITemplateDetails {
    /** Defines the value of template content. */
    value?: string;
    /** Defines the image of a template content. */
    image?: Image[];
    /** Defines the appearance customization details of the template content */
    fontStyle?: PdfGanttFontStyle;
}


export interface PdfColumnHeaderQueryCellInfoEventArgs {
    /** Defines the PDF grid current cell. */
    cell?: PdfTreeGridCell;
    /** Defines the style of the current cell. */
    style?: PdfGanttCellStyle;
    /** Defines the current cell with column */
    column?: ColumnModel;
    /** Specify the value of the column header cell */
    value?: string | Object;
    /** Specify the image of the column header cell */
    image?: PdfImage;
    /** Defines the customized string content or image for the header cell */
    headerTemplate?: ITemplateDetails;
}

/** @private */
export interface TaskLabel {
    value?: string;
    left?: number;
    isCompleted?: boolean;
    isLeftCalculated?: boolean;
}

/**
 * public Enum for `PdfHorizontalOverflowType`.
 *
 * @private
 */
export enum PdfHorizontalOverflowType {
    /**
     * Specifies the type of `NextPage`.
     *
     * @private
     */
    NextPage,
    /**
     * Specifies the type of `LastPage`.
     *
     * @private
     */
    LastPage
}
export interface PdfHeader {
    /** Defines the header content distance from top. */
    fromTop?: number;
    /** Defines the height of header content. */
    height?: number;
    /** Defines the header contents. */
    contents?: PdfHeaderFooterContent[];
}

export interface PdfFooter {
    /** Defines the footer content distance from bottom. */
    fromBottom?: number;
    /** Defines the height of footer content. */
    height?: number;
    /** Defines the footer contents */
    contents?: PdfHeaderFooterContent[];
}

export interface PdfHeaderFooterContent {
    /** Defines the content type */
    type: ContentType;
    /** Defines the page number type */
    pageNumberType?: PdfPageNumberType;
    /** Defines the style of content */
    style?: PdfContentStyle;
    /** Defines the pdf points for drawing line */
    points?: PdfPoints;
    /** Defines the format for customizing page number */
    format?: string;
    /** Defines the position of the content */
    position?: PdfPosition;
    /** Defines the size of content */
    size?: PdfSize;
    /** Defines the base64 string for image content type */
    src?: string;
    /** Defines the value for content */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    /** Defines the font for the content */
    font?: PdfStandardFont | PdfTrueTypeFont;
    /** Defines the alignment of header */
    stringFormat?: PdfStringFormat;
}
export interface PdfContentStyle {
    /** Defines the pen color. */
    penColor?: string;
    /** Defines the pen size. */
    penSize?: number;
    /** Defines the dash style. */
    dashStyle?: PdfDashStyle;
    /** Defines the text brush color. */
    textBrushColor?: string;
    /** Defines the text pen color. */
    textPenColor?: string;
    /** Defines the font size. */
    fontSize?: number;
    /** Defines the horizontal alignment. */
    hAlign?: PdfHAlign;
    /** Defines the vertical alignment. */
    vAlign?: PdfVAlign;
}
export interface PdfPoints {
    /** Defines the x1 position */
    x1: number;
    /** Defines the y1 position */
    y1: number;
    /** Defines the x2 position */
    x2: number;
    /** Defines the y2 position */
    y2: number;
}
export interface PdfPosition {
    /** Defines the x position */
    x: number;
    /** Defines the y position */
    y: number;
}
export interface PdfSize {
    /** Defines the height */
    height: number;
    /** Defines the width */
    width: number;
}
