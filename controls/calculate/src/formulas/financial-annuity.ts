import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Annuity and payment functions: present/future value, payment amount, periods, and interest rate.
 *
 * Registered functions: FV, PV, PMT, NPER, IPMT, PPMT, NPV, RATE.
 *
 * @hidden
 */
export class FinancialAnnuityFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'FV', category: 'Financial', description: 'Returns the future value of an investment.', syntax: 'FV(rate, nper, pmt, [pv], [type])' },
        { formulaName: 'PV', category: 'Financial', description: 'Returns the present value of an investment.', syntax: 'PV(rate, nper, pmt, [fv], [type])' },
        { formulaName: 'PMT', category: 'Financial', description: 'Returns the periodic payment for an annuity.', syntax: 'PMT(rate, nper, pv, [fv], [type])' },
        { formulaName: 'NPER', category: 'Financial', description: 'Returns the number of periods for an investment.', syntax: 'NPER(rate, pmt, pv, [fv], [type])' },
        { formulaName: 'IPMT', category: 'Financial', description: 'Returns the interest payment for an investment for a given period.', syntax: 'IPMT(rate, per, nper, pv, [fv], [type])' },
        { formulaName: 'PPMT', category: 'Financial', description: 'Returns the payment on the principal for an investment for a given period.', syntax: 'PPMT(rate, per, nper, pv, [fv], [type])' },
        { formulaName: 'NPV', category: 'Financial', description: 'Returns the net present value of an investment based on periodic cash flows.', syntax: 'NPV(rate, value1, [value2], ...)' },
        { formulaName: 'RATE', category: 'Financial', description: 'Returns the interest rate per period of an annuity.', syntax: 'RATE(nper, pmt, pv, [fv], [type], [guess])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private resolveOptional(args: string[], index: number, defaultValue: number): number | string {
        if (args.length <= index || args[index as number] === '') {
            return defaultValue;
        }
        return this.resolveNumberArg(args[index as number]);
    }

    /**
     * Returns the future value of an investment.
     *
     * Excel: `FV(...)`.
     *
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=FV(1)');
     * ```
     */
    public ComputeFV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const nper: number | string = this.resolveNumberArg(args[1]);
        const pmt: number | string = this.resolveNumberArg(args[2]);
        if (typeof rate === 'string') { return rate; }
        if (typeof nper === 'string') { return nper; }
        if (typeof pmt === 'string') { return pmt; }
        const pv: number | string = this.resolveOptional(args, 3, 0);
        const type: number | string = this.resolveOptional(args, 4, 0);
        if (typeof pv === 'string') { return pv; }
        if (typeof type === 'string') { return type; }
        if (rate === 0) {
            return (-pv - pmt * nper).toString();
        }
        const pow: number = Math.pow(1 + rate, nper);
        const when: number = type ? 1 : 0;
        const fv: number = -pv * pow - pmt * (1 + rate * when) * (pow - 1) / rate;
        return fv.toString();
    }

    /**
     * Returns the present value of an investment.
     *
     * Excel: `PV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const nper: number | string = this.resolveNumberArg(args[1]);
        const pmt: number | string = this.resolveNumberArg(args[2]);
        if (typeof rate === 'string') { return rate; }
        if (typeof nper === 'string') { return nper; }
        if (typeof pmt === 'string') { return pmt; }
        const fv: number | string = this.resolveOptional(args, 3, 0);
        const type: number | string = this.resolveOptional(args, 4, 0);
        if (typeof fv === 'string') { return fv; }
        if (typeof type === 'string') { return type; }
        if (rate === 0) {
            return (-fv - pmt * nper).toString();
        }
        const pow: number = Math.pow(1 + rate, nper);
        const when: number = type ? 1 : 0;
        const pv: number = (-fv - pmt * (1 + rate * when) * (pow - 1) / rate) / pow;
        return pv.toString();
    }

    /**
     * Returns the periodic payment for an annuity.
     *
     * Excel: `PMT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePMT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const nper: number | string = this.resolveNumberArg(args[1]);
        const pv: number | string = this.resolveNumberArg(args[2]);
        if (typeof rate === 'string') { return rate; }
        if (typeof nper === 'string') { return nper; }
        if (typeof pv === 'string') { return pv; }
        const fv: number | string = this.resolveOptional(args, 3, 0);
        const type: number | string = this.resolveOptional(args, 4, 0);
        if (typeof fv === 'string') { return fv; }
        if (typeof type === 'string') { return type; }
        if (rate === 0) {
            return (-pv - fv) / nper;
        }
        const pow: number = Math.pow(1 + rate, nper);
        const when: number = type ? 1 : 0;
        const pmt: number = (rate * (fv + pv * pow)) / ((1 + rate * when) * (1 - pow));
        return pmt.toString();
    }

    /**
     * Returns the number of periods for an investment.
     *
     * Excel: `NPER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNPER(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const pmt: number | string = this.resolveNumberArg(args[1]);
        const pv: number | string = this.resolveNumberArg(args[2]);
        if (typeof rate === 'string') { return rate; }
        if (typeof pmt === 'string') { return pmt; }
        if (typeof pv === 'string') { return pv; }
        const fv: number | string = this.resolveOptional(args, 3, 0);
        const type: number | string = this.resolveOptional(args, 4, 0);
        if (typeof fv === 'string') { return fv; }
        if (typeof type === 'string') { return type; }
        if (rate === 0) {
            if (pmt === 0) {
                return errCollection[CommonErrors.Num];
            }
            return (-(pv + fv) / pmt).toString();
        }
        const when: number = type ? 1 : 0;
        const num: number = pmt * (1 + rate * when) / rate - fv;
        const den: number = pv + pmt * (1 + rate * when) / rate;
        if (den === 0 || num / den <= 0) {
            return errCollection[CommonErrors.Num];
        }
        return (Math.log(num / den) / Math.log(1 + rate)).toString();
    }

    /**
     * Returns the interest payment for an investment for a given period.
     *
     * Excel: `IPMT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeIPMT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const per: number | string = this.resolveNumberArg(args[1]);
        const nper: number | string = this.resolveNumberArg(args[2]);
        const pv: number | string = this.resolveNumberArg(args[3]);
        if (typeof rate === 'string') { return rate; }
        if (typeof per === 'string') { return per; }
        if (typeof nper === 'string') { return nper; }
        if (typeof pv === 'string') { return pv; }
        const fv: number | string = this.resolveOptional(args, 4, 0);
        const type: number | string = this.resolveOptional(args, 5, 0);
        if (typeof fv === 'string') { return fv; }
        if (typeof type === 'string') { return type; }
        const pmtResult: string | number = this.ComputePMT(rate.toString(), nper.toString(), pv.toString(), fv.toString(), type.toString());
        if (typeof pmtResult === 'string' && this.parent.getErrorStrings().indexOf(pmtResult) > -1) {
            return pmtResult;
        }
        const pmt: number = parseFloat(pmtResult.toString());
        let balance: number = pv;
        for (let i: number = 1; i < per; i++) {
            balance = balance * (1 + rate) + pmt;
        }
        const ipmt: number = balance * rate;
        return ipmt.toString();
    }

    /**
     * Returns the payment on the principal for an investment for a given period.
     *
     * Excel: `PPMT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePPMT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const ipmt: string | number = this.ComputeIPMT(...args);
        if (typeof ipmt === 'string' && this.parent.getErrorStrings().indexOf(ipmt) > -1) {
            return ipmt;
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const nper: number | string = this.resolveNumberArg(args[2]);
        const pv: number | string = this.resolveNumberArg(args[3]);
        const fv: number | string = this.resolveOptional(args, 4, 0);
        const type: number | string = this.resolveOptional(args, 5, 0);
        const pmtResult: string | number = this.ComputePMT(
            (rate as number).toString(), (nper as number).toString(), (pv as number).toString(),
            (typeof fv === 'number' ? fv : 0).toString(), (typeof type === 'number' ? type : 0).toString());
        const pmt: number = parseFloat(pmtResult.toString());
        return (pmt - parseFloat(ipmt.toString())).toString();
    }

    /**
     * Returns the net present value of an investment based on periodic cash flows.
     *
     * Excel: `NPV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNPV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        if (typeof rate === 'string') {
            return rate;
        }
        let npv: number = 0;
        for (let i: number = 1; i < args.length; i++) {
            const cf: number | string = this.resolveNumberArg(args[i as number]);
            if (typeof cf === 'string') {
                return cf;
            }
            npv += cf / Math.pow(1 + rate, i);
        }
        return npv.toString();
    }

    /**
     * Returns the interest rate per period of an annuity.
     *
     * Excel: `RATE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeRATE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const nper: number | string = this.resolveNumberArg(args[0]);
        const pmt: number | string = this.resolveNumberArg(args[1]);
        const pv: number | string = this.resolveNumberArg(args[2]);
        if (typeof nper === 'string') { return nper; }
        if (typeof pmt === 'string') { return pmt; }
        if (typeof pv === 'string') { return pv; }
        const fv: number | string = this.resolveOptional(args, 3, 0);
        const type: number | string = this.resolveOptional(args, 4, 0);
        const guess: number | string = this.resolveOptional(args, 5, 0.1);
        if (typeof fv === 'string') { return fv; }
        if (typeof type === 'string') { return type; }
        if (typeof guess === 'string') { return guess; }
        let rate: number = guess;
        for (let i: number = 0; i < 100; i++) {
            const when: number = type ? 1 : 0;
            const pow: number = Math.pow(1 + rate, nper);
            const f: number = pv * pow + pmt * (1 + rate * when) * (pow - 1) / rate + fv;
            const df: number = nper * pv * Math.pow(1 + rate, nper - 1)
                + pmt * (1 + rate * when) * (nper * Math.pow(1 + rate, nper - 1) * rate - (pow - 1)) / (rate * rate)
                + pmt * when * (pow - 1) / rate;
            if (Math.abs(df) < 1e-12) {
                break;
            }
            const next: number = rate - f / df;
            if (Math.abs(next - rate) < 1e-10) {
                return next.toString();
            }
            rate = next;
        }
        return errCollection[CommonErrors.Num];
    }
}
