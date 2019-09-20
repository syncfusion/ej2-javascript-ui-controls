import { isNullOrUndefined, getDefaultDateObject, Internationalization } from '@syncfusion/ej2-base';

/**
 * @hidden
 */
export function toFraction(val: number): string {
    let strVal: string = val.toString();
    if (val === parseInt(strVal, 10)) {
        return parseInt(strVal, 10) + '  ';
    } else {
        let top: string | number = strVal.indexOf('.') > -1 ? strVal.split('.')[1] : 0;
        let bottom: number = Math.pow(10, top.toString().replace('-', '').length);
        let abs: number = Math.abs(getGcd(top, bottom));
        return (top as number / abs) + '/' + (bottom / abs);
    }
}

/**
 * @hidden
 */
export function getGcd(a: string | number, b: string | number): number {
    a = Number(a);
    b = Number(b);
    return (b) ? getGcd(b, a % b) : a;
}

/**
 * @hidden
 */
export function intToDate(val: number): Date {
    val = Number(val);
    val = (val > 0 && val < 1) ? (1 + val) : (val === 0) ? 1 : val;
    if (val > 60) {
        val -= 1; // Due to leap year issue of 1900 in MSExcel.
    }
    return new Date(((val - 1) * (1000 * 3600 * 24)) + new Date('01/01/1900').getTime());
}

/**
 * @hidden
 */
/* tslint:disable no-any */
export function dateToInt(val: any, isTime?: boolean): number {
    let startDate: Date = new Date('01/01/1900');
    let date: Date = isDateTime(val) ? val : new Date(val);
    let timeDiff: number = (date.getTime() - startDate.getTime());
    let diffDays: number = (timeDiff / (1000 * 3600 * 24)) + 1;
    return isTime ? diffDays + 1 : parseInt(diffDays.toString(), 10) + 2;
}

/**
 * @hidden
 */
export function isDateTime(date: any): boolean {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.valueOf());
}

/**
 * @hidden
 */
export function isNumber(val: string | number): boolean {
    return val as number - parseFloat(val as string) >= 0;
}

/**
 * @hidden
 */
export function toDate(text: Date | string | number, intl: Internationalization): ToDateArgs {
    let defaultDateFormats: Object = getDefaultDateObject();
    let availabelDateTimeFormat: Object = (defaultDateFormats as any).dateTimeFormats.availableFormats;
    let dObj: ToDateArgs = { dateObj: null, isCustom: false, type: '' };
    if (typeof text === 'string') {
        text = text.toUpperCase();
    }
    for (let key of Object.keys((defaultDateFormats as any).dateFormats)) {
        dObj.dateObj = intl.parseDate(text as string, { format: (defaultDateFormats as any).dateFormats[key], skeleton: key });
        if (dObj.dateObj) {
            dObj.type = 'date';
            dObj.isCustom = false;
            break;
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        for (let key of Object.keys(availabelDateTimeFormat)) {
            dObj.dateObj = intl.parseDate(text as string, { format: availabelDateTimeFormat[key], skeleton: key });
            if (dObj.dateObj) {
                dObj.type = text.toString().indexOf(':') > -1 ? 'time' : 'datetime';
                dObj.isCustom = true;
                break;
            }
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        for (let key of Object.keys((defaultDateFormats as any).timeFormats)) {
            dObj.dateObj = intl.parseDate(text as string, { format: (defaultDateFormats as any).timeFormats[key], skeleton: key });
            if (dObj.dateObj) {
                dObj.type = 'time';
                dObj.isCustom = false;
                break;
            }
        }
    }
    if (text !== '#DIV/0!' && !dObj.dateObj && new Date(text).toString() !== 'Invalid Date') {
        dObj.dateObj = new Date(text);
    }
    return dObj;
}

export interface ToDateArgs {
    dateObj: Date;
    type: string;
    isCustom: boolean;
}