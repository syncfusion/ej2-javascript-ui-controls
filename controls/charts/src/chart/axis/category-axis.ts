/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Axis } from '../axis/axis';
import { getActualDesiredIntervalsCount, triggerLabelRender } from '../../common/utils/helper';
import { Size } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { withIn } from '../../common/utils/helper';
import { Chart } from '../chart';
import { extend, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Font } from '../../common/model/base';
import { NiceInterval } from '../axis/axis-helper';


/**
 * `Category` module is used to render category axis.
 */

export class Category extends NiceInterval {

    /**
     * Constructor for the category module.
     *
     * @private
     */
    constructor(chart: Chart) {
        super(chart);
    }

    /**
     * The function to calculate the range and labels for the axis.
     *
     * @returns {void}
     */

    public calculateRangeAndInterval(size: Size, axis: Axis): void {

        this.calculateRange(axis);

        this.getActualRange(axis, size);

        this.applyRangePadding(axis, size);

        this.calculateVisibleLabels(axis);
    }

    /**
     * Actual Range for the axis.
     *
     * @private
     */

    public getActualRange(axis: Axis, size: Size): void {
        this.initializeDoubleRange(axis);
        // axis.doubleRange = new DoubleRange(<number>this.min, <number>this.max);
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
     * Padding for the axis.
     *
     * @private
     */
    public applyRangePadding(axis: Axis, size: Size): void {
        let isColumn: boolean;
        axis.series.forEach((element) => {
            if (!isColumn) { isColumn = element.type.indexOf('Column') > -1 && !(axis.zoomFactor < 1 || axis.zoomPosition > 0) && isNullOrUndefined(axis.minimum) && isNullOrUndefined(axis.maximum); }
        });
        const ticks: number = ((axis.labelPlacement === 'BetweenTicks' || isColumn) && this.chart.chartAreaType !== 'PolarRadar') ? 0.5 : 0;
        if (ticks > 0) {
            axis.actualRange.min -= ticks;
            axis.actualRange.max += ticks;
        } else {
            axis.actualRange.max += axis.actualRange.max ? 0 : 0.5;
        }
        axis.doubleRange = new DoubleRange(axis.actualRange.min, axis.actualRange.max);
        axis.actualRange.delta = axis.doubleRange.delta;
        this.calculateVisibleRange(size, axis);
    }

    /**
     * Calculate label for the axis.
     *
     * @private
     */

    public calculateVisibleLabels(axis: Axis): void {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        axis.visibleRange.interval = axis.visibleRange.interval < 1 ? 1 : axis.visibleRange.interval;
        let tempInterval: number = Math.ceil(axis.visibleRange.min);
        let labelStyle: Font;
        if (axis.zoomFactor < 1 || axis.zoomPosition > 0) {
            tempInterval = axis.visibleRange.min - (axis.visibleRange.min % axis.visibleRange.interval);
        }
        let position: number;
        axis.startLabel = axis.labels[Math.round(axis.visibleRange.min)];
        axis.endLabel = axis.labels[Math.floor(axis.visibleRange.max)];
        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = <Font>(extend({}, getValue('properties', axis.labelStyle), null, true));
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
     */

    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Category';
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
