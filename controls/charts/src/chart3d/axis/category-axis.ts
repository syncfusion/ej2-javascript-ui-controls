import { Chart3DAxis } from './axis';
import { getActualDesiredIntervalsCount, triggerLabelRender } from '../../common/utils/helper';
import { Size } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/doubleRange';
import { withIn } from '../../common/utils/helper';
import { Chart3D } from '../chart3D';
import { extend, getValue } from '@syncfusion/ej2-base';
import { NiceIntervals } from '../axis/axis-helper';
import { Chart3DTextFont } from '../model/chart3d-Interface';


/**
 * The `Category` module is used to render category axis.
 */
export class Category3D extends NiceIntervals {

    /**
     * Constructor for the category module.
     *
     * @param {Chart3D} chart - Chart instance.
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
     * @private
     */
    public calculateRangeAndInterval(size: Size, axis: Chart3DAxis): void {
        this.calculateRange(axis);
        this.getActualRange(axis, size);
        this.applyRangePadding(axis, size);
        this.calculateVisibleLabels(axis);
    }

    /**
     * Retrieves the actual range for the specified axis based on the provided size.
     *
     * @param {Chart3DAxis} axis - The axis for which the actual range is calculated.
     * @param {Size} size - The size of the chart area used in the range calculation.
     * @returns {void}
     */
    public getActualRange(axis: Chart3DAxis, size: Size): void {
        this.initializeDoubleRange(axis);
        axis.actualRange = {};
        if (!axis.interval) {
            axis.actualRange.interval = Math.max(1, Math.floor(axis.doubleRange.delta / getActualDesiredIntervalsCount(size, axis)));
        } else {
            axis.actualRange.interval = Math.ceil(axis.interval);
        }
        axis.actualRange.min = axis.doubleRange.start;
        axis.actualRange.max = axis.doubleRange.end;
        axis.actualRange.delta = axis.doubleRange.delta;
    }

    /**
     * Applies range padding to the specified axis based on the provided size.
     *
     * @param {Chart3DAxis} axis - The axis to which range padding is applied.
     * @param {Size} size - The size of the chart area used in the padding calculation.
     * @returns {void}
     */
    public applyRangePadding(axis: Chart3DAxis, size: Size): void {
        const ticks: number = 0.5;
        axis.actualRange.min -= ticks;
        axis.actualRange.max += ticks;
        axis.doubleRange = new DoubleRange(axis.actualRange.min, axis.actualRange.max);
        axis.actualRange.delta = axis.doubleRange.delta;
        this.calculateVisibleRange(size, axis);
    }

    /**
     * Calculate visible labels for the axis based on the range calculated.
     *
     * @param {Chart3DAxis} axis - The axis for which the labels are calculated.
     * @returns {void}
     * @private
     */
    public calculateVisibleLabels(axis: Chart3DAxis): void {
        /** Generate axis labels */
        axis.visibleLabels = [];
        axis.visibleRange.interval = axis.visibleRange.interval < 1 ? 1 : axis.visibleRange.interval;
        let tempInterval: number = Math.ceil(axis.visibleRange.min);
        let labelStyle: Chart3DTextFont;
        let position: number;
        axis.startLabel = axis.labels[Math.round(axis.visibleRange.min)];
        axis.endLabel = axis.labels[Math.floor(axis.visibleRange.max)];
        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = <Chart3DTextFont>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange) && axis.labels.length > 0) {
                position = Math.round(tempInterval);
                triggerLabelRender(
                    this.chart, position,
                    axis.labels[position as number] ? axis.labels[position as number].toString() : position.toString(),
                    labelStyle, axis
                );
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    }


    /**
     * Get module name
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Category3D';
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
