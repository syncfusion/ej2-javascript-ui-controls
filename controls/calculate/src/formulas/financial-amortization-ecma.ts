import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';
import { FinancialBondHelpers } from './financial-bond-helpers';

/**
 * ECMA amortization and odd-period bond pricing/yield functions for European accounting conventions.
 *
 * Registered functions: AMORDEGRC, AMORLINC, ODDFPRICE, ODDFYIELD, ODDLPRICE, ODDLYIELD.
 *
 * @hidden
 */
export class FinancialAmortizationEcmaFormulas extends FormulaModuleBase {
    private bond: FinancialBondHelpers;

    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'AMORDEGRC', category: 'Financial', description: 'Returns the depreciation for each accounting period using a depreciation coefficient.', syntax: 'AMORDEGRC(cost, date_purchased, first_period, salvage, period, rate, [basis])' },
        { formulaName: 'AMORLINC', category: 'Financial', description: 'Returns the depreciation for each accounting period.', syntax: 'AMORLINC(cost, date_purchased, first_period, salvage, period, rate, [basis])' },
        { formulaName: 'ODDFPRICE', category: 'Financial', description: 'Returns the price per $100 face value of a security with an odd first period.', syntax: 'ODDFPRICE(settlement, maturity, issue, first_coupon, rate, yld, redemption, [frequency], [basis])' },
        { formulaName: 'ODDFYIELD', category: 'Financial', description: 'Returns the yield of a security with an odd first period.', syntax: 'ODDFYIELD(settlement, maturity, issue, first_coupon, rate, pr, redemption, [frequency], [basis])' },
        { formulaName: 'ODDLPRICE', category: 'Financial', description: 'Returns the price per $100 face value of a security with an odd last period.', syntax: 'ODDLPRICE(settlement, maturity, last_interest, rate, yld, redemption, [frequency], [basis])' },
        { formulaName: 'ODDLYIELD', category: 'Financial', description: 'Returns the yield of a security with an odd last period.', syntax: 'ODDLYIELD(settlement, maturity, last_interest, rate, pr, redemption, [frequency], [basis])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
        this.bond = new FinancialBondHelpers(this.parent);
    }

    /**
     * Returns the depreciation for each accounting period.
     *
     * Excel: `AMORLINC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=AMORLINC(1)');
     * ```
     */
    public ComputeAMORLINC(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 6 || args.length > 7) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const purchased: number | string = this.resolveNumberArg(args[1]);
        const firstPeriod: number | string = this.resolveNumberArg(args[2]);
        const salvage: number | string = this.resolveNumberArg(args[3]);
        const period: number | string = this.resolveNumberArg(args[4]);
        const rate: number | string = this.resolveNumberArg(args[5]);
        if (typeof cost === 'string') {
            return cost;
        }
        if (typeof purchased === 'string') {
            return purchased;
        }
        if (typeof firstPeriod === 'string') {
            return firstPeriod;
        }
        if (typeof salvage === 'string') {
            return salvage;
        }
        if (typeof period === 'string') {
            return period;
        }
        if (typeof rate === 'string') {
            return rate;
        }
        const p: number = Math.floor(period);
        if (p < 0) {
            return errCollection[CommonErrors.Num];
        }
        const dep: number = Math.min((cost - salvage) * rate * (p + 1), cost - salvage);
        return dep.toString();
    }

    /**
     * Returns the depreciation for each accounting period using a depreciation coefficient.
     *
     * Excel: `AMORDEGRC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeAMORDEGRC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 7 || args.length > 8) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const cost: number | string = this.resolveNumberArg(args[0]);
        const purchased: number | string = this.resolveNumberArg(args[1]);
        const firstPeriod: number | string = this.resolveNumberArg(args[2]);
        const salvage: number | string = this.resolveNumberArg(args[3]);
        const period: number | string = this.resolveNumberArg(args[4]);
        const rate: number | string = this.resolveNumberArg(args[5]);
        const basis: number | string = args.length >= 8 ? this.resolveNumberArg(args[7]) : 0;
        if (typeof cost === 'string') {
            return cost;
        }
        if (typeof purchased === 'string') {
            return purchased;
        }
        if (typeof firstPeriod === 'string') {
            return firstPeriod;
        }
        if (typeof salvage === 'string') {
            return salvage;
        }
        if (typeof period === 'string') {
            return period;
        }
        if (typeof rate === 'string') {
            return rate;
        }
        if (typeof basis === 'string') {
            return basis;
        }
        const coef: number = rate < 0.03 ? 1 : rate < 0.05 ? 1.5 : rate < 0.1 ? 2 : 2.5;
        const linear: string | number = this.ComputeAMORLINC(
            args[0], args[1], args[2], args[3], args[4], (rate * coef).toString()
        );
        return linear;
    }

    private oddBondPrice(args: string[], oddFirst: boolean): string | number {
        if (isNullOrUndefined(args) || args.length < 7 || args.length > 9) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const issue: number | string = this.resolveNumberArg(args[2]);
        const firstCoupon: number | string = this.resolveNumberArg(args[3]);
        const rate: number | string = this.resolveNumberArg(args[4]);
        const yld: number | string = this.resolveNumberArg(args[5]);
        const redemption: number | string = this.resolveNumberArg(args[6]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof issue === 'string') {
            return issue;
        }
        if (typeof firstCoupon === 'string') {
            return firstCoupon;
        }
        if (typeof rate === 'string') {
            return rate;
        }
        if (typeof yld === 'string') {
            return yld;
        }
        if (typeof redemption === 'string') {
            return redemption;
        }
        const freq: number = args.length >= 8 && args[7] !== '' ? (this.resolveNumberArg(args[7]) as number) : 2;
        const basis: number = args.length >= 9 && args[8] !== '' ? (this.resolveNumberArg(args[8]) as number) : 0;
        if (typeof freq === 'string') {
            return freq;
        }
        if (typeof basis === 'string') {
            return basis;
        }
        const n: number = this.bond.coupNum(settlement, maturity, freq, basis);
        const coupon: number = 100 * rate / freq;
        const refDate: number = oddFirst ? firstCoupon : maturity;
        const days: number = this.bond.daysBetween(settlement, refDate, basis);
        const periodDays: number = this.bond.coupDays(settlement, maturity, freq, basis) || 180;
        let price: number = redemption / Math.pow(1 + yld / freq, n + days / periodDays);
        price += coupon * days / periodDays;
        for (let k: number = 1; k <= n; k++) {
            price += coupon / Math.pow(1 + yld / freq, k - 1 + days / periodDays);
        }
        return price.toString();
    }

    /**
     * Returns the price per $100 face value of a security with an odd first period.
     *
     * Excel: `ODDFPRICE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeODDFPRICE(...args: string[]): string | number {
        return this.oddBondPrice(args, true);
    }

    /**
     * Returns the price per $100 face value of a security with an odd last period.
     *
     * Excel: `ODDLPRICE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeODDLPRICE(...args: string[]): string | number {
        return this.oddBondPrice(args, false);
    }

    private oddBondYield(computePrice: (...a: string[]) => string | number, args: string[]): string | number {
        const priceArg: string = args[6];
        const yldGuess: number = 0.05;
        let yld: number = yldGuess;
        const target: number = this.parent.parseFloat(this.resolveNumberArg(priceArg) as string);
        for (let iter: number = 0; iter < 50; iter++) {
            const trialArgs: string[] = args.slice(0, 6).concat([yld.toString()], args.slice(7));
            const p: number = this.parent.parseFloat(computePrice(...trialArgs) as string);
            const diff: number = p - target;
            if (Math.abs(diff) < 1e-6) {
                return yld.toString();
            }
            yld -= diff * 0.0001;
        }
        return yld.toString();
    }

    /**
     * Returns the yield of a security with an odd first period.
     *
     * Excel: `ODDFYIELD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeODDFYIELD(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 8 || args.length > 9) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.oddBondYield(this.ComputeODDFPRICE.bind(this), args);
    }

    /**
     * Returns the yield of a security with an odd last period.
     *
     * Excel: `ODDLYIELD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeODDLYIELD(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 8 || args.length > 9) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        return this.oddBondYield(this.ComputeODDLPRICE.bind(this), args);
    }
}
