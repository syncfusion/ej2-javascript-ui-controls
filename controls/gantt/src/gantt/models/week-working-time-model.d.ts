import { Property, ChildProperty, Collection} from '@syncfusion/ej2-base';import { DayWorkingTimeModel } from './day-working-time-model';import { DayWorkingTime } from '../models/day-working-time';import { DayOfWeek } from '../base/enum';

/**
 * Interface for a class WeekWorkingTime
 */
export interface WeekWorkingTimeModel {

    /**
     * Defines the day of the week to apply customized working time.
     *
     * @default null
     */
    dayOfWeek?: DayOfWeek;

    /**
     * Defines the time range for each day of the week.
     *
     * @default []
     * @aspType List<GanttDayWorkingTime>
     *
     */
    timeRange?: DayWorkingTimeModel[];

}