import { Double } from '../axis/double-axis';
import { Axis, Size } from '../../chart/index';
import { RangeIntervalType } from '../../range-navigator';
/**
 * Common axis classes
 * @private
 */

export class NiceInterval extends Double {
    /**
     * Method to calculate numeric datetime interval
     */
    public calculateDateTimeNiceInterval(axis: Axis, size: Size, start: number, end: number, isChart: boolean = true): number {
        let oneDay: number = 24 * 60 * 60 * 1000;
        let startDate: Date = new Date(start);
        let endDate: Date = new Date(end);
        //var axisInterval ;
        let totalDays: number = (Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
        let interval: number;
        axis.actualIntervalType = axis.intervalType;
        let type: RangeIntervalType = axis.intervalType as RangeIntervalType;
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
                interval = this.calculateNumericNiceInterval(axis, (totalDays / 365) * 4, size);
                if (interval >= 1 && !isChart) {
                    (axis.actualIntervalType as RangeIntervalType) = 'Quarter';
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
     * @return {string}
     * @private
     */
    public getSkeleton(axis: Axis, currentValue: number, previousValue: number): string {
        let skeleton: string;
        let intervalType: RangeIntervalType = axis.actualIntervalType as RangeIntervalType;
        if (axis.skeleton) {
            return axis.skeleton;
        }
        if (intervalType === 'Years') {
            skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'y' : 'yMMM') : 'y';
        } else if (intervalType === 'Quarter') {
            skeleton = 'yMMM';
        } else if (intervalType === 'Months') {
            skeleton = axis.isChart ? 'MMMd' : 'MMM';
        } else if (intervalType === 'Weeks') {
            skeleton = 'MEd';
        } else if (intervalType === 'Days') {
            skeleton = axis.isChart ? this.getDayFormat(axis, currentValue, previousValue) : 'MMMd';
        } else if (intervalType === 'Hours') {
            skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'Hm' : 'EHm') : 'h';
        } else if (intervalType === 'Minutes') {
            skeleton = axis.isChart ? 'Hms' : 'hm';
        } else {
            skeleton = axis.isChart ? 'Hms' : 'hms';
        }
        return skeleton;
    }

   /**
    * Get intervalType month format
    * @param currentValue 
    * @param previousValue 
    */
    private getMonthFormat(currentValue: number, previousValue: number): string {
        return ((new Date(currentValue).getFullYear() === new Date(previousValue).getFullYear()) ? 'MMM' : 'y MMM');
    }

    /**
     * Get intervalType day label format for the axis
     * @param axis 
     * @param currentValue 
     * @param previousValue 
     */
    private getDayFormat(axis: Axis, currentValue: number, previousValue: number): string {
        return (axis.valueType === 'DateTime' ?
        ((new Date(currentValue).getMonth() !== new Date(previousValue).getMonth()) ? 'MMMd' : 'd') : 'yMd');
    }

   /**
    * Find label format for axis
    * @param axis 
    * @param currentValue 
    * @param previousValue
    * @private
    */
    public findCustomFormats(axis: Axis, currentValue: number, previousValue: number): string {
        let labelFormat: string = axis.labelFormat ? axis.labelFormat : '';
        if (axis.isChart && !axis.skeleton && axis.actualIntervalType === 'Months' && !labelFormat) {
                labelFormat = axis.valueType === 'DateTime' ? this.getMonthFormat(currentValue, previousValue) : 'yMMM';
        }
        return labelFormat;
    }
}