/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Returns whether `date` is a valid JavaScript `Date` instance.
 *
 * @hidden
 * @param {number | string} date - Value to test.
 * @returns {Date | Object} - `true` when `date` is a valid `Date`.
 */
export function isDateTime(date: any): boolean {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.valueOf());
}

/**
 * Returns whether `val` is numeric (number or numeric string).
 *
 * @hidden
 * @param {string | number} val - Value to test.
 * @returns {number} - `true` when numeric.
 */
export function isNumber(val: string | number): boolean {
    return val as number - parseFloat(val as string) >= 0;
}

/**
 * Convert a Date (or date-like value) to an Excel serial number.
 *
 * @hidden
 * @param {any} val - Specifies the value.
 * @param {boolean} isTime - Include time fraction.
 * @param {boolean} isTimeOnly - Value is time without date.
 * @returns {number} - Excel serial number.
 */
export function dateToInt(val: any, isTime?: boolean, isTimeOnly?: boolean): number {
    const startDate: Date = new Date('01/01/1900');
    const date: Date = isDateTime(val) ? val : new Date(val);
    const startDateUTC: number = Date.UTC(
        startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(),
        startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
    const dateUTC: number = Date.UTC(
        date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
        date.getSeconds(), date.getMilliseconds());
    const diffDays: number = ((dateUTC - startDateUTC) / (1000 * 3600 * 24));
    return (isTime ? diffDays : parseInt(diffDays.toString(), 10)) + (isTimeOnly ? 0 : (diffDays > 60 ? 2 : 1));
}
