import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';
import {
    binomialCoeff, gamma, normCDF,
    chiSquareCDF, chiSquareInv, fCDF, fInv, logNormCDF, logNormInv,
    lowerRegularizedGamma
} from './formula-math-helpers';

/**
 * Extended distribution library covering additional continuous and discrete probability models.
 *
 * Registers 15 functions including CRITBINOM, NEGBINOMDIST, HYPGEOMDIST, WEIBULL, LOGNORMDIST, and others.
 *
 * @hidden
 */
export class StatisticalDistributionExtendedFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'CRITBINOM', category: 'Statistical', description: 'Returns the smallest value for which the cumulative binomial distribution is less than or equal to a criterion value.', syntax: 'CRITBINOM(trials, probability_s, alpha)' },
        { formulaName: 'NEGBINOMDIST', category: 'Statistical', description: 'Returns the negative binomial distribution.', syntax: 'NEGBINOMDIST(number_f, number_s, probability_s)' },
        { formulaName: 'HYPGEOMDIST', category: 'Statistical', description: 'Returns the hypergeometric distribution.', syntax: 'HYPGEOMDIST(sample_s, number_sample, population_s, number_pop, [cumulative])' },
        { formulaName: 'WEIBULL', category: 'Statistical', description: 'Returns the Weibull distribution.', syntax: 'WEIBULL(x, alpha, beta, [cumulative])' },
        { formulaName: 'LOGNORMDIST', category: 'Statistical', description: 'Returns the cumulative log-normal distribution.', syntax: 'LOGNORMDIST(x, mean, standard_dev)' },
        { formulaName: 'LOGINV', category: 'Statistical', description: 'Returns the inverse of the log-normal cumulative distribution.', syntax: 'LOGINV(probability, mean, standard_dev)' },
        { formulaName: 'GAMMADIST', category: 'Statistical', description: 'Returns the gamma distribution.', syntax: 'GAMMADIST(x, alpha, beta, [cumulative])' },
        { formulaName: 'GAMMAINV', category: 'Statistical', description: 'Returns the inverse of the gamma cumulative distribution.', syntax: 'GAMMAINV(probability, alpha, beta)' },
        { formulaName: 'CHIDIST', category: 'Statistical', description: 'Returns the one-tailed probability of the chi-squared distribution.', syntax: 'CHIDIST(x, deg_freedom)' },
        { formulaName: 'CHIINV', category: 'Statistical', description: 'Returns the inverse of the one-tailed probability of the chi-squared distribution.', syntax: 'CHIINV(probability, deg_freedom)' },
        { formulaName: 'CHITEST', category: 'Statistical', description: 'Returns the test for independence.', syntax: 'CHITEST(actual_range, expected_range)' },
        { formulaName: 'FDIST', category: 'Statistical', description: 'Returns the F probability distribution.', syntax: 'FDIST(x, deg_freedom1, deg_freedom2)' },
        { formulaName: 'FINV', category: 'Statistical', description: 'Returns the inverse of the F probability distribution.', syntax: 'FINV(probability, deg_freedom1, deg_freedom2)' },
        { formulaName: 'ZTEST', category: 'Statistical', description: 'Returns the one-tailed probability-value of a z-test.', syntax: 'ZTEST(array, x, [sigma])' },
        { formulaName: 'PROB', category: 'Statistical', description: 'Returns the probability that values in a range are between two limits.', syntax: 'PROB(x_range, prob_range, [lower_limit], [upper_limit])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private parseCumulative(args: string[], index: number): boolean | string {
        if (args.length <= index) {
            return true;
        }
        const cum: number | string = this.resolveNumberArg(args[index as number]);
        if (typeof cum === 'string') {
            return cum;
        }
        return cum !== 0;
    }

    /**
     * Returns the smallest value for which the cumulative binomial distribution is less than or equal to a criterion value.
     *
     * Excel: `CRITBINOM(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=CRITBINOM(1)');
     * ```
     */
    public ComputeCRITBINOM(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const trials: number | string = this.resolveNumberArg(args[0]);
        const prob: number | string = this.resolveNumberArg(args[1]);
        const alpha: number | string = this.resolveNumberArg(args[2]);
        if (typeof trials === 'string') { return trials; }
        if (typeof prob === 'string') { return prob; }
        if (typeof alpha === 'string') { return alpha; }
        const n: number = Math.floor(trials);
        const p: number = prob;
        if (n < 0 || p < 0 || p > 1 || alpha < 0 || alpha > 1) {
            return errCollection[CommonErrors.Num];
        }
        let cum: number = 0;
        for (let k: number = 0; k <= n; k++) {
            cum += binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
            if (cum >= alpha) {
                return k.toString();
            }
        }
        return n.toString();
    }

    /**
     * Returns the negative binomial distribution.
     *
     * Excel: `NEGBINOMDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNEGBINOMDIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const failures: number | string = this.resolveNumberArg(args[0]);
        const successes: number | string = this.resolveNumberArg(args[1]);
        const prob: number | string = this.resolveNumberArg(args[2]);
        if (typeof failures === 'string') { return failures; }
        if (typeof successes === 'string') { return successes; }
        if (typeof prob === 'string') { return prob; }
        const f: number = Math.floor(failures);
        const s: number = Math.floor(successes);
        if (f < 0 || s < 1 || prob <= 0 || prob > 1) {
            return errCollection[CommonErrors.Num];
        }
        const result: number = binomialCoeff(f + s - 1, s - 1) * Math.pow(prob, s) * Math.pow(1 - prob, f);
        return result.toString();
    }

    /**
     * Returns the hypergeometric distribution.
     *
     * Excel: `HYPGEOMDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeHYPGEOMDIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 4 || args.length > 5) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const sampleS: number | string = this.resolveNumberArg(args[0]);
        const numSample: number | string = this.resolveNumberArg(args[1]);
        const popS: number | string = this.resolveNumberArg(args[2]);
        const numPop: number | string = this.resolveNumberArg(args[3]);
        if (typeof sampleS === 'string') { return sampleS; }
        if (typeof numSample === 'string') { return numSample; }
        if (typeof popS === 'string') { return popS; }
        if (typeof numPop === 'string') { return numPop; }
        const x: number = Math.floor(sampleS);
        const n: number = Math.floor(numSample);
        const M: number = Math.floor(popS);
        const N: number = Math.floor(numPop);
        if (x < 0 || x > n || n > N || M > N) {
            return errCollection[CommonErrors.Num];
        }
        const cumulative: boolean | string = this.parseCumulative(args, 4);
        if (typeof cumulative === 'string') {
            return cumulative;
        }
        const pmf: number = (binomialCoeff(M, x) * binomialCoeff(N - M, n - x)) / binomialCoeff(N, n);
        if (!cumulative) {
            return pmf.toString();
        }
        let sum: number = 0;
        for (let i: number = 0; i <= x; i++) {
            sum += (binomialCoeff(M, i) * binomialCoeff(N - M, n - i)) / binomialCoeff(N, n);
        }
        return sum.toString();
    }

    /**
     * Returns the Weibull distribution.
     *
     * Excel: `WEIBULL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeWEIBULL(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const alpha: number | string = this.resolveNumberArg(args[1]);
        const beta: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') { return x; }
        if (typeof alpha === 'string') { return alpha; }
        if (typeof beta === 'string') { return beta; }
        if (x < 0 || alpha <= 0 || beta <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const cumulative: boolean | string = this.parseCumulative(args, 3);
        if (typeof cumulative === 'string') {
            return cumulative;
        }
        if (cumulative) {
            return (1 - Math.exp(-Math.pow(x / beta, alpha))).toString();
        }
        return ((alpha / Math.pow(beta, alpha)) * Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha))).toString();
    }

    /**
     * Returns the cumulative log-normal distribution.
     *
     * Excel: `LOGNORMDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLOGNORMDIST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const mean: number | string = this.resolveNumberArg(args[1]);
        const std: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') { return x; }
        if (typeof mean === 'string') { return mean; }
        if (typeof std === 'string') { return std; }
        const result: number = logNormCDF(x, mean, std);
        if (isNaN(result)) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the inverse of the log-normal cumulative distribution.
     *
     * Excel: `LOGINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLOGINV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const mean: number | string = this.resolveNumberArg(args[1]);
        const std: number | string = this.resolveNumberArg(args[2]);
        if (typeof p === 'string') { return p; }
        if (typeof mean === 'string') { return mean; }
        if (typeof std === 'string') { return std; }
        const result: number = logNormInv(p, mean, std);
        if (isNaN(result)) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the gamma distribution.
     *
     * Excel: `GAMMADIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeGAMMADIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const alpha: number | string = this.resolveNumberArg(args[1]);
        const beta: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') { return x; }
        if (typeof alpha === 'string') { return alpha; }
        if (typeof beta === 'string') { return beta; }
        if (x < 0 || alpha <= 0 || beta <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const cumulative: boolean | string = this.parseCumulative(args, 3);
        if (typeof cumulative === 'string') {
            return cumulative;
        }
        const scaled: number = x / beta;
        if (cumulative) {
            return lowerRegularizedGamma(alpha, scaled).toString();
        }
        return (Math.pow(scaled, alpha - 1) * Math.exp(-scaled) / (beta * gamma(alpha))).toString();
    }

    /**
     * Returns the inverse of the gamma cumulative distribution.
     *
     * Excel: `GAMMAINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeGAMMAINV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const alpha: number | string = this.resolveNumberArg(args[1]);
        const beta: number | string = this.resolveNumberArg(args[2]);
        if (typeof p === 'string') { return p; }
        if (typeof alpha === 'string') { return alpha; }
        if (typeof beta === 'string') { return beta; }
        if (p <= 0 || p >= 1 || alpha <= 0 || beta <= 0) {
            return errCollection[CommonErrors.Num];
        }
        let lo: number = 0;
        let hi: number = alpha * beta * 20 + 1;
        for (let i: number = 0; i < 100; i++) {
            const mid: number = (lo + hi) / 2;
            if (lowerRegularizedGamma(alpha, mid / beta) < p) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        return ((lo + hi) / 2).toString();
    }

    /**
     * Returns the one-tailed probability of the chi-squared distribution.
     *
     * Excel: `CHIDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCHIDIST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const df: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') { return x; }
        if (typeof df === 'string') { return df; }
        return (1 - chiSquareCDF(x, df)).toString();
    }

    /**
     * Returns the inverse of the one-tailed probability of the chi-squared distribution.
     *
     * Excel: `CHIINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCHIINV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const df: number | string = this.resolveNumberArg(args[1]);
        if (typeof p === 'string') { return p; }
        if (typeof df === 'string') { return df; }
        const result: number = chiSquareInv(1 - p, df);
        if (isNaN(result)) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the test for independence.
     *
     * Excel: `CHITEST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCHITEST(...args: string[]): string | number {
        return this.chiSquareTest(args);
    }

    private chiSquareTest(args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const actual: number[] | string = this.collectSample([args[0]], false);
        const expected: number[] | string = this.collectSample([args[1]], false);
        if (typeof actual === 'string') { return actual; }
        if (typeof expected === 'string') { return expected; }
        if (actual.length !== expected.length || actual.length === 0) {
            return errCollection[CommonErrors.NA];
        }
        let chi2: number = 0;
        for (let i: number = 0; i < actual.length; i++) {
            if (expected[i as number] === 0) {
                return errCollection[CommonErrors.DivZero];
            }
            const d: number = actual[i as number] - expected[i as number];
            chi2 += (d * d) / expected[i as number];
        }
        const df: number = actual.length - 1;
        return (1 - chiSquareCDF(chi2, df)).toString();
    }

    /**
     * Returns the F probability distribution.
     *
     * Excel: `FDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFDIST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const d1: number | string = this.resolveNumberArg(args[1]);
        const d2: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') { return x; }
        if (typeof d1 === 'string') { return d1; }
        if (typeof d2 === 'string') { return d2; }
        return (1 - fCDF(x, d1, d2)).toString();
    }

    /**
     * Returns the inverse of the F probability distribution.
     *
     * Excel: `FINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFINV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const d1: number | string = this.resolveNumberArg(args[1]);
        const d2: number | string = this.resolveNumberArg(args[2]);
        if (typeof p === 'string') { return p; }
        if (typeof d1 === 'string') { return d1; }
        if (typeof d2 === 'string') { return d2; }
        const result: number = fInv(1 - p, d1, d2);
        if (isNaN(result)) {
            return this.parent.getErrorStrings()[CommonErrors.Num];
        }
        return result.toString();
    }

    /**
     * Returns the one-tailed probability-value of a z-test.
     *
     * Excel: `ZTEST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeZTEST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const nums: number[] | string = this.collectSample([args[0]], false);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < 2) {
            return errCollection[CommonErrors.DivZero];
        }
        const x: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') {
            return x;
        }
        const avg: number = this.mean(nums);
        let sumSq: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            const d: number = nums[i as number] - avg;
            sumSq += d * d;
        }
        const std: number = Math.sqrt(sumSq / (nums.length - 1));
        if (std === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        let sigma: number = std / Math.sqrt(nums.length);
        if (args.length === 3) {
            const s: number | string = this.resolveNumberArg(args[2]);
            if (typeof s === 'string') {
                return s;
            }
            sigma = s / Math.sqrt(nums.length);
        }
        const z: number = (avg - x) / sigma;
        return (1 - normCDF(z)).toString();
    }

    /**
     * Returns the probability that values in a range are between two limits.
     *
     * Excel: `PROB(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePROB(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const nums: number[] | string = this.collectSample([args[0]], false);
        if (typeof nums === 'string') {
            return nums;
        }
        const low: number | string = this.resolveNumberArg(args[1]);
        const high: number | string = this.resolveNumberArg(args[2]);
        if (typeof low === 'string') {
            return low;
        }
        if (typeof high === 'string') {
            return high;
        }
        if (nums.length === 0) {
            return errCollection[CommonErrors.Num];
        }
        let total: number = 0;
        let inRange: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            total += 1;
            if (nums[i as number] >= low && nums[i as number] <= high) {
                inRange += 1;
            }
        }
        return (inRange / total).toString();
    }
}
