/* eslint-disable @typescript-eslint/no-explicit-any */
import { print as basePrint, createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { TimelineYear } from '../renderer/timeline-year';
import { Year } from '../renderer/year';
import { TimelineMonth } from '../renderer/timeline-month';
import { TimelineViews } from '../renderer/timeline-view';
import { MonthAgenda } from '../renderer/month-agenda';
import { Agenda } from '../renderer/agenda';
import { Month } from '../renderer/month';
import { WorkWeek } from '../renderer/work-week';
import { Week } from '../renderer/week';
import { Day } from '../renderer/day';
import { EventSettingsModel, GroupModel, TimeScaleModel, ViewsModel } from '../models/models';
import { ScheduleModel } from '../base/schedule-model';
import * as events from '../base/constant';
import { View } from '../base/type';
import { BeforePrintEventArgs } from '../base/interface';

/**
 * Print Module
 */

export class Print {
    private parent: Schedule;
    private printInstance: Schedule;
    private printWindow: Window;

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public print(printOptions?: ScheduleModel): void {
        if (isNullOrUndefined(printOptions)) {
            this.printScheduler();
        } else {
            this.printSchedulerWithModel(printOptions);
        }
    }

    private printScheduler(): void {
        const clone: HTMLElement = this.parent.element.cloneNode(true) as HTMLElement;
        clone.id = this.parent.element.id + '_print';
        const args: BeforePrintEventArgs = { cancel: false, printElement: clone };
        this.parent.trigger(events.beforePrint, args, (printElement: BeforePrintEventArgs) => {
            if (printElement.cancel) {
                return;
            }
            document.body.appendChild(clone);
            const className: string = this.parent.currentView === 'MonthAgenda' ? '.e-appointment-wrap' : '.e-content-wrap';
            const scrollableEle: Element = this.parent.element.querySelector(className);
            const links: Element[] = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('link, style'));
            let reference: string = '';
            for (const link of links) {
                reference += link.outerHTML;
            }
            const div: Element = createElement('div');
            clone.style.width = this.parent.element.offsetWidth + 'px';
            const elementWidth: number = Math.round((parseInt(clone.style.width, 10)) / 100) * 100;
            div.appendChild(clone);
            const printWindow: Window = window.open('', 'print', 'height=550,width=' + elementWidth + ',tabbar=no');
            printWindow.document.write('<!DOCTYPE html><html><head>' + reference + '</head><body>' + div.innerHTML +
                '<script>(function() { window.ready = true; })();</script></body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                if ((printWindow as any).ready && scrollableEle) {
                    // eslint-disable-next-line no-self-assign
                    scrollableEle.scrollLeft = scrollableEle.scrollLeft;
                    // eslint-disable-next-line no-self-assign
                    scrollableEle.scrollTop = scrollableEle.scrollTop;
                    const headerTimeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-date-header-wrap');
                    if (headerTimeCellsScroll) {
                        headerTimeCellsScroll.scrollLeft = scrollableEle.scrollLeft;
                    }
                    const timeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-time-cells-wrap');
                    if (timeCellsScroll) {
                        timeCellsScroll.scrollTop = scrollableEle.scrollTop;
                    }
                    const contentCellScroll: HTMLElement = printWindow.document.querySelector(className);
                    if (contentCellScroll) {
                        contentCellScroll.scrollLeft = scrollableEle.scrollLeft;
                        contentCellScroll.scrollTop = scrollableEle.scrollTop;
                    }
                    printWindow.print();
                    printWindow.close();
                }
            }, 500);
        });
    }

    private printSchedulerWithModel(printOptions: ScheduleModel): void {
        const element: HTMLElement = createElement('div', { id: this.parent.element.id + '_print', className: 'e-print-schedule' });
        document.body.appendChild(element);
        Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, Year, TimelineYear);
        this.printInstance = new Schedule(this.getPrintScheduleModel(printOptions));
        this.printInstance.isPrinting = true;
        this.printInstance.registeredTemplate = this.parent.registeredTemplate;
        this.printInstance.root = this.parent.root ? this.parent.root : this.parent;
        this.printInstance.appendTo(element);
        const args: BeforePrintEventArgs = { cancel: false, printElement: element };
        this.parent.trigger(events.beforePrint, args, (printElement: BeforePrintEventArgs) => {
            if (printElement.cancel) {
                this.printCleanup();
                return;
            }
            this.printInstance.on(events.print, this.contentReady, this);
            this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
            this.printWindow.moveTo(0, 0);
            this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        });
    }

    private getPrintScheduleModel(printOptions: ScheduleModel): ScheduleModel {
        const printModel: ScheduleModel = {};
        const scheduleProps: string[] = ['agendaDaysCount', 'calendarMode', 'cssClass', 'currentView',
            'dateFormat', 'enableRtl', 'endHour', 'eventSettings', 'firstDayOfWeek',
            'firstMonthOfYear', 'group', 'height', 'locale', 'maxDate', 'minDate', 'readonly',
            'resources', 'rowAutoHeight', 'selectedDate', 'showHeaderBar', 'showTimeIndicator', 'showWeekNumber',
            'showWeekend', 'startHour', 'timeFormat', 'timeScale', 'timezone', 'views', 'width', 'workDays', 'workHours',
            'dateHeaderTemplate', 'dateRangeTemplate', 'cellHeaderTemplate', 'dayHeaderTemplate', 'monthHeaderTemplate',
            'cellTemplate', 'resourceHeaderTemplate', 'headerIndentTemplate', 'actionBegin', 'actionComplete', 'actionFailure',
            'created', 'dataBinding', 'dataBound', 'destroyed', 'eventRendered', 'moreEventsClick', 'navigating', 'popupOpen', 'popupClose', 'renderCell'
        ];
        const scheduleTemplates: string[] = ['cellHeaderTemplate', 'dayHeaderTemplate', 'monthHeaderTemplate', 'cellTemplate',
            'dateHeaderTemplate', 'dateRangeTemplate', 'eventTemplate', 'resourceHeaderTemplate', 'headerIndentTemplate'];
        const scheduleEvents: string[] = ['actionBegin', 'actionComplete', 'actionFailure', 'created', 'dataBinding', 'dataBound',
            'destroyed', 'eventRendered', 'moreEventsClick', 'navigating', 'popupOpen', 'popupClose', 'renderCell'];
        let eventSettings: EventSettingsModel;
        let group: GroupModel;
        let timeScale: TimeScaleModel;
        let views: View[] | ViewsModel[];
        for (const key of scheduleProps) {
            switch (key) {
            case 'eventSettings': {
                eventSettings = Object.assign({}, (this.parent.eventSettings as Record<string, any>).properties);
                eventSettings.dataSource = this.parent.eventsData;
                const eventTemplate: string | Function = !isNullOrUndefined(printOptions.eventSettings) &&
                    !isNullOrUndefined(printOptions.eventSettings.template) ? printOptions.eventSettings.template : eventSettings.template;
                eventSettings.template = !this.parent.isAngular && typeof (eventTemplate) === 'function' ? null : eventTemplate;
                printModel.eventSettings = eventSettings;
                break;
            }
            case 'group':
                group = isNullOrUndefined(printOptions.group) ? this.parent.group : printOptions.group;
                group.headerTooltipTemplate = null;
                printModel.group = group;
                break;
            case 'timeScale':
                timeScale = isNullOrUndefined(printOptions.timeScale) ? this.parent.timeScale : printOptions.timeScale;
                if (!this.parent.isAngular) {
                    timeScale.majorSlotTemplate = typeof (timeScale.majorSlotTemplate) === 'function' ? null : timeScale.majorSlotTemplate;
                    timeScale.minorSlotTemplate = typeof (timeScale.minorSlotTemplate) === 'function' ? null : timeScale.minorSlotTemplate;
                }
                printModel.timeScale = timeScale;
                break;
            case 'views':
                views = isNullOrUndefined(printOptions.views) ? this.parent.views : printOptions.views;
                if (!this.parent.isAngular && views && views.length > 0 && typeof (views[0]) === 'object') {
                    for (const view of views) {
                        scheduleTemplates.forEach((x: string) => {
                            if (!isNullOrUndefined((view as Record<string, any>)[`${x}`])) {
                                (view as Record<string, any>)[`${x}`] = typeof ((view as Record<string, any>)[`${x}`]) === 'function' ? null : (view as Record<string, any>)[`${x}`];
                            }
                        });
                    }
                }
                printModel.views = views;
                break;
            default:
                if (scheduleTemplates.indexOf(key) > -1) {
                    (printModel as Record<string, any>)[`${key}`] = isNullOrUndefined((printOptions as Record<string, any>)[`${key}`]) ?
                        (!this.parent.isAngular && typeof((this.parent as Record<string, any>)[`${key}`]) === 'function' ? null : (this.parent as Record<string, any>)[`${key}`]) :
                        (!this.parent.isAngular && typeof((printOptions as Record<string, any>)[`${key}`]) === 'function' ? null : (printOptions as Record<string, any>)[`${key}`]);
                    break;
                }
                if (scheduleEvents.indexOf(key) > -1) {
                    (printModel as Record<string, any>)[`${key}`] = (printOptions as Record<string, any>)[`${key}`];
                    break;
                }
                (printModel as Record<string, any>)[`${key}`] = isNullOrUndefined((printOptions as Record<string, any>)[`${key}`]) ?
                    (this.parent as Record<string, any>)[`${key}`] : (printOptions as Record<string, any>)[`${key}`];
                break;
            }
        }
        return printModel;
    }

    private contentReady(): void {
        this.printWindow = basePrint(this.printInstance.element, this.printWindow);
        this.closePrintWindow(this.printWindow, true);
        this.printWindow.onbeforeunload = () => {
            this.printCleanup();
        };
    }

    private closePrintWindow(printWindow: Window, cleanupRequired?: boolean): void {
        if (Browser.isIos) {
            const printInterval: ReturnType<typeof setInterval> = setInterval(() => {
                if (printWindow.opener) {
                    printWindow.close();
                } else if (isNullOrUndefined(printWindow.opener)) {
                    if (cleanupRequired) {
                        this.printCleanup();
                    }
                    clearInterval(printInterval);
                }
            }, 500);
        }
    }

    private printCleanup(): void {
        if (this.printInstance) {
            this.printInstance.off(events.print, this.contentReady);
            this.printInstance.element.remove();
            this.printInstance.destroy();
            this.printInstance = null;
        }
        if (this.printWindow) {
            this.printWindow.onbeforeunload = null;
            this.printWindow = null;
        }
    }

    protected getModuleName(): string {
        return 'print';
    }

    public destroy(): void {
        this.parent = null;
    }

}
