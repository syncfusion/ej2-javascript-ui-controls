import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `MomentumIndicator` module is used to render Momentum indicator.
 */
export class MomentumIndicator extends TechnicalAnalysis {
    /**
     * Defines the collection of series to represent a momentum indicator
     * @private
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        super.initSeriesCollection(indicator, chart);
        let upperLine: Series = new Series(indicator, 'targetSeries', {}, true);
        super.setSeriesProperties(
            upperLine, indicator, 'UpperLine', indicator.upperLine.color, indicator.upperLine.width, chart);
    }

    /**
     * Defines the predictions using momentum approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let upperCollection: Points[] = [];
        let signalCollection: Points[] = [];

        let validData: Points[] = indicator.points;

        if (validData && validData.length) {
            let upperSeries: Series = indicator.targetSeries[1];
            let signalSeries: Series = indicator.targetSeries[0];

            let length: number = indicator.period;
            if (validData.length >= indicator.period) {
                for (let i: number = 0; i < validData.length; i++) {
                    upperCollection.push(this.getDataPoint(
                        validData[i].x, 100, validData[i], upperSeries, upperCollection.length));
                    if (!(i < length)) {
                        signalCollection.push(this.getDataPoint(
                            validData[i].x,
                            (Number(validData[i].close) / Number(validData[i - length].close) * 100),
                            validData[i], signalSeries, signalCollection.length));
                    }
                }
            }
            this.setSeriesRange(signalCollection, indicator, indicator.targetSeries[0]);
            this.setSeriesRange(upperCollection, indicator, indicator.targetSeries[1]);
        }
    }

    /**
     * To destroy the momentum indicator
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the momentum indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'MomentumIndicator';
    }
}