import { isNullOrUndefined, L10n, getDefaultDateObject, getValue, cldrData } from '@syncfusion/ej2-base';
import { MS_PER_DAY } from '../schedule/base/util';

/**
 * Date Generator from Recurrence Rule
 */
export function generateSummary(rule: string, localeObject: L10n, locale: string): string {
    let ruleObject: RecRule = extractObjectFromRule(rule);
    let summary: string = localeObject.getConstant(EVERY) + ' ';
    let cldrObj: string[];
    let cldrObj1: string[];
    if (locale === 'en' || locale === 'en-US') {
        cldrObj1 = <string[]>(getValue('months.stand-alone.abbreviated', getDefaultDateObject()));
        cldrObj = <string[]>(getValue('days.stand-alone.abbreviated', getDefaultDateObject()));
    } else {
        cldrObj1 = <string[]>(getValue('main.' + '' + locale + '.dates.calendars.gregorian.months.stand-alone.abbreviated', cldrData));
        cldrObj = <string[]>(getValue('main.' + '' + locale + '.dates.calendars.gregorian.days.stand-alone.abbreviated', cldrData));
    }
    if (ruleObject.interval > 1) {
        summary += ruleObject.interval + ' ';
    }
    switch (ruleObject.freq) {
        case 'DAILY':
            summary += localeObject.getConstant(DAYS);
            break;
        case 'WEEKLY':
            summary += localeObject.getConstant(WEEKS) + ' ' + localeObject.getConstant(ON) + ' ';
            ruleObject.day.forEach((day: string, index: number) => {
                summary += getValue(DAYINDEXOBJECT[day], cldrObj);
                summary += (((ruleObject.day.length - 1) === index) ? '' : ', ');
            });
            break;
        case 'MONTHLY':
            summary += localeObject.getConstant(MONTHS) + ' ' + localeObject.getConstant(ON) + ' ';
            summary += getMonthSummary(ruleObject, cldrObj, localeObject);
            break;
        case 'YEARLY':
            summary += localeObject.getConstant(YEARS) + ' ' + localeObject.getConstant(ON) + ' ';
            summary += getValue((ruleObject.month[0]).toString(), cldrObj1) + ' ';
            summary += getMonthSummary(ruleObject, cldrObj, localeObject);
            break;
    }
    if (ruleObject.count) {
        summary += ', ' + (ruleObject.count) + ' ' + localeObject.getConstant(TIMES);
    } else if (ruleObject.until) {
        let tempDate: Date = ruleObject.until;
        summary += ', ' + localeObject.getConstant(UNTIL)
            + ' ' + tempDate.getDate()
            + ' ' + getValue((tempDate.getMonth() + 1).toString(), cldrObj1)
            + ' ' + tempDate.getFullYear();
    }
    return summary;
}
function getMonthSummary(ruleObject: RecRule, cldrObj: string[], localeObj: L10n, ): string {
    let summary: string = '';
    if (ruleObject.monthDay.length) {
        summary += ruleObject.monthDay[0];
    } else if (ruleObject.day) {
        let pos: number = ruleObject.setPosition - 1;
        summary += localeObj.getConstant(WEEKPOS[pos > -1 ? pos : (WEEKPOS.length - 1)])
            + ' ' + getValue(DAYINDEXOBJECT[ruleObject.day[0]], cldrObj);
    }
    return summary;
}
export function generate(
    startDate: Date,
    rule: string,
    excludeDate: string,
    startDayOfWeek: number,
    maximumCount: number = MAXOCCURRENCE,
    viewDate: Date = null): number[] {
    let ruleObject: RecRule = extractObjectFromRule(rule);
    let cacheDate: Date;
    let data: number[] = [];
    let modifiedDate: Date = new Date(startDate.getTime());
    if (viewDate && viewDate > startDate && !ruleObject.count) {
        tempViewDate = new Date(new Date(viewDate.getTime()).setHours(0, 0, 0));
    } else {
        tempViewDate = null;
    }
    if (!ruleObject.until && tempViewDate) {
        cacheDate = new Date(tempViewDate.getTime());
        cacheDate.setDate(tempViewDate.getDate() + 42 * (ruleObject.interval));
        ruleObject.until = cacheDate;
    }
    if (ruleObject.until && startDate > ruleObject.until) {
        return data;
    }
    maxOccurrence = maximumCount;
    setFirstDayOfWeek(DAYINDEX[startDayOfWeek]);
    tempExcludeDate = [];
    let tempDate: string[] = isNullOrUndefined(excludeDate) ? [] : excludeDate.split(',');
    tempDate.forEach((content: string) => {
        let parsedDate: Date = getDateFromRecurrenceDateString(content);
        tempExcludeDate.push(new Date(parsedDate.getTime()).setHours(0, 0, 0, 0));
    });
    switch (ruleObject.freq) {
        case 'DAILY':
            dailyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'WEEKLY':
            weeklyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'MONTHLY':
            monthlyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'YEARLY':
            yearlyType(modifiedDate, ruleObject.until, data, ruleObject);
    }
    return data;
}

function getDateFromRecurrenceDateString(recDateString: string): Date {
    return new Date(recDateString.substr(0, 4) +
        '-' + recDateString.substr(4, 2) +
        '-' + recDateString.substr(6, 5) +
        ':' + recDateString.substr(11, 2) +
        ':' + recDateString.substr(13));
}

function excludeDateHandler(data: number[], date: number): void {
    let zeroIndex: number = new Date(date).setHours(0, 0, 0, 0);
    if (tempExcludeDate.indexOf(zeroIndex) === -1 && (!tempViewDate || zeroIndex >= tempViewDate.getTime())) {
        data.push(date);
    }
}

function dailyType(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let tempDate: Date = new Date(startDate.getTime());
    let interval: number = ruleObject.interval;
    let expectedCount: Number = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state: boolean;
    while (compareDates(tempDate, endDate)) {
        state = true;
        state = validateRules(tempDate, ruleObject);
        if (state) {
            excludeDateHandler(data, tempDate.getTime());
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
        }
        tempDate.setDate(tempDate.getDate() + interval);
    }
}

function weeklyType(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let tempDate: Date = getStartDateForWeek(startDate, ruleObject.day);
    let interval: number = ruleObject.interval;
    let expectedDays: string[] = ruleObject.day;
    let expectedCount: Number = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state: boolean;
    let dayCycleData: { [key: string]: number } = processWeekDays(expectedDays);
    while (compareDates(tempDate, endDate)) {
        state = true;
        state = validateRules(tempDate, ruleObject);
        if (state) {
            excludeDateHandler(data, tempDate.getTime());
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
        }
        if (expectedDays.length > 1) {
            tempDate.setDate(
                tempDate.getDate()
                + dayCycleData[DAYINDEX[tempDate.getDay()]]
                + ((expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) === expectedDays.length - 1) ?
                    ((interval - 1) * 7) : 0));
        } else {
            tempDate.setDate(
                tempDate.getDate()
                + (interval * 7));
        }
    }
}

function monthlyType(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let ruleType: MonthlyType = validateMonthlyRuleType(ruleObject);
    switch (ruleType) {
        case 'day':
            monthlyDayTypeProcess(startDate, endDate, data, ruleObject);
            break;
        case 'both':
        case 'date':
            monthlyDateTypeProcess(startDate, endDate, data, ruleObject);
            break;
    }
}

function yearlyType(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let typeValue: YearRuleType = checkYearlyType(ruleObject);
    switch (typeValue) {
        case 'MONTH':
            monthlyType(startDate, endDate, data, ruleObject);
            break;
        case 'WEEKNO':
            processWeekNo(startDate, endDate, data, ruleObject);
            break;
        case 'YEARDAY':
            processYearDay(startDate, endDate, data, ruleObject);
            break;
    }
}

function processWeekNo(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let stDate: Date = new Date(startDate.getFullYear(), 0, 0);
    let tempDate: Date;
    let expectedCount: Number = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state: boolean;
    let startDay: number;
    let firstWeekSpan: number;
    let weekNos: number[] = ruleObject.weekNo;
    let weekNo: number;
    let maxDate: number;
    let minDate: number;
    while (compareDates(stDate, endDate)) {
        startDay = dayIndex.indexOf(DAYINDEX[stDate.getDay()]);
        firstWeekSpan = (6 - startDay) + 1;
        for (let index: number = 0; index < weekNos.length; index++) {
            weekNo = weekNos[index];
            weekNo = (weekNo > 0) ? weekNo : 53 + weekNo + 1;
            maxDate = (weekNo === 1) ? firstWeekSpan : firstWeekSpan + ((weekNo - 1) * 7);
            minDate = (weekNo === 1) ? firstWeekSpan - 7 : firstWeekSpan + ((weekNo - 2) * 7);
            while (minDate < maxDate) {
                tempDate = new Date(stDate.getTime() + (MS_PER_DAY * minDate));
                state = validateRules(tempDate, ruleObject);
                if ((tempDate >= startDate) && state && compareDates(tempDate, endDate)) {
                    excludeDateHandler(data, tempDate.getTime());
                    if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                        return;
                    }
                }
                minDate++;
            }
        }
        stDate = new Date(tempDate.getFullYear() + ruleObject.interval, 0, 0);
    }
}

function processYearDay(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let stDate: Date = new Date(startDate.getFullYear(), 0, 0);
    let tempDate: Date;
    let expectedCount: Number = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state: boolean;
    let date: number;
    while (compareDates(stDate, endDate)) {
        for (let index: number = 0; index < ruleObject.yearDay.length; index++) {
            date = ruleObject.yearDay[index];
            tempDate = new Date(stDate.getTime());
            if ((date === LEAPYEAR || date === -LEAPYEAR) && ((tempDate.getFullYear() + 1) % 4 !== 0)) {
                tempDate.setDate(tempDate.getDate() + 1);
                continue;
            }
            tempDate.setDate(tempDate.getDate() + ((date < 0) ? getMaxYearDay(tempDate.getFullYear() + 1) + 1 + date : date));
            state = validateRules(tempDate, ruleObject);
            if ((tempDate >= startDate) && state && compareDates(tempDate, endDate)) {
                excludeDateHandler(data, tempDate.getTime());
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    return;
                }
            }
        }
        stDate = new Date(tempDate.getFullYear() + ruleObject.interval, 0, 0);
    }
}

function getMaxYearDay(date: number): number {
    return (date % 4 === 0) ? LEAPYEAR : NORMALYEAR;
}

function checkYearlyType(ruleObject: RecRule): YearRuleType {
    if (ruleObject.yearDay.length) {
        return 'YEARDAY';
    } else if (ruleObject.weekNo.length) {
        return 'WEEKNO';
    }
    return 'MONTH';
}

function monthlyDateTypeProcess(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let tempDate: Date = new Date(startDate.getTime());
    let mainDate: Date = new Date(startDate.getTime());
    let expectedCount: Number = ruleObject.count ? ruleObject.count : maxOccurrence;
    let interval: number = ruleObject.interval;
    let monthInit: number = 0;
    let date: number;
    let state: boolean;
    tempDate.setDate(1);
    mainDate.setDate(1);
    if (ruleObject.month.length) {
        tempDate.setMonth(ruleObject.month[0] - 1);
    }
    while (compareDates(tempDate, endDate)) {
        for (let index: number = 0; index < ruleObject.monthDay.length; index++) {
            date = ruleObject.monthDay[index];
            let maxDate: number = (tempDate.getMonth() === 1) ?
                (tempDate.getFullYear() % 4 === 0 ? 29 : 28) : monthDay[tempDate.getMonth()];
            date = date > 0 ? date : (maxDate + date + 1);
            if ((date > 0) && validateProperDate(tempDate, date, mainDate)) {
                tempDate.setDate(date);
                if (endDate && tempDate > endDate) {
                    return;
                }
                state = validateRules(tempDate, ruleObject);
                if ((tempDate >= startDate) && state && compareDates(tempDate, endDate)) {
                    excludeDateHandler(data, tempDate.getTime());
                    if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                        return;
                    }
                }
            }
        }
        monthInit = setNextValidDate(tempDate, ruleObject, monthInit, interval);
    }
}

function setNextValidDate(tempDate: Date, ruleObject: RecRule, monthInit: number, interval: number, beginDate: Date = null): number {
    let monthData: number = beginDate ? beginDate.getMonth() : 0;
    tempDate.setDate(1);
    if (ruleObject.month.length) {
        monthInit++;
        monthInit = monthInit % ruleObject.month.length;
        tempDate.setMonth(ruleObject.month[monthInit] - 1);
        if (monthInit === 0) {
            tempDate.setFullYear(tempDate.getFullYear() + interval);
        }
    } else {
        if (beginDate && (beginDate.getFullYear() < tempDate.getFullYear())) {
            monthData = tempDate.getMonth() - 1;
        }
        tempDate.setMonth((beginDate ?
            monthData :
            tempDate.getMonth()) + interval);
    }
    return monthInit;
}

function monthlyDayTypeProcess(startDate: Date, endDate: Date, data: number[], ruleObject: RecRule): void {
    let tempDate: Date = new Date(startDate.getTime());
    let expectedDays: string[] = ruleObject.day;
    let expectedCount: Number = ruleObject.count ? ruleObject.count : maxOccurrence;
    let dayCycleData: { [key: string]: number } = processWeekDays(expectedDays);
    let interval: number = ruleObject.interval;
    let state: boolean;
    let monthCollection: number[][] = [];
    let weekCollection: number[] = [];
    let month: number;
    let index: number;
    let beginDate: Date;
    let monthInit: number = 0;
    tempDate.setDate(1);
    if (ruleObject.month.length) {
        tempDate.setMonth(ruleObject.month[0] - 1);
    }
    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    while (compareDates(tempDate, endDate)) {
        month = tempDate.getMonth();
        beginDate = new Date(tempDate.getTime());
        if (expectedDays.length > 1) {
            while (tempDate.getMonth() === month) {
                weekCollection.push(tempDate.getTime());
                if (DAYINDEX[tempDate.getDay()] === expectedDays[expectedDays.length - 1]) {
                    monthCollection.push(weekCollection);
                    weekCollection = [];
                }
                tempDate.setDate(
                    tempDate.getDate()
                    + dayCycleData[DAYINDEX[tempDate.getDay()]]);
            }
        } else {
            let currentMonthDate: Date = new Date(tempDate.getTime());
            while (currentMonthDate.getMonth() === month) {
                monthCollection.push([currentMonthDate.getTime()]);
                currentMonthDate.setDate(currentMonthDate.getDate() + (7));
            }
        }
        index = ((ruleObject.setPosition < 1) ? (monthCollection.length + ruleObject.setPosition) : ruleObject.setPosition - 1);
        if (ruleObject.setPosition === null) {
            index = 0;
            let datas: number[] = [];
            for (let week: number = 0; week < monthCollection.length; week++) {
                for (let row: number = 0; row < monthCollection[week].length; row++) {
                    datas.push(monthCollection[week][row]);
                }
            }
            monthCollection = [datas];
        }
        for (let week: number = 0; week < monthCollection[index].length; week++) {
            let dayData: number = monthCollection[index][week];
            let chDate: Date = new Date(dayData);
            state = validateRules(chDate, ruleObject);
            if ((chDate >= startDate) && compareDates(chDate, endDate) && state) {
                excludeDateHandler(data, dayData);
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    return;
                }
            }
        }
        monthInit = setNextValidDate(tempDate, ruleObject, monthInit, interval, beginDate);
        monthCollection = [];
        weekCollection = [];
        tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    }
}

function compareDates(startDate: Date, endDate: Date): boolean {
    return endDate ? (startDate <= endDate) : true;
}

function checkDayIndex(day: number, expectedDays: string[]): boolean {
    return (expectedDays.indexOf(DAYINDEX[day]) === -1);
}

function getStartDateForWeek(startDate: Date, expectedDays: string[]): Date {
    let tempDate: Date = new Date(startDate.getTime());
    if (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) === -1) {
        do {
            tempDate.setDate(tempDate.getDate() + 1);
        } while (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) === -1);
    }
    return tempDate;
}

export function extractObjectFromRule(rules: String): RecRule {
    let ruleObject: RecRule = {
        freq: null,
        interval: 1,
        count: null,
        until: null,
        day: [],
        month: [],
        weekNo: [],
        monthDay: [],
        yearDay: [],
        setPosition: null,
        validRules: []
    };
    let rulesList: string[] = rules.split(';');
    let splitData: string[] = [];
    let temp: string;
    rulesList.forEach((data: string) => {
        splitData = data.split('=');
        switch (splitData[0]) {
            case 'UNTIL':
                temp = splitData[1];
                ruleObject.until = getDateFromRecurrenceDateString(temp);
                break;
            case 'BYDAY':
                ruleObject.day = splitData[1].split(',');
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYMONTHDAY':
                ruleObject.monthDay = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYMONTH':
                ruleObject.month = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYYEARDAY':
                ruleObject.yearDay = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYWEEKNO':
                ruleObject.weekNo = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'INTERVAL':
                ruleObject.interval = parseInt(splitData[1], 10);
                break;
            case 'COUNT':
                ruleObject.count = parseInt(splitData[1], 10);
                break;
            case 'BYSETPOS':
                ruleObject.setPosition = parseInt(splitData[1], 10);
                break;
            case 'FREQ':
                ruleObject.freq = <FreqType>splitData[1];
                break;
        }
    });
    if ((ruleObject.freq === 'MONTHLY') && (ruleObject.monthDay.length === 0)) {
        let index: number = ruleObject.validRules.indexOf('BYDAY');
        ruleObject.validRules.splice(index, 1);
    }
    return ruleObject;
}

function validateProperDate(tempDate: Date, data: number, startDate: Date): boolean {
    let maxDate: number = (tempDate.getMonth() === 1) ? (tempDate.getFullYear() % 4 === 0 ? 29 : 28) : monthDay[tempDate.getMonth()];
    return (data <= maxDate) && (tempDate >= startDate);
}

function processWeekDays(expectedDays: string[]): { [key: string]: number } {
    let dayCycle: { [key: string]: number } = {};
    expectedDays.forEach((element: string, index: number) => {
        if (index === expectedDays.length - 1) {
            let startIndex: number = dayIndex.indexOf(element);
            let temp: number = startIndex;
            while (temp % 7 !== dayIndex.indexOf(expectedDays[0])) {
                temp++;
            }
            dayCycle[element] = temp - startIndex;
        } else {
            dayCycle[element] = dayIndex.indexOf(expectedDays[(<number>index + 1)]) - dayIndex.indexOf(element);
        }
    });
    return dayCycle;
}

function checkMonth(tempDate: Date, expectedMonth: Number[]): boolean {
    return (expectedMonth.indexOf(tempDate.getMonth() + 1) === -1);
}

function checkDate(tempDate: Date, expectedDate: Number[]): boolean {
    let temp: Number[] = expectedDate.slice(0);
    let data: Number;
    let maxDate: number = (tempDate.getMonth() === 1) ?
        (tempDate.getFullYear() % 4 === 0 ? 29 : 28) : monthDay[tempDate.getMonth()];
    data = temp.shift();
    while (data) {
        if (data < 0) {
            data = <number>data + maxDate + 1;
        }
        if (data === tempDate.getDate()) {
            return false;
        }
        data = temp.shift();
    }
    return true;
}

function checkYear(tempDate: Date, expectedyearDay: Number[]): boolean {
    let temp: Number[] = expectedyearDay.slice(0);
    let data: Number;
    let yearDay: Number = getYearDay(tempDate);
    data = temp.shift();
    while (data) {
        if (data < 0) {
            data = <number>data + getMaxYearDay(tempDate.getFullYear()) + 1;
        }
        if (data === yearDay) {
            return false;
        }
        data = temp.shift();
    }
    return true;
}

function getYearDay(currentDate: Date): Number {
    if (!startDateCollection[currentDate.getFullYear()]) {
        startDateCollection[currentDate.getFullYear()] = new Date(currentDate.getFullYear(), 0, 0);
    }
    let tempDate: Date = startDateCollection[currentDate.getFullYear()];
    let diff: number = currentDate.getTime() - tempDate.getTime();
    return Math.ceil(diff / MS_PER_DAY);
}

function validateMonthlyRuleType(ruleObject: RecRule): MonthlyType {
    if (ruleObject.monthDay.length && !ruleObject.day.length) {
        return 'date';
    } else if (!ruleObject.monthDay.length && ruleObject.day.length) {
        return 'day';
    }
    return 'both';
}

function rotate(days: string[]): void {
    let data: string = days.shift();
    days.push(data);
}

function setFirstDayOfWeek(day: string): void {
    while (dayIndex[0] !== day) {
        rotate(dayIndex);
    }
}

function validateRules(tempDate: Date, ruleObject: RecRule): boolean {
    let state: boolean = true;
    let expectedDays: string[] = ruleObject.day;
    let expectedMonth: Number[] = ruleObject.month;
    let expectedDate: Number[] = ruleObject.monthDay;
    let expectedyearDay: Number[] = ruleObject.yearDay;
    ruleObject.validRules.forEach((rule: string) => {
        switch (rule) {
            case 'BYDAY':
                if (checkDayIndex(tempDate.getDay(), expectedDays)) {
                    state = false;
                }
                break;
            case 'BYMONTH':
                if (checkMonth(tempDate, expectedMonth)) {
                    state = false;
                }
                break;
            case 'BYMONTHDAY':
                if (checkDate(tempDate, expectedDate)) {
                    state = false;
                }
                break;
            case 'BYYEARDAY':
                if (checkYear(tempDate, expectedyearDay)) {
                    state = false;
                }
                break;
        }
    });
    return state;
}


let startDateCollection: { [key: string]: Date } = {};

export interface RecRule {
    freq: FreqType;
    interval: number;
    count: Number;
    until: Date;
    day: string[];
    month: number[];
    weekNo: number[];
    monthDay: number[];
    yearDay: number[];
    setPosition: number;
    validRules: string[];
}

export type FreqType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type MonthlyType = 'date' | 'day' | 'both';
type YearRuleType = 'MONTH' | 'WEEKNO' | 'YEARDAY';
let tempExcludeDate: number[];
let dayIndex: string[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
let maxOccurrence: number;
let tempViewDate: Date;
const monthDay: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYINDEX: string[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MAXOCCURRENCE: number = 43;
const LEAPYEAR: number = 366;
const NORMALYEAR: number = 365;
const WEEKPOS: string[] = ['first', 'second', 'third', 'fourth', 'last'];
const TIMES: string = 'summaryTimes';
const ON: string = 'summaryOn';
const EVERY: string = 'every';
const UNTIL: string = 'summaryUntil';
const DAYS: string = 'summaryDay';
const WEEKS: string = 'summaryWeek';
const MONTHS: string = 'summaryMonth';
const YEARS: string = 'summaryYear';
const DAYINDEXOBJECT: { [key: string]: string } = {
    SU: 'sun',
    MO: 'mon',
    TU: 'tue',
    WE: 'wed',
    TH: 'thu',
    FR: 'fri',
    SA: 'sat'
};

export function getRecurrenceStringFromDate(date: Date): string {
    return [date.getUTCFullYear(),
    roundDateValues(date.getUTCMonth() + 1),
    roundDateValues(date.getUTCDate()),
        'T',
    roundDateValues(date.getUTCHours()),
    roundDateValues(date.getUTCMinutes()),
    roundDateValues(date.getUTCSeconds()),
        'Z'].join('');
}

function roundDateValues(date: string | number): string {
    return ('0' + date).slice(-2);
}