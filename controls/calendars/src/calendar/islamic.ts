/**
 * 
 */
import { EventHandler, Internationalization } from '@syncfusion/ej2-base';
import { rippleEffect } from '@syncfusion/ej2-base';
import { removeClass, addClass, attributes, HijriParser } from '@syncfusion/ej2-base';
import { getUniqueID } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Calendar, RenderDayCellEventArgs } from './calendar';


//class constant defination.
const OTHERMONTH: string = 'e-other-month';

const YEAR: string = 'e-year';
const MONTH: string = 'e-month';
const DECADE: string = 'e-decade';
const DISABLED: string = 'e-disabled';
const OVERLAY: string = 'e-overlay';
const WEEKEND: string = 'e-weekend';
const WEEKNUMBER: string = 'e-week-number';
const SELECTED: string = 'e-selected';
const FOCUSEDDATE: string = 'e-focused-date';
const OTHERMONTHROW: string = 'e-month-hide';
const TODAY: string = 'e-today';
const LINK: string = 'e-day';
const CELL: string = 'e-cell';
const dayMilliSeconds: number = 86400000;
const minDecade: number = 2060;
const maxDecade: number = 2069;
export class Islamic {
    constructor(instance: Calendar) {
        this.calendarInstance = instance;
    }

    /* tslint:disable-next-line:no-any */
    private calendarInstance: any;
    public getModuleName(): string {
        return 'islamic';
    }

    public islamicTitleUpdate(date: Date, view: string): void {
        let globalize: Internationalization = new Internationalization(this.calendarInstance.locale);
        switch (view) {
            case 'days':
                /* tslint:disable-next-line:max-line-length */
                this.calendarInstance.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', format: 'MMMMyyyy', calendar: 'islamic' });
                break;
            case 'months':
                /* tslint:disable-next-line:max-line-length */
                this.calendarInstance.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', format: 'yyyy', calendar: 'islamic' });
        }
    }
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    public islamicRenderDays(currentDate: Date, value?: Date, multiSelection?: boolean, values?: Date[]): HTMLElement[] {
        let tdEles: HTMLElement[] = [];
        let cellsCount: number = 42;
        let localDate: Date = new Date('' + currentDate);
        let minMaxDate: Date;
        let numCells: number = this.calendarInstance.weekNumber ? 8 : 7;
        // 8 and 7 denotes the number of columns to be specified.

        this.islamicTitleUpdate(currentDate, 'days');
        /* tslint:disable-next-line:no-any */
        let islamicDate: any = this.getIslamicDate(localDate);
        let gregorianObject: Date = this.toGregorian(islamicDate.year, islamicDate.month, 1);
        let currentMonth: number = islamicDate.month;
        localDate = gregorianObject;
        while (localDate.getDay() !== this.calendarInstance.firstDayOfWeek) {
            this.calendarInstance.setStartDate(localDate, -1 * dayMilliSeconds);
        }
        for (let day: number = 0; day < cellsCount; ++day) {
            let weekEle: HTMLElement = this.calendarInstance.createElement('td', { className: CELL });
            let weekAnchor: HTMLElement = this.calendarInstance.createElement('span');
            if (day % 7 === 0 && this.calendarInstance.weekNumber) {
                weekAnchor.textContent = '' + this.calendarInstance.getWeek(localDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.calendarInstance.minMaxDate(localDate);
            /* tslint:disable-next-line:max-line-length */
            let dateFormatOptions: object = { type: 'dateTime', skeleton: 'full', calendar: 'islamic' };
            let date: Date = this.calendarInstance.globalize.parseDate(this.calendarInstance.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            let tdEle: HTMLElement = this.islamicDayCell(localDate);
            /* tslint:disable-next-line:max-line-length */
            let title: string = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'full', calendar: 'islamic' });
            let dayLink: HTMLElement = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'd', calendar: 'islamic' });
            let disabled: boolean = (this.calendarInstance.min > localDate) || (this.calendarInstance.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
            } else {
                dayLink.setAttribute('title', '' + title);
            }
            /* tslint:disable-next-line:no-any */
            let hijriMonthObject: any = this.getIslamicDate(localDate);
            if (currentMonth !== hijriMonthObject.month) {
                addClass([tdEle], OTHERMONTH);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                addClass([tdEle], WEEKEND);
            }
            tdEle.appendChild(dayLink);
            this.calendarInstance.renderDayCellArgs = {
                date: localDate,
                isDisabled: false,
                element: tdEle,
                isOutOfRange: disabled
            };
            let argument: RenderDayCellEventArgs = this.calendarInstance.renderDayCellArgs;
            this.calendarInstance.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                if (this.calendarInstance.isMultiSelection) {
                    if (!isNullOrUndefined(this.calendarInstance.values) && this.calendarInstance.values.length > 0) {
                        for (let index: number = 0; index < values.length; index++) {
                            /* tslint:disable-next-line:max-line-length */
                            let localDateString: number = +new Date(this.calendarInstance.globalize.formatDate(argument.date, { type: 'date', skeleton: 'yMd', calendar: 'islamic' }));
                            /* tslint:disable-next-line:max-line-length */
                            let tempDateString: number = +new Date(this.calendarInstance.globalize.formatDate(this.calendarInstance.values[index], { type: 'date', skeleton: 'yMd', calendar: 'islamic' }));
                            if (localDateString === tempDateString) {
                                this.calendarInstance.values.splice(index, 1);
                                index = -1;
                            }
                        }
                    }

                } else if (value && +value === +argument.date) {
                    this.calendarInstance.setProperties({ value: null }, true);
                }
            }
            if (this.calendarInstance.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED)) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
                if (+this.calendarInstance.renderDayCellArgs.date === +this.calendarInstance.todayDate) {
                    this.calendarInstance.todayDisabled = true;
                }
            }
            let otherMnthBool: boolean = tdEle.classList.contains(OTHERMONTH);
            let disabledCls: boolean = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            if (this.calendarInstance.isMultiSelection && !isNullOrUndefined(this.calendarInstance.values) &&
                !otherMnthBool && !disabledCls) {
                for (let tempValue: number = 0; tempValue < this.calendarInstance.values.length; tempValue++) {
                    /* tslint:disable-next-line:max-line-length */
                    let localDateString: string = this.calendarInstance.globalize.formatDate(localDate, { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    let tempDateString: string = this.calendarInstance.globalize.formatDate(this.calendarInstance.values[tempValue], { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    if (localDateString === tempDateString &&
                        this.calendarInstance.getDateVal(localDate, this.calendarInstance.values[tempValue])) {
                        addClass([tdEle], SELECTED);
                    } else {
                        this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                    }
                }
                if (this.calendarInstance.values.length <= 0) {
                    this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
                }
            } else if (!otherMnthBool && !disabledCls && this.calendarInstance.getDateVal(localDate, value)) {
                addClass([tdEle], SELECTED);
            } else {
                this.calendarInstance.updateFocus(otherMnthBool, disabledCls, localDate, tdEle, currentDate);
            }
            if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    addClass([tdEle], TODAY);
                }
            }
            localDate = new Date(+minMaxDate);
            tdEles.push(this.calendarInstance.renderDayCellArgs.element);
            this.calendarInstance.addDay(localDate, 1, null, this.calendarInstance.max, this.calendarInstance.min);
        }
        return tdEles;
    }

    public islamicIconHandler(): void {
        new Date('' + this.calendarInstance.currentDate).setDate(1);
        switch (this.calendarInstance.currentView()) {
            case 'Month':
                let prevMonthCompare: boolean =
                    this.islamicCompareMonth(new Date('' + this.calendarInstance.currentDate), this.calendarInstance.min) < 1;
                let nextMonthCompare: boolean =
                    this.islamicCompareMonth(new Date('' + this.calendarInstance.currentDate), this.calendarInstance.max) > -1;
                this.calendarInstance.previousIconHandler(prevMonthCompare);
                this.calendarInstance.nextIconHandler(nextMonthCompare);
                break;
            case 'Year':
                let prevYearCompare: boolean =
                    this.hijriCompareYear(new Date('' + this.calendarInstance.currentDate), this.calendarInstance.min) < 1;

                let nextYearCompare: boolean =
                    this.hijriCompareYear(new Date('' + this.calendarInstance.currentDate), this.calendarInstance.max) > -1;
                this.calendarInstance.previousIconHandler(prevYearCompare);
                this.calendarInstance.nextIconHandler(nextYearCompare);
                break;
            case 'Decade':
                let prevDecadeCompare: boolean =
                    this.hijriCompareDecade(new Date('' + this.calendarInstance.currentDate), this.calendarInstance.min) < 1;
                let nextDecadeCompare: boolean =
                    this.hijriCompareDecade(new Date('' + this.calendarInstance.currentDate), this.calendarInstance.max) > -1;
                this.calendarInstance.previousIconHandler(prevDecadeCompare);
                this.calendarInstance.nextIconHandler(nextDecadeCompare);
        }
    }
    public islamicNext(): void {
        this.calendarInstance.effect = '';
        let view: number = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        /* tslint:disable-next-line:no-any */
        let islamicDate: any = this.getIslamicDate(this.calendarInstance.currentDate);
        switch (this.calendarInstance.currentView()) {
            case 'Year':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year + 1, islamicDate.month, 1);
                this.calendarInstance.switchView(view);
                break;
            case 'Month':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year, islamicDate.month + 1, 1);
                this.calendarInstance.switchView(view);
                break;
            case 'Decade':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year + 10, islamicDate.month, 1);
                this.calendarInstance.switchView(view);
                break;
        }
    }
    public islamicPrevious(): void {
        let currentView: number = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        this.calendarInstance.effect = '';
        /* tslint:disable-next-line:no-any */
        let islamicDate: any = this.getIslamicDate(this.calendarInstance.currentDate);
        switch (this.calendarInstance.currentView()) {
            case 'Month':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year, islamicDate.month - 1, 1);
                this.calendarInstance.switchView(currentView);
                break;
            case 'Year':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year - 1, islamicDate.month, 1);
                this.calendarInstance.switchView(currentView);
                break;
            case 'Decade':
                this.calendarInstance.currentDate = this.toGregorian(islamicDate.year - 10, islamicDate.month - 1, 1);
                this.calendarInstance.switchView(currentView);
                break;
        }
    }

    public islamicRenderYears(e?: Event, value?: Date): void {
        this.calendarInstance.removeTableHeadElement();
        let numCells: number = 4;
        let days: number[];
        let tdEles: HTMLElement[] = [];
        let valueUtil: boolean = isNullOrUndefined(value);
        let curDate: Date = new Date('' + this.calendarInstance.currentDate);
        let localDate: Date = curDate;
        /* tslint:disable-next-line:no-any */
        let islamicDate: any = this.getIslamicDate(localDate);
        let gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, 1, 1);
        localDate = gregorianObject;
        let mon: number = islamicDate.month;
        let yr: number = islamicDate.year;
        let curYrs: number = islamicDate.year;
        /* tslint:disable-next-line:no-any */
        let minYr: number = (<any>(this.getIslamicDate(this.calendarInstance.min))).year;
        /* tslint:disable-next-line:no-any */
        let minMonth: number = (<any>(this.getIslamicDate(this.calendarInstance.min))).month;
        /* tslint:disable-next-line:no-any */
        let maxYr: number = (<any>(this.getIslamicDate(this.calendarInstance.max))).year;
        /* tslint:disable-next-line:no-any */
        let maxMonth: number = (<any>(this.getIslamicDate(this.calendarInstance.max))).month;
        this.islamicTitleUpdate(this.calendarInstance.currentDate, 'months');
        let disabled: boolean = (this.calendarInstance.min > localDate) || (this.calendarInstance.max < localDate);
        for (let month: number = 1; month <= 12; ++month) {
            /* tslint:disable-next-line:no-any */
            let islamicDate: any = this.getIslamicDate(localDate);
            let gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, month, 1);
            localDate = gregorianObject;
            let tdEle: HTMLElement = this.islamicDayCell(localDate);
            let dayLink: HTMLElement = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            /* tslint:disable-next-line:no-any */
            let localMonth: boolean = (value && (<any>(this.getIslamicDate(value))).month === (<any>(this.getIslamicDate(localDate))).month);
            /* tslint:disable-next-line:no-any  tslint:disable-next-line:max-line-length */
            let select: boolean = (value && (<any>(this.getIslamicDate(value))).year === yr && localMonth);
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'dateTime', format: 'MMM', calendar: 'islamic' });
            if ((this.calendarInstance.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (
                this.calendarInstance.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                addClass([tdEle], DISABLED);
            } else if (!valueUtil && select) {
                addClass([tdEle], SELECTED);
            } else {
                /* tslint:disable-next-line:no-any */
                if ((<any>(this.getIslamicDate(localDate))).month === mon &&
                    /* tslint:disable-next-line:no-any */
                    (<any>(this.getIslamicDate(this.calendarInstance.currentDate))).month === mon) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.islamicRenderTemplate(tdEles, numCells, YEAR, e, value);
    }
    public islamicRenderDecade(e?: Event, value?: Date): void {
        this.calendarInstance.removeTableHeadElement();
        let numCells: number = 4;
        let yearCell: number = 12;
        let tdEles: HTMLElement[] = [];
        let localDate: Date = new Date('' + this.calendarInstance.currentDate);
        /* tslint:disable-next-line:no-any */
        let islamicDate: any = this.getIslamicDate(localDate);
        let gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, 1, 1);
        localDate = gregorianObject;
        let localYr: number = localDate.getFullYear();
        let startYr: Date = new Date('' + (localYr - localYr % 10));
        let endYr: Date = new Date('' + (localYr - localYr % 10 + (10 - 1)));
        /* tslint:disable-next-line:max-line-length */
        let startHdrYr: string = this.calendarInstance.globalize.formatDate(startYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
        let endHdrYr: string = this.calendarInstance.globalize.formatDate(endYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
        this.calendarInstance.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        let start: Date = new Date(localYr - (localYr % 10) - 2, 0, 1);
        let startYear: number = start.getFullYear();
        for (let rowCount: number = 1; rowCount <= yearCell; ++rowCount) {
            let year: number = startYear + rowCount;
            localDate.setFullYear(year);
            localDate.setDate(1);
            localDate.setMonth(0);
            /* tslint:disable-next-line:no-any */
            let islamicDate: any = this.getIslamicDate(localDate);
            let gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, 1, 1);
            localDate = gregorianObject;
            let tdEle: HTMLElement = this.islamicDayCell(localDate);
            attributes(tdEle, { 'role': 'gridcell' });
            let dayLink: HTMLElement = this.calendarInstance.createElement('span');
            /* tslint:disable-next-line:max-line-length */
            dayLink.textContent = this.calendarInstance.globalize.formatDate(localDate, { type: 'dateTime', format: 'y', calendar: 'islamic' });
            /* tslint:disable-next-line:no-any */
            if (year < new Date('' + this.calendarInstance.min).getFullYear()
                || year > new Date('' + this.calendarInstance.max).getFullYear()) {
                addClass([tdEle], DISABLED);
            } else if (!isNullOrUndefined(value) &&
                /* tslint:disable-next-line:no-any */
                (<any>(this.getIslamicDate(localDate))).year ===
                /* tslint:disable-next-line:no-any */
                (<any>(this.getIslamicDate(value))).year) {
                addClass([tdEle], SELECTED);
            } else {
                if (localDate.getFullYear() === this.calendarInstance.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED)) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.islamicRenderTemplate(tdEles, numCells, 'e-decade', e, value);
    }
    public islamicDayCell(localDate: Date): HTMLElement {
        let dateFormatOptions: object = { skeleton: 'full', type: 'dateTime', calendar: 'islamic' };
        let formatDate: string = this.calendarInstance.globalize.formatDate(localDate, dateFormatOptions);
        let date: Date = this.calendarInstance.globalize.parseDate(formatDate, dateFormatOptions);
        let value: number = date.valueOf();
        let attrs: Object = {
            className: CELL, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return this.calendarInstance.createElement('td', attrs);
    }
    public islamicRenderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event, value?: Date): void {
        let view: number = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        let trEle: HTMLElement;
        this.calendarInstance.tableBodyElement = this.calendarInstance.createElement('tbody');
        this.calendarInstance.table.appendChild(this.calendarInstance.tableBodyElement);
        removeClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [MONTH, DECADE, YEAR]);
        addClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [classNm]);
        let weekNumCell: number = 41;
        let numberCell: number = 35;
        let otherMonthCell: number = 6;
        let row: number = count;
        let rowCount: number = 0;
        for (let dayCell: number = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = this.calendarInstance.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowCount = 0 + rowCount; rowCount < row; rowCount++) {
                if (!elements[rowCount].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowCount].children[0])) {
                    addClass([elements[rowCount].children[0]], [LINK]);
                    rippleEffect(<HTMLElement>elements[rowCount].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowCount]);
                if (this.calendarInstance.weekNumber &&
                    rowCount === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (!this.calendarInstance.weekNumber
                    && rowCount === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (this.calendarInstance.weekNumber) {
                    if (rowCount === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                } else {
                    if (rowCount === numberCell && elements[numberCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
            }
            row = row + count;
            rowCount = rowCount + 0;
            this.calendarInstance.tableBodyElement.appendChild(trEle);
        }
        this.calendarInstance.table.querySelector('tbody').className = this.calendarInstance.effect;
        this.islamicIconHandler();

        if (view !== this.calendarInstance.getViewNumber(this.calendarInstance.currentView())
            || (view === 0 && view !== this.calendarInstance.getViewNumber(this.calendarInstance.currentView()))) {
            this.calendarInstance.navigateHandler(e);
        }
        this.calendarInstance.setAriaActiveDescendant();
        this.calendarInstance.changedArgs = { value: this.calendarInstance.value, values: this.calendarInstance.values };
        this.calendarInstance.changeHandler();
    }

    public islamicCompareMonth(start: Date, end: Date): number {
        /* tslint:disable-next-line:no-any */
        let hijriStart: any = <any>(this.getIslamicDate(start));
        /* tslint:disable-next-line:no-any */
        let hijriEnd: any = <any>(this.getIslamicDate(end));
        let result: number;
        if (hijriStart.year > hijriEnd.year) {
            result = 1;
        } else if (hijriStart.year < hijriEnd.year) {
            result = -1;
        } else {
            result = hijriStart.month === hijriEnd.month ? 0 : hijriStart.month > hijriEnd.month ? 1 : -1;
        }
        return result;
    };

    public islamicCompare(startDate: Date, endDate: Date, modifier: number): number {
        /* tslint:disable-next-line:no-any */
        let hijriStart: any = <any>this.getIslamicDate(startDate);
        /* tslint:disable-next-line:no-any */
        let hijriEnd: any = <any>this.getIslamicDate(endDate);
        let start: number = hijriEnd.year;
        let end: number;
        let result: number;
        end = start;
        result = 0;
        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }
        if (hijriStart.year > end) {
            result = 1;
        } else if ((this.calendarInstance.currentView() === 'Decade') && hijriStart.year < start &&
            !((startDate.getFullYear() >= minDecade && startDate.getFullYear() <= maxDecade))) {
            result = -1;
        } else if (hijriStart.year < start && (this.calendarInstance.currentView() === 'Year')) {
            result = -1;
        }
        return result;
    };
    /* tslint:disable-next-line:no-any */
    public getIslamicDate(date: Date): any {
        /* tslint:disable-next-line:no-any */
        return <any>(HijriParser.getHijriDate(date));
    }
    public toGregorian(year: number, month: number, date: number): Date {
        return HijriParser.toGregorian(year, month, date);
    }

    public hijriCompareYear(start: Date, end: Date): number {
        return this.islamicCompare(start, end, 0);
    }

    public hijriCompareDecade(start: Date, end: Date): number {
        return this.islamicCompare(start, end, 10);

    };
    public destroy(): void {
        this.calendarInstance = null;
    }
}
export interface IslamicDateArgs {
    year: number;
    date: number;
    month: number;
}
