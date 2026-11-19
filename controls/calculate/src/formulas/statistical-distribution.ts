import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';
import { normCDF, normInv, binomialCoeff, factorial } from './formula-math-helpers';

/**
 * Probability density and cumulative distribution functions for common statistical distributions.
 *
 * Registered functions: NORMDIST, NORMSDIST, NORMINV, NORMSINV, POISSON, BINOMDIST, EXPONDIST, CONFIDENCE.
 *
 * @hidden
 */
export class StatisticalDistributionFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'NORMDIST', category: 'Statistical', description: 'Returns the normal cumulative distribution.', syntax: 'NORMDIST(x, mean, standard_dev, [cumulative])' },
        { formulaName: 'NORMSDIST', category: 'Statistical', description: 'Returns the standard normal cumulative distribution.', syntax: 'NORMSDIST(z)' },
        { formulaName: 'NORMINV', category: 'Statistical', description: 'Returns the inverse of the normal cumulative distribution.', syntax: 'NORMINV(probability, mean, standard_dev)' },
        { formulaName: 'NORMSINV', category: 'Statistical', description: 'Returns the inverse of the standard normal cumulative distribution.', syntax: 'NORMSINV(probability)' },
        { formulaName: 'POISSON', category: 'Statistical', description: 'Returns the Poisson distribution.', syntax: 'POISSON(x, mean, [cumulative])' },
        { formulaName: 'BINOMDIST', category: 'Statistical', description: 'Returns the individual term binomial distribution probability.', syntax: 'BINOMDIST(number_s, trials, probability_s, [cumulative])' },
        { formulaName: 'EXPONDIST', category: 'Statistical', description: 'Returns the exponential distribution.', syntax: 'EXPONDIST(x, lambda, [cumulative])' },
        { formulaName: 'CONFIDENCE', category: 'Statistical', description: 'Returns the confidence interval for a population mean.', syntax: 'CONFIDENCE(alpha, standard_dev, size)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the normal cumulative distribution.
     *
     * Excel: `NORMDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=NORMDIST(1)');
     * ```
     */
    public ComputeNORMDIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const mean: number | string = this.resolveNumberArg(args[1]);
        const std: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') { return x; }
        if (typeof mean === 'string') { return mean; }
        if (typeof std === 'string') { return std; }
        if (std <= 0) { return errCollection[CommonErrors.Num]; }
        let cumulative: boolean = true;
        if (args.length === 4) {
            const cumArg: number | string = this.resolveNumberArg(args[3]);
            if (typeof cumArg === 'string') { return cumArg; }
            cumulative = cumArg !== 0;
        }
        if (cumulative) {
            return normCDF(x, mean, std).toString();
        }
        const z: number = (x - mean) / std;
        return (Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI))).toString();
    }

    /**
     * Returns the standard normal cumulative distribution.
     *
     * Excel: `NORMSDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNORMSDIST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const z: number | string = this.resolveNumberArg(args[0]);
        if (typeof z === 'string') { return z; }
        return normCDF(z).toString();
    }

    /**
     * Returns the inverse of the normal cumulative distribution.
     *
     * Excel: `NORMINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNORMINV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        const mean: number | string = this.resolveNumberArg(args[1]);
        const std: number | string = this.resolveNumberArg(args[2]);
        if (typeof p === 'string') { return p; }
        if (typeof mean === 'string') { return mean; }
        if (typeof std === 'string') { return std; }
        const result: number = normInv(p, mean, std);
        if (isNaN(result)) { return errCollection[CommonErrors.Num]; }
        return result.toString();
    }

    /**
     * Returns the inverse of the standard normal cumulative distribution.
     *
     * Excel: `NORMSINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeNORMSINV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const p: number | string = this.resolveNumberArg(args[0]);
        if (typeof p === 'string') { return p; }
        const result: number = normInv(p);
        if (isNaN(result)) { return errCollection[CommonErrors.Num]; }
        return result.toString();
    }

    /**
     * Returns the Poisson distribution.
     *
     * Excel: `POISSON(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePOISSON(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const mean: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') { return x; }
        if (typeof mean === 'string') { return mean; }
        const k: number = Math.floor(x);
        if (k < 0 || mean < 0) { return errCollection[CommonErrors.Num]; }
        let cumulative: boolean = true;
        if (args.length === 3) {
            const cumArg: number | string = this.resolveNumberArg(args[2]);
            if (typeof cumArg === 'string') { return cumArg; }
            cumulative = cumArg !== 0;
        }
        if (!cumulative) {
            return (Math.exp(-mean) * Math.pow(mean, k) / factorial(k)).toString();
        }
        let sum: number = 0;
        for (let i: number = 0; i <= k; i++) {
            sum += Math.exp(-mean) * Math.pow(mean, i) / factorial(i);
        }
        return sum.toString();
    }

    /**
     * Returns the individual term binomial distribution probability.
     *
     * Excel: `BINOMDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeBINOMDIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 3 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const successes: number | string = this.resolveNumberArg(args[0]);
        const trials: number | string = this.resolveNumberArg(args[1]);
        const prob: number | string = this.resolveNumberArg(args[2]);
        if (typeof successes === 'string') { return successes; }
        if (typeof trials === 'string') { return trials; }
        if (typeof prob === 'string') { return prob; }
        const s: number = Math.floor(successes);
        const n: number = Math.floor(trials);
        if (s < 0 || n < 0 || s > n || prob < 0 || prob > 1) {
            return errCollection[CommonErrors.Num];
        }
        let cumulative: boolean = true;
        if (args.length === 4) {
            const cumArg: number | string = this.resolveNumberArg(args[3]);
            if (typeof cumArg === 'string') { return cumArg; }
            cumulative = cumArg !== 0;
        }
        const pmf: number = binomialCoeff(n, s) * Math.pow(prob, s) * Math.pow(1 - prob, n - s);
        if (!cumulative) {
            return pmf.toString();
        }
        let sum: number = 0;
        for (let i: number = 0; i <= s; i++) {
            sum += binomialCoeff(n, i) * Math.pow(prob, i) * Math.pow(1 - prob, n - i);
        }
        return sum.toString();
    }

    /**
     * Returns the exponential distribution.
     *
     * Excel: `EXPONDIST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeEXPONDIST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const lambda: number | string = this.resolveNumberArg(args[1]);
        if (typeof x === 'string') { return x; }
        if (typeof lambda === 'string') { return lambda; }
        if (x < 0 || lambda <= 0) { return errCollection[CommonErrors.Num]; }
        let cumulative: boolean = true;
        if (args.length === 3) {
            const cumArg: number | string = this.resolveNumberArg(args[2]);
            if (typeof cumArg === 'string') { return cumArg; }
            cumulative = cumArg !== 0;
        }
        if (cumulative) {
            return (1 - Math.exp(-lambda * x)).toString();
        }
        return (lambda * Math.exp(-lambda * x)).toString();
    }

    /**
     * Returns the confidence interval for a population mean.
     *
     * Excel: `CONFIDENCE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCONFIDENCE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const alpha: number | string = this.resolveNumberArg(args[0]);
        const std: number | string = this.resolveNumberArg(args[1]);
        const size: number | string = this.resolveNumberArg(args[2]);
        if (typeof alpha === 'string') { return alpha; }
        if (typeof std === 'string') { return std; }
        if (typeof size === 'string') { return size; }
        if (alpha <= 0 || alpha >= 1 || std <= 0 || size < 1) {
            return errCollection[CommonErrors.Num];
        }
        const z: number = normInv(1 - alpha / 2);
        if (isNaN(z)) { return errCollection[CommonErrors.Num]; }
        return (z * std / Math.sqrt(size)).toString();
    }
}
