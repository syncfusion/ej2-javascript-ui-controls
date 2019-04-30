import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `RsiIndicator` module is used to render RSI indicator.
 */
export class RsiIndicator extends TechnicalAnalysis {

    /**
     * Initializes the series collection to represent the RSI Indicator
     * @private
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        super.initSeriesCollection(indicator, chart);
        if (indicator.showZones) {
            let lowerLine: Series = new Series(indicator, 'targetSeries', {}, true);
            super.setSeriesProperties(
                lowerLine, indicator, 'LowerLine', indicator.lowerLine.color, indicator.lowerLine.width, chart);
            let upperLine: Series = new Series(indicator, 'targetSeries', {}, true);
            super.setSeriesProperties(
                upperLine, indicator, 'UpperLine', indicator.upperLine.color, indicator.upperLine.width, chart);
        }
    }

    /**
     * Defines the predictions using RSI approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let signalCollection: Points[] = [];
        let lowerCollection: Points[] = [];
        let upperCollection: Points[] = [];
        let signalSeries: Series = indicator.targetSeries[0];

        //prepare data
        let validData: Points[] = indicator.points;

        if (validData.length && validData.length >= indicator.period) {

            //Find upper band and lower band values
            if (indicator.showZones) {
                for (let i: number = 0; i < validData.length; i++) {
                    upperCollection.push(this.getDataPoint(
                        validData[i].x, indicator.overBought, validData[i], indicator.targetSeries[1],
                        upperCollection.length));
                    lowerCollection.push(this.getDataPoint(
                        validData[i].x, indicator.overSold, validData[i], indicator.targetSeries[2],
                        lowerCollection.length));
                }
            }
            //Find signal line value
            let prevClose: number = Number(validData[0].close);
            let gain: number = 0;
            let loss: number = 0;
            for (let i: number = 1; i <= indicator.period; i++) {
                let close: number = Number(validData[i].close);
                if (close > prevClose) {
                    gain += close - prevClose;
                } else {
                    loss += prevClose - close;
                }
                prevClose = close;
            }
            gain = gain / indicator.period;
            loss = loss / indicator.period;

            signalCollection.push(this.getDataPoint(
                validData[indicator.period].x, 100 - (100 / (1 + gain / loss)), validData[indicator.period],
                signalSeries, signalCollection.length));

            for (let j: number = indicator.period + 1; j < validData.length; j++) {
                let close: number = Number(validData[j].close);
                if (close > prevClose) {
                    gain = (gain * (indicator.period - 1) + (close - prevClose)) / indicator.period;
                    loss = (loss * (indicator.period - 1)) / indicator.period;
                } else if (close < prevClose) {
                    loss = (loss * (indicator.period - 1) + (prevClose - close)) / indicator.period;
                    gain = (gain * (indicator.period - 1)) / indicator.period;
                }
                prevClose = close;
                signalCollection.push(this.getDataPoint(
                    validData[j].x, 100 - (100 / (1 + gain / loss)), validData[j], signalSeries,
                    signalCollection.length));
            }
        }
        this.setSeriesRange(signalCollection, indicator, indicator.targetSeries[0]);
        if (indicator.showZones) {
            this.setSeriesRange(upperCollection, indicator, indicator.targetSeries[1]);
            this.setSeriesRange(lowerCollection, indicator, indicator.targetSeries[2]);
        }
    }

    /**
     * To destroy the RSI Indicator.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the RSI Indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the indicator.
         */
        return 'RsiIndicator';
    }
}
