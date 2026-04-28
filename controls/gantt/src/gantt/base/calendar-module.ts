import { Gantt } from './gantt';
import { ProjectCalendarModel, TaskCalendarModel, HolidayModel, DayWorkingTimeModel } from '../models/models';
import { CalendarContext } from './calendar-context';
/**
 * CalendarModule provides calendar management functionality for handling task-specific and project-wide calendars.
 * It enables retrieval of calendar configurations basedroper task scheduling across different calendar contexts.
 */
export class CalendarModule {
    protected parent: Gantt;
    constructor(parent: Gantt) {
        this.parent = parent;
    }
    /**
     * Retrieves the appropriate calendar configuration based on the provided ID.
     * If no ID is provided or the specified calendar is not found, returns the project-wide default calendar.
     * @param {string|null} id - The unique identifier of the task-specific calendar to retrieve.
     * @returns {ProjectCalendarModel} The matching task calendar if found, otherwise the project default calendar.
     * @private
     */
    public getCalendarById(id: string | null): ProjectCalendarModel {
        const taskCalendars: TaskCalendarModel[] = this.parent.calendarSettings.taskCalendars;
        const projectCalendar: ProjectCalendarModel = this.parent.calendarSettings.projectCalendar;
        if (!id) {
            return projectCalendar;
        }
        if (taskCalendars && taskCalendars.length > 0) {
            for (let i: number = 0; i < taskCalendars.length; i++) {
                if (taskCalendars[i as number].calendarId === id) {
                    return taskCalendars[i as number];
                }
            }
        }
        return projectCalendar;
    }
    public holidays: HolidayModel[] = [];
    public workingTime: DayWorkingTimeModel[] = [];
}
