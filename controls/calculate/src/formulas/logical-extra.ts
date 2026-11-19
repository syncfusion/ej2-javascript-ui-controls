import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Extended logical helpers including IFS, SWITCH, XOR, and multi-condition boolean tests.
 *
 * Registered functions: TRUE, FALSE, XOR, IFNA, SWITCH.
 *
 * @hidden
 */
export class LogicalExtraFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'TRUE', category: 'Logical', description: 'Returns the logical value TRUE.', syntax: 'TRUE()' },
        { formulaName: 'FALSE', category: 'Logical', description: 'Returns the logical value FALSE.', syntax: 'FALSE()' },
        { formulaName: 'XOR', category: 'Logical', description: 'Returns a logical exclusive OR of all arguments.', syntax: 'XOR(logical1, [logical2], ...)' },
        { formulaName: 'IFNA', category: 'Logical', description: 'Returns the value you specify if the expression resolves to #N/A; otherwise returns the result of the expression.', syntax: 'IFNA(value, value_if_na)' },
        { formulaName: 'SWITCH', category: 'Logical', description: 'Evaluates an expression against a list of values and returns the result corresponding to the first matching value.', syntax: 'SWITCH(expression, value1, result1, [default_or_value2], [result2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the logical value TRUE.
     *
     * Excel: `TRUE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=TRUE(1)');
     * ```
     */
    public ComputeTRUE(...args: string[]): string {
        if (args && args.length === 1 && args[0] === '') {
            return this.parent.trueValue;
        }
        if (args && args.length > 0 && !(args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.trueValue;
    }

    /**
     * Returns the logical value FALSE.
     *
     * Excel: `FALSE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeFALSE(...args: string[]): string {
        if (args && args.length === 1 && args[0] === '') {
            return this.parent.falseValue;
        }
        if (args && args.length > 0 && !(args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.parent.falseValue;
    }

    private isTruthy(value: string): boolean {
        const upper: string = value.toUpperCase();
        if (upper === this.parent.trueValue) {
            return true;
        }
        if (upper === this.parent.falseValue || value === '') {
            return false;
        }
        const num: number = this.parent.parseFloat(value);
        return !isNaN(num) && num !== 0;
    }

    /**
     * Returns a logical exclusive OR of all arguments.
     *
     * Excel: `XOR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed text result or an Excel error token such as `#VALUE!`.
     */
    public ComputeXOR(...args: string[]): string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        let trueCount: number = 0;
        for (let i: number = 0; i < args.length; i++) {
            const arg: string = args[i as number];
            if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
                const cells: string[] | string = this.parent.getCellCollection(arg);
                const list: string[] = Array.isArray(cells) ? cells : [cells];
                for (let c: number = 0; c < list.length; c++) {
                    const val: string = this.parent.getValueFromArg(list[c as number]);
                    if (errCollection.indexOf(val) > -1) {
                        return val;
                    }
                    if (this.isTruthy(val)) {
                        trueCount++;
                    }
                }
            } else {
                const val: string = this.parent.getValueFromArg(arg);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                if (this.isTruthy(val)) {
                    trueCount++;
                }
            }
        }
        return (trueCount % 2 === 1) ? this.parent.trueValue : this.parent.falseValue;
    }

    /**
     * Returns the value you specify if the expression resolves to #N/A; otherwise returns the result of the expression.
     *
     * Excel: `IFNA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIFNA(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const value: string = this.parent.getValueFromArg(args[0]);
        if (value === this.parent.getErrorStrings()[CommonErrors.NA] || value === '#N/A') {
            return this.parent.getValueFromArg(args[1]);
        }
        return value === '' ? '0' : value;
    }

    /**
     * Evaluates an expression against a list of values and returns the result corresponding to the first matching value.
     *
     * Excel: `SWITCH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSWITCH(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const expression: string = this.parent.getValueFromArg(args[0]);
        if (errCollection.indexOf(expression) > -1) {
            return expression;
        }
        const pairs: number = Math.floor((args.length - 1) / 2);
        let defaultValue: string = errCollection[CommonErrors.NA];
        const hasDefault: boolean = (args.length - 1) % 2 === 1;
        if (hasDefault) {
            defaultValue = this.parent.getValueFromArg(args[args.length - 1]);
        }
        for (let i: number = 0; i < pairs; i++) {
            const valueIdx: number = 1 + i * 2;
            const resultIdx: number = valueIdx + 1;
            const matchVal: string = this.parent.getValueFromArg(args[valueIdx as number]);
            if (errCollection.indexOf(matchVal) > -1) {
                return matchVal;
            }
            if (matchVal === expression ||
                (!isNaN(this.parent.parseFloat(matchVal)) &&
                    this.parent.parseFloat(matchVal) === this.parent.parseFloat(expression))) {
                const result: string = this.parent.getValueFromArg(args[resultIdx as number]);
                return result === '' ? '0' : this.parent.removeTics(result);
            }
        }
        return defaultValue === '' ? '0' : this.parent.removeTics(defaultValue);
    }
}
