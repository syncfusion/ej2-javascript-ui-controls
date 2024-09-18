import { createElement, isNullOrUndefined, extend, compile, getValue, setValue, SanitizeHtmlHelper, append } from '@syncfusion/ej2-base';
import { formatUnit, addClass } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { isScheduledTask, getTaskData } from '../base/utils';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as cls from '../base/css-constants';
import { DateProcessor } from '../base/date-processor';
import { IGanttData, IQueryTaskbarInfoEventArgs, IParent, IIndicator, ITaskData, ITaskSegment } from '../base/interface';
import { Row, Column } from '@syncfusion/ej2-grids';
import { TaskFieldsModel } from '../models/models';
import { CObject } from '../base/enum';
import { CriticalPath } from '../actions/critical-path';
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
    public baselineTop: number = 0;
    public baselineHeight: number = 8;
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
    private taskBaselineTemplateNode: NodeList = null;
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
        this.taskTable.style.width = formatUnit(this.parent.enableTimelineVirtualization ?
            this.parent.timelineModule.wholeTimelineWidth : this.parent.timelineModule.totalTimelineWidth);
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
            styles: 'position: absolute;width:' + (this.parent.enableTimelineVirtualization ? this.parent.timelineModule.wholeTimelineWidth : this.parent.timelineModule.totalTimelineWidth) + 'px;',
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
        this.taskTable.style.width = formatUnit(this.parent.enableTimelineVirtualization ?
            this.parent.timelineModule.wholeTimelineWidth : this.parent.timelineModule.totalTimelineWidth);
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
        const templateString: string = '<label class="' + cls.label + ' ' + cls.taskIndicatorDiv + '" style="display: inline-flex; align-items: center; margin-top: 0; line-height:'
            + (this.parent.rowHeight) + 'px;' +
            (this.parent.enableRtl ? 'right:' : 'left:') + this.getIndicatorleft(indicator.date) + 'px;"><i class="' + indicator.iconClass + '" style="margin-right: 3px;"></i> </label>';
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
        let direction: string;
        if (this.parent.enableRtl) {
            direction = 'right:';
        }
        else {
            direction = 'left:';
        }
        if (this.childTaskbarTemplateFunction) {
            childTaskbarNode = this.childTaskbarTemplateFunction(
                extend({ index: i }, data), this.parent, 'TaskbarTemplate',
                this.getTemplateID('TaskbarTemplate'), false, undefined, rootElement[0], this.parent.treeGrid['root']);
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
                    (this.taskBarHeight) + 'px; margin-top :-1px"></div>');
                progressDiv = this.createDivElement('<div class="' + cls.childProgressBarInnerDiv + ' ' +
                    cls.traceChildProgressBar + ' ' + (data.ganttProperties.isAutoSchedule ?
                    '' : cls.manualChildProgressBar) + '"' +
                    ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                    'width:' + data.ganttProperties.progressWidth + 'px;height:100%;' +
                    'border-top-right-radius:' + this.getBorderRadius(data.ganttProperties) + 'px;' +
                    'border-bottom-right-radius:' + this.getBorderRadius(data.ganttProperties) + 'px;">' +
                    '</div>');

            }
            const tempDiv: Element = createElement('div');
            if (this.taskLabelTemplateFunction && !isNullOrUndefined(progressDiv) && progressDiv.length > 0) {
                const taskLabelTemplateNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false, undefined, progressDiv[0]);
                if (taskLabelTemplateNode && taskLabelTemplateNode.length > 0) {
                    append(taskLabelTemplateNode, tempDiv);
                    labelString = tempDiv.innerHTML;
                }
            } else {
                const field: string = this.parent.labelSettings.taskLabel;
                labelString = this.getTaskLabel(field);
                labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
                if (this.parent.enableHtmlSanitizer && typeof (labelString) === 'string') {
                    labelString = SanitizeHtmlHelper.sanitize(labelString);
                }
            }
            if (labelString.indexOf('null') === -1) {
                if (this.getTaskLabel(this.parent.labelSettings.taskLabel) === 'isCustomTemplate' &&
                    !this.isTemplate(this.parent.labelSettings.taskLabel)) {
                    labelString = '';
                }
                if (isNaN(parseInt(labelString, 10))) {
                    taskLabel = '<span class="' + cls.taskLabel + '" style="line-height:' +
                        (this.taskBarHeight - 1) + 'px; text-align:' + (this.parent.enableRtl ? 'right;' : 'left;') +
                        'display:' + 'inline-block;' +
                        'width:' + (data.ganttProperties.width - 10) + 'px; height:' +
                        this.taskBarHeight + 'px;"></span>';
                } else {
                    taskLabel = '<span class="' + cls.taskLabel + '" style="line-height:' +
                        (this.taskBarHeight - 1) + 'px;' + (this.parent.viewType === 'ResourceView' ? ('text-align:' +
                        (this.parent.enableRtl ? 'right;' : 'left;')) : '') +
                        + (this.parent.viewType === 'ResourceView' ? 'display:inline-flex;' : '') +
                         + (this.parent.viewType === 'ResourceView' ? (data.ganttProperties.width - 10) : '') + 'px; height:' +
                         this.taskBarHeight + 'px;"></span>';
                }
            }
            let template: string = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length > 0 ?
                this.splitTaskbar(data, labelString) : (data.ganttProperties.startDate && data.ganttProperties.endDate
                    && data.ganttProperties.duration) ? (taskLabel) :
                    (data.ganttProperties.startDate && !data.ganttProperties.endDate && !data.ganttProperties.duration) ? (
                        '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                        cls.unscheduledTaskbarLeft + ' ' + (data.ganttProperties.isAutoSchedule ?
                            '' : cls.manualChildTaskBar) + '"' +
                        'style="' + direction + data.ganttProperties.left + 'px; height:' + this.taskBarHeight + 'px;"></div>') :
                        (data.ganttProperties.endDate && !data.ganttProperties.startDate && !data.ganttProperties.duration) ?
                            ('<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                                cls.unscheduledTaskbarRight + ' ' + (data.ganttProperties.isAutoSchedule ?
                                '' : cls.manualChildTaskBar) + '"' +
                                'style="' + direction + data.ganttProperties.left + 'px; height:' + this.taskBarHeight + 'px;"></div>') :
                            (data.ganttProperties.duration && !data.ganttProperties.startDate && !data.ganttProperties.endDate) ?
                                ('<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                                    cls.unscheduledTaskbar + ' ' + (data.ganttProperties.isAutoSchedule ?
                                    '' : cls.manualChildTaskBar) + '"' +
                                    'style="' + direction + data.ganttProperties.left + 'px; width:' + data.ganttProperties.width + 'px;' +
                                    ' height:' + this.taskBarHeight + 'px;"></div>') : '';
            if (data.ganttProperties.segments && data.ganttProperties.segments.length > 0) {
                const progress: string = this.getSplitProgressResizerNode();
                template = template + progress;
            }
            if (data.ganttProperties.startDate && data.ganttProperties.endDate && data.ganttProperties.duration &&
                (isNullOrUndefined(data.ganttProperties.segments) || (!isNullOrUndefined(data.ganttProperties.segments) &&
                 data.ganttProperties.segments.length === 0))) {
                if (template !== '' && !isNullOrUndefined(progressDiv) && progressDiv.length > 0) {
                    /* eslint-disable-next-line */
                    const templateElement: any = this.createDivElement(template)[0];
                    if (this.parent.disableHtmlEncode) {
                        templateElement.innerText = labelString;
                    }
                    else {
                        templateElement.innerHTML = labelString;
                    }
                    const childLabel: string = this.parent.labelSettings.taskLabel;
                    if (childLabel && childLabel['elementRef']) {
                        templateElement.appendChild(tempDiv);
                    }
                    progressDiv[0].appendChild(templateElement);
                    if ((progressDiv[0] as Element).querySelectorAll('.e-task-label')[0].textContent !== '' &&
                        !this.isTemplate(childLabel) &&
                        (progressDiv[0] as Element).querySelectorAll('.e-task-label')[0].children[0]) {
                        (progressDiv[0] as Element).querySelectorAll('.e-task-label')[0].children[0].remove();
                    }
                    if ((progressDiv[0] as Element).querySelectorAll('.e-task-label')[0].textContent === '' &&
                        childLabel && !childLabel['elementRef'] && tempDiv.innerHTML !== '') {
                        (progressDiv[0] as Element).querySelectorAll('.e-task-label')[0].textContent = childLabel;
                    }
                }
                if (!isNullOrUndefined(taskbarInnerDiv) && taskbarInnerDiv.length > 0) {
                    taskbarInnerDiv[0].appendChild([].slice.call(progressDiv)[0]);
                }
                childTaskbarNode = taskbarInnerDiv;
            } else {
                childTaskbarNode = this.createDivElement(template);
            }
        }
        if (this.parent.enableRtl && !isNullOrUndefined(childTaskbarNode) && childTaskbarNode[0] && (childTaskbarNode[0] as Element).querySelector('.e-task-label')) {
            ((childTaskbarNode[0] as Element).querySelector('.e-task-label') as HTMLElement).style.marginLeft = '15px';
            ((childTaskbarNode[0] as Element).querySelector('.e-task-label') as HTMLElement).style.marginRight = '8px';
            if ((childTaskbarNode[0] as Element).querySelector('.e-gantt-child-progressbar')) {
                ((childTaskbarNode[0] as Element).querySelector('.e-gantt-child-progressbar') as HTMLElement).style.textAlign = 'left';
            }
        }
        return childTaskbarNode;
    }

    private splitTaskbar(data: IGanttData, labelString: string): string {
        let splitTasks: string = '';
        for (let i: number = 0; i < data.ganttProperties.segments.length; i++) {
            const segment: ITaskSegment = data.ganttProperties.segments[i as number];
            let progressBarVisible: string;
            if (!segment.showProgress) {
                progressBarVisible = 'hidden';
            }
            else {
                progressBarVisible = 'initial';
            }
            const segmentPosition: string = (i === 0) ? 'e-segment-first' : (i === data.ganttProperties.segments.length - 1)
                ? 'e-segment-last' : 'e-segment-inprogress';
            splitTasks += (
                //split taskbar
                '<div class="' + cls.childTaskBarInnerDiv + ' ' + segmentPosition + ' ' + cls.traceChildTaskBar + ' ' +
                ' e-segmented-taskbar' +
                '"style="width:' + segment.width + 'px;position: absolute;' + (this.parent.enableRtl ? 'right:' : 'left:') + segment.left + 'px;height:' +
                (this.taskBarHeight) + 'px; overflow:' + progressBarVisible + ';" data-segment-index = "' + i + '" aria-label = "' +
                this.generateSpiltTaskAriaLabel(segment, data.ganttProperties) + '"> ' +
                this.getSplitTaskbarLeftResizerNode() +
                //split progress bar
                '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildProgressBar + ' ' +

                '" style="border-style:' + (segment.progressWidth ? 'solid;' : 'none;') +
                'display:' + (segment.progressWidth >= 0 ? 'block;' : 'none;') +
                'width:' + segment.progressWidth + 'px;height:100%;' + 'text-align:' + (this.parent.enableRtl ? 'left;' : 'right;') +
                'border-top-right-radius:' + this.getSplitTaskBorderRadius(segment) + 'px;' +
                'border-bottom-right-radius:' + this.getSplitTaskBorderRadius(segment) + 'px;">' +
                // progress label
                '<span class="' + cls.taskLabel + '" style="line-height:' +
                (this.taskBarHeight - 1) + 'px;display:' + (segment.showProgress ? 'inline;' : 'none;') +
                'height:' + this.taskBarHeight + 'px;">' + labelString + '</span>' +
                '</div>' +

                this.getSplitTaskbarRightResizerNode(segment) +
                '</div></div>');
        }
        return splitTasks;
    }

    private getSplitTaskbarLeftResizerNode(): string {
        const lResizerLeft: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? 5 : - 2;
        const template: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            ' style="' + (this.parent.enableRtl ? 'right:' : 'left:') + lResizerLeft + 'px;height:' + (this.taskBarHeight) + 'px;z-index:1"></div>';
        return template;
    }

    private getSplitTaskbarRightResizerNode(segment: ITaskSegment): string {
        const rResizerLeft: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? -17 : -10;
        const template: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            ' style="' + (this.parent.enableRtl ? 'right:' : 'left:') + (segment.width + rResizerLeft) + 'px;' +
            'height:' + (this.taskBarHeight) + 'px;z-index:1"></div>';
        return template;
    }

    private getSplitProgressResizerNode(): string {
        const width: number = this.parent.enableRtl ? (this.templateData.ganttProperties.progressWidth + 8) :
            (this.templateData.ganttProperties.progressWidth - 6);
        const template: string = '<div class="' + cls.childProgressResizer + '"' +
            ' style="' + (this.parent.enableRtl ? 'right:' : 'left:') + width  + 'px;margin-top:' +
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
                const segment: ITaskSegment = segments[i as number];
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
        if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed']) {
            const details: Object = {};
            details['action'] = 'MergeTaskbar';
            if (this.parent['isUndoRedoItemPresent']('Edit')) {
                if (this.parent.editModule && this.parent.editModule.taskbarEditModule['isDragged'] && this.parent.getUndoActions().length > 0) {
                    this.parent.undoRedoModule['getUndoCollection'].splice(this.parent.undoRedoModule['getUndoCollection'].length - 1, 1);
                }
                this.parent.undoRedoModule['createUndoCollection']();
                const rec: IGanttData = this.parent.previousFlatData[mergeData.index];
                details['modifiedRecords'] = extend([], [rec], [], true);
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as object) = details;
            }
        }
        const segments: ITaskSegment[] = mergeData.ganttProperties.segments;
        segmentIndexes = segmentIndexes.sort((a: { firstSegmentIndex: number, secondSegmentIndex: number },
                                              b: { firstSegmentIndex: number, secondSegmentIndex: number }): number => {
            return b.firstSegmentIndex - a.firstSegmentIndex;
        });
        for (let arrayLength: number = 0; arrayLength < mergeArrayLength; arrayLength++) {
            const firstSegment: ITaskSegment = segments[segmentIndexes[arrayLength as number].firstSegmentIndex];
            const secondSegment: ITaskSegment = segments[segmentIndexes[arrayLength as number].secondSegmentIndex];
            const duration: number = firstSegment.duration + secondSegment.duration;
            const endDate: Date = this.parent.dataOperation.getEndDate(
                firstSegment.startDate, duration, mergeData.ganttProperties.durationUnit, mergeData.ganttProperties, false
            );
            const segment: ITaskSegment = {
                startDate: firstSegment.startDate,
                endDate: endDate,
                duration: duration
            };
            const insertIndex: number = segmentIndexes[arrayLength as number].firstSegmentIndex;
            segments.splice(insertIndex, 2, segment);
            this.parent.setRecordValue('segments', segments, mergeData.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(mergeData, 'segments');
            if (segments.length === 1) {
                this.parent.setRecordValue('endDate', endDate, mergeData.ganttProperties, true);
                this.parent.setRecordValue('EndDate', endDate, mergeData, true);
                this.parent.setRecordValue('segments', null, mergeData.ganttProperties, true);
                this.parent.dataOperation.updateMappingData(mergeData, 'segments');
            } else if (mergeData.ganttProperties.endDate !== segments[segments.length - 1].endDate) {
                this.parent.setRecordValue('endDate', segments[segments.length - 1].endDate, mergeData.ganttProperties, true);
            }
        }
        let segmentFields: string[];
        if (!isNullOrUndefined(mergeData[taskFields.segments]) && !isNullOrUndefined(mergeData[taskFields.segments][0])) {
            segmentFields = Object.keys(mergeData[taskFields.segments][0]);
        }
        const modifiedSegments: ITaskSegment[] = [];
        for (let i: number = 0; i < segments.length; i++) {
            if (!isNullOrUndefined(segmentFields) && !modifiedSegments[i as number]) {
                modifiedSegments[i as number] = {};
            }
            if (!isNullOrUndefined(segmentFields) && segmentFields.indexOf('StartDate') !== -1) {
                modifiedSegments[i as number][taskFields.startDate] = segments[i as number].startDate;
            }
            if (!isNullOrUndefined(segmentFields) && segmentFields.indexOf('EndDate') !== -1) {
                modifiedSegments[i as number][taskFields.endDate] = segments[i as number].endDate;
            }
            if (!isNullOrUndefined(segmentFields) && segmentFields.indexOf('Duration') !== -1) {
                modifiedSegments[i as number][taskFields.duration] = segments[i as number].duration;
            }
        }
        mergeData[taskFields.segments] = modifiedSegments;
        this.updateSegment(mergeData.ganttProperties.segments, taskId);
        this.refreshChartAfterSegment(mergeData, 'mergeSegment');
    }
    public updateSegment(segmentData: any, taskId: number | string): void {
        if (!isNullOrUndefined(this.parent.taskFields.segmentId)) {
            if (!isNullOrUndefined(segmentData)) {
                const segmentsArray: Object[] = [];
                for (let i: number = 0; i < segmentData.length; i++) {
                    const segmentObj : any = {};
                    const segment: any = segmentData[i as number];
                    segmentObj[this.parent.taskFields.segmentId] = taskId;
                    if (!isNullOrUndefined(this.parent.taskFields.startDate)) {
                        segmentObj[this.parent.taskFields.startDate] = segment.startDate;
                    }
                    if (!isNullOrUndefined(this.parent.taskFields.duration)) {
                        segmentObj[this.parent.taskFields.duration] = segment.duration;
                    }
                    if (!isNullOrUndefined(this.parent.taskFields.endDate)) {
                        segmentObj[this.parent.taskFields.endDate] = segment.endDate;
                    }
                    segmentsArray.push(segmentObj);
                }
                const filterData: Object[] = this.parent.segmentData.filter((data: any) => {
                    return !(taskId === data[this.parent.taskFields.segmentId]);
                });
                for (let i: number = 0; i < segmentsArray.length; i++) {
                    filterData.push(segmentsArray[i as number]);
                }
                this.parent.segmentData = filterData;
            }
            else {
                const filterData: Object[] = this.parent.segmentData.filter((data: any) => {
                    return !(taskId === data[this.parent.taskFields.segmentId]);
                });
                this.parent.segmentData = filterData;
            }
        }
    }
    private refreshChartAfterSegment(data: IGanttData, requestType: string): void {
        this.parent.setRecordValue('segments', this.parent.dataOperation.setSegmentsInfo(data, false), data.ganttProperties, true);
        this.parent.dataOperation.updateMappingData(data, 'segments');
        this.parent.dataOperation.updateWidthLeft(data);
        this.parent.dataOperation.updateParentItems(data);
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
            this.refreshRecords(this.parent.currentViewData);
        }
        const tr: Element = this.ganttChartTableBody.querySelectorAll('tr')[this.parent.currentViewData.indexOf(data)];
        const args: CObject = {
            requestType: requestType,
            rowData: data,
            modifiedRecords: this.parent.editedRecords,
            modifiedTaskData: getTaskData(this.parent.editedRecords, true)
        };
        this.triggerQueryTaskbarInfoByIndex(tr, data);
        if (this.parent.selectionModule) {
            this.parent.selectionModule.clearSelection();
        }
        const segments: ITaskSegment[] = (args.rowData as IGanttData).taskData[this.parent.taskFields.segments];
        if (this.parent.timezone && segments != null) {
            for (let i: number = 0; i < segments.length; i++) {
                segments[i as number][this.parent.taskFields.startDate] = this.parent.dateValidationModule.remove(
                    ((args.rowData as IGanttData).ganttProperties.segments as ITaskSegment)[i as number].startDate, this.parent.timezone);
                if (this.parent.taskFields.endDate) {
                    segments[i as number][this.parent.taskFields.endDate] = this.parent.dateValidationModule.remove(
                        ((args.rowData as IGanttData).ganttProperties.segments as ITaskSegment)[i as number].endDate, this.parent.timezone);
                }
            }
        }

        this.parent.trigger('actionComplete', args);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer') {
            this.parent.hideMaskRow();
        } else {
            this.parent.hideSpinner();
        }
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
        if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed']) {
            const details: Object = {};
            details['action'] = 'MergeTaskbar';
            if (this.parent['isUndoRedoItemPresent']('Edit')) {
                this.parent.undoRedoModule['createUndoCollection']();
                details['modifiedRecords'] = extend([], [splitRecord], [], true);
                (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as object) = details;
            }
        }
        const ganttProp: ITaskData = splitRecord.ganttProperties;
        this.dropSplit = false;
        let segmentIndex: number = -1;
        let segments: ITaskSegment[] = ganttProp.segments;
        if (isNullOrUndefined((splitDates as Date[]).length) || (splitDates as Date[]).length < 0) {
            const splitStartDate: Date = this.parent.dataOperation.checkStartDate(splitDate, ganttProp, false);
            if (splitStartDate.getTime() !== ganttProp.startDate.getTime()) {
                if (ganttProp.isAutoSchedule) {
                    if (!isNullOrUndefined(segments) && segments.length > 0) {
                        segmentIndex = this.getSegmentIndex(splitStartDate, splitRecord);
                    }
                    //check atleast one day difference is there to split
                    if (this.dropSplit === false && (splitDate as Date).getTime() > ganttProp.startDate.getTime() &&
                        (splitDate as Date).getTime() < ganttProp.endDate.getTime()) {
                        segments = segmentIndex !== -1 ? segments : [];
                        const startDate: Date = segmentIndex !== -1 ?
                            segments[segmentIndex as number].startDate : new Date(ganttProp.startDate.getTime());
                        const endDate: Date = segmentIndex !== -1 ?
                            segments[segmentIndex as number].endDate : new Date(ganttProp.endDate.getTime());
                        const segmentDuration: number = this.parent.dataOperation.getDuration(
                            startDate, endDate, ganttProp.durationUnit, ganttProp.isAutoSchedule, ganttProp.isMilestone
                        );
                        this.parent.setRecordValue(
                            'segments', this.splitSegmentedTaskbar(
                                startDate, endDate, splitDate, segmentIndex, segments, splitRecord, segmentDuration
                            ),
                            ganttProp, true
                        );
                        const modifiedSegments: ITaskSegment[] = [];
                        for (let i: number = 0; i < segments.length; i++) {
                            if (!modifiedSegments[i as number]) {
                                modifiedSegments[i as number] = {};
                            }
                            modifiedSegments[i as number][taskFields.startDate] = segments[i as number].startDate;
                            modifiedSegments[i as number][taskFields.endDate] = segments[i as number].endDate;
                            modifiedSegments[i as number][taskFields.duration] = segments[i as number].duration;
                        }
                        splitRecord[taskFields.segments] = modifiedSegments;
                        if (segmentIndex !== -1) {
                            this.incrementSegments(segments, segmentIndex + 1, splitRecord);
                        }
                        this.parent.setRecordValue('endDate', segments[segments.length - 1].endDate, ganttProp, true);
                        if (this.parent.taskFields.endDate) {
                            this.parent.dataOperation.updateMappingData(splitRecord, 'endDate');
                        }
                    }
                    this.updateSegment(splitRecord.ganttProperties.segments, taskId);
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
            this.updateSegment(splitRecord.ganttProperties.segments, taskId);
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
            endDate = i !== dates.length ? new Date(dates[i as number].getTime()) > taskData.endDate ? taskData.endDate
                : new Date(dates[i as number].getTime()) : taskData.endDate;
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
            startDate = new Date(dates[i as number].getTime());
            startDate.setDate(dates[i as number].getDate() + 1);
        }
        return segmentsArray;
    }

    private splitSegmentedTaskbar(
        startDate: Date, endDate: Date, splitDate: Date, segmentIndex: number, segments: ITaskSegment[], ganttData: IGanttData,
        segmentDuration: number): ITaskSegment[] {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        let checkClickState: number;
        let endDateState: number;
        if (this.parent.includeWeekend) {
            checkClickState = -1;
        } else {
            checkClickState = this.parent.nonWorkingDayIndex.indexOf(splitDate.getDay());
        }
        const increment: number = checkClickState === -1 ? 0 : checkClickState === 0 ? 1 : checkClickState === 1 ? 1 : 2;
        startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
        let segmentEndDate: Date = new Date(splitDate.getTime());
        segmentEndDate = this.parent.dataOperation.checkEndDate(segmentEndDate, ganttProp, false);
        for (let i: number = 0; i < 2; i++) {
            if (this.parent.weekWorkingTime.length > 0) {
                const dayEndTime: number = this.parent['getCurrentDayEndTime'](segmentEndDate);
                this.setTime(dayEndTime, segmentEndDate);
            }
            const segment: ITaskSegment = {
                startDate: startDate,
                endDate: segmentEndDate,
                duration: this.parent.dataOperation.getDuration(
                    startDate, segmentEndDate, ganttProp.durationUnit,
                    ganttProp.isAutoSchedule, ganttProp.isMilestone),
                offsetDuration: 1
            };
            if (this.parent.includeWeekend) {
                endDateState = -1;
            } else {
                endDateState = this.parent.nonWorkingDayIndex.indexOf(segmentEndDate.getDay());
            }
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
                const dayStartTime: number = this.parent['getCurrentDayStartTime'](startDate);
                this.setTime(dayStartTime, startDate);
                startDate = this.parent.dataOperation.checkStartDate(startDate, ganttProp, false);
                if (!this.parent.taskFields.duration && increment <= 0) {
                    startDate.setDate(startDate.getDate() + 1);
                }
                segmentEndDate = new Date(endDate.getTime());
                if (this.isOnHolidayOrWeekEnd(segmentEndDate, true)) {
                    do {
                        segmentEndDate.setDate(segmentEndDate.getDate() + 1);
                    }
                    while (this.isOnHolidayOrWeekEnd(segmentEndDate, true));
                }
                if (!this.parent.includeWeekend) {
                    segmentEndDate = this.getNextWorkingDay(segmentEndDate);
                }
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
            const segment: ITaskSegment = segments[i as number];
            let startDate: Date = i !== 0 ? new Date(segments[i - 1].endDate.getTime()) : new Date(segment.startDate.getTime());
            this.parent.dataOperation['fromSegments'] = true;
            startDate = this.parent.dataOperation.getEndDate(startDate, segment.offsetDuration, ganttProp.durationUnit, ganttProp, false);
            this.parent.dataOperation['fromSegments'] = false;
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
    private calculateLeftValue(rowHeight: number): number {
        const taskbarHeightValue: number = this.parent.renderBaseline ? 0.45 : ((!isNullOrUndefined(document.body.className) && document.body.className.includes('e-bigger')) ? 0.7 : 0.62);
        const defaultTaskbarHeight: number = Math.floor(this.parent.rowHeight * taskbarHeightValue);
        if ((!isNullOrUndefined(this.parent.taskbarHeight) && this.parent.taskbarHeight <= defaultTaskbarHeight) ||
            (isNullOrUndefined(this.parent.taskbarHeight) && rowHeight <= 36)) {
            return 1;
        } else {
            if (rowHeight <= 36) {
                return 1;
            }
            return (-1 / 12) * (rowHeight - 36) + 1;
        }
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
        const rowHeight: number = this.parent.rowHeight;
        const leftValue: number = this.calculateLeftValue(rowHeight);
        if (this.milestoneTemplateFunction) {
            milestoneNode = this.milestoneTemplateFunction(
                extend({ index: i }, data), this.parent, 'MilestoneTemplate',
                this.getTemplateID('MilestoneTemplate'), false, undefined, rootElement[0], this.parent.treeGrid['root']);
        } else {
            const template: string = '<div class="' + cls.traceMilestone + '" style="width:' + ((this.parent.renderBaseline ? this.taskBarHeight  : this.taskBarHeight - 6)) + 'px;height:' +
                ((this.parent.renderBaseline ? this.taskBarHeight  : this.taskBarHeight - 6)) + 'px;position:absolute;transform: rotate(45deg);left:' + leftValue + 'px;"> </div>';
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
        const template: string = '<div class="' + cls.baselineBar + ' ' + '" role="term" style="margin-top:' + this.baselineTop +
            'px;' + (this.parent.enableRtl ? 'right:' :  'left:') + data.ganttProperties.baselineLeft + 'px;' +
            'width:' + data.ganttProperties.baselineWidth + 'px;height:' +
            this.baselineHeight + 'px;' + (this.baselineColor ? 'background-color: ' + this.baselineColor + ';' : '') + '"></div>';
        return this.createDivElement(template);
    }

    private updateTaskBaselineNode(childData: IGanttData): NodeList {
        const template: string = '<div class="' + cls.baselineBar + ' ' + '" role="term" style="margin-top:' + this.baselineTop +
            'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + childData.ganttProperties.baselineLeft + 'px;' +
            'width:' + childData.ganttProperties.baselineWidth + 'px;height:' +
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
        const baselineMilestoneHeight: number = this.parent.renderBaseline ? 5 : 2;
        const template: string = '<div class="' + cls.baselineMilestoneContainer + '" style="width:' + ((this.parent.renderBaseline ? this.taskBarHeight : this.taskBarHeight - 10)) + 'px;height:' +
            ((this.parent.renderBaseline ? this.taskBarHeight : this.taskBarHeight - 10)) + 'px;position:absolute;transform:rotate(45deg);' + (this.parent.enableRtl ? 'right:' : 'left:') + (this.parent.enableRtl ? (data.ganttProperties.left -
                (this.milestoneHeight / 2) + 3) : (data.ganttProperties.baselineLeft  - (this.milestoneHeight / 2) + 1)) + 'px;' + (this.baselineColor ?
            'background-color: ' + this.baselineColor + ';' : '') + 'margin-top:' + ((-Math.floor(this.parent.rowHeight - this.milestoneMarginTop) + baselineMilestoneHeight) + 2) + 'px"> </div>';
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
        if (this.generateTaskLabelAriaLabel('left') !== '') {
            (<HTMLElement>leftLabelNode[0]).setAttribute('aria-label', this.generateTaskLabelAriaLabel('left'));
        }
        let leftLabelTemplateNode: NodeList = null;
        if (this.leftTaskLabelTemplateFunction) {
            leftLabelTemplateNode = this.leftTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'LeftLabelTemplate',
                this.getTemplateID('LeftLabelTemplate'), false, undefined, leftLabelNode[0], this.parent.treeGrid['root']);
        } else {
            const field: string = this.parent.labelSettings.leftLabel;
            let labelString: string = this.getTaskLabel(field);
            if (labelString) {
                labelString = labelString === 'isCustomTemplate' ? field : labelString;
                leftLabelTemplateNode = this.getLableText(labelString, cls.leftLabelInnerDiv);
                if (this.parent.enableHtmlSanitizer && typeof (labelString) === 'string') {
                    labelString = SanitizeHtmlHelper.sanitize(labelString);
                    labelString = labelString === 'isCustomTemplate' ? field : labelString;
                    leftLabelTemplateNode = this.getLableText(labelString, cls.leftLabelInnerDiv);
                }
            }
        }
        if (leftLabelTemplateNode && leftLabelTemplateNode.length > 0) {
            if (leftLabelTemplateNode[0]['data'] === 'null') {
                leftLabelTemplateNode[0]['data'] = '';
            }
            append(leftLabelTemplateNode, leftLabelNode[0] as Element);
        }
        if (this.parent.enableRtl) {
            (leftLabelNode[0] as HTMLElement).style.paddingLeft = '25px';
            (leftLabelNode[0] as HTMLElement).style.paddingRight = '0px';
        }
        return leftLabelNode;
    }
    private getLableText(labelString: string, labelDiv: string): NodeList {
        const leftLabelHeight: number = this.parent.renderBaseline ?
            ((this.parent.rowHeight - this.taskBarHeight) / 2) : this.taskBarMarginTop;
        const templateString: HTMLElement = createElement('div', {
            className: labelDiv, styles: 'height:' + (this.taskBarHeight) + 'px;' +
                'margin-top:' + leftLabelHeight + 'px;'
        });
        const spanElem: HTMLElement = createElement('span', { className: cls.label });
        const property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
        spanElem[property as string] = labelString;
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
        if (this.generateTaskLabelAriaLabel('right') !== '') {
            (<HTMLElement>rightLabelNode[0]).setAttribute('aria-label', this.generateTaskLabelAriaLabel('right'));
        }
        let rightLabelTemplateNode: NodeList = null;
        if (this.rightTaskLabelTemplateFunction) {
            rightLabelTemplateNode = this.rightTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'RightLabelTemplate',
                this.getTemplateID('RightLabelTemplate'), false, undefined, rightLabelNode[0], this.parent.treeGrid['root']);
        } else {
            const field: string = this.parent.labelSettings.rightLabel;
            let labelString: string = this.getTaskLabel(field);
            if (labelString) {
                labelString = labelString === 'isCustomTemplate' ? field : labelString;
                rightLabelTemplateNode = this.getLableText(labelString, cls.rightLabelInnerDiv);
                if (this.parent.enableHtmlSanitizer && typeof (labelString) === 'string') {
                    labelString = SanitizeHtmlHelper.sanitize(labelString);
                    labelString = labelString === 'isCustomTemplate' ? field : labelString;
                    rightLabelTemplateNode = this.getLableText(labelString, cls.rightLabelInnerDiv);
                }
            }
        }
        if (rightLabelTemplateNode && rightLabelTemplateNode.length > 0) {
            if (rightLabelTemplateNode[0]['data'] === 'null') {
                rightLabelTemplateNode[0]['data'] = '';
            }
            append(rightLabelTemplateNode, rightLabelNode[0] as Element);
        }
        if (this.parent.enableRtl) {
            (rightLabelNode[0] as HTMLElement).style.marginLeft = '0px';
            (rightLabelNode[0] as HTMLElement).style.paddingRight = '25px';
        }
        return rightLabelNode;
    }

    private getManualTaskbar(): NodeList {
        const data: IGanttData = this.templateData;
        const taskbarHeight: number = (this.taskBarHeight / 2 - 1);
        const innerDiv: string = (data.ganttProperties.startDate && data.ganttProperties.endDate &&
            (data.ganttProperties.duration || data.hasChildRecords)) ?
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
        const childEle: string = innerDiv + ((data.ganttProperties.startDate && data.ganttProperties.endDate &&
                            (data.ganttProperties.duration || data.hasChildRecords)) || data.ganttProperties.duration ? '<div class="e-gantt-manualparenttaskbar-left" style=' +
                            (this.parent.enableRtl ? 'margin-right:0px;' : '') + '"height:' + ((taskbarHeight / 5) + 8) + 'px;border-left-width:' + taskbarHeight / 5 +
                            'px; border-bottom:' + taskbarHeight / 5 + 'px solid transparent;"></div>' +
                            '<div class="e-gantt-manualparenttaskbar-right" style=' + (this.parent.enableRtl ? 'margin-right:-8px;' : '') +
                            (this.parent.enableRtl ? 'right:' : 'left:') + (data.ganttProperties.width - Math.floor(((taskbarHeight / 5) + 8) / 5)) + 'px;height:' +
                            ((taskbarHeight / 5) + 8) + 'px;border-right-width:' + taskbarHeight / 5 + 'px;border-bottom:' +
                            taskbarHeight / 5 + 'px solid transparent;>' + '</div></div>' : '');
        const template: string = '<div class="' + cls.manualParentMainContainer + '"' +
                            'style=' + (this.parent.enableRtl ? 'right:' : 'left:') + (data.ganttProperties.left - data.ganttProperties.autoLeft) + 'px;' +
                            'width:' + data.ganttProperties.width + 'px;' +
                            'height:' + taskbarHeight + 'px;cursor:' + (this.parent.editSettings.allowTaskbarEditing ? 'move;' : 'default;') + '</div>';
        const milestoneTemplate: string = '<div class="' + cls.manualParentMilestone + '" style="width:' + ((this.parent.renderBaseline ? this.taskBarHeight - 3 : this.taskBarHeight - 7)) + 'px;height:' +
                        ((this.parent.renderBaseline ? this.taskBarHeight - 3 : this.taskBarHeight - 7)) +
                        'px;position:absolute;transform: rotate(45deg);top:' + (this.parent.rowHeight > 40 ? 0 : 2) + 'px;left:'
                        + (this.parent.renderBaseline ? 2 : 1) + 'px;"> </div>';
        return this.createDivElement((data.ganttProperties.duration === 0 && data.hasChildRecords &&
                            !data.ganttProperties.isAutoSchedule) ? milestoneTemplate + childEle  : template + childEle);
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
                this.getTemplateID('ParentTaskbarTemplate'), false, undefined, rootElement[0], this.parent.treeGrid['root']);
        } else {
            let labelString: string = ''; let labelDiv: string;
            const tHeight: number = this.taskBarHeight / 5;
            const template: NodeList = this.createDivElement('<div class="' + cls.parentTaskBarInnerDiv + ' ' +
                this.getExpandClass(data) + ' ' + cls.traceParentTaskBar + '"' +
                ' style="width:' + (data.ganttProperties.isAutoSchedule ? data.ganttProperties.width :
                data.ganttProperties.autoWidth) + 'px;height:' + (data.ganttProperties.isAutoSchedule ? this.taskBarHeight :
                (tHeight * 3)) + 'px;margin-top:' + (data.ganttProperties.isAutoSchedule ? -1 :
                (tHeight * 2)) + 'px; ">' +
                '</div>');
            const progressBarInnerDiv: NodeList = this.createDivElement('<div class="' + cls.parentProgressBarInnerDiv + ' ' +
             this.getExpandClass(data) + ' ' + cls.traceParentProgressBar + '"' +
                ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                'width:' + data.ganttProperties.progressWidth + 'px;' +
                'border-top-right-radius:' + this.getBorderRadius(data) + 'px;' +
                'border-bottom-right-radius:' + this.getBorderRadius(data) + 'px;height:100%;"></div>');
            const div: Element = createElement('div');
            if (this.taskLabelTemplateFunction) {
                const parentTaskLabelNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false, undefined, progressBarInnerDiv[0]);
                if (parentTaskLabelNode && parentTaskLabelNode.length > 0) {
                    append(parentTaskLabelNode, div);
                    labelString = div.innerHTML;
                }
            } else {
                labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
                labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
                if (this.parent.enableHtmlSanitizer && typeof (labelString) === 'string') {
                    labelString = SanitizeHtmlHelper.sanitize(labelString);
                }
            }
            if (labelString.indexOf('null') === -1) {
                if (this.getTaskLabel(this.parent.labelSettings.taskLabel) === 'isCustomTemplate' &&
                    !this.isTemplate(this.parent.labelSettings.taskLabel)) {
                    labelString = '';
                }
                if (isNaN(parseInt(labelString, 10))) {
                    labelDiv = '<span class="' + cls.taskLabel + '" style="line-height:' +
                        (data['isManual'] && data.hasChildRecords ? (Math.floor((60 / 100) * this.taskBarHeight)) : (this.taskBarHeight - 1)) +
                        'px; text-align:' + (this.parent.enableRtl ? 'right;' : 'left;') +
                        'display:' + 'inline-block;' +
                        'width:' + (data.ganttProperties.width - 10) + 'px; height:' +
                        this.taskBarHeight + 'px;"></span>';
                } else {
                    labelDiv = '<span class="' +
                    cls.taskLabel + '" style="line-height:' +
                        (data['isManual'] && data.hasChildRecords ? (Math.floor((60 / 100) * this.taskBarHeight)) : (this.taskBarHeight - 1)) + 'px;' +
                        (this.parent.viewType === 'ResourceView' ? 'display:inline-flex;' : '') +
                        (this.parent.viewType === 'ResourceView' ? 'width:' + (data.ganttProperties.width - 10) : '') + 'px; height:' +
                        (this.taskBarHeight - 1) + 'px;' + (this.parent.viewType === 'ResourceView' ? 'display: inline-flex;' : '') +
                        (this.parent.viewType === 'ResourceView' ? 'width:' + (data.ganttProperties.width - 10) : '') + 'px; height:' +
                        this.taskBarHeight + 'px;"></span>';
                }
                const labelElement: HTMLElement | Element | Node = this.createDivElement(labelDiv)[0];
                if (this.parent.disableHtmlEncode) {
                    (labelElement as HTMLElement).innerText = labelString;
                }
                else {
                    (labelElement as HTMLElement).innerHTML = labelString;
                }
                const parentLabel: string = this.parent.labelSettings.taskLabel;
                if (parentLabel && parentLabel['elementRef']) {
                    labelElement.appendChild(div);
                }
                progressBarInnerDiv[0].appendChild(labelElement);
                if ((progressBarInnerDiv[0] as Element).querySelectorAll('.e-task-label')[0].textContent !== '' &&
                   !this.isTemplate(parentLabel) &&
                   (progressBarInnerDiv[0] as Element).querySelectorAll('.e-task-label')[0].children[0]) {
                    (progressBarInnerDiv[0] as Element).querySelectorAll('.e-task-label')[0].children[0].remove();
                }
                if ((progressBarInnerDiv[0] as Element).querySelectorAll('.e-task-label')[0].textContent === '' &&
                   parentLabel && !parentLabel['elementRef'] && div.innerHTML !== '') {
                    (progressBarInnerDiv[0] as Element).querySelectorAll('.e-task-label')[0].textContent = parentLabel;
                }
            }
            const milestoneTemplate: string = '<div class="' + cls.parentMilestone + '" style="width:' + ((this.parent.renderBaseline ? this.taskBarHeight - 3 : this.taskBarHeight - 7)) + 'px;height:' +
            ((this.parent.renderBaseline ? this.taskBarHeight - 3 : this.taskBarHeight - 7)) + 'px;position:absolute;transform: rotate(45deg);top:' + (this.parent.rowHeight > 40 ? 0 : 2) + 'px;left:' + (this.parent.renderBaseline ? 2 : 1) + 'px;"> </div>';
            template[0].appendChild([].slice.call(progressBarInnerDiv)[0]);

            parentTaskbarNode = data.ganttProperties.isMilestone ?
                this.createDivElement(data.ganttProperties.isAutoSchedule ? milestoneTemplate : '') : template;
        }
        if (this.parent.enableRtl && parentTaskbarNode[0] && (parentTaskbarNode[0] as Element).querySelector('.e-task-label')) {
            ((parentTaskbarNode[0] as Element).querySelector('.e-task-label') as HTMLElement).style.marginLeft = '15px';
            ((parentTaskbarNode[0] as Element).querySelector('.e-task-label') as HTMLElement).style.marginRight = '8px';
            if ((parentTaskbarNode[0] as Element).querySelector('.e-gantt-parent-progressbar')) {
                ((parentTaskbarNode[0] as Element).querySelector('.e-gantt-parent-progressbar') as HTMLElement).style.textAlign = 'left';
            }

        }
        return parentTaskbarNode;
    }
    /**
     * To get taskbar row('TR') node
     *
     * @param {number} i .
     * @returns {NodeList} .
     * @private
     */
    private getTableTrNode(i?: number): NodeList {
        const table: Element = createElement('table');
        const className: string = (this.parent.gridLines === 'Horizontal' || this.parent.gridLines === 'Both') ?
            'e-chart-row-border' : '';
        /* eslint-disable-next-line */
        let activecls: string;
        let rows: any;
        if (this.parent.treeGridModule.isPersist) {
            setTimeout(() => {
                if (!isNullOrUndefined(this.parent.treeGrid.grid) && !isNullOrUndefined(this.parent.treeGrid.grid.contentModule) &&
                    !isNullOrUndefined(this.parent.treeGrid.grid.contentModule.getRows())) {
                    rows = this.parent.treeGrid.grid.contentModule.getRows()[i as number];
                    if (rows && rows.isSelected) {
                        activecls = 'e-active';
                    }
                    else {
                        activecls = '';
                    }
                }
            }, 0);
        }
        else {
            rows = this.parent.treeGrid.grid.contentModule.getRows()[i as number];
            if (rows && rows.isSelected) {
                activecls = 'e-active';
            }
            else {
                activecls = '';
            }
        }
        table.innerHTML = '<tr class="' + this.getRowClassName(this.templateData) + ' ' + cls.chartRow + ' ' + (activecls) + '"' +
        'style="display:' + this.getExpandDisplayProp(this.templateData) + ';height:' +
        this.parent.rowHeight + 'px;">' +
            '<td class="' + cls.chartRowCell + ' ' + className
            + '"style="width:' + this.parent.timelineModule.totalTimelineWidth + 'px;"></td></tr>';
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
        for (let i: number = 0; i < this.parent.ganttColumns.length; i++) {
            if (template === this.parent.ganttColumns[i as number].field) {
                result = true;
                break;
            }
        }
        if (typeof template !== 'string' || template.indexOf('#') === 0 || template.indexOf('<') > -1
        || template.indexOf('$') > -1 || !result) {
            result = true;
        } else {
            result = false;
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

    private leftLabelContainer(): NodeList {
        const template: string = '<div class="' + ((this.leftTaskLabelTemplateFunction) ? cls.leftLabelTempContainer :
            cls.leftLabelContainer) + ' ' + '" tabindex="-1" role="term" style="height:' +
        (this.parent.rowHeight - 2) + 'px;width:' + this.taskNameWidth(this.templateData) + '"></div>';
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
            ' tabindex="-1" role="term" style="' + ((data.ganttProperties.isMilestone && !manualParent && !(data.hasChildRecords && !data.ganttProperties.isAutoSchedule)) ?
            ('width:' + this.milestoneHeight + 'px;height:' +
                    this.milestoneHeight + 'px;margin-top:' + this.milestoneMarginTop + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + (data.ganttProperties.left -
                        (this.milestoneHeight / 2)) + 'px;cursor:' + (this.parent.editSettings.allowTaskbarEditing ? 'move;' : 'default;')) : ('width:' + data.ganttProperties.width +
                     'px;margin-top:' + this.taskBarMarginTop + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + (!data.hasChildRecords || data.ganttProperties.isAutoSchedule ?
                data.ganttProperties.left : data.ganttProperties.autoLeft) + 'px;height:' +
                            this.taskBarHeight + 'px;cursor:' + (this.parent.editSettings.allowTaskbarEditing ? 'move;' : 'default;'))) + '"></div>';
        return this.createDivElement(template);
    }

    private rightLabelContainer(): NodeList {
        const template: string = '<div class="' + ((this.rightTaskLabelTemplateFunction) ? cls.rightLabelTempContainer :
            cls.rightLabelContainer) + '" ' + ' tabindex="-1" role="term" style="' + (this.parent.enableRtl ? 'right:' : 'left:') + this.getRightLabelLeft(this.templateData) + 'px; height:'
            + (this.parent.rowHeight - 2) + 'px;"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarLeftResizer(): NodeList {
        const lResizerLeft: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? 5 : - 2;
        const template: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            'style="' + (this.parent.enableRtl ? 'right:' : 'left:') + lResizerLeft + 'px;height:' + (this.taskBarHeight) + 'px;z-index:1"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarRightResizer(): NodeList {
        const rResizerLeft: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? -17 : -11;
        const template: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            'style="' + (this.parent.enableRtl ? 'right:' : 'left:') + (this.templateData.ganttProperties.width + rResizerLeft) + 'px;' +
            'height:' + (this.taskBarHeight) + 'px;z-index:1"></div>';
        return this.createDivElement(template);
    }

    private childTaskbarProgressResizer(): NodeList {
        const width : number = this.parent.enableRtl ? (this.templateData.ganttProperties.progressWidth + 8) :
            (this.templateData.ganttProperties.progressWidth - 6);
        const template: string = '<div class="' + cls.childProgressResizer + '"' +
            'style="' + (this.parent.enableRtl ? 'right:' : 'left:') + width + 'px;margin-top:' +
            (this.taskBarHeight - 4) + 'px;"><div class="' + cls.progressBarHandler + '"' +
            '><div class="' + cls.progressHandlerElement + '"></div>' +
            '<div class="' + cls.progressBarHandlerAfter + '"></div></div>';
        return this.createDivElement(template);
    }

    private getLeftPointNode(): NodeList {
        const data: IGanttData = this.templateData;
        const left: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? 12 : 0;
        const mileStoneLeftValue: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? 6 : 3;
        const pointerLeft: number = -(2 + this.connectorPointWidth + left);
        const mileStoneLeft: number = -(this.connectorPointWidth  + mileStoneLeftValue);
        const pointerTop: number = Math.floor(this.milesStoneRadius - (this.connectorPointWidth / 2));
        let marginTop: string;
        if ((!this.templateData.ganttProperties.isAutoSchedule && this.templateData.hasChildRecords) && this.parent.allowParentDependency) {
            marginTop =  '';
        }
        else {
            marginTop =  'margin-top:' + this.connectorPointMargin + 'px';
        }
        let canAdd: boolean = true;
        if (data.hasChildRecords && !this.parent.allowParentDependency) {
            canAdd = false;
        }
        const template: string = '<div class="' + cls.leftConnectorPointOuterDiv + '" style="' +
            ((data.ganttProperties.isMilestone) ? ('margin-top:' + pointerTop + 'px;left:' + mileStoneLeft +
                'px;') : (marginTop + ';left:' + pointerLeft + 'px;')) + '">' +
            '<div class="' + (canAdd ? cls.connectorPointLeft : '') + ' ' + this.parent.getUnscheduledTaskClass(data.ganttProperties) +
            '" style="width: ' + this.connectorPointWidth + 'px;' + (this.parent.enableRtl ? 'margin-right:2px;' : '') +
            'height: ' + this.connectorPointWidth + 'px;">' + this.touchLeftConnectorpoint + '</div></div>';
        return this.createDivElement(template);
    }

    private getRightPointNode(): NodeList {
        const data: IGanttData = this.templateData;
        const right: number = (!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? -12 : 0;
        const pointerRight: number = -(3 + right);
        const pointerTop: number = Math.floor(this.milesStoneRadius - (this.connectorPointWidth / 2));
        let marginTop: string;
        if ((!this.templateData.ganttProperties.isAutoSchedule && this.templateData.hasChildRecords) && this.parent.allowParentDependency) {
            marginTop =  '';
        }
        else {
            marginTop =  'margin-top:' + this.connectorPointMargin + 'px';
        }
        let canAdd: boolean = true;
        if (data.hasChildRecords && !this.parent.allowParentDependency) {
            canAdd = false;
        }
        const template: string = '<div class="' + cls.rightConnectorPointOuterDiv + '" style="' +
            ((data.ganttProperties.isMilestone) ? ('left:' + ((!isNullOrUndefined(document.body.className) && document.body.className.includes('e-bigger')) ? (this.milestoneHeight + 5) : this.milestoneHeight - 2) + 'px;margin-top:' +
                pointerTop + 'px;') : ('left:' + (data.ganttProperties.width + pointerRight) + 'px;' + marginTop + ';')) + '">' +
            '<div class="' + (canAdd ? cls.connectorPointRight : '') + ' ' + this.parent.getUnscheduledTaskClass(data.ganttProperties) +
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
                    if (field === this.parent.ganttColumns[i as number].field) {
                        resultString = this.getFieldValue(this.templateData[field as string]).toString();
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
                left = ganttProp.left < ganttProp.autoLeft ? ganttProp.autoLeft : ganttProp.left;
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
                    let resourceName: string = ganttData.ganttProperties.resourceInfo[i as number][this.parent.resourceFields.name];
                    const resourceUnit: number = ganttData.ganttProperties.resourceInfo[i as number][this.parent.resourceFields.unit];
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
        const taskbarHeightValue: number = this.parent.renderBaseline ? 0.45 : ((!isNullOrUndefined( document.body.className) && document.body.className.includes('e-bigger')) ? 0.7 : 0.62);
        const taskBarMarginTopValue: number = this.parent.renderBaseline ? 4 : 2;
        const milestoneHeightValue: number = this.parent.renderBaseline ? 1.13 : 0.82;
        this.parent.rowHeight = isNullOrUndefined(this.parent.rowHeight) ? 36 : this.parent.rowHeight;
        this.baselineColor = !isNullOrUndefined(this.parent.baselineColor) &&
            this.parent.baselineColor !== '' ? this.parent.baselineColor : null;
        this.taskBarHeight = isNullOrUndefined(this.parent.taskbarHeight) || this.parent.taskbarHeight >= this.parent.rowHeight ?
            Math.floor(this.parent.rowHeight * taskbarHeightValue) : this.parent.taskbarHeight; // 0.62 -- Standard Ratio.
        if (this.parent.renderBaseline) {
            let height: number;
            if ((this.taskBarHeight + this.baselineHeight) <= this.parent.rowHeight) {
                height = this.taskBarHeight;
            } else {
                height = this.taskBarHeight - (this.baselineHeight + 1);
            }
            this.taskBarHeight = height;
        }
        this.milestoneHeight = Math.floor(this.taskBarHeight * milestoneHeightValue); // 0.82 -- Standard Ratio.
        this.taskBarMarginTop = Math.floor((this.parent.rowHeight - this.taskBarHeight) / taskBarMarginTopValue);
        this.milestoneMarginTop = Math.floor((this.parent.rowHeight - this.milestoneHeight) / 2);
        this.milesStoneRadius = Math.floor((this.milestoneHeight) / 2);
        this.baselineTop = -(Math.floor((this.parent.rowHeight - (this.taskBarHeight + this.taskBarMarginTop))) - 4);
        this.connectorPointWidth = this.parent.isAdaptive ? Math.round(this.taskBarHeight / 2) : 9;
        this.connectorPointMargin = Math.floor((this.taskBarHeight / 2) - (this.connectorPointWidth / 1.5));
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
        if (this.parent.showOverAllocation) {
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                const data: IGanttData = this.parent.currentViewData[i as number];
                if (data.childRecords.length > 0) {
                    this.parent.setRecordValue('workTimelineRanges', this.parent.dataOperation.mergeRangeCollections(data.ganttProperties.workTimelineRanges, true), data.ganttProperties, true);
                    this.parent.dataOperation.calculateRangeLeftWidth(data.ganttProperties.workTimelineRanges);
                }
            }
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
        this.parent.ganttChartModule.updateLastRowBottomWidth();
    }

    /**
     * To trigger the touchmove.
     *
     * @param {TouchEvent} event .
     * @returns {void}
     * @private
     */
    private handleTouchMove = (event: TouchEvent) => {
        this.parent.ganttChartModule['ganttChartMove'](event);
    };

    /**
     * To trigger the touchend.
     *
     * @param {TouchEvent} event .
     * @returns {void}
     * @private
     */
    private handleTouchEnd = (event: TouchEvent) => {
        this.parent.ganttChartModule['documentMouseUp'](event);
    };

    /**
     * To render taskbars.
     *
     * @returns {void}
     * @private
     */
    private createTaskbarTemplate(): void {
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
                oldRowElements[i as number] = trs[i as number];
                oldKeys[prevCurrentView[i as number][key as string]] = i;
            }
            for (let index: number = 0; index < this.parent.currentViewData.length; index++) {
                const oldIndex: number = oldKeys[this.parent.currentViewData[index as number][key as string]];
                const modifiedRecIndex: number = this.parent.modifiedRecords.indexOf(this.parent.currentViewData[index as number]);
                if (isNullOrUndefined(oldIndex) || modifiedRecIndex !== -1 || this.parent.isFromRenderBaseline) {
                    const tRow: Node = this.getGanttChartRow(index, this.parent.currentViewData[index as number]);
                    this.ganttChartTableBody.appendChild(tRow);
                    this.refreshedTr.push(this.ganttChartTableBody.querySelectorAll('tr')[index as number]);
                    this.refreshedData.push(this.parent.currentViewData[index as number]);
                } else {
                    this.ganttChartTableBody.appendChild(oldRowElements[oldIndex as number]);
                }
                this.ganttChartTableBody.querySelectorAll('tr')[index as number].setAttribute('data-rowindex', index.toString());
            }
        }  else {
            const dupChartBody: Element = createElement('tbody', {
                id: this.parent.element.id + 'GanttTaskTableBody'
            });
            for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
                const tempTemplateData: IGanttData = this.parent.currentViewData[i as number];
                if (!tempTemplateData.expanded && this.parent.enableMultiTaskbar) {
                    collapsedResourceRecord.push(tempTemplateData);
                }
                const tRow: Node = this.getGanttChartRow(i, tempTemplateData);
                if (tempTemplateData.hasChildRecords && (!tempTemplateData.expanded) && this.parent.enableMultiTaskbar
                    && !this.parent.allowTaskbarOverlap) {
                    this.updateDragDropRecords(tempTemplateData, tRow);
                }
                dupChartBody.appendChild(tRow);
                if (this.parent.enableImmutableMode) {
                    this.refreshedTr.push(dupChartBody.querySelectorAll('tr')[i as number]);
                    this.refreshedData.push(this.parent.currentViewData[i as number]);
                }
                // To maintain selection when virtualization is enabled
                if (this.parent.selectionModule && this.parent.allowSelection) {
                    this.parent.selectionModule.maintainSelectedRecords(parseInt((tRow as Element).getAttribute('data-rowindex'), 10));
                }
            }
            /* eslint-disable-next-line */
            (this.ganttChartTableBody as any).replaceChildren(...dupChartBody.childNodes as any);
            // To trigger the touchend event while perform touch Pinch In/Out action
            (this.ganttChartTableBody.childNodes).forEach((tr: Node) => {
                if (tr instanceof Element) {
                    tr.addEventListener('touchmove', this.handleTouchMove);
                    tr.addEventListener('touchend', this.handleTouchEnd);
                }
            });
            this.parent.initialChartRowElements = this.parent.ganttChartModule.getChartRows();
        }
        if (this.parent.enableCriticalPath && this.parent.criticalPathModule) {
            const criticalModule: CriticalPath = this.parent.criticalPathModule;
            if (criticalModule.criticalPathCollection) {
                this.parent.criticalPathModule.criticalConnectorLine(
                    criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection, true,
                    criticalModule.predecessorCollectionTaskIds);
            }
        }
        this.parent.renderTemplates();
        this.triggerQueryTaskbarInfo();
        this.parent.modifiedRecords = [];
        if (this.parent.showOverAllocation) {
            this.updateOverlapped();
        }
        if (collapsedResourceRecord.length) {
            for (let j: number = 0; j < collapsedResourceRecord.length; j++) {
                if (collapsedResourceRecord[j as number].hasChildRecords) {
                    this.parent.isGanttChartRendered = true;
                    this.parent.chartRowsModule.refreshRecords([collapsedResourceRecord[j as number]]);
                }
            }
        }
        this.parent.isGanttChartRendered = true;
        this.parent.renderTemplates();
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
        const parentTrNode: NodeList = this.getTableTrNode(i);
        const leftLabelNode: NodeList = this.getLeftLabelNode(i);
        let taskbarContainerNode: NodeList | NodeList[] = this.taskbarContainer();
        (<HTMLElement>taskbarContainerNode[0]).setAttribute('aria-label', this.generateAriaLabel(this.templateData));
        (<HTMLElement>taskbarContainerNode[0]).setAttribute('rowUniqueId', this.templateData.ganttProperties.rowUniqueID);
        let connectorLineLeftNode: NodeList;
        let connectorLineRightNode: NodeList;
        connectorLineLeftNode = this.getLeftPointNode();
        if ((this.templateData.ganttProperties.isAutoSchedule && this.parent.viewType === 'ProjectView') || !this.templateData.hasChildRecords) {
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
        }
        if (this.templateData.hasChildRecords) {
            let parentTaskbarTemplateNode: NodeList;
            if (!this.parent.enableMultiTaskbar || (this.parent.enableMultiTaskbar && this.templateData.expanded)) {
                parentTaskbarTemplateNode = this.getParentTaskbarNode(i, taskbarContainerNode);
            }
            else {
                taskbarContainerNode = [];
                for (let j: number = 0; j < this.templateData.childRecords.length; j++) {
                    this.templateData = this.templateData.childRecords[j as number];
                    const taskbarContainerNode1: NodeList | NodeList[] = this.taskbarContainer();
                    (<HTMLElement>taskbarContainerNode1[0]).setAttribute('aria-label', this.generateAriaLabel(this.templateData));
                    (<HTMLElement>taskbarContainerNode1[0]).setAttribute('rowUniqueId', this.templateData.ganttProperties.rowUniqueID);
                    if (!this.parent.allowParentDependency) {
                        connectorLineLeftNode = this.getLeftPointNode();
                        taskbarContainerNode1[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
                    }
                    else {
                        connectorLineLeftNode = this.getLeftPointNode();
                        if ((this.templateData.ganttProperties.isAutoSchedule) || !this.templateData.hasChildRecords) {
                            taskbarContainerNode1[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
                        }
                    }
                    this.appendChildTaskbars(tempTemplateData, i, taskbarContainerNode1, connectorLineRightNode, taskbarContainerNode);
                }
            }
            if (!this.templateData.ganttProperties.isAutoSchedule) {
                const manualTaskbar: NodeList = this.getManualTaskbar();
                if (!isNullOrUndefined(manualTaskbar[0])) {
                    if (this.parent.allowParentDependency) {
                        manualTaskbar[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
                        const connectorLineRightNode: NodeList = this.getRightPointNode();
                        manualTaskbar[0].appendChild([].slice.call(connectorLineRightNode)[0]);
                    }
                    /* eslint-disable-next-line */
                    (taskbarContainerNode[0] as any).appendChild([].slice.call(manualTaskbar)[0]);
                }
            }
            if ((this.templateData.ganttProperties.autoDuration !== 0) && !this.templateData.ganttProperties.isMilestone &&
            parentTaskbarTemplateNode && parentTaskbarTemplateNode.length > 0) {
                append(parentTaskbarTemplateNode, taskbarContainerNode[0] as Element);
            }
            else if ((this.templateData.ganttProperties.duration === 0 && this.templateData.ganttProperties.isMilestone &&
                this.templateData.ganttProperties.isAutoSchedule)) {
                const milestoneTemplateNode: NodeList = this.getMilestoneNode(i, taskbarContainerNode as NodeList);
                if (milestoneTemplateNode && milestoneTemplateNode.length > 0) {
                    append(milestoneTemplateNode, taskbarContainerNode[0] as Element);
                }
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                this.taskBaselineTemplateNode = ((this.templateData.ganttProperties.baselineStartDate.getTime() ===
                this.templateData.ganttProperties.baselineEndDate.getTime()) || (
                    (!isNullOrUndefined(this.templateData.ganttProperties.baselineStartDate) &&
                    !isNullOrUndefined(this.templateData.ganttProperties.startDate) &&
                    (this.templateData.ganttProperties.baselineStartDate.getTime() ===
                    this.templateData.ganttProperties.startDate.getTime()))
                    && (!isNullOrUndefined(this.templateData.ganttProperties.baselineEndDate) &&
                    !isNullOrUndefined(this.templateData.ganttProperties.endDate) &&
                    (this.templateData.ganttProperties.baselineEndDate.getTime() ===
                    this.templateData.ganttProperties.endDate.getTime())) &&
                    this.templateData.ganttProperties.isMilestone))
                    ? this.getMilestoneBaselineNode() : this.getTaskBaselineNode();
            }
            if (!this.parent.enableMultiTaskbar || (this.parent.enableMultiTaskbar && this.templateData.expanded)) {
                if (this.parent.allowParentDependency && ((this.templateData.ganttProperties.isAutoSchedule && this.parent.viewType === 'ProjectView') || !this.templateData.hasChildRecords)) {
                    connectorLineRightNode = this.getRightPointNode();
                    /* eslint-disable-next-line */
                    (taskbarContainerNode[0] as any).appendChild([].slice.call(connectorLineRightNode)[0]);
                }
                else if (!this.parent.allowParentDependency) {
                    connectorLineRightNode = this.getRightPointNode();
                    /* eslint-disable-next-line */
                    (taskbarContainerNode[0] as any).appendChild([].slice.call(connectorLineRightNode)[0]);
                }
            }
        } else {
            this.appendChildTaskbars(tempTemplateData, i, taskbarContainerNode, connectorLineRightNode);
        }
        const rightLabelNode: NodeList = this.getRightLabelNode(i);
        if (this.parent.enableMultiTaskbar && this.templateData.hasChildRecords && !this.templateData.expanded) {
            const collapseParent: HTMLElement = createElement('div', {
                className: 'e-collapse-parent'
            });
            parentTrNode[0].childNodes[0].childNodes[0].appendChild(collapseParent);
            for (let j: number = 0; j < taskbarContainerNode.length; j++) {
                addClass([taskbarContainerNode[j as number] as HTMLElement], 'collpse-parent-border');
                parentTrNode[0].childNodes[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskbarContainerNode)[j as number]);
            }
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
            if (this.templateData.ganttProperties.indicators && this.templateData.ganttProperties.indicators.length > 0) {
                this.appendIndicators(i, parentTrNode);
            }
        }
        else {
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskbarContainerNode)[0]);
            if (this.templateData.ganttProperties.indicators && this.templateData.ganttProperties.indicators.length > 0) {
                this.appendIndicators(i, parentTrNode);
            }
            if (rightLabelNode && rightLabelNode.length > 0) {
                parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(rightLabelNode)[0]);
            }
        }
        if (!isNullOrUndefined(this.taskBaselineTemplateNode)) {
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(this.taskBaselineTemplateNode)[0]);
        }
        this.taskBaselineTemplateNode = null;
        const tRow: Node = parentTrNode[0].childNodes[0];
        this.setAriaRowIndex(tempTemplateData, tRow);
        return tRow;
    }
    /**
     * To set data-rowindex for chart rows
     *
     * @returns {void} .
     * @private
     */

    public setAriaRowIndex(tempTemplateData: IGanttData, tRow: Node): void {
        const dataSource: IGanttData[] = this.parent.treeGrid.getCurrentViewRecords() as IGanttData[];
        const visualData: IGanttData[] = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            getValue('virtualScrollModule.visualData', this.parent.treeGrid) : dataSource;
        let index: number;
        if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            /* eslint-disable-next-line */
            const gridData: any = this.parent.treeGrid.grid.contentModule['rows'];
            /* eslint-disable-next-line */
            const data: object = gridData.filter((x: any) => {
                if (x['data'][this.parent.taskFields.id] === tempTemplateData.ganttProperties.taskId) {
                    return x;
                }
            })[0];
            (tRow as Element).setAttribute('data-rowindex', data['index'].toString());
        } else {
            index = visualData.indexOf(tempTemplateData);
            (tRow as Element).setAttribute('aria-rowindex', (index + 1).toString());
            (tRow as Element).setAttribute('data-rowindex', index.toString());
        }
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
            trElement = this.parent.enableImmutableMode ? this.refreshedTr[index as number] : this.ganttChartTableBody.querySelectorAll('tr')[index as number];
            data = this.refreshedData.length > 0 ? this.refreshedData[index as number] : this.parent.currentViewData[index as number];
            const segmentLength: number = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length;
            if (segmentLength > 0) {
                for (let i: number = 0; i < segmentLength; i++) {
                    const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        trElement.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    const segmentElement: HTMLElement = segmentedTasks[i as number] as HTMLElement;
                    this.triggerQueryTaskbarInfoByIndex(segmentElement, data);
                }
            } else if (trElement) {
                this.triggerQueryTaskbarInfoByIndex(trElement, data);
            }
        }
    }

    private appendIndicators(i: number, parentTrNode: NodeList): void {
        let taskIndicatorNode: NodeList;
        let taskIndicatorTextFunction: Function;
        let taskIndicatorTextNode: NodeList;
        const indicators: IIndicator[] = this.templateData.ganttProperties.indicators;
        for (let indicatorIndex: number = 0; indicatorIndex < indicators.length; indicatorIndex++) {
            taskIndicatorNode = this.getIndicatorNode(indicators[indicatorIndex as number]);
            (<HTMLElement>taskIndicatorNode[0]).setAttribute('aria-label', indicators[indicatorIndex as number].name);
            if (indicators[indicatorIndex as number].name.indexOf('$') > -1 || indicators[indicatorIndex as number].name.indexOf('#') > -1) {
                taskIndicatorTextFunction = this.templateCompiler(indicators[indicatorIndex as number].name);
                taskIndicatorTextNode = taskIndicatorTextFunction(
                    extend({ index: i }, this.templateData), this.parent, 'indicatorLabelText');
            } else {
                const text: HTMLElement = createElement('Text');
                text.innerHTML = indicators[indicatorIndex as number].name;
                if (this.parent.enableHtmlSanitizer && typeof (indicators[indicatorIndex as number].name) === 'string') {
                    indicators[indicatorIndex as number].name = SanitizeHtmlHelper.sanitize(indicators[indicatorIndex as number].name);
                }
                taskIndicatorTextNode = text.childNodes;
            }
            taskIndicatorNode[0].appendChild([].slice.call(taskIndicatorTextNode)[0]);
            (taskIndicatorNode[0] as HTMLElement).title =
                !isNullOrUndefined(indicators[indicatorIndex as number].tooltip) ? indicators[indicatorIndex as number].tooltip : '';
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskIndicatorNode)[0]);
        }
    }

    private appendChildTaskbars(tempTemplateData: IGanttData, i: number, taskbarContainerNode: NodeList, connectorLineRightNode: NodeList,
                                taskbarCollection ? : NodeList | NodeList[]): void {
        if (this.templateData.ganttProperties.isMilestone) {
            const milestoneTemplateNode: NodeList = this.getMilestoneNode(i, taskbarContainerNode);
            if (milestoneTemplateNode && milestoneTemplateNode.length > 0) {
                append(milestoneTemplateNode, taskbarContainerNode[0] as Element);
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                this.taskBaselineTemplateNode = ((this.templateData.ganttProperties.baselineStartDate.getTime() ===
                this.templateData.ganttProperties.baselineEndDate.getTime()) || (
                    (!isNullOrUndefined(this.templateData.ganttProperties.baselineStartDate) &&
                    !isNullOrUndefined(this.templateData.ganttProperties.startDate) &&
                    (this.templateData.ganttProperties.baselineStartDate.getTime() ===
                    this.templateData.ganttProperties.startDate.getTime()))
                    && (!isNullOrUndefined(this.templateData.ganttProperties.baselineEndDate) &&
                    !isNullOrUndefined(this.templateData.ganttProperties.endDate) &&
                    (this.templateData.ganttProperties.baselineEndDate.getTime() ===
                    this.templateData.ganttProperties.endDate.getTime())) &&
                    this.templateData.ganttProperties.isMilestone))
                    ? this.getMilestoneBaselineNode() : this.getTaskBaselineNode();
            }
            if (taskbarCollection) {
                /* eslint-disable-next-line */
                (taskbarCollection as any).push(taskbarContainerNode[0]);
                this.templateData = tempTemplateData;
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
                            append(childTaskbarTemplateNode, taskbarContainerNode[0] as Element);
                        }
                    } else {
                        append(childTaskbarTemplateNode, taskbarContainerNode[0] as Element);
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
                this.taskBaselineTemplateNode = ((this.templateData.ganttProperties.baselineStartDate.getTime() ===
                this.templateData.ganttProperties.baselineEndDate.getTime()) || (
                    (!isNullOrUndefined(this.templateData.ganttProperties.baselineStartDate) &&
                    !isNullOrUndefined(this.templateData.ganttProperties.startDate) &&
                    (this.templateData.ganttProperties.baselineStartDate.getTime() ===
                    this.templateData.ganttProperties.startDate.getTime()))
                    && (!isNullOrUndefined(this.templateData.ganttProperties.baselineEndDate) &&
                    !isNullOrUndefined(this.templateData.ganttProperties.endDate) &&
                    (this.templateData.ganttProperties.baselineEndDate.getTime() ===
                    this.templateData.ganttProperties.endDate.getTime())) &&
                    this.templateData.ganttProperties.isMilestone))
                    ? this.getMilestoneBaselineNode() : this.getTaskBaselineNode();
            }
        }
        if (this.parent.allowParentDependency && ((this.templateData.ganttProperties.isAutoSchedule && this.parent.viewType === 'ProjectView') || !this.templateData.hasChildRecords)) {
            connectorLineRightNode = this.getRightPointNode();
            /* eslint-disable-next-line */
            (taskbarContainerNode[0] as any).appendChild([].slice.call(connectorLineRightNode)[0]);
        }
        else if (!this.parent.allowParentDependency) {
            connectorLineRightNode = this.getRightPointNode();
            /* eslint-disable-next-line */
            (taskbarContainerNode[0] as any).appendChild([].slice.call(connectorLineRightNode)[0]);
        }
        if (taskbarCollection) {
            /* eslint-disable-next-line */
            (taskbarCollection as any).push(taskbarContainerNode[0]);
            this.templateData = tempTemplateData;
        }
    }
    private customizeTaskbars(data: IGanttData, trElement: Element, taskbarElement: Element): void {
        let rowElement: Element;
        let segmentRowElement: Element;
        if (data.ganttProperties.segments && data.ganttProperties.segments.length > 0 && trElement && trElement.parentElement
            && trElement.parentElement.parentElement && trElement.parentElement.parentElement.parentElement) {
            segmentRowElement = trElement.parentElement.parentElement.parentElement;
        }
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
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor : null;
            args.baselineColor = trElement.querySelector(classCollections[1]) ?
                getComputedStyle(trElement.querySelector(classCollections[1])).backgroundColor :
                (trElement.querySelector('.' + cls.baselineBar) ? getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).backgroundColor : null);
        } else if (taskbarElement) {
            const childTask: HTMLElement = taskbarElement.querySelector(classCollections[0]);
            const progressTask: HTMLElement = taskbarElement.querySelector(classCollections[1]);
            args.taskbarBgColor = isNullOrUndefined(childTask) ? null : taskbarElement.classList.contains(cls.traceChildTaskBar) ?
                getComputedStyle(taskbarElement).backgroundColor :
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor;
            args.taskbarBorderColor = isNullOrUndefined(childTask) ? null : taskbarElement.classList.contains(cls.traceChildTaskBar) ?
                getComputedStyle(taskbarElement).backgroundColor :
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).outlineColor;
            args.progressBarBgColor = isNullOrUndefined(progressTask) ? null :
                taskbarElement.classList.contains(cls.traceChildProgressBar) ?
                    getComputedStyle(taskbarElement).backgroundColor :
                    getComputedStyle(taskbarElement.querySelector(classCollections[1])).backgroundColor;
            // args.progressBarBorderColor = taskbarElement.querySelector(progressBarClass) ?
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor : null;
            if (segmentRowElement) {
                args.baselineColor = segmentRowElement.querySelector('.' + cls.baselineBar) ?
                    getComputedStyle(segmentRowElement.querySelector('.' + cls.baselineBar)).backgroundColor : null;
            }
            else {
                args.baselineColor = trElement.querySelector('.' + cls.baselineBar) ?
                    getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).backgroundColor : null;
            }
            args.taskLabelColor = taskbarElement.querySelector('.' + cls.taskLabel) ?
                getComputedStyle(taskbarElement.querySelector('.' + cls.taskLabel)).color : null;
        }
        if (segmentRowElement) {
            args.rightLabelColor = segmentRowElement.querySelector('.' + cls.rightLabelContainer) &&
                (segmentRowElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label) ?
                getComputedStyle((segmentRowElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label)).color : null;
            args.leftLabelColor = segmentRowElement.querySelector('.' + cls.leftLabelContainer) &&
                (segmentRowElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label) ?
                getComputedStyle((segmentRowElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label)).color : null;
        }
        else {
            args.rightLabelColor = trElement.querySelector('.' + cls.rightLabelContainer) &&
                (trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label) ?
                getComputedStyle((trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label)).color : null;
            args.leftLabelColor = trElement.querySelector('.' + cls.leftLabelContainer) &&
                (trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label) ?
                getComputedStyle((trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label)).color : null;
        }
        this.parent.trigger('queryTaskbarInfo', args, (taskbarArgs: IQueryTaskbarInfoEventArgs) => {
            this.updateQueryTaskbarInfoArgs(taskbarArgs, rowElement, triggerTaskbarElement);
        });
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
        if (isNullOrUndefined(trElement)) {
            return;
        }
        let taskbarElement: Element;
        let currentData: IGanttData = data;
        if (!(!isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length > 0)) {
            if (this.parent.enableMultiTaskbar) {
                const taskbarElements: NodeListOf<Element> = trElement.querySelectorAll('.' + cls.taskBarMainContainer);
                for (let i: number = 0; i < taskbarElements.length; i++) {
                    taskbarElement = taskbarElements[i as number];
                    currentData = (!data.expanded && data.hasChildRecords) ? data.childRecords[i as number] : currentData;
                    const id: string = this.parent.viewType === 'ResourceView' ?
                        taskbarElement.getAttribute('rowUniqueId') : currentData.ganttProperties.taskId.toString();
                    trElement = this.parent.getRowByID(id);
                    trElement = trElement ? trElement : (taskbarElement.querySelector('.e-gantt-child-taskbar'));
                    if (trElement) {
                        if (trElement.classList.contains('e-segmented-taskbar')) {
                            const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                                trElement.parentElement.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                            for (let i: number = 0; i < segmentedTasks.length; i++) {
                                this.customizeTaskbars(currentData, segmentedTasks[i as number], taskbarElement);
                            }
                        } else {
                            this.customizeTaskbars(currentData, trElement, taskbarElement);
                        }
                    }
                }
            }
            else {
                const taskbarElement: Element = trElement.querySelector('.' + cls.taskBarMainContainer);
                if (trElement) {
                    this.customizeTaskbars(currentData, trElement, taskbarElement);
                }
            }
        }
        else {
            taskbarElement =  trElement;
            if (trElement) {
                this.customizeTaskbars(data, trElement, taskbarElement);
            }
        }
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
    /* eslint-disable-next-line */
    private updateQueryTaskbarInfoArgs(args: IQueryTaskbarInfoEventArgs, rowElement?: Element, taskBarElement?: Element): void {
        const trElement: Element = args.rowElement;
        const taskbarElement: Element = this.parent.enableVirtualization ? args.rowElement : args.taskbarElement;
        const classCollections: string[] = this.getClassName(args);
        let segmentRowElement: Element;
        if (args.data.ganttProperties.segments && args.data.ganttProperties.segments.length > 0) {
            segmentRowElement = trElement.parentElement.parentElement.parentElement;
        }
        if (args.taskbarType === 'Milestone') {
            if (taskbarElement.querySelector(classCollections[0]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor !== args.milestoneColor) {
                (taskbarElement.querySelector(classCollections[0]) as HTMLElement).style.backgroundColor = args.milestoneColor;
            }
            if (trElement.querySelector(classCollections[1]) &&
                getComputedStyle(trElement.querySelector(classCollections[1])).backgroundColor !== args.baselineColor) {
                (trElement.querySelector(classCollections[1]) as HTMLElement).style.backgroundColor = args.baselineColor;
            }
            if (trElement.querySelector('.' + cls.baselineBar) &&
                getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).borderTopColor !== args.baselineColor) {
                (trElement.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor = args.baselineColor;
            }
        } else if (taskbarElement) {
            if (taskbarElement.querySelector(classCollections[0]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor !== args.taskbarBgColor) {
                (taskbarElement.querySelector(classCollections[0]) as HTMLElement).style.backgroundColor = args.taskbarBgColor;
            }
            if (taskbarElement.querySelector(classCollections[0]) &&
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).outlineColor !== args.taskbarBorderColor) {
                (taskbarElement.querySelector(classCollections[0]) as HTMLElement).style.outlineColor = args.taskbarBorderColor;
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
                getComputedStyle(taskbarElement).outlineColor !== args.taskbarBorderColor) {
                (taskbarElement as HTMLElement).style.outlineColor = args.taskbarBorderColor;
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
            if (segmentRowElement) {
                if (segmentRowElement.querySelector('.' + cls.baselineBar) &&
                    getComputedStyle(segmentRowElement.querySelector('.' + cls.baselineBar)).backgroundColor !== args.baselineColor) {
                    (segmentRowElement.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor = args.baselineColor;
                }
            }
            else {
                if (trElement.querySelector('.' + cls.baselineBar) &&
                    getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).backgroundColor !== args.baselineColor) {
                    (trElement.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor = args.baselineColor;
                }
            }
        }
        if (segmentRowElement) {
            if (segmentRowElement.querySelector('.' + cls.leftLabelContainer) &&
                (segmentRowElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label) &&
                getComputedStyle(
                    (segmentRowElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label)).color !== args.leftLabelColor) {
                ((segmentRowElement.querySelector(
                    '.' + cls.leftLabelContainer)).querySelector('.' + cls.label) as HTMLElement).style.color = args.leftLabelColor;
            }
            if (segmentRowElement.querySelector('.' + cls.rightLabelContainer) &&
                (segmentRowElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label) &&
                getComputedStyle(
                    (segmentRowElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label)).color !== args.rightLabelColor) {
                ((segmentRowElement.querySelector(
                    '.' + cls.rightLabelContainer)).querySelector('.' + cls.label) as HTMLElement).style.color = args.rightLabelColor;
            }
        }
        else {
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
    }
    private getClassName(args: IQueryTaskbarInfoEventArgs): string[] {
        const classCollection: string[] = [];
        classCollection.push('.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentTaskBar : args.taskbarType === 'ChildTask' ? cls.traceChildTaskBar : cls.traceMilestone));
        classCollection.push('.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentProgressBar : args.taskbarType === 'ChildTask' ? cls.traceChildProgressBar : cls.baselineMilestoneContainer));
        return classCollection;
    }
    /**
     * To compile template string.
     *
     * @param {string} template .
     * @returns {Function} .
     * @private
     */
    public templateCompiler(template: string | Function): Function {
        if (!isNullOrUndefined(template) && template !== '') {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
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

    // to update the eOverlapped property
    public updateOverlapped(): void {
        for (let k: number = 0; k < this.parent.treeGrid.parentData.length; k++) {
            const childRecords: IGanttData[] = (this.parent.treeGrid.parentData[k as number] as IGanttData).childRecords;
            for (let i: number = 0; i < childRecords.length; i++) {
                if (childRecords[i + 1]) {
                    childRecords[i as number].ganttProperties.eOverlapped = undefined;
                }
                for (let j: number = i + 1; j < childRecords.length; j++) {
                    childRecords[j as number].ganttProperties.eOverlapped = undefined;
                    if (childRecords[i as number].ganttProperties.startDate.getTime() <
                    childRecords[j as number].ganttProperties.endDate.getTime() &&
                        childRecords[i as number].ganttProperties.endDate.getTime() >
                        childRecords[j as number].ganttProperties.startDate.getTime()) {
                        childRecords[j as number].ganttProperties.eOverlapped = true;
                        childRecords[i as number].ganttProperties.eOverlapped = true;
                    }
                    else {
                        if (isNullOrUndefined(childRecords[j as number].ganttProperties.eOverlapped)) {
                            childRecords[j as number].ganttProperties.eOverlapped = false;
                        }
                        if (isNullOrUndefined(childRecords[i as number].ganttProperties.eOverlapped)) {
                            childRecords[i as number].ganttProperties.eOverlapped = false;
                        }
                    }
                }
            }
        }
    }

    // To update the row height when allow overallocation set to false
    public updateDragDropRecords(data: IGanttData, tr?: Node): void {
        const childRecords: IGanttData[] = data.childRecords;
        const rowIndex: number = this.parent.currentViewData.indexOf(data);
        const treeGridContentHeight: number = this.parent.enableRtl ?
            this.parent['element'].getElementsByClassName('e-content')[2].children[0]['offsetHeight'] :
            this.parent['element'].getElementsByClassName('e-content')[0].children[0]['offsetHeight'];
        if (!tr) {
            tr = this.ganttChartTableBody.childNodes[rowIndex as number];
        }
        if (this.parent.ganttChartModule.isExpandAll || this.parent.ganttChartModule.isCollapseAll) {
            tr['style'].height = this.parent.treeGrid.getRowByIndex(rowIndex as number)['style'].height = this.parent.rowHeight + 'px';
        }
        else {
            tr['style'].height = this.parent.treeGrid.getRows()[rowIndex as number]['style'].height = this.parent.rowHeight + 'px';
        }
        this.parent.contentHeight = treeGridContentHeight;
        const rowIDs: string[] = [];
        let rowCounts: number = 0;
        if (data) {
            for (let i: number = 0; i < childRecords.length; i++) {
                for (let j: number = i + 1; j < childRecords.length; j++) {
                    const taskbarContainer: HTMLCollectionOf<HTMLElement> = (tr as HTMLElement).getElementsByClassName('e-taskbar-main-container') as HTMLCollectionOf<HTMLElement>;
                    for (let k: number = 0; k < taskbarContainer.length; k++) {
                        const rowuniqueid: string = this.parent.viewType === 'ResourceView' ? childRecords[j as number]['rowUniqueID'] : childRecords[j as number].ganttProperties.rowUniqueID;
                        if (childRecords[i as number].ganttProperties.startDate.getTime() <
                        childRecords[j as number].ganttProperties.endDate.getTime() &&
                            childRecords[i as number].ganttProperties.endDate.getTime() >
                            childRecords[j as number].ganttProperties.startDate.getTime()) {
                            if (taskbarContainer[k as number].getAttribute('rowuniqueid') === rowuniqueid &&
                                rowIDs.indexOf(rowuniqueid) === -1) {
                                rowIDs.push(rowuniqueid);
                                rowCounts++;
                                (tr as HTMLElement).children[0]['style'].verticalAlign = 'baseline';
                                (tr as HTMLElement).getElementsByClassName('e-taskbar-main-container')[k as number]['style'].marginTop =
                                ((rowCounts as number) * this.parent.rowHeight) + this.taskBarMarginTop + 'px';
                                if (this.parent.ganttChartModule.isExpandAll || this.parent.ganttChartModule.isCollapseAll) {
                                    tr['style'].height = this.parent.treeGrid.getRowByIndex(rowIndex as number)['style'].height = parseInt(tr['style'].height, 10) + this.parent.rowHeight + 'px';
                                }
                                else {
                                    tr['style'].height = this.parent.treeGrid.getRows()[rowIndex as number]['style'].height = parseInt(tr['style'].height, 10) + this.parent.rowHeight + 'px';
                                }
                            }
                        }
                        else {
                            if (taskbarContainer[k as number].getAttribute('rowuniqueid') === rowuniqueid &&
                                rowIDs.indexOf(rowuniqueid) === -1 && this.parent.rowDragAndDropModule &&
                                this.parent.rowDragAndDropModule['draggedRecord'] && taskbarContainer[k as number].getAttribute('rowuniqueid') ===
                                this.parent.rowDragAndDropModule['draggedRecord']['rowUniqueID'] && this.parent.rowDragAndDropModule['draggedRecord']['rowUniqueID'] ===
                                childRecords[j as number]['rowUniqueID']) {
                                (tr as HTMLElement).getElementsByClassName('e-taskbar-main-container')[k as number]['style'].marginTop =
                                    this.parent.editModule.taskbarEditModule.draggedRecordMarginTop;
                            }
                        }
                    }
                }
            }
            this.parent.contentHeight = treeGridContentHeight;
            document.getElementsByClassName('e-chart-rows-container')[0]['style'].height = this.parent.contentHeight + 'px';
        }
    }

    /**
     * To refresh edited TR
     *
     * @param {number} index .
     * @param {boolean} isValidateRange .
     * @param {boolean} isUndoRedo .
     * @returns {void} .
     * @private
     */
    public refreshRow(index: number, isValidateRange?: boolean, isUndoRedo?: boolean): void {
        const tr: Node = this.ganttChartTableBody.childNodes[index as number];
        let selectedItem: IGanttData;
        if (isUndoRedo) {
            selectedItem = this.parent.previousFlatData[index as number];
        }
        else {
            selectedItem = this.parent.currentViewData[index as number];
        }
        if (index !== -1 && selectedItem) {
            const data: IGanttData = selectedItem;
            if (!this.parent.allowTaskbarOverlap && data.expanded) {
                if (this.parent.ganttChartModule.isExpandAll || this.parent.ganttChartModule.isCollapseAll) {
                    tr['style'].height = this.parent.treeGrid.getRowByIndex(index as number)['style'].height = this.parent.rowHeight + 'px';
                }
                else {
                    tr['style'].height = this.parent.treeGrid.getRows()[index as number]['style'].height = this.parent.rowHeight + 'px';
                }
            }
            if (data.hasChildRecords && !data.expanded && this.parent.enableMultiTaskbar) {
                tr.replaceChild(this.getGanttChartRow(index, data).childNodes[0], tr.childNodes[0]);
                if (this.parent.renderBaseline) {
                    data.childRecords.forEach((childRecord: IGanttData) => {
                        if (!isNullOrUndefined(childRecord.ganttProperties.baselineStartDate &&
                            childRecord.ganttProperties.baselineEndDate)) {
                            tr.childNodes[0].appendChild((this.updateTaskBaselineNode(childRecord))[0]);
                        }
                    });
                }
            } else {
                if (this.parent.allowTaskbarDragAndDrop && !data.expanded) {
                    (tr as Element).replaceWith(this.getGanttChartRow(index, data));
                }
                else {
                    tr.replaceChild(this.getGanttChartRow(index, data).childNodes[0], tr.childNodes[0]);
                }
            }
            this.parent.renderTemplates();
            if (data.hasChildRecords && this.parent.showOverAllocation && this.parent.allowTaskbarOverlap) {
                if (isValidateRange) {
                    this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
                } else {
                    this.parent.dataOperation.updateOverlappingValues(data);
                    this.parent.ganttChartModule.renderRangeContainer([data as IGanttData]);
                }
            }
            const segmentLength: number = !isNullOrUndefined(data.ganttProperties.segments) && data.ganttProperties.segments.length;
            if (segmentLength > 0) {
                for (let i: number = 0; i < segmentLength; i++) {
                    const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                        (tr as Element).getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
                    const segmentElement: HTMLElement = segmentedTasks[i as number] as HTMLElement;
                    this.triggerQueryTaskbarInfoByIndex(segmentElement, data);
                }
            } else {
                this.triggerQueryTaskbarInfoByIndex(tr as Element, data);
            }
            const dataId: number | string = this.parent.viewType === 'ProjectView' ? data.ganttProperties.taskId : data.ganttProperties.rowUniqueID;
            if (!this.parent.ganttChartModule.isExpandAll && !this.parent.ganttChartModule.isCollapseAll) {
                this.parent.treeGrid.grid.setRowData(dataId, data);
            }
            if (data.hasChildRecords && !data.expanded && this.parent.enableMultiTaskbar && !this.parent.allowTaskbarOverlap) {
                this.updateDragDropRecords(selectedItem, tr);
            }
            if (data.hasChildRecords && this.parent.showOverAllocation && !this.parent.allowTaskbarOverlap) {
                this.parent.dataOperation.updateOverlappingValues(data);
                this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
            }
            const nextEditableElement: HTMLElement = this.parent.ganttChartModule.tempNextElement;
            if (this.parent.ganttChartModule.isEditableElement && nextEditableElement) {
                this.parent.treeGrid.grid.focusModule.focus();
                addClass([this.parent.treeGrid.getRows()[(tr as HTMLElement).getAttribute('data-rowindex')].children[this.parent.ganttChartModule.childrenIndex]], 'e-focused');
                this.parent.ganttChartModule.tempNextElement = null;
            }
            const row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                this.parent.treeGrid.grid.getDataRows()[index as number].getAttribute('data-uid'));
            if (!isNullOrUndefined(row)) {
                row.data = data;
            }
        }
    }

    private updateResourceTaskbarElement(tRow: Node, parentTr: NodeList): void {
        let cloneElement: HTMLElement = (tRow as Element).querySelector('.e-taskbar-main-container');
        if (this.parent.viewType === 'ProjectView' && (tRow as Element).querySelector('.e-collapse-parent')) {
            cloneElement = (tRow as Element).querySelector('.e-collapse-parent');
        }
        if ((tRow as Element).querySelector('.e-collapse-parent') === null) {
            addClass([cloneElement], 'collpse-parent-border');
        }
        const id: string = (tRow as Element).querySelector('.' + cls.taskBarMainContainer).getAttribute('rowUniqueId');
        const ganttData: IGanttData = this.parent.getRecordByID(id);
        if (!(isNullOrUndefined(ganttData)) && ganttData.ganttProperties.segments && ganttData.ganttProperties.segments.length > 0) {
            const segmentedTasks: HTMLCollectionOf<HTMLElement> =
                cloneElement.getElementsByClassName('e-segmented-taskbar') as HTMLCollectionOf<HTMLElement>;
            for (let i: number = 0; i < segmentedTasks.length; i++) {
                this.triggerQueryTaskbarInfoByIndex(segmentedTasks[i as number], ganttData);
            }
        }
        else if (this.parent.queryTaskbarInfo) {
            const mainTaskbar: HTMLElement = (cloneElement.querySelector('.e-gantt-child-taskbar'));
            if (!isNullOrUndefined(mainTaskbar)) {
                this.triggerQueryTaskbarInfoByIndex(mainTaskbar, ganttData);
            }
        }
        let zIndex: string = '';
        if (ganttData && !isNullOrUndefined(ganttData.ganttProperties.eOverlapIndex)) {
            zIndex = (ganttData.ganttProperties.eOverlapIndex).toString();
        }
        const cloneChildElement: HTMLElement = cloneElement.cloneNode(true) as HTMLElement;
        cloneChildElement.style.zIndex = zIndex;
        parentTr[0].childNodes[0].childNodes[0].childNodes[0].appendChild(cloneChildElement);
    }

    /**
     * To refresh all edited records
     *
     * @param {IGanttData} items .
     * @param {boolean} isValidateRange .
     * @param {boolean} isUndoRedo .
     * @returns {void} .
     * @private
     */
    public refreshRecords(items: IGanttData[], isValidateRange?: boolean, isUndoRedo?: boolean): void {
        if (this.parent.isGanttChartRendered) {
            this.parent.renderTemplates();
            if (this.parent.enableMultiTaskbar) {
                let sortedRecords: IGanttData[] = [];
                sortedRecords = new DataManager(items).executeLocal(new Query()
                    .sortBy('expanded', 'Descending'));
                items = sortedRecords;
            }
            for (let i: number = 0; i < items.length; i++) {
                let index: number;
                if (isUndoRedo) {
                    index = this.parent.ids.indexOf(items[i as number].ganttProperties.taskId.toString());
                }
                else {
                    index = this.parent.currentViewData.indexOf(items[i as number]);
                }
                if (!this.parent.enableMultiTaskbar ||
                    (this.parent.enableMultiTaskbar && (items[i as number].expanded || !this.parent.isLoad))) {
                    this.refreshRow(index, isValidateRange, isUndoRedo);
                }
            }
            this.parent.ganttChartModule.updateLastRowBottomWidth();
        }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        (this.ganttChartTableBody.childNodes).forEach((tr: Node) => {
            if (tr instanceof Element) {
                tr.removeEventListener('touchmove', this.handleTouchMove);
                tr.removeEventListener('touchend', this.handleTouchEnd);
            }
        });
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

    private generateBaselineAriaLabel(data: IGanttData): string {
        data = this.templateData;
        let defaultValue: string = '';
        const nameConstant: string = this.parent.localeObj.getConstant('name');
        const startDateConstant: string = this.parent.localeObj.getConstant('startDate');
        const endDateConstant: string = this.parent.localeObj.getConstant('endDate');
        const taskNameVal: string = data.ganttProperties.taskName;
        const startDateVal: Date = data.ganttProperties.baselineStartDate;
        const endDateVal: Date = data.ganttProperties.baselineEndDate;
        defaultValue +=  'Baseline' + ' ';
        defaultValue += nameConstant + ' ' + taskNameVal + ' ';
        defaultValue += startDateConstant + ' ' + this.parent.getFormatedDate(startDateVal) + ' ';
        defaultValue += endDateConstant + ' ' + this.parent.getFormatedDate(endDateVal) + ' ';
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
