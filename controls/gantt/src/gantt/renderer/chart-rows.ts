import { createElement, isNullOrUndefined, extend, compile } from '@syncfusion/ej2-base';
import { formatUnit, updateBlazorTemplate, resetBlazorTemplate, isBlazor, addClass } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { isScheduledTask } from '../base/utils';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as cls from '../base/css-constants';
import { IGanttData, IQueryTaskbarInfoEventArgs, IParent, IIndicator, ITaskData } from '../base/interface';
import { Row, Column } from '@syncfusion/ej2-grids';
/**
 * To render the chart rows in Gantt
 */
export class ChartRows {
    public ganttChartTableBody: Element;
    public taskTable: HTMLElement;
    private parent: Gantt;
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

    constructor(ganttObj?: Gantt) {
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
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.taskTable);
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
            if (this.taskLabelTemplateFunction) {
                let taskLabelTemplateNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false);
                let tempDiv: Element = createElement('div');
                tempDiv.appendChild(taskLabelTemplateNode[0]);
                labelString = tempDiv.innerHTML;
            } else {
                labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
                labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
            }
            let template: string = (data.ganttProperties.startDate && data.ganttProperties.endDate
                && data.ganttProperties.duration) ? (
                    '<div class="' + cls.childTaskBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' + (data.ganttProperties.isAutoSchedule ?
                        '' :  cls.manualChildTaskBar) + '"' +
                    'style="width:' + data.ganttProperties.width + 'px;height:' +
                    (this.taskBarHeight) + 'px;">' + '<div class="' + cls.childProgressBarInnerDiv + ' ' +
                    cls.traceChildProgressBar + ' ' + (data.ganttProperties.isAutoSchedule ?
                        '' : cls.manualChildProgressBar) + '"' +
                    ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                    'width:' + data.ganttProperties.progressWidth + 'px;height:100%;' +
                    'border-top-right-radius:' + this.getBorderRadius(data.ganttProperties) + 'px;' +
                    'border-bottom-right-radius:' + this.getBorderRadius(data.ganttProperties) + 'px;">' +
                    '<span class="' + cls.taskLabel + '" style="line-height:' +
                    (this.taskBarHeight - 1) + 'px; text-align:' + (this.parent.viewType === 'ResourceView' ? 'left;' : '') +
                    'display:' + (this.parent.viewType === 'ResourceView' ? 'inline-flex;' : '') +
                    'width:' + (this.parent.viewType === 'ResourceView' ? (data.ganttProperties.width - 10) : '') + 'px; height:' +
                    this.taskBarHeight + 'px;">' + labelString + '</span></div></div>') :
                (data.ganttProperties.startDate && !data.ganttProperties.endDate && !data.ganttProperties.duration) ? (
                    '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
                    cls.unscheduledTaskbarLeft + ' ' + (data.ganttProperties.isAutoSchedule ?
                        '' :  cls.manualChildTaskBar) + '"' +
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

            childTaskbarNode = this.createDivElement(template);
        }
        return childTaskbarNode;
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
                this.getTemplateID('LeftLabelTemplate'), false);
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
                this.getTemplateID('RightLabelTemplate'), false);
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
            let labelString: string = '';
            if (this.taskLabelTemplateFunction) {
                let parentTaskLabelNode: NodeList = this.taskLabelTemplateFunction(
                    extend({ index: i }, data), this.parent, 'TaskLabelTemplate',
                    this.getTemplateID('TaskLabelTemplate'), false);
                let div: Element = createElement('div');
                div.appendChild(parentTaskLabelNode[0]);
                labelString = div.innerHTML;
            } else {
                labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
                labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
            }
            let tHeight: number = this.taskBarHeight / 5;
            let template: string = '<div class="' + cls.parentTaskBarInnerDiv + ' ' +
                this.getExpandClass(data) + ' ' + cls.traceParentTaskBar + '"' +
                ' style="width:' + (data.ganttProperties.isAutoSchedule ? data.ganttProperties.width :
                     data.ganttProperties.autoWidth) + 'px;height:' + (data.ganttProperties.isAutoSchedule ? this.taskBarHeight :
                        (tHeight * 3)) + 'px;margin-top:' + (data.ganttProperties.isAutoSchedule ? '' :
                        (tHeight * 2)) + 'px;">' +
                '<div class="' + cls.parentProgressBarInnerDiv + ' ' + this.getExpandClass(data) + ' ' + cls.traceParentProgressBar + '"' +
                ' style="border-style:' + (data.ganttProperties.progressWidth ? 'solid;' : 'none;') +
                'width:' + data.ganttProperties.progressWidth + 'px;' +
                'border-top-right-radius:' + this.getBorderRadius(data) + 'px;' +
                'border-bottom-right-radius:' + this.getBorderRadius(data) + 'px;height:100%;"><span class="' +
                cls.taskLabel + '" style="line-height:' +
                (this.taskBarHeight - 1) + 'px; display:' + (this.parent.viewType === 'ResourceView' ? 'inline-flex;' : '') + 'width:' +
                (this.parent.viewType === 'ResourceView' ? (data.ganttProperties.width - 10) : '') + 'px; height:' +
                this.taskBarHeight + 'px;">' + labelString + '</span></div></div>';
            let milestoneTemplate: string = '<div class="' + cls.parentMilestone + '" style="position:absolute;">' +
                '<div class="' + cls.parentMilestoneTop + '" style="border-right-width:' +
                this.milesStoneRadius + 'px;border-left-width:' + this.milesStoneRadius + 'px;border-bottom-width:' +
                this.milesStoneRadius + 'px;"></div>' +
                '<div class="' + cls.parentMilestoneBottom + '" style="top:' +
                (this.milesStoneRadius) + 'px;border-right-width:' + this.milesStoneRadius + 'px; border-left-width:' +
                this.milesStoneRadius + 'px; border-top-width:' + this.milesStoneRadius + 'px;"></div></div>';
            parentTaskbarNode = this.createDivElement(data.ganttProperties.isMilestone ?
                 data.ganttProperties.isAutoSchedule ? milestoneTemplate : '' : template);
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
        if (typeof template !== 'string') {
            result = true;
        } else if (template.indexOf('#') === 0 || template.indexOf('<') > -1
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
        this.ganttChartTableBody.innerHTML = '';
        let collapsedResourceRecord: IGanttData[] = [];
        for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
            let tempTemplateData: IGanttData = this.parent.currentViewData[i];
            if (this.parent.viewType === 'ResourceView' && !tempTemplateData.expanded && this.parent.enableMultiTaskbar) {
                collapsedResourceRecord.push(tempTemplateData);
            }
            this.ganttChartTableBody.appendChild(this.getGanttChartRow(i, tempTemplateData));
        }
        this.triggerQueryTaskbarInfo();
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
                    if (scheduledTask) {
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
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarTemplateNode)[0]);
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
        return parentTrNode[0].childNodes[0];
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
        let length: number = this.ganttChartTableBody.querySelectorAll('tr').length;
        let trElement: Element;
        let taskbarElement: Element;
        let data: IGanttData;
        for (let index: number = 0; index < length; index++) {
            trElement = this.ganttChartTableBody.querySelectorAll('tr')[index];
            taskbarElement = trElement.querySelector('.' + cls.taskBarMainContainer);
            data = this.parent.currentViewData[index];
            this.triggerQueryTaskbarInfoByIndex(trElement, data);
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
        taskbarElement = trElement.querySelector('.' + cls.taskBarMainContainer);
        let rowElement: Element;
        let triggerTaskbarElement: Element;
        let args: IQueryTaskbarInfoEventArgs = {
            data: data,
            rowElement: trElement,
            taskbarElement: trElement.querySelector('.' + cls.taskBarMainContainer),
            taskbarType: data.hasChildRecords ? 'ParentTask' : data.ganttProperties.isMilestone ? 'Milestone' : 'ChildTask'
        };
        let classCollections: string[] = this.getClassName(args);
        if (args.taskbarType === 'Milestone') {
            args.milestoneColor = taskbarElement.querySelector(classCollections[0]) ?
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderBottomColor : null;
            args.baselineColor = trElement.querySelector(classCollections[1]) ?
                getComputedStyle(trElement.querySelector(classCollections[1])).borderBottomColor : null;
        } else {
            args.taskbarBgColor = taskbarElement.querySelector(classCollections[0]) ?
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).backgroundColor : null;
            args.taskbarBorderColor = taskbarElement.querySelector(classCollections[0]) ?
                getComputedStyle(taskbarElement.querySelector(classCollections[0])).borderColor : null;
            args.progressBarBgColor = taskbarElement.querySelector(classCollections[1]) ?
                getComputedStyle(taskbarElement.querySelector(classCollections[1])).backgroundColor : null;
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
            let e: Object;
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
                let cloneElement: HTMLElement = chartRows[i].querySelector('.e-taskbar-main-container') as HTMLElement;
                addClass([cloneElement], 'collpse-parent-border');
                let id: string = chartRows[i].querySelector('.' + cls.taskBarMainContainer).getAttribute('rowUniqueId');
                let ganttData: IGanttData = this.parent.getRecordByID(id);
                let zIndex: string =  (ganttData.ganttProperties.eOverlapIndex).toString();
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