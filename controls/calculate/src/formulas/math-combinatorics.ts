import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';
import { factorial } from './formula-math-helpers';

/**
 * Combinatorial functions for permutations, combinations, and greatest-common-divisor calculations.
 *
 * Registered functions: FACTDOUBLE, MULTINOMIAL, PERMUT, SERIESSUM, ROMAN.
 *
 * @hidden
 */
export class MathCombinatoricsFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'FACTDOUBLE', category: 'Math & Trig', description: 'Returns the double factorial of a number.', syntax: 'FACTDOUBLE(number)' },
        { formulaName: 'MULTINOMIAL', category: 'Math & Trig', description: 'Returns the multinomial of a set of numbers.', syntax: 'MULTINOMIAL(number1, [number2], ...)' },
        { formulaName: 'PERMUT', category: 'Math & Trig', description: 'Returns the number of permutations for a given number of objects.', syntax: 'PERMUT(number, number_chosen)' },
        { formulaName: 'SERIESSUM', category: 'Math & Trig', description: 'Returns the sum of a power series.', syntax: 'SERIESSUM(x, n, m, coefficients)' },
        { formulaName: 'ROMAN', category: 'Math & Trig', description: 'Converts an Arabic numeral to Roman, as text.', syntax: 'ROMAN(number, [form])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the double factorial of a number.
     *
     * Excel: `FACTDOUBLE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=FACTDOUBLE(1)');
     * ```
     */
    public ComputeFACTDOUBLE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        const n: number = Math.floor(num);
        if (n < 0 || n > 300) {
            return errCollection[CommonErrors.Num];
        }
        let result: number = 1;
        for (let i: number = n; i > 0; i -= 2) {
            result *= i;
        }
        return result.toString();
    }

    /**
     * Returns the multinomial of a set of numbers.
     *
     * Excel: `MULTINOMIAL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMULTINOMIAL(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const values: number[] = [];
        for (let i: number = 0; i < args.length; i++) {
            const num: number | string = this.resolveNumberArg(args[i as number]);
            if (typeof num === 'string') {
                return num;
            }
            const n: number = Math.floor(num);
            if (n < 0) {
                return errCollection[CommonErrors.Num];
            }
            values.push(n);
        }
        const sum: number = values.reduce((a: number, b: number) => a + b, 0);
        let denom: number = 1;
        for (let i: number = 0; i < values.length; i++) {
            denom *= factorial(values[i as number]);
        }
        const result: number = factorial(sum) / denom;
        return result.toString();
    }

    /**
     * Returns the number of permutations for a given number of objects.
     *
     * Excel: `PERMUT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePERMUT(...args: string[]): string | number {
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
        for (let i: number = 0; i < k; i++) {
            result *= n - i;
        }
        return result.toString();
    }

    /**
     * Returns the sum of a power series.
     *
     * Excel: `SERIESSUM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSERIESSUM(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const n: number | string = this.resolveNumberArg(args[1]);
        const m: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') {
            return x;
        }
        if (typeof n === 'string') {
            return n;
        }
        if (typeof m === 'string') {
            return m;
        }
        const coeffs: number[] = [];
        for (let i: number = 3; i < args.length; i++) {
            const c: number | string = this.resolveNumberArg(args[i as number]);
            if (typeof c === 'string') {
                return c;
            }
            coeffs.push(c);
        }
        let sum: number = 0;
        for (let i: number = 0; i < coeffs.length; i++) {
            const power: number = n + i * m;
            sum += coeffs[i as number] * Math.pow(x, power);
        }
        return sum.toString();
    }

    /**
     * Converts an Arabic numeral to Roman, as text.
     *
     * Excel: `ROMAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeROMAN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const numArg: number | string = this.resolveNumberArg(args[0]);
        if (typeof numArg === 'string') {
            return numArg;
        }
        let form: number = 0;
        if (args.length === 2) {
            const formArg: number | string = this.resolveNumberArg(args[1]);
            if (typeof formArg === 'string') {
                return formArg;
            }
            form = Math.floor(formArg);
            if (form < 0 || form > 4) {
                return errCollection[CommonErrors.Value];
            }
        }
        const n: number = Math.floor(numArg);
        if (n < 0 || n > 3999) {
            return errCollection[CommonErrors.Value];
        }
        if (n === 0) {
            return '';
        }
        return this.toRoman(n, form);
    }

    private toRoman(num: number, form: number): string {
        const thousands: string[] = ['', 'M', 'MM', 'MMM'];
        const hundredsClassic: string[][] = [
            ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
            ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
            ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
            ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
            ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM']
        ];
        const tensClassic: string[][] = [
            ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
            ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
            ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
            ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
            ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC']
        ];
        const onesClassic: string[][] = [
            ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
            ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
            ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
            ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
            ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
        ];
        const f: number = Math.min(form, 4);
        let result: string = thousands[Math.floor(num / 1000)];
        result += hundredsClassic[f as number][Math.floor((num % 1000) / 100)];
        result += tensClassic[f as number][Math.floor((num % 100) / 10)];
        result += onesClassic[f as number][num % 10];
        if (form === 1) {
            result = result.replace(/XLV/g, 'VL').replace(/XCV/g, 'VC').replace(/CDL/g, 'LD')
                .replace(/CML/g, 'LM').replace(/CMVC/g, 'LMVL');
        } else if (form === 2) {
            result = result.replace(/IV/g, 'IIII').replace(/IX/g, 'VIIII')
                .replace(/XL/g, 'XXXX').replace(/XC/g, 'LXXXX')
                .replace(/CD/g, 'CCCC').replace(/CM/g, 'DCCCC');
        } else if (form === 3) {
            result = result.replace(/IV/g, 'IIII').replace(/IX/g, 'VIIII')
                .replace(/XL/g, 'XXXX').replace(/XC/g, 'LXXXX')
                .replace(/CD/g, 'CCCC').replace(/CM/g, 'DCCCC');
        } else if (form === 4) {
            result = result.replace(/V/g, 'IV').replace(/L/g, 'XL').replace(/D/g, 'CD');
        }
        return result;
    }
}
