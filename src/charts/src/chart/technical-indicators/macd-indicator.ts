import { Series, Points } from '../series/chart-series';
import { Chart } from '../chart';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * The `MacdIndicator` module is used to render the Moving Average Convergence Divergence indicator.
 */
export class MacdIndicator extends TechnicalAnalysis {
    /**
     * Defines the collection of series to represent the MACD indicator
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the series collection is initialized.
     * @param {Chart} chart - The chart associated with the technical indicator.
     * @returns {void}
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        super.initSeriesCollection(indicator, chart);

        if (indicator.macdType === 'Line' || indicator.macdType === 'Both') {
            const macdSeries: Series = new Series(indicator, 'targetSeries', {}, true);
            this.setSeriesProperties(
                macdSeries, indicator, 'MacdLine', indicator.macdLine.color,
                indicator.macdLine.width, chart);
        }
        if (indicator.macdType === 'Histogram' || indicator.macdType === 'Both') {
            const histogramSeries: Series = new Series(indicator, 'targetSeries', {}, true);
            histogramSeries.type = 'Column';
            this.setSeriesProperties(
                histogramSeries, indicator, 'Histogram', indicator.macdPositiveColor,
                indicator.width, chart);
        }
    }

    /**
     * Defines the predictions using MACD approach.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the data source is to be initialized.
     * @returns {void}
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        let signalCollection: Points[] = [];
        const fastPeriod: number = indicator.fastPeriod;
        const slowPeriod: number = indicator.slowPeriod;
        const trigger: number = indicator.period;
        const length: number = fastPeriod + trigger;
        let macdCollection: Points[] = [];
        let histogramCollection: Points[] = [];
        const validData: Points[] = indicator.points;
        const signalSeries: Series = indicator.targetSeries[0];

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
            const shortEMA: number[] = this.calculateEMAValues(slowPeriod, validData, 'close');
            const longEMA: number[] = this.calculateEMAValues(fastPeriod, validData, 'close');
            const macdValues: number[] = this.getMACDVales(indicator, shortEMA, longEMA);
            macdCollection = this.getMACDPoints(indicator, macdValues, validData, macdLineSeries || signalSeries);
            const signalEMA: number[] = this.calculateEMAValues(trigger, macdCollection, 'y');
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
     * Calculates Exponential Moving Average (EMA) values for the given period and valid data points.
     *
     * @private
     * @param {number} period - The period for which EMA values are to be calculated.
     * @param {Points[]} validData - The valid data points used for calculating EMA.
     * @param {string} field - The field of the data points to be used for EMA calculation.
     * @returns {number[]} - An array containing the calculated EMA values.
     */
    private calculateEMAValues(period: number, validData: Points[], field: string): number[] {
        let sum: number = 0;
        let initialEMA: number = 0;
        const emaValues: number[] = [];
        const emaPercent: number = (2 / (period + 1));
        for (let i: number = 0; i < period; i++) {
            sum += Number(validData[i as number][field as string]);
        }
        initialEMA = (sum / period);
        emaValues.push(initialEMA);
        let emaAvg: number = initialEMA;
        for (let j: number = period; j < validData.length; j++) {
            emaAvg = (Number(validData[j as number][field as string]) - emaAvg) * emaPercent + emaAvg;
            emaValues.push(emaAvg);
        }
        return emaValues;
    }

    /**
     * Calculates Moving Average Convergence Divergence (MACD) points based on the provided MACD values,
     * valid data points, and series information.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The MACD indicator.
     * @param {number[]} macdPoints - The array of MACD values.
     * @param {Points[]} validData - The valid data points used for calculating MACD.
     * @param {Series} series - The series information.
     * @returns {Points[]} - An array containing the calculated MACD points.
     */
    private getMACDPoints(
        indicator: TechnicalIndicator, macdPoints: number[], validData: Points[], series: Series): Points[] {
        const macdCollection: Points[] = [];
        let dataMACDIndex: number = indicator.fastPeriod - 1;
        let macdIndex: number = 0;
        while (dataMACDIndex < validData.length) {
            macdCollection.push(this.getDataPoint(
                validData[dataMACDIndex as number].x, macdPoints[macdIndex as number], validData[dataMACDIndex as number], series,
                macdCollection.length));
            dataMACDIndex++;
            macdIndex++;
        }
        return macdCollection;
    }

    /**
     * Calculates the signal line points for the Moving Average Convergence Divergence (MACD) indicator
     * based on the provided signal EMA values, valid data points, and series information.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The MACD indicator.
     * @param {number[]} signalEma - The array of signal EMA values.
     * @param {Points[]} validData - The valid data points used for calculating MACD.
     * @param {Series} series - The series information.
     * @returns {Points[]} - An array containing the calculated signal line points.
     */
    private getSignalPoints(
        indicator: TechnicalIndicator, signalEma: number[], validData: Points[], series: Series): Points[] {

        let dataSignalIndex: number = indicator.fastPeriod + indicator.period - 2;
        let signalIndex: number = 0;
        const signalCollection: Points[] = [];
        while (dataSignalIndex < validData.length) {
            signalCollection.push(this.getDataPoint(
                validData[dataSignalIndex as number].x, signalEma[signalIndex as number], validData[dataSignalIndex as number], series,
                signalCollection.length));
            dataSignalIndex++;
            signalIndex++;
        }
        return signalCollection;
    }

    /**
     * Calculates the Moving Average Convergence Divergence (MACD) values based on the provided short EMA
     * and long EMA values for the MACD indicator.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The MACD indicator.
     * @param {number[]} shortEma - The array of short EMA values.
     * @param {number[]} longEma - The array of long EMA values.
     * @returns {number[]} - An array containing the calculated MACD values.
     */
    private getMACDVales(indicator: TechnicalIndicator, shortEma: number[], longEma: number[]): number[] {
        const macdPoints: number[] = [];
        const diff: number = indicator.fastPeriod - indicator.slowPeriod;
        for (let i: number = 0; i < longEma.length; i++) {
            macdPoints.push((shortEma[i + diff] - longEma[i as number]));
        }
        return macdPoints;
    }

    /**
     * Calculates the histogram points for the MACD indicator based on the provided MACD values and signal EMA values.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The MACD indicator.
     * @param {number[]} macdPoints - The array of MACD values.
     * @param {number[]} signalEma - The array of signal EMA values.
     * @param {Points[]} validData - The array of valid data points.
     * @param {Series} series - The series associated with the MACD indicator.
     * @returns {Points[]} - An array containing the calculated histogram points.
     */
    private getHistogramPoints(
        indicator: TechnicalIndicator, macdPoints: number[], signalEma: number[],
        validData: Points[], series: Series): Points[] {

        let dataHistogramIndex: number = indicator.fastPeriod + indicator.period - 2;
        let histogramIndex: number = 0;
        const histogramCollection: Points[] = [];

        while (dataHistogramIndex < validData.length) {
            histogramCollection.push(this.getDataPoint(
                validData[dataHistogramIndex as number].x, macdPoints[histogramIndex + (indicator.period - 1)] -
                signalEma[histogramIndex as number],
                validData[dataHistogramIndex as number], series, histogramCollection.length, indicator));
            dataHistogramIndex++;
            histogramIndex++;
        }
        return histogramCollection;
    }

    /**
     * To destroy the MACD Indicator.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the MACD indicator.
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
        return 'MacdIndicator';
    }
}
