import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * The `AtrIndicator` module is used to render the Average True Range indicator.
 */

export class AtrIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions using Average True Range approach
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the data source is to be initialized.
     * @returns {void}
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        const validData: Points[] = indicator.points;
        if (validData.length > 0 && validData.length > indicator.period) {
            this.calculateATRPoints(indicator, validData);
        }
    }

    /**
     * Calculates the Average True Range (ATR) points for a technical indicator.
     *
     * @param {TechnicalIndicator} indicator - The technical indicator for which the ATR points are calculated.
     * @param {Points[]} validData - The valid data points used for calculation.
     * @returns {void}
     */
    private calculateATRPoints(indicator: TechnicalIndicator, validData: Points[]): void {
        let average: number = 0;
        let highLow: number = 0;
        let highClose: number = 0;
        let lowClose: number = 0;
        let trueRange: number = 0;
        const points: Points[] = [];
        const temp: Object[] = [];
        const period: number = indicator.period;
        let sum: number = 0;
        const y: string = 'y';
        const signalSeries: Series = indicator.targetSeries[0];
        for (let i: number = 0; i < validData.length; i++) {
            /**
             * Current High less the current Low
             * Current High less the previous Close (absolute value)
             * Current Low less the previous Close (absolute value)
             */
            highLow = Number(validData[i as number].high) - Number(validData[i as number].low);
            if (i > 0) {
                //
                highClose = Math.abs(Number(validData[i as number].high) - Number(validData[i - 1].close));
                lowClose = Math.abs(Number(validData[i as number].low) - Number(validData[i - 1].close));
            }
            /**
             * To find the maximum of highLow, highClose, lowClose
             */
            trueRange = Math.max(highLow, highClose, lowClose);
            sum = sum + trueRange;
            /**
             * Push the x and y values for the Average true range indicator
             */
            if (i >= period) {
                average = (Number(temp[i - 1][y as string]) * (period - 1) + trueRange) / period;
                points.push(this.getDataPoint(
                    validData[i as number].x, average, validData[i as number], signalSeries, points.length));
            } else {
                average = sum / period;
                if (i === period - 1) {
                    points.push(this.getDataPoint(
                        validData[i as number].x, average, validData[i as number], signalSeries, points.length));
                }
            }
            temp[i as number] = { x: validData[i as number].x, y: average };
        }
        this.setSeriesRange(points, indicator);
    }

    /**
     * To destroy the Average true range indicator.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy the Average true range indicator.
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the Indicator.
         */
        return 'AtrIndicator';
    }

}
