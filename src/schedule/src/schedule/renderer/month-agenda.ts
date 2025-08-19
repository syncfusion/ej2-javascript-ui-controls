/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventHandler, createElement, addClass, formatUnit, remove } from '@syncfusion/ej2-base';
import { CellClickEventArgs, NotifyEventArgs, TdData } from '../base/interface';
import { AgendaBase } from '../event-renderer/agenda-base';
import { Schedule } from '../base/schedule';
import { Month } from './month';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import { NavigationDirection } from '../base/type';

/**
 * month agenda view
 */
export class MonthAgenda extends Month {
    public dayNameFormat: string = 'narrow';
    public viewClass: string = 'e-month-agenda-view';
    public agendaBase: AgendaBase;
    public monthAgendaDate: Date;

    constructor(parent: Schedule) {
        super(parent);
        this.monthAgendaDate = new Date('' + parent.selectedDate);
    }

    protected getModuleName(): string {
        return 'monthAgenda';
    }

    public renderAppointmentContainer(): void {
        const contentArea: HTMLElement = this.getContentAreaElement();
        const wrapperContainer: HTMLElement = createElement('div', { className: cls.WRAPPER_CONTAINER_CLASS });
        contentArea.appendChild(wrapperContainer);
        const appWrap: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAP_CLASS });
        wrapperContainer.appendChild(appWrap);
        this.appendAppContainer(appWrap);
        this.setEventWrapperHeight();
    }

    public getDayNameFormat(): string {
        if (this.parent.isAdaptive) {
            return 'narrow';
        }
        return 'abbreviated';
    }

    public updateSelectedCellClass(data: TdData): void {
        if (util.resetTime(data.date).getTime() === util.resetTime(new Date('' + this.parent.selectedDate)).getTime()) {
            data.className.push(cls.SELECTED_CELL_CLASS);
        }
    }

    private setEventWrapperHeight(): void {
        let headerHeight: number = (this.parent.headerModule ? this.parent.headerModule.getHeaderElement().offsetHeight : 0) + 2;
        const resourceWrapper: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR) as HTMLElement;
        if (resourceWrapper) {
            headerHeight += resourceWrapper.offsetHeight;
        }
        const contentArea: HTMLElement = this.getContentAreaElement().firstElementChild as HTMLElement;
        const dateHeader: HTMLElement = this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement;
        const availHeight: number = this.parent.element.offsetHeight - headerHeight - dateHeader.offsetHeight;
        const contentAreaHeight: number = (this.parent.activeViewOptions.interval > 1) ?
            Math.round(availHeight * 0.8) : contentArea.offsetHeight;
        const appContainerHeight: number = availHeight - contentAreaHeight;
        const wrapperContainer: HTMLElement = this.element.querySelector('.' + cls.WRAPPER_CONTAINER_CLASS) as HTMLElement;
        const eventWrapper: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.height !== 'auto') {
            if (this.parent.activeViewOptions.interval > 1) {
                contentArea.style.height = formatUnit(contentAreaHeight);
                EventHandler.add(contentArea, 'scroll', this.onContentScroll, this);
            }
            wrapperContainer.style.height = eventWrapper.style.height = formatUnit(appContainerHeight);
        }
    }

    public onDataReady(args: NotifyEventArgs): void {
        this.setEventWrapperHeight();
        this.clearElements();
        let eventCollection: Record<string, any>[] = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            const resource: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.agendaBase = this.getAgendaBase();
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        let count: number = 0;
        for (const date of this.renderDates) {
            const filterData: Record<string, any>[] = this.appointmentFiltering(date);
            const workCell: Element = this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS)[parseInt(count.toString(), 10)];
            if (filterData.length > 0) {
                if (!workCell.querySelector('.' + cls.APPOINTMENT_INDICATOR_CLASS)) {
                    workCell.appendChild(createElement('div', { className: cls.APPOINTMENT_INDICATOR_CLASS }));
                }
                if (date.getTime() === util.resetTime(new Date(this.monthAgendaDate.getTime())).getTime()) {
                    this.onEventRender(filterData, date);
                }
            }
            count++;
        }
        this.parent.notify(events.eventsLoaded, {});
    }

    public onCellClick(event: CellClickEventArgs): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide();
        }
        const filterData: Record<string, any>[] = this.appointmentFiltering(event.startTime);
        this.onEventRender(filterData, event.startTime);
        this.parent.notify(events.eventsLoaded, {});
        this.monthAgendaDate = new Date('' + event.startTime);
        this.parent.setProperties({ selectedDate: this.monthAgendaDate }, true);
    }

    private onEventRender(events: Record<string, any>[], date?: Date): void {
        this.agendaBase = this.getAgendaBase();
        const appWrap: Element = this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS);
        util.removeChildren(appWrap);
        if (this.parent.activeViewOptions.group.resources.length === 0 || this.parent.uiStateValues.isGroupAdaptive) {
            if (events.length > 0) {
                const appContainer: Element = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
                appWrap.appendChild(this.agendaBase.createAgendaContentElement('data', events, appContainer));
            } else {
                this.appendAppContainer(appWrap);
            }
        } else {
            if (events.length > 0) {
                const table: Element = this.createTableLayout();
                const tBody: Element = table.querySelector('tbody');
                this.agendaBase.calculateResourceTableElement(tBody, 1, date);
                table.appendChild(tBody);
                appWrap.appendChild(table);
            } else {
                this.appendAppContainer(appWrap);
            }
        }
        this.agendaBase.wireEventActions();
    }

    private appointmentFiltering(date: Date): Record<string, any>[] {
        const dateStart: Date = util.resetTime(new Date(date.getTime()));
        const dateEnd: Date = util.setTime(new Date(dateStart.getTime()), util.MS_PER_DAY);
        return this.parent.eventBase.filterEvents(dateStart, dateEnd);
    }

    private clearElements(): void {
        const appointmentIndicators: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_INDICATOR_CLASS));
        for (const appointmentIndicator of appointmentIndicators) {
            remove(appointmentIndicator);
        }
        this.appendAppContainer(this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS));
    }

    private appendAppContainer(appWrap: Element): void {
        const app: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
        addClass([app], cls.AGENDA_NO_EVENT_CLASS);
        app.innerHTML = this.parent.localeObj.getConstant('noEvents');
        util.removeChildren(appWrap);
        appWrap.appendChild(app);
    }

    public getNextPreviousDate(type: NavigationDirection): Date {
        const selectedDate: Date = this.parent.selectedDate;
        const interval: number = (type === 'Next') ? this.parent.activeViewOptions.interval : -this.parent.activeViewOptions.interval;
        const navigateDate: Date = util.addMonths(this.parent.selectedDate, interval);
        const month: number = (type === 'Next') ? 2 : 0;
        const lastDate: number = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + month, 0).getDate();
        const date: number = (lastDate >= this.monthAgendaDate.getDate()) ? this.monthAgendaDate.getDate() : lastDate;
        this.monthAgendaDate = new Date(navigateDate.getFullYear(), navigateDate.getMonth(), date);
        return this.monthAgendaDate;
    }

    private getAgendaBase(): AgendaBase {
        return this.agendaBase || new AgendaBase(this.parent);
    }

    public destroy(): void {
        if (this.agendaBase) {
            this.agendaBase.destroy();
            this.agendaBase = null;
        }
        super.destroy();
    }

}
