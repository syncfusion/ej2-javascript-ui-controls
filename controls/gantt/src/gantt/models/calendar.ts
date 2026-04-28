import { Complex, Collection, ChildProperty } from '@syncfusion/ej2-base';
import { ProjectCalendarModel, TaskCalendarModel } from './project-task-calendar-model';
import { ProjectCalendar, TaskCalendar } from '../models/project-task-calendar';
/**
 * Defines the root model for all calendar settings in the project.
 */
export class CalendarSettings extends ChildProperty<CalendarSettings> {
    /**
     * Defines the default calendar for the entire project.
     *
     * @default {}
     */
    @Complex<ProjectCalendarModel>({}, ProjectCalendar)
    public projectCalendar: ProjectCalendarModel;
    /**
     * Defines a list of custom calendars assignable to specific tasks.
     *
     * @default []
     */
    @Collection<TaskCalendarModel>([], TaskCalendar)
    public taskCalendars: TaskCalendarModel[];
}
