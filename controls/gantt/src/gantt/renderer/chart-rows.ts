import { createElement, isNullOrUndefined, extend, compile, getValue, setValue } from '@syncfusion/ej2-base';
import { formatUnit, updateBlazorTemplate, resetBlazorTemplate, addClass } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { isScheduledTask } from '../base/utils';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as cls from '../base/css-constants';
import { DateProcessor } from '../base/date-processor';
import { IGanttData, IQueryTaskbarInfoEventArgs, IParent, IIndicator, ITaskData, ITaskSegment } from '../base/interface';
import { Row, Column } from '@syncfusion/ej2-grids';
import { TaskFieldsModel } from '../models/models';
import { CObject } from '../base/enum';
/**
 * To render the chart rows in Gantt
 */
export class ChartRows extends DateProcessor {
    public ganttChartTableBody: Element;
    public taskTable: HTMLElement;
    protected parent: Gantt;
    public taskBarHeight: number = 0;
    public milestoneHeight: number = 0;
    private milesStoneRadius: number = 0;
    private baselineTop: number = 0;
    public baselineHeight: number = 3;
    private baselineColor: string;
    private parentTaskbarTemplateFunction: Function;
    private leftTaskLabelTemplateFunction: Function;
    private rightTaskLabelTemplateFunction: Function;
    private taskLabelTemplateFunction: Function;
    private childTaskbarTemplateFunction: Function;
    private milestoneTemplateFunction: Function;
    private templateData: IGanttData;
    private touchLeftConnectorpoint: string = '';
    private touchRightConnectorpoint: string = '';
    public connectorPointWidth: number;
    private connectorPointMargin: number;
    public taskBarMarginTop: number;
    public milestoneMarginTop: number;
    private dropSplit: boolean = false;
    private refreshedTr: Element[] = [];
    private refreshedData: IGanttData[] = [];
    private isUpdated: boolean = true;
    constructor(ganttObj?: Gantt) {
        super(ganttObj);
        this.parent = ganttObj;
        this.initPublicProp();
        this.addEventListener();
    }

    /**
     * To initialize the public property.
     *
     * @returns {void}
     * @private
     */
    private initPublicProp(): void {
        this.ganttChartTableBody = null;
    }

    private addEventListener(): void {
        this.parent.on('renderPanels', this.createChartTable, this);
        this.parent.on('dataReady', this.initiateTemplates, this);
        this.parent.on('destroy', this.destroy, this);
    }

    public refreshChartByTimeline(): void {
        this.taskTable.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        const prevDate: Date = getValue('prevProjectStartDate', this.parent.dataOperation);
        let isUpdated: boolean = false;
        if (prevDate) {
            isUpdated = prevDate.getTime() === this.parent.cloneProjectStartDate.getTime();
        }
        this.isUpdated =  this.parent.isFromOnPropertyChange && isUpdated &&
         getValue('mutableData', this.parent.treeGrid.grid.contentModule) ? true : false;
        this.refreshGanttRows();
        this.isUpdated = true;
    }

    /**
     * To render chart rows.
     *
     * @returns {void}
     * @private
     */
    private createChartTable(): void {
        this.taskTable = createElement('table', {
            className: cls.taskTable + ' ' + cls.zeroSpacing, id: 'GanttTaskTable' + this.parent.element.id,
            styles: 'z-index: 2;position: absolute;width:' + this.parent.timelineModule.totalTimelineWidth + 'px;',
            attrs: { cellspacing: '0.25px' }
        });
        const colgroup: Element = createElement('colgroup');
        const column: Element = createElement('col', { styles: 'width:' + this.parent.timelineModule.totalTimelineWidth + 'px;' });
        colgroup.appendChild(column);
        this.taskTable.appendChild(colgroup);
        this.ganttChartTableBody = createElement('tbody', {
            id: this.parent.element.id + 'GanttTaskTableBody'
        });
        this.taskTable.appendChild(this.ganttChartTableBody);
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.taskTable);
    }

    public initiateTemplates(): void {
        this.taskTable.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.initChartHelperPrivateVariable();
        this.initializeChartTemplate();
    }
    /**
     * To render chart rows.
     *
     * @returns {void}
     * @private
     */
    public renderChartRows(): void {
        this.createTaskbarTemplate();
        this.parent.isGanttChartRendered = true;
    }

    /**
     * To get gantt Indicator.
     *
     * @param {IIndicator} indicator .
     * @returns {NodeList} .
     * @private
     */
    private getIndicatorNode(indicator: IIndicator): NodeList {
        const templateString: string = '<label class="' + cls.label + ' ' + cls.taskIndicatorDiv + '"  style="line-height:'
            + (this.parent.rowHeight) + 'px;' +
            'left:' + this.getIndicatorleft(indicator.date) + 'px;"><i class="' + indicator.iconClass + '"></i> </label>';
        return this.createDivElement(templateString);
    }

    /**
     * To get gantt Indicator.
     *
     * @param {Date | string} date .
     * @returns {number} .
     * @private
     */
    public getIndicatorleft(date: Date | string): number {
        date = this.parent.dateValidationModule.getDateFromFormat(date);
        const left: number = this.parent.dataOperation.getTaskLeft(date, false);
        return left;
    }

    /**
     * To get child taskbar Node.
     *
     *  @param {number} i .
     * @param {NodeList} rootElement .
     * @returns {NodeList} .
     * @private
     */
    private getChildTaskbarNode(i: number, rootElement?: NodeList): NodeList {
        let childTaskbarNode: NodeList = null;
        const data: IGanttData = this.templateData;
        if (this.childTaskbarTemplateFunction) {
            childTaskbarNode = this.childTaskbarTemplateFunction(
                extend({ index: i }, data), this.parent, 'TaskbarTemplate',
                this.getTemplateID('TaskbarTemplate'), false, undefined, rootElement[0]);
        } else {
            let labelString: string = '';
            let taskLabel: string = '';
            let taskbarInnerDiv: NodeList;
            let progressDiv: NodeList;
            if (data.ganttProperties.startDate && data.ganttProperties.endDate
                && data.ganttProperties.duration) {
                taskbarInnerDiv = this.createDivElement('<div class="' + cls.childTaskBarInnerDiv + ' ' + cls.traceChildTaskBar +
                 ' ' + (data.ganttProperties.isAutoSchedule ? '' : cls.manualChildTaskBar) + '"' +
                    'style="width:' + data.ganttProperties.width + 'px;height:' +
                    (this.taskBarHeight) + 'px;"></div>');
                progressDiv = this.createDivElement('<div class="' + cls.childProgressBarInnerDiv + ' ' +
                    cls.traceChildProgressBar + ' ' + (data.ganttProperties.isAutoSchedule ?
                    '' : cls.manualChildProgressBar) + '"' +
                    ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                    'width:' + data.ganttProperties.progressWidth + 'px;height:100%;' +
                    'border-top-right-radius:' + this.getBorderRadius(data.ganttProperties) + 'px;' +
                    'border-bottom-right-radius:' + this.getBorderRadius(data.ganttProperties) + 'px;">' +
                    '</div>');

            }
            if (this.taskLabelTemplateFunction && !isNullOrUndefined(progressDiv) && progressDiv.length > 0) {
                const taskLabelTemplateNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false, undefined, progressDiv[0]);
                if (taskLabelTemplateNode && taskLabelTemplateNode.length > 0) {
                    const tempDiv: Element = createElement('div');
                    tempDiv.appendChild(taskLabelTemplateNode[0]);
                    labelString = tempDiv.innerHTML;
                }
            } else {
                labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
                labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
            }
            if (labelString) {
                taskLabel = '<span class="' + cls.taskLabel + '" style="line-height:' +
                    (this.taskBarHeight - 1) + 'px; text-align:' + (this.parent.viewType === 'ResourceView' ? 'left;' : '') +
                    'display:' + (this.parent.viewType === 'ResourceView' ? 'inline-flex;' : '') +
                    'width:' + (this.parent.viewType === 'ResourceView' ? (data.ganttProperties.width - 10) : '') + 'px; height:' +
                    this.taskBarHeight + 'px;">' + labelString + '</span>';
            }
            const template: string = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length > 0 ?
                this.splitTaskbar(data, labelString) : (data.ganttProperties.startDate && data.ganttProperties.endDate
                    && data.ganttProperties.duration) ? (taskLabel) :
                    (data.ganttProperties.startDate && !data.ganttProperties.endDate && !data.ganttProperties.duration) ? (
                        '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                        cls.unscheduledTaskbarLeft + ' ' + (data.ganttProperties.isAutoSchedule ?
                            '' : cls.manualChildTaskBar) + '"' +
                        'style="left:' + data.ganttProperties.left + 'px; height:' + this.taskBarHeight + 'px;"></div>') :
                        (data.ganttProperties.endDate && !data.ganttProperties.startDate && !data.ganttProperties.duration) ?
                            ('<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                                cls.unscheduledTaskbarRight + ' ' + (data.ganttProperties.isAutoSchedule ?
                                '' : cls.manualChildTaskBar) + '"' +
                                'style="left:' + data.ganttProperties.left + 'px; height:' + this.taskBarHeight + 'px;"></div>') :
                            (data.ganttProperties.duration && !data.ganttProperties.startDate && !data.ganttProperties.endDate) ?
                                ('<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                                    cls.unscheduledTaskbar + ' ' + (data.ganttProperties.isAutoSchedule ?
                                    '' : cls.manualChildTaskBar) + '"' +
                                    'style="left:' + data.ganttProperties.left + 'px; width:' + data.ganttProperties.width + 'px;' +
                                    ' height:' + this.taskBarHeight + 'px;"></div>') : '';
            if (data.ganttProperties.startDate && data.ganttProperties.endDate && data.ganttProperties.duration &&
                (isNullOrUndefined(data.ganttProperties.segments) || (!isNullOrUndefined(data.ganttProperties.segments) &&
                 data.ganttProperties.segments.length === 0))) {
                if (template !== '' && !isNullOrUndefined(progressDiv) && progressDiv.length > 0) {
                    progressDiv[0].appendChild([].slice.call(this.createDivElement(template))[0]);
                }
                if (!isNullOrUndefined(taskbarInnerDiv) && taskbarInnerDiv.length > 0) {
                    taskbarInnerDiv[0].appendChild([].slice.call(progressDiv)[0]);
                }
                childTaskbarNode = taskbarInnerDiv;
            } else {
                childTaskbarNode = this.createDivElement(template);
            }
        }
        return childTaskbarNode;
    }

    private splitTaskbar(data: IGanttData, labelString: string): string {
        let splitTasks: string = '';
        for (let i: number = 0; i < data.ganttProperties.segments.length; i++) {
            const segment: ITaskSegment = data.ganttProperties.segments[i];
            const segmentPosition: string = (i === 0) ? 'e-segment-first' : (i === data.ganttProperties.segments.length - 1)
                ? 'e-segment-last' : 'e-segment-inprogress';
            splitTasks += (
                //split taskbar
                '<div class="' + cls.childTaskBarInnerDiv + ' ' + segmentPosition + ' ' + cls.traceChildTaskBar + ' ' +
                ' e-segmented-taskbar' +
                '"style="width:' + segment.width + 'px;position: absolute; left:' + segment.left + 'px;height:' +
                (this.taskBarHeight) + 'px; overflow: initial;" data-segment-index = "' + i + '" aria-label = "' +
                this.generateSpiltTaskAriaLabel(segment, data.ganttProperties) + '"> ' +
                this.getSplitTaskbarLeftResizerNode() +
                //split progress bar
                '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildProgressBar + ' ' +

                '" style="border-style:' + (segment.progressWidth ? 'solid;' : 'none;') +
                'display:' + (segment.progressWidth >= 0 ? 'block;' : 'none;') +
                'width:' + segment.progressWidth + 'px;height:100%;' +
                'border-top-right-radius:' + this.getSplitTaskBorderRadius(segment) + 'px;' +
                'border-bottom-right-radius:' + this.getSplitTaskBorderRadius(segment) + 'px;">' +
                // progress label
                '<span class="' + cls.taskLabel + '" style="line-height:' +
                (this.taskBarHeight - 1) + 'px;display:' + (segment.showProgress ? 'inline;' : 'none;') +
                'height:' + this.taskBarHeight + 'px;">' + labelString + '</span>' +
                '</div>' +

                this.getSplitTaskbarRightResizerNode(segment) +
                (segment.showProgress ? this.getSplitProgressResizerNode(segment) : '') +
                '</div></div>');
        }
        return splitTasks;
    }

    private getSplitTaskbarLeftResizerNode(): string {
        const lResizerLeft: number = -(this.parent.isAdaptive ? 12 : 2);
        const template: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            ' style="left:' + lResizerLeft + 'px;height:' + (this.taskBarHeight) + 'px;"></div>';
        return template;
    }

    private getSplitTaskbarRightResizerNode(segment: ITaskSegment): string {
        const rResizerLeft: number = this.parent.isAdaptive ? -2 : -10;
        const template: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            ' style="left:' + (segment.width + rResizerLeft) + 'px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        return template;
    }

    private getSplitProgressResizerNode(segment: ITaskSegment): string {
        const template: string = '<div class="' + cls.childProgressResizer + '"' +
            ' style="left:' + (segment.progressWidth - 6) + 'px;margin-top:' +
            (this.taskBarHeight - 4) + 'px;"><div class="' + cls.progressBarHandler + '"' +
            '><div class="' + cls.progressHandlerElement + '"></div>' +
            '<div class="' + cls.progressBarHandlerAfter + '"></div></div>';
        return template;
    }

    public getSegmentIndex(splitStartDate: Date, record: IGanttData): number {
        let segmentIndex: number = -1;
        const ganttProp: ITaskData = record.ganttProperties;
        const segments: ITaskSegment[] = ganttProp.segments;
        if (!isNullOrUndefined(segments)) {
            segments.sort((a: ITaskSegment, b: ITaskSegment) => {
                return a.startDate.getTime() - b.startDate.getTime();
            });
            const length: number = segments.length;
            for (let i: number = 0; i < length; i++) {
                const segment: ITaskSegment = segments[i];
                // To find if user tend to split the start date of a main taskbar
                // purpose of this to restrict the split action
                if (splitStartDate.getTime() === ganttProp.startDate.getTime()) {
                    this.dropSplit = true;
                    segmentIndex = 0;
                    // To find the if user tend to split the first date of already segmented task.
                    // purpose of this to move on day of a segment
                } else if (splitStartDate.getTime() === segment.startDate.getTime()) {
                    this.dropSplit = true;
                    let sDate: Date = segment.startDate;
                    sDate.setDate(sDate.getDate() + 1);
                    sDate = segment.startDate = this.parent.dataOperation.checkStartDate(sDate, ganttProp, false);
                    segment.startDate = sDate;
                    let eDate: Date = segment.endDate;
                    eDate = this.parent.dataOperation.getEndDate(
                        sDate, segment.duration, ganttProp.durationUnit, ganttProp, false
                    );
                    segment.endDate = eDate;
                    if (i === segments.length - 1) {
                        this.parent.setRecordValue('endDate', eDate, ganttProp, true);
                    }
                    this.incrementSegments(segments, i, record);
                    segmentIndex = segment.segmentIndex;
                    // To find if the user tend to split the segment and find the segment index
                } else {
                    segment.endDate = this.parent.dataOperation.getEndDate(
                        segment.startDate, segment.duration, ganttProp.durationUnit, ganttProp, false
                    );
                    if (splitStartDate.getTime() >= segment.startDate.getTime() && splitStartDate.getTime() <= segment.endDate.getTime()) {
                        segmentIndex = segment.segmentIndex;
                    }
                }
                this.parent.setRecordValue('segments', ganttProp.segments, ganttProp, true);
            }
        }
        if (segmentIndex === -1) {
            this.dropSplit = true;
        }
        return segmentIndex;
    }

    public mergeTask(taskId: number | string, segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[]): void {
        const mergeArrayLength: number = segmentIndexes.length;
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const mergeData: IGanttData = this.parent.flatData.filter((x: IGanttData): IGanttData => {
            if (x[taskFields.id] === taskId) {
                return x;
            } else {
                return null;
            }
        })[0];
        const segments: ITaskSegment[] = mergeData.ganttProperties.segments;
        segmentIndexes = segmentIndexes.sort((a: { firstSegmentIndex: number, secondSegmentIndex: number },
                                              b: { firstSegmentIndex: number, secondSegmentIndex: number }): number => {
            return b.firstSegmentIndex - a.firstSegmentIndex;
        });
        for (let arrayLength: number = 0; arrayLength < mergeArrayLength; arrayLength++) {
            const firstSegment: ITaskSegment = segments[segmentIndexes[arrayLength].firstSegmentIndex];
            const secondSegment: ITaskSegment = segments[segmentIndexes[arrayLength].secondSegmentIndex];
            const duration: number = firstSegment.duration + secondSegment.duration;
            const endDate: Date = this.parent.dataOperation.getEndDate(
                firstSegment.startDate, duration, mergeData.ganttProperties.durationUnit, mergeData.ganttProperties, false
            );
            const segment: ITaskSegment = {
                startDate: firstSegment.startDate,
                endDate: endDate,
                duration: duration
            };
            const insertIndex: number = segmentIndexes[arrayLength].firstSegmentIndex;
            segments.splice(insertIndex, 2, segment);
            this.parent.setRecordValue('segments', segments, mergeData.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(mergeData, 'segments');
            if (segments.length === 1) {
                this.parent.setRecordValue('endDate', endDate, mergeData.ganttProperties, true);
                this.parent.setRecordValue('segments', null, mergeData.ganttProperties, true);
                this.parent.dataOperation.updateMappingData(mergeData, 'segments');
            } else if (mergeData.ganttProperties.endDate !== segments[segments.length - 1].endDate) {
                this.parent.setRecordValue('endDate', segments[segments.length - 1].endDate, mergeData.ganttProperties, true);
            }
        }
        this.refreshChartAfterSegment(mergeData, 'mergeSegment');
    }

    private refreshChartAfterSegment(data: IGanttData, requestType: string): void {
        this.parent.setRecordValue('segments', this.parent.dataOperation.setSegmentsInfo(data, false), data.ganttProperties, true);
        this.parent.dataOperation.updateMappingData(data, 'segments');
        this.parent.dataOperation.updateWidthLeft(data);
        if (this.parent.predecessorModule && this.parent.taskFields.dependency) {
            this.parent.predecessorModule.updatedRecordsDateByPredecessor();
            this.parent.connectorLineModule.removePreviousConnectorLines(this.parent.flatData);
            this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(this.parent.flatData);
            if (data.parentItem && this.parent.getParentTask(data.parentItem).ganttProperties.isAutoSchedule
                && this.parent.isInPredecessorValidation) {  
                this.parent.dataOperation.updateParentItems(data.parentItem);
            }
            this.refreshRecords(this.parent.currentViewData);
        } else {
            this.refreshRow(this.parent.currentViewData.indexOf(data));
        }
        const tr: Element = this.ganttChartTableBody.querySelectorAll('tr')[this.parent.currentViewData.indexOf(data)];
        const args: CObject = {
            requestType: requestType,
            rowData: data
        };
        this.triggerQueryTaskbarInfoByIndex(tr, data);
        this.parent.selectionModule.clearSelection();
        const segments: ITaskSegment[] = (args.rowData as IGanttData).taskData[this.parent.taskFields.segments];
        if (this.parent.timezone && segments != null) {
            for (let i: number = 0; i < segments.length; i++) {
                segments[i][this.parent.taskFields.startDate] = this.parent.dateValidationModule.remove(
                    ((args.rowData as IGanttData).ganttProperties.segments as ITaskSegment)[i].startDate, this.parent.timezone);
                if (this.parent.taskFields.endDate) {
                    segments[i][this.parent.taskFields.endDate] = this.parent.dateValidationModule.remove(
                        ((args.rowData as IGanttData).ganttProperties.segments as ITaskSegment)[i].endDate, this.parent.timezone);
                }
            }
        }

        this.parent.trigger('actionComplete', args);
        setValue('isEdit', false, this.parent.contextMenuModule);
        setValue('isEdit', false, this.parent);
    }

    /**
     * public method to split task bar.
     *
     * @public
     */

    public splitTask(taskId: number | string, splitDates: Date | Date[]): void {
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const splitDate: Date = splitDates as Date;
        const splitRecord: IGanttData = this.parent.flatData.filter((x: IGanttData): IGanttData => {
            if (x[taskFields.id] === taskId) {
                return x;
            } else {
                return null;
            }
        })[0];
        const ganttProp: ITaskData = splitRecord.ganttProperties;
        this.dropSplit = false;
        let segmentIndex: number = -1;
        let segments: ITaskSegment[] = ganttProp.segments;
        if (isNullOrUndefined((splitDates as Date[]).length) || (splitDates as Date[]).length < 0) {
            const splitStartDate: Date = this.parent.dataOperation.checkStartDate(splitDate, ganttProp, false);
            if (splitStartDate.getTime() !== ganttProp.startDate.getTime()) {
                if (ganttProp.isAutoSchedule) {
                    if (!isNullOrUndefined(segments)) {
                        segmentIndex = this.getSegmentIndex(splitStartDate, splitRecord);
                    }
                    //check atleast one day difference is there to split
                    if (this.dropSplit === false && (splitDate as Date).getTime() > ganttProp.startDate.getTime() &&
                        (splitDate as Date).getTime() < ganttProp.endDate.getTime()) {
                        segments = segmentIndex !== -1 ? segments : [];
                        const startDate: Date = segmentIndex !== -1 ?
                            segments[segmentIndex].startDate : new Date(ganttProp.startDate.getTime());
                        const endDate: Date = segmentIndex !== -1 ? segments[segmentIndex].endDate : new Date(ganttProp.endDate.getTime());
                        const segmentDuration: number = this.parent.dataOperation.getDuration(
                            startDate, endDate, ganttProp.durationUnit, ganttProp.isAutoSchedule, ganttProp.isMilestone
                        );
                        this.parent.setRecordValue(
                            'segments', this.splitSegmentedTaskbar(
                                startDate, endDate, splitDate, segmentIndex, segments, splitRecord, segmentDuration
                            ),
                            ganttProp, true
                        );
                        if (segmentIndex !== -1) {
                            this.incrementSegments(segments, segmentIndex + 1, splitRecord);
                        }
                        this.parent.setRecordValue('endDate', segments[segments.length - 1].endDate, ganttProp, true);
                        if (this.parent.taskFields.endDate) {
                            this.parent.dataOperation.updateMappingData(splitRecord, 'endDate');
                        }
                    }
                    this.refreshChartAfterSegment(splitRecord, 'splitTaskbar');
                }
            }
        } else {
            (splitDates as Date[]).sort((a: Date, b: Date) => {
                return a.getTime() - b.getTime();
            });
            this.parent.setRecordValue(
                'segments', this.constructSegments(
                    splitDates as Date[], splitRecord.ganttProperties
                ),
                splitRecord.ganttProperties, true
            );
            this.refreshChartAfterSegment(splitRecord, 'splitTask');
        }
    }

    private constructSegments(dates: Date[], taskData: ITaskData): ITaskSegment[] {
        const segmentsArray: ITaskSegment[] = [];
        let segment: ITaskSegment;
        let startDate: Date = new Date();
        let endDate: Date;
        let duration: number;
        for (let i: number = 0; i < dates.length + 1; i++) {
            startDate = i === 0 ? taskData.startDate : startDate;
            startDate = this.parent.dataOperation.checkStartDate(startDate, taskData, false);
            endDate = i !== dates.length ? new Date(dates[i].getTime()) > taskData.endDate ? taskData.endDate
                : new Date(dates[i].getTime()) : taskData.endDate;
            endDate = this.parent.dataOperation.checkEndDate(endDate, taskData, false);
            duration = this.parent.dataOperation.getDuration(
                startDate, endDate, taskData.durationUnit, taskData.isAutoSchedule, taskData.isMilestone
            );
            if (endDate.getTime() >= startDate.getTime()) {
                segment = {
                    startDate: startDate,
                    endDate: endDate,
                    duration: duration
                };
                segmentsArray.push(segment);
            }
            if (i === dates.length) {
                break;
            }
            startDate = new Date(dates[i].getTime());
            startDate.setDate(dates[i].getDate() + 1);
        }
        return segmentsArray;
    }

    private splitSegmentedTaskbar(
        startDate: Date, endDate: Date, splitDate: Date, segmentIndex: number, segments: ITaskSegment[], ganttData: IGanttData,
        segmentDuration: number): ITaskSegment[] {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        const checkClickState: number = this.parent.nonWorkingDayIndex.indexOf(splitDate.getDay());
        const increment: number = checkClickState === -1 ? 0 : checkClickState === 0 ? 1 : 2;
        startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
        let segmentEndDate: Date = new Date(splitDate.getTime());
        segmentEndDate = this.parent.dataOperation.checkEndDate(segmentEndDate, ganttProp, false);
        for (let i: number = 0; i < 2; i++) {
            const segment: ITaskSegment = {
                startDate: startDate,
                endDate: segmentEndDate,
                duration: this.parent.dataOperation.getDuration(
                    startDate, segmentEndDate, ganttProp.durationUnit,
                    ganttProp.isAutoSchedule, ganttProp.isMilestone),
                offsetDuration: 1
            };
            const endDateState: number = this.parent.nonWorkingDayIndex.indexOf(segmentEndDate.getDay());
            if (segmentIndex !== -1) {
                segments.splice(segmentIndex, 1);
                segmentIndex = -1;
            }
            segments.push(segment);
            const mode: string = this.parent.timelineModule.customTimelineSettings.bottomTier.unit;
            if (mode === 'Hour' || mode === 'Minutes') {
                startDate = new Date(splitDate.getTime());
                startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
                const count: number = this.parent.timelineModule.customTimelineSettings.bottomTier.count;
                const mode: string = this.parent.timelineModule.customTimelineSettings.bottomTier.unit;
                let timeIncrement: number = this.parent.timelineModule.getIncrement(startDate, count, mode);
                let newTime: number = startDate.getTime() + timeIncrement;
                startDate.setTime(newTime + increment);
                segmentEndDate = new Date(endDate.getTime());
                timeIncrement = this.parent.timelineModule.getIncrement(segmentEndDate, count, mode);
                newTime = segmentEndDate.getTime() + timeIncrement;
                segmentEndDate.setTime(newTime + increment);
            } else {
                startDate = new Date(splitDate.getTime());
                startDate.setDate(startDate.getDate() + 1 + increment);
                startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
                segmentEndDate = new Date(endDate.getTime());
                segmentEndDate.setDate(segmentEndDate.getDate() + 1);
            }
            if (endDateState !== -1) {
                const diff: number = segmentDuration - segment.duration;
                segmentEndDate =
                    this.parent.dataOperation.getEndDate(startDate, diff, ganttProp.durationUnit, ganttProp, false);
            } else {
                segmentEndDate = this.parent.dataOperation.checkEndDate(segmentEndDate, ganttProp, false);
            }
        }
        segments.sort((a: ITaskSegment, b: ITaskSegment) => {
            return a.startDate.getTime() - b.startDate.getTime();
        });
        return segments;
    }

    public incrementSegments(segments: ITaskSegment[], segmentIndex: number, ganttData: IGanttData): void {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        for (let i: number = segmentIndex + 1; i < segments.length; i++) {
            const segment: ITaskSegment = segments[i];
            let startDate: Date = i !== 0 ? new Date(segments[i - 1].endDate.getTime()) : new Date(segment.startDate.getTime());
            startDate = this.parent.dataOperation.getEndDate(startDate, segment.offsetDuration, ganttProp.durationUnit, ganttProp, false);
            startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
            segment.startDate = startDate;
            const endDate: Date = segment.endDate = this.parent.dataOperation.getEndDate(
                startDate, segment.duration, ganttProp.durationUnit, ganttProp, false
            );
            segment.endDate = endDate;
            if (i === segments.length - 1) {
                this.parent.setRecordValue('endDate', endDate, ganttProp, true);
                if (this.parent.taskFields.endDate) {
                    this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
                }
            }
        }
        segments.sort((a: ITaskSegment, b: ITaskSegment) => {
            return a.startDate.getTime() - b.startDate.getTime();
        });
        this.parent.setRecordValue('segments', segments, ganttProp, true);
        this.parent.dataOperation.updateMappingData(ganttData, 'segments');
    }

    /**
     * To get milestone node.
     *
     * @param {number} i .
     * @param {NodeList} rootElement .
     * @returns {NodeList} .
     * @private
     */
    private getMilestoneNode(i: number, rootElement?: NodeList): NodeList {
        let milestoneNode: NodeList = null;
        const data: IGanttData = this.templateData;
        if (this.milestoneTemplateFunction) {
            milestoneNode = this.milestoneTemplateFunction(
                extend({ index: i }, data), this.parent, 'MilestoneTemplate',
                this.getTemplateID('MilestoneTemplate'), false, undefined, rootElement[0]);
        } else {
            const template: string = '<div class="' + cls.traceMilestone + '" style="position:absolute;">' +
                '<div class="' + cls.milestoneTop + ' ' + ((!data.ganttProperties.startDate && !data.ganttProperties.endDate) ?
                cls.unscheduledMilestoneTop : '') + '" style="border-right-width:' +
                this.milesStoneRadius + 'px;border-left-width:' + this.milesStoneRadius + 'px;border-bottom-width:' +
                this.milesStoneRadius + 'px;"></div>' +
                '<div class="' + cls.milestoneBottom + ' ' + ((!data.ganttProperties.startDate && !data.ganttProperties.endDate) ?
                cls.unscheduledMilestoneBottom : '') + '" style="top:' +
                (this.milesStoneRadius) + 'px;border-right-width:' + this.milesStoneRadius + 'px; border-left-width:' +
                this.milesStoneRadius + 'px; border-top-width:' + this.milesStoneRadius + 'px;"></div></div>';
            milestoneNode = this.createDivElement(template);
        }
        return milestoneNode;
    }

    /**
     * To get task baseline Node.
     *
     * @returns {NodeList} .
     * @private
     */
    private getTaskBaselineNode(): NodeList {
        const data: IGanttData = this.templateData;
        const template: string = '<div class="' + cls.baselineBar + ' ' + '" style="margin-top:' + this.baselineTop +
            'px;left:' + data.ganttProperties.baselineLeft + 'px;' +
            'width:' + data.ganttProperties.baselineWidth + 'px;height:' +
            this.baselineHeight + 'px;' + (this.baselineColor ? 'background-color: ' + this.baselineColor + ';' : '') + '"></div>';
        return this.createDivElement(template);
    }

    /**
     * To get milestone baseline node.
     *
     * @returns {NodeList} .
     * @private
     */
    private getMilestoneBaselineNode(): NodeList {
        const data: IGanttData = this.templateData;
        const template: string = '<div class="' + cls.baselineMilestoneContainer + ' ' + '" style="' +
            'left:' + (data.ganttProperties.baselineLeft - this.milesStoneRadius) + 'px;' +
            'margin-top:' + (-Math.floor(this.parent.rowHeight - this.milestoneMarginTop) + 2) +
            'px">' + '<div class="' + cls.baselineMilestoneDiv + '">' + '<div class="' + cls.baselineMilestoneDiv +
            ' ' + cls.baselineMilestoneTop + '"  ' +
            'style="top:' + (- this.milestoneHeight) + 'px;border-right:' + this.milesStoneRadius +
            'px solid transparent;border-left:' + this.milesStoneRadius +
            'px solid transparent;border-top:0px' +
            'solid transparent;border-bottom-width:' + this.milesStoneRadius + 'px;' +
            'border-bottom-style: solid;' + (this.baselineColor ? 'border-bottom-color: ' + this.baselineColor + ';' : '') +
            '"></div>' +
            '<div class="' + cls.baselineMilestoneDiv + ' ' + cls.baselineMilestoneBottom + '"  ' +
            'style="top:' + (this.milesStoneRadius - this.milestoneHeight) + 'px;border-right:' + this.milesStoneRadius +
            'px solid transparent;border-left:' + this.milesStoneRadius +
            'px solid transparent;border-bottom:0px' +
            'solid transparent;border-top-width:' + this.milesStoneRadius + 'px;' +
            'border-top-style: solid;' +
            (this.baselineColor ? 'border-top-color: ' + this.baselineColor + ';' : '') + '"></div>' +
            '</div></div>';
        return this.createDivElement(template);
    }

    /**
     * To get left label node.
     *
     * @param {number} i .
     * @returns {NodeList} .
     * @private
     */
    private getLeftLabelNode(i: number): NodeList {
        const leftLabelNode: NodeList = this.leftLabelContainer();
        (<HTMLElement>leftLabelNode[0]).setAttribute('aria-label', this.generateTaskLabelAriaLabel('left'));
        let leftLabelTemplateNode: NodeList = null;
        if (this.leftTaskLabelTemplateFunction) {
            leftLabelTemplateNode = this.leftTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'LeftLabelTemplate',
                this.getTemplateID('LeftLabelTemplate'), false, undefined, leftLabelNode[0]);
        } else {
            const field: string = this.parent.labelSettings.leftLabel;
            let labelString: string = this.getTaskLabel(field);
            if (labelString) {
                labelString = labelString === 'isCustomTemplate' ? field : labelString;
                leftLabelTemplateNode = this.getLableText(labelString, cls.leftLabelInnerDiv);
            }
        }
        if (leftLabelTemplateNode && leftLabelTemplateNode.length > 0) {
            leftLabelNode[0].appendChild([].slice.call(leftLabelTemplateNode)[0]);
        }
        return leftLabelNode;
    }
    private getLableText(labelString: string, labelDiv: string): NodeList {
        const templateString: HTMLElement = createElement('div', {
            className: labelDiv, styles: 'height:' + (this.taskBarHeight) + 'px;' +
                'margin-top:' + this.taskBarMarginTop + 'px;'
        });
        const spanElem: HTMLElement = createElement('span', { className: cls.label });
        const property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
        spanElem[property] = labelString;
        templateString.appendChild(spanElem);
        const div: HTMLElement = createElement('div');
        div.appendChild(templateString);
        return div.childNodes;
    }
    /**
     * To get right label node.
     *
     * @param {number} i .
     * @returns {NodeList} .
     * @private
     */
    private getRightLabelNode(i: number): NodeList {
        const rightLabelNode: NodeList = this.rightLabelContainer();
        (<HTMLElement>rightLabelNode[0]).setAttribute('aria-label', this.generateTaskLabelAriaLabel('right'));
        let rightLabelTemplateNode: NodeList = null;
        if (this.rightTaskLabelTemplateFunction) {
            rightLabelTemplateNode = this.rightTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'RightLabelTemplate',
                this.getTemplateID('RightLabelTemplate'), false, undefined, rightLabelNode[0]);
        } else {
            const field: string = this.parent.labelSettings.rightLabel;
            let labelString: string = this.getTaskLabel(field);
            if (labelString) {
                labelString = labelString === 'isCustomTemplate' ? field : labelString;
                rightLabelTemplateNode = this.getLableText(labelString, cls.rightLabelInnerDiv);
            }
        }
        if (rightLabelTemplateNode && rightLabelTemplateNode.length > 0) {
            rightLabelNode[0].appendChild([].slice.call(rightLabelTemplateNode)[0]);
        }
        return rightLabelNode;
    }

    private getManualTaskbar(): NodeList {
        const data: IGanttData = this.templateData;
        const taskbarHeight: number = (this.taskBarHeight / 2 - 1);
        const innerDiv: string = (data.ganttProperties.startDate && data.ganttProperties.endDate && data.ganttProperties.duration) ?
            ('<div class="' + cls.manualParentTaskBar + '" style="width:' + data.ganttProperties.width + 'px;' + 'height:' +
                taskbarHeight / 5 + 'px;border-left-width:' + taskbarHeight / 5 +
                'px; border-bottom:' + taskbarHeight / 5 + 'px solid transparent;"></div>') :
            (!data.ganttProperties.startDate && !data.ganttProperties.endDate && data.ganttProperties.duration) ?
                ('<div class="' + cls.manualParentTaskBar + ' ' + cls.traceManualUnscheduledTask +
                    '" style="width:' + data.ganttProperties.width + 'px;' + 'height:' +
                    (taskbarHeight / 5 + 1) + 'px;border-left-width:' + taskbarHeight / 5 +
                    'px; border-bottom:' + taskbarHeight / 5 + 'px solid transparent;"></div>') : ('<div class="' +
            cls.manualParentTaskBar + ' ' + (data.ganttProperties.startDate ? cls.unscheduledTaskbarLeft : cls.unscheduledTaskbarRight) +
                        '" style="width:' + data.ganttProperties.width + 'px;' + 'height:' +
                        taskbarHeight * 2 + 'px;border-left-width:' + taskbarHeight / 5 +
                        'px; border-bottom:' + taskbarHeight / 5 + 'px solid transparent;"></div>');
        const template: string = '<div class="' + cls.manualParentMainContainer + '"' +
            'style=left:' + (data.ganttProperties.left - data.ganttProperties.autoLeft) + 'px;' +
            'width:' + data.ganttProperties.width + 'px;' +
            'height:' + taskbarHeight + 'px;>' + innerDiv + ((data.ganttProperties.startDate && data.ganttProperties.endDate &&
                data.ganttProperties.duration) || data.ganttProperties.duration ? '<div class="e-gantt-manualparenttaskbar-left" style=' +
                '"height:' + taskbarHeight + 'px;border-left-width:' + taskbarHeight / 5 +
                'px; border-bottom:' + taskbarHeight / 5 + 'px solid transparent;"></div>' +
                '<div class="e-gantt-manualparenttaskbar-right" style=' +
                'left:' + (data.ganttProperties.width - taskbarHeight / 5) + 'px;height:' +
                (taskbarHeight) + 'px;border-right-width:' + taskbarHeight / 5 + 'px;border-bottom:' +
                taskbarHeight / 5 + 'px solid transparent;>' + '</div></div>' : '');
        const milestoneTemplate: string = '<div class="' + cls.manualParentMilestone + '" style="position:absolute;left:' +
            (data.ganttProperties.left - data.ganttProperties.autoLeft - (this.milestoneHeight / 2)) +
            'px;width:' + (this.milesStoneRadius * 2) +
            'px;">' + '<div class="' + cls.manualParentMilestoneTop + '" style="border-right-width:' +
            this.milesStoneRadius + 'px;border-left-width:' + this.milesStoneRadius + 'px;border-bottom-width:' +
            this.milesStoneRadius + 'px;"></div>' +
            '<div class="' + cls.manualParentMilestoneBottom + '" style="top:' +
            (this.milesStoneRadius) + 'px;border-right-width:' + this.milesStoneRadius + 'px; border-left-width:' +
            this.milesStoneRadius + 'px; border-top-width:' + this.milesStoneRadius + 'px;"></div></div>';
        return this.createDivElement(data.ganttProperties.width === 0 ? milestoneTemplate : template);
    }
    /**
     * To get parent taskbar node.
     *
     * @param {number} i .
     * @param {NodeList} rootElement .
     * @returns {NodeList} .
     * @private
     */
    private getParentTaskbarNode(i: number, rootElement?: NodeList): NodeList {
        let parentTaskbarNode: NodeList = null;
        const data: IGanttData = this.templateData;
        if (this.parentTaskbarTemplateFunction) {
            parentTaskbarNode = this.parentTaskbarTemplateFunction(
                extend({ index: i }, data), this.parent, 'ParentTaskbarTemplate',
                this.getTemplateID('ParentTaskbarTemplate'), false, undefined, rootElement[0]);
        } else {
            let labelString: string = ''; let labelDiv: NodeList;
            const tHeight: number = this.taskBarHeight / 5;
            const template: NodeList = this.createDivElement('<div class="' + cls.parentTaskBarInnerDiv + ' ' +
                this.getExpandClass(data) + ' ' + cls.traceParentTaskBar + '"' +
                ' style="width:' + (data.ganttProperties.isAutoSchedule ? data.ganttProperties.width :
                data.ganttProperties.autoWidth) + 'px;height:' + (data.ganttProperties.isAutoSchedule ? this.taskBarHeight :
                (tHeight * 3)) + 'px;margin-top:' + (data.ganttProperties.isAutoSchedule ? '' :
                (tHeight * 2)) + 'px;">' +
                '</div>');
            const progressBarInnerDiv: NodeList = this.createDivElement('<div class="' + cls.parentProgressBarInnerDiv + ' ' +
             this.getExpandClass(data) + ' ' + cls.traceParentProgressBar + '"' +
                ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                'width:' + data.ganttProperties.progressWidth + 'px;' +
                'border-top-right-radius:' + this.getBorderRadius(data) + 'px;' +
                'border-bottom-right-radius:' + this.getBorderRadius(data) + 'px;height:100%;"></div>');
            if (this.taskLabelTemplateFunction) {
                const parentTaskLabelNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false, undefined, progressBarInnerDiv[0]);
                if (parentTaskLabelNode && parentTaskLabelNode.length > 0) {
                    const div: Element = createElement('div');
                    div.appendChild(parentTaskLabelNode[0]);
                    labelString = div.innerHTML;
                }
            } else {
                labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
                labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
            }
            if (labelString !== '') {
                labelDiv = this.createDivElement('<span class="' +
                    cls.taskLabel + '" style="line-height:' +
                    (this.taskBarHeight - 1) + 'px; display:' + (this.parent.viewType === 'ResourceView' ? 'inline-flex;' : '') + 'width:' +
                    (this.parent.viewType === 'ResourceView' ? (data.ganttProperties.width - 10) : '') + 'px; height:' +
                    this.taskBarHeight + 'px;">' + labelString + '</span>');
                progressBarInnerDiv[0].appendChild([].slice.call(labelDiv)[0]);
            }
            const milestoneTemplate: string = '<div class="' + cls.parentMilestone + '" style="position:absolute;">' +
                '<div class="' + cls.parentMilestoneTop + '" style="border-right-width:' +
                this.milesStoneRadius + 'px;border-left-width:' + this.milesStoneRadius + 'px;border-bottom-width:' +
                this.milesStoneRadius + 'px;"></div>' +
                '<div class="' + cls.parentMilestoneBottom + '" style="top:' +
                (this.milesStoneRadius) + 'px;border-right-width:' + this.milesStoneRadius + 'px; border-left-width:' +
                this.milesStoneRadius + 'px; border-top-width:' + this.milesStoneRadius + 'px;"></div></div>';
            template[0].appendChild([].slice.call(progressBarInnerDiv)[0]);

            parentTaskbarNode = data.ganttProperties.isMilestone ?
                this.createDivElement(data.ganttProperties.isAutoSchedule ? milestoneTemplate : '') : template;
        }
        return parentTaskbarNode;
    }
    /**
     * To get taskbar row('TR') node
     *
     * @returns {NodeList} .
     * @private
     */
    private getTableTrNode(): NodeList {
        const table: Element = createElement('table');
        const className: string = (this.parent.gridLines === 'Horizontal' || this.parent.gridLines === 'Both') ?
            'e-chart-row-border' : '';
        table.innerHTML = '<tr class="' + this.getRowClassName(this.templateData) + ' ' + cls.chartRow + '"' +
            'style="display:' + this.getExpandDisplayProp(this.templateData) + ';height:' +
            this.parent.rowHeight + 'px;">' +
            '<td class="' + cls.chartRowCell + ' ' + className
            + '" style="width:' + this.parent.timelineModule.totalTimelineWidth + 'px;"></td></tr>';
        return table.childNodes;
    }

    /**
     * To initialize chart templates.
     *
     * @returns {void}
     * @private
     */
    private initializeChartTemplate(): void {
        if (!isNullOrUndefined(this.parent.parentTaskbarTemplate)) {
            this.parentTaskbarTemplateFunction = this.templateCompiler(this.parent.parentTaskbarTemplate);
        }
        if (!isNullOrUndefined(this.parent.labelSettings.leftLabel) &&
            this.isTemplate(this.parent.labelSettings.leftLabel)) {
            this.leftTaskLabelTemplateFunction = this.templateCompiler(this.parent.labelSettings.leftLabel);
        }
        if (!isNullOrUndefined(this.parent.labelSettings.rightLabel) &&
            this.isTemplate(this.parent.labelSettings.rightLabel)) {
            this.rightTaskLabelTemplateFunction = this.templateCompiler(this.parent.labelSettings.rightLabel);
        }
        if (!isNullOrUndefined(this.parent.labelSettings.taskLabel) &&
            this.isTemplate(this.parent.labelSettings.taskLabel)) {
            this.taskLabelTemplateFunction = this.templateCompiler(this.parent.labelSettings.taskLabel);
        }
        if (!isNullOrUndefined(this.parent.taskbarTemplate)) {
            this.childTaskbarTemplateFunction = this.templateCompiler(this.parent.taskbarTemplate);
        }
        if (!isNullOrUndefined(this.parent.milestoneTemplate)) {
            this.milestoneTemplateFunction = this.templateCompiler(this.parent.milestoneTemplate);
        }
    }

    private createDivElement(template: string): NodeList {
        const div: Element = createElement('div');
        div.innerHTML = template;
        return div.childNodes;
    }

    private isTemplate(template: string): boolean {
        let result: boolean = false;
        if (typeof template !== 'string' || template.indexOf('#') === 0 || template.indexOf('<') > -1
        || template.indexOf('$') > -1) {
            result = true;
        }
        return result;
    }
    /**
     * @param {string} templateName .
     * @returns {string} .
     * @private
     */
    public getTemplateID(templateName: string): string {
        const ganttID: string = this.parent.element.id;
        return ganttID + templateName;
    }

    private updateTaskbarBlazorTemplate(isUpdate: boolean, ganttData?: IGanttData): void {
        let isMilestone: boolean = true;
        let isParent: boolean = true;
        let isChild: boolean = true;
        if (ganttData) {
            if (ganttData.ganttProperties.isMilestone) {
                isParent = isChild = false;
            } else if (ganttData.hasChildRecords) {
                isMilestone = isChild = false;
            } else if (!ganttData.hasChildRecords) {
                isParent = isMilestone = false;
            }
        }
        if (this.parentTaskbarTemplateFunction && isParent) {
            if (isUpdate) {
                updateBlazorTemplate(this.getTemplateID('ParentTaskbarTemplate'), 'ParentTaskbarTemplate', this.parent, false);
            } else {
                resetBlazorTemplate(this.getTemplateID('ParentTaskbarTemplate'), 'ParentTaskbarTemplate');
            }
        }
        if (this.childTaskbarTemplateFunction && isChild) {
            if (isUpdate) {
                updateBlazorTemplate(this.getTemplateID('TaskbarTemplate'), 'TaskbarTemplate', this.parent, false);
            } else {
                resetBlazorTemplate(this.getTemplateID('TaskbarTemplate'), 'TaskbarTemplate');
            }
        }
        if (this.milestoneTemplateFunction && isMilestone) {
            if (isUpdate) {
                updateBlazorTemplate(this.getTemplateID('MilestoneTemplate'), 'MilestoneTemplate', this.parent, false);
            } else {
                resetBlazorTemplate(this.getTemplateID('MilestoneTemplate'), 'MilestoneTemplate');
            }
        }
        if (this.leftTaskLabelTemplateFunction) {
            if (isUpdate) {
                updateBlazorTemplate(this.getTemplateID('LeftLabelTemplate'), 'LeftLabelTemplate', this.parent.labelSettings, false);
            } else {
                resetBlazorTemplate(this.getTemplateID('LeftLabelTemplate'), 'LeftLabelTemplate');
            }
        }
        if (this.rightTaskLabelTemplateFunction) {
            if (isUpdate) {
                updateBlazorTemplate(
                    this.getTemplateID('RightLabelTemplate'), 'RightLabelTemplate', this.parent.labelSettings, false);
            } else {
                resetBlazorTemplate(
                    this.getTemplateID('RightLabelTemplate'), 'RightLabelTemplate');
            }
        }
        if (this.taskLabelTemplateFunction && (isParent || isChild)) {
            if (isUpdate) {
                updateBlazorTemplate(
                    this.getTemplateID('TaskLabelTemplate'), 'TaskLabelTemplate', this.parent.labelSettings, false);
            } else {
                resetBlazorTemplate(
                    this.getTemplateID('TaskLabelTemplate'), 'TaskLabelTemplate');
            }
        }
    }

    private leftLabelContainer(): NodeList {
        const template: string = '<div class="' + ((this.leftTaskLabelTemplateFunction) ? cls.leftLabelTempContainer :
            cls.leftLabelContainer) + ' ' + '" tabindex="-1" style="height:' +
            (this.parent.rowHeight - 1) + 'px;width:' + this.taskNameWidth(this.templateData) + '"></div>';
        return this.createDivElement(template);
    }

    private taskbarContainer(): NodeList {
        const data: IGanttData = this.templateData;
        const manualParent: boolean = this.parent.editModule && this.parent.editSettings.allowTaskbarEditing &&
            this.parent.editModule.taskbarEditModule.taskBarEditAction === 'ParentResizing' ?
            true : false;
        const template: string = '<div class="' + cls.taskBarMainContainer + ' ' +
            this.parent.getUnscheduledTaskClass(data.ganttProperties) + ' ' +
            ((data.ganttProperties.cssClass) ? data.ganttProperties.cssClass : '') + '" ' +
            ' tabindex="-1" style="' + ((data.ganttProperties.isMilestone && !manualParent) ?
            ('width:' + this.milestoneHeight + 'px;height:' +
                    this.milestoneHeight + 'px;margin-top:' + this.milestoneMarginTop + 'px;left:' + (data.ganttProperties.left -
                        (this.milestoneHeight / 2)) + 'px;') : ('width:' + data.ganttProperties.width +
                     'px;margin-top:' + this.taskBarMarginTop + 'px;left:' + (!data.hasChildRecords || data.ganttProperties.isAutoSchedule ?
                data.ganttProperties.left : data.ganttProperties.autoLeft) + 'px;height:' +
                            this.taskBarHeight + 'px;cursor:' + (data.ganttProperties.isAutoSchedule ? 'move;' : 'auto;'))) + '"></div>';
        return this.createDivElement(template);
    }

    private rightLabelContainer(): NodeList {
        const template: string = '<div class="' + ((this.rightTaskLabelTemplateFunction) ? cls.rightLabelTempContainer :
            cls.rightLabelContainer) + '" ' + ' tabindex="-1" style="left:' + this.getRightLabelLeft(this.templateData) + 'px;height:'
            + (this.parent.rowHeight - 1) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarLeftResizer(): NodeList {
        const lResizerLeft: number = -(this.parent.isAdaptive ? 12 : 2);
        const template: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            ' style="left:' + lResizerLeft + 'px;height:' + (this.taskBarHeight) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarRightResizer(): NodeList {
        const rResizerLeft: number = this.parent.isAdaptive ? -2 : -10;
        const template: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            ' style="left:' + (this.templateData.ganttProperties.width + rResizerLeft) + 'px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarProgressResizer(): NodeList {
        const template: string = '<div class="' + cls.childProgressResizer + '"' +
            ' style="left:' + (this.templateData.ganttProperties.progressWidth - 6) + 'px;margin-top:' +
            (this.taskBarHeight - 4) + 'px;"><div class="' + cls.progressBarHandler + '"' +
            '><div class="' + cls.progressHandlerElement + '"></div>' +
            '<div class="' + cls.progressBarHandlerAfter + '"></div></div>';
        return this.createDivElement(template);
    }

    private getLeftPointNode(): NodeList {
        const data: IGanttData = this.templateData;
        const pointerLeft: number = -((this.parent.isAdaptive ? 14 : 2) + this.connectorPointWidth);
        const mileStoneLeft: number = -(this.connectorPointWidth + 2);
        const pointerTop: number = Math.floor(this.milesStoneRadius - (this.connectorPointWidth / 2));
        const template: string = '<div class="' + cls.leftConnectorPointOuterDiv + '" style="' +
            ((data.ganttProperties.isMilestone) ? ('margin-top:' + pointerTop + 'px;left:' + mileStoneLeft +
                'px;') : ('margin-top:' + this.connectorPointMargin + 'px;left:' + pointerLeft + 'px;')) + '">' +
            '<div class="' + cls.connectorPointLeft + ' ' + this.parent.getUnscheduledTaskClass(data.ganttProperties) +
            '" style="width: ' + this.connectorPointWidth + 'px;' +
            'height: ' + this.connectorPointWidth + 'px;">' + this.touchLeftConnectorpoint + '</div></div>';
        return this.createDivElement(template);
    }

    private getRightPointNode(): NodeList {
        const data: IGanttData = this.templateData;
        const pointerRight: number = this.parent.isAdaptive ? 10 : -2;
        const pointerTop: number = Math.floor(this.milesStoneRadius - (this.connectorPointWidth / 2));
        const template: string = '<div class="' + cls.rightConnectorPointOuterDiv + '" style="' +
            ((data.ganttProperties.isMilestone) ? ('left:' + (this.milestoneHeight - 2) + 'px;margin-top:' +
                pointerTop + 'px;') : ('left:' + (data.ganttProperties.width + pointerRight) + 'px;margin-top:' +
                    this.connectorPointMargin + 'px;')) + '">' +
            '<div class="' + cls.connectorPointRight + ' ' + this.parent.getUnscheduledTaskClass(data.ganttProperties) +
            '" style="width:' + this.connectorPointWidth + 'px;height:' + this.connectorPointWidth + 'px;">' +
            this.touchRightConnectorpoint + '</div></div>';
        return this.createDivElement(template);
    }

    /**
     * To get task label.
     *
     * @param {string} field .
     * @returns {string} .
     * @private
     */
    private getTaskLabel(field: string): string {
        const length: number = this.parent.ganttColumns.length;
        let resultString: string = null;
        if (!isNullOrUndefined(field) && field !== '') {
            if (field === this.parent.taskFields.resourceInfo) {
                resultString = this.getResourceName(this.templateData);
            } else {
                for (let i: number = 0; i < length; i++) {
                    if (field === this.parent.ganttColumns[i].field) {
                        resultString = this.getFieldValue(this.templateData[field]).toString();
                        break;
                    }
                }
                if (isNullOrUndefined(resultString)) {
                    return 'isCustomTemplate';
                }
            }
        } else {
            resultString = '';
        }
        return resultString;
    }

    private getExpandDisplayProp(data: IGanttData): string {
        data = this.templateData;
        if (this.parent.getExpandStatus(data)) {
            return 'table-row';
        }
        return 'none';
    }
    private getRowClassName(data: IGanttData): string {
        data = this.templateData;
        let rowClass: string = 'gridrowtaskId';
        const parentItem: IParent = data.parentItem;
        if (parentItem) {
            rowClass += parentItem.taskId.toString();
        }
        rowClass += 'level';
        rowClass += data.level.toString();
        return rowClass;
    }

    private getBorderRadius(data: IGanttData): number {
        data = this.templateData;
        const diff: number = data.ganttProperties.width - data.ganttProperties.progressWidth;
        if (diff <= 4) {
            return 4 - diff;
        } else {
            return 0;
        }
    }

    private getSplitTaskBorderRadius(data: ITaskSegment): number {
        const diff: number = data.width - data.progressWidth;
        if (diff <= 4) {
            return 4 - diff;
        } else {
            return 0;
        }
    }
    private taskNameWidth(ganttData: IGanttData): string {
        ganttData = this.templateData;
        const ganttProp: ITaskData = ganttData.ganttProperties;
        let width: number;
        if (ganttData.ganttProperties.isMilestone) {
            width = (ganttData.ganttProperties.left - (this.parent.getTaskbarHeight() / 2));
        } else if (ganttData.hasChildRecords && !ganttProp.isAutoSchedule) {
            if (!this.parent.allowUnscheduledTasks) {
                width = (ganttProp.autoStartDate.getTime() < ganttProp.startDate.getTime()) ?
                    ganttProp.autoLeft : ganttProp.left;
            } else {
                width = ganttProp.left < ganttProp.autoLeft ? ganttProp.left : ganttProp.autoLeft;
            }
        } else {
            width = ganttData.ganttProperties.left;
        }
        if (width < 0) {
            width = 0;
        }
        return width + 'px';
    }

    private getRightLabelLeft(ganttData: IGanttData): number {
        ganttData = this.templateData;
        const ganttProp: ITaskData = ganttData.ganttProperties;
        let left: number;
        let endLeft: number;
        let width: number;
        if (ganttData.ganttProperties.isMilestone) {
            return ganttData.ganttProperties.left + (this.parent.getTaskbarHeight() / 2);
        } else if (ganttData.hasChildRecords && !ganttProp.isAutoSchedule) {
            if (!this.parent.allowUnscheduledTasks) {
                left = ganttProp.autoStartDate.getTime() < ganttProp.startDate.getTime() ? ganttProp.autoLeft : ganttProp.left;
                endLeft = ganttProp.autoEndDate.getTime() < ganttProp.endDate.getTime() ?
                    this.parent.dataOperation.getTaskLeft(ganttProp.endDate, ganttProp.isMilestone) :
                    this.parent.dataOperation.getTaskLeft(ganttProp.autoEndDate, ganttProp.isMilestone);
                width = endLeft - left;
            } else {
                left = ganttProp.left < ganttProp.autoLeft ? ganttProp.left : ganttProp.autoLeft;
                width = ganttProp.autoWidth;
            }
            return left + width;
        } else {
            return ganttData.ganttProperties.left + ganttData.ganttProperties.width;
        }
    }

    private getExpandClass(data: IGanttData): string {
        data = this.templateData;
        if (data.expanded) {
            return cls.rowExpand;
        } else if (!data.expanded && data.hasChildRecords) {
            return cls.rowCollapse;
        }
        return '';
    }

    private getFieldValue(field: string | number): string | number {
        return isNullOrUndefined(field) ? '' : field;
    }

    private getResourceName(ganttData: IGanttData): string {
        ganttData = this.templateData;
        let resource: string = null;
        if (!isNullOrUndefined(ganttData.ganttProperties.resourceInfo)) {
            const length: number = ganttData.ganttProperties.resourceInfo.length;
            if (length > 0) {
                for (let i: number = 0; i < length; i++) {
                    let resourceName: string = ganttData.ganttProperties.resourceInfo[i][this.parent.resourceFields.name];
                    const resourceUnit: number = ganttData.ganttProperties.resourceInfo[i][this.parent.resourceFields.unit];
                    if (resourceUnit !== 100) {
                        resourceName += '[' + resourceUnit + '%' + ']';
                    }
                    if (isNullOrUndefined(resource)) {
                        resource = resourceName;
                    } else {
                        resource += ' , ' + resourceName;
                    }
                }
                return resource;
            } else {
                return '';
            }
        }
        return '';
    }

    /**
     * To initialize private variable help to render task bars.
     *
     * @returns {void}
     * @private
     */
    private initChartHelperPrivateVariable(): void {
        this.baselineColor = !isNullOrUndefined(this.parent.baselineColor) &&
            this.parent.baselineColor !== '' ? this.parent.baselineColor : null;
        this.taskBarHeight = isNullOrUndefined(this.parent.taskbarHeight) || this.parent.taskbarHeight >= this.parent.rowHeight ?
            Math.floor(this.parent.rowHeight * 0.62) : this.parent.taskbarHeight; // 0.62 -- Standard Ratio.
        if (this.parent.renderBaseline) {
            let height: number;
            if ((this.taskBarHeight + this.baselineHeight) <= this.parent.rowHeight) {
                height = this.taskBarHeight;
            } else {
                height = this.taskBarHeight - (this.baselineHeight + 1);
            }
            this.taskBarHeight = height;
        }
        this.milestoneHeight = Math.floor(this.taskBarHeight * 0.82); // 0.82 -- Standard Ratio.
        this.taskBarMarginTop = Math.floor((this.parent.rowHeight - this.taskBarHeight) / 2);
        this.milestoneMarginTop = Math.floor((this.parent.rowHeight - this.milestoneHeight) / 2);
        this.milesStoneRadius = Math.floor((this.milestoneHeight) / 2);
        this.baselineTop = -(Math.floor((this.parent.rowHeight - (this.taskBarHeight + this.taskBarMarginTop))) - 1);
        this.connectorPointWidth = this.parent.isAdaptive ? Math.round(this.taskBarHeight / 2) : 8;
        this.connectorPointMargin = Math.floor((this.taskBarHeight / 2) - (this.connectorPointWidth / 2));
    }

    /**
     * Function used to refresh Gantt rows.
     *
     * @returns {void}
     * @private
     */
    public refreshGanttRows(): void {
        this.parent.currentViewData = this.parent.treeGrid.getCurrentViewRecords().slice();
        this.createTaskbarTemplate();
        if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation) {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                const data: IGanttData = this.parent.currentViewData[i];
                if (data.childRecords.length > 0) {
                    this.parent.setRecordValue('workTimelineRanges', this.parent.dataOperation.mergeRangeCollections(data.ganttProperties.workTimelineRanges, true), data.ganttProperties, true);
                    this.parent.dataOperation.calculateRangeLeftWidth(data.ganttProperties.workTimelineRanges);
                }
            }
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
    }

    /**
     * To render taskbars.
     *
     * @returns {void}
     * @private
     */
    private createTaskbarTemplate(): void {
        this.updateTaskbarBlazorTemplate(false);
        const trs: Element[] = [].slice.call(this.ganttChartTableBody.querySelectorAll('tr'));
        this.ganttChartTableBody.innerHTML = '';
        const collapsedResourceRecord: IGanttData[] = [];
        const prevCurrentView: Object[] = this.parent.treeGridModule.prevCurrentView as object[];
        this.refreshedTr = []; this.refreshedData = [];
        if (this.parent.enableImmutableMode && prevCurrentView && prevCurrentView.length > 0 && this.isUpdated) {
            const oldKeys: object = {};
            const oldRowElements: Element[] = [];
            const key: string = this.parent.treeGrid.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < prevCurrentView.length; i++) {
                oldRowElements[i] = trs[i];
                oldKeys[prevCurrentView[i][key]] = i;
            }
            for (let index: number = 0; index < this.parent.currentViewData.length; index++) {
                const oldIndex: number = oldKeys[this.parent.currentViewData[index][key]];
                const modifiedRecIndex: number = this.parent.modifiedRecords.indexOf(this.parent.currentViewData[index]);
                if (isNullOrUndefined(oldIndex) || modifiedRecIndex !== -1) {
                    const tRow: Node = this.getGanttChartRow(index, this.parent.currentViewData[index]);
                    this.ganttChartTableBody.appendChild(tRow);
                    this.refreshedTr.push(this.ganttChartTableBody.querySelectorAll('tr')[index]);
                    this.refreshedData.push(this.parent.currentViewData[index]);
                } else {
                    this.ganttChartTableBody.appendChild(oldRowElements[oldIndex]);
                }
                this.ganttChartTableBody.querySelectorAll('tr')[index].setAttribute('aria-rowindex', index.toString());
            }
        }  else {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                const tempTemplateData: IGanttData = this.parent.currentViewData[i];
                if (this.parent.viewType === 'ResourceView' && !tempTemplateData.expanded && this.parent.enableMultiTaskbar) {
                    collapsedResourceRecord.push(tempTemplateData);
                }
                const tRow: Node = this.getGanttChartRow(i, tempTemplateData);
                this.ganttChartTableBody.appendChild(tRow);
                if (this.parent.enableImmutableMode) {
                    this.refreshedTr.push(this.ganttChartTableBody.querySelectorAll('tr')[i]);
                    this.refreshedData.push(this.parent.currentViewData[i]);
                }
                // To maintain selection when virtualization is enabled
                if (this.parent.selectionModule && this.parent.allowSelection) {
                    this.parent.selectionModule.maintainSelectedRecords(parseInt((tRow as Element).getAttribute('aria-rowindex'), 10));
                }
            }
        }
        this.triggerQueryTaskbarInfo();
        this.parent.modifiedRecords = [];
        if (collapsedResourceRecord.length) {
            for (let j: number = 0; j < collapsedResourceRecord.length; j++) {
                if (collapsedResourceRecord[j].hasChildRecords) {
                    this.parent.isGanttChartRendered = true;
                    this.parent.chartRowsModule.refreshRecords([collapsedResourceRecord[j]]);
                }
            }
        }
        this.parent.renderTemplates();
        this.updateTaskbarBlazorTemplate(true);
    }

    /**
     * To render taskbars.
     *
     * @param {number} i .
     * @param {IGanttData} tempTemplateData .
     * @returns {Node} .
     * @private
     */
    public getGanttChartRow(i: number, tempTemplateData: IGanttData): Node {
        this.templateData = tempTemplateData;
        let taskBaselineTemplateNode: NodeList = null;
        const parentTrNode: NodeList = this.getTableTrNode();
        const leftLabelNode: NodeList = this.getLeftLabelNode(i);
        const taskbarContainerNode: NodeList = this.taskbarContainer();
        (<HTMLElement>taskbarContainerNode[0]).setAttribute('aria-label', this.generateAriaLabel(this.templateData));
        (<HTMLElement>taskbarContainerNode[0]).setAttribute('rowUniqueId', this.templateData.ganttProperties.rowUniqueID);
        if (!this.templateData.hasChildRecords) {
            const connectorLineLeftNode: NodeList = this.getLeftPointNode();
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
        }
        if (this.templateData.hasChildRecords) {
            const parentTaskbarTemplateNode: NodeList = this.getParentTaskbarNode(i, taskbarContainerNode);
            if (!this.templateData.ganttProperties.isAutoSchedule) {
                const manualTaskbar: NodeList = this.getManualTaskbar();
                taskbarContainerNode[0].appendChild([].slice.call(manualTaskbar)[0]);
            }
            if (parentTaskbarTemplateNode && parentTaskbarTemplateNode.length > 0) {
                taskbarContainerNode[0].appendChild([].slice.call(parentTaskbarTemplateNode)[0]);
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.getTaskBaselineNode();
            }
        } else if (this.templateData.ganttProperties.isMilestone) {
            const milestoneTemplateNode: NodeList = this.getMilestoneNode(i, taskbarContainerNode);
            if (milestoneTemplateNode && milestoneTemplateNode.length > 0) {
                taskbarContainerNode[0].appendChild([].slice.call(milestoneTemplateNode)[0]);
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.getMilestoneBaselineNode();
            }
        } else {
            const scheduledTask: Boolean = isScheduledTask(this.templateData.ganttProperties);// eslint-disable-line
            let childTaskbarProgressResizeNode: NodeList = null; let childTaskbarRightResizeNode: NodeList = null;
            let childTaskbarLeftResizeNode: NodeList = null;
            if (!isNullOrUndefined(scheduledTask)) {
                if (scheduledTask || this.templateData.ganttProperties.duration) {
                    if (scheduledTask && (isNullOrUndefined(this.templateData.ganttProperties.segments)
                        || this.templateData.ganttProperties.segments.length <= 0)) {
                        childTaskbarProgressResizeNode = this.childTaskbarProgressResizer();
                        childTaskbarLeftResizeNode = this.childTaskbarLeftResizer();
                        childTaskbarRightResizeNode = this.childTaskbarRightResizer();
                    }
                }
                const childTaskbarTemplateNode: NodeList = this.getChildTaskbarNode(i, taskbarContainerNode);
                if (childTaskbarLeftResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarLeftResizeNode)[0]);
                }
                if (childTaskbarTemplateNode && childTaskbarTemplateNode.length > 0) {
                    if (this.templateData.ganttProperties.segments && this.templateData.ganttProperties.segments.length > 0) {
                        const length: number = this.templateData.ganttProperties.segments.length;
                        const connector: string = ('<div class="e-gantt-split-container-line"></div>');
                        let segmentConnector: NodeList = null;
                        segmentConnector = this.createDivElement(connector);
                        taskbarContainerNode[0].appendChild([].slice.call(segmentConnector)[0]);
                        for (let i: number = 0; i < length; i++) {
                            taskbarContainerNode[0].appendChild([].slice.call(childTaskbarTemplateNode)[0]);
                        }
                    } else {
                        taskbarContainerNode[0].appendChild([].slice.call(childTaskbarTemplateNode)[0]);
                    }
                }
                if (childTaskbarProgressResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarProgressResizeNode)[0]);
                }
                if (childTaskbarRightResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarRightResizeNode)[0]);
                }
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.getTaskBaselineNode();
            }
        }
        if (!this.templateData.hasChildRecords) {
            const connectorLineRightNode: NodeList = this.getRightPointNode();
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineRightNode)[0]);
        }
        const rightLabelNode: NodeList = this.getRightLabelNode(i);
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskbarContainerNode)[0]);
        if (this.templateData.ganttProperties.indicators && this.templateData.ganttProperties.indicators.length > 0) {
            let taskIndicatorNode: NodeList;
            let taskIndicatorTextFunction: Function;
            let taskIndicatorTextNode: NodeList;
            const indicators: IIndicator[] = this.templateData.ganttProperties.indicators;
            for (let indicatorIndex: number = 0; indicatorIndex < indicators.length; indicatorIndex++) {
                taskIndicatorNode = this.getIndicatorNode(indicators[indicatorIndex]);
                if (indicators[indicatorIndex].name.indexOf('$') > -1 || indicators[indicatorIndex].name.indexOf('#') > -1) {
                    taskIndicatorTextFunction = this.templateCompiler(indicators[indicatorIndex].name);
                    taskIndicatorTextNode = taskIndicatorTextFunction(
                        extend({ index: i }, this.templateData), this.parent, 'indicatorLabelText');
                } else {
                    const text: Element = createElement('Text');
                    text.innerHTML = indicators[indicatorIndex].name;
                    taskIndicatorTextNode = text.childNodes;
                }
                taskIndicatorNode[0].appendChild([].slice.call(taskIndicatorTextNode)[0]);
                (taskIndicatorNode[0] as HTMLElement).title =
                    !isNullOrUndefined(indicators[indicatorIndex].tooltip) ? indicators[indicatorIndex].tooltip : '';
                parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskIndicatorNode)[0]);
            }
        }
        if (rightLabelNode && rightLabelNode.length > 0) {
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(rightLabelNode)[0]);
        }
        if (!isNullOrUndefined(taskBaselineTemplateNode)) {
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskBaselineTemplateNode)[0]);
        }
        const tRow: Node = parentTrNode[0].childNodes[0];
        this.setAriaRowIndex(tempTemplateData, tRow);
        return tRow;
    }
    /**
     * To set aria-rowindex for chart rows
     *
     * @returns {void} .
     * @private
     */

    public setAriaRowIndex(tempTemplateData: IGanttData, tRow: Node): void {
        const dataSource: IGanttData[] = this.parent.treeGrid.getCurrentViewRecords() as IGanttData[];
        const visualData: IGanttData[] = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            getValue('virtualScrollModule.visualData', this.parent.treeGrid) : dataSource;
        const index: number = visualData.indexOf(tempTemplateData);
        (tRow as Element).setAttribute('aria-rowindex', index.toString());
    }
    /**
     * To trigger query taskbar info event.
     *
     * @returns {void}
     * @private
     */
    public triggerQueryTaskbarInfo(): void {
        if (!this.parent.queryTaskbarInfo) {
            return;
        }
        const length: number = this.parent.enableImmutableMode ?
            this.refreshedTr.length : this.ganttChartTableBody.querySelectorAll('tr').length;
        let trElement: Element;
        let data: IGanttData;
        for (let index: number = 0; index < length; index++) {
            trElement = this.parent.enableImmutableMode ? this.refreshedTr[index] : this.ganttChartTableBody.querySelectorAll('tr')[index];
            data = this.refreshedData.length > 0 ? this.refreshedData[index] : this.parent.currentViewData[index];
            const segmentLength: number = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length;
            if (segmentLength > 0) {
                for (let i: number = 0; i < segmentLength; i++) {
                    const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        trElement.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    const segmentElement: HTMLElement = segmentedTasks[i] as HTMLElement;
                    this.triggerQueryTaskbarInfoByIndex(segmentElement, data);
                }
            } else if (trElement) {
                this.triggerQueryTaskbarInfoByIndex(trElement, data);
            }
        }
    }
    /**
     *
     * @param {Element} trElement .
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public triggerQueryTaskbarInfoByIndex(trElement: Element, data: IGanttData): void {
        // eslint-disable-next-line
        const taskbarElement: Element = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length > 0 ? trElement :
            trElement.querySelector('.' + cls.taskBarMainContainer);
        let rowElement: Element;
        let triggerTaskbarElement: Element;
        const args: IQueryTaskbarInfoEventArgs = {
            data: data,
            rowElement: trElement,
            taskbarElement: taskbarElement,
            taskbarType: data.hasChildRecords ? 'ParentTask' : data.ganttProperties.isMilestone ? 'Milestone' : 'ChildTask'
        };
        const classCollections: string[] = this.getClassName(args);
        if (args.taskbarType === 'Milestone') {
            args.milestoneColor = taskbarElement.querySelector(classCollections[0]) ?
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderBottomColor : null;
            args.baselineColor = trElement.querySelector(classCollections[1]) ?
                getComputedStyle(trElement.querySelector(classCollections[1])).borderBottomColor : null;
        } else {
            const childTask: HTMLElement = taskbarElement.querySelector(classCollections[0]);
            const progressTask: HTMLElement = taskbarElement.querySelector(classCollections[1]);
            args.taskbarBgColor = isNullOrUndefined(childTask) ? null : taskbarElement.classList.contains(cls.traceChildTaskBar) ?
                getComputedStyle(taskbarElement).backgroundColor :
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor;
            args.taskbarBorderColor = isNullOrUndefined(childTask) ? null : taskbarElement.classList.contains(cls.traceChildTaskBar) ?
                getComputedStyle(taskbarElement).backgroundColor :
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderColor;
            args.progressBarBgColor = isNullOrUndefined(progressTask) ? null :
                taskbarElement.classList.contains(cls.traceChildProgressBar) ?
                    getComputedStyle(taskbarElement).backgroundColor :
                    getComputedStyle(taskbarElement.querySelector(classCollections[1])).backgroundColor;
            // args.progressBarBorderColor = taskbarElement.querySelector(progressBarClass) ?
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor : null;
            args.baselineColor = trElement.querySelector('.' + cls.baselineBar) ?
                getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).backgroundColor : null;
            args.taskLabelColor = taskbarElement.querySelector('.' + cls.taskLabel) ?
                getComputedStyle(taskbarElement.querySelector('.' + cls.taskLabel)).color : null;
        }
        args.rightLabelColor = trElement.querySelector('.' + cls.rightLabelContainer) &&
            (trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label) ?
            getComputedStyle((trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label)).color : null;
        args.leftLabelColor = trElement.querySelector('.' + cls.leftLabelContainer) &&
            (trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label) ?
            getComputedStyle((trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label)).color : null;
        this.parent.trigger('queryTaskbarInfo', args, (taskbarArgs: IQueryTaskbarInfoEventArgs) => {
            this.updateQueryTaskbarInfoArgs(taskbarArgs, rowElement, triggerTaskbarElement);
        });
    }

    /**
     * To update query taskbar info args.
     *
     * @param {IQueryTaskbarInfoEventArgs} args .
     * @param {Element} rowElement .
     * @param {Element} taskBarElement .
     * @returns {void}
     * @private
     */
    private updateQueryTaskbarInfoArgs(args: IQueryTaskbarInfoEventArgs, rowElement?: Element, taskBarElement?: Element): void {
        const trElement: Element = args.rowElement;
        const taskbarElement: Element = args.taskbarElement;
        const classCollections: string[] = this.getClassName(args);
        if (args.taskbarType === 'Milestone') {
            if (taskbarElement.querySelector(classCollections[0]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderBottomColor !== args.milestoneColor) {
                (taskbarElement.querySelector(classCollections[0]) as HTMLElement).style.borderBottomColor = args.milestoneColor;
                (taskbarElement.querySelector('.' + cls.milestoneBottom) as HTMLElement).style.borderTopColor = args.milestoneColor;
            }
            if (trElement.querySelector(classCollections[1]) &&
                getComputedStyle(trElement.querySelector(classCollections[1])).borderTopColor !== args.baselineColor) {
                (trElement.querySelector(classCollections[1]) as HTMLElement).style.borderBottomColor = args.baselineColor;
                (trElement.querySelector('.' + cls.baselineMilestoneBottom) as HTMLElement).style.borderTopColor = args.baselineColor;
            }
        } else {
            if (taskbarElement.querySelector(classCollections[0]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor !== args.taskbarBgColor) {
                (taskbarElement.querySelector(classCollections[0]) as HTMLElement).style.backgroundColor = args.taskbarBgColor;
            }
            if (taskbarElement.querySelector(classCollections[0]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderColor !== args.taskbarBorderColor) {
                (taskbarElement.querySelector(classCollections[0]) as HTMLElement).style.borderColor = args.taskbarBorderColor;
            }
            if (taskbarElement.querySelector(classCollections[1]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[1])).backgroundColor !== args.progressBarBgColor) {
                (taskbarElement.querySelector(classCollections[1]) as HTMLElement).style.backgroundColor = args.progressBarBgColor;
            }

            if (taskbarElement.classList.contains(cls.traceChildTaskBar) &&
                getComputedStyle(taskbarElement).backgroundColor !== args.taskbarBgColor) {
                (taskbarElement as HTMLElement).style.backgroundColor = args.taskbarBgColor;
            }

            if (taskbarElement.classList.contains(cls.traceChildTaskBar) &&
                getComputedStyle(taskbarElement).borderColor !== args.taskbarBorderColor) {
                (taskbarElement as HTMLElement).style.borderColor = args.taskbarBorderColor;
            }

            if (taskbarElement.classList.contains(cls.traceChildProgressBar) &&
                getComputedStyle(taskbarElement).backgroundColor !== args.progressBarBgColor) {
                (taskbarElement as HTMLElement).style.backgroundColor = args.progressBarBgColor;
            }
            // if (taskbarElement.querySelector(progressBarClass) &&
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor !== args.progressBarBorderColor) {
            //     (taskbarElement.querySelector(progressBarClass) as HTMLElement).style.borderColor = args.progressBarBorderColor;
            // }
            if (taskbarElement.querySelector('.' + cls.taskLabel) &&
                getComputedStyle(taskbarElement.querySelector('.' + cls.taskLabel)).color !== args.taskLabelColor) {
                (taskbarElement.querySelector('.' + cls.taskLabel) as HTMLElement).style.color = args.taskLabelColor;
            }
            if (trElement.querySelector('.' + cls.baselineBar) &&
                getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).backgroundColor !== args.baselineColor) {
                (trElement.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor = args.baselineColor;
            }
        }
        if (trElement.querySelector('.' + cls.leftLabelContainer) &&
            (trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label) &&
            getComputedStyle(
                (trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label)).color !== args.leftLabelColor) {
            ((trElement.querySelector(
                '.' + cls.leftLabelContainer)).querySelector('.' + cls.label) as HTMLElement).style.color = args.leftLabelColor;
        }
        if (trElement.querySelector('.' + cls.rightLabelContainer) &&
            (trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label) &&
            getComputedStyle(
                (trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label)).color !== args.rightLabelColor) {
            ((trElement.querySelector(
                '.' + cls.rightLabelContainer)).querySelector('.' + cls.label) as HTMLElement).style.color = args.rightLabelColor;
        }
    }
    private getClassName(args: IQueryTaskbarInfoEventArgs): string[] {
        const classCollection: string[] = [];
        classCollection.push('.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentTaskBar : args.taskbarType === 'ChildTask' ? cls.traceChildTaskBar : cls.milestoneTop));
        classCollection.push('.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentProgressBar : args.taskbarType === 'ChildTask' ? cls.traceChildProgressBar : cls.baselineMilestoneTop));
        return classCollection;
    }
    /**
     * To compile template string.
     *
     * @param {string} template .
     * @returns {Function} .
     * @private
     */
    public templateCompiler(template: string): Function {
        if (!isNullOrUndefined(template) && template !== '') {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim(), this.parent);
                } else {
                    return compile(template, this.parent);
                }
            } catch (e) {
                return compile(template, this.parent);
            }
        }
        return null;
    }

    /**
     * To refresh edited TR
     *
     * @param {number} index .
     * @param {boolean} isValidateRange .
     * @returns {void} .
     * @private
     */
    public refreshRow(index: number, isValidateRange?: boolean): void {
        const tr: Node = this.ganttChartTableBody.childNodes[index];
        const selectedItem: IGanttData = this.parent.currentViewData[index];
        if (index !== -1 && selectedItem) {
            const data: IGanttData = selectedItem;
            if (this.parent.viewType === 'ResourceView' && data.hasChildRecords && !data.expanded && this.parent.enableMultiTaskbar) {
                tr.replaceChild(this.getResourceParent(data).childNodes[0], tr.childNodes[0]);
            } else {
                tr.replaceChild(this.getGanttChartRow(index, data).childNodes[0], tr.childNodes[0]);
            }
            if (this.parent.viewType === 'ResourceView' && data.hasChildRecords && this.parent.showOverAllocation) {
                if (isValidateRange) {
                    this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
                } else {
                    this.parent.dataOperation.updateOverlappingValues(data);
                    this.parent.ganttChartModule.renderRangeContainer([data]);
                }
            }
            const segmentLength: number = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length;
            if (segmentLength > 0) {
                for (let i: number = 0; i < segmentLength; i++) {
                    const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        (tr as Element).getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    const segmentElement: HTMLElement = segmentedTasks[i] as HTMLElement;
                    this.triggerQueryTaskbarInfoByIndex(segmentElement, data);
                }
            } else {
                this.triggerQueryTaskbarInfoByIndex(tr as Element, data);
            }
            const dataId: number | string = this.parent.viewType === 'ProjectView' ? data.ganttProperties.taskId : data.ganttProperties.rowUniqueID;
            this.parent.treeGrid.grid.setRowData(dataId, data);
            const row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                this.parent.treeGrid.grid.getDataRows()[index].getAttribute('data-uid'));
            row.data = data;
        }
    }

    private getResourceParent(record: IGanttData): Node {
        const chartRows: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
        this.templateData = record;
        const parentTrNode: NodeList = this.getTableTrNode();
        const leftLabelNode: NodeList = this.leftLabelContainer();
        const collapseParent: HTMLElement = createElement('div', {
            className: 'e-collapse-parent'
        });
        parentTrNode[0].childNodes[0].childNodes[0].appendChild(collapseParent);
        const tasks: IGanttData[] = this.parent.dataOperation.setSortedChildTasks(record);
        this.parent.dataOperation.updateOverlappingIndex(tasks);
        for (let i: number = 0; i < chartRows.length; i++) {
            if ((<HTMLElement>chartRows[i]).classList.contains('gridrowtaskId'
                + record.ganttProperties.rowUniqueID + 'level' + (record.level + 1))) {
                const cloneElement: HTMLElement = chartRows[i].querySelector('.e-taskbar-main-container');
                addClass([cloneElement], 'collpse-parent-border');
                const id: string = chartRows[i].querySelector('.' + cls.taskBarMainContainer).getAttribute('rowUniqueId');
                const ganttData: IGanttData = this.parent.getRecordByID(id);
                const zIndex: string = (ganttData.ganttProperties.eOverlapIndex).toString();
                const cloneChildElement: HTMLElement = cloneElement.cloneNode(true) as HTMLElement;
                cloneChildElement.style.zIndex = zIndex;
                parentTrNode[0].childNodes[0].childNodes[0].childNodes[0].appendChild(cloneChildElement);
            }
        }
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
        return parentTrNode[0].childNodes[0];
    }
    /**
     * To refresh all edited records
     *
     * @param {IGanttData} items .
     * @param {boolean} isValidateRange .
     * @returns {void} .
     * @private
     */
    public refreshRecords(items: IGanttData[], isValidateRange?: boolean): void {
        if (this.parent.isGanttChartRendered) {
            this.updateTaskbarBlazorTemplate(false);
            this.parent.renderTemplates();
            if (this.parent.viewType === 'ResourceView' && this.parent.enableMultiTaskbar) {
                let sortedRecords: IGanttData[] = [];
                sortedRecords = new DataManager(items).executeLocal(new Query()
                    .sortBy('expanded', 'Descending'));
                items = sortedRecords;
            }
            for (let i: number = 0; i < items.length; i++) {
                const index: number = this.parent.currentViewData.indexOf(items[i]);
                this.refreshRow(index, isValidateRange);
            }
            this.parent.ganttChartModule.updateLastRowBottomWidth();
            this.updateTaskbarBlazorTemplate(true);
        }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('renderPanels', this.createChartTable);
        this.parent.off('dataReady', this.initiateTemplates);
        this.parent.off('destroy', this.destroy);
    }
    private destroy(): void {
        this.removeEventListener();
    }

    private generateAriaLabel(data: IGanttData): string {
        data = this.templateData;
        let defaultValue: string = '';
        const nameConstant: string = this.parent.localeObj.getConstant('name');
        const startDateConstant: string = this.parent.localeObj.getConstant('startDate');
        const endDateConstant: string = this.parent.localeObj.getConstant('endDate');
        const durationConstant: string = this.parent.localeObj.getConstant('duration');
        const taskNameVal: string = data.ganttProperties.taskName;
        const startDateVal: Date = data.ganttProperties.startDate;
        const endDateVal: Date = data.ganttProperties.endDate;
        const durationVal: number = data.ganttProperties.duration;

        if (data.ganttProperties.isMilestone) {
            defaultValue = nameConstant + ' ' + taskNameVal + ' ' + startDateConstant + ' '
                + this.parent.getFormatedDate(startDateVal);
        } else {
            if (taskNameVal) {
                defaultValue += nameConstant + ' ' + taskNameVal + ' ';
            }
            if (startDateVal) {
                defaultValue += startDateConstant + ' ' + this.parent.getFormatedDate(startDateVal) + ' ';
            }
            if (endDateVal) {
                defaultValue += endDateConstant + ' ' + this.parent.getFormatedDate(endDateVal) + ' ';
            }
            if (durationVal) {
                defaultValue += durationConstant + ' '
                    + this.parent.getDurationString(durationVal, data.ganttProperties.durationUnit);
            }
        }
        return defaultValue;
    }

    private generateSpiltTaskAriaLabel(data: ITaskSegment, ganttProp: ITaskData): string {
        let defaultValue: string = '';
        const startDateConstant: string = this.parent.localeObj.getConstant('startDate');
        const endDateConstant: string = this.parent.localeObj.getConstant('endDate');
        const durationConstant: string = this.parent.localeObj.getConstant('duration');
        const startDateVal: Date = data.startDate;
        const endDateVal: Date = data.endDate;
        const durationVal: number = data.duration;
        if (startDateVal) {
            defaultValue += startDateConstant + ' ' + this.parent.getFormatedDate(startDateVal) + ' ';
        }
        if (endDateVal) {
            defaultValue += endDateConstant + ' ' + this.parent.getFormatedDate(endDateVal) + ' ';
        }
        if (durationVal) {
            defaultValue += durationConstant + ' '
                + this.parent.getDurationString(durationVal, ganttProp.durationUnit);
        }
        return defaultValue;
    }

    private generateTaskLabelAriaLabel(type: string): string {
        let label: string = '';
        if (type === 'left' && this.parent.labelSettings.leftLabel && !this.leftTaskLabelTemplateFunction) {
            label += this.parent.localeObj.getConstant('leftTaskLabel') +
                ' ' + this.getTaskLabel(this.parent.labelSettings.leftLabel);
        } else if (type === 'right' && this.parent.labelSettings.rightLabel && !this.rightTaskLabelTemplateFunction) {
            label += this.parent.localeObj.getConstant('rightTaskLabel') +
                ' ' + this.getTaskLabel(this.parent.labelSettings.rightLabel);
        }
        return label;
    }
}
