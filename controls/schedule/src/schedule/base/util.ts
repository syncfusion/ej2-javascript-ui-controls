/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, remove, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Schedule common utilities
 */

export const WEEK_LENGTH: number = 7;
export const DEFAULT_WEEKS: number = 6;
export const MS_PER_DAY: number = 86400000;
export const MS_PER_MINUTE: number = 60000;

/**
 * Method to get height from element
 *
 * @param {Element} container Accepts the DOM element
 * @param {string} elementClass Accepts the element class
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the height of the element
 */
export function getElementHeightFromClass(container: Element, elementClass: string, isTransformed?: boolean): number {
    let height: number = 0;
    const el: HTMLElement = createElement('div', { className: elementClass }).cloneNode() as HTMLElement;
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = getElementHeight(el, isTransformed);
    remove(el);
    return height;
}

/**
 * Method to get width from element
 *
 * @param {Element} container Accepts the DOM element
 * @param {string} elementClass Accepts the element class
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the width of the element
 */
export function getElementWidthFromClass(container: Element, elementClass: string, isTransformed?: boolean): number {
    let width: number = 0;
    const el: HTMLElement = createElement('div', { className: elementClass }).cloneNode() as HTMLElement;
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    width = getElementWidth(el, isTransformed);
    remove(el);
    return width;
}

/**
 * Method to get translateY value
 *
 * @param {HTMLElement | Element} element Accepts the DOM element
 * @returns {number} Returns the translateY value of given element
 */
export function getTranslateY(element: HTMLElement | Element): number {
    const style: CSSStyleDeclaration = getComputedStyle(element);
    return (<Record<string, any> & Window><unknown>window).WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m42 : 0;
}

/**
 * Method to get translateX value
 *
 * @param {HTMLElement | Element} element Accepts the DOM element
 * @returns {number} Returns the translateX value of given element
 */
export function getTranslateX(element: HTMLElement | Element): number {
    const style: CSSStyleDeclaration = getComputedStyle(element);
    return (<Record<string, any> & Window><unknown>window).WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m41 : 0;
}

/**
 * Method to get week first date
 *
 * @param {Date} date Accepts the date object
 * @param {number} firstDayOfWeek Accepts the first day of week number
 * @returns {Date} Returns the date object
 */
export function getWeekFirstDate(date: Date, firstDayOfWeek: number): Date {
    const date1: Date = new Date(date.getTime());
    firstDayOfWeek = (firstDayOfWeek - date1.getDay() + 7 * (-1)) % 7;
    return new Date(date1.setDate(date1.getDate() + (isNaN(firstDayOfWeek) ? 0 : firstDayOfWeek)));
}

/**
 * Method to get week last date
 *
 * @param {Date} date Accepts the date object
 * @param {number} firstDayOfWeek Accepts the first day of week number
 * @returns {Date} Returns the date object
 */
export function getWeekLastDate(date: Date, firstDayOfWeek: number): Date {
    const weekFirst: Date = getWeekFirstDate(date, firstDayOfWeek);
    const weekLast: Date = new Date(weekFirst.getFullYear(), weekFirst.getMonth(), weekFirst.getDate() + 6);
    return new Date(weekLast.getTime());
}

/**
 * Method to get first date of month
 *
 * @param {Date} date Accepts the date object
 * @returns {Date} Returns the date object
 */
export function firstDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Method to get last date of month
 *
 * @param {Date} date Accepts the date object
 * @returns {Date} Returns the date object
 */
export function lastDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Method to get week number
 *
 * @param {Date} date Accepts the date object
 * @returns {number} Returns the week number
 */
export function getWeekNumber(date: Date): number {
    const date1: number = new Date(date.getFullYear(), 0, 1).valueOf();
    const currentDate: number = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
    const dayOfYear: number = ((currentDate - date1 + MS_PER_DAY) / MS_PER_DAY);
    return Math.ceil(dayOfYear / 7);
}

/**
 * Method to get week middle date
 *
 * @param {Date} weekFirst Accepts the week first date object
 * @param {Date} weekLast Accepts the week last date object
 * @returns {Date} Returns the date object
 */
export function getWeekMiddleDate(weekFirst: Date, weekLast: Date): Date {
    return new Date(weekLast.valueOf() - ((weekLast.valueOf() - weekFirst.valueOf()) / 2));
}

/**
 * Method to set time to date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} time Accepts the milliseconds
 * @returns {Date} Returns the date object
 */
export function setTime(date: Date, time: number): Date {
    const tzOffsetBefore: number = date.getTimezoneOffset();
    const d: Date = new Date(date.getTime() + time);
    const tzOffsetDiff: number = d.getTimezoneOffset() - tzOffsetBefore;
    date.setTime(d.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    return date;
}

/**
 * Method the reset hours in date object
 *
 * @param {Date} date Accepts the date object
 * @returns {Date} Returns the date object
 */
export function resetTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Method to get milliseconds from date object
 *
 * @param {Date} date Accepts the date object
 * @returns {number} Returns the milliseconds from date object
 */
export function getDateInMs(date: Date): number {
    const localOffset: number = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTimezoneOffset();
    const dateOffset: number = date.getTimezoneOffset();
    const timezoneOffset: number = dateOffset - localOffset;
    return ((date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime())
        - (timezoneOffset * 60 * 1000));
}

/**
 * Method to get date count between two dates
 *
 * @param {Date} startDate Accepts the date object
 * @param {Date} endDate Accepts the date object
 * @returns {number} Returns the date count
 */
export function getDateCount(startDate: Date, endDate: Date): number {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}

/**
 * Method to add no of days in date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} noOfDays Accepts the number of days count
 * @returns {Date} Returns the date object
 */
export function addDays(date: Date, noOfDays: number): Date {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + noOfDays));
}

/**
 * Method to add no of months in date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} noOfMonths Accepts the number of month count
 * @returns {Date} Returns the date object
 */
export function addMonths(date: Date, noOfMonths: number): Date {
    date = new Date('' + date);
    const day: number = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + noOfMonths);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}

/**
 * Method to add no of years in date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} noOfYears Accepts the number of month count
 * @returns {Date} Returns the date object
 */
export function addYears(date: Date, noOfYears: number): Date {
    date = new Date('' + date);
    const day: number = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + noOfYears);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}

/**
 * Method to get start and end hours
 *
 * @param {Date} date Accepts the date object
 * @param {Date} startHour Accepts the start hour date object
 * @param {Date} endHour Accepts the end hour date object
 * @returns {Object} Returns the start and end hour date objects
 */
export function getStartEndHours(date: Date, startHour: Date, endHour: Date): Record<string, Date> {
    const date1: Date = new Date(date.getTime());
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

/**
 * Method to get month last date
 *
 * @param {Date} date Accepts the date object
 * @returns {number} Returns the month last date
 */
export function getMaxDays(date: Date): number {
    return lastDateOfMonth(date).getDate();
}

/**
 * Method to get days count between two dates
 *
 * @param {Date} startDate Accepts the date object
 * @param {Date} endDate Accepts the date object
 * @returns {number} Returns the days count
 */
export function getDaysCount(startDate: number, endDate: number): number {
    const strTime: Date = resetTime(new Date(startDate));
    const endTime: Date = resetTime(new Date(endDate));
    return Math.round((endTime.getTime() - strTime.getTime()) / MS_PER_DAY);
}

/**
 * Method to get date object from date string
 *
 * @param {string} date Accepts the date string
 * @returns {Date} Returns the date object
 */
export function getDateFromString(date: string): Date {
    return date.indexOf('Date') !== -1 ? new Date(parseInt(date.match(/\d+/g).toString(), 10)) :
        date.indexOf('T') !== -1 ? new Date(date) : new Date(date.replace(/-/g, '/'));
}

/** @private */
let scrollWidth: number = null;

/** @private */
let pixelRatio: number = null;

/**
 * Method to get scrollbar width
 *
 * @returns {number} Returns the scrollbar width
 * @private
 */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    if (pixelRatio === null) {
        pixelRatio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    }
    const divNode: HTMLElement = createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    const ratio: number = (devicePixelRatio) ? (devicePixelRatio.toFixed(2) === '1.10' || devicePixelRatio <= 1) ?
        Math.ceil(devicePixelRatio % 1) : Math.floor(devicePixelRatio % 1) : 0;
    value = (divNode.offsetWidth - divNode.clientWidth - ratio) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

/**
 * Method to reset scrollbar width
 *
 * @private
 * @returns {void}
 */
export function resetScrollbarWidth(): void {
    const zoomPixelRatio: number = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (pixelRatio && pixelRatio !== zoomPixelRatio) {
        scrollWidth = null;
        pixelRatio = zoomPixelRatio;
    }
}

/**
 * Method to find the index from data collection
 *
 * @param {Object} data Accepts the data as object
 * @param {string} field Accepts the field name
 * @param {string} value Accepts the value name
 * @param {Object} event Accepts the data as object
 * @param {Object[]} resourceCollection Accepts the data collections
 * @returns {number} Returns the index number
 */
// eslint-disable-next-line max-len
export function findIndexInData(data: Record<string, any>[], field: string, value: string, event?: Record<string, any>, resourceCollection?: Record<string, any>[]): number {
    for (let i: number = 0, length: number = data.length; i < length; i++) {
        if (data[parseInt(i.toString(), 10)][`${field}`] === value) {
            if (event) {
                const field: string = resourceCollection.slice(-2)[0].field as string;
                const res: string[] = (event[`${field}`] instanceof Array ? event[`${field}`] : [event[`${field}`]]) as string[];
                const resData: string = res.join(',');
                if (resData.includes(data[parseInt(i.toString(), 10)][(resourceCollection.slice(-1)[0] as any).groupIDField] as string)) {
                    return i;
                }
            } else {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Method to get element outer height
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @returns {number} Returns the outer height of the given element
 */
export function getOuterHeight(element: HTMLElement): number {
    const style: CSSStyleDeclaration = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}

/**
 * Method to remove child elements
 *
 * @param {HTMLElement | Element} element Accepts the DOM element
 * @returns {void}
 */
export function removeChildren(element: HTMLElement | Element): void {
    const elementChildren: HTMLElement[] | Element[] = [].slice.call(element.children);
    for (const elementChild of elementChildren) {
        element.removeChild(elementChild);
    }
}

/**
 * Method to check DST is present or not in date object
 *
 * @param {Date} date Accepts the date object
 * @returns {boolean} Returns the boolean value for either DST is present or not
 */
export function isDaylightSavingTime(date: Date): boolean {
    const jan: Date = new Date(date.getFullYear(), 0, 1);
    const jul: Date = new Date(date.getFullYear(), 6, 1);
    return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

/**
 * Method to get UTC time value from date
 *
 * @param {Date} date Accepts the date
 * @returns {number} Returns the UTC time value
 */
export function getUniversalTime(date: Date): number {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const day: number = date.getDate();
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();
    const milliseconds: number = date.getMilliseconds();
    return Date.UTC(year, month, day, hours, minutes, seconds, milliseconds);
}

/**
 * Method to check the device
 *
 * @returns {boolean} Returns the boolean value for either device is present or not.
 */
export function isMobile(): boolean {
    return window.navigator.userAgent.toLowerCase().indexOf('mobi') > -1;
}

/**
 * Method to check the IPad device
 *
 * @returns {boolean} Returns the boolean value for either IPad device is present or not.
 */
export function isIPadDevice(): boolean {
    return window.navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
}

/**
 * Method to capitalize the first word in string
 *
 * @param {string} inputString Accepts the string value
 * @param {string} type Accepts the string type
 * @returns {string} Returns the output string
 */
export function capitalizeFirstWord(inputString: string, type: string): string {
    if (type === 'multiple') {
        inputString = inputString.split(' ').map((e: string) => e.charAt(0).toLocaleUpperCase() + e.substring(1)).join(' ');
    } else if (type === 'single') {
        if (inputString[0] >= '0' && inputString[0] <= '9') {
            const array: RegExpMatchArray = inputString.match(/[a-zA-Z]/);
            inputString = isNullOrUndefined(array) ? inputString :
                inputString.slice(0, array.index) + inputString[array.index].toLocaleUpperCase() + inputString.slice(array.index + 1);
        }
        inputString = inputString[0].toLocaleUpperCase() + inputString.slice(1);
    }
    return inputString;
}

/**
 * Method to get element cell width
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the width of the given element
 */
export function getElementWidth(element: HTMLElement, isTransformed?: boolean): number {
    return isTransformed ? element.offsetWidth : element.getBoundingClientRect().width;
}

/**
 * Method to get element cell Height
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the Height of the given element
 */
export function getElementHeight(element: HTMLElement, isTransformed?: boolean): number {
    return isTransformed ? element.offsetHeight : element.getBoundingClientRect().height;
}

/**
 * Method to get element cell Top
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the top value of the given element
 */
export function getElementTop(element: HTMLElement, isTransformed?: boolean): number {
    return isTransformed ? element.offsetTop : element.getBoundingClientRect().top;
}

