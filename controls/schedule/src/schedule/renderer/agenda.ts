import { formatUnit, isNullOrUndefined, closest, extend } from '@syncfusion/ej2-base';
import { createElement, remove, addClass, EventHandler } from '@syncfusion/ej2-base';
import { IRenderer, NotifyEventArgs, EventFieldsMapping, TdData } from '../base/interface';
import { AgendaBase } from '../event-renderer/agenda-base';
import { Schedule } from '../base/schedule';
import { ViewBase } from './view-base';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';


/**
 * agenda view
 */

export class Agenda extends ViewBase implements IRenderer {
    public viewClass: string = 'e-agenda-view';
    public isInverseTableSelect: boolean = false;
    public agendaDates: { [key: string]: Date } = {};
    public virtualScrollTop: number = 1;
    public minDate: Date = new Date(1900, 0, 1);
    public maxDate: Date = new Date(2099, 11, 31);
    public agendaBase: AgendaBase;
    public dataSource: Object[];
    /**
     * Constructor for agenda view
     */
    constructor(parent: Schedule) {
        super(parent);
        this.agendaBase = new AgendaBase(parent);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'agenda';
    }

    public renderLayout(): void {
        this.agendaDates = {};
        this.element = createElement('div', { className: cls.TABLE_WRAP_CLASS });
        addClass([this.element], this.viewClass);
        this.element.appendChild(this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement);
        this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.element);
        let eTr: Element = createElement('tr');
        this.element.querySelector('tbody').appendChild(eTr);
        let workTd: Element = createElement('td');
        eTr.appendChild(workTd);
        let wrap: Element = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        workTd.appendChild(wrap);
        let tbl: Element = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        wrap.appendChild(tbl);
        let tBody: Element = tbl.querySelector('tbody');
        let agendaDate: Date = util.resetTime(this.parent.selectedDate);
        this.agendaBase.renderEmptyContent(tBody, agendaDate);
        this.wireEvents();
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER)) {
            this.parent.resourceBase.generateResourceLevels([(<TdData>{ renderDates: this.parent.activeView.renderDates })]);
            this.renderResourceMobileLayout();
        }
        this.parent.notify(event.contentReady, {});
    }

    private eventLoad(args: NotifyEventArgs): void {
        this.dataSource = <Object[]>extend([], this.parent.eventsData, null, true);
        for (let event of this.parent.eventsData) {
            delete (<{ [key: string]: Object }>event).generatedDates;
        }
        let eventCollection: Object[] = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            let resource: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            this.dataSource = this.parent.eventBase.filterEventsByResource(resource, this.dataSource);
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        let agendaDate: Date = util.resetTime(this.parent.selectedDate);
        let tBody: Element = this.parent.getContentTable();
        tBody.innerHTML = '';
        this.renderContent(tBody, agendaDate);
        this.agendaBase.wireEventActions();
        let contentArea: HTMLElement = closest(tBody, '.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        contentArea.scrollTop = 1;
    }

    private refreshEvent(refreshDate: Date): void {
        let processedData: Object[] = [];
        for (let eventData of this.dataSource) {
            let fields: EventFieldsMapping = this.parent.eventFields;
            let data: { [key: string]: Object } = eventData as { [key: string]: Object };
            if (isNullOrUndefined(data[fields.recurrenceID]) && !isNullOrUndefined(data[fields.recurrenceRule]) &&
                !isNullOrUndefined(data.generatedDates) && refreshDate >= (<{ [key: string]: Object }>data.generatedDates).end) {
                processedData = processedData.concat(this.parent.eventBase.generateOccurrence(data, refreshDate));
            }
        }
        this.parent.eventsProcessed = this.parent.eventsProcessed.concat(this.agendaBase.processAgendaEvents(processedData));
    }

    public renderContent(tBody: Element, agendaDate: Date): void {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let firstDate: Date = new Date(agendaDate.getTime()); let lastDate: Date = this.getEndDateFromStartDate(firstDate);
        let isObject: Object[] = this.appointmentFiltering(firstDate, lastDate);
        if (isObject.length === 0) {
            lastDate = firstDate; firstDate = new Date(this.minDate.getTime());
            isObject = this.appointmentFiltering(firstDate, lastDate);
            if (isObject.length === 0) {
                firstDate = lastDate; lastDate = new Date(this.maxDate.getTime());
                isObject = this.appointmentFiltering(firstDate, lastDate);
            }
        }
        if (isObject.length > 0) {
            let appoint: { [key: string]: Object }[] = <{ [key: string]: Object }[]>isObject;
            agendaDate = appoint[0][fieldMapping.startTime] as Date;
            agendaDate = new Date(new Date(agendaDate.getTime()).setHours(0, 0, 0, 0));
            this.updateHeaderText(appoint[0][fieldMapping.startTime] as Date);
        }
        let endDate: Date;
        if (!this.parent.hideEmptyAgendaDays || (this.parent.agendaDaysCount > 0 && isObject.length > 0)) {
            let noOfDays: number = (!this.parent.hideEmptyAgendaDays || !this.parent.activeViewOptions.allowVirtualScrolling ||
                this.parent.agendaDaysCount < isObject.length) ? this.parent.agendaDaysCount : isObject.length;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                let date: Date = agendaDate;
                if (!this.parent.activeViewOptions.group.byDate) {
                    this.parent.activeViewOptions.allowVirtualScrolling = false;
                    date = firstDate;
                    if (this.parent.headerModule) {
                        this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
                        this.parent.headerModule.updateHeaderItems('remove');
                    }
                }
                this.agendaBase.calculateResourceTableElement(tBody, this.parent.agendaDaysCount, date);
            } else {
                for (let day: number = 0; day < noOfDays; day++) {
                    let filterData: { [key: string]: Object }[] = [];
                    filterData = this.appointmentFiltering(agendaDate) as { [key: string]: Object }[];
                    let nTr: Element = this.agendaBase.createTableRowElement(agendaDate, 'data');
                    if (this.element.querySelector('tr[aria-rowindex="' + parseInt(nTr.getAttribute('aria-rowindex'), 10)
                        + '"]')) { continue; }
                    // if (this.isMonthFirstDate(agendaDate)) {
                    //     tBody.appendChild(this.renderMonthHeader(this.createTableRowElement(agendaDate, 'monthHeader')));
                    // }
                    let dTd: Element = nTr.children[0];
                    let aTd: Element = nTr.children[1];
                    if (filterData.length > 0 || (!this.parent.hideEmptyAgendaDays && filterData.length === 0)) {
                        let elementType: string = (!this.parent.hideEmptyAgendaDays && filterData.length === 0) ? 'noEvents' : 'data';
                        dTd.appendChild(this.agendaBase.createDateHeaderElement(agendaDate));
                        nTr.appendChild(dTd);
                        let cTd: Element = this.agendaBase.createAgendaContentElement(elementType, filterData, aTd);
                        nTr.appendChild(cTd);
                        if (cTd.querySelectorAll('li').length > 0) {
                            tBody.appendChild(nTr);
                        }
                    } else if (this.parent.activeViewOptions.allowVirtualScrolling) {
                        day--;
                    }
                    if (this.isCurrentDate(new Date(agendaDate.getTime()))) { addClass(dTd.childNodes, cls.AGENDA_CURRENT_DAY_CLASS); }
                    agendaDate = util.addDays(agendaDate, 1);
                    if (agendaDate.getTime() > lastDate.getTime()) { break; }
                }
            }
            endDate = new Date(agendaDate.getTime() - util.MS_PER_DAY);
        } else {
            this.agendaBase.renderEmptyContent(tBody, agendaDate);
            endDate = util.addDays(agendaDate, this.parent.agendaDaysCount - 1);
        }
        this.agendaDates = { start: firstDate, end: endDate };
    }

    // private renderMonthHeader(mTr: Element): Element {
    //     mTr.removeAttribute('aria-rowindex');
    //     for (let td of [].slice.call(mTr.childNodes)) {
    //         td.removeAttribute('aria-colindex');
    //     }
    //     let headerDate: Date = new Date(parseInt(mTr.children[0].getAttribute('data-date'), 10));
    //     let div: Element = createElement('div', {
    //         className: cls.DATE_HEADER_CLASS,
    //         innerHTML: headerDate.toLocaleString(this.parent.locale, { month: 'long' }) + '&nbsp' + headerDate.getFullYear()
    //     });
    //     mTr.lastElementChild.appendChild(div);
    //     return mTr;
    // }

    private agendaScrolling(event: Event): void {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            this.virtualScrolling(event);
        }
    }

    private virtualScrolling(event: Event): void {
        let target: Element = event.target as Element;
        let scrollTop: number = target.scrollTop;
        let scrollHeight: number = target.scrollHeight;
        let offsetHeight: number = target.clientHeight;
        let totalHeight: number = scrollTop + offsetHeight;
        let direction: string = (this.virtualScrollTop < scrollTop) ? 'next' : 'previous';
        let tBody: Element = target.querySelector('tbody');
        let emptyTBody: Element = createElement('tbody');
        let topElement: Element = this.getElementFromScrollerPosition(event, direction);
        let scrollDate: Date = new Date(parseInt(topElement.getAttribute('data-date'), 0));
        let filterDate: { [key: string]: Date }; let filterData: Object[];
        if (scrollTop === 0) {
            filterDate = this.getPreviousNextDate(util.addDays(scrollDate, -1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start);
                tBody.innerHTML = emptyTBody.innerHTML + tBody.innerHTML;
                this.agendaBase.wireEventActions();
                for (let s: number = 0, element: HTMLCollection = tBody.children; s < element.length; s++) {
                    if (element[s].getAttribute('aria-rowindex') === topElement.getAttribute('aria-colindex')) {
                        let scrollToValue: number = (<HTMLElement>element[s]).offsetTop -
                            (<HTMLElement>this.element.querySelector('.e-agenda-item')).offsetHeight;
                        target.scrollTop = scrollToValue;
                        break;
                    }
                }
                this.updateHeaderText(scrollDate);
            }
        } else if (totalHeight === scrollHeight) {
            filterDate = this.getPreviousNextDate(util.addDays(scrollDate, 1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start);
                tBody.innerHTML += emptyTBody.innerHTML;
                this.agendaBase.wireEventActions();
                this.updateHeaderText(scrollDate);
            }
        } else {
            this.updateHeaderText(scrollDate);
        }
        this.virtualScrollTop = scrollTop;
        let selectedElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            (selectedElements[selectedElements.length - 1] as HTMLElement).focus();
        }
    }

    private getElementFromScrollerPosition(event: Event, direction?: string): Element {
        let filterElement: Element;
        let target: Element = event.target as Element;
        let scrollTop: number = target.scrollTop;
        let scrollHeight: number = target.scrollHeight;
        let offsetHeight: number = target.clientHeight;
        let totalHeight: number = scrollTop + offsetHeight;
        let liCollection: HTMLElement[] = [].slice.call(target.querySelectorAll('.e-agenda-item'));
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
                    li = liCollection[a];
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
            this.parent.headerModule.updateDateRange(this.getDateRangeText(date));
        }
    }

    private getPreviousNextDate(date: Date, type: string): { [key: string]: Date } {
        let currentDate: Date = new Date(date.getTime());
        let firstDate: Date = this.getStartDateFromEndDate(date);
        let lastDate: Date = this.getEndDateFromStartDate(date);
        let daysCount: number = 0;
        do {
            let filterData: Object[] = this.appointmentFiltering(currentDate);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) { daysCount++; }
            currentDate = util.addDays(currentDate, (type === 'next') ? 1 : -1);
            if (currentDate < firstDate || currentDate > lastDate) { break; }
        } while (daysCount !== this.parent.agendaDaysCount);
        let endDate: Date = util.addDays(currentDate, (type === 'next') ? -1 : 1);
        return (type === 'next') ? { start: date, end: util.addDays(endDate, 1) } : { start: endDate, end: util.addDays(date, 1) };
    }

    private appointmentFiltering(startDate?: Date, endDate?: Date): Object[] {
        let dateStart: Date; let dateEnd: Date;
        if (!isNullOrUndefined(startDate) && isNullOrUndefined(endDate)) {
            dateStart = util.resetTime(new Date(startDate.getTime()));
            dateEnd = util.setTime(new Date(dateStart.getTime()), util.MS_PER_DAY);
        } else {
            dateStart = new Date(startDate.getTime());
            dateEnd = new Date(endDate.getTime());
        }
        let filterData: Object[] = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        if (filterData.length === 0) {
            this.refreshEvent(startDate);
            filterData = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        }
        return filterData;
    }

    public getStartDateFromEndDate(endDate: Date): Date {
        let filterDate: Date; let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            let firstDate: number = Math.min.apply(Math, this.parent.eventsProcessed.map((a: { [key: string]: Object }) => {
                let date: Date = a[fieldMapping.startTime] as Date;
                return date.getTime();
            }));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(firstDate) : this.minDate;
        } else {
            filterDate = this.parent.hideEmptyAgendaDays ? util.addMonths(endDate, -1) : this.minDate;
        }
        return util.resetTime(filterDate);
    }

    public getEndDateFromStartDate(startDate: Date): Date {
        let filterDate: Date; let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            let lastDate: number = Math.max.apply(Math, this.parent.eventsProcessed.map((a: { [key: string]: Object }) => {
                let date: Date = a[fieldMapping.endTime] as Date;
                return date.getTime();
            }));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(lastDate) : this.maxDate;
        } else {
            filterDate = this.parent.hideEmptyAgendaDays ? util.addMonths(startDate, 1) : this.maxDate;
        }
        return util.resetTime(util.addDays(filterDate, 1));
    }

    public getNextPreviousDate(type: string): Date {
        let noOfDays: number = (type === 'next') ? 1 : -1;
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
        let formatDate: string = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
        if (this.parent.activeViewOptions.allowVirtualScrolling || this.parent.isAdaptive) {
            let currentDate: Date = isNullOrUndefined(date) ? this.parent.selectedDate : date;
            return this.parent.globalize.formatDate(currentDate, { format: formatDate });
        } else {
            let startDate: Date = this.parent.selectedDate;
            let endDate: Date = util.addDays(startDate, this.parent.agendaDaysCount - 1);
            return this.formatDateRange(startDate, endDate);
        }
    }

    public dayNavigationClick(e: Event): void {
        let date: Date = this.parent.getDateFromElement
            (closest((<Element>e.currentTarget), '.' + cls.AGENDA_CELLS_CLASS) as HTMLTableCellElement);
        if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
            this.parent.setProperties({ selectedDate: date }, true);
            this.parent.changeView('Day');
        }
    }

    // private isMonthFirstDate(date: Date): boolean {
    //     return date.getDate() === 1;
    // }

    private wireEvents(): void {
        EventHandler.add(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), event.scroll, this.agendaScrolling, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), event.scroll, this.agendaScrolling);
        let dateHeaderElement: Element[] = [].slice.call(this.element.querySelectorAll('.e-m-date'));
        for (let element of dateHeaderElement) {
            EventHandler.remove(element, 'click', this.dayNavigationClick);
        }
    }

    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.onAgendaScrollUiUpdate, this);
        this.parent.on(event.dataReady, this.eventLoad, this);
    }

    public removeEventListener(): void {
        this.parent.off(event.scrollUiUpdate, this.onAgendaScrollUiUpdate);
        this.parent.off(event.dataReady, this.eventLoad);
    }

    private onAgendaScrollUiUpdate(): void {
        let headerHeight: number = this.getHeaderBarHeight();
        if (this.parent.headerModule) {
            if (this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('add');
            } else {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
        let contentArea: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        contentArea.style.height = formatUnit(this.parent.element.offsetHeight - headerHeight);
    }
    /**
     * To destroy the agenda. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.element) {
            this.unWireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.headerModule && this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
    }
}
