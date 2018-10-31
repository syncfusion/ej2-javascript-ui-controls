import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `BollingerBands` module is used to render bollinger band indicator.
 */
export class BollingerBands extends TechnicalAnalysis {

    /**
     * Initializes the series collection to represent bollinger band
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        indicator.targetSeries = [];
        let rangeArea: Series = new Series(indicator, 'targetSeries', {}, true);
        rangeArea.type = 'RangeArea';
        if (indicator.bandColor !== 'transparent' && indicator.bandColor !== 'none') {
            this.setSeriesProperties(
                rangeArea, indicator, 'BollingerBand', indicator.bandColor, 0, chart);
        }
        let signalLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(signalLine, indicator, 'SignalLine', indicator.fill, indicator.width, chart);
        let upperLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(
            upperLine, indicator, 'UpperLine', indicator.upperLine.color,
            indicator.upperLine.width, chart);
        let lowerLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(
            lowerLine, indicator, 'LowerLine', indicator.lowerLine.color,
            indicator.lowerLine.width, chart);
    }

    /**
     * Defines the predictions using Bollinger Band Approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let enableBand: boolean = indicator.bandColor !== 'transparent' && indicator.bandColor !== 'none';
        let start: number = enableBand ? 1 : 0;
        let signalCollection: Points[] = [];
        let upperCollection: Points[] = [];
        let lowerCollection: Points[] = [];
        let bandCollection: Points[] = [];
        let upperSeries: Series = indicator.targetSeries[start + 1];
        let lowerSeries: Series = indicator.targetSeries[start + 2];
        let signalSeries: Series = indicator.targetSeries[start];
        let rangeAreaSeries: Series = enableBand ? indicator.targetSeries[0] : null;
        //prepare data
        let validData: Points[] = indicator.points;
        if (validData.length && validData.length >= indicator.period) {
            let sum: number = 0;
            let deviationSum: number = 0;
            let multiplier: number = indicator.standardDeviation;
            let limit: number = validData.length;
            let length: number = Math.round(indicator.period);
            let smaPoints: number[] = [];
            let deviations: number[] = [];
            let bollingerPoints: Object[] = [];

            for (let i: number = 0; i < length; i++) {
                sum += Number(validData[i].close);
            }
            let sma: number = sum / indicator.period;
            for (let i: number = 0; i < limit; i++) {
                let y: number = Number(validData[i].close);
                if (i >= length - 1 && i < limit) {
                    if (i - indicator.period >= 0) {
                        let diff: number = y - Number(validData[i - length].close);
                        sum = sum + diff;
                        sma = sum / (indicator.period);
                        smaPoints[i] = sma;
                        deviations[i] = Math.pow(y - sma, 2);
                        deviationSum += deviations[i] - deviations[i - length];
                    } else {
                        smaPoints[i] = sma;
                        deviations[i] = Math.pow(y - sma, 2);
                        deviationSum += deviations[i];
                    }
                    let range: number = Math.sqrt(deviationSum / (indicator.period));
                    let lowerBand: number = smaPoints[i] - (multiplier * range);
                    let upperBand: number = smaPoints[i] + (multiplier * range);
                    if (i + 1 === length) {
                        for (let j: number = 0; j < length - 1; j++) {
                            bollingerPoints[j] = {
                                'X': validData[j].x, 'mb': smaPoints[i],
                                'lb': lowerBand, 'ub': upperBand, visible: true
                            };
                        }
                    }
                    bollingerPoints[i] = {
                        'X': validData[i].x, 'mb': smaPoints[i],
                        'lb': lowerBand, 'ub': upperBand, visible: true
                    };
                } else {
                    if (i < indicator.period - 1) {
                        smaPoints[i] = sma;
                        deviations[i] = Math.pow(y - sma, 2);
                        deviationSum += deviations[i];
                    }
                }
            }
            let i: number = -1; let j: number = -1;
            for (let k: number = 0; k < limit; k++) {
                if (k >= (length - 1)) {
                    let ub: string = 'ub';
                    let lb: string = 'lb';
                    let mb: string = 'mb';
                    upperCollection.push(this.getDataPoint(
                        validData[k].x, bollingerPoints[k][ub], validData[k], upperSeries,
                        upperCollection.length));
                    lowerCollection.push(this.getDataPoint(
                        validData[k].x, bollingerPoints[k][lb], validData[k], lowerSeries,
                        lowerCollection.length));
                    signalCollection.push(this.getDataPoint(
                        validData[k].x, bollingerPoints[k][mb], validData[k], signalSeries,
                        signalCollection.length));
                    if (enableBand) {
                        bandCollection.push(this.getRangePoint(
                            validData[k].x, upperCollection[++i].y, lowerCollection[++j].y, validData[k], rangeAreaSeries,
                            bandCollection.length
                        ));
                    }
                }
            }
        }
        if (enableBand) {
            this.setSeriesRange(bandCollection, indicator, indicator.targetSeries[0]);
        }
        this.setSeriesRange(signalCollection, indicator, indicator.targetSeries[start]);
        this.setSeriesRange(upperCollection, indicator, indicator.targetSeries[start + 1]);
        this.setSeriesRange(lowerCollection, indicator, indicator.targetSeries[start + 2]);
    }

    /**
     * To destroy the Bollinger Band.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the bollinger band
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'BollingerBandsIndicator';
    }
}
