import { Axis } from '../axis/axis';
import { Double } from '../axis/double-axis';
import { Size, getActualDesiredIntervalsCount, triggerLabelRender } from '../../common/utils/helper';
import { logBase, withIn } from '../../common/utils/helper';
import { Chart } from '../chart';
import { RangeNavigator } from '../../range-navigator';
import { extend, getValue } from '@syncfusion/ej2-base';
import { Font } from '../../common/model/base';

/**
 * `Logarithmic` module is used to render log axis.
 */

export class Logarithmic extends Double {

    /**
     * Constructor for the logerithmic module.
     * @private
     */
    constructor(chart: Chart) {
        super(chart);
    }

    /**
     * The method to calculate the range and labels for the axis.
     * @return {void}
     */

    public calculateRangeAndInterval(size: Size, axis: Axis): void {

        this.calculateRange(axis, size);

        this.getActualRange(axis, size);

        this.calculateVisibleRange(size, axis);

        this.calculateVisibleLabels(axis, this.chart);
    }
    /**
     * Calculates actual range for the axis.
     * @private
     */

    public getActualRange(axis: Axis, size: Size): void {

        this.initializeDoubleRange(axis);
        this.min = this.min < 0 ? 0 : this.min;
        let logStart: number = logBase(<number>this.min, axis.logBase);
        logStart = isFinite(logStart) ? logStart : <number>this.min;
        let logEnd: number = logBase(<number>this.max, axis.logBase);
        logEnd = isFinite(logStart) ? logEnd : <number>this.max;
        this.min = Math.floor(logStart / 1);
        this.max = Math.ceil(logEnd / 1);
        axis.actualRange.interval = axis.interval || this.calculateLogNiceInterval(<number>this.max - <number>this.min, size, axis);
        axis.actualRange.min = <number>this.min;
        axis.actualRange.max = <number>this.max;
        axis.actualRange.delta = <number>this.max - <number>this.min;
    }
    /**
     * Calculates visible range for the axis.
     * @private
     */
    protected calculateVisibleRange(size: Size, axis: Axis): void {
        axis.visibleRange = {
            interval: axis.actualRange.interval, max: axis.actualRange.max,
            min: axis.actualRange.min, delta: axis.actualRange.delta
        };
        if (axis.zoomFactor < 1 || axis.zoomPosition > 0) {
            axis.calculateVisibleRange(size);
            axis.visibleRange.interval = (axis.enableAutoIntervalOnZooming) ?
                this.calculateLogNiceInterval(axis.doubleRange.delta, size, axis)
                : axis.visibleRange.interval;
            axis.visibleRange.interval = Math.floor(axis.visibleRange.interval) === 0 ? 1 : Math.floor(axis.visibleRange.interval);
            axis.triggerRangeRender(this.chart, axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.interval);
        }
    }
    /**
     * Calculates log iInteval for the axis.
     * @private
     */
    protected calculateLogNiceInterval(delta: number, size: Size, axis: Axis): number {
        let actualDesiredIntervalsCount: number = getActualDesiredIntervalsCount(size, axis);
        let niceInterval: number = delta;
        let minInterval: number = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (let j: number = 0, len: number = axis.intervalDivs.length; j < len; j++) {
            let currentInterval: number = minInterval * axis.intervalDivs[j];
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * Calculates labels for the axis.
     * @private
     */
    public calculateVisibleLabels(axis: Axis, chart: Chart | RangeNavigator): void {
        /*! Generate axis labels */
        let tempInterval: number = axis.visibleRange.min;
        axis.visibleLabels = [];
        let labelStyle: Font;
        if (axis.zoomFactor < 1 || axis.zoomPosition > 0) {
            tempInterval = axis.visibleRange.min - (axis.visibleRange.min % axis.visibleRange.interval);
        }
        let axisFormat: string = this.getFormat(axis);
        let isCustomFormat: boolean = axisFormat.match('{value}') !== null;
        axis.format = chart.intl.getNumberFormat({
            format: isCustomFormat ? '' : axisFormat,
            useGrouping: chart.useGroupingSeparator
        });

        axis.startLabel = axis.format(Math.pow(axis.logBase, axis.visibleRange.min));
        axis.endLabel = axis.format(Math.pow(axis.logBase, axis.visibleRange.max));

        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = <Font>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange)) {
                triggerLabelRender(
                    this.chart, tempInterval, this.formatValue(axis, isCustomFormat, axisFormat, Math.pow(axis.logBase, tempInterval)),
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
        return 'Logarithmic';
    }

    /**
     * To destroy the category axis.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}
