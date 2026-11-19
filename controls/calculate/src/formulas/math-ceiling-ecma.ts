import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * ECMA-376 ceiling rounding variants (ISO.CEILING and ECMA.CEILING) with significance-based rounding rules.
 *
 * Registered functions: ISO.CEILING, ECMA.CEILING.
 *
 * @hidden
 */
export class MathCeilingEcmaFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'ISO.CEILING', category: 'Math & Trig', description: 'Rounds a number up to the nearest integer or multiple of significance.', syntax: 'ISO.CEILING(number, [significance])' },
        { formulaName: 'ECMA.CEILING', category: 'Math & Trig', description: 'Rounds a number up, away from zero, to the nearest multiple of significance.', syntax: 'ECMA.CEILING(number, significance)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Rounds a number up to the nearest integer or multiple of significance.
     *
     * Excel: `ISO.CEILING(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=ISO.CEILING(1)');
     * ```
     */
    public ['ComputeISO.CEILING'](...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 1 || args.length > 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        if (typeof x === 'string') {
            return x;
        }
        let sig: number = 1;
        if (args.length === 2 && args[1] !== '') {
            const s: number | string = this.resolveNumberArg(args[1]);
            if (typeof s === 'string') {
                return s;
            }
            sig = Math.abs(s);
        }
        if (x === 0 || sig === 0) {
            return '0';
        }
        const result: number = Math.ceil(x / sig) * sig;
        return result.toString();
    }

    /**
     * Rounds a number up, away from zero, to the nearest multiple of significance.
     *
     * Excel: `ECMA.CEILING(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ['ComputeECMA.CEILING'](...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const sig: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') {
            return x;
        }
        if (typeof sig === 'string') {
            return sig;
        }
        if (x === 0 || sig === 0) {
            return '0';
        }
        if (x > 0 && sig < 0) {
            return errCollection[CommonErrors.Num];
        }
        let result: number;
        if (x > 0) {
            result = Math.ceil(x / sig) * sig;
        } else if (sig > 0) {
            result = Math.ceil(x / sig) * sig;
        } else {
            result = Math.floor(x / sig) * sig;
        }
        return result.toString();
    }
}
