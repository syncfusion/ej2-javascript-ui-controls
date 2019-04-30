import { Series, Points } from '../series/chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `EmaIndicator` module is used to render EMA indicator.
 */
export class EmaIndicator extends TechnicalAnalysis {
    /**
     * Defines the predictions based on EMA approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let field: string = firstToLowerCase(indicator.field);
        let xField: string = 'x';
        let emaPoints: Points[] = [];
        let signalSeries: Series = indicator.targetSeries[0];

        //prepare data
        let validData: Points[] = indicator.points;

        if (validData && validData.length && validData.length >= indicator.period) {

            //find initial average
            let sum: number = 0;
            let average: number = 0;

            //smoothing factor
            let k: number = (2 / (indicator.period + 1));

            for (let i: number = 0; i < indicator.period; i++) {
                sum += validData[i][field];
            }

            average = sum / indicator.period;

            emaPoints.push(this.getDataPoint(
                validData[indicator.period - 1][xField], average,
                validData[indicator.period - 1], signalSeries, emaPoints.length));

            let index: number = indicator.period;
            while (index < validData.length) {
                //previous average
                let prevAverage: number = emaPoints[index - indicator.period][signalSeries.yName];

                let yValue: number = (validData[index][field] - prevAverage) * k + prevAverage;

                emaPoints.push(this.getDataPoint(
                    validData[index][xField], yValue,
                    validData[index], signalSeries, emaPoints.length));

                index++;
            }
        }
        this.setSeriesRange(emaPoints, indicator);
    }

    /**
     * To destroy the EMA Indicator
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the EMA Indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'EmaIndicator';
    }
}
