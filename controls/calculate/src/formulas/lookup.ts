import { FormulasErrorsStrings, CommonErrors, IBasicFormula, getSkeletonVal } from '../common/index';
import { getAlphalabel, CalcSheetFamilyItem } from '../base/index';
import { isNullOrUndefined, Internationalization } from '@syncfusion/ej2-base';
import { dateToInt, isNumber } from '../common/number-date';
import { getCellAddress, getRangeIndexes } from '../common/address';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Vertical and horizontal table lookups (VLOOKUP, HLOOKUP) and reference indexing.
 *
 * Registers 9 functions including CHOOSE, INDEX, MATCH, LOOKUP, VLOOKUP, and others.
 *
 * @hidden
 */
export class LookupFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'CHOOSE', category: 'Lookup & Reference', description: 'Returns a value from a list, given an index number.', syntax: 'CHOOSE(index_num, value1, [value2], ...)' },
        { formulaName: 'INDEX', category: 'Lookup & Reference', description: 'Returns a value from a table, given a row and column number.', syntax: 'INDEX(array, row_num, [column_num], [area_num])' },
        { formulaName: 'MATCH', category: 'Lookup & Reference', description: 'Returns the relative position of an checked item in range that matches a specified value in a specified order', syntax: 'MATCH(lookup_value, lookup_array, [match_type])' },
        { formulaName: 'LOOKUP', category: 'Lookup & Reference', description: 'Looks for a value in a one-row or one-column range, then returns a value from the same position in a second one-row or one-column range.', syntax: 'LOOKUP(lookup_value, lookup_vector, [result_vector])' },
        { formulaName: 'VLOOKUP', category: 'Lookup & Reference', description: 'Looks for a specific value in the first column of a lookup range and returns a corresponding value from a different column within the same row.', syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])' },
        { formulaName: 'HLOOKUP', category: 'Lookup & Reference', description: 'Looks for a value in the top row of the array of values and then returns a value in the same column from a row in the array that you specify.', syntax: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])' },
        { formulaName: 'ADDRESS', category: 'Lookup & Reference', description: 'Returns a cell reference as text, given specified row and column numbers.', syntax: 'ADDRESS(row_num, column_num, [abs_num], [a1], [sheet_text])' },
        { formulaName: 'SUBTOTAL', category: 'Lookup & Reference', description: 'Returns a subtotal in a list or database.', syntax: 'SUBTOTAL(function_num, ref1, [ref2], ...)' },
        { formulaName: 'TEXT', category: 'Lookup & Reference', description: 'Converts a value to text in specified number format.', syntax: 'TEXT(value, format_text)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns a value from a list, given an index number.
     *
     * Excel: `CHOOSE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=CHOOSE(1)');
     * ```
     */
    public ComputeCHOOSE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const errCollection: string[] = this.parent.getErrorStrings();
        const processArgs: Function = (actuaValue: string): string => {
            actuaValue = this.parent.getValueFromArg(actuaValue);
            if (actuaValue.toUpperCase() === this.parent.trueValue) {
                actuaValue = '1';
            } else if (actuaValue.toUpperCase() === this.parent.falseValue) {
                actuaValue = '0';
            }
            return actuaValue;
        };
        let getIndexValue: string | number;
        getIndexValue = processArgs(args[0]) as string;
        if (errCollection.indexOf(getIndexValue) > -1) {
            return getIndexValue;
        }
        if (this.parent.isCellReference(args[0])) {
            if (args[0].indexOf(':') > -1) {
                return errCollection[CommonErrors.Value];
            }
        } else {
            getIndexValue = this.parent.removeTics(getIndexValue);
            if (getIndexValue.split('%').length === 2 && this.parent.isNumber(getIndexValue.split('%')[0])) {
                getIndexValue = (Number(getIndexValue.split('%')[0]) * 0.01).toString();
            }
        }
        getIndexValue =  Math.floor(this.parent.parseFloat(getIndexValue));
        if (getIndexValue < 1 || isNaN(getIndexValue) || isNullOrUndefined(args[getIndexValue as number])) {
            return errCollection[CommonErrors.Value];
        }
        getIndexValue = args[getIndexValue as number];
        if (getIndexValue === '') {
            getIndexValue = '0';
        }
        if (this.parent.isCellReference(getIndexValue)) {
            if (getIndexValue.indexOf(':') > -1) {
                return errCollection[CommonErrors.Value];
            }
            return this.parent.getValueFromArg(getIndexValue);
        } else {
            if (getIndexValue.indexOf(this.parent.tic) > -1 && (errCollection.indexOf(getIndexValue.split(this.parent.tic).join('')) > -1 ||
                (this.parent.removeTics(getIndexValue).match(/^(\d*\.\d+|\d+)\s*[-*/]\s*(\d*\.\d+|\d+)$/)))) {
                getIndexValue = this.parent.removeTics(getIndexValue);
            }
            getIndexValue = this.parent.removeTics(this.parent.getValueFromArg(getIndexValue));
            if (getIndexValue.indexOf(this.parent.tic + this.parent.tic) > -1) {
                return getIndexValue.replace(/""/g, this.parent.tic);
            }
            if (getIndexValue.split('%').length === 2 && this.parent.isNumber(getIndexValue.split('%')[0])) {
                getIndexValue = (Number(getIndexValue.split('%')[0]) * 0.01).toString();
            }
            return getIndexValue;
        }
    }

    /**
     * Returns a value from a table, given a row and column number.
     *
     * Excel: `INDEX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeINDEX(...args: string[]): string | number {
        let nestedFormula: boolean; let value: string;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length < 2 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0] === '' || args[3] === '' ||  (args[3] && (args[3] === '0' || args[3] === 'FALSE'))) {
            return errCollection[CommonErrors.Value];
        }
        let row: number; let col: number; let area: number;
        const processArgs: Function = (actualValue: string): string | number => {
            if (isNullOrUndefined(actualValue) || actualValue === '') {
                return 1;
            }
            let value: string | number = this.parent.getValueFromArg(actualValue as string);
            if (errCollection.indexOf(value) > -1) { return value; }
            if (value.toUpperCase() === this.parent.trueValue) {
                value = '1';
            } else if (value.toUpperCase() === this.parent.falseValue) {
                value = '0';
            }
            if ((value as string).indexOf(this.parent.tic) > -1) {
                value = this.parent.removeTics(value as string);
                if (actualValue.indexOf(this.parent.tic) === -1 || value.trim() === '') {
                    return errCollection[CommonErrors.Value];
                }
            }
            if ((value as string).split('%').length === 2 && this.parent.isNumber((value as string).split('%')[0])) {
                value = (Number((value as string).split('%')[0]) / 100).toString();
            }
            value = parseInt(Number(value).toString(), 10);
            if (isNaN(value) || value < 0) {
                return errCollection[CommonErrors.Value];
            } else if (value === 0) {
                value = 1;
            }
            return value;
        };
        if (args[3]) {
            area = processArgs(args[3]);
            if (errCollection.indexOf(area.toString()) > -1) { return area.toString(); }
        }
        if (args[0].startsWith(this.parent.tic) && args[0].endsWith(this.parent.tic)) {
            args[0] = args[0].substring(1, args[0].length - 1);
        }
        const rangeArr: string[] = args[0].split(this.parent.getParseArgumentSeparator());
        args[0] = rangeArr[area ? area - 1 : 0];
        if (!args[0]) {
            return errCollection[CommonErrors.Ref];
        }
        value = args[0];
        row = processArgs(args[1]);
        if (errCollection.indexOf(row.toString()) > -1) { return row.toString(); }
        col = processArgs(args[2]);
        if (errCollection.indexOf(col.toString()) > -1) { return col.toString(); }
        const i: number = value.indexOf(':');
        if (i === -1) {
            if (row > 1 || col > 1) {
                return errCollection[CommonErrors.Ref];
            }
            value = this.parent.isCellReference(value) ? this.parent.getValueFromArg(value) : value;
        } else {
            const startRow: number = this.parent.rowIndex(value.substring(0, i));
            const endRow: number = this.parent.rowIndex(value.substring(i + 1));
            const startCol: number = this.parent.colIndex(value.substring(0, i));
            const endCol: number = this.parent.colIndex(value.substring(i + 1));
            if (row > endRow - startRow + 1 || col > endCol - startCol + 1) {
                return errCollection[CommonErrors.Ref];
            }
            row = startRow + row - 1; col = startCol + col - 1;
            value = this.parent.getValueFromArg(
                this.getSheetReference(value) + this.parent.convertAlpha(col) + row
            );
        }
        if (value === '') { return 0; }
        if (nestedFormula && errCollection.indexOf(value) === -1 &&
            !this.parent.isNumber(value) && value !== this.parent.trueValue && value !== this.parent.falseValue) {
            return this.parent.tic + value + this.parent.tic;
        }
        return value;
    }

    /**
     * Returns the relative position of an checked item in range that matches a specified value in a specified order.
     *
     * Excel: `MATCH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMATCH(...args: string[]): string | number {
        const argArr: string[] = [...args];
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }

        // args[0] codes
        argArr[0] = this.parent.getValueFromArg(args[0]);
        let isStringValue: boolean = argArr[0].indexOf(this.parent.tic) > -1;
        argArr[0] = argArr[0].split(this.parent.tic).join('');
        if (errCollection.indexOf(argArr[0]) > -1) { return argArr[0]; }
        if (argArr[0] === '') { return errCollection[CommonErrors.NA]; }
        if (isNaN(Number(argArr[0]))) {
            isStringValue = true;
        }

        // args[2] codes
        let matchType: number;
        if (isNullOrUndefined(args[2])) {
            argArr[2] = '1';
        } else {
            argArr[2] = this.parent.getValueFromArg(argArr[2]);
            if ((argArr[2].indexOf(this.parent.tic) > -1) && isNaN(Number(argArr[2].split(this.parent.tic).join('')))) {
                return errCollection[CommonErrors.Value];
            }
            if (argArr[2].toUpperCase() === this.parent.trueValue) {
                argArr[2] = '1';
            } else if (argArr[2].toUpperCase() === this.parent.falseValue) {
                argArr[2] = '0';
            }
        }
        matchType = parseFloat(argArr[2]);
        if ([-1, 0, 1].indexOf(matchType) === -1) {
            matchType = 0;
        }

        // args[1] codes
        const valueCollection: string[] = []; let isStringCollection: boolean = false; let grid: Object = this.parent.grid;
        const curGrid: Object = this.parent.grid;
        let isWildCardVal: boolean;
        if (argArr[1].indexOf(':') > -1 || this.parent.isCellReference(argArr[1])) {
            const cellIdxs: number[] = getRangeIndexes(argArr[1]);
            const startRow: number = cellIdxs[0]; const startCol: number = cellIdxs[1];
            let endRow: number = cellIdxs[2]; let endCol: number = cellIdxs[3];
            if (startRow >= 1048576 || endRow >= 1048576 || startCol >= 16384 || endCol >= 16384) {
                return errCollection[CommonErrors.Name];
            }
            if (startRow !== endRow && startCol !== endCol) {
                return errCollection[CommonErrors.NA];
            }
            let sheetToken: string = '';
            const family: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(grid);
            if (argArr[1].startsWith('!')) {
                sheetToken = argArr[1].substring(0, argArr[1].replace('!', '').indexOf('!') + 2);
                if (family.tokenToParentObject !== null) {
                    grid = family.tokenToParentObject.get(sheetToken);
                }
            } else if (family.parentObjectToToken !== null) {
                sheetToken = family.parentObjectToToken.get(grid);
            }
            const sheetId: number = this.parent.getSheetId(grid);
            const getCellValue: (row: number, col: number, curCell: string) => string =
                this.parent.getCellValueFn(grid, this.parent.cell, sheetId, true);
            let j: number = 0; let cellValue: string;
            let performAction: Function; let result: number;
            if (matchType === 0) {
                isWildCardVal = argArr[0].indexOf('*') > -1 || argArr[0].indexOf('?') > -1;
                performAction = (): void => {
                    if (isWildCardVal) {
                        cellValue = this.parent.findWildCardValue(argArr[0], cellValue);
                    }
                    if (argArr[0] === cellValue) {
                        endCol = -2;
                        endRow = -2;
                        result = j + 1;
                        return;
                    }
                    j++;
                };
            } else {
                performAction = (): void => {
                    valueCollection[j as number] = cellValue;
                    j++;
                };
            }
            for (let r: number = startRow; r <= endRow; r++) {
                for (let c: number = startCol; c <= endCol; c++) {
                    cellValue = getCellValue(r + 1, c + 1, getCellAddress(r, c));
                    if (!isStringCollection && isNaN(Number(cellValue))) {
                        isStringCollection = true;
                    }
                    performAction();
                }
            }
            if (result) {
                this.parent.grid = curGrid;
                return result;
            }
            if (isStringValue !== isStringCollection) {
                this.parent.grid = curGrid;
                return errCollection[CommonErrors.NA];
            }
        } else if (!isNullOrUndefined(argArr[1]) && argArr[1].includes(this.parent.tic + this.parent.tic)) {
            const criterias: string[] = argArr[1].split(this.parent.tic + this.parent.tic);
            criterias.forEach((criteria: string) => {
                criteria = criteria.trim().split(this.parent.tic).join('');
                if (criteria) {
                    valueCollection.push(criteria);
                }
            });
        }
        let index: number = 0;
        let indexVal: string = '';
        let isIndexFound: boolean = false;
        let matchValue: string | number = !isNaN(Number(argArr[0])) ? Number(argArr[0]) : argArr[0];
        for (let i: number = 0; i < valueCollection.length; i++) {
            if (valueCollection[i as number] === '') {
                if (i === (valueCollection.length - 1)) {
                    valueCollection.pop();
                }
                continue;
            } else if (matchType === -1 && (isStringValue || isStringCollection)) {
                break;
            }
            const matchCollectionValue: string | number = !isNaN(Number(valueCollection[i as number])) ?
                Number(valueCollection[i as number]) : valueCollection[i as number];
            if (matchType === 1) {
                if (matchValue === matchCollectionValue) {
                    index = i + 1;
                    isIndexFound = true;
                    if (isNaN(Number(argArr[0]))) {
                        isStringValue = false;
                    }
                } else if ((matchValue > matchCollectionValue) && !isStringValue && !isIndexFound) {
                    if (!indexVal || (matchCollectionValue > (!isNaN(Number(indexVal)) ? Number(indexVal) : indexVal))) {
                        index = i + 1;
                        indexVal = valueCollection[i as number];
                    }
                }
            } else if (matchType === 0) {
                if (isWildCardVal) {
                    valueCollection[i as number] = this.parent.findWildCardValue(argArr[0], valueCollection[i as number]);
                }
                if (argArr[0] === valueCollection[i as number]) {
                    return i + 1;
                }
            } else if (matchType === -1) {
                if ((Number(valueCollection[i as number]) > Number(valueCollection[(i as number) + 1]))
                    || i === valueCollection.length - 1) {
                    if (matchValue === matchCollectionValue) {
                        index = i + 1;
                        matchValue = undefined;
                    } else if (matchValue < matchCollectionValue) {
                        if (!indexVal || (matchCollectionValue < (!isNaN(Number(indexVal)) ? Number(indexVal) : indexVal))) {
                            index = i + 1;
                            indexVal = valueCollection[i as number];
                        }
                    }
                } else {
                    this.parent.grid = curGrid;
                    return errCollection[CommonErrors.NA];
                }
            }
        }
        if (isStringValue && isStringCollection && matchType === 1) {
            index = valueCollection.length;
        }
        this.parent.grid = curGrid;
        return index ? index : errCollection[CommonErrors.NA];
    }

    /**
     * Looks for a value in a one-row or one-column range, then returns a value from the same position in a second one-row or one-column range.
     *
     * Excel: `LOOKUP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLOOKUP(...args: string[]): string | number {
        const argArr: string[] = args;
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.computeLookup(argArr);
    }

    /**
     * Looks for a specific value in the first column of a lookup range and returns a corresponding value from a different column within the same row.
     *
     * Excel: `VLOOKUP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVLOOKUP(...args: string[]): string | number {
        const argArr: string[] = args;
        return this.parent.computeVHLookup(argArr, true);
    }

    /**
     * Looks for a value in the top row of the array of values and then returns a value in the same column from a row in the array that you specify.
     *
     * Excel: `HLOOKUP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeHLOOKUP(...args: string[]): string | number {
        const argArr: string[] = args;
        return this.parent.computeVHLookup(argArr);
    }

    /**
     * Returns a cell reference as text, given specified row and column numbers.
     *
     * Excel: `ADDRESS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeADDRESS(...args: string[]): string | number  {
        let value: string; const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0].trim() === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length < 2 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (args[0].split(this.parent.tic).join('').trim() === '' || args[1].split(this.parent.tic).join('').trim() === '') {
            return errCollection[CommonErrors.Value];
        }
        const processArgs: Function = (actualValue: string): string => {
            let value: string = this.parent.getValueFromArg(actualValue).trim();
            if (errCollection.indexOf(value) > -1) { return value; }
            if (value.toUpperCase() === this.parent.trueValue) {
                value = '1';
            } else if (value.toUpperCase() === this.parent.falseValue) {
                value = '0';
            }
            if (this.parent.isCellReference(actualValue) && value.indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            }
            value = this.parent.removeTics(value);
            if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
                value = (Number(value.split('%')[0]) / 100).toString();
            }
            return value;
        };
        /* For argArr[0] */
        let rowIndex: string | number = processArgs(args[0], 0);
        if (errCollection.indexOf(rowIndex as string) > -1) { return rowIndex; }
        rowIndex = Number(rowIndex);
        if (isNaN(rowIndex) || rowIndex < 1) {
            return errCollection[CommonErrors.Value];
        } else {
            rowIndex = rowIndex.toString();
        }
        /* For argArr[1] */
        let colIndex: string | number = processArgs(args[1], 1);
        if (errCollection.indexOf(colIndex as string) > -1) { return colIndex; }
        colIndex = Number(colIndex);
        if (isNaN(colIndex) || colIndex < 1) {
            return errCollection[CommonErrors.Value];
        } else {
            colIndex = colIndex.toString();
        }
        /* For argArr[2] */
        let absIndex: string | number; let refStyle: string;
        if (isNullOrUndefined(args[2]) || args[2].trim() === '') {
            absIndex = '1';
        } else {
            absIndex = processArgs(args[2], 2);
            if (errCollection.indexOf(absIndex as string) > -1) { return absIndex; }
            absIndex = Number(absIndex);
            if (isNaN(absIndex) || absIndex < 1 || absIndex > 4) {
                return errCollection[CommonErrors.Value];
            } else {
                absIndex = absIndex.toString();
            }
        }
        if (isNullOrUndefined(args[3]) || args[3].trim() === '') {
            refStyle = '1';
        } else {
            refStyle = processArgs(args[3], 3);
            if (errCollection.indexOf(refStyle) > -1) { return refStyle; }
            if (refStyle.toUpperCase() === this.parent.trueValue || Number(refStyle) > 1) {
                refStyle = '1';
            } else if (refStyle === '' || refStyle.toUpperCase() === this.parent.falseValue) {
                refStyle = '0';
            }
        }
        if (refStyle === '1') {
            if (absIndex === '1') {
                value = '$' + getAlphalabel(parseInt(colIndex, 10)) + '$' + parseInt(rowIndex, 10);
            } else if (absIndex === '2') {
                value = getAlphalabel(parseInt(colIndex, 10)) + '$' + parseInt(rowIndex, 10);
            } else if (absIndex === '3') {
                value = '$' + getAlphalabel(parseInt(colIndex, 10)) + parseInt(rowIndex, 10);
            } else if (absIndex === '4') {
                value = getAlphalabel(parseInt(colIndex, 10)) + parseInt(rowIndex, 10);
            }
        } else if (refStyle === '0') {
            if (absIndex === '1') {
                value = 'R' + parseInt(rowIndex, 10) + 'C' + parseInt(colIndex, 10);
            } else if (absIndex === '2') {
                value = 'R' + parseInt(rowIndex, 10) + 'C[' + parseInt(colIndex, 10) + ']';
            } else if (absIndex === '3') {
                value = 'R[' + parseInt(rowIndex, 10) + ']C' + parseInt(colIndex, 10);
            } else if (absIndex === '4') {
                value = 'R[' + parseInt(rowIndex, 10) + ']C[' + parseInt(colIndex, 10) + ']';
            }
        } else {
            return errCollection[CommonErrors.Name];
        }
        let val: string;
        if (!isNullOrUndefined(args[4]) && args[4] !== '') {
            val = this.parent.getValueFromArg(args[4]).split(this.parent.tic).join('');
            if (errCollection.indexOf(val) > -1) { return val; }
        }
        if (!isNullOrUndefined(val)) {
            value = val + '!' + value;
        }
        return value;
    }

    /**
     * Returns a subtotal in a list or database.
     *
     * Excel: `SUBTOTAL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUBTOTAL(...args: string[]): string | number {
        let value: string | number;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === ''))  {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        value = this.parent.getValueFromArg(args[0]).trim();
        if (errCollection.indexOf(value) > -1) { return value; }
        if (value.split(this.parent.tic).join('').trim() === '') {
            return errCollection[CommonErrors.Value];
        }
        if (!this.parent.isCellReference(args[0])) {
            value = this.parent.removeTics(value);
        }
        if (value.toUpperCase() === this.parent.trueValue) {
            value = '1';
        } else if (value.toUpperCase() === this.parent.falseValue) {
            value = '0';
        } else if (value.split('%').length === 2 && this.parent.isNumber(value.split('%')[0])) {
            value = (Number(value.split('%')[0]) / 100).toString();
        }
        value = this.parent.parseFloat(value);
        if (isNaN(value) || ((1 > value || value > 11) && (101 > value || value > 111))) {
            return errCollection[CommonErrors.Value];
        }
        const cellRef: string[] = args.slice(1, args.length);
        switch (value) {
        case 1:
        case 101:
            value = this.owner.ComputeAVERAGE(...cellRef, 'isSubtotal');
            break;
        case 2:
        case 102:
            value = this.owner.ComputeCOUNT(...cellRef, 'isSubtotal');
            break;
        case 3:
        case 103:
            value = this.owner.ComputeCOUNTA(...cellRef, 'isSubtotal');
            break;
        case 4:
        case 104:
            value = this.owner.ComputeMAX(...cellRef, 'isSubtotal');
            break;
        case 5:
        case 105:
            value = this.owner.ComputeMIN(...cellRef, 'isSubtotal');
            break;
        case 6:
        case 106:
            value = this.owner.ComputePRODUCT(...cellRef, 'isSubtotal');
            break;
        case 7:
        case 107:
            value = this.owner.ComputeDAY(...cellRef);
            break;
        case 8:
        case 108:
            value = this.owner.ComputeCONCAT(...cellRef);
            break;
        case 9:
        case 109:
            value = this.owner.ComputeSUM(...cellRef, 'isSubtotal');
            break;
        case 10:
        case 110:
            value = this.owner.ComputeAVERAGEA(...cellRef);
            break;
        case 11:
        case 111:
            value = this.owner.ComputeABS(...cellRef);
            break;
        default:
            value = errCollection[CommonErrors.Value];
            break;
        }
        return value;
    }

    /**
     * Converts a value to text in specified number format.
     *
     * Excel: `TEXT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTEXT(...args: string[]): string | number {
        let nestedFormula: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        const argsLength: number = args.length;
        const firstArg: string = args[0];
        const secondArg: string = args[1];
        if ( argsLength !== 2 ) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let s1: string = firstArg;
        let s2: string = secondArg;
        if (secondArg === '') {
            return this.parent.getValueFromArg(s1);
        }
        let dTime: Date | number = new Date(1900, 0, 1, 0, 0, 0);
        const checkString: string = s1 + ',' + s2;
        const intl: Internationalization = new Internationalization();
        if (this.parent.getErrorStrings().indexOf(checkString) > -1) {
            return checkString;
        }
        s1 = this.parent.getValueFromArg(s1);
        if (isNumber(s1.split(this.parent.tic).join(''))) {
            s1 = s1.split(this.parent.tic).join('');
        }
        if (secondArg.startsWith('"') && secondArg.endsWith('"')) {
            s2 = s2.split(this.parent.tic).join('');
        } else {
            s2 = this.parent.getValueFromArg(s2);
        }
        if (s2 === '') {
            return '';
        }
        if (s1 === '' && (s2.length > 0 && (s2.toUpperCase().indexOf('M') > -1 || s2.toUpperCase().indexOf('D') > -1
            || s2.toUpperCase().indexOf('Y') > -1 || s2.toUpperCase().indexOf('S') > -1 || s2.toUpperCase().indexOf('T') > -1)
            || s2.toUpperCase().indexOf('H') > -1)) {
            s1 = dTime.toString();
        }
        let d: number = this.parseDouble(s1);
        if (isNaN(d) && this.parent.isDate(new Date(s1)) !== null) {
            d = this.parent.toOADate(new Date(s1));
        }
        dTime = Date.parse(s1.split(this.parent.tic).join(''));
        if (!isNaN(d) || !isNaN(dTime)) {
            if (s2.length > 0 && s2.indexOf('#') === -1 && (s2.toUpperCase().indexOf('M') > -1 || s2.toUpperCase().indexOf('D') > -1
                || s2.toUpperCase().indexOf('Y') > -1 || s2.toUpperCase().indexOf('S') > -1 || s2.toUpperCase().indexOf('T') > -1)
                || s2.toUpperCase().indexOf('H') > -1) {
                s2 = s2.split('Y').join('y').split('D').join('d').split('H').join('h');
                s2 = s2.split('S').join('s').split('m').join('M').split('AM/PM').join('tt');
                const formatChar: string[] = s2.split('');
                let isH: boolean = false; let isMFound: boolean = false;
                let i: number = 0;
                // let mcount: number = 0;
                let lastCharIndex: number = 0; let totalCharforM: number = 0;
                for (i = 0; i < formatChar.length; ) {
                    const c: string = formatChar[i as number];
                    if (c === 's' && formatChar[lastCharIndex as number] === 'M') {
                        formatChar[lastCharIndex as number] = 'm';
                        if (formatChar[lastCharIndex - 1] === 'M') {
                            formatChar[lastCharIndex - 1] = 'm';
                        }
                    }
                    if (this.parent.isChar(c)) {
                        lastCharIndex = i;
                        if (c === 'M') {
                            // mcount++;
                            totalCharforM++;
                        }
                    } else if (totalCharforM > 1) {
                        totalCharforM++;
                    }
                    if (c === 'M' && isH) {
                        formatChar[i as number] = 'm';
                        isMFound = true;
                    }
                    if (c === 'h') {
                        isH = true;
                    } else if (this.parent.isChar(c) && c !== 'M' && c !== 'h' && !isMFound) {
                        isH = false;
                        isMFound = false;
                    }
                    i++;
                }
                s2 = String(formatChar);
                s2 = s2.split(',').join('').split('\n').join(' ');
                let dt: Date | number = this.parent.fromOADate(d);
                if (d === 0) {
                    dt = dTime;
                }
                const getSkeleton: string = getSkeletonVal(s2);
                if (getSkeleton === '') {
                    const date: number = dateToInt(dt);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dateString: string = (this.parent.parentObject as any).getDisplayText({format : s2, value: date});
                    return dateString;
                }
                const dFormatter: Function = intl.getDateFormat({ skeleton: getSkeleton, type: 'date' });
                const formattedString: string = dFormatter(dt);
                s1 = formattedString;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                s1 = (this.parent.parentObject as any).getDisplayText({ format: s2, value: d });
            }
        }
        return nestedFormula ? this.parent.tic + s1 + this.parent.tic : s1;
    }
}
