import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * The `RsiIndicator` module is used to render the Relative Strength Index indicator.
 */
export class RsiIndicator extends TechnicalAnalysis {

    /**
     * Initializes the series collection to represent the RSI Indicator
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the series collection is initialized.
     * @param {Chart} chart - The chart associated with the technical indicator.
     * @returns {void}
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        super.initSeriesCollection(indicator, chart);
        if (indicator.showZones) {
            const lowerLine: Series = new Series(indicator, 'targetSeries', {}, true);
            super.setSeriesProperties(
                lowerLine, indicator, 'LowerLine', indicator.lowerLine.color, indicator.lowerLine.width, chart);
            const upperLine: Series = new Series(indicator, 'targetSeries', {}, true);
            super.setSeriesProperties(
                upperLine, indicator, 'UpperLine', indicator.upperLine.color, indicator.upperLine.width, chart);
        }
    }

    /**
     * Defines the predictions using RSI approach
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the data source is to be initialized.
     * @returns {void}
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        const signalCollection: Points[] = [];
        const lowerCollection: Points[] = [];
        const upperCollection: Points[] = [];
        const signalSeries: Series = indicator.targetSeries[0];

        //prepare data
        const validData: Points[] = indicator.points;

        if (validData.length && validData.length >= indicator.period) {

            //Find upper band and lower band values
            if (indicator.showZones) {
                for (let i: number = 0; i < validData.length; i++) {
                    upperCollection.push(this.getDataPoint(
                        validData[i as number].x, indicator.overBought, validData[i as number], indicator.targetSeries[1],
                        upperCollection.length));
                    lowerCollection.push(this.getDataPoint(
                        validData[i as number].x, indicator.overSold, validData[i as number], indicator.targetSeries[2],
                        lowerCollection.length));
                }
            }
            //Find signal line value
            let prevClose: number = Number(validData[0].close);
            let gain: number = 0;
            let loss: number = 0;
            for (let i: number = 1; i <= indicator.period; i++) {
                const close: number = Number(validData[i as number].close);
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
                const close: number = Number(validData[j as number].close);
                if (close > prevClose) {
                    gain = (gain * (indicator.period - 1) + (close - prevClose)) / indicator.period;
                    loss = (loss * (indicator.period - 1)) / indicator.period;
                } else if (close < prevClose) {
                    loss = (loss * (indicator.period - 1) + (prevClose - close)) / indicator.period;
                    gain = (gain * (indicator.period - 1)) / indicator.period;
                }
                prevClose = close;
                signalCollection.push(this.getDataPoint(
                    validData[j as number].x, 100 - (100 / (1 + gain / loss)), validData[j as number], signalSeries,
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
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the RSI Indicator.
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the indicator.
         */
        return 'RsiIndicator';
    }
}
