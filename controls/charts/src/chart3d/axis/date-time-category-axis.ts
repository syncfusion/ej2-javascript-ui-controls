import {Chart3DAxis } from '../axis/axis';
import { Category3D } from '../axis/category-axis';
import { triggerLabelRender, withIn } from '../../common/utils/helper';
import { Size } from '@syncfusion/ej2-svg-base';
import { firstToLowerCase } from '../../common/utils/helper';
import { Chart3D } from '../chart3D';
import { extend, getValue } from '@syncfusion/ej2-base';
import { IntervalType } from '../../common/utils/enum';
import { Chart3DFont } from '../model/chart3d-Interface';

/**
 * The DatetimeCategory module is used to render date time category axis.
 */
export class DateTimeCategory3D extends Category3D {
    private axisSize: Size;

    /**
     * Constructor for the category module.
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
        this.axisSize = size;
        this.calculateRange(axis);
        this.getActualRange(axis, size);
        this.applyRangePadding(axis, size);
        this.calculateVisibleLabels(axis);
    }

    /**
     * Calculates and updates the visible labels for the specified axis.
     *
     * @param {Chart3DAxis} axis - The axis for which visible labels are calculated.
     * @returns {void}
     */
    public calculateVisibleLabels(axis: Chart3DAxis): void {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        let labelStyle: Chart3DFont;
        const padding: number = 0;
        if (axis.intervalType === 'Auto') {
            this.calculateDateTimeNiceInterval(
                axis, this.axisSize, parseInt(axis.labels[0], 10),
                parseInt(axis.labels[axis.labels.length - 1], 10)
            );
        } else {
            axis.actualIntervalType = axis.intervalType;
        }
        axis.format = this.chart.intl.getDateFormat({
            format: axis.labelFormat || '', type: firstToLowerCase(axis.skeletonType),
            skeleton: this.getSkeleton(axis)
        });
        let i: number = 0;
        for (; i < axis.labels.length; i++) {
            labelStyle = <Chart3DFont>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (!this.sameInterval(axis.labels.map(Number)[i as number], axis.labels.map(Number)[i - 1], axis.actualIntervalType, i)
                || axis.isIndexed) {
                if (withIn(i - padding, axis.visibleRange)) {
                    triggerLabelRender(
                        this.chart, i, (axis.isIndexed ? this.getIndexedAxisLabel(axis.labels[i as number], axis.format) :
                            <string>axis.format(new Date(axis.labels.map(Number)[i as number]))),
                        labelStyle, axis
                    );
                }
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    }

    /**
     * To get the indexed axis label text with format for DateTimeCategory axis.
     *
     * @param {string} value value
     * @param {Function} format format
     * @returns {string} Indexed axis label text
     */
    public getIndexedAxisLabel(value: string, format: Function): string {
        const texts: string[] = value.split(',');
        for (let i: number = 0; i < texts.length; i++) {
            texts[i as number] = <string>format(new Date(parseInt(texts[i as number], 10)));
        }
        return texts.join(', ');
    }

    /**
     * Checks whether two dates have the same interval value of the specified type at the given index.
     *
     * @param {number} currentDate - The current date to be compared.
     * @param {number} previousDate - The previous date to be compared.
     * @param {IntervalType} type - The type of interval (year, month, day, etc.).
     * @param {number} index - The index within the interval.
     * @returns {boolean} - True if the two dates have the same interval value; otherwise, false.
     */
    public sameInterval(currentDate: number, previousDate: number, type: IntervalType, index: number): boolean {
        let sameValue: boolean;
        if (index === 0) {
            sameValue = false;
        } else {
            switch (type) {
            case 'Years':
                sameValue = new Date(currentDate).getFullYear() === new Date(previousDate).getFullYear();
                break;
            case 'Months':
                sameValue = new Date(currentDate).getFullYear() === new Date(previousDate).getFullYear() &&
                        new Date(currentDate).getMonth() === new Date(previousDate).getMonth();
                break;
            case 'Days':
                sameValue = (Math.abs(currentDate - previousDate) < 24 * 60 * 60 * 1000 &&
                        new Date(currentDate).getDay() === new Date(previousDate).getDay());
                break;
            case 'Hours':
                sameValue = (Math.abs(currentDate - previousDate) < 60 * 60 * 1000 &&
                        new Date(currentDate).getDay() === new Date(previousDate).getDay());
                break;
            case 'Minutes':
                sameValue = (Math.abs(currentDate - previousDate) < 60 * 1000 &&
                        new Date(currentDate).getMinutes() === new Date(previousDate).getMinutes());
                break;
            case 'Seconds':
                sameValue = (Math.abs(currentDate - previousDate) < 1000 &&
                        new Date(currentDate).getDay() === new Date(previousDate).getDay());
                break;
            }
        }
        return sameValue;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'DateTimeCategory3D';
    }

    /**
     * To destroy the datetime category axis.
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
