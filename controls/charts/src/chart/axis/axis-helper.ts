/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { Double } from '../axis/double-axis';
import { Axis } from '../../chart/index';
import { Size } from '@syncfusion/ej2-svg-base';
import { RangeIntervalType } from '../../common/utils/enum';
/**
 * Common axis classes
 *
 * @private
 */

export class NiceInterval extends Double {
    /**
     * Method to calculate numeric datetime interval.
     */
    public calculateDateTimeNiceInterval(axis: Axis, size: Size, start: number, end: number, isChart: boolean = true): number {
        const oneDay: number = 24 * 60 * 60 * 1000;
        const startDate: Date = new Date(start);
        const endDate: Date = new Date(end);
        //var axisInterval ;
        const totalDays: number = (Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
        let interval: number;
        axis.actualIntervalType = axis.intervalType;
        const type: RangeIntervalType = axis.intervalType as RangeIntervalType;
        switch (type) {
        case 'Years':
            interval = this.calculateNumericNiceInterval(axis, totalDays / 365, size);
            break;
        case 'Quarter':
            interval = this.calculateNumericNiceInterval(axis, (totalDays / 365) * 4, size);
            break;
        case 'Months':
            interval = this.calculateNumericNiceInterval(axis, totalDays / 30, size);
            break;
        case 'Weeks':
            interval = this.calculateNumericNiceInterval(axis, totalDays / 7, size);
            break;
        case 'Days':
            interval = this.calculateNumericNiceInterval(axis, totalDays, size);
            break;
        case 'Hours':
            interval = this.calculateNumericNiceInterval(axis, totalDays * 24, size);
            break;
        case 'Minutes':
            interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60, size);
            break;
        case 'Seconds':
            interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60 * 60, size);
            break;
        case 'Auto':
            interval = this.calculateNumericNiceInterval(axis, totalDays / 365, size);
            if (interval >= 1) {
                axis.actualIntervalType = 'Years';
                return interval;
            }

            interval = this.calculateNumericNiceInterval(axis, totalDays / 30, size);
            if (interval >= 1) {
                axis.actualIntervalType = 'Months';
                return interval;
            }

            interval = this.calculateNumericNiceInterval(axis, totalDays / 7, size);
            if (interval >= 1  && !isChart) {
                (axis.actualIntervalType as RangeIntervalType) = 'Weeks';
                return interval;
            }

            interval = this.calculateNumericNiceInterval(axis, totalDays, size);
            if (interval >= 1) {
                axis.actualIntervalType = 'Days';
                return interval;
            }

            interval = this.calculateNumericNiceInterval(axis, totalDays * 24, size);
            if (interval >= 1) {
                axis.actualIntervalType = 'Hours';
                return interval;
            }

            interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60, size);
            if (interval >= 1) {
                axis.actualIntervalType = 'Minutes';
                return interval;
            }

            interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60 * 60, size);
            axis.actualIntervalType = 'Seconds';
            return interval;
        }
        return interval;
    }

    /**
     * To get the skeleton for the DateTime axis.
     *
     * @returns {string} skeleton format
     * @private
     */
    public getSkeleton(axis: Axis, currentValue: number, previousValue: number, isBlazor ?: boolean): string {
        let skeleton: string;
        const intervalType: RangeIntervalType = axis.actualIntervalType as RangeIntervalType;
        if (axis.skeleton) {
            return axis.skeleton;
        }
        if (intervalType === 'Years') {
            if (isBlazor) {
                skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'y' : 'y') : 'y';
            } else {
                skeleton = axis.isChart ? ((axis.valueType === 'DateTime' && axis.isIntervalInDecimal) ? 'y' : 'yMMM') : 'y';
            }
        } else if (intervalType === 'Quarter') {
            skeleton = isBlazor ? 'y' : 'yMMM';
        } else if (intervalType === 'Months') {
            if (isBlazor) {
                skeleton = axis.isChart ? 'm' : 'm';
            } else {
                skeleton = axis.isChart ? 'MMMd' : 'MMM';
            }
        } else if (intervalType === 'Weeks') {
            skeleton = isBlazor ? 'm' : 'MEd';
        } else if (intervalType === 'Days') {
            if (isBlazor) {
                skeleton = 'd';
            } else {
                skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'MMMd' : 'yMd') : 'MMMd';
            }
        } else if (intervalType === 'Hours') {
            if (isBlazor) {
                skeleton = 't';
            } else {
                skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'Hm' : 'EHm') : 'h';
            }
        } else if (intervalType === 'Minutes') {
            if (isBlazor) {
                skeleton = 'T';
            } else {
                skeleton = axis.isChart ? 'Hms' : 'hm';
            }
        } else {
            if (isBlazor) {
                skeleton = 'T';
            } else {
                skeleton = axis.isChart ? 'Hms' : 'hms';
            }
        }
        return skeleton;
    }

    /**
     * Find label format for axis
     *
     * @param {Axis} axis axis
     * @param {number} currentValue currentValue
     * @param {number} previousValue previousValue
     * @private
     */
    public findCustomFormats(axis: Axis, currentValue: number, previousValue: number): string {
        let labelFormat: string = axis.labelFormat ? axis.labelFormat : '';
        if (axis.isChart && !axis.skeleton && axis.actualIntervalType === 'Months' && !labelFormat) {
            labelFormat = axis.valueType === 'DateTime' ? 'MMM yyyy' : 'yMMM';
        }
        return labelFormat;
    }
}
