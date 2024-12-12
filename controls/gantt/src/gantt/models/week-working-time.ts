import { Property, ChildProperty, Collection} from '@syncfusion/ej2-base';
import { DayWorkingTimeModel } from './day-working-time-model';
import { DayWorkingTime } from '../models/day-working-time';
import { DayOfWeek } from '../base/enum';

/**
 * Defines the working time of the day in the project.
 */

export class WeekWorkingTime extends ChildProperty<WeekWorkingTime> {
    /**
     * Defines the day of the week to apply customized working time.
     *
     * @default null
     */
    @Property()
    public dayOfWeek: DayOfWeek;
    /**
     * Defines the time range for each day of the week.
     *
     * @default []
     * @aspType List<GanttDayWorkingTime>
     *
     */
    @Collection<DayWorkingTimeModel>([], DayWorkingTime)
    public timeRange: DayWorkingTimeModel[];
}
