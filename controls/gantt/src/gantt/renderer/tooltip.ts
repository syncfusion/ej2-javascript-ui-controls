import { Gantt } from '../base/gantt';
import { Tooltip as TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/utils';
import * as cls from '../base/css-constants';
import { extend, isNullOrUndefined, getValue, EventHandler, closest, SanitizeHtmlHelper, initializeCSPTemplate, append } from '@syncfusion/ej2-base';
import { ITaskData, IGanttData, BeforeTooltipRenderEventArgs, PredecessorTooltip, IPredecessor } from '../base/interface';
import { EventMarkerModel } from '../models/models';
import { Deferred } from '@syncfusion/ej2-data';

/**
 * File for handling tooltip in Gantt.
 */
export class Tooltip {
    public parent: Gantt;
    public toolTipObj: TooltipComponent;
    private predecessorTooltipData: PredecessorTooltip;
    private currentTarget: HTMLElement;
    private tooltipMouseEvent: PointerEvent;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.createTooltip();
        this.parent.on('destroy', this.destroy, this);
    }

    /**
     * To create tooltip.
     *
     * @returns {void} .
     * @private
     */
    public createTooltip(): void {
        this.toolTipObj = new TooltipComponent();
        this.toolTipObj.target = '.e-header-cell-label, .e-gantt-child-taskbar,' +
            '.e-gantt-parent-taskbar, .e-gantt-milestone, .e-gantt-unscheduled-taskbar' +
            '.e-event-markers, .e-baseline-bar, .e-event-markers,' +
            '.e-connector-line-container, .e-indicator-span, .e-notes-info, .e-gantt-manualparent-milestone,' +
            '.e-taskbar-left-resizer, .e-taskbar-right-resizer, .e-baseline-gantt-milestone, .e-gantt-manualparenttaskbar';
        this.toolTipObj.position = 'BottomCenter';
        this.toolTipObj.openDelay = 700;
        this.toolTipObj.enableRtl = this.parent.enableRtl;
        this.toolTipObj.enableHtmlSanitizer = this.parent.enableHtmlSanitizer;
        this.toolTipObj.cssClass = cls.ganttTooltip;
        this.toolTipObj.animation = { open: { effect: 'None', delay: 0 }, close: { effect: 'None', delay: 0 } };
        this.toolTipObj.afterOpen = this.updateTooltipPosition.bind(this);
        this.toolTipObj.showTipPointer = false;
        this.toolTipObj.beforeRender = this.tooltipBeforeRender.bind(this);
        this.toolTipObj.afterClose = this.tooltipCloseHandler.bind(this);
        this.toolTipObj.isStringTemplate = true;
        this.toolTipObj.appendTo(this.parent.element);
    }

    private tooltipBeforeRender(args: TooltipEventArgs): void | Deferred {
        const parent: Gantt = this.parent;
        if (parent.isOnEdit) {
            args.cancel = true;
            return;
        }
        let element: Element;
        const row: Element = closest(args.target, 'div.' + cls.taskBarMainContainer);
        if (!isNullOrUndefined(row)) {
            element = args.target;
        } else {
            element = parentsUntil(args.target as Element, cls.chartRowCell);
        }
        let data: IGanttData;
        const argsData: BeforeTooltipRenderEventArgs = {
            data: {},
            args: args,
            cancel: false,
            content: ''
        };

        if (args.target.classList.contains('e-header-cell-label')) {
            if (parent.timelineSettings.showTooltip) {
                argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('timeline', data, parent, args) as any;
            } else {
                args.cancel = true;
            }
        } else {
            if (parent.tooltipSettings.showTooltip) {
                if (element) {
                    argsData.data = parent.ganttChartModule.getRecordByTaskBar(element);
                    data = argsData.data;
                }
                if (args.target.classList.contains('e-gantt-child-taskbar') ||
                    args.target.classList.contains('e-gantt-parent-taskbar') ||
                    args.target.classList.contains('e-gantt-milestone') ||
                    args.target.classList.contains('e-gantt-unscheduled-taskbar') ||
                    args.target.classList.contains('e-taskbar-left-resizer') ||
                    args.target.classList.contains('e-taskbar-right-resizer') ||
                    (args.target.classList.contains('e-gantt-manualparenttaskbar') && parent.tooltipSettings.taskbar)) {
                    let taskbarTemplateNode: NodeList;
                    if (parent.tooltipSettings.taskbar) {
                        taskbarTemplateNode = parent.tooltipModule.templateCompiler(
                            parent.tooltipSettings.taskbar, parent, data, 'TooltipTaskbarTemplate');
                    }
                    let tooltipTemplate: Element = document.createElement('div');
                    if (taskbarTemplateNode) {
                        append(taskbarTemplateNode, tooltipTemplate);
                    }
                    argsData.content = this.toolTipObj.content = taskbarTemplateNode ? (tooltipTemplate as HTMLElement) : data ?
                        parent.tooltipModule.getTooltipContent(
                            (data.ganttProperties.isMilestone ? 'milestone' : 'taskbar'), data, parent, args) as any : "";
                } else if (args.target.classList.contains('e-baseline-bar') ||
                           args.target.classList.contains('e-baseline-gantt-milestone')) {
                    let baseLineTemplateNode: NodeList;
                    if ((parent.tooltipSettings.baseline)) {
                        baseLineTemplateNode = parent.tooltipModule.templateCompiler(
                            parent.tooltipSettings.baseline, parent, data, 'TooltipBaselineTemplate');
                    }
                    let baselineTemplate: Element = document.createElement('div');
                    if (baseLineTemplateNode) {
                        append(baseLineTemplateNode, baselineTemplate);
                    }
                    argsData.content = this.toolTipObj.content = baseLineTemplateNode ? (baselineTemplate as HTMLElement) : data ? 
                        parent.tooltipModule.getTooltipContent(
                            (data.ganttProperties.isMilestone ? 'milestone' : 'baseline'), data, parent, args) as any : "";
                } else if (args.target.classList.contains('e-event-markers')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('marker', data, parent, args) as any;
                } else if (args.target.classList.contains('e-connector-line-container')) {
                    let dependencyLineTemplateNode: NodeList;
                    parent.tooltipModule.predecessorTooltipData = parent.tooltipModule.getPredecessorTooltipData(args);
                    argsData.data = this.predecessorTooltipData;
                    if ((parent.tooltipSettings.connectorLine)) {
                        dependencyLineTemplateNode = parent.tooltipModule.templateCompiler(
                            parent.tooltipSettings.connectorLine, parent, parent.tooltipModule.predecessorTooltipData,
                            'TooltipConnectorLineTemplate');
                    }
                    argsData.content = this.toolTipObj.content = dependencyLineTemplateNode ?
                        (dependencyLineTemplateNode[0] as HTMLElement) :
                        parent.tooltipModule.getTooltipContent('connectorLine', data, parent, args) as any;
                } else if (args.target.classList.contains('e-indicator-span')) {
                    argsData.content = this.toolTipObj.content =
                        parent.tooltipModule.getTooltipContent('indicator', data, parent, args) as any;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                } else if (args.target.classList.contains('e-notes-info')) {
                    const ganttData: IGanttData = this.parent.ganttChartModule.getRecordByTarget(args.event as PointerEvent);
                    argsData.content = this.toolTipObj.content = ganttData.ganttProperties.notes;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                } else if (args.target.classList.contains('e-gantt-manualparenttaskbar')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent(
                        'manualtaskbar', data, parent, args) as any;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                } else if (args.target.classList.contains('e-gantt-manualparent-milestone')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent(
                        'manualmilestone', data, parent, args) as any;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
            } else {
                args.cancel = true;
            }
        }
        if (args.cancel === false) {
            const callBackPromise: Deferred = new Deferred();
            parent.trigger('beforeTooltipRender', argsData, (argData: BeforeTooltipRenderEventArgs) => {
                callBackPromise.resolve(argData);
                if (argData.cancel) {
                    args.cancel = true;
                }
            });
            this.toolTipObj.content = argsData.content as string;
            if (!this.parent.isAdaptive && args.event.type === 'mouseover') {
                this.currentTarget = args.target;
                EventHandler.add(this.currentTarget, 'mousemove', this.mouseMoveHandler.bind(this));
            }
            this.parent.renderTemplates();
            return callBackPromise;
        }
    }

    // eslint-disable-next-line
    private tooltipCloseHandler(args: TooltipEventArgs): void {
        this.tooltipMouseEvent = null;
        if (!this.parent.isAdaptive && !isNullOrUndefined(this.currentTarget)) {
            EventHandler.remove(this.currentTarget, 'mousemove', this.mouseMoveHandler);
        }
        this.currentTarget = null;
    }

    private mouseMoveHandler(e: PointerEvent): void {
        this.tooltipMouseEvent = e;
    }
    /**
     * Method to update tooltip position
     *
     * @param {TooltipEventArgs} args .
     * @returns {void} .
     */
    private updateTooltipPosition(args: TooltipEventArgs): void {
        args.element.style.visibility = 'visible';
        const parentWithZoomStyle = this.parent.element.closest('[style*="zoom"]') as HTMLElement;
        if (isNullOrUndefined(parentWithZoomStyle)) {
            if (isNullOrUndefined(this.tooltipMouseEvent) || args.target.classList.contains('e-notes-info')) {
                return;
            }
            const postion: { x: number, y: number } = this.getPointorPosition(this.tooltipMouseEvent);
            const containerPosition: { top: number, left: number, width?: number, height?: number } =
                this.parent.getOffsetRect(this.parent.chartPane);
            const topEnd: number = containerPosition.top + this.parent.chartPane.offsetHeight;
            const leftEnd: number = containerPosition.left + this.parent.chartPane.offsetWidth;
            let tooltipPositionX: number = postion.x;
            let tooltipPositionY: number = postion.y;
            if (leftEnd < (tooltipPositionX + args.element.offsetWidth + 10)) {
                while (leftEnd < (tooltipPositionX + args.element.offsetWidth + 10)) {
                    tooltipPositionX = leftEnd - args.element.offsetWidth - 10;
                    args.element.style.left = tooltipPositionX + 'px';
                }
            } else {
                tooltipPositionX = tooltipPositionX + 10;
                args.element.style.left = tooltipPositionX + 'px';
            }
            if (window.innerHeight < args.element.offsetHeight + tooltipPositionY) {
                tooltipPositionY = tooltipPositionY - args.element.offsetHeight - 10;
            }
            if ((topEnd < (tooltipPositionY + args.element.offsetHeight + 20))) {
                tooltipPositionY = tooltipPositionY - args.element.offsetHeight - 10;
            } else {
                tooltipPositionY = tooltipPositionY + 10;
            }
            args.element.style.top = tooltipPositionY + 'px';
        }

    }
    /**
     * Method to get mouse pointor position
     *
     * @param {Event} e .
     * @returns {number} .
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
     *
     * @param {string} elementType .
     * @param {IGanttData} ganttData .
     * @param {Gantt} parent .
     * @param {TooltipEventArgs} args .
     * @returns {string | Function} .
     */
    private getTooltipContent(elementType: string, ganttData: IGanttData, parent: Gantt, args: TooltipEventArgs): string | Function {
        let content: string | Function;
        let data: ITaskData;
        let taskName: string;
        if (ganttData) {
            data = ganttData.ganttProperties;
            let taskNameValue: string = data.taskName;
            if (this.parent.enableHtmlSanitizer && typeof (taskNameValue) === 'string') {
                taskNameValue = SanitizeHtmlHelper.sanitize(taskNameValue);
            }
            taskName = !isNullOrUndefined(taskNameValue) ? '<tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
            (this.parent.disableHtmlEncode ?  taskNameValue.replace(/</g,"&lt;").replace(/>/g,"&gt;"):taskNameValue)+ '</td></tr>' : '';
            
        }
        switch (elementType) {
        case 'milestone':
        {
            let milestoneStartDate: Date;
            if (args.target.className.includes('e-baseline-gantt-milestone') && !isNullOrUndefined(data.baselineStartDate)) {
                milestoneStartDate = data.baselineStartDate;
            } else if (!isNullOrUndefined(data.startDate)) {
                milestoneStartDate = data.startDate;
            }
            let sDateValue: string = this.parent.getFormatedDate(milestoneStartDate, this.parent.getDateFormat());
            if (this.parent.enableHtmlSanitizer && typeof (sDateValue) === 'string') {
                sDateValue = SanitizeHtmlHelper.sanitize(sDateValue);
            } 
            let sDate: string = !isNullOrUndefined(milestoneStartDate) ? '<tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td>' +
                '<td class = "e-gantt-tooltip-value">' +
                sDateValue + '</td></tr>' : '';
            let contentTemp: Function = function () {
                return '<table class = "e-gantt-tooltiptable"><tbody>' +
                        taskName + sDate + '</tbody></table>';
                }
            content = initializeCSPTemplate(contentTemp);  
            break;
        }
        case 'taskbar':
        {
            const scheduledTask: boolean = !ganttData.hasChildRecords || data.isAutoSchedule ? true : false;
            let startDateValue: string = this.parent.getFormatedDate(scheduledTask ? data.startDate : data.autoStartDate, this.parent.getDateFormat());
            let endDateValue: string = this.parent.getFormatedDate(scheduledTask ? data.endDate : data.autoEndDate, this.parent.getDateFormat());
            let durationValue: string = this.parent.getDurationString((scheduledTask ? data.duration : data.autoDuration), data.durationUnit);
            let progressValue: any = data.progress;
            if (this.parent.enableHtmlSanitizer) {
                startDateValue = typeof (startDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(startDateValue) : startDateValue ;
                endDateValue = typeof (endDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(endDateValue) : endDateValue;
                durationValue = typeof (durationValue) === 'string' ? SanitizeHtmlHelper.sanitize(durationValue) : durationValue;
                progressValue = typeof (progressValue) === 'string' ? SanitizeHtmlHelper.sanitize(progressValue) : progressValue;
            }
            let startDate: string = data.startDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant(scheduledTask ? 'startDate' : 'subTasksStartDate') +
                    '</td><td style="padding: 2px;">:</td>' + '<td class = "e-gantt-tooltip-value"> ' + startDateValue + '</td></tr>' : '';
            let endDate: string = data.endDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant(scheduledTask ? 'endDate' : 'subTasksEndDate') +
                    '</td><td style="padding: 2px;">:</td>' + '<td class = "e-gantt-tooltip-value">' + endDateValue + '</td></tr>' : '';
            let duration: string = !isNullOrUndefined(data.duration) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('duration') + '</td><td style="padding: 2px;">:</td>' +
                    '<td class = "e-gantt-tooltip-value"> ' + durationValue +
                    '</td></tr>' : '';     
            let progress: string = !isNullOrUndefined(data.progress) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('progress') + '</td><td style="padding: 2px;">:</td><td>' + progressValue +
                    '</td></tr>' : '';
            let contentTemp: Function = function () {
                    return '<table class = "e-gantt-tooltiptable"><tbody>' +
                        taskName + startDate + endDate + duration + progress + '</tbody></table>';
                    }
            content = initializeCSPTemplate(contentTemp);
            break;
        }
        case 'baseline':
        {
            let baselineStartDateValue: string = this.parent.getFormatedDate(data.baselineStartDate, this.parent.getDateFormat());
            let baselineEndDateValue: string = this.parent.getFormatedDate(data.baselineEndDate, this.parent.getDateFormat());
            if (this.parent.enableHtmlSanitizer) {
                baselineStartDateValue = typeof (baselineStartDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(baselineStartDateValue) : baselineStartDateValue;
                baselineEndDateValue = typeof (baselineEndDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(baselineEndDateValue) : baselineEndDateValue;
                }
            let contentTemp: Function = function () {
                    return '<table class = "e-gantt-tooltiptable"><tbody>' +
                    taskName + '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('baselineStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    baselineStartDateValue + '</td></tr><tr>' +
                    '<td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('baselineEndDate') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    baselineEndDateValue + '</td></tr></tbody></table>';
                    }
                content = initializeCSPTemplate(contentTemp, this);
            break;
        }
        case 'marker':
        {
            const markerTooltipElement: EventMarkerModel = parent.tooltipModule.getMarkerTooltipData(args);
            let markerTooltipElementValue: string = this.parent.getFormatedDate(this.parent.dateValidationModule.getDateFromFormat(markerTooltipElement.day), this.parent.getDateFormat());
            let markerLabel: string = markerTooltipElement.label ? markerTooltipElement.label : '';
            if (this.parent.enableHtmlSanitizer) {
                markerLabel = typeof (markerLabel) === 'string' ? SanitizeHtmlHelper.sanitize(markerLabel) : markerLabel;
                markerTooltipElementValue = typeof (markerTooltipElementValue) === 'string' ? SanitizeHtmlHelper.sanitize(markerTooltipElementValue) : markerTooltipElementValue;
            }
            let contentTemp: Function = function () {
                return '<table class = "e-gantt-tooltiptable"><tbody><tr><td>' +
                markerTooltipElementValue + '</td></tr><tr><td>' + (this.parent.disableHtmlEncode ? markerLabel.replace(/</g,"&lt;").replace(/>/g,"&gt;"):markerLabel) + '</td></tr></tbody></table>';
                }
            content = initializeCSPTemplate(contentTemp, this); 
            break;
        }
        case 'connectorLine':
        {
            let fromNameValue: string = parent.tooltipModule.predecessorTooltipData.fromName;
            let fromIdValue: string = parent.tooltipModule.predecessorTooltipData.fromId;
            let toNameValue: string = parent.tooltipModule.predecessorTooltipData.toName;
            let toIdValue: string = parent.tooltipModule.predecessorTooltipData.toId;
            let linkTextValue: string = parent.tooltipModule.predecessorTooltipData.linkText;
            let offsetStringValue: string = parent.tooltipModule.predecessorTooltipData.offsetString;
            if (this.parent.enableHtmlSanitizer) {
                fromNameValue = typeof (fromNameValue) === 'string' ? SanitizeHtmlHelper.sanitize(fromNameValue) : fromNameValue;
                fromIdValue = typeof (fromIdValue) === 'string' ? SanitizeHtmlHelper.sanitize(fromIdValue) : fromIdValue;
                toNameValue = typeof (toNameValue) === 'string' ? SanitizeHtmlHelper.sanitize(toNameValue) : toNameValue;
                toIdValue = typeof (toIdValue) === 'string' ? SanitizeHtmlHelper.sanitize(toIdValue) : toIdValue;
                linkTextValue = typeof (linkTextValue) === 'string' ? SanitizeHtmlHelper.sanitize(linkTextValue) : linkTextValue;
                offsetStringValue = typeof (offsetStringValue) === 'string' ? SanitizeHtmlHelper.sanitize(offsetStringValue) : offsetStringValue;
            }
            let contentTemp: Function = function () {
                return '<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">' +
                this.parent.localeObj.getConstant('from') + '</td><td>:</td>' +
                '<td class = "e-gantt-tooltip-value">' + (this.parent.disableHtmlEncode ?  fromNameValue.replace(/</g,"&lt;").replace(/>/g,"&gt;"):fromNameValue) + ' (' +
                (this.parent.disableHtmlEncode ?  (typeof (fromIdValue) === 'string' ? fromIdValue.replace(/</g,"&lt;").replace(/>/g,"&gt;"): fromIdValue): fromIdValue) + ')' + '</td></tr><tr><td class = "e-gantt-tooltip-label">' +
                this.parent.localeObj.getConstant('to') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                (this.parent.disableHtmlEncode ?  toNameValue.replace(/</g,"&lt;").replace(/>/g,"&gt;"):toNameValue) + ' (' + toIdValue + ')' + '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('taskLink') +
                '</td><td>:</td><td class = "e-gantt-tooltip-value"> ' + linkTextValue +
                '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('lag') +
                '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                offsetStringValue + '</td></tr></tbody></table>';
                }
                content = initializeCSPTemplate(contentTemp, this);
            break;
        }
        case 'indicator':
            if (args.target.title.length) {
                let titleValue: string = args.target.title;
                if (this.parent.enableHtmlSanitizer && typeof (titleValue) === 'string') {
                    titleValue = SanitizeHtmlHelper.sanitize(titleValue);
                }
                let contentTemp: Function = function () {
                    return '<table class = "e-gantt-tooltiptable"><tbody><tr>' + titleValue + '</tr></tbody></table>';
                    }
                content = initializeCSPTemplate(contentTemp);
            }
            break;
        case 'timeline':
            let timlineTitleValue: string = args.target.title;
            if (this.parent.enableHtmlSanitizer && typeof (timlineTitleValue) === 'string') {
                timlineTitleValue = SanitizeHtmlHelper.sanitize(timlineTitleValue);
            }
            let contentTemp: Function = function () {
                return '<table class = "e-gantt-tooltiptable"><tbody><tr>' + timlineTitleValue + '</tr></tbody></table>';
                }
            content = initializeCSPTemplate(contentTemp);
            break;
        case 'manualtaskbar':
        {
            let autoStartDateValue: string = this.parent.getFormatedDate(data.autoStartDate, this.parent.getDateFormat());
            let autoEndDateValue: string = this.parent.getFormatedDate(data.autoEndDate, this.parent.getDateFormat());
            let durationUnitValue: string = this.parent.getDurationString(data.duration, data.durationUnit);
            let manualStartDateValue: string = this.parent.getFormatedDate(data.startDate, this.parent.getDateFormat());
            let manualEndDateValue: string = this.parent.getFormatedDate(data.endDate, this.parent.getDateFormat());
            if (this.parent.enableHtmlSanitizer) {
                autoStartDateValue = typeof (autoStartDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(autoStartDateValue) : autoStartDateValue;
                autoEndDateValue = typeof (autoEndDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(autoEndDateValue) : autoEndDateValue;
                durationUnitValue = typeof (durationUnitValue) === 'string' ? SanitizeHtmlHelper.sanitize(durationUnitValue) : durationUnitValue;
                manualStartDateValue = typeof (manualStartDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(manualStartDateValue) : manualStartDateValue;
                manualEndDateValue = typeof (manualEndDateValue) === 'string' ? SanitizeHtmlHelper.sanitize(manualEndDateValue) : manualEndDateValue;
            }
            let autoStartDate: string = data.autoStartDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    autoStartDateValue + '</td></tr>' : '';   
            let autoEndDate: string = data.autoEndDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksEndDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    autoEndDateValue + '</td></tr>' : '';   
            let durationValue: string = !isNullOrUndefined(data.duration) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('duration') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value"> ' + durationUnitValue +
                    '</td></tr>' : '';
            let manualStartDate: string = data.startDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('startDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    manualStartDateValue + '</td></tr>' : '';
            let manualEndDate: string = data.endDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('endDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    manualEndDateValue + '</td></tr>' : '';
            let contentTemp: Function = function () {
                return '<table class = "e-gantt-tooltiptable"><tbody>' +
                taskName + manualStartDate + autoStartDate + manualEndDate + autoEndDate +  durationValue  + '</tbody></table>';
                }
            content = initializeCSPTemplate(contentTemp);
            break;
        }
        case 'manualmilestone':
        {
            let autoStartValue: string = this.parent.getFormatedDate(data.autoStartDate, this.parent.getDateFormat());
            let autoEndValue: string = this.parent.getFormatedDate(data.autoEndDate, this.parent.getDateFormat());
            let dateValue: string = this.parent.getFormatedDate(data.startDate, this.parent.getDateFormat());
            if (this.parent.enableHtmlSanitizer) {
                autoStartValue = typeof (autoStartValue) === 'string' ? SanitizeHtmlHelper.sanitize(autoStartValue) : autoStartValue;
                autoEndValue = typeof (autoEndValue) === 'string' ? SanitizeHtmlHelper.sanitize(autoEndValue) : autoEndValue;
                dateValue = typeof (dateValue) === 'string' ? SanitizeHtmlHelper.sanitize(dateValue) : dateValue;
            }
            let autoStart: string = data.autoStartDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    autoStartValue + '</td></tr>' : '';
            let autoEnd: string = data.autoEndDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('subTasksEndDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    autoEndValue + '</td></tr>' : '';
            let date: string = '<tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' +
                    dateValue + '</tr>';       
            let contentTemp: Function = function () {
                return '<table class = "e-gantt-tooltiptable"><tbody>' +
                taskName + date + autoStart + autoEnd + '</tbody></table>';
                }
            content = initializeCSPTemplate(contentTemp);
            break;
        }
        }
        return content;
    }

    /**
     * To get the details of an event marker.
     *
     * @param {TooltipEventArgs} args .
     * @returns {EventMarkerModel} .
     * @private
     */
    public getMarkerTooltipData(args: TooltipEventArgs): EventMarkerModel {
        const markerTooltipId: string[] = (args.target.id).match(/\d+/g);
        const markerTooltipElement: EventMarkerModel = this.parent.eventMarkers[Number(markerTooltipId)];
        return markerTooltipElement;
    }

    /**
     * To get the details of a connector line.
     *
     * @param {TooltipEventArgs} args .
     * @returns {PredecessorTooltip} .
     * @private
     */
    public getPredecessorTooltipData(args: TooltipEventArgs): PredecessorTooltip {
        let predeceesorParent: string = args.target.id;
        if (this.parent.enableHtmlSanitizer && typeof (predeceesorParent) === 'string') {
            predeceesorParent = SanitizeHtmlHelper.sanitize(predeceesorParent);
        }
        const taskIds: string[] = predeceesorParent.match(/ConnectorLineparent(.*)child(.*)/);
        taskIds.shift();        
        let fromTask: IGanttData;
        let toTask: IGanttData;
        if (this.parent.viewType === 'ResourceView') {
            fromTask = this.parent.flatData[this.parent.getTaskIds().indexOf('T' + taskIds[0])];
            toTask = this.parent.flatData[this.parent.getTaskIds().indexOf('T' + taskIds[1])];
        } else {
            fromTask = this.parent.flatData[this.parent.ids.indexOf(taskIds[0])];
            toTask = this.parent.flatData[this.parent.ids.indexOf(taskIds[1])];
        }
        const predecessor: IPredecessor[] = (fromTask.ganttProperties.predecessor).filter(
            (pdc: IPredecessor) => { return pdc.to === taskIds[1]; });
        const predecessorTooltipData: PredecessorTooltip = {
            fromId: this.parent.viewType === 'ResourceView' ? fromTask.ganttProperties.taskId : fromTask.ganttProperties.rowUniqueID,
            toId: this.parent.viewType === 'ResourceView' ? toTask.ganttProperties.taskId : toTask.ganttProperties.rowUniqueID,
            fromName: fromTask.ganttProperties.taskName,
            toName: toTask.ganttProperties.taskName,
            linkType: predecessor[0].type,
            linkText: this.parent.getPredecessorTextValue(predecessor[0].type),
            offset: predecessor[0].offset,
            offsetUnit: predecessor[0].offsetUnit,
            offsetString: this.parent.getDurationString(predecessor[0].offset, predecessor[0].offsetUnit)
        };
        return predecessorTooltipData;
    }

    /**
     * To compile template string.
     *
     * @param {string | Function} template .
     * @param {Gantt} parent .
     * @param {IGanttData|PredecessorTooltip} data .
     * @param {string} propName .
     * @returns {NodeList} .
     * @private
     */
    public templateCompiler(template: string | Function, parent: Gantt, data: IGanttData | PredecessorTooltip, propName: string): NodeList {
        const tooltipFunction: Function = parent.chartRowsModule.templateCompiler(template);
        let templateID: string = parent.chartRowsModule.getTemplateID(propName);
        const templateNode: NodeList = tooltipFunction(extend({ index: 0 }, data), parent, propName, templateID, true);
        return templateNode;
    }
    private destroy(): void {
        this.toolTipObj.destroy();
    }
}
