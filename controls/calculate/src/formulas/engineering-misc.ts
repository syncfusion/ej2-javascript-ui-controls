import { FormulasErrorsStrings, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';
import { erf, erfc } from './formula-math-helpers';

/**
 * Miscellaneous engineering functions including delta, gestep, and related step/threshold helpers.
 *
 * Registered functions: DELTA, GESTEP, ERF, ERFC.
 *
 * @hidden
 */
export class EngineeringMiscFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'DELTA', category: 'Engineering', description: 'Tests whether two values are equal.', syntax: 'DELTA(number1, [number2])' },
        { formulaName: 'GESTEP', category: 'Engineering', description: 'Tests whether a number is greater than a threshold.', syntax: 'GESTEP(number, [step])' },
        { formulaName: 'ERF', category: 'Engineering', description: 'Returns the error function.', syntax: 'ERF(lower_limit, [upper_limit])' },
        { formulaName: 'ERFC', category: 'Engineering', description: 'Returns the complementary error function.', syntax: 'ERFC(x)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Tests whether two values are equal.
     *
     * Excel: `DELTA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=DELTA(1)');
     * ```
     */
    public ComputeDELTA(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const a: number | string = this.resolveNumberArg(args[0]);
        if (typeof a === 'string') {
            return a;
        }
        let b: number = 0;
        if (args.length === 2) {
            const bArg: number | string = this.resolveNumberArg(args[1]);
            if (typeof bArg === 'string') {
                return bArg;
            }
            b = bArg;
        }
        return (a === b ? 1 : 0).toString();
    }

    /**
     * Tests whether a number is greater than a threshold.
     *
     * Excel: `GESTEP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeGESTEP(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const num: number | string = this.resolveNumberArg(args[0]);
        if (typeof num === 'string') {
            return num;
        }
        let step: number = 0;
        if (args.length === 2) {
            const stepArg: number | string = this.resolveNumberArg(args[1]);
            if (typeof stepArg === 'string') {
                return stepArg;
            }
            step = stepArg;
        }
        return (num >= step ? 1 : 0).toString();
    }

    /**
     * Returns the error function.
     *
     * Excel: `ERF(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeERF(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (args.length === 1) {
            const x: number | string = this.resolveNumberArg(args[0]);
            if (typeof x === 'string') {
                return x;
            }
            return erf(x).toString();
        }
        const lower: number | string = this.resolveNumberArg(args[0]);
        const upper: number | string = this.resolveNumberArg(args[1]);
        if (typeof lower === 'string') {
            return lower;
        }
        if (typeof upper === 'string') {
            return upper;
        }
        return (erf(upper) - erf(lower)).toString();
    }

    /**
     * Returns the complementary error function.
     *
     * Excel: `ERFC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeERFC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        if (typeof x === 'string') {
            return x;
        }
        return erfc(x).toString();
    }
}
