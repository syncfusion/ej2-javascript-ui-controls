import { createElement, isNullOrUndefined, extend, compile, getValue } from '@syncfusion/ej2-base';
import { formatUnit, updateBlazorTemplate, resetBlazorTemplate, isBlazor, addClass } from '@syncfusion/ej2-base';
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

    constructor(ganttObj?: Gantt) {
        super(ganttObj);
        this.parent = ganttObj;
        this.initPublicProp();
        this.addEventListener();
    }

    /**
     * To initialize the public property.
     * @return {void}
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
        this.refreshGanttRows();
    }

    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    private createChartTable(): void {
        this.taskTable = createElement('table', {
            className: cls.taskTable + ' ' + cls.zeroSpacing, id: 'GanttTaskTable' + this.parent.element.id,
            styles: 'z-index: 2;position: absolute;width:' + this.parent.timelineModule.totalTimelineWidth + 'px;',
            attrs: { cellspacing: '0.25px' }
        });
        let colgroup: Element = createElement('colgroup');
        let column: Element = createElement('col', { styles: 'width:' + this.parent.timelineModule.totalTimelineWidth + 'px;' });
        colgroup.appendChild(column);
        this.taskTable.appendChild(colgroup);
        this.ganttChartTableBody = createElement('tbody', {
            id: this.parent.element.id + 'GanttTaskTableBody'
        });
        this.taskTable.appendChild(this.ganttChartTableBody);
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            this.parent.ganttChartModule.virtualRender.renderWrapper();
            let wrapper: HTMLElement = getValue('wrapper', this.parent.ganttChartModule.virtualRender);
            wrapper.style.transform = 'translate(0px, 0px)';
        } else {
            this.parent.ganttChartModule.chartBodyContent.appendChild(this.taskTable);
        }
    }

    public initiateTemplates(): void {
        this.taskTable.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.initChartHelperPrivateVariable();
        this.initializeChartTemplate();
    }
    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    public renderChartRows(): void {
        this.createTaskbarTemplate();
        this.parent.isGanttChartRendered = true;
    }

    /**
     * To get gantt Indicator.
     * @return {NodeList}
     * @private
     */
    private getIndicatorNode(indicator: IIndicator): NodeList {
        let templateString: string = '<label class="' + cls.label + ' ' + cls.taskIndicatorDiv + '"  style="line-height:'
            + (this.parent.rowHeight) + 'px;' +
            'left:' + this.getIndicatorleft(indicator.date) + 'px;"><i class="' + indicator.iconClass + '"></i> </label>';
        return this.createDivElement(templateString);
    }

    /**
     * To get gantt Indicator.
     * @return {number}
     * @private
     */
    public getIndicatorleft(date: Date | string): number {
        date = this.parent.dateValidationModule.getDateFromFormat(date);
        let left: number = this.parent.dataOperation.getTaskLeft(date, false);
        return left;
    }

    /**
     * To get child taskbar Node.
     * @return {NodeList}
     * @private
     */
    private getChildTaskbarNode(i: number, rootElement?: NodeList): NodeList {
        let childTaskbarNode: NodeList = null;
        let data: IGanttData = this.templateData;
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
                let taskLabelTemplateNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false, undefined, progressDiv[0]);
                if (taskLabelTemplateNode && taskLabelTemplateNode.length > 0) {
                    let tempDiv: Element = createElement('div');
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
            let template: string = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length > 0 ?
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
                isNullOrUndefined(data.ganttProperties.segments)) {
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
        let width: number = 0;
        for (let i: number = 0; i < data.ganttProperties.segments.length; i++) {
            let segment: ITaskSegment = data.ganttProperties.segments[i];
            let segmentPosition: string = (i === 0) ? 'e-segment-first' : (i === data.ganttProperties.segments.length - 1)
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
        let lResizerLeft: number = -(this.parent.isAdaptive ? 12 : 2);
        let template: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            ' style="left:' + lResizerLeft + 'px;height:' + (this.taskBarHeight) + 'px;"></div>';
        return template;
    }

    private getSplitTaskbarRightResizerNode(segment: ITaskSegment): string {
        let rResizerLeft: number = this.parent.isAdaptive ? -2 : -10;
        let template: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            ' style="left:' + (segment.width + rResizerLeft) + 'px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        return template;
    }

    private getSplitProgressResizerNode(segment: ITaskSegment): string {
        let template: string = '<div class="' + cls.childProgressResizer + '"' +
            ' style="left:' + (segment.progressWidth - 6) + 'px;margin-top:' +
            (this.taskBarHeight - 4) + 'px;"><div class="' + cls.progressBarHandler + '"' +
            '><div class="' + cls.progressHandlerElement + '"></div>' +
            '<div class="' + cls.progressBarHandlerAfter + '"></div></div>';
        return template;
    }

    public getSegmentIndex(splitStartDate: Date, record: IGanttData): number {
        let segmentIndex: number = -1;
        let ganttProp: ITaskData = record.ganttProperties;
        let segments: ITaskSegment[] = ganttProp.segments;
        if (!isNullOrUndefined(segments)) {
            segments.sort((a: ITaskSegment, b: ITaskSegment) => {
                return a.startDate.getTime() - b.startDate.getTime();
            });
            let length: number = segments.length;
            for (let i: number = 0; i < length; i++) {
                let segment: ITaskSegment = segments[i];
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
        return segmentIndex;
    }

    public mergeTask(taskId: number | string, segmentIndexes: { firstSegmentIndex: number, secondSegmentIndex: number }[]): void {
        let indexes: { firstSegmentIndex: number, secondSegmentIndex: number }[] = segmentIndexes;
        let mergeArrayLength: number = segmentIndexes.length;
        let taskFields: TaskFieldsModel = this.parent.taskFields;
        let mergeData: IGanttData = this.parent.flatData.filter((x: IGanttData): IGanttData => {
            if (x[taskFields.id] === taskId) {
                return x;
            } else {
                return null;
            }
        })[0];
        let segments: ITaskSegment[] = mergeData.ganttProperties.segments;
        segmentIndexes = segmentIndexes.sort((a: { firstSegmentIndex: number, secondSegmentIndex: number },
            b: { firstSegmentIndex: number, secondSegmentIndex: number }): number => {
            return b.firstSegmentIndex - a.firstSegmentIndex;
        });
        for (let arrayLength: number = 0; arrayLength < mergeArrayLength; arrayLength++) {
            let segment: ITaskSegment;
            let firstSegment: ITaskSegment = segments[segmentIndexes[arrayLength].firstSegmentIndex];
            let secondSegment: ITaskSegment = segments[segmentIndexes[arrayLength].secondSegmentIndex];
            let duration: number = firstSegment.duration + secondSegment.duration;
            let endDate: Date = this.parent.dataOperation.getEndDate(
                firstSegment.startDate, duration, mergeData.ganttProperties.durationUnit, mergeData.ganttProperties, false
            );
            segment = {
                startDate: firstSegment.startDate,
                endDate: endDate,
                duration: duration
            };
            let insertIndex: number = segmentIndexes[arrayLength].firstSegmentIndex;
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
            this.refreshRecords(this.parent.currentViewData);
        } else {
            this.refreshRow(this.parent.currentViewData.indexOf(data));
        }
        let tr: Element = this.ganttChartTableBody.querySelectorAll('tr')[this.parent.currentViewData.indexOf(data)];
        this.triggerQueryTaskbarInfoByIndex(tr, data);
        this.parent.selectionModule.clearSelection();
        let args: CObject = {
            requestType: requestType,
            rowData: data
        };
        this.parent.trigger('actionComplete', args);
    }

    /**
     * public method to split task bar.
     * @public
     */

    public splitTask(taskId: number | string, splitDates: Date | Date[]): void {
        let taskFields: TaskFieldsModel = this.parent.taskFields;
        let splitDate: Date = splitDates as Date;
        let splitRecord: IGanttData = this.parent.flatData.filter((x: IGanttData): IGanttData => {
            if (x[taskFields.id] === taskId) {
                return x;
            } else {
                return null;
            }
        })[0];
        let ganttProp: ITaskData = splitRecord.ganttProperties;
        this.dropSplit = false;
        let segmentIndex: number = -1;
        let segments: ITaskSegment[] = ganttProp.segments;
        if (isNullOrUndefined((splitDates as Date[]).length) || (splitDates as Date[]).length < 0) {
            let splitStartDate: Date = this.parent.dataOperation.checkStartDate(splitDate, ganttProp, false);
            if (splitStartDate.getTime() !== ganttProp.startDate.getTime()) {
                if (ganttProp.isAutoSchedule) {
                    if (!isNullOrUndefined(segments)) {
                        segmentIndex = this.getSegmentIndex(splitStartDate, splitRecord);
                    }
                    //check atleast one day difference is there to split
                    if (this.dropSplit === false && (splitDate as Date).getTime() > ganttProp.startDate.getTime() &&
                        (splitDate as Date).getTime() < ganttProp.endDate.getTime()) {
                        segments = segmentIndex !== -1 ? segments : [];
                        let startDate: Date = segmentIndex !== -1 ?
                            segments[segmentIndex].startDate : new Date(ganttProp.startDate.getTime());
                        let endDate: Date = segmentIndex !== -1 ? segments[segmentIndex].endDate : new Date(ganttProp.endDate.getTime());
                        let segmentDuration: number = this.parent.dataOperation.getDuration(
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
            (splitDates as Date[]).sort();
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
        let segmentsArray: ITaskSegment[] = [];
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
        let ganttProp: ITaskData = ganttData.ganttProperties;
        let taskFields: TaskFieldsModel = this.parent.taskFields;
        startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
        let segmentEndDate: Date = new Date(splitDate.getTime());
        segmentEndDate = this.parent.dataOperation.checkEndDate(segmentEndDate, ganttProp, false);
        let checkClickState: number = this.parent.nonWorkingDayIndex.indexOf(splitDate.getDay());
        let increment: number = checkClickState === -1 ? 0 : checkClickState === 0 ? 1 : 2;
        for (let i: number = 0; i < 2; i++) {
            let segment: ITaskSegment = {
                startDate: startDate,
                endDate: segmentEndDate,
                duration: this.parent.dataOperation.getDuration(
                    startDate, segmentEndDate, ganttProp.durationUnit,
                    ganttProp.isAutoSchedule, ganttProp.isMilestone),
                offsetDuration: 1
            };
            if (segmentIndex !== -1) {
                segments.splice(segmentIndex, 1);
                segmentIndex = -1;
            }
            segments.push(segment);
            startDate = new Date(splitDate.getTime());
            startDate.setDate(startDate.getDate() + 1 + increment);
            startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
            segmentEndDate = new Date(endDate.getTime());
            segmentEndDate.setDate(segmentEndDate.getDate() + 1);
            let endDateState: number = this.parent.nonWorkingDayIndex.indexOf(segmentEndDate.getDay());
            if (endDateState !== -1) {
                let diff: number = segmentDuration - segment.duration;
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
        let ganttProp: ITaskData = ganttData.ganttProperties;
        for (let i: number = segmentIndex + 1; i < segments.length; i++) {
            let segment: ITaskSegment = segments[i];
            let endDate: Date;
            let startDate: Date = i !== 0 ? new Date(segments[i - 1].endDate.getTime()) : new Date(segment.startDate.getTime());
            startDate = this.parent.dataOperation.getEndDate(startDate, segment.offsetDuration, ganttProp.durationUnit, ganttProp, false);
            startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
            segment.startDate = startDate;
            endDate = segment.endDate = this.parent.dataOperation.getEndDate(
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
     * @return {NodeList}
     * @private
     */
    private getMilestoneNode(i: number, rootElement?: NodeList): NodeList {
        let milestoneNode: NodeList = null;
        let data: IGanttData = this.templateData;
        if (this.milestoneTemplateFunction) {
            milestoneNode = this.milestoneTemplateFunction(
                extend({ index: i }, data), this.parent, 'MilestoneTemplate',
                this.getTemplateID('MilestoneTemplate'), false, undefined, rootElement[0]);
        } else {
            let template: string = '<div class="' + cls.traceMilestone + '" style="position:absolute;">' +
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
     * @return {NodeList}
     * @private
     */
    private getTaskBaselineNode(): NodeList {
        let data: IGanttData = this.templateData;
        let template: string = '<div class="' + cls.baselineBar + ' ' + '" style="margin-top:' + this.baselineTop +
            'px;left:' + data.ganttProperties.baselineLeft + 'px;' +
            'width:' + data.ganttProperties.baselineWidth + 'px;height:' +
            this.baselineHeight + 'px;' + (this.baselineColor ? 'background-color: ' + this.baselineColor + ';' : '') + '"></div>';
        return this.createDivElement(template);
    }

    /**
     * To get milestone baseline node.
     * @return {NodeList}
     * @private
     */
    private getMilestoneBaselineNode(): NodeList {
        let data: IGanttData = this.templateData;
        let template: string = '<div class="' + cls.baselineMilestoneContainer + ' ' + '" style="' +
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
     * @return {NodeList}
     * @private
     */
    private getLeftLabelNode(i: number): NodeList {
        let leftLabelNode: NodeList = this.leftLabelContainer();
        (<HTMLElement>leftLabelNode[0]).setAttribute('aria-label', this.generateTaskLabelAriaLabel('left'));
        let leftLabelTemplateNode: NodeList = null;
        if (this.leftTaskLabelTemplateFunction) {
            leftLabelTemplateNode = this.leftTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'LeftLabelTemplate',
                this.getTemplateID('LeftLabelTemplate'), false, undefined, leftLabelNode[0]);
        } else {
            let field: string = this.parent.labelSettings.leftLabel;
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
        let templateString: HTMLElement = createElement('div', {
            className: labelDiv, styles: 'height:' + (this.taskBarHeight) + 'px;' +
                'margin-top:' + this.taskBarMarginTop + 'px;'
        });
        let spanElem: HTMLElement = createElement('span', { className: cls.label });
        let property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
        spanElem[property] = labelString;
        templateString.appendChild(spanElem);
        let div: HTMLElement = createElement('div');
        div.appendChild(templateString);
        return div.childNodes;
    }
    /**
     * To get right label node.
     * @return {NodeList}
     * @private
     */
    private getRightLabelNode(i: number): NodeList {
        let rightLabelNode: NodeList = this.rightLabelContainer();
        (<HTMLElement>rightLabelNode[0]).setAttribute('aria-label', this.generateTaskLabelAriaLabel('right'));
        let rightLabelTemplateNode: NodeList = null;
        if (this.rightTaskLabelTemplateFunction) {
            rightLabelTemplateNode = this.rightTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'RightLabelTemplate',
                this.getTemplateID('RightLabelTemplate'), false, undefined, rightLabelNode[0]);
        } else {
            let field: string = this.parent.labelSettings.rightLabel;
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
        let data: IGanttData = this.templateData;
        let taskbarHeight: number = (this.taskBarHeight / 2 - 1);
        let innerDiv: string = (data.ganttProperties.startDate && data.ganttProperties.endDate && data.ganttProperties.duration) ?
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
        let template: string = '<div class="' + cls.manualParentMainContainer + '"' +
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
        let milestoneTemplate: string = '<div class="' + cls.manualParentMilestone + '" style="position:absolute;left:' +
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
     * @return {NodeList}
     * @private
     */
    private getParentTaskbarNode(i: number, rootElement?: NodeList): NodeList {
        let parentTaskbarNode: NodeList = null;
        let data: IGanttData = this.templateData;
        if (this.parentTaskbarTemplateFunction) {
            parentTaskbarNode = this.parentTaskbarTemplateFunction(
                extend({ index: i }, data), this.parent, 'ParentTaskbarTemplate',
                this.getTemplateID('ParentTaskbarTemplate'), false, undefined, rootElement[0]);
        } else {
            let labelString: string = ''; let labelDiv: NodeList;
            let tHeight: number = this.taskBarHeight / 5;
            let template: NodeList = this.createDivElement('<div class="' + cls.parentTaskBarInnerDiv + ' ' +
                this.getExpandClass(data) + ' ' + cls.traceParentTaskBar + '"' +
                ' style="width:' + (data.ganttProperties.isAutoSchedule ? data.ganttProperties.width :
                    data.ganttProperties.autoWidth) + 'px;height:' + (data.ganttProperties.isAutoSchedule ? this.taskBarHeight :
                        (tHeight * 3)) + 'px;margin-top:' + (data.ganttProperties.isAutoSchedule ? '' :
                            (tHeight * 2)) + 'px;">' +
                '</div>');
            let progressBarInnerDiv: NodeList = this.createDivElement('<div class="' + cls.parentProgressBarInnerDiv + ' ' +
             this.getExpandClass(data) + ' ' + cls.traceParentProgressBar + '"' +
                ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                'width:' + data.ganttProperties.progressWidth + 'px;' +
                'border-top-right-radius:' + this.getBorderRadius(data) + 'px;' +
                'border-bottom-right-radius:' + this.getBorderRadius(data) + 'px;height:100%;"></div>');
            if (this.taskLabelTemplateFunction) {
                let parentTaskLabelNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false, undefined, progressBarInnerDiv[0]);
                if (parentTaskLabelNode && parentTaskLabelNode.length > 0) {
                    let div: Element = createElement('div');
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
            let milestoneTemplate: string = '<div class="' + cls.parentMilestone + '" style="position:absolute;">' +
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
     * @return {NodeList}
     * @private
     */
    private getTableTrNode(): NodeList {
        let table: Element = createElement('table');
        let className: string = (this.parent.gridLines === 'Horizontal' || this.parent.gridLines === 'Both') ?
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
     * @return {void}
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
        let div: Element = createElement('div');
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
    /** @private */
    public getTemplateID(templateName: string): string {
        let ganttID: string = this.parent.element.id;
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
        let template: string = '<div class="' + ((this.leftTaskLabelTemplateFunction) ? cls.leftLabelTempContainer :
            cls.leftLabelContainer) + ' ' + '" tabindex="-1" style="height:' +
            (this.parent.rowHeight - 1) + 'px;width:' + this.taskNameWidth(this.templateData) + '"></div>';
        return this.createDivElement(template);
    }

    private taskbarContainer(): NodeList {
        let data: IGanttData = this.templateData;
        let manualParent: boolean = this.parent.editModule && this.parent.editSettings.allowTaskbarEditing &&
            this.parent.editModule.taskbarEditModule.taskBarEditAction === 'ParentResizing' ?
            true : false;
        let template: string = '<div class="' + cls.taskBarMainContainer + ' ' +
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
        let template: string = '<div class="' + ((this.rightTaskLabelTemplateFunction) ? cls.rightLabelTempContainer :
            cls.rightLabelContainer) + '" ' + ' tabindex="-1" style="left:' + this.getRightLabelLeft(this.templateData) + 'px;height:'
            + (this.parent.rowHeight - 1) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarLeftResizer(): NodeList {
        let lResizerLeft: number = -(this.parent.isAdaptive ? 12 : 2);
        let template: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            ' style="left:' + lResizerLeft + 'px;height:' + (this.taskBarHeight) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarRightResizer(): NodeList {
        let rResizerLeft: number = this.parent.isAdaptive ? -2 : -10;
        let template: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            ' style="left:' + (this.templateData.ganttProperties.width + rResizerLeft) + 'px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarProgressResizer(): NodeList {
        let template: string = '<div class="' + cls.childProgressResizer + '"' +
            ' style="left:' + (this.templateData.ganttProperties.progressWidth - 6) + 'px;margin-top:' +
            (this.taskBarHeight - 4) + 'px;"><div class="' + cls.progressBarHandler + '"' +
            '><div class="' + cls.progressHandlerElement + '"></div>' +
            '<div class="' + cls.progressBarHandlerAfter + '"></div></div>';
        return this.createDivElement(template);
    }

    private getLeftPointNode(): NodeList {
        let data: IGanttData = this.templateData;
        let pointerLeft: number = -((this.parent.isAdaptive ? 14 : 2) + this.connectorPointWidth);
        let mileStoneLeft: number = -(this.connectorPointWidth + 2);
        let pointerTop: number = Math.floor(this.milesStoneRadius - (this.connectorPointWidth / 2));
        let template: string = '<div class="' + cls.leftConnectorPointOuterDiv + '" style="' +
            ((data.ganttProperties.isMilestone) ? ('margin-top:' + pointerTop + 'px;left:' + mileStoneLeft +
                'px;') : ('margin-top:' + this.connectorPointMargin + 'px;left:' + pointerLeft + 'px;')) + '">' +
            '<div class="' + cls.connectorPointLeft + ' ' + this.parent.getUnscheduledTaskClass(data.ganttProperties) +
            '" style="width: ' + this.connectorPointWidth + 'px;' +
            'height: ' + this.connectorPointWidth + 'px;">' + this.touchLeftConnectorpoint + '</div></div>';
        return this.createDivElement(template);
    }

    private getRightPointNode(): NodeList {
        let data: IGanttData = this.templateData;
        let pointerRight: number = this.parent.isAdaptive ? 10 : -2;
        let pointerTop: number = Math.floor(this.milesStoneRadius - (this.connectorPointWidth / 2));
        let template: string = '<div class="' + cls.rightConnectorPointOuterDiv + '" style="' +
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
     * @return {string}
     * @private
     */
    private getTaskLabel(field: string): string {
        let length: number = this.parent.ganttColumns.length;
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
        let parentItem: IParent = data.parentItem;
        if (parentItem) {
            rowClass += parentItem.taskId.toString();
        }
        rowClass += 'level';
        rowClass += data.level.toString();
        return rowClass;
    }

    private getBorderRadius(data: IGanttData): number {
        data = this.templateData;
        let diff: number = data.ganttProperties.width - data.ganttProperties.progressWidth;
        if (diff <= 4) {
            return 4 - diff;
        } else {
            return 0;
        }
    }

    private getSplitTaskBorderRadius(data: ITaskSegment): number {
        let diff: number = data.width - data.progressWidth;
        if (diff <= 4) {
            return 4 - diff;
        } else {
            return 0;
        }
    }
    private taskNameWidth(ganttData: IGanttData): string {
        ganttData = this.templateData;
        let ganttProp: ITaskData = ganttData.ganttProperties;
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
        let ganttProp: ITaskData = ganttData.ganttProperties;
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
            let length: number = ganttData.ganttProperties.resourceInfo.length;
            if (length > 0) {
                for (let i: number = 0; i < length; i++) {
                    let resourceName: string = ganttData.ganttProperties.resourceInfo[i][this.parent.resourceFields.name];
                    let resourceUnit: number = ganttData.ganttProperties.resourceInfo[i][this.parent.resourceFields.unit];
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
     * @return {void}
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
     * @return {void}
     * @private
     */
    public refreshGanttRows(): void {
        this.parent.currentViewData = this.parent.treeGrid.getCurrentViewRecords().slice();
        this.createTaskbarTemplate();
        if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation) {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                let data: IGanttData = this.parent.currentViewData[i];
                if (data.childRecords.length > 0) {
                    /* tslint:disable-next-line */
                    this.parent.setRecordValue('workTimelineRanges', this.parent.dataOperation.mergeRangeCollections(data.ganttProperties.workTimelineRanges, true), data.ganttProperties, true);
                    this.parent.dataOperation.calculateRangeLeftWidth(data.ganttProperties.workTimelineRanges);
                }
            }
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
    }

    /**
     * To render taskbars.
     * @return {void}
     * @private
     */
    private createTaskbarTemplate(): void {
        this.updateTaskbarBlazorTemplate(false);
        let trs: Element[] = [].slice.call(this.ganttChartTableBody.querySelectorAll('tr'));
        this.ganttChartTableBody.innerHTML = '';
        let collapsedResourceRecord: IGanttData[] = [];
        let prevCurrentView: Object[] = this.parent.treeGridModule.prevCurrentView as object[];
        if (this.parent.enableImmutableMode && prevCurrentView && prevCurrentView.length > 0) {
            this.refreshedTr = []; this.refreshedData = [];
            let oldKeys: object = {};
            let oldRowElements: Element[] = [];
            let key: string = this.parent.treeGrid.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < prevCurrentView.length; i++) {
                oldRowElements[i] = trs[i];
                oldKeys[prevCurrentView[i][key]] = i;
            }
            for (let index: number = 0; index < this.parent.currentViewData.length; index++) {
                let oldIndex: number = oldKeys[this.parent.currentViewData[index][key]];
                let modifiedRecIndex: number = this.parent.modifiedRecords.indexOf(this.parent.currentViewData[index]);
                if (isNullOrUndefined(oldIndex) || modifiedRecIndex !== -1) {
                    let tRow: Node = this.getGanttChartRow(index, this.parent.currentViewData[index]);
                    this.ganttChartTableBody.appendChild(tRow);
                    this.refreshedTr.push(this.ganttChartTableBody.querySelectorAll('tr')[index]);
                    this.refreshedData.push(this.parent.currentViewData[index]);
                } else if (!isNullOrUndefined(oldIndex) && modifiedRecIndex === -1) {
                    this.ganttChartTableBody.appendChild(oldRowElements[oldIndex]);
                }
                this.ganttChartTableBody.querySelectorAll('tr')[index].setAttribute('aria-rowindex', index.toString());
           }
        }  else {
             for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                let tempTemplateData: IGanttData = this.parent.currentViewData[i];
                if (this.parent.viewType === 'ResourceView' && !tempTemplateData.expanded && this.parent.enableMultiTaskbar) {
                    collapsedResourceRecord.push(tempTemplateData);
                }
                let tRow: Node = this.getGanttChartRow(i, tempTemplateData);
                this.ganttChartTableBody.appendChild(tRow);
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
     * @return {Node}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    public getGanttChartRow(i: number, tempTemplateData: IGanttData): Node {
        this.templateData = tempTemplateData;
        let taskBaselineTemplateNode: NodeList = null;
        let parentTrNode: NodeList = this.getTableTrNode();
        let leftLabelNode: NodeList = this.getLeftLabelNode(i);
        let taskbarContainerNode: NodeList = this.taskbarContainer();
        (<HTMLElement>taskbarContainerNode[0]).setAttribute('aria-label', this.generateAriaLabel(this.templateData));
        (<HTMLElement>taskbarContainerNode[0]).setAttribute('rowUniqueId', this.templateData.ganttProperties.rowUniqueID);
        if (!this.templateData.hasChildRecords) {
            let connectorLineLeftNode: NodeList = this.getLeftPointNode();
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
        }
        if (this.templateData.hasChildRecords) {
            let parentTaskbarTemplateNode: NodeList = this.getParentTaskbarNode(i, taskbarContainerNode);
            if (!this.templateData.ganttProperties.isAutoSchedule) {
                let manualTaskbar: NodeList = this.getManualTaskbar();
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
            let milestoneTemplateNode: NodeList = this.getMilestoneNode(i, taskbarContainerNode);
            if (milestoneTemplateNode && milestoneTemplateNode.length > 0) {
                taskbarContainerNode[0].appendChild([].slice.call(milestoneTemplateNode)[0]);
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.getMilestoneBaselineNode();
            }
        } else {
            let scheduledTask: boolean = isScheduledTask(this.templateData.ganttProperties);
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
                let childTaskbarTemplateNode: NodeList = this.getChildTaskbarNode(i, taskbarContainerNode);
                if (childTaskbarLeftResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarLeftResizeNode)[0]);
                }
                if (childTaskbarTemplateNode && childTaskbarTemplateNode.length > 0) {
                    if (this.templateData.ganttProperties.segments && this.templateData.ganttProperties.segments.length > 0) {
                        let length: number = this.templateData.ganttProperties.segments.length;
                        let segmentConnector: NodeList = null;
                        let connector: string = ('<div class="e-gantt-split-container-line"></div>');
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
            let connectorLineRightNode: NodeList = this.getRightPointNode();
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineRightNode)[0]);
        }
        let rightLabelNode: NodeList = this.getRightLabelNode(i);
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskbarContainerNode)[0]);
        if (this.templateData.ganttProperties.indicators && this.templateData.ganttProperties.indicators.length > 0) {
            let taskIndicatorNode: NodeList;
            let taskIndicatorTextFunction: Function;
            let taskIndicatorTextNode: NodeList;
            let indicators: IIndicator[] = this.templateData.ganttProperties.indicators;
            for (let indicatorIndex: number = 0; indicatorIndex < indicators.length; indicatorIndex++) {
                taskIndicatorNode = this.getIndicatorNode(indicators[indicatorIndex]);
                if (indicators[indicatorIndex].name.indexOf('$') > -1 || indicators[indicatorIndex].name.indexOf('#') > -1) {
                    taskIndicatorTextFunction = this.templateCompiler(indicators[indicatorIndex].name);
                    taskIndicatorTextNode = taskIndicatorTextFunction(
                        extend({ index: i }, this.templateData), this.parent, 'indicatorLabelText');
                } else {
                    let text: Element = createElement('Text');
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
        let tRow: Node = parentTrNode[0].childNodes[0];
        this.setAriaRowIndex(tempTemplateData, tRow);
        return tRow;
    }
    /**
     * To set aria-rowindex for chart rows
     * @return {void}
     * @private
     */

    public setAriaRowIndex(tempTemplateData: IGanttData, tRow: Node): void {
        let dataSource: IGanttData[] = this.parent.treeGrid.getCurrentViewRecords() as IGanttData[];
        let visualData: IGanttData[] = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
         getValue('virtualScrollModule.visualData', this.parent.treeGrid) : dataSource;
        let index: number = visualData.indexOf(tempTemplateData);
        (tRow as Element).setAttribute('aria-rowindex', index.toString());
    }
    /**
     * To trigger query taskbar info event.
     * @return {void}
     * @private
     */
    public triggerQueryTaskbarInfo(): void {
        if (!this.parent.queryTaskbarInfo) {
            return;
        }
        let length: number = this.refreshedTr.length > 0 ?
         this.refreshedTr.length : this.ganttChartTableBody.querySelectorAll('tr').length;
        let trElement: Element;
        let data: IGanttData;
        for (let index: number = 0; index < length; index++) {
            trElement = this.refreshedTr.length > 0 ? this.refreshedTr[index] : this.ganttChartTableBody.querySelectorAll('tr')[index];
            data = this.refreshedData.length > 0 ? this.refreshedData[index] : this.parent.currentViewData[index];
            let segmentLength: number = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length;
            if (segmentLength > 0) {
                for (let i: number = 0; i < segmentLength; i++) {
                    let segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        trElement.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    let segmentElement: HTMLElement = segmentedTasks[i] as HTMLElement;
                    this.triggerQueryTaskbarInfoByIndex(segmentElement, data);
                }
            } else {
                this.triggerQueryTaskbarInfoByIndex(trElement, data);
            }
        }
    }
    /**
     * 
     * @param trElement 
     * @param data 
     * @private
     */
    public triggerQueryTaskbarInfoByIndex(trElement: Element, data: IGanttData): void {
        let taskbarElement: Element;
        taskbarElement = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length > 0 ? trElement :
            trElement.querySelector('.' + cls.taskBarMainContainer);
        let rowElement: Element;
        let triggerTaskbarElement: Element;
        let args: IQueryTaskbarInfoEventArgs = {
            data: data,
            rowElement: trElement,
            taskbarElement: taskbarElement,
            taskbarType: data.hasChildRecords ? 'ParentTask' : data.ganttProperties.isMilestone ? 'Milestone' : 'ChildTask'
        };
        let classCollections: string[] = this.getClassName(args);
        if (args.taskbarType === 'Milestone') {
            args.milestoneColor = taskbarElement.querySelector(classCollections[0]) ?
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderBottomColor : null;
            args.baselineColor = trElement.querySelector(classCollections[1]) ?
                getComputedStyle(trElement.querySelector(classCollections[1])).borderBottomColor : null;
        } else {
            let childTask: HTMLElement = taskbarElement.querySelector(classCollections[0]);
            let progressTask: HTMLElement = taskbarElement.querySelector(classCollections[1]);
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
        if (isBlazor()) {
            rowElement = args.rowElement;
            triggerTaskbarElement = args.taskbarElement;
        }
        this.parent.trigger('queryTaskbarInfo', args, (taskbarArgs: IQueryTaskbarInfoEventArgs) => {
            this.updateQueryTaskbarInfoArgs(taskbarArgs, rowElement, triggerTaskbarElement);
        });
    }

    /**
     * To update query taskbar info args.
     * @return {void}
     * @private
     */
    private updateQueryTaskbarInfoArgs(args: IQueryTaskbarInfoEventArgs, rowElement?: Element, taskBarElement?: Element): void {
        let trElement: Element = isBlazor() && rowElement ? rowElement : args.rowElement;
        let taskbarElement: Element = isBlazor() && taskBarElement ? taskBarElement : args.taskbarElement;
        let classCollections: string[] = this.getClassName(args);
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
        let classCollection: string[] = [];
        classCollection.push('.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentTaskBar : args.taskbarType === 'ChildTask' ? cls.traceChildTaskBar : cls.milestoneTop));
        classCollection.push('.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentProgressBar : args.taskbarType === 'ChildTask' ? cls.traceChildProgressBar : cls.baselineMilestoneTop));
        return classCollection;
    }
    /**
     * To compile template string.
     * @return {Function}
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
     * @param index 
     * @private
     */
    public refreshRow(index: number, isValidateRange?: boolean): void {
        let tr: Node = this.ganttChartTableBody.childNodes[index];
        let selectedItem: IGanttData = this.parent.currentViewData[index];
        if (index !== -1 && selectedItem) {
            let data: IGanttData = selectedItem;
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
            let segmentLength: number = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length;
            if (segmentLength > 0) {
                for (let i: number = 0; i < segmentLength; i++) {
                    let segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        (tr as Element).getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    let segmentElement: HTMLElement = segmentedTasks[i] as HTMLElement;
                    this.triggerQueryTaskbarInfoByIndex(segmentElement, data);
                }
            } else {
                this.triggerQueryTaskbarInfoByIndex(tr as Element, data);
            }
            this.triggerQueryTaskbarInfoByIndex(tr as Element, data);
            /* tslint:disable-next-line */
            let dataId: number | string = this.parent.viewType === 'ProjectView' ? data.ganttProperties.taskId : data.ganttProperties.rowUniqueID;
            this.parent.treeGrid.grid.setRowData(dataId, data);
            let row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                this.parent.treeGrid.grid.getDataRows()[index].getAttribute('data-uid'));
            row.data = data;
        }
    }

    private getResourceParent(record: IGanttData): Node {
        let chartRows: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
        this.templateData = record;
        let parentTrNode: NodeList = this.getTableTrNode();
        let leftLabelNode: NodeList = this.leftLabelContainer();
        let collapseParent: HTMLElement = createElement('div', {
            className: 'e-collapse-parent'
        });
        parentTrNode[0].childNodes[0].childNodes[0].appendChild(collapseParent);
        let tasks: IGanttData[] = this.parent.dataOperation.setSortedChildTasks(record);
        this.parent.dataOperation.updateOverlappingIndex(tasks);
        for (let i: number = 0; i < chartRows.length; i++) {
            if ((<HTMLElement>chartRows[i]).classList.contains('gridrowtaskId'
                + record.ganttProperties.rowUniqueID + 'level' + (record.level + 1))) {
                let cloneElement: HTMLElement = chartRows[i].querySelector('.e-taskbar-main-container');
                addClass([cloneElement], 'collpse-parent-border');
                let id: string = chartRows[i].querySelector('.' + cls.taskBarMainContainer).getAttribute('rowUniqueId');
                let ganttData: IGanttData = this.parent.getRecordByID(id);
                let zIndex: string = (ganttData.ganttProperties.eOverlapIndex).toString();
                let cloneChildElement: HTMLElement = cloneElement.cloneNode(true) as HTMLElement;
                cloneChildElement.style.zIndex = zIndex;
                parentTrNode[0].childNodes[0].childNodes[0].childNodes[0].appendChild(cloneChildElement);
            }
        }
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
        return parentTrNode[0].childNodes[0];
    }
    /**
     * To refresh all edited records
     * @param items 
     * @private
     */
    public refreshRecords(items: IGanttData[], isValidateRange?: boolean): void {
        if (this.parent.isGanttChartRendered) {
            this.updateTaskbarBlazorTemplate(false);
            if (this.parent.viewType === 'ResourceView' && this.parent.enableMultiTaskbar) {
                let sortedRecords: IGanttData[] = [];
                sortedRecords = new DataManager(items).executeLocal(new Query()
                    .sortBy('expanded', 'Descending'));
                items = sortedRecords;
            }
            for (let i: number = 0; i < items.length; i++) {
                let index: number = this.parent.currentViewData.indexOf(items[i]);
                this.refreshRow(index, isValidateRange);
            }
            this.parent.ganttChartModule.updateLastRowBottomWidth();
            this.parent.renderTemplates();
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
        let nameConstant: string = this.parent.localeObj.getConstant('name');
        let startDateConstant: string = this.parent.localeObj.getConstant('startDate');
        let endDateConstant: string = this.parent.localeObj.getConstant('endDate');
        let durationConstant: string = this.parent.localeObj.getConstant('duration');
        let taskNameVal: string = data.ganttProperties.taskName;
        let startDateVal: Date = data.ganttProperties.startDate;
        let endDateVal: Date = data.ganttProperties.endDate;
        let durationVal: number = data.ganttProperties.duration;

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
        let startDateConstant: string = this.parent.localeObj.getConstant('startDate');
        let endDateConstant: string = this.parent.localeObj.getConstant('endDate');
        let durationConstant: string = this.parent.localeObj.getConstant('duration');
        let startDateVal: Date = data.startDate;
        let endDateVal: Date = data.endDate;
        let durationVal: number = data.duration;
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