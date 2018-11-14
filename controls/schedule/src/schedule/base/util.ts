import { createElement, remove } from '@syncfusion/ej2-base';
/**
 * Schedule common utilities
 */
export const WEEK_LENGTH: number = 7;
export const MS_PER_DAY: number = 86400000;
export const MS_PER_MINUTE: number = 60000;

export function getElementHeightFromClass(container: Element, elementClass: string): number {
    let height: number = 0;
    let el: HTMLElement = createElement('div', { className: elementClass }).cloneNode() as HTMLElement;
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = getOuterHeight(el);
    remove(el);
    return height;
}

export function getWeekFirstDate(date1: Date, firstDayOfWeek: number): Date {
    let date: Date = new Date(date1.getTime());
    firstDayOfWeek = (firstDayOfWeek - date.getDay() + 7 * (-1)) % 7;
    return new Date(date.setDate(date.getDate() + firstDayOfWeek));
}
export function firstDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth());
}
export function lastDateOfMonth(dt: Date): Date {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
}
export function getWeekNumber(dt: Date): number {
    let currentDate: number = new Date('' + dt).valueOf();
    let date: number = new Date(dt.getFullYear(), 0, 1).valueOf();
    let a: number = (currentDate - date);
    return Math.ceil((((a) / MS_PER_DAY) + new Date(date).getDay() + 1) / 7);
}
export function setTime(date: Date, time: number): Date {
    let tzOffsetBefore: number = date.getTimezoneOffset();
    let d: Date = new Date(date.getTime() + time);
    let tzOffsetDiff: number = d.getTimezoneOffset() - tzOffsetBefore;
    date.setTime(d.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    return date;
}
export function resetTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
}
export function getDateInMs(date: Date): number {
    return date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
}
export function addDays(date: Date, i: number): Date {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + i));
}
export function addMonths(date: Date, i: number): Date {
    date = new Date('' + date);
    let day: number = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
export function addYears(date: Date, i: number): Date {
    date = new Date('' + date);
    let day: number = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
export function getStartEndHours(date: Date, startHour: Date, endHour: Date): { [key: string]: Date } {
    let date1: Date = new Date(date.getTime());
    date1.setHours(startHour.getHours());
    date1.setMinutes(startHour.getMinutes());
    date1.setSeconds(startHour.getSeconds());
    let date2: Date = new Date(date.getTime());
    if (endHour.getHours() === 0) {
        date2 = addDays(date2, 1);
    } else {
        date2.setHours(endHour.getHours());
        date2.setMinutes(endHour.getMinutes());
        date2.setSeconds(endHour.getSeconds());
    }
    return { startHour: date1, endHour: date2 };
}
export function getMaxDays(d: Date): number {
    let date: Date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return date.getDate();
}
export function getDaysCount(startDate: number, endDate: number): number {
    let strTime: Date = resetTime(new Date(startDate));
    let endTime: Date = resetTime(new Date(endDate));
    return (endTime.getTime() - strTime.getTime()) / MS_PER_DAY;
}
export function getDateFromString(date: string): Date {
    return date.indexOf('Date') !== -1 ? new Date(parseInt(date.match(/\d+/g).toString(), 10)) :
        date.indexOf('T') !== -1 ? new Date(date) : new Date(date.replace(/-/g, '/'));
}

/** @hidden */
let scrollWidth: number = null;

/** @hidden */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    let divNode: HTMLElement = createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

export function findIndexInData(data: { [key: string]: Object }[], property: string, value: string): number {
    for (let i: number = 0, length: number = data.length; i < length; i++) {
        if (data[i][property] === value) {
            return i;
        }
    }
    return -1;
}

export function getOuterHeight(element: HTMLElement): number {
    let style: CSSStyleDeclaration = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}
