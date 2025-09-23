/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatUnit, isNullOrUndefined, closest, extend, append, prepend, remove } from '@syncfusion/ej2-base';
import { createElement, addClass, EventHandler } from '@syncfusion/ej2-base';
import { IRenderer, NotifyEventArgs, EventFieldsMapping, TdData } from '../base/interface';
import { AgendaBase } from '../event-renderer/agenda-base';
import { Schedule } from '../base/schedule';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import { NavigationDirection } from '../base/type';

/**
 * agenda view
 */
export class Agenda extends AgendaBase implements IRenderer {
    public viewClass: string = 'e-agenda-view';
    public isInverseTableSelect: boolean = false;
    public agendaDates: { [key: string]: Date } = {};
    public virtualScrollTop: number = 1;
    public dataSource: Record<string, any>[];

    constructor(parent: Schedule) {
        super(parent);
    }

    protected getModuleName(): string {
        return 'agenda';
    }

    public renderLayout(): void {
        this.agendaDates = {};
        this.element = createElement('div', { className: cls.TABLE_WRAP_CLASS });
        addClass([this.element], this.viewClass);
        this.element.appendChild(this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.element);
        const eTr: Element = createElement('tr');
        this.element.querySelector('tbody').appendChild(eTr);
        const workTd: Element = createElement('td');
        eTr.appendChild(workTd);
        const wrap: Element = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        workTd.appendChild(wrap);
        const tbl: Element = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        this.setAriaAttributes(tbl);
        wrap.appendChild(tbl);
        const tBody: Element = tbl.querySelector('tbody');
        const agendaDate: Date = util.resetTime(this.parent.selectedDate);
        this.renderEmptyContent(tBody, agendaDate);
        this.wireEvents();
        if (this.parent.resourceBase) {
            this.parent.resourceBase.generateResourceLevels([(<TdData>{ renderDates: this.parent.activeView.renderDates })]);
        }
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(event.contentReady, {});
    }

    private eventLoad(args: NotifyEventArgs): void {
        this.dataSource = extend([], this.parent.eventsData, null, true) as Record<string, any>[];
        for (const event of this.parent.eventsData) {
            delete (<Record<string, any>>event).generatedDates;
        }
        let eventCollection: Record<string, any>[] = this.parent.activeViewOptions.allowVirtualScrolling ?
            args.processedData : this.parent.eventsProcessed;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            const resource: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            this.dataSource = this.parent.eventBase.filterEventsByResource(resource, this.dataSource);
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.processAgendaEvents(eventCollection);
        const agendaDate: Date = util.resetTime(this.parent.selectedDate);
        const tBody: Element = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
        const contentArea: HTMLElement = closest(tBody, '.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        const scrollTop: number = contentArea.scrollTop;
        util.removeChildren(tBody);
        this.renderInitialContent(tBody, agendaDate);
        this.wireEventActions();
        contentArea.scrollTop = scrollTop;
        this.parent.notify(event.eventsLoaded, {});
        if (!this.parent.activeViewOptions.allowVirtualScrolling) {
            this.retainScrollPosition();
        }
    }

    private refreshEvent(refreshDate: Date): void {
        let processedData: Record<string, any>[] = [];
        const fields: EventFieldsMapping = this.parent.eventFields;
        for (const data of this.dataSource) {
            if (isNullOrUndefined(data[fields.recurrenceID]) && !isNullOrUndefined(data[fields.recurrenceRule]) &&
                !isNullOrUndefined(data.generatedDates) && refreshDate >= (<Record<string, any>>data.generatedDates).end) {
                processedData = processedData.concat(this.parent.eventBase.generateOccurrence(data, refreshDate));
            }
        }
        this.parent.eventsProcessed = this.parent.eventsProcessed.concat(this.processAgendaEvents(processedData));
    }

    public refreshHeader(): void {
        const tBody: Element = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody') as HTMLElement;
        if (this.parent.activeViewOptions.group.byDate) {
            util.removeChildren(tBody);
        } else {
            remove(tBody.firstElementChild);
        }
        const agendaDate: Date = util.resetTime(this.parent.selectedDate);
        const emptyTBody: Element = createElement('tbody');
        const firstDate: Date = new Date(agendaDate.getTime());
        const lastDate: Date = (this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) ?
            this.getEndDateFromStartDate(firstDate) : util.addDays(firstDate, this.parent.agendaDaysCount);
        this.renderContent(emptyTBody, firstDate, lastDate);
        append([].slice.call(emptyTBody.childNodes), tBody);
    }

    private renderInitialContent(tBody: Element, agendaDate: Date): void {
        const emptyTBody: Element = createElement('tbody');
        let firstDate: Date = new Date(agendaDate.getTime());
        let lastDate: Date = (this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) ?
            this.getEndDateFromStartDate(firstDate) : util.addDays(firstDate, this.parent.agendaDaysCount);
        this.renderContent(emptyTBody, firstDate, lastDate);
        append([].slice.call(emptyTBody.childNodes), tBody);
        // Initial rendering, to load previous date events upto scroll bar enable
        if (this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays && this.parent.eventsData.length > 0) {
            const contentArea: HTMLElement = this.getContentAreaElement();
            const contentChild: HTMLElement = contentArea.querySelector('.e-content-table');
            while (contentArea.offsetWidth <= contentArea.clientWidth) {
                if (this.parent.isAdaptive && contentChild.offsetHeight >= contentArea.clientHeight) {
                    break;
                }
                const emptyTBody: Element = createElement('tbody');
                lastDate = firstDate;
                firstDate = util.addDays(lastDate, - this.parent.agendaDaysCount);
                this.renderContent(emptyTBody, firstDate, lastDate);
                prepend([].slice.call(emptyTBody.childNodes), tBody);
                if (firstDate <= this.parent.minDate) { break; }
            }
        }
        if (tBody.childNodes.length <= 0) {
            this.renderEmptyContent(tBody, agendaDate, true);
        }
    }

    public renderContent(tBody: Element, agendaDate: Date, lastDate: Date): void {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        const firstDate: Date = new Date(agendaDate.getTime());
        const isObject: Record<string, any>[] = this.appointmentFiltering(firstDate, lastDate);
        if (isObject.length > 0 && this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) {
            if (!this.parent.activeViewOptions.showWeekend && !this.isAgendaWorkDay(isObject[0][fieldMapping.startTime])) {
                for (const event of isObject) {
                    if (this.isAgendaWorkDay(event[fieldMapping.startTime])) {
                        agendaDate = new Date(new Date(event[fieldMapping.startTime].getTime()).setHours(0, 0, 0, 0));
                        this.updateHeaderText(event[fieldMapping.startTime]);
                        break;
                    }
                }
            } else {
                agendaDate = new Date(new Date(isObject[0][fieldMapping.startTime].getTime()).setHours(0, 0, 0, 0));
                this.updateHeaderText(isObject[0][fieldMapping.startTime]);
            }
        }
        let endDate: Date;
        if (!this.parent.hideEmptyAgendaDays || (this.parent.agendaDaysCount > 0 && isObject.length > 0)) {
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                let date: Date = agendaDate;
                if (!this.parent.activeViewOptions.group.byDate) {
                    this.parent.activeViewOptions.allowVirtualScrolling = false;
                    date = firstDate;
                    if (this.parent.headerModule) {
                        this.parent.headerModule.updateDateRange();
                        this.parent.headerModule.updateHeaderItems('remove');
                    }
                }
                this.calculateResourceTableElement(tBody, this.parent.agendaDaysCount, date, lastDate);
            } else {
                for (let day: number = 0; day < this.parent.agendaDaysCount; day++) {
                    const nTr: HTMLElement = this.createTableRowElement(agendaDate, 'data') as HTMLElement;
                    const virtualContent: HTMLElement = this.element.querySelector('tr[data-row-index="' + (+(nTr.dataset.rowIndex)) + '"]');
                    if (virtualContent || !this.parent.activeViewOptions.showWeekend && !this.isAgendaWorkDay(agendaDate)) {
                        agendaDate = util.addDays(agendaDate, 1);
                        if (!virtualContent && this.parent.activeViewOptions.allowVirtualScrolling) {
                            day--;
                        }
                        if (agendaDate.getTime() > lastDate.getTime()) { break; }
                        continue;
                    }
                    const dTd: Element = nTr.children[0];
                    const aTd: Element = nTr.children[1];
                    const filterData: Record<string, any>[] = this.appointmentFiltering(agendaDate);
                    if (filterData.length > 0 || (!this.parent.hideEmptyAgendaDays && filterData.length === 0)) {
                        const elementType: string = (!this.parent.hideEmptyAgendaDays && filterData.length === 0) ? 'noEvents' : 'data';
                        dTd.appendChild(this.createDateHeaderElement(agendaDate));
                        nTr.appendChild(dTd);
                        this.parent.trigger(event.renderCell, { elementType: event.dateHeader, element: dTd, date: agendaDate });
                        const cTd: Element = this.createAgendaContentElement(elementType, filterData, aTd);
                        nTr.appendChild(cTd);
                        if (cTd.querySelectorAll('li').length > 0) {
                            tBody.appendChild(nTr);
                        }
                        const renderCellElementType: string = (!this.parent.hideEmptyAgendaDays && filterData.length === 0) ?
                            event.noEvents : event.agendaCells;
                        this.parent.trigger(event.renderCell, { elementType: renderCellElementType, element: cTd, date: agendaDate });
                    } else if (this.parent.activeViewOptions.allowVirtualScrolling) {
                        day--;
                    }
                    if (this.isCurrentDate(new Date(agendaDate.getTime()))) { addClass(dTd.childNodes, cls.AGENDA_CURRENT_DAY_CLASS); }
                    agendaDate = util.addDays(agendaDate, 1);
                    if (agendaDate.getTime() > lastDate.getTime()) { break; }
                }
            }
            endDate = new Date(agendaDate.getTime() - util.MS_PER_DAY);
        }
        this.agendaDates = { start: firstDate, end: endDate };
    }

    private isAgendaWorkDay(date: Date): boolean {
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.group.byDate) {
            return this.isWorkDay(date, this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex].workDays);
        } else {
            return this.isWorkDay(date);
        }
    }

    private agendaScrolling(event: Event): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide();
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            this.virtualScrolling(event);
        }
        if (!this.parent.activeViewOptions.allowVirtualScrolling) {
            this.setPersistence();
        }
    }

    private virtualScrolling(event: Event): void {
        const target: Element = event.target as Element;
        const scrollTop: number = target.scrollTop;
        const scrollHeight: number = target.scrollHeight;
        const offsetHeight: number = target.clientHeight;
        const totalHeight: number = scrollTop + offsetHeight;
        const direction: string = (this.virtualScrollTop < scrollTop) ? 'next' : 'previous';
        const tBody: Element = target.querySelector('tbody');
        const emptyTBody: Element = createElement('tbody');
        const topElement: Element = this.getElementFromScrollerPosition(event);
        const scrollDate: Date = this.parent.getDateFromElement(topElement);
        let filterDate: Record<string, Date>;
        let filterData: Record<string, any>[];
        if (scrollTop === 0) {
            filterDate = this.getPreviousNextDate(util.addDays(scrollDate, -1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start, filterDate.end);
                prepend([].slice.call(emptyTBody.childNodes), tBody);
                this.wireEventActions();
                for (let s: number = 0, element: HTMLCollection = tBody.children; s < element.length; s++) {
                    if (element[parseInt(s.toString(), 10)].getAttribute('data-row-index') === topElement.getAttribute('data-column-index')) {
                        const scrollToValue: number = (<HTMLElement>element[parseInt(s.toString(), 10)]).offsetTop -
                            (<HTMLElement>this.element.querySelector('.e-agenda-item')).offsetHeight;
                        target.scrollTop = scrollToValue;
                        break;
                    }
                }
                this.updateHeaderText(scrollDate);
            }
        } else if (totalHeight >= (scrollHeight - 5)) {
            filterDate = this.getPreviousNextDate(util.addDays(scrollDate, 1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start, filterDate.end);
                append([].slice.call(emptyTBody.childNodes), tBody);
                this.wireEventActions();
                this.updateHeaderText(scrollDate);
            }
        } else {
            this.updateHeaderText(scrollDate);
        }
        this.virtualScrollTop = scrollTop;
        const selectedElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            (selectedElements[selectedElements.length - 1] as HTMLElement).focus();
        }
    }

    private getElementFromScrollerPosition(event: Event): Element {
        let filterElement: Element;
        const target: Element = event.target as Element;
        const scrollTop: number = target.scrollTop;
        const scrollHeight: number = target.scrollHeight;
        const offsetHeight: number = target.clientHeight;
        const totalHeight: number = scrollTop + offsetHeight;
        const liCollection: HTMLElement[] = [].slice.call(target.querySelectorAll('.e-agenda-item'));
        let li: HTMLElement;
        let liDetails: ClientRect;
        if (liCollection.length > 0) {
            if (scrollTop === 0) {
                li = liCollection[0];
                filterElement = closest(li, '.' + cls.AGENDA_CELLS_CLASS);
            } else if (totalHeight === scrollHeight) {
                li = liCollection[liCollection.length - 1];
                filterElement = closest(li, '.' + cls.AGENDA_CELLS_CLASS);
            } else {
                for (let a: number = 0, length: number = liCollection.length; a < length; a++) {
                    li = liCollection[parseInt(a.toString(), 10)];
                    liDetails = li.getBoundingClientRect();
                    if (liDetails.top >= 0) {
                        filterElement = closest(li, '.' + cls.AGENDA_CELLS_CLASS);
                        break;
                    }
                }
            }
        }
        return filterElement;
    }

    private updateHeaderText(date?: Date): void {
        if (this.parent.showHeaderBar) {
            this.parent.headerModule.updateDateRange(date);
        }
    }

    private getPreviousNextDate(date: Date, type: string): Record<string, Date> {
        let currentDate: Date = new Date(date.getTime());
        const firstDate: Date = this.getStartDateFromEndDate(date);
        const lastDate: Date = this.getEndDateFromStartDate(date);
        let daysCount: number = 0;
        do {
            if (this.parent.activeViewOptions.showWeekend || !this.parent.activeViewOptions.showWeekend &&
                this.isAgendaWorkDay(currentDate)) {
                const filterData: Record<string, any>[] = this.appointmentFiltering(currentDate);
                if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) { daysCount++; }
            }
            currentDate = util.addDays(currentDate, (type === 'next') ? 1 : -1);
            if (currentDate < firstDate || currentDate > lastDate) { break; }
        } while (daysCount !== this.parent.agendaDaysCount);
        const endDate: Date = util.addDays(currentDate, (type === 'next') ? -1 : 1);
        return (type === 'next') ? { start: date, end: util.addDays(endDate, 1) } : { start: endDate, end: util.addDays(date, 1) };
    }

    private appointmentFiltering(startDate?: Date, endDate?: Date): Record<string, any>[] {
        let dateStart: Date; let dateEnd: Date;
        if (!isNullOrUndefined(startDate) && isNullOrUndefined(endDate)) {
            dateStart = util.resetTime(new Date(startDate.getTime()));
            dateEnd = util.setTime(new Date(dateStart.getTime()), util.MS_PER_DAY);
        } else {
            dateStart = new Date(startDate.getTime());
            dateEnd = new Date(endDate.getTime());
        }
        let filterData: Record<string, any>[] = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        if (filterData.length === 0) {
            this.refreshEvent(startDate);
            filterData = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        }
        if (!isNullOrUndefined(this.parent.minDate) || !isNullOrUndefined(this.parent.maxDate)) {
            const fieldMapping: EventFieldsMapping = this.parent.eventFields;
            filterData = filterData.filter((event: Record<string, any>) => {
                const eStart: Date = event[fieldMapping.startTime] as Date;
                const eEnd: Date = event[fieldMapping.endTime] as Date;
                return !(eStart.getTime() < this.parent.minDate.getTime() ||
                    eEnd.getTime() > (util.addDays(this.parent.maxDate, 1)).getTime());
            });
        }
        return filterData;
    }

    public getStartDateFromEndDate(endDate: Date): Date {
        let filterDate: Date; const fields: EventFieldsMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            const firstDate: number = Math.min(...this.parent.eventsProcessed.map((a: Record<string, Date>) =>
                a[fields.startTime].getTime()));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(firstDate) : this.parent.minDate;
        } else {
            filterDate = this.parent.hideEmptyAgendaDays ? util.addMonths(endDate, -1) : this.parent.minDate;
        }
        return util.resetTime(filterDate);
    }

    public getEndDateFromStartDate(startDate: Date): Date {
        let filterDate: Date; const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            const lastDate: number = Math.max(...this.parent.eventsProcessed.map((a: Record<string, Date>) =>
                a[fieldMapping.endTime].getTime()));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(lastDate) : this.parent.maxDate;
        } else {
            filterDate = this.parent.hideEmptyAgendaDays ? util.addMonths(startDate, 1) : this.parent.maxDate;
        }
        return util.resetTime(util.addDays(filterDate, 1));
    }

    public getNextPreviousDate(type: NavigationDirection): Date {
        const noOfDays: number = (type === 'Next') ? 1 : -1;
        return util.addDays(this.parent.selectedDate, noOfDays);
    }

    public startDate(): Date {
        return util.resetTime(this.parent.selectedDate);
    }

    public endDate(): Date {
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            return this.getEndDateFromStartDate(this.startDate());
        } else {
            return util.addDays(this.startDate(), this.parent.agendaDaysCount);
        }
    }

    public getDateRangeText(date?: Date): string {
        const formatDate: string = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
        if (this.parent.activeViewOptions.allowVirtualScrolling || this.parent.isAdaptive) {
            const currentDate: Date = isNullOrUndefined(date) ? this.parent.selectedDate : date;
            return util.capitalizeFirstWord(
                this.parent.globalize.formatDate(currentDate, { format: formatDate, calendar: this.parent.getCalendarMode() }), 'multiple');
        } else {
            const startDate: Date = this.parent.selectedDate;
            const endDate: Date = util.addDays(startDate, this.parent.agendaDaysCount - 1);
            return this.formatDateRange(startDate, endDate);
        }
    }

    public dayNavigationClick(e: Event): void {
        const element: HTMLTableCellElement = closest((<Element>e.currentTarget), '.' + cls.AGENDA_CELLS_CLASS) as HTMLTableCellElement;
        const date: Date = this.parent.getDateFromElement(element);
        if (!isNullOrUndefined(date) && !this.parent.isAdaptive && this.parent.isMinMaxDate(date)) {
            this.parent.setProperties({ selectedDate: date }, true);
            this.parent.changeView('Day', e);
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), event.scroll, this.agendaScrolling, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), event.scroll, this.agendaScrolling);
        const dateHeaderElement: Element[] = [].slice.call(this.element.querySelectorAll('.e-m-date'));
        for (const element of dateHeaderElement) {
            EventHandler.remove(element, 'click', this.dayNavigationClick);
        }
    }

    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.onAgendaScrollUiUpdate, this);
        this.parent.on(event.dataReady, this.eventLoad, this);
    }

    public removeEventListener(): void {
        if (this.parent) {
            this.parent.off(event.scrollUiUpdate, this.onAgendaScrollUiUpdate);
            this.parent.off(event.dataReady, this.eventLoad);
        }
    }

    private onAgendaScrollUiUpdate(): void {
        const headerHeight: number = this.getHeaderBarHeight();
        if (this.parent.headerModule) {
            if (this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('add');
            } else {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
        const contentArea: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.height !== 'auto') {
            contentArea.style.height = formatUnit(this.parent.element.offsetHeight - headerHeight);
        }
    }

    public scrollToDate(scrollDate: Date): void {
        const date: Date = new Date(+util.resetTime(scrollDate));
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            if (!this.parent.hideEmptyAgendaDays || this.parent.getEvents(date, util.addDays(date, 1), true).length > 0) {
                this.parent.changeDate(date);
            }
        } else {
            const dateElement: HTMLElement = this.element.querySelector('.' + cls.AGENDA_CELLS_CLASS + '[data-date="' + date.getTime() + '"]');
            if (dateElement) {
                this.getContentAreaElement().scrollTop = dateElement.offsetTop;
            }
        }
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            this.parent = null;
            return;
        }
        if (this.element) {
            this.unWireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            if (this.parent.headerModule && this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('remove');
            }
            super.destroy();
        }
    }

}
