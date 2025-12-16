import { CalendarExceptionModel, HolidayModel, ProjectCalendarModel } from '../models/models';
import { Gantt } from './gantt';

/**
 * Calendar context is used to manage working time configurations for tasks and projects.
 * It provides access to calendar settings including working hours, holidays, and exceptions.
 */
export class CalendarContext {
    protected parent: Gantt;
    private calendar: ProjectCalendarModel;
    public defaultHolidays: number[] = [];
    public exceptionsRanges: {
        id: string;
        from: Date;
        to: Date;
    }[] = [];
    constructor(parent: Gantt, calendar: ProjectCalendarModel) {
        this.parent = parent;
        this.calendar = calendar;
        this.initialize();
    }
    private initialize(): void {
        this.buildDefaultHolidays();
        this.buildExceptionsCollection();
    }
    private buildDefaultHolidays(): void {
        const holidays: HolidayModel[] = this.calendar['propName'] === 'projectCalendar' ? this.parent.calendarModule.holidays : this.calendar.holidays;
        const overrides: CalendarExceptionModel[] = this.calendar.exceptions;
        for (let i: number = 0; i < holidays.length; i++) {
            const holiday: HolidayModel = holidays[i as number];
            const fromDate: Date = holiday.from ? new Date(holiday.from) : new Date(holiday.to);
            const toDate: Date = holiday.to ? new Date(holiday.to) : new Date(holiday.from);
            for (
                let d: Date = new Date(fromDate);
                d <= toDate;
                d.setDate(d.getDate() + 1)
            ) {
                const timestamp: number = new Date(d).setHours(0, 0, 0, 0);
                let isOverridden: boolean = false;
                for (let j: number = 0; j < overrides.length; j++) {
                    const overrideDate: number = new Date(overrides[j as number].from).setHours(0, 0, 0, 0);
                    if (overrideDate === timestamp) {
                        isOverridden = true;
                        break;
                    }
                }
                if (!isOverridden) {
                    this.defaultHolidays.push(timestamp);
                }
            }
        }
    }
    private buildExceptionsCollection(): void {
        const overrides: CalendarExceptionModel[] = this.calendar.exceptions;
        for (let i: number = 0; i < overrides.length; i++) {
            const override: CalendarExceptionModel = overrides[i as number];
            const fromDate: Date = new Date(override.from);
            const toDate: Date = new Date(override.to);
            const id: string = `exception_${i}`;
            this.exceptionsRanges.push({
                id,
                from: fromDate,
                to: toDate
            });
        }
    }
    /**
     * Checks if the provided date falls within any exception period.
     * @param {Date} date - The date to check.
     * @returns {boolean} True if the date is part of an exception, otherwise false.
     * @public
     */
    public getExceptionForDate(date: Date): boolean {
        const target: Date = new Date(date.getTime());
        target.setHours(0, 0, 0, 0);
        for (const range of this.exceptionsRanges) {
            const from: Date = new Date(range.from);
            const to: Date = new Date(range.to);
            from.setHours(0, 0, 0, 0);
            to.setHours(0, 0, 0, 0);
            if (target >= from && target <= to) {
                return true;
            }
        }
        return false;
    }
}
