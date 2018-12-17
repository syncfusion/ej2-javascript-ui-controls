import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';

/**
 * Exports util methods used by In-place editor.
 */

/**
 * @hidden
 */
export function parseValue(type: string, val: string | number | Date | string[] | Date[]): string {
    let result: string;
    if (isNOU(val) || val === '') { return ''; }
    if ((type === 'Date' || type === 'Time' || type === 'DateTime') && typeof (val) === 'string') {
        val = new Date(val);
    }
    if (type === 'DateRange' && typeof (val) === 'object' && typeof ((<string[]>val)[0]) === 'string') {
        val = [new Date((val as string[])[0]), new Date((val as string[])[1])];
    }
    switch (type) {
        case 'Color':
            let hex: string = <string>val;
            result = (hex.length > 7) ? hex.slice(0, -2) : hex;
            break;
        case 'Date':
            result = (<Date>val).toLocaleDateString();
            break;
        case 'DateRange':
            result = (<Date[]>val)[0].toLocaleDateString() + ' - ' + (<Date[]>val)[1].toLocaleDateString();
            break;
        case 'DateTime':
            result = (<Date>val).toLocaleString().replace(/(.*)\D\d+/, '$1');
            break;
        case 'Time':
            result = (<Date>val).toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
            break;
        default:
            result = val.toString();
            break;
    }
    return result;
}