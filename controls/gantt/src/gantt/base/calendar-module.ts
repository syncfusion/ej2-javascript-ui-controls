import { Gantt } from './gantt';
import { ProjectCalendarModel, TaskCalendarModel, HolidayModel, DayWorkingTimeModel } from '../models/models';
import { IWorkingTimeRange } from './interface';
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
        else {
            return projectCalendar;
        }
        return projectCalendar;
    }
    private getDirectEndDate(
        startDate: Date,
        duration: number
    ): Date {
        if (duration < 0) {
            return startDate;
        }
        const resultDate: Date = new Date(startDate.getTime());
        resultDate.setDate(resultDate.getDate() + (duration - 1));
        const exception: {
            hasException: boolean;
            data: any;
        } = this.parent.defaultCalendarContext.getExceptionForDate(resultDate);
        const endTime: number = exception.hasException ? exception.data.endTime : this.parent.defaultEndTime;
        const hours: number = Math.floor(endTime / 3600);
        const minutes: number = Math.floor((endTime % 3600) / 60);
        const seconds: number = endTime % 60;
        resultDate.setHours(hours, minutes, seconds, 0);
        return resultDate;
    }
    private calculateDayWidth(ranges: IWorkingTimeRange[], startSec: number, endSec: number, perDayWidth: number): number {
        let totalSeconds: number = 0;
        for (const r of ranges) {
            totalSeconds += (r.to - r.from);
        }
        let coveredSeconds: number = 0;
        for (const r of ranges) {
            if (endSec <= r.from) {
                break;
            }
            if (startSec >= r.to) {
                continue;
            }
            const effectiveStart: number = Math.max(startSec, r.from);
            const effectiveEnd: number = Math.min(endSec, r.to);
            if (effectiveEnd > effectiveStart) {
                coveredSeconds += (effectiveEnd - effectiveStart);
            }
        }
        return (coveredSeconds / totalSeconds) * perDayWidth;
    }
    private calculateWidthWithExceptions(
        sDate: Date,
        eDate: Date,
        startException: { hasException: boolean; data: any },
        endException: { hasException: boolean; data: any }
    ): number {
        let width: number = 0;
        const sameDay: boolean = sDate.toDateString() === eDate.toDateString();
        let ranges: IWorkingTimeRange[];
        if (sameDay) {
            ranges = startException.hasException
                ? startException.data.workingRange
                : this.parent.workingTimeRanges;
            width = this.calculateDayWidth(
                ranges,
                this.parent.dataOperation['getSecondsInDecimal'](sDate),
                this.parent.dataOperation['getSecondsInDecimal'](eDate),
                this.parent.perDayWidth
            );
        } else {
            // start date partial
            ranges = startException.hasException
                ? startException.data.workingRange
                : this.parent.workingTimeRanges;
            width += this.calculateDayWidth(
                ranges,
                this.parent.dataOperation['getSecondsInDecimal'](sDate),
                ranges[ranges.length - 1].to,
                this.parent.perDayWidth
            );
            // in-between full days
            const daysBetween: number =
                Math.floor((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysBetween > 0) {
                width += daysBetween * this.parent.perDayWidth;
            }
            // end date partial
            ranges = endException.hasException
                ? endException.data.workingRange
                : this.parent.workingTimeRanges;
            width += this.calculateDayWidth(
                ranges,
                ranges[0].from,
                this.parent.dataOperation['getSecondsInDecimal'](eDate),
                this.parent.perDayWidth
            );
        }
        return width;
    }
    public holidays: HolidayModel[] = [];
    public workingTime: DayWorkingTimeModel[] = [];
}
