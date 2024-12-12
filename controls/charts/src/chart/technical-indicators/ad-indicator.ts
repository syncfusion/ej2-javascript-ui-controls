import { Series, Points } from '../series/chart-series';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * The `AccumulationDistributionIndicator` module is used to render the accumulation distribution indicator.
 */
export class AccumulationDistributionIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions using accumulation distribution approach.
     *
     * @private
     * @param {TechnicalIndicator} indicator - The technical indicator for which the data source is to be initialized.
     * @returns {void}
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        let adPoints: Points[] = [];
        const validData: Points[] = indicator.points;
        if (validData.length > 0 && validData.length > indicator.period) {
            adPoints = this.calculateADPoints(indicator, validData);
        }
        this.setSeriesRange(adPoints, indicator);
    }

    /**
     * Calculates the accumulation distribution (AD) points for a technical indicator.
     *
     * @param {TechnicalIndicator} indicator - The technical indicator for which the AD points are calculated.
     * @param {Points[]} validData - The valid data points used for calculation.
     * @returns {Points[]} - The calculated accumulation distribution (AD) points.
     */
    private calculateADPoints(indicator: TechnicalIndicator, validData: Points[]): Points[] {
        const temp: Points[] = [];
        let sum: number = 0;
        let i: number = 0;
        let value: number = 0;
        let high: number = 0;
        let low: number = 0;
        let close: number = 0;
        const signalSeries: Series = indicator.targetSeries[0];
        for (i = 0; i < validData.length; i++) {
            high = Number(validData[i as number].high);
            low = Number(validData[i as number].low);
            close = Number(validData[i as number].close);
            /**
             * Money Flow Multiplier = [(Close -  Low) - (High - Close)] /(High - Low)
             * Money Flow Volume = Money Flow Multiplier x Volume for the Period
             * ADL = Previous ADL + Current Period's Money Flow Volume
             */

            value = ((close - low) - (high - close)) / ((high - low) ? (high - low) : 1);
            /**
             * Sum is to calculate the Y values of the Accumulation distribution indicator
             */
            sum = sum + value * Number(validData[i as number].volume);
            /**
             * To calculate the x and y values for the Accumulation distribution indicator
             */
            temp[i as number] = this.getDataPoint(
                validData[i as number].x, sum, validData[i as number], signalSeries, temp.length);
        }
        return temp;
    }

    /**
     * To destroy the Accumulation Distribution Technical Indicator.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the Accumulation Distribution Technical indicator.
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the Indicator.
         */
        return 'AccumulationDistributionIndicator';
    }

}
