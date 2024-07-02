import { Axis } from '../axis/axis';
import { Category } from '../axis/category-axis';
import { triggerLabelRender, valueToCoefficient } from '../../common/utils/helper';
import { Size } from '@syncfusion/ej2-svg-base';
import { withIn, firstToLowerCase } from '../../common/utils/helper';
import { Chart } from '../chart';
import { extend, getValue } from '@syncfusion/ej2-base';
import { Font } from '../../common/model/base';
import { RangeIntervalType } from '../../common/utils/enum';

/**
 * Category module is used to render category axis.
 */

export class DateTimeCategory extends Category {
    private axisSize: Size;

    /**
     * Constructor for the category module.
     *
     * @private
     * @param {Chart} chart - Specifies the chart.
     */
    constructor(chart: Chart) {
        super(chart);
    }

    /**
     * The function to calculate the range and labels for the axis.
     *
     * @returns {void}
     * @private
     */

    public calculateRangeAndInterval(size: Size, axis: Axis): void {

        this.axisSize = size;

        this.calculateRange(axis);

        this.getActualRange(axis, size);

        this.applyRangePadding(axis, size);

        this.calculateVisibleLabels(axis);
    }

    /**
     * Calculate label for the axis.
     *
     * @private
     */

    public calculateVisibleLabels(axis: Axis): void {
        /** Generate axis labels */
        axis.visibleLabels = [];
        let labelStyle: Font;
        const padding: number = axis.labelPlacement === 'BetweenTicks' ? 0.5 : 0;
        let previousIndex: number = 0;
        const isRangeNavigator: boolean = this.chart.getModuleName() === 'rangeNavigator';
        this.axisSize = isRangeNavigator ? this.chart.availableSize : this.axisSize;
        if (isRangeNavigator || this.chart.stockChart) {
            axis.labels.sort((a: string, b: string) => Number(a) - Number(b));
        }
        if (axis.intervalType === 'Auto') {
            this.calculateDateTimeNiceInterval(
                axis, this.axisSize, parseInt(axis.labels[0], 10),
                parseInt(axis.labels[axis.labels.length - 1], 10)
            );
        } else {
            axis.actualIntervalType = axis.intervalType;
        }
        axis.format = this.chart.intl.getDateFormat({
            format: axis.labelFormat || this.blazorCustomFormat(axis), type: firstToLowerCase(axis.skeletonType),
            skeleton: this.getSkeleton(axis, null, null, this.chart.isBlazor)
        });
        let i: number = (!isRangeNavigator && this.chart.stockChart) ? 1 : 0;
        const interval: number = axis.interval ? axis.interval : 1;
        for (; i < axis.labels.length; i += interval) {
            labelStyle = <Font>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (this.chart.stockChart || isRangeNavigator) {
                if (axis.intervalType === 'Auto') {
                    if ((((!isRangeNavigator && i === 1) || this.StartOfWeek(axis.labels.map(Number)[i as number],
                                                                             axis.labels.map(Number)[i - 1], axis, i, previousIndex))
                    || axis.isIndexed) && withIn(i, axis.visibleRange)) {
                        triggerLabelRender(
                            this.chart, i, (axis.isIndexed ? this.getIndexedAxisLabel(axis.labels[i as number], axis.format) :
                                <string>axis.format(new Date(axis.labels.map(Number)[i as number]))),
                            labelStyle, axis
                        );
                        previousIndex = i;
                    }
                }
                else if ((((!isRangeNavigator && i === 1) || !this.sameInterval(axis.labels.map(Number)[i as number],
                                                                                axis.labels.map(Number)[i - 1], axis.actualIntervalType, i))
                    || axis.isIndexed) && withIn(i, axis.visibleRange)) {
                    if ((!isRangeNavigator && i === 1) || this.isMaximum(i, previousIndex, axis)) {
                        triggerLabelRender(
                            this.chart, i, (axis.isIndexed ? this.getIndexedAxisLabel(axis.labels[i as number], axis.format) :
                                <string>axis.format(new Date(axis.labels.map(Number)[i as number]))),
                            labelStyle, axis
                        );
                        previousIndex = i;
                    }
                }
            }
            else {
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
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    }

    /**
     * Calculate the Blazor custom format for axis.
     *
     * @param {Axis} axis - The axis for which the custom format is calculated.
     * @returns {string} - The custom format string.
     * @private
     */
    private blazorCustomFormat(axis: Axis): string {
        if (this.chart.isBlazor && axis.actualIntervalType === 'Years') {
            return 'yyyy';
        } else {
            return '';
        }
    }
    /**
     * To get the Indexed axis label text with axis format for DateTimeCategory axis.
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
     * Get the same interval.
     *
     * @param {number} currentDate - The current date.
     * @param {number} previousDate - The previous date.
     * @param {RangeIntervalType} type - The type of range interval.
     * @param {number} index - The index of the interval.
     * @returns {boolean} - Indicates if the intervals are the same.
     */
    public sameInterval(currentDate: number, previousDate: number, type: RangeIntervalType, index: number): boolean {
        let sameValue: boolean;
        if (index === 0) {
            sameValue = false;
        } else {
            switch (type) {
            case 'Years':
                sameValue = new Date(currentDate).getFullYear() === new Date(previousDate).getFullYear();
                break;
            case 'Quarter':
                sameValue = new Date(currentDate).getFullYear() === new Date(previousDate).getFullYear() &&
                            Math.floor(new Date(currentDate).getMonth() / 3) === Math.floor(new Date(previousDate).getMonth() / 3);
                break;
            case 'Months':
                sameValue = new Date(currentDate).getFullYear() === new Date(previousDate).getFullYear() &&
                        new Date(currentDate).getMonth() === new Date(previousDate).getMonth();
                break;
            case 'Weeks':
                sameValue = new Date(currentDate).getFullYear() === new Date(previousDate).getFullYear() &&
                            new Date(currentDate).getMonth() === new Date(previousDate).getMonth() &&
                            Math.floor((new Date(currentDate).getDate() - 1) / 7) ===
                            Math.floor((new Date(previousDate).getDate() - 1) / 7);
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
     * To check whether the current label comes in the same week as the previous label week.
     *
     * @param {number} currentDate - The current date.
     * @param {number} previousDate - The previous date.
     * @param {Axis} axis - The axis.
     * @param {number} index - The current index.
     * @param {number} previousIndex - The previous index.
     * @returns {boolean} - Indicates if the labels fall in the same week.
     */
    private StartOfWeek(currentDate: number, previousDate: number, axis: Axis, index: number, previousIndex: number): boolean {
        if (index === 0) {
            return true;
        }
        let isMonday: boolean = false;
        const labelsCount: number = 30;
        if (axis.labels.length >= labelsCount) {
            const previousDay: Date = new Date(previousDate);
            const currentday: Date = new Date(currentDate);
            previousDay.setDate(previousDay.getDate() - previousDay.getDay());
            currentday.setDate(currentday.getDate() - currentday.getDay());
            isMonday = !(previousDay.getTime() === currentday.getTime()) && this.isMaximum(index, previousIndex, axis);
        }
        else {
            isMonday = this.isMaximum(index, previousIndex, axis);
        }
        return isMonday;
    }
    /**
     * To check whether the distance between labels is above the axisLabel maximum length.
     *
     * @param {number} index - The current index.
     * @param {number} previousIndex - The previous index.
     * @param {Axis} axis - The axis.
     * @returns {boolean} - Indicates if the distance between labels exceeds the maximum length.
     */
    public isMaximum(index: number, previousIndex: number, axis: Axis): boolean {
        if (index === 0) {
            return true;
        }
        const axisLabelMaximumLength: number = 100;
        const pointX: number = valueToCoefficient(index, axis) * axis.rect.width;
        const previousPointX: number = valueToCoefficient(previousIndex, axis) * axis.rect.width;
        return (pointX - previousPointX >= (axis.labels.length >= 15 ? axisLabelMaximumLength : axisLabelMaximumLength / 2));
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
        return 'DateTimeCategory';
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
