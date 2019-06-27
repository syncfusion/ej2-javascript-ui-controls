import { Gantt } from '../base/gantt';
import { Tooltip as TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/utils';
import * as cls from '../base/css-constants';
import { extend, isNullOrUndefined, getValue, EventHandler, updateBlazorTemplate, resetBlazorTemplate, } from '@syncfusion/ej2-base';
import { ITaskData, IGanttData, BeforeTooltipRenderEventArgs, PredecessorTooltip, IPredecessor } from '../base/interface';
import { EventMarkerModel } from '../models/models';
import { TemplateName } from '../base/enum';

/**
 * File for handling tooltip in Gantt. 
 */
export class Tooltip {
    public parent: Gantt;
    public toolTipObj: TooltipComponent;
    private predecessorTooltipData: PredecessorTooltip;
    private currentTarget: HTMLElement;
    private tooltipMouseEvent: PointerEvent;
    private blazorTemplateName: string;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.createTooltip();
        this.parent.on('destroy', this.destroy, this);
    }

    /**
     * To create tooltip.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    public createTooltip(): void {
        this.toolTipObj = new TooltipComponent();
        this.toolTipObj.target = '.e-header-cell-label, .e-gantt-child-taskbar,' +
            '.e-gantt-parent-taskbar, .e-gantt-milestone, .e-gantt-unscheduled-taskbar' +
            '.e-event-markers, .e-baseline-bar, .e-event-markers,' +
            '.e-connector-line-container, .e-indicator-span, .e-notes-info,' +
            '.e-taskbar-left-resizer, .e-taskbar-right-resizer';
        this.toolTipObj.position = 'BottomCenter';
        this.toolTipObj.openDelay = 700;
        this.toolTipObj.cssClass = cls.ganttTooltip;
        this.toolTipObj.animation = { open: { effect: 'None', delay: 0 }, close: { effect: 'None', delay: 0 } };
        this.toolTipObj.afterOpen = this.updateTooltipPosition.bind(this);
        this.toolTipObj.showTipPointer = false;
        this.toolTipObj.beforeRender = this.tooltipBeforeRender.bind(this);
        this.toolTipObj.afterClose = this.tooltipCloseHandler.bind(this);
        this.toolTipObj.created = this.tooltipCreated.bind(this);
        this.toolTipObj.appendTo(this.parent.element);
    }
    private tooltipCreated(): void {
        if (!isNullOrUndefined(this.blazorTemplateName)) {
            this.updateBlazorTooltipTemplate(true, this.blazorTemplateName);
        }
    }
    private tooltipBeforeRender(args: TooltipEventArgs): void {
        let parent: Gantt = this.parent;
        if (parent.isOnEdit) {
            args.cancel = true;
        }
        let element: Element = parentsUntil(args.target as Element, cls.chartRowCell);
        let data: IGanttData;
        let argsData: BeforeTooltipRenderEventArgs = {
            data: {},
            args: args,
            content: ''
        };

        if (args.target.classList.contains('e-header-cell-label')) {
            if (parent.timelineSettings.showTooltip) {
                argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('timeline', data, parent, args);
            } else {
                args.cancel = true;
            }
        } else {
            if (parent.tooltipSettings.showTooltip) {
                if (element) {
                    argsData.data = parent.ganttChartModule.getRecordByTaskBar(element);
                    data = argsData.data;
                }
                if ((<HTMLElement>args.target).classList.contains('e-gantt-child-taskbar') ||
                    (<HTMLElement>args.target).classList.contains('e-gantt-parent-taskbar') ||
                    (<HTMLElement>args.target).classList.contains('e-gantt-milestone') ||
                    (<HTMLElement>args.target).classList.contains('e-gantt-unscheduled-taskbar') ||
                    (<HTMLElement>args.target).classList.contains('e-taskbar-left-resizer') ||
                    (<HTMLElement>args.target).classList.contains('e-taskbar-right-resizer')) {
                    let taskbarTemplateNode: NodeList;
                    if (parent.tooltipSettings.taskbar) {
                        this.blazorTemplateName = TemplateName.TaskbarTooltip;
                        this.updateBlazorTooltipTemplate(false, this.blazorTemplateName);
                        taskbarTemplateNode = parent.tooltipModule.templateCompiler(
                            parent.tooltipSettings.taskbar, parent, data, TemplateName.TaskbarTooltip);
                    }
                    argsData.content = this.toolTipObj.content = taskbarTemplateNode ? (taskbarTemplateNode[0] as HTMLElement) :
                        parent.tooltipModule.getTooltipContent(
                            (data.ganttProperties.isMilestone ? 'milestone' : 'taskbar'), data, parent, args);
                } else if (args.target.classList.contains('e-baseline-bar')) {
                    let baseLineTemplateNode: NodeList;
                    if ((parent.tooltipSettings.baseline)) {
                        this.blazorTemplateName = TemplateName.BaselineTooltip;
                        this.updateBlazorTooltipTemplate(false, this.blazorTemplateName);
                        baseLineTemplateNode = parent.tooltipModule.templateCompiler(
                            parent.tooltipSettings.baseline, parent, data, TemplateName.BaselineTooltip);
                    }
                    argsData.content = this.toolTipObj.content = baseLineTemplateNode ? (baseLineTemplateNode[0] as HTMLElement) :
                        parent.tooltipModule.getTooltipContent('baseline', data, parent, args);
                } else if (args.target.classList.contains('e-event-markers')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('marker', data, parent, args);
                } else if (args.target.classList.contains('e-connector-line-container')) {
                    let dependencyLineTemplateNode: NodeList;
                    parent.tooltipModule.predecessorTooltipData = parent.tooltipModule.getPredecessorTooltipData(args);
                    argsData.data = this.predecessorTooltipData;
                    if ((parent.tooltipSettings.connectorLine)) {
                        this.blazorTemplateName = TemplateName.ConnectorLineTooltip;
                        this.updateBlazorTooltipTemplate(false, this.blazorTemplateName);
                        dependencyLineTemplateNode = parent.tooltipModule.templateCompiler(
                            parent.tooltipSettings.connectorLine, parent,
                            parent.tooltipModule.predecessorTooltipData, TemplateName.ConnectorLineTooltip);
                    }
                    argsData.content = this.toolTipObj.content = dependencyLineTemplateNode ?
                        (dependencyLineTemplateNode[0] as HTMLElement) :
                        parent.tooltipModule.getTooltipContent('connectorLine', data, parent, args);
                } else if (args.target.classList.contains('e-indicator-span')) {
                    argsData.content = this.toolTipObj.content =
                        parent.tooltipModule.getTooltipContent('indicator', data, parent, args);
                } else if (args.target.classList.contains('e-notes-info')) {
                    let ganttData: IGanttData = this.parent.ganttChartModule.getRecordByTarget(args.event as PointerEvent);
                    argsData.content = this.toolTipObj.content = ganttData.ganttProperties.notes;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
            } else {
                args.cancel = true;
            }
        }
        if (args.cancel === false) {
            parent.trigger('beforeTooltipRender', argsData);
            if (!this.parent.isAdaptive && args.event.type === 'mouseover') {
                this.currentTarget = args.target;
                EventHandler.add(this.currentTarget, 'mousemove', this.mouseMoveHandler.bind(this));
            }
        }
    }

    private tooltipCloseHandler(args: TooltipEventArgs): void {
        this.tooltipMouseEvent = null;
        if (!this.parent.isAdaptive) {
            EventHandler.remove(this.currentTarget, 'mousemove', this.mouseMoveHandler);
        }
        this.currentTarget = null;
    }

    private mouseMoveHandler(e: PointerEvent): void {
        this.tooltipMouseEvent = e;
    }
    /**
     * Method to update tooltip position
     * @param args 
     */
    private updateTooltipPosition(args: TooltipEventArgs): void {
        if (isNullOrUndefined(this.tooltipMouseEvent) || args.target.classList.contains('e-notes-info')) {
            return;
        }
        let postion: { x: number, y: number } = this.getPointorPosition(this.tooltipMouseEvent);
        let containerPosition: { top: number, left: number } = this.parent.getOffsetRect(this.parent.chartPane);
        let topEnd: number = containerPosition.top + this.parent.chartPane.offsetHeight;
        let leftEnd: number = containerPosition.left + this.parent.chartPane.offsetWidth;
        let tooltipPositionX: number = postion.x;
        let tooltipPositionY: number = postion.y;
        let tooltipUpdated: boolean = false;
        if (leftEnd < (tooltipPositionX + args.element.offsetWidth + 20)) {
            tooltipPositionX = tooltipPositionX - args.element.offsetWidth - 10;
        } else {
            tooltipPositionX = tooltipPositionX + 10;
        }
        if (topEnd < (tooltipPositionY + args.element.offsetHeight + 20)) {
            tooltipPositionY = tooltipPositionY - args.element.offsetHeight - 10;
        } else {
            tooltipUpdated = true;
            tooltipPositionY = tooltipPositionY + 10;
        }
        if (window.innerHeight < args.element.offsetHeight + tooltipPositionY) {
            tooltipPositionY = tooltipPositionY - args.element.offsetHeight - (tooltipUpdated ? 20 : 10);
        }
        args.element.style.left = tooltipPositionX + 'px';
        args.element.style.top = tooltipPositionY + 'px';
    }
    /**
     * Method to get mouse pointor position
     * @param e 
     */
    private getPointorPosition(e: Event): { x: number, y: number } {
        let posX: number;
        let posY: number;
        if (!isNullOrUndefined(getValue('pageX', e)) || !isNullOrUndefined(getValue('pageY', e))) {
            posX = getValue('pageX', e);
            posY = getValue('pageY', e);
        } else if (!isNullOrUndefined(getValue('clientX', e)) || !isNullOrUndefined(getValue('clientY', e))) {
            posX = getValue('clientX', e) + document.body.scrollLeft + document.documentElement.scrollLeft;
            posY = getValue('clientY', e) + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posX, y: posY };
    }

    /**
     *  Getting tooltip content for different elements
     */
    private getTooltipContent(elementType: string, ganttData: IGanttData, parent: Gantt, args: TooltipEventArgs): string {
        let content: string;
        let data: ITaskData;
        if (ganttData) {
            data = ganttData.ganttProperties;
        }
        switch (elementType) {
            case 'milestone':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                    data.taskName + '</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.startDate, this.parent.dateFormat) + '</tr></tbody></table>';
                break;
            case 'taskbar':
                let startDate: string = data.startDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('startDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    this.parent.getFormatedDate(data.startDate, this.parent.dateFormat) + '</td></tr>' : '';
                let endDate: string = data.endDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('endDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.endDate, this.parent.dateFormat) + '</td></tr>' : '';
                let duration: string = !isNullOrUndefined(data.duration) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('duration') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value"> ' + this.parent.getDurationString(data.duration, data.durationUnit) +
                    '</td></tr>' : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                    data.taskName + '</td></tr>' + startDate + endDate + duration
                    + '<tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('progress') +
                    '</td><td>:</td><td>' + data.progress + '</td></tr></tbody></table>';
                break;
            case 'baseline':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                    data.taskName + '</td></tr><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('baselineStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.baselineStartDate, this.parent.dateFormat) + '</td></tr><tr>' +
                    '<td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('baselineEndDate') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.baselineEndDate, this.parent.dateFormat) + '</td></tr></tbody></table>';
                break;
            case 'marker':
                let markerTooltipElement: EventMarkerModel = parent.tooltipModule.getMarkerTooltipData(args);
                let markerLabel: string = markerTooltipElement.label ? markerTooltipElement.label : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr><td>' +
                    this.parent.getFormatedDate(
                        this.parent.dateValidationModule.getDateFromFormat(markerTooltipElement.day), this.parent.dateFormat) +
                    '</td></tr><tr><td>' +
                    markerLabel + '</td></tr></tbody></table>';
                break;
            case 'connectorLine':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('from') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' + parent.tooltipModule.predecessorTooltipData.fromName + ' (' +
                    parent.tooltipModule.predecessorTooltipData.fromId + ')' + '</td></tr><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('to') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    parent.tooltipModule.predecessorTooltipData.toName +
                    ' (' + parent.tooltipModule.predecessorTooltipData.toId + ')' +
                    '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('taskLink') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value"> ' + parent.tooltipModule.predecessorTooltipData.linkText +
                    '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('lag') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    parent.tooltipModule.predecessorTooltipData.offsetString + '</td></tr></tbody></table>';
                break;
            case 'indicator':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr>' + args.target.title + '</tr></tbody></table>';
                break;
            case 'timeline':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr>' + args.target.title + '</tr></tbody></table>';
                break;
        }
        return content;
    }

    /**
     * To get the details of an event marker.
     * @private
     */
    private getMarkerTooltipData(args: TooltipEventArgs): EventMarkerModel {
        let markerTooltipId: string[] = (args.target.id).match(/\d+/g);
        let markerTooltipElement: EventMarkerModel = this.parent.eventMarkers[Number(markerTooltipId)];
        return markerTooltipElement;
    }

    /**
     * To get the details of a connector line.
     * @private
     */
    private getPredecessorTooltipData(args: TooltipEventArgs): PredecessorTooltip {
        let predeceesorParent: string = args.target.parentElement.id;
        let taskIds: string[] = predeceesorParent.match(/\d+/g);
        let fromTask: IGanttData = this.parent.flatData[this.parent.ids.indexOf(taskIds[0])];
        let toTask: IGanttData = this.parent.flatData[this.parent.ids.indexOf(taskIds[1])];
        let predecessor: IPredecessor[] = (fromTask.ganttProperties.predecessor as IPredecessor[]).filter(
            (pdc: IPredecessor) => { return pdc.to === taskIds[1]; });
        let predecessorTooltipData: PredecessorTooltip = {
            fromId: fromTask.ganttProperties.taskId,
            toId: toTask.ganttProperties.taskId,
            fromName: fromTask.ganttProperties.taskName,
            toName: toTask.ganttProperties.taskName,
            linkType: predecessor[0].type,
            linkText: this.parent.getPredecessorTextValue(predecessor[0].type),
            offset: predecessor[0].offset,
            offsetUnit: predecessor[0].offsetUnit,
            offsetString: this.parent.getDurationString(predecessor[0].offset, fromTask.ganttProperties.durationUnit)
        };
        return predecessorTooltipData;
    }

    /**
     * @private
     * To compile template string.
     */
    public templateCompiler(
        template: string, parent: Gantt, data: IGanttData | PredecessorTooltip,
        templateName: string): NodeList {
        let tooltipFunction: Function = parent.chartRowsModule.templateCompiler(template);
        if (templateName === TemplateName.TaskbarTooltip) {
            parent.chartRowsModule.taskbarTooltipTemplateFunction = tooltipFunction;
        } else if (templateName === TemplateName.BaselineTooltip) {
            parent.chartRowsModule.baselineTooltipTemplateFunction = tooltipFunction;
        } else if (template === TemplateName.ConnectorLineTooltip) {
            parent.chartRowsModule.connectorLineTooltipTemplateFunction = tooltipFunction;
        } else if (templateName === TemplateName.EditingTooltip) {
            parent.chartRowsModule.editingTooltipTemplateFunction = tooltipFunction;
        }
        let templateNode: NodeList = tooltipFunction(
            extend({ index: 0 }, data), parent, templateName,
            parent.chartRowsModule.getTemplateID(templateName));
        return templateNode;
    }
    /** @private */
    public updateBlazorTooltipTemplate(isUpdate: boolean, templateName: string): void {
        switch (templateName) {
            case TemplateName.TaskbarTooltip:
                if (this.parent.chartRowsModule.taskbarTooltipTemplateFunction) {
                    if (isUpdate) {
                        updateBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(TemplateName.TaskbarTooltip), TemplateName.TaskbarTooltip);
                    } else {
                        resetBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(TemplateName.TaskbarTooltip), TemplateName.TaskbarTooltip);
                    }
                }
                break;
            case TemplateName.BaselineTooltip:
                if (this.parent.chartRowsModule.baselineTooltipTemplateFunction) {
                    if (isUpdate) {
                        updateBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(TemplateName.BaselineTooltip), TemplateName.BaselineTooltip);
                    } else {
                        resetBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(TemplateName.BaselineTooltip), TemplateName.BaselineTooltip);
                    }
                }
                break;

            case TemplateName.ConnectorLineTooltip:
                if (this.parent.chartRowsModule.connectorLineTooltipTemplateFunction) {
                    if (isUpdate) {
                        updateBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(
                                TemplateName.ConnectorLineTooltip),
                            TemplateName.ConnectorLineTooltip);
                    } else {
                        resetBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(
                                TemplateName.ConnectorLineTooltip),
                            TemplateName.ConnectorLineTooltip);
                    }
                }
                break;
            case TemplateName.EditingTooltip:
                if (this.parent.chartRowsModule.editingTooltipTemplateFunction) {
                    if (isUpdate) {
                        updateBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(TemplateName.EditingTooltip), TemplateName.EditingTooltip);
                    } else {
                        resetBlazorTemplate(
                            this.parent.chartRowsModule.getTemplateID(TemplateName.EditingTooltip), TemplateName.EditingTooltip);
                    }
                }
                break;
        }
    }
    private destroy(): void {
        this.toolTipObj.destroy();
    }
}