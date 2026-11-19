import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Standard trigonometric functions (SIN, COS, TAN, and inverses) operating on angles in radians.
 *
 * Registers 14 functions including SIN, COS, TAN, ASIN, ACOS, and others.
 *
 * @hidden
 */
export class MathTrigFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'SIN', category: 'Math & Trig', description: 'Returns the sine of an angle.', syntax: 'SIN(number)' },
        { formulaName: 'COS', category: 'Math & Trig', description: 'Returns the cosine of an angle.', syntax: 'COS(number)' },
        { formulaName: 'TAN', category: 'Math & Trig', description: 'Returns the tangent of an angle.', syntax: 'TAN(number)' },
        { formulaName: 'ASIN', category: 'Math & Trig', description: 'Returns the arcsine of a number.', syntax: 'ASIN(number)' },
        { formulaName: 'ACOS', category: 'Math & Trig', description: 'Returns the arccosine of a number.', syntax: 'ACOS(number)' },
        { formulaName: 'ATAN', category: 'Math & Trig', description: 'Returns the arctangent of a number.', syntax: 'ATAN(number)' },
        { formulaName: 'ATAN2', category: 'Math & Trig', description: 'Returns the arctangent from x- and y-coordinates.', syntax: 'ATAN2(x_num, y_num)' },
        { formulaName: 'SINH', category: 'Math & Trig', description: 'Returns the hyperbolic sine of a number.', syntax: 'SINH(number)' },
        { formulaName: 'COSH', category: 'Math & Trig', description: 'Returns the hyperbolic cosine of a number.', syntax: 'COSH(number)' },
        { formulaName: 'TANH', category: 'Math & Trig', description: 'Returns the hyperbolic tangent of a number.', syntax: 'TANH(number)' },
        { formulaName: 'SIGN', category: 'Math & Trig', description: 'Returns the sign of a number.', syntax: 'SIGN(number)' },
        { formulaName: 'LOG10', category: 'Math & Trig', description: 'Returns the base-10 logarithm of a number.', syntax: 'LOG10(number)' },
        { formulaName: 'QUOTIENT', category: 'Math & Trig', description: 'Returns the integer portion of a division.', syntax: 'QUOTIENT(numerator, denominator)' },
        { formulaName: 'SQRTPI', category: 'Math & Trig', description: 'Returns the square root of a number multiplied by pi.', syntax: 'SQRTPI(number)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private unaryMath(args: string[], fn: (n: number) => number, domainCheck?: (n: number) => boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1 || args[0] === '') {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        if (domainCheck && !domainCheck(num)) {
            return errCollection[CommonErrors.Num];
        }
        return fn(num).toString();
    }

    /**
     * Returns the sine of an angle.
     *
     * Excel: `SIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=SIN(1)');
     * ```
     */
    public ComputeSIN(...args: string[]): string | number {
        return this.unaryMath(args, Math.sin);
    }
    /**
     * Returns the cosine of an angle.
     *
     * Excel: `COS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOS(...args: string[]): string | number {
        return this.unaryMath(args, Math.cos);
    }
    /**
     * Returns the tangent of an angle.
     *
     * Excel: `TAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTAN(...args: string[]): string | number {
        return this.unaryMath(args, Math.tan);
    }
    /**
     * Returns the arcsine of a number.
     *
     * Excel: `ASIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeASIN(...args: string[]): string | number {
        return this.unaryMath(args, Math.asin, (n: number) => n >= -1 && n <= 1);
    }
    /**
     * Returns the arccosine of a number.
     *
     * Excel: `ACOS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeACOS(...args: string[]): string | number {
        return this.unaryMath(args, Math.acos, (n: number) => n >= -1 && n <= 1);
    }
    /**
     * Returns the arctangent of a number.
     *
     * Excel: `ATAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeATAN(...args: string[]): string | number {
        return this.unaryMath(args, Math.atan);
    }
    /**
     * Returns the hyperbolic sine of a number.
     *
     * Excel: `SINH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSINH(...args: string[]): string | number {
        return this.unaryMath(args, Math.sinh);
    }
    /**
     * Returns the hyperbolic cosine of a number.
     *
     * Excel: `COSH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOSH(...args: string[]): string | number {
        return this.unaryMath(args, Math.cosh);
    }
    /**
     * Returns the hyperbolic tangent of a number.
     *
     * Excel: `TANH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTANH(...args: string[]): string | number {
        return this.unaryMath(args, Math.tanh);
    }
    /**
     * Returns the base-10 logarithm of a number.
     *
     * Excel: `LOG10(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLOG10(...args: string[]): string | number {
        return this.unaryMath(args, Math.log10, (n: number) => n > 0);
    }
    /**
     * Returns the square root of a number multiplied by pi.
     *
     * Excel: `SQRTPI(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSQRTPI(...args: string[]): string | number {
        return this.unaryMath(args, (n: number) => Math.sqrt(n * Math.PI), (n: number) => n >= 0);
    }

    /**
     * Returns the arctangent from x- and y-coordinates.
     *
     * Excel: `ATAN2(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeATAN2(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const y: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') {
            return x;
        }
        if (typeof y === 'string') {
            return y;
        }
        if (x === 0 && y === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        // Excel ATAN2(x_num, y_num) is atan2(y, x) in JS terms (x first).
        return Math.atan2(y, x).toString();
    }

    /**
     * Returns the sign of a number.
     *
     * Excel: `SIGN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSIGN(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        return (num > 0 ? 1 : num < 0 ? -1 : 0).toString();
    }

    /**
     * Returns the integer portion of a division.
     *
     * Excel: `QUOTIENT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeQUOTIENT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const numerator: number | string = this.resolveNumberArg(args[0]);
        const denominator: number | string = this.resolveNumberArg(args[1]);
        if (typeof numerator === 'string') {
            return numerator;
        }
        if (typeof denominator === 'string') {
            return denominator;
        }
        if (denominator === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        return Math.trunc(numerator / denominator).toString();
    }
}
