import { isNumber, LocaleNumericSettings } from '../common/index';
import { CellModel } from '../base/index';
import { getNumericObject, isUndefined } from '@syncfusion/ej2-base';

/**
 * Check the value of the cell is number with thousand separator and currency symbol and returns the parsed value.
 *
 * @param {CellModel} cell - Specifies the cell.
 * @param {string} locale - Specifies the locale.
 * @param {string} groupSep - Specifies the group separator.
 * @param {string} decimalSep - Specifies the decimal separator.
 * @param {string} currencySym - Specifies the currency Symbol.
 * @returns {Object} - returns the parsed value.
 * @hidden
 */
export function checkIsNumberAndGetNumber(
    cell: CellModel, locale: string, groupSep?: string, decimalSep?: string, currencySym?: string
): { isNumber: boolean, value: string } {
    let cellValue: string = cell.value;
    if (isNumber(cellValue)) {
        return { isNumber: true, value: cellValue };
    }
    if (cellValue && typeof cellValue === 'string') {
        if (currencySym && cellValue.includes(currencySym) && (cell.format.includes(currencySym) || cell.format.includes('$'))) {
            cellValue = cellValue.replace(currencySym, '').trim();
        }
        if (groupSep && cellValue.includes(groupSep) && parseThousandSeparator(cellValue, locale, groupSep, decimalSep)) {
            cellValue = cellValue.split(groupSep).join('').trim();
        }
        if (!decimalSep) {
            decimalSep = (getNumericObject(locale) as LocaleNumericSettings).decimal;
        }
        if (decimalSep !== '.' && cellValue.includes(decimalSep)) {
            cellValue = cellValue.replace(decimalSep, '.').trim();
        }
        if (isNumber(cellValue)) {
            return { isNumber: true, value: cellValue };
        }
    }
    return { isNumber: false, value: cellValue };
}

/**
 * @param {string} value - Specifies the value.
 * @param {string} locale - Specifies the locale.
 * @param {string} groupSep - Specifies the group separator.
 * @param {string} decimalSep - Specifies the decimal separator.
 * @returns {boolean} - Returns parsed thousand separator.
 * @hidden
 */
export function parseThousandSeparator(value: string, locale: string, groupSep: string, decimalSep: string): boolean {
    let isParsed: boolean = false;
    const number: number = 123456;
    const parsedNum: string = number.toLocaleString(locale);
    const splitedNum: string[] = parsedNum.split(groupSep).reverse();
    const splitedValue: string[] = value.split(decimalSep)[0].split(groupSep);
    for (let i: number = 0; i < splitedValue.length; i++) {
        if (i === splitedValue.length - 1) {
            isParsed = splitedValue[i as number].length === splitedNum[0].length;
        } else {
            isParsed = !isUndefined(splitedNum[1]) && (i === 0 ? splitedValue[i as number].length <= splitedNum[1].length :
                splitedValue[i as number].length === splitedNum[1].length);
        }
        if (!isParsed) {
            break;
        }
    }
    return isParsed;
}
