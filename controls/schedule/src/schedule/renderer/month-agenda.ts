import { createElement, addClass, formatUnit, remove } from '@syncfusion/ej2-base';
import { CellClickEventArgs, NotifyEventArgs, TdData } from '../base/interface';
import { AgendaBase } from '../event-renderer/agenda-base';
import { Schedule } from '../base/schedule';
import { Month } from './month';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * month agenda view
 */
export class MonthAgenda extends Month {
    public dayNameFormat: string = 'narrow';
    public viewClass: string = 'e-month-agenda-view';
    public agendaDates: { [key: string]: Date } = {};
    public agendaBase: AgendaBase;
    private monthAgendaDate: Date;
    /**
     * Constructor
     */
    constructor(parent: Schedule) {
        super(parent);
        this.agendaBase = new AgendaBase(parent);
        this.monthAgendaDate = parent.selectedDate;
    }

    public renderAppointmentContainer(): void {
        if (this.parent.isServerRenderer()) {
            this.setEventWrapperHeight();
            return;
        }
        let contentArea: HTMLElement = this.getContentAreaElement();
        let wrapperContainer: HTMLElement = createElement('div', { className: cls.WRAPPER_CONTAINER_CLASS });
        contentArea.appendChild(wrapperContainer);
        let appWrap: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAP_CLASS });
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

    private setEventWrapperHeight(): void {
        let headerHeight: number = (this.parent.headerModule ? this.parent.headerModule.getHeaderElement().offsetHeight : 0) + 2;
        let resourceWrapper: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR) as HTMLElement;
        if (resourceWrapper) {
            headerHeight += resourceWrapper.offsetHeight;
        }
        let contentArea: HTMLElement = this.getContentAreaElement().firstElementChild as HTMLElement;
        let dateHeader: HTMLElement = this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement;
        let availableHeight: number = this.parent.element.offsetHeight - headerHeight - dateHeader.offsetHeight - contentArea.offsetHeight;
        let wrapperContainer: HTMLElement = this.element.querySelector('.' + cls.WRAPPER_CONTAINER_CLASS) as HTMLElement;
        let eventWrapper: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS) as HTMLElement;
        wrapperContainer.style.height = eventWrapper.style.height = formatUnit(availableHeight);
    }

    public onDataReady(args: NotifyEventArgs): void {
        this.setEventWrapperHeight();
        this.clearElements();
        let eventCollection: Object[] = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            let resource: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        let count: number = 0;
        for (let date of this.renderDates) {
            let filterData: Object[] = this.appointmentFiltering(date);
            let workCell: Element = this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS)[count];
            if (filterData.length > 0) {
                if (!workCell.querySelector('.' + cls.APPOINTMENT_INDICATOR_CLASS)) {
                    workCell.appendChild(createElement('div', { className: cls.APPOINTMENT_INDICATOR_CLASS }));
                }
                if (date.getTime() === util.resetTime(new Date(this.parent.selectedDate.getTime())).getTime()) {
                    this.onEventRender(filterData, date);
                }
            }
            count++;
        }
        this.parent.notify(events.eventsLoaded, {});
    }

    public onCellClick(event: CellClickEventArgs): void {
        this.parent.quickPopup.quickPopupHide();
        let filterData: Object[] = this.appointmentFiltering(event.startTime);
        this.parent.resetEventTemplates();
        this.onEventRender(filterData, event.startTime);
        this.parent.notify(events.eventsLoaded, {});
        this.monthAgendaDate = new Date('' + event.startTime);
    }

    private onEventRender(events: Object[], date?: Date): void {
        let appWrap: Element = this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS);
        util.removeChildren(appWrap);
        if (this.parent.activeViewOptions.group.resources.length === 0 || this.parent.uiStateValues.isGroupAdaptive) {
            if (events.length > 0) {
                let appContainer: Element = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
                appWrap.appendChild(this.agendaBase.
                    createAgendaContentElement('data', events as { [key: string]: Object }[], appContainer));
            } else {
                this.appendAppContainer(appWrap);
            }
        } else {
            if (events.length > 0) {
                let table: Element = this.createTableLayout();
                let tBody: Element = table.querySelector('tbody');
                this.agendaBase.calculateResourceTableElement(tBody, 1, date);
                table.appendChild(tBody);
                appWrap.appendChild(table);
            } else {
                this.appendAppContainer(appWrap);
            }
        }
        this.agendaBase.wireEventActions();
    }

    private appointmentFiltering(date: Date): Object[] {
        let dateStart: Date = util.resetTime(new Date(date.getTime()));
        let dateEnd: Date = util.setTime(new Date(dateStart.getTime()), util.MS_PER_DAY);
        return this.parent.eventBase.filterEvents(dateStart, dateEnd);
    }

    private clearElements(): void {
        let appointmentIndicators: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_INDICATOR_CLASS));
        for (let appointmentIndicator of appointmentIndicators) {
            remove(appointmentIndicator);
        }
        this.appendAppContainer(this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS));
    }

    private appendAppContainer(appWrap: Element): void {
        let app: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
        addClass([app], cls.AGENDA_NO_EVENT_CLASS);
        app.innerHTML = this.parent.localeObj.getConstant('noEvents');
        util.removeChildren(appWrap);
        appWrap.appendChild(app);
    }

    public getNextPreviousDate(type: string): Date {
        let selectedDate: Date = this.parent.selectedDate;
        let interval: number = (type === 'next') ? this.parent.activeViewOptions.interval : -this.parent.activeViewOptions.interval;
        let navigateDate: Date = util.addMonths(this.parent.selectedDate, interval);
        let month: number = (type === 'next') ? 2 : 0;
        let lastDate: number = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + month, 0).getDate();
        let date: number = (lastDate >= this.monthAgendaDate.getDate()) ? this.monthAgendaDate.getDate() : lastDate;
        this.monthAgendaDate = new Date(navigateDate.getFullYear(), navigateDate.getMonth(), date);
        return this.monthAgendaDate;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'monthAgenda';
    }
}