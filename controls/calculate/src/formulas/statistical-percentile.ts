import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';

/**
 * Percentile, quartile, and rank position functions for ordered data sets.
 *
 * Registered functions: PERCENTILE, PERCENTRANK, QUARTILE.
 *
 * @hidden
 */
export class StatisticalPercentileFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'PERCENTILE', category: 'Statistical', description: 'Returns the k-th percentile of values in a range.', syntax: 'PERCENTILE(array, k)' },
        { formulaName: 'PERCENTRANK', category: 'Statistical', description: 'Returns the percentage rank of a value in a data set.', syntax: 'PERCENTRANK(array, x, [significance])' },
        { formulaName: 'QUARTILE', category: 'Statistical', description: 'Returns the quartile of a data set.', syntax: 'QUARTILE(array, quart)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private sortedSample(args: string[]): number[] | string {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args);
        if (typeof nums === 'string') { return nums; }
        return nums.slice().sort((a: number, b: number) => a - b);
    }

    private percentile(sorted: number[], k: number): number | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (k < 0 || k > 1) {
            return errCollection[CommonErrors.Num];
        }
        if (sorted.length === 0) {
            return errCollection[CommonErrors.Num];
        }
        const n: number = sorted.length;
        const pos: number = k * (n - 1);
        const lower: number = Math.floor(pos);
        const frac: number = pos - lower;
        if (lower >= n - 1) {
            return sorted[n - 1];
        }
        return sorted[lower as number] + frac * (sorted[lower + 1] - sorted[lower as number]);
    }

    /**
     * Returns the k-th percentile of values in a range.
     *
     * Excel: `PERCENTILE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=PERCENTILE(1)');
     * ```
     */
    public ComputePERCENTILE(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const k: number | string = this.resolveNumberArg(args[1]);
        if (typeof k === 'string') { return k; }
        const sorted: number[] | string = this.sortedSample([args[0]]);
        if (typeof sorted === 'string') { return sorted; }
        const result: number | string = this.percentile(sorted, k);
        return typeof result === 'string' ? result : result.toString();
    }

    /**
     * Returns the percentage rank of a value in a data set.
     *
     * Excel: `PERCENTRANK(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePERCENTRANK(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        if (typeof x === 'string') { return x; }
        const sorted: number[] | string = this.sortedSample([args[1]]);
        if (typeof sorted === 'string') { return sorted; }
        if (sorted.length === 0) { return errCollection[CommonErrors.Num]; }
        let lower: number = 0;
        let upper: number = 1;
        if (args.length === 3) {
            const sig: number | string = this.resolveNumberArg(args[2]);
            if (typeof sig === 'string') { return sig; }
            lower = sig;
            upper = 1 - sig;
        }
        if (x < sorted[0]) { return lower.toString(); }
        if (x > sorted[sorted.length - 1]) { return upper.toString(); }
        let rank: number = 0;
        for (let i: number = 0; i < sorted.length; i++) {
            if (sorted[i as number] === x) {
                rank = i / (sorted.length - 1 || 1);
                break;
            }
            if (sorted[i as number] > x) {
                const frac: number = (x - sorted[i - 1]) / (sorted[i as number] - sorted[i - 1]);
                rank = (i - 1 + frac) / (sorted.length - 1);
                break;
            }
        }
        return rank.toString();
    }

    /**
     * Returns the quartile of a data set.
     *
     * Excel: `QUARTILE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeQUARTILE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const quart: number | string = this.resolveNumberArg(args[1]);
        if (typeof quart === 'string') { return quart; }
        const q: number = Math.floor(quart);
        if (q < 0 || q > 4) { return errCollection[CommonErrors.Num]; }
        const kMap: Record<number, number> = { 0: 0, 1: 0.25, 2: 0.5, 3: 0.75, 4: 1 };
        const sorted: number[] | string = this.sortedSample([args[0]]);
        if (typeof sorted === 'string') { return sorted; }
        const result: number | string = this.percentile(sorted, kMap[q as number]);
        return typeof result === 'string' ? result : result.toString();
    }
}
