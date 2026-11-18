import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';
import { ComplexValue, parseComplexText, formatComplex } from './formula-math-helpers';

/**
 * Complex-number arithmetic, polar/rectangular conversion, and complex transcendental functions.
 *
 * Registers 18 functions including COMPLEX, IMABS, IMAGINARY, IMREAL, IMCONJUGATE, and others.
 *
 * @hidden
 */
export class ComplexNumbersFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'COMPLEX', category: 'Engineering', description: 'Converts real and imaginary coefficients into a complex number.', syntax: 'COMPLEX(real_num, i_num, [suffix])' },
        { formulaName: 'IMABS', category: 'Engineering', description: 'Returns the absolute value (modulus) of a complex number.', syntax: 'IMABS(inumber)' },
        { formulaName: 'IMAGINARY', category: 'Engineering', description: 'Returns the imaginary coefficient of a complex number.', syntax: 'IMAGINARY(inumber)' },
        { formulaName: 'IMREAL', category: 'Engineering', description: 'Returns the real coefficient of a complex number.', syntax: 'IMREAL(inumber)' },
        { formulaName: 'IMCONJUGATE', category: 'Engineering', description: 'Returns the complex conjugate of a complex number.', syntax: 'IMCONJUGATE(inumber)' },
        { formulaName: 'IMSUM', category: 'Engineering', description: 'Returns the sum of complex numbers.', syntax: 'IMSUM(inumber1, [inumber2], ...)' },
        { formulaName: 'IMSUB', category: 'Engineering', description: 'Returns the difference between two complex numbers.', syntax: 'IMSUB(inumber1, inumber2)' },
        { formulaName: 'IMPRODUCT', category: 'Engineering', description: 'Returns the product of complex numbers.', syntax: 'IMPRODUCT(inumber1, [inumber2], ...)' },
        { formulaName: 'IMDIV', category: 'Engineering', description: 'Returns the quotient of two complex numbers.', syntax: 'IMDIV(inumber1, inumber2)' },
        { formulaName: 'IMSIN', category: 'Engineering', description: 'Returns the sine of a complex number.', syntax: 'IMSIN(inumber)' },
        { formulaName: 'IMCOS', category: 'Engineering', description: 'Returns the cosine of a complex number.', syntax: 'IMCOS(inumber)' },
        { formulaName: 'IMEXP', category: 'Engineering', description: 'Returns the exponential of a complex number.', syntax: 'IMEXP(inumber)' },
        { formulaName: 'IMLN', category: 'Engineering', description: 'Returns the natural logarithm of a complex number.', syntax: 'IMLN(inumber)' },
        { formulaName: 'IMSQRT', category: 'Engineering', description: 'Returns the square root of a complex number.', syntax: 'IMSQRT(inumber)' },
        { formulaName: 'IMPOWER', category: 'Engineering', description: 'Returns a complex number raised to an integer power.', syntax: 'IMPOWER(inumber, number)' },
        { formulaName: 'IMARGUMENT', category: 'Engineering', description: 'Returns the argument theta of a complex number in radians.', syntax: 'IMARGUMENT(inumber)' },
        { formulaName: 'IMLOG10', category: 'Engineering', description: 'Returns the base-10 logarithm of a complex number.', syntax: 'IMLOG10(inumber)' },
        { formulaName: 'IMLOG2', category: 'Engineering', description: 'Returns the base-2 logarithm of a complex number.', syntax: 'IMLOG2(inumber)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private resolveComplex(arg: string): ComplexValue | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const text: string = this.resolveTextArg(arg);
        if (errCollection.indexOf(text) > -1) {
            return text;
        }
        const parsed: ComplexValue | null = parseComplexText(text);
        if (!parsed) {
            return errCollection[CommonErrors.Num];
        }
        return parsed;
    }

    /**
     * Converts real and imaginary coefficients into a complex number.
     *
     * Excel: `COMPLEX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=COMPLEX(1)');
     * ```
     */
    public ComputeCOMPLEX(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const re: number | string = this.resolveNumberArg(args[0]);
        const im: number | string = this.resolveNumberArg(args[1]);
        if (typeof re === 'string') { return re; }
        if (typeof im === 'string') { return im; }
        let suffix: string = 'i';
        if (args.length === 3) {
            suffix = this.resolveTextArg(args[2]);
            if (suffix !== 'i' && suffix !== 'j') {
                return this.parent.getErrorStrings()[CommonErrors.Value];
            }
        }
        return formatComplex(re, im, suffix);
    }

    /**
     * Returns the absolute value (modulus) of a complex number.
     *
     * Excel: `IMABS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMABS(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        return Math.sqrt(c.re * c.re + c.im * c.im).toString();
    }

    /**
     * Returns the imaginary coefficient of a complex number.
     *
     * Excel: `IMAGINARY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMAGINARY(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        return c.im.toString();
    }

    /**
     * Returns the real coefficient of a complex number.
     *
     * Excel: `IMREAL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMREAL(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        return c.re.toString();
    }

    /**
     * Returns the complex conjugate of a complex number.
     *
     * Excel: `IMCONJUGATE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMCONJUGATE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        return formatComplex(c.re, -c.im);
    }

    /**
     * Returns the sum of complex numbers.
     *
     * Excel: `IMSUM(...)`.
     *
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMSUM(...args: string[]): string | number {
        return this.complexReduce(args, (a: ComplexValue, b: ComplexValue) => ({ re: a.re + b.re, im: a.im + b.im }));
    }

    /**
     * Returns the difference between two complex numbers.
     *
     * Excel: `IMSUB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMSUB(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const a: ComplexValue | string = this.resolveComplex(args[0]);
        const b: ComplexValue | string = this.resolveComplex(args[1]);
        if (typeof a === 'string') { return a; }
        if (typeof b === 'string') { return b; }
        return formatComplex(a.re - b.re, a.im - b.im);
    }

    /**
     * Returns the product of complex numbers.
     *
     * Excel: `IMPRODUCT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMPRODUCT(...args: string[]): string | number {
        return this.complexReduce(args, (a: ComplexValue, b: ComplexValue) => ({
            re: a.re * b.re - a.im * b.im,
            im: a.re * b.im + a.im * b.re
        }), { re: 1, im: 0 });
    }

    /**
     * Returns the quotient of two complex numbers.
     *
     * Excel: `IMDIV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMDIV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const a: ComplexValue | string = this.resolveComplex(args[0]);
        const b: ComplexValue | string = this.resolveComplex(args[1]);
        if (typeof a === 'string') { return a; }
        if (typeof b === 'string') { return b; }
        const denom: number = b.re * b.re + b.im * b.im;
        if (denom === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        return formatComplex(
            (a.re * b.re + a.im * b.im) / denom,
            (a.im * b.re - a.re * b.im) / denom
        );
    }

    private complexReduce(
        args: string[],
        fn: (a: ComplexValue, b: ComplexValue) => ComplexValue,
        initial?: ComplexValue
    ): string | number {
        if (isNullOrUndefined(args) || args.length < 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let acc: ComplexValue | string = initial !== undefined ? initial : this.resolveComplex(args[0]);
        if (typeof acc === 'string') { return acc; }
        const start: number = initial ? 0 : 1;
        for (let i: number = start; i < args.length; i++) {
            const b: ComplexValue | string = this.resolveComplex(args[i as number]);
            if (typeof b === 'string') { return b; }
            acc = fn(acc as ComplexValue, b);
        }
        return formatComplex((acc as ComplexValue).re, (acc as ComplexValue).im);
    }

    /**
     * Returns the exponential of a complex number.
     *
     * Excel: `IMEXP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMEXP(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        const expRe: number = Math.exp(c.re);
        return formatComplex(expRe * Math.cos(c.im), expRe * Math.sin(c.im));
    }

    /**
     * Returns the natural logarithm of a complex number.
     *
     * Excel: `IMLN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMLN(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        const r: number = Math.sqrt(c.re * c.re + c.im * c.im);
        if (r === 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return formatComplex(Math.log(r), Math.atan2(c.im, c.re));
    }

    /**
     * Returns the base-10 logarithm of a complex number.
     *
     * Excel: `IMLOG10(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMLOG10(...args: string[]): string | number {
        const ln: string | number = this.ComputeIMLN(...args);
        if (typeof ln === 'string' && this.parent.getErrorStrings().indexOf(ln) > -1) {
            return ln;
        }
        const c: ComplexValue | null = parseComplexText(ln.toString());
        if (!c) { return ln; }
        const log10e: number = 1 / Math.LN10;
        return formatComplex(c.re * log10e, c.im * log10e);
    }

    /**
     * Returns the base-2 logarithm of a complex number.
     *
     * Excel: `IMLOG2(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMLOG2(...args: string[]): string | number {
        const ln: string | number = this.ComputeIMLN(...args);
        if (typeof ln === 'string' && this.parent.getErrorStrings().indexOf(ln) > -1) {
            return ln;
        }
        const c: ComplexValue | null = parseComplexText(ln.toString());
        if (!c) { return ln; }
        const log2e: number = 1 / Math.LN2;
        return formatComplex(c.re * log2e, c.im * log2e);
    }

    /**
     * Returns the square root of a complex number.
     *
     * Excel: `IMSQRT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMSQRT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        const r: number = Math.sqrt(c.re * c.re + c.im * c.im);
        const theta: number = Math.atan2(c.im, c.re);
        const sqrtR: number = Math.sqrt(r);
        return formatComplex(sqrtR * Math.cos(theta / 2), sqrtR * Math.sin(theta / 2));
    }

    /**
     * Returns a complex number raised to an integer power.
     *
     * Excel: `IMPOWER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMPOWER(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        const nArg: number | string = this.resolveNumberArg(args[1]);
        if (typeof c === 'string') { return c; }
        if (typeof nArg === 'string') { return nArg; }
        const n: number = Math.floor(nArg);
        const r: number = Math.sqrt(c.re * c.re + c.im * c.im);
        if (r === 0 && n <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const theta: number = Math.atan2(c.im, c.re);
        const rn: number = Math.pow(r, n);
        const angle: number = n * theta;
        return formatComplex(rn * Math.cos(angle), rn * Math.sin(angle));
    }

    /**
     * Returns the argument theta of a complex number in radians.
     *
     * Excel: `IMARGUMENT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMARGUMENT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        if (c.re === 0 && c.im === 0) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        return Math.atan2(c.im, c.re).toString();
    }

    /**
     * Returns the sine of a complex number.
     *
     * Excel: `IMSIN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMSIN(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        return formatComplex(
            Math.sin(c.re) * Math.cosh(c.im),
            Math.cos(c.re) * Math.sinh(c.im)
        );
    }

    /**
     * Returns the cosine of a complex number.
     *
     * Excel: `IMCOS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIMCOS(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const c: ComplexValue | string = this.resolveComplex(args[0]);
        if (typeof c === 'string') { return c; }
        return formatComplex(
            Math.cos(c.re) * Math.cosh(c.im),
            -Math.sin(c.re) * Math.sinh(c.im)
        );
    }
}
