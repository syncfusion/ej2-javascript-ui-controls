import { getRangeIndexes, NumberFormatType, getCellAddress, updateCell } from '../common/index';
import { CellModel, SheetModel, getCell, getSheet, setCell, getSheetIndex, Workbook, getColorCode, getCustomColors } from '../base/index';
import { Internationalization, getNumberDependable, getNumericObject, isNullOrUndefined, L10n, IntlBase } from '@syncfusion/ej2-base';
import { cldrData } from '@syncfusion/ej2-base';
import { isNumber, toFraction, intToDate, toDate, dateToInt, ToDateArgs, DateFormatCheckArgs, rowFillHandler } from '../common/index';
import { applyNumberFormatting, getFormattedCellObject, refreshCellElement, checkDateFormat, getFormattedBarText } from '../common/index';
import { setCellFormat, getTextSpace, NumberFormatArgs, isCustomDateTime, SetCellFormatArgs } from './../index';
import { checkIsNumberAndGetNumber } from '../common/internalization';
/**
 * Specifies number format.
 */
export class WorkbookNumberFormat {
    private parent: Workbook;
    private localeObj: Object;
    private decimalSep: string;
    private groupSep: string;
    private currentRange: string;
    private isRowFill: boolean;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.localeObj = getNumericObject(this.parent.locale);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        this.decimalSep = (<any>this.localeObj).decimal;
        this.groupSep = (<any>this.localeObj).group;
        this.addEventListener();
    }

    private numberFormatting(args: { format?: string, range?: string, cancel?: boolean }): void {
        let activeSheetIndex: number = this.parent.activeSheetIndex;
        if (args.range && args.range.indexOf('!') > -1) {
            activeSheetIndex = getSheetIndex(this.parent, args.range.split('!')[0]);
        }
        const sheet: SheetModel = getSheet(this.parent, activeSheetIndex);
        const formatRange: string = args.range ? ((args.range.indexOf('!') > -1) ?
            args.range.split('!')[1] : args.range) : sheet.selectedRange;
        const selectedRange: number[] = getRangeIndexes(formatRange);
        let cell: CellModel;
        for (let i: number = selectedRange[0]; i <= selectedRange[2]; i++) {
            for (let j: number = selectedRange[1]; j <= selectedRange[3]; j++) {
                if (!updateCell(this.parent, sheet, { cell: { format: args.format }, rowIdx: i, colIdx: j })) {
                    cell = getCell(i, j, sheet);
                    this.getFormattedCell(
                        { value: cell.value, format: cell.format, rowIndex: i, colIndex: j, sheetIndex: activeSheetIndex, cell: cell });
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
        const fResult: string = args.value === undefined || args.value === null ? '' : args.value as string;
        const sheetIdx: number = args.sheetIndex === undefined ? this.parent.activeSheetIndex : args.sheetIndex;
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        let range: number[];
        if (args.rowIndex === undefined) {
            range = getRangeIndexes(sheet.activeCell);
        } else {
            range = [args.rowIndex, args.colIndex];
        }
        const cell: CellModel = args.cell || getCell(range[0], range[1], sheet, false, true);
        let rightAlign: boolean = false;
        const option: { currency?: string } = {};
        const intl: Internationalization = new Internationalization();
        intl.getNumberFormat(option);
        const currencySymbol: string = getNumberDependable(this.parent.locale, option.currency);
        if ((!args.format || args.format === 'General') && !args.skipFormatCheck) {
            args.type = args.format = 'General';
            const dateEventArgs: DateFormatCheckArgs = { value: fResult, updatedVal: fResult, cell: cell };
            this.checkDateFormat(dateEventArgs);
            if (dateEventArgs.isDate || dateEventArgs.isTime) {
                rightAlign = true;
                cell.value = args.value = dateEventArgs.updatedVal;
                if (cell.format) {
                    args.format = cell.format;
                } else {
                    cell.format = args.format = getFormatFromType(dateEventArgs.isDate ? 'ShortDate' : 'Time');
                }
            }
        } else {
            args.type = getTypeFromFormat(args.format);
            if (args.skipFormatCheck && !args.format && args.type === 'General') {
                args.format = 'General';
            }
        }
        let result: { fResult: string, rightAlign: boolean };
        if (cell.format && this.isCustomType(cell)) {
            args.type = 'Custom';
            let isCustomText: boolean;
            const orgFormat: string = cell.format;
            cell.format = cell.format.split('\\').join('');
            this.currentRange = getCellAddress(range[0], range[1]);
            if (cell.format.indexOf(';') > -1) {
                if (cell.format.indexOf('<') > -1 || cell.format.indexOf('>') > -1) {
                    args.result = this.processCustomConditions(cell);
                } else {
                    args.result = this.processCustomAccounting(cell, range[0], range[1], args.td, currencySymbol, args.skipRowFill);
                    isCustomText = (!isNumber(cell.value) || cell.format && cell.format.indexOf('@') > -1) ? true : false;
                }
                cell.format = orgFormat;
            } else if (isCustomDateTime(cell, true)) {
                if (fResult !== '') {
                    args.result = this.processCustomDate(args, cell);
                    isCustomText = !args.formatApplied;
                }
                args.result = args.result || cell.value;
            } else if (cell.format.indexOf('/') > -1) {
                args.result = this.processCustomFraction(cell);
            } else if (cell.format.indexOf('@') > -1) {
                isCustomText = true;
                args.result = this.processCustomText(cell);
            } else if (cell.format.includes('E+0') && isNumber(fResult)) {
                if (args.format !== cell.format) {
                    args.format = cell.format;
                }
                args.result = this.scientificFormat(args);
            } else if (checkIsNumberAndGetNumber(cell, this.parent.locale, this.groupSep, this.decimalSep).isNumber) {
                args.result = this.processCustomNumberFormat(cell, range[0], range[1], args.td);
                isCustomText = !isNumber(cell.value);
            } else {
                isCustomText = args.dataUpdate = true;
            }
            if (!args.dataUpdate) {
                args.value = args.result;
            }
            if (isCustomText) {
                args.isRightAlign = false;
            } else {
                args.isRightAlign = isNullOrUndefined(cell.value) ? false : true;
            }
        } else {
            result = this.processFormats(args, fResult, rightAlign, cell, intl, currencySymbol, option.currency);
        }
        args.isRowFill = this.isRowFill;
        if (!args.onLoad) {
            if (sheet.id === this.parent.getActiveSheet().id) {
                this.parent.notify(
                    refreshCellElement, { isRightAlign: args.type === 'Custom' ? args.isRightAlign : result.rightAlign,
                        result: args.type === 'Custom' ? args.value : result.fResult || args.value, rowIndex: args.rowIndex,
                        colIndex: args.colIndex, sheetIndex: args.sheetIndex, type: args.type, curSymbol: currencySymbol,
                        value: args.type === 'Custom' ? args.value : args.value || '', isRowFill: this.isRowFill });
                this.isRowFill = false;
            }
            this.parent.setUsedRange(args.rowIndex, args.colIndex);
        }
        this.isRowFill = false;
        if (args.type === 'Custom') {
            args.formattedText = args.value === undefined || args.value === null ? '' : args.value.toString();
        } else {
            args.formattedText = result.fResult || (args.value === undefined || args.value === null ? '' : args.value.toString());
            args.isRightAlign = result.rightAlign;
        }
        args.curSymbol = currencySymbol;
        return args.formattedText;
    }

    private isCustomType(cell: CellModel): boolean {
        const format: string = getTypeFromFormat(cell.format);
        const l10n: L10n = this.parent.serviceLocator.getService('spreadsheetLocale');
        if ((format === l10n.getConstant('General') && cell.format !== l10n.getConstant('General')) ||
        (format === l10n.getConstant('Time') && this.parent.isEdit)) {
            return true;
        } else {
            return false;
        }
    }

    private processCustomFill(
        format: string, cell: CellModel, rowIdx: number, colIdx: number, tdElem?: HTMLElement, skipRowFill?: boolean): string {
        const idx: number = cell.format.indexOf('*');
        const repeatChar: string = format[idx + 1];
        const codes: string[] = format.split(format[idx as number] + repeatChar);
        let formatText: string;
        let secText: string;
        if (codes[1] === '') {
            format = format.split(format[idx as number] + repeatChar).join('');
            const sampCell: CellModel = {format: format, value: cell.value};
            formatText = this.processCustomNumberFormat(sampCell);
        } else {
            formatText = format.split(format[idx as number] + repeatChar)[0];
            format = codes[1];
            const sampCell: CellModel = {format: format, value: cell.value};
            secText = this.processCustomNumberFormat(sampCell);
            if (parseFloat(cell.value) === 0) {
                secText = secText.split('0').join('');
            }
        }
        if (!skipRowFill) {
            this.isRowFill = true;
            this.parent.notify(
                rowFillHandler, { cell: cell, rowIdx: rowIdx, colIdx: colIdx, value: repeatChar, formatText: formatText, secText: secText,
                    td: tdElem });
        }
        return formatText;
    }

    private processCustomDate(args: NumberFormatArgs, cell: CellModel): string {
        let isCustomDate: boolean;
        const checkCustomDate: Function = (): boolean => {
            if (cell.value.toString().includes('/') || cell.value.toString().includes('-') ) {
                return true;
            }
            const formats: { months?: object } = IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject;
            const months: Object = formats.months['stand-alone'] && formats.months['stand-alone'].abbreviated;
            return months && !!Object.keys(months).find((key: string) => cell.value.toString().includes(months[`${key}`]));
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
            let isValidDate: boolean; let dateValue: Date;
            if (isCustomDate) {
                dateValue = toDate(cell.value, new Internationalization(), this.parent.locale, custFormat, cell).dateObj;
                isValidDate = dateValue && dateValue.toString() !== 'Invalid Date';
                if (isValidDate) {
                    if (dateValue.getFullYear() < 1900) {
                        return '';
                    } else {
                        cell.value = dateToInt(dateValue).toString();
                    }
                }
            } else {
                dateValue = intToDate(parseFloat(cell.value));
                isValidDate = dateValue && dateValue.toString() !== 'Invalid Date';
            }
            if (isValidDate) {
                if (checkDate) {
                    args.dateObj = dateValue;
                }
                args.formatApplied = true;
                return intl.formatDate(dateValue, { type: type, format: custFormat });
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
        if (cell.format.indexOf('AM/PM') > -1 || cell.format.indexOf('A/P') > -1) {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private processCustomFraction(cell: CellModel): string {
        // const fracLength: number = cell.format.split('/')[1].length;
        // const fracValue: string = Number(cell.value).toFixed(fracLength);
        const suffix: string = '';
        // let fractionResult: string;
        // if (cell.value.toString().indexOf(this.decimalSep) > -1 && isNumber(cell.value as string)) {
        //     suffix = cell.value.toString().split(this.decimalSep)[0];
        //     fractionResult = toFraction(Number(fracValue));
        //     return (Number(suffix) === 0) ? ' ' + fractionResult : suffix + ' ' + fractionResult;
        // }
        return suffix;
    }

    private processCustomConditions(cell: CellModel): string {
        if (isNumber(cell.value)) {
            const conditions: string[] = cell.format.split(';');
            const val: number = Number(cell.value); const colorCode: string[] = [];
            let condition: string; let compareVal: string; let values: string[]; let conditionNotMatch: boolean;
            for (let i: number = 0; i < conditions.length; i++) {
                condition = conditions[Number(i)];
                colorCode.push(getColorCode(condition));
                if (colorCode[i as number]) {
                    condition = condition.split(`[${colorCode[i as number]}]`).join('');
                }
                compareVal = condition.split('[')[1].split(']')[0];
                if (((values = compareVal.split('<=')).length === 2 && val <= Number(values[1])) ||
                    (values.length === 1 && (values = compareVal.split('>=')).length === 2 && val >= Number(values[1])) ||
                    (values.length === 1 && (values = compareVal.split('<')).length === 2 && val < Number(values[1])) ||
                    (values.length === 1 && (values = compareVal.split('>')).length === 2 && val > Number(values[1]))) {
                    cell.format = conditions[i as number].split(`[${compareVal}]`)[0] + conditions[i as number].split(`[${compareVal}]`)[1];
                    conditionNotMatch = false;
                    break;
                } else {
                    conditionNotMatch = values.length === 2;
                }
            }
            if (conditionNotMatch) {
                if (cell.style && cell.style.color && colorCode.indexOf(cell.style.color) > -1) {
                    this.parent.notify(setCellFormat, <SetCellFormatArgs>{ style: { color: '' }, range: this.currentRange });
                }
                return '#####';
            }
            return this.processCustomNumberFormat(cell);
        } else {
            return cell.value;
        }
    }

    private processCustomAccounting(
        cell: CellModel, rowIdx?: number, colIdx?: number, td?: HTMLElement, currencySymbol?: string, skipRowFill?: boolean): string {
        let cellValue: number;
        const custFormat: string[] = cell.format.split(';');
        const numberStatusAndValue: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
            cell, this.parent.locale, this.groupSep, this.decimalSep, currencySymbol);
        const orgValue: string = cell.value;
        if (numberStatusAndValue.isNumber) {
            cell.value = numberStatusAndValue.value;
            cellValue = parseFloat(numberStatusAndValue.value);
        }
        if (cellValue > 0) {
            cell.format = custFormat[0];
        } else if (cellValue === 0) {
            if (isNullOrUndefined(custFormat[2])) {
                cell.format = custFormat[0];
            } else {
                cell.format = custFormat[2];
                return this.processCustomNumberFormat(cell, rowIdx, colIdx, td);
            }
        } else if (isNumber(cellValue)) {
            cell.format = custFormat[1];
        } else {
            cell.format = custFormat[3];
            return isNullOrUndefined(custFormat[3]) ? cell.value ? cell.value.toString() : '' : this.processCustomText(cell);
        }
        if (cellValue < 0) {
            cell.value = Math.abs(cellValue).toString();
            const formattedNumber: string = this.processCustomNumberFormat(cell, rowIdx, colIdx, td);
            cell.value = orgValue;
            return formattedNumber;
        }
        return this.processCustomNumberFormat(cell, rowIdx, colIdx, td, skipRowFill);
    }

    private processCustomText(cell: CellModel): string {
        const result: string = this.processCustomNumberFormat(
            { format: cell.format.split('@').join('#'), value: cell.value ? cell.value.split(cell.value).join('0') : '' });
        return result && result.split('0').join(cell.value);
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

    private processSeparator(cell: CellModel): string {
        const count: number = this.getSeparatorCount(cell);
        let result: number = this.thousandSeparator(count, parseInt(cell.value, 10));
        if (!(cell.format.indexOf('.') > -1)) {
            result = Math.round(result);
        }
        let formattedText: string = this.getFormattedNumber(cell.format.split(',').join(''), result);
        formattedText = formattedText.replace(',', '');
        if (result === 0) {
            formattedText = formattedText.replace('0', '');
        }
        return formattedText;
    }

    private processDigits(cell: CellModel): string {
        const custFormat: string = cell.format.split('?').join('0');
        const cellValue: string = cell.value;
        cell.value = this.getFormattedNumber(custFormat, parseFloat(cell.value));
        if (!isNullOrUndefined(cell.value) && cell.value.includes('.')) {
            cell.value = cell.value.split('.')[0] + '.' + cell.value.split('.')[1].split('0').join('  ');
        }
        if (cell.value === '' && cellValue === '0') {
            cell.value = cellValue;
        }
        return cell.value;
    }

    private processSpace(format: string, cell: CellModel): string {
        const space: string = ' ';
        const args: { [key: string]: string | CellModel | number } = { cell: cell, char: space, width: 0 };
        this.parent.notify(getTextSpace, args);
        const spaceWidth: number = <number>args.width;
        let count: number;
        for (let i: number = 0; i < format.length; i++) {
            if (format[i as number] === '_') {
                args.char = format[i + 1];
                this.parent.notify(getTextSpace, args);
                const textWidth: number = <number>args.width;
                count = Math.round(textWidth / spaceWidth);
                format = format.replace(format[i as number] + format[i + 1], space.repeat(count));
            }
        }
        return format;
    }

    private processCustomNumberFormat(cell: CellModel, rowIdx?: number, colIdx?: number, td?: HTMLElement, skipRowFill?: boolean): string {
        if (cell.format === '') {
            return '';
        }
        let cellValue: number | string = 0;
        let formattedText: string = cell.value;
        let isFormatted: boolean = false;
        cellValue = checkIsNumberAndGetNumber(cell, this.parent.locale, this.groupSep, this.decimalSep).value;
        if (cell && isNumber(cellValue)) {
            cell.value = cellValue;
            cellValue = parseFloat(cellValue.toString());
            let customFormat: string = this.processCustomColor(cell);
            // if (customFormat === cell.format && cell.style) {
            //     delete cell.style;
            // }
            if (this.getSeparatorCount(cell)) {
                isFormatted = true;
                formattedText = this.processSeparator(cell);
            }
            if (customFormat.indexOf('?') > -1) {
                isFormatted = true;
                customFormat = cell.format.split('?').join('');
                formattedText = this.processDigits(cell);
            }
            if (customFormat.indexOf('_') > -1) {
                isFormatted = true;
                customFormat = cell.format = this.processSpace(customFormat, cell);
                formattedText = this.getFormattedNumber(customFormat, cellValue);
            }
            if (cell.format.indexOf('"') > -1 || cell.format.indexOf('\\') > -1) {
                customFormat = this.processText(customFormat);
            }
            if (customFormat && formattedText && customFormat.indexOf('?') > -1) {
                formattedText = formattedText.replace('?', ' ');
            }
            if (customFormat.indexOf('*') > -1) {
                isFormatted = true;
                formattedText = this.processCustomFill(customFormat, cell, rowIdx, colIdx, td, skipRowFill);
            }
            if (customFormat === 'General') {
                isFormatted = true;
                formattedText = cellValue.toString();
            }
            if (!isFormatted) {
                formattedText = this.getFormattedNumber(customFormat, cellValue);
            }
            if (customFormat != null && !customFormat.split('.')[0].includes('0') && cellValue > 0 && cellValue < 1) {
                formattedText = formattedText.toString().replace(/^0+/, '');
            }
        }
        return formattedText;
    }

    private processText(format: string): string {
        let custFormat: string = format;
        if (custFormat.indexOf('"') > -1) {
            custFormat = custFormat.split('"').join('');
        } else if (custFormat.indexOf('\\') > -1) {
            custFormat = custFormat.split('\\').join('');
        }
        return custFormat;
    }

    private processCustomColor(cell: CellModel): string {
        let custFormat: string = cell.format;
        const colorCode: string = getColorCode(custFormat);
        if (colorCode) {
            custFormat = cell.format.split('[' + colorCode + ']')[0] + cell.format.split('[' + colorCode + ']')[1];
            if (this.currentRange.indexOf('NaN') > -1) {
                this.currentRange = undefined;
            }
            this.parent.notify(setCellFormat, { style: { 'color': colorCode }, range: this.currentRange });
        } else if (cell.style && getCustomColors().indexOf(cell.style.color) > -1) {
            this.parent.notify(setCellFormat, { style: { 'color': 'black' } });
        }
        return custFormat;
    }

    private processFormats(
        args: NumberFormatArgs, fResult: string, isRightAlign: boolean, cell: CellModel, intl: Internationalization, currencySymbol: string,
        currencyCode: string): { fResult: string, rightAlign: boolean } {
        let result: { [key: string]: string | boolean };
        if (fResult !== '') {
            let isNumberAndValue: { isNumber: boolean, value: string };
            switch (args.type) {
            case 'General':
                result = this.autoDetectGeneralFormat({
                    args: args, currencySymbol: currencySymbol, fResult: fResult, intl: intl,
                    isRightAlign: isRightAlign, curCode: currencyCode, cell: cell, rowIdx: Number(args.rowIndex),
                    colIdx: Number(args.colIndex)
                });
                fResult = result.fResult as string;
                isRightAlign = result.isRightAlign as boolean;
                break;
            case 'Number':
                if (isNumber(fResult)) {
                    fResult = this.applyNumberFormat(args, intl);
                    isRightAlign = true;
                }
                break;
            case 'Currency':
                isNumberAndValue = checkIsNumberAndGetNumber(
                    { value: fResult, format: args.format as string }, this.parent.locale, this.groupSep, this.decimalSep, currencySymbol);
                if (isNumberAndValue.isNumber) {
                    args.value = isNumberAndValue.value;
                    fResult = this.currencyFormat(args, intl, currencyCode);
                    isRightAlign = true;
                }
                break;
            case 'Percentage':
                if (isNumber(fResult)) {
                    fResult = this.percentageFormat(args, intl);
                    isRightAlign = true;
                }
                break;
            case 'Accounting':
                if (isNumber(fResult)) {
                    fResult = this.accountingFormat(args, intl, currencySymbol, currencyCode);
                    isRightAlign = true;
                }
                break;
            case 'ShortDate':
                fResult = this.shortDateFormat(args, intl);
                isRightAlign = fResult ? true : false;
                break;
            case 'LongDate':
                fResult = this.longDateFormat(args, intl);
                isRightAlign = fResult ? true : false;
                break;
            case 'Time':
                fResult = this.timeFormat(args, intl);
                isRightAlign = fResult ? true : false;
                break;
            case 'Fraction':
                if (isNumber(fResult)) {
                    fResult = this.fractionFormat(args);
                    isRightAlign = true;
                }
                break;
            case 'Scientific':
                if (isNumber(fResult)) {
                    fResult = this.scientificFormat(args);
                    isRightAlign = true;
                }
                break;
            case 'Text':
                isRightAlign = false;
                break;
            }
        }
        return { fResult: fResult, rightAlign: isRightAlign };
    }

    private autoDetectGeneralFormat(options: AutoDetectGeneralFormatArgs): { [key: string]: string | boolean } {
        let addressFormula: boolean = false; const val: string = options.fResult;
        if ((options.args.cell as CellModel) && (options.args.cell as CellModel).formula
        && (options.args.cell as CellModel).formula.indexOf('ADDRESS(') > 0) {
            addressFormula = true;
        }
        if (isNumber(options.fResult)) {
            if (options.args.format && options.args.format !== '') {
                if (options.args.format.toString().indexOf('%') > -1) {
                    options.fResult = this.percentageFormat(options.args, options.intl);
                } else if (options.args.format.toString().indexOf(options.currencySymbol) > -1) {
                    options.fResult = this.currencyFormat(options.args, options.intl, options.curCode);
                } else {
                    options.fResult = this.applyNumberFormat(options.args, options.intl);
                }
            }
            const cellVal: string | number = options.fResult || options.args.value;
            if (options.args.format === 'General' && cellVal && cellVal.toString().split(this.decimalSep)[0].length > 11) {
                options.fResult = this.scientificFormat(options.args, 5);
            }
            options.isRightAlign = true;
        }
        if (!isNullOrUndefined(options.fResult)) {
            const res: string = options.fResult.toString();
            if (res.indexOf('%') > -1 && res.split('%')[0] !== '' && res.split('%')[1].trim() === '' &&
                Number(res.split('%')[0].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split('%')[0].split(this.groupSep).join('')) / 100;
                options.cell.format = options.args.format = this.getPercentageFormat(res);
                options.fResult = this.percentageFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                options.isRightAlign = true;
            } else if (res.indexOf(options.currencySymbol) > -1) {
                const curArr: string[] = res.split(options.currencySymbol);
                if (curArr[0].trim() === '' && curArr[1] !== '' && isNumber(curArr[1].split(this.groupSep).join(''))) {
                    options.args.value = Number(curArr[1].split(this.groupSep).join(''));
                    options.cell.format = options.args.format = getFormatFromType('Currency');
                    options.fResult = this.currencyFormat(options.args, options.intl, options.curCode);
                    options.cell.value = options.args.value.toString();
                    setCell(options.rowIdx, options.colIdx, this.parent.getActiveSheet(), options.cell, true);
                    options.isRightAlign = true;
                }
            }
        }
        if (addressFormula) {
            options.isRightAlign = false;
            options.fResult = val;
        }
        return { isRightAlign: options.isRightAlign, fResult: options.fResult };
    }

    private getPercentageFormat(value: string): string {
        return value.indexOf(this.decimalSep) > -1 ? getFormatFromType('Percentage') : '0%';
    }

    private findSuffix(zeros: string, resultSuffix: string): string {
        const len: number = zeros.length;
        const suffixLen: number = len - resultSuffix.length;
        return zeros.substr(0, suffixLen < 0 ? 0 : suffixLen) + resultSuffix;
    }

    private applyNumberFormat(args: NumberFormatArgs, intl: Internationalization): string {
        args.format = this.isCustomFormat(args.format.toString());
        const formatArr: string[] = args.format.toString().split(';');
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
        if (Number(args.value) < 0 && (args.cell as CellModel)) {
            args.format = (args.cell as CellModel).format;
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format as string
        });
    }

    private isCustomFormat(format: string): string {
        if (format === '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"_-;_-@_-' || format === '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-') {
            format = '';
        }
        format = format === '' ? getFormatFromType('Number') : format;
        format = format.toString().split('_)').join(' ').split('_(').join(' ').split('[Red]').join('');
        return format;
    }
    private currencyFormat(args: NumberFormatArgs, intl: Internationalization, currencyCode: string): string {
        args.format = args.format === '' ? getFormatFromType('Currency') : args.format;
        args.format = args.format.toString().split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        const formatArr: string[] = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        } else {
            args.format = isNullOrUndefined(formatArr[1]) ? formatArr[0] : formatArr[1].split('*').join(' ');
        }
        args.format = this.getFormatForOtherCurrency(args.format);
        return intl.formatNumber(Number(args.value), { format: args.format as string, currency: currencyCode });
    }

    private percentageFormat(args: NumberFormatArgs, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType('Percentage') : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format as string
        });
    }

    private accountingFormat(args: NumberFormatArgs, intl: Internationalization, currencySymbol: string, currencyCode: string): string {
        args.format = args.format === '' ? getFormatFromType('Accounting') : args.format;
        args.format = (args.format as string).split('_(').join(' ').split('_)').join(' ').split('[Red]').join('').split('_').join('');
        const formatArr: string[] = (args.format as string).split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        } else {
            args.format = formatArr[1].split('*').join(' ');
        }
        args.format = this.getFormatForOtherCurrency(args.format);
        if (Number(args.value) === 0) {
            return currencySymbol + '- ';
        } else {
            return intl.formatNumber(Number(args.value), { format: args.format as string, currency: currencyCode }).split('-').join('');
        }
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
            if (args.value.includes('/') || args.value.includes('-')) {
                if (format === 'dd-MM-yyyy' || format === 'dd/MM/yyyy') {
                    format = '';
                }
                const obj: Date = toDate(args.value, new Internationalization(), this.parent.locale, format, <CellModel>args.cell).dateObj;
                if (obj && obj.toString() !== 'Invalid Date') {
                    if (obj.getFullYear() < 1900) {
                        return '';
                    }
                    args.value = dateToInt(obj).toString();
                    if (args.cell) {
                        (args.cell as CellModel).value = args.value;
                    }
                    if (args.checkDate) {
                        args.dateObj = obj;
                    }
                    return intl.formatDate(obj, dateObj);
                }
            }
        }
        const shortDate: Date = intToDate(args.value);
        if (args.checkDate) {
            args.dateObj = shortDate;
        }
        return intl.formatDate(shortDate, dateObj);
    }

    private longDateFormat(args: NumberFormatArgs, intl: Internationalization): string {
        const longDate: Date = intToDate(args.value);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType('LongDate')
            : args.format.toString();
        if (code === getFormatFromType('LongDate')) {
            code = 'EEEE, MMMM d, y';
        }
        if (args.checkDate) {
            args.dateObj = longDate;
        }
        return intl.formatDate(longDate, {
            type: 'date',
            format: code
        });
    }

    private timeFormat(args: NumberFormatArgs, intl: Internationalization): string {
        if (isNullOrUndefined(args.value)) {
            return '';
        }
        const value: string[] | number[] = args.value.toString().split(this.decimalSep);
        if (!isNullOrUndefined(value[1])) {
            args.value = parseFloat(value[0] + 1 + this.decimalSep + value[1]) || args.value;
        }
        const time: Date = intToDate(args.value as number);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType('Time')
            : args.format.toString();
        if (code === getFormatFromType('Time')) {
            code = 'h:mm:ss a';
        }
        return intl.formatDate(time, {
            type: 'time',
            skeleton: 'medium',
            format: code
        });
    }

    private scientificFormat(args: NumberFormatArgs, prefix?: number): string {
        args.format = args.format === '' ? getFormatFromType('Scientific') : args.format;
        const zeros: string = (args.format as string).split('+')[1] || '00';
        prefix = prefix || this.findDecimalPlaces(args.format as string, 'Scientific');
        let fResult: string = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        } else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + + this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult;
    }

    private fractionFormat(args: NumberFormatArgs): string {
        args.format = args.format === '' ? getFormatFromType('Fraction') : args.format;
        let suffix: string = '';
        let fractionResult: string;
        if (args.value.toString().indexOf(this.decimalSep) > -1 && isNumber(args.value as string)) {
            suffix = args.value.toString().split(this.decimalSep)[0];
            fractionResult = toFraction(Number(args.value));
            return (Number(suffix) === 0) ? ' ' + fractionResult : suffix + ' ' + fractionResult;
        }
        return suffix;
    }

    private findDecimalPlaces(code: string, type: string): number {
        let eIndex: number;
        let decIndex: number;
        switch (type) {
        case 'Scientific':
            eIndex = code.toUpperCase().indexOf('E');
            decIndex = code.indexOf(this.decimalSep);
            if (eIndex > -1) {
                return code.substring(decIndex + 1, eIndex).length;
            }
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
        const props: { val: string, format: string } = this.checkCustomDateFormat(args.value.toString(), cell);
        if (props.val !== 'Invalid') {
            const dateObj: ToDateArgs = toDate(props.val, new Internationalization(), this.parent.locale, props.format, cell);
            if (!isNullOrUndefined(dateObj.dateObj) && dateObj.dateObj.toString() !== 'Invalid Date' &&
                dateObj.dateObj.getFullYear() >= 1900) {
                props.val = dateToInt(dateObj.dateObj, props.val.indexOf(':') > -1, dateObj.type && dateObj.type === 'time').toString();
                if (!cell.format) {
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

    private checkCustomDateFormat(val: string, cell: CellModel): { val: string, format: string } {
        let separator: string;
        if (val.includes('/')) {
            separator = '/';
        } else if (val.includes('-')) {
            separator = '-';
        } else {
            return { val: val.includes(':') ? val : 'Invalid', format: '' };
        }
        const dateArr: string[] = val.split(separator);
        let format: string = ''; const formatArr: string[] = [];
        const updateFormat: Function = (): void => {
            format = formatArr.join(separator);
            if (!cell.format) {
                cell.format = format;
            }
        };
        let firstVal: string;
        const formats: { months?: object } = IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject;
        let months: Object = formats.months['stand-alone'] ? formats.months['stand-alone'].wide : {};
        let abbreviatedMonth: Object = formats.months['stand-alone'] ? formats.months['stand-alone'].abbreviated : {};
        const isMonth: Function = (monthValue: string, abbrMonthValue: string, dateVal: string, dateLength: number) => {
            let shortMonthValue = monthValue.substring(0, dateLength);
            if (shortMonthValue === dateVal) {
                firstVal = abbrMonthValue;
            }
        }
        if (dateArr.length === 2) {
            const updateSecValue: Function = (secVal: string): void => {
                val = firstVal;
                formatArr[0] = 'MMM';
                if (Number(secVal) <= 31) {
                    val = secVal + separator + val;
                    formatArr.splice(0, 0, 'dd');
                    updateFormat();
                } else if (Number(secVal) >= 1900 && Number(secVal) <= 9999) {
                    val += (separator + secVal);
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
            if (!Number(dateArr[0]) && dateArr[0].length >= formats.months['stand-alone'].abbreviated['1'].length) {
                Object.keys(months).find(
                    (key: string) => isMonth(months[`${key}`].toLowerCase(), abbreviatedMonth[`${key}`], dateArr[0], dateArr[0].length));
                if (!isNullOrUndefined(firstVal) && !dateArr[0].includes(',')) { // Added ',' checking to skip updating for the MMM d, yyyy ddd format.
                    updateSecValue(dateArr[1]);
                }
            } else if (!Number(dateArr[1]) && dateArr[1].length >= formats.months['stand-alone'].abbreviated['1'].length) {
                Object.keys(months).find(
                    (key: string) => isMonth(months[`${key}`].toLowerCase(), abbreviatedMonth[`${key}`], dateArr[1], dateArr[1].length));
                if (!isNullOrUndefined(firstVal)) {
                    updateSecValue(dateArr[0]);
                }
            } else if (dateArr[0] && Number(dateArr[0]) <= 12 && Number(dateArr[1])) {
                firstVal = months[Number(dateArr[0])];
                updateSecValue(dateArr[1]);
            }
            if (!formatArr.length) {
                val = 'Invalid';
            }
        } else if (dateArr.length > 2) {
            for (let i: number = 0; i < dateArr.length; i++) {
                if (!(Number(dateArr[i as number]) > -1)) {
                    Object.keys(months).find((key: string) =>
                        isMonth(months[`${key}`].toLowerCase(), abbreviatedMonth[`${key}`], dateArr[i as number].toLowerCase(),
                                dateArr[i as number].length));
                    if (!isNullOrUndefined(firstVal)) {
                        if (i === 1) {
                            formatArr[1] = 'MMM';
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
        return { val: val, format: format };
    }

    private formattedBarText(args: { [key: string]: CellModel | string }): void {
        if (args.value === '') {
            return;
        }
        const type: string = getTypeFromFormat((<CellModel>args.cell) ? (<CellModel>args.cell).format : '');
        const intl: Internationalization = new Internationalization();
        const beforeText: string = <string>args.value;
        const date: string = (type === 'ShortDate' && args.cell && (<CellModel>args.cell).format) ?
            (<CellModel>args.cell).format : getFormatFromType('ShortDate');
        const time: string = getFormatFromType('Time');
        switch (type) {
        case 'ShortDate':
        case 'LongDate':
            args.value = this.shortDateFormat({ type: type, value: <string>args.value, format: date, cell: <CellModel>args.cell }, intl);
            break;
        case 'Time':
            if (beforeText && Number(beforeText) >= 1) {
                args.value = this.shortDateFormat({ type: type, value: <string>args.value, format: date }, intl) + ' ' +
                        this.timeFormat({ type: type, value: <string>args.value, format: time }, intl);
            } else {
                args.value = this.timeFormat({ type: type, value: <string>args.value, format: time }, intl);
            }
            break;
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
    case '$#,##0_);[Red]($#,##0)':
    case '$#,##0.00_);($#,##0.00)':
    case '$#,##0_);($#,##0)':
    // case '$#,##0.00_);[Red]($#,##0.00)':
        code = 'Currency';
        break;
    case '_($*#,##0.00_);_($*(#,##0.00);_($*"-"??_);_(@_)':
    case '_($*#,##0.00_);_($* (#,##0.00);_($*"-"??_);_(@_)':
    case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
    case '_ $ * #,##0.00_ ;_ $ * -#,##0.00_ ;_ $ * "-"??_ ;_ @_ ':
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
    case '# ?/?':
    case '# ??/??':
    case '# ???/???':
        code = 'Fraction';
        break;
    case '0.00E+00':
        code = 'Scientific';
        break;
    case '@':
        code = 'Text';
        break;
    default:
        if (format) {
            if (format.indexOf('[$') > -1) {
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
}
