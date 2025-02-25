import { isNullOrUndefined, Internationalization, IntlBase, cldrData } from '@syncfusion/ej2-base';
import { CellModel } from '../base';

/**
 * @hidden
 * @param {number} val - Specifies the val.
 * @returns {string} - To get Fraction.
 */
export function toFraction(val: number): string {
    const strVal: string = val.toString();
    if (val === parseInt(strVal, 10)) {
        return parseInt(strVal, 10) + '  ';
    } else {
        const top: string | number = strVal.indexOf('.') > -1 ? strVal.split('.')[1] : 0;
        const bottom: number = Math.pow(10, top.toString().replace('-', '').length);
        const abs: number = Math.abs(getGcd(top, bottom));
        return (top as number / abs) + '/' + (bottom / abs);
    }
}

/**
 * @hidden
 * @param {string | number} a - Specifies the a.
 * @param {string | number} b - Specifies the b.
 * @returns {number} - To get Gcd.
 */
export function getGcd(a: string | number, b: string | number): number {
    a = Number(a);
    b = Number(b);
    return (b) ? getGcd(b, a % b) : a;
}

/**
 * @hidden
 * @param {number} val - Specifies the value.
 * @returns {Date} - Returns Date.
 */
export function intToDate(val: number | string): Date {
    val = Number(val);
    val = (val > 0 && val < 1) ? (1 + val) : (val === 0) ? 1 : val;
    if (val > 60) {
        val -= 1; // Due to leap year issue of 1900 in MSExcel.
    }
    const startDate: Date = new Date('01/01/1900');
    const startDateUTC: number = Date.UTC(
        startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(),
        startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
    return new Date(new Date(((val - 1) * (1000 * 3600 * 24)) + startDateUTC).toUTCString().replace(' GMT', ''));
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
/**
 * @hidden
 * @param {number} val - Specifies the value.
 * @param {boolean} isTime - Specifies the boolean value.
 * @param {boolean} isTimeOnly - Specifies the value is only a time without date.
 * @returns {number} - Returns number.
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

/**
 * @hidden
 * @param {any} date - Specifies the date.
 * @returns {boolean} - Returns boolean value.
 */
export function isDateTime(date: any): boolean {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.valueOf());
}

/**
 * @hidden
 * @param {string} val - Specifies the value.
 * @returns {boolean} - Returns boolean value.
 */
export function isNumber(val: string | number): boolean {
    return val as number - parseFloat(val as string) >= 0;
}

/**
 * @hidden
 * @param {Date | string | number} text - Specifies the text.
 * @param {Internationalization} intl - Specifies the Internationalization.
 * @param {string} locale - Specifies the locale.
 * @param {string} format - Specifies the string.
 * @param {CellModel} cell - Specify the cell.
 * @param {boolean} isDateTime -Specify is DateTime value or not.
 * @returns {ToDateArgs} - Returns Date format.
 */
export function toDate(
    text: Date | string | number, intl: Internationalization, locale: string, format?: string, cell?: CellModel,
    isDateTime?: boolean): ToDateArgs {
    const defaultDateFormats: Object = IntlBase.getDependables(cldrData, locale, null).dateObject;
    const availabelDateTimeFormat: Object = (defaultDateFormats as any).dateTimeFormats.availableFormats;
    const dObj: ToDateArgs = { dateObj: null, isCustom: false, type: '' }; let dateVal: Date;
    const updateTime: Function = (): void => {
        if (dObj.type === 'time') {
            dObj.dateObj = new Date((dateVal ? dateVal.toDateString() : '01/01/1900') + ' ' + dObj.dateObj.toLocaleTimeString());
        }
    };
    if (format) {
        dObj.dateObj = intl.parseDate(text as string, { format: format });
        if (dObj.dateObj) {
            dObj.type = text.toString().indexOf(':') > -1 ? 'time' : 'datetime';
            updateTime();
            dObj.isCustom = true;
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        text = text.toString();
        if (text && text.indexOf('/') > -1 || text.indexOf('-') > 0) {
            let cFormat: string = (cell && cell.format) || format;
            if (cFormat) {
                const hyphenDate: boolean = cFormat.toLowerCase().includes('dd-mm-yy');
                if (hyphenDate || cFormat.toLowerCase().includes('dd/mm/yy')) {
                    cFormat = hyphenDate ? 'd-M-y' : 'd/M/y';
                    dObj.dateObj = intl.parseDate(text as string, { format: cFormat, skeleton: 'yMd' });
                    if (dObj.dateObj) {
                        dObj.type = 'date';
                        return dObj;
                    }
                }
            }
        }
        const parseDateTimeValue: Function = (text: string): void => {
            if (text.indexOf(':') < 0) {
                for (const key of Object.keys((defaultDateFormats as { dateFormats?: object }).dateFormats)) {
                    dObj.dateObj = intl.parseDate(
                        text, { format: (defaultDateFormats as { dateFormats?: object }).dateFormats[`${key}`], skeleton: key });
                    if (dObj.dateObj) {
                        dObj.type = 'date';
                        dObj.isCustom = false;
                        break;
                    }
                }
            }
            if (isNullOrUndefined(dObj.dateObj)) {
                let dateTimeFormat: string;
                for (const key of Object.keys(availabelDateTimeFormat)) {
                    dateTimeFormat = availabelDateTimeFormat[`${key}`];
                    dObj.dateObj = intl.parseDate(text as string, { format: dateTimeFormat, skeleton: key });
                    if (!dObj.dateObj && text.indexOf(':') > -1 && dateTimeFormat.indexOf(':') > -1) { // parsing time format without am or pm
                        dObj.dateObj = intl.parseDate(text, { format: dateTimeFormat.split(' ')[0] });
                    }
                    if (dObj.dateObj) {
                        dObj.type = text.toString().indexOf(':') > -1 ? 'time' : 'datetime';
                        updateTime();
                        dObj.isCustom = true;
                        break;
                    }
                }
            }
            if (isNullOrUndefined(dObj.dateObj)) {
                for (const key of Object.keys((defaultDateFormats as { timeFormats?: object }).timeFormats)) {
                    dObj.dateObj = intl.parseDate(
                        text, { format: (defaultDateFormats as { timeFormats?: object }).timeFormats[`${key}`], skeleton: key });
                    if (dObj.dateObj) {
                        dObj.type = 'time';
                        updateTime();
                        dObj.isCustom = false;
                        break;
                    }
                }
            }
        };
        if (isDateTime) {
            const dateTimeArr: string[] = text.split(' ');
            if (dateTimeArr.length >= 2) {
                parseDateTimeValue(dateTimeArr.shift());
                if (dObj.dateObj) {
                    dateVal = dObj.dateObj;
                    dObj.dateObj = null;
                    parseDateTimeValue(dateTimeArr.join(' '));
                    if (dObj.dateObj) {
                        dObj.type = 'datetime';
                    }
                }
            }
        } else {
            parseDateTimeValue(text);
        }
    }
    if (text !== '#DIV/0!' && !dObj.dateObj && new Date(text).toString() !== 'Invalid Date') {
        dObj.dateObj = new Date(text);
        dObj.type = 'date';
    }
    return dObj;
}

/**
 * @hidden
 * @param {string} value - Specifies the value.
 * @param {boolean} isPaste - Optional flag indicating whether the value came from a paste action.
 * @param {boolean} isFromExternalPaste - Optional flag indicating whether the value came from a getExternalCells method.
 * @returns { string | number} - ReturnsparseIntValue.
 */
export function parseIntValue(value: string, isPaste?: boolean, isFromExternalPaste?: boolean): string | number {
    if (value && value !== '.' && value !== '-') {
        let val: string = value.toString();
        const maxSafeIntegerLength: number = Number.MAX_SAFE_INTEGER.toString().length;
        if (val.startsWith('-')) {
            val = val.slice(1);
            val = val.includes('-') ? value : val;
        }
        if (/^\d*\.?\d*$/.test(val)) {
            // If the number is longer than the safe integer length.
            if (isPaste && (val.length > maxSafeIntegerLength || (isFromExternalPaste && (val.startsWith('0') || val.endsWith('0'))))) {
                return value; //skip parsefloat to get the precise value while pasting.
            } else {
                return parseFloat(value);
            }
        }
    }
    return value;
}

export interface ToDateArgs {
    dateObj: Date;
    type: string;
    isCustom: boolean;
}
