import { Axis } from '../axis/axis';
import { Category } from '../axis/category-axis';
import { Size, triggerLabelRender } from '../../common/utils/helper';
import { withIn, firstToLowerCase } from '../../common/utils/helper';
import { IntervalType } from '../utils/enum';
import { Chart } from '../chart';
import { extend, getValue } from '@syncfusion/ej2-base';
import { Font } from '../../common/model/base';

/**
 * Category module is used to render category axis.
 */

export class DateTimeCategory extends Category {
    private axisSize: Size;

    /**
     * Constructor for the category module.
     * @private
     */
    constructor(chart: Chart) {
        super(chart);
    }

    /**
     * The function to calculate the range and labels for the axis.
     * @return {void}
     * @private
     */

    public calculateRangeAndInterval(size: Size, axis: Axis): void {

        this.axisSize = size;

        this.calculateRange(axis, size);

        this.getActualRange(axis, size);

        this.applyRangePadding(axis, size);

        this.calculateVisibleLabels(axis);
    }

    /**
     * Calculate label for the axis.
     * @private
     */

    public calculateVisibleLabels(axis: Axis): void {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        let labelStyle: Font;
        let padding: number = axis.labelPlacement === 'BetweenTicks' ? 0.5 : 0;
        if (axis.intervalType === 'Auto') {
            this.calculateDateTimeNiceInterval(
                axis, this.axisSize, parseInt(axis.labels[0], 10),
                parseInt(axis.labels[axis.labels.length - 1], 10)
            );
        } else {
            axis.actualIntervalType = axis.intervalType;
        }
        axis.format = this.chart.intl.getDateFormat({
            format: axis.labelFormat, type: firstToLowerCase(axis.skeletonType), skeleton: this.getSkeleton(axis, null, null)
        });
        for (let i: number = 0; i < axis.labels.length; i++) {
            labelStyle = <Font>(extend({}, getValue('properties', axis.labelStyle), null, true));
            if (!this.sameInterval(axis.labels.map(Number)[i], axis.labels.map(Number)[i - 1], axis.actualIntervalType, i)) {
                if (withIn(i - padding, axis.visibleRange)) {
                    triggerLabelRender(
                        this.chart, i, <string>axis.format(new Date(axis.labels.map(Number)[i])),
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
     * get same interval
     */
    private sameInterval(currentDate: number, previousDate: number, type: IntervalType, index: number): boolean {
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
     * Get module name
     */

    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'DateTimeCategory';
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
