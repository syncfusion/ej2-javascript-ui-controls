import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Number-theoretic helpers such as GCD, LCM, and integer decomposition utilities.
 *
 * Registered functions: GCD, LCM, MROUND, COMBIN, SUMSQ.
 *
 * @hidden
 */
export class MathNumberFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'GCD', category: 'Math & Trig', description: 'Returns the greatest common divisor.', syntax: 'GCD(number1, [number2], ...)' },
        { formulaName: 'LCM', category: 'Math & Trig', description: 'Returns the least common multiple.', syntax: 'LCM(number1, [number2], ...)' },
        { formulaName: 'MROUND', category: 'Math & Trig', description: 'Returns a number rounded to the desired multiple.', syntax: 'MROUND(number, multiple)' },
        { formulaName: 'COMBIN', category: 'Math & Trig', description: 'Returns the number of combinations for a given number of objects.', syntax: 'COMBIN(number, number_chosen)' },
        { formulaName: 'SUMSQ', category: 'Math & Trig', description: 'Returns the sum of the squares of the arguments.', syntax: 'SUMSQ(number1, [number2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private collectNumbers(args: string[]): number[] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] = [];
        for (let i: number = 0; i < args.length; i++) {
            const arg: string = args[i as number];
            if (arg === '') {
                continue;
            }
            if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
                const cells: string[] | string = this.parent.getCellCollection(arg);
                const list: string[] = Array.isArray(cells) ? cells : [cells];
                for (let c: number = 0; c < list.length; c++) {
                    const val: string = this.parent.getValueFromArg(list[c as number]);
                    if (errCollection.indexOf(val) > -1) {
                        return val;
                    }
                    if (val !== '' && this.parent.isNumber(val)) {
                        nums.push(this.parent.parseFloat(val));
                    }
                }
            } else {
                const num: number | string = this.resolveNumberArg(arg);
                if (typeof num === 'string') {
                    return num;
                }
                nums.push(num);
            }
        }
        return nums;
    }

    private gcd2(a: number, b: number): number {
        let x: number = Math.abs(Math.floor(a));
        let y: number = Math.abs(Math.floor(b));
        while (y) {
            const t: number = y;
            y = x % y;
            x = t;
        }
        return x;
    }

    /**
     * Returns the greatest common divisor.
     *
     * Excel: `GCD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=GCD(1)');
     * ```
     */
    public ComputeGCD(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectNumbers(args);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return errCollection[CommonErrors.Value];
        }
        for (let i: number = 0; i < nums.length; i++) {
            if (nums[i as number] < 0) {
                return errCollection[CommonErrors.Num];
            }
        }
        let result: number = Math.floor(nums[0]);
        for (let i: number = 1; i < nums.length; i++) {
            result = this.gcd2(result, nums[i as number]);
        }
        return result.toString();
    }

    /**
     * Returns the least common multiple.
     *
     * Excel: `LCM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLCM(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectNumbers(args);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return errCollection[CommonErrors.Value];
        }
        for (let i: number = 0; i < nums.length; i++) {
            if (nums[i as number] < 0) {
                return errCollection[CommonErrors.Num];
            }
        }
        let result: number = Math.floor(nums[0]);
        for (let i: number = 1; i < nums.length; i++) {
            const n: number = Math.floor(nums[i as number]);
            result = result === 0 || n === 0 ? 0 : Math.abs(result * n) / this.gcd2(result, n);
        }
        return result.toString();
    }

    /**
     * Returns a number rounded to the desired multiple.
     *
     * Excel: `MROUND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMROUND(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const number: number | string = this.resolveNumberArg(args[0]);
        const multiple: number | string = this.resolveNumberArg(args[1]);
        if (typeof number === 'string') {
            return number;
        }
        if (typeof multiple === 'string') {
            return multiple;
        }
        if (multiple === 0) {
            return '0';
        }
        if ((number > 0 && multiple < 0) || (number < 0 && multiple > 0)) {
            return errCollection[CommonErrors.Num];
        }
        return (Math.round(number / multiple) * multiple).toString();
    }

    /**
     * Returns the number of combinations for a given number of objects.
     *
     * Excel: `COMBIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOMBIN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const nArg: number | string = this.resolveNumberArg(args[0]);
        const kArg: number | string = this.resolveNumberArg(args[1]);
        if (typeof nArg === 'string') {
            return nArg;
        }
        if (typeof kArg === 'string') {
            return kArg;
        }
        const n: number = Math.floor(nArg);
        const k: number = Math.floor(kArg);
        if (n < 0 || k < 0 || n < k) {
            return errCollection[CommonErrors.Num];
        }
        let result: number = 1;
        for (let i: number = 1; i <= k; i++) {
            result = result * (n - k + i) / i;
        }
        return Math.round(result).toString();
    }

    /**
     * Returns the sum of the squares of the arguments.
     *
     * Excel: `SUMSQ(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMSQ(...args: string[]): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectNumbers(args);
        if (typeof nums === 'string') {
            return nums;
        }
        let sum: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            sum += nums[i as number] * nums[i as number];
        }
        return sum.toString();
    }
}
