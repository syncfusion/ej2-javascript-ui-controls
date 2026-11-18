import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';

/**
 * Distribution shape metrics: skewness, kurtosis, and moment-based descriptive statistics.
 *
 * Registered functions: AVEDEV, DEVSQ, HARMEAN, SKEW, KURT, STANDARDIZE.
 *
 * @hidden
 */
export class StatisticalMomentsFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'AVEDEV', category: 'Statistical', description: 'Returns the average of the absolute deviations of data points from their mean.', syntax: 'AVEDEV(number1, [number2], ...)' },
        { formulaName: 'DEVSQ', category: 'Statistical', description: 'Returns the sum of squares of deviations.', syntax: 'DEVSQ(number1, [number2], ...)' },
        { formulaName: 'HARMEAN', category: 'Statistical', description: 'Returns the harmonic mean.', syntax: 'HARMEAN(number1, [number2], ...)' },
        { formulaName: 'SKEW', category: 'Statistical', description: 'Returns the skewness of a distribution.', syntax: 'SKEW(number1, [number2], ...)' },
        { formulaName: 'KURT', category: 'Statistical', description: 'Returns the kurtosis of a data set.', syntax: 'KURT(number1, [number2], ...)' },
        { formulaName: 'STANDARDIZE', category: 'Statistical', description: 'Returns a normalized value from a distribution.', syntax: 'STANDARDIZE(x, mean, standard_dev)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    /**
     * Returns the average of the absolute deviations of data points from their mean.
     *
     * Excel: `AVEDEV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=AVEDEV(1)');
     * ```
     */
    public ComputeAVEDEV(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args);
        if (typeof nums === 'string') { return nums; }
        if (nums.length === 0) { return errCollection[CommonErrors.DivZero]; }
        const avg: number = this.mean(nums);
        let sum: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            sum += Math.abs(nums[i as number] - avg);
        }
        return (sum / nums.length).toString();
    }

    /**
     * Returns the sum of squares of deviations.
     *
     * Excel: `DEVSQ(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeDEVSQ(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args);
        if (typeof nums === 'string') { return nums; }
        if (nums.length === 0) { return errCollection[CommonErrors.DivZero]; }
        const avg: number = this.mean(nums);
        let sum: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            const d: number = nums[i as number] - avg;
            sum += d * d;
        }
        return sum.toString();
    }

    /**
     * Returns the harmonic mean.
     *
     * Excel: `HARMEAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeHARMEAN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args);
        if (typeof nums === 'string') { return nums; }
        if (nums.length === 0) { return errCollection[CommonErrors.DivZero]; }
        let sumInv: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            if (nums[i as number] <= 0) {
                return errCollection[CommonErrors.Num];
            }
            sumInv += 1 / nums[i as number];
        }
        return (nums.length / sumInv).toString();
    }

    /**
     * Returns the skewness of a distribution.
     *
     * Excel: `SKEW(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSKEW(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args);
        if (typeof nums === 'string') { return nums; }
        const n: number = nums.length;
        if (n < 3) { return errCollection[CommonErrors.DivZero]; }
        const avg: number = this.mean(nums);
        let m2: number = 0;
        let m3: number = 0;
        for (let i: number = 0; i < n; i++) {
            const d: number = nums[i as number] - avg;
            m2 += d * d;
            m3 += d * d * d;
        }
        m2 /= n;
        m3 /= n;
        if (m2 === 0) { return errCollection[CommonErrors.DivZero]; }
        const skew: number = m3 / Math.pow(m2, 1.5) * Math.sqrt(n * (n - 1)) / (n - 2);
        return skew.toString();
    }

    /**
     * Returns the kurtosis of a data set.
     *
     * Excel: `KURT(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeKURT(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args);
        if (typeof nums === 'string') { return nums; }
        const n: number = nums.length;
        if (n < 4) { return errCollection[CommonErrors.DivZero]; }
        const avg: number = this.mean(nums);
        let m2: number = 0;
        let m4: number = 0;
        for (let i: number = 0; i < n; i++) {
            const d: number = nums[i as number] - avg;
            m2 += d * d;
            m4 += d * d * d * d;
        }
        m2 /= n;
        m4 /= n;
        if (m2 === 0) { return errCollection[CommonErrors.DivZero]; }
        const kurt: number = (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * (m4 / (m2 * m2))
            - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));
        return kurt.toString();
    }

    /**
     * Returns a normalized value from a distribution.
     *
     * Excel: `STANDARDIZE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSTANDARDIZE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        const mean: number | string = this.resolveNumberArg(args[1]);
        const std: number | string = this.resolveNumberArg(args[2]);
        if (typeof x === 'string') { return x; }
        if (typeof mean === 'string') { return mean; }
        if (typeof std === 'string') { return std; }
        if (std <= 0) { return errCollection[CommonErrors.Num]; }
        return ((x - mean) / std).toString();
    }
}
