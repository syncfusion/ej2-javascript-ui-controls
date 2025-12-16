import { Complex, Collection, ChildProperty } from '@syncfusion/ej2-base';import { ProjectCalendarModel, TaskCalendarModel } from './project-task-calendar-model';import { ProjectCalendar, TaskCalendar } from '../models/project-task-calendar';

/**
 * Interface for a class CalendarSettings
 */
export interface CalendarSettingsModel {

    /**
     * Defines the default calendar for the entire project.
     *
     * @default {}
     */
    projectCalendar?: ProjectCalendarModel;

    /**
     * Defines a list of custom calendars assignable to specific tasks.
     *
     * @default []
     */
    taskCalendars?: TaskCalendarModel[];

}