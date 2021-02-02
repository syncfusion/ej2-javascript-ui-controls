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

    /**
     * Constructor for year view
     */
    constructor(parent: Schedule) {
        super(parent);
    }

    public renderLayout(className: string): void {
        if (this.parent.resourceBase) {
            this.parent.resourceBase.generateResourceLevels([(<TdData>{ renderDates: this.parent.activeView.renderDates })]);
        }
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        let viewTypeClass: string = this.parent.activeViewOptions.orientation === 'Horizontal' ? 'e-horizontal' : 'e-vertical';
        addClass([this.element], [this.viewClass, viewTypeClass, className]);
        this.renderPanel(className);
        let calendarTable: HTMLElement = this.createTableLayout(cls.OUTER_TABLE_CLASS) as HTMLElement;
        this.element.appendChild(calendarTable);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        let calendarTBody: HTMLElement = calendarTable.querySelector('tbody');
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

    // tslint:disable-next-line:no-empty
    public renderHeader(headerWrapper: HTMLElement): void {

    }

    public renderContent(content: HTMLElement): void {
        let tr: HTMLElement = createElement('tr');
        content.appendChild(tr);
        let td: HTMLElement = createElement('td');
        tr.appendChild(td);
        this.element.querySelector('tbody').appendChild(tr);
        let contentWrapper: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        td.appendChild(contentWrapper);
        let calendarTable: HTMLElement = this.createTableLayout('e-calendar-table') as HTMLElement;
        contentWrapper.appendChild(calendarTable);
        let cTr: HTMLElement = createElement('tr');
        calendarTable.querySelector('tbody').appendChild(cTr);
        let cTd: HTMLElement = createElement('td');
        cTr.appendChild(cTd);
        let calendarWrapper: HTMLElement = createElement('div', { className: 'e-calendar-wrapper' });
        cTd.appendChild(calendarWrapper);
        let monthCollection: number[] = Array.apply(null, { length: 12 }).map((value: number, index: number) => index);
        for (let month of monthCollection) {
            let currentMonth: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            let calendarElement: HTMLElement = createElement('div', {
                className: 'e-month-calendar e-calendar',
                attrs: { 'data-role': 'calendar' }
            });
            calendarElement.appendChild(this.renderCalendarHeader(currentMonth));
            calendarElement.appendChild(this.renderCalendarContent(currentMonth));
            calendarWrapper.appendChild(calendarElement);
        }
    }

    public renderCalendarHeader(currentDate: Date): HTMLElement {
        let headerWrapper: HTMLElement = createElement('div', { className: 'e-header e-month' });
        let headerContent: HTMLElement = createElement('div', { className: 'e-day e-title', innerHTML: this.getMonthName(currentDate) });
        headerWrapper.appendChild(headerContent);
        this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: headerContent, date: currentDate });
        return headerWrapper;
    }

    public renderCalendarContent(currentDate: Date): HTMLElement {
        let dateCollection: Date[] = this.getMonthDates(currentDate);
        let contentWrapper: HTMLElement = createElement('div', { className: 'e-content e-month' });
        let contentTable: HTMLElement = this.createTableLayout('e-calendar-table ' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        contentWrapper.appendChild(contentTable);
        let thead: HTMLElement = createElement('thead', { className: 'e-week-header' });
        let tr: HTMLElement = createElement('tr');
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
        let tbody: HTMLTableSectionElement = contentTable.querySelector('tbody');
        while (dateCollection.length > 0) {
            let weekDates: Date[] = dateCollection.splice(0, util.WEEK_LENGTH);
            let tr: HTMLElement = createElement('tr', { attrs: { 'role': 'row' } });
            if (this.parent.activeViewOptions.showWeekNumber) {
                let weekNumber: number = this.getWeekNumberContent(weekDates);
                let td: HTMLElement = createElement('td', {
                    className: 'e-week-number',
                    attrs: { 'role': 'gridcell', 'title': 'Week ' + weekNumber },
                    innerHTML: weekNumber.toString()
                });
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'weekNumberCells', element: td });
            }
            for (let date of weekDates) {
                let td: HTMLElement = createElement('td', {
                    className: 'e-cell ' + cls.WORK_CELLS_CLASS,
                    attrs: { 'role': 'gridcell', 'aria-selected': 'false', 'data-date': date.getTime().toString() }
                });
                td.appendChild(createElement('span', { className: 'e-day', innerHTML: date.getDate().toString() }));
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
        let colGroupEle: HTMLElement = createElement('colgroup');
        for (let i: number = 0; i < count; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        return colGroupEle;
    }

    public getMonthName(date: Date): string {
        let month: string = this.parent.globalize.formatDate(date, {
            format: this.parent.activeViewOptions.dateFormat || 'MMMM',
            calendar: this.parent.getCalendarMode()
        });
        return util.capitalizeFirstWord(month, 'multiple');
    }

    public generateColumnLevels(): TdData[][] {
        let colLevels: TdData[][] = [];
        let level: TdData[] = this.getDateSlots([this.parent.selectedDate], this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive) {
                let resourceLevel: TdData = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots([this.parent.selectedDate], resourceLevel.workDays)];
            }
        } else {
            colLevels.push(level);
        }
        colLevels.pop();
        this.colLevels = colLevels;
        return colLevels;
    }

    public getDateSlots(renderDates: Date[], workDays: number[], startHour: string = this.parent.workHours.start, endHour: string =
        this.parent.workHours.end): TdData[] {
        let dateCol: TdData[] = [{
            date: renderDates[0], type: 'dateHeader', className: [cls.HEADER_CELLS_CLASS], colSpan: 1, workDays: workDays,
            startHour: new Date(+this.parent.globalize.parseDate(startHour, { skeleton: 'Hm' })),
            endHour: new Date(+this.parent.globalize.parseDate(endHour, { skeleton: 'Hm' }))
        }];
        return dateCol;
    }

    public getMonthDates(date: Date): Date[] {
        let startDate: Date = util.getWeekFirstDate(util.firstDateOfMonth(date), this.parent.firstDayOfWeek);
        let endDate: Date = util.addDays(new Date(+startDate), (6 * util.WEEK_LENGTH));
        let dateCollection: Date[] = [];
        for (let start: Date = startDate; start.getTime() < endDate.getTime(); start = util.addDays(start, 1)) {
            dateCollection.push(util.resetTime(new Date(start)));
        }
        return dateCollection;
    }

    public getRowColumnCount(type: string): number {
        let monthCount: number = 12;
        let year: number = this.parent.selectedDate.getFullYear();
        let months: number[] = [];
        for (let month: number = 0; month < monthCount; month++) {
            months.push(new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate());
        }
        let maxCount: number = Math.max.apply(Math, months);
        let count: number;
        if (type === 'row') {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? monthCount : maxCount;
            if (!this.parent.activeViewOptions.timeScale.enable && this.parent.activeViewOptions.orientation === 'Vertical') {
                count = 1;
            }
        } else {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? maxCount : monthCount;
        }
        return count;
    }

    public isCurrentDate(date: Date): boolean {
        return util.resetTime(new Date()).getTime() === util.resetTime(new Date(date.getTime())).getTime();
    }

    private onCellClick(e: Event): void {
        let target: Element = closest((e.target as Element), '.' + cls.WORK_CELLS_CLASS);
        let startDate: Date = this.parent.getDateFromElement(target);
        let endDate: Date = util.addDays(new Date(startDate.getTime()), 1);
        let filteredEvents: Object[] = this.parent.eventBase.filterEvents(startDate, endDate);
        let moreEventArgs: EventClickArgs = { date: startDate, event: filteredEvents, element: e.target } as EventClickArgs;
        this.parent.quickPopup.moreEventClick(moreEventArgs, new Date());
    }

    public onContentScroll(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
        let headerWrapper: HTMLElement = this.getDatesHeaderElement();
        if (headerWrapper) {
            (<HTMLElement>headerWrapper.firstElementChild).scrollLeft = target.scrollLeft;
        }
        let scrollTopSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        let scrollTopElement: HTMLElement = this.element.querySelector(scrollTopSelector) as HTMLElement;
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
        this.setPersistence();
    }

    public onScrollUiUpdate(args: NotifyEventArgs): void {
        let height: number = this.parent.element.offsetHeight - this.getHeaderBarHeight();
        let headerWrapper: HTMLElement = this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS) as HTMLElement;
        if (headerWrapper) {
            height -= headerWrapper.offsetHeight;
        }
        let contentWrapper: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (contentWrapper) {
            contentWrapper.style.height = formatUnit(height);
        }
        let leftPanelSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        let leftPanelElement: HTMLElement = this.element.querySelector(leftPanelSelector) as HTMLElement;
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(contentWrapper));
        }
        if (!this.parent.isAdaptive && headerWrapper) {
            let scrollBarWidth: number = util.getScrollBarWidth();
            // tslint:disable:no-any
            if (contentWrapper.offsetWidth - contentWrapper.clientWidth > 0) {
                (headerWrapper.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
                headerWrapper.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
            } else {
                (headerWrapper.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = '';
                headerWrapper.style[<any>args.cssProperties.padding] = '';
            }
            // tslint:enable:no-any
        }
        this.setColWidth(this.getContentAreaElement());
        this.retainScrollPosition();
    }

    public startDate(): Date {
        let startDate: Date = new Date(this.parent.selectedDate.getFullYear(), 0, 1);
        return util.getWeekFirstDate(startDate, this.parent.firstDayOfWeek);
    }

    public endDate(): Date {
        let endDate: Date = new Date(this.parent.selectedDate.getFullYear(), 11, 31);
        return util.addDays(util.getWeekLastDate(endDate, this.parent.firstDayOfWeek), 1);
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
        return this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'y' });
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
        let yearEventModule: YearEvent = new YearEvent(this.parent);
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

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'year';
    }

    /**
     * To destroy the year. 
     * @return {void}
     * @private
     */
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
