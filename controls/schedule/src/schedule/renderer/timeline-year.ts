/* eslint-disable @typescript-eslint/no-explicit-any */
import { append, addClass, createElement, EventHandler } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { Year } from './year';
import { TdData, RenderCellEventArgs, CellTemplateArgs } from '../base/interface';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * timeline year view
 */
export class TimelineYear extends Year {
    public viewClass: string = 'e-timeline-year-view';
    public isInverseTableSelect: boolean = true;

    constructor(parent: Schedule) {
        super(parent);
    }

    protected getModuleName(): string {
        return 'timelineYear';
    }

    public renderHeader(headerWrapper: HTMLElement): void {
        const tr: HTMLElement = createElement('tr');
        headerWrapper.appendChild(tr);
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        } else {
            const leftHeaderCells: HTMLElement = createElement('td', { className: cls.LEFT_INDENT_CLASS });
            tr.appendChild(leftHeaderCells);
            leftHeaderCells.appendChild(this.renderResourceHeader(cls.LEFT_INDENT_WRAP_CLASS));
        }
        const isHorizontal: boolean = this.parent.activeViewOptions.orientation === 'Horizontal';
        const isGroup: boolean = this.parent.activeViewOptions.group.resources.length > 0;
        this.isInverseTableSelect = isHorizontal && !isGroup ? false : true;
        const td: HTMLElement = createElement('td');
        tr.appendChild(td);
        const container: HTMLElement = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        td.appendChild(container);
        if (this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            container.appendChild(this.renderResourceHeader(cls.DATE_HEADER_WRAP_CLASS));
            this.columnCount = this.colLevels.slice(-1)[0].length;
        } else {
            const wrapper: HTMLElement = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
            container.appendChild(wrapper);
            const table: HTMLElement = this.createTableLayout() as HTMLElement;
            wrapper.appendChild(table);
            table.appendChild(this.createTableColGroup(this.columnCount));
            const innerTr: HTMLElement = createElement('tr');
            table.querySelector('tbody').appendChild(innerTr);
            const months: number[] = this.getMonths();
            const dayHeaderDates: Date[] = this.getMonthDates(new Date(this.parent.selectedDate.getFullYear(), months[0], 1));
            for (let column: number = 0; column < this.columnCount; column++) {
                const date: Date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(column.toString(), 10)], 1);
                const innerTd: HTMLElement = createElement('td', { className: cls.HEADER_CELLS_CLASS });
                if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                    if (this.parent.dayHeaderTemplate) {
                        append(this.renderDayMonthHeaderTemplate(dayHeaderDates[parseInt(column.toString(), 10)], column, 'dayHeaderTemplate'), innerTd);
                    } else {
                        innerTd.innerHTML = `<span>${this.parent.getDayNames('abbreviated')[column % 7]}</span>`;
                    }
                } else {
                    if (this.parent.monthHeaderTemplate) {
                        append(this.renderDayMonthHeaderTemplate(date, months[parseInt(column.toString(), 10)], 'monthHeaderTemplate'), innerTd);
                    } else {
                        innerTd.innerHTML = `<span>${this.getMonthName(date)}</span>`;
                    }
                    innerTd.setAttribute('data-date', date.getTime().toString());
                }
                innerTr.appendChild(innerTd);
                this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: innerTd });
            }
        }
    }

    private renderResourceHeader(className: string): HTMLElement {
        const wrap: HTMLElement = createElement('div', { className: className });
        const tbl: Element = this.createTableLayout();
        wrap.appendChild(tbl);
        const trEle: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.colLevels = this.generateColumnLevels();
        } else {
            const colData: TdData[] = [{ className: [cls.HEADER_CELLS_CLASS], type: 'headerCell' }];
            this.colLevels = [colData];
        }
        for (const col of this.colLevels) {
            const ntr: Element = trEle.cloneNode() as Element;
            const count: TdData[] = className === cls.DATE_HEADER_WRAP_CLASS ? col : [col[0]];
            for (const c of count) {
                const tdEle: Element = createElement('td');
                if (c.className) { addClass([tdEle], c.className); }
                if (className === cls.DATE_HEADER_WRAP_CLASS) {
                    if (c.template) { append(c.template, tdEle); }
                    if (c.colSpan) { tdEle.setAttribute('colspan', c.colSpan.toString()); }
                    if (c.groupIndex > -1) { tdEle.setAttribute('data-group-index', c.groupIndex.toString()); }
                    this.setResourceHeaderContent(tdEle, c);
                }
                if (className === cls.LEFT_INDENT_WRAP_CLASS) {
                    this.parent.renderHeaderIndentTemplate(c, tdEle);
                }
                const args: RenderCellEventArgs = { elementType: c.type, element: tdEle, date: c.date, groupIndex: c.groupIndex };
                this.parent.trigger(event.renderCell, args);
                ntr.appendChild(tdEle);
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        if (className === cls.DATE_HEADER_WRAP_CLASS) {
            tbl.appendChild(this.createTableColGroup(this.colLevels.slice(-1)[0].length));
        }
        return wrap;
    }

    public renderContent(contentWrapper: HTMLElement): void {
        const tr: HTMLElement = createElement('tr');
        contentWrapper.appendChild(tr);
        const firstTd: HTMLElement = createElement('td');
        const lastTd: HTMLElement = createElement('td');
        const tdCollection: HTMLElement[] = [];
        let monthTBody: HTMLTableSectionElement;
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            tdCollection.push(firstTd);
            firstTd.appendChild(this.parent.resourceBase.createResourceColumn());
            this.rowCount = this.parent.resourceBase.renderedResources.length;
        } else {
            tdCollection.push(firstTd);
            const monthWrapper: HTMLElement = createElement('div', { className: cls.MONTH_HEADER_WRAPPER });
            firstTd.appendChild(monthWrapper);
            monthWrapper.appendChild(this.createTableLayout() as HTMLElement);
            monthTBody = monthWrapper.querySelector('tbody');
        }
        tdCollection.push(lastTd);
        append(tdCollection, tr);
        const content: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        lastTd.appendChild(content);
        const contentTable: HTMLElement = this.createTableLayout(cls.CONTENT_TABLE_CLASS) as HTMLElement;
        this.setAriaAttributes(contentTable);
        content.appendChild(contentTable);
        const eventWrapper: HTMLElement = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        content.appendChild(eventWrapper);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(content);
        }
        const contentTBody: HTMLTableSectionElement = contentTable.querySelector('tbody');
        if (this.parent.rowAutoHeight) {
            const addClassTable: HTMLElement[] = [contentTable];
            const monthHeader: HTMLElement =
                this.parent.element.querySelector('.' + cls.MONTH_HEADER_WRAPPER + ' .' + cls.SCHEDULE_TABLE_CLASS);
            if (monthHeader) {
                addClassTable.push(monthHeader);
            }
            addClass(addClassTable, cls.AUTO_HEIGHT);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            const colCount: number = this.parent.activeViewOptions.orientation === 'Horizontal' ? this.colLevels.slice(-1)[0].length : this.columnCount;
            contentTable.appendChild(this.createTableColGroup(colCount));
            this.renderResourceContent(eventWrapper, monthTBody, contentTBody);
        } else {
            contentTable.appendChild(this.createTableColGroup(this.columnCount));
            this.renderDefaultContent(eventWrapper, monthTBody, contentTBody);
        }
    }

    private renderDefaultContent(wrapper: HTMLElement, monthBody: HTMLTableSectionElement, contentBody: HTMLTableSectionElement): void {
        const months: number[] = this.getMonths();
        const dayHeaderDates: Date[] = this.getMonthDates(new Date(this.parent.selectedDate.getFullYear(), months[0], 1));
        for (let month: number = 0; month < this.rowCount; month++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(month.toString(), 10)], 1);
            let monthStart: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            let monthEnd: Date = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            const tr: HTMLElement = createElement('tr');
            const monthTr: HTMLElement = tr.cloneNode() as HTMLElement;
            monthBody.appendChild(monthTr);
            const contentTr: HTMLElement = tr.cloneNode() as HTMLElement;
            contentBody.appendChild(contentTr);
            const monthTd: HTMLElement = createElement('td', { className: cls.MONTH_HEADER_CLASS });
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                if (this.parent.monthHeaderTemplate) {
                    append(this.renderDayMonthHeaderTemplate(monthStart, month, 'monthHeaderTemplate'), monthTd);
                } else {
                    monthTd.innerHTML = `<span>${this.getMonthName(monthDate)}</span>`;
                }
                monthTd.setAttribute('data-date', monthDate.getTime().toString());
            } else {
                if (this.parent.dayHeaderTemplate) {
                    append(this.renderDayMonthHeaderTemplate(dayHeaderDates[parseInt(month.toString(), 10)], month, 'dayHeaderTemplate'), monthTd);
                } else {
                    monthTd.innerHTML = `<span>${this.parent.getDayNames('abbreviated')[month % 7]}</span>`;
                }
            }
            monthTr.appendChild(monthTd);
            this.parent.trigger(event.renderCell, { elementType: 'leftHeaderCells', element: monthTd });
            let date: Date = new Date(monthStart.getTime());
            for (let column: number = 0; column < this.columnCount; column++) {
                let isDateAvail: boolean;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(column.toString(), 10)], 1);
                    monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                    monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
                    const dayDate: number = (month - monthStart.getDay()) + 1;
                    date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(column.toString(), 10)], dayDate);
                    isDateAvail = dayDate > 0 && date.getTime() < monthEnd.getTime();
                } else {
                    isDateAvail = column >= monthStart.getDay() && date.getTime() < monthEnd.getTime();
                }
                const announcementText: string = this.parent.globalize.formatDate(date, {
                    skeleton: 'full', calendar: this.parent.getCalendarMode()
                });
                const td: HTMLElement = createElement('td', {
                    className: cls.WORK_CELLS_CLASS, attrs: { 'aria-label': announcementText }
                });
                contentTr.appendChild(td);
                const dateHeader: HTMLElement = createElement('div', {
                    className: cls.DATE_HEADER_CLASS + ' ' + cls.NAVIGATE_CLASS,
                    innerHTML: (isDateAvail) ?
                        this.parent.globalize.formatDate(date, { skeleton: 'd', calendar: this.parent.getCalendarMode() }) : ''
                });
                if (isDateAvail) {
                    const tds: HTMLElement[] = [td];
                    const classList: string[] = [];
                    if (this.parent.activeViewOptions.workDays.indexOf(date.getDay()) > -1) {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    if (!this.parent.isMinMaxDate(date)) {
                        addClass([td], cls.DISABLE_DATES);
                    }
                    if (this.isCurrentDate(date)) {
                        classList.push(cls.CURRENT_DAY_CLASS);
                        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                            tds.push(this.element.querySelector('.' + cls.HEADER_CELLS_CLASS + `:nth-child(${column + 1})`));
                        } else {
                            tds.push(this.element.querySelectorAll('.' + cls.MONTH_HEADER_CLASS).item(month) as HTMLElement);
                        }
                    }
                    if (classList.length > 0) {
                        addClass(tds, classList);
                    }
                } else {
                    addClass([td], cls.OTHERMONTH_CLASS);
                    if (!this.parent.isMinMaxDate(date)) {
                        addClass([td], cls.DISABLE_DATES);
                    }
                }
                if (td.classList.contains(cls.OTHERMONTH_CLASS)) {
                    continue;
                } else {
                    this.renderDates.push(new Date(date));
                }
                td.appendChild(dateHeader);
                if (isDateAvail) {
                    td.setAttribute('data-date', date.getTime().toString());
                    this.wireEvents(td);
                }
                this.renderCellTemplate({ date: date, type: 'workCells' }, td);
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
                if (isDateAvail) {
                    if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                        date = util.addDays(new Date(date.getTime()), 1);
                    }
                }
            }
        }
        this.renderDates.splice(0, 1);
    }

    public getContentRows(): Element[] {
        const tRow: Element[] = [];
        const monthCells: number[] = this.getMonths();
        const existingGroupIndices: number[] = this.getGroupIndices();
        for (let row: number = 0; row < this.parent.resourceBase.renderedResources.length; row++) {
            let resData: TdData;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                resData = this.parent.resourceBase.renderedResources[parseInt(row.toString(), 10)];
                if (existingGroupIndices.length > 0 && existingGroupIndices.indexOf(resData.groupIndex) > -1) {
                    continue;
                }
            }
            const tr: HTMLElement = createElement('tr');
            tRow.push(tr);
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), monthCells[parseInt(row.toString(), 10)], 1);
            let date: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            for (let month: number = 0; month < this.columnCount; month++) {
                let classList: string[] = [];
                const groupIndex: number = resData.groupIndex;
                classList = classList.concat(resData.className);
                if (classList.indexOf(cls.RESOURCE_PARENT_CLASS) > -1) {
                    classList.push(cls.RESOURCE_GROUP_CELLS_CLASS);
                } else {
                    classList.push(cls.WORKDAY_CLASS);
                }
                monthDate = new Date(this.parent.selectedDate.getFullYear(), monthCells[parseInt(month.toString(), 10)], 1);
                date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                const tdELe: HTMLElement = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: {
                        'aria-selected': 'false',
                        'data-date': date.getTime().toString()
                    }
                });
                addClass([tdELe], classList);
                tdELe.setAttribute('data-group-index', groupIndex.toString());
                this.renderCellTemplate({ date: date, type: 'resourceGroupCells', groupIndex: groupIndex }, tdELe);
                this.wireEvents(tdELe);
                this.parent.trigger(event.renderCell, { elementType: 'resourceGroupCells', element: tdELe, date: date });
                tr.appendChild(tdELe);
            }
        }
        return tRow;
    }

    public renderResourceContent(wrapper: HTMLElement, monthBody: HTMLTableSectionElement, contentBody: HTMLTableSectionElement): void {
        const months: number[] = this.getMonths();
        for (let row: number = 0; row < this.rowCount; row++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            const tr: HTMLElement = createElement('tr');
            contentBody.appendChild(tr);
            let resData: TdData;
            if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                resData = this.parent.resourceBase.renderedResources[parseInt(row.toString(), 10)];
            }
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(row.toString(), 10)], 1);
            let date: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                const monthTr: HTMLElement = tr.cloneNode() as HTMLElement;
                monthBody.appendChild(monthTr);
                const monthTd: HTMLElement = createElement('td', {
                    className: cls.MONTH_HEADER_CLASS,
                    attrs: { 'data-date': date.getTime().toString() }
                });
                if (this.parent.monthHeaderTemplate) {
                    append(this.renderDayMonthHeaderTemplate(monthDate, row, 'monthHeaderTemplate'), monthTd);
                } else {
                    monthTd.innerHTML = `<span>${this.getMonthName(monthDate)}</span>`;
                }
                monthTr.appendChild(monthTd);
            }
            for (let month: number = 0; month < this.columnCount; month++) {
                let classList: string[] = [];
                let groupIndex: number;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    groupIndex = resData.groupIndex;
                    classList = classList.concat(resData.className);
                    if (classList.indexOf(cls.RESOURCE_PARENT_CLASS) > -1) {
                        classList.push(cls.RESOURCE_GROUP_CELLS_CLASS);
                    } else {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(month.toString(), 10)], 1);
                    date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                } else {
                    groupIndex = this.colLevels.slice(-1)[0][parseInt(month.toString(), 10)].groupIndex;
                    classList.push(cls.WORKDAY_CLASS);
                }
                const startDateText: string = this.parent.globalize.formatDate(date, { type: 'dateTime', skeleton: 'full', calendar: this.parent.getCalendarMode() });
                const endDateText: string = this.parent.globalize.formatDate(this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime())), { type: 'dateTime', skeleton: 'full', calendar: this.parent.getCalendarMode() });
                const td: HTMLElement = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: {
                        'aria-selected': 'false',
                        'data-date': date.getTime().toString(),
                        'aria-label': startDateText + ' ' + this.parent.localeObj.getConstant('endAt') + ' ' + endDateText
                    }
                });
                addClass([td], classList);
                td.setAttribute('data-group-index', groupIndex.toString());
                this.renderCellTemplate({ date: date, type: 'resourceGroupCells', groupIndex: groupIndex }, td);
                this.wireEvents(td);
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'resourceGroupCells', element: td, date: date });
            }
        }
        if (this.parent.activeViewOptions.orientation === 'Vertical') {
            this.collapseRows(this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS));
        }
    }

    private renderDayMonthHeaderTemplate(date: Date, column: number, type: string): Element[] {
        const args: CellTemplateArgs = { date: date, type: type === 'dayHeaderTemplate' ? 'dayHeader' : 'monthHeader' };
        const dayId: string = `schedule_${this.parent.activeViewOptions.dayHeaderTemplateName}dayHeaderTemplate`;
        const monthId: string = `schedule_${this.parent.activeViewOptions.dayHeaderTemplateName}monthHeaderTemplate`;
        if (type === 'dayHeaderTemplate') {
            args.day = this.parent.getDayNames('wide')[column % 7];
            return [].slice.call(this.parent.getDayHeaderTemplate()(args, this.parent, 'dayHeaderTemplate', dayId,
                                                                    false, undefined, undefined, this.parent.root));
        } else {
            return [].slice.call(this.parent.getMonthHeaderTemplate()(args, this.parent, 'monthHeaderTemplate', monthId,
                                                                      false, undefined, undefined, this.parent.root));
        }
    }

    private renderCellTemplate(data: Record<string, any>, td: HTMLElement): void {
        if (!this.parent.activeViewOptions.cellTemplate || td.classList.contains(cls.OTHERMONTH_CLASS)) {
            return;
        }
        const args: CellTemplateArgs = { date: data.date as Date, type: data.type as string };
        if (data.groupIndex) {
            args.groupIndex = data.groupIndex as number;
        }
        const scheduleId: string = this.parent.element.id + '_';
        const viewName: string = this.parent.activeViewOptions.cellTemplateName;
        const templateId: string = scheduleId + viewName + 'cellTemplate';
        const cellTemplate: HTMLElement[] = [].slice.call(this.parent.getCellTemplate()(args, this.parent, 'cellTemplate', templateId,
                                                                                        false, undefined, undefined, this.parent.root));
        append(cellTemplate, td);
    }

    public scrollToDate(scrollDate: Date): void {
        let date: number;
        if (this.parent.activeViewOptions.group.resources !== null && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            date = +new Date(util.resetTime(util.firstDateOfMonth(scrollDate)));
        } else {
            date = +new Date(util.resetTime(scrollDate));
        }
        const element: HTMLElement = this.element.querySelector('[data-date="' + date + '"]');
        if (element) {
            const wrap: Element = this.getScrollableElement();
            if (this.parent.enableRtl) {
                const conTable: HTMLElement = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
                wrap.scrollLeft = -(conTable.offsetWidth - element.offsetLeft - element.offsetWidth);
            } else {
                wrap.scrollLeft = element.offsetLeft;
            }
            wrap.scrollTop = element.offsetTop;
        }
    }

    public getScrollableElement(): Element {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            return this.element.querySelector('.' + cls.SCROLL_CONTAINER_CLASS);
        } else {
            return this.getContentAreaElement();
        }
    }

    private wireEvents(element: HTMLElement): void {
        EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    }

}
