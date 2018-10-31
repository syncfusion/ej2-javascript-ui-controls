import { Axis } from '../axis/axis';
import { Size, getMinPointsDelta, getActualDesiredIntervalsCount, setRange, triggerLabelRender } from '../../common/utils/helper';
import { DoubleRange } from '../utils/double-range';
import { Chart } from '../chart';
import { Series } from '../series/chart-series';
import { withIn, logBase } from '../../common/utils/helper';
import { RangeNavigator } from '../../range-navigator';
import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { Font } from '../../common/model/base';


/**
 * Numeric module is used to render numeric axis.
 */

export class Double {
    /** @private */
    public chart: Chart;
    /** @private */
    public min: Object;
    /** @private */
    public max: Object;

    private paddingInterval: number;

    /**
     * Constructor for the dateTime module.
     * @private
     */
    constructor(chart?: Chart) {
        this.chart = chart;
    }

    /**
     * Numeric Nice Interval for the axis.
     * @private
     */
    protected calculateNumericNiceInterval(axis: Axis, delta: number, size: Size): number {
        let actualDesiredIntervalsCount: number = getActualDesiredIntervalsCount(size, axis);
        let niceInterval: number = delta / actualDesiredIntervalsCount;
        if (!isNullOrUndefined(axis.desiredIntervals)) {
            return niceInterval;
        }

        let minInterval: number = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (let interval of axis.intervalDivs) {
            let currentInterval: number = minInterval * interval;
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * Actual Range for the axis.
     * @private
     */

    public getActualRange(axis: Axis, size: Size): void {
        this.initializeDoubleRange(axis);
        axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
        axis.actualRange.min = axis.doubleRange.start;
        axis.actualRange.max = axis.doubleRange.end;
    }
    /**
     * Range for the axis.
     * @private
     */
    public initializeDoubleRange(axis: Axis): void {
        //Axis Min
        if ((<number>axis.minimum) !== null) {
            this.min = <number>axis.minimum;
        } else if (this.min === null || this.min === Number.POSITIVE_INFINITY) {
            this.min = 0;
        }
        // Axis Max
        if ((<number>axis.maximum) !== null) {
            this.max = <number>axis.maximum;
        } else if (this.max === null || this.max === Number.NEGATIVE_INFINITY) {
            this.max = 5;
        }
        if (this.min === this.max) {
            this.max = axis.valueType.indexOf('Category') > -1 ? this.max : <number>this.min + 1;
        }
        axis.doubleRange = new DoubleRange(<number>this.min, <number>this.max);
        axis.actualRange = {};
    }

    /**
     * The function to calculate the range and labels for the axis.
     * @return {void}
     * @private
     */

    public calculateRangeAndInterval(size: Size, axis: Axis): void {

        this.calculateRange(axis, size);

        this.getActualRange(axis, size);

        this.applyRangePadding(axis, size);

        this.calculateVisibleLabels(axis, this.chart);

    }


    /**
     * Calculate Range for the axis.
     * @private
     */

    protected calculateRange(axis: Axis, size: Size): void {

        /*! Generate axis range */
        let series: Series;
        this.min = null; this.max = null;
        if (!setRange(axis)) {
            for (let series of axis.series) {
                if (!series.visible) {
                    continue;
                }
                this.paddingInterval = 0;
                if (((series.type.indexOf('Column') > -1 || series.type.indexOf('Histogram') > -1) && axis.orientation === 'Horizontal')
                    || (series.type.indexOf('Bar') > -1 && axis.orientation === 'Vertical')) {
                    if ((series.xAxis.valueType === 'Double' || series.xAxis.valueType === 'DateTime')
                        && series.xAxis.rangePadding === 'Auto') {
                        this.paddingInterval = getMinPointsDelta(series.xAxis, axis.series) / 2;
                    }
                }
                //For xRange
                if (axis.orientation === 'Horizontal') {
                    if (this.chart.requireInvertedAxis) {
                        this.findMinMax(series.yMin, series.yMax);
                    } else {
                        this.findMinMax(<number>series.xMin - this.paddingInterval, <number>series.xMax + this.paddingInterval);
                    }
                }
                // For yRange
                if (axis.orientation === 'Vertical') {
                    if (this.chart.requireInvertedAxis) {
                        this.findMinMax(<number>series.xMin - this.paddingInterval, <number>series.xMax + this.paddingInterval);
                    } else {
                        this.findMinMax(series.yMin, series.yMax);
                    }
                }
            }
        }
    }
    private findMinMax(min: Object, max: Object): void {
        if (this.min === null || this.min > min) {
            this.min = <number>min;
        }
        if (this.max === null || this.max < max) {
            this.max = <number>max;
        }
    }
    /**
     * Apply padding for the range.
     * @private
     */
    public applyRangePadding(axis: Axis, size: Size): void {

        let range: Range;
        let start: number = axis.actualRange.min;
        let end: number = axis.actualRange.max;
        if (!setRange(axis)) {
            let interval: number = axis.actualRange.interval;
            let padding: string = axis.getRangePadding(this.chart);

            if (padding === 'Additional' || padding === 'Round') {
                this.findAdditional(axis, start, end, interval);
            } else if (padding === 'Normal') {
                this.findNormal(axis, start, end, interval, size);
            } else {
                this.updateActualRange(axis, start, end, interval);
            }
        }

        axis.actualRange.delta = axis.actualRange.max - axis.actualRange.min;

        this.calculateVisibleRange(size, axis);
    }

    public updateActualRange(axis: Axis, minimum: number, maximum: number, interval: number): void {
        axis.actualRange.min = axis.minimum != null ? <number>axis.minimum : minimum;
        axis.actualRange.max = axis.maximum != null ? <number>axis.maximum : maximum;
        axis.actualRange.interval = axis.interval != null ? axis.interval : interval;
    }

    private findAdditional(axis: Axis, start: number, end: number, interval: number): void {
        let minimum: number; let maximum: number;
        minimum = Math.floor(start / interval) * interval;
        maximum = Math.ceil(end / interval) * interval;
        if (axis.rangePadding === 'Additional') {
            minimum -= interval;
            maximum += interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    }

    private findNormal(axis: Axis, start: number, end: number, interval: number, size: Size): void {
        let remaining: number; let minimum: number; let maximum: number;
        let startValue: number = start;
        if (start < 0) {
            startValue = 0;
            minimum = start + (start / 20);
            remaining = interval + (minimum % interval);
            if ((0.365 * interval) >= remaining) {
                minimum -= interval;
            }
            if (minimum % interval < 0) {
                minimum = (minimum - interval) - (minimum % interval);
            }
        } else {
            minimum = start < ((5.0 / 6.0) * end) ? 0 : (start - (end - start) / 2);
            if (minimum % interval > 0) {
                minimum -= (minimum % interval);
            }
        }

        maximum = (end > 0) ? (end + (end - startValue) / 20) : (end - (end - startValue) / 20);
        remaining = interval - (maximum % interval);
        if ((0.365 * interval) >= remaining) {
            maximum += interval;
        }
        if (maximum % interval > 0) {
            maximum = (maximum + interval) - (maximum % interval);
        }
        axis.doubleRange = new DoubleRange(minimum, maximum);
        if (minimum === 0) {
            interval = this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            maximum = Math.ceil(maximum / interval) * interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    }


    /**
     * Calculate visible range for axis.
     * @private
     */
    protected calculateVisibleRange(size: Size, axis: Axis): void {
        axis.visibleRange = {
            max: axis.actualRange.max, min: axis.actualRange.min,
            delta: axis.actualRange.delta, interval: axis.actualRange.interval
        };
        if (axis.zoomFactor < 1 || axis.zoomPosition > 0) {
            axis.calculateVisibleRange(size);
            axis.visibleRange.interval = (axis.enableAutoIntervalOnZooming && axis.valueType !== 'Category') ?
                this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size)
                : axis.visibleRange.interval;
        }
        axis.triggerRangeRender(this.chart, axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.interval);
    }


    /**
     * Calculate label for the axis.
     * @private
     */

    public calculateVisibleLabels(axis: Axis, chart: Chart | RangeNavigator): void {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        let tempInterval: number = axis.visibleRange.min;
        let labelStyle: Font;
        if (axis.zoomFactor < 1 || axis.zoomPosition > 0 || this.paddingInterval) {
            tempInterval = axis.visibleRange.min - (axis.visibleRange.min % axis.visibleRange.interval);
        }
        let format: string = this.getFormat(axis);
        let isCustom: boolean = format.match('{value}') !== null;

        axis.format = chart.intl.getNumberFormat({
            format: isCustom ? '' : format,
            useGrouping: chart.useGroupingSeparator
        });

        axis.startLabel = axis.format(axis.visibleRange.min);
        axis.endLabel = axis.format(axis.visibleRange.max);

        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = <Font>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange)) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    }

    /**
     * Format of the axis label.
     * @private
     */

    protected getFormat(axis: Axis): string {
        if (axis.labelFormat) {
            return axis.labelFormat;
        }
        return axis.isStack100 ? '{value}%' : '';
    }

    /**
     * Formatted the axis label.
     * @private
     */

    public formatValue(axis: Axis, isCustom: boolean, format: string, tempInterval: number): string {
        return isCustom ? format.replace('{value}', axis.format(tempInterval))
            : axis.format(tempInterval);
    }
}




