import { Property, ChildProperty, Collection} from '@syncfusion/ej2-base';import { DayWorkingTimeModel } from './day-working-time-model';import { DayWorkingTime } from '../models/day-working-time';import { DayOfWeek } from '../base/enum';

/**
 * Interface for a class WeekWorkingTime
 */
export interface WeekWorkingTimeModel {

    /**
     * Defines day for setting time customized time range.
     *
     * @default null
     */
    dayOfWeek?: DayOfWeek;

    /**
     * Defines time range of each day in week.
     *
     * @default []
     * @aspType List<GanttDayWorkingTime>
     *
     */
    timeRange?: DayWorkingTimeModel[];

}