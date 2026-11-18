import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Interest rate and yield conversions between nominal, effective, and periodic rates.
 *
 * Registered functions: EFFECT, NOMINAL, FVSCHEDULE.
 *
 * @hidden
 */
export class FinancialRatesFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'EFFECT', category: 'Financial', description: 'Returns the effective annual interest rate.', syntax: 'EFFECT(nominal_rate, npery)' },
        { formulaName: 'NOMINAL', category: 'Financial', description: 'Returns the nominal annual interest rate.', syntax: 'NOMINAL(effect_rate, npery)' },
        { formulaName: 'FVSCHEDULE', category: 'Financial', description: 'Returns the future value of an initial principal after applying compound interest rates.', syntax: 'FVSCHEDULE(principal, schedule)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the effective annual interest rate.
     *
     * Excel: `EFFECT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=EFFECT(1)');
     * ```
     */
    public ComputeEFFECT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const nominal: number | string = this.resolveNumberArg(args[0]);
        const npery: number | string = this.resolveNumberArg(args[1]);
        if (typeof nominal === 'string') { return nominal; }
        if (typeof npery === 'string') { return npery; }
        if (npery < 1) {
            return errCollection[CommonErrors.Num];
        }
        return (Math.pow(1 + nominal / npery, npery) - 1).toString();
    }

    /**
     * Returns the nominal annual interest rate.
     *
     * Excel: `NOMINAL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNOMINAL(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const effect: number | string = this.resolveNumberArg(args[0]);
        const npery: number | string = this.resolveNumberArg(args[1]);
        if (typeof effect === 'string') { return effect; }
        if (typeof npery === 'string') { return npery; }
        if (npery < 1) {
            return errCollection[CommonErrors.Num];
        }
        return (npery * (Math.pow(1 + effect, 1 / npery) - 1)).toString();
    }

    /**
     * Returns the future value of an initial principal after applying compound interest rates.
     *
     * Excel: `FVSCHEDULE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFVSCHEDULE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const principal: number | string = this.resolveNumberArg(args[0]);
        if (typeof principal === 'string') {
            return principal;
        }
        let fv: number = principal;
        for (let i: number = 1; i < args.length; i++) {
            const rate: number | string = this.resolveNumberArg(args[i as number]);
            if (typeof rate === 'string') {
                return rate;
            }
            fv *= 1 + rate;
        }
        return fv.toString();
    }
}
