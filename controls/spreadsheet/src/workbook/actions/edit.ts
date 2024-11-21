import { Workbook, SheetModel, CellModel, getCell, getSheet } from '../base/index';
import { workbookEditOperation, checkDateFormat, workbookFormulaOperation, refreshChart, checkUniqueRange, getFormattedCellObject, checkNumberFormat } from '../common/event';
import { getRangeIndexes, parseIntValue, setLinkModel, getCellAddress, isNumber, NumberFormatArgs, LocaleNumericSettings } from '../common/index';
import { defaultCurrencyCode, getNumberDependable, getNumericObject, Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
import { checkIsFormula, DateFormatCheckArgs } from '../../workbook/common/index';
import { getFormatFromType, getTypeFromFormat } from '../integrations/index';

/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
export class WorkbookEdit {
    private parent: Workbook;

    /**
     * Constructor for edit module in Workbook.
     *
     * @private
     * @param {Workbook} workbook - Specifies the workbook.
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.addEventListener();
    }

    /**
     * To destroy the edit module.
     *
     * @returns {void} - destroy the edit module
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(workbookEditOperation, this.performEditOperation, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookEditOperation, this.performEditOperation);
        }
    }

    /**
     * Get the module name.
     *
     * @returns {string} - string
     * @private
     */
    public getModuleName(): string {
        return 'workbookEdit';
    }

    private performEditOperation(args: { [key: string]: Object }): void {
        const action: string = <string>args.action;
        switch (action) {
        case 'updateCellValue':
            args.isFormulaDependent = this.updateCellValue(
                <string>args.address, <string>args.value, <number>args.sheetIndex, <boolean>args.isValueOnly,
                <boolean>args.skipFormatCheck, <boolean>args.isRandomFormula, <boolean>args.skipCellFormat,
                <boolean>args.isDelete, <number[]>args.deletedRange);
            break;
        }
    }

    private updateCellValue(
        address: string | number[], value: string, sheetIdx?: number, isValueOnly?: boolean, skipFormatCheck?: boolean,
        isRandomFormula?: boolean, skipCellFormat?: boolean, isDelete?: boolean, deletedRange?: number[]): boolean {
        if (sheetIdx === undefined) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        let range: number[]; let isFormulaDependent: boolean;
        if (typeof address === 'string') {
            range = getRangeIndexes(address);
        } else {
            range = address;
        }
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        let cell: CellModel = getCell(range[0], range[1], sheet, true);
        if (!cell) {
            cell = sheet.rows[range[0]].cells[range[1]] = {};
        }
        if (!isValueOnly) {
            let isFormula: boolean = checkIsFormula(value);
            isFormula = value === '#SPILL!' ? true : isFormula;
            let skipFormula: boolean = false; // for unique formula
            if (cell.formula && cell.formula.indexOf('UNIQUE') > - 1 && value === '') {
                skipFormula = true;
            }
            const isNotTextFormat: boolean = getTypeFromFormat(cell.format) !== 'Text' && (!isFormula ||
                !value.toLowerCase().startsWith('=text('));
            isFormula = getTypeFromFormat(cell.format) === 'Text' ? false : isFormula;
            if (!isFormula && !skipFormula) {
                if (cell.formula) {
                    cell.formula = '';
                }
                cell.value = isNotTextFormat ? <string>parseIntValue(value) : value;
            }
            const eventArgs: { [key: string]: string | number | boolean | number[] } = {
                action: 'refreshCalculate',
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                isFormula: isFormula,
                isRandomFormula: isRandomFormula,
                isDelete: isDelete,
                deletedRange: deletedRange
            };
            if (isNotTextFormat && !skipFormatCheck) {
                const dateEventArgs: DateFormatCheckArgs = {
                    value: value,
                    rowIndex: range[0],
                    colIndex: range[1],
                    sheetIndex: sheetIdx,
                    updatedVal: '',
                    skipCellFormat: skipCellFormat
                };
                if (!isFormula) {
                    this.parent.notify(checkDateFormat, dateEventArgs);
                    if (!isNullOrUndefined(dateEventArgs.updatedVal) && (dateEventArgs.updatedVal as string).length > 0) {
                        cell.value = <string>dateEventArgs.updatedVal;
                    } else if (this.parent.isEdit && value && !isNumber(value)) {
                        if (cell.format) {
                            const evtArgs: NumberFormatArgs = {
                                value: cell.value, format: cell.format, formattedText: cell.value,
                                type: 'General', cell: cell, rowIndex: range[0], colIndex: range[1], refresh: true, isEdit: true
                            };
                            this.parent.notify(getFormattedCellObject, evtArgs);
                        } else {
                            const curSymbol: string = getNumberDependable(this.parent.locale, defaultCurrencyCode);
                            if (value.includes(curSymbol) || value.includes('%') ||
                                value.includes((<LocaleNumericSettings>getNumericObject(this.parent.locale)).group)) {
                                const intl: Internationalization = new Internationalization();
                                const eventArgs: DateFormatCheckArgs = {
                                    intl: intl, updateValue: true, value: '', curSymbol: curSymbol,
                                    cell: cell
                                };
                                this.parent.notify(checkNumberFormat, {
                                    args: eventArgs, intl: intl, fResult: value,
                                    cell: cell
                                });
                            }
                        }
                    }
                } else if (!isNullOrUndefined(value) && value.toLowerCase().includes('unique(') && (value as string).length > 0) {
                    cell.value = <string>value;
                }
            }
            if (value === '#SPILL!') {
                cell.value = value;
            } else {
                const args: { cellIdx: number[], isUnique: boolean } = { cellIdx: range, isUnique: false };
                this.parent.notify(checkUniqueRange, args);
                if (!skipFormula && !isDelete) {
                    this.parent.notify(workbookFormulaOperation, eventArgs);
                    isFormulaDependent = <boolean>eventArgs.isFormulaDependent;
                } else {
                    value = cell.value;
                }
                if (isFormula) {
                    cell.formula = <string>eventArgs.value;
                    value = cell.value;
                    const formula: string = cell.formula.toLowerCase();
                    if (formula === '=now()' && (!cell.format || cell.format === 'General')) {
                        cell.format = `${getFormatFromType('ShortDate')} h:mm`;
                    } else if (formula.includes('=time(') && !cell.format) {
                        cell.format = 'h:mm AM/PM';
                    }
                } else if (cell.value && typeof cell.value === 'string' && (cell.value.indexOf('www.') === 0 ||
                    cell.value.indexOf('https://') === 0 || cell.value.indexOf('http://') === 0 || cell.value.indexOf('ftp://') === 0)) {
                    this.parent.notify(
                        setLinkModel, { hyperlink: cell.value, cell: `${sheet.name}!${getCellAddress(range[0], range[1])}` });
                }
            }
        } else {
            cell.value = value;
            if (cell.formattedText) {
                delete cell.formattedText;
            }
        }
        this.parent.setUsedRange(range[0], range[1], sheet);
        if (this.parent.chartColl.length && !this.parent.isEdit && !isRandomFormula) {
            this.parent.notify(refreshChart, {cell: cell, rIdx: range[0], cIdx: range[1], sheetIdx: sheetIdx });
        }
        return isFormulaDependent;
    }
}
