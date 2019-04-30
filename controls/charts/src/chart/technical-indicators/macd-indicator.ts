import { Series, Points } from '../series/chart-series';
import { Chart } from '../chart';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * `MacdIndicator` module is used to render MACD indicator.
 */
export class MacdIndicator extends TechnicalAnalysis {
    /**
     * Defines the collection of series to represent the MACD indicator
     * @private
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        super.initSeriesCollection(indicator, chart);

        if (indicator.macdType === 'Line' || indicator.macdType === 'Both') {
            let macdSeries: Series = new Series(indicator, 'targetSeries', {}, true);
            this.setSeriesProperties(
                macdSeries, indicator, 'MacdLine', indicator.macdLine.color,
                indicator.macdLine.width, chart);
        }
        if (indicator.macdType === 'Histogram' || indicator.macdType === 'Both') {
            let histogramSeries: Series = new Series(indicator, 'targetSeries', {}, true);
            histogramSeries.type = 'Column';
            this.setSeriesProperties(
                histogramSeries, indicator, 'Histogram', indicator.macdPositiveColor,
                indicator.width, chart);
        }
    }

    /**
     * Defines the predictions using MACD approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let signalCollection: Points[] = [];
        let fastPeriod: number = indicator.fastPeriod;
        let slowPeriod: number = indicator.slowPeriod;
        let trigger: number = indicator.period;
        let length: number = fastPeriod + trigger;
        let macdCollection: Points[] = [];
        let histogramCollection: Points[] = [];
        let validData: Points[] = indicator.points;
        let signalSeries: Series = indicator.targetSeries[0];

        let histogramSeries: Series; let macdLineSeries: Series;

        if (indicator.macdType === 'Histogram') {
            histogramSeries = indicator.targetSeries[1];
        } else {
            macdLineSeries = indicator.targetSeries[1];
            if (indicator.macdType === 'Both') {
                histogramSeries = indicator.targetSeries[2];
            }
        }

        if (validData && length < validData.length && slowPeriod <= fastPeriod &&
            slowPeriod > 0 && (length - 2) >= 0) {
            let shortEMA: number[] = this.calculateEMAValues(slowPeriod, validData, 'close');
            let longEMA: number[] = this.calculateEMAValues(fastPeriod, validData, 'close');
            let macdValues: number[] = this.getMACDVales(indicator, shortEMA, longEMA);
            macdCollection = this.getMACDPoints(indicator, macdValues, validData, macdLineSeries || signalSeries);
            let signalEMA: number[] = this.calculateEMAValues(trigger, macdCollection, 'y');
            signalCollection = this.getSignalPoints(indicator, signalEMA, validData, signalSeries);
            if (histogramSeries) {
                histogramCollection = this.getHistogramPoints(
                    indicator, macdValues, signalEMA, validData, histogramSeries);
            }
        }

        this.setSeriesRange(signalCollection, indicator, indicator.targetSeries[0]);
        if (histogramSeries) {
            this.setSeriesRange(histogramCollection, indicator, histogramSeries);
        }
        if (macdLineSeries) {
            this.setSeriesRange(macdCollection, indicator, macdLineSeries);
        }
    }

    /**
     * Calculates the EMA values for the given period
     */
    private calculateEMAValues(period: number, validData: Points[], field: string): number[] {
        let sum: number = 0;
        let initialEMA: number = 0;
        let emaValues: number[] = [];
        let emaPercent: number = (2 / (period + 1));
        for (let i: number = 0; i < period; i++) {
            sum += Number(validData[i][field]);
        }
        initialEMA = (sum / period);
        emaValues.push(initialEMA);
        let emaAvg: number = initialEMA;
        for (let j: number = period; j < validData.length; j++) {
            emaAvg = (Number(validData[j][field]) - emaAvg) * emaPercent + emaAvg;
            emaValues.push(emaAvg);
        }
        return emaValues;
    }

    /**
     * Defines the MACD Points
     */
    private getMACDPoints(
        indicator: TechnicalIndicator, macdPoints: number[], validData: Points[], series: Series): Points[] {
        let macdCollection: Points[] = [];
        let dataMACDIndex: number = indicator.fastPeriod - 1;
        let macdIndex: number = 0;
        while (dataMACDIndex < validData.length) {
            macdCollection.push(this.getDataPoint(
                validData[dataMACDIndex].x, macdPoints[macdIndex], validData[dataMACDIndex], series,
                macdCollection.length));
            dataMACDIndex++;
            macdIndex++;
        }
        return macdCollection;
    }

    /**
     * Calculates the signal points
     */
    private getSignalPoints(
        indicator: TechnicalIndicator, signalEma: number[], validData: Points[], series: Series): Points[] {

        let dataSignalIndex: number = indicator.fastPeriod + indicator.period - 2;
        let signalIndex: number = 0;
        let signalCollection: Points[] = [];
        while (dataSignalIndex < validData.length) {
            signalCollection.push(this.getDataPoint(
                validData[dataSignalIndex].x, signalEma[signalIndex], validData[dataSignalIndex], series,
                signalCollection.length));
            dataSignalIndex++;
            signalIndex++;
        }
        return signalCollection;
    }

    /**
     * Calculates the MACD values
     */
    private getMACDVales(indicator: TechnicalIndicator, shortEma: number[], longEma: number[]): number[] {
        let macdPoints: number[] = [];
        let diff: number = indicator.fastPeriod - indicator.slowPeriod;
        for (let i: number = 0; i < longEma.length; i++) {
            macdPoints.push((shortEma[i + diff] - longEma[i]));
        }
        return macdPoints;
    }

    /**
     * Calculates the Histogram Points
     */
    private getHistogramPoints(
        indicator: TechnicalIndicator, macdPoints: number[], signalEma: number[],
        validData: Points[], series: Series): Points[] {

        let dataHistogramIndex: number = indicator.fastPeriod + indicator.period - 2;
        let histogramIndex: number = 0;
        let histogramCollection: Points[] = [];

        while (dataHistogramIndex < validData.length) {
            histogramCollection.push(this.getDataPoint(
                validData[dataHistogramIndex].x, macdPoints[histogramIndex + (indicator.period - 1)] - signalEma[histogramIndex],
                validData[dataHistogramIndex], series, histogramCollection.length, indicator));
            dataHistogramIndex++;
            histogramIndex++;
        }
        return histogramCollection;
    }

    /**
     * To destroy the MACD Indicator.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the MACD indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'MacdIndicator';
    }
}
