import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';
import { logGamma } from './formula-math-helpers';

/**
 * Large-sample and array statistical helpers beyond basic descriptive functions.
 *
 * Registers 11 functions including STDEVA, STDEVPA, VARA, VARPA, TRIMMEAN, and others.
 *
 * @hidden
 */
export class StatisticalExtendedFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'STDEVA', category: 'Statistical', description: 'Estimates standard deviation based on a sample, including text and logicals.', syntax: 'STDEVA(value1, [value2], ...)' },
        { formulaName: 'STDEVPA', category: 'Statistical', description: 'Calculates standard deviation based on the entire population, including text and logicals.', syntax: 'STDEVPA(value1, [value2], ...)' },
        { formulaName: 'VARA', category: 'Statistical', description: 'Estimates variance based on a sample, including text and logicals.', syntax: 'VARA(value1, [value2], ...)' },
        { formulaName: 'VARPA', category: 'Statistical', description: 'Calculates variance based on the entire population, including text and logicals.', syntax: 'VARPA(value1, [value2], ...)' },
        { formulaName: 'TRIMMEAN', category: 'Statistical', description: 'Returns the mean of the interior of a data set.', syntax: 'TRIMMEAN(array, percent)' },
        { formulaName: 'FISHER', category: 'Statistical', description: 'Returns the Fisher transformation.', syntax: 'FISHER(x)' },
        { formulaName: 'FISHERINV', category: 'Statistical', description: 'Returns the inverse of the Fisher transformation.', syntax: 'FISHERINV(y)' },
        { formulaName: 'GAMMALN', category: 'Statistical', description: 'Returns the natural logarithm of the gamma function.', syntax: 'GAMMALN(x)' },
        { formulaName: 'SUMX2MY2', category: 'Statistical', description: 'Returns the sum of the difference of squares of corresponding values in two arrays.', syntax: 'SUMX2MY2(array_x, array_y)' },
        { formulaName: 'SUMX2PY2', category: 'Statistical', description: 'Returns the sum of the sum of squares of corresponding values in two arrays.', syntax: 'SUMX2PY2(array_x, array_y)' },
        { formulaName: 'SUMXMY2', category: 'Statistical', description: 'Returns the sum of squares of differences of corresponding values in two arrays.', syntax: 'SUMXMY2(array_x, array_y)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private stdevVarA(args: string[], population: boolean, asVar: boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args, true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < (population ? 1 : 2)) {
            return errCollection[CommonErrors.DivZero];
        }
        const avg: number = this.mean(nums);
        let sumSq: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            const d: number = nums[i as number] - avg;
            sumSq += d * d;
        }
        const denom: number = population ? nums.length : nums.length - 1;
        const v: number = sumSq / denom;
        return (asVar ? v : Math.sqrt(v)).toString();
    }

    /**
     * Estimates standard deviation based on a sample, including text and logicals.
     *
     * Excel: `STDEVA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=STDEVA(1)');
     * ```
     */
    public ComputeSTDEVA(...args: string[]): string | number {
        return this.stdevVarA(args, false, false);
    }

    /**
     * Calculates standard deviation based on the entire population, including text and logicals.
     *
     * Excel: `STDEVPA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSTDEVPA(...args: string[]): string | number {
        return this.stdevVarA(args, true, false);
    }

    /**
     * Estimates variance based on a sample, including text and logicals.
     *
     * Excel: `VARA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVARA(...args: string[]): string | number {
        return this.stdevVarA(args, false, true);
    }

    /**
     * Calculates variance based on the entire population, including text and logicals.
     *
     * Excel: `VARPA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVARPA(...args: string[]): string | number {
        return this.stdevVarA(args, true, true);
    }

    /**
     * Returns the mean of the interior of a data set.
     *
     * Excel: `TRIMMEAN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTRIMMEAN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const pct: number | string = this.resolveNumberArg(args[1]);
        if (typeof pct === 'string') {
            return pct;
        }
        if (pct < 0 || pct >= 1) {
            return errCollection[CommonErrors.Num];
        }
        const nums: number[] | string = this.collectSample([args[0]], false);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        const sorted: number[] = nums.slice().sort((a: number, b: number) => a - b);
        const trim: number = Math.floor(sorted.length * pct / 2);
        const inner: number[] = sorted.slice(trim, sorted.length - trim);
        if (inner.length === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        return this.mean(inner).toString();
    }

    /**
     * Returns the Fisher transformation.
     *
     * Excel: `FISHER(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFISHER(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        if (typeof x === 'string') {
            return x;
        }
        if (x <= -1 || x >= 1) {
            return errCollection[CommonErrors.Num];
        }
        return (0.5 * Math.log((1 + x) / (1 - x))).toString();
    }

    /**
     * Returns the inverse of the Fisher transformation.
     *
     * Excel: `FISHERINV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFISHERINV(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const y: number | string = this.resolveNumberArg(args[0]);
        if (typeof y === 'string') {
            return y;
        }
        const e2y: number = Math.exp(2 * y);
        return ((e2y - 1) / (e2y + 1)).toString();
    }

    /**
     * Returns the natural logarithm of the gamma function.
     *
     * Excel: `GAMMALN(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeGAMMALN(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const x: number | string = this.resolveNumberArg(args[0]);
        if (typeof x === 'string') {
            return x;
        }
        if (x <= 0) {
            return errCollection[CommonErrors.Num];
        }
        const result: number = logGamma(x);
        if (!isFinite(result)) {
            return errCollection[CommonErrors.Num];
        }
        return result.toString();
    }

    private sumSquaresPair(args: string[], mode: 'x2my2' | 'x2py2' | 'xmy2'): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const pair: { x: number[], y: number[] } | string = this.collectPair(args);
        if (typeof pair === 'string') {
            return pair;
        }
        const { x, y } = pair;
        if (x.length === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        let sum: number = 0;
        for (let i: number = 0; i < x.length; i++) {
            if (mode === 'x2my2') {
                sum += x[i as number] * x[i as number] - y[i as number] * y[i as number];
            } else if (mode === 'x2py2') {
                sum += x[i as number] * x[i as number] + y[i as number] * y[i as number];
            } else {
                const d: number = x[i as number] - y[i as number];
                sum += d * d;
            }
        }
        return sum.toString();
    }

    /**
     * Returns the sum of the difference of squares of corresponding values in two arrays.
     *
     * Excel: `SUMX2MY2(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMX2MY2(...args: string[]): string | number {
        return this.sumSquaresPair(args, 'x2my2');
    }

    /**
     * Returns the sum of the sum of squares of corresponding values in two arrays.
     *
     * Excel: `SUMX2PY2(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMX2PY2(...args: string[]): string | number {
        return this.sumSquaresPair(args, 'x2py2');
    }

    /**
     * Returns the sum of squares of differences of corresponding values in two arrays.
     *
     * Excel: `SUMXMY2(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSUMXMY2(...args: string[]): string | number {
        return this.sumSquaresPair(args, 'xmy2');
    }
}
