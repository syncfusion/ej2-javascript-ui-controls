import { Gantt } from '../base/gantt';
import { IGanttData, IValidateMode } from '../base/interface';
import { Column } from '../models/column';
import { TooltipEventArgs } from '@syncfusion/ej2-popups';
/**
 * Specifies Gantt-chart interfaces
 * 
 */

export interface IGanttData {
    /** Defines the child records of task. */
    childRecords?: Object[];
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
    parentUniqueID?: number;
    /** Defines the data which specified in data source. */
    taskData?: Object;
    /** Defines the unique id of task. */
    uniqueID?: string;
    /** Defines the indicators value of task. */
    indicators?: IIndicator[];
    /** Defines the delete . */
    isDelete?: boolean;
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
    baselineLeft?: number;
    baselineStartDate?: Date;
    baselineEndDate?: Date;
    baselineWidth?: number;
    endDate?: Date;
    cssClass?: string;
    duration?: number;
    durationUnit?: string;
    isAutoSchedule?: boolean;
    isMilestone?: boolean;
    left?: number;
    progress?: number;
    progressWidth?: number;
    resourceInfo?: Object[];
    resourceNames?: string;
    startDate?: Date;
    notes?: string;
    predecessorsName?: string | number | object[];
    predecessor?: IPredecessor[];
    taskId?: string;
    taskName?: string;
    width?: number;
    indicators?: IIndicator[];
    uniqueID?: string;
    totalProgress?: number;
    totalDuration?: number;
}

export interface IGanttColumn {
    field?: string;
    headerText?: string;
    editType?: string;
    mappingName?: string;
    allowEditing: boolean;
    width: number;
    format: string;
    visible: boolean;
}

export interface IIndicator {
    date?: Date | string;
    iconClass?: string;
    name?: string;
    tooltip?: string;
}

export interface IWorkingTimeRange {
    from?: number;
    to?: number;
    isWorking?: boolean;
    color?: string;
    interval?: number;
}

export interface IQueryTaskbarInfoEventArgs {
    /** Defines the gantt model. */
    ganttModel: Gantt;
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
    //progressBarBorderColor?: string;
    /** Defines the milestone color. */
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

/**
 * @private
 */
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
}

export interface ITaskDeletedEventArgs {
    deletedRecordCollection?: IGanttData[];
    updatedRecordCollection?: IGanttData[];
    cancel?: boolean;
    action?: string;
}

export interface IDependencyEditData {
    id?: string;
    text?: string;
    value?: string;
}

export interface IPredecessor {
    from?: string;
    to?: string;
    type?: string;
    offset?: number;
    offsetUnit?: string;
    isDrawn?: boolean;
}

export interface IValidateArgs {
    data?: IGanttData;
    recordIndex?: number;
    requestType?: string;
    cancel?: boolean;
    validateMode?: IValidateMode;
    editEventArgs?: object;
}

export interface IValidateMode {
    respectLink?: boolean;
    removeLink?: boolean;
    preserveLinkWithEditing?: boolean;
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
}

export interface IValidateMode {
    respectLink?: boolean;
    removeLink?: boolean;
    preserveLinkWithEditing?: boolean;
}

export interface IActionBeginEventArgs {
    requestType?: string;
    data?: IGanttData | IGanttData[];
    modifiedRecords?: IGanttData[];
    modifiedTaskData?: object[];
    cancel?: boolean;
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
    fromId?: string;
    toId?: string;
    fromName?: string;
    toName?: string;
    linkType?: string;
    linkText?: string;
    offset?: number;
    offsetUnit?: string;
    offsetString?: string;
}

export interface BeforeTooltipRenderEventArgs {
    /** Defines the data. */
    data?: IGanttData | PredecessorTooltip;
    /** Defines the original event arguments of tooltip control. */
    args?: TooltipEventArgs;
    /** Defines the content. */
    content?: string | Element;
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
}

export interface ITaskAddedEventArgs {
    /** Specifies the newly added task data with Gantt properties. */
    data?: IGanttData;
    /** Specifies the newly added task data without custom Gantt properties. */
    newTaskData?: object;
    /** Defines the modified records. */
    modifiedRecords?: IGanttData[];
    /** Defines the modified task data. */
    modifiedTaskData?: object[];
    /** Defines the record index. */
    recordIndex?: number;
    /** Defines the event is cancel-able or not. */
    cancel?: boolean;
    /** Defines the action. */
    action?: string;
}

export type ITimelineFormatter = (date?: Date, format?: string, tier?: string, mode?: string) => string;
