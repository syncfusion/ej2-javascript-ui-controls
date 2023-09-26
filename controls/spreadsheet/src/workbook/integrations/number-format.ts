import { getRangeIndexes, NumberFormatType, updateCell, applyCellFormat, CellFormatArgs } from '../common/index';
import { CellModel, SheetModel, getCell, getSheet, setCell, getSheetIndex, Workbook, getColorCode, getCustomColors } from '../base/index';
import { Internationalization, getNumberDependable, getNumericObject, isNullOrUndefined, IntlBase } from '@syncfusion/ej2-base';
import { cldrData } from '@syncfusion/ej2-base';
import { isNumber, toFraction, intToDate, toDate, dateToInt, ToDateArgs, DateFormatCheckArgs, rowFillHandler } from '../common/index';
import { applyNumberFormatting, getFormattedCellObject, refreshCellElement, checkDateFormat, getFormattedBarText } from '../common/index';
import { getTextSpace, NumberFormatArgs, isCustomDateTime, VisibleMergeIndexArgs, setVisibleMergeIndex } from './../index';
import { checkIsNumberAndGetNumber, parseThousandSeparator } from '../common/internalization';
/**
 * Specifies number format.
 */
export class WorkbookNumberFormat {
    private parent: Workbook;
    private localeObj: { decimal: string, group: string, timeSeparator: string, dateSeparator: string, am?: string, pm?: string };
    private decimalSep: string;
    private groupSep: string;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.localeObj = getNumericObject(this.parent.locale) as { decimal: string, group: string, timeSeparator: string,
            dateSeparator: string };
        this.decimalSep = this.localeObj.decimal;
        this.groupSep = this.localeObj.group;
        const formats: { dayPeriods?: { format: { wide: { am: string, pm: string } } } } = IntlBase.getDependables(
            cldrData, this.parent.locale, null).dateObject;
        if (formats.dayPeriods && formats.dayPeriods && formats.dayPeriods.format && formats.dayPeriods.format.wide) {
            this.localeObj.am = formats.dayPeriods.format.wide.am || 'AM';
            this.localeObj.pm = formats.dayPeriods.format.wide.pm || 'PM';
        } else {
            this.localeObj.am = 'AM';
            this.localeObj.pm = 'PM';
        }
        this.addEventListener();
    }

    private numberFormatting(args: { format?: string, range?: string, cancel?: boolean }): void {
        let sheetIdx: number = this.parent.activeSheetIndex;
        let activeSheet: boolean = true;
        if (args.range && args.range.indexOf('!') > -1) {
            sheetIdx = getSheetIndex(this.parent, args.range.split('!')[0]);
            activeSheet = sheetIdx === this.parent.activeSheetIndex;
        }
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        const formatRange: string = args.range ? ((args.range.indexOf('!') > -1) ?
            args.range.split('!')[1] : args.range) : sheet.selectedRange;
        const selectedRange: number[] = getRangeIndexes(formatRange);
        let fArgs: NumberFormatArgs; let cell: CellModel; let prevFormat: string;
        for (let rowIdx: number = selectedRange[0]; rowIdx <= selectedRange[2]; rowIdx++) {
            for (let colIdx: number = selectedRange[1]; colIdx <= selectedRange[3]; colIdx++) {
                prevFormat = getCell(rowIdx, colIdx, sheet, false, true).format;
                if (!updateCell(this.parent, sheet, { cell: { format: args.format }, rowIdx: rowIdx, colIdx: colIdx })) {
                    cell = getCell(rowIdx, colIdx, sheet);
                    if (!(cell.rowSpan < 0 || cell.colSpan < 0)) {
                        fArgs = { value: cell.value, format: cell.format, rowIndex: rowIdx, colIndex: colIdx, sheetIndex: sheetIdx,
                            cell: cell, refresh: activeSheet };
                        this.getFormattedCell(fArgs);
                        if (activeSheet) {
                            this.setCell(fArgs);
                            this.parent.notify(
                                refreshCellElement, { isRightAlign: fArgs.isRightAlign, result: fArgs.formattedText, rowIndex: rowIdx,
                                    colIndex: colIdx, sheetIndex: fArgs.sheetIndex, type: fArgs.type, curSymbol: fArgs.curSymbol,
                                    value: fArgs.value || fArgs.value === 0 ? fArgs.value : '', isRowFill: fArgs.isRowFill,
                                    cellEle: fArgs.td });
                            if (prevFormat && prevFormat !== args.format && prevFormat.includes('[') &&
                                getCustomColors().indexOf(getColorCode(args.format)) === -1) {
                                this.removeFormatColor(fArgs, { format: prevFormat, style: cell.style });
                            }
                        }
                    }
                    this.parent.setUsedRange(rowIdx, colIdx);
                }
            }
        }
    }

    /**
     * @hidden
     *
     * @param {Object} args - Specifies the args.
     * @returns {string} - to get formatted cell.
     */
    public getFormattedCell(args: NumberFormatArgs): string {
        let fResult: string = args.value === undefined || args.value === null ? '' : args.value as string;
        args.sheetIndex = args.sheetIndex === undefined ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, args.sheetIndex);
        const cell: CellModel = args.cell || getCell(args.rowIndex, args.colIndex, sheet, false, true);
        let rightAlign: boolean = false;
        const option: { currency?: string } = {};
        const intl: Internationalization = new Internationalization();
        intl.getNumberFormat(option);
        const currencySymbol: string = getNumberDependable(this.parent.locale, option.currency);
        if ((!args.format || args.format === 'General') && !args.skipFormatCheck && (!cell.formula ||
            !cell.formula.toLowerCase().startsWith('=text('))) {
            args.type = args.format = 'General';
            if (!cell.formula || (cell.formula && cell.formula.indexOf('&-') === -1)) { // for 5&-3=>5-3.
                const dateEventArgs: DateFormatCheckArgs = { value: fResult, updatedVal: fResult, cell: cell, isEdit: args.isEdit, intl: intl };
                this.checkDateFormat(dateEventArgs);
                if (dateEventArgs.isDate || dateEventArgs.isTime) {
                    rightAlign = true;
                    cell.value = args.value = dateEventArgs.updatedVal;
                    if (cell.format && cell.format !== 'General') {
                        args.format = cell.format;
                    } else {
                        cell.format = args.format = getFormatFromType(dateEventArgs.isDate ? 'ShortDate' : 'Time');
                    }
                }
            }
        } else {
            args.type = getTypeFromFormat(args.format);
            if (args.skipFormatCheck && !args.format && args.type === 'General') {
                args.format = 'General';
            }
        }
        if (cell.format && this.isCustomType(cell)) {
            args.type = 'Custom';
            const isTextFormat: boolean = cell.format.indexOf('@') > -1;
            if (fResult !== '' && !isTextFormat && this.isPercentageValue(fResult.toString(), args, cell)) {
                fResult = args.value.toString();
            }
            let isCustomText: boolean;
            const orgFormat: string = cell.format;
            cell.format = cell.format.split('\\').join('');
            if (cell.format.indexOf(';') > -1) {
                if (cell.format.indexOf('<') > -1 || cell.format.indexOf('>') > -1) {
                    args.result = this.processCustomConditions(cell, args);
                } else {
                    args.result = this.processCustomAccounting(cell, args, currencySymbol);
                    isCustomText = !isNumber(cell.value) || cell.format === '@';
                }
                cell.format = orgFormat;
            } else if (isCustomDateTime(cell.format, true)) {
                if (fResult !== '') {
                    args.result = this.processCustomDateTime(args, cell);
                    isCustomText = !args.formatApplied;
                }
                args.result = args.result || cell.value;
            } else if (isTextFormat) {
                isCustomText = true;
                args.result = this.processCustomText(cell.format, fResult, args);
            } else {
                const numObj: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
                    { value: fResult }, this.parent.locale, this.groupSep, this.decimalSep);
                if (numObj.isNumber) {
                    cell.value = args.value = numObj.value;
                    if (cell.format.includes('E+0')) {
                        if (args.format !== cell.format) {
                            args.format = cell.format;
                        }
                        this.checkAndSetColor(args);
                        const numberFormat: string = args.format.split('E')[0];
                        let formatArr: string[] = numberFormat.split('.');
                        if (this.decimalSep !== '.' && formatArr.length === 1) {
                            formatArr = numberFormat.split(this.decimalSep);
                        }
                        args.result = formatArr[0].length > 1 ? this.scientificHashFormat(args, formatArr) : this.scientificFormat(args);
                    } else {
                        args.result = this.processCustomNumberFormat(cell, args);
                        isCustomText = !isNumber(cell.value);
                    }
                } else {
                    if (cell.format && cell.format.includes('[')) {
                        this.removeFormatColor(args, { format: cell.format, style: cell.style });
                    }
                    isCustomText = args.dataUpdate = true;
                }
            }
            if (args.dataUpdate) {
                args.formattedText = args.result || (isNullOrUndefined(args.value) ? '' : args.value.toString());
            } else {
                args.value = args.result;
                args.formattedText = isNullOrUndefined(args.value) ? '' : args.value.toString();
            }
            if (isCustomText) {
                args.isRightAlign = false;
            } else {
                args.isRightAlign = !isNullOrUndefined(args.value);
            }
        } else {
            let result: { fResult: string, rightAlign: boolean } = this.processFormats(
                args, fResult, rightAlign, cell, intl, currencySymbol, option.currency, sheet);
            args.formattedText = result.fResult || (args.value === undefined || args.value === null ? '' : args.value.toString());
            args.isRightAlign = result.rightAlign;
        }
        args.curSymbol = currencySymbol;
        return args.formattedText;
    }

    private isCustomType(cell: CellModel): boolean {
        const format: string = getTypeFromFormat(cell.format);
        return (format === 'General' && cell.format !== 'General') || (format === 'Time' && this.parent.isEdit);
    }

    private processCustomFill(format: string, cell: CellModel, args: NumberFormatArgs, formatText?: string): string {
        const repeatChar: string = format[format.indexOf('*') + 1];
        const codes: string[] = format.split('*' + repeatChar);
        if (args.rowIndex === undefined) {
            formatText = formatText || this.processCustomNumberFormat({ format: codes.join(''), value: cell.value }, args);
        } else {
            let secText: string;
            if (codes[1]) {
                const cellVal: number = parseFloat(cell.value);
                if (cellVal < 0) {
                    secText = this.processCustomNumberFormat({ format: codes[1], value: Math.abs(cellVal).toString() }, args);
                    formatText = `-${codes[0]}`;
                } else {
                    secText = this.processCustomNumberFormat({ format: codes[1], value: cell.value }, args);
                    formatText = codes[0];
                }
                if (cellVal === 0) {
                    secText = secText.split('0').join('');
                }
            } else {
                formatText = formatText || this.processCustomNumberFormat({ format: codes[0], value: cell.value }, args);
            }
            args.isRowFill = true;
            this.setCell(args);
            this.parent.notify(
                rowFillHandler, { cell: cell, cellEle: args.td, rowIdx: args.rowIndex, colIdx: args.colIndex, beforeFillText: formatText,
                    repeatChar: repeatChar, afterFillText: secText });
        }
        return formatText;
    }

    private processCustomDateTime(args: NumberFormatArgs, cell: CellModel): string {
        let isCustomDate: boolean;
        const checkCustomDate: Function = (): boolean => {
            const cellVal: string = cell.value.toString();
            if (cellVal.includes(this.localeObj.dateSeparator) || cellVal.indexOf('-') > 0 || cellVal.includes(this.localeObj.timeSeparator)) {
                return true;
            }
            const formats: { months?: object } = IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject;
            const months: Object = formats.months['stand-alone'] && formats.months['stand-alone'].abbreviated;
            return months && !!Object.keys(months).find((key: string) => cellVal.includes(months[`${key}`]));
        };
        if (!isNumber(cell.value)) {
            isCustomDate = checkCustomDate();
            if (!isCustomDate) {
                return cell.value || '';
            }
        }
        let type: string;
        let custFormat: string = cell.format;
        const intl: Internationalization = new Internationalization();
        const formatDateTime: Function = (checkDate?: boolean): string => {
            let isValidDate: boolean; let dateArgs: { dateObj: Date, type?: string };
            if (isCustomDate) {
                dateArgs = toDate(cell.value, new Internationalization(), this.parent.locale, custFormat, cell);
                isValidDate = dateArgs.dateObj && dateArgs.dateObj.toString() !== 'Invalid Date';
                if (isValidDate) {
                    if (dateArgs.dateObj.getFullYear() < 1900) {
                        return '';
                    } else {
                        cell.value = dateToInt(dateArgs.dateObj, cell.value.toString().includes(':'), dateArgs.type === 'time').toString();
                    }
                }
            } else {
                if (this.checkAndProcessNegativeValue(args, cell.value)) {
                    args.formatApplied = true;
                    return args.formattedText;
                }
                dateArgs = { dateObj: intToDate(parseFloat(cell.value)) };
                isValidDate = dateArgs.dateObj && dateArgs.dateObj.toString() !== 'Invalid Date';
            }
            if (isValidDate) {
                if (checkDate) {
                    args.dateObj = dateArgs.dateObj;
                }
                args.formatApplied = true;
                let result: string;
                if (custFormat.startsWith('MM-dd-yyyy ')) { // While auto detect date time value, we will set this format only.
                    custFormat = custFormat.split(' ').splice(1).join(' ');
                    result = intl.formatDate(dateArgs.dateObj, { type: 'date', skeleton: 'yMd' }) + (custFormat ? ' ' +
                        intl.formatDate(dateArgs.dateObj, { type: type, format: custFormat }) : '');
                } else {
                    result = intl.formatDate(dateArgs.dateObj, { type: type, format: custFormat });
                    custFormat = custFormat.toLowerCase();
                    if (custFormat.startsWith('[h]')) {
                        const totalHours: number = (Number(cell.value.toString().split('.')[0]) * 24) + dateArgs.dateObj.getHours();
                        result = totalHours.toString() + result.slice(result.indexOf(']') + 1);
                    } else if (custFormat.startsWith('[m')) {
                        const totalMins: number = (Number(cell.value.toString().split('.')[0]) * 1440) + (dateArgs.dateObj.getHours() * 60)
                            + dateArgs.dateObj.getMinutes();
                        result = totalMins.toString() + result.slice(result.indexOf(']') + 1);
                    } else if (custFormat.startsWith('[s')) {
                        result = ((Number(cell.value.toString().split('.')[0]) * 86400) + (((dateArgs.dateObj.getHours() * 60) +
                            dateArgs.dateObj.getMinutes()) * 60) + dateArgs.dateObj.getSeconds()).toString();
                    }
                }
                if (isShortMeridian) {
                    return result.replace(this.localeObj.am, 'A').replace(this.localeObj.pm, 'P');
                }
                return result;
            }
            return '';
        };
        if (cell.format.indexOf('h') > -1) {
            custFormat = custFormat.split('h').join('H');
            type = 'time';
        }
        if (cell.format.indexOf('s') > -1) {
            type = 'time';
        }
        const isShortMeridian: boolean = cell.format.indexOf('A/P') > -1;
        if (cell.format.indexOf('AM/PM') > -1 || isShortMeridian) {
            custFormat = custFormat.split('H').join('h');
            custFormat = custFormat.split('A/P').join('AM/PM').split('AM/PM').join('a');
            type = 'time';
        }
        if (cell.format.indexOf('d') > -1) {
            type = 'date';
            // Split the format with ' ' for replacing d with E only for a day of the week in the MMM d, yyyy ddd format
            const formatArr: string[] = custFormat.split(' ');
            let dayMatchStr: RegExpMatchArray;
            for (let formatIdx: number = 0; formatIdx < formatArr.length; formatIdx++) {
                dayMatchStr = formatArr[formatIdx as number].match(/d/g);
                if (dayMatchStr && dayMatchStr.length > 2) {
                    formatArr[formatIdx as number] = formatArr[formatIdx as number].split('d').join('E');
                }
            }
            custFormat = formatArr.join(' ');
        }
        if (cell.format.indexOf('m') > -1) {
            if (cell.format.indexOf('s') > -1 || cell.format.indexOf('h') > -1) {
                type = 'time';
                if (cell.format.includes(' ')) {
                    const formatArr: string[] = custFormat.split(' ');
                    if (formatArr[0].includes('d') || formatArr[0].includes('y')) {
                        formatArr[0] = formatArr[0].split('m').join('M');
                        custFormat = formatArr.join(' ');
                    }
                }
            } else {
                type = 'date';
                custFormat = custFormat.split('m').join('M');
                if (cell.format.indexOf('mmmmm') > -1) {
                    custFormat = 'MMMM';
                    const monthName: string = formatDateTime()[0];
                    custFormat = cell.format.split('mmmmm').join('p');
                    return formatDateTime(args.checkDate).split('p').join(monthName);
                }
            }
        }
        return formatDateTime(args.checkDate);
    }

    private processCustomConditions(cell: CellModel, args: NumberFormatArgs): string {
        if (isNumber(cell.value)) {
            const formatArr: string[] = cell.format.split(';');
            const val: number = Number(cell.value);
            let compareVal: string; let values: string[]; let conditionNotMatch: boolean; let colorCode: string;
            for (let i: number = 0; i < formatArr.length; i++) {
                cell.format = formatArr[i as number];
                colorCode = getColorCode(cell.format);
                if (colorCode) {
                    cell.format = cell.format.split(`[${colorCode}]`).join('');
                }
                if (cell.format.includes('[')) {
                    compareVal = cell.format.split('[')[1].split(']')[0];
                    if (((values = compareVal.split('<=')).length === 2 && val <= Number(values[1])) ||
                        (values.length === 1 && (values = compareVal.split('>=')).length === 2 && val >= Number(values[1])) ||
                        (values.length === 1 && (values = compareVal.split('<')).length === 2 && val < Number(values[1])) ||
                        (values.length === 1 && (values = compareVal.split('>')).length === 2 && val > Number(values[1]))) {
                        cell.format = formatArr[i as number].split(`[${compareVal}]`).join('');
                        conditionNotMatch = false;
                        break;
                    }
                    conditionNotMatch = values.length === 2;
                } else {
                    cell.format = formatArr[i as number];
                    conditionNotMatch = false;
                    break;
                }
            }
            if (conditionNotMatch) {
                this.removeFormatColor(args, { format: formatArr.join(''), style: cell.style });
                return this.processCustomFill('*#', cell, args, '#####');
            }
            return this.processCustomNumberFormat(cell, args);
        } else {
            return cell.value;
        }
    }

    private processCustomAccounting(cell: CellModel, args: NumberFormatArgs, curSymbol: string): string {
        const formats: string[] = cell.format.split(';');
        const numObj: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
            cell, this.parent.locale, this.groupSep, this.decimalSep, curSymbol);
        let cellValue: number;
        if (numObj.isNumber) {
            cell.value = numObj.value;
            cellValue = parseFloat(numObj.value);
        }
        let format: string;
        if (cellValue > 0) {
            format = formats[0];
        } else if (cellValue === 0) {
            if (formats[2]) {
                format = formats[2].includes(`${curSymbol}0`) ? formats[2].split('0').join('#') : formats[2];
            } else {
                format = formats[0];
            }
        } else if (isNumber(cellValue)) {
            format = formats[1];
        } else {
            const cellVal: string = cell.value || <unknown>cell.value === 0 ? cell.value : '';
            cell.format = '@';
            return formats[3] ? this.processCustomText(formats[3], cellVal, args) : cellVal.toString();
        }
        return this.processCustomNumberFormat(
            { format: cell.format, value: cellValue < 0 ? Math.abs(cellValue).toString() : cell.value, style: cell.style }, args, format);
    }

    private processCustomText(format: string, cellVal: string, args: NumberFormatArgs): string {
        cellVal = cellVal.toString();
        const result: string = this.processCustomNumberFormat(
            { format: format.split('@').join('#'), value: cellVal.split(cellVal).join('1') }, args);
        return result && result.split('1').join(cellVal);
    }

    private thousandSeparator(count: number, value: number): number {
        while (count) {
            value = value / 1000;
            count--;
        }
        return value;
    }

    private getSeparatorCount(cell: CellModel): number {
        let count: number = 0;
        const codes: string[] = ['#', '0'];
        for (let i: number = 0; i < cell.format.length; i++) {
            if (cell.format[i as number] === ',' && !(codes.indexOf(cell.format[i + 1]) > -1)) {
                count++;
            }
        }
        return count;
    }

    private processDigits(cell: CellModel, customFormat: string): string {
        customFormat = customFormat.split('?').join('0');
        let cellValue: string = cell.value.toString();
        cellValue = this.getFormattedNumber(customFormat, parseFloat(cellValue));
        if (cellValue && cellValue.includes(this.decimalSep)) {
            const valArr: string[] = cellValue.split(this.decimalSep);
            cellValue = valArr[0] + this.decimalSep + valArr[1].split('0').join('  ');
        }
        return cellValue || cell.value;
    }

    private processFormatWithSpace(format: string, cell: CellModel, cellValue: number): { format: string, formattedText: string } {
        const space: string = ' ';
        const args: { [key: string]: string | CellModel | number } = { cell: cell, char: space, width: 0 };
        this.parent.notify(getTextSpace, args);
        const spaceWidth: number = <number>args.width;
        let count: number;
        const result: { format: string, formattedText: string } = { format: format, formattedText: '' };
        for (let i: number = 0; i < format.length; i++) {
            if (format[i as number] === '_') {
                args.char = format[i + 1];
                this.parent.notify(getTextSpace, args);
                const textWidth: number = <number>args.width;
                count = Math.round(textWidth / spaceWidth);
                format = format.replace(format[i as number] + format[i + 1], space.repeat(count));
            }
        }
        let lastSpaceCount: number = format.length - format.trim().length;
        if (lastSpaceCount > 0) {
            result.formattedText = this.getFormattedNumber(format.trim(), cellValue);
            if (format[0] === ' ') {
                let frontSpaceCount: number = 1;
                let idx: number = 1;
                while (format[idx as number] === ' ') {
                    frontSpaceCount++; idx++
                }
                lastSpaceCount -= frontSpaceCount;
                result.formattedText = space.repeat(frontSpaceCount) + result.formattedText;
            }
            result.formattedText += space.repeat(lastSpaceCount);
        } else {
            result.formattedText = this.getFormattedNumber(format, cellValue);
        }
        result.format = format;
        return result;
    }

    private removeFormatColor(args: NumberFormatArgs, cell: CellModel): void {
        if (getCustomColors().indexOf(getColorCode(cell.format)) > -1) {
            args.color = cell.style && cell.style.color ? cell.style.color : '';
            this.applyColor(args);
        }
    }

    private processCustomNumberFormat(cell: CellModel, args: NumberFormatArgs, format?: string): string {
        if (!cell.format) {
            return '';
        }
        let isFormatted: boolean; let isZeroFormat: boolean;
        let formattedText: string = cell.value;
        let cellValue: number | string = cell && checkIsNumberAndGetNumber(cell, this.parent.locale, this.groupSep, this.decimalSep).value;
        if (isNumber(cellValue)) {
            cell.value = cellValue;
            cellValue = parseFloat(cellValue.toString());
            let customFormat: string = format || cell.format;
            if (cell.format.indexOf('[') > -1) {
                const colorCode: string = getColorCode(customFormat);
                if (colorCode) {
                    customFormat = customFormat.split(`[${colorCode}]`).join('');
                    args.color = colorCode.toLowerCase();
                    this.applyColor(args);
                } else {
                    this.removeFormatColor(args, cell);
                }
            }
            if (customFormat.indexOf('"') > -1 || customFormat.indexOf('\\') > -1) {
                customFormat = this.processText(customFormat);
                isZeroFormat = cellValue === 0 && !customFormat.includes('#') && !customFormat.includes('0') && !customFormat.includes('?');
                if (isZeroFormat) { customFormat += '#'; }
            }
            const separatorCount: number = this.getSeparatorCount(cell);
            if (separatorCount) {
                isFormatted = true;
                let result: number = this.thousandSeparator(separatorCount, cellValue);
                if (customFormat.indexOf('.') === -1) {
                    result = Math.round(result);
                }
                formattedText = this.getFormattedNumber(customFormat.split(',').join(''), result);
                if (result === 0) {
                    formattedText = formattedText.replace('0', '');
                }
            }
            if (customFormat.indexOf('?') > -1) {
                isFormatted = true;
                formattedText = this.processDigits(cell, customFormat);
                customFormat = customFormat.split('?').join('');
            }
            if (customFormat.indexOf('_') > -1) {
                isFormatted = true;
                const result: { format: string, formattedText: string } = this.processFormatWithSpace(customFormat, cell, cellValue);
                customFormat = result.format;
                formattedText = result.formattedText;
            }
            if (formattedText && customFormat.indexOf('?') > -1) {
                formattedText = formattedText.replace('?', ' ');
            }
            if (customFormat.indexOf('*') > -1) {
                isFormatted = true;
                formattedText = this.processCustomFill(customFormat, cell, args);
            }
            if (customFormat === 'General') {
                isFormatted = true;
                formattedText = cellValue.toString();
            }
            if (!isFormatted) {
                formattedText = this.getFormattedNumber(customFormat, cellValue);
            }
            if (isZeroFormat && formattedText) {
                formattedText = formattedText.replace('0', '');
            }
            // Need to remove this line once this case is handled by core team.
            if (customFormat[0] === '#' && cellValue >= 0 && cellValue < 1) {
                const formatArr: string[] = customFormat.split('#').join('').split('.');
                if (!formatArr[0].includes('0')) {
                    if (cellValue === 0 && customFormat.includes('.') && (!formatArr[1] || !formatArr[1].includes('0'))) {
                        formattedText = this.getFormattedNumber(customFormat, 0.1);
                        formattedText = formattedText.replace('1', '');
                    }
                    const textArr: string[] = formattedText.split(this.decimalSep);
                    textArr[0] = textArr[0].toString().replace(/^0+/, '');
                    formattedText = textArr.join(this.decimalSep);
                }
            }
            if (formattedText === '-0') { // Need to remove this line once this case is handled by core team.
                formattedText = '0';
            }
        }
        return formattedText;
    }

    private processText(format: string): string {
        let custFormat: string = format;
        if (custFormat.indexOf('"') > -1) {
            custFormat = custFormat.split('"').join("'");
        } else if (custFormat.indexOf('\\') > -1) {
            custFormat = custFormat.split('\\').join('');
        }
        return custFormat;
    }

    private processFormats(
        args: NumberFormatArgs, fResult: string, isRightAlign: boolean, cell: CellModel, intl: Internationalization, currencySymbol: string,
        currencyCode: string, sheet: SheetModel): { fResult: string, rightAlign: boolean } {
        let options: AutoDetectGeneralFormatArgs;
        if (fResult !== '') {
            let numArgs: { isNumber: boolean, value: string };
            if (args.type !== 'General' && args.type !== 'Text' && this.isPercentageValue(fResult.toString(), args, cell)) {
                fResult = args.value.toString();
            }
            switch (args.type) {
            case 'General':
                options = { args: args, currencySymbol: currencySymbol, fResult: fResult, intl: intl, isRightAlign: isRightAlign,
                    curCode: currencyCode, cell: cell, rowIdx: Number(args.rowIndex), colIdx: Number(args.colIndex), sheet: sheet };
                this.autoDetectGeneralFormat(options);
                fResult = options.fResult;
                isRightAlign = options.isRightAlign;
                break;
            case 'Number':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.groupSep, this.decimalSep);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.applyNumberFormat(args, intl);
                    isRightAlign = true;
                }
                break;
            case 'Currency':
                numArgs = checkIsNumberAndGetNumber(
                    { value: fResult, format: args.format }, this.parent.locale, this.groupSep, this.decimalSep, currencySymbol);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.currencyFormat(args, intl, currencyCode, cell);
                    isRightAlign = true;
                }
                break;
            case 'Percentage':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.groupSep, this.decimalSep);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.percentageFormat(args, intl);
                    isRightAlign = true;
                }
                break;
            case 'Accounting':
                fResult = this.accountingFormat(args, fResult, intl, currencySymbol, currencyCode, cell);
                isRightAlign = args.formatApplied;
                break;
            case 'ShortDate':
                fResult = this.checkAndProcessNegativeValue(args, args.value) ? args.formattedText : this.shortDateFormat(args, intl);
                isRightAlign = !!fResult;
                break;
            case 'LongDate':
                fResult = this.checkAndProcessNegativeValue(args, args.value) ? args.formattedText : this.longDateFormat(args, intl);
                isRightAlign = !!fResult;
                break;
            case 'Time':
                fResult = this.checkAndProcessNegativeValue(args, args.value) ? args.formattedText : this.timeFormat(args, intl);
                isRightAlign = !!fResult;
                break;
            case 'Fraction':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.groupSep, this.decimalSep);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.fractionFormat(args);
                    isRightAlign = true;
                }
                break;
            case 'Scientific':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.groupSep, this.decimalSep);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.scientificFormat(args);
                    isRightAlign = true;
                }
                break;
            case 'Text':
                if (this.decimalSep !== '.' && isNumber(fResult) && fResult.toString().includes('.')) {
                    fResult = fResult.toString().replace('.', this.decimalSep);
                }
                isRightAlign = false;
                break;
            }
        }
        return { fResult: fResult, rightAlign: isRightAlign };
    }

    private autoDetectGeneralFormat(options: AutoDetectGeneralFormatArgs): void {
        const val: string = options.fResult; let prevVal: string;
        const addressFormula: boolean = options.args.cell && options.args.cell.formula && options.args.cell.formula.indexOf('ADDRESS(') > 0;
        const isDollarFormula: boolean = options.args.cell && options.args.cell.formula && options.args.cell.formula.indexOf('DOLLAR(') > 0;
        const isTextFormula: boolean = options.args.cell && options.args.cell.formula && options.args.cell.formula.indexOf('TEXT(') > 0;
        if (isDollarFormula && options.fResult && options.fResult.toString().includes(options.currencySymbol) || isTextFormula) {
            return;
        }
        if (options.fResult && this.decimalSep !== '.') {
            let cellVal: string = options.fResult.toString();
            prevVal = cellVal;
            if (cellVal.includes(this.decimalSep)) {
                cellVal = cellVal.replace(this.decimalSep, '.');
                if (isNumber(cellVal)) {
                    options.fResult = options.args.value = cellVal = Number(cellVal).toString();
                    setCell(options.rowIdx, options.colIdx, options.sheet, { value: cellVal }, true);
                    prevVal = cellVal.replace('.', this.decimalSep);
                }
            }
        }
        if (isNumber(options.fResult)) {
            let cellVal: string = Number(options.fResult).toString();
            if (options.args.format) {
                if (options.args.format.indexOf('%') > -1) {
                    options.fResult = this.percentageFormat(options.args, options.intl);
                } else if (options.args.format.indexOf(options.currencySymbol) > -1) {
                    options.fResult = this.currencyFormat(options.args, options.intl, options.curCode, options.args.cell);
                } else {
                    options.fResult = this.applyNumberFormat(options.args, options.intl);
                }
            }
            if (options.args.format === 'General') {
                if (options.args.cell && options.args.cell.formula && cellVal.includes('.') && cellVal.length > 11) {
                    const decIndex: number = cellVal.indexOf('.') + 1;
                    prevVal = null;
                    if (options.args.cell.formula.includes('RANDBETWEEN')) {
                        options.fResult = cellVal = decIndex < 7 ? cellVal : (parseFloat(cellVal)).toFixed(0);
                    } else {
                        options.fResult = cellVal = decIndex < 11 ? Number(parseFloat(cellVal).toFixed(11 - decIndex)).toString() :
                            parseFloat(cellVal).toFixed(0);
                    }
                }
                const cellValArr: string[] = cellVal.split('.');
                if (cellValArr[0].length > 11) {
                    cellVal = (Math.abs(Number(cellValArr[0])).toString()).substring(0,6).replace(/0+$/,'');
                    let digitLen: number = cellVal.length - 1;
                    if (digitLen > -1) {
                        options.fResult = this.scientificFormat(options.args, digitLen > 5 ? 5 : digitLen);
                    }
                } else if (cellValArr[1]) {
                    if (cellValArr[1].length > 9) {
                        options.fResult = options.intl.formatNumber(Number(cellVal), { format: '0.000000000' });
                        if (options.fResult) {
                            options.fResult = Number(options.fResult).toString();
                        }
                    } else if (cellVal.includes('e-')) {
                        const expVal: string[] = cellVal.split('e-');
                        const digitLen: number = Number(expVal[1]) + (expVal[0].includes('.') ? expVal[0].split('.')[1].length : 0);
                        expVal[0] = expVal[0].replace('.', this.decimalSep);
                        if (expVal[1].length === 1) {
                            expVal[1] = '0' + expVal[1];
                        }
                        setCell(options.rowIdx, options.colIdx, options.sheet, { value: Number(cellVal).toFixed(digitLen) }, true);
                        options.fResult = expVal.join('E-');
                    } else if (prevVal) {
                        options.fResult = prevVal;
                    }
                }
                if (isNullOrUndefined(options.fResult) && !isNullOrUndefined(cellVal)) {
                    options.fResult = cellVal;
                }
            }
            options.isRightAlign = true;
        }
        if (options.fResult) {
            let res: string = options.fResult.toString();
            if (this.isPercentageValue(res, options.args, options.cell)) {
                options.cell.format = options.args.format = res.includes(this.decimalSep) ? getFormatFromType('Percentage') : '0%';
                options.fResult = this.percentageFormat(options.args, options.intl);
                options.isRightAlign = true;
            } else {
                let format: string = '';
                if (res.includes(options.currencySymbol)) { // Auto detect 1000 separator format with currency symbol
                    format = res.includes(this.decimalSep) ? '$#,##0.00' : '$#,##0';
                    res = res.replace(options.currencySymbol, '');
                }
                const isEdit: boolean = this.decimalSep === '.' || options.args.isEdit;
                if (isEdit && res.includes(this.groupSep) && parseThousandSeparator(res, this.parent.locale, this.groupSep, this.decimalSep)) {
                    res = res.split(this.groupSep).join('');
                    if (!format) { // Auto detect 1000 separator format
                        format = (res.includes(this.decimalSep) ? '#,##0.00' : '#,##0');
                    }
                }
                if (format) {
                    res = res.replace(this.decimalSep, '.');
                    if (isNumber(res)) {
                        options.args.value = Number(res).toString();
                        setCell(options.rowIdx, options.colIdx, options.sheet, { value: options.args.value, format: format }, true);
                        options.fResult = this.getFormattedNumber(format, Number(options.args.value));
                        options.isRightAlign = true;
                    }
                } else if (this.decimalSep !== '.' && options.args.format === 'General' && isNumber(res) && res.includes('.')) {
                    options.fResult = Number(res).toString().replace('.', this.decimalSep);
                }
            }
        }
        if (addressFormula) {
            options.isRightAlign = false;
            options.fResult = val;
        }
    }

    private isPercentageValue(value: string, args: NumberFormatArgs, cell: CellModel): boolean {
        if (value.includes('%')) {
            const valArr: string[] = value.split('%');
            if (valArr[0] !== '' && valArr[1].trim() === '' && Number(valArr[0].split(this.groupSep).join('')).toString() !== 'NaN') {
                args.value = Number(valArr[0].split(this.groupSep).join('')) / 100;
                cell.value = args.value.toString();
                return true;
            }
        }
        return false;
    }

    private findSuffix(zeros: string, resultSuffix: string): string {
        const len: number = zeros.length;
        const suffixLen: number = len - resultSuffix.length;
        return zeros.substr(0, suffixLen < 0 ? 0 : suffixLen) + resultSuffix;
    }

    private applyNumberFormat(args: NumberFormatArgs, intl: Internationalization): string {
        args.format = this.isCustomFormat(args.format);
        const formatArr: string[] = args.format.split(';');
        if (Number(args.value) > 0) {
            args.format = formatArr[0];
        } else if (Number(args.value) === 0) {
            args.format = formatArr[2] ? formatArr[2] : formatArr[0];
            if (args.format.indexOf('"') > -1 && args.format.indexOf('#') === -1) {
                args.format = args.format.split('_').join(' ').split('*').join(' ').split('?').join(' ').split('"').join('');
                return args.format;
            }
        } else if (Number(args.value) < 0) {
            args.format = !isNullOrUndefined(formatArr[1]) ? formatArr[1].split('*').join(' ') : formatArr[0];
            if (args.format.indexOf('-') > -1) {
                args.value = args.value.toString().split('-').join('');
            }
        } else {
            args.format = formatArr[3] ? formatArr[3] : formatArr[0];
            args.format = args.format.split('_').join(' ').split('*').join(' ').split('?').join(' ');
            if (args.format.indexOf('@') > -1) {
                return args.format.split('@').join(args.value.toString());
            }
        }
        args.format = args.format.split('_').join(' ').split('*').join(' ').split('"').join('');
        if (args.format.indexOf('?') > -1 && args.format.indexOf(this.decimalSep) > -1) {
            const formatDecimalLen: number = args.format.split(this.decimalSep)[1].length;
            let replaceString: string = '';
            if (Number(args.value) % 1) {
                const valueDecimalLen: number = args.value.toString().split('.')[1].length;
                if (formatDecimalLen > valueDecimalLen) {
                    replaceString = ' ';
                } else {
                    replaceString = '0';
                }
            }
            args.format = args.format.split('?').join(replaceString);
        } else {
            args.format = args.format.split('?').join(' ');
        }
        if (Number(args.value) < 0 && args.cell && args.cell.format) {
            args.format = args.cell.format;
        }
        return intl.formatNumber(Number(args.value), { format: args.format });
    }

    private isCustomFormat(format: string): string {
        if (format === '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"_-;_-@_-' || format === '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-') {
            format = '';
        }
        format = format === '' ? getFormatFromType('Number') : format;
        format = format.toString().split('_)').join(' ').split('_(').join(' ').split('[Red]').join('');
        return format;
    }
    private currencyFormat(args: NumberFormatArgs, intl: Internationalization, currencyCode: string, cell: CellModel): string {
        args.format = args.format || getFormatFromType('Currency');
        args.format = args.format.split('_(').join(' ').split('_)').join(' ');
        const formatArr: string[] = args.format.split(';');
        const colorCode: string = getColorCode(args.format);
        let cellVal: number = Number(args.value);
        if (cellVal >= 0 || isNullOrUndefined(formatArr[1])) {
            if (colorCode) {
                args.color = cell.style && cell.style.color ? cell.style.color : '';
                this.applyColor(args);
            }
            args.format = formatArr[0];
        } else {
            cellVal = Math.abs(cellVal);
            args.format = formatArr[1].split(`[${colorCode}]`).join('').split('*').join(' ');
            if (colorCode) {
                args.color = colorCode.toLowerCase();
                this.applyColor(args);
            }
        }
        args.format = this.getFormatForOtherCurrency(args.format);
        return intl.formatNumber(cellVal, { format: args.format, currency: currencyCode });
    }

    private applyColor(args: NumberFormatArgs): void {
        if (args.refresh) {
            this.setCell(args);
            if (args.td && args.td.style.color !== args.color) {
                this.parent.notify(
                    applyCellFormat, <CellFormatArgs>{ style: { color: args.color }, rowIdx: args.rowIndex, colIdx: args.colIndex,
                    td: args.td });
            }
        }
    }
    private setCell(args: NumberFormatArgs): void {
        if (!args.td) {
            const mergeArgs: VisibleMergeIndexArgs = { sheet: getSheet(this.parent, args.sheetIndex), cell: args.cell, rowIdx: args.rowIndex,
                colIdx: args.colIndex };
            if (args.cell.rowSpan > 1 || args.cell.colSpan > 1) {
                setVisibleMergeIndex(mergeArgs);
            }
            args.td = this.parent.getCell(mergeArgs.rowIdx, mergeArgs.colIdx);
        }
    }

    private percentageFormat(args: NumberFormatArgs, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType('Percentage') : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format as string
        });
    }

    private accountingFormat(
        args: NumberFormatArgs, fResult: string, intl: Internationalization, currencySymbol: string, currencyCode: string,
        cell: CellModel): string {
        args.format = args.format || getFormatFromType('Accounting');
        args.format = args.format.split('_(').join(' ').split('_)').join(' ').split('[Red]').join('').split('_').join('');
        const formatArr: string[] = (args.format as string).split(';');
        const numArgs: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
            { value: fResult }, this.parent.locale, this.groupSep, this.decimalSep);
        if (numArgs.isNumber) {
            cell.value = args.value = numArgs.value;
            let cellVal: number = Number(args.value);
            if (cellVal >= 0) {
                args.format = cellVal === 0 && formatArr[2] ? formatArr[2] : formatArr[0];
            } else {
                args.format = formatArr[1].split('*').join(' ');
                cellVal = Math.abs(cellVal);
            }
            if (!args.format.includes(currencySymbol) && !args.format.includes('$')) {
                currencyCode = currencySymbol = '';
            }
            args.format = this.getFormatForOtherCurrency(args.format);
            args.formatApplied = true;
            if (cellVal === 0) {
                return (args.format.includes(` ${currencySymbol}`) ? ' ' : '') + currencySymbol + '- ';
            } else {
                return intl.formatNumber(cellVal, { format: args.format, currency: currencyCode });
            }
        } else if (formatArr[3]) {
            return this.processCustomText(formatArr[3], fResult, args);
        }
        return fResult;
    }

    private getFormatForOtherCurrency(format: string): string {
        if (format.indexOf('[$') > -1) {
            const symbol: string = format.split(']')[0].split('[$')[1].split('-')[0];
            if (format.indexOf('0') > format.indexOf('[$')) {
                format = symbol + format.slice(format.indexOf(']') + 1, format.length);
            } else {
                format = format.slice(0, format.indexOf('[$')) + symbol;
            }
        }
        return format;
    }

    private checkAndProcessNegativeValue(args: NumberFormatArgs, cellValue: string | number): boolean {
        if (cellValue && isNumber(cellValue) && Number(cellValue) < 0) {
            if (args.rowIndex === undefined || args.dataUpdate) {
                args.formattedText = '#'.repeat(args.dataUpdate ? 7 : 10);
                return true;
            }
            args.isRowFill = true;
            this.setCell(args);
            const eventArgs: { cell: CellModel, cellEle: HTMLElement, rowIdx: number, colIdx: number, repeatChar: string,
                formattedText?: string } = { cell: args.cell, cellEle: args.td, rowIdx: args.rowIndex, colIdx: args.colIndex,
                repeatChar: '#' };
            this.parent.notify(rowFillHandler, eventArgs);
            args.formattedText = eventArgs.formattedText;
            return true;
        }
        return false;
    }

    private shortDateFormat(args: NumberFormatArgs, intl: Internationalization): string {
        let format: string = (args.format === '' || args.format === 'General') ? getFormatFromType('ShortDate') : <string>args.format;
        let dateObj: Object;
        if (format === getFormatFromType('ShortDate')) {
            format = 'MM-dd-yyyy';
            dateObj = { type: 'date', skeleton: 'yMd' };
        } else {
            dateObj = { type: 'date', format: format };
        }
        if (args.value) {
            args.value = args.value.toString();
            if ((args.value.includes(this.localeObj.dateSeparator) || args.value.indexOf('-') > 0) && !isNumber(args.value)) {
                if (format === 'dd-MM-yyyy' || format === 'dd/MM/yyyy') {
                    format = '';
                }
                const obj: Date = toDate(args.value, intl, this.parent.locale, format, args.cell).dateObj;
                if (obj && obj.toString() !== 'Invalid Date') {
                    if (obj.getFullYear() < 1900) {
                        return isNumber(args.value) ? args.value : '';
                    }
                    args.value = dateToInt(obj).toString();
                    if (args.cell) {
                        args.cell.value = args.value;
                    }
                    if (args.checkDate) {
                        args.dateObj = obj;
                    }
                    return intl.formatDate(obj, dateObj);
                }
            }
        }
        const shortDate: Date = intToDate(args.value);
        if (shortDate && shortDate.toString() !== 'Invalid Date' && shortDate.getFullYear() < 1900) {
            return isNumber(args.value) ? args.value.toString() : '';
        }
        if (args.checkDate) {
            args.dateObj = shortDate;
        }
        return intl.formatDate(shortDate, dateObj);
    }

    private longDateFormat(args: NumberFormatArgs, intl: Internationalization): string {
        args.value = args.value.toString();
        let longDate: Date;
        if ((args.value.includes(this.localeObj.dateSeparator) || args.value.indexOf('-') > 0) && !isNumber(args.value)) {
            longDate = toDate(args.value, intl, this.parent.locale, '', args.cell).dateObj;
            if (longDate && longDate.toString() !== 'Invalid Date' && longDate.getFullYear() >= 1900) {
                args.value = dateToInt(longDate).toString();
                if (args.cell) {
                    args.cell.value = args.value;
                }
            } else {
                return isNumber(args.value) ? args.value : '';
            }
        } else {
            longDate = intToDate(args.value);
            if (longDate && longDate.toString() !== 'Invalid Date' && longDate.getFullYear() < 1900) {
                return isNumber(args.value) ? args.value : '';
            }
        }
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType('LongDate')
            : args.format.toString();
        if (code === getFormatFromType('LongDate')) {
            code = 'EEEE, MMMM d, y';
        }
        if (args.checkDate) {
            args.dateObj = longDate;
        }
        return intl.formatDate(longDate, { type: 'date', format: code });
    }

    private timeFormat(args: NumberFormatArgs, intl: Internationalization): string {
        if (isNullOrUndefined(args.value)) {
            return '';
        }
        const code: string = (args.format === '' || args.format === 'General') || args.format === getFormatFromType('Time') ? 'h:mm:ss a' :
            args.format;
        let cellVal: string = args.value.toString();
        if (!isNumber(cellVal) && cellVal.includes(this.localeObj.timeSeparator)) {
            const obj: ToDateArgs = toDate(cellVal, intl, this.parent.locale, code, args.cell);
            if (obj.dateObj && obj.dateObj.toString() !== 'Invalid Date') {
                cellVal = args.value = dateToInt(obj.dateObj, true, obj.type && obj.type === 'time').toString();
                if (args.cell) {
                    args.cell.value = args.value;
                }
            } else {
                return '';
            }
        }
        const value: string[] = cellVal.split('.');
        if (!isNullOrUndefined(value[1])) {
            args.value = parseFloat((value[0] + 1) + '.' + value[1]) || args.value;
        }
        return intl.formatDate(intToDate(args.value), { type: 'time', skeleton: 'medium', format: code });
    }

    private scientificHashFormat(args: NumberFormatArgs, fArr: string[]): string {
        const fractionCount: number = this.findDecimalPlaces(args.format);
        const wholeCount: number = (fArr[0].split('0').length - 1) + (fArr[0].split('#').length - 1);
        const formattedVal: string = Number(args.value).toExponential(fractionCount + wholeCount);
        let expoSeparator: string;
        if (formattedVal.includes('e+')) {
            expoSeparator = 'e+';
        } else if (formattedVal.includes('e-')) {
            expoSeparator = 'e-';
        } else {
            return formattedVal;
        }
        const exponentArr: string[] = formattedVal.split(expoSeparator);
        const decimalArr: string[] = exponentArr[0].split('.');
        const exponent: number = Number(exponentArr[1]);
        let fractionDiff: number;
        if (expoSeparator === 'e-') {
            const expoVal: number = exponent + Math.abs(exponent - (wholeCount * (exponent > wholeCount ? 2 : 1)));
            fractionDiff = expoVal - exponent;
            exponentArr[1] = expoVal.toString();
        } else {
            fractionDiff = exponent % wholeCount;
            exponentArr[1] = (exponent - fractionDiff).toString();
        }
        if (fractionDiff > 0) {
            decimalArr[0] += decimalArr[1].substring(0, fractionDiff);
            decimalArr[1] = decimalArr[1].slice(fractionDiff);
            exponentArr[0] = decimalArr.join('.');
        }
        const base: number = Number('1' + '0'.repeat(fractionCount));
        return this.getFormattedNumber(fArr.join('.'), Number((Math.round(Number(exponentArr[0]) * base) / base).toFixed(fractionCount))) +
            expoSeparator.toUpperCase() + this.findSuffix(args.format.split('+')[1], exponentArr[1]);
    }

    private scientificFormat(args: NumberFormatArgs, prefix?: number): string {
        args.format = args.format === '' ? getFormatFromType('Scientific') : args.format;
        const zeros: string = (args.format as string).split('+')[1] || '00';
        if (prefix === undefined) {
            prefix = this.findDecimalPlaces(args.format);
        }
        let fResult: string = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        } else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult.replace('.', this.decimalSep);
    }

    private fractionFormat(args: NumberFormatArgs): string {
        args.format = args.format || getFormatFromType('Fraction');
        this.checkAndSetColor(args);
        const valArr: string[] = args.value.toString().split('.');
        const suffixVal: string = this.getFormattedNumber(args.format.split(' ')[0], Number(valArr[0]));
        const fractionDigit: number = args.format.split('?').length / 2;
        if (valArr.length === 2 && !valArr[1].startsWith('0'.repeat(fractionDigit))) {
            const fractionResult: string = toFraction(Number(args.value));
            if (fractionResult) {
                return `${suffixVal} ${fractionResult}`;
            }
        }
        return suffixVal + ' ' + '  '.repeat(fractionDigit * 2);
    }

    private checkAndSetColor(args: NumberFormatArgs): void {
        const colorCode: string = getColorCode(args.format);
        if (colorCode) {
            args.format = args.format.split(`[${colorCode}]`).join('');
            args.color = colorCode.toLowerCase();
            this.applyColor(args);
        }
    }

    private findDecimalPlaces(code: string): number {
        const eIndex: number = code.toUpperCase().indexOf('E');
        if (eIndex > -1) {
            let decIndex: number = code.indexOf(this.decimalSep);
            if (decIndex === -1 && this.decimalSep !== '.') {
                decIndex = code.indexOf('.');
            }
            return decIndex > 0 ? code.substring(decIndex + 1, eIndex).length : 0;
        }
        return 2;
    }

    public checkDateFormat(args: DateFormatCheckArgs): void {
        if (isNullOrUndefined(args.value)) {
            return;
        }
        const cell: CellModel = args.cell || getCell(
            args.rowIndex, args.colIndex,
            getSheet(this.parent, isNullOrUndefined(args.sheetIndex) ? this.parent.activeSheetIndex : args.sheetIndex), false, true);
        const props: { val: string, format: string } = this.checkCustomDateFormat(args.value.toString(), cell, args.isEdit);
        if (props.val !== 'Invalid') {
            const dateObj: ToDateArgs = toDate(props.val, args.intl || new Internationalization(), this.parent.locale, props.format, cell);
            if (!isNullOrUndefined(dateObj.dateObj) && dateObj.dateObj.toString() !== 'Invalid Date' &&
                dateObj.dateObj.getFullYear() >= 1900) {
                props.val = dateToInt(dateObj.dateObj, props.val.indexOf(':') > -1, dateObj.type && dateObj.type === 'time').toString();
                if (!cell.format || cell.format === 'General') {
                    if (dateObj.type === 'time') {
                        cell.format = getFormatFromType('Time');
                    } else {
                        cell.format = getFormatFromType('ShortDate');
                    }
                }
                args.isDate = dateObj.type === 'date' || dateObj.type === 'datetime';
                args.isTime = dateObj.type === 'time';
                args.dateObj = dateObj.dateObj;
            }
            args.updatedVal = props.val;
        }
    }

    private checkCustomTimeFormat(val: string, cell: CellModel): { val: string, format: string } {
        let format: string[] = [];
        const am: string = ` ${this.localeObj.am}`; const pm: string = ` ${this.localeObj.pm}`;
        let isTewlveHr: boolean = val.includes(am) || val.includes(pm);
        if (!isTewlveHr) {
            if (val.includes(am.toLowerCase()) || val.includes(pm.toLowerCase())) {
                val = val.replace(am.toLowerCase(), am).replace(pm.toLowerCase(), pm);
                isTewlveHr = true;
            }
        }
        const timeArr: string[] = val.split(this.localeObj.timeSeparator);
        const isDefaultTime: boolean = timeArr.length === 3 && isTewlveHr;
        let twelveHrRep: string;
        if (timeArr.length <= 3) {
            let timeProp: number; let valArr: string[];
            const maxHour: number = isTewlveHr ? 12 : 24;
            timeArr.forEach((timeVal: string, index: number) => {
                if (timeVal.includes(am) || timeVal.includes(pm)) {
                    twelveHrRep = ' AM/PM';
                    timeVal = timeVal.replace(am, '').replace(pm, '');
                } else {
                    twelveHrRep = '';
                }
                timeProp = Number(timeVal);
                if (isNumber(timeProp) && timeProp >= 0) {
                    if (timeProp <= maxHour && index === 0) {
                        format.push('h' + twelveHrRep);
                        if (timeArr.length === 1) {
                            if (twelveHrRep) {
                                valArr = val.split(' ');
                                valArr[0] += `${this.localeObj.timeSeparator}00`;
                                timeArr[0] = valArr.join(' ');
                            } else {
                                format = [];
                                val = 'Invalid';
                            }
                        }
                    } else if (timeProp <= 60 && (format.length === 1 || format.length === 2)) {
                        if (format.length === 1) {
                            format.push('mm' + twelveHrRep);
                        } else {
                            format.push('ss');
                        }
                        if (timeVal.length === 1) {
                            timeArr[index as number] = `0${timeArr[index as number]}`;
                        }
                    } else {
                        format = [];
                        val = 'Invalid';
                    }
                } else {
                    format = [];
                    val = 'Invalid';
                }
            });
        } else {
            val = 'Invalid';
        }
        if (format.length) {
            val = timeArr.join(this.localeObj.timeSeparator);
            if((!cell.format || cell.format === 'General') && !isDefaultTime) {
                cell.format = format.join(':');
                return { val: val, format: cell.format };
            }
        }
        return { val: val, format: '' };
    }

    private checkCustomDateFormat(val: string, cell: CellModel, isEdit: boolean): { val: string, format: string } {
        let separator: string;
        const cellFormat: string = cell.format; let timeArgs: { val: string, format: string };
        if (val.includes(this.localeObj.dateSeparator) && ((!val.includes(` ${this.localeObj.am}`) &&
            !val.includes(` ${this.localeObj.pm}`)) ||
            val.replace(` ${this.localeObj.am}`, '').replace(` ${this.localeObj.pm}`, '').includes(this.localeObj.dateSeparator))) {
            separator = this.localeObj.dateSeparator;
            if (val.includes(this.localeObj.timeSeparator) && val.includes(' ')) {
                const valArr: string[] = val.split(' ');
                val = valArr.shift();
                timeArgs = this.checkCustomTimeFormat(valArr.join(' '), cell);
                if (timeArgs.val === 'Invalid') {
                    return { val: 'Invalid', format: '' };
                }
            }
        } else if (val.indexOf('-') > 0) {
            separator = '-';
        } else {
            if (val.includes(this.localeObj.timeSeparator) || val.includes(` ${this.localeObj.am}`) ||
                val.includes(` ${this.localeObj.pm}`)) {
                return this.checkCustomTimeFormat(val, cell);
            }
            return { val: 'Invalid', format: '' };
        }
        const dateArr: string[] = val.split(separator);
        let format: string = ''; const formatArr: string[] = [];
        const updateFormat: Function = (): void => {
            format = formatArr.join(separator);
            if (!cellFormat || cellFormat === 'General') {
                cell.format = format + (cell.format && cell.format !== 'General' ? ` ${cell.format}` : '');
            }
        };
        let firstVal: string;
        const formats: { months?: object } = IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject;
        const months: Object = formats.months['stand-alone'] ? formats.months['stand-alone'].wide : {};
        const abbreviatedMonth: Object = formats.months['stand-alone'] ? formats.months['stand-alone'].abbreviated : { '1': '' };
        const enUSMonth: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const isMonth: Function = (monthValue: string, monthKey: string, dateVal: string, dateLength: number): void => {
            if (abbreviatedMonth[`${monthKey}`] && abbreviatedMonth[`${monthKey}`].toLowerCase() === dateVal) {
                firstVal = abbreviatedMonth[`${monthKey}`];
                return;
            }
            let shortMonthValue = monthValue.substring(0, dateLength);
            if (shortMonthValue === dateVal) {
                firstVal = abbreviatedMonth[`${monthKey}`] || enUSMonth[Number(monthKey) - 1];
            }
        }
        if (dateArr.length === 2) {
            const updateSecValue: Function = (secVal: string): void => {
                val = firstVal;
                formatArr[0] = 'MMM';
                if (Number(secVal) <= 31) {
                    val = secVal + separator + val;
                    if (this.localeObj.dateSeparator !== '/' && separator !== '-') {
                        val += separator + new Date().getFullYear();
                    }
                    formatArr.splice(0, 0, 'dd');
                    updateFormat();
                } else if (Number(secVal) >= 1900 && Number(secVal) <= 9999) {
                    val = '1' + separator + val + separator + secVal;
                    formatArr[1] = 'yy';
                    updateFormat();
                    // Changed year format alone when given year value with 4 digits like May-2022
                    formatArr[1] = 'yyyy';
                    format = formatArr.join(separator);
                } else {
                    val = 'Invalid'; //Set as Invalid for invalid data like May-June.
                }
            };
            dateArr[0] = dateArr[0].toLowerCase().trim(); dateArr[1] = dateArr[1].toLowerCase().trim();
            if (!Number(dateArr[0]) && dateArr[0].length >= abbreviatedMonth['1'].length) {
                Object.keys(months).find(
                    (key: string) => isMonth(months[`${key}`].toLowerCase(), key, dateArr[0], dateArr[0].length));
                if (!isNullOrUndefined(firstVal) && !dateArr[0].includes(',')) { // Added ',' checking to skip updating for the MMM d, yyyy ddd format.
                    updateSecValue(dateArr[1]);
                }
            } else if (!Number(dateArr[1]) && dateArr[1].length >= abbreviatedMonth['1'].length) {
                Object.keys(months).find(
                    (key: string) => isMonth(months[`${key}`].toLowerCase(), key, dateArr[1], dateArr[1].length));
                if (!isNullOrUndefined(firstVal)) {
                    updateSecValue(dateArr[0]);
                }
            } else if (Number(dateArr[0]) && Number(dateArr[0]) <= 12 && Number(dateArr[1]) && (this.localeObj.dateSeparator === '/' ||
                separator === '-' || isEdit)) {
                firstVal = enUSMonth[Number(dateArr[0]) - 1];
                updateSecValue(dateArr[1]);
            }
            if (!formatArr.length) {
                val = 'Invalid';
            }
        } else if (dateArr.length > 2) {
            for (let i: number = 0; i < dateArr.length; i++) {
                if (!(Number(dateArr[i as number]) > -1)) {
                    dateArr[i as number] = dateArr[i as number].trim();
                    Object.keys(months).find((key: string) =>
                        isMonth(months[`${key}`].toLowerCase(), key, dateArr[i as number].trim().toLowerCase(),
                                dateArr[i as number].length));
                    if (!isNullOrUndefined(firstVal)) {
                        if (i === 1) {
                            formatArr[1] = 'MMM';
                            dateArr[2] = dateArr[2].trim();
                            if (Number(dateArr[0]) < 31 && Number(dateArr[2]) >= 1900 && Number(dateArr[2]) <= 9999) {
                                val = dateArr[0] + separator + firstVal;
                                val += (separator + dateArr[2]);
                                formatArr[0] = 'd';
                                formatArr[2] = 'yy';
                                updateFormat();
                                // Changed year format alone when given year value with 4 digits like 20-May-2022
                                formatArr[2] = 'yyyy';
                                format = formatArr.join(separator);
                            }
                        }
                    } else {
                        val = 'Invalid';
                    }
                }
            }
        }
        if (timeArgs && val !== 'Invalid') {
            if (!format && (!cellFormat || cellFormat === 'General')) {
                cell.format = `${getFormatFromType('ShortDate')} ${timeArgs.format || getFormatFromType('Time')}`;
            } else if (timeArgs.format) {
                format += ` ${timeArgs.format}`;
            }
            val += ` ${timeArgs.val}`;
        }
        return { val: val, format: format };
    }

    private formattedBarText(args: { cell: CellModel, value: string }): void {
        if (args.value === '' || isNullOrUndefined(args.value)) {
            return;
        }
        const option: { type?: string } = {};
        const format: string = (args.cell && args.cell.format) || '';
        let type: string = format && isCustomDateTime(format, true, option, true) ? option.type : '';
        const intl: Internationalization = new Internationalization();
        const beforeText: string = args.value;
        const date: string = getFormatFromType('ShortDate');
        const time: string = getFormatFromType('Time');
        const timeFormat: string = format.toLowerCase();
        const parseOtherCultureNumber: Function = (): void => {
            if (this.decimalSep !== '.' && args.value) {
                args.value = args.value.toString();
                if (isNumber(args.value) && args.value.includes('.')) {
                    args.value = args.value.replace('.', this.decimalSep);
                }
            }
        };
        if (type === 'time' && timeFormat.includes('m') && !timeFormat.includes(':m') && !timeFormat.includes('m:') &&
            !timeFormat.includes('[m') && !timeFormat.includes('am')) {
            type = 'date';
        }
        if (type === 'date') {
            const val: string = args.value.toString();
            args.value = this.shortDateFormat({ type: type, value: args.value, format: date, cell: <CellModel>args.cell }, intl);
            if (args.value && val.includes('.')) {
                args.value += ` ${this.timeFormat({ type: type, value: val, format: time }, intl)}`;
            }
        } else if (type.includes('time')) {
            if (beforeText && Number(beforeText) >= 1 || type === 'datetime') {
                args.value = this.shortDateFormat({ type: type, value: args.value, format: date }, intl) + ' ' +
                        this.timeFormat({ type: type, value: args.value, format: time }, intl);
            } else {
                args.value = this.timeFormat({ type: type, value: args.value, format: time }, intl);
            }
        } else if (args.cell.format && args.cell.format.includes('%') && isNumber(args.cell.value)) {
            args.value = this.parent.getDisplayText(args.cell);
            if (!args.value.includes('%')) {
                args.value = beforeText;
                parseOtherCultureNumber();
            }
        } else {
            parseOtherCultureNumber();
        }
        if (!args.value || (args.value && args.value.toString().indexOf('null') > -1)) {
            args.value = beforeText;
        }
    }

    private getFormattedNumber(format: string, value: number): string {
        return new Internationalization().formatNumber(Number(value), { format: format }) || '';
    }

    /**
     * Adding event listener for number format.
     *
     * @returns {void} - Adding event listener for number format.
     */
    private addEventListener(): void {
        this.parent.on(applyNumberFormatting, this.numberFormatting, this);
        this.parent.on(getFormattedCellObject, this.getFormattedCell, this);
        this.parent.on(checkDateFormat, this.checkDateFormat, this);
        this.parent.on(getFormattedBarText, this.formattedBarText, this);
    }

    /**
     * Removing event listener for number format.
     *
     * @returns {void} -  Removing event listener for number format.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyNumberFormatting, this.numberFormatting);
            this.parent.off(getFormattedCellObject, this.getFormattedCell);
            this.parent.off(checkDateFormat, this.checkDateFormat);
            this.parent.off(getFormattedBarText, this.formattedBarText);
        }
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook number format module name.
     *
     * @returns {string} - Get the module name.
     */
    public getModuleName(): string {
        return 'workbookNumberFormat';
    }
}

/**
 * To Get the number built-in format code from the number format type.
 *
 * @param {string} type - Specifies the type of the number formatting.
 * @returns {string} - To Get the number built-in format code from the number format type.
 */
export function getFormatFromType(type: NumberFormatType): string {
    let code: string = 'General';
    switch (type.split(' ').join('')) {
    case 'Number':
        code = '0.00';
        break;
    case 'Currency':
        code = '$#,##0.00';
        break;
    case 'Accounting':
        code = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        break;
    case 'ShortDate':
        code = 'mm-dd-yyyy';
        break;
    case 'LongDate':
        code = 'dddd, mmmm dd, yyyy';
        break;
    case 'Time':
        code = 'h:mm:ss AM/PM';
        break;
    case 'Percentage':
        code = '0.00%';
        break;
    case 'Fraction':
        code = '# ?/?';
        break;
    case 'Scientific':
        code = '0.00E+00';
        break;
    case 'Text':
        code = '@';
        break;
    }
    return code;
}

/**
 * @hidden
 * @param {string} format -  Specidfies the format.
 * @returns {string} - To get type from format.
 */
export function getTypeFromFormat(format: string): string {
    let code: string = 'General';
    switch (format) {
    // case '0.00':
    case '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"_-;_-@_-':
    case '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-':
        code = 'Number';
        break;
    case '$#,##0.00':
    case '$#,##0':
    case '$#,##0_);[Red]($#,##0)':
    case '$#,##0.00_);($#,##0.00)':
    case '$#,##0_);($#,##0)':
    case '$#,##0.00_);[Red]($#,##0.00)':
        code = 'Currency';
        break;
    case '_($*#,##0.00_);_($*(#,##0.00);_($*"-"??_);_(@_)':
    case '_($*#,##0.00_);_($* (#,##0.00);_($*"-"??_);_(@_)':
    case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
    case '_ $ * #,##0.00_ ;_ $ * -#,##0.00_ ;_ $ * "-"??_ ;_ @_ ':
    case '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)':
    case '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)':
    case '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)':
        code = 'Accounting';
        break;
    case 'mm-dd-yyyy':
    case 'dd/MM/yyyy':
    // case 'yyyy-MM-dd':
    // case 'dd-mm-yyyy':
    // case 'dd-mm-yy':
    // case 'mm-dd-yy':
        code = 'ShortDate';
        break;
    case 'dddd, mmmm dd, yyyy':
        code = 'LongDate';
        break;
    case 'h:mm:ss AM/PM':
        code = 'Time';
        break;
    case '0.00%':
    case '0%':
        code = 'Percentage';
        break;
    case '0.00E+00':
        code = 'Scientific';
        break;
    case '@':
        code = 'Text';
        break;
    default:
        if (format) {
            if (format.includes('?/?')) {
                code = 'Fraction';
            } else if (format.indexOf('[$') > -1) {
                if (format.indexOf('* ') > -1){
                    code = 'Accounting';
                } else {
                    code = 'Currency';
                }
            }
        }
        break;
    }
    return code;
}

interface AutoDetectGeneralFormatArgs {
    args: NumberFormatArgs;
    fResult: string;
    intl: Internationalization;
    currencySymbol: string;
    isRightAlign: boolean;
    curCode: string;
    cell: CellModel;
    rowIdx: number;
    colIdx: number;
    sheet: SheetModel;
}
