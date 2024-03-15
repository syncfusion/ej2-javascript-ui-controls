import { Chart3DAxis } from '../axis/axis';
import { Double3D } from '../axis/double-axis';
import { getActualDesiredIntervalsCount, triggerLabelRender } from '../../common/utils/helper';
import { Size } from '@syncfusion/ej2-svg-base';
import { logBase, withIn } from '../../common/utils/helper';
import { Chart3D } from '../chart3D';
import { extend, getValue } from '@syncfusion/ej2-base';
import { Chart3DTextFont } from '../model/chart3d-Interface';

/**
 * The `Logarithmic` module is used to render log axis.
 */
export class Logarithmic3D extends Double3D {

    /**
     * Constructor for the logerithmic module.
     *
     * @param {Chart3D} chart - Chart3D instance.
     * @private
     */
    constructor(chart: Chart3D) {
        super(chart);
    }

    /**
     * Calculates the range and interval for the specified axis based on the provided size.
     *
     * @param {Size} size - The size of the chart area used for range and interval calculation.
     * @param {Chart3DAxis} axis - The axis for which the range and interval are calculated.
     * @returns {void}
     */
    public calculateRangeAndInterval(size: Size, axis: Chart3DAxis): void {

        this.calculateRange(axis);

        this.getActualRange(axis, size);

        this.calculateVisibleRange(size, axis);

        this.calculateVisibleLabels(axis, this.chart);
    }

    /**
     * Calculates actual range for the axis.
     *
     * @param {Chart3DAxis} axis - The axis for which the range and interval are calculated.
     * @param {Size} size - The size of the axis.
     * @returns {void}
     * @private
     */
    public getActualRange(axis: Chart3DAxis, size: Size): void {

        this.initializeDoubleRange(axis);
        this.min = this.min < 0 ? 0 : this.min;
        let logStart: number = logBase(<number>this.min, axis.logBase);
        logStart = isFinite(logStart) ? logStart : <number>this.min;
        let logEnd: number = this.max === 1 ? 1 : logBase(<number>this.max, axis.logBase);
        logEnd = isFinite(logStart) ? logEnd : <number>this.max;
        this.min = Math.floor(logStart / 1);
        const isRectSeries: boolean = axis.series && axis.series.some((item) => {
            return (item.type.indexOf('Column') !== -1 || item.type.indexOf('Bar') !== -1);
        });
        if (isRectSeries) {
            this.min = (this.min <= 0) ? (+this.min - 1) : this.min;
        }
        this.max = Math.ceil(logEnd / 1);
        this.max = this.max === this.min ? <number>this.max + 1 : this.max;
        axis.actualRange.interval = axis.interval || this.calculateLogNiceInterval(<number>this.max - <number>this.min, size, axis);
        axis.actualRange.min = <number>this.min;
        axis.actualRange.max = <number>this.max;
        axis.actualRange.delta = <number>this.max - <number>this.min;
    }

    /**
     * Calculates visible range for the axis.
     *
     * @param {Size} size - The size of the axis.
     * @param {Chart3DAxis} axis - The axis for which the range and interval are calculated.
     * @returns {void}
     * @private
     */
    protected calculateVisibleRange(size: Size, axis: Chart3DAxis): void {
        axis.visibleRange = {
            interval: axis.actualRange.interval, max: axis.actualRange.max,
            min: axis.actualRange.min, delta: axis.actualRange.delta
        };
    }

    /**
     * Calculates log inteval for the axis.
     *
     * @param {number} delta - The delta value.
     * @param {Size} size - The size of the axis.
     * @param {Chart3DAxis} axis - The axis for which the range and interval are calculated.
     * @returns {number} - Returns the log interval.
     * @private
     */
    protected calculateLogNiceInterval(delta: number, size: Size, axis: Chart3DAxis): number {
        const actualDesiredIntervalsCount: number = getActualDesiredIntervalsCount(size, axis);
        let niceInterval: number = delta;
        const minInterval: number = Math.pow(axis.logBase, Math.floor(logBase(niceInterval, 10)));
        for (let j: number = 0, len: number = axis.intervalDivs.length; j < len; j++) {
            const currentInterval: number = minInterval * axis.intervalDivs[j as number];
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * Calculates labels for the axis.
     *
     * @param {Chart3DAxis} axis - The axis for which the range and interval are calculated.
     * @param {Chart3D} chart - Specifies the instance of the chart.
     * @returns {void}
     * @private
     */
    public calculateVisibleLabels(axis: Chart3DAxis, chart: Chart3D): void {
        /*! Generate axis labels */
        let tempInterval: number = axis.visibleRange.min;
        axis.visibleLabels = [];
        let labelStyle: Chart3DTextFont;
        let value: number;
        const axisFormat: string = this.getFormat(axis);
        const isCustomFormat: boolean = axisFormat.match('{value}') !== null;
        const startValue: number = Math.pow(axis.logBase, axis.visibleRange.min);
        axis.format = chart.intl.getNumberFormat({
            format: isCustomFormat ? '' : axisFormat,
            useGrouping: chart.useGroupingSeparator,
            maximumFractionDigits: startValue < 1 ? 20 : 3
        });
        axis.startLabel = axis.format(startValue < 1 ? +startValue.toPrecision(1) : startValue);
        axis.endLabel = axis.format(Math.pow(axis.logBase, axis.visibleRange.max));
        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = <Chart3DTextFont>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange)) {
                value = Math.pow(axis.logBase, tempInterval);
                triggerLabelRender(
                    this.chart, tempInterval, this.formatValue(axis, isCustomFormat, axisFormat, value < 1 ? +value.toPrecision(1) : value),
                    labelStyle, axis
                );
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Logarithmic3D';
    }

    /**
     * To destroy the category axis.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }
}
