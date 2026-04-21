import { Series, Points } from '../series/chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * The `EmaIndicator` module is used to render the Exponential Moving Average indicator.
 */
export class EmaIndicator extends TechnicalAnalysis {
    /**
     * Defines the predictions based on EMA approach.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the data source is to be initialized.
     * @returns {void}
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        const field: string = firstToLowerCase(indicator.field);
        const xField: string = 'x';
        const emaPoints: Points[] = [];
        const signalSeries: Series = indicator.targetSeries[0];

        //prepare data
        const validData: Points[] = indicator.points;

        if (validData && validData.length && validData.length >= indicator.period) {

            //find initial average
            let sum: number = 0;
            let average: number = 0;

            //smoothing factor
            const k: number = (2 / (indicator.period + 1));

            for (let i: number = 0; i < indicator.period; i++) {
                sum += validData[i as number][field as string];
            }

            average = sum / indicator.period;

            emaPoints.push(this.getDataPoint(
                validData[indicator.period - 1][xField as string], average,
                validData[indicator.period - 1], signalSeries, emaPoints.length));

            let index: number = indicator.period;
            while (index < validData.length) {
                //previous average
                const prevAverage: number = emaPoints[index - indicator.period][signalSeries.yName];

                const yValue: number = (validData[index as number][field as string] - prevAverage) * k + prevAverage;

                emaPoints.push(this.getDataPoint(
                    validData[index as number][xField as string], yValue,
                    validData[index as number], signalSeries, emaPoints.length));

                index++;
            }
        }
        this.setSeriesRange(emaPoints, indicator);
    }

    /**
     * To destroy the EMA Indicator.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the EMA Indicator.
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series.
         */
        return 'EmaIndicator';
    }
}
