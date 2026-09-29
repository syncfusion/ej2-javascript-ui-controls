import { CalendarExceptionModel, HolidayModel, ProjectCalendarModel, DayWorkingTimeModel } from '../models/models';
import { CalendarExceptionRange, CalendarExceptionResult, IWorkingTimeRange } from './interface';
import { Gantt } from './gantt';

/**
 * Calendar context is used to manage working time configurations for tasks and projects.
 * It provides access to calendar settings including working hours, holidays, and exceptions.
 */
export class CalendarContext {
    protected parent: Gantt;
    private calendar: ProjectCalendarModel;
    public defaultHolidays: number[] = [];
    public sortedDefaultHolidays: number[] = [];
    private exceptionDateSet: Map<number, any> = new Map<number, any>();
    public exceptionsRanges: {
        id: string;
        from: Date;
        to: Date;
        workingTime?: DayWorkingTimeModel[];
        label?: string;
        secondsPerDay?: number;
        workingRange?: IWorkingTimeRange[];
        nonWorkingRange?: IWorkingTimeRange[];
        nonWorkingHours?: number[];
        totalDurationDays?: number;
        totalWorkingHours?: number;
        startTime?: number;
        endTime?: number;
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
        this.sortedDefaultHolidays = this.defaultHolidays.slice().sort((a: number, b: number) => a - b);
    }
    private buildExceptionsCollection(): void {
        const overrides: CalendarExceptionModel[] = this.calendar.exceptions;
        for (let i: number = 0; i < overrides.length; i++) {
            const override: CalendarExceptionModel = overrides[i as number];
            const fromDate: Date = new Date(override.from);
            const toDate: Date = new Date(override.to);
            const totalDurationDays: number = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const id: string = `exception_${i}`;
            const effectiveExceptionWorkingTime: DayWorkingTimeModel[] = override.exceptionWorkingTime &&
                override.exceptionWorkingTime.length > 0
                ? override.exceptionWorkingTime
                : this.calendar.workingTime || this.parent.defaultCalendarContext.calendar.workingTime;
            const range: CalendarExceptionRange = {
                id,
                from: fromDate,
                to: toDate,
                label: override.label,
                exceptionWorkingTime: effectiveExceptionWorkingTime
            };
            const workingRanges: IWorkingTimeRange[] = [];
            let totalSeconds: number = 0;
            const nonWorkingHours: number[] = [];
            const nonWorking: IWorkingTimeRange[] = [];
            const startDate: Date = new Date('10/11/2018'); // This seems to be a reference date
            const startTimeObj: { startTime: number; } = { startTime: 0 };
            const endTimeObj: { endTime: number; } = { endTime: 0 };
            let seconds: number = 0;
            for (let j: number = 0; j < range.exceptionWorkingTime.length; j++) {
                const currentRange: DayWorkingTimeModel = range.exceptionWorkingTime[j as number];
                seconds = seconds + this.parent.dateValidationModule['getWorkingTime']('', currentRange, startDate, totalSeconds, j, nonWorkingHours, workingRanges, nonWorking, startTimeObj, endTimeObj);
            }
            if (endTimeObj.endTime / 3600 !== 24) {
                nonWorking.push({ from: endTimeObj.endTime, to: 86400, isWorking: false, interval: 86400 - endTimeObj.endTime });
            }
            totalSeconds = seconds;
            let dailyWorkingHours: number = 0;
            for (const timeRange of range.exceptionWorkingTime) {
                dailyWorkingHours += timeRange.to - timeRange.from;
            }
            const totalWorkingHours: number = dailyWorkingHours * totalDurationDays;
            const exceptionRange: any = {
                id,
                from: fromDate,
                to: toDate,
                workingTime: override.exceptionWorkingTime,
                label: override.label,
                secondsPerDay: totalSeconds,
                workingRange: workingRanges,
                nonWorkingRange: nonWorking,
                nonWorkingHours: nonWorkingHours,
                totalDurationDays: totalDurationDays,
                totalWorkingHours: totalWorkingHours,
                startTime: startTimeObj.startTime,
                endTime: endTimeObj.endTime
            };
            this.exceptionsRanges.push(exceptionRange);
            for (let d: Date = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
                this.exceptionDateSet.set(new Date(d).setHours(0, 0, 0, 0), exceptionRange);
            }
        }
    }
    /**
     * Checks if the provided date falls within any exception period.
     * @param {Date} date - The date to check.
     * @returns {boolean} True if the date is part of an exception, otherwise false.
     * @public
     */
    public getExceptionForDate(date: Date): { hasException: boolean; data: any } {
        const timestamp: number = new Date(date.getTime()).setHours(0, 0, 0, 0);
        const range: any = this.exceptionDateSet.get(timestamp);
        return {
            hasException: !!range,
            data: range || null
        };
    }
}
