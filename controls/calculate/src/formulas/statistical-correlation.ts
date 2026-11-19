import { FormulasErrorsStrings, CommonErrors, IBasicFormula } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormulaOwner } from './formula-owner';
import { StatisticalSampleBase } from './statistical-sample-base';

/**
 * Covariance, correlation, and regression slope/intercept between paired data sets.
 *
 * Registered functions: CORREL, COVAR, PEARSON, FORECAST, STEYX.
 *
 * @hidden
 */
export class StatisticalCorrelationFormulas extends StatisticalSampleBase {
    /** Formula definitions registered with {@link BasicFormulas}. */
    public formulas: IBasicFormula[] = [
        { formulaName: 'CORREL', category: 'Statistical', description: 'Returns the correlation coefficient between two data sets.', syntax: 'CORREL(array1, array2)' },
        { formulaName: 'COVAR', category: 'Statistical', description: 'Returns covariance, the average of the products of paired deviations.', syntax: 'COVAR(array1, array2)' },
        { formulaName: 'PEARSON', category: 'Statistical', description: 'Returns the Pearson product moment correlation coefficient.', syntax: 'PEARSON(array1, array2)' },
        { formulaName: 'FORECAST', category: 'Statistical', description: 'Returns a value along a linear trend.', syntax: 'FORECAST(x, known_y\'s, known_x\'s)' },
        { formulaName: 'STEYX', category: 'Statistical', description: 'Returns the standard error of the predicted y-value for each x in the regression.', syntax: 'STEYX(known_y\'s, known_x\'s)' }
    ];

    /**
     * @hidden
     * @param {FormulaOwner} owner - Formula registration owner ({@link BasicFormulas}).
     */
    constructor(owner: FormulaOwner) {
        super(owner);
    }

    private regressionStats(args: string[]): {
        n: number, meanX: number, meanY: number, sxx: number, syy: number, sxy: number
    } | string {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const pair: { x: number[], y: number[] } | string = this.collectPair(args);
        if (typeof pair === 'string') { return pair; }
        const { x, y } = pair;
        if (x.length < 2) { return errCollection[CommonErrors.DivZero]; }
        const meanX: number = this.mean(x);
        const meanY: number = this.mean(y);
        let sxx: number = 0;
        let syy: number = 0;
        let sxy: number = 0;
        for (let i: number = 0; i < x.length; i++) {
            const dx: number = x[i as number] - meanX;
            const dy: number = y[i as number] - meanY;
            sxx += dx * dx;
            syy += dy * dy;
            sxy += dx * dy;
        }
        return { n: x.length, meanX, meanY, sxx, syy, sxy };
    }

    /**
     * Returns the correlation coefficient between two data sets.
     *
     * Excel: `CORREL(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     *
     * @example
     * ```ts
     * engine.computeFormula('=CORREL(1)');
     * ```
     */
    public ComputeCORREL(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const stats: ReturnType<StatisticalCorrelationFormulas['regressionStats']> = this.regressionStats(args);
        if (typeof stats === 'string') { return stats; }
        if (stats.sxx === 0 || stats.syy === 0) { return errCollection[CommonErrors.DivZero]; }
        return (stats.sxy / Math.sqrt(stats.sxx * stats.syy)).toString();
    }

    /**
     * Returns the Pearson product moment correlation coefficient.
     *
     * Excel: `PEARSON(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputePEARSON(...args: string[]): string | number {
        return this.ComputeCORREL(...args);
    }

    /**
     * Returns covariance, the average of the products of paired deviations.
     *
     * Excel: `COVAR(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeCOVAR(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const stats: ReturnType<StatisticalCorrelationFormulas['regressionStats']> = this.regressionStats(args);
        if (typeof stats === 'string') { return stats; }
        if (stats.n < 2) { return errCollection[CommonErrors.DivZero]; }
        return (stats.sxy / (stats.n - 1)).toString();
    }

    /**
     * Returns a value along a linear trend.
     *
     * Excel: `FORECAST(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeFORECAST(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        if (isNullOrUndefined(args) || args.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const xVal: number | string = this.resolveNumberArg(args[0]);
        if (typeof xVal === 'string') { return xVal; }
        const stats: ReturnType<StatisticalCorrelationFormulas['regressionStats']> = this.regressionStats([args[2], args[1]]);
        if (typeof stats === 'string') { return stats; }
        if (stats.sxx === 0) { return errCollection[CommonErrors.DivZero]; }
        const slope: number = stats.sxy / stats.sxx;
        const intercept: number = stats.meanY - slope * stats.meanX;
        return (intercept + slope * xVal).toString();
    }

    /**
     * Returns the standard error of the predicted y-value for each x in the regression.
     *
     * Excel: `STEYX(...)`.
     *
     * @hidden
     * @param {string[]} args - Formula argument tokens from the Calculate engine.
     * @returns {string | number} - Computed Excel-compatible numeric or text result, or an error token such as `#VALUE!`, `#NUM!`, `#N/A`.
     */
    public ComputeSTEYX(...args: string[]): string | number {
        const errCollection: string[] = this.parent.getErrorStrings();
        const stats: ReturnType<StatisticalCorrelationFormulas['regressionStats']> = this.regressionStats([args[1], args[0]]);
        if (typeof stats === 'string') { return stats; }
        if (stats.n <= 2 || stats.sxx === 0) { return errCollection[CommonErrors.DivZero]; }
        const ssRes: number = stats.syy - (stats.sxy * stats.sxy) / stats.sxx;
        return Math.sqrt(ssRes / (stats.n - 2)).toString();
    }
}
