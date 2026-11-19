import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * The `BollingerBands` module is used to render the Bollinger Band indicator.
 */
export class BollingerBands extends TechnicalAnalysis {

    /**
     * Initializes the series collection for a technical indicator.
     *
     * @param {TechnicalIndicator} indicator - The technical indicator for which the series collection is initialized.
     * @param {Chart} chart - The chart associated with the technical indicator.
     * @returns {void}
     * @private
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        indicator.targetSeries = [];
        const rangeArea: Series = new Series(indicator, 'targetSeries', {}, true);
        rangeArea.type = 'RangeArea';
        if (indicator.bandColor !== 'transparent' && indicator.bandColor !== 'none') {
            this.setSeriesProperties(
                rangeArea, indicator, 'BollingerBand', indicator.bandColor, 0, chart);
        }
        const signalLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(signalLine, indicator, 'BollingerBand', indicator.fill, indicator.width, chart);
        const upperLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(
            upperLine, indicator, 'UpperLine', indicator.upperLine.color,
            indicator.upperLine.width, chart);
        const lowerLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(
            lowerLine, indicator, 'LowerLine', indicator.lowerLine.color,
            indicator.lowerLine.width, chart);
    }

    /**
     * Defines the predictions using Bollinger Band Approach
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the data source is to be initialized.
     * @returns {void}
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        const enableBand: boolean = indicator.bandColor !== 'transparent' && indicator.bandColor !== 'none';
        const start: number = enableBand ? 1 : 0;
        const signalCollection: Points[] = [];
        const upperCollection: Points[] = [];
        const lowerCollection: Points[] = [];
        const bandCollection: Points[] = [];
        const upperSeries: Series = indicator.targetSeries[start + 1];
        const lowerSeries: Series = indicator.targetSeries[start + 2];
        const signalSeries: Series = indicator.targetSeries[start as number];
        const rangeAreaSeries: Series = enableBand ? indicator.targetSeries[0] : null;
        //prepare data
        const validData: Points[] = indicator.points;
        if (validData.length && validData.length >= indicator.period) {
            let sum: number = 0;
            let deviationSum: number = 0;
            const multiplier: number = indicator.standardDeviation;
            const limit: number = validData.length;
            const length: number = Math.round(indicator.period);
            const smaPoints: number[] = [];
            const deviations: number[] = [];
            const bollingerPoints: Object[] = [];

            for (let i: number = 0; i < length; i++) {
                sum += Number(validData[i as number].close);
            }
            let sma: number = sum / indicator.period;
            for (let i: number = 0; i < limit; i++) {
                const y: number = Number(validData[i as number].close);
                if (i >= length - 1 && i < limit) {
                    if (i - indicator.period >= 0) {
                        const diff: number = y - Number(validData[i - length].close);
                        sum = sum + diff;
                        sma = sum / (indicator.period);
                        smaPoints[i as number] = sma;
                        deviations[i as number] = Math.pow(y - sma, 2);
                        deviationSum += deviations[i as number] - deviations[i - length];
                    } else {
                        smaPoints[i as number] = sma;
                        deviations[i as number] = Math.pow(y - sma, 2);
                        deviationSum += deviations[i as number];
                    }
                    const range: number = Math.sqrt(deviationSum / (indicator.period));
                    const lowerBand: number = smaPoints[i as number] - (multiplier * range);
                    const upperBand: number = smaPoints[i as number] + (multiplier * range);
                    if (i + 1 === length) {
                        for (let j: number = 0; j < length - 1; j++) {
                            bollingerPoints[j as number] = {
                                'X': validData[j as number].x, 'mb': smaPoints[i as number],
                                'lb': lowerBand, 'ub': upperBand, visible: true
                            };
                        }
                    }
                    bollingerPoints[i as number] = {
                        'X': validData[i as number].x, 'mb': smaPoints[i as number],
                        'lb': lowerBand, 'ub': upperBand, visible: true
                    };
                } else {
                    if (i < indicator.period - 1) {
                        smaPoints[i as number] = sma;
                        deviations[i as number] = Math.pow(y - sma, 2);
                        deviationSum += deviations[i as number];
                    }
                }
            }
            let i: number = -1; let j: number = -1;
            for (let k: number = 0; k < limit; k++) {
                if (k >= (length - 1)) {
                    const ub: string = 'ub';
                    const lb: string = 'lb';
                    const mb: string = 'mb';
                    upperCollection.push(this.getDataPoint(
                        validData[k as number].x, bollingerPoints[k as number][ub as string], validData[k as number], upperSeries,
                        upperCollection.length));
                    lowerCollection.push(this.getDataPoint(
                        validData[k as number].x, bollingerPoints[k as number][lb as string], validData[k as number], lowerSeries,
                        lowerCollection.length));
                    signalCollection.push(this.getDataPoint(
                        validData[k as number].x, bollingerPoints[k as number][mb as string], validData[k as number], signalSeries,
                        signalCollection.length));
                    if (enableBand) {
                        bandCollection.push(this.getRangePoint(
                            validData[k as number].x, upperCollection[++i].y, lowerCollection[++j].y,
                            validData[k as number], rangeAreaSeries,
                            bandCollection.length
                        ));
                    }
                }
            }
        }
        if (enableBand) {
            this.setSeriesRange(bandCollection, indicator, indicator.targetSeries[0]);
        }
        this.setSeriesRange(signalCollection, indicator, indicator.targetSeries[start as number]);
        this.setSeriesRange(upperCollection, indicator, indicator.targetSeries[start + 1]);
        this.setSeriesRange(lowerCollection, indicator, indicator.targetSeries[start + 2]);
    }

    /**
     * To destroy the Bollinger Band.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the bollinger band.
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
        return 'BollingerBandsIndicator';
    }
}
