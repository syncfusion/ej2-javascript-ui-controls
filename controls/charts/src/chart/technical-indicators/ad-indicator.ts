import { Series, Points } from '../series/chart-series';
import { Chart } from '../chart';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * `AccumulationDistributionIndicator` module is used to render accumulation distribution indicator.
 */
export class AccumulationDistributionIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions using accumulation distribution approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let sourceSeries: Series = indicator.sourceSeries;
        let adPoints: Points[] = [];
        let validData: Points[] = indicator.points;
        if (validData.length > 0 && validData.length > indicator.period) {
            adPoints = this.calculateADPoints(indicator, validData);
        }
        this.setSeriesRange(adPoints, indicator);
    }

    /**
     *  Calculates the Accumulation Distribution values
     * @private
     */
    private calculateADPoints(indicator: TechnicalIndicator, validData: Points[]): Points[] {
        let temp: Points[] = [];
        let sum: number = 0;
        let i: number = 0;
        let value: number = 0;
        let high: number = 0;
        let low: number = 0;
        let close: number = 0;
        let signalSeries: Series = indicator.targetSeries[0];
        for (i = 0; i < validData.length; i++) {
            high = Number(validData[i].high);
            low = Number(validData[i].low);
            close = Number(validData[i].close);
            /** 
             * Money Flow Multiplier = [(Close -  Low) - (High - Close)] /(High - Low) 
             * Money Flow Volume = Money Flow Multiplier x Volume for the Period
             * ADL = Previous ADL + Current Period's Money Flow Volume
             */

            value = ((close - low) - (high - close)) / (high - low);
            /**
             * Sum is to calculate the Y values of the Accumulation distribution indicator
             */
            sum = sum + value * Number(validData[i].volume);
            /**
             * To calculate the x and y values for the Accumulation distribution indicator
             */
            temp[i] = this.getDataPoint(
                validData[i].x, sum, validData[i], signalSeries, temp.length);
        }
        return temp;
    }

    /**
     * To destroy the Accumulation Distribution Technical Indicator.
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        /**
         * Destroys the Accumulation Distribution Technical indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the Indicator
         */
        return 'AccumulationDistributionIndicator';
    }

}