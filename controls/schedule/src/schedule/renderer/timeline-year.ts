import { append, addClass, createElement } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { Year } from './year';
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
        tr.appendChild(createElement('td', { className: cls.LEFT_INDENT_CLASS }));
        let td: HTMLElement = createElement('td');
        tr.appendChild(td);
        let container: HTMLElement = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        td.appendChild(container);
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

    public renderContent(contentWrapper: HTMLElement): void {
        let tr: HTMLElement = createElement('tr');
        contentWrapper.appendChild(tr);
        let firstTd: HTMLElement = createElement('td');
        let lastTd: HTMLElement = createElement('td');
        append([firstTd, lastTd], tr);
        let monthWrapper: HTMLElement = createElement('div', { className: cls.MONTH_HEADER_WRAPPER });
        firstTd.appendChild(monthWrapper);
        monthWrapper.appendChild(this.createTableLayout() as HTMLElement);
        let content: HTMLElement = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        lastTd.appendChild(content);
        content.appendChild(this.createTableLayout(cls.CONTENT_TABLE_CLASS) as HTMLElement);
        let eventWrapper: HTMLElement = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        content.appendChild(eventWrapper);
        let monthTBody: HTMLTableSectionElement = monthWrapper.querySelector('tbody');
        let contentTBody: HTMLTableSectionElement = content.querySelector('tbody');
        for (let month: number = 0; month < this.rowCount; month++) {
            eventWrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            let monthStart: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            let monthEnd: Date = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            let tr: HTMLElement = createElement('tr', { attrs: { 'role': 'row' } });
            let monthTr: HTMLElement = tr.cloneNode() as HTMLElement;
            monthTBody.appendChild(monthTr);
            let contentTr: HTMLElement = tr.cloneNode() as HTMLElement;
            contentTBody.appendChild(contentTr);
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
                let annocementText: string = this.parent.globalize.formatDate(date, {
                    skeleton: 'full',
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
}
