import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';

/**
 * ECMA-376 linear and exponential regression/trend functions (LINEST, LOGEST, TREND, GROWTH).
 *
 * Registered functions: LINEST, LOGEST, GROWTH, TREND.
 *
 * @hidden
 */
export class RegressionEcmaFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'LINEST', category: 'Statistical', description: 'Returns statistics that describe a linear trend.', syntax: 'LINEST(known_y\'s, [known_x\'s], [const], [stats])' },
        { formulaName: 'LOGEST', category: 'Statistical', description: 'Returns statistics that describe an exponential curve.', syntax: 'LOGEST(known_y\'s, [known_x\'s], [const], [stats])' },
        { formulaName: 'GROWTH', category: 'Statistical', description: 'Returns numbers in an exponential growth trend.', syntax: 'GROWTH(known_y_range, [known_x_range])' },
        { formulaName: 'TREND', category: 'Statistical', description: 'Returns numbers in a linear trend.', syntax: 'TREND(known_y_range, [known_x_range], [new_x_range])' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private linearRegression(yArg: string, xArg: string): { slope: number, intercept: number } | string {
        const pair: { x: number[], y: number[] } | string = this.collectPair([xArg, yArg]);
        if (typeof pair === 'string') {
            return pair;
        }
        const { x, y } = pair;
        if (x.length < 2) {
            return this.parent.getErrorStrings()[CommonErrors.NA];
        }
        const meanX: number = this.mean(x);
        const meanY: number = this.mean(y);
        let sxx: number = 0;
        let sxy: number = 0;
        for (let i: number = 0; i < x.length; i++) {
            const dx: number = x[i as number] - meanX;
            sxx += dx * dx;
            sxy += dx * (y[i as number] - meanY);
        }
        if (sxx === 0) {
            return this.parent.getErrorStrings()[CommonErrors.DivZero];
        }
        const slope: number = sxy / sxx;
        const intercept: number = meanY - slope * meanX;
        return { slope, intercept };
    }

    private expRegression(yArg: string, xArg: string): { b: number, m: number } | string {
        const pair: { x: number[], y: number[] } | string = this.collectPair([xArg, yArg]);
        if (typeof pair === 'string') {
            return pair;
        }
        const { x, y } = pair;
        const errCollection: string[] = this.parent.getErrorStrings();
        if (x.length < 2) {
            return errCollection[CommonErrors.NA];
        }
        const lnY: number[] = [];
        for (let i: number = 0; i < y.length; i++) {
            if (y[i as number] <= 0) {
                return errCollection[CommonErrors.Num];
            }
            lnY.push(Math.log(y[i as number]));
        }
        const meanX: number = this.mean(x);
        const meanLnY: number = this.mean(lnY);
        let sxx: number = 0;
        let sxy: number = 0;
        for (let i: number = 0; i < x.length; i++) {
            const dx: number = x[i as number] - meanX;
            sxx += dx * dx;
            sxy += dx * (lnY[i as number] - meanLnY);
        }
        if (sxx === 0) {
            return errCollection[CommonErrors.DivZero];
        }
        const m: number = sxy / sxx;
        const b: number = Math.exp(meanLnY - m * meanX);
        return { b, m };
    }

    /**
     * Returns statistics that describe a linear trend (slope when spill unavailable).
     *
     * Excel: `LINEST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=LINEST(1)');
     * ```
     */
    public ComputeLINEST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const reg: ReturnType<RegressionEcmaFormulas['linearRegression']> = this.linearRegression(args[0], args[1]);
        if (typeof reg === 'string') {
            return reg;
        }
        return reg.slope.toString();
    }

    /**
     * Returns statistics that describe an exponential curve (first coefficient when spill unavailable).
     *
     * Excel: `LOGEST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeLOGEST(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const reg: ReturnType<RegressionEcmaFormulas['expRegression']> = this.expRegression(args[0], args[1]);
        if (typeof reg === 'string') {
            return reg;
        }
        return reg.b.toString();
    }

    /**
     * Returns y values along a linear trend (first predicted value when spill unavailable).
     *
     * Excel: `TREND(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeTREND(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const reg: ReturnType<RegressionEcmaFormulas['linearRegression']> = this.linearRegression(args[0], args[1]);
        if (typeof reg === 'string') {
            return reg;
        }
        let xVal: number;
        if (args.length === 3 && args[2] !== '') {
            const xNew: number[] | string = this.collectSample([args[2]], false);
            if (typeof xNew === 'string') {
                return xNew;
            }
            if (xNew.length === 0) {
                return this.parent.getErrorStrings()[CommonErrors.NA];
            }
            xVal = xNew[0];
        } else {
            const xData: number[] | string = this.collectSample([args[1]], false);
            if (typeof xData === 'string') {
                return xData;
            }
            xVal = xData[xData.length - 1] + 1;
        }
        return (reg.intercept + reg.slope * xVal).toString();
    }

    /**
     * Returns y values along an exponential growth trend (first predicted value when spill unavailable).
     *
     * Excel: `GROWTH(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeGROWTH(...args: string[]): string | number {
        if (isNullOrUndefined(args) || args.length < 2 || args.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const reg: ReturnType<RegressionEcmaFormulas['expRegression']> = this.expRegression(args[0], args[1]);
        if (typeof reg === 'string') {
            return reg;
        }
        let xVal: number;
        if (args.length === 3 && args[2] !== '') {
            const xNew: number[] | string = this.collectSample([args[2]], false);
            if (typeof xNew === 'string') {
                return xNew;
            }
            if (xNew.length === 0) {
                return this.parent.getErrorStrings()[CommonErrors.NA];
            }
            xVal = xNew[0];
        } else {
            const xData: number[] | string = this.collectSample([args[1]], false);
            if (typeof xData === 'string') {
                return xData;
            }
            xVal = xData[xData.length - 1] + 1;
        }
        return (reg.b * Math.pow(Math.E, reg.m * xVal)).toString();
    }
}
