import { createElement, isNullOrUndefined, extend, compile, formatUnit } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { isScheduledTask } from '../base/utils';
import * as cls from '../base/css-constants';
import { IGanttData, IQueryTaskbarInfoEventArgs, IParent, IIndicator } from '../base/interface';
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
    private parentTemplateFunction: Function;
    private leftTaskLabelTemplateFunction: Function;
    private rightTaskLabelTemplateFunction: Function;
    private childTaskbarTemplateFunction: Function;
    private milestoneTemplateFunction: Function;
    private templateData: IGanttData;
    private parentTrFunction: Function;
    private leftLabelContainerFunction: Function;
    private rightLabelContainerFunction: Function;
    private taskbarContainerFunction: Function;
    private childTaskbarLeftResizerFunction: Function;
    private childTaskbarRightResizerFunction: Function;
    private childTaskbarProgressResizerFunction: Function;
    private taskBaselineTemplateFunction: Function;
    private milestoneBaselineTemplateFunction: Function;
    private taskIndicatorFunction: Function;
    private touchLeftConnectorpoint: string = '';
    private touchRightConnectorpoint: string = '';
    public connectorPointWidth: number;
    private connectorPointRadius: number;
    private connectorPointMargin: number;
    private connectorLineLeftFunction: Function;
    private connectorLineRightFunction: Function;
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
        this.ganttChartTableTemplateInit();
        this.initializeChartTemplate();
    }
    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    public renderChartRows(): void {
        this.createTaskbarTemplate();
        this.triggerQueryTaskbarInfo();
        this.parent.isGanttChartRendered = true;
    }

    /**
     * To get left task label template string.
     * @return {string}
     * @private
     */
    private getTaskbarLeftLabelString(field: string): string {
        let labelString: string = this.getTaskLabel(field);
        if (labelString) {
            labelString = labelString === 'isCustomTemplate' ? field : labelString;
            let templateString: string = '<div class="' + cls.leftLabelInnerDiv + '"  style="height:' +
                (this.taskBarHeight) +
                'px;margin-top:' + this.taskBarMarginTop + 'px;"><span class="' + cls.label + '">' +
                labelString + '</span></div>';
            return templateString;
        }
        return null;
    }

    /**
     * To get right task label template string.
     * @return {string}
     * @private
     */
    private getTaskbarRightLabelString(field: string): string {
        let labelString: string = this.getTaskLabel(field);
        if (labelString) {
            labelString = labelString === 'isCustomTemplate' ? field : labelString;
            let templateString: string = '<div class="' + cls.rightLabelInnerDiv + '"  style="height:'
                + (this.taskBarHeight) + 'px;margin-top:' + this.taskBarMarginTop +
                'px;"><span class="' + cls.label + '">' + labelString + '</span></div>';
            return templateString;
        }
        return null;
    }

    /**
     * To get gantt Indicator.
     * @return {string}
     * @private
     */
    private getIndicatorString(): string {
        let templateString: string = '<label class="' + cls.taskIndicatorDiv + '"  style="line-height:'
            + (this.parent.rowHeight) + 'px;' +
            'left:${this.chartRowsModule.getIndicatorleft(date) }px;"><i class="${iconCls}"></i> </label>';
        return templateString;
    }

    /**
     * To get gantt Indicator.
     * @return {number}
     * @private
     */
    public getIndicatorleft(date: Date): number {
        date = this.parent.dateValidationModule.getDateFromFormat(date);
        let left: number = this.parent.dataOperation.getTaskLeft(date, false);
        return left;
    }

    /**
     * To get parent taskbar template string.
     * @return {string}
     * @private
     */
    private getParentTaskbarTemplateString(): string {
        let labelString: string = this.getTaskLabel(this.parent.labelSettings.taskLabel);
        labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
        return '<div class="' + cls.parentTaskBarInnerDiv +
            ' ${this.chartRowsModule.getExpandClass(data) } ' + cls.traceParentTaskBar + '"' +
            ' style="width:${ganttProperties.width}px;height:' + this.taskBarHeight + 'px;">' +
            '<div class="' + cls.parentProgressBarInnerDiv + ' ${this.chartRowsModule.getExpandClass(data) } ' +
            cls.traceParentProgressBar + '"' +
            ' style="border-style:${if(ganttProperties.progressWidth) }solid${else}none${/if};' +
            'width:${ganttProperties.progressWidth}px;' +
            'border-top-right-radius:${this.chartRowsModule.getBorderRadius(data)}px;' +
            'border-bottom-right-radius:${this.chartRowsModule.getBorderRadius(data)}px;height:100%;"><span class="' +
            cls.taskLabel + '" style="line-height:' +
            (this.taskBarHeight - 1) + 'px;height:' + this.taskBarHeight + 'px;">' +
            labelString + '</span></div></div>';
    }

    /**
     * To get child taskbar template string.
     * @return {string}
     * @private
     */
    private getChildTaskbarTemplateString(): string {
        let labelString: string = this.getTaskLabel(this.parent.labelSettings.taskLabel);
        labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
        return '${if(ganttProperties.startDate&&ganttProperties.endDate&&ganttProperties.duration)}' +
            '<div class="' + cls.childTaskBarInnerDiv + ' ' + cls.traceChildTaskBar + '"' +
            'style="width:${ganttProperties.width}px;height:' +
            (this.taskBarHeight) + 'px;">' + '<div class="' + cls.childProgressBarInnerDiv + ' ' +
            cls.traceChildProgressBar + '"' +
            ' style="border-style:${if(ganttProperties.progressWidth) }solid${else}none${/if};' +
            'width:${ganttProperties.progressWidth}px;height:100%;' +
            'border-top-right-radius:${this.chartRowsModule.getBorderRadius(ganttProperties) }px;' +
            'border-bottom-right-radius:${this.chartRowsModule.getBorderRadius(ganttProperties) }px;">' +
            '<span class="' + cls.taskLabel + '" style="line-height:' +
            (this.taskBarHeight - 1) + 'px;height:' + this.taskBarHeight + 'px;">' +
            labelString + '</span></div></div>' +
            '${else}' +
            '${if(ganttProperties.startDate&&!ganttProperties.endDate&&!ganttProperties.duration)}' +
            '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
            cls.unscheduledTaskbarLeft + '"' +
            'style="left:${ganttProperties.left}px; height:' + this.taskBarHeight + 'px;"></div>' +
            '${else if(ganttProperties.endDate&&!ganttProperties.startDate&&!ganttProperties.duration)}' +
            '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
            cls.unscheduledTaskbarRight + '"' +
            'style="left:${ganttProperties.left}px; height:' + this.taskBarHeight + 'px;"></div>' +
            '${else if(ganttProperties.duration&&!ganttProperties.startDate&&!ganttProperties.endDate)}' +
            '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildTaskBar + ' ' +
            cls.unscheduledTaskbar + '"' +
            'style="left:${ganttProperties.left}px; width:${ganttProperties.width}px;' +
            ' height:' + this.taskBarHeight + 'px;"></div>' +
            '${/if}' +
            '${/if};';
    }

    /**
     * To get milestone template string.
     * @return {string}
     * @private
     */
    private getMilestoneTemplateString(): string {
        return '<div class="' + cls.traceMilestone + '" style="position:absolute;">' +
            '<div class="' + cls.milestoneTop + '${if(!ganttProperties.startDate&&!ganttProperties.endDate)}' + ' ' +
            cls.unscheduledMilestoneTop + '${/if}' + '" style="border-right-width:' +
            this.milesStoneRadius + 'px;border-left-width:' + this.milesStoneRadius + 'px;border-bottom-width:' +
            this.milesStoneRadius + 'px;"></div>' +
            '<div class="' + cls.milestoneBottom + '${if(!ganttProperties.startDate&&!ganttProperties.endDate)}' + ' ' +
            cls.unscheduledMilestoneBottom + '${/if}' + '" style="top:' +
            (this.milesStoneRadius) + 'px;border-right-width:' + this.milesStoneRadius + 'px; border-left-width:' +
            this.milesStoneRadius + 'px; border-top-width:' + this.milesStoneRadius + 'px;"></div></div>';
    }

    /**
     * To get task baseline template string.
     * @return {string}
     * @private
     */
    private getTaskBaselineTemplateString(): string {
        return '<div class="' + cls.baselineBar + '" style="margin-top:' + this.baselineTop +
            'px;left:${ganttProperties.baselineLeft }px;' +
            'width:${ganttProperties.baselineWidth }px;height:' +
            this.baselineHeight + 'px;' + (this.baselineColor ? 'background-color: ' + this.baselineColor + ';' : '') + '"></div>';
    }

    /**
     * To get milestone baseline template string.
     * @return {string}
     * @private
     */
    private getMilestoneBaselineTemplateString(): string {
        return '<div class="' + cls.baselineMilestoneContainer + '" style="' +
            'left:${(data.ganttProperties.baselineLeft -' + (this.milesStoneRadius) + ')}px;' +
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
    }

    /**
     * To get taskbar row('TR') template string
     * @return {string}
     * @private
     */
    private getTableTrTemplateString(): string {
        let className: string = (this.parent.gridLines === 'Horizontal' || this.parent.gridLines === 'Both') ?
            'e-chart-row-border' : '';
        return '<tr class="${this.chartRowsModule.getRowClassName(data)} ' + cls.chartRow + '"' +
            'style="display:${this.chartRowsModule.getExpandDisplayProp(data)};height:' +
            this.parent.rowHeight + 'px;">' +
            '<td class="' + cls.chartRowCell + ' ' + className
            + '" style="width:' + this.parent.timelineModule.totalTimelineWidth + 'px;"></td></tr>';
    }

    /**
     * To initialize chart templates.
     * @return {void}
     * @private
     */
    private initializeChartTemplate(): void {
        this.parentTemplateFunction = isNullOrUndefined(this.templateCompiler(this.parent.parentTaskbarTemplate)) ?
            this.templateCompiler(this.getParentTaskbarTemplateString()) :
            this.templateCompiler(this.parent.parentTaskbarTemplate);
        this.leftTaskLabelTemplateFunction = !isNullOrUndefined(this.parent.labelSettings.leftLabel) &&
            this.parent.labelSettings.leftLabel.indexOf('#') === 0 ? this.templateCompiler(this.parent.labelSettings.leftLabel) :
            this.templateCompiler(this.getTaskbarLeftLabelString(this.parent.labelSettings.leftLabel));
        this.rightTaskLabelTemplateFunction = !isNullOrUndefined(this.parent.labelSettings.rightLabel) &&
            this.parent.labelSettings.rightLabel.indexOf('#') === 0 ? this.templateCompiler(this.parent.labelSettings.rightLabel) :
            this.templateCompiler(this.getTaskbarRightLabelString(this.parent.labelSettings.rightLabel));
        this.childTaskbarTemplateFunction = isNullOrUndefined(this.templateCompiler(this.parent.taskbarTemplate)) ?
            this.templateCompiler(this.getChildTaskbarTemplateString()) : this.templateCompiler(this.parent.taskbarTemplate);
        this.milestoneTemplateFunction = isNullOrUndefined(this.templateCompiler(this.parent.milestoneTemplate)) ?
            this.templateCompiler(this.getMilestoneTemplateString()) : this.templateCompiler(this.parent.milestoneTemplate);
    }

    /**
     * To initialize basic chart table templates.
     * @return {void}
     * @private
     */
    private ganttChartTableTemplateInit(): void {

        let parentTr: string = this.getTableTrTemplateString();
        this.parentTrFunction = this.templateCompiler(parentTr);

        let parentLeftLabelDiv: string = '<div class="' + cls.leftLabelContainer + '" style="height:' +
            (this.parent.rowHeight - 1) + 'px;width: ${this.chartRowsModule.taskNameWidth(data)};"></div>';
        this.leftLabelContainerFunction = this.templateCompiler(parentLeftLabelDiv);

        let parentRightLabelDiv: string = '<div class="' + cls.rightLabelContainer + '" ' +
            ' style="left: ${this.chartRowsModule.getRightLabelLeft(data) }px;height:'
            + (this.parent.rowHeight - 1) + 'px;"></div>';
        this.rightLabelContainerFunction = this.templateCompiler(parentRightLabelDiv);

        let taskbarContainerDiv: string = '<div class="' + cls.taskBarMainContainer +
            '${this.getUnscheduledTaskClass(ganttProperties)}' +
            '${if(ganttProperties.cssClassMapping)} ${ganttProperties.cssClassMapping}${/if}"' +
            ' style="${if(ganttProperties.isMilestone)}width:' + this.milestoneHeight + 'px;height:' +
            this.milestoneHeight + 'px;margin-top:' +
            this.milestoneMarginTop + 'px;left:${(data.ganttProperties.left - ' +
            (this.milestoneHeight / 2) + ')}px;${else}width:${ganttProperties.width}px;margin-top:' +
            this.taskBarMarginTop + 'px;left:${ganttProperties.left}px;height:' + this.taskBarHeight + 'px;${/if}"></div>';
        this.taskbarContainerFunction = this.templateCompiler(taskbarContainerDiv);

        let childTaskbarLeftResizeDiv: string = '<div class="' + cls.taskBarLeftResizer + ' ' + cls.icon + '"' +
            ' style="left:-2px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        this.childTaskbarLeftResizerFunction = this.templateCompiler(childTaskbarLeftResizeDiv);
        let childTaskbarRightResizeDiv: string = '<div class="' + cls.taskBarRightResizer + ' ' + cls.icon + '"' +
            ' style="left:${(data.ganttProperties.width - ' + 10 + ')}px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        this.childTaskbarRightResizerFunction = this.templateCompiler(childTaskbarRightResizeDiv);
        let childTaskbarProgressResizeDiv: string = '<div class="' + cls.childProgressResizer + '"' +
            ' style="left:${(data.ganttProperties.progressWidth - 6)}px;margin-top:' +
            this.taskBarHeight + 'px;"><div class="' + cls.progressBarHandler + '"' +
            '><div class="' + cls.progressHandlerElement + '"></div>' +
            '<div class="' + cls.progressBarHandlerAfter + '"></div></div>';
        this.childTaskbarProgressResizerFunction = this.templateCompiler(childTaskbarProgressResizeDiv);
        this.taskIndicatorFunction = this.templateCompiler(this.getIndicatorString());
        this.taskBaselineTemplateFunction = this.templateCompiler(this.getTaskBaselineTemplateString());
        this.milestoneBaselineTemplateFunction = this.templateCompiler(this.getMilestoneBaselineTemplateString());
        let connectorLineLeft: string = '<div class="' + cls.leftConnectorPointOuterDiv + '" style="${if(ganttProperties.isMilestone)}' +
            'margin-top:' + (this.milesStoneRadius - 4) + 'px;${else}margin-top:' +
            this.connectorPointMargin + 'px;${/if}">' +
            '<div class="' + cls.connectorPointLeft + '${this.getUnscheduledTaskClass(ganttProperties)}' +
            '" style="width: ' + this.connectorPointWidth + 'px;' +
            'height: ' + this.connectorPointWidth + 'px;border-radius:' +
            this.connectorPointRadius + 'px;">' + this.touchLeftConnectorpoint + '</div></div>';
        let connectorLineRight: string = '<div class="' + cls.rightConnectorPointOuterDiv + '" style="${if(ganttProperties.isMilestone)}' +
            'left:' + this.milestoneHeight + 'px;margin-top:' +
            (this.milesStoneRadius - 4) + 'px;${else}left:${(data.ganttProperties.width)}px;margin-top:' +
            this.connectorPointMargin + 'px;${/if}">' +
            '<div class="' + cls.connectorPointRight + '${this.getUnscheduledTaskClass(ganttProperties)}"' + ' style="' +
            'width:' + this.connectorPointWidth + 'px;height:' + this.connectorPointWidth + 'px;border-radius:' +
            this.connectorPointRadius + 'px;">' + this.touchRightConnectorpoint + '</div></div>';
        this.connectorLineLeftFunction = this.templateCompiler(connectorLineLeft);
        this.connectorLineRightFunction = this.templateCompiler(connectorLineRight);
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
                resultString = '${this.chartRowsModule.getResourceName(data) }';
            } else {
                for (let i: number = 0; i < length; i++) {
                    if (field === this.parent.ganttColumns[i].field) {
                        resultString = '${this.chartRowsModule.getFieldValue(' + field + ') }';
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
        let width: number;
        if (ganttData.ganttProperties.isMilestone) {
            width = (ganttData.ganttProperties.left - (this.parent.getTaskbarHeight() / 2));
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
        if (ganttData.ganttProperties.isMilestone) {
            return ganttData.ganttProperties.left + (this.parent.getTaskbarHeight() / 2);
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
                    if (isNullOrUndefined(resource)) {
                        resource = ganttData.ganttProperties.resourceInfo[i][this.parent.resourceNameMapping];
                    } else {
                        resource += ' , ' + ganttData.ganttProperties.resourceInfo[i][this.parent.resourceNameMapping];
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
        this.connectorPointWidth = 8;
        this.connectorPointRadius = 8 / 2;
        this.connectorPointMargin = Math.floor((this.taskBarHeight / 2) - 4);
    }

    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    public refreshGanttRows(): void {
        this.ganttChartTableBody.innerHTML = '';
        this.parent.currentViewData = this.parent.treeGrid.getCurrentViewRecords();
        this.createTaskbarTemplate();
    }

    /**
     * To render taskbars.
     * @return {void}
     * @private
     */
    private createTaskbarTemplate(): void {
        this.ganttChartTableBody.innerHTML = '';
        for (let i: number = 0; i < this.parent.currentViewData.length; i++) {
            let tempTemplateData: IGanttData = this.parent.currentViewData[i];
            this.ganttChartTableBody.appendChild(this.getGanttChartRow(i, tempTemplateData));
        }
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
        let parentTrNode: NodeList = this.parentTrFunction(extend({ index: i }, this.templateData), this.parent, 'parentTr');
        let leftLabelNode: NodeList = this.leftLabelContainerFunction(
            extend({ index: i }, this.templateData), this.parent, 'leftLabelContainer');
        if (this.leftTaskLabelTemplateFunction) {
            let leftLabelTemplateNode: NodeList = this.leftTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'leftLabelTemplate');
            leftLabelNode[0].appendChild([].slice.call(leftLabelTemplateNode)[0]);
        }
        let taskbarContainerNode: NodeList = this.taskbarContainerFunction(
            extend({ index: i }, this.templateData), this.parent, 'taskbarContainerDiv');
        if (!this.templateData.hasChildRecords) {
            let connectorLineLeftNode: NodeList = this.connectorLineLeftFunction(
                extend({ index: i }, this.templateData), this.parent, 'connectorLinePointLeft');
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
        }
        if (this.templateData.hasChildRecords) {
            let parentTaskbarTemplateNode: NodeList = this.parentTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'parentTaskbarTemplate');
            taskbarContainerNode[0].appendChild([].slice.call(parentTaskbarTemplateNode)[0]);
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.taskBaselineTemplateFunction(
                    extend({ index: i }, this.templateData), this.parent, 'parentTaskbarBaseline');
            }
        } else if (this.templateData.ganttProperties.isMilestone) {
            let milestoneTemplateNode: NodeList = this.milestoneTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'milestoneTemplate');
            taskbarContainerNode[0].appendChild([].slice.call(milestoneTemplateNode)[0]);
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.milestoneBaselineTemplateFunction(
                    extend({ index: i }, this.templateData), this.parent, 'milestoneBaseline');
            }
        } else {
            let scheduledTask: boolean = isScheduledTask(this.templateData.ganttProperties);
            let childTaskbarProgressResizeNode: NodeList = null; let childTaskbarRightResizeNode: NodeList = null;
            let childTaskbarLeftResizeNode: NodeList = null;
            if (!isNullOrUndefined(scheduledTask)) {
                if (scheduledTask || this.templateData.ganttProperties.duration) {
                    if (scheduledTask) {
                        childTaskbarProgressResizeNode = this.childTaskbarProgressResizerFunction(
                            extend({ index: i }, this.templateData), this.parent, 'childProgressResizer');
                        childTaskbarLeftResizeNode = this.childTaskbarLeftResizerFunction(
                            extend({ index: i }, this.templateData), this.parent, 'childLeftResizer');
                        childTaskbarRightResizeNode = this.childTaskbarRightResizerFunction(
                            extend({ index: i }, this.templateData), this.parent, 'childRightResizer');
                    }
                }
                let childTaskbarTemplateNode: NodeList = this.childTaskbarTemplateFunction(
                    extend({ index: i }, this.templateData), this.parent, 'childTaskbarTemplate');
                if (childTaskbarLeftResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarLeftResizeNode)[0]);
                }
                if (childTaskbarTemplateNode) {
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
                taskBaselineTemplateNode = this.taskBaselineTemplateFunction(
                    extend({ index: i }, this.templateData), this.parent, 'childBaseline');
            }
        }
        if (!this.templateData.hasChildRecords) {
            let connectorLineRightNode: NodeList = this.connectorLineRightFunction(
                extend({ index: i }, this.templateData), this.parent, 'connectorLinePointRight');
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineRightNode)[0]);
        }
        let rightLabelNode: NodeList = this.rightLabelContainerFunction(
            extend({ index: i }, this.templateData), this.parent, 'rightLabelContainer');
        if (this.rightTaskLabelTemplateFunction) {
            let rightLabelTemplateNode: NodeList = this.rightTaskLabelTemplateFunction(
                extend({ index: i }, this.templateData), this.parent, 'rightLabelTemplateTemplate');
            rightLabelNode[0].appendChild([].slice.call(rightLabelTemplateNode)[0]);
        }
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskbarContainerNode)[0]);
        if (this.templateData.ganttProperties.indicators && this.templateData.ganttProperties.indicators.length > 0) {
            let taskIndicatorNode: NodeList;
            let taskIndicatorTextFunction: Function;
            let taskIndicatorTextNode: Function;
            let indicators: IIndicator[] = this.templateData.ganttProperties.indicators;
            for (let indicatorIndex: number = 0; indicatorIndex < indicators.length; indicatorIndex++) {
                taskIndicatorNode = this.taskIndicatorFunction(
                    extend({ index: i }, indicators[indicatorIndex]), this.parent, 'indicatorLabelContainer');
                taskIndicatorTextFunction = isNullOrUndefined(this.templateCompiler(indicators[indicatorIndex].name)) ?
                    this.templateCompiler('${name}') : this.templateCompiler(indicators[indicatorIndex].name);
                taskIndicatorTextNode = taskIndicatorTextFunction(
                    extend({ index: i }, this.templateData), this.parent, 'indicatorLabelText');
                taskIndicatorNode[0].appendChild([].slice.call(taskIndicatorTextNode)[0]);
                (taskIndicatorNode[0] as HTMLElement).title = (taskIndicatorNode[0] as HTMLElement).innerText;
                parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskIndicatorNode)[0]);
            }
        }
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(rightLabelNode)[0]);
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
        let args: IQueryTaskbarInfoEventArgs = {
            ganttModel: this.parent,
            data: data,
            rowElement: trElement,
            taskbarElement: trElement.querySelector('.' + cls.taskBarMainContainer),
            taskbarType: data.hasChildRecords ? 'ParentTask' : data.ganttProperties.isMilestone ? 'Milestone' : 'ChildTask'
        };
        let taskbarClass: string = '.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentTaskBar : args.taskbarType === 'ChildTask' ? cls.traceChildTaskBar : cls.milestoneTop);
        let progressBarClass: string = '.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentProgressBar : args.taskbarType === 'ChildTask' ? cls.traceChildProgressBar : cls.baselineMilestoneTop);
        if (args.taskbarType === 'Milestone') {
            args.milestoneColor = taskbarElement.querySelector(taskbarClass) ?
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderBottomColor : null;
            args.baselineColor = trElement.querySelector(progressBarClass) ?
                getComputedStyle(trElement.querySelector(progressBarClass)).borderBottomColor : null;
        } else {
            args.taskbarBgColor = taskbarElement.querySelector(taskbarClass) ?
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).backgroundColor : null;
            args.taskbarBorderColor = taskbarElement.querySelector(taskbarClass) ?
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderColor : null;
            args.progressBarBgColor = taskbarElement.querySelector(progressBarClass) ?
                getComputedStyle(taskbarElement.querySelector(progressBarClass)).backgroundColor : null;
            // args.progressBarBorderColor = taskbarElement.querySelector(progressBarClass) ?
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor : null;
            args.baselineColor = trElement.querySelector('.' + cls.baselineBar) ?
                getComputedStyle(trElement.querySelector('.' + cls.baselineBar)).backgroundColor : null;
            args.progressLabelColor = taskbarElement.querySelector('.' + cls.taskLabel) ?
                getComputedStyle(taskbarElement.querySelector('.' + cls.taskLabel)).color : null;
        }
        args.rightLabelColor = trElement.querySelector('.' + cls.rightLabelContainer) &&
            (trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label) ?
            getComputedStyle((trElement.querySelector('.' + cls.rightLabelContainer)).querySelector('.' + cls.label)).color : null;
        args.leftLabelColor = trElement.querySelector('.' + cls.leftLabelContainer) &&
            (trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label) ?
            getComputedStyle((trElement.querySelector('.' + cls.leftLabelContainer)).querySelector('.' + cls.label)).color : null;

        this.parent.trigger('queryTaskbarInfo', args);
        this.updateQueryTaskbarInfoArgs(args);
    }

    /**
     * To update query taskbar info args.
     * @return {void}
     * @private
     */
    private updateQueryTaskbarInfoArgs(args: IQueryTaskbarInfoEventArgs): void {
        let trElement: Element = args.rowElement;
        let taskbarElement: Element = args.taskbarElement;
        let taskbarClass: string = '.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentTaskBar : args.taskbarType === 'ChildTask' ? cls.traceChildTaskBar : cls.milestoneTop);
        let progressBarClass: string = '.' + (args.taskbarType === 'ParentTask' ?
            cls.traceParentProgressBar : args.taskbarType === 'ChildTask' ? cls.traceChildProgressBar : cls.baselineMilestoneTop);
        if (args.taskbarType === 'Milestone') {
            if (taskbarElement.querySelector(taskbarClass) &&
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderBottomColor !== args.milestoneColor) {
                (taskbarElement.querySelector(taskbarClass) as HTMLElement).style.borderBottomColor = args.milestoneColor;
                (taskbarElement.querySelector('.' + cls.milestoneBottom) as HTMLElement).style.borderTopColor = args.milestoneColor;
            }
            if (trElement.querySelector(progressBarClass) &&
                getComputedStyle(trElement.querySelector(progressBarClass)).borderTopColor !== args.baselineColor) {
                (trElement.querySelector(progressBarClass) as HTMLElement).style.borderBottomColor = args.baselineColor;
                (trElement.querySelector('.' + cls.baselineMilestoneBottom) as HTMLElement).style.borderTopColor = args.baselineColor;
            }
        } else {
            if (taskbarElement.querySelector(taskbarClass) &&
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).backgroundColor !== args.taskbarBgColor) {
                (taskbarElement.querySelector(taskbarClass) as HTMLElement).style.backgroundColor = args.taskbarBgColor;
            }
            if (taskbarElement.querySelector(taskbarClass) &&
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderColor !== args.taskbarBorderColor) {
                (taskbarElement.querySelector(taskbarClass) as HTMLElement).style.borderColor = args.taskbarBorderColor;
            }
            if (taskbarElement.querySelector(progressBarClass) &&
                getComputedStyle(taskbarElement.querySelector(progressBarClass)).backgroundColor !== args.progressBarBgColor) {
                (taskbarElement.querySelector(progressBarClass) as HTMLElement).style.backgroundColor = args.progressBarBgColor;
            }
            // if (taskbarElement.querySelector(progressBarClass) &&
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor !== args.progressBarBorderColor) {
            //     (taskbarElement.querySelector(progressBarClass) as HTMLElement).style.borderColor = args.progressBarBorderColor;
            // }
            if (taskbarElement.querySelector('.' + cls.taskLabel) &&
                getComputedStyle(taskbarElement.querySelector('.' + cls.taskLabel)).color !== args.progressLabelColor) {
                (taskbarElement.querySelector('.' + cls.taskLabel) as HTMLElement).style.color = args.progressLabelColor;
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
    public refreshRow(index: number): void {
        let tr: Node = this.ganttChartTableBody.childNodes[index];
        let selectedItem: IGanttData = this.parent.currentViewData[index];
        if (index !== -1 && selectedItem) {
            let data: IGanttData = selectedItem;
            tr.replaceChild(this.getGanttChartRow(index, data).childNodes[0], tr.childNodes[0]);
            this.triggerQueryTaskbarInfoByIndex(tr as Element, data);
            this.parent.treeGrid.grid.setRowData(data.ganttProperties.taskId, data);
            let row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                this.parent.treeGrid.grid.getDataRows()[index].getAttribute('data-uid'));
            row.data = data;
        }
    }

    /**
     * To refresh all edited records
     * @param items 
     * @private
     */
    public refreshRecords(items: IGanttData[]): void {
        if (this.parent.isGanttChartRendered) {
            for (let i: number = 0; i < items.length; i++) {
                let index: number = this.parent.currentViewData.indexOf(items[i]);
                this.refreshRow(index);
            }
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
}