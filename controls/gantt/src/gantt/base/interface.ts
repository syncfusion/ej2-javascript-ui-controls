import { Gantt } from '../base/gantt';
import { IGanttData, IValidateMode } from '../base/interface';
import { Column } from '../models/column';
import { TooltipEventArgs } from '@syncfusion/ej2-popups';
/**
 * Specifies Gantt-chart interfaces
 * 
 */

export interface IGanttData {
    childRecords?: Object[];
    expanded?: boolean;
    ganttProperties?: ITaskData;
    hasChildRecords?: boolean;
    index?: number;
    level?: number;
    parentItem?: IParent;
    parentUniqueID?: number;
    taskData?: Object;
    uniqueID?: string;
    indicators?: IIndicator[];
    isDelete?: boolean;
}

export interface IParent {
    uniqueID?: string;
    expanded?: boolean;
    level?: number;
    taskId?: string;
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
    /** Defines the current HeatMap instance */
    ganttModel: Gantt;
    data: IGanttData;
    rowElement: Element;
    taskbarElement: Element;
    taskbarBgColor?: string;
    taskbarBorderColor?: string;
    progressBarBgColor?: string;
    //progressBarBorderColor?: string;
    milestoneColor?: string;
    rightLabelColor?: string;
    leftLabelColor?: string;
    progressLabelColor?: string;
    baselineColor?: string;
    taskbarType: string;
}

export interface IGanttCellFormatter {
    getValue(column: Column, data: Object): Object;
}

export interface ITaskbarEditedEventArgs {
    editingFields?: ITaskData;
    data?: IGanttData;
    recordIndex?: number;
    previousData?: ITaskData;
    taskBarEditAction?: string;
    roundOffDuration?: boolean;
    cancel?: boolean;
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
    /** Defines the event is cancel. */
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
    element?: HTMLElement;
    event?: Event;
    paneSize?: number[];
    pane?: HTMLElement[];
    index?: number[];
    separator?: HTMLElement;
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
    data?: IGanttData | PredecessorTooltip;
    args?: TooltipEventArgs;
    content?: string | Element;
}

export interface IDependencyEventArgs {
    fromItem?: IGanttData;
    toItem?: IGanttData;
    newPredecessorString?: string;
    isValidLink?: boolean;
    requestType?: string;
}

export interface ITaskAddedEventArgs {
    data?: IGanttData;
    newTaskData?: object;
    modifiedRecords?: IGanttData[];
    modifiedTaskData?: object[];
    recordIndex?: number;
    cancel?: boolean;
    action?: string;
}

export type ITimelineFormatter = (date?: Date, format?: string, tier?: string, mode?: string) => string;
