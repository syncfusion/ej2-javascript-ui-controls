/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, Internationalization, append, createElement, addClass, initializeCSPTemplate, removeClass } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { Schedule } from '../base/schedule';
import { TdData, ResourceDetails, EventFieldsMapping, TooltipOpenEventArgs } from '../base/interface';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import * as events from '../base/constant';

/**
 * Tooltip for Schedule
 */
export class EventTooltip {
    private parent: Schedule;
    private tooltipObj: Tooltip;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.tooltipObj = new Tooltip({
            animation: { close: { effect: 'FadeOut' } },
            content: 'No title',
            position: 'BottomRight',
            offsetY: 10,
            mouseTrail: this.parent.isAdaptive ? false : true,
            showTipPointer: false,
            cssClass: this.parent.cssClass + ' ' + cls.EVENT_TOOLTIP_ROOT_CLASS,
            target: this.getTargets(),
            beforeRender: this.onBeforeRender.bind(this),
            beforeClose: this.onTooltipClose.bind(this),
            beforeOpen: this.onTooltipOpen.bind(this),
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        this.tooltipObj.appendTo(this.parent.element);
    }

    private getTargets(): string {
        const targets: string[] = [];
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            targets.push('.' + cls.RESOURCE_CELLS_CLASS);
        }
        if (this.parent.eventSettings.enableTooltip) {
            targets.push('.' + cls.APPOINTMENT_CLASS);
        }
        return targets.join(',');
    }

    private onBeforeRender(args: TooltipEventArgs): void {
        if (this.parent.uiStateValues.isSwipeScroll) {
            args.cancel = true;
            return;
        }
        if (!isNullOrUndefined(args.target.getAttribute('data-tooltip-id'))) {
            return;
        }
        if (args.target.classList.contains(cls.RESOURCE_CELLS_CLASS) && this.parent.activeViewOptions.group.resources.length > 0) {
            if (args.target.closest('.' + cls.LEFT_INDENT_WRAP_CLASS)) {
                args.cancel = true;
                return;
            }
            let resCollection: TdData;
            if (this.parent.activeView.isTimelineView()) {
                const index: number = parseInt(args.target.getAttribute('data-group-index') as string, 10);
                resCollection = this.parent.resourceBase.lastResourceLevel[parseInt(index.toString(), 10)];
            } else {
                const rowIndex: number = (args.target.parentNode as HTMLTableRowElement).sectionRowIndex;
                const cellIndex: number = (args.target as HTMLTableCellElement).cellIndex;
                resCollection =
                    this.parent.activeView.getColumnLevels()[parseInt(rowIndex.toString(), 10)][parseInt(cellIndex.toString(), 10)];
            }
            const data: ResourceDetails = {
                resource: resCollection.resource,
                resourceData: resCollection.resourceData
            };
            const contentContainer: HTMLElement = createElement('div');
            const templateId: string = this.parent.element.id + '_headerTooltipTemplate';
            const tooltipTemplate: HTMLElement[] =
                [].slice.call(this.parent.getHeaderTooltipTemplate()(data, this.parent, 'headerTooltipTemplate', templateId, false));
            append(tooltipTemplate, contentContainer);
            this.setContent(contentContainer);
            this.parent.renderTemplates();
            return;
        }
        const record: Record<string, any> = this.parent.eventBase.getEventByGuid(args.target.getAttribute('data-guid'));
        if (isNullOrUndefined(record)) {
            return;
        }
        if (!isNullOrUndefined(this.parent.eventSettings.tooltipTemplate)) {
            const contentContainer: HTMLElement = createElement('div');
            const templateId: string = this.parent.element.id + '_tooltipTemplate';
            const tooltipTemplate: HTMLElement[] =
                [].slice.call(this.parent.getEventTooltipTemplate()(record, this.parent, 'tooltipTemplate', templateId, false));
            append(tooltipTemplate, contentContainer);
            this.setContent(contentContainer);
        } else {
            const globalize: Internationalization = this.parent.globalize;
            const fields: EventFieldsMapping = this.parent.eventFields;
            const eventStart: Date = new Date('' + record[fields.startTime]);
            let eventEnd: Date = new Date('' + record[fields.endTime]) as Date;
            eventEnd = ((eventEnd.getTime() - eventStart.getTime() !== 0) && eventEnd.getHours() === 0 && eventEnd.getMinutes() === 0) ?
                new Date(eventEnd.setMilliseconds(-1000)) : eventEnd;
            const startDate: Date = util.resetTime(new Date('' + eventStart));
            const endDate: Date = util.resetTime(new Date('' + eventEnd));
            const tooltipSubject: string = (record[fields.subject] || this.parent.eventSettings.fields.subject.default
                || this.parent.localeObj.getConstant('addTitle')) as string;
            const tooltipLocation: string = !isNullOrUndefined(record[fields.location]) ? <string>record[fields.location] : '';
            let startMonthDate: string = '';
            let startMonthYearDate: string = '';
            let endMonthYearDate: string = '';
            startMonthDate = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'MMMd', calendar: this.parent.getCalendarMode()
            });
            startMonthYearDate = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            endMonthYearDate = globalize.formatDate(eventEnd, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });

            startMonthDate = util.capitalizeFirstWord(startMonthDate, 'single');
            startMonthYearDate = util.capitalizeFirstWord(startMonthYearDate, 'single');
            endMonthYearDate = util.capitalizeFirstWord(endMonthYearDate, 'single');
            const startTime: string = this.parent.getTimeString(eventStart as Date);
            const endTime: string = this.parent.getTimeString(eventEnd as Date);
            let tooltipDetails: string;
            if (startDate.getTime() === endDate.getTime()) {
                tooltipDetails =
                    globalize.formatDate(eventStart, {
                        type: 'date', skeleton: 'long', calendar: this.parent.getCalendarMode()
                    });
                tooltipDetails = util.capitalizeFirstWord(tooltipDetails, 'single');
            } else {
                tooltipDetails = (startDate.getFullYear() === endDate.getFullYear()) ? (startMonthDate + ' - ' + endMonthYearDate) :
                    (startMonthYearDate + ' - ' + endMonthYearDate);
            }
            const tooltipTime: string = (record[fields.isAllDay]) ? this.parent.localeObj.getConstant('allDay') :
                (startTime + ' - ' + endTime);
            const content: string = '<div><div class="e-subject">' + tooltipSubject + '</div>' +
                '<div class="e-location">' + tooltipLocation + '</div>' +
                '<div class="e-details">' + tooltipDetails + '</div>' +
                '<div class="e-all-day">' + tooltipTime + '</div></div>';
            const contentTemp: Function = function(): string {
                return content;
            };
            this.setContent(initializeCSPTemplate(contentTemp));
        }
        this.parent.renderTemplates(() => {
            if (this.parent && (this.parent as any).isReact && !isNullOrUndefined(this.parent.eventSettings.tooltipTemplate)) {
                const wraps: Element = (document.querySelector('.' + cls.TOOLTIP_HIDDEN_CLASS));
                if (wraps) {
                    removeClass([wraps], cls.TOOLTIP_HIDDEN_CLASS);
                }
            }
        });
    }
    private onTooltipOpen(args: TooltipEventArgs): void {
        if (args.element && this.parent.isReact && !isNullOrUndefined(this.parent.eventSettings.tooltipTemplate) ) {
            addClass([args.element], cls.TOOLTIP_HIDDEN_CLASS);
        }
        const record: Record<string, any> = this.parent.eventBase.getEventByGuid(args.target.getAttribute('data-guid'));
        if (isNullOrUndefined(record)) {
            return;
        }
        const callbackArgs: TooltipOpenEventArgs = {
            cancel: false,
            data: record,
            content: args.element,
            target: args.target
        };
        this.parent.trigger(events.tooltipOpen, callbackArgs, (callbackArgs: TooltipOpenEventArgs) => {
            if (callbackArgs.cancel) {
                args.cancel = true;
                return;
            }
            args.element = callbackArgs.content;
        });
    }
    private onTooltipClose(args: TooltipEventArgs): void {
        if (args.element) {
            removeClass([args.element], cls.POPUP_OPEN);
            addClass([args.element], cls.POPUP_CLOSE);
        }
        if (!(this.parent.isReact && this.parent.eventWindow.dialogObject && this.parent.eventWindow.dialogObject.visible)) {
            this.parent.resetTemplates(['tooltipTemplate', 'headerTooltipTemplate']);
        }
    }

    private setContent(content: string | HTMLElement | Function): void {
        this.tooltipObj.setProperties({ content: content, windowCollision: true }, true);
    }

    public close(): void {
        this.tooltipObj.close();
    }

    public destroy(): void {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
        this.parent = null;
    }

}
