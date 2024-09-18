import { getRangeIndexes, NumberFormatType, updateCell, applyCellFormat, CellFormatArgs, isReadOnly, isImported, getSwapRange } from '../common/index';
import { CellModel, SheetModel, getCell, getSheet, setCell, getSheetIndex, Workbook, getColorCode, getCustomColors, getRow, RowModel, isHiddenRow } from '../base/index';
import { Internationalization, getNumberDependable, getNumericObject, isNullOrUndefined, IntlBase } from '@syncfusion/ej2-base';
import { cldrData, defaultCurrencyCode } from '@syncfusion/ej2-base';
import { isNumber, toFraction, intToDate, toDate, dateToInt, ToDateArgs, DateFormatCheckArgs, rowFillHandler } from '../common/index';
import { applyNumberFormatting, getFormattedCellObject, refreshCellElement, checkDateFormat, getFormattedBarText } from '../common/index';
import { getTextSpace, NumberFormatArgs, isCustomDateTime, VisibleMergeIndexArgs, setVisibleMergeIndex, refreshChart } from './../index';
import { checkIsNumberAndGetNumber, parseThousandSeparator } from '../common/internalization';
import { AutoDetectGeneralFormatArgs, checkNumberFormat, LocaleNumericSettings, parseDecimalNumber } from './../common/index';
import { localizedFormatAction, LocalizedFormatActionArgs } from '../common/index';

/**
 * Specifies number format.
 */
export class WorkbookNumberFormat {
    private parent: Workbook;
    private localeObj: LocaleNumericSettings;
    private customFormats: string[];
    private localizedFormats: string[];
    constructor(parent: Workbook) {
        this.parent = parent;
        this.localeObj = <LocaleNumericSettings>getNumericObject(this.parent.locale);
        const dependables: { dayPeriods?: { format: { wide: { am: string, pm: string } } }, timeFormats?: { medium: string },
            dateFormats?: { short: string, long: string } } = IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject;
        if (dependables.dayPeriods && dependables.dayPeriods && dependables.dayPeriods.format && dependables.dayPeriods.format.wide) {
            this.localeObj.am = dependables.dayPeriods.format.wide.am || 'AM';
            this.localeObj.pm = dependables.dayPeriods.format.wide.pm || 'PM';
        } else {
            this.localeObj.am = 'AM';
            this.localeObj.pm = 'PM';
        }
        this.updateLocalizedFormats(dependables);
        this.addEventListener();
    }

    private numberFormatting(args: { format: string, range?: string, cancel?: boolean, curSym?: string }): void {
        let sheetIdx: number = this.parent.activeSheetIndex;
        let activeSheet: boolean = true;
        if (args.range && args.range.indexOf('!') > -1) {
            sheetIdx = getSheetIndex(this.parent, args.range.split('!')[0]);
            activeSheet = sheetIdx === this.parent.activeSheetIndex;
        }
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        const formatRange: string = args.range ? ((args.range.indexOf('!') > -1) ?
            args.range.split('!')[1] : args.range) : sheet.selectedRange;
        const selectedRange: number[] = getSwapRange(getRangeIndexes(formatRange));
        args.curSym = getNumberDependable(this.parent.locale, defaultCurrencyCode);
        let fArgs: NumberFormatArgs; let cell: CellModel; let prevFormat: string; let row: RowModel; let isVisibleRow: boolean;
        for (let rowIdx: number = selectedRange[0]; rowIdx <= selectedRange[2]; rowIdx++) {
            row = getRow(sheet, rowIdx);
            isVisibleRow = activeSheet && !isHiddenRow(sheet, rowIdx);
            for (let colIdx: number = selectedRange[1]; colIdx <= selectedRange[3]; colIdx++) {
                cell = getCell(rowIdx, colIdx, sheet, false, true);
                prevFormat = cell.format;
                if (!isReadOnly(cell, sheet.columns[colIdx as number], row) &&
                    !updateCell(this.parent, sheet, { cell: { format: args.format }, rowIdx: rowIdx, colIdx: colIdx })) {
                    cell = getCell(rowIdx, colIdx, sheet);
                    if (!(cell.rowSpan < 0 || cell.colSpan < 0)) {
                        fArgs = { value: cell.value, format: cell.format, rowIndex: rowIdx, colIndex: colIdx, sheetIndex: sheetIdx,
                            cell: cell, refresh: activeSheet, curSymbol: args.curSym };
                        this.getFormattedCell(fArgs);
                        if (isVisibleRow) {
                            this.setCell(fArgs);
                            if (fArgs.td) {
                                this.parent.notify(refreshCellElement, fArgs);
                            }
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
        if (this.parent.chartColl && this.parent.chartColl.length) {
            this.parent.notify(refreshChart, { range: selectedRange });
        }
    }

    private isDigitPlaceHolder(char: string): boolean {
        return char === '#' || char === '0' || char === '?' || char === '.';
    }

    private parseToLocalizedFormat(args: LocalizedFormatActionArgs): void {
        if (args.decimalGroupSepsChanged && (args.format.includes('.') || args.format.includes(','))) {
            let formatChar: string; let endPos: number; let prevChar: string;
            const formatChars: string[] = args.format.split('');
            for (let idx: number = 0; idx < formatChars.length; idx++) {
                formatChar = formatChars[idx as number];
                if (formatChar === '"') {
                    endPos = args.format.indexOf('"', idx + 1);
                    if (endPos > -1) {
                        idx = endPos;
                    }
                } else if (formatChar === '_' || formatChar === '*' || formatChar === '\\') {
                    idx++;
                } else if (formatChar === '[') {
                    endPos = args.format.indexOf(']', idx + 1);
                    if (endPos > -1) {
                        idx = endPos;
                    }
                } else if (formatChar === ',') {
                    if (this.isDigitPlaceHolder(formatChars[idx - 1])) {
                        formatChars[idx as number] = this.localeObj.group;
                    }
                } else if (formatChar === '.') {
                    if (formatChars[idx - 1]) {
                        prevChar = formatChars[idx - 1].toLowerCase();
                        if (!['d', 'm', 'y', 'h'].some((char: string) => prevChar === char)) {
                            formatChars[idx as number] = this.localeObj.decimal;
                        }
                    } else {
                        formatChars[idx as number] = this.localeObj.decimal;
                    }
                }
            }
            args.format = formatChars.join('');
        }
        if (args.curChanged && args.format.includes(`"${args.curSym}"`)) {
            args.format = args.format.split(`"${args.curSym}"`).join(args.curSym);
        }
    }

    private updateLocalizedFormats(dependables: { timeFormats?: { medium: string } }, isFormatMapping?: boolean): void {
        numberFormatsCode = {
            currency: ['$#,##0.00', '$#,##0', '$#,##0_);($#,##0)', '$#,##0_);[Red]($#,##0)', '$#,##0.00_);($#,##0.00)',
                '$#,##0.00_);[Red]($#,##0.00)'],
            accounting: ['_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)', '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)',
                '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)', '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)'],
            time: dependables.timeFormats && dependables.timeFormats.medium === 'HH:mm:ss' ? 'HH:mm:ss' : 'h:mm:ss AM/PM'
        };
        const curSym: string = getNumberDependable(this.parent.locale, defaultCurrencyCode);
        const args: LocalizedFormatActionArgs = { curChanged: curSym !== '$', curSym,
            decimalGroupSepsChanged: this.localeObj.decimal !== '.' && this.localeObj.group !== ',' };
        if (args.curChanged) {
            const intl: Internationalization = new Internationalization(this.parent.locale);
            const formatStr: string = intl.getNumberPattern({ currency: '$', useGrouping: true, format: 'c0' }, true);
            if (formatStr && formatStr.endsWith('$')) {
                const curSpacing: string = formatStr[formatStr.indexOf('$') - 1].trim().length ? '' : ' ';
                numberFormatsCode.currency.forEach((format: string, index: number) => {
                    if (format.includes('$#,##0')) {
                        let decimalFormat: string = '';
                        const decimalPart: string = format.split('$#,##0.')[1];
                        if (decimalPart) {
                            let decimalCount: number = 0;
                            while (decimalPart[decimalCount as number] === '0') {
                                decimalFormat += '0';
                                decimalCount++;
                            }
                        }
                        if (decimalFormat) {
                            decimalFormat = `.${decimalFormat}`;
                        }
                        numberFormatsCode.currency[index as number] = format.split(
                            `$#,##0${decimalFormat}`).join(`#,##0${decimalFormat}${curSpacing}"${curSym}"`);
                    }
                });
                numberFormatsCode.accounting.forEach((format: string, index: number) => {
                    if (format.slice(0, format.indexOf('#')).includes('$')) {
                        const formatArr: string[] = format.split(';');
                        let replaceIdx: number;
                        formatArr.forEach((formatStr: string, index: number) => {
                            if (formatStr.includes('$')) {
                                formatStr = formatStr.replace('$', '');
                                if (formatStr.includes('0)')) {
                                    replaceIdx = formatStr.indexOf('0)') + 2;
                                } else {
                                    replaceIdx = formatStr.lastIndexOf(
                                        formatStr.includes('0') ? '0' : (formatStr.includes('?') ? '?' :
                                            (formatStr.includes('"-"') ? '"' : '#'))) + 1;
                                }
                                if (replaceIdx > 0) {
                                    formatArr[index as number] = formatStr.slice(0, replaceIdx) + curSpacing + `"${curSym}"` +
                                        formatStr.slice(replaceIdx);
                                }
                            }
                        });
                        numberFormatsCode.accounting[index as number] = formatArr.join(';');
                    }
                });
            } else {
                const updateLocalizedCurrency: (format: string, index: number, formats: string[]) => void =
                    (format: string, index: number, formats: string[]) => formats[index as number] = format.split('$').join(`"${curSym}"`);
                numberFormatsCode.currency.forEach(updateLocalizedCurrency);
                numberFormatsCode.accounting.forEach(updateLocalizedCurrency);
            }
        }
        const customFormats: string[] = ['General', '0', '0.00', '#,##0', '#,##0.00', '#,##0_);(#,##0)', '#,##0_);[Red](#,##0)',
            '#,##0.00_);(#,##0.00)', '#,##0.00_);[Red](#,##0.00)', numberFormatsCode.currency[2], numberFormatsCode.currency[3],
            numberFormatsCode.currency[4], numberFormatsCode.currency[5], '0%', '0.00%', '0.00E+00', '##0.0E+0', '# ?/?', '# ??/??',
            'm/d/yyyy', 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM', 'h:mm', 'h:mm:ss', 'm/d/yyyy h:mm', 'mm:ss',
            'mm:ss.0', '@', '[h]:mm:ss', ...numberFormatsCode.accounting];
        if (isFormatMapping) {
            this.customFormats.splice(0, customFormats.length, ...customFormats);
        } else {
            this.customFormats = customFormats;
            this.localizedFormats = [];
        }
        const defaultFormatsId: number[] = [0, 1, 2, 3, 4, 37, 38, 39, 40, 5, 6, 7, 8, 9, 10, 11, 48, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 45, 47, 49, 46, 42, 41, 44, 43];
        let formatIdx: number;
        defaultFormatsId.forEach((id: number, index: number) => {
            if (defaultFormats && defaultFormats.has(id)) {
                this.customFormats[index as number] = defaultFormats.get(id);
                formatIdx = [5, 6, 7, 8].indexOf(id);
                if (formatIdx > -1) {
                    numberFormatsCode.currency[formatIdx + 2] = this.customFormats[index as number];
                } else {
                    formatIdx = [42, 41, 44, 43].indexOf(id);
                    if (formatIdx > -1) {
                        numberFormatsCode.accounting[formatIdx as number] = this.customFormats[index as number];
                    }
                }
            }
            args.format = this.customFormats[index as number];
            this.parseToLocalizedFormat(args);
            this.localizedFormats[index as number] = args.format;
        });
        for (let idx: number = defaultFormatsId.length; idx < this.localizedFormats.length; idx++) {
            const cusFormatIdx: number = this.localizedFormats.findIndex(
                (format: string, index: number) => format === this.localizedFormats[idx as number] && index < defaultFormatsId.length);
            if (cusFormatIdx > -1) {
                this.localizedFormats.splice(idx, 1);
                this.customFormats.splice(idx, 1);
                idx--;
            }
        }
    }

    private localizedFormatAction(args: LocalizedFormatActionArgs): void {
        if (args.action === 'getLocalizedFormats') {
            args.defaultFormats = this.customFormats;
            args.localizedFormats = this.localizedFormats;
        }  else if (args.action === 'mapNumberFormatId') {
            this.updateLocalizedFormats(IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject, true);
        } else {
            args.curSym = getNumberDependable(this.parent.locale, defaultCurrencyCode);
            if (args.action === 'parseToDefaultFormat') {
                this.parseToDefaultFormat(args);
            } else {
                // addToCustomFormats action
                args.decimalGroupSepsChanged = this.localeObj.decimal !== '.' && this.localeObj.group !== ',';
                args.curChanged = args.curSym !== '$';
                if (!args.defaultFormat) {
                    args.defaultFormat = args.format;
                    this.parseToLocalizedFormat(args);
                }
                if (this.localizedFormats.indexOf(args.format) === -1) {
                    this.localizedFormats.push(args.format);
                    this.customFormats.push(args.defaultFormat);
                }
            }
        }
    }

    private parseToDefaultFormat(args: LocalizedFormatActionArgs): void {
        const decimalSepChanged: boolean = this.localeObj.decimal !== '.' && args.format.includes(this.localeObj.decimal);
        const groupSepChanged: boolean = this.localeObj.group !== ',' && args.format.includes(this.localeObj.group);
        const curSymChanged: boolean = args.curSym !== '$' && args.format.includes(args.curSym);
        if (decimalSepChanged || groupSepChanged || curSymChanged) {
            let endPos: number; let prevChar: string; let formatChar: string;
            const formatSection: string[] = args.format.split(';');
            formatSection.forEach((format: string, index: number): void => {
                const formatChars: string[] = format.split('');
                for (let idx: number = 0; idx < formatChars.length; idx++) {
                    formatChar = formatChars[idx as number];
                    if (formatChar === '"') {
                        idx = format.indexOf('"', idx + 1);
                    } else if (formatChar === '_' || formatChar === '*' || formatChar === '\\') {
                        idx++;
                    } else if (formatChar === '[') {
                        endPos = format.indexOf(']', idx + 1);
                        if (endPos > -1) {
                            idx = endPos;
                        }
                    } else if (decimalSepChanged && formatChar === this.localeObj.decimal) {
                        prevChar = formatChars[idx - 1];
                        if (prevChar) {
                            prevChar = prevChar.toLowerCase();
                            if (!['d', 'm', 'y', 'h'].some((char: string) => prevChar === char)) {
                                formatChars[idx as number] = '.';
                            }
                        } else {
                            formatChars[idx as number] = '.';
                        }
                    } else if (groupSepChanged && formatChar === this.localeObj.group) {
                        if (this.isDigitPlaceHolder(formatChars[idx - 1])) {
                            formatChars[idx as number] = ',';
                        }
                    } else if (curSymChanged) {
                        if (formatChar === args.curSym) {
                            formatChars[idx as number] = `"${args.curSym}"`;
                        } else if (args.curSym.startsWith(formatChar) &&
                            format.substring(idx, idx + args.curSym.length) === args.curSym) {
                            formatChars.splice(idx, args.curSym.length, `"${args.curSym}"`);
                        }
                    }
                }
                formatSection[index as number] = formatChars.join('');
            });
            args.format = formatSection.join(';');
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
        const intl: Internationalization = new Internationalization();
        if (!args.curSymbol) {
            args.curSymbol = getNumberDependable(this.parent.locale, defaultCurrencyCode);
        }
        if ((!args.format || args.format === 'General') && !args.skipFormatCheck && (!cell.formula ||
            !cell.formula.toLowerCase().startsWith('=text('))) {
            args.type = args.format = 'General';
            if (!cell.formula || (cell.formula && cell.formula.indexOf('&-') === -1)) { // for 5&-3=>5-3.
                const dateEventArgs: DateFormatCheckArgs = { value: fResult, updatedVal: fResult, cell: cell, isEdit: args.isEdit,
                    intl: intl };
                this.checkDateFormat(dateEventArgs);
                if (dateEventArgs.isDate || dateEventArgs.isTime) {
                    rightAlign = true;
                    cell.value = args.value = dateEventArgs.updatedVal;
                    if (cell.format && cell.format !== 'General') {
                        args.format = cell.format;
                        args.type = getTypeFromFormat(args.format);
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
            const option: { type?: string } = {};
            if (defaultFormats && isImported(this.parent)) {
                cell.format = args.format = this.getMatchingCustomFormat(cell.format);
            }
            const orgFormat: string = cell.format;
            cell.format = cell.format.split('\\').join('');
            if (cell.format.indexOf(';') > -1) {
                if (cell.format.indexOf('<') > -1 || cell.format.indexOf('>') > -1) {
                    args.result = this.processCustomConditions(cell, args);
                } else {
                    args.result = this.processCustomAccounting(cell, args);
                    isCustomText = !isNumber(cell.value) || cell.format === '@';
                }
                cell.format = orgFormat;
            } else if (isCustomDateTime(cell.format, true, option, true)) {
                if (fResult !== '') {
                    if (this.localeObj.decimal !== '.' && cell.value && cell.value.toString().includes(this.localeObj.decimal)) {
                        const cellVal: string = cell.value.replace(this.localeObj.decimal, '.');
                        if (isNumber(cellVal)) {
                            cell.value = args.value = cellVal;
                        }
                    }
                    args.result = this.processCustomDateTime(args, cell, option.type !== 'time');
                    isCustomText = !args.formatApplied;
                }
                args.result = args.result || cell.value;
            } else if (isTextFormat) {
                isCustomText = true;
                args.result = this.processCustomText(cell.format, fResult, args);
            } else {
                const numObj: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
                    { value: fResult }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
                if (numObj.isNumber) {
                    cell.value = args.value = numObj.value;
                    if (cell.format.includes('E+0')) {
                        if (args.format !== cell.format) {
                            args.format = cell.format;
                        }
                        this.checkAndSetColor(args);
                        const numberFormat: string = args.format.split('E')[0];
                        let formatArr: string[] = numberFormat.split('.');
                        if (this.localeObj.decimal !== '.' && formatArr.length === 1) {
                            formatArr = numberFormat.split(this.localeObj.decimal);
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
            const result: { fResult: string, rightAlign: boolean } = this.processFormats(args, fResult, rightAlign, cell, intl, sheet);
            args.formattedText = result.fResult || (args.value === undefined || args.value === null ? '' : args.value.toString());
            args.isRightAlign = result.rightAlign;
        }
        if (args.rowIndex !== undefined) {
            if (cell.format && args.formattedText && args.formattedText !== cell.value && cell.format !== 'General') {
                cell.formattedText = args.formattedText;
            } else if (cell.formattedText) {
                delete cell.formattedText;
            }
        }
        return args.formattedText;
    }

    private isCustomType(cell: CellModel): boolean {
        const format: string = getTypeFromFormat(cell.format);
        return (format === 'General' && cell.format !== 'General') || (format === 'Time' && this.parent.isEdit);
    }

    private processCustomFill(format: string, cell: CellModel, args: NumberFormatArgs, formatText?: string): string {
        const repeatChar: string = format[format.indexOf('*') + 1];
        const codes: string[] = format.split('*' + repeatChar);
        if (args.rowIndex === undefined || args.dataUpdate) {
            formatText = formatText || this.processCustomNumberFormat({ format: codes.join(''), value: cell.value }, args);
        } else {
            let secText: string;
            if (codes[1]) {
                const cellVal: number = parseFloat(cell.value);
                if (cellVal < 0) {
                    secText = this.processCustomNumberFormat({ format: codes[1], value: Math.abs(cellVal).toString() }, args);
                    formatText = `-${codes[0].split('\'').join('')}`;
                } else {
                    secText = this.processCustomNumberFormat({ format: codes[1], value: cell.value }, args);
                    formatText = codes[0].split('\'').join('');
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
            formatText = this.parent.isPrintingProcessing ? formatText + secText : formatText;
        }
        return formatText;
    }

    private processCustomDateTime(args: NumberFormatArgs, cell: CellModel, isDate: boolean): string {
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
                let noOfDays: number;
                if (cell.format.includes('[h]')) {
                    const timeArr: string[] = cell.value.toString().split(':');
                    if (timeArr.length > 1 && Number(timeArr[0]) >= 24) {
                        noOfDays = Number(timeArr[0]) / 24;
                        timeArr[0] = '24';
                        cell.value = timeArr.join(':');
                    }
                }
                dateArgs = toDate(cell.value, new Internationalization(), this.parent.locale, custFormat, cell);
                isValidDate = dateArgs.dateObj && dateArgs.dateObj.toString() !== 'Invalid Date';
                if (isValidDate) {
                    if (dateArgs.dateObj.getFullYear() < 1900) {
                        return '';
                    } else {
                        let dateIntVal: number = dateToInt(dateArgs.dateObj, cell.value.toString().includes(':'), dateArgs.type === 'time');
                        if (noOfDays >= 1) {
                            dateIntVal += noOfDays;
                            dateArgs.dateObj = intToDate(dateIntVal);
                        }
                        cell.value = dateIntVal.toString();
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
                if (checkDate && isDate) {
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
        custFormat = custFormat.split('_(').join(' ').split('_)').join(' ');
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
            let compareVal: string; let conditionNotMatch: boolean; let colorCode: string;
            for (let i: number = 0; i < formatArr.length; i++) {
                cell.format = formatArr[i as number];
                colorCode = getColorCode(cell.format);
                if (colorCode) {
                    cell.format = cell.format.split(`[${colorCode}]`).join('');
                }
                if (cell.format.includes('[')) {
                    compareVal = cell.format.split('[')[1].split(']')[0];
                    const ltEqualTo: string[] = compareVal.split('<='); const gtEqualTo: string[] = compareVal.split('>=');
                    const lessThan: string[] = compareVal.split('<'); const greaterThan: string[] = compareVal.split('>');
                    if ((ltEqualTo.length === 2 && val <= Number(ltEqualTo[1])) ||
                        (gtEqualTo.length === 2 && val >= Number(gtEqualTo[1])) ||
                        (lessThan.length === 2 && val < Number(lessThan[1])) ||
                        (greaterThan.length === 2 && val > Number(greaterThan[1]))) {
                        cell.format = formatArr[i as number].split(`[${compareVal}]`).join('');
                        conditionNotMatch = false;
                        break;
                    }
                    conditionNotMatch = compareVal.split(/<=|>=|<|>/).length === 2;
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

    private processCustomAccounting(cell: CellModel, args: NumberFormatArgs): string {
        const formats: string[] = cell.format.split(';');
        const numObj: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
            cell, this.parent.locale, this.localeObj.group, this.localeObj.decimal, args.curSymbol);
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
                format = formats[2].includes(`${args.curSymbol}0`) ? formats[2].split('0').join('#') : formats[2];
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
        let result: string = this.processCustomNumberFormat(
            { format: format.split('@').join('#'), value: cellVal.split(cellVal).join('1') }, args);
        if (result) {
            result = result.split('1').join(cellVal);
            if (this.localeObj.decimal !== '.' && isNumber(result) && result.includes('.')) {
                result = result.replace('.', this.localeObj.decimal);
            }
        }
        return result;
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
            if (cell.format[i as number] === '"' && cell.format[i - 1] !== '\\') {
                i = cell.format.indexOf('"', i + 1);
            } else if (cell.format[i as number] === ',' && !(codes.indexOf(cell.format[i + 1]) > -1)) {
                count++;
            }
        }
        return count;
    }

    private processDigits(cell: CellModel, customFormat: string): string {
        customFormat = customFormat.split('?').join('0');
        let cellValue: string = cell.value.toString();
        cellValue = this.getFormattedNumber(customFormat, parseFloat(cellValue));
        if (cellValue && cellValue.includes(this.localeObj.decimal)) {
            const valArr: string[] = cellValue.split(this.localeObj.decimal);
            cellValue = valArr[0] + this.localeObj.decimal + valArr[1].split('0').join('  ');
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
                    frontSpaceCount++; idx++;
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
        let formattedText: string = cell.value;
        const numArgs: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
            cell, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
        if (numArgs.isNumber) {
            let isFormatted: boolean; let isZeroFormat: boolean;
            cell.value = numArgs.value;
            const cellValue: number | string = parseFloat(cell.value.toString());
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
                isZeroFormat = cellValue === 0 && !customFormat.includes('#') && !customFormat.includes('0');
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
                    const textArr: string[] = formattedText.split(this.localeObj.decimal);
                    textArr[0] = textArr[0].toString().replace(/^0+/, '');
                    formattedText = textArr.join(this.localeObj.decimal);
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
            custFormat = custFormat.split('"').join('\'');
        } else if (custFormat.indexOf('\\') > -1) {
            custFormat = custFormat.split('\\').join('');
        }
        return custFormat;
    }

    private processFormats(
        args: NumberFormatArgs, fResult: string, isRightAlign: boolean, cell: CellModel, intl: Internationalization,
        sheet: SheetModel): { fResult: string, rightAlign: boolean } {
        let options: AutoDetectGeneralFormatArgs;
        if (fResult !== '') {
            let numArgs: { isNumber: boolean, value: string };
            if (args.type !== 'General' && args.type !== 'Text' && this.isPercentageValue(fResult.toString(), args, cell)) {
                fResult = args.value.toString();
            }
            switch (args.type) {
            case 'General':
                options = { args: args, fResult: fResult, intl: intl, isRightAlign: isRightAlign,
                    cell: cell, rowIdx: Number(args.rowIndex), colIdx: Number(args.colIndex), sheet: sheet };
                if (!(options.fResult.toString().startsWith('\n') || options.fResult.toString().endsWith('\n '))) {
                    this.autoDetectGeneralFormat(options);
                }
                fResult = options.fResult;
                isRightAlign = options.isRightAlign;
                break;
            case 'Number':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.applyNumberFormat(args, intl);
                    isRightAlign = true;
                }
                break;
            case 'Currency':
                numArgs = checkIsNumberAndGetNumber(
                    { value: fResult, format: args.format }, this.parent.locale, this.localeObj.group, this.localeObj.decimal,
                    args.curSymbol);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.currencyFormat(args, intl, cell);
                    isRightAlign = true;
                }
                break;
            case 'Percentage':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.percentageFormat(args, intl);
                    isRightAlign = true;
                }
                break;
            case 'Accounting':
                fResult = this.accountingFormat(args, fResult, intl, cell);
                isRightAlign = args.formatApplied;
                break;
            case 'ShortDate':
                fResult = this.checkAndProcessNegativeValue(args, args.value) ? args.formattedText : this.shortDateFormat(args, intl, cell);
                isRightAlign = !!fResult;
                break;
            case 'LongDate':
                fResult = this.checkAndProcessNegativeValue(args, args.value) ? args.formattedText : this.longDateFormat(args, intl);
                isRightAlign = !!fResult;
                break;
            case 'Time':
                fResult = this.checkAndProcessNegativeValue(args, args.value) ? args.formattedText : this.timeFormat(args, intl, cell);
                isRightAlign = !!fResult;
                break;
            case 'Fraction':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.fractionFormat(args);
                    isRightAlign = true;
                }
                break;
            case 'Scientific':
                numArgs = checkIsNumberAndGetNumber({ value: fResult }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
                if (numArgs.isNumber) {
                    cell.value = args.value = numArgs.value;
                    fResult = this.scientificFormat(args);
                    isRightAlign = true;
                }
                break;
            case 'Text':
                if (this.localeObj.decimal !== '.' && isNumber(fResult) && fResult.toString().includes('.')) {
                    fResult = fResult.toString().replace('.', this.localeObj.decimal);
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
        if (isDollarFormula && options.fResult && options.fResult.toString().includes(options.args.curSymbol) || isTextFormula) {
            return;
        }
        if (options.fResult && this.localeObj.decimal !== '.') {
            let cellVal: string = options.fResult.toString();
            prevVal = cellVal;
            if (cellVal.includes(this.localeObj.decimal)) {
                cellVal = cellVal.replace(this.localeObj.decimal, '.');
                if (isNumber(cellVal)) {
                    if (cellVal.includes('E')) {
                        options.fResult = cellVal;
                    } else {
                        options.fResult = options.args.value = cellVal = Number(cellVal).toString();
                        setCell(options.rowIdx, options.colIdx, options.sheet, { value: cellVal }, true);
                    }
                    prevVal = cellVal.replace('.', this.localeObj.decimal);
                }
            }
        }
        if (isNumber(options.fResult)) {
            let cellVal: string = Number(options.fResult).toString();
            if (options.fResult.toString().includes('E')) {
                options.args.format = getFormatFromType('Scientific');
                setCell(options.rowIdx, options.colIdx, options.sheet, { value: cellVal, format: options.args.format }, true);
                options.args.value = cellVal;
                options.fResult = this.scientificFormat(options.args);
            } else if (options.args.format) {
                if (options.args.format.indexOf('%') > -1) {
                    options.fResult = this.percentageFormat(options.args, options.intl);
                } else if (options.args.format.indexOf(options.args.curSymbol) > -1) {
                    options.fResult = this.currencyFormat(options.args, options.intl, options.args.cell);
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
                    }
                }
                options.cellVal = cellVal; options.prevVal = prevVal;
                this.parseDecimalNumber(options);
                if (isNullOrUndefined(options.fResult) && !isNullOrUndefined(options.cellVal)) {
                    options.fResult = options.cellVal;
                }
            }
            options.isRightAlign = true;
        }
        if (options.fResult) {
            this.updateAutoDetectNumberFormat(options);
        }
        if (addressFormula) {
            options.isRightAlign = false;
            options.fResult = val;
        }
    }
    private parseDecimalNumber(options: AutoDetectGeneralFormatArgs): void {
        const cellValArr: string[] = options.cellVal.split('.');
        if (cellValArr[0].length > 11) {
            options.cellVal = (Math.abs(Number(cellValArr[0])).toString()).substring(0, 6).replace(/0+$/, '');
            const digitLen: number = options.cellVal.length - 1;
            if (digitLen > -1) {
                options.fResult = this.scientificFormat(options.args, digitLen > 5 ? 5 : digitLen);
            }
        } else if (cellValArr[1]) {
            if (options.cellVal.length > 11) {
                // Subtract with 10 to neglect the decimal point.
                const rightDigitLen: number = 10 - (cellValArr[0].length - (Math.sign(Number(options.cellVal)) < 0 ? 1 : 0));
                options.fResult = Number(Number(options.cellVal).toFixed(rightDigitLen > 0 ? rightDigitLen : 0)).toString();
            } else if (options.cellVal.includes('e-')) {
                const expVal: string[] = options.cellVal.split('e-');
                const digitLen: number = Number(expVal[1]) + (expVal[0].includes('.') ? expVal[0].split('.')[1].length : 0);
                expVal[0] = expVal[0].replace('.', this.localeObj.decimal);
                if (expVal[1].length === 1) {
                    expVal[1] = '0' + expVal[1];
                }
                if (!options.args.updateValue) {
                    setCell(options.rowIdx, options.colIdx, options.sheet, { value: Number(options.cellVal).toFixed(digitLen) }, true);
                }
                options.fResult = expVal.join('E-');
            } else if (options.prevVal) {
                options.fResult = options.prevVal;
            } else if (options.args.updateValue && this.localeObj.decimal !== '.') {
                options.fResult = options.cellVal.replace('.', this.localeObj.decimal);
            }
        }
    }
    private updateAutoDetectNumberFormat(options: AutoDetectGeneralFormatArgs): void {
        let res: string = options.fResult.toString();
        const cell: CellModel = options.args.cell || options.cell;
        if (this.isPercentageValue(res, options.args, cell)) {
            cell.format = res.includes(this.localeObj.decimal) ? getFormatFromType('Percentage') : '0%';
            if (!options.args.updateValue) {
                options.args.format = cell.format;
                options.fResult = this.percentageFormat(options.args, options.intl);
                options.isRightAlign = true;
            }
        } else {
            if (res.includes(' ')) {
                const valArr: string[] = res.split(' ');
                if (valArr[1].includes('/') && isNumber(valArr[0]) && Number(valArr[0]) % 1 === 0) {
                    const fracArr: string[] = valArr[1].split('/');
                    if (isNumber(fracArr[0]) && Number(fracArr[0]) % 1 === 0 && isNumber(fracArr[1]) && Number(fracArr[1]) % 1 === 0) {
                        cell.format = `# ${fracArr[0].length > 1 || fracArr[1].length > 1 ? '??/??' : '?/?'}`;
                        cell.value = (Number(valArr[0]) + (Number(fracArr[0]) / Number(fracArr[1]))).toString();
                        if (!options.args.updateValue) {
                            options.args.value = cell.value;
                            options.args.format = cell.format;
                            options.fResult = this.fractionFormat(options.args);
                            options.isRightAlign = true;
                        }
                        return;
                    }
                }
            }
            let format: string = '';
            if (res.includes(options.args.curSymbol)) { // Auto detect 1000 separator format with currency symbol
                format = res.includes(this.localeObj.decimal) ? numberFormatsCode.currency[0] : numberFormatsCode.currency[1];
                res = res.replace(options.args.curSymbol, '');
            }
            const isEdit: boolean = this.localeObj.decimal === '.' || (options.args.isEdit && !cell.formula);
            if (isEdit && res.includes(this.localeObj.group) &&
                parseThousandSeparator(res, this.parent.locale, this.localeObj.group, this.localeObj.decimal)) {
                res = res.split(this.localeObj.group).join('');
                if (!format) { // Auto detect 1000 separator format
                    format = (res.includes(this.localeObj.decimal) ? '#,##0.00' : '#,##0');
                }
            }
            if (format) {
                res = res.replace(this.localeObj.decimal, '.');
                if (isNumber(res)) {
                    options.args.value = Number(res).toString();
                    if (options.args.updateValue) {
                        options.args.cell.value = options.args.value;
                        options.args.cell.format = format;
                    } else {
                        setCell(options.rowIdx, options.colIdx, options.sheet, { value: options.args.value, format: format }, true);
                        if (format.includes('"')) {
                            format = this.processText(format);
                        }
                        options.fResult = this.getFormattedNumber(format, Number(options.args.value));
                        options.isRightAlign = true;
                    }
                }
            } else if (this.localeObj.decimal !== '.' && options.args.format === 'General' && isNumber(res) && res.includes('.')) {
                options.fResult = Number(res).toString().replace('.', this.localeObj.decimal);
            }
        }
    }

    private isPercentageValue(value: string, args: NumberFormatArgs, cell: CellModel): boolean {
        if (value.includes('%')) {
            const valArr: string[] = value.split('%');
            if (valArr[0] !== '' && valArr[1].trim() === '') {
                const numArgs: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
                    { value: valArr[0] }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
                if (numArgs.isNumber) {
                    args.value = Number(numArgs.value) / 100;
                    cell.value = args.value.toString();
                    return true;
                }
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
        if (args.format.indexOf('?') > -1 && args.format.indexOf(this.localeObj.decimal) > -1) {
            const formatDecimalLen: number = args.format.split(this.localeObj.decimal)[1].length;
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
    private currencyFormat(args: NumberFormatArgs, intl: Internationalization, cell: CellModel): string {
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
        if (args.format.includes('"')) {
            args.format = this.processText(args.format);
        }
        return intl.formatNumber(cellVal, { format: args.format, currency: defaultCurrencyCode });
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
            const mergeArgs: VisibleMergeIndexArgs = {
                sheet: getSheet(this.parent, args.sheetIndex),
                cell: args.cell, rowIdx: args.rowIndex, colIdx: args.colIndex
            };
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

    private accountingFormat(args: NumberFormatArgs, fResult: string, intl: Internationalization, cell: CellModel): string {
        args.format = args.format || getFormatFromType('Accounting');
        args.format = args.format.split('_(').join(' ').split('_)').join(' ').split('[Red]').join('').split('_').join('');
        const formatArr: string[] = (args.format as string).split(';');
        const numArgs: { isNumber: boolean, value: string } = checkIsNumberAndGetNumber(
            { value: fResult }, this.parent.locale, this.localeObj.group, this.localeObj.decimal);
        if (numArgs.isNumber) {
            cell.value = args.value = numArgs.value;
            let cellVal: number = Number(args.value);
            if (cellVal >= 0) {
                args.format = cellVal === 0 && formatArr[2] ? formatArr[2] : formatArr[0];
            } else {
                args.format = formatArr[1].split('*').join(' ');
                cellVal = Math.abs(cellVal);
            }
            if (args.format.includes(args.curSymbol)) {
                if (args.format.includes('"')) {
                    args.format = this.processText(args.format);
                }
            }
            args.format = this.getFormatForOtherCurrency(args.format);
            args.formatApplied = true;
            if (cellVal === 0) {
                args.format = this.processText(args.format.split('*').join(' ').split('?').join(' '));
                if (!args.format.includes('#') && !args.format.includes('0')) {
                    args.format += '#';
                    let formattedText: string = intl.formatNumber(cellVal, { format: args.format, currency: defaultCurrencyCode });
                    if (formattedText.includes('0')) {
                        formattedText = formattedText.replace('0', '');
                    }
                    return formattedText;
                }
                return intl.formatNumber(cellVal, { format: args.format, currency: defaultCurrencyCode });
            } else {
                return intl.formatNumber(cellVal, { format: args.format, currency: defaultCurrencyCode });
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

    private shortDateFormat(args: NumberFormatArgs, intl: Internationalization, cell?: CellModel): string {
        let dateObj: Object;
        if (defaultFormats && isImported(this.parent) && cell && cell.format === 'm/d/yyyy' && defaultFormats.has(14)) {
            cell.format = args.format = defaultFormats.get(14);
        }
        let format: string;
        if (args.format === '' || args.format === 'General' || args.format === 'mm-dd-yyyy' || args.format === 'm/d/yyyy') {
            format = 'MM-dd-yyyy';
            dateObj = { type: 'date', skeleton: 'yMd' };
        } else {
            format = args.format;
            if (args.format === getFormatFromType('ShortDate')) {
                dateObj = { type: 'date', skeleton: 'yMd' };
            } else {
                dateObj = { type: 'date', format: args.format };
            }
        }
        let shortDate: Date;
        if (!isNumber(args.value) && args.value && cell) {
            args.value = args.value.toString();
            const dateArgs: DateFormatCheckArgs = { value: args.value, updatedVal: args.value, cell, isEdit: args.isEdit, intl: intl,
                skipCellFormat: true, format: format };
            this.checkDateFormat(dateArgs);
            if (dateArgs.isDate || dateArgs.isTime) {
                cell.value = args.value = dateArgs.updatedVal;
                shortDate = dateArgs.dateObj;
            } else {
                return '';
            }
        } else {
            shortDate = intToDate(args.value);
            if (!shortDate || shortDate.toString() === 'Invalid Date') {
                return '';
            } else if (shortDate.getFullYear() < 1900 || shortDate.getFullYear() > 9999) {
                return isNumber(args.value) ? args.value.toString() : '';
            }
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
        if (args.checkDate) {
            args.dateObj = longDate;
        }
        return intl.formatDate(longDate, { type: 'date', skeleton: 'full' });
    }

    private timeFormat(args: NumberFormatArgs, intl: Internationalization, cell?: CellModel): string {
        if (isNullOrUndefined(args.value)) {
            return '';
        }
        const defaultCode: string = getFormatFromType('Time');
        let code: string;
        if (args.format === '' || args.format === 'General') {
            code = defaultCode;
        }
        if (args.format === 'h:mm:ss AM/PM') {
            code = 'h:mm:ss a';
        } else {
            code = args.format;
        }
        let cellVal: string | number = args.value.toString();
        if (!isNumber(cellVal) && cell) {
            const timeArgs: DateFormatCheckArgs = { value: cellVal, updatedVal: cellVal, cell, isEdit: args.isEdit, intl: intl,
                skipCellFormat: true };
            this.checkDateFormat(timeArgs);
            if (timeArgs.isDate || timeArgs.isTime) {
                cell.value = cellVal = timeArgs.updatedVal;
            } else {
                return '';
            }
        }
        const value: string[] = cellVal.split('.');
        if (!isNullOrUndefined(value[1])) {
            cellVal = parseFloat((value[0] + 1) + '.' + value[1]) || cellVal;
        }
        return intl.formatDate(intToDate(cellVal), { type: 'time', skeleton: 'medium', format: code });
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
        if (!args.format) {
            args.format = getFormatFromType('Scientific');
        }
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
        return fResult.replace('.', this.localeObj.decimal);
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
            let decIndex: number = code.indexOf(this.localeObj.decimal);
            if (decIndex === -1 && this.localeObj.decimal !== '.') {
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
        const props: { val: string, format: string, isDateTime?: boolean } = this.checkCustomDateFormat(
            args.value.toString(), cell, args.isEdit);
        if (props.val !== 'Invalid') {
            let noOfDays: number;
            if (props.format.startsWith('[h]')) {
                const timeArr: string[] = props.val.split(':');
                if (timeArr.length > 1 && Number(timeArr[0]) >= 24) {
                    noOfDays = Number(timeArr[0]) / 24;
                    timeArr[0] = '24';
                    props.val = timeArr.join(':');
                }
            }
            const dateObj: ToDateArgs = toDate(
                props.val, args.intl || new Internationalization(this.parent.locale), this.parent.locale, props.format || args.format,
                args.skipCellFormat && cell, props.isDateTime);
            if (dateObj.dateObj && dateObj.dateObj.toString() !== 'Invalid Date') {
                const year: number = dateObj.dateObj.getFullYear();
                if (year >= 1900 && year <= 9999) {
                    args.isTime = dateObj.type === 'time';
                    let dateIntVal: number = dateToInt(dateObj.dateObj, props.val.includes(':'), args.isTime);
                    if (noOfDays >= 1) {
                        dateIntVal += noOfDays;
                        dateObj.dateObj = intToDate(dateIntVal);
                    }
                    props.val = dateIntVal.toString();
                    if (!cell.format || cell.format === 'General') {
                        if (args.isTime) {
                            cell.format = getFormatFromType('Time');
                        } else {
                            cell.format = getFormatFromType('ShortDate');
                        }
                        if (args.updateValue) {
                            cell.value = props.val;
                            return;
                        }
                    }
                    args.isDate = dateObj.type === 'date' || dateObj.type === 'datetime';
                    args.dateObj = dateObj.dateObj;
                }
                args.updatedVal = props.val;
            }
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
            const maxHour: number = isTewlveHr ? 12 : 23;
            timeArr.forEach((timeVal: string, index: number) => {
                if (timeVal.includes(am) || timeVal.includes(pm)) {
                    twelveHrRep = ' AM/PM';
                    timeVal = timeVal.replace(am, '').replace(pm, '');
                } else {
                    twelveHrRep = '';
                }
                timeProp = Number(timeVal);
                if (isNumber(timeProp) && timeProp >= 0) {
                    if (timeProp >= 24 && index === 0 && timeArr.length > 1) {
                        format.push('[h]');
                    } else if (timeProp <= maxHour && index === 0) {
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
                            if (timeArr.length === 2 && format[0] === '[h]') {
                                format.push('ss');
                            }
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
            let formatCode: string;
            if (isDefaultTime) {
                formatCode = this.customFormats[24];
            } else {
                formatCode = format.join(':');
                if (defaultFormats) {
                    formatCode = this.getMatchingCustomFormat(formatCode);
                }
            }
            if (!cell.format || cell.format === 'General') {
                cell.format = formatCode;
                return { val: val, format: formatCode };
            }
        }
        return { val: val, format: '' };
    }

    private checkCustomDateFormat(val: string, cell: CellModel, isEdit: boolean): { val: string, format: string, isDateTime?: boolean } {
        let separator: string;
        const cellFormat: string = cell.format; let timeArgs: { val: string, format: string };
        if (val.includes(this.localeObj.dateSeparator) && ((!val.includes(` ${this.localeObj.am}`) &&
            !val.includes(` ${this.localeObj.pm}`)) ||
            val.replace(` ${this.localeObj.am}`, '').replace(` ${this.localeObj.pm}`, '').includes(this.localeObj.dateSeparator))) {
            separator = this.localeObj.dateSeparator;
        } else if (val.indexOf('-') > 0) {
            separator = '-';
        } else {
            if (val.includes(this.localeObj.timeSeparator) || val.includes(` ${this.localeObj.am}`) ||
                val.includes(` ${this.localeObj.pm}`)) {
                return this.checkCustomTimeFormat(val, cell);
            }
            return { val: 'Invalid', format: '' };
        }
        if (val.includes(this.localeObj.timeSeparator) && val.includes(' ')) {
            const valArr: string[] = val.split(' ');
            val = valArr.shift();
            timeArgs = this.checkCustomTimeFormat(valArr.join(' '), cell);
            if (timeArgs.val === 'Invalid') {
                return { val: 'Invalid', format: '' };
            }
        }
        const dateArr: string[] = val.split(separator);
        let format: string = ''; const formatArr: string[] = [];
        const updateFormat: (defaultCode?: string) => void = (defaultCode: string): void => {
            format = formatArr.join(separator);
            if (!cellFormat || cellFormat === 'General') {
                cell.format = defaultCode;
            }
        };
        let firstVal: string;
        const formats: { months?: object } = IntlBase.getDependables(cldrData, this.parent.locale, null).dateObject;
        const months: Object = formats.months['stand-alone'] ? formats.months['stand-alone'].wide : {};
        const abbreviatedMonth: Object = formats.months['stand-alone'] ? formats.months['stand-alone'].abbreviated : { '1': '' };
        const enUSMonth: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const isMonth: Function = (monthValue: string, monthKey: string, dateVal: string, dateLength: number): void => {
            if (abbreviatedMonth[`${monthKey}`] && abbreviatedMonth[`${monthKey}`].toLowerCase() === dateVal) {
                firstVal = enUSMonth[Number(monthKey) - 1];
                return;
            }
            const shortMonthValue: string = monthValue.substring(0, dateLength);
            if (shortMonthValue === dateVal) {
                firstVal = enUSMonth[Number(monthKey) - 1];
            }
        };
        if (dateArr.length === 2) {
            const updateSecValue: (secVal: string) => void = (secVal: string): void => {
                val = firstVal;
                formatArr[0] = 'MMM';
                if (Number(secVal) <= 31 && Number(secVal) > 0) {
                    val = secVal + separator + val;
                    if (this.localeObj.dateSeparator !== '/' && separator !== '-') {
                        val += separator + new Date().getFullYear();
                    }
                    formatArr.splice(0, 0, 'dd');
                    updateFormat(this.customFormats[21]);
                } else {
                    if (secVal.length === 2 && isNumber(secVal) && Number(secVal) > -1) {
                        secVal = (Number(secVal) < 30 ? new Date().getFullYear().toString().slice(0, 2) : '19') + secVal;
                    }
                    if (Number(secVal) >= 1900 && Number(secVal) <= 9999) {
                        val = '1' + separator + val + separator + secVal;
                        formatArr[1] = 'yyyy';
                        updateFormat(this.customFormats[22]);
                    } else {
                        val = 'Invalid'; //Set as Invalid for invalid data like May-June.
                    }
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
                separator === '-' || (isEdit && !cell.formula))) {
                firstVal = enUSMonth[Number(dateArr[0]) - 1];
                updateSecValue(dateArr[1]);
            }
            if (!formatArr.length) {
                val = 'Invalid';
            }
        } else if (dateArr.length > 2) {
            for (let i: number = 0; i < dateArr.length; i++) {
                if (isNumber(dateArr[i as number])) {
                    if (dateArr[i as number].length !== 4 && dateArr[i as number].length !== 2 && dateArr[i as number].length !== 1) {
                        val = 'Invalid';
                    }
                } else {
                    dateArr[i as number] = dateArr[i as number].trim();
                    Object.keys(months).find((key: string) =>
                        isMonth(months[`${key}`].toLowerCase(), key, dateArr[i as number].trim().toLowerCase(),
                                dateArr[i as number].length));
                    if (!isNullOrUndefined(firstVal)) {
                        if (i === 1) {
                            formatArr[1] = 'MMM';
                            dateArr[2] = dateArr[2].trim();
                            if (dateArr[2].length === 2 && isNumber(dateArr[2]) && Number(dateArr[2]) > -1) {
                                dateArr[2] = (Number(dateArr[2]) < 30 ? new Date().getFullYear().toString().slice(0, 2) : '19') + dateArr[2];
                            }
                            if (Number(dateArr[0]) < 31 && Number(dateArr[2]) >= 1900 && Number(dateArr[2]) <= 9999) {
                                val = dateArr[0] + separator + firstVal;
                                val += (separator + dateArr[2]);
                                formatArr[0] = 'd';
                                formatArr[2] = 'yy';
                                updateFormat(this.customFormats[20]);
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
        let isDateTime: boolean;
        if (timeArgs && val !== 'Invalid') {
            if (!cellFormat || cellFormat === 'General') {
                cell.format = this.customFormats[27];
            }
            if (format && timeArgs.format) {
                format += ` ${timeArgs.format}`;
            }
            val += ` ${timeArgs.val}`;
            isDateTime = true;
        }
        return { val: val, format: format, isDateTime: isDateTime };
    }

    private formattedBarText(args: { cell: CellModel, value: string, type?: string, showFormattedText?: boolean }): void {
        if (args.value === '' || isNullOrUndefined(args.value)) {
            return;
        }
        const option: { type?: string } = {};
        const format: string = (args.cell && args.cell.format) || '';
        let type: string = args.type || (format && isCustomDateTime(format, true, option, true) ? option.type : '');
        const intl: Internationalization = new Internationalization();
        const beforeText: string = args.value;
        const date: string = args.showFormattedText && (format === 'dd-MM-yyyy' || format === 'dd/MM/yyyy') ? format :
            getFormatFromType('ShortDate');
        let time: string = getFormatFromType('Time');
        if (time === 'h:mm:ss AM/PM') {
            time = 'h:mm:ss a';
        }
        const timeFormat: string = format.toLowerCase();
        const parseOtherCultureNumber: Function = (): void => {
            if (this.localeObj.decimal !== '.' && args.value) {
                args.value = args.value.toString();
                if (isNumber(args.value) && args.value.includes('.')) {
                    args.value = args.value.replace('.', this.localeObj.decimal);
                }
            }
        };
        if (type === 'time' && timeFormat.includes('m') && !timeFormat.includes(':m') && !timeFormat.includes('m:') &&
            !timeFormat.includes('[m') && !timeFormat.includes('am')) {
            type = 'date';
        }
        if (type === 'date') {
            const val: string = args.value.toString();
            args.value = this.shortDateFormat({ type: type, value: args.value, format: date }, intl, args.cell);
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

    private getMatchingCustomFormat(format: string): string {
        if (format === '#,##0_);(#,##0)' && defaultFormats.has(37)) {
            return defaultFormats.get(37);
        } else if (format ===  '#,##0_);[Red](#,##0)' && defaultFormats.has(38)) {
            return defaultFormats.get(38);
        } else if (format ===  '#,##0.00_);(#,##0.00)' && defaultFormats.has(39)) {
            return defaultFormats.get(39);
        } else if (format === '#,##0.00_);[Red](#,##0.00)' && defaultFormats.has(40)) {
            return defaultFormats.get(40);
        } else if (format === 'd-mmm-yy' && defaultFormats.has(15)) {
            return defaultFormats.get(15);
        } else if (format === 'd-mmm' && defaultFormats.has(16)) {
            return defaultFormats.get(16);
        } else if (format === 'mmm-yy' && defaultFormats.has(17)) {
            return defaultFormats.get(17);
        } else if (format === 'h:mm AM/PM' && defaultFormats.has(18)) {
            return defaultFormats.get(18);
        } else if (format === 'h:mm:ss AM/PM' && defaultFormats.has(19)) {
            return defaultFormats.get(19);
        } else if (format === 'h:mm' && defaultFormats.has(20)) {
            return defaultFormats.get(20);
        } else if (format === 'h:mm:ss' && defaultFormats.has(21)) {
            return defaultFormats.get(21);
        } else if (format === 'm/d/yyyy h:mm' && defaultFormats.has(22)) {
            return defaultFormats.get(22);
        } else if (format === 'mm:ss' && defaultFormats.has(45)) {
            return defaultFormats.get(45);
        } else {
            return format;
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
        this.parent.on(checkNumberFormat, this.updateAutoDetectNumberFormat, this);
        this.parent.on(parseDecimalNumber, this.parseDecimalNumber, this);
        this.parent.on(localizedFormatAction, this.localizedFormatAction, this);
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
            this.parent.off(checkNumberFormat, this.updateAutoDetectNumberFormat);
            this.parent.off(parseDecimalNumber, this.parseDecimalNumber);
            this.parent.off(localizedFormatAction, this.localizedFormatAction);
        }
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        if (defaultFormats && !(this.parent as unknown as { refreshing?: boolean }).refreshing) {
            defaultFormats.clear();
            defaultFormats = null;
        }
        numberFormatsCode = this.parent = this.localeObj = this.customFormats = this.localizedFormats = null;
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

let defaultFormats: Map<number, string>;
let numberFormatsCode: { currency: string[], accounting: string[], time: string };

/**
 * Retrieves the built-in format code based on the specified number format type in either localized or non-localized format.
 *
 * @param {string} type - Specifies the type of number formatting.
 * @returns {string} - The built-in format code for the specified number format type.
 */
export function getFormatFromType(type: NumberFormatType): string {
    const formatType: string = type.split(' ').join('');
    if (!numberFormatsCode) {
        switch (formatType) {
        case 'Currency':
            return '$#,##0.00';
        case 'Accounting':
            return '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        case 'Time':
            return 'h:mm:ss AM/PM';
        default:
            return 'General';
        }
    }
    const getDefaultFormat: (format: string, id: number) => string = (format: string, id: number): string => {
        return defaultFormats && defaultFormats.has(id) ? defaultFormats.get(id) : format;
    };
    let code: string = 'General';
    switch (formatType) {
    case 'Number':
        code = getDefaultFormat('0.00', 2);
        break;
    case 'Currency':
        code = numberFormatsCode.currency[0];
        break;
    case 'Accounting':
        code = numberFormatsCode.accounting[2];
        break;
    case 'ShortDate':
        code = getDefaultFormat('m/d/yyyy', 14);
        break;
    case 'LongDate':
        code = 'dddd, mmmm dd, yyyy';
        break;
    case 'Time':
        code = numberFormatsCode.time;
        break;
    case 'Percentage':
        code = getDefaultFormat('0.00%', 10);
        break;
    case 'Fraction':
        code = getDefaultFormat('# ?/?', 12);
        break;
    case 'Scientific':
        code = getDefaultFormat('0.00E+00', 11);
        break;
    case 'Text':
        code = getDefaultFormat('@', 49);
        break;
    case 'CurrencyWithColorCode':
        code = numberFormatsCode.currency[5];
        break;
    }
    return code;
}

/**
 * @hidden
 * @param {string} format -  Specidfies the format.
 * @param {boolean} isRibbonUpdate - Specifies where we are updating the type in the number format button.
 * @returns {string} - To get type from format.
 */
export function getTypeFromFormat(format: string, isRibbonUpdate?: boolean): string {
    let code: string = 'General';
    switch (format) {
    case '0':
    case '0.00':
    case '#,##0':
    case '#,##0.00':
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
    case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
    case '_ $ * #,##0.00_ ;_ $ * -#,##0.00_ ;_ $ * "-"??_ ;_ @_ ':
    case '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)':
        code = 'Accounting';
        break;
    case 'mm-dd-yyyy':
    case 'm/d/yyyy':
    case 'dd/MM/yyyy':
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
            if (!numberFormatsCode) {
                break;
            }
            if (format === numberFormatsCode.time) {
                code = 'Time';
            } else if (numberFormatsCode.currency.indexOf(format) > -1) {
                code = 'Currency';
            } else if (numberFormatsCode.accounting.indexOf(format) > -1) {
                if (isRibbonUpdate) {
                    code = 'Accounting';
                }
            } else if (format.includes('?/?')) {
                code = 'Fraction';
            }
            if (defaultFormats && code === 'General' && isRibbonUpdate) {
                const isDefaultFormat: (id: number[]) => boolean = (ids: number[]): boolean => {
                    return ids.some((id: number) => defaultFormats.has(id) && defaultFormats.get(id) === format);
                };
                if (isDefaultFormat([1, 2, 3, 4])) {
                    code = 'Number';
                } else if (isDefaultFormat([14])) {
                    code = 'ShortDate';
                } else if (isDefaultFormat([9, 10])) {
                    code = 'Percentage';
                } else if (isDefaultFormat([11])) {
                    code = 'Scientific';
                } else if (isDefaultFormat([49])) {
                    code = 'Text';
                }
            }
            isRibbonUpdate = false;
        }
        break;
    }
    if (isRibbonUpdate && numberFormatsCode && ((code === 'Currency' && numberFormatsCode.currency[0] !== '$#,##0.00') ||
        (code === 'Accounting' && numberFormatsCode.accounting[2] !== '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)'))) {
        code = 'General';
    }
    return code;
}

/**
 * This method converts a culture-specific format code, which may include localized decimal separators, group separators, and
 * currency symbols, to a default culture (en-US) format code. The default format uses a default decimal separator (.),
 * group separators (,), and a currency symbol.
 *
 * @param {Workbook} context - Specifies the workbook instance containing the format code to be converted.
 * @param {string} format - The culture-specific format code, with localized decimal separators, group separators, and currency symbols,
 * that needs to be converted to the default format.
 * @returns {string} - Returns the default culture (en-US) format code, using the default decimal separator (.), group separators (,), and
 * currency symbol.
 */
export function convertToDefaultFormat(context: Workbook, format: string): string {
    const eventArgs: LocalizedFormatActionArgs = { action: 'parseToDefaultFormat', format: format };
    context.notify(localizedFormatAction, eventArgs);
    return eventArgs.format;
}

/**
 * Specifies the number format ID and their number format code.
 */
export interface FormatOption {
    /** The Excel default number format ID. */
    id: number;
    /** The number format code associated with the ID. */
    code: string;
}

/**
 * Populates culture-based number formats in the custom format dialog. By default, the decimal separator, group separator, and
 * currency symbol are updated based on the current culture. Currency and date formats can vary across cultures.
 * Excel maintains a default number format ID for each format code in the custom format dialog. This method maps these culture-based
 * format codes to their corresponding number format IDs, and the mapped formats will be populated in the custom format dialog.
 *
 * @param {Workbook} context - Specifies the workbook instance. If the component is not initialized, pass null for this parameter.
 * @param {FormatOption[]} formatOptions - Specifies the collection of number format IDs and their corresponding format codes.
 * @param {boolean} [clearMappedFormats] - Specifies whether to clear existing mapped formats or not. By default, this is set to true.
 * @returns {void}
 */
export function configureLocalizedFormat(context: Workbook, formatOptions: FormatOption[], clearMappedFormats: boolean = true): void {
    if (clearMappedFormats && defaultFormats) {
        defaultFormats.clear();
        defaultFormats = null;
    }
    if (formatOptions && formatOptions.length) {
        if (!defaultFormats) {
            defaultFormats = new Map<number, string>();
        }
        formatOptions.forEach((format: { id: number, code: string }) => {
            defaultFormats.set(format.id, format.code);
        });
    }
    if (context) {
        context.notify(localizedFormatAction, <LocalizedFormatActionArgs>{ action: 'mapNumberFormatId' });
    }
}
