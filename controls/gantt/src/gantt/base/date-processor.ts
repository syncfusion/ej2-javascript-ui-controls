import { isNullOrUndefined, getValue, setValue } from '@syncfusion/ej2-base';
import { IGanttData, IWorkingTimeRange, ITaskData } from './interface';
import { HolidayModel, DayWorkingTimeModel, EventMarkerModel } from '../models/models';
import { Gantt } from './gantt';
/**
 *  Date processor is used to handle date of task data.
 */
export class DateProcessor {
    protected parent: Gantt;
    constructor(parent: Gantt) {
        this.parent = parent;
    }
    /**
     * 
     */
    private isValidateNonWorkDays(ganttProp: ITaskData): boolean {
        return (!isNullOrUndefined(ganttProp) && ganttProp.isAutoSchedule &&
            (!this.parent.includeWeekend || this.parent.totalHolidayDates.length > 0)) ||
            (isNullOrUndefined(ganttProp) && (!this.parent.includeWeekend || this.parent.totalHolidayDates.length > 0));
    }
    /**
     * Method to convert given date value as valid start date
     * @param date 
     * @param ganttProp 
     * @param validateAsMilestone 
     * @private
     */
    public checkStartDate(date: Date, ganttProp?: ITaskData, validateAsMilestone?: boolean): Date {
        if (isNullOrUndefined(date)) {
            return null;
        }
        let cloneStartDate: Date = new Date(date.getTime()); let hour: number = this.getSecondsInDecimal(cloneStartDate);
        validateAsMilestone = isNullOrUndefined(validateAsMilestone) ? !isNullOrUndefined(ganttProp) ?
            ganttProp.isMilestone : false : validateAsMilestone;
        if (hour < this.parent.defaultStartTime) {
            this.setTime(this.parent.defaultStartTime, cloneStartDate);
        } else if (hour === this.parent.defaultEndTime && (!ganttProp || !validateAsMilestone)) {
            cloneStartDate.setDate(cloneStartDate.getDate() + 1);
            this.setTime(this.parent.defaultStartTime, cloneStartDate);
        } else if (hour > this.parent.defaultEndTime) {
            cloneStartDate.setDate(cloneStartDate.getDate() + 1);
            this.setTime(this.parent.defaultStartTime, cloneStartDate);
        } else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
            for (let index: number = 0; index < this.parent.workingTimeRanges.length; index++) {
                let value: IWorkingTimeRange = this.parent.workingTimeRanges[index];
                if (hour >= value.to && (this.parent.workingTimeRanges[index + 1] &&
                    hour < this.parent.workingTimeRanges[index + 1].from)) {
                    // milestone can fall at end any interval time
                    if (hour === value.to && (!ganttProp || !validateAsMilestone)) {
                        this.setTime(this.parent.workingTimeRanges[index + 1].from, cloneStartDate);
                    } else if (hour !== value.to) {
                        this.setTime(this.parent.workingTimeRanges[index + 1].from, cloneStartDate);
                    }
                    break;
                }
            }
        }
        let tStartDate: Date;
        do {
            tStartDate = new Date(cloneStartDate.getTime());
            let holidayLength: number = this.parent.totalHolidayDates.length;
            // check holidays and weekends
            if (this.isValidateNonWorkDays(ganttProp)) {
                if (!this.parent.includeWeekend) {
                    let tempDate: Date = new Date(cloneStartDate.getTime());
                    cloneStartDate = this.getNextWorkingDay(cloneStartDate);
                    if (tempDate.getTime() !== cloneStartDate.getTime()) {
                        this.setTime(this.parent.defaultStartTime, cloneStartDate);
                    }
                }
                for (let count: number = 0; count < holidayLength; count++) {
                    let holidayFrom: Date = this.getDateFromFormat(new Date(this.parent.totalHolidayDates[count]));
                    let holidayTo: Date = new Date(holidayFrom.getTime());
                    holidayFrom.setHours(0, 0, 0, 0);
                    holidayTo.setHours(23, 59, 59, 59);
                    if (cloneStartDate.getTime() >= holidayFrom.getTime() && cloneStartDate.getTime() < holidayTo.getTime()) {
                        cloneStartDate.setDate(cloneStartDate.getDate() + 1);
                        this.setTime(this.parent.defaultStartTime, cloneStartDate);
                    }
                }
            }
        } while (tStartDate.getTime() !== cloneStartDate.getTime());
        return new Date(cloneStartDate.getTime());
    }
    /**
     * To update given date value to valid end date
     * @param date 
     * @param ganttProp 
     * @private
     */
    public checkEndDate(date: Date, ganttProp?: ITaskData): Date {
        if (isNullOrUndefined(date)) {
            return null;
        }
        let cloneEndDate: Date = new Date(date.getTime());
        let hour: number = this.getSecondsInDecimal(cloneEndDate);
        if (hour > this.parent.defaultEndTime) {
            this.setTime(this.parent.defaultEndTime, cloneEndDate);
        } else if (hour <= this.parent.defaultStartTime) {
            cloneEndDate.setDate(cloneEndDate.getDate() - 1);
            this.setTime(this.parent.defaultEndTime, cloneEndDate);
        } else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
            for (let index: number = 0; index < this.parent.workingTimeRanges.length; index++) {
                let value: IWorkingTimeRange = this.parent.workingTimeRanges[index];
                if (hour > value.to && (this.parent.workingTimeRanges[index + 1] &&
                    hour <= this.parent.workingTimeRanges[index + 1].from)) {
                    this.setTime(this.parent.workingTimeRanges[index].to, cloneEndDate);
                    break;
                }
            }
        }
        let tempCheckDate: Date;
        do {
            tempCheckDate = new Date(cloneEndDate.getTime());
            let holidayLength: number = this.parent.totalHolidayDates.length;
            if (this.isValidateNonWorkDays(ganttProp)) {
                if (!this.parent.includeWeekend) {
                    let tempDate: Date = new Date(cloneEndDate.getTime());
                    cloneEndDate = this.getPreviousWorkingDay(cloneEndDate);
                    if (tempDate.getTime() !== cloneEndDate.getTime()) {
                        this.setTime(this.parent.defaultEndTime, cloneEndDate);
                    }
                }
                for (let count: number = 0; count < holidayLength; count++) {
                    let holidayFrom: Date = this.getDateFromFormat(new Date(this.parent.totalHolidayDates[count]));
                    let holidayTo: Date = new Date(holidayFrom.getTime());
                    let tempHoliday: Date = new Date(cloneEndDate.getTime());
                    tempHoliday.setMinutes(cloneEndDate.getMilliseconds() - 2);
                    holidayFrom.setHours(0, 0, 0, 0);
                    holidayTo.setHours(23, 59, 59, 59);
                    if (cloneEndDate.getTime() >= holidayFrom.getTime() && cloneEndDate.getTime() < holidayTo.getTime() ||
                        tempHoliday.getTime() >= holidayFrom.getTime() && tempHoliday.getTime() < holidayTo.getTime()) {
                        cloneEndDate.setDate(cloneEndDate.getDate() - 1);
                        if (!(cloneEndDate.getTime() === holidayFrom.getTime() && this.parent.defaultEndTime === 86400 &&
                            this.getSecondsInDecimal(cloneEndDate) === 0)) {
                            this.setTime(this.parent.defaultEndTime, cloneEndDate);
                        }
                    }
                }
            }
        } while (tempCheckDate.getTime() !== cloneEndDate.getTime());
        return new Date(cloneEndDate.getTime());
    }
    /**
     * To validate the baseline start date
     * @param date 
     * @private
     */
    public checkBaselineStartDate(date: Date): Date {
        if (isNullOrUndefined(date)) {
            return null;
        } else {
            let cloneDate: Date = new Date(date.getTime()); let hour: number = this.getSecondsInDecimal(cloneDate);
            if (hour < this.parent.defaultStartTime) {
                this.setTime(this.parent.defaultStartTime, cloneDate);
            } else if (hour >= this.parent.defaultEndTime) {
                cloneDate.setDate(cloneDate.getDate() + 1);
                this.setTime(this.parent.defaultStartTime, cloneDate);
            } else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
                for (let i: number = 0; i < this.parent.workingTimeRanges.length; i++) {
                    let value: IWorkingTimeRange = this.parent.workingTimeRanges[i];
                    if (hour >= value.to && (this.parent.workingTimeRanges[i + 1] &&
                        hour < this.parent.workingTimeRanges[i + 1].from)) {
                        this.setTime(this.parent.workingTimeRanges[i + 1].from, cloneDate);
                        break;
                    }
                }
            }
            return cloneDate;
        }
    }
    /**
     * To validate baseline end date
     * @param date 
     * @private
     */
    public checkBaselineEndDate(date: Date): Date {
        if (isNullOrUndefined(date)) {
            return null;
        } else {
            let cloneDate: Date = new Date(date.getTime()); let hour: number = this.getSecondsInDecimal(cloneDate);
            if (hour > this.parent.defaultEndTime) {
                this.setTime(this.parent.defaultEndTime, cloneDate);
            } else if (hour <= this.parent.defaultStartTime) {
                cloneDate.setDate(cloneDate.getDate() - 1);
                this.setTime(this.parent.defaultEndTime, cloneDate);
            } else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
                for (let i: number = 0; i < this.parent.workingTimeRanges.length; i++) {
                    let value: IWorkingTimeRange = this.parent.workingTimeRanges[i];
                    if (hour > value.to && (this.parent.workingTimeRanges[i + 1] && hour <= this.parent.workingTimeRanges[i + 1].from)) {
                        this.setTime(this.parent.workingTimeRanges[i].to, cloneDate);
                        break;
                    }
                }
            }
            return cloneDate;
        }
    }
    /**
     * To calculate start date value from duration and end date
     * @param ganttData 
     * @private
     */
    public calculateStartDate(ganttData: IGanttData): void {
        let ganttProp: ITaskData = ganttData.ganttProperties;
        let tempStartDate: Date = null;
        if (!isNullOrUndefined(ganttProp.endDate) && !isNullOrUndefined(ganttProp.duration)) {
            tempStartDate = this.getStartDate(ganttProp.endDate, ganttProp.duration, ganttProp.durationUnit, ganttProp);
        }
        this.parent.setRecordValue('startDate', tempStartDate, ganttProp, true);
        if (this.parent.taskFields.startDate) {
            this.parent.dataOperation.updateMappingData(ganttData, 'startDate');
        }
    }
    /**
     * 
     * @param ganttData 
     * @private
     */
    public calculateEndDate(ganttData: IGanttData): void {
        let ganttProp: ITaskData = ganttData.ganttProperties;
        let tempEndDate: Date = null;
        if (!isNullOrUndefined(ganttProp.startDate)) {
            if (!isNullOrUndefined(ganttProp.endDate) && isNullOrUndefined(ganttProp.duration)) {
                if (this.compareDates(ganttProp.startDate, ganttProp.endDate) === 1) {
                    this.parent.setRecordValue('startDate', new Date(ganttProp.endDate.getTime()), ganttProp, true);
                    this.setTime(this.parent.defaultStartTime, ganttProp.startDate);
                }
                this.calculateDuration(ganttData);
            }
            if (!isNullOrUndefined(ganttProp.duration)) {
                tempEndDate = this.getEndDate(ganttProp.startDate, ganttProp.duration, ganttProp.durationUnit, ganttProp, false);
            }
            this.parent.setRecordValue('endDate', tempEndDate, ganttProp, true);
        }
        if (this.parent.taskFields.endDate) {
            this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
        }
    }
    /**
     * To calculate duration from start date and end date
     * @param {IGanttData} ganttData - Defines the gantt data. 
     */
    public calculateDuration(ganttData: IGanttData): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        let tDuration: number = this.getDuration(
            ganttProperties.startDate, ganttProperties.endDate, ganttProperties.durationUnit, ganttProperties.isAutoSchedule);
        this.parent.setRecordValue('duration', tDuration, ganttProperties, true);
        if (this.parent.taskFields.duration) {
            this.parent.dataOperation.updateMappingData(ganttData, 'duration');
            if (this.parent.taskFields.durationUnit) {
                this.parent.dataOperation.updateMappingData(ganttData, 'durationUnit');
            }
        }
    }
    /**
     * 
     * @param sDate Method to get total nonworking time between two date values
     * @param eDate 
     * @param isAutoSchedule 
     * @param isCheckTimeZone 
     */
    private getNonworkingTime(sDate: Date, eDate: Date, isAutoSchedule: boolean, isCheckTimeZone: boolean): number {
        isCheckTimeZone = isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
        let timeDiff: number = this.getTimeDifference(sDate, eDate, isCheckTimeZone) / 1000; // To convert milliseconds to seconds
        let weekendCount: number = !this.parent.includeWeekend && isAutoSchedule ? this.getWeekendCount(sDate, eDate) : 0;
        let totalHours: number = this.getNumberOfSeconds(sDate, eDate, isCheckTimeZone);
        let holidaysCount: number = isAutoSchedule ? this.getHolidaysCount(sDate, eDate) : 0;
        let totWorkDays: number = (totalHours - (weekendCount * 86400) - (holidaysCount * 86400)) / 86400; // working days between two dates
        let nonWorkHours: number = this.getNonWorkingSecondsOnDate(sDate, eDate);
        let totalNonWorkTime: number = (totWorkDays * (86400 - this.parent.secondsPerDay)) +
            (weekendCount * 86400) + (holidaysCount * 86400) + nonWorkHours;
        return totalNonWorkTime;
    }

    /**
     * 
     * @param startDate 
     * @param endDate 
     * @param durationUnit 
     * @param isAutoSchedule 
     * @param isCheckTimeZone 
     * @private
     */
    public getDuration(
        startDate: Date, endDate: Date, durationUnit: string, isAutoSchedule: boolean, isCheckTimeZone?: boolean): number {
        if (isNullOrUndefined(startDate) || isNullOrUndefined(endDate)) {
            return null;
        }
        isCheckTimeZone = isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
        let durationValue: number = 0;
        let timeDiff: number = this.getTimeDifference(startDate, endDate, isCheckTimeZone) / 1000;
        let nonWorkHours: number = this.getNonworkingTime(startDate, endDate, isAutoSchedule, isCheckTimeZone);
        let durationHours: number = timeDiff - nonWorkHours;
        if (!durationUnit || durationUnit === 'day') {
            durationValue = durationHours / this.parent.secondsPerDay;
        } else if (durationUnit === 'minute') {
            durationValue = durationHours / 60;
        } else {
            durationValue = durationHours / 3600;
        }
        return parseFloat(durationValue.toString());
    }
    /**
     * 
     * @param duration 
     * @param durationUnit 
     */
    private getDurationAsSeconds(duration: number, durationUnit: string): number {
        let value: number = 0;
        if (!durationUnit || durationUnit === 'day') {
            value = this.parent.secondsPerDay * duration;
        } else if (durationUnit === 'hour') {
            value = duration * 3600;
        } else {
            value = duration * 60;
        }
        return value;
    }
    /**
     * To get date from start date and duration
     * @param startDate 
     * @param duration 
     * @param durationUnit 
     * @param ganttProp 
     * @param validateAsMilestone
     * @private
     */
    public getEndDate(
        startDate: Date, duration: number, durationUnit: string, ganttProp: ITaskData, validateAsMilestone: boolean): Date {
        let tempStart: Date = new Date(startDate.getTime());
        let endDate: Date = new Date(startDate.getTime());
        let secondDuration: number = this.getDurationAsSeconds(duration, durationUnit);
        let nonWork: number = 0;
        let workHours: number = 0;
        while (secondDuration > 0) {
            endDate.setSeconds(endDate.getSeconds() + secondDuration);
            nonWork = this.getNonworkingTime(tempStart, endDate, ganttProp.isAutoSchedule, true);
            workHours = secondDuration - nonWork;
            secondDuration = secondDuration - workHours;
            if (secondDuration > 0) {
                endDate = this.checkStartDate(endDate, ganttProp, validateAsMilestone);
            }
            tempStart = new Date(endDate.getTime());
        }
        return endDate;
    }
    /**
     * 
     * @param endDate To calculate start date vale from end date and duration
     * @param duration 
     * @param durationUnit 
     * @param ganttProp 
     * @private
     */
    public getStartDate(endDate: Date, duration: number, durationUnit: string, ganttProp: ITaskData): Date {
        let tempEnd: Date = new Date(endDate.getTime());
        let startDate: Date = new Date(endDate.getTime());
        let secondDuration: number = this.getDurationAsSeconds(duration, durationUnit);
        let nonWork: number = 0;
        let workHours: number = 0;
        while (secondDuration > 0) {
            startDate.setSeconds(startDate.getSeconds() - secondDuration);
            nonWork = this.getNonworkingTime(startDate, tempEnd, ganttProp.isAutoSchedule, true);
            workHours = secondDuration - nonWork;
            secondDuration = secondDuration - workHours;
            if (secondDuration > 0) {
                tempEnd = this.checkEndDate(startDate, ganttProp);
            }
            tempEnd = new Date(startDate.getTime());
        }
        return startDate;
    }

    /**
     * @private
     */
    protected getProjectStartDate(ganttProp: ITaskData, isLoad?: boolean): Date {

        if (!isNullOrUndefined(this.parent.cloneProjectStartDate)) {
            let cloneStartDate: Date = this.checkStartDate(this.parent.cloneProjectStartDate);
            this.parent.cloneProjectStartDate = cloneStartDate;
            return new Date(cloneStartDate.getTime());
        } else if (!isNullOrUndefined(this.parent.projectStartDate)) {
            let cloneStartDate: Date = this.getDateFromFormat(this.parent.projectStartDate);
            this.parent.cloneProjectStartDate = this.checkStartDate(cloneStartDate);
        } else if (!isNullOrUndefined(isLoad)) {
            let flatData: IGanttData[] = this.parent.flatData;
            let minStartDate: Date = flatData[0].ganttProperties.startDate;
            for (let index: number = 1; index < flatData.length; index++) {
                let startDate: Date = flatData[index].ganttProperties.startDate;
                if (!isNullOrUndefined(startDate) && this.compareDates(startDate, minStartDate) === -1) {
                    minStartDate = startDate;
                }
            }
            this.parent.cloneProjectStartDate = this.checkStartDate(minStartDate, ganttProp);
        } else {
            return null;
        }
        return new Date(this.parent.cloneProjectStartDate.getTime());
    }
    /**
     * @private
     * @param ganttProp 
     */
    public getValidStartDate(ganttProp: ITaskData): Date {
        let sDate: Date = null;
        if (isNullOrUndefined(ganttProp.startDate)) {
            if (!isNullOrUndefined(ganttProp.endDate)) {
                sDate = new Date(ganttProp.endDate.getTime());
                this.setTime(this.parent.defaultStartTime, sDate);
            } else if (!isNullOrUndefined(ganttProp.duration)) {
                sDate = this.getProjectStartDate(ganttProp);
            }
        } else {
            sDate = new Date(ganttProp.startDate.getTime());
        }
        return sDate;
    }
    /**
     * 
     * @param ganttProp 
     * @private
     */
    public getValidEndDate(ganttProp: ITaskData): Date {
        let eDate: Date = null;
        if (isNullOrUndefined(ganttProp.endDate)) {
            if (!isNullOrUndefined(ganttProp.startDate)) {
                if (ganttProp.isMilestone) {
                    eDate = this.checkStartDate(ganttProp.startDate);
                } else {
                    eDate = new Date(ganttProp.startDate.getTime());
                    this.setTime(this.parent.defaultEndTime, eDate);
                }
            } else if (!isNullOrUndefined(ganttProp.duration)) {
                let sDate: Date = this.getValidStartDate(ganttProp);
                if (sDate) {
                    eDate = this.getEndDate(sDate, ganttProp.duration, ganttProp.durationUnit, ganttProp, false);
                }
            }
        } else {
            eDate = new Date(ganttProp.endDate.getTime());
        }
        return eDate;
    }
    /**
     * @private
     */
    public getSecondsPerDay(): number {
        let dayWorkingTime: DayWorkingTimeModel[] = this.parent.dayWorkingTime;
        let length: number = dayWorkingTime.length;
        let totalSeconds: number = 0; let startDate: Date = new Date('10/11/2018'); let endDate: Date = new Date('10/12/2018');
        this.parent.nonWorkingHours = [];
        let nonWorkingHours: number[] = this.parent.nonWorkingHours;
        this.parent.workingTimeRanges = [];
        let workingTimeRanges: IWorkingTimeRange[] = this.parent.workingTimeRanges;
        this.parent.nonWorkingTimeRanges = [];
        let nonWorkingTimeRanges: IWorkingTimeRange[] = this.parent.nonWorkingTimeRanges;

        for (let count: number = 0; count < length; count++) {
            let currentRange: DayWorkingTimeModel = dayWorkingTime[count];
            if (!isNullOrUndefined(currentRange.from) && !isNullOrUndefined(currentRange.to)) {
                startDate.setHours(currentRange.from);
                let startHour: Date = new Date(startDate.getTime());
                let tempDate: Date = currentRange.to !== 0 ? startDate : endDate;
                tempDate.setHours(currentRange.to);
                let endHour: Date = new Date(tempDate.getTime());
                let timeDiff: number = endHour.getTime() - startHour.getTime();
                let sdSeconds: number = this.getSecondsInDecimal(startHour);
                let edSeconds: number = this.getSecondsInDecimal(endHour);
                if (edSeconds === 0) {
                    edSeconds = 86400;
                }
                totalSeconds += timeDiff / 1000;
                if (count === 0) {
                    this.parent.defaultStartTime = sdSeconds;
                }
                if (count === length - 1) {
                    this.parent.defaultEndTime = edSeconds;
                }
                if (count > 0) {
                    nonWorkingHours.push(nonWorkingHours[nonWorkingHours.length - 1] +
                        sdSeconds - workingTimeRanges[count - 1].to);
                    if (workingTimeRanges[count - 1].to < sdSeconds) {
                        nonWorkingTimeRanges.push({
                            from: workingTimeRanges[count - 1].to, to: sdSeconds, isWorking: false,
                            interval: (sdSeconds - workingTimeRanges[count - 1].to)
                        });
                    }
                } else {
                    nonWorkingHours.push(0);
                    nonWorkingTimeRanges.push({ from: 0, to: sdSeconds, isWorking: false, interval: sdSeconds });
                }
                workingTimeRanges.push({ from: sdSeconds, to: edSeconds });
                nonWorkingTimeRanges.push({
                    from: sdSeconds, to: edSeconds, isWorking: true, interval: (edSeconds - sdSeconds)
                });
            }
        }
        if (this.parent.defaultEndTime / 3600 !== 24) {
            nonWorkingTimeRanges.push({
                from: this.parent.defaultEndTime, to: 86400,
                isWorking: false, interval: 86400 - this.parent.defaultEndTime
            });
        }
        return totalSeconds;
    }
    /**
     * 
     * @param value 
     * @param isFromDialog 
     * @private
     */
    public getDurationValue(value: string | number, isFromDialog?: boolean): Object {
        let durationUnit: string = null;
        let duration: number = null;

        if (typeof value === 'string') {
            let values: Object[] = value.match(/(\d*\.*\d+|.+$)/g);
            if (values && values.length <= 2) {
                duration = parseFloat(values[0].toString().trim());
                let unit: string = values[1] ? values[1].toString().trim().toLowerCase() : null;
                if (getValue('minute', this.parent.durationUnitEditText).indexOf(unit) !== -1) {
                    durationUnit = 'minute';
                } else if (getValue('hour', this.parent.durationUnitEditText).indexOf(unit) !== -1) {
                    durationUnit = 'hour';
                } else if (getValue('day', this.parent.durationUnitEditText).indexOf(unit) !== -1) {
                    durationUnit = 'day';
                }
            }
        } else {
            duration = value;
            durationUnit = null;
        }
        let output: Object = {
            duration: duration,
            durationUnit: durationUnit
        };
        return output;
    }
    /**
     * 
     * @param date 
     */
    protected getNextWorkingDay(date: Date): Date {
        let dayIndex: number = date.getDay();
        if (this.parent.nonWorkingDayIndex.indexOf(dayIndex) !== -1) {
            date.setDate(date.getDate() + 1);
            date = this.getNextWorkingDay(date);
            return date;
        } else {
            return date;
        }
    }
    /**
     * get weekend days between two dates without including args dates
     * @param startDate 
     * @param endDate 
     */
    protected getWeekendCount(startDate: Date, endDate: Date): number {
        let weekendCount: number = 0;
        let sDate: Date = new Date(startDate.getTime()); let eDate: Date = new Date(endDate.getTime());
        sDate.setHours(0, 0, 0, 0);
        sDate.setDate(sDate.getDate() + 1);
        eDate.setHours(0, 0, 0, 0);
        while (sDate.getTime() < eDate.getTime()) {
            if (this.parent.nonWorkingDayIndex.indexOf(sDate.getDay()) !== -1) {
                weekendCount += 1;
            }
            sDate.setDate(sDate.getDate() + 1);
        }
        return weekendCount;
    }
    /**
     * 
     * @param startDate 
     * @param endDate 
     * @param isCheckTimeZone 
     */
    protected getNumberOfSeconds(startDate: Date, endDate: Date, isCheckTimeZone: boolean): number {
        let sDate: Date = new Date(startDate.getTime()); let eDate: Date = new Date(endDate.getTime());
        let weekendCount: number = 0; let timeDiff: number = 0;
        sDate.setDate(sDate.getDate() + 1);
        sDate.setHours(0, 0, 0, 0);
        eDate.setHours(0, 0, 0, 0);
        if (sDate.getTime() < eDate.getTime()) {
            timeDiff = (this.getTimeDifference(sDate, eDate, isCheckTimeZone)) / 1000;
        }
        if (timeDiff % 86400 !== 0) {
            timeDiff = timeDiff - (timeDiff % 86400) + 86400;
        }
        return timeDiff;
    }
    /**
     * 
     * @param startDate 
     * @param endDate 
     */
    protected getHolidaysCount(startDate: Date, endDate: Date): number {
        let holidaysCount: number = 0;
        let holidays: number[] = this.parent.totalHolidayDates;
        let sDate: Date = new Date(startDate.getTime());
        let eDate: Date = new Date(endDate.getTime());
        sDate.setDate(sDate.getDate() + 1);
        sDate.setHours(0, 0, 0, 0);
        eDate.setHours(0, 0, 0, 0);
        if (sDate.getTime() < eDate.getTime()) {
            for (let i: number = 0; i < holidays.length; i++) {
                let currentHoliday: Date = this.getDateFromFormat(new Date(holidays[i]));
                if (sDate.getTime() <= currentHoliday.getTime() && eDate.getTime() >= currentHoliday.getTime()) {
                    if (!this.parent.includeWeekend && this.parent.nonWorkingDayIndex.indexOf(currentHoliday.getDay()) === -1) {
                        holidaysCount += 1;
                    } else if (this.parent.includeWeekend) {
                        holidaysCount += 1;
                    }
                }
            }
        }
        return holidaysCount;
    }
    /**
     * @private
     */
    public getHolidayDates(): number[] {
        let holidays: HolidayModel[] = this.parent.holidays;
        let holidayDates: number[] = [];
        for (let i: number = 0; i < holidays.length; i++) {
            let from: Date = this.getDateFromFormat(holidays[i].from);
            let to: Date = this.getDateFromFormat(holidays[i].to);
            if (isNullOrUndefined(from) && isNullOrUndefined(to)) {
                continue;
            } else if (isNullOrUndefined(from) || isNullOrUndefined(to)) {
                let tempDate: Date = from ? from : to;
                tempDate.setHours(0, 0, 0, 0);
                if (holidayDates.indexOf(tempDate.getTime()) === -1) {
                    holidayDates.push(tempDate.getTime());
                }
            } else {
                while (from <= to) {
                    from.setHours(0, 0, 0, 0);
                    if (holidayDates.indexOf(from.getTime()) === -1) {
                        holidayDates.push(from.getTime());
                    }
                    from.setDate(from.getDate() + 1);
                }
            }
        }
        return holidayDates;
    }

    /*Check given date is on holidays*/
    private isOnHolidayOrWeekEnd(date: Date, checkWeekEnd: boolean): boolean {
        checkWeekEnd = !isNullOrUndefined(checkWeekEnd) ? checkWeekEnd : this.parent.includeWeekend;
        if (!checkWeekEnd && this.parent.nonWorkingDayIndex.indexOf(date.getDay()) !== -1) {
            return true;
        }
        let holidays: number[] = this.parent.totalHolidayDates;
        for (let count: number = 0; count < holidays.length; count++) {
            let holidayFrom: Date = this.getDateFromFormat(new Date(holidays[count]));
            let holidayTo: Date = new Date(holidayFrom.getTime());
            holidayFrom.setHours(0, 0, 0, 0);
            holidayTo.setHours(23, 59, 59, 59);
            if (date.getTime() >= holidayFrom.getTime() && date.getTime() < holidayTo.getTime()) {
                return true;
            }
        }
        return false;
    }
    /**
     * To calculate non working times in given date
     * @param startDate 
     * @param endDate 
     */
    protected getNonWorkingSecondsOnDate(startDate: Date, endDate: Date): number {
        let sHour: number = this.getSecondsInDecimal(startDate);
        let eHour: number = this.getSecondsInDecimal(endDate);
        let startRangeIndex: number = -1;
        let endRangeIndex: number = -1;
        let totNonWrkSecs: number = 0;
        let startOnHoliday: boolean = this.isOnHolidayOrWeekEnd(startDate, null);
        let endOnHoliday: boolean = this.isOnHolidayOrWeekEnd(endDate, null);

        for (let i: number = 0; i < this.parent.nonWorkingTimeRanges.length; i++) {
            let val: IWorkingTimeRange = this.parent.nonWorkingTimeRanges[i];
            if (sHour >= val.from && sHour <= val.to) {
                startRangeIndex = i;
            }
            if (eHour >= val.from && eHour <= val.to) {
                endRangeIndex = i;
            }
        }
        if (startDate.getDate() !== endDate.getDate() || startDate.getMonth() !== endDate.getMonth() ||
            startDate.getFullYear() !== endDate.getFullYear()) {
            if (!startOnHoliday) {
                for (let i: number = startRangeIndex; i < this.parent.nonWorkingTimeRanges.length; i++) {
                    if (!this.parent.nonWorkingTimeRanges[i].isWorking) {
                        if (i === startRangeIndex) {
                            totNonWrkSecs += (this.parent.nonWorkingTimeRanges[i].to - sHour);
                        } else {
                            totNonWrkSecs += (this.parent.nonWorkingTimeRanges[i].interval);
                        }
                    }
                }
            } else {
                totNonWrkSecs += (86400 - sHour);
            }
            if (!endOnHoliday) {
                for (let i: number = 0; i <= endRangeIndex; i++) {
                    if (!this.parent.nonWorkingTimeRanges[i].isWorking) {
                        if (i === endRangeIndex) {
                            totNonWrkSecs += (eHour - this.parent.nonWorkingTimeRanges[i].from);
                        } else {
                            totNonWrkSecs += this.parent.nonWorkingTimeRanges[i].interval;
                        }
                    }
                }
            } else {
                totNonWrkSecs += eHour;
            }
        } else {
            if (startRangeIndex !== endRangeIndex) {
                if (!endOnHoliday) {
                    for (let i: number = startRangeIndex; i <= endRangeIndex; i++) {
                        if (!this.parent.nonWorkingTimeRanges[i].isWorking) {
                            if (i === startRangeIndex) {
                                totNonWrkSecs += (this.parent.nonWorkingTimeRanges[i].to - sHour);
                            } else if (i === endRangeIndex) {
                                totNonWrkSecs += (eHour - this.parent.nonWorkingTimeRanges[i].from);
                            } else {
                                totNonWrkSecs += this.parent.nonWorkingTimeRanges[i].interval;
                            }
                        }
                    }
                } else {
                    totNonWrkSecs += (eHour - sHour);
                }
            } else {
                if (!endOnHoliday) {
                    let range: IWorkingTimeRange = this.parent.nonWorkingTimeRanges[startRangeIndex];
                    if (!range.isWorking) {
                        totNonWrkSecs = eHour - sHour;
                    }
                } else {
                    totNonWrkSecs += (eHour - sHour);
                }
            }
        }
        return totNonWrkSecs;
    }
    /**
     * 
     * @param date 
     */
    protected getPreviousWorkingDay(date: Date): Date {
        let dayIndex: number = date.getDay();
        let previousIndex: number = (dayIndex === 0) ? 6 : dayIndex - 1;
        if (this.parent.nonWorkingDayIndex.indexOf(dayIndex) !== -1 || (this.parent.nonWorkingDayIndex.indexOf(previousIndex) !== -1
            && this.parent.defaultEndTime === 86400 && this.getSecondsInDecimal(date) === 0)) {
            date.setDate(date.getDate() - 1);
            if (this.parent.nonWorkingDayIndex.indexOf(date.getDay()) !== -1) {
                date = this.getPreviousWorkingDay(date);
            }
            return date;
        } else {
            return date;
        }
    }
    /**
     * To get non-working day indexes.
     * @return {void}
     * @private
     */
    public getNonWorkingDayIndex(): void {
        let weekDay: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let weekDayLength: number = weekDay.length;
        if (this.parent.workWeek.length === 0) {
            this.parent.workWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        }
        let workWeek: string[] = this.parent.workWeek.slice();
        let length: number = workWeek.length;
        for (let i: number = 0; i < length; i++) {
            workWeek[i] = workWeek[i].toLowerCase();
        }
        this.parent.nonWorkingDayIndex = [];
        for (let i: number = 0; i < weekDayLength; i++) {
            if (workWeek.indexOf(weekDay[i]) === -1) {
                this.parent.nonWorkingDayIndex.push(i);
            }
        }
    }
    /**
     * 
     * @param seconds 
     * @param date 
     * @private
     */
    public setTime(seconds: number, date: Date): void {
        let hour: number = seconds / 3600;
        let min: number = (seconds - (hour * 3600)) / 60;
        let sec: number = seconds - (hour * 3600) - (min * 60);
        date.setHours(hour, min, sec);
    }
    /**
     * 
     */
    protected getTimeDifference(startDate: Date, endDate: Date, isCheckTimeZone?: boolean): number {
        let sDate: Date = new Date(startDate.getTime()); let eDate: Date = new Date(endDate.getTime());
        if (isCheckTimeZone) {
            this.updateDateWithTimeZone(sDate, eDate);
        }
        return eDate.getTime() - sDate.getTime();
    }
    /**
     * 
     */
    protected updateDateWithTimeZone(sDate: Date, eDate: Date): void {
        let sTZ: number = sDate.getTimezoneOffset();
        let eTZ: number = eDate.getTimezoneOffset();
        let uTZ: number; let uDate: Date;
        if (sTZ !== eTZ) {
            let standardTZ: number = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
            if (standardTZ !== sTZ) {
                uDate = sDate;
                uTZ = sTZ;
            } else if (standardTZ !== eTZ) {
                uDate = eDate;
                uTZ = eTZ;
            }
            if (standardTZ < 0) {
                let tzDiff: number = standardTZ - uTZ;
                uDate.setTime(uDate.getTime() + (tzDiff * 60 * 1000));
            } else if (standardTZ > 0) {
                let tzDiff: number = uTZ - standardTZ;
                uDate.setTime(uDate.getTime() - (tzDiff * 60 * 1000));
            }
        }
    }
    /**
     * 
     * @param date 
     */
    protected getSecondsInDecimal(date: Date): number {
        return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds() + (date.getMilliseconds() / 1000);
    }
    /**
     * @param date 
     * @private
     */
    public getDateFromFormat(date: string | Date): Date {
        if (isNullOrUndefined(date)) {
            return null;
        } else if (date instanceof Date) {
            return new Date(date.getTime());
        } else {
            let dateObject: Date = this.parent.globalize.parseDate(date, { format: this.parent.dateFormat, type: 'dateTime' });
            return isNullOrUndefined(dateObject) ? new Date(date) : dateObject;
        }
    }
    /**
     * @private
     */
    public compareDates(date1: Date, date2: Date): number {
        if (!isNullOrUndefined(date1) && !isNullOrUndefined(date2)) {
            return (date1.getTime() > date2.getTime()) ? 1 : (date1.getTime() < date2.getTime()) ? -1 : 0;
        } else if (!isNullOrUndefined(date1) && isNullOrUndefined(date2)) {
            return 1;
        } else if (isNullOrUndefined(date1) && !isNullOrUndefined(date2)) {
            return -1;
        } else {
            return null;
        }
    }
    /**
     * 
     * @param duration 
     * @param durationUnit 
     * @private
     */
    public getDurationString(duration: number, durationUnit: string): string {
        let value: string = '';
        if (!isNullOrUndefined(duration)) {
            value += parseFloat(duration.toFixed(2)) + ' ';
            if (!isNullOrUndefined(durationUnit)) {
                let plural: boolean = duration !== 1;
                if (durationUnit === 'day') {
                    value += plural ? this.parent.localeObj.getConstant('days') : this.parent.localeObj.getConstant('day');
                } else if (durationUnit === 'hour') {
                    value += plural ? this.parent.localeObj.getConstant('hours') : this.parent.localeObj.getConstant('hour');
                } else if (durationUnit === 'minute') {
                    value += plural ? this.parent.localeObj.getConstant('minutes') :
                        this.parent.localeObj.getConstant('minute');
                }
            }
        }
        return value;
    }
    /**
     * 
     * @param editArgs 
     * @private
     */
    public calculateProjectDates(editArgs?: Object): void {
        let projectStartDate: Date = this.parent.timelineModule.isZooming && this.parent.cloneProjectStartDate
            ? this.getDateFromFormat(this.parent.cloneProjectStartDate) : this.getDateFromFormat(this.parent.projectStartDate);
        let projectEndDate: Date = this.parent.timelineModule.isZooming && this.parent.cloneProjectEndDate
            ? this.getDateFromFormat(this.parent.cloneProjectEndDate) : this.getDateFromFormat(this.parent.projectEndDate);
        let minStartDate: Date = null; let maxEndDate: Date = null;
        let flatData: IGanttData[] = this.parent.flatData;
        if (((!projectStartDate || !projectEndDate) && flatData.length > 0) || editArgs || this.parent.timelineModule.isZoomToFit) {
            flatData.forEach((data: IGanttData, index: number) => {
                let task: ITaskData = data.ganttProperties;
                let tempStartDate: Date = this.getValidStartDate(task);
                let tempEndDate: Date = this.getValidEndDate(task);
                let baselineStartDate: Date = this.parent.timelineModule.isZoomToFit ? null
                : task.baselineStartDate ? new Date(task.baselineStartDate.getTime()) : null;
                let baselineEndDate: Date = this.parent.timelineModule.isZoomToFit ? null
                : task.baselineEndDate ? new Date(task.baselineEndDate.getTime()) : null;
                if (minStartDate) {
                    if (tempStartDate && this.compareDates(minStartDate, tempStartDate) === 1) {
                        minStartDate = tempStartDate;
                    }
                    if (baselineStartDate && this.parent.renderBaseline && this.compareDates(minStartDate, baselineStartDate) === 1) {
                        minStartDate = baselineStartDate;
                    } else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(minStartDate, baselineEndDate) === 1) {
                        minStartDate = baselineEndDate;
                    }
                } else {
                    if (baselineStartDate && this.parent.renderBaseline && this.compareDates(tempStartDate, baselineStartDate) === 1) {
                        minStartDate = baselineStartDate;
                    } else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(tempStartDate, baselineEndDate) === 1) {
                        minStartDate = baselineEndDate;
                    } else {
                        minStartDate = tempStartDate;
                    }

                }
                if (maxEndDate) {
                    if (tempEndDate && this.compareDates(maxEndDate, tempEndDate) === -1) {
                        maxEndDate = tempEndDate;
                    }
                    if (baselineEndDate && this.parent.renderBaseline && this.compareDates(maxEndDate, baselineEndDate) === -1) {
                        maxEndDate = baselineEndDate;
                    } else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(maxEndDate, baselineStartDate) === -1) {
                        maxEndDate = baselineStartDate;
                    }
                } else {
                    if (baselineEndDate && this.parent.renderBaseline && this.compareDates(tempEndDate, baselineEndDate) === -1) {
                        maxEndDate = baselineStartDate;
                    } else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(tempEndDate, baselineStartDate) === -1) {
                        maxEndDate = baselineEndDate;
                    } else {
                        maxEndDate = tempEndDate;
                    }
                }
            });
            if (!minStartDate || !maxEndDate) {
                minStartDate = this.getDateFromFormat(new Date());
                maxEndDate = this.getDateFromFormat(new Date(minStartDate.getTime()));
                maxEndDate.setDate(maxEndDate.getDate() + 20);
            }
            //update schedule dates as per holiday and strip line collection         
            this.updateProjectDatesByEventMarker(minStartDate, maxEndDate);
            this.updateProjectDatesByHolidays(minStartDate, maxEndDate);
        } else if ((!projectStartDate || !projectEndDate) && flatData.length === 0) {
            minStartDate = this.getDateFromFormat(new Date());
            maxEndDate = this.getDateFromFormat(new Date(minStartDate.getTime()));
        }

        if (!editArgs) {
            this.parent.cloneProjectStartDate = minStartDate ? minStartDate : new Date(projectStartDate.getTime());
            this.parent.cloneProjectEndDate = maxEndDate ? maxEndDate : new Date(projectEndDate.getTime());
        } else {
            setValue('minStartDate', minStartDate, editArgs);
            setValue('maxEndDate', maxEndDate, editArgs);
        }
    }
    /**
     * 
     * @param startDate 
     * @param endDate 
     */
    private updateProjectDatesByEventMarker(startDate: Date, endDate: Date): void {
        let eventMarker: EventMarkerModel[] = this.parent.eventMarkers;
        if (eventMarker && eventMarker.length > 0) {
            for (let index: number = 0; index < eventMarker.length; index++) {
                let day: Date = this.getDateFromFormat(eventMarker[index].day);
                if (!(day.getTime() > startDate.getTime()) || !(day.getTime() < endDate.getTime())) {
                    if (day.getTime() < startDate.getTime()) {
                        startDate = new Date(day.getTime());
                    } else {
                        endDate = new Date(day.getTime());
                    }
                }
            }
        }
    }
    private updateProjectDatesByHolidays(startDate: Date, endDate: Date): void {
        let holidayList: number[] = this.parent.totalHolidayDates;
        if (holidayList && holidayList.length > 0) {
            for (let i: number = 0; i < holidayList.length; i++) {
                let holiday: Date = this.getDateFromFormat(new Date(holidayList[i]));
                if (!(holiday.getTime() > startDate.getTime()) || !(holiday.getTime() < endDate.getTime())) {
                    if (holiday.getTime() < startDate.getTime()) {
                        startDate = new Date(holiday.getTime());
                    } else {
                        endDate = new Date(holiday.getTime());
                    }
                }
            }
        }
    }
}
