import { IntervalType } from '../../common/utils/enum';
import { Double3D } from '../axis/double-axis';
import { Chart3DAxis } from './axis';
import { Size } from '@syncfusion/ej2-svg-base';

/**
 * Common axis classes
 *
 * @private
 */
export class NiceIntervals extends Double3D {
    /**
     * Calculates a nice interval for a date-time axis based on the given size and data range.
     *
     * @param {Chart3DAxis} axis - The date-time axis for which the nice interval is calculated.
     * @param {Size} size - The size of the chart area.
     * @param {number} start - The start value of the data range.
     * @param {number} end - The end value of the data range.
     * @returns {number} - The calculated nice interval for the date-time axis.
     */
    public calculateDateTimeNiceInterval(axis: Chart3DAxis, size: Size, start: number, end: number): number {
        const oneDay: number = 24 * 60 * 60 * 1000;
        const startDate: Date = new Date(start);
        const endDate: Date = new Date(end);
        const totalDays: number = (Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
        let interval: number;
        axis.actualIntervalType = axis.intervalType;
        const type: IntervalType = axis.intervalType as IntervalType;
        switch (type) {
        case 'Years':
            interval = this.calculateNumericNiceInterval(axis, totalDays / 365, size);
            break;
        case 'Months':
            interval = this.calculateNumericNiceInterval(axis, totalDays / 30, size);
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
     * @param {Chart3DAxis} axis - The date-time axis for which the skeleton is calculated.
     * @returns {string} - Skeleton format.
     * @private
     */
    public getSkeleton(axis: Chart3DAxis): string {
        let skeleton: string;
        const intervalType: IntervalType = axis.actualIntervalType as IntervalType;
        if (axis.skeleton) {
            return axis.skeleton;
        }
        if (intervalType === 'Years') {
            skeleton = ((axis.valueType === 'DateTime' && axis.isIntervalInDecimal) ? 'y' : 'yMMM');
        } else if (intervalType === 'Months') {
            skeleton = 'MMMd';
        } else if (intervalType === 'Days') {
            skeleton = (axis.valueType === 'DateTime' ? 'MMMd' : 'yMd');
        } else if (intervalType === 'Hours') {
            skeleton = (axis.valueType === 'DateTime' ? 'Hm' : 'EHm');
        } else if (intervalType === 'Minutes') {
            skeleton = 'Hms';
        } else {
            skeleton = 'Hms';
        }
        return skeleton;
    }

    /**
     * Find label format for axis
     *
     * @param {Chart3DAxis} axis - The  axis for which the label format is calculated.
     * @returns {string} - The axis label format.
     * @private
     */
    public findCustomFormats(axis: Chart3DAxis): string {
        let labelFormat: string = axis.labelFormat ? axis.labelFormat : '';
        if (!axis.skeleton && axis.actualIntervalType === 'Months' && !labelFormat) {
            labelFormat = axis.valueType === 'DateTime' ? 'MMM yyyy' : 'yMMM';
        }
        return labelFormat;
    }
}
