import { PdfTreeGridCell } from './../export/pdf-base/pdf-grid-table';
import { PdfBorders } from './../export/pdf-base/pdf-borders';
import { ColumnModel } from './../models/column';
import { PointF, PdfColor, PdfFontFamily, PdfFontStyle, PdfStringFormat, PdfTrueTypeFont, PdfStandardFont, PdfTextWebLink, PdfImage, PdfPen  } from '@syncfusion/ej2-pdf-export';
import {
    ContextMenuType, PdfPageSize, PageOrientation, ExportType, PdfTheme, TaskType, ContentType, PdfPageNumberType, PdfDashStyle,
    PdfHAlign, PdfVAlign, ConstraintType, ViolationType
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
import { CalendarContext } from './calendar-context';
/**
 * Specifies Gantt-chart interfaces
 *
 */

export interface IGanttData {
    /** Represents the child records of the task, which include its subtasks or hierarchical breakdown within the Gantt chart structure. */
    childRecords?: IGanttData[];
    /** Indicates whether the task is expanded in the Gantt chart view. */
    expanded?: boolean;
    /** Contains internal properties used for Gantt chart calculations and rendering. */
    ganttProperties?: ITaskData;
    /** Indicates whether the task has child records (subtasks) within its hierarchy. */
    hasChildRecords?: boolean;
    /** Specifies the index position of the task in the data collection. */
    index?: number;
    /** Specifies the hierarchical level of the task within the Gantt chart structure (e.g., 0 for root tasks, 1 for subtasks). */
    level?: number;
    /** Represents the direct parent item of the task. */
    parentItem?: IParent;
    /** Specifies the unique identifier of the parent task, used to maintain hierarchy. */
    parentUniqueID?: string;
    /** Represents the original data provided in the data source.
     *
     * @isGenericType true
     */
    taskData?: Object;
    /** Specifies the unique identifier of the task. */
    uniqueID?: string;
    /** Represents the indicator values associated with the task (e.g., milestones, custom markers). */
    indicators?: IIndicator[];
    /** Indicates whether the task is marked for deletion. */
    isDelete?: boolean;
    /** Indicates whether the task lies on the critical path. */
    isCritical?: boolean;
    /** Specifies the slack value for a critical path task, representing the amount of time the task can be delayed without affecting the overall project completion date. */
    slack?: string | number;
}


export interface IGanttTaskInfo {
    /** Specifies the baseline width of the task. */
    baselineWidth?: number;
    /** Specifies the baseline left position of the task. */
    baselineLeft?: number;
    /** Specifies whether the task is on the critical path. */
    isCritical?: boolean;
    /** Specifies the slack value for a critical path task. */
    slack?: string | number;
    /** Specifies the width of the task's progress bar. */
    progressWidth?: number;
    /** Specifies the left position of an auto-scheduled task. */
    autoTaskLeft?: number;
    /** Specifies the width of an auto-scheduled task. */
    autoTaskWidth?: number;
    /** Specifies the left position of a manually scheduled task. */
    manualTaskLeft?: number;
    /** Specifies the width of a manually scheduled task. */
    manualTaskWidth?: number;
    /** Specifies the segments of the task. */
    segments?: ITaskSegment[];
    /**
     * Specifies the Work Breakdown Structure (WBS) code for the task.
     * The WBS code represents the hierarchical position of the task in the project structure.
     * Automatically generated if `enableWBS` is true and no custom value is provided.
     */
    wbsCode?: string;
    /** Specifies the WBS predecessor code for the task, which identifies the preceding task in the Work Breakdown Structure. This helps define task dependencies and maintain proper sequencing in project planning. */
    wbsPredecessor?: string;
    /** Specifies whether the task is auto-schedulable. */
    isAutoSchedule?: boolean;
    /** Specifies the left position of an auto-scheduled taskbar within a manually scheduled parent task. */
    manualTaskAutoLeft?: number;
    /** Specifies the width of an auto-scheduled taskbar within a manually scheduled parent task. */
    manualTaskAutoWidth?: number;
    /** Specifies the start date of an auto-scheduled taskbar within a manually scheduled parent task. */
    manualTaskAutoStartDate?: Date;
    /** Specifies the end date of an auto-scheduled taskbar within a manually scheduled parent task. */
    manualTaskAutoEndDate?: Date;
}
export interface IParent {
    /** Represents the unique identifier of the parent task. */
    uniqueID?: string;
    /** Indicates whether the parent task is expanded in the Gantt chart view. */
    expanded?: boolean;
    /** Specifies the hierarchical level of the parent task within the Gantt chart structure. */
    level?: number;
    /** Represents the task ID of the parent task. */
    taskId?: string;
    /** Specifies the index position of the parent task in the data collection. */
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
    /** Defines the duration of the baseline. */
    baselineDuration?: number;
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
    /** Defines the slack value for a critical path task, representing the amount of time the task can be delayed without impacting the overall project schedule. */
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
    /** Defines task segments, which represent portions of a task split into smaller, manageable intervals for better scheduling and tracking. */
    segments?: ITaskSegment[];
    /**
     * Defines shared task unique ids.
     */
    sharedTaskUniqueIds?: string[];
    /** Defines the WBS (Work Breakdown Structure) code for each task, providing a unique identifier that organizes tasks hierarchically for better project visibility and management. */
    wbsCode?: string;
    /** Defines the WBS predecessor code for each task, indicating its preceding task in the hierarchy to establish dependencies and maintain proper sequencing in project planning. */
    wbsPredecessor?: string;
    /** Defines the constraint date of the task. */
    constraintDate?: Date;
    /** Defines the constraint type of the task. */
    constraintType?: ConstraintType;
    /** Provides the calendar context used for task scheduling, including working hours, holidays, and overrides. */
    calendarContext?: CalendarContext
    /** Identifies the calendar configuration to be used for this task, linking it to a specific calendar definition (e.g., project-level or resource-specific calendar). */
    calendarId?: string
}


export interface ITaskSegment {
    /** Specifies the start date of the segment. */
    startDate?: Date;
    /** Specifies the end date of the segment. */
    endDate?: Date;
    /** Represents the duration of the segment in days or hours. */
    duration?: number;
    /** Defines the visual width of the segment in the Gantt chart. */
    width?: number;
    /** Defines the width representing progress within the segment. */
    progressWidth?: number;
    /** Specifies the left position of the segment in the Gantt chart timeline. */
    left?: number;
    /** Indicates the index of the segment within the task. */
    segmentIndex?: number;
    /** Represents the gap or offset duration between two segments. */
    offsetDuration?: number;
    /** Indicates whether progress should be displayed in the split taskbar. */
    showProgress?: boolean;
}

export interface IWorkTimelineRanges {
    /** Specifies the start date of the task. */
    startDate?: Date;
    /** Specifies the end date of the task. */
    endDate?: Date;
    /** Represents the left position value of the resource usage or resource histogram in the Gantt chart. */
    left?: number;
    /** Defines the width of the resource usage or resource histogram. */
    width?: number;
    /** Defines the height of the resource usage or resource histogram. */
    height?: number;
    /** Indicates the amount of work allocated per day for the resource. */
    workPerDay?: number;
    /** Indicates whether the resource is over-allocated. */
    isOverAllocated?: boolean;
    /** References the associated task details in the Gantt chart. */
    task?: IGanttData;
    /** Specifies the range start date for resource usage. */
    from?: Date;
    /** Specifies the range end date for resource usage. */
    to?: Date;
}

export interface IGanttColumn {
    /** Defines the field name associated with the column. */
    field?: string;
    /** Defines the header text displayed for the column. */
    headerText?: string;
    /** Defines the edit type for the column (e.g., string, number, date). */
    editType?: string;
    /** Defines the mapping name used for data binding in the column. */
    mappingName?: string;
    /** Indicates whether editing is enabled for the column. */
    allowEditing: boolean;
    /** Defines the width of the column in pixels. */
    width: number;
    /** Defines the display format for the column content. */
    format: string;
    /** Indicates whether the column is visible in the Gantt chart. */
    visible: boolean;
}

export interface IIndicator {
    /** Specifies the date associated with the indicator. */
    date?: Date | string;
    /** Defines the CSS class for the indicator icon. */
    iconClass?: string;
    /** Contains the Base64-encoded image used for the indicator in PDF export. */
    base64?: string;
    /** Represents the name or label of the indicator. */
    name?: string;
    /** Specifies the tooltip text displayed for the indicator. */
    tooltip?: string;
}

export interface IWorkingTimeRange {
    /** Specifies the start time of the working range. */
    from?: number;
    /** Specifies the end time of the working range. */
    to?: number;
    /** Indicates whether the specified range is a working period. */
    isWorking?: boolean;
    /** Defines the color used to render the working range in the Gantt chart. */
    color?: string;
    /** Represents the interval duration between the start and end times. */
    interval?: number;
}

export interface IQueryTaskbarInfoEventArgs {
    /** Represents the Gantt task data associated with the taskbar. */
    data: IGanttData;
    /** References the row element in which the taskbar is rendered. */
    rowElement: Element;
    /** References the taskbar element in the Gantt chart. */
    taskbarElement: Element;
    /** Specifies the background color of the taskbar. */
    taskbarBgColor?: string;
    /** Specifies the border color of the taskbar. */
    taskbarBorderColor?: string;
    /** Specifies the background color of the progress bar within the taskbar. */
    progressBarBgColor?: string;
    /** Specifies the color used for milestones. */
    milestoneColor?: string;
    /** Specifies the color of the right-side label. */
    rightLabelColor?: string;
    /** Specifies the color of the left-side label. */
    leftLabelColor?: string;
    /** Specifies the color of the task label displayed on the taskbar. */
    taskLabelColor?: string;
    /** Specifies the color used for the baseline representation. */
    baselineColor?: string;
    /** Indicates the type of the taskbar (e.g., task, milestone, baseline). */
    taskbarType: string;
}

export interface IGanttCellFormatter {
    /** Method used to format the cell value for date columns in the Gantt chart. */
    getValue(column: Column, data: Object): Object;
}


export interface ITaskbarEditedEventArgs {
    /** Represents the fields being edited in the taskbar. */
    editingFields?: ITaskData;
    /** Contains the Gantt task data associated with the edit action. */
    data?: IGanttData;
    /** Specifies the index of the edited task in the data collection. */
    recordIndex?: number;
    /** Represents the previous values of the task before editing. */
    previousData?: ITaskData;
    /** Indicates the type of taskbar edit action performed (e.g., progress change, resize). */
    taskBarEditAction?: string;
    /** Indicates whether the task duration should be rounded off after editing. */
    roundOffDuration?: boolean;
    /** Specifies whether the event can be canceled. */
    cancel?: boolean;
    /** Represents the action type associated with the edit operation. */
    action?: string;
    /** References the target HTML element involved in the edit action. */
    target?: Element;
    /** Specifies the index of the segment being edited (for split tasks). */
    segmentIndex?: number;
}

export interface IKeyPressedEventArgs {
    /** Specifies the type of request triggered by the key press (e.g., edit, delete, navigate). */
    requestType?: string;
    /** Represents the key action performed (e.g., Enter, Escape, Arrow keys). */
    action?: string;
    /** References the original keyboard event object. */
    keyEvent?: Event;
}

export interface ITaskDeletedEventArgs {
    /** Represents the collection of tasks that were deleted. */
    deletedRecordCollection?: IGanttData[];
    /** Represents the collection of tasks that were updated after deletion. */
    updatedRecordCollection?: IGanttData[];
    /** Indicates whether the event can be canceled. */
    cancel?: boolean;
    /** Specifies the action type associated with the deletion event. */
    action?: string;
}

export interface IDependencyEditData {
    /** Represents the unique identifier of the dependency. */
    id?: string;
    /** Specifies the display text or label for the dependency. */
    text?: string;
    /** Defines the value associated with the dependency. */
    value?: string;
}

export interface IPredecessor {
    /** Represents the starting task ID or reference for the predecessor. */
    from?: string;
    /** Represents the ending task ID or reference for the predecessor. */
    to?: string;
    /** Specifies the type of dependency (e.g., Finish-to-Start, Start-to-Start). */
    type?: string;
    /** Defines the offset value applied to the dependency. */
    offset?: number;
    /** Indicates the unit of the offset (e.g., days, hours). */
    offsetUnit?: string;
    /** Determines whether the predecessor link is drawable in the UI. */
    isDrawn?: boolean;
}

export interface IValidateArgs {
    /** Represents the Gantt task data being validated. */
    data?: IGanttData;
    /** Specifies the index of the record in the data collection. */
    recordIndex?: number;
    /** Indicates the type of request triggering the validation (e.g., 'save', 'delete'). */
    requestType?: string;
    /** Determines whether the action should be canceled. */
    cancel?: boolean;
    /** Defines the validation mode applied during the process. */
    validateMode?: IValidateMode;
    /** Contains the arguments related to the edit operation. */
    editEventArgs?: object;
    /** Specifies the type of constraint violation, if any. */
    violationType?: ViolationType;
}

export interface ITimeSpanEventArgs {
    /** Represents the start date of the project. */
    projectStartDate?: Date;
    /** Represents the end date of the project. */
    projectEndDate?: Date;
    /** Indicates whether the timeline should be rounded off. */
    isTimelineRoundOff?: boolean;
    /** Specifies the type of request triggering the event. */
    requestType?: string;
    /** Determines whether the event can be canceled. */
    cancel?: boolean;
    /** Defines the action associated with the event. */
    action?: string;
}


export interface IValidateMode {
    /** Indicates whether task links should be respected during validation. */
    respectLink?: boolean;
    /** Determines whether task links should be removed during validation. */
    removeLink?: boolean;
    /** Specifies whether links should be preserved when editing tasks. */
    preserveLinkWithEditing?: boolean;
    /**
     * Indicates whether edits violating "Must Start On" (MSO) should be respected.
     * If false, the edit is reverted and a dialog is shown with violationType: "MustStartOn".
     */
    respectMustStartOn?: boolean;
    /**
     * Indicates whether edits violating "Must Finish On" (MFO) should be respected.
     * If false, the edit is reverted and a dialog is shown with violationType: "MustFinishOn".
     */
    respectMustFinishOn?: boolean;
    /**
     * Indicates whether edits violating "Start No Later Than" (SNLT) should be respected.
     * If false, the edit is reverted and a dialog is shown with violationType: "StartNoLaterThan".
     */
    respectStartNoLaterThan?: boolean;
    /**
     * Indicates whether edits violating "Finish No Later Than" (FNLT) should be respected.
     * If false, the edit is reverted and a dialog is shown with violationType: "FinishNoLaterThan".
     */
    respectFinishNoLaterThan?: boolean;
}


export interface IActionBeginEventArgs {
    /** Specifies the type of request triggering the action (e.g., 'save', 'delete'). */
    requestType?: string;
    /** Represents the Gantt record or collection of records involved in the action. */
    data?: IGanttData | IGanttData[];
    /** Contains the collection of records that were modified. */
    modifiedRecords?: IGanttData[];
    /** Holds the modified task data, either as a single object or an array of objects. */
    modifiedTaskData?: object[] | object;
    /** Determines whether the event can be canceled. */
    cancel?: boolean;
    /** Specifies the type of taskbar edit action performed (e.g., 'resize', 'drag'). */
    taskBarEditAction?: string;
    /** Defines the action associated with the event (e.g., 'beginEdit', 'deleteTask'). */
    action?: string;
    /** Represents the target DOM element related to the action. */
    target?: Element;
}


export interface IValidateLinkedTaskArgs {
    /** Specifies the edit mode applied to the linked task (e.g., 'manual', 'auto'). */
    editMode?: string;
    /** Represents the Gantt task data being validated. */
    data?: IGanttData;
    /** Indicates the type of request triggering the validation (e.g., 'update', 'delete'). */
    requestType?: string;
    /** Defines the validation mode settings for the linked task. */
    validateMode?: IValidateMode;
    /** Determines whether the validation process should be canceled. */
    cancel?: boolean;
}


export interface IConnectorLineObject {
    /** Represents the left position of the parent task element. */
    parentLeft?: number;
    /** Represents the left position of the child task element. */
    childLeft?: number;
    /** Specifies the width of the parent task element. */
    parentWidth?: number;
    /** Specifies the width of the child task element. */
    childWidth?: number;
    /** Indicates the index of the parent task in the data collection. */
    parentIndex?: number;
    /** Indicates the index of the child task in the data collection. */
    childIndex?: number;
    /** Defines the height of the row in which the connector line is drawn. */
    rowHeight?: number;
    /** Specifies the type of connector (e.g., 'Finish-to-Start', 'Start-to-Start'). */
    type?: string;
    /** Represents the unique identifier for the connector line. */
    connectorLineId?: string;
    /** Indicates whether the parent task is a milestone. */
    milestoneParent?: boolean;
    /** Indicates whether the child task is a milestone. */
    milestoneChild?: boolean;
    /** Represents the index of the parent task in the current view. */
    parentIndexInCurrentView?: number;
    /** Represents the index of the child task in the current view. */
    childIndexInCurrentView?: number;
    /** Determines whether the connector line is part of the critical path. */
    isCritical?: boolean;
    /** Specifies the end point position of the parent task for the connector line. */
    parentEndPoint?: number;
    /** Specifies the end point position of the child task for the connector line. */
    childEndPoint?: number;
}

export interface ISplitterResizedEventArgs {
    /** Represents the main element associated with the splitter resize event. */
    element?: HTMLElement;
    /** Contains the original event object triggered during resizing. */
    event?: Event;
    /** Specifies the size of each pane after resizing, in pixels. */
    paneSize?: number[];
    /** Represents the collection of pane elements involved in the resize action. */
    pane?: HTMLElement[];
    /** Indicates the index of the pane(s) being resized. */
    index?: number[];
    /** Represents the separator element between the panes. */
    separator?: HTMLElement;
    /** Determines whether the resize event can be canceled. */
    cancel?: boolean;
}

export interface PredecessorTooltip {
    /** Represents the ID of the predecessor's source task. */
    fromId?: string;
    /** Represents the ID of the predecessor's target task. */
    toId?: string;
    /** Specifies the name of the predecessor's source task. */
    fromName?: string;
    /** Specifies the name of the predecessor's target task. */
    toName?: string;
    /** Indicates the type of link between tasks (e.g., 'Finish-to-Start', 'Start-to-Start'). */
    linkType?: string;
    /** Defines the display text for the link type. */
    linkText?: string;
    /** Represents the offset value applied to the predecessor link. */
    offset?: number;
    /** Specifies the unit of the offset (e.g., days, hours). */
    offsetUnit?: string;
    /** Contains the formatted offset value as a string. */
    offsetString?: string;
}

export interface BeforeTooltipRenderEventArgs {
    /** Represents the data associated with the tooltip rendering event. */
    data?: BeforeTooltipRenderEventArgsData;
    /** Contains the original event arguments from the tooltip control. */
    args?: TooltipEventArgs;
    /** Specifies the content to be displayed inside the tooltip. Can be a string, an HTML element, or a function returning content. */
    content?: string | Element | Function;
    /** Determines whether the tooltip rendering should be canceled. */
    cancel?: boolean;
}

export interface QueryCellInfoEventArgs {
    /** Represents the row data associated with the current cell. */
    data?: IGanttData;
    /** Specifies the cell element in the DOM. */
    cell?: Element;
    /** Contains the column object associated with this cell. */
    column?: Column;
    /** Indicates the number of columns to be spanned by this cell. */
    colSpan?: number;
    /** Indicates the number of rows to be spanned by this cell. */
    rowSpan?: number;
    /** Specifies the current action or request type (e.g., 'render', 'refresh'). */
    requestType?: string;
    /** Represents the foreign key row data associated with this column, if applicable. */
    foreignKeyData?: Object;
}

/**
 * Extends IGanttData and PredecessorTooltip to provide data for the BeforeTooltipRenderEventArgs interface.
 */
export interface BeforeTooltipRenderEventArgsData extends IGanttData, PredecessorTooltip {
}

export interface IDependencyEventArgs {
    /** Represents the predecessor task involved in the dependency. */
    fromItem?: IGanttData;
    /** Represents the successor task involved in the dependency. */
    toItem?: IGanttData;
    /** Specifies the updated predecessor string after modification. */
    newPredecessorString?: string;
    /** Indicates whether the dependency link is valid. */
    isValidLink?: boolean;
    /** Specifies the type of request triggering the event (e.g., 'add', 'remove'). */
    requestType?: string;
    /** Contains the predecessor object with detailed link information. */
    predecessor?: IPredecessor;
}


export interface ITaskAddedEventArgs {
    /** Represents the newly added task data including Gantt-specific properties. */
    data?: IGanttData[] | IGanttData;
    /** Represents the newly added task data without custom Gantt properties. */
    newTaskData?: object[] | object;
    /** Contains the collection of records that were modified during the operation. */
    modifiedRecords?: IGanttData[];
    /** Holds the modified task data, either as a single object or an array of objects. */
    modifiedTaskData?: object[] | object;
    /** Specifies the index or indices of the newly added record(s). */
    recordIndex?: number | number[];
    /** Determines whether the event can be canceled. */
    cancel?: boolean;
    /** Defines the action associated with the event (e.g., 'add', 'insert'). */
    action?: string;
    /** Specifies the type of request triggering the event (e.g., 'addTask'). */
    requestType?: string;
    /** Indicates the row position where the new task is added (e.g., 'Above', 'Below'). */
    rowPosition?: string;
}

export interface ICollapsingEventArgs {
    /** Represents the TreeGrid row element being collapsed. */
    gridRow: Node;
    /** Represents the Gantt chart row element being collapsed. */
    chartRow: Node;
    /** Specifies the name of the action (e.g., 'collapse', 'expand'). */
    name?: string;
    /** Contains the parent row data associated with the collapsing action. */
    data?: IGanttData;
    /** Determines whether the collapsing action should be canceled. */
    cancel?: boolean;
}

export interface ContextMenuOpenEventArgs extends GridContextMenuOpenEventArgs {
    /** Represents the TreeGrid row element where the context menu is opened. */
    gridRow?: Element;
    /** Represents the Gantt chart row element where the context menu is opened. */
    chartRow?: Element;
    /** Contains the selected row data associated with the context menu action. */
    rowData?: IGanttData;
    /** Specifies the type of context menu (e.g., 'Header', 'Row', 'Chart'). */
    type?: ContextMenuType;
    /** Defines the collection of menu items to be hidden. */
    hideItems?: string[];
    /** Defines the collection of submenu items to be hidden. */
    hideChildItems?: string[];
    /** Defines the collection of menu items to be disabled. */
    disableItems?: string[];
    /** Represents the target DOM element that triggered the context menu. */
    target?: Element;
    /** Specifies the top position (in pixels) where the context menu should appear. */
    top?: number;
    /** Specifies the left position (in pixels) where the context menu should appear. */
    left?: number;
}

export interface ContextMenuClickEventArgs extends GridContextMenuClickEventArgs {
    /** Represents the selected row data associated with the context menu action. */
    rowData?: IGanttData;

    /** Specifies the type of context menu (e.g., 'Header', 'Row', 'Chart'). */
    type?: ContextMenuType;
}

/**
 * Represents a function that formats a given date into a timeline string.
 *
 * @param date - The date to be formatted.
 * @param format - The format string (e.g., 'MM/dd/yyyy', 'dd-MMM').
 * @param tier - The timeline tier (e.g., 'top', 'bottom').
 * @param mode - The display mode (e.g., 'week', 'month').
 * @returns A formatted string representing the timeline.
 */
export type ITimelineFormatter = (
    date?: Date,
    format?: string,
    tier?: string,
    mode?: string
) => string;

export interface ZoomEventArgs {
    /** Specifies the type of request triggering the zoom event (e.g., 'zoomIn', 'zoomOut'). */
    requestType?: string;
    /** Defines the zoom action performed (e.g., 'increase', 'decrease'). */
    action?: string;
    /** Represents the timeline settings applied during the zoom operation. */
    timeline?: ZoomTimelineSettings;
    /** Determines whether the zoom event should be canceled. */
    cancel?: boolean;
}

export interface ZoomTimelineSettings {
    /** Specifies the timeline view mode (e.g., 'Day', 'Week', 'Month'). */
    timelineViewMode?: TimelineViewMode;
    /** Represents the configuration settings for the top tier of the timeline. */
    topTier?: TimelineTierSettingsModel;
    /** Represents the configuration settings for the bottom tier of the timeline. */
    bottomTier?: TimelineTierSettingsModel;
    /** Defines the unit size of the timeline in pixels. */
    timelineUnitSize?: number;
    /** Specifies the starting day of the week (0 for Sunday, 1 for Monday, etc.). */
    weekStartDay?: number;
    /** Defines the background color for weekends in the timeline. */
    weekendBackground?: string;
    /** Indicates whether tooltips should be displayed on the timeline. */
    showTooltip?: boolean;
    /** Specifies the width allocated per day in the timeline view. */
    perDayWidth?: number;
    /** Represents the current zoom level of the timeline. */
    level?: number;
    /** Determines whether the timescale view should be updated after zooming. */
    updateTimescaleView?: boolean;
}


/** @private */
export interface MousePoint {
    /** Specifies the horizontal position of the mouse pointer relative to the page. */
    pageX?: number;

    /** Specifies the vertical position of the mouse pointer relative to the page. */
    pageY?: number;
}

/** @private */
export interface ITemplateData {
    /** Indicates whether the task is expanded in the hierarchy. */
    expanded?: boolean;
    /** Specifies whether the task has child records. */
    hasChildRecords?: boolean;
    /** Represents the index of the task in the data collection. */
    index?: number;
    /** Defines the hierarchical level of the task. */
    level?: number;
    /** Specifies the left position of the baseline bar in pixels. */
    baselineLeft?: number;
    /** Specifies the width of the baseline bar in pixels. */
    baselineWidth?: number;
    /** Represents the start date of the task. */
    taskStartDate?: Date;
    /** Represents the end date of the task. */
    taskEndDate?: Date;
    /** Defines the duration of the task. */
    taskDuration?: number;
    /** Specifies the unit of the task duration (e.g., 'days', 'hours'). */
    taskDurationUnit?: string;
    /** Contains the names of predecessor tasks as a formatted string. */
    taskPredecessorsName?: string;
    /** Contains the names of resources assigned to the task. */
    taskResourceNames?: string;
    /** Indicates whether the task is scheduled automatically. */
    isAutoSchedule?: boolean;
    /** Indicates whether the task is a milestone. */
    isMilestone?: boolean;
    /** Specifies the left position of the task bar in pixels. */
    left?: number;
    /** Defines the width of the progress bar in pixels. */
    progressWidth?: number;
    /** Specifies the total width of the task bar in pixels. */
    width?: number;
}

export interface RowSelectingEventArgs extends GridRowSelectingEventArgs {
    /** Represents the Gantt row data associated with the selection event. */
    data: IGanttData;
}

export interface RowSelectEventArgs extends GridRowSelectEventArgs {
    /** Represents the Gantt row data associated with the selection event. */
    data: IGanttData;
}

export interface RowDataBoundEventArgs extends GridRowDataBoundEventArgs {
    /** Represents the Gantt row data associated with the row binding event. */
    data: IGanttData;
    /** Specifies the row element in the DOM. */
    row?: Element;
}

export interface RowDeselectEventArgs extends GridRowDeselectEventArgs {
    /** Specifies the index of the row that was selected or deselected. */
    rowIndex?: number;
    /** Represents the collection of Gantt row data associated with the deselection event. */
    data?: IGanttData[];
    /** Specifies the DOM element of the row that was selected or deselected. */
    row?: Element;
}

export interface IEventMarkerInfo {
    /** Specifies the unique identifier for the event marker. */
    id?: number;
    /** Defines the horizontal position of the marker. */
    left?: number;
    /** Represents the display label for the event marker. */
    label?: string;
    /** Indicates the date associated with the event marker. */
    date?: Date;
    /** Specifies the vertical position of the marker. */
    top?: string;
}

export interface ActionCompleteArgs extends ZoomEventArgs, IKeyPressedEventArgs {
    /** Represents the HTML element associated with the action. */
    element?: HTMLElement;
    /** Specifies the type of request that triggered the action. */
    requestType?: string;
    /** Represents the collection of Gantt row data related to the action. */
    data?: IGanttData[];
    /** Contains the modified Gantt records after the action. */
    modifiedRecords?: IGanttData[];
    /** Holds the modified task data objects. */
    modifiedTaskData?: Object[];
    /** Indicates whether the action should be canceled. */
    cancel?: boolean;
    /**
     * Specifies the newly added task data without custom Gantt properties.
     *
     * @isGenericType true
     */
    newTaskData?: object;
    /** Defines the record index associated with the action. */
    recordIndex?: number;
    /** Defines the specific action performed (e.g., add, delete, update). */
    action?: string;
    /** Defines the type of event triggered. */
    type?: string;
}


export interface ActionBeginArgs extends IDependencyEventArgs {
    /** Represents the Gantt row data associated with the action. */
    rowData?: IGanttData;
    /** Specifies the name of the event. */
    name?: string;
    /** Defines the type of request that triggered the action. */
    requestType?: string;
    /** Indicates whether the action should be canceled. */
    cancel?: boolean;
    /** Represents the collection of Gantt row data related to the action. */
    data?: IGanttData[];
    /** Contains the modified Gantt records before the action completes. */
    modifiedRecords?: IGanttData[];
    /**
     * Holds the modified task data objects.
     *
     * @isGenericType true
     */
    modifiedTaskData?: object[];
    /**
     * Specifies the newly added task data without custom Gantt properties.
     *
     * @isGenericType true
     */
    newTaskData?: object;
    /** Defines the split date for context menu click actions. */
    splitDate?: Date;
    /** Defines the array of merge segment indexes for context menu click actions. */
    mergeSegmentIndexes?: { firstSegmentIndex: number; secondSegmentIndex: number }[];
    /** Defines the record index associated with the action. */
    recordIndex?: number;
    /** Defines the specific action performed (e.g., add, delete, update). */
    action?: string;
    /** Defines the type of event triggered. */
    type?: string;
    /** Represents the target DOM element for the action. */
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
    /** Represents the modified Gantt records after the drop action. */
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
    /** Specifies the starting point of the timeline. */
    startPoint?: number;
    /** Specifies the ending point of the timeline. */
    endPoint?: number;
    /** Represents the start date of the timeline. */
    startDate?: Date;
    /** Represents the end date of the timeline. */
    endDate?: Date;
    /** Defines the start date of the day within the timeline. */
    dayStartDate?: Date;
    /** Specifies the total width of the timeline. */
    totalWidth?: number;
    /** Represents the starting index of the timeline segment. */
    startIndex?: number;
    /** Represents the ending index of the timeline segment. */
    endIndex?: number;
    /** Defines the starting point of the page in the timeline as a PointF object. */
    pageStartPoint?: PointF;
}

export interface PageDetail {
    /** Specifies the starting point of the page as a PointF object. */
    startPoint?: PointF;
    /** Defines the width of the page. */
    width?: number;
    /** Defines the height of the page. */
    height?: number;
    /** Represents the X-coordinate of the page's starting position. */
    pageStartX?: number;
}


export interface TimelineFormat {
    /** Specifies the width of the timeline cell. */
    width?: number;
    /** Specifies the height of the timeline cell. */
    height?: number;
    /** Represents the display value of the timeline cell. */
    value?: string;
    /** Indicates whether the timeline cell falls on a weekend. */
    isWeekend?: boolean;
    /** Defines the style applied to the timeline cell. */
    style?: PdfGanttCellStyle;
    /** Indicates whether the timeline cell is fully completed. */
    isFinished?: boolean;
    /** Specifies the width of the completed portion within the timeline cell. */
    completedWidth?: number;
    /** Represents the start date of the timeline cell. */
    startDate?: Date;
    /** Represents the end date of the timeline cell. */
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
    /** Defines the segment color collections */
    taskSegmentStyles ?: ITaskSegmentStyles[];
}
export interface ITaskSegmentStyles {
    /** Defines the segment taskbar background color */
    taskColor?: PdfColor;
    /** Defines the segment progressbar background color */
    progressColor?: PdfColor;
    /** Defines the segment taskbar border color */
    taskBorderColor?: PdfColor;
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
    /** Defines the event marker customization to rely with theme. */
    eventMarker?: PdfEventMarkerStyle;
    /** Defines the holidays customization to rely with theme. */
    holiday?: PdfGanttCellStyle;
}
export interface PdfEventMarkerStyle {
    /** Defines the event marker label style */
    label?: PdfGanttCellStyle;
    /** Defines the event marker line style */
    lineStyle?: PdfPen;
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
    /** Represents the collection of indicators displayed on the taskbar. */
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
    /** Specifies the images used in the template content. */
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
    /** Specifies the text value of the task label. */
    value?: string;
    /** Defines the left position of the label (in pixels). */
    left?: number;
    /** Indicates whether the task is completed. */
    isCompleted?: boolean;
    /** Indicates whether the left position of the label has been calculated. */
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
    /** Represents the collection of header contents to be displayed. */
    contents?: PdfHeaderFooterContent[];
}

export interface PdfFooter {
    /** Defines the footer content distance from bottom. */
    fromBottom?: number;
    /** Defines the height of footer content. */
    height?: number;
    /** Represents the collection of footer contents to be displayed. */
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
