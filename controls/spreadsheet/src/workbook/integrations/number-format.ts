import { getRangeIndexes, NumberFormatType } from '../common/index';
import { CellModel, SheetModel, getCell, getSheet, setCell, getSheetIndex, Workbook } from '../base/index';
import { Internationalization, getNumberDependable, getNumericObject, isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber, toFraction, intToDate, toDate, dateToInt, ToDateArgs } from '../common/math';
import { applyNumberFormatting, getFormattedCellObject, refreshCellElement, checkDateFormat, getFormattedBarText } from '../common/event';
/**
 * Specifies number format.
 */
export class WorkbookNumberFormat {
    private parent: Workbook;
    private localeObj: Object;
    private decimalSep: string;
    private groupSep: string;
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
        const sheet: SheetModel = this.parent.sheets[activeSheetIndex];
        const formatRange: string = args.range ? ((args.range.indexOf('!') > -1) ?
            args.range.split('!')[1] : args.range) : sheet.selectedRange;
        const selectedRange: number[] = getRangeIndexes(formatRange);
        let cell: CellModel;
        for (let i: number = selectedRange[0]; i <= selectedRange[2]; i++) {
            for (let j: number = selectedRange[1]; j <= selectedRange[3]; j++) {
                setCell(i, j, sheet, { format: args.format }, true);
                cell = getCell(i, j, sheet, true);
                this.getFormattedCell({
                    type: getTypeFromFormat(cell.format), value: cell.value,
                    format: cell.format, rowIndex: i, colIndex: j,
                    sheetIndex: activeSheetIndex, cell: cell
                });
            }
        }
    }

    /**
     * @hidden
     *
     * @param {Object} args - Specifies the args.
     * @returns {string} - to get formatted cell.
     */
    public getFormattedCell(args: { [key: string]: string | number | boolean | CellModel }): string {
        const fResult: string = isNullOrUndefined(args.value as string) ? '' : args.value as string;
        const sheet: SheetModel = this.parent.sheets[isNullOrUndefined(args.sheetIndex) ? this.parent.activeSheetIndex :
            <number>args.sheetIndex];
        const range: number[] = getRangeIndexes(sheet.activeCell);
        const sheetIdx: number = Number(args.sheetIndex) ? Number(args.sheetIndex) : this.parent.activeSheetIndex;
        let cell: CellModel = args.cell as CellModel ? args.cell as CellModel : getCell(range[0], range[1], sheet);
        const rowIdx: number = args.cell as CellModel && !isNullOrUndefined(args.rowIdx) ? args.rowIdx as number : range[0];
        const colIdx: number = args.cell as CellModel && !isNullOrUndefined(args.colIdx) ? args.colIdx as number : range[1];
        let rightAlign: boolean = false;
        const option: { currency?: string } = {};
        const intl: Internationalization = new Internationalization();
        intl.getNumberFormat(option);
        const currencySymbol: string = getNumberDependable(this.parent.locale, option.currency);
        if (args.format === '' || args.format === 'General') {
            cell = cell ? cell : {};
            const dateEventArgs: { [key: string]: string | number | boolean } = {
                value: <string>args.value, rowIndex: rowIdx, colIndex: colIdx, sheetIndex: this.parent.activeSheetIndex,
                updatedVal: <string>args.value, isDate: false, isTime: false
            };
            this.checkDateFormat(dateEventArgs);
            if (dateEventArgs.isDate) {
                rightAlign = true;
                cell.value = args.value = <string>dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType('ShortDate');
            } else if (dateEventArgs.isTime) {
                rightAlign = true;
                cell.value = args.value = <string>dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType('Time');
            }
        }
        args.type = args.format ? getTypeFromFormat(args.format as string) : 'General';
        const result: { [key: string]: string | boolean } = this.processFormats(
            args, fResult, rightAlign, cell, intl, currencySymbol, option.currency);
        if ((this.parent.getActiveSheet().id - 1 === sheetIdx)) {
            this.parent.notify(refreshCellElement, {
                isRightAlign: result.rightAlign, result: result.fResult || args.value as string,
                rowIndex: args.rowIndex, colIndex: args.colIndex, sheetIndex: args.sheetIndex,
                type: args.type, curSymbol: currencySymbol, value: args.value || ''
            });
        }
        if (!args.onLoad && (args.rowIndex > sheet.usedRange.rowIndex || args.colIndex > sheet.usedRange.colIndex)) {
            this.parent.setUsedRange(args.rowIndex as number, args.colIndex as number);
        }
        args.formattedText = result.fResult as string || args.value as string;
        args.isRightAlign = result.rightAlign;
        args.curSymbol = currencySymbol;
        return args.formattedText;
    }

    private processFormats(
        args: { [key: string]: string | number | boolean | CellModel },
        fResult: string, isRightAlign: boolean, cell: CellModel, intl: Internationalization,
        currencySymbol: string, currencyCode: string): { [key: string]: string | boolean } {
        let result: { [key: string]: string | boolean };
        args.format = args.format ? args.format : 'General';
        if (fResult !== '') {
            switch (args.type) {
            case 'General':
                result = this.autoDetectGeneralFormat({
                    args: args, currencySymbol: currencySymbol, fResult: fResult, intl: intl,
                    isRightAlign: isRightAlign, curCode: currencyCode, cell: cell, rowIdx: Number(args.rowIdx),
                    colIdx: Number(args.colIdx)
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
                if (isNumber(fResult)) {
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
            if (options.args.format === 'General' && options.fResult && options.fResult.toString().split(this.decimalSep)[0].length > 11) {
                options.fResult = this.scientificFormat(options.args);
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
            } else if (res.indexOf(options.currencySymbol) > -1 && res.split(options.currencySymbol)[1] !== '' &&
                Number(res.split(options.currencySymbol)[1].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split(options.currencySymbol)[1].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType('Currency');
                options.fResult = this.currencyFormat(options.args, options.intl, options.curCode);
                options.cell.value = options.args.value.toString();
                setCell(options.rowIdx, options.colIdx, this.parent.getActiveSheet(), options.cell, true);
                options.isRightAlign = true;
            }
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

    private applyNumberFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
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
    private currencyFormat(
        args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization, currencyCode: string): string {
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

    private percentageFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType('Percentage') : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format as string
        });
    }

    private accountingFormat(
        args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization, currencySymbol: string,
        currencyCode: string): string {
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

    private shortDateFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        const shortDate: Date = intToDate(args.value as number);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType('ShortDate')
            : args.format.toString();
        let dateObj: Object;
        if (code === getFormatFromType('ShortDate')) {
            code = 'M/d/yy';
            dateObj = {
                type: 'date',
                skeleton: 'yMd'
            };
        } else {
            dateObj = {
                type: 'date',
                format: code
            };
        }
        return intl.formatDate(shortDate, dateObj);
    }

    private longDateFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        const longDate: Date = intToDate(args.value as number);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType('LongDate')
            : args.format.toString();
        if (code === getFormatFromType('LongDate')) {
            code = 'EEEE, MMMM d, y';
        }
        return intl.formatDate(longDate, {
            type: 'date',
            format: code
        });
    }

    private timeFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        if (isNullOrUndefined(args.value)) {
            return '';
        }
        if (!isNullOrUndefined(args.value.toString().split(this.decimalSep)[1])) {
            args.value = parseFloat('1' + this.decimalSep + args.value.toString().split(this.decimalSep)[1]) || args.value;
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

    private scientificFormat(args: { [key: string]: string | number | boolean | CellModel }): string {
        args.format = args.format === '' ? getFormatFromType('Scientific') : args.format;
        const zeros: string = (args.format as string).split('+')[1];
        const prefix: number = this.findDecimalPlaces(args.format as string, 'Scientific');
        let fResult: string = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        } else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + + this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult;
    }

    private fractionFormat(args: { [key: string]: string | number | boolean | CellModel }): string {
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

    public checkDateFormat(args: { [key: string]: string | number | boolean | Date | CellModel }): void {
        let dateObj: ToDateArgs;
        const intl: Internationalization = new Internationalization();
        let value: string = !isNullOrUndefined(args.value) ? args.value.toString() : '';
        let cell: CellModel = getCell(
            <number>args.rowIndex, <number>args.colIndex,
            getSheet(this.parent, isNullOrUndefined(<number>args.sheetIndex) ? this.parent.activeSheetIndex : <number>args.sheetIndex));
        const checkedDate: string = this.checkCustomDateFormat(value);
        if (value && (value.indexOf('/') > -1 || value.indexOf('-') > 0 || value.indexOf(':') > -1) && checkedDate !== 'Invalid') {
            value = checkedDate;
            if (value && value.indexOf('/') > -1 || value.indexOf('-') > 0 || value.indexOf(':') > -1) {
                dateObj = toDate(value, intl, this.parent.locale, cell && cell.format);
                if (!isNullOrUndefined(dateObj.dateObj) && dateObj.dateObj.toString() !== 'Invalid Date') {
                    cell = cell ? cell : {};
                    value = dateToInt(dateObj.dateObj, value.indexOf(':') > -1, dateObj.type && dateObj.type === 'time').toString();
                    if (!cell.format || cell.format === '') {
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
            }
            args.updatedVal = value;
        }
    }

    private checkCustomDateFormat(val: string): string {
        const dateArr: string[] = val.indexOf('/') > -1 ? val.split('/') : val.indexOf('-') > 0 ? val.split('-') : [''];
        const months: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'];
        if (dateArr.length === 2) {
            if (months.indexOf(dateArr[0].toLowerCase()) > -1 && Number(dateArr[1]) <= 31) {
                return '01-' + dateArr[0] + '-' + dateArr[1];
            } else if (months.indexOf(dateArr[1].toLowerCase()) > -1 && Number(dateArr[0]) <= 31) {
                return dateArr[0] + '-' + dateArr[1] + '-' + new Date().getFullYear();
            } else if (Number(dateArr[0]) <= 31 && Number(dateArr[1]) <= 12) {
                return dateArr[0] + '-' + dateArr[1] + '-' + new Date().getFullYear();
            }
            if (Number(dateArr[1]) <= 31 && Number(dateArr[0]) <= 12) {
                return dateArr[0] + '-' + dateArr[1] + '-' + new Date().getFullYear();
            }
            if (Number(dateArr[0]) <= 12 && Number(dateArr[1]) <= 9999 && Number(dateArr[1]) >= 1900) {
                return '01-' + dateArr[0] + '-' + dateArr[1];
            } else {
                return 'Invalid';
            }
        } else if (dateArr.length > 2) {
            for (let i: number = 0; i < dateArr.length; i++) {
                if (!(Number(dateArr[i]) > -1)) {
                    if (!months.filter((month: string) => dateArr[i].toLowerCase().includes(month)).length) { return 'Invalid'; }
                }
            }
        }
        return val;
    }

    private formattedBarText(args: { [key: string]: CellModel | string }): void {
        const type: string = getTypeFromFormat((<CellModel>args.cell) ? (<CellModel>args.cell).format : '');
        const intl: Internationalization = new Internationalization();
        const beforeText: string = <string>args.value;
        const date: string = (type === 'ShortDate' && args.cell && (<CellModel>args.cell).format) ?
            (<CellModel>args.cell).format : getFormatFromType('ShortDate');
        const time: string = getFormatFromType('Time');
        switch (type) {
            case 'ShortDate':
            case 'LongDate':
                args.value = this.shortDateFormat({ type: type, value: <string>args.value, format: date }, intl);
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
    case '0.00':
    case '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"_-;_-@_-':
    case '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-':
        code = 'Number';
        break;
    case '$#,##0.00':
    case '$#,##0_);[Red]($#,##0)':
    case '$#,##0.00_);[Red]($#,##0.00)':
    case '$#,##0.00_);($#,##0.00)':
    case '$#,##0_);($#,##0)':
        code = 'Currency';
        break;
    case '_($*#,##0.00_);_($*(#,##0.00);_($*"-"??_);_(@_)':
    case '_($*#,##0.00_);_($* (#,##0.00);_($*"-"??_);_(@_)':
    case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
    case '_ $ * #,##0.00_ ;_ $ * -#,##0.00_ ;_ $ * "-"??_ ;_ @_ ':
        code = 'Accounting';
        break;
    case 'mm-dd-yyyy':
    case 'dd-mm-yyyy':
    case 'dd-mm-yy':
    case 'mm-dd-yy':
    case 'dd/MM/yyyy':
    case 'yyyy-MM-dd':
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
    args: { [key: string]: string | number | boolean | CellModel };
    fResult: string;
    intl: Internationalization;
    currencySymbol: string;
    isRightAlign: boolean;
    curCode: string;
    cell: CellModel;
    rowIdx: number;
    colIdx: number;
}
