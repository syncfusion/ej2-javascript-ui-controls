import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';
import { FinancialBondHelpers } from './financial-bond-helpers';

/**
 * Bond coupon payment schedules, accrued interest, and coupon-period date boundaries.
 *
 * Registers 20 functions including COUPDAYBS, COUPDAYS, COUPDAYSNC, COUPNCD, COUPNUM, and others.
 *
 * @hidden
 */
export class FinancialCouponsFormulas extends FormulaModuleBase {
    private bond: FinancialBondHelpers;

    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'COUPDAYBS', category: 'Financial', description: 'Returns the number of days from the beginning of the coupon period to the settlement date.', syntax: 'COUPDAYBS(settlement, maturity, frequency, [basis])' },
        { formulaName: 'COUPDAYS', category: 'Financial', description: 'Returns the number of days in the coupon period that contains the settlement date.', syntax: 'COUPDAYS(settlement, maturity, frequency, [basis])' },
        { formulaName: 'COUPDAYSNC', category: 'Financial', description: 'Returns the number of days from the settlement date to the next coupon date.', syntax: 'COUPDAYSNC(settlement, maturity, frequency, [basis])' },
        { formulaName: 'COUPNCD', category: 'Financial', description: 'Returns the next coupon date after the settlement date.', syntax: 'COUPNCD(settlement, maturity, frequency, [basis])' },
        { formulaName: 'COUPNUM', category: 'Financial', description: 'Returns the number of coupons payable between settlement and maturity.', syntax: 'COUPNUM(settlement, maturity, frequency, [basis])' },
        { formulaName: 'COUPPCD', category: 'Financial', description: 'Returns the previous coupon date before the settlement date.', syntax: 'COUPPCD(settlement, maturity, frequency, [basis])' },
        { formulaName: 'ACCRINT', category: 'Financial', description: 'Returns the accrued interest for a security that pays periodic interest.', syntax: 'ACCRINT(issue, first_interest, settlement, rate, par, frequency, [basis], [calc_method])' },
        { formulaName: 'ACCRINTM', category: 'Financial', description: 'Returns the accrued interest for a security that pays interest at maturity.', syntax: 'ACCRINTM(issue, settlement, rate, par, [basis])' },
        { formulaName: 'ISPMT', category: 'Financial', description: 'Returns the interest paid during a specific period of an investment.', syntax: 'ISPMT(rate, per, nper, pv)' },
        { formulaName: 'MDURATION', category: 'Financial', description: 'Returns the modified Macauley duration for a security with an assumed par value of $100.', syntax: 'MDURATION(settlement, maturity, coupon, yld, frequency, [basis])' },
        { formulaName: 'PRICE', category: 'Financial', description: 'Returns the price per $100 face value of a security that pays periodic interest.', syntax: 'PRICE(settlement, maturity, rate, yld, redemption, frequency, [basis])' },
        { formulaName: 'PRICEDISC', category: 'Financial', description: 'Returns the price per $100 face value of a discounted security.', syntax: 'PRICEDISC(settlement, maturity, discount, redemption, [basis])' },
        { formulaName: 'PRICEMAT', category: 'Financial', description: 'Returns the price per $100 face value of a security that pays interest at maturity.', syntax: 'PRICEMAT(settlement, maturity, issue, rate, yld, [basis])' },
        { formulaName: 'TBILLEQ', category: 'Financial', description: 'Returns the bond-equivalent yield for a Treasury bill.', syntax: 'TBILLEQ(settlement, maturity, discount)' },
        { formulaName: 'TBILLPRICE', category: 'Financial', description: 'Returns the price per $100 face value for a Treasury bill.', syntax: 'TBILLPRICE(settlement, maturity, discount)' },
        { formulaName: 'TBILLYIELD', category: 'Financial', description: 'Returns the yield for a Treasury bill.', syntax: 'TBILLYIELD(settlement, maturity, pr)' },
        { formulaName: 'XNPV', category: 'Financial', description: 'Returns the net present value for a schedule of cash flows that is not necessarily periodic.', syntax: 'XNPV(rate, values, dates)' },
        { formulaName: 'YIELD', category: 'Financial', description: 'Returns the yield on a security that pays periodic interest.', syntax: 'YIELD(settlement, maturity, rate, pr, redemption, frequency, [basis])' },
        { formulaName: 'YIELDDISC', category: 'Financial', description: 'Returns the annual yield for a discounted security.', syntax: 'YIELDDISC(settlement, maturity, pr, redemption, [basis])' },
        { formulaName: 'YIELDMAT', category: 'Financial', description: 'Returns the annual yield of a security that pays interest at maturity.', syntax: 'YIELDMAT(settlement, maturity, issue, rate, pr, [basis])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
        this.bond = new FinancialBondHelpers(this.parent);
    }

    private parseBondArgs(args: string[], minLen: number, maxLen: number): {
        settlement: number, maturity: number, rate?: number, yld?: number, redemption?: number,
        frequency?: number, basis?: number
    } | string {
        if (isNullOrUndefined(args) || args.length < minLen || args.length > maxLen) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        const result: {
            settlement: number, maturity: number, rate?: number, yld?: number, redemption?: number,
            frequency?: number, basis?: number
        } = { settlement, maturity };
        if (args.length >= 3) {
            const rate: number | string = this.resolveNumberArg(args[2]);
            if (typeof rate === 'string') {
                return rate;
            }
            result.rate = rate;
        }
        if (args.length >= 4) {
            const yld: number | string = this.resolveNumberArg(args[3]);
            if (typeof yld === 'string') {
                return yld;
            }
            result.yld = yld;
        }
        if (args.length >= 5) {
            const red: number | string = this.resolveNumberArg(args[4]);
            if (typeof red === 'string') {
                return red;
            }
            result.redemption = red;
        }
        result.frequency = args.length >= 6 && args[5] !== '' ? (this.resolveNumberArg(args[5]) as number) : 2;
        if (typeof result.frequency === 'string') {
            return result.frequency;
        }
        result.basis = args.length >= 7 && args[6] !== '' ? (this.resolveNumberArg(args[6]) as number) : 0;
        if (typeof result.basis === 'string') {
            return result.basis;
        }
        return result;
    }

    private coupArgs(args: string[]): { settlement: number, maturity: number, frequency: number, basis: number } | string {
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const frequency: number | string = this.resolveNumberArg(args[2]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof frequency === 'string') {
            return frequency;
        }
        let basis: number = 0;
        if (args.length === 4 && args[3] !== '') {
            const b: number | string = this.resolveNumberArg(args[3]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        return { settlement, maturity, frequency: Math.floor(frequency), basis };
    }

    /**
     * Returns the number of days from the beginning of the coupon period to the settlement date.
     *
     * Excel: `COUPDAYBS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=COUPDAYBS(1)');
     * ```
     */
    public ComputeCOUPDAYBS(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['coupArgs']> = this.coupArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return this.bond.coupDayBS(parsed.settlement, parsed.maturity, parsed.frequency, parsed.basis).toString();
    }

    /**
     * Returns the number of days in the coupon period that contains the settlement date.
     *
     * Excel: `COUPDAYS(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUPDAYS(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['coupArgs']> = this.coupArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return this.bond.coupDays(parsed.settlement, parsed.maturity, parsed.frequency, parsed.basis).toString();
    }

    /**
     * Returns the number of days from the settlement date to the next coupon date.
     *
     * Excel: `COUPDAYSNC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUPDAYSNC(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['coupArgs']> = this.coupArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return this.bond.coupDaysNC(parsed.settlement, parsed.maturity, parsed.frequency, parsed.basis).toString();
    }

    /**
     * Returns the next coupon date after the settlement date.
     *
     * Excel: `COUPNCD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUPNCD(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['coupArgs']> = this.coupArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return this.bond.coupNCD(parsed.settlement, parsed.maturity, parsed.frequency).toString();
    }

    /**
     * Returns the number of coupons payable between settlement and maturity.
     *
     * Excel: `COUPNUM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUPNUM(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['coupArgs']> = this.coupArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return this.bond.coupNum(parsed.settlement, parsed.maturity, parsed.frequency, parsed.basis).toString();
    }

    /**
     * Returns the previous coupon date before the settlement date.
     *
     * Excel: `COUPPCD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOUPPCD(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['coupArgs']> = this.coupArgs(args);
        if (typeof parsed === 'string') {
            return parsed;
        }
        return this.bond.coupPCD(parsed.settlement, parsed.maturity, parsed.frequency).toString();
    }

    /**
     * Returns the accrued interest for a security that pays periodic interest.
     *
     * Excel: `ACCRINT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeACCRINT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const parsed: ReturnType<FinancialCouponsFormulas['parseBondArgs']> = this.parseBondArgs(args, 6, 8);
        if (typeof parsed === 'string') {
            return parsed;
        }
        const issue: number | string = args.length >= 8 ? this.resolveNumberArg(args[7]) : parsed.settlement;
        if (typeof issue === 'string') {
            return issue;
        }
        const rate: number = parsed.rate as number;
        const freq: number = parsed.frequency as number;
        const basis: number = parsed.basis as number;
        const days: number = this.bond.coupDayBS(parsed.settlement, parsed.maturity, freq, basis);
        const periodDays: number = this.bond.coupDays(parsed.settlement, parsed.maturity, freq, basis);
        if (periodDays === 0) {
            return errCollection[CommonErrors.Num];
        }
        const par: number = args.length >= 7 && args[6] !== '' ? (this.resolveNumberArg(args[6]) as number) : 1000;
        return (par * rate / freq * days / periodDays).toString();
    }

    /**
     * Returns the accrued interest for a security that pays interest at maturity.
     *
     * Excel: `ACCRINTM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeACCRINTM(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const issue: number | string = this.resolveNumberArg(args[0]);
        const settlement: number | string = this.resolveNumberArg(args[1]);
        const rate: number | string = this.resolveNumberArg(args[2]);
        const par: number | string = this.resolveNumberArg(args[3]);
        if (typeof issue === 'string') {
            return issue;
        }
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof rate === 'string') {
            return rate;
        }
        if (typeof par === 'string') {
            return par;
        }
        let basis: number = 0;
        if (args.length === 5 && args[4] !== '') {
            const b: number | string = this.resolveNumberArg(args[4]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        const days: number = this.bond.daysBetween(issue, settlement, basis);
        const yearDays: number = this.bond.yearDays(basis);
        return (par * rate * days / yearDays).toString();
    }

    /**
     * Returns the interest paid during a specific period of an investment.
     *
     * Excel: `ISPMT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeISPMT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        const per: number | string = this.resolveNumberArg(args[1]);
        const nper: number | string = this.resolveNumberArg(args[2]);
        const pv: number | string = this.resolveNumberArg(args[3]);
        if (typeof rate === 'string') {
            return rate;
        }
        if (typeof per === 'string') {
            return per;
        }
        if (typeof nper === 'string') {
            return nper;
        }
        if (typeof pv === 'string') {
            return pv;
        }
        const p: number = Math.floor(per);
        if (p < 1 || p > nper) {
            return errCollection[CommonErrors.Num];
        }
        return (-pv * rate * (1 - (p - 1) / nper)).toString();
    }

    /**
     * Returns the modified Macauley duration for a security with an assumed par value of $100.
     *
     * Excel: `MDURATION(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMDURATION(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['parseBondArgs']> = this.parseBondArgs(args, 5, 7);
        if (typeof parsed === 'string') {
            return parsed;
        }
        const freq: number = parsed.frequency as number;
        const yld: number = parsed.yld as number;
        const duration: number = 1 / freq;
        return (duration / (1 + yld / freq)).toString();
    }

    /**
     * Returns the price per $100 face value of a security that pays periodic interest.
     *
     * Excel: `PRICE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePRICE(...args: string[]): string | number {
        const parsed: ReturnType<FinancialCouponsFormulas['parseBondArgs']> = this.parseBondArgs(args, 6, 7);
        if (typeof parsed === 'string') {
            return parsed;
        }
        const rate: number = parsed.rate as number;
        const yld: number = parsed.yld as number;
        const redemption: number = parsed.redemption as number;
        const freq: number = parsed.frequency as number;
        const basis: number = parsed.basis as number;
        const n: number = this.bond.coupNum(parsed.settlement, parsed.maturity, freq, basis);
        const dsc: number = this.bond.coupDaysNC(parsed.settlement, parsed.maturity, freq, basis);
        const e: number = this.bond.coupDays(parsed.settlement, parsed.maturity, freq, basis);
        const a: number = this.bond.coupDayBS(parsed.settlement, parsed.maturity, freq, basis);
        const coupon: number = 100 * rate / freq;
        let price: number = redemption / Math.pow(1 + yld / freq, n - 1 + dsc / e);
        for (let k: number = 1; k <= n; k++) {
            price += coupon / Math.pow(1 + yld / freq, k - 1 + dsc / e);
        }
        price -= coupon * a / e;
        return price.toString();
    }

    /**
     * Returns the price per $100 face value of a discounted security.
     *
     * Excel: `PRICEDISC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePRICEDISC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const discount: number | string = this.resolveNumberArg(args[2]);
        const redemption: number | string = this.resolveNumberArg(args[3]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof discount === 'string') {
            return discount;
        }
        if (typeof redemption === 'string') {
            return redemption;
        }
        let basis: number = 0;
        if (args.length === 5 && args[4] !== '') {
            const b: number | string = this.resolveNumberArg(args[4]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        const days: number = this.bond.daysBetween(settlement, maturity, basis);
        const yearDays: number = this.bond.yearDays(basis);
        return (redemption * (1 - discount * days / yearDays)).toString();
    }

    /**
     * Returns the price per $100 face value of a security that pays interest at maturity.
     *
     * Excel: `PRICEMAT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePRICEMAT(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 5 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const issue: number | string = this.resolveNumberArg(args[2]);
        const rate: number | string = this.resolveNumberArg(args[3]);
        const yld: number | string = this.resolveNumberArg(args[4]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof issue === 'string') {
            return issue;
        }
        if (typeof rate === 'string') {
            return rate;
        }
        if (typeof yld === 'string') {
            return yld;
        }
        let basis: number = 0;
        if (args.length === 6 && args[5] !== '') {
            const b: number | string = this.resolveNumberArg(args[5]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        const yearDays: number = this.bond.yearDays(basis);
        const ds: number = this.bond.daysBetween(issue, settlement, basis);
        const dm: number = this.bond.daysBetween(issue, maturity, basis);
        return ((100 + rate * dm / yearDays) / (1 + yld * ds / yearDays)).toString();
    }

    /**
     * Returns the price per $100 face value for a Treasury bill.
     *
     * Excel: `TBILLPRICE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTBILLPRICE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const discount: number | string = this.resolveNumberArg(args[2]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof discount === 'string') {
            return discount;
        }
        const days: number = maturity - settlement;
        if (days <= 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return (100 * (1 - discount * days / 360)).toString();
    }

    /**
     * Returns the yield for a Treasury bill.
     *
     * Excel: `TBILLYIELD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTBILLYIELD(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const pr: number | string = this.resolveNumberArg(args[2]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof pr === 'string') {
            return pr;
        }
        const days: number = maturity - settlement;
        if (days <= 0 || pr <= 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return ((100 - pr) / pr * 360 / days).toString();
    }

    /**
     * Returns the bond-equivalent yield for a Treasury bill.
     *
     * Excel: `TBILLEQ(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTBILLEQ(...args: string[]): string | number {
        const yieldResult: string | number = this.ComputeTBILLYIELD(...args);
        const errCollection: string[] = this.parent.getErrorStrings();
        if (typeof yieldResult === 'string' && errCollection.indexOf(yieldResult) > -1) {
            return yieldResult;
        }
        const y: number = this.parent.parseFloat(yieldResult as string);
        return ((365 * y) / (360 - y * (this.resolveNumberArg(args[1]) as number - (this.resolveNumberArg(args[0]) as number)))).toString();
    }

    /**
     * Returns the net present value for a schedule of cash flows that is not necessarily periodic.
     *
     * Excel: `XNPV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeXNPV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const rate: number | string = this.resolveNumberArg(args[0]);
        if (typeof rate === 'string') {
            return rate;
        }
        const values: number[] = [];
        const dates: number[] = [];
        const valCells: string[] | string = this.parent.getCellCollection(args[1]);
        const dateCells: string[] | string = this.parent.getCellCollection(args[2]);
        const vList: string[] = Array.isArray(valCells) ? valCells : [valCells];
        const dList: string[] = Array.isArray(dateCells) ? dateCells : [dateCells];
        if (vList.length !== dList.length || vList.length < 1) {
            return errCollection[CommonErrors.Num];
        }
        for (let i: number = 0; i < vList.length; i++) {
            const v: string = this.parent.getValueFromArg(vList[i as number]);
            const d: string = this.parent.getValueFromArg(dList[i as number]);
            if (errCollection.indexOf(v) > -1) {
                return v;
            }
            if (errCollection.indexOf(d) > -1) {
                return d;
            }
            values.push(this.parent.parseFloat(v));
            dates.push(this.parent.parseFloat(d));
        }
        const t0: number = dates[0];
        let npv: number = 0;
        for (let i: number = 0; i < values.length; i++) {
            npv += values[i as number] / Math.pow(1 + rate, (dates[i as number] - t0) / 365);
        }
        return npv.toString();
    }

    /**
     * Returns the yield on a security that pays periodic interest.
     *
     * Excel: `YIELD(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeYIELD(...args: string[]): string | number {
        const priceResult: string | number = this.ComputePRICE(...args);
        const errCollection: string[] = this.parent.getErrorStrings();
        if (typeof priceResult === 'string' && (errCollection.indexOf(priceResult) > -1 || priceResult.match(/arguments/i))) {
            return priceResult;
        }
        const parsed: ReturnType<FinancialCouponsFormulas['parseBondArgs']> = this.parseBondArgs(args, 6, 7);
        if (typeof parsed === 'string') {
            return parsed;
        }
        const price: number = this.parent.parseFloat(priceResult as string);
        let yld: number = (parsed.yld as number) || 0.05;
        for (let iter: number = 0; iter < 50; iter++) {
            parsed.yld = yld;
            const p: number = this.parent.parseFloat(this.ComputePRICE(
                args[0], args[1], args[2], yld.toString(), args[4], args[5], args[6]
            ) as string);
            const diff: number = p - price;
            if (Math.abs(diff) < 1e-8) {
                return yld.toString();
            }
            yld += diff * 0.0001;
        }
        return yld.toString();
    }

    /**
     * Returns the annual yield for a discounted security.
     *
     * Excel: `YIELDDISC(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeYIELDDISC(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const pr: number | string = this.resolveNumberArg(args[2]);
        const redemption: number | string = this.resolveNumberArg(args[3]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof pr === 'string') {
            return pr;
        }
        if (typeof redemption === 'string') {
            return redemption;
        }
        let basis: number = 0;
        if (args.length === 5 && args[4] !== '') {
            const b: number | string = this.resolveNumberArg(args[4]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        const days: number = this.bond.daysBetween(settlement, maturity, basis);
        const yearDays: number = this.bond.yearDays(basis);
        if (days <= 0) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return ((redemption - pr) / pr * yearDays / days).toString();
    }

    /**
     * Returns the annual yield of a security that pays interest at maturity.
     *
     * Excel: `YIELDMAT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeYIELDMAT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 5 || args.length > 6) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const settlement: number | string = this.resolveNumberArg(args[0]);
        const maturity: number | string = this.resolveNumberArg(args[1]);
        const issue: number | string = this.resolveNumberArg(args[2]);
        const rate: number | string = this.resolveNumberArg(args[3]);
        const pr: number | string = this.resolveNumberArg(args[4]);
        if (typeof settlement === 'string') {
            return settlement;
        }
        if (typeof maturity === 'string') {
            return maturity;
        }
        if (typeof issue === 'string') {
            return issue;
        }
        if (typeof rate === 'string') {
            return rate;
        }
        if (typeof pr === 'string') {
            return pr;
        }
        let basis: number = 0;
        if (args.length === 6 && args[5] !== '') {
            const b: number | string = this.resolveNumberArg(args[5]);
            if (typeof b === 'string') {
                return b;
            }
            basis = Math.floor(b);
        }
        const yearDays: number = this.bond.yearDays(basis);
        const ds: number = this.bond.daysBetween(issue, settlement, basis);
        const dm: number = this.bond.daysBetween(issue, maturity, basis);
        const num: number = (100 + rate * dm / yearDays - pr);
        const den: number = pr * ds / yearDays;
        if (den === 0) {
            return errCollection[CommonErrors.Num];
        }
        return (num / den).toString();
    }
}
