import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { isNumber } from '../common/number-date';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Boolean logic, conditional branching (IF), and error-coalescing (IFERROR) functions.
 *
 * Registered functions: IF, AND, OR, NOT, IFS, IFERROR.
 *
 * @hidden
 */
export class LogicalFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'IF', category: 'Logical', description: 'Returns one value if a logical expression is TRUE and another if it is FALSE', syntax: 'IF(logical_test, value_if_true, [value_if_false])' },
        { formulaName: 'AND', category: 'Logical', description: 'Returns TRUE if all the arguments are considered TRUE, and FALSE otherwise.', syntax: 'AND(logical1, [logical2], ...)' },
        { formulaName: 'OR', category: 'Logical', description: 'Returns TRUE if any arguments considered TRUE, and all the arguments are FALSE it will return FALSE.', syntax: 'OR(logical1, [logical2], ...)' },
        { formulaName: 'NOT', category: 'Logical', description: 'Returns the inverse of a given logical expression.', syntax: 'NOT(logical)' },
        { formulaName: 'IFS', category: 'Logical', description: 'Checks multiple conditions and returns a value corresponding to the first TRUE result.', syntax: 'IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)' },
        { formulaName: 'IFERROR', category: 'Logical', description: 'Returns a value you specify if a formula evaluates to an error; otherwise, it returns the result of the formula.', syntax: 'IFERROR(value, value_if_error)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns one value if a logical expression is TRUE and another if it is FALSE.
     *
     * Excel: `IF(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=IF(A1>0,"Yes","No")');
     * ```
     */
    public ComputeIF(...args: string[]): string | number {
        let nestedFormula: boolean;
        if (args.length && args[args.length - 1] === 'nestedFormulaTrue') {
            nestedFormula = true;
            args.pop();
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        if (this.parent.getErrorStrings().indexOf(args[0]) > -1) {
            return args[0];
        }
        const argArr: string[] = args; let skipTick: boolean;
        if (argArr.length === 4 && argArr[3] === 'nestedFormulaTrue') { skipTick = true; argArr.pop(); }
        let condition: string;
        let result: string;
        if (argArr.length > 3 || argArr.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        } else if (argArr.length <= 3) {
            let cellValues: string[] | string;
            let cellVal: string;
            let val : string = '';
            condition = this.parent.getValueFromArg(argArr[0]);
            if (this.parent.getErrorStrings().indexOf(condition) > -1) {
                return condition;
            }
            const condUpper: string = condition.toUpperCase();
            const parsedVal: number = this.parent.parseFloat(condition);
            if (condUpper === this.parent.trueValue || (parsedVal < 0 || parsedVal > 0)) {
                if (nestedFormula && argArr[1].includes(':') && this.parent.isCellReference(argArr[1])) {
                    cellValues = this.parent.getCellCollection(argArr[1]);
                    for (let i: number = 0; i < cellValues.length; i++) {
                        cellVal = this.parent.getValueFromArg(cellValues[i as number]);
                        if (!isNaN(this.parent.parseFloat(cellVal))) {
                            val += cellVal + ',';
                        }
                    }
                    return val.slice(0, val.length - 1);
                }
                result = argArr[1] === '' ? '0' : this.parent.getValueFromArg(argArr[1], undefined, undefined, undefined, true);
            } else if (condUpper === this.parent.falseValue || parsedVal === 0) {
                if (isNullOrUndefined(argArr[2])) {
                    return this.parent.falseValue;
                }
                if (nestedFormula && argArr[2].includes(':') && this.parent.isCellReference(argArr[2])) {
                    cellValues = this.parent.getCellCollection(argArr[2]);
                    for (let i: number = 0; i < cellValues.length; i++) {
                        cellVal = this.parent.getValueFromArg(cellValues[i as number]);
                        if (!isNaN(this.parent.parseFloat(cellVal))) {
                            val += cellVal + ',';
                        }
                    }
                    return val.slice(0, val.length - 1);
                }
                result = argArr[2] === '' ? '0' : this.parent.getValueFromArg(argArr[2], undefined, undefined, undefined, true);
            } else {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.Requires3Args];
            }
        }
        const indexOfTic: number = result.indexOf(this.parent.tic);
        if (!skipTick && indexOfTic > -1) {
            return result.split(this.parent.tic).join('');
        } else if (skipTick && !isNumber(result) && indexOfTic === -1 && result !== this.parent.trueValue &&
            result !== this.parent.falseValue && !this.parent.isCellReference(result)) {
            return '"' + result + '"';
        } else {
            return result === '' ? '0' : result;
        }
    }

    /**
     * Returns TRUE if all the arguments are considered TRUE, and FALSE otherwise.
     *
     * Excel: `AND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeAND(...args: string[]): string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return this.parent.computeAndOrNot(argArr, 'and');
    }

    /**
     * Returns TRUE if any arguments considered TRUE, and all the arguments are FALSE it will return FALSE.
     *
     * Excel: `OR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeOR(...args: string[]): string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        return this.parent.computeAndOrNot(argArr, 'or');
    }

    /**
     * Returns the inverse of a given logical expression.
     *
     * Excel: `NOT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeNOT(...args: string[]): string {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (args.length > 1 || args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.computeAndOrNot(argArr, 'not');
    }

    /**
     * Checks multiple conditions and returns a value corresponding to the first TRUE result.
     *
     * Excel: `IFS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIFS(...args: string[]): string | number {
        const argArr: string[] = args;
        if (isNullOrUndefined(args) || (argArr.length === 1 && argArr[0] === '') || argArr.length % 2 !== 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let condition: string = '';
        let result: string = '';
        for (let i: number = 0; i < argArr.length; i++) {
            condition = this.parent.getValueFromArg(argArr[i as number]);
            if (argArr[i as number] === '') {
                return this.parent.getErrorStrings()[CommonErrors.NA];
            }
            if (this.parent.getErrorStrings().indexOf(condition) > -1) {
                return condition;
            }
            if (condition !== this.parent.trueValue && condition !== this.parent.falseValue) {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
            if (condition === this.parent.trueValue) {
                if (this.parent.isCellReference(argArr[i + 1].split(this.parent.tic).join('')) || argArr[i + 1].includes(this.parent.arithMarker)) {
                    result = this.parent.getValueFromArg(argArr[i + 1]);
                    result = result === '' ? '0' : result;
                } else {
                    result = argArr[i + 1] === '' ? '0' : this.parent.getValueFromArg(argArr[i + 1]);
                    if (result.indexOf(this.parent.tic) > -1) {
                        result = result.split(this.parent.tic).join('');
                    }
                }
                i = i + 1;
                return result;
            } else if (condition === this.parent.falseValue) {
                i = i + 1;
            }
        }
        return this.parent.getErrorStrings()[CommonErrors.NA];
    }

    /**
     * Returns a value you specify if a formula evaluates to an error; otherwise, it returns the result of the formula.
     *
     * Excel: `IFERROR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIFERROR(...args: string[]): number | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const argArr: string[] = args;
        let condition: string;
        if (argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (this.parent.isCellReference(argArr[0])) {
            condition = this.parent.getValueFromArg(argArr[0]) || '0';
            if (this.parent.getErrorStrings().indexOf(condition) === -1 && condition !== 'NaN') {
                return condition;
            }
        } else {
            condition = this.parent.getValueFromArg(argArr[0], null, true) || '0';
            if (this.parent.getErrorStrings().indexOf(condition) === -1 && condition !== 'NaN') {
                condition = condition.split(this.parent.tic).join('').trim();
                return condition;
            }
        }
        if (this.parent.isCellReference(argArr[1])) {
            condition = this.parent.getValueFromArg(argArr[1]) || '0';
        } else {
            condition = this.parent.getValueFromArg(argArr[1]) || '0';
            condition = condition.split(this.parent.tic).join('').trim();
        }
        return condition;
    }
}
