import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Core descriptive statistics: averages, counts, min/max, and basic range summaries.
 *
 * Registers 11 functions including AVERAGE, AVERAGEIF, AVERAGEA, AVERAGEIFS, COUNT, and others.
 *
 * @hidden
 */
export class StatisticalFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */

    public formulas: IBasicFormula[] = [
        { formulaName: 'AVERAGE', category: 'Statistical', description: 'The sum of the numbers divided by how many numbers are being averaged.', syntax: 'AVERAGE(number1, [number2], ...)' },
        { formulaName: 'AVERAGEIF', category: 'Statistical', description: 'Computes the average of the numbers in a range that meet the supplied criteria.', syntax: 'AVERAGEIF(range, criteria, [average_range])' },
        { formulaName: 'AVERAGEA', category: 'Statistical', description: 'Calculates the average of values in the list of arguments.Arguments can be numbers, names, arrays or references.', syntax: 'AVERAGEA(value1, [value2], ...)' },
        { formulaName: 'AVERAGEIFS', category: 'Statistical', description: 'Conditionally returns the average of the contents of cells for the set of ranges.', syntax: 'AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)' },
        { formulaName: 'COUNT', category: 'Statistical', description: 'Counts the numbers in the list of arguments, exclude text entries.', syntax: 'COUNT(value1, [value2], ...)' },
        { formulaName: 'COUNTA', category: 'Statistical', description: 'Counts the non-empty values in the list of arguments.', syntax: 'COUNTA(value1, [value2], ...)' },
        { formulaName: 'COUNTIF', category: 'Statistical', description: 'Counts the number of cells in a range that meet a specified condition.', syntax: 'COUNTIF(range, criteria)' },
        { formulaName: 'COUNTIFS', category: 'Statistical', description: 'Counts the number of times each cells in all the ranges that meet the specific conditions.', syntax: 'COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)' },
        { formulaName: 'COUNTBLANK', category: 'Statistical', description: 'Returns the number of empty cells in a specified range of cells.', syntax: 'COUNTBLANK(range)' },
        { formulaName: 'MIN', category: 'Statistical', description: 'Returns the smaller number in set of arguments.', syntax: 'MIN(number1, [number2], ...)' },
        { formulaName: 'MAX', category: 'Statistical', description: 'Returns the largest number in set of arguments.', syntax: 'MAX(number1, [number2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * The sum of the numbers divided by how many numbers are being averaged.
     *
     * Excel: `AVERAGE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=AVERAGE(1,2,3)');
     * ```
     */
    public ComputeAVERAGE(...args: string[]): string {
        let isSubtotalFormula: boolean = false;
        if (args.length) {
            const lastArgument: string = args[args.length - 1];
            if (lastArgument === 'isSubtotal') {
                isSubtotalFormula = true;
                args.pop();
            }
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argArr: string[] = args;
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i as number].indexOf(':') > -1) {
                if (argArr[i as number].indexOf(this.parent.tic) > -1) {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
        }
        return this.parent.calculateAvg(argArr, isSubtotalFormula);
    }

    /**
     * Computes the average of the numbers in a range that meet the supplied criteria.
     *
     * Excel: `AVERAGEIF(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeAVERAGEIF(...args: string[]): string | number {
        const argList: string[] = args;
        if (argList[0].indexOf(':') < 0 && !this.parent.isCellReference(argList[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.ImproperFormula];
        }
        const resultVal: number[] | string = this.parent.computeSumIfAndAvgIf(args, true);
        if (resultVal[1] === 0 || resultVal[0].toString() === 'NaN') { return this.parent.formulaErrorStrings[FormulasErrorsStrings.Div]; }
        if (typeof resultVal === 'string' && (this.parent.formulaErrorStrings.indexOf(resultVal)
            || this.parent.getErrorStrings().indexOf(resultVal))) {
            return resultVal;
        }
        return this.parent.parseFloat(resultVal[0]) / this.parent.parseFloat(resultVal[1]);
    }

    /**
     * Calculates the average of values in the list of arguments.Arguments can be numbers, names, arrays or references.
     *
     * Excel: `AVERAGEA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeAVERAGEA(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArrs: string[] = args;
        let cellCol: string[] | string;
        let result: number = 0;
        let cellValue: string | number; let value: string;
        let length: number = 0;
        let parseValue: string | number;
        for (let k: number = 0; k < argArrs.length; k++) {
            if (this.parent.isCellReference(argArrs[k as number])) {
                if (argArrs[k as number].indexOf(':') > -1) {
                    cellCol = this.parent.getCellCollection(argArrs[k as number].split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellCol.length; j++) {
                        cellValue = this.parent.getValueFromArg(cellCol[j as number]);
                        cellValue = this.processLogicalCellValue(cellValue);
                        if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                            return cellValue;
                        } else if (isNullOrUndefined(cellValue) || cellValue === '') {
                            continue;
                        }
                        parseValue = this.parent.parseFloat(cellValue);
                        cellValue = !isNaN(parseValue) ? parseValue : 0;
                        result += cellValue;
                        length = length + 1;
                    }
                } else {
                    cellValue = this.parent.getValueFromArg(argArrs[k as number]);
                    cellValue = this.processLogicalCellValue(cellValue);
                    if (this.parent.getErrorStrings().indexOf(cellValue) > -1) {
                        return cellValue;
                    } else if (isNullOrUndefined(cellValue) || cellValue === '') {
                        continue;
                    }
                    parseValue = this.parent.parseFloat(cellValue);
                    cellValue = !isNaN(parseValue) ? parseValue : 0;
                    result += cellValue;
                    length = length + 1;
                }
            } else {
                if (argArrs[k as number].indexOf(this.parent.tic) > -1) {
                    if (isNaN(this.parent.parseFloat(argArrs[k as number].split(this.parent.tic).join(''))) ||
                        argArrs[k as number].split(this.parent.tic).join('').trim() === '') {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                }
                argArrs[k as number] = this.processLogicalCellValue(argArrs[k as number]);
                value = this.parent.getValueFromArg(argArrs[k as number].split(this.parent.tic).join(''));
                if (this.parent.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                result += this.parent.parseFloat(value);
                length = length + 1;
            }
        }
        if (length === 0) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        return result / length;
    }

    private processLogicalCellValue(cellValue: string): string {
        let value: string = cellValue;
        if (value.toUpperCase() === this.parent.trueValue) {
            value = '1';
        } else if (value.toUpperCase() === this.parent.falseValue) {
            value = '0';
        }
        return value;
    }

    /**
     * Conditionally returns the average of the contents of cells for the set of ranges.
     *
     * Excel: `AVERAGEIFS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeAVERAGEIFS(...args: string[]): number | string {
        const sum: string | number = this.calculateIFS(args, this.parent.trueValue);
        return sum;
    }

    /**
     * Counts the numbers in the list of arguments, exclude text entries.
     *
     * Excel: `COUNT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUNT(...args: string[]): number | string {
        let isSubtotalFormula: boolean = false;
        if (args.length && args[args.length - 1] === 'isSubtotal') {
            isSubtotalFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = args;
        let argVal: string | number;
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string; let value: string;
        for (let i: number = 0; i < argArr.length; i++) {
            argVal = argArr[i as number];
            if (this.parent.isCellReference(argVal)) {
                if (argVal.indexOf(':') > -1) {
                    cellColl = this.parent.getCellCollection(argVal.split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellColl.length; j++) {
                        cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(cellColl[j as number]) :
                            this.parent.getValueFromArg(cellColl[j as number], null, null, true);
                        if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (!isNaN(this.parent.parseFloat(cellValue))) {
                            if (argVal.length > 0 && cellValue.trim() !== '') {
                                result++;
                            }
                        }
                    }
                } else {
                    cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(argVal) :
                        this.parent.getValueFromArg(argVal, null, null, true);
                    if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (!isNaN(this.parent.parseFloat(cellValue))) {
                        if (argVal.length > 0 && cellValue.trim() !== '') {
                            result++;
                        }
                    }
                }
            } else {
                value = this.parent.getValueFromArg(argVal).split(this.parent.tic).join('');
                if (argVal.length === 0 && value.trim() === '') {
                    result++;
                } else if (!isNaN(this.parent.parseFloat(value)) || argVal === this.parent.trueValue || argVal === this.parent.falseValue) {
                    if (argVal.length > 0 && argVal.trim() !== '' && value.trim() !== '') {
                        result++;
                    }
                }
            }
        }
        return result;
    }

    /**
     * Counts the non-empty values in the list of arguments.
     *
     * Excel: `COUNTA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUNTA(...args: string[]): number | string {
        let isSubtotalFormula: boolean = false;
        if (args.length) {
            const lastArgument: string = args[args.length - 1];
            if (lastArgument === 'isSubtotal') {
                isSubtotalFormula = true;
                args.pop();
            }
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = args;
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string; let value: string;
        for (let i: number = 0; i < argArr.length; i++) {
            if (this.parent.isCellReference(argArr[i as number])) {
                if (argArr[i as number].indexOf(':') > -1) {
                    cellColl = this.parent.getCellCollection(argArr[i as number].split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellColl.length; j++) {
                        cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(cellColl[j as number]) :
                            this.parent.getValueFromArg(cellColl[j as number], null, null, true);
                        if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (cellValue.length > 0) {
                            result++;
                        }
                    }
                } else {
                    cellValue = !isSubtotalFormula ? this.parent.getValueFromArg(argArr[i as number]) :
                        this.parent.getValueFromArg(argArr[i as number], null, null, true);
                    if (isSubtotalFormula && cellValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (cellValue.length > 0) {
                        result++;
                    }
                }
            } else {
                value = this.parent.getValueFromArg(argArr[i as number]).split(this.parent.tic).join('');
                if (value.length > 0) {
                    result++;
                } else if (value.length === 0 && value.trim() === '') {
                    result++;
                }
            }
        }
        return result;
    }

    /**
     * Counts the number of cells in a range that meet a specified condition.
     *
     * Excel: `COUNTIF(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUNTIF(...args: string[]): number | string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0])) {
            return this.parent.getErrorStrings()[CommonErrors.Name];
        }
        let cellColl: string[] | string;
        let result: number = 0;
        let cellValue: string;
        const stack: string[] = [];
        let op: string = 'equal';
        if (argArr[1] === '') { return 0; }
        const isStringVal: boolean = argArr[1].startsWith(this.parent.tic) && argArr[1].endsWith(this.parent.tic);
        let condition: string = this.parent.getANDComputedValue(argArr[1]);
        const isAsterisk: boolean = condition.includes('*');
        const isAsteriskOnly: boolean = condition === '*' || condition === '<>*';
        let criteriaValue: string = isAsterisk && !isAsteriskOnly ? condition.replace(/\*/g, '').trim() : condition;
        let isCellReferenceValue: boolean = false;
        if (!isStringVal && this.parent.isCellReference(criteriaValue)) {
            criteriaValue = this.parent.getValueFromArg(criteriaValue);
            isCellReferenceValue = true;
        }
        if (isAsterisk && !isAsteriskOnly) {
            const asteriskIndex: number = condition.indexOf('*');
            if (condition[0] === '*') { criteriaValue = '*' + criteriaValue; }
            if (condition[condition.length - 1] === '*') { criteriaValue += '*'; }
            if (asteriskIndex > 0 && asteriskIndex < condition.length - 1) {
                criteriaValue = condition.substring(0, asteriskIndex) + '*' + condition.substring(asteriskIndex + 1);
            }
        }
        condition = criteriaValue;
        if (condition.startsWith('<=')) {
            op = 'lessEq';
            condition = condition.substring(2);
        } else if (condition.startsWith('>=')) {
            op = 'greaterEq';
            condition = condition.substring(2);
        } else if (condition.startsWith('<>')) {
            op = 'notEq';
            condition = condition.substring(2);
        } else if (condition.startsWith('<')) {
            op = 'less';
            condition = condition.substring(1);
        } else if (condition.startsWith('>')) {
            op = 'greater';
            condition = condition.substring(1);
        } else if (condition.startsWith('=')) {
            op = 'equal';
            condition = condition.substring(1);
        }
        const isWildCardCondition: boolean = condition.indexOf('*') > -1 || condition.indexOf('?') > -1;
        if ((!isStringVal && this.parent.isCellReference(condition) && !isCellReferenceValue) || condition.includes(this.parent.arithMarker)
            || (condition.includes(this.parent.getParseDecimalSeparator()) && !isWildCardCondition)) {
            condition = this.parent.getValueFromArg(condition);
        }
        if (this.parent.isCellReference(argArr[0])) {
            cellColl = this.parent.getCellCollection(argArr[0].split(this.parent.tic).join(''));
            for (let j: number = 0; j < cellColl.length; j++) {
                cellValue = this.parent.getValueFromArg(cellColl[j as number]);
                if (isWildCardCondition) {
                    cellValue = this.parent.findWildCardValue(condition.toLowerCase(), cellValue.toLowerCase());
                }
                stack.push(cellValue);
                stack.push(condition);
                if (this.parent.processLogical(stack, op) === this.parent.trueValue) {
                    result++;
                }
            }
        }
        return result;
    }

    /**
     * Counts the number of times each cells in all the ranges that meet the specific conditions.
     *
     * Excel: `COUNTIFS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUNTIFS(...args: string[]): number | string {
        const sum: string | number = this.parent.computeCountIfsFormulas(args);
        return sum;
    }

    /**
     * Returns the number of empty cells in a specified range of cells.
     *
     * Excel: `COUNTBLANK(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUNTBLANK(...args: string[]): string | number  {
        let result: number = 0;
        if (args.length !== 1 || isNullOrUndefined(args) || !this.parent.isCellReference(args[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        } else if (args[0] === '') {
            return this.parent.getErrorStrings()[CommonErrors.Value];
        } else {
            const cellRange: string | string[] = this.parent.getCellCollection(args[0]);
            for (let i: number = 0; i < cellRange.length; i++) {
                if (this.parent.getValueFromArg(cellRange[i as number]) === '') {
                    result++;
                }
            }
        }
        return result;
    }

    /**
     * Returns the smaller number in set of arguments.
     *
     * Excel: `MIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeMIN(...args: string[]): string {
        return this.parent.computeMinMax(args, 'min');
    }

    /**
     * Returns the largest number in set of arguments.
     *
     * Excel: `MAX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeMAX(...args: string[]): string {
        return this.parent.computeMinMax(args, 'max');
    }
}
