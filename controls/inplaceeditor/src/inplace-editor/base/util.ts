import { isNullOrUndefined as isNOU, Internationalization } from '@syncfusion/ej2-base';

/**
 * Exports util methods used by In-place editor.
 */

let intl: Internationalization = new Internationalization();
type valueType = string | number | Date | string[] | Date[] | number[];
/**
 * @hidden
 */
export function parseValue(type: string, val: valueType): string {
    if (isNOU(val) || val === '') { return ''; }
    let result: string;
    switch (type) {
        case 'Color':
            let hex: string = <string>val;
            result = (hex.length > 7) ? hex.slice(0, -2) : hex;
            break;
        case 'Date':
            result = intl.formatDate(<Date>val, { skeleton: 'yMd' });
            break;
        case 'DateRange':
            let date: Date[] = <Date[]>val;
            result = intl.formatDate(date[0], { skeleton: 'yMd' }) + ' - ' + intl.formatDate(date[1], { skeleton: 'yMd' });
            break;
        case 'DateTime':
            result = intl.formatDate(<Date>val, { skeleton: 'yMd' }) + ' ' + intl.formatDate(<Date>val, { skeleton: 'hm' });
            break;
        case 'Time':
            result = intl.formatDate(<Date>val, { skeleton: 'hm' });
            break;
        default:
            result = val.toString();
            break;
    }
    return result;
}

export function getCompValue(type: string, val: valueType): valueType {
    if (isNOU(val) || val === '') { return val; }
    if ((type === 'Date' || type === 'Time' || type === 'DateTime') && typeof (val) === 'string') {
        val = new Date(val);
    } else if (type === 'DateRange') {
        if (typeof (val) === 'object' && typeof ((<string[]>val)[0]) === 'string') {
            val = [new Date((val as string[])[0]), new Date((val as string[])[1])];
        } else if (typeof (val) === 'string') {
            let temp: string[] = (<string>val).split('-');
            val = [new Date(temp[0]), new Date(temp[1])];
        }
    }
    return val;
}