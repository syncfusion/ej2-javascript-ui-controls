import { Chart3DAxis } from '../axis/axis';
import { getActualDesiredIntervalsCount, setRange, triggerLabelRender } from '../../common/utils/helper';
import { Size } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/doubleRange';
import { Chart3D } from '../chart3D';
import { Chart3DSeries } from '../series/chart-series';
import { withIn, logBase } from '../../common/utils/helper';
import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { getMinPointsDeltaValue } from '../utils/chart3dRender';
import { Chart3DFont } from '../model/chart3d-Interface';


/**
 * The numeric module is used to render numeric axis.
 */
export class Double3D {
    /** @private */
    public chart: Chart3D;
    /** @private */
    public min: Object;
    /** @private */
    public max: Object;
    private paddingInterval: number;
    private isColumn: number = 0;
    private isStacking: boolean = false;
    /**
     * Constructor for the dateTime module.
     *
     * @param {Chart3D} chart - Chart3D instance.
     * @private
     */
    constructor(chart?: Chart3D) {
        this.chart = chart;
    }

    /**
     * Calculates a numeric nice interval for the specified axis based on the provided delta and size.
     *
     * @param {Chart3DAxis} axis - The axis for which the numeric nice interval is calculated.
     * @param {number} delta - The delta value to consider in the interval calculation.
     * @param {Size} size - The size of the chart area used in the calculation.
     * @returns {number} - The calculated numeric nice interval.
     * @protected
     */
    protected calculateNumericNiceInterval(axis: Chart3DAxis, delta: number, size: Size): number {
        const actualDesiredIntervalsCount: number = getActualDesiredIntervalsCount(size, axis);
        let niceInterval: number = delta / actualDesiredIntervalsCount;
        if (!isNullOrUndefined(axis.desiredIntervals)) {
            return niceInterval;
        }
        const minInterval: number = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (const interval of axis.intervalDivs) {
            const currentInterval: number = minInterval * interval;
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * Retrieves the actual range for the specified axis based on the provided size.
     *
     * @param {Chart3DAxis} axis - The axis for which the actual range is retrieved.
     * @param {Size} size - The size of the chart area used in the range calculation.
     * @returns {void}
     */
    public getActualRange(axis: Chart3DAxis, size: Size): void {
        this.initializeDoubleRange(axis);
        if ((!axis.startFromZero) && (this.isColumn > 0)) {
            axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            axis.actualRange.max = axis.doubleRange.end + axis.actualRange.interval;
            if ((axis.doubleRange.start - axis.actualRange.interval < 0 && axis.doubleRange.start > 0)) {
                axis.actualRange.min = 0;
            } else {
                axis.actualRange.min = axis.doubleRange.start - (this.isStacking ? 0 : axis.actualRange.interval);
            }
        } else {
            axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            axis.actualRange.min = axis.doubleRange.start;
            axis.actualRange.max = axis.doubleRange.end;
        }
    }

    /**
     * Range for the axis.
     *
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @returns {void}
     * @private
     */
    public initializeDoubleRange(axis: Chart3DAxis): void {
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
     * Calculates the range and interval for the specified axis based on the provided size.
     *
     * @param {Size} size - The size of the chart area used for range and interval calculation.
     * @param {Chart3DAxis} axis - The axis for which the range and interval are calculated.
     * @returns {void}
     */
    public calculateRangeAndInterval(size: Size, axis: Chart3DAxis): void {

        this.calculateRange(axis);

        this.getActualRange(axis, size);

        this.applyRangePadding(axis, size);

        this.calculateVisibleLabels(axis, this.chart);

    }


    /**
     * Calculates range for the axis.
     *
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @returns {void}
     * @private
     */
    protected calculateRange(axis: Chart3DAxis): void {
        /*! Generate axis range */
        this.min = null; this.max = null;
        if (!setRange(axis)) {
            for (const series of axis.series) {
                if (!series.visible) {
                    continue;
                }
                this.paddingInterval = 0;
                if (!isNullOrUndefined(series.points)) {
                    axis.maxPointLength = series.points.length;
                }
                axis.maxPointLength = series.points.length;
                if (((series.type.indexOf('Column') > -1) && axis.orientation === 'Horizontal')
                    || (series.type.indexOf('Bar') > -1 && axis.orientation === 'Vertical')) {
                    if ((series.xAxis.valueType === 'Double' || series.xAxis.valueType === 'DateTime')
                        && series.xAxis.rangePadding === 'Auto') {
                        this.paddingInterval = getMinPointsDeltaValue(series.xAxis, axis.series) * 0.5;
                    }
                }
                //For xRange
                if (axis.orientation === 'Horizontal') {
                    if (this.chart.requireInvertedAxis) {
                        this.yAxisRange(axis, series);
                    } else {
                        this.findMinMax(<number>series.xMin - this.paddingInterval, <number>series.xMax + this.paddingInterval);
                    }
                }
                // For yRange
                if (axis.orientation === 'Vertical') {
                    this.isColumn += (series.type.indexOf('Column') !== -1 || series.type.indexOf('Bar') !== -1) ? 1 : 0;
                    this.isStacking = series.type.indexOf('Stacking') !== -1;
                    if (this.chart.requireInvertedAxis) {
                        this.findMinMax(<number>series.xMin - this.paddingInterval, <number>series.xMax + this.paddingInterval);
                    } else {
                        this.yAxisRange(axis, series);
                    }
                }
            }
        }
    }

    /**
     * Sets the range for the Y-axis based on the minimum and maximum values of the series.
     *
     * @param {Chart3DAxis} axis - The Y-axis of the 3D chart.
     * @param {Chart3DSeries} series - The 3D series for which to determine the range.
     * @returns {void}
     */
    private yAxisRange(axis: Chart3DAxis, series: Chart3DSeries): void {
        this.findMinMax(series.yMin, series.yMax);
    }

    /**
     * Finds and updates the minimum and maximum values within a given range.
     *
     * @param {Object} min - The minimum value to compare.
     * @param {Object} max - The maximum value to compare.
     * @returns {void}
     */
    private findMinMax(min: Object, max: Object): void {
        if (this.min === null || this.min > min) {
            this.min = <number>min;
        }
        if (this.max === null || this.max < max) {
            this.max = <number>max;
        }
        if ((this.max === this.min) && this.max < 0 && this.min < 0) { // max == min
            this.max = 0;
        }
    }

    /**
     * Apply padding for the range.
     *
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @param {Size} size - Specifies the size of the axis.
     * @returns {void}
     * @private
     */
    public applyRangePadding(axis: Chart3DAxis, size: Size): void {
        const start: number = axis.actualRange.min;
        const end: number = axis.actualRange.max;
        if (!setRange(axis)) {
            const interval: number = axis.actualRange.interval;
            const padding: string = axis.getRangePadding(this.chart);
            if (padding === 'Additional' || padding === 'Round') {
                this.findAdditional(axis, start, end, interval, size);
            } else if (padding === 'Normal') {
                this.findNormal(axis, start, end, interval, size);
            } else {
                this.updateActualRange(axis, start, end, interval);
            }
        }
        axis.actualRange.delta = axis.actualRange.max - axis.actualRange.min;

        this.calculateVisibleRange(size, axis);
    }

    /**
     * Updates the actual range of the 3D axis with specified minimum, maximum, and interval values.
     *
     * @param {Chart3DAxis} axis - The 3D axis to update.
     * @param {number} minimum - The minimum value for the axis.
     * @param {number} maximum - The maximum value for the axis.
     * @param {number} interval - The interval value for the axis.
     * @returns {void}
     */
    public updateActualRange(axis: Chart3DAxis, minimum: number, maximum: number, interval: number): void {
        axis.actualRange = {
            min: axis.minimum != null ? <number>axis.minimum : minimum,
            max: axis.maximum != null ? <number>axis.maximum : maximum,
            interval: axis.interval != null ? axis.interval : interval,
            delta: axis.actualRange.delta
        };
    }

    /**
     * Finds additional range for the 3D axis based on specified start, end, interval, and size values.
     *
     * @param {Chart3DAxis} axis - The 3D axis to find additional range for.
     * @param {number} start - The start value for the axis range.
     * @param {number} end - The end value for the axis range.
     * @param {number} interval - The interval value for the axis.
     * @param {Size} size - The size of the chart area.
     * @returns {void}
     */
    private findAdditional(axis: Chart3DAxis, start: number, end: number, interval: number, size: Size): void {
        let minimum: number; let maximum: number;
        minimum = Math.floor(start / interval) * interval;
        maximum = Math.ceil(end / interval) * interval;
        if (axis.rangePadding === 'Additional') {
            minimum -= interval;
            maximum += interval;
        }

        if (!isNullOrUndefined(axis.desiredIntervals)) {
            const delta: number = maximum - minimum;
            interval = this.calculateNumericNiceInterval(axis, delta, size);
        }

        this.updateActualRange(axis, minimum, maximum, interval);
    }

    /**
     * Finds normal range for the 3D axis based on specified start, end, interval, and size values.
     *
     * @param {Chart3DAxis} axis - The 3D axis to find normal range for.
     * @param {number} start - The start value for the axis range.
     * @param {number} end - The end value for the axis range.
     * @param {number} interval - The interval value for the axis.
     * @param {Size} size - The size of the chart area.
     * @returns {void}
     */
    private findNormal(axis: Chart3DAxis, start: number, end: number, interval: number, size: Size): void {
        let remaining: number; let minimum: number; let maximum: number;
        let startValue: number = start;
        if (start < 0) {
            startValue = 0;
            minimum = start + (start * 0.05);
            remaining = interval + (minimum % interval);
            if ((0.365 * interval) >= remaining) {
                minimum -= interval;
            }
            if (minimum % interval < 0) {
                minimum = (minimum - interval) - (minimum % interval);
            }
        } else {
            minimum = start < ((5.0 / 6.0) * end) ? 0 : (start - (end - start) * 0.5);
            if (minimum % interval > 0) {
                minimum -= (minimum % interval);
            }
        }

        maximum = (end > 0) ? (end + (end - startValue) * 0.05) : (end - (end - startValue) * 0.05);
        remaining = interval - (maximum % interval);
        if ((0.365 * interval) >= remaining) {
            maximum += interval;
        }
        if (maximum % interval > 0) {
            maximum = (maximum + interval) - (maximum % interval);
        }
        axis.doubleRange = new DoubleRange(minimum, maximum);
        if (minimum === 0 || (minimum < 0 && maximum < 0)) {
            interval = this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            maximum = Math.ceil(maximum / interval) * interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    }


    /**
     * Calculate visible range for axis.
     *
     * @param {Size} size - Specifies the size of the axis.
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @returns {void}
     * @private
     */
    protected calculateVisibleRange(size: Size, axis: Chart3DAxis): void {
        axis.visibleRange = {
            max: axis.actualRange.max, min: axis.actualRange.min,
            delta: axis.actualRange.delta, interval: axis.actualRange.interval
        };
        if (axis.maximum && axis.orientation === 'Vertical' && axis.rangePadding === 'Auto') {
            let duplicateTempInterval: number;
            let tempInterval: number = axis.visibleRange.min;
            for (; (tempInterval <= axis.visibleRange.max) && (duplicateTempInterval !== tempInterval);
                tempInterval += axis.visibleRange.interval) {
                duplicateTempInterval = tempInterval;
            }
            if (duplicateTempInterval < axis.visibleRange.max) {
                axis.visibleRange.max = duplicateTempInterval + axis.visibleRange.interval;
            }
        }
        axis.triggerRangeRender(this.chart, axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.interval);
    }

    /**
     * Calculates the visible label for the axis.
     *
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @param {Chart3D} chart - Specifies the instance of the chart.
     * @returns {void}
     * @private
     */
    public calculateVisibleLabels(axis: Chart3DAxis, chart: Chart3D): void {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        let tempInterval: number = axis.visibleRange.min;
        let labelStyle: Chart3DFont;
        const format: string = this.getFormat(axis);
        const isCustom: boolean = format.match('{value}') !== null;
        let intervalDigits: number = 0;
        let formatDigits: number = 0;
        if (axis.labelFormat && axis.labelFormat.indexOf('n') > -1) {
            formatDigits = parseInt(axis.labelFormat.substring(1, axis.labelFormat.length), 10);
        }
        axis.format = chart.intl.getNumberFormat({
            format: isCustom ? '' : format,
            useGrouping: chart.useGroupingSeparator
        });
        axis.startLabel = axis.format(axis.visibleRange.min);
        axis.endLabel = axis.format(axis.visibleRange.max);
        if (axis.visibleRange.interval && (axis.visibleRange.interval + '').indexOf('.') >= 0) {
            intervalDigits = (axis.visibleRange.interval + '').split('.')[1].length;
        }
        let duplicateTempInterval: number;
        for (; (tempInterval <= axis.visibleRange.max) && (duplicateTempInterval !== tempInterval);
            tempInterval += axis.visibleRange.interval) {
            duplicateTempInterval = tempInterval;
            labelStyle = <Chart3DFont>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange)) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (tempInterval && (tempInterval + '').indexOf('.') >= 0 && (tempInterval + '').split('.')[1].length > 10) {
            tempInterval = (tempInterval + '').split('.')[1].length > (formatDigits || intervalDigits) ?
                +tempInterval.toFixed(formatDigits || intervalDigits) : tempInterval;
            if (tempInterval <= axis.visibleRange.max) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    }

    /**
     * Gets the format for the axis label.
     *
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @returns {string} - Returns the string value.
     * @private
     */
    protected getFormat(axis: Chart3DAxis): string {
        if (axis.labelFormat) {
            if (axis.labelFormat.indexOf('p') === 0 && axis.labelFormat.indexOf('{value}') === -1 && axis.isStack100) {
                return '{value}%';
            }
            return axis.labelFormat;
        }
        return axis.isStack100 ? '{value}%' : '';
    }

    /**
     * Formats the axis label.
     *
     * @param {Chart3DAxis} axis - Specifies the instance of the axis.
     * @param {boolean} isCustom - Specifies whether the format is custom.
     * @param {string} format - Specifies the format of the axis label.
     * @param {number} tempInterval - Specifies the interval of the axis label.
     * @returns {string} - Returns the string value.
     * @private
     */
    public formatValue(axis: Chart3DAxis, isCustom: boolean, format: string, tempInterval: number): string {
        const labelValue: number = !(tempInterval % 1) ? tempInterval : Number(tempInterval.toLocaleString().split(',').join(''));
        return isCustom ? format.replace('{value}', axis.format(labelValue))
            : format ? axis.format(tempInterval) : axis.format(labelValue);
    }
}
