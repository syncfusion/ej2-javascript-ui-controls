import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `StochasticIndicator` module is used to render stochastic indicator.
 */
export class StochasticIndicator extends TechnicalAnalysis {

    /**
     * Defines the collection of series that represents the stochastic indicator
     * @private
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        super.initSeriesCollection(indicator, chart);
        let periodLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(
            periodLine, indicator, 'PeriodLine', indicator.periodLine.color,
            indicator.periodLine.width, chart);
        if (indicator.showZones) {
            let upperSeries: Series = new Series(indicator, 'targetSeries', {}, true);
            this.setSeriesProperties(
                upperSeries, indicator, 'UpperLine', indicator.upperLine.color,
                indicator.upperLine.width, chart);
            let lowerSeries: Series = new Series(indicator, 'targetSeries', {}, true);
            this.setSeriesProperties(
                lowerSeries, indicator, 'LowerLine', indicator.lowerLine.color,
                indicator.lowerLine.width, chart);
        }
    }

    /**
     * Defines the predictions based on stochastic approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let signalCollection: Points[] = [];
        let upperCollection: Points[] = [];
        let lowerCollection: Points[] = [];
        let periodCollection: Points[] = [];
        let source: Points[] = [];
        let sourceSeries: Series = indicator.sourceSeries;
        let point: Object = {};
        //prepare data
        let validData: Points[] = indicator.points;
        if (validData.length && validData.length >= indicator.period) {
            if (indicator.showZones) {
                for (let i: number = 0; i < validData.length; i++) {
                    upperCollection.push(this.getDataPoint(
                        validData[i].x, indicator.overBought, validData[i], indicator.targetSeries[2],
                        upperCollection.length));
                    lowerCollection.push(this.getDataPoint(
                        validData[i].x, indicator.overSold, validData[i], indicator.targetSeries[3],
                        lowerCollection.length));
                }
            }
            source = this.calculatePeriod(
                indicator.period, indicator.kPeriod, validData, indicator.targetSeries[1]);
            periodCollection = this.smaCalculation(
                indicator.period, indicator.kPeriod, source, indicator.targetSeries[1]);
            signalCollection = this.smaCalculation(
                indicator.period + indicator.kPeriod - 1, indicator.dPeriod, source, indicator.targetSeries[0]);
        }

        this.setSeriesRange(signalCollection, indicator, indicator.targetSeries[0]);
        this.setSeriesRange(periodCollection, indicator, indicator.targetSeries[1]);
        if (indicator.showZones) {
            this.setSeriesRange(upperCollection, indicator, indicator.targetSeries[2]);
            this.setSeriesRange(lowerCollection, indicator, indicator.targetSeries[3]);
        }
    }

    /**
     * Calculates the SMA Values
     * @private
     */
    private smaCalculation(period: number, kPeriod: number, data: Points[], sourceSeries: Series): Points[] {
        let pointCollection: Points[] = [];
        if (data.length >= period + kPeriod) {
            let count: number = period + (kPeriod - 1);
            let temp: Object[] = [];
            let values: Object[] = [];
            for (let i: number = 0; i < data.length; i++) {
                let value: number = Number(data[i].y);
                temp.push(value);
            }
            let length: number = temp.length;
            while (length >= count) {
                let sum: number = 0;
                for (let i: number = period - 1; i < (period + kPeriod - 1); i++) {
                    sum = sum + (temp[i] as number);

                }
                sum = sum / kPeriod;
                values.push(sum.toFixed(2));
                temp.splice(0, 1);
                length = temp.length;
            }
            let len: number = count - 1;
            for (let i: number = 0; i < data.length; i++) {
                if (!(i < len)) {
                    pointCollection.push(this.getDataPoint(
                        data[i].x, Number(values[i - len]), data[i], sourceSeries, pointCollection.length));
                    data[i].y = Number((values[i - len]));
                }
            }
        }
        return pointCollection;
    }

    /**
     * Calculates the period line values.
     * @private
     */
    private calculatePeriod(
        period: number, kPeriod: number, data: Points[], series: Series): Points[] {
        let lowValues: Object[] = [];
        let highValues: Object[] = [];
        let closeValues: Object[] = [];
        let modifiedSource: Points[] = [];
        for (let j: number = 0; j < data.length; j++) {
            lowValues[j] = data[j].low;
            highValues[j] = data[j].high;
            closeValues[j] = data[j].close;
        }
        if (data.length > period) {
            let totalPeriod: number = period + kPeriod;
            let mins: Object[] = [];
            let maxs: Object[] = [];
            for (let i: number = 0; i < period - 1; ++i) {
                maxs.push(0);
                mins.push(0);
                modifiedSource.push(this.getDataPoint(
                    data[i].x, data[i].close, data[i], series, modifiedSource.length));
            }
            for (let i: number = period - 1; i < data.length; ++i) {
                let min: number = Number.MAX_VALUE;
                let max: number = Number.MIN_VALUE;
                for (let j: number = 0; j < period; ++j) {
                    min = Math.min(min, (lowValues[i - j] as number));
                    max = Math.max(max, (highValues[i - j] as number));
                }
                maxs.push(max);
                mins.push(min);
            }

            for (let i: number = period - 1; i < data.length; ++i) {
                let top: number = 0;
                let bottom: number = 0;
                top += (closeValues[i] as number) - (mins[i] as number);
                bottom += (maxs[i] as number) - (mins[i] as number);
                modifiedSource.push(this.getDataPoint(
                    data[i].x, (top / bottom) * 100, data[i], series, modifiedSource.length));
            }
        }
        return modifiedSource;
    }

    /**
     * To destroy the Stocastic Indicator.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the stochastic indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the indicator.
         */
        return 'StochasticIndicator';
    }
}
