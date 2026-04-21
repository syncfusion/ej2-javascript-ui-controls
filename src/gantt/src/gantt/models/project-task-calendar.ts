import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';
import { DayWorkingTimeModel } from './day-working-time-model';
import { HolidayModel } from './holiday-model';
import { CalendarExceptionModel } from './calendar-exception-model';
import { DayWorkingTime } from '../models/day-working-time';
import { Holiday } from '../models/holiday';
import { CalendarException } from '../models/calendar-exception';
/**
 * Defines the base calendar structure for the project.
 *
 * This configuration controls global working hours, holidays, and exceptions that influence task scheduling across the Gantt chart.
 */
export class ProjectCalendar extends ChildProperty<ProjectCalendar> {
    /**
     * Defines the default working time range for each day.
     *
     * Used when no weekday-specific overrides are provided. Each entry specifies a time block (e.g., 8–12, 13–17).
     *
     * @default [{ from: 8, to: 12 }, { from: 13, to: 17 }]
     * @aspType List<GanttDayWorkingTime>
     */
    @Collection<DayWorkingTimeModel>([{ from: 8, to: 12 }, { from: 13, to: 17 }], DayWorkingTime)
    public workingTime: DayWorkingTimeModel[];
    /**
     * Defines a collection of holiday markers for the project calendar.
     *
     * Holidays are visually highlighted and treated as non-working days during scheduling.
     *
     * @default []
     */
    @Collection<HolidayModel>([], Holiday)
    public holidays: HolidayModel[];
    /**
     * Defines a collection of calendar exceptions that override default working behavior.
     *
     * Exceptions can represent one-off changes such as extended work hours or ad-hoc non-working days.
     *
     * @default []
     */
    @Collection<CalendarExceptionModel>([], CalendarException)
    public exceptions: CalendarExceptionModel[];
}
/**
 * Defines a calendar specific to a task, including a unique identifier and optional inheritance from a parent calendar.
 *
 */
export class TaskCalendar extends ChildProperty<TaskCalendar> {
    /**
     * Specifies the unique identifier for the task calendar.
     * This ID is used to associate the calendar with a task via taskFields.calendarId.
     * @default null
     */
    @Property(null)
    public calendarId: string;
    /**
     * Defines a collection of visual holiday markers.
     *
     * @default []
     */
    @Collection<HolidayModel>([], Holiday)
    public holidays: HolidayModel[];
    /**
     * Defines a collection of calendar exceptions that override default behavior.
     *
     * @default []
     */
    @Collection<CalendarExceptionModel>([], CalendarException)
    public exceptions: CalendarExceptionModel[];
}
