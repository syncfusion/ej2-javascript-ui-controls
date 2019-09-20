import { Spreadsheet } from '../../spreadsheet/index';
import { getRangeIndexes, BeforeCellFormatArgs } from '../common/index';
import { CellModel, SheetModel, getCell, getSheet, setCell } from '../base/index';
import { Internationalization, getNumberDependable, getNumericObject, isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber, toFraction, intToDate, toDate, dateToInt, ToDateArgs } from '../common/math';
import { applyNumberFormatting, getFormattedCellObject, refreshCellElement, checkDateFormat, getFormattedBarText } from '../common/event';
import { NumberFormatType } from '../common/enum';
/**
 * Specifies number format.
 */
export class WorkbookNumberFormat {
    private parent: Spreadsheet;
    private localeObj: Object;
    private decimalSep: string;
    private groupSep: string;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.localeObj = getNumericObject(this.parent.locale);
        /* tslint:disable:no-any */
        this.decimalSep = (<any>this.localeObj).decimal;
        this.groupSep = (<any>this.localeObj).group;
        this.addEventListener();
    }

    /**
     * @private
     */
    private numberFormatting(args: { format?: string, range?: string }): void {
        let activeSheetTab: number = this.parent.activeSheetTab;
        let sheet: SheetModel = this.parent.sheets[activeSheetTab - 1];
        let selectedRange: number[] = getRangeIndexes(args.range || sheet.selectedRange);
        let cell: CellModel;
        for (let i: number = selectedRange[0]; i <= selectedRange[2]; i++) {
            for (let j: number = selectedRange[1]; j <= selectedRange[3]; j++) {
                setCell(i, j, sheet, { format: args.format }, true);
                cell = getCell(i, j, sheet, true);
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                this.getFormattedCell({
                    type: getTypeFromFormat(cell.format), value: cell.value,
                    format: cell.format, rowIndex: i, colIndex: j, sheetIndex: activeSheetTab,
                    cell: cell
                });
            }
        }
    }

    /**
     * @hidden
     */
    public getFormattedCell(args: { [key: string]: string | number | boolean | CellModel }): string {
        let fResult: string = isNullOrUndefined(args.value as string) ? '' : args.value as string;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: number[] = getRangeIndexes(sheet.activeCell);
        let cell: CellModel = args.cell as CellModel ? args.cell as CellModel : getCell(range[0], range[1], sheet);
        let rightAlign: boolean = false;
        let currencySymbol: string = getNumberDependable(this.parent.locale, 'USD');
        let eventArgs: BeforeCellFormatArgs = {
            range: range, format: <string>args.format, requestType: 'numberFormat', value: <string>args.value
        };
        this.parent.trigger('beforeCellFormat', eventArgs);
        if (args.format === '' || args.format === NumberFormatType.General) {
            cell = cell ? cell : {};
            let dateEventArgs: { [key: string]: string | number | boolean } = {
                value: <string>args.value, rowIndex: range[0], colIndex: range[1], sheetIndex: this.parent.activeSheetTab,
                updatedVal: <string>args.value, isDate: false, isTime: false
            };
            this.checkDateFormat(dateEventArgs);
            if (dateEventArgs.isDate) {
                rightAlign = true;
                cell.value = args.value = <string>dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType(NumberFormatType.ShortDate);
            } else if (dateEventArgs.isTime) {
                rightAlign = true;
                cell.value = args.value = <string>dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType(NumberFormatType.Time);
            }
        }
        args.type = args.format ? getTypeFromFormat(args.format as string) : NumberFormatType.General;
        let result: { [key: string]: string | boolean } = this.processFormats(args, fResult, rightAlign, cell);
        if (!args.onLoad) {
            this.parent.notify(refreshCellElement, {
                isRightAlign: result.rightAlign, result: result.fResult || args.value as string,
                rowIndex: args.rowIndex, colIndex: args.colIndex, sheetIndex: args.sheetIndex,
                type: args.type, curSymbol: currencySymbol, value: args.value || ''
            });
        }
        if (!args.onLoad && (args.rowIndex > sheet.usedRange.rowIndex || args.colIndex > sheet.usedRange.colIndex)) {
            this.parent.setUsedRange(args.rowIndex as number, args.colIndex as number);
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
        args.formattedText = result.fResult as string || args.value as string;
        args.isRightAlign = result.rightAlign;
        args.curSymbol = currencySymbol;
        return args.formattedText;
    }

    private processFormats(
        args: { [key: string]: string | number | boolean | CellModel },
        fResult: string, isRightAlign: boolean, cell?: CellModel): { [key: string]: string | boolean } {
        let intl: Internationalization = new Internationalization();
        let currencySymbol: string = getNumberDependable(this.parent.locale, 'USD');
        let result: { [key: string]: string | boolean };
        args.format = args.format ? args.format : NumberFormatType.General;
        if (fResult !== '') {
            switch (args.type) {
                case NumberFormatType.General:
                    result = this.autoDetectGeneralFormat({
                        args: args, currencySymbol: currencySymbol, fResult: fResult, intl: intl,
                        isRightAlign: isRightAlign, curCode: 'USD', cell: cell
                    });
                    fResult = result.fResult as string;
                    isRightAlign = result.isRightAlign as boolean;
                    break;
                case NumberFormatType.Number:
                    if (isNumber(fResult)) {
                        fResult = this.applyNumberFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case NumberFormatType.Currency:
                    if (isNumber(fResult)) {
                        fResult = this.currencyFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case NumberFormatType.Percentage:
                    if (isNumber(fResult)) {
                        fResult = this.percentageFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case NumberFormatType.Accounting:
                    if (isNumber(fResult)) {
                        fResult = this.accountingFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case NumberFormatType.ShortDate:
                    fResult = this.shortDateFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case NumberFormatType.LongDate:
                    fResult = this.longDateFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case NumberFormatType.Time:
                    fResult = this.timeFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case NumberFormatType.Fraction:
                    if (isNumber(fResult)) {
                        fResult = this.fractionFormat(args);
                        isRightAlign = true;
                    }
                    break;
                case NumberFormatType.Scientific:
                    if (isNumber(fResult)) {
                        fResult = this.scientificFormat(args);
                        isRightAlign = true;
                    }
                    break;
                case NumberFormatType.Text:
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
                    options.fResult = this.currencyFormat(options.args, options.intl);
                } else {
                    options.fResult = this.applyNumberFormat(options.args, options.intl);
                }
            }
            if (options.fResult && options.fResult.toString().split(this.decimalSep)[0].length > 11) {
                options.fResult = this.scientificFormat(options.args);
            }
            options.isRightAlign = true;
        }
        if (!isNullOrUndefined(options.fResult)) {
            let res: string = options.fResult.toString();
            if (res.indexOf('%') > -1 && res.split('%')[0] !== '' && res.split('%')[1].trim() === '' &&
                Number(res.split('%')[0].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split('%')[0].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType(NumberFormatType.Percentage);
                options.fResult = this.percentageFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                options.isRightAlign = true;
            } else if (res.indexOf(options.currencySymbol) > -1 && res.split(options.currencySymbol)[1] !== '' &&
                Number(res.split(options.currencySymbol)[1].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split(options.currencySymbol)[1].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType(NumberFormatType.Currency);
                options.fResult = this.currencyFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                options.isRightAlign = true;
            }
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
        return { isRightAlign: options.isRightAlign, fResult: options.fResult };
    }

    private findSuffix(zeros: string, resultSuffix: string): string {
        let len: number = zeros.length;
        let suffixLen: number = len - resultSuffix.length;
        return zeros.substr(0, suffixLen < 0 ? 0 : suffixLen) + resultSuffix;
    }

    private applyNumberFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType(NumberFormatType.Number) : args.format;
        args.format = args.format.toString().split('_)').join(' ').split('_(').join(' ').split('[Red]').join('');
        let formatArr: string[] = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        } else {
            args.format = !isNullOrUndefined(formatArr[1]) ? formatArr[1].split('*').join(' ') : formatArr[0];
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format as string
        });
    }

    private currencyFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType(NumberFormatType.Currency) : args.format;
        args.format = args.format.toString().split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        let formatArr: string[] = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        } else {
            args.format = isNullOrUndefined(formatArr[1]) ? formatArr[0] : formatArr[1].split('*').join(' ');
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format as string,
            currency: 'USD'
        });
    }

    private percentageFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType(NumberFormatType.Percentage) : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format as string
        });
    }

    private accountingFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        args.format = args.format === '' ? getFormatFromType(NumberFormatType.Accounting) : args.format;
        args.format = (args.format as string).split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        let currencySymbol: string = getNumberDependable(this.parent.locale, 'USD');
        let formatArr: string[] = (args.format as string).split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        } else {
            args.format = formatArr[1].split('*').join(' ');
        }
        if (Number(args.value) === 0) {
            return currencySymbol + '- ';
        } else {
            return intl.formatNumber(Number(args.value), {
                format: args.format as string,
                currency: 'USD'
            }).split('-').join('');
        }
    }

    private shortDateFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        let shortDate: Date = intToDate(args.value as number);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType(NumberFormatType.ShortDate)
            : args.format.toString();
        let dateObj: Object;
        if (code === getFormatFromType(NumberFormatType.ShortDate)) {
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
        let longDate: Date = intToDate(args.value as number);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType(NumberFormatType.LongDate)
            : args.format.toString();
        if (code === getFormatFromType(NumberFormatType.LongDate)) {
            code = 'EEEE, MMMM d, y';
        }
        return intl.formatDate(longDate, {
            type: 'date',
            format: code
        });
    }

    private timeFormat(args: { [key: string]: string | number | boolean | CellModel }, intl: Internationalization): string {
        if (!isNullOrUndefined((args.value as string).split(this.decimalSep)[1])) {
            args.value = parseFloat('1' + this.decimalSep + (args.value as string).split(this.decimalSep)[1]) || args.value;
        }
        let time: Date = intToDate(args.value as number);
        let code: string = (args.format === '' || args.format === 'General') ? getFormatFromType(NumberFormatType.Time)
            : args.format.toString();
        if (code === getFormatFromType(NumberFormatType.Time)) {
            code = 'h:mm:ss a';
        }
        return intl.formatDate(time, {
            type: 'time',
            skeleton: 'medium',
            format: code
        });
    }

    private scientificFormat(args: { [key: string]: string | number | boolean | CellModel }): string {
        args.format = args.format === '' ? getFormatFromType(NumberFormatType.Scientific) : args.format;
        let zeros: string = (args.format as string).split('+')[1];
        let prefix: number = this.findDecimalPlaces(args.format as string, 'Scientific');
        let fResult: string = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        } else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + + this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult;
    }

    private fractionFormat(args: { [key: string]: string | number | boolean | CellModel }): string {
        args.format = args.format === '' ? getFormatFromType(NumberFormatType.Fraction) : args.format;
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
        switch (type) {
            case 'Scientific':
                let eIndex: number = code.toUpperCase().indexOf('E');
                let decIndex: number = code.indexOf(this.decimalSep);
                if (eIndex > -1) {
                    return code.substring(decIndex + 1, eIndex).length;
                }
        }
        return 2;
    }

    public checkDateFormat(args: { [key: string]: string | number | boolean | CellModel }): void {
        let dateObj: ToDateArgs;
        let intl: Internationalization = new Internationalization();
        let fCode: string;
        let value: string = !isNullOrUndefined(args.value) ? args.value.toString() : '';
        let cell: CellModel = getCell(
            <number>args.rowIndex, <number>args.colIndex,
            getSheet(this.parent, (<number>args.sheetIndex || this.parent.activeSheetTab) - 1));
        if (value && value.indexOf('/') > -1 || value.indexOf('-') > -1 || value.indexOf(':') > -1) {
            dateObj = toDate(value, intl);
            if (!isNullOrUndefined(dateObj.dateObj) && dateObj.dateObj.toString() !== 'Invalid Date') {
                cell = cell ? cell : {};
                value = dateToInt(dateObj.dateObj, value.indexOf(':') > -1).toString();
                fCode = 'short';
                if (!cell.format || cell.format === '') {
                    if (dateObj.type === 'time') {
                        cell.format = getFormatFromType(NumberFormatType.Time);
                    } else {
                        cell.format = getFormatFromType(NumberFormatType.ShortDate);
                    }
                }
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                args.isDate = dateObj.type === 'date' || dateObj.type === 'datetime';
                args.isTime = dateObj.type === 'time';
            }
        }
        args.updatedVal = value;
    }

    private formattedBarText(args: { [key: string]: CellModel | string }): void {
        let type: string = getTypeFromFormat((<CellModel>args.cell) ? (<CellModel>args.cell).format : '');
        let intl: Internationalization = new Internationalization();
        let beforeText: string = <string>args.value;
        let date: string = getFormatFromType(NumberFormatType.ShortDate);
        let time: string = getFormatFromType(NumberFormatType.Time);
        switch (type) {
            case NumberFormatType.ShortDate:
            case NumberFormatType.LongDate:
                args.value = this.shortDateFormat({ type: type, value: <string>args.value, format: date }, intl);
                break;
            case NumberFormatType.Time:
                args.value = this.shortDateFormat({ type: type, value: <string>args.value, format: date }, intl) + ' ' +
                    this.timeFormat({ type: type, value: <string>args.value, format: time }, intl);
                break;
        }
        if (!args.value || (args.value && args.value.toString().indexOf('null') > -1)) {
            args.value = beforeText;
        }
    }

    /**
     * Adding event listener for number format.
     */
    public addEventListener(): void {
        this.parent.on(applyNumberFormatting, this.numberFormatting, this);
        this.parent.on(getFormattedCellObject, this.getFormattedCell, this);
        this.parent.on(checkDateFormat, this.checkDateFormat, this);
        this.parent.on(getFormattedBarText, this.formattedBarText, this);

    }

    /**
     * Removing event listener for number format.
     */
    public removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyNumberFormatting, this.numberFormatting);
            this.parent.off(getFormattedCellObject, this.getFormattedCell);
            this.parent.off(checkDateFormat, this.checkDateFormat);
            this.parent.off(getFormattedBarText, this.formattedBarText);
        }
    }

    /**
     * To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook number format module name.
     */
    public getModuleName(): string {
        return 'workbookNumberFormat';
    }
}

/**
 * To Get the number built-in format code from the number format type.
 * @param {string} type - Specifies the type of the number formatting. 
 */
export function getFormatFromType(type: string): string {
    let code: string = NumberFormatType.General;
    switch (type.split(' ').join('')) {
        case NumberFormatType.Number:
            code = '0.00';
            break;
        case NumberFormatType.Currency:
            code = '$#,##0.00';
            break;
        case NumberFormatType.Accounting:
            code = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            break;
        case NumberFormatType.ShortDate:
            code = 'mm-dd-yyyy';
            break;
        case NumberFormatType.LongDate:
            code = 'dddd, mmmm dd, yyyy';
            break;
        case NumberFormatType.Time:
            code = 'h:mm:ss AM/PM';
            break;
        case NumberFormatType.Percentage:
            code = '0.00%';
            break;
        case NumberFormatType.Fraction:
            code = '# ?/?';
            break;
        case NumberFormatType.Scientific:
            code = '0.00E+00';
            break;
        case NumberFormatType.Text:
            code = '@';
            break;
    }
    return code;
}

/**
 * @hidden
 */
export function getTypeFromFormat(format: string): string {
    let code: string = NumberFormatType.General;
    switch (format) {
        case '0.00':
            code = NumberFormatType.Number;
            break;
        case '$#,##0.00':
        case '$#,##0_);[Red]($#,##0)':
        case '$#,##0.00_);[Red]($#,##0.00)':
        case '$#,##0.00_);($#,##0.00)':
        case '$#,##0_);($#,##0)':
            code = NumberFormatType.Currency;
            break;
        case '_($*#,##0.00_);_($*(#,##0.00);_($*"-"??_);_(@_)':
        case '_($*#,##0.00_);_($* (#,##0.00);_($*"-"??_);_(@_)':
        case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
            code = NumberFormatType.Accounting;
            break;
        case 'mm-dd-yyyy':
        case 'dd-mm-yyyy':
        case 'dd-mm-yy':
        case 'mm-dd-yy':
            code = NumberFormatType.ShortDate;
            break;
        case 'dddd, mmmm dd, yyyy':
            code = NumberFormatType.LongDate;
            break;
        case 'h:mm:ss AM/PM':
            code = NumberFormatType.Time;
            break;
        case '0.00%':
        case '0%':
            code = NumberFormatType.Percentage;
            break;
        case '# ?/?':
        case '# ??/??':
        case '# ???/???':
            code = NumberFormatType.Fraction;
            break;
        case '0.00E+00':
            code = NumberFormatType.Scientific;
            break;
        case '@':
            code = NumberFormatType.Text;
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
}