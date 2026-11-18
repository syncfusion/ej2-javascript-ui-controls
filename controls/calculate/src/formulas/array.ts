import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { getAlphalabel, CalcSheetFamilyItem } from '../base/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber } from '../common/number-date';
import { sortCollection } from '../common/sort';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Array formula helpers for dynamic spill-style range operations.
 *
 * Registered functions: UNIQUE, SORT.
 *
 * @hidden
 */
export class ArrayFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        {
            formulaName: 'UNIQUE', category: 'Lookup & Reference',
            description: 'Returns a unique values from a range or array.', syntax: 'UNIQUE(array, [by_col], [exactly_one])'
        },
        {
            formulaName: 'SORT', category: 'Lookup & Reference',
            description: 'Sorts a range of an array.', syntax: 'SORT(array, [sort_index], [sort_order], [by_col])'
        }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns a unique values from a range or array.
     *
     * Excel: `UNIQUE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=UNIQUE(1)');
     * ```
     */
    public ComputeUNIQUE(...args: string[]): number | string | number[] | string[] {
        let result: string; let isComputeExp: boolean;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (args[args.length - 1] === 'isComputeExp') {
            isComputeExp = true; args.pop();
        }
        if (isNullOrUndefined(args) || (args[0] === '' && args.length === 1)) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const processArgs: Function = (actualValue: string): string => {
            if (isNullOrUndefined(actualValue)) {
                return this.parent.falseValue;
            }
            let value: string = this.parent.getValueFromArg(actualValue);
            if (errCollection.indexOf(value) > -1) { return value; }
            if (Number(value) === 0) {
                return this.parent.falseValue;
            } else if (Number(value) < 0 || Number(value) > 0) {
                return this.parent.trueValue;
            }
            if (!this.parent.isCellReference(actualValue)) {
                value = this.parent.removeTics(value);
            }
            if (value.toUpperCase() === this.parent.trueValue || value.toUpperCase() === this.parent.falseValue) {
                return value.toUpperCase();
            } else if (value.indexOf(this.parent.tic) > -1 || actualValue.indexOf(this.parent.tic) > -1) {
                return errCollection[CommonErrors.Value];
            } else {
                return errCollection[CommonErrors.Name];
            }
        };
        const byColumn: string = processArgs(args[1]);
        if (errCollection.indexOf(byColumn) > -1) { return byColumn; }
        const exactlyOne: string = processArgs(args[2]);
        if (errCollection.indexOf(exactlyOne) > -1) { return exactlyOne; }
        const valueCollection: string[] = [];
        if (args[0].indexOf(':') > -1) {
            if (isNullOrUndefined(args[0].match(/[0-9]/))) {
                const splitArray: string[] = args[0].split(':');
                args[0] = splitArray[0] + '1' + ':' + splitArray[1] + (this.parent.spreadSheetUsedRange[0] + 1);
            } else if (isNullOrUndefined(args[0].toUpperCase().match(/[A-Z]/))) {
                const splitArray: string[] = args[0].split(':');
                args[0] = 'A' + splitArray[0] + ':' + getAlphalabel(this.parent.spreadSheetUsedRange[1] + 1) + splitArray[1];
            }
            const rangeSplit: string[] = args[0].split(':');
            if (this.parent.isCellReference(rangeSplit[0]) && this.parent.isCellReference(rangeSplit[1])) {
                const collection: string[] = this.parent.dependencyCollection;
                for (let i: number = 0; i < collection.length && !isComputeExp; i++) {
                    if (collection[i as number].split(':')[0] === args[0].split(':')[0]) {
                        this.clearDependency(collection[i as number]);
                    }
                }
                if (this.parent.dependencyCollection.indexOf(args[0]) === -1) {
                    if (!isComputeExp) {
                        this.parent.dependencyCollection.push(args[0]);
                    }
                } else { this.clearDependency(args[0]); }
                const j: number = args[0].indexOf(':'); let swap: number;
                let rowIdx: number = this.parent.rowIndex(this.parent.substring(args[0], 0, j));
                let colIdx: number = this.parent.colIndex(this.parent.substring(args[0], 0, j));
                let endRowIdx: number = this.parent.rowIndex(this.parent.substring(args[0], j + 1, j + args[0].length - j - 1));
                let endColIdx: number = this.parent.colIndex(this.parent.substring(args[0], j + 1, j + args[0].length - j - 1));
                if (rowIdx > endRowIdx) {
                    swap = endRowIdx; endRowIdx = rowIdx; rowIdx = swap;
                }
                if (colIdx > endColIdx) {
                    swap = endColIdx; endColIdx = colIdx; colIdx = swap;
                }
                let sheetIndex: string | number = '';
                if (args[0].indexOf('!') === 0) {
                    sheetIndex = args[0].substring(0, args[0].replace('!', '').indexOf('!') + 2);
                }
                args[0] = sheetIndex + getAlphalabel(colIdx) + rowIdx + ':' + getAlphalabel(endColIdx) + endRowIdx;
                const colDiff: number = endColIdx - colIdx;
                const cellValues: string[] = this.parent.getCellCollection(args[0]) as string[];
                let actCell: string; let uniqueActCell: string;
                actCell = uniqueActCell = this.parent.actCell;
                if (byColumn === this.parent.falseValue) {
                    if (colDiff === 0) {
                        for (let i: number = 0; i < cellValues.length; i++) {
                            let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                            val = val === '' ? '0' : val;
                            valueCollection.push(val);
                        }
                    } else {
                        let temp: string = ''; let diff: number = colDiff;
                        for (let i: number = 0; i < cellValues.length; i++) {
                            if (i === cellValues.length - 1) {
                                let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                                val = val === '' ? '0' : val;
                                temp = temp + val + '++';
                                valueCollection.push(temp.substring(0, temp.length - 2));
                            }
                            if (i <= diff) {
                                let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                                val = val === '' ? '0' : val;
                                temp = temp + val + '++';
                            } else {
                                valueCollection.push(temp.substring(0, temp.length - 2));
                                diff = colDiff + i;
                                let val: string = this.parent.getValueFromArg(cellValues[i as number]);
                                val = val === '' ? '0' : val;
                                temp = val + '++';
                            }
                        }
                    }
                } else {
                    let temp: string = ''; const diff: number = colDiff + 1; const rowDiff: number = endRowIdx - rowIdx;
                    for (let i: number = 0; i < diff; i++) {
                        for (let j: number = 0; j <= rowDiff; j++) {
                            let val: string = this.parent.getValueFromArg(cellValues[j * diff + i]);
                            val = val === '' ? '0' : val;
                            temp = temp + val + '++';
                        }
                        valueCollection.push(temp.substring(0, temp.length - 2));
                        temp = '';
                    }
                }
                const uniqueCollection: string[] = []; const duplicateCollection: string[] = [];
                let tmp: string[] = []; const tmp2: string[] = [];
                for (let i: number = 0; i < valueCollection.length; i++) {
                    if (uniqueCollection.indexOf(valueCollection[i as number].toLowerCase()) === -1) {
                        uniqueCollection.push(valueCollection[i as number].toLowerCase());
                        tmp.push(valueCollection[i as number]);
                    } else {
                        if (duplicateCollection.indexOf(valueCollection[i as number].toLowerCase()) === -1) {
                            duplicateCollection.push(valueCollection[i as number].toLowerCase());
                        }
                        tmp2.push(valueCollection[i as number]);
                    }
                }
                if (exactlyOne === this.parent.trueValue) {
                    const exactOne: string[] = [];
                    for (let i: number = 0; i < tmp.length; i++) {
                        if (duplicateCollection.indexOf(tmp[i as number].toLowerCase()) === -1) {
                            exactOne.push(tmp[i as number]);
                        }
                    }
                    tmp = exactOne;
                    if (tmp.length === 0) {
                        return errCollection[CommonErrors.Calc];
                    }
                }
                if (isComputeExp) {
                    let computeExpResult: string | number | string[] | number[];
                    if (colDiff !== 0) {
                        computeExpResult = [];
                        (tmp).forEach(function (item: string): void {
                            computeExpResult = [...(computeExpResult as string[]), ...item.split('++')];
                        });
                    } else {
                        computeExpResult = byColumn === this.parent.falseValue ? tmp : tmp[0].split('++');
                    }
                    return computeExpResult;
                }
                if (actCell.indexOf('!') > - 1) {
                    actCell = actCell.substring(actCell.lastIndexOf('!') + 1);
                }
                let actRowIdx: number = this.parent.rowIndex(actCell);
                let actColIdx: number = this.parent.colIndex(actCell);
                if (this.parent.dependencyLevel === 0) {
                    let isSpill: boolean = false;
                    if (byColumn === this.parent.falseValue) {
                        for (let i: number = actRowIdx, diff: number = tmp.length + actRowIdx; i < diff; i++) {
                            const splitValue: string[] = tmp[0].split('++');
                            for (let j: number = actColIdx, diff2: number = splitValue.length + actColIdx; j < diff2; j++) {
                                if (i === diff - 1 && j === diff2 - 1 &&
                                    this.parent.uniqueRange.indexOf(uniqueActCell + ':' + getAlphalabel(j) + i) === - 1) {
                                    this.parent.uniqueRange.push(uniqueActCell + ':' + getAlphalabel(j) + i);
                                }
                                if (this.checkSpill(j, i)) {
                                    isSpill = true;
                                }
                            }
                        }
                    } else {
                        for (let i: number = actColIdx, diff: number = tmp.length + actColIdx; i < diff; i++) {
                            const splitValue: string[] = tmp[0].split('++');
                            for (let j: number = actRowIdx, diff2: number = splitValue.length + actRowIdx; j < diff2; j++) {
                                if (i === diff - 1 && j === diff2 - 1 &&
                                    this.parent.uniqueRange.indexOf(this.parent.actCell + ':' + getAlphalabel(i) + j) === - 1) {
                                    this.parent.uniqueRange.push(this.parent.actCell + ':' + getAlphalabel(i) + j);
                                }
                                if (this.checkSpill(i, j)) {
                                    isSpill = true;
                                }
                            }
                        }
                    }
                    if (isSpill) {
                        return this.parent.formulaErrorStrings[FormulasErrorsStrings.Spill];
                    }
                } else if (this.parent.dependencyLevel > 0 &&
                    this.parent.getValueFromArg(getAlphalabel(actColIdx) + actRowIdx, true).indexOf('#SPILL!') > - 1) {
                    return this.parent.formulaErrorStrings[FormulasErrorsStrings.Spill];
                }
                if (byColumn === this.parent.falseValue) {
                    const calcFamily: CalcSheetFamilyItem = this.parent.getSheetFamilyItem(this.parent.grid);
                    let token: string = ''; let cellTxt: string;
                    if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
                        token = calcFamily.parentObjectToToken.get(this.parent.grid);
                        cellTxt = token + actCell;
                    }
                    for (let i: number = 0; i < tmp.length; i++) {
                        const splitValue: string[] = tmp[i as number].split('++');
                        if (i > 0) {
                            actRowIdx++;
                            actColIdx = this.parent.colIndex(actCell);
                        }
                        for (let j: number = 0; j < splitValue.length; j++) {
                            this.setValueRefresh(splitValue[j as number], actRowIdx, actColIdx);
                            if (i > 0 || j > 0) {
                                this.parent.refreshDependentCells(token + getAlphalabel(actColIdx) + actRowIdx.toString(), cellTxt);
                            }
                            if (splitValue[j + 1]) {
                                actColIdx++;
                            }
                        }
                    }
                    result = tmp[0].split('++')[0];
                } else {
                    for (let i: number = 0; i < tmp.length; i++) {
                        const splitValue: string[] = tmp[i as number].split('++');
                        for (let i: number = 0; i < splitValue.length; i++) {
                            this.setValueRefresh(splitValue[i as number], actRowIdx, actColIdx);
                            if (splitValue[i + 1]) {
                                actRowIdx++;
                            } else {
                                actColIdx++;
                                actRowIdx = this.parent.rowIndex(actCell);
                            }
                        }
                    }
                    result = tmp[0].split('++')[0];
                }
            }
        } else if (this.parent.isCellReference(args[0])) {
            if (this.parent.dependencyCollection.indexOf(args[0]) === -1) {
                if (!isComputeExp) {
                    this.parent.dependencyCollection.push(args[0]);
                }
            } else { this.clearDependency(args[0]); }
            result = this.parent.getValueFromArg(args[0]);
        } else {
            result = this.parent.getValueFromArg(args[0].trim());
            if (errCollection.indexOf(result) > -1) { return result; }
            result = this.parent.removeTics(result);
        }
        return result;
    }

    private setValueRefresh(splitValue: string, rowIdx: number, colIdx: number): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetId(this.parent.grid), splitValue, rowIdx, colIdx);
    }

    private checkSpill(i: number, j: number): boolean {
        let spill: boolean = false;
        const value: string = this.parent.getValueFromArg(getAlphalabel(i) + j, true);
        const formulaAddress: string = '!' + this.parent.getSheetID(this.parent.grid) + '!' + getAlphalabel(i) + j;
        let formulaString: string;
        if (this.parent.getFormulaInfoTable().get(formulaAddress)) {
            formulaString = this.parent.getFormulaInfoTable().get(formulaAddress).formulaText;
        }
        if (value && (value.toUpperCase().indexOf('UNIQUE') < 0 ||
            (formulaString && !formulaString.toUpperCase().includes('UNIQUE'))) &&
            (value.toUpperCase().indexOf('SORT') < 0 ||
                (formulaString && !formulaString.toUpperCase().includes('SORT'))) &&
            value !== this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments]) {
            spill = true;
        }
        return spill;
    }

    public clearDependency(value: string): void {
        let actCell: string = this.parent.actCell;
        let actCellSheetName: string = '';
        if (actCell.lastIndexOf('!') > - 1) {
            const actCellAddr: string = actCell;
            actCell = actCellAddr.substring(actCellAddr.lastIndexOf('!') + 1);
            actCellSheetName = actCellAddr.substring(0, actCellAddr.lastIndexOf('!')) + '!';
        }
        const actRowIdx: number = this.parent.rowIndex(actCell);
        const actColIdx: number = this.parent.colIndex(actCell);
        const j: number = value.indexOf(':');
        const rowIndex: number = this.parent.rowIndex(this.parent.substring(value, 0, j));
        const colIndex: number = this.parent.colIndex(this.parent.substring(value, 0, j));
        const eRowIdx: number = this.parent.rowIndex(this.parent.substring(value, j + 1, j + value.length - j - 1));
        const eColIdx: number = this.parent.colIndex(this.parent.substring(value, j + 1, j + value.length - j - 1));
        const rowDiff: number = eRowIdx - rowIndex + actRowIdx; const colDiff: number = eColIdx - colIndex + actColIdx;
        const formulaText: string = this.parent.getFormulaInfoTable().get('!' + this.parent.getSheetID(this.parent.grid) + '!' + actCell) ?
            this.parent.getFormulaInfoTable().get('!' + this.parent.getSheetID(this.parent.grid) + '!' + actCell).getFormulaText() : '';
        for (let i: number = actRowIdx; i <= rowDiff; i++) {
            for (let j: number = actColIdx; j <= colDiff; j++) {
                if (this.parent.dependencyLevel > 0 || formulaText.indexOf('UNIQUE') > -1
                    || formulaText.indexOf('SORT') > - 1) {
                    if (this.parent.getValueFromArg('!' + this.parent.getSheetID(this.parent.grid) + '!' +
                        getAlphalabel(actColIdx) + actRowIdx, true).indexOf('#SPILL!') > - 1) {
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetID(this.parent.grid) + 1, '', i, j);
                    this.parent.refreshDependentCells('!' + this.parent.getSheetID(this.parent.grid) + '!' + getAlphalabel(j) + i, actCell);
                    this.parent.actCell = actCellSheetName + actCell;
                }
            }
        }
    }

    /**
     * Sorts a range of an array.
     *
     * Excel: `SORT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSORT(...args: string[]): number | string {
        let nestedFormula: boolean; let isStringVal: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        const argArr: string[] = args; let result: string | number;
        const values: string[] = [];
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        argArr[1] = argArr[1] ? argArr[1] : '1';
        argArr[2] = argArr[2] ? argArr[2] : '1'; // 1 = Ascending, -1 = Descending. Default is ascending order.
        argArr[3] = argArr[3] ? argArr[3] : 'FALSE'; // Default is FALSE = sort by column or row
        argArr[0] = argArr[0].split('$').join('');
        let cellCollection: string | string[]; const valueCollection: string[] = [];
        if (argArr[0].indexOf(':') > -1) {
            if (isNullOrUndefined(argArr[0].match(/[0-9]/))) {
                const splitArray: string[] = argArr[0].split(':');
                argArr[0] = splitArray[0] + '1' + ':' + splitArray[1] + (this.parent.spreadSheetUsedRange[0] + 1);
            } else if (isNullOrUndefined(argArr[0].toUpperCase().match(/[A-Z]/))) {
                const splitArray: string[] = argArr[0].split(':');
                argArr[0] = 'A' + splitArray[0] + ':' + getAlphalabel(this.parent.spreadSheetUsedRange[1] + 1) + splitArray[1];
            }
            const rangeSplit: string[] = argArr[0].split(':');
            if (this.parent.isCellReference(rangeSplit[0]) && this.parent.isCellReference(rangeSplit[1])) {
                const collection: string[] = this.parent.dependencyCollection;
                for (let i: number = 0; i < collection.length && !nestedFormula; i++) {
                    if (collection[i as number].split(':')[0] === argArr[0].split(':')[0]) {
                        this.clearDependency(collection[i as number]);
                    }
                }
                if (this.parent.dependencyCollection.indexOf(argArr[0]) === -1) {
                    if (!nestedFormula) {
                        this.parent.dependencyCollection.push(argArr[0]);
                    }
                } else { this.clearDependency(argArr[0]); }
                const j: number = argArr[0].indexOf(':'); let swap: number;
                let rowIdx: number = this.parent.rowIndex(this.parent.substring(argArr[0], 0, j));
                let colIdx: number = this.parent.colIndex(this.parent.substring(argArr[0], 0, j));
                let eRowIdx: number = this.parent.rowIndex(this.parent.substring(argArr[0], j + 1, j + argArr[0].length - j - 1));
                let eColIdx: number = this.parent.colIndex(this.parent.substring(argArr[0], j + 1, j + argArr[0].length - j - 1));
                if (rowIdx > eRowIdx) {
                    swap = eRowIdx; eRowIdx = rowIdx; rowIdx = swap;
                }
                if (colIdx > eColIdx) {
                    swap = eColIdx; eColIdx = colIdx; colIdx = swap;
                }
                if (this.parent.isCellReference(argArr[3])) {
                    argArr[3] = this.parent.getValueFromArg(argArr[3]).toUpperCase();
                    if (argArr[3] !== this.parent.trueValue && argArr[3] !== this.parent.falseValue) {
                        if (isNumber(argArr[3])) {
                            argArr[3] = Number(argArr[3]) === 0 ? this.parent.falseValue : this.parent.trueValue;
                        } else if (argArr[3] === '') {
                            argArr[3] = this.parent.falseValue;
                        } else {
                            return this.parent.getErrorStrings()[CommonErrors.Value];
                        }
                    }
                } else {
                    isStringVal = argArr[3].startsWith(this.parent.tic) && argArr[3].endsWith(this.parent.tic);
                    argArr[3] = this.parent.getValueFromArg(argArr[3]);
                    argArr[3] = isNumber(argArr[3]) ? (Number(argArr[3]) === 0 ? this.parent.falseValue : this.parent.trueValue) :
                        argArr[3].split(this.parent.tic).join('').toUpperCase();
                    if (argArr[3] !== this.parent.trueValue && argArr[3] !== this.parent.falseValue) {
                        return this.parent.getErrorStrings()[isStringVal ? CommonErrors.Value : CommonErrors.Name];
                    }
                }
                if (this.parent.isCellReference(argArr[2])) {
                    argArr[2] = this.parent.getValueFromArg(argArr[2]);
                    argArr[2] = argArr[2] === this.parent.trueValue ? '1' : argArr[2];
                } else {
                    argArr[2] = this.parent.getValueFromArg(argArr[2]);
                    argArr[2] = argArr[2] === this.parent.trueValue ? '1' : argArr[2].split(this.parent.tic).join('');
                }
                argArr[2] = isNumber(argArr[2]) ? Math.floor(Number(argArr[2])).toString() : argArr[2];
                if (argArr[2] !== '1' && argArr[2] !== '-1') {
                    return this.parent.getErrorStrings().indexOf(argArr[2]) > -1 ? this.parent.getErrorStrings()[CommonErrors.Name] :
                        this.parent.getErrorStrings()[CommonErrors.Value];
                }
                const order: string = argArr[2] === '1' ? 'Ascending' : 'Descending';
                if (this.parent.isCellReference(argArr[1])) {
                    argArr[1] = this.parent.getValueFromArg(argArr[1]);
                    argArr[1] = isNumber(argArr[1]) ? Math.floor(Number(argArr[1])).toString() : (argArr[1] === this.parent.trueValue ? '1'
                        : (argArr[1] === this.parent.falseValue ? '0' : argArr[1]));
                    if (!isNaN(this.parseDouble(argArr[1])) ? (this.parseDouble(argArr[1]) < 1 || (argArr[3] === this.parent.trueValue ?
                        (eRowIdx - rowIdx) + 1 < this.parseDouble(argArr[1]) : (eColIdx - colIdx) + 1 < this.parseDouble(argArr[1])))
                        : true) {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                } else {
                    isStringVal = argArr[1].startsWith(this.parent.tic) && argArr[1].endsWith(this.parent.tic);
                    argArr[1] = this.parent.getValueFromArg(argArr[1]);
                    argArr[1] = isNumber(argArr[1]) ? Math.floor(Number(argArr[1])).toString() : (argArr[1] === this.parent.trueValue ?
                        '1' : (argArr[1] === this.parent.falseValue ? '0' : argArr[1].split(this.parent.tic).join('')));
                    if (!isNaN(this.parseDouble(argArr[1])) ? (this.parseDouble(argArr[1]) < 1 || (argArr[3] === this.parent.trueValue ?
                        (eRowIdx - rowIdx) + 1 < this.parseDouble(argArr[1]) : (eColIdx - colIdx) + 1 < this.parseDouble(argArr[1])))
                        : isStringVal) {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                }
                let sheetIdx: string | number = '';
                if (argArr[0].indexOf('!') === 0) {
                    sheetIdx = argArr[0]; sheetIdx = sheetIdx.replace('!', ''); sheetIdx = sheetIdx.indexOf('!');
                    sheetIdx = argArr[0].substring(0, sheetIdx + 2);
                }
                argArr[0] = sheetIdx + getAlphalabel(colIdx) + rowIdx + ':' + getAlphalabel(eColIdx) + eRowIdx;
                cellCollection = this.parent.getCellCollection(argArr[0]);
                for (let i: number = 0; i < cellCollection.length; i++) {
                    valueCollection.push(this.parent.getValueFromArg(cellCollection[i as number]));
                }
                const colSort: (string | number)[] = [];
                const numColl: (string | number)[] = [];
                const strColl: (string)[] = [];
                const booleanColl: (string)[] = [];
                const emptyCellColl: (string | number)[] = [];
                const totalColumn: number = eColIdx - colIdx + 1;
                const sortRangeValuesHandler: Function = (value: string): void => {
                    if (value) {
                        if (value.toUpperCase() === 'TRUE' || value.toUpperCase() === 'FALSE') {
                            booleanColl.push(value);
                            colSort.push(value);
                        } else if (isNaN(this.parseDouble(value))) {
                            strColl.push(value);
                            colSort.push(value);
                        } else {
                            numColl.push(this.parseDouble(value));
                            colSort.push(this.parseDouble(value));
                        }
                    } else if (value === '') {
                        emptyCellColl.push(this.parseDouble(value).toString());
                        colSort.push(this.parseDouble(value).toString());
                    }
                };
                if (argArr[3] === 'TRUE') {
                    for (let i: number = 0; i < totalColumn; i++) {
                        sortRangeValuesHandler(valueCollection[i + ((this.parseDouble(argArr[1]) - 1) * totalColumn)]);
                    }
                }
                if (argArr[3] === 'FALSE') {
                    for (let i: number = 0; i < valueCollection.length; i++) {
                        sortRangeValuesHandler(valueCollection[i * totalColumn + this.parseDouble(argArr[1]) - 1]);
                    }
                }
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const sortedNumColl: any[] = numColl.length > 0 ? sortCollection(numColl as any[], order) : [];
                const sortedStrColl: any[] = strColl.length > 0 ? sortCollection(strColl as any[], order) : [];
                const sortedBooleanColl: any[] = booleanColl.length > 0 ? sortCollection(booleanColl as any[], order) : [];
                const sortedVal: any[] = order === 'Ascending' ?
                    sortedNumColl.concat(sortedStrColl, sortedBooleanColl, emptyCellColl) :
                    sortedBooleanColl.concat(sortedStrColl, sortedNumColl, emptyCellColl);
                /* eslint-enable @typescript-eslint/no-explicit-any */
                const id: number[] = [];
                for (let a: number = 0; a < sortedVal.length; a++) {
                    for (let b: number = 0; b < colSort.length; b++) {
                        if (JSON.stringify(sortedVal[a as number]) === JSON.stringify(colSort[b as number])) {
                            if (id.indexOf(b) === - 1) { id.push(b); }
                        }
                    }
                }
                let activeCell: string; let sortActCell: string;
                activeCell = sortActCell = this.parent.actCell;
                if (activeCell) {
                    activeCell = activeCell.indexOf('!') > -1 ? activeCell.substring(activeCell.lastIndexOf('!') + 1) : activeCell;
                } else { activeCell = this.parent.actCell; }
                const actRowIdx: number = this.parent.rowIndex(activeCell);
                const actColIdx: number = this.parent.colIndex(activeCell);
                if (this.parent.dependencyLevel === 0) {
                    let isSpill: boolean = false;
                    const resultRows: number = (argArr[3] === 'TRUE') ? (eRowIdx - rowIdx + 1) : id.length;
                    const resultCols: number = (argArr[3] === 'TRUE') ? id.length : (eColIdx - colIdx + 1);
                    for (let rowOffset: number = 0; rowOffset < resultRows; rowOffset++) {
                        for (let colOffset: number = 0; colOffset < resultCols; colOffset++) {
                            if (this.checkSpill(actColIdx + colOffset, actRowIdx + rowOffset)) { isSpill = true; }
                            if (rowOffset === resultRows - 1 && colOffset === resultCols - 1) {
                                const endCell: string = getAlphalabel(actColIdx + colOffset) + (actRowIdx + rowOffset);
                                if (this.parent.sortRange.indexOf(sortActCell + ':' + endCell) === -1) {
                                    this.parent.sortRange.push(sortActCell + ':' + endCell);
                                }
                            }
                        }
                    }
                    if (isSpill) { return this.parent.formulaErrorStrings[FormulasErrorsStrings.Spill]; }
                } else if (this.parent.dependencyLevel > 0 &&
                    this.parent.getValueFromArg(getAlphalabel(actColIdx) + actRowIdx, true).indexOf('#SPILL!') > -1) {
                    return this.parent.formulaErrorStrings[FormulasErrorsStrings.Spill];
                }
                if (argArr[3] === 'TRUE') {
                    for (let startRow: number = rowIdx, rowInc: number = 0; startRow <= eRowIdx; startRow++, rowInc++) {
                        for (let a: number = 0, colInc: number = 0; a < id.length; a++, colInc++) {
                            let cellValue: string = this.parent.getValueFromArg(
                                sheetIdx + getAlphalabel(id[a as number] + colIdx) + startRow);
                            if (nestedFormula && cellValue !== '') {
                                values.push(cellValue);
                                continue;
                            }
                            cellValue = cellValue === '' ? '0' : cellValue;
                            let activeCell: string = this.parent.cell;
                            if (activeCell) {
                                activeCell = activeCell.indexOf('!') > - 1 ? activeCell.substring(activeCell.lastIndexOf('!') + 1) :
                                    activeCell;
                                const actRowIdx: number = this.parent.rowIndex(activeCell);
                                const actColIdx: number = this.parent.colIndex(activeCell);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetID(this.parent.grid) + 1,
                                                                                 cellValue, actRowIdx + rowInc, actColIdx + colInc);
                            }
                        }
                    }
                    result = this.parent.getValueFromArg(sheetIdx + getAlphalabel(id[0] + colIdx) + rowIdx);
                }
                if (argArr[3] === 'FALSE') {
                    for (let a: number = 0, rowInc: number = 0; a < id.length; a++, rowInc++) {
                        for (let startCol: number = colIdx, colInc: number = 0; startCol <= eColIdx; startCol++, colInc++) {
                            let value: string = this.parent.getValueFromArg(
                                sheetIdx + getAlphalabel(startCol) + (id[a as number] + rowIdx));
                            if (nestedFormula && value !== '') {
                                values.push(value);
                                continue;
                            }
                            value = value === '' ? '0' : value;
                            let activeCell: string = this.parent.cell;
                            if (activeCell) {
                                activeCell = activeCell.indexOf('!') > - 1 ? activeCell.substring(activeCell.lastIndexOf('!') + 1) :
                                    activeCell;
                                const actColIdx: number = this.parent.colIndex(activeCell);
                                const actRowIdx: number = this.parent.rowIndex(activeCell);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (this.parent.parentObject as any).setValueRowCol(this.parent.getSheetID(this.parent.grid) + 1,
                                                                                 value, actRowIdx + rowInc, actColIdx + colInc);
                            }
                        }
                    }
                    result = this.parent.getValueFromArg(sheetIdx + getAlphalabel(colIdx) + (id[0] + rowIdx));
                }
            }
        } else if (this.parent.isCellReference(argArr[0])) {
            if (this.parent.dependencyCollection.indexOf(argArr[0]) === -1) {
                if (!nestedFormula) {
                    this.parent.dependencyCollection.push(argArr[0]);
                }
            } else { this.clearDependency(argArr[0]); }
            result = this.parent.getValueFromArg(argArr[0]);
        } else {
            result = argArr[0].trim();
            if (this.parent.getErrorStrings().indexOf(result) > -1) { return result; }
            result = this.parent.removeTics(result);
        }
        if (nestedFormula) {
            return values.join(',');
        }
        return result === '' ? '0' : result;
    }
}
