/**
 *
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventHandler, Internationalization, KeyboardEventArgs } from '@syncfusion/ej2-base';
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
const minDecade: number = 2058;
const maxDecade: number = 2069;
export class Islamic {
    public constructor(instance: Calendar) {
        this.calendarInstance = instance;
    }

    private calendarInstance: any;
    public getModuleName(): string {
        return 'islamic';
    }

    public islamicTitleUpdate(date: Date, view: string): void {
        const globalize: Internationalization = new Internationalization(this.calendarInstance.locale);
        switch (view) {
        case 'days':
            this.calendarInstance.headerTitleElement.textContent = globalize.formatDate(
                date, { type: 'dateTime', format: 'MMMMyyyy', calendar: 'islamic' });
            break;
        case 'months':
            this.calendarInstance.headerTitleElement.textContent = globalize.formatDate(
                date, { type: 'dateTime', format: 'yyyy', calendar: 'islamic' });
        }
    }
    public islamicRenderDays(currentDate: Date, value?: Date, multiSelection?: boolean, values?: Date[]): HTMLElement[] {
        const tdEles: HTMLElement[] = [];
        const cellsCount: number = 42;
        let localDate: Date = new Date(this.islamicInValue(currentDate));
        let minMaxDate: Date;
        this.islamicTitleUpdate(currentDate, 'days');
        const islamicDate: any = this.getIslamicDate(localDate);
        const gregorianObject: Date = this.toGregorian(islamicDate.year, islamicDate.month, 1);
        const currentMonth: number = islamicDate.month;
        localDate = gregorianObject;
        while (localDate.getDay() !== this.calendarInstance.firstDayOfWeek) {
            this.calendarInstance.setStartDate(localDate, -1 * dayMilliSeconds);
        }
        for (let day: number = 0; day < cellsCount; ++day) {
            const weekEle: HTMLElement = this.calendarInstance.createElement('td', { className: CELL });
            const weekAnchor: HTMLElement = this.calendarInstance.createElement('span');
            if (day % 7 === 0 && this.calendarInstance.weekNumber) {
                weekAnchor.textContent = '' + this.calendarInstance.getWeek(localDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.calendarInstance.minMaxDate(localDate);
            const dateFormatOptions: object = { type: 'dateTime', skeleton: 'full', calendar: 'islamic' };
            const date: Date = this.calendarInstance.globalize.parseDate(
                this.calendarInstance.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            const tdEle: HTMLElement = this.islamicDayCell(localDate);
            const title: string = this.calendarInstance.globalize.formatDate(
                localDate, { type: 'date', skeleton: 'full', calendar: 'islamic' });
            const dayLink: HTMLElement = this.calendarInstance.createElement('span');
            dayLink.textContent = this.calendarInstance.globalize.formatDate(
                localDate, { type: 'date', skeleton: 'd', calendar: 'islamic' });
            const disabled: boolean = (this.calendarInstance.min > localDate) || (this.calendarInstance.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
            } else {
                dayLink.setAttribute('title', '' + title);
            }
            const hijriMonthObject: any = this.getIslamicDate(localDate);
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
            const argument: RenderDayCellEventArgs = this.calendarInstance.renderDayCellArgs;
            this.calendarInstance.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                if (this.calendarInstance.isMultiSelection) {
                    if (!isNullOrUndefined(this.calendarInstance.values) && this.calendarInstance.values.length > 0) {
                        for (let index: number = 0; index < values.length; index++) {
                            const localDateString: number = +new Date(this.calendarInstance.globalize.formatDate(
                                argument.date, { type: 'date', skeleton: 'yMd', calendar: 'islamic' }));
                            const tempDateString: number = +new Date(this.calendarInstance.globalize.formatDate(
                                this.calendarInstance.values[index as number], { type: 'date', skeleton: 'yMd', calendar: 'islamic' }));
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
            const otherMnthBool: boolean = tdEle.classList.contains(OTHERMONTH);
            const disabledCls: boolean = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
            }
            if (this.calendarInstance.isMultiSelection && !isNullOrUndefined(this.calendarInstance.values) &&
                !otherMnthBool && !disabledCls) {
                for (let tempValue: number = 0; tempValue < this.calendarInstance.values.length; tempValue++) {
                    const localDateString: string = this.calendarInstance.globalize.formatDate(
                        localDate, { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    const tempDateString: string = this.calendarInstance.globalize.formatDate(
                        this.calendarInstance.values[tempValue as number], { type: 'date', skeleton: 'short', calendar: 'islamic' });
                    if (localDateString === tempDateString &&
                        this.calendarInstance.getDateVal(localDate, this.calendarInstance.values[tempValue as number])) {
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
        new Date(this.islamicInValue(this.calendarInstance.currentDate)).setDate(1);
        const date: Date = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        switch (this.calendarInstance.currentView()) {
        case 'Month': {
            const prevMonthCompare: boolean =
                    this.islamicCompareMonth(date, this.calendarInstance.min) < 1;
            const nextMonthCompare: boolean =
                    this.islamicCompareMonth(date, this.calendarInstance.max) > -1;
            this.calendarInstance.previousIconHandler(prevMonthCompare);
            this.calendarInstance.nextIconHandler(nextMonthCompare);
        }
            break;
        case 'Year': {
            const prevYearCompare: boolean =
                    this.hijriCompareYear(date, this.calendarInstance.min) < 1;
            const nextYearCompare: boolean =
                    this.hijriCompareYear(date, this.calendarInstance.max) > -1;
            this.calendarInstance.previousIconHandler(prevYearCompare);
            this.calendarInstance.nextIconHandler(nextYearCompare);
        }
            break;
        case 'Decade': {
            const startIslamicYear: number = 1361;
            const gregorianValue: Date = HijriParser.toGregorian(startIslamicYear, 1, 1);
            let prevDecadeCompare: boolean =
                    this.hijriCompareDecade(date, this.calendarInstance.min) < 1;
            const nextDecadeCompare: boolean =
                    this.hijriCompareDecade(date, this.calendarInstance.max) > -1;
            prevDecadeCompare = HijriParser.toGregorian(this.calendarInstance.headerTitleElement.textContent.split('-')[0].trim(), 1, 1).getFullYear() === gregorianValue.getFullYear() ? true : prevDecadeCompare;
            this.calendarInstance.previousIconHandler(prevDecadeCompare);
            this.calendarInstance.nextIconHandler(nextDecadeCompare);
        }
        }
    }
    public islamicNext(): void {
        this.calendarInstance.effect = '';
        const view: number = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        const islamicDate: any = this.getIslamicDate(this.calendarInstance.currentDate);
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
            this.calendarInstance.nextIconClicked = true;
            if (islamicDate.year - this.calendarInstance.headerElement.textContent.split('-')[0].trim() === 1) {
                islamicDate.year = islamicDate.year - this.calendarInstance.headerElement.textContent.split('-')[0].trim() === 1 ? islamicDate.year + 1 : islamicDate.year;
            }
            this.calendarInstance.currentDate = this.toGregorian(islamicDate.year + 10, islamicDate.month, 1);
            this.calendarInstance.switchView(view);
            break;
        }
    }
    public islamicPrevious(): void {
        const currentView: number = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        this.calendarInstance.effect = '';
        const islamicDate: any = this.getIslamicDate(this.calendarInstance.currentDate);
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
            this.calendarInstance.previousIconClicked = true;
            this.calendarInstance.currentDate = this.toGregorian(islamicDate.year - 10, islamicDate.month - 1, 1);
            this.calendarInstance.switchView(currentView);
            break;
        }
    }

    public islamicRenderYears(e?: Event, value?: Date): void {
        this.calendarInstance.removeTableHeadElement();
        const numCells: number = 4;
        const tdEles: HTMLElement[] = [];
        const valueUtil: boolean = isNullOrUndefined(value);
        const curDate: Date = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        let localDate: Date = curDate;
        const islamicDate: any = this.getIslamicDate(localDate);
        const gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, 1, 1);
        localDate = gregorianObject;
        const mon: number = islamicDate.month;
        const yr: number = islamicDate.year;
        const curYrs: number = islamicDate.year;
        const minYr: number = (<any>(this.getIslamicDate(this.calendarInstance.min))).year;
        const minMonth: number = (<any>(this.getIslamicDate(this.calendarInstance.min))).month;
        const maxYr: number = (<any>(this.getIslamicDate(this.calendarInstance.max))).year;
        const maxMonth: number = (<any>(this.getIslamicDate(this.calendarInstance.max))).month;
        this.islamicTitleUpdate(this.calendarInstance.currentDate, 'months');
        for (let month: number = 1; month <= 12; ++month) {
            const islamicDate: any = this.getIslamicDate(localDate);
            const gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, month, 1);
            localDate = gregorianObject;
            const tdEle: HTMLElement = this.islamicDayCell(localDate);
            const dayLink: HTMLElement = this.calendarInstance.createElement('span');
            const localMonth: boolean = (value &&
                (<any>(this.getIslamicDate(value))).month === (<any>(this.getIslamicDate(localDate))).month);
            const select: boolean = (value && (<any>(this.getIslamicDate(value))).year === yr && localMonth);
            dayLink.textContent = this.calendarInstance.globalize.formatDate(
                localDate, { type: 'dateTime', format: 'MMM', calendar: 'islamic' });
            if ((this.calendarInstance.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (
                this.calendarInstance.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                addClass([tdEle], DISABLED);
            } else if (!valueUtil && select) {
                addClass([tdEle], SELECTED);
            } else {
                if ((<any>(this.getIslamicDate(localDate))).month === mon &&
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
        const numCells: number = 4;
        const yearCell: number = 12;
        const tdEles: HTMLElement[] = [];
        let localDate: Date = new Date(this.islamicInValue(this.calendarInstance.currentDate));
        let islamicDate: any = this.getIslamicDate(localDate);
        const gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, 1, 1);
        localDate = gregorianObject;
        const localYr: number = localDate.getFullYear();
        const startYr: Date = new Date(this.islamicInValue((localYr - localYr % 10)));
        const endYr: Date = new Date(this.islamicInValue((localYr - localYr % 10 + (10 - 1))));
        let startFullYr: number = startYr.getFullYear();
        let endFullYr: number = endYr.getFullYear();
        let startHdrYr: any = this.calendarInstance.globalize.formatDate(
            startYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
        let endHdrYr: any = this.calendarInstance.globalize.formatDate(endYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
        if (islamicDate.year % 10 === 1) {
            startHdrYr = islamicDate.year;
            endHdrYr = islamicDate.year + 9;
        }
        else if (islamicDate.year % 10 > 1 ) {
            startHdrYr = islamicDate.year - ((islamicDate.year % 10) - 1);
            endHdrYr = startHdrYr + 9;
        }
        else if (islamicDate.year % 10 === 0) {
            startHdrYr = islamicDate.year - 9;
            endHdrYr = islamicDate.year;
        }
        if (this.calendarInstance.locale === 'ar') {
            startHdrYr = Number(startHdrYr.toString().replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d: any) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48)));
            endHdrYr = Number(endHdrYr.toString().replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d: any) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48)));
        }
        const splityear: any = this.calendarInstance.headerElement.textContent.split('-');
        if ((!isNullOrUndefined(e) && (splityear[0] !== startHdrYr) && (e as KeyboardEventArgs).action === 'home') ||
            (!isNullOrUndefined(e) && e.type === 'keydown' && (e as KeyboardEventArgs).action === 'end')) {
            startHdrYr = this.calendarInstance.headerElement.textContent.split('-')[0].trim();
            endHdrYr = this.calendarInstance.headerElement.textContent.split('-')[1].trim();
        }
        if (this.calendarInstance.islamicPreviousHeader) {
            startHdrYr = this.calendarInstance.islamicPreviousHeader.split('-')[0].trim();
            endHdrYr = this.calendarInstance.islamicPreviousHeader.split('-')[1].trim();
            this.calendarInstance.islamicPreviousHeader = null;
        }
        if (this.calendarInstance.previousIconClicked) {
            let i: number = 0;
            for (i = 0; i <= splityear.length; i++) {
                endHdrYr = endHdrYr - splityear[i as number] === 2 || splityear[i as number]
                 - endHdrYr === 2 ? (parseInt(endHdrYr, 10) + 1).toString() :
                    endHdrYr - splityear[i as number] === 3 || splityear[i as number] - endHdrYr === 3 ?
                        (parseInt(endHdrYr, 10) + 2).toString() : endHdrYr - splityear[i as number] === 4 ||
                    splityear[i as number] - endHdrYr === 4 ? (parseInt(endHdrYr, 10) + 3).toString() :
                            endHdrYr - splityear[i as number] === 5 || splityear[i as number] - endHdrYr === 5 ?
                                (parseInt(endHdrYr, 10) + 4).toString() : endHdrYr;
                if (endHdrYr - splityear[i as number] === 0 || splityear[i as number] - endHdrYr === 0) {
                    endHdrYr = (parseInt(endHdrYr, 10) - 1).toString();
                }
            }
            if (endHdrYr - splityear[i as number] === 8 || splityear[i as number] - endHdrYr === 8) {
                endHdrYr = (parseInt(endHdrYr, 10) - 9).toString();
                startHdrYr = (parseInt(endHdrYr, 10) - 9).toString();
            }
            if (endHdrYr - splityear[i as number] === 7 || splityear[i as number] - endHdrYr === 7) {
                endHdrYr = (parseInt(endHdrYr, 10) - 8).toString();
                startHdrYr = (parseInt(endHdrYr, 10) - 9).toString();
            }
            startHdrYr = endHdrYr - startHdrYr === 10
                ? (parseInt(startHdrYr, 10) + 1).toString() : endHdrYr - startHdrYr === 11
                    ? (parseInt(startHdrYr, 10) + 2).toString() : endHdrYr - startHdrYr === 12
                        ? (parseInt(startHdrYr, 10) + 3).toString() : startHdrYr;
            if (endHdrYr - startHdrYr === 8) {
                startHdrYr = (parseInt(startHdrYr, 10) - 1).toString();
            }
        }
        if (this.calendarInstance.nextIconClicked) {
            for (let i: number = 0; i <= splityear.length; i++) {
                if (startHdrYr - splityear[i as number] === 0 || splityear[i as number] - startHdrYr === 0) {
                    startHdrYr = (parseInt(startHdrYr, 10) + 1).toString();
                }
                if (startHdrYr - splityear[i as number] === 2 && startHdrYr > splityear[i as number].trim()) {
                    startHdrYr = (parseInt(startHdrYr, 10) - 1).toString();
                }
                if (splityear[i as number] - startHdrYr === 1 && startHdrYr < splityear[i as number].trim()) {
                    startHdrYr = (parseInt(startHdrYr, 10) + 2).toString();
                }
            }
            if (startHdrYr - this.calendarInstance.headerTitleElement.textContent.split('-')[1].trim() > 1) {
                startHdrYr = (parseInt(this.calendarInstance.headerTitleElement.textContent.split('-')[1].trim(), 10) + 1).toString();
                endHdrYr = (parseInt(startHdrYr, 10) + 9).toString();
            }
            endHdrYr = endHdrYr - startHdrYr === 10 ? (parseInt(endHdrYr, 10) - 1).toString() : endHdrYr;
            endHdrYr = endHdrYr - startHdrYr === 7
                ? (parseInt(endHdrYr, 10) + 2).toString() : endHdrYr - startHdrYr === 8
                    ? (parseInt(endHdrYr, 10) + 1).toString() : endHdrYr;
        }
        if (this.calendarInstance.locale === 'ar'){
            const startHeaderYear: any =
            this.calendarInstance.globalize.formatDate(startYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
            const endHeaderYear: any =
            this.calendarInstance.globalize.formatDate(endYr, { type: 'dateTime', format: 'y', calendar: 'islamic' });
            this.calendarInstance.headerTitleElement.textContent = startHeaderYear + ' - ' + (endHeaderYear);
        } else {
            this.calendarInstance.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        }
        this.calendarInstance.nextIconClicked = this.calendarInstance.previousIconClicked = false;
        const year: any = (parseInt(startHdrYr, 10) - 2).toString();
        startFullYr = Math.round(parseInt(startHdrYr, 10) * 0.97 + 622);
        endFullYr = Math.round(parseInt(endHdrYr, 10) * 0.97 + 622);
        const startYear: number = Math.round(parseInt(year, 10) * 0.97 + 622);
        for (let rowCount: number = 1; rowCount <= yearCell; ++rowCount) {
            const year: number = startYear + rowCount;
            localDate.setFullYear(year);
            localDate.setDate(1);
            localDate.setMonth(0);
            if ((this.getIslamicDate(localDate).year - islamicDate.year) > 1) {
                localDate.setMonth(1);
                rowCount = rowCount - 1;
                localDate.setFullYear(localDate.getFullYear() - 1);
            }
            islamicDate = this.getIslamicDate(localDate);
            const gregorianObject: Date = HijriParser.toGregorian(islamicDate.year, 1, 1);
            localDate = gregorianObject;
            if (islamicDate.year === parseInt(startHdrYr, 10) - 1 || islamicDate.year >= startHdrYr &&
             islamicDate.year <= endFullYr || islamicDate.year === parseInt(endHdrYr, 10) + 1) {
                const tdEle: HTMLElement = this.islamicDayCell(localDate);
                attributes(tdEle, { 'role': 'gridcell' });
                const dayLink: HTMLElement = this.calendarInstance.createElement('span');
                dayLink.textContent = this.calendarInstance.globalize.formatDate(
                    localDate, { type: 'dateTime', format: 'y', calendar: 'islamic' });
                if (islamicDate.year === parseInt(startHdrYr, 10) - 1 || (year < startFullYr) ||
                 (year > endFullYr) && islamicDate.year !== parseInt(endHdrYr, 10)) {
                    addClass([tdEle], OTHERMONTH);
                    if (year <= new Date(this.islamicInValue(this.calendarInstance.min)).getFullYear()
                    || year >= new Date(this.islamicInValue(this.calendarInstance.max)).getFullYear()) {
                        addClass([tdEle], DISABLED);
                    }
                } else if (year < new Date(this.islamicInValue(this.calendarInstance.min)).getFullYear()
                || year > new Date(this.islamicInValue(this.calendarInstance.max)).getFullYear()) {
                    addClass([tdEle], DISABLED);
                } else if (!isNullOrUndefined(value) &&
                (<any>(this.getIslamicDate(localDate))).year ===
                (<any>(this.getIslamicDate(value))).year) {
                    addClass([tdEle], SELECTED);
                } else {
                    if (this.getIslamicDate(localDate).year === this.getIslamicDate(this.calendarInstance.currentDate).year &&
                     !tdEle.classList.contains(DISABLED)) {
                        addClass([tdEle], FOCUSEDDATE);
                    }
                }
                if (!tdEle.classList.contains(DISABLED)) {
                    EventHandler.add(tdEle, 'click', this.calendarInstance.clickHandler, this.calendarInstance);
                }
                tdEle.appendChild(dayLink);
                if ((!isNullOrUndefined(e) && (e as KeyboardEventArgs).action === 'home' && islamicDate.year.toString() === startHdrYr) || (!isNullOrUndefined(e) && (e as KeyboardEventArgs).action === 'end' && islamicDate.year.toString() === endHdrYr)) {
                    addClass([tdEle], FOCUSEDDATE);
                }
                tdEles.push(tdEle); }
        }
        this.islamicRenderTemplate(tdEles, numCells, 'e-decade', e, value);
    }
    public islamicDayCell(localDate: Date): HTMLElement {
        const dateFormatOptions: object = { skeleton: 'full', type: 'dateTime', calendar: 'islamic' };
        const formatDate: string = this.calendarInstance.globalize.formatDate(localDate, dateFormatOptions);
        const date: Date = this.calendarInstance.globalize.parseDate(formatDate, dateFormatOptions);
        const value: number = date.valueOf();
        const attrs: Object = {
            className: CELL, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return this.calendarInstance.createElement('td', attrs);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public islamicRenderTemplate(elements: HTMLElement[], count: number, classNm: string, e?: Event, value?: Date): void {
        const view: number = this.calendarInstance.getViewNumber(this.calendarInstance.currentView());
        let trEle: HTMLElement;
        this.calendarInstance.tableBodyElement = this.calendarInstance.createElement('tbody');
        this.calendarInstance.table.appendChild(this.calendarInstance.tableBodyElement);
        removeClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [MONTH, DECADE, YEAR]);
        addClass([this.calendarInstance.contentElement, this.calendarInstance.headerElement], [classNm]);
        const weekNumCell: number = 41;
        const numberCell: number = 35;
        const otherMonthCell: number = 6;
        let row: number = count;
        let rowCount: number = 0;
        for (let dayCell: number = 0; dayCell < Math.round(elements.length / count); ++dayCell) {
            trEle = this.calendarInstance.createElement('tr', { attrs: { 'role': 'row' } });
            for (rowCount = 0 + rowCount; rowCount < row; rowCount++) {
                if (!elements[rowCount as number].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowCount as number].children[0])) {
                    addClass([elements[rowCount as number].children[0]], [LINK]);
                    rippleEffect(<HTMLElement>elements[rowCount as number].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowCount as number]);
                if (this.calendarInstance.weekNumber &&
                    rowCount === otherMonthCell + 1 && elements[otherMonthCell + 1].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (!this.calendarInstance.weekNumber
                    && rowCount === otherMonthCell && elements[otherMonthCell as number].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (this.calendarInstance.weekNumber) {
                    if (rowCount === weekNumCell && elements[weekNumCell as number].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                } else {
                    if (rowCount === numberCell && elements[numberCell as number].classList.contains(OTHERMONTH)) {
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
        const hijriStart: any = <any>(this.getIslamicDate(start));
        const hijriEnd: any = <any>(this.getIslamicDate(end));
        let result: number;
        if (hijriStart.year > hijriEnd.year) {
            result = 1;
        } else if (hijriStart.year < hijriEnd.year) {
            result = -1;
        } else {
            result = hijriStart.month === hijriEnd.month ? 0 : hijriStart.month > hijriEnd.month ? 1 : -1;
        }
        return result;
    }

    public islamicCompare(startDate: Date, endDate: Date, modifier: number): number {
        const hijriStart: any = <any>this.getIslamicDate(startDate);
        const hijriEnd: any = <any>this.getIslamicDate(endDate);
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
    }
    public getIslamicDate(date: Date): any {
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

    }
    public destroy(): void {
        this.calendarInstance = null;
    }
    protected islamicInValue(inValue: string | Date | number): string {
        if (inValue instanceof Date) {
            return (inValue.toUTCString());
        } else {
            return ('' + inValue);
        }
    }
}
export interface IslamicDateArgs {
    year: number
    date: number
    month: number
}
/* eslint-enable @typescript-eslint/no-explicit-any */
