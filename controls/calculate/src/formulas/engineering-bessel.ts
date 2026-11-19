import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';
import { besselI, besselJ, besselK, besselY } from './formula-math-helpers';

/**
 * Bessel function family (J, Y, I, K) for oscillatory and decaying physical models.
 *
 * Registered functions: BESSELI, BESSELJ, BESSELK, BESSELY.
 *
 * @hidden
 */
export class EngineeringBesselFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'BESSELI', category: 'Engineering', description: 'Returns the modified Bessel function In(x).', syntax: 'BESSELI(x, n)' },
        { formulaName: 'BESSELJ', category: 'Engineering', description: 'Returns the Bessel function Jn(x).', syntax: 'BESSELJ(x, n)' },
        { formulaName: 'BESSELK', category: 'Engineering', description: 'Returns the modified Bessel function Kn(x).', syntax: 'BESSELK(x, n)' },
        { formulaName: 'BESSELY', category: 'Engineering', description: 'Returns the Bessel function Yn(x).', syntax: 'BESSELY(x, n)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private besselArgs(args: string[]): { x: number, n: number } | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const n: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') {
            return x;
        }
        if (typeof n === 'string') {
            return n;
        }
        if (n < 0) {
            return errCollection[CommonErrors.Num];
        }
        return { x, n: Math.floor(n) };
    }

    /**
     * Returns the modified Bessel function In(x).
     *
     * Excel: `BESSELI(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=BESSELI(1)');
     * ```
     */
    public ComputeBESSELI(...args: string[]): string | number {
        const parsed: { x: number, n: number } | string = this.besselArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        const result: number = besselI(parsed.n, parsed.x);
        if (!isFinite(result)) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the Bessel function Jn(x).
     *
     * Excel: `BESSELJ(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBESSELJ(...args: string[]): string | number {
        const parsed: { x: number, n: number } | string = this.besselArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return besselJ(parsed.n, parsed.x).toString();
    }

    /**
     * Returns the modified Bessel function Kn(x).
     *
     * Excel: `BESSELK(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBESSELK(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const parsed: { x: number, n: number } | string = this.besselArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        if (parsed.x <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const result: number = besselK(parsed.n, parsed.x);
        if (!isFinite(result)) {
            return errCollection[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the Bessel function Yn(x).
     *
     * Excel: `BESSELY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBESSELY(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const parsed: { x: number, n: number } | string = this.besselArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        if (parsed.x <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const result: number = besselY(parsed.n, parsed.x);
        if (!isFinite(result)) {
            return errCollection[CommonErrors.Num];
        }
        return result.toString();
    }
}
