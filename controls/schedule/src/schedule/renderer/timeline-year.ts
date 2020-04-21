import { append, addClass, createElement, isBlazor } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { Year } from './year';
import { TdData, RenderCellEventArgs } from '../base/interface';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * timeline year view
 */
export class TimelineYear extends Year {
    public viewClass: string = 'e-timeline-year-view';
    public isInverseTableSelect: boolean = true;

    /**
     * Constructor for timeline year view
     */
    constructor(parent: Schedule) {
        super(parent);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'timelineYear';
    }

    public renderHeader(headerWrapper: HTMLElement): void {
        let tr: HTMLElement = createElement('tr');
        headerWrapper.appendChild(tr);
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        } else {
            let leftHeaderCells: HTMLElement = createElement('td', { className: cls.LEFT_INDENT_CLASS });
            tr.appendChild(leftHeaderCells);
            leftHeaderCells.appendChild(this.renderResourceHeader(cls.LEFT_INDENT_WRAP_CLASS));
        }
        let td: HTMLElement = createElement('td');
        tr.appendChild(td);
        let container: HTMLElement = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        td.appendChild(container);
        if (this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            container.appendChild(this.renderResourceHeader(cls.DATE_HEADER_WRAP_CLASS));
            this.columnCount = this.colLevels.slice(-1)[0].length;
        } else {
            let wrapper: HTMLElement = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
            container.appendChild(wrapper);
            let table: HTMLElement = this.createTableLayout() as HTMLElement;
            wrapper.appendChild(table);
            table.appendChild(this.createTableColGroup(this.columnCount));
            let innerTr: HTMLElement = createElement('tr');
            table.querySelector('tbody').appendChild(innerTr);
            for (let column: number = 0; column < this.columnCount; column++) {
                let innerTd: HTMLElement = createElement('td', { className: cls.HEADER_CELLS_CLASS });
                if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                    innerTd.innerHTML = `<span>${this.parent.getDayNames('abbreviated')[column % 7]}</span>`;
                } else {
                    let date: Date = new Date(this.parent.selectedDate.getFullYear(), column, 1);
                    innerTd.innerHTML = `<span>${this.getMonthName(date)}</span>`;
                    innerTd.setAttribute('data-date', date.getTime().toString());
                }
                innerTr.appendChild(innerTd);
                this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: innerTd });
            }
        }
    }

    private renderResourceHeader(className: string): HTMLElement {
        let wrap: HTMLElement = createElement('div', { className: className });
        let tbl: Element = this.createTableLayout();
        wrap.appendChild(tbl);
        let trEle: Element = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.colLevels = this.generateColumnLevels();
        } else {
            let colData: TdData[] = [{ className: [cls.HEADER_CELLS_CLASS], type: 'headerCell' }];
            this.colLevels = [colData];
        }
        for (let col of this.colLevels) {
            let ntr: Element = trEle.cloneNode() as Element;
            let count: TdData[] = className === cls.DATE_HEADER_WRAP_CLASS ? col : [col[0]];
            for (let c of count) {
                let tdEle: Element = createElement('td');
                if (c.className) { addClass([tdEle], c.className); }
                if (className === cls.DATE_HEADER_WRAP_CLASS) {
                    if (c.template) { append(c.template, tdEle); }
                    if (c.colSpan) { tdEle.setAttribute('colspan', c.colSpan.toString()); }
                    this.setResourceHeaderContent(tdEle, c);
                }
                let args: RenderCellEventArgs = { elementType: c.type, element: tdEle, date: c.date, groupIndex: c.groupIndex };
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
        let tr: HTMLElement = createElement('tr');
        contentWrapper.appendChild(tr);
        let firstTd: HTMLElement = createElement('td');
        let lastTd: HTMLElement = createElement('td');
        let tdCollection: HTMLElement[] = [];
        let monthTBody: HTMLTableSectionElement;
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            tdCollection.push(firstTd);
            firstTd.appendChild(this.parent.resourceBase.createResourceColumn());
            this.rowCount = this.parent.resourceBase.lastResourceLevel.length;
        } else {
            tdCollection.push(firstTd);
            let monthWrapper: HTMLElement = createElement('div', { className: cls.MONTH_HEADER_WRAPPER });
            firstTd.appendChild(monthWrapper);
            monthWrapper.appendChild(this.createTableLayout() as HTMLElement);
            monthTBody = monthWrapper.querySelector('tbody');
        }
        tdCollection.push(lastTd);
        append(tdCollection, tr);
        let content: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        lastTd.appendChild(content);
        let contentTable: HTMLElement = this.createTableLayout(cls.CONTENT_TABLE_CLASS) as HTMLElement;
        content.appendChild(contentTable);
        let eventWrapper: HTMLElement = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        content.appendChild(eventWrapper);
        let contentTBody: HTMLTableSectionElement = contentTable.querySelector('tbody');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            if (this.parent.rowAutoHeight) {
                addClass([contentTable], cls.AUTO_HEIGHT);
            }
            let colCount: number = this.parent.activeViewOptions.orientation === 'Horizontal' ? this.colLevels.slice(-1)[0].length : 12;
            contentTable.appendChild(this.createTableColGroup(colCount));
            this.renderResourceContent(eventWrapper, monthTBody, contentTBody);
        } else {
            contentTable.appendChild(this.createTableColGroup(this.columnCount));
            this.renderDefaultContent(eventWrapper, monthTBody, contentTBody);
        }
    }

    private renderDefaultContent(wrapper: HTMLElement, monthBody: HTMLTableSectionElement, contentBody: HTMLTableSectionElement): void {
        for (let month: number = 0; month < this.rowCount; month++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            let monthStart: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            let monthEnd: Date = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            let tr: HTMLElement = createElement('tr', { attrs: { 'role': 'row' } });
            let monthTr: HTMLElement = tr.cloneNode() as HTMLElement;
            monthBody.appendChild(monthTr);
            let contentTr: HTMLElement = tr.cloneNode() as HTMLElement;
            contentBody.appendChild(contentTr);
            let monthTd: HTMLElement = createElement('td', { className: cls.MONTH_HEADER_CLASS, attrs: { 'role': 'gridcell' } });
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                monthTd.setAttribute('data-date', monthDate.getTime().toString());
                monthTd.innerHTML = `<span>${this.getMonthName(monthDate)}</span>`;
            } else {
                monthTd.innerHTML = `<span>${this.parent.getDayNames('abbreviated')[month % 7]}</span>`;
            }
            monthTr.appendChild(monthTd);
            this.parent.trigger(event.renderCell, { elementType: 'leftHeaderCells', element: monthTd });
            let date: Date = new Date(monthStart.getTime());
            for (let column: number = 0; column < this.columnCount; column++) {
                let isDateAvail: boolean;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), column, 1);
                    monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                    monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
                    let dayDate: number = (month - monthStart.getDay()) + 1;
                    date = new Date(this.parent.selectedDate.getFullYear(), column, dayDate);
                    isDateAvail = dayDate > 0 && date.getTime() < monthEnd.getTime();
                } else {
                    isDateAvail = column >= monthStart.getDay() && date.getTime() < monthEnd.getTime();
                }
                let td: HTMLElement = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: { 'role': 'gridcell', 'aria-selected': 'false' }
                });
                contentTr.appendChild(td);
                let dateHeader: HTMLElement = createElement('div', {
                    className: cls.DATE_HEADER_CLASS + ' ' + cls.NAVIGATE_CLASS,
                    innerHTML: (isDateAvail) ? date.getDate().toString() : ''
                });
                let skeleton: string = isBlazor() ? 'D' : 'full';
                let annocementText: string =
                    this.parent.globalize.formatDate(date, {
                        skeleton: skeleton,
                        calendar: this.parent.getCalendarMode()
                    });
                dateHeader.setAttribute('aria-label', annocementText);
                if (isDateAvail) {
                    let tds: HTMLElement[] = [td];
                    let classList: string[] = [];
                    if (this.parent.activeViewOptions.workDays.indexOf(date.getDay()) > -1) {
                        classList.push(cls.WORKDAY_CLASS);
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
                }
                td.appendChild(dateHeader);
                if (isDateAvail) {
                    td.setAttribute('data-date', date.getTime().toString());
                    this.wireEvents(td, 'cell');
                    if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                        date = util.addDays(new Date(date.getTime()), 1);
                    }
                }
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
            }
        }
    }

    private renderResourceContent(wrapper: HTMLElement, monthBody: HTMLTableSectionElement, contentBody: HTMLTableSectionElement): void {
        for (let row: number = 0; row < this.rowCount; row++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            let tr: HTMLElement = createElement('tr', { attrs: { 'role': 'row' } });
            contentBody.appendChild(tr);
            let resData: TdData;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                resData = this.parent.resourceBase.lastResourceLevel[row];
            }
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), row, 1);
            let date: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                let monthTr: HTMLElement = tr.cloneNode() as HTMLElement;
                monthBody.appendChild(monthTr);
                let monthTd: HTMLElement = createElement('td', {
                    className: cls.MONTH_HEADER_CLASS,
                    innerHTML: `<span>${this.getMonthName(monthDate)}</span>`,
                    attrs: { 'role': 'gridcell', 'data-date': date.getTime().toString() }
                });
                monthTr.appendChild(monthTd);
            }
            for (let month: number = 0; month < this.columnCount; month++) {
                let classList: string[] = [];
                let groupIndex: number = row;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    classList = classList.concat(resData.className);
                    if (classList.indexOf(cls.RESOURCE_PARENT_CLASS) > -1) {
                        classList.push(cls.RESOURCE_GROUP_CELLS_CLASS);
                    } else {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), month, 1);
                    date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                } else {
                    groupIndex = this.colLevels.slice(-1)[0][month].groupIndex;
                    classList.push(cls.WORKDAY_CLASS);
                }
                let td: HTMLElement = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: {
                        'role': 'gridcell', 'aria-selected': 'false',
                        'data-date': date.getTime().toString()
                    }
                });
                addClass([td], classList);
                td.setAttribute('data-group-index', groupIndex.toString());
                this.wireEvents(td, 'cell');
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
            }
        }
        if (this.parent.activeViewOptions.orientation === 'Vertical') {
            this.collapseRows(this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS));
        }
    }

}
