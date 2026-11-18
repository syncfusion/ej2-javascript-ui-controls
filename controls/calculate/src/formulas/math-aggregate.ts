import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber } from '../common/number-date';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Aggregation functions that summarize ranges of numeric values (sums, counts, products, and conditional totals).
 *
 * Registered functions: SUM, SUMIF, SUMIFS, SUMPRODUCT, PRODUCT.
 *
 * @hidden
 */
export class MathAggregateFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'SUM', category: 'Math & Trig', description: 'Sums individual values, cell references or ranges.', syntax: 'SUM(number1, [number2], ...)' },
        { formulaName: 'SUMIF', category: 'Math & Trig', description: 'It will sum up cells that meet the given criteria.', syntax: 'SUMIF(range, criteria, [sum_range])' },
        { formulaName: 'SUMIFS', category: 'Math & Trig', description: 'Sums the cells specified by a given set of conditionsor criteria.', syntax: 'SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)' },
        { formulaName: 'SUMPRODUCT', category: 'Math & Trig', description: 'Returns sum of the product of given ranges of arrays.', syntax: 'SUMPRODUCT(array1, [array2], ...)' },
        { formulaName: 'PRODUCT', category: 'Math & Trig', description: 'Multiplies all the numbers given as arguments and returns the product.', syntax: 'PRODUCT(number1, [number2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Sums individual values, cell references or ranges.
     *
     * Excel: `SUM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=SUM(A1:A3)');
     * ```
     */
    public ComputeSUM(...args: string[]): string | number {
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
        let sum: number = 0;
        let val: string;
        let orgValue: number | string;
        let maxDecimalLength: number = 0;
        if (!isNullOrUndefined(args)) {
            const argArr: string[] = args;
            const setMaxDecimalLength: Function = (val: string): void => {
                if (val.toString().indexOf('.') > - 1) {
                    maxDecimalLength = Math.max(maxDecimalLength, val.split('.')[1].length);
                }
            };
            for (let i: number = 0; i < argArr.length; i++) {
                const argValue: string = argArr[i as number].toString();
                if (argValue.indexOf(':') > -1 && this.parent.isCellReference(argValue)) {
                    const cellCollection: string[] | string = this.parent.getCellCollection(argValue.split(this.parent.tic).join(''));
                    for (let j: number = 0; j < cellCollection.length; j++) {
                        val = !isSubtotalFormula ? this.parent.getValueFromArg(cellCollection[j as number]) :
                            this.parent.getValueFromArg(cellCollection[j as number], null, null, true);
                        if (isSubtotalFormula && val.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (this.parent.getErrorStrings().indexOf(val) > -1) {
                            return val;
                        }
                        if (isNullOrUndefined(val[0]) || isNaN(this.parent.parseFloat(val))) {
                            continue;
                        }
                        setMaxDecimalLength(val);
                        sum = sum + this.parent.parseFloat(val);
                    }
                } else {
                    if (argArr[i as number].indexOf(this.parent.tic) > -1) {
                        if (isNaN(this.parent.parseFloat(argArr[i as number].split(this.parent.tic).join(''))) ||
                            argArr[i as number].split(this.parent.tic).join('').trim() === '') {
                            return this.parent.getErrorStrings()[CommonErrors.Value];
                        }
                    }
                    if (argArr[i as number].split(this.parent.tic).join('') === this.parent.trueValue) {
                        argArr[i as number] = '1';
                    }
                    if (argArr[i as number].split(this.parent.tic).join('') === this.parent.falseValue) {
                        argArr[i as number] = '0';
                    }
                    orgValue = !isSubtotalFormula ? this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join('')) :
                        this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join(''), null, null, true);
                    if (isSubtotalFormula && orgValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    if (isNullOrUndefined(orgValue) || isNaN(this.parent.parseFloat(orgValue))) {
                        continue;
                    }
                    if (orgValue.length > 0) {
                        setMaxDecimalLength(orgValue);
                        sum = sum + this.parent.parseFloat(orgValue + '');
                    }
                }
            }
        }
        return sum.toString().indexOf('.') > - 1 ? sum.toFixed(maxDecimalLength) : sum;
    }

    /**
     * It will sum up cells that meet the given criteria.
     *
     * Excel: `SUMIF(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMIF(...args: string[]): string | number {
        const argArr: string[] = args;
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0]) ||
            (argArr[2] && argArr[2].indexOf(':') < 0 && !this.parent.isCellReference(argArr[2]))) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.ImproperFormula];
        }
        if (argArr.length > 3 || argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const result: number[] | string = this.parent.computeSumIfAndAvgIf(args, false);
        if (typeof result === 'string' && (this.parent.formulaErrorStrings.indexOf(result)
            || this.parent.getErrorStrings().indexOf(result))) {
            return result;
        }
        return result[0];
    }

    /**
     * Sums the cells specified by a given set of conditionsor criteria.
     *
     * Excel: `SUMIFS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMIFS(...args: string[]): string | number {
        const sum: string | number = this.calculateIFS(args);
        return sum;
    }


    /**
     * Returns sum of the product of given ranges of arrays.
     *
     * Excel: `SUMPRODUCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMPRODUCT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        let sum: number = 0; let count: number = 0; let index: number;
        let mulValues: number[] = null;
        const ranges: string[] = args; const len: number[] = [];
        for (let i: number = 0; i < ranges.length; i++) {
            const cells: string | string[] = this.parent.getCellCollection(ranges[i as number]);
            if (cells[0] === '#REF!') {
                return this.parent.getErrorStrings()[CommonErrors.Name];
            }
            len.push(cells.length);
        }
        for (let j: number = 0; j < len.length; j++) {
            if (len[j as number] && len[j + 1] && len[j as number] !== len[j + 1]) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        for (let k: number = 0; k < ranges.length; ++k) {
            const range: string = ranges[k as number];
            if (!range.startsWith(this.parent.tic) && this.parent.isCellReference(range)) {
                let i: number = range.indexOf(':');
                let startRow: number = this.parent.rowIndex(range.substr(0, i));
                let endRow: number = this.parent.rowIndex(range.substr(i + 1));
                if (!(startRow !== -1 || endRow === -1) === (startRow === -1 || endRow !== -1)) {
                    return this.parent.getErrorStrings()[CommonErrors.Name];
                }
                if (startRow > endRow) {
                    [startRow, endRow] = [endRow, startRow];
                }
                let col1: number = this.parent.colIndex(range.substr(0, i));
                let col2: number = this.parent.colIndex(range.substr(i + 1));
                if (col1 > col2) {
                    [col1, col2] = [col2, col1];
                }
                if (mulValues === null) {
                    count = (endRow - startRow + 1) * (col2 - col1 + 1);
                    mulValues = [];
                    for (i = 0; i < count; ++i) {
                        mulValues[i as number] = 1; //To create required index.
                    }
                }
                i = 0;
                for (let row: number = startRow; row <= endRow; ++row) {
                    for (let col: number = col1; col <= col2; ++col) {
                        const cellRef: string = this.getSheetReference(range) + this.parent.convertAlpha(col) + (row);
                        const result: string = this.parent.getValueFromArg(cellRef);
                        if (this.parent.getErrorStrings().indexOf(result) > -1) {
                            return result;
                        }
                        if (!isNaN(this.parent.parseFloat(result))) {
                            //To return #VALUE! error when array dimensions are mismatched.
                            if (isNaN(mulValues[i as number])) {
                                return this.parent.getErrorStrings()[CommonErrors.Name];
                            }
                            mulValues[i as number] = mulValues[i as number] * this.parent.parseFloat(result);
                        } else {
                            mulValues[i as number] = 0;
                        }
                        i++;
                    }
                }
            } else {
                const s1: string = this.parent.getValueFromArg(range);
                index = s1.indexOf('"');
                if (this.parent.getErrorStrings().indexOf(s1) > -1) {
                    return s1;
                } else if (index > -1) {
                    return 0;
                } else {
                    return this.parent.getErrorStrings()[CommonErrors.Value];
                }
            }
        }
        for (let i: number = 0; i < count; ++i) {
            sum += mulValues[i as number];
        }
        return sum;
    }

    /**
     * Multiplies all the numbers given as arguments and returns the product.
     *
     * Excel: `PRODUCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePRODUCT(...args: string[]): string | number {
        let isSubtotalFormula: boolean = false;
        if (args.length && args[args.length - 1] === 'isSubtotal') {
            isSubtotalFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        let product: number = 1;
        let val: string;
        let orgValue: string;
        let argsHit: boolean = true;
        let parseVal: number;
        if (!isNullOrUndefined(args)) {
            const argArr: string[] = args;
            for (let i: number = 0; i < argArr.length; i++) {
                const rangevalue: string = argArr[i as number];
                if (rangevalue.indexOf(':') > -1 && this.parent.isCellReference(rangevalue)) {
                    const cellCollection: string[] | string = this.parent.getCellCollection(rangevalue);
                    for (let j: number = 0; j < cellCollection.length; j++) {
                        val = !isSubtotalFormula ? this.parent.getValueFromArg(cellCollection[j as number]) :
                            this.parent.getValueFromArg(cellCollection[j as number], null, null, true);
                        if (isSubtotalFormula && val.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (!isNumber(val)) {
                            continue;
                        }
                        if (this.parent.getErrorStrings().indexOf(val) > -1) { return val; }
                        parseVal = this.parent.parseFloat(val);
                        if (!isNaN(parseVal)) {
                            if (val.length > 0) {
                                product = product * parseVal;
                                argsHit = false;
                            }
                        }
                    }
                } else if (rangevalue.indexOf(':') === -1 && this.parent.isCellReference(rangevalue)) {
                    orgValue = !isSubtotalFormula ? this.parent.getValueFromArg(argArr[i as number]) :
                        this.parent.getValueFromArg(argArr[i as number], null, null, true);
                    if (isSubtotalFormula && orgValue.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (!isNumber(orgValue)) {
                        continue;
                    }
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) { return orgValue; }
                } else {
                    orgValue = argArr[i as number];
                    const isEmptyStr: boolean = orgValue.indexOf(this.parent.tic) > -1 && orgValue.split(this.parent.tic).join('').trim() === '';
                    if (isEmptyStr || (argArr[i as number].indexOf(this.parent.tic) > -1 && isNaN(this.parent.parseFloat(orgValue.split(this.parent.tic).join(''))))) {
                        return this.parent.getErrorStrings()[CommonErrors.Value];
                    }
                    orgValue = this.parent.getValueFromArg(argArr[i as number].split(this.parent.tic).join(''));
                    orgValue = (orgValue === this.parent.trueValue) ? '1' : (orgValue === this.parent.falseValue) ? '0' : orgValue.split(this.parent.tic).join('');
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) { return orgValue; }
                }
                parseVal = this.parent.parseFloat(orgValue);
                if (!isNaN(parseVal)) {
                    if (orgValue.length > 0) {
                        product = product * parseVal;
                        argsHit = false;
                    }
                }
            }
        }
        return argsHit ? '0' : product.toString();
    }
}
