import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';
import { betaDist, betaInv, tCDF, tInv, fCDF } from './formula-math-helpers';

/**
 * ECMA-376 statistical distribution and hypothesis-test functions (beta, t, F, frequency).
 *
 * Registered functions: BETADIST, BETAINV, TDIST, TINV, TTEST, FTEST, FREQUENCY.
 *
 * @hidden
 */
export class StatisticalEcmaFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'BETADIST', category: 'Statistical', description: 'Returns the beta cumulative distribution function.', syntax: 'BETADIST(x, alpha, beta, [A], [B])' },
        { formulaName: 'BETAINV', category: 'Statistical', description: 'Returns the inverse of the beta cumulative distribution function.', syntax: 'BETAINV(probability, alpha, beta, [A], [B])' },
        { formulaName: 'TDIST', category: 'Statistical', description: 'Returns the Student t-distribution.', syntax: 'TDIST(x, deg_freedom, [tails])' },
        { formulaName: 'TINV', category: 'Statistical', description: 'Returns the inverse of the Student t-distribution.', syntax: 'TINV(probability, deg_freedom, [tails])' },
        { formulaName: 'TTEST', category: 'Statistical', description: 'Returns the probability associated with a Student t-test.', syntax: 'TTEST(array1, array2, tails, type)' },
        { formulaName: 'FTEST', category: 'Statistical', description: 'Returns the result of an F-test.', syntax: 'FTEST(array1, array2)' },
        { formulaName: 'FREQUENCY', category: 'Statistical', description: 'Returns the frequency distribution of a range of values.', syntax: 'FREQUENCY(data_range, bins_range)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the beta cumulative distribution function.
     *
     * Excel: `BETADIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=BETADIST(1)');
     * ```
     */
    public ComputeBETADIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const alpha: number | string = this.resolveNumberArg(args[1]);
        const betaParam: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') {
            return x;
        }
        if (typeof alpha === 'string') {
            return alpha;
        }
        if (typeof betaParam === 'string') {
            return betaParam;
        }
        let a: number = 0;
        let b: number = 1;
        if (args.length >= 4 && args[3] !== '') {
            const av: number | string = this.resolveNumberArg(args[3]);
            if (typeof av === 'string') {
                return av;
            }
            a = av;
        }
        if (args.length >= 5 && args[4] !== '') {
            const bv: number | string = this.resolveNumberArg(args[4]);
            if (typeof bv === 'string') {
                return bv;
            }
            b = bv;
        }
        if (x < a || x > b || alpha <= 0 || betaParam <= 0 || a >= b) {
            return errCollection[CommonErrors.Num];
        }
        const scaled: number = (x - a) / (b - a);
        const result: number = betaDist(scaled, alpha, betaParam);
        if (isNaN(result)) {
            return errCollection[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the inverse of the beta cumulative distribution function.
     *
     * Excel: `BETAINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBETAINV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const alpha: number | string = this.resolveNumberArg(args[1]);
        const betaParam: number | string = this.resolveNumberArg(args[2]);
        if (typeof p === 'string') {
            return p;
        }
        if (typeof alpha === 'string') {
            return alpha;
        }
        if (typeof betaParam === 'string') {
            return betaParam;
        }
        let a: number = 0;
        let b: number = 1;
        if (args.length >= 4 && args[3] !== '') {
            const av: number | string = this.resolveNumberArg(args[3]);
            if (typeof av === 'string') {
                return av;
            }
            a = av;
        }
        if (args.length >= 5 && args[4] !== '') {
            const bv: number | string = this.resolveNumberArg(args[4]);
            if (typeof bv === 'string') {
                return bv;
            }
            b = bv;
        }
        const scaled: number = betaInv(p, alpha, betaParam);
        if (isNaN(scaled)) {
            return errCollection[CommonErrors.Num];
        }
        return (a + scaled * (b - a)).toString();
    }

    /**
     * Returns the Student t-distribution.
     *
     * Excel: `TDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTDIST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const df: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') {
            return x;
        }
        if (typeof df === 'string') {
            return df;
        }
        let tails: number = 1;
        if (args.length === 3 && args[2] !== '') {
            const t: number | string = this.resolveNumberArg(args[2]);
            if (typeof t === 'string') {
                return t;
            }
            tails = Math.floor(t);
        }
        const cdf: number = tCDF(Math.abs(x), df);
        const p: number = tails === 1 ? 1 - cdf : 2 * (1 - cdf);
        return p.toString();
    }

    /**
     * Returns the inverse of the Student t-distribution.
     *
     * Excel: `TINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTINV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const df: number | string = this.resolveNumberArg(args[1]);
        if (typeof p === 'string') {
            return p;
        }
        if (typeof df === 'string') {
            return df;
        }
        let tails: number = 2;
        if (args.length === 3 && args[2] !== '') {
            const t: number | string = this.resolveNumberArg(args[2]);
            if (typeof t === 'string') {
                return t;
            }
            tails = Math.floor(t);
        }
        const prob: number = tails === 1 ? 1 - p : 1 - p / 2;
        const result: number = tInv(prob, df);
        if (isNaN(result)) {
            return errCollection[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the probability associated with a Student t-test.
     *
     * Excel: `TTEST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTTEST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const a: number[] | string = this.collectSample([args[0]], false);
        const b: number[] | string = this.collectSample([args[1]], false);
        if (typeof a === 'string') {
            return a;
        }
        if (typeof b === 'string') {
            return b;
        }
        if (a.length < 2 || b.length < 2) {
            return errCollection[CommonErrors.DivZero];
        }
        const meanA: number = this.mean(a);
        const meanB: number = this.mean(b);
        let varA: number = 0;
        let varB: number = 0;
        for (let i: number = 0; i < a.length; i++) {
            varA += Math.pow(a[i as number] - meanA, 2);
        }
        for (let i: number = 0; i < b.length; i++) {
            varB += Math.pow(b[i as number] - meanB, 2);
        }
        varA /= (a.length - 1);
        varB /= (b.length - 1);
        const se: number = Math.sqrt(varA / a.length + varB / b.length);
        if (se === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        const t: number = Math.abs(meanA - meanB) / se;
        const df: number = a.length + b.length - 2;
        let tails: number = 2;
        if (args.length === 4 && args[3] !== '') {
            const tt: number | string = this.resolveNumberArg(args[3]);
            if (typeof tt === 'string') {
                return tt;
            }
            tails = Math.floor(tt);
        }
        const cdf: number = tCDF(t, df);
        const p: number = tails === 1 ? 1 - cdf : 2 * (1 - cdf);
        return p.toString();
    }

    /**
     * Returns the result of an F-test.
     *
     * Excel: `FTEST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFTEST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const a: number[] | string = this.collectSample([args[0]], false);
        const b: number[] | string = this.collectSample([args[1]], false);
        if (typeof a === 'string') {
            return a;
        }
        if (typeof b === 'string') {
            return b;
        }
        if (a.length < 2 || b.length < 2) {
            return errCollection[CommonErrors.DivZero];
        }
        const varA: number = this.sampleVar(a);
        const varB: number = this.sampleVar(b);
        if (varB === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        const f: number = varA / varB;
        const d1: number = a.length - 1;
        const d2: number = b.length - 1;
        return (2 * Math.min(fCDF(f, d1, d2), fCDF(1 / f, d2, d1))).toString();
    }

    private sampleVar(nums: number[]): number {
        const m: number = this.mean(nums);
        let sum: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            sum += Math.pow(nums[i as number] - m, 2);
        }
        return sum / (nums.length - 1);
    }

    /**
     * Returns a frequency distribution as a vertical array (first bin when spill unavailable).
     *
     * Excel: `FREQUENCY(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFREQUENCY(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const data: number[] | string = this.collectSample([args[0]], false);
        const bins: number[] | string = this.collectSample([args[1]], false);
        if (typeof data === 'string') {
            return data;
        }
        if (typeof bins === 'string') {
            return bins;
        }
        if (bins.length === 0) {
            return errCollection[CommonErrors.Num];
        }
        const sortedBins: number[] = bins.slice().sort((x: number, y: number) => x - y);
        const counts: number[] = new Array(sortedBins.length + 1).fill(0);
        for (let i: number = 0; i < data.length; i++) {
            const v: number = data[i as number];
            let placed: boolean = false;
            for (let b: number = 0; b < sortedBins.length; b++) {
                if (v <= sortedBins[b as number]) {
                    counts[b as number]++;
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                counts[counts.length - 1]++;
            }
        }
        const sep: string = this.parent.getParseArgumentSeparator();
        return counts.join(sep);
    }
}
