import { isNumber } from "../common/math";
import { CellModel } from '../base/index';

/**
 * Check the value of the cell is number with thousand separator and currency symbol and returns the parsed value.
 * @hidden
 */
export function checkIsNumberAndGetNumber(cell: CellModel, locale: string, groupSep: string, decimalSep: string, currencySymbol?: string): { isNumber: boolean, value: string } {
    let cellValue: string = cell.value;
    if (isNumber(cellValue)) {
        return { isNumber: true, value: cellValue };
    }
    if (currencySymbol && (cell.format.indexOf(currencySymbol) > -1 && cellValue && cellValue.indexOf(currencySymbol) > -1)) {
        cellValue = cellValue.replace(currencySymbol, '');
    }
    if ((cell.format.indexOf(groupSep) > -1 && cellValue && cellValue.indexOf(groupSep) > -1)) {
        cellValue = parseThousandSeparator(cellValue, locale, groupSep, decimalSep) ? cellValue.split(groupSep).join('') : cellValue;
    }
    return { isNumber: isNumber(cellValue), value: cellValue };
}

/**
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
            isParsed = splitedValue[i].length === splitedNum[0].length;
        } else {
            isParsed = i == 0 ? splitedValue[i].length <= splitedNum[1].length : splitedValue[i].length === splitedNum[1].length;
        }
        if (!isParsed) {
            break;
        }
    }
    return isParsed;
}