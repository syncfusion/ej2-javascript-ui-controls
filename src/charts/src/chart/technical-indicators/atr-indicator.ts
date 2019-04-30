import { Series, Points } from '../series/chart-series';
import { Chart } from '../chart';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * `AtrIndicator` module is used to render ATR indicator.
 */

export class AtrIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions using Average True Range approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let validData: Points[] = indicator.points;
        if (validData.length > 0 && validData.length > indicator.period) {
            this.calculateATRPoints(indicator, validData);
        }
    }

    /**
     *  To calculate Average True Range indicator points
     * @private
     */
    private calculateATRPoints(indicator: TechnicalIndicator, validData: Points[]): void {
        let average: number = 0;
        let highLow: number = 0;
        let highClose: number = 0;
        let lowClose: number = 0;
        let trueRange: number = 0;
        let points: Points[] = [];
        let temp: Object[] = [];
        let period: number = indicator.period;
        let sum: number = 0;
        let y: string = 'y';
        let signalSeries: Series = indicator.targetSeries[0];
        for (let i: number = 0; i < validData.length; i++) {
            /** 
             * Current High less the current Low
             * Current High less the previous Close (absolute value)
             * Current Low less the previous Close (absolute value)
             */
            highLow = Number(validData[i].high) - Number(validData[i].low);
            if (i > 0) {
                //
                highClose = Math.abs(Number(validData[i].high) - Number(validData[i - 1].close));
                lowClose = Math.abs(Number(validData[i].low) - Number(validData[i - 1].close));
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
                average = (Number(temp[i - 1][y]) * (period - 1) + trueRange) / period;
                points.push(this.getDataPoint(
                    validData[i].x, average, validData[i], signalSeries, points.length));
            } else {
                average = sum / period;
                if (i === period - 1) {
                    points.push(this.getDataPoint(
                        validData[i].x, average, validData[i], signalSeries, points.length));
                }
            }
            temp[i] = { x: validData[i].x, y: average };
        }
        this.setSeriesRange(points, indicator);
    }

    /**
     * To destroy the Average true range indicator.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy the Average true range indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the Indicator
         */
        return 'AtrIndicator';
    }

}