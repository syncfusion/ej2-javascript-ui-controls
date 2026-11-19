import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Net present value and internal rate of return for uneven cash-flow series.
 *
 * Registered functions: IRR, MIRR.
 *
 * @hidden
 */
export class FinancialCashflowFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'IRR', category: 'Financial', description: 'Returns the internal rate of return for a series of cash flows.', syntax: 'IRR(values, [guess])' },
        { formulaName: 'MIRR', category: 'Financial', description: 'Returns the modified internal rate of return for cash flows.', syntax: 'MIRR(value_range, finance_rate, reinvest_rate)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private collectCashflows(args: string[]): number[] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const flows: number[] = [];
        for (let i: number = 0; i < args.length; i++) {
            const arg: string = args[i as number];
            if (arg === '') {
                continue;
            }
            if (this.parent.isCellReference(arg) && arg.indexOf(':') > -1) {
                const cells: string[] | string = this.parent.getCellCollection(arg);
                const list: string[] = Array.isArray(cells) ? cells : [cells];
                for (let c: number = 0; c < list.length; c++) {
                    const val: string = this.parent.getValueFromArg(list[c as number]);
                    if (errCollection.indexOf(val) > -1) {
                        return val;
                    }
                    if (val !== '' && this.parent.isNumber(val)) {
                        flows.push(this.parent.parseFloat(val));
                    }
                }
            } else {
                const num: number | string = this.resolveNumberArg(arg);
                if (typeof num === 'string') {
                    return num;
                }
                flows.push(num);
            }
        }
        return flows;
    }

    private npvAtRate(flows: number[], rate: number): number {
        let npv: number = 0;
        for (let i: number = 0; i < flows.length; i++) {
            npv += flows[i as number] / Math.pow(1 + rate, i);
        }
        return npv;
    }

    private npvDerivative(flows: number[], rate: number): number {
        let d: number = 0;
        for (let i: number = 1; i < flows.length; i++) {
            d -= i * flows[i as number] / Math.pow(1 + rate, i + 1);
        }
        return d;
    }

    /**
     * Returns the internal rate of return for a series of cash flows.
     *
     * Excel: `IRR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=IRR(1)');
     * ```
     */
    public ComputeIRR(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        let guess: number = 0.1;
        let flowArgs: string[] = args;
        if (args.length === 2 && this.parent.isCellReference(args[0])) {
            const guessArg: number | string = this.resolveNumberArg(args[1]);
            if (typeof guessArg === 'number') {
                guess = guessArg;
                flowArgs = [args[0]];
            }
        }
        const flows: number[] | string = this.collectCashflows(flowArgs);
        if (typeof flows === 'string') {
            return flows;
        }
        if (flows.length < 2) {
            return errCollection[CommonErrors.Num];
        }
        let hasPos: boolean = false;
        let hasNeg: boolean = false;
        for (let i: number = 0; i < flows.length; i++) {
            if (flows[i as number] > 0) { hasPos = true; }
            if (flows[i as number] < 0) { hasNeg = true; }
        }
        if (!hasPos || !hasNeg) {
            return errCollection[CommonErrors.Num];
        }
        let rate: number = guess;
        for (let iter: number = 0; iter < 100; iter++) {
            const npv: number = this.npvAtRate(flows, rate);
            const dnpv: number = this.npvDerivative(flows, rate);
            if (Math.abs(dnpv) < 1e-12) {
                break;
            }
            const next: number = rate - npv / dnpv;
            if (Math.abs(next - rate) < 1e-10) {
                return next.toString();
            }
            rate = next;
        }
        return errCollection[CommonErrors.Num];
    }

    /**
     * Returns the modified internal rate of return for cash flows.
     *
     * Excel: `MIRR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMIRR(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const financeRate: number | string = this.resolveNumberArg(args[1]);
        const reinvestRate: number | string = this.resolveNumberArg(args[2]);
        if (typeof financeRate === 'string') { return financeRate; }
        if (typeof reinvestRate === 'string') { return reinvestRate; }
        const flows: number[] | string = this.collectCashflows([args[0]]);
        if (typeof flows === 'string') {
            return flows;
        }
        if (flows.length < 2) {
            return errCollection[CommonErrors.Num];
        }
        const n: number = flows.length - 1;
        let posPv: number = 0;
        let negFv: number = 0;
        for (let i: number = 0; i < flows.length; i++) {
            const cf: number = flows[i as number];
            if (cf >= 0) {
                negFv += cf * Math.pow(1 + reinvestRate, n - i);
            } else {
                posPv += cf / Math.pow(1 + financeRate, i);
            }
        }
        if (posPv === 0 || negFv === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        return (Math.pow(-negFv / posPv, 1 / n) - 1).toString();
    }
}
