import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { FormulaModuleBase } from './formula-module-base';

/**
 * Variability measures: variance, standard deviation, and average deviation for samples and populations.
 *
 * Registered functions: STDEV, STDEVP, VAR, VARP, MODE, RANK, MAXA, MINA.
 *
 * @hidden
 */
export class StatisticalDispersionFormulas extends FormulaModuleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'STDEV', category: 'Statistical', description: 'Estimates standard deviation based on a sample.', syntax: 'STDEV(number1, [number2], ...)' },
        { formulaName: 'STDEVP', category: 'Statistical', description: 'Calculates standard deviation based on the entire population.', syntax: 'STDEVP(number1, [number2], ...)' },
        { formulaName: 'VAR', category: 'Statistical', description: 'Estimates variance based on a sample.', syntax: 'VAR(number1, [number2], ...)' },
        { formulaName: 'VARP', category: 'Statistical', description: 'Calculates variance based on the entire population.', syntax: 'VARP(number1, [number2], ...)' },
        { formulaName: 'MODE', category: 'Statistical', description: 'Returns the most common value in a data set.', syntax: 'MODE(number1, [number2], ...)' },
        { formulaName: 'RANK', category: 'Statistical', description: 'Returns the rank of a number in a list of numbers.', syntax: 'RANK(number, ref, [order])' },
        { formulaName: 'MAXA', category: 'Statistical', description: 'Returns the maximum value in a list of arguments, including text and logicals.', syntax: 'MAXA(value1, [value2], ...)' },
        { formulaName: 'MINA', category: 'Statistical', description: 'Returns the minimum value in a list of arguments, including text and logicals.', syntax: 'MINA(value1, [value2], ...)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private collectSample(args: string[], includeTextAsZero: boolean): number[] | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        const nums: number[] = [];
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
                    if (val === '') {
                        continue;
                    }
                    const upper: string = val.toUpperCase();
                    if (upper === this.parent.trueValue) {
                        nums.push(1);
                    } else if (upper === this.parent.falseValue) {
                        nums.push(0);
                    } else if (this.parent.isNumber(val)) {
                        nums.push(this.parent.parseFloat(val));
                    } else if (includeTextAsZero) {
                        nums.push(0);
                    }
                }
            } else {
                const val: string = this.parent.getValueFromArg(arg);
                if (errCollection.indexOf(val) > -1) {
                    return val;
                }
                const upper: string = val.toUpperCase();
                if (upper === this.parent.trueValue) {
                    nums.push(1);
                } else if (upper === this.parent.falseValue) {
                    nums.push(0);
                } else if (val === '') {
                    continue;
                } else if (this.parent.isNumber(this.parent.removeTics(val))) {
                    nums.push(this.parent.parseFloat(this.parent.removeTics(val)));
                } else if (includeTextAsZero) {
                    nums.push(0);
                } else {
                    return errCollection[CommonErrors.Value];
                }
            }
        }
        return nums;
    }

    private variance(nums: number[], population: boolean): number {
        const mean: number = nums.reduce((a: number, b: number) => a + b, 0) / nums.length;
        let sumSq: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            const d: number = nums[i as number] - mean;
            sumSq += d * d;
        }
        const denom: number = population ? nums.length : nums.length - 1;
        return sumSq / denom;
    }

    /**
     * Estimates standard deviation based on a sample.
     *
     * Excel: `STDEV(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=STDEV(1)');
     * ```
     */
    public ComputeSTDEV(...args: string[]): string | number {
        return this.stdevVar(args, false, false);
    }
    /**
     * Calculates standard deviation based on the entire population.
     *
     * Excel: `STDEVP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSTDEVP(...args: string[]): string | number {
        return this.stdevVar(args, true, false);
    }
    /**
     * Estimates variance based on a sample.
     *
     * Excel: `VAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVAR(...args: string[]): string | number {
        return this.stdevVar(args, false, true);
    }
    /**
     * Calculates variance based on the entire population.
     *
     * Excel: `VARP(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeVARP(...args: string[]): string | number {
        return this.stdevVar(args, true, true);
    }

    private stdevVar(args: string[], population: boolean, asVar: boolean): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args, false);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length < (population ? 1 : 2)) {
            return errCollection[CommonErrors.DivZero];
        }
        const v: number = this.variance(nums, population);
        return (asVar ? v : Math.sqrt(v)).toString();
    }

    /**
     * Returns the most common value in a data set.
     *
     * Excel: `MODE(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMODE(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args, false);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return errCollection[CommonErrors.Value];
        }
        const counts: Map<number, number> = new Map<number, number>();
        let best: number = nums[0];
        let bestCount: number = 0;
        for (let i: number = 0; i < nums.length; i++) {
            const n: number = nums[i as number];
            const c: number = (counts.get(n) || 0) + 1;
            counts.set(n, c);
            if (c > bestCount) {
                bestCount = c;
                best = n;
            }
        }
        if (bestCount < 2) {
            return errCollection[CommonErrors.NA];
        }
        return best.toString();
    }

    /**
     * Returns the rank of a number in a list of numbers.
     *
     * Excel: `RANK(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeRANK(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const number: number | string = this.resolveNumberArg(args[0]);
        if (typeof number === 'string') {
            return number;
        }
        const nums: number[] | string = this.collectSample([args[1]], false);
        if (typeof nums === 'string') {
            return nums;
        }
        let order: number = 0;
        if (args.length === 3 && args[2] !== '') {
            const o: number | string = this.resolveNumberArg(args[2]);
            if (typeof o === 'string') {
                return o;
            }
            order = o;
        }
        const sorted: number[] = nums.slice().sort((a: number, b: number) => order ? a - b : b - a);
        const idx: number = sorted.indexOf(number);
        if (idx < 0) {
            return errCollection[CommonErrors.NA];
        }
        return (idx + 1).toString();
    }

    /**
     * Returns the maximum value in a list of arguments, including text and logicals.
     *
     * Excel: `MAXA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMAXA(...args: string[]): string | number {
        return this.minMaxA(args, true);
    }
    /**
     * Returns the minimum value in a list of arguments, including text and logicals.
     *
     * Excel: `MINA(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeMINA(...args: string[]): string | number {
        return this.minMaxA(args, false);
    }

    private minMaxA(args: string[], isMax: boolean): string | number {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.InvalidArguments];
        }
        const nums: number[] | string = this.collectSample(args, true);
        if (typeof nums === 'string') {
            return nums;
        }
        if (nums.length === 0) {
            return '0';
        }
        let result: number = nums[0];
        for (let i: number = 1; i < nums.length; i++) {
            if (isMax ? nums[i as number] > result : nums[i as number] < result) {
                result = nums[i as number];
            }
        }
        return result.toString();
    }
}
