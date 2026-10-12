/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventHandler, formatUnit, createElement, addClass, closest, prepend, append, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { ViewBase } from './view-base';
import { IRenderer, EventClickArgs, TdData, NotifyEventArgs, CellTemplateArgs, CallbackFunction, CellClickEventArgs } from '../base/interface';
import { YearEvent } from '../event-renderer/year';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import { NavigationDirection } from '../base/type';

/**
 * year view
 */
export class Year extends ViewBase implements IRenderer {
    public viewClass: string = 'e-year-view';
    public isInverseTableSelect: boolean = false;
    public colLevels: TdData[][];
    public rowCount: number;
    public columnCount: number;
    private yearEventModule: YearEvent = null;

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
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            addClass([this.element], [cls.VIRTUAL_SCROLL_CLASS]);
        }
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
        EventHandler.add(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll', this.onContentScroll, this);
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
        this.renderDates.splice(0, 1);
    }
    public renderCalendarHeader(currentDate: Date): HTMLElement {
        const headerWrapper: HTMLElement = createElement('div', { className: 'e-header e-month' });
        const headerContent: HTMLElement = createElement('div', { className: 'e-day e-title' });
        if (this.parent.activeViewOptions.monthHeaderTemplate) {
            const args: CellTemplateArgs = { date: currentDate, type: 'monthHeader' };
            this.renderTemplates(this.parent.getMonthHeaderTemplate(), args, 'monthHeaderTemplate',
                                 this.parent.activeViewOptions.monthHeaderTemplateName, headerContent);
        }
        else {
            headerContent.innerHTML = this.getMonthName(currentDate);
        }
        headerWrapper.appendChild(headerContent);
        this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: headerContent, date: currentDate });
        return headerWrapper;
    }

    public renderCalendarContent(currentDate: Date): HTMLElement {
        const dateCollection: Date[] = this.getMonthDates(currentDate);
        const contentWrapper: HTMLElement = createElement('div', { className: 'e-content e-month' });
        const contentTable: HTMLElement = this.createTableLayout('e-calendar-table ' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        contentWrapper.appendChild(contentTable);
        this.setAriaAttributes(contentTable);
        const thead: HTMLElement = createElement('thead', { className: 'e-week-header' });
        const tr: HTMLElement = createElement('tr');
        let currentWeek: Date = util.getWeekFirstDate(util.firstDateOfMonth(currentDate), this.parent.activeViewOptions.firstDayOfWeek);
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('th'));
        }
        for (let i: number = 0; i < util.WEEK_LENGTH; i++) {
            if (this.parent.activeViewOptions.dayHeaderTemplate) {
                const th: HTMLElement = createElement('th');
                const args: CellTemplateArgs = { date: currentWeek, type: 'dayHeader' };
                this.renderTemplates(this.parent.getDayHeaderTemplate(), args, 'dayHeaderTemplate',
                                     this.parent.activeViewOptions.dayHeaderTemplateName, th);
                tr.appendChild(th);
            }
            else {
                tr.appendChild(createElement('th', { innerHTML: this.parent.getDayNames('narrow')[currentWeek.getDay()] }));
            }
            const nextDay: Date = new Date(currentWeek.getTime() + util.MS_PER_DAY);
            currentWeek = nextDay.getDate() === currentWeek.getDate() ? util.addDays(nextDay, 1) : nextDay;
        }
        thead.appendChild(tr);
        prepend([thead], contentTable);
        const tbody: HTMLTableSectionElement = contentTable.querySelector('tbody');
        while (dateCollection.length > 0) {
            const weekDates: Date[] = dateCollection.splice(0, util.WEEK_LENGTH);
            const tr: HTMLElement = createElement('tr');
            if (this.parent.activeViewOptions.showWeekNumber) {
                const weekNumber: string = this.parent.getWeekNumberContent(weekDates);
                const td: HTMLElement = createElement('td', {
                    className: 'e-week-number',
                    attrs: { 'title': this.parent.localeObj.getConstant('week') + ' ' + weekNumber },
                    innerHTML: weekNumber
                });
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'weekNumberCells', element: td });
            }
            for (const date of weekDates) {
                const td: HTMLElement = createElement('td', {
                    className: 'e-cell ' + cls.WORK_CELLS_CLASS,
                    attrs: { 'data-date': date.getTime().toString() }
                });
                if (this.parent.activeViewOptions.cellHeaderTemplate) {
                    const args: CellTemplateArgs = { date: date, type: 'monthCells' };
                    this.renderTemplates(this.parent.getCellHeaderTemplate(), args, 'cellHeaderTemplate',
                                         this.parent.activeViewOptions.cellHeaderTemplateName, td);
                }
                else {
                    const span: HTMLElement = createElement('span', {
                        className: 'e-day', innerHTML: this.parent.globalize.formatDate(date, { skeleton: 'd', calendar: this.parent.getCalendarMode() }),
                        attrs: { title: this.parent.globalize.formatDate(date, { type: 'date', skeleton: 'full' }) }
                    });
                    td.appendChild(span);
                }
                if (this.parent.activeViewOptions.cellTemplate) {
                    const args: CellTemplateArgs = { date: date, type: 'monthCells' };
                    this.renderTemplates(this.parent.getCellTemplate(), args, 'cellTemplate',
                                         this.parent.activeViewOptions.cellTemplateName, td);
                }

                let classList: string[] = [];
                if (currentDate.getMonth() !== date.getMonth()) {
                    classList.push(cls.OTHERMONTH_CLASS);
                    if (td.firstElementChild && !this.parent.activeViewOptions.cellTemplate) {
                        td.firstElementChild.setAttribute('aria-disabled', 'true');
                    }
                }
                if (this.isCurrentDate(date) && currentDate.getMonth() === date.getMonth()) {
                    classList = classList.concat(['e-today', 'e-selected']);
                }
                if (classList.length > 0) {
                    addClass([td], classList);
                }
                tr.appendChild(td);
                if (currentDate.getMonth() === date.getMonth()) {
                    this.renderDates.push(new Date(date));
                }
                if (!this.parent.isMinMaxDate(date)) {
                    addClass([td], cls.DISABLE_DATES);
                }
                else {
                    EventHandler.add(td, 'click', this.onCellClick, this);
                    if (!this.parent.isAdaptive) {
                        EventHandler.add(td, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
                    }
                }
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
            format: this.parent.activeViewOptions.dateFormat || 'MMMM y',
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
        const startDate: Date = util.getWeekFirstDate(util.firstDateOfMonth(date), this.parent.activeViewOptions.firstDayOfWeek);
        const endDate: Date = util.addDays(new Date(+startDate), (6 * util.WEEK_LENGTH));
        const dateCollection: Date[] = [];
        for (let start: Date = startDate; start.getTime() < endDate.getTime(); start = util.addDays(start, 1)) {
            dateCollection.push(util.resetTime(new Date(start)));
        }
        return dateCollection;
    }

    public getRowColumnCount(type: string): number {
        const months: number[] = this.getMonths();
        const year: number = this.parent.selectedDate.getFullYear();
        const monthDaysCount: number[] = [];
        for (const month of months) {
            monthDaysCount.push(new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate());
        }
        const maxCount: number = Math.max(...monthDaysCount);
        let count: number;
        if (type === 'row') {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? months.length : maxCount;
        } else {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? maxCount : months.length;
        }
        return count;
    }

    public isCurrentDate(date: Date): boolean {
        return util.resetTime(new Date()).getTime() === util.resetTime(new Date(date.getTime())).getTime();
    }

    public getMonths(): number[] {
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, { length: this.parent.activeViewOptions.monthsCount }).map((value: number, index: number) =>
            this.parent.firstMonthOfYear + index);
    }

    private renderTemplates(fn: CallbackFunction, args: CellTemplateArgs, tName: string, vName: string, ele: HTMLElement): void {
        const templateId: string = this.parent.element.id + '_' + vName + tName;
        const template: HTMLElement[] =
            [].slice.call(fn(args, this.parent, tName, templateId, false, undefined, undefined, this.parent.root));
        append(template, ele);
    }

    private onCellClick(e: Event): void {
        let target: Element = closest((e.target as Element), '.' + cls.WORK_CELLS_CLASS);
        const startDate: Date = this.parent.getDateFromElement(target);
        this.parent.activeCellsData = this.parent.getCellDetails(target);
        const isPrevious: boolean = startDate.getTime() < this.getStartDate().getTime();
        if (isPrevious || startDate.getTime() > this.getEndDate().getTime()) {
            this.parent.changeDate(this.parent.activeView.getNextPreviousDate(isPrevious ? 'Previous' : 'Next'), e);
            const activeDate: number = this.parent.activeCellsData.startTime.getTime();
            const inRange: boolean = activeDate >= this.getStartDate().getTime() && activeDate <= this.getEndDate().getTime();
            const dateAttr: number = inRange ? activeDate : (isPrevious ? this.getEndDate() : this.getStartDate()).getTime();
            const selectedCell: HTMLTableCellElement = this.parent.element.querySelector(':not(.' + cls.OTHERMONTH_CLASS + ')[data-date="' + dateAttr + '"]');
            this.parent.selectCell(selectedCell);
            this.parent.activeCellsData = this.parent.getCellDetails(selectedCell);
        } else {
            const endDate: Date = util.addDays(new Date(startDate.getTime()), 1);
            const filteredEvents: Record<string, any>[] = this.parent.eventBase.filterEvents(startDate, endDate);
            const moreEventArgs: EventClickArgs = { date: startDate, event: filteredEvents, element: e.target } as EventClickArgs;
            if (target.classList.contains(cls.OTHERMONTH_CLASS)) {
                target = this.parent.element.querySelector(':not(.' + cls.OTHERMONTH_CLASS + ')[data-date="' + target.getAttribute('data-date') + '"]') as HTMLTableCellElement;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            const args: CellClickEventArgs =
                <CellClickEventArgs>extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.trigger(event.cellClick, args);
            this.parent.quickPopup.moreEventClick(moreEventArgs, endDate);
        }
    }

    public onContentScroll(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        const headerWrapper: HTMLElement = this.getDatesHeaderElement();
        this.parent.notify(event.virtualScroll, e);
        if (headerWrapper) {
            (<HTMLElement>headerWrapper.firstElementChild).scrollLeft = target.scrollLeft;
        }
        const scrollTopSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        const scrollTopElement: HTMLElement = this.element.querySelector(scrollTopSelector) as HTMLElement;
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = (e.target as HTMLElement).scrollTop;
        }
        this.parent.uiStateValues.left = (e.target as HTMLElement).scrollLeft;
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
        const leftPanelSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        const leftPanelElement: HTMLElement = this.element.querySelector(leftPanelSelector) as HTMLElement;
        if (leftPanelElement) {
            const isYScroll: boolean = contentWrapper.scrollWidth > contentWrapper.clientWidth;
            leftPanelElement.style.height = formatUnit(height - (isYScroll ? 17 : 0));
        }
        if (!args.isPreventScrollUpdate) {
            if (this.parent.uiStateValues.isInitial) {
                this.parent.uiStateValues.isInitial = false;
                this.parent.uiStateValues.top = this.parent.uiStateValues.left = 0;
            } else {
                if (leftPanelElement) {
                    leftPanelElement.scrollTop = this.parent.uiStateValues.top;
                }
                contentWrapper.scrollTop = this.parent.uiStateValues.top;
                contentWrapper.scrollLeft = this.parent.uiStateValues.left;
            }
        }
        this.retainScrollPosition();
    }

    public getStartDate(): Date {
        return new Date(this.parent.selectedDate.getFullYear(), this.parent.firstMonthOfYear % 12, 1);
    }

    public getEndDate(): Date {
        return util.addDays(util.addMonths(this.getStartDate(), this.parent.monthsCount), -1);
    }

    public startDate(): Date {
        return this.parent.currentView === 'Year' ? util.getWeekFirstDate(this.getStartDate(), this.parent.activeViewOptions.firstDayOfWeek) : this.getStartDate();
    }

    public endDate(): Date {
        return this.parent.currentView === 'Year' ? util.addDays(util.getWeekLastDate(this.getEndDate(), this.parent.activeViewOptions.firstDayOfWeek), 1) :
            util.addDays(this.getEndDate(), 1);
    }

    public getEndDateFromStartDate(start: Date): Date {
        let date: Date = new Date(start.getTime());
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            date = util.lastDateOfMonth(date);
        }
        return util.addDays(new Date(date.getTime()), 1);
    }

    public getNextPreviousDate(type: NavigationDirection): Date {
        return util.addYears(this.parent.selectedDate, ((type === 'Next') ? 1 : -1));
    }

    public getDateRangeText(date: Date = this.parent.selectedDate, dateCollection: Date[] = null): string {
        const isDateColAvail: boolean = !isNullOrUndefined(dateCollection) && dateCollection.length > 0;
        const startDate: Date = isDateColAvail ? dateCollection[0] : this.getStartDate();
        const endDate: Date = isDateColAvail ? dateCollection[dateCollection.length - 1] : this.getEndDate();
        if (startDate.getFullYear() !== endDate.getFullYear()) {
            return this.parent.globalize.formatDate(startDate, { format: 'MMM y', calendar: this.parent.getCalendarMode() })
                + ' - ' + this.parent.globalize.formatDate(endDate, { format: 'MMM y', calendar: this.parent.getCalendarMode() });
        }
        else {
            return this.parent.globalize.formatDate(isDateColAvail ? dateCollection[0] : date, { skeleton: 'y', calendar: this.parent.getCalendarMode() });
        }
    }

    public addEventListener(): void {
        this.parent.on(event.scrollUiUpdate, this.onScrollUiUpdate, this);
        this.parent.on(event.dataReady, this.onDataReady, this);
    }

    public removeEventListener(): void {
        if (this.parent) {
            this.parent.off(event.scrollUiUpdate, this.onScrollUiUpdate);
            this.parent.off(event.dataReady, this.onDataReady);
        }
    }

    public onDataReady(args: NotifyEventArgs): void {
        this.yearEventModule = new YearEvent(this.parent);
        this.yearEventModule.renderAppointments();
        this.parent.notify(event.eventsLoaded, args);
    }

    public scrollToDate(scrollDate: Date): void {
        const date: number = +new Date(util.resetTime(scrollDate));
        let element: HTMLElement = this.element.querySelector('.' + cls.WORK_CELLS_CLASS + ':not(.' + cls.OTHERMONTH_CLASS + ')[data-date="' + date + '"]');
        if (element) {
            element = closest(element, '.e-month-calendar') as HTMLElement;
            this.getContentAreaElement().scrollTop = element.offsetTop;
        }
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            this.parent = null;
            return;
        }
        if (this.element) {
            const contentScroll: Element = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            if (contentScroll) {
                EventHandler.remove(contentScroll, 'scroll', this.onContentScroll);
            }
            if (this.yearEventModule) {
                this.yearEventModule.destroy();
                this.yearEventModule = null;
            }
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            super.destroy();
        }
    }

}
