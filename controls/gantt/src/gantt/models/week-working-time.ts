import { Property, ChildProperty, Collection} from '@syncfusion/ej2-base';
import { DayWorkingTimeModel } from './day-working-time-model';
import { DayWorkingTime } from '../models/day-working-time';
import { DayOfWeek } from '../base/enum';
 
/**
 * Defines working time of day in project.
 */
 
export class WeekWorkingTime extends ChildProperty<WeekWorkingTime> {
    /**
     * Defines day for setting time customized time range.
     *
     * @default null
     */
    @Property()
    public dayOfWeek: DayOfWeek;
    /**
     * Defines time range of each day in week.
     *
     * @default []
     * @aspType List<GanttDayWorkingTime>
     *
     */
    @Collection<DayWorkingTimeModel>([], DayWorkingTime)
    public timeRange: DayWorkingTimeModel[];
}
