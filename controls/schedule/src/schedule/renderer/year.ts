/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventHandler, formatUnit, remove, createElement, addClass, closest, prepend } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { ViewBase } from './view-base';
import { IRenderer, EventClickArgs, TdData, NotifyEventArgs } from '../base/interface';
import { YearEvent } from '../event-renderer/year';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * year view
 */
export class Year extends ViewBase implements IRenderer {
    public viewClass: string = 'e-year-view';
    public isInverseTableSelect: boolean = false;
    public colLevels: TdData[][];
    public rowCount: number;
    public columnCount: number;

    constructor(parent: Schedule) {
        super(parent);
    }

    protected getModuleName(): string {
        return 'year';
    }

    public renderLayout(className: string): void {
        if (this.parent.resourceBase) {
            this.parent.resourceBase.generateResourceLevels([(<TdData>{ renderDates: this.parent.activeView.renderDates })]);
        }
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        const viewTypeClass: string = this.parent.activeViewOptions.orientation === 'Horizontal' ? 'e-horizontal' : 'e-vertical';
        addClass([this.element], [this.viewClass, viewTypeClass, className]);
        this.renderPanel(className);
        const calendarTable: HTMLElement = this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement;
        this.element.appendChild(calendarTable);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        const calendarTBody: HTMLElement = calendarTable.querySelector('tbody');
        this.rowCount = this.getRowColumnCount('row');
        this.columnCount = this.getRowColumnCount('column');
        this.renderHeader(calendarTBody);
        this.renderContent(calendarTBody);
        if (this.parent.currentView !== 'Year' && this.parent.uiStateValues.isGroupAdaptive) {
            this.generateColumnLevels();
            this.renderResourceMobileLayout();
        }
        this.wireEvents(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll');
        this.parent.notify(event.contentReady, {});
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public renderHeader(headerWrapper: HTMLElement): void { /** */ }

    public renderContent(content: HTMLElement): void {
        const tr: HTMLElement = createElement('tr');
        content.appendChild(tr);
        const td: HTMLElement = createElement('td');
        tr.appendChild(td);
        this.element.querySelector('tbody').appendChild(tr);
        const contentWrapper: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        td.appendChild(contentWrapper);
        const calendarTable: HTMLElement = this.createTableLayout('e-calendar-table') as HTMLElement;
        contentWrapper.appendChild(calendarTable);
        const cTr: HTMLElement = createElement('tr');
        calendarTable.querySelector('tbody').appendChild(cTr);
        const cTd: HTMLElement = createElement('td');
        cTr.appendChild(cTd);
        const calendarWrapper: HTMLElement = createElement('div', { className: 'e-calendar-wrapper' });
        cTd.appendChild(calendarWrapper);
        const months: number[] = this.getMonths();
        for (const month of months) {
            const currentMonth: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            const calendarElement: HTMLElement = createElement('div', {
                className: 'e-month-calendar e-calendar',
                attrs: { 'data-role': 'calendar' }
            });
            calendarElement.appendChild(this.renderCalendarHeader(currentMonth));
            calendarElement.appendChild(this.renderCalendarContent(currentMonth));
            calendarWrapper.appendChild(calendarElement);
        }
    }

    public renderCalendarHeader(currentDate: Date): HTMLElement {
        const headerWrapper: HTMLElement = createElement('div', { className: 'e-header e-month' });
        const headerContent: HTMLElement = createElement('div', { className: 'e-day e-title', innerHTML: this.getMonthName(currentDate) });
        headerWrapper.appendChild(headerContent);
        this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: headerContent, date: currentDate });
        return headerWrapper;
    }

    public renderCalendarContent(currentDate: Date): HTMLElement {
        const dateCollection: Date[] = this.getMonthDates(currentDate);
        const contentWrapper: HTMLElement = createElement('div', { className: 'e-content e-month' });
        const contentTable: HTMLElement = this.createTableLayout('e-calendar-table ' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        contentWrapper.appendChild(contentTable);
        const thead: HTMLElement = createElement('thead', { className: 'e-week-header' });
        const tr: HTMLElement = createElement('tr');
        let currentWeek: Date = util.getWeekFirstDate(util.firstDateOfMonth(currentDate), this.parent.firstDayOfWeek);
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('th'));
        }
        for (let i: number = 0; i < util.WEEK_LENGTH; i++) {
            tr.appendChild(createElement('th', { innerHTML: this.parent.getDayNames('narrow')[currentWeek.getDay()] }));
            currentWeek = new Date(currentWeek.getTime() + util.MS_PER_DAY);
        }
        thead.appendChild(tr);
        prepend([thead], contentTable);
        const tbody: HTMLTableSectionElement = contentTable.querySelector('tbody');
        while (dateCollection.length > 0) {
            const weekDates: Date[] = dateCollection.splice(0, util.WEEK_LENGTH);
            const tr: HTMLElement = createElement('tr', { attrs: { 'role': 'row' } });
            if (this.parent.activeViewOptions.showWeekNumber) {
                const weekNumber: number = this.parent.getWeekNumberContent(weekDates);
                const td: HTMLElement = createElement('td', {
                    className: 'e-week-number',
                    attrs: { 'role': 'gridcell', 'title': 'Week ' + weekNumber },
                    innerHTML: weekNumber.toString()
                });
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'weekNumberCells', element: td });
            }
            for (const date of weekDates) {
                const td: HTMLElement = createElement('td', {
                    className: 'e-cell ' + cls.WORK_CELLS_CLASS,
                    attrs: { 'role': 'gridcell', 'aria-selected': 'false', 'data-date': date.getTime().toString() }
                });
                const span: HTMLElement = createElement('span', {
                    className: 'e-day', innerHTML: date.getDate().toString(),
                    attrs: { title: this.parent.globalize.formatDate(date, { type: 'date', skeleton: 'full' }) }
                });
                td.appendChild(span);
                let classList: string[] = [];
                if (currentDate.getMonth() !== date.getMonth()) {
                    classList.push(cls.OTHERMONTH_CLASS);
                }
                if (this.isCurrentDate(date) && currentDate.getMonth() === date.getMonth()) {
                    classList = classList.concat(['e-today', 'e-selected']);
                }
                if (classList.length > 0) {
                    addClass([td], classList);
                }
                tr.appendChild(td);
                this.wireEvents(td, 'cell');
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
            }
            tbody.appendChild(tr);
        }
        return contentWrapper;
    }

    public createTableColGroup(count: number): HTMLElement {
        const colGroupEle: HTMLElement = createElement('colgroup');
        for (let i: number = 0; i < count; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        return colGroupEle;
    }

    public getMonthName(date: Date): string {
        const month: string = this.parent.globalize.formatDate(date, {
            format: this.parent.activeViewOptions.dateFormat || 'MMMM',
            calendar: this.parent.getCalendarMode()
        });
        return util.capitalizeFirstWord(month, 'multiple');
    }

    public generateColumnLevels(): TdData[][] {
        let colLevels: TdData[][] = [];
        const level: TdData[] = this.getDateSlots([this.parent.selectedDate], this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive) {
                const resourceLevel: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots([this.parent.selectedDate], resourceLevel.workDays)];
            }
        } else {
            colLevels.push(level);
        }
        colLevels.pop();
        this.colLevels = colLevels;
        return colLevels;
    }

    // eslint-disable-next-line max-len
    public getDateSlots(renderDates: Date[], workDays: number[], startHour: string = this.parent.workHours.start, endHour: string = this.parent.workHours.end): TdData[] {
        const dateCol: TdData[] = [{
            date: renderDates[0], type: 'dateHeader', className: [cls.HEADER_CELLS_CLASS], colSpan: 1, workDays: workDays,
            startHour: new Date(+this.parent.globalize.parseDate(startHour, { skeleton: 'Hm' })),
            endHour: new Date(+this.parent.globalize.parseDate(endHour, { skeleton: 'Hm' }))
        }];
        return dateCol;
    }

    public getMonthDates(date: Date): Date[] {
        const startDate: Date = util.getWeekFirstDate(util.firstDateOfMonth(date), this.parent.firstDayOfWeek);
        const endDate: Date = util.addDays(new Date(+startDate), (6 * util.WEEK_LENGTH));
        const dateCollection: Date[] = [];
        for (let start: Date = startDate; start.getTime() < endDate.getTime(); start = util.addDays(start, 1)) {
            dateCollection.push(util.resetTime(new Date(start)));
        }
        return dateCollection;
    }

    public getRowColumnCount(type: string): number {
        const monthCount: number = 12;
        const year: number = this.parent.selectedDate.getFullYear();
        const months: number[] = [];
        for (let month: number = 0; month < monthCount; month++) {
            months.push(new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate());
        }
        const maxCount: number = Math.max(...months);
        let count: number;
        if (type === 'row') {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? monthCount : maxCount;
        } else {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? maxCount : monthCount;
        }
        return count;
    }

    public isCurrentDate(date: Date): boolean {
        return util.resetTime(new Date()).getTime() === util.resetTime(new Date(date.getTime())).getTime();
    }

    public getMonths(): number[] {
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, { length: 12 }).map((value: number, index: number) => this.parent.firstMonthOfYear + index);
    }

    private onCellClick(e: Event): void {
        const target: Element = closest((e.target as Element), '.' + cls.WORK_CELLS_CLASS);
        const startDate: Date = this.parent.getDateFromElement(target);
        const endDate: Date = util.addDays(new Date(startDate.getTime()), 1);
        const filteredEvents: Record<string, any>[] = this.parent.eventBase.filterEvents(startDate, endDate);
        const moreEventArgs: EventClickArgs = { date: startDate, event: filteredEvents, element: e.target } as EventClickArgs;
        this.parent.quickPopup.moreEventClick(moreEventArgs, new Date());
    }

    public onContentScroll(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        const headerWrapper: HTMLElement = this.getDatesHeaderElement();
        if (headerWrapper) {
            (<HTMLElement>headerWrapper.firstElementChild).scrollLeft = target.scrollLeft;
        }
        const scrollTopSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        const scrollTopElement: HTMLElement = this.element.querySelector(scrollTopSelector) as HTMLElement;
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
        this.setPersistence();
    }

    public onScrollUiUpdate(args: NotifyEventArgs): void {
        let height: number = this.parent.element.offsetHeight - this.getHeaderBarHeight();
        const headerWrapper: HTMLElement = this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS) as HTMLElement;
        if (headerWrapper) {
            height -= headerWrapper.offsetHeight;
        }
        const contentWrapper: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (contentWrapper) {
            contentWrapper.style.height = formatUnit(height);
        }
        const leftPanelSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        const leftPanelElement: HTMLElement = this.element.querySelector(leftPanelSelector) as HTMLElement;
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(contentWrapper));
        }
        if (!this.parent.isAdaptive && headerWrapper) {
            const scrollBarWidth: number = util.getScrollBarWidth();
            if (contentWrapper.offsetWidth - contentWrapper.clientWidth > 0) {
                (headerWrapper.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
                headerWrapper.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
            } else {
                (headerWrapper.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = '';
                headerWrapper.style[<any>args.cssProperties.padding] = '';
            }
        }
        this.setColWidth(this.getContentAreaElement());
        this.retainScrollPosition();
    }

    private getStartDate(): Date {
        return new Date(this.parent.selectedDate.getFullYear(), this.parent.firstMonthOfYear % 12, 1);
    }

    private getEndDate(): Date {
        return util.addDays(util.addMonths(this.getStartDate(), 12), -1);
    }

    public startDate(): Date {
        return util.getWeekFirstDate(this.getStartDate(), this.parent.firstDayOfWeek);
    }

    public endDate(): Date {
        return util.addDays(util.getWeekLastDate(this.getEndDate(), this.parent.firstDayOfWeek), 1);
    }

    public getEndDateFromStartDate(start: Date): Date {
        let date: Date = new Date(start.getTime());
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            date = util.lastDateOfMonth(date);
        }
        return util.addDays(new Date(date.getTime()), 1);
    }

    public getNextPreviousDate(type: string): Date {
        return util.addYears(this.parent.selectedDate, ((type === 'next') ? 1 : -1));
    }

    public getDateRangeText(): string {
        const startDate: Date = this.getStartDate();
        const endDate: Date = this.getEndDate();
        if (startDate.getFullYear() !== endDate.getFullYear()) {
            return this.parent.globalize.formatDate(startDate, { skeleton: 'yMMM' }) + ' - ' + this.parent.globalize.formatDate(endDate, { skeleton: 'yMMM' });
        } else {
            return this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'y' });
        }
    }

    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.onScrollUiUpdate, this);
        this.parent.on(event.dataReady, this.onDataReady, this);
    }

    public removeEventListener(): void {
        this.parent.off(event.scrollUiUpdate, this.onScrollUiUpdate);
        this.parent.off(event.dataReady, this.onDataReady);
    }

    public onDataReady(args: NotifyEventArgs): void {
        const yearEventModule: YearEvent = new YearEvent(this.parent);
        yearEventModule.renderAppointments();
        this.parent.notify('events-loaded', args);
    }

    public wireEvents(element: HTMLElement, type: string): void {
        if (type === 'cell') {
            if (this.parent.currentView !== 'TimelineYear') {
                EventHandler.add(element, 'click', this.onCellClick, this);
            } else {
                EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
                if (!this.parent.isAdaptive) {
                    EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
                }
            }
        } else {
            EventHandler.add(element, 'scroll', this.onContentScroll, this);
        }
    }

    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
        }
    }

}
