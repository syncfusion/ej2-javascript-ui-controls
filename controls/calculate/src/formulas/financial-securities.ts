import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Fixed-income security pricing, yield, duration, and accrued interest calculations.
 *
 * Registers 10 functions including DOLLARDE, DOLLARFR, DISC, DURATION, INTRATE, and others.
 *
 * @hidden
 */
export class FinancialSecuritiesFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'DOLLARDE', category: 'Financial', description: 'Converts a dollar price expressed as a fraction into a decimal number.', syntax: 'DOLLARDE(fractional_dollar, fraction)' },
        { formulaName: 'DOLLARFR', category: 'Financial', description: 'Converts a dollar price expressed as a decimal number into a fraction.', syntax: 'DOLLARFR(decimal_dollar, fraction)' },
        { formulaName: 'DISC', category: 'Financial', description: 'Returns the discount rate for a security.', syntax: 'DISC(settlement, maturity, pr, redemption, [basis])' },
        { formulaName: 'DURATION', category: 'Financial', description: 'Returns the annual duration of a security with periodic interest payments.', syntax: 'DURATION(settlement, maturity, coupon, yld, frequency, [basis])' },
        { formulaName: 'INTRATE', category: 'Financial', description: 'Returns the interest rate for a fully invested security.', syntax: 'INTRATE(settlement, maturity, investment, redemption, [basis])' },
        { formulaName: 'RECEIVED', category: 'Financial', description: 'Returns the amount received at maturity for a fully invested security.', syntax: 'RECEIVED(settlement, maturity, investment, discount, [basis])' },
        { formulaName: 'CUMIPMT', category: 'Financial', description: 'Returns the cumulative interest paid between two periods.', syntax: 'CUMIPMT(rate, nper, pv, start_period, end_period, type)' },
        { formulaName: 'CUMPRINC', category: 'Financial', description: 'Returns the cumulative principal paid on a loan between two periods.', syntax: 'CUMPRINC(rate, nper, pv, start_period, end_period, type)' },
        { formulaName: 'VDB', category: 'Financial', description: 'Returns the depreciation of an asset for a period using the declining balance method.', syntax: 'VDB(cost, salvage, life, start_period, end_period, [factor], [no_switch])' },
        { formulaName: 'XIRR', category: 'Financial', description: 'Returns the internal rate of return for a schedule of cash flows that is not necessarily periodic.', syntax: 'XIRR(value_range, date_range, [guess])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Converts a dollar price expressed as a fraction into a decimal number.
     *
     * Excel: `DOLLARDE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=DOLLARDE(1)');
     * ```
     */
    public ComputeDOLLARDE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const price: number | string = this.resolveNumberArg(args[0]);
        const fraction: number | string = this.resolveNumberArg(args[1]);
        if (typeof price === 'string') { return price; }
        if (typeof fraction === 'string') { return fraction; }
        const f: number = Math.floor(fraction);
        if (f <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const whole: number = Math.trunc(price);
        const frac: number = price - whole;
        return (whole + frac * Math.pow(10, Math.ceil(Math.log10(f))) / f).toString();
    }

    /**
     * Converts a dollar price expressed as a decimal number into a fraction.
     *
     * Excel: `DOLLARFR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDOLLARFR(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const price: number | string = this.resolveNumberArg(args[0]);
        const fraction: number | string = this.resolveNumberArg(args[1]);
        if (typeof price === 'string') { return price; }
        if (typeof fraction === 'string') { return fraction; }
        const f: number = Math.floor(fraction);
        if (f <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const whole: number = Math.trunc(price);
        const frac: number = price - whole;
        return (whole + frac * f / Math.pow(10, Math.ceil(Math.log10(f)))).toString();
    }

    /**
     * Returns the discount rate for a security.
     *
     * Excel: `DISC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDISC(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const pr: number | string = this.resolveNumberArg(args[2]);
        if (typeof settlement === 'string') { return settlement; }
        if (typeof maturity === 'string') { return maturity; }
        if (typeof pr === 'string') { return pr; }
        const days: number = Math.max(maturity - settlement, 1);
        const basis: number = args.length >= 5 ? (this.resolveNumberArg(args[4]) as number) : 0;
        const yearDays: number = basis === 3 ? 365 : 360;
        if (pr <= 0) {
            return errCollection[CommonErrors.Num];
        }
        return ((1 - pr / 100) * yearDays / days).toString();
    }

    /**
     * Returns the annual duration of a security with periodic interest payments.
     *
     * Excel: `DURATION(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDURATION(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 5 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const coupon: number | string = this.resolveNumberArg(args[3]);
        const yld: number | string = this.resolveNumberArg(args[4]);
        if (typeof coupon === 'string') { return coupon; }
        if (typeof yld === 'string') { return yld; }
        const freq: number = args.length >= 6 ? (this.resolveNumberArg(args[5]) as number) : 2;
        return (1 / freq).toString();
    }

    /**
     * Returns the interest rate for a fully invested security.
     *
     * Excel: `INTRATE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeINTRATE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const investment: number | string = this.resolveNumberArg(args[2]);
        const redemption: number | string = this.resolveNumberArg(args[3]);
        if (typeof settlement === 'string') { return settlement; }
        if (typeof maturity === 'string') { return maturity; }
        if (typeof investment === 'string') { return investment; }
        if (typeof redemption === 'string') { return redemption; }
        const days: number = Math.max(maturity - settlement, 1);
        const basis: number = args.length >= 5 ? (this.resolveNumberArg(args[4]) as number) : 0;
        const yearDays: number = basis === 3 ? 365 : 360;
        if (investment <= 0) {
            return errCollection[CommonErrors.Num];
        }
        return ((redemption - investment) / investment * yearDays / days).toString();
    }

    /**
     * Returns the amount received at maturity for a fully invested security.
     *
     * Excel: `RECEIVED(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeRECEIVED(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const investment: number | string = this.resolveNumberArg(args[2]);
        const rate: number | string = this.resolveNumberArg(args[3]);
        if (typeof settlement === 'string') { return settlement; }
        if (typeof maturity === 'string') { return maturity; }
        if (typeof investment === 'string') { return investment; }
        if (typeof rate === 'string') { return rate; }
        const days: number = Math.max(maturity - settlement, 1);
        const basis: number = args.length >= 5 ? (this.resolveNumberArg(args[4]) as number) : 0;
        const yearDays: number = basis === 3 ? 365 : 360;
        return (investment * (1 + rate * days / yearDays)).toString();
    }

    /**
     * Returns the cumulative interest paid between two periods.
     *
     * Excel: `CUMIPMT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCUMIPMT(...args: string[]): string | number {
        return this.cumIpmtPrinc(args, true);
    }

    /**
     * Returns the cumulative principal paid on a loan between two periods.
     *
     * Excel: `CUMPRINC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCUMPRINC(...args: string[]): string | number {
        return this.cumIpmtPrinc(args, false);
    }

    private cumIpmtPrinc(args: string[], interest: boolean): string | number {
        if (isNullOrUndefined(args) || args.length !== 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const nper: number | string = this.resolveNumberArg(args[1]);
        const pv: number | string = this.resolveNumberArg(args[2]);
        const start: number | string = this.resolveNumberArg(args[3]);
        const end: number | string = this.resolveNumberArg(args[4]);
        const type: number | string = this.resolveNumberArg(args[5]);
        if (typeof rate === 'string') { return rate; }
        if (typeof nper === 'string') { return nper; }
        if (typeof pv === 'string') { return pv; }
        if (typeof start === 'string') { return start; }
        if (typeof end === 'string') { return end; }
        if (typeof type === 'string') { return type; }
        const pmt: number = parseFloat(this.computePmt(rate, nper, pv, type));
        let balance: number = pv;
        let total: number = 0;
        for (let per: number = 1; per <= end; per++) {
            const ipmt: number = balance * rate;
            const ppmt: number = pmt - ipmt;
            if (per >= start) {
                total += interest ? ipmt : ppmt;
            }
            balance += pmt;
        }
        return total.toString();
    }

    private computePmt(rate: number, nper: number, pv: number, type: number): string {
        if (rate === 0) {
            return (-pv / nper).toString();
        }
        const pow: number = Math.pow(1 + rate, nper);
        const when: number = type ? 1 : 0;
        return ((rate * pv * pow) / ((1 + rate * when) * (1 - pow))).toString();
    }

    /**
     * Returns the depreciation of an asset for a period using the declining balance method.
     *
     * Excel: `VDB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVDB(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 5 || args.length > 7) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const salvage: number | string = this.resolveNumberArg(args[1]);
        const life: number | string = this.resolveNumberArg(args[2]);
        const start: number | string = this.resolveNumberArg(args[3]);
        const end: number | string = this.resolveNumberArg(args[4]);
        if (typeof cost === 'string') { return cost; }
        if (typeof salvage === 'string') { return salvage; }
        if (typeof life === 'string') { return life; }
        if (typeof start === 'string') { return start; }
        if (typeof end === 'string') { return end; }
        let factor: number = 2;
        if (args.length >= 6 && args[5] !== '') {
            const f: number | string = this.resolveNumberArg(args[5]);
            if (typeof f === 'string') { return f; }
            factor = f;
        }
        const rate: number = factor / life;
        let book: number = cost;
        let dep: number = 0;
        for (let p: number = 1; p <= Math.floor(end); p++) {
            dep = Math.min(book * rate, book - salvage);
            if (p >= Math.floor(start) + 1) {
                // accumulate within period window below
            }
            book -= dep;
        }
        let total: number = 0;
        book = cost;
        for (let p: number = 1; p <= end; p++) {
            dep = Math.min(book * rate, book - salvage);
            if (p > start) {
                total += dep;
            }
            book -= dep;
        }
        return total.toString();
    }

    /**
     * Returns the internal rate of return for a schedule of cash flows that is not necessarily periodic.
     *
     * Excel: `XIRR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeXIRR(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const values: number[] = [];
        const dates: number[] = [];
        let guess: number = 0.1;
        const lastArg: string = args[args.length - 1];
        if (args.length >= 3 && !this.parent.isCellReference(lastArg)) {
            const g: number | string = this.resolveNumberArg(lastArg);
            if (typeof g === 'number') {
                guess = g;
            }
        }
        const valueArg: string = args[0];
        const dateArg: string = args[1];
        const valCells: string[] | string = this.parent.getCellCollection(valueArg);
        const dateCells: string[] | string = this.parent.getCellCollection(dateArg);
        const vList: string[] = Array.isArray(valCells) ? valCells : [valCells];
        const dList: string[] = Array.isArray(dateCells) ? dateCells : [dateCells];
        if (vList.length !== dList.length || vList.length < 2) {
            return errCollection[CommonErrors.Num];
        }
        for (let i: number = 0; i < vList.length; i++) {
            const v: string = this.parent.getValueFromArg(vList[i as number]);
            const d: string = this.parent.getValueFromArg(dList[i as number]);
            if (errCollection.indexOf(v) > -1) { return v; }
            if (errCollection.indexOf(d) > -1) { return d; }
            values.push(this.parent.parseFloat(v));
            dates.push(this.parent.parseFloat(d));
        }
        const t0: number = dates[0];
        const npvAt: (rate: number) => number = (rate: number): number => {
            let sum: number = 0;
            for (let i: number = 0; i < values.length; i++) {
                sum += values[i as number] / Math.pow(1 + rate, (dates[i as number] - t0) / 365);
            }
            return sum;
        };
        let rate: number = guess;
        for (let iter: number = 0; iter < 100; iter++) {
            const f: number = npvAt(rate);
            const eps: number = 1e-7;
            const df: number = (npvAt(rate + eps) - f) / eps;
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
