import { isNullOrUndefined, getValue, setValue } from '@syncfusion/ej2-base';
import { IGanttData, IWorkingTimeRange, ITaskData, IIndicator, ITaskSegment } from './interface';
import { HolidayModel, DayWorkingTimeModel, EventMarkerModel, TaskFieldsModel } from '../models/models';
import { ColumnModel as GanttColumnModel } from '../models/column';
import { TextBox } from '@syncfusion/ej2-inputs';
interface EJ2Instance extends HTMLElement {

    // eslint-disable-next-line
    ej2_instances: Object[];
}
import { Gantt } from './gantt';
import { WeekWorkingTimeModel } from '../models/week-working-time-model';

/**
 *  Date processor is used to handle date of task data.
 */
export class DateProcessor {
    protected parent: Gantt;
    private prevProjectStartDate: Date;
    private fromSegments: boolean = false;
    private mondayTimeRangeLength: number = 0;
    private tuesdayTimeRangeLength: number = 0;
    private wednesdayTimeRangeLength: number = 0;
    private thursdayTimeRangeLength: number = 0;
    private fridayTimeRangeLength: number = 0;
    private saturdayTimeRangeLength: number = 0;
    private sundayTimeRangeLength: number = 0;
    constructor(parent: Gantt) {
        this.parent = parent;
    }
    /**
     * @param {ITaskData} ganttProp .
     * @returns {boolean} .
     */
    private isValidateNonWorkDays(ganttProp: ITaskData): boolean {
        return (!isNullOrUndefined(ganttProp) && ganttProp.isAutoSchedule &&
            (!this.parent.includeWeekend || this.parent.totalHolidayDates.length > 0)) ||
            (isNullOrUndefined(ganttProp) && (!this.parent.includeWeekend || this.parent.totalHolidayDates.length > 0));
    }
    /**
     * Method to convert given date value as valid start date
     *
     * @param {Date} date .
     * @param {ITaskData} ganttProp .
     * @param {boolean} validateAsMilestone .
     * @param {boolean} isLoad .
     * @returns {Date} .
     * @private
     */
    public checkStartDate(date: Date, ganttProp?: ITaskData, validateAsMilestone?: boolean, isLoad?: boolean): Date {
        if (isNullOrUndefined(date)) {
            return null;
        }
        const currentDay: Date = new Date(date.getTime());
        let dayStartTime: number = this.parent['getCurrentDayStartTime'](currentDay);
        let dayEndTime: number = this.parent['getCurrentDayEndTime'](currentDay);
        let cloneStartDate: Date = new Date(date.getTime()); const hour: number = this.getSecondsInDecimal(cloneStartDate);
        validateAsMilestone = isNullOrUndefined(validateAsMilestone) ? !isNullOrUndefined(ganttProp) ?
            ganttProp.isMilestone : false : validateAsMilestone;
        if (hour < dayStartTime && (!validateAsMilestone || isLoad)) {
            this.setTime(dayStartTime, cloneStartDate);
        } else if (hour < dayStartTime && validateAsMilestone) {
            this.setTime(dayStartTime, cloneStartDate);
        } else if ((hour === dayEndTime && (!ganttProp || !validateAsMilestone)) || hour > dayEndTime) {
            cloneStartDate.setDate(cloneStartDate.getDate() + 1);
            dayStartTime = this.parent['getCurrentDayStartTime'](cloneStartDate);
            this.setTime(dayStartTime, cloneStartDate);
        } else if (hour > dayStartTime && hour < dayEndTime) {
            let workingRange: IWorkingTimeRange[] = this.parent.workingTimeRanges;
            if (this.parent.weekWorkingTime.length > 0) {
                workingRange = this.parent['getWorkingRange'](cloneStartDate);
            }
            for (let index: number = 0; index < workingRange.length; index++) {
                const value: IWorkingTimeRange = workingRange[index as number];
                if (hour >= value.to && (workingRange[index + 1] &&
                    hour < workingRange[index + 1].from)) {
                    // milestone can fall at end any interval time
                    if ((hour === value.to && (!ganttProp || !validateAsMilestone)) || hour !== value.to) {
                        this.setTime(workingRange[index + 1].from, cloneStartDate);
                    }
                    break;
                }
            }
        }
        let tStartDate: Date;
        if (this.parent.autoCalculateDateScheduling) {
            do {
                tStartDate = new Date(cloneStartDate.getTime());
                const holidayLength: number = this.parent.totalHolidayDates.length;
                // check holidays and weekends
                if (this.isValidateNonWorkDays(ganttProp)) {
                    dayStartTime = this.parent['getCurrentDayStartTime'](tStartDate);
                    if (ganttProp) {
                        dayEndTime = this.parent['getCurrentDayEndTime'](ganttProp.endDate ? ganttProp.isAutoSchedule ? ganttProp.endDate : ganttProp.autoEndDate : tStartDate);
                    }
                    let startTime: number = (!validateAsMilestone || isLoad) ? dayStartTime : dayEndTime;
                    if (!this.parent.includeWeekend) {
                        const tempDate: Date = new Date(cloneStartDate.getTime());
                        cloneStartDate = this.getNextWorkingDay(cloneStartDate);
                        startTime = this.parent['getCurrentDayStartTime'](cloneStartDate);
                        if (tempDate.getTime() !== cloneStartDate.getTime() && !validateAsMilestone) {
                            this.setTime(startTime, cloneStartDate);
                        }
                    }
                    for (let count: number = 0; count < holidayLength; count++) {
                        const holidayFrom: Date = this.getDateFromFormat(new Date(this.parent.totalHolidayDates[count as number]));
                        const holidayTo: Date = new Date(holidayFrom.getTime());
                        holidayFrom.setHours(0, 0, 0, 0);
                        holidayTo.setHours(23, 59, 59, 59);
                        if (cloneStartDate.getTime() >= holidayFrom.getTime() && cloneStartDate.getTime() < holidayTo.getTime()) {
                            cloneStartDate.setDate(cloneStartDate.getDate() + 1);
                            startTime = this.parent['getCurrentDayStartTime'](cloneStartDate);
                            this.setTime(startTime, cloneStartDate);
                        }
                    }
                }
            } while (tStartDate.getTime() !== cloneStartDate.getTime());
            return new Date(cloneStartDate.getTime());
        } else {
            return new Date(cloneStartDate.getTime());
        }
    }
    /**
     * To update given date value to valid end date
     *
     * @param {Date} date .
     * @param {ITaskData} ganttProp .
     * @param {boolean} validateAsMilestone .
     * @returns {Date} .
     * @private
     */
    public checkEndDate(date: Date, ganttProp?: ITaskData, validateAsMilestone?: boolean): Date {
        if (isNullOrUndefined(date)) {
            return null;
        }
        let dayStartTime: number;
        let dayEndTime: number;
        if (this.parent.weekWorkingTime.length > 0) {
            let currentDay: Date = date;
            if (!this.parent.includeWeekend && ganttProp && ganttProp.isAutoSchedule || (this.parent.editModule
                && this.parent.editModule.taskbarEditModule && this.parent.editModule.taskbarEditModule.taskBarEditRecord
                && !this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.isAutoSchedule)) {
                currentDay = this.getNextWorkingDay(date);
            }
            dayStartTime = this.parent['getStartTime'](currentDay);
            dayEndTime = this.parent['getEndTime'](currentDay);
        }
        else {
            dayStartTime = this.parent.defaultStartTime;
            dayEndTime = this.parent.defaultEndTime;
        }
        let cloneEndDate: Date = new Date(date.getTime());
        const hour: number = this.getSecondsInDecimal(cloneEndDate);
        if (hour > dayEndTime) {
            this.setTime(dayEndTime, cloneEndDate);
        } else if (hour <= dayStartTime && !validateAsMilestone) {
            const taskfields: TaskFieldsModel = this.parent.taskFields;
            if (this.parent.editModule && this.parent.editModule['editedRecord'] && (!this.parent.editModule['editedRecord'][taskfields.startDate] && this.parent.editModule['editedRecord'][taskfields.endDate])) {
                cloneEndDate.setDate(cloneEndDate.getDate());
            }
            else {
                cloneEndDate.setDate(cloneEndDate.getDate() - 1);
            }
            dayEndTime = this.parent['getCurrentDayEndTime'](cloneEndDate);
            this.setTime(dayEndTime, cloneEndDate);
        } else if (hour > dayStartTime && hour < dayEndTime) {
            for (let index: number = 0; index < this.parent.workingTimeRanges.length; index++) {
                const value: IWorkingTimeRange = this.parent.workingTimeRanges[index as number];
                if (hour > value.to && (this.parent.workingTimeRanges[index + 1] &&
                    hour <= this.parent.workingTimeRanges[index + 1].from)) {
                    this.setTime(this.parent.workingTimeRanges[index as number].to, cloneEndDate);
                    break;
                }
            }
        }
        let tempCheckDate: Date;
        if (this.parent.autoCalculateDateScheduling) {
            do {
                tempCheckDate = new Date(cloneEndDate.getTime());
                const holidayLength: number = this.parent.totalHolidayDates.length;
                if (this.isValidateNonWorkDays(ganttProp)) {
                    if (!this.parent.includeWeekend) {
                        const tempDate: Date = new Date(cloneEndDate.getTime());
                        cloneEndDate = this.getPreviousWorkingDay(cloneEndDate);
                        dayEndTime = this.parent['getCurrentDayEndTime'](cloneEndDate);
                        if (tempDate.getTime() !== cloneEndDate.getTime()) {
                            this.setTime(dayEndTime, cloneEndDate);
                        }
                    }
                    for (let count: number = 0; count < holidayLength; count++) {
                        const holidayFrom: Date = this.getDateFromFormat(new Date(this.parent.totalHolidayDates[count as number]));
                        const holidayTo: Date = new Date(holidayFrom.getTime());
                        const tempHoliday: Date = new Date(cloneEndDate.getTime());
                        tempHoliday.setMinutes(cloneEndDate.getMilliseconds() - 2);
                        holidayFrom.setHours(0, 0, 0, 0);
                        holidayTo.setHours(23, 59, 59, 59);
                        if (cloneEndDate.getTime() >= holidayFrom.getTime() && cloneEndDate.getTime() < holidayTo.getTime() ||
                            tempHoliday.getTime() >= holidayFrom.getTime() && tempHoliday.getTime() < holidayTo.getTime()) {
                            cloneEndDate.setDate(cloneEndDate.getDate() - 1);
                            dayEndTime = this.parent['getCurrentDayEndTime'](cloneEndDate);
                            if (!(cloneEndDate.getTime() === holidayFrom.getTime() && dayEndTime === 86400 &&
                                this.getSecondsInDecimal(cloneEndDate) === 0)) {
                                this.setTime(dayEndTime, cloneEndDate);
                            }
                        }
                    }
                }
            } while (tempCheckDate.getTime() !== cloneEndDate.getTime());
            return new Date(cloneEndDate.getTime());
        } else {
            if (!isNullOrUndefined(cloneEndDate)) {
                dayEndTime = this.parent['getCurrentDayEndTime'](date);
                this.setTime(dayEndTime, cloneEndDate);
            }
            return new Date(cloneEndDate.getTime());
        }
    }
    /**
     * To validate the baseline start date
     *
     * @param {Date} date .
     * @param {ITaskData} ganttProp .
     * @returns {Date} .
     * @private
     */
    public checkBaselineStartDate(date: Date, ganttProp?: ITaskData): Date {
        if (isNullOrUndefined(date)) {
            return null;
        } else {
            let dayStartTime: number = this.parent['getCurrentDayStartTime'](date);
            const dayEndTime: number = this.parent['getCurrentDayEndTime'](ganttProp ? ganttProp.endDate ? ganttProp.isAutoSchedule ? ganttProp.endDate : ganttProp.autoEndDate : date : date);
            const cloneDate: Date = new Date(date.getTime()); const hour: number = this.getSecondsInDecimal(cloneDate);
            if (hour < dayStartTime) {
                this.setTime(dayStartTime, cloneDate);
            } else if (hour > dayEndTime) {
                cloneDate.setDate(cloneDate.getDate() + 1);
                if (this.parent.weekWorkingTime.length > 0) {
                    dayStartTime = this.parent['getStartTime'](cloneDate);
                }
                else {
                    dayStartTime = this.parent.defaultStartTime;
                }
                this.setTime(dayStartTime, cloneDate);
            } else if (hour > dayStartTime && hour < dayEndTime) {
                for (let i: number = 0; i < this.parent.workingTimeRanges.length; i++) {
                    const value: IWorkingTimeRange = this.parent.workingTimeRanges[i as number];
                    if (hour > value.to && (this.parent.workingTimeRanges[i + 1] &&
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
     *
     * @param {Date} date .
     * @param {ITaskData} ganttProp .
     * @returns {Date} .
     * @private
     */
    public checkBaselineEndDate(date: Date, ganttProp?: ITaskData): Date {
        if (isNullOrUndefined(date)) {
            return null;
        } else {
            let dayEndTime: number = this.parent['getCurrentDayEndTime'](date);
            const dayStartTime: number = this.parent['getCurrentDayStartTime'](ganttProp ? ganttProp.startDate ? ganttProp.isAutoSchedule ? ganttProp.startDate : ganttProp.autoStartDate : date : date);
            const cloneDate: Date = new Date(date.getTime()); const hour: number = this.getSecondsInDecimal(cloneDate);
            if (hour > dayEndTime) {
                this.setTime(dayEndTime, cloneDate);
            } else if (hour < dayStartTime && !isNullOrUndefined(ganttProp) && !ganttProp.isMilestone) {
                cloneDate.setDate(cloneDate.getDate() - 1);
                dayEndTime = this.parent['getCurrentDayEndTime'](cloneDate);
                this.setTime(dayEndTime, cloneDate);
            } else if (hour > dayStartTime && hour < dayEndTime) {
                for (let i: number = 0; i < this.parent.workingTimeRanges.length; i++) {
                    const value: IWorkingTimeRange = this.parent.workingTimeRanges[i as number];
                    if (hour > value.to && (this.parent.workingTimeRanges[i + 1] && hour <= this.parent.workingTimeRanges[i + 1].from)) {
                        this.setTime(this.parent.workingTimeRanges[i as number].to, cloneDate);
                        break;
                    }
                }
            }
            if (ganttProp && ganttProp.baselineStartDate && cloneDate &&
                ganttProp.baselineStartDate.getTime() > cloneDate.getTime()) {
                cloneDate.setDate(cloneDate.getDate() + 1);
            }
            return cloneDate;
        }
    }
    /**
     * To calculate start date value from duration and end date
     *
     * @param {IGanttData} ganttData - Defines the gantt data.
     * @returns {void} .
     * @private
     */
    public calculateStartDate(ganttData: IGanttData): void {
        const ganttProp: ITaskData = ganttData.ganttProperties;
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
     * @param {IGanttData} ganttData - Defines the gantt data.
     * @returns {void} .
     * @private
     */
    public calculateEndDate(ganttData: IGanttData): void {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        let tempEndDate: Date = null;
        let dayStartTime: number;
        let dayEndTime: number;
        if (!isNullOrUndefined(ganttProp.startDate)) {
            if (!isNullOrUndefined(ganttProp.endDate) && isNullOrUndefined(ganttProp.duration)) {
                if (this.compareDates(ganttProp.startDate, ganttProp.endDate) === 1) {
                    this.parent.setRecordValue('startDate', new Date(ganttProp.endDate.getTime()), ganttProp, true);
                    dayStartTime = this.parent['getCurrentDayStartTime'](ganttProp.isAutoSchedule ? ganttProp.autoStartDate : ganttProp.startDate);
                    dayEndTime = this.parent['getCurrentDayEndTime'](ganttProp.isAutoSchedule ? ganttProp.autoEndDate : ganttProp.endDate);
                    this.setTime(dayStartTime, ganttProp.startDate);
                }
                this.calculateDuration(ganttData);
            }
            if (!isNullOrUndefined(ganttProp.duration)) {
                const duration: number = !isNullOrUndefined(ganttProp.segments) && ganttProp.segments.length > 1 ?
                    this.totalDuration(ganttProp.segments) : ganttProp.duration;
                tempEndDate = this.getEndDate(ganttProp.startDate, duration, ganttProp.durationUnit, ganttProp, false);
            }
            this.parent.setRecordValue('endDate', tempEndDate, ganttProp, true);
        } else {
            tempEndDate = ganttData[this.parent.taskFields.endDate];
            if (!isNullOrUndefined(tempEndDate)) {
                dayEndTime = this.parent['getCurrentDayEndTime'](tempEndDate);
                this.setTime(dayEndTime, tempEndDate);
            }
            this.parent.setRecordValue('endDate', tempEndDate, ganttProp, true);
        }
        if (this.parent.taskFields.endDate) {
            this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
        }
    }

    public totalDuration(segments: ITaskSegment[]): number {
        let duration: number = 0;
        for (let i: number = 0; i < segments.length; i++) {
            duration += segments[i as number].duration + segments[i as number].offsetDuration;
        }
        return duration;
    }
    /**
     * To calculate duration from start date and end date
     *
     * @param {IGanttData} ganttData - Defines the gantt data.
     * @returns {void} .
     */
    public calculateDuration(ganttData: IGanttData): void {
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        let tDuration: number;
        if (!isNullOrUndefined(ganttProperties.segments) && ganttProperties.segments.length > 0 &&
            !isNullOrUndefined(this.parent.editModule.taskbarEditModule)) {
            tDuration = this.parent.editModule.taskbarEditModule.sumOfDuration(ganttProperties.segments);
        } else {
            if ((!isNullOrUndefined(this.parent.taskFields.milestone)) && (!isNullOrUndefined(ganttProperties.startDate))
            && !isNullOrUndefined(ganttProperties.endDate) &&
                (ganttProperties.startDate).getTime() === (ganttProperties.endDate).getTime()
                && (ganttData.taskData[this.parent.taskFields.milestone] === false)) {
                tDuration = 1;
            } else {
                tDuration = this.getDuration(
                    ganttProperties.startDate, ganttProperties.endDate, ganttProperties.durationUnit,
                    ganttProperties.isAutoSchedule, ganttProperties.isMilestone);
            }
        }
        this.parent.setRecordValue('duration', tDuration, ganttProperties, true);
        const col: GanttColumnModel = this.parent.columnByField[this.parent.columnMapping.duration];
        if (!isNullOrUndefined(this.parent.editModule) && !isNullOrUndefined(this.parent.editModule.cellEditModule) &&
            !this.parent.editModule.cellEditModule.isCellEdit && !isNullOrUndefined(col)) {
            if (!isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read)) {
                const dialog: HTMLElement = this.parent.editModule.dialogModule.dialog;
                if (!isNullOrUndefined(dialog)) {
                    const textBox: TextBox = <TextBox>(<EJ2Instance>dialog.querySelector('#' + this.parent.element.id + 'Duration'))
                        .ej2_instances[0];
                    if (!isNullOrUndefined(textBox) && textBox.value !== tDuration.toString()) {
                        textBox.value = tDuration.toString();
                        textBox.dataBind();
                    }
                }
            }
            if (this.parent.taskFields.duration) {
                this.parent.dataOperation.updateMappingData(ganttData, 'duration');
                if (this.parent.taskFields.durationUnit) {
                    this.parent.dataOperation.updateMappingData(ganttData, 'durationUnit');
                }
            }
        }
    }
    /**
     *
     * @param {Date} sDate Method to get total nonworking time between two date values
     * @param {Date} eDate .
     * @param {boolean} isAutoSchedule .
     * @param {boolean} isCheckTimeZone .
     * @returns {number} .
     */
    private getNonworkingTime(sDate: Date, eDate: Date, isAutoSchedule: boolean, isCheckTimeZone: boolean): number {
        isCheckTimeZone = isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
        const weekendCount: number = (!this.parent.includeWeekend && this.parent.autoCalculateDateScheduling) && isAutoSchedule ?
            this.getWeekendCount(sDate, eDate) : 0;
        const totalHours: number = this.getNumberOfSeconds(sDate, eDate, isCheckTimeZone);
        const holidaysCount: number = isAutoSchedule && this.parent.autoCalculateDateScheduling ? this.getHolidaysCount(sDate, eDate) : 0;
        const totWorkDays: number = (totalHours - (weekendCount * 86400) - (holidaysCount * 86400)) / 86400; // working days between two dates
        const nonWorkHours: number = this.getNonWorkingSecondsOnDate(sDate, eDate, isAutoSchedule);
        const totalNonWorkTime: number = (this.parent.weekWorkingTime.length > 0 ?
            this.nonWorkingSeconds(sDate, eDate, isAutoSchedule, totWorkDays) : (totWorkDays * (86400 - this.parent.secondsPerDay))) +
            (weekendCount * 86400) + (holidaysCount * 86400) + nonWorkHours;
        return totalNonWorkTime;
    }

    private nonWorkingSeconds(sDate: Date, eDate: Date, isAutoSchedule: boolean, workDays: number, fromDuration?: boolean): number {
        const newStartDate: Date = sDate.getTime() > eDate.getTime() ? new Date(eDate.getTime()) : new Date(sDate.getTime());
        const newEndDate: Date = sDate.getTime() > eDate.getTime() ? new Date(sDate.getTime()) : new Date(eDate.getTime());
        let timeDiff: number = 0;
        let count: number = 0;
        if (fromDuration) {
            const dayStartTime: number = this.parent['getCurrentDayStartTime'](newStartDate);
            const dayEndTime: number = this.parent['getCurrentDayEndTime'](newStartDate);
            if (!(newStartDate.getHours() < dayEndTime / 3600 && newStartDate.getHours() >= dayStartTime / 3600)) {
                newStartDate.setDate(newStartDate.getDate() + 1);
            }
        }
        else {
            newStartDate.setDate(newStartDate.getDate() + 1);
            newStartDate.setHours(0, 0, 0, 0);
            newEndDate.setHours(0, 0, 0, 0);
        }
        if (workDays > 0 || isNullOrUndefined(workDays)) {
            while ((fromDuration && newStartDate.getTime() <= newEndDate.getTime())
            || (!fromDuration && newStartDate.getTime() < newEndDate.getTime())) {
                if (isAutoSchedule) {
                    if (this.isOnHolidayOrWeekEnd(newStartDate, true)) {
                        do {
                            newStartDate.setDate(newStartDate.getDate() + 1);
                        }
                        while (this.isOnHolidayOrWeekEnd(newStartDate, true));
                    }
                    if (!this.parent.includeWeekend) {
                        this.getNextWorkingDay(newStartDate);
                    }
                }
                if (newStartDate.getTime() <= newEndDate.getTime()) {
                    count++;
                    const currentDaySeconds: number = this.parent['getSecondsPerDay'](newStartDate);
                    if (fromDuration) {
                        timeDiff += currentDaySeconds;
                    } else {
                        timeDiff += 86400 - currentDaySeconds;
                    }
                    newStartDate.setDate(newStartDate.getDate() + 1);
                    if (isAutoSchedule) {
                        if (this.isOnHolidayOrWeekEnd(newStartDate, true)) {
                            do {
                                newStartDate.setDate(newStartDate.getDate() + 1);
                            }
                            while (this.isOnHolidayOrWeekEnd(newStartDate, true));
                        }
                        if (!this.parent.includeWeekend) {
                            this.getNextWorkingDay(newStartDate);
                        }
                    }
                }
            }
        }
        else {
            return 0;
        }
        if (fromDuration) {
            if (timeDiff > 0) {
                timeDiff = timeDiff / count;
            }
            else {
                timeDiff = this.parent.secondsPerDay;
            }
        }
        return timeDiff;
    }

    /**
     *
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @param {string} durationUnit .
     * @param {boolean} isAutoSchedule .
     * @param {boolean} isMilestone .
     * @param {boolean} isCheckTimeZone .
     * @returns {number} .
     * @private
     */
    public getDuration(
        startDate: Date, endDate: Date, durationUnit: string, isAutoSchedule: boolean,
        isMilestone: boolean, isCheckTimeZone?: boolean): number {
        if (isNullOrUndefined(startDate) || isNullOrUndefined(endDate)) {
            return null;
        }
        isCheckTimeZone = isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
        let durationValue: number = 0;
        const timeDiff: number = this.getTimeDifference(startDate, endDate, isCheckTimeZone) / 1000;
        const nonWorkHours: number = this.getNonworkingTime(startDate, endDate, isAutoSchedule, isCheckTimeZone);
        const durationHours: number = timeDiff - nonWorkHours;
        let totSeconds: number;
        if (this.parent.weekWorkingTime.length > 0) {
            totSeconds = this.nonWorkingSeconds(startDate, endDate, isAutoSchedule, undefined, true);
        }
        else {
            totSeconds = this.parent.secondsPerDay;
        }
        if (isMilestone && this.parent.getFormatedDate(startDate) === this.parent.getFormatedDate(endDate)) {
            durationValue = 0;
        } else {
            if (!durationUnit || durationUnit === 'day') {
                durationValue = durationHours / totSeconds;
            } else if (durationUnit === 'minute') {
                durationValue = durationHours / 60;
            } else {
                durationValue = durationHours / 3600;
            }
        }
        return parseFloat(durationValue.toString());
    }
    /**
     *
     * @param {number} duration .
     * @param {string} durationUnit .
     * @param {Date} date .
     *  @returns {number} .
     */
    private getDurationAsSeconds(duration: number, durationUnit: string, date: Date): number {
        let value: number = 0;
        let totSeconds: number;
        if (this.parent.weekWorkingTime.length > 0) {
            totSeconds = this.parent['getSecondsPerDay'](date);
        }
        else {
            totSeconds = this.parent.secondsPerDay;
        }
        if (!durationUnit || durationUnit.toLocaleLowerCase() === 'day') {
            value = totSeconds * duration;
        } else if (durationUnit.toLocaleLowerCase() === 'hour') {
            value = duration * 3600;
        } else {
            value = duration * 60;
        }
        return value;
    }
    /**
     * To get date from start date and duration
     *
     * @param {Date} startDate .
     * @param {number} duration .
     * @param {string} durationUnit .
     * @param {ITaskData} ganttProp .
     * @param {boolean} validateAsMilestone .
     * @returns {Date} .
     * @private
     */
    public getEndDate(
        startDate: Date, duration: number, durationUnit: string, ganttProp: ITaskData, validateAsMilestone: boolean): Date {
        let tempStart: Date = new Date(startDate.getTime());
        let endDate: Date = new Date(startDate.getTime());
        const sDate: Date = new Date(startDate.getTime());
        let secondDuration: number;
        if (this.parent.weekWorkingTime.length > 0 && (!durationUnit || durationUnit.toLocaleLowerCase() === 'day')) {
            secondDuration = this.calculateSecondDuration(duration, sDate, secondDuration, startDate, true);
        }
        else {
            secondDuration = this.getDurationAsSeconds(duration, durationUnit, startDate);
        }
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
     * Calculate start date based on end date and duration.
     *
     * @param {Date} endDate - To calculate start date value from end date and duration.
     * @param {number} duration - The duration value.
     * @param {string} durationUnit - The unit of duration.
     * @param {ITaskData} ganttProp - The Gantt task properties.
     * @param {boolean} fromValidation - A flag indicating if the calculation is from validation.
     * @returns {Date} The calculated start date.
     * @private
     */
    public getStartDate(endDate: Date, duration: number, durationUnit: string, ganttProp: ITaskData, fromValidation?: boolean): Date {
        let tempEnd: Date = new Date(endDate.getTime());
        let startDate: Date = new Date(endDate.getTime());
        let secondDuration: number;
        const eDate: Date = new Date(tempEnd.getTime());
        if (this.parent.weekWorkingTime.length > 0) {
            secondDuration = this.calculateSecondDuration(duration, eDate, secondDuration, tempEnd, false);
        }
        else {
            secondDuration = this.getDurationAsSeconds(duration, durationUnit, tempEnd);
        }
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
        /* To render the milestone in proper date while loading */
        if (fromValidation && ganttProp.isMilestone) {
            startDate.setDate(startDate.getDate() - 1);
            const dayEndTime: number = this.parent['getCurrentDayEndTime'](ganttProp.endDate ? ganttProp.isAutoSchedule ? ganttProp.endDate : ganttProp.autoEndDate : startDate);
            this.parent.dateValidationModule.setTime(dayEndTime, startDate);
            startDate = this.parent.dateValidationModule.checkStartDate(startDate, ganttProp, true);
        }
        return startDate;
    }

    private calculateSecondDuration(duration: number, sDate: Date, secondDuration: number, startDate: Date, fromEndDate: boolean): number {
        if (duration < 1) {
            secondDuration = this.parent['getSecondsPerDay'](sDate) * duration;
        }
        else {
            secondDuration = 0;
            let durationValue: number = duration;
            const dayStartTime: number = this.parent['getCurrentDayStartTime'](sDate);
            const dayEndTime: number = this.parent['getCurrentDayEndTime'](sDate);
            if (!(sDate.getHours() < dayEndTime / 3600 && sDate.getHours() > dayStartTime / 3600) && this.fromSegments) {
                if (fromEndDate) {
                    sDate.setDate(sDate.getDate() + 1);
                } else {
                    sDate.setDate(sDate.getDate() - 1);
                }
            }
            while (durationValue > 0) {
                if (this.isOnHolidayOrWeekEnd(sDate, true)) {
                    do {
                        if (fromEndDate) {
                            sDate.setDate(sDate.getDate() + 1);
                        } else {
                            sDate.setDate(sDate.getDate() - 1);
                        }
                    }
                    while (this.isOnHolidayOrWeekEnd(sDate, true));
                }
                if (!this.parent.includeWeekend) {
                    sDate = fromEndDate ? this.getNextWorkingDay(sDate) : this.getPreviousWorkingDay(sDate);
                }
                let totSeconds: number = this.parent['getSecondsPerDay'](sDate);
                let num: number = 0;
                if (this.getSecondsInDecimal(startDate) !== this.parent['getStartTime'](startDate) && !Number.isInteger(durationValue)) {
                    const deciNumber: string[] = duration.toString().split('.');
                    num = parseFloat('.' + deciNumber[1]);
                    totSeconds = totSeconds * num;
                    durationValue = durationValue - num;
                }
                if (durationValue < 1) {
                    totSeconds = totSeconds * durationValue;
                }
                secondDuration = secondDuration + totSeconds;
                if (fromEndDate) {
                    sDate.setDate(sDate.getDate() + 1);
                } else {
                    sDate.setDate(sDate.getDate() - 1);
                }
                if (!num) {
                    durationValue--;
                }
            }
        }
        return secondDuration;
    }

    /**
     * @param {ITaskData} ganttProp .
     * @param {boolean} isLoad .
     * @returns {Date} .
     * @private
     */
    protected getProjectStartDate(ganttProp: ITaskData, isLoad?: boolean): Date {

        if (!isNullOrUndefined(this.parent.cloneProjectStartDate)) {
            if (typeof this.parent.cloneProjectStartDate === 'string') {
                this.parent.cloneProjectStartDate = this.getDateFromFormat(this.parent.cloneProjectStartDate);
            }
            const cloneStartDate: Date = this.checkStartDate(this.parent.cloneProjectStartDate);
            this.parent.cloneProjectStartDate = cloneStartDate;
            return new Date(cloneStartDate.getTime());
        } else if (!isNullOrUndefined(this.parent.projectStartDate)) {
            const cloneStartDate: Date = this.getDateFromFormat(this.parent.projectStartDate);
            this.parent.cloneProjectStartDate = this.checkStartDate(cloneStartDate);
        } else if (!isNullOrUndefined(isLoad)) {
            const flatData: IGanttData[] = this.parent.flatData;
            let minStartDate: Date;
            if (flatData.length > 0) {
                minStartDate = flatData[0].ganttProperties.startDate;
            } else {
                minStartDate = new Date();
                minStartDate.setHours(0, 0, 0, 0);
            }
            for (let index: number = 1; index < flatData.length; index++) {
                const startDate: Date = flatData[index as number].ganttProperties.startDate;
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
     * @param {ITaskData} ganttProp .
     * @param {boolean} isAuto .
     * @returns {Date} .
     * @private
     */
    public getValidStartDate(ganttProp: ITaskData, isAuto?: boolean): Date {
        let sDate: Date = null;
        const startDate: Date = isAuto ? ganttProp.autoStartDate : ganttProp.startDate;
        const endDate: Date = isAuto ? ganttProp.autoEndDate : ganttProp.endDate;
        const duration: number = !ganttProp.isAutoSchedule && ganttProp.autoDuration ? ganttProp.autoDuration : ganttProp.duration;
        if (isNullOrUndefined(startDate)) {
            if (!isNullOrUndefined(endDate)) {
                sDate = new Date(endDate.getTime());
                const dayStartTime: number = this.parent['getCurrentDayStartTime'](sDate);
                this.setTime(dayStartTime, sDate);
            } else if (!isNullOrUndefined(duration)) {
                sDate = this.getProjectStartDate(ganttProp);
            }
        } else {
            sDate = new Date(startDate.getTime());
        }
        return sDate;
    }
    /**
     *
     * @param {ITaskData} ganttProp .
     * @param {boolean} isAuto .
     * @returns {Date} .
     * @private
     */
    public getValidEndDate(ganttProp: ITaskData, isAuto?: boolean): Date {
        let eDate: Date = null;
        const startDate: Date = isAuto ? ganttProp.autoStartDate : ganttProp.startDate;
        const endDate: Date = isAuto ? ganttProp.autoEndDate : ganttProp.endDate;
        const duration: number = isAuto ? ganttProp.autoDuration : ganttProp.duration;
        if (isNullOrUndefined(endDate)) {
            if (!isNullOrUndefined(startDate)) {
                if (ganttProp.isMilestone) {
                    eDate = this.checkStartDate(startDate);
                } else {
                    eDate = new Date(startDate.getTime());
                    const dayEndTime: number = this.parent['getCurrentDayEndTime'](endDate ? endDate : eDate);
                    this.setTime(dayEndTime, eDate);
                }
            } else if (!isNullOrUndefined(duration)) {
                const sDate: Date = this.getValidStartDate(ganttProp);
                if (sDate) {
                    eDate = this.getEndDate(sDate, duration, ganttProp.durationUnit, ganttProp, false);
                }
            }
        } else {
            eDate = new Date(endDate.getTime());
        }
        return eDate;
    }
    private getWorkingTime(day: string, currentRange: DayWorkingTimeModel, startDate: Date, totalSeconds: number,
                           count: number, nonWorkingHours: number[], workingTimeRanges: IWorkingTimeRange[],
                           nonWorkingTimeRanges: IWorkingTimeRange[]): number {
        if (!isNullOrUndefined(currentRange.from) && !isNullOrUndefined(currentRange.to)) {
            startDate.setHours(0, 0, 0, 0);
            const tempDate: Date = new Date(startDate.getTime());
            startDate.setTime(startDate.getTime() + (currentRange.from * 3600000));
            const startHour: Date = new Date(startDate.getTime());
            tempDate.setTime(tempDate.getTime() + (currentRange.to * 3600000));
            const endHour: Date = new Date(tempDate.getTime());
            const timeDiff: number = endHour.getTime() - startHour.getTime();
            const sdSeconds: number = this.getSecondsInDecimal(startHour);
            let edSeconds: number = this.getSecondsInDecimal(endHour);
            if (edSeconds === 0) {
                edSeconds = 86400;
            }
            totalSeconds += timeDiff / 1000;
            if (count === 0) {
                this.parent.defaultStartTime = sdSeconds;
                if (this.parent.weekWorkingTime.length > 0) {
                    this.assignStartTime(day, sdSeconds);
                }
            }
            if (count === this[day.toLowerCase() + 'TimeRangeLength'] - 1 || day === '') {
                this.parent.defaultEndTime = edSeconds;
                if (this.parent.weekWorkingTime.length > 0) {
                    this.assignEndTime(day, edSeconds);
                }
            }
            if (count > 0) {
                if (day === '') {
                    nonWorkingHours.push(nonWorkingHours[nonWorkingHours.length - 1] +
                        sdSeconds - workingTimeRanges[count - 1].to);
                    if (workingTimeRanges[count - 1].to < sdSeconds) {
                        nonWorkingTimeRanges.push({
                            from: workingTimeRanges[count - 1].to, to: sdSeconds, isWorking: false,
                            interval: (sdSeconds - workingTimeRanges[count - 1].to)
                        });
                    }
                }
                else {
                    this.parent[day.toLowerCase() + 'NonWorkingHours'].push(this.parent[day.toLowerCase() + 'NonWorkingHours'][this.parent[day.toLowerCase() + 'NonWorkingHours'].length - 1] +
                        sdSeconds - this.parent[day.toLowerCase() + 'NonWorkingTimeRanges'][count - 1].to);
                    if (this.parent[day.toLowerCase() + 'WorkingTimeRanges'][count - 1].to < sdSeconds) {
                        this.parent[day.toLowerCase() + 'NonWorkingTimeRanges'].push({
                            from: this.parent[day.toLowerCase() + 'WorkingTimeRanges'][count - 1].to, to: sdSeconds, isWorking: false,
                            interval: (sdSeconds - this.parent[day.toLowerCase() + 'WorkingTimeRanges'][count - 1].to)
                        });
                    }
                }
            } else {
                if (day === '') {
                    nonWorkingHours.push(0);
                    nonWorkingTimeRanges.push({ from: 0, to: sdSeconds, isWorking: false, interval: sdSeconds });
                }
                else {
                    this.parent[day.toLowerCase() + 'NonWorkingHours'].push(0);
                    this.parent[day.toLowerCase() + 'NonWorkingTimeRanges'].push({ from: 0, to: sdSeconds, isWorking: false, interval: sdSeconds });
                }
            }
            if (day === '') {
                workingTimeRanges.push({ from: sdSeconds, to: edSeconds });
                nonWorkingTimeRanges.push({
                    from: sdSeconds, to: edSeconds, isWorking: true, interval: (edSeconds - sdSeconds)
                });
            }
            else {
                this.parent[day.toLowerCase() + 'WorkingTimeRanges'].push({ from: sdSeconds, to: edSeconds });
                this.parent[day.toLowerCase() + 'NonWorkingTimeRanges'].push({
                    from: sdSeconds, to: edSeconds, isWorking: true, interval: (edSeconds - sdSeconds)
                });
            }
        }
        return totalSeconds;
    }

    private assignStartTime(day: string, sdSeconds: number): void {
        switch (day) {
        case 'Monday':
            this.parent.mondayDefaultStartTime = sdSeconds;
            break;
        case 'Tuesday':
            this.parent.tuesdayDefaultStartTime = sdSeconds;
            break;
        case 'Wednesday':
            this.parent.wednesdayDefaultStartTime = sdSeconds;
            break;
        case 'Thursday':
            this.parent.thursdayDefaultStartTime = sdSeconds;
            break;
        case 'Friday':
            this.parent.fridayDefaultStartTime = sdSeconds;
            break;
        case 'Saturday':
            this.parent.saturdayDefaultStartTime = sdSeconds;
            break;
        case 'Sunday':
            this.parent.sundayDefaultStartTime = sdSeconds;
            break;
        default:
            break;
        }
    }

    private assignEndTime(day: string, edSeconds: number): void {
        switch (day) {
        case 'Monday':
            this.parent.mondayDefaultEndTime = edSeconds;
            break;
        case 'Tuesday':
            this.parent.tuesdayDefaultEndTime = edSeconds;
            break;
        case 'Wednesday':
            this.parent.wednesdayDefaultEndTime = edSeconds;
            break;
        case 'Thursday':
            this.parent.thursdayDefaultEndTime = edSeconds;
            break;
        case 'Friday':
            this.parent.fridayDefaultEndTime = edSeconds;
            break;
        case 'Saturday':
            this.parent.saturdayDefaultEndTime = edSeconds;
            break;
        case 'Sunday':
            this.parent.sundayDefaultEndTime = edSeconds;
            break;
        default:
            break;
        }
    }

    private calculateWeekWorkTime(day: string, currentDay: DayWorkingTimeModel[], startDate: Date,
                                  totalSeconds: number, nonWorkingHours: number[], workingTimeRanges: IWorkingTimeRange[],
                                  nonWorkingTimeRanges: IWorkingTimeRange[]): number {
        let seconds: number = 0;
        for (let j: number = 0; j < currentDay.length; j++) {
            const currentRange: DayWorkingTimeModel = currentDay[j as number];
            seconds = seconds + this.getWorkingTime(day, currentRange, startDate, totalSeconds,
                                                    j, nonWorkingHours, workingTimeRanges, nonWorkingTimeRanges);
        }
        if (this.parent[day.toLowerCase() + 'DefaultStartTime'] / 3600 !== 24) {
            this.parent[day.toLowerCase() + 'NonWorkingTimeRanges'].push({
                from: this.parent[day.toLowerCase() + 'DefaultEndTime'], to: 86400,
                isWorking: false, interval: 86400 - this.parent[day.toLowerCase() + 'DefaultEndTime']
            });
        }
        return seconds;
    }
    /**
     * @returns {number} .
     * @private
     */
    public getSecondsPerDay(): number {
        let totalSeconds: number = 0; const startDate: Date = new Date('10/11/2018');
        this.parent.nonWorkingHours = [];
        const nonWorkingHours: number[] = this.parent.nonWorkingHours;
        this.parent.workingTimeRanges = [];
        this.parent.workingTimeRanges = [];
        const workingTimeRanges: IWorkingTimeRange[] = this.parent.workingTimeRanges;
        this.parent.nonWorkingTimeRanges = [];
        const nonWorkingTimeRanges: IWorkingTimeRange[] = this.parent.nonWorkingTimeRanges;
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            this[`${day.toLowerCase()}TimeRangeLength`] = this.parent.dayWorkingTime.length;
        }
        if (this.parent.weekWorkingTime.length > 0) {
            for (let i: number = 0; i < this.parent.weekWorkingTime.length; i++) {
                this[this.parent.weekWorkingTime[i as number].dayOfWeek.toLowerCase() + 'TimeRangeLength']
                = this.parent.weekWorkingTime[i as number].timeRange.length;
            }
            const weekWorkingTime: WeekWorkingTimeModel[] = this.parent.weekWorkingTime;
            const dayWorkingTime: DayWorkingTimeModel[] = this.parent.dayWorkingTime;
            for (const weekDay of weekWorkingTime) {
                if (weekDay.timeRange && weekDay.timeRange.length > 0) {
                    const seconds: number = this.calculateWeekWorkTime(weekDay.dayOfWeek, weekDay.timeRange, startDate, totalSeconds,
                                                                       nonWorkingHours, workingTimeRanges, nonWorkingTimeRanges);
                    this.parent[`${weekDay.dayOfWeek.toLowerCase()}Seconds`] = seconds;
                }
            }

            for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
                const dayDefaultStartTime: number = this.parent[`${day.toLowerCase()}DefaultStartTime`];
                if (isNullOrUndefined(dayDefaultStartTime)) {
                    const seconds: number = this.calculateWeekWorkTime(day, dayWorkingTime, startDate, totalSeconds,
                                                                       nonWorkingHours, workingTimeRanges, nonWorkingTimeRanges);
                    this.parent[`${day.toLowerCase()}Seconds`] = seconds;
                }
            }
        }
        const dayWorkingTime: DayWorkingTimeModel[] = this.parent.dayWorkingTime;
        const length: number = dayWorkingTime.length;
        let seconds: number = 0;
        for (let count: number = 0; count < length; count++) {
            const currentRange: DayWorkingTimeModel = dayWorkingTime[count as number];
            seconds = seconds + this.getWorkingTime('', currentRange, startDate, totalSeconds, count,
                                                    nonWorkingHours, workingTimeRanges, nonWorkingTimeRanges);
        }
        if (this.parent.defaultEndTime / 3600 !== 24) {
            nonWorkingTimeRanges.push({
                from: this.parent.defaultEndTime, to: 86400,
                isWorking: false, interval: 86400 - this.parent.defaultEndTime
            });
        }
        totalSeconds = seconds;
        return totalSeconds;
    }
    /**
     *
     * @param {string} value .
     * @param {boolean} isFromDialog .
     * @returns {object} .
     * @private
     */
    // eslint-disable-next-line
    public getDurationValue(value: string | number, isFromDialog?: boolean): Object {
        let durationUnit: string = null;
        let duration: number = null;

        if (typeof value === 'string') {
            const values: Object[] = value.match(/(\d*\.*\d+|.+$)/g);
            if (values && values.length <= 2) {
                duration = parseFloat(values[0].toString().trim());
                const unit: string = values[1] ? values[1].toString().trim().toLowerCase() : null;
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
        const output: Object = {
            duration: duration,
            durationUnit: durationUnit
        };
        return output;
    }
    /**
     *
     * @param {Date} date .
     * @returns {Date} .
     */
    protected getNextWorkingDay(date: Date): Date {
        const dayIndex: number = date.getDay();
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
     *
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @returns {number} .
     */
    protected getWeekendCount(startDate: Date, endDate: Date): number {
        let weekendCount: number = 0;
        const sDate: Date = new Date(startDate.getTime()); const eDate: Date = new Date(endDate.getTime());
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
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @param {boolean} isCheckTimeZone .
     * @returns {number} .
     */
    protected getNumberOfSeconds(startDate: Date, endDate: Date, isCheckTimeZone: boolean): number {
        const sDate: Date = new Date(startDate.getTime()); const eDate: Date = new Date(endDate.getTime());
        let timeDiff: number = 0;
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
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @returns {number} .
     */
    protected getHolidaysCount(startDate: Date, endDate: Date): number {
        let holidaysCount: number = 0;
        const holidays: number[] = this.parent.totalHolidayDates;
        const sDate: Date = new Date(startDate.getTime());
        const eDate: Date = new Date(endDate.getTime());
        sDate.setDate(sDate.getDate() + 1);
        sDate.setHours(0, 0, 0, 0);
        eDate.setHours(0, 0, 0, 0);
        if (sDate.getTime() < eDate.getTime()) {
            for (let i: number = 0; i < holidays.length; i++) {
                const currentHoliday: Date = this.getDateFromFormat(new Date(holidays[i as number]));
                if (sDate.getTime() <= currentHoliday.getTime() && eDate.getTime() > currentHoliday.getTime()) {
                    if ((!this.parent.includeWeekend && this.parent.nonWorkingDayIndex.indexOf(currentHoliday.getDay()) === -1) ||
                        this.parent.includeWeekend) {
                        holidaysCount += 1;
                    }
                }
            }
        }
        return holidaysCount;
    }
    /**
     * @returns {number[]} .
     * @private
     */
    public getHolidayDates(): number[] {
        const holidays: HolidayModel[] = this.parent.holidays;
        const holidayDates: number[] = [];
        for (let i: number = 0; i < holidays.length; i++) {
            const from: Date = this.getDateFromFormat(holidays[i as number].from);
            const to: Date = this.getDateFromFormat(holidays[i as number].to);
            if (isNullOrUndefined(from) && isNullOrUndefined(to)) {
                continue;
            } else if (isNullOrUndefined(from) || isNullOrUndefined(to)) {
                const tempDate: Date = from ? from : to;
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
    /**
     * @param {Date} date .
     * @param {boolean} checkWeekEnd .
     * @returns {boolean} .
     * @private
     */
    /*Check given date is on holidays*/
    public isOnHolidayOrWeekEnd(date: Date, checkWeekEnd: boolean): boolean {
        checkWeekEnd = !isNullOrUndefined(checkWeekEnd) ? checkWeekEnd : this.parent.includeWeekend;
        if (!this.parent.autoCalculateDateScheduling) {
            checkWeekEnd = true;
        }
        if (!checkWeekEnd && this.parent.nonWorkingDayIndex.indexOf(date.getDay()) !== -1) {
            return true;
        }
        const holidays: number[] = this.parent.totalHolidayDates;
        for (let count: number = 0; count < holidays.length; count++) {
            const holidayFrom: Date = this.getDateFromFormat(new Date(holidays[count as number]));
            const holidayTo: Date = new Date(holidayFrom.getTime());
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
     *
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @param {boolean} isAutoSchedule .
     * @returns {number} .
     */
    protected getNonWorkingSecondsOnDate(startDate: Date, endDate: Date, isAutoSchedule: boolean): number {
        const sHour: number = this.getSecondsInDecimal(startDate);
        const eHour: number = this.getSecondsInDecimal(endDate);
        let startRangeIndex: number = -1;
        let endRangeIndex: number = -1;
        let totNonWrkSecs: number = 0;
        const startOnHoliday: boolean = isAutoSchedule && this.parent.autoCalculateDateScheduling ?
            this.isOnHolidayOrWeekEnd(startDate, null) : false;
        const endOnHoliday: boolean = isAutoSchedule && this.parent.autoCalculateDateScheduling ?
            this.isOnHolidayOrWeekEnd(endDate, null) : false;
        let startnonWorkingTimeRange: IWorkingTimeRange[];
        let endnonWorkingTimeRange: IWorkingTimeRange[];
        if (this.parent.weekWorkingTime.length > 0) {
            startnonWorkingTimeRange = this.parent['getNonWorkingRange'](startDate);
            for (let i: number = 0; i < startnonWorkingTimeRange.length; i++) {
                const val: IWorkingTimeRange = startnonWorkingTimeRange[i as number];
                if (sHour >= val.from && sHour <= val.to) {
                    startRangeIndex = i;
                }
            }
            endnonWorkingTimeRange = this.parent['getNonWorkingRange'](endDate);
            for (let i: number = 0; i < endnonWorkingTimeRange.length; i++) {
                const val: IWorkingTimeRange = endnonWorkingTimeRange[i as number];
                if (eHour >= val.from && eHour <= val.to) {
                    endRangeIndex = i;
                }
            }
        }
        else {
            startnonWorkingTimeRange = this.parent.nonWorkingTimeRanges;
            endnonWorkingTimeRange = this.parent.nonWorkingTimeRanges;
            for (let i: number = 0; i < startnonWorkingTimeRange.length; i++) {
                const val: IWorkingTimeRange = startnonWorkingTimeRange[i as number];
                if (sHour >= val.from && sHour <= val.to) {
                    startRangeIndex = i;
                }
                if (eHour >= val.from && eHour <= val.to) {
                    endRangeIndex = i;
                }
            }
        }
        if (startDate.getDate() !== endDate.getDate() || startDate.getMonth() !== endDate.getMonth() ||
            startDate.getFullYear() !== endDate.getFullYear()) {
            if (!startOnHoliday) {
                for (let i: number = startRangeIndex; i < startnonWorkingTimeRange.length; i++) {
                    if (!startnonWorkingTimeRange[i as number].isWorking) {
                        if (i === startRangeIndex) {
                            totNonWrkSecs += (startnonWorkingTimeRange[i as number].to - sHour);
                        } else {
                            totNonWrkSecs += (startnonWorkingTimeRange[i as number].interval);
                        }
                    }
                }
            } else {
                totNonWrkSecs += (86400 - sHour);
            }
            if (!endOnHoliday) {
                for (let i: number = 0; i <= endRangeIndex; i++) {
                    if (!endnonWorkingTimeRange[i as number].isWorking) {
                        if (i === endRangeIndex) {
                            totNonWrkSecs += (eHour - endnonWorkingTimeRange[i as number].from);
                        } else {
                            totNonWrkSecs += endnonWorkingTimeRange[i as number].interval;
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
                        if (!startnonWorkingTimeRange[i as number].isWorking) {
                            if (i === startRangeIndex) {
                                totNonWrkSecs += (startnonWorkingTimeRange[i as number].to - sHour);
                            } else if (i === endRangeIndex) {
                                totNonWrkSecs += (eHour - startnonWorkingTimeRange[i as number].from);
                            } else {
                                totNonWrkSecs += startnonWorkingTimeRange[i as number].interval;
                            }
                        }
                    }
                } else {
                    totNonWrkSecs += (eHour - sHour);
                }
            } else {
                if (!endOnHoliday) {
                    const range: IWorkingTimeRange = startnonWorkingTimeRange[startRangeIndex as number];
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
     * @param {Date} date .
     * @returns {Date} .
     */
    protected getPreviousWorkingDay(date: Date): Date {
        const dayIndex: number = date.getDay();
        const previousIndex: number = (dayIndex === 0) ? 6 : dayIndex - 1;
        const dayEndTime: number = this.parent['getCurrentDayEndTime'](date);
        if (this.parent.nonWorkingDayIndex.indexOf(dayIndex) !== -1 || (this.parent.nonWorkingDayIndex.indexOf(previousIndex) !== -1
            && dayEndTime === 86400 && this.getSecondsInDecimal(date) === 0)) {
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
     *
     * @returns {void} .
     * @private
     */
    public getNonWorkingDayIndex(): void {
        const weekDay: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const weekDayLength: number = weekDay.length;
        if (this.parent.workWeek.length === 0) {
            this.parent.workWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        }
        const workWeek: string[] = this.parent.workWeek.slice();
        const length: number = workWeek.length;
        for (let i: number = 0; i < length; i++) {
            workWeek[i as number] = workWeek[i as number].toLowerCase();
        }
        this.parent.nonWorkingDayIndex = [];
        for (let i: number = 0; i < weekDayLength; i++) {
            if (workWeek.indexOf(weekDay[i as number]) === -1) {
                this.parent.nonWorkingDayIndex.push(i);
            }
        }
    }
    /**
     *
     * @param {number} seconds .
     * @param {Date} date .
     * @returns {void} .
     * @private
     */
    public setTime(seconds: number, date: Date): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let hour: any = seconds / 3600;
        hour = parseInt(hour, 10);
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let min: any = (seconds - (hour * 3600)) / 60;
        min = parseInt(min, 10);
        const sec: number = seconds - (hour * 3600) - (min * 60);
        date.setHours(hour, min, sec);
    }
    /**
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @param {boolean} isCheckTimeZone .
     * @returns {number} .
     */
    protected getTimeDifference(startDate: Date, endDate: Date, isCheckTimeZone?: boolean): number {
        const sDate: Date = new Date(startDate.getTime()); const eDate: Date = new Date(endDate.getTime());
        if (isCheckTimeZone) {
            this.updateDateWithTimeZone(sDate, eDate);
        }
        return eDate.getTime() - sDate.getTime();
    }
    /**
     * @param {Date} sDate .
     * @param {Date} eDate .
     * @returns {void} .
     */
    protected updateDateWithTimeZone(sDate: Date, eDate: Date): void {
        const sTZ: number = sDate.getTimezoneOffset();
        const eTZ: number = eDate.getTimezoneOffset();
        let uTZ: number; let uDate: Date;
        if (sTZ !== eTZ) {
            const standardTZ: number = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
            if (standardTZ !== sTZ) {
                uDate = sDate;
                uTZ = sTZ;
            } else if (standardTZ !== eTZ) {
                uDate = eDate;
                uTZ = eTZ;
            }
            if (standardTZ < 0) {
                const tzDiff: number = standardTZ - uTZ;
                uDate.setTime(uDate.getTime() + (tzDiff * 60 * 1000));
            } else if (standardTZ >= 0) {
                const tzDiff: number = uTZ - standardTZ;
                uDate.setTime(uDate.getTime() - (tzDiff * 60 * 1000));
            }
        }
    }
    /**
     *
     * @param {Date} date .
     * @returns {number} .
     */
    protected getSecondsInDecimal(date: Date): number {
        return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds() + (date.getMilliseconds() / 1000);
    }
    /**
     * @param {Date} date .
     * @param {number} localOffset .
     * @param {string} timezone .
     * @returns {number} .
     * @private
     */

    public offset(date: Date, timezone: string): number {
        const localOffset: number = date.getTimezoneOffset();
        try {
            const convertedDate: Date = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
            if (!isNaN(convertedDate.getTime())) {
                return ((date.getTime() - convertedDate.getTime()) / 60000) + localOffset;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    public remove(date: Date, timezone: string): Date {
        if (!isNullOrUndefined(date)) {
            date = this.reverse(date, timezone, date.getTimezoneOffset());
        }
        return date;
    }

    public reverse(date: Date, fromOffset: number | string, toOffset: number | string): Date {
        if (typeof fromOffset === 'string') {
            fromOffset = this.offset(date, fromOffset);
        }
        if (typeof toOffset === 'string') {
            toOffset = this.offset(date, toOffset);
        }
        const fromLocalOffset: number = date.getTimezoneOffset();
        date = new Date(date.getTime() + (fromOffset - toOffset) * 60000);
        const toLocalOffset: number = date.getTimezoneOffset();
        return new Date(date.getTime() + (toLocalOffset - fromLocalOffset) * 60000);
    }

    /**
     * @param {Date} date .
     * @param {string} timezone .
     * @returns {Date} .
     * @private
     */
    public convert(date: Date, timezone: string): Date {
        const fromOffset: number = date.getTimezoneOffset();
        const toOffset: number = this.offset(date, timezone);
        if (fromOffset < 0 && (this.parent.timelineSettings.bottomTier && this.parent.timelineSettings.bottomTier.unit !== 'Hour')) {
            date = new Date(date.getTime() - (fromOffset - toOffset) / 60000);
            const toLocalOffset: number = date.getTimezoneOffset();
            return new Date(date.getTime() - (toLocalOffset - fromOffset) / 60000);
        }
        else {
            date = new Date(date.getTime() + (fromOffset - toOffset) * 60000);
            const toLocalOffset: number = date.getTimezoneOffset();
            return new Date(date.getTime() + (toLocalOffset - fromOffset) * 60000);
        }
    }
    /**
     * @param {string | Date} date .
     * @param {boolean} toConvert .
     * @returns {Date} .
     * @private
     */
    public getDateFromFormat(date: string | Date, toConvert?: boolean): Date {
        let updatedDate: Date;
        if (isNullOrUndefined(date)) {
            return null;
        } else if (date instanceof Date) {
            updatedDate = new Date(date.getTime());
        } else {
            const dateObject: Date = this.parent.globalize.parseDate(date, { format: this.parent.getDateFormat(), type: 'dateTime' });
            updatedDate = isNullOrUndefined(dateObject) && !isNaN(new Date(date).getTime()) ? new Date(date) : dateObject;
        }
        if (!isNullOrUndefined(this.parent.timezone) && toConvert) {
            const convertedDate: Date = this.convert(updatedDate, this.parent.timezone);
            return convertedDate;
        } else {
            return updatedDate;
        }
    }
    /**
     * @param {Date} date1 .
     * @param {Date} date2 .
     * @returns {number} .
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
     * @param {number} duration .
     * @param {string} durationUnit .
     * @returns {string} .
     * @private
     */
    public getDurationString(duration: number, durationUnit: string): string {
        let value: string = '';
        if (!isNullOrUndefined(duration)) {
            value += parseFloat(duration.toFixed(2)) + ' ';
            if (!isNullOrUndefined(durationUnit)) {
                const plural: boolean = duration !== 1;
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
     * Method to get work with value and unit.
     *
     * @param {number} work .
     * @param {string} workUnit .
     * @returns {string} .
     * @private
     */
    public getWorkString(work: number | string, workUnit: string): string {
        let value: string = '';
        if (!isNullOrUndefined(work)) {
            value += parseFloat(work as string).toFixed(2) + ' ';
            if (!isNullOrUndefined(workUnit)) {
                const plural: boolean = work !== 1;
                if (workUnit === 'day') {
                    value += plural ? this.parent.localeObj.getConstant('days') : this.parent.localeObj.getConstant('day');
                } else if (workUnit === 'hour') {
                    value += plural ? this.parent.localeObj.getConstant('hours') : this.parent.localeObj.getConstant('hour');
                } else if (workUnit === 'minute') {
                    value += plural ? this.parent.localeObj.getConstant('minutes') :
                        this.parent.localeObj.getConstant('minute');
                }
            }
        }
        return value;
    }
    /**
     *
     * @param {object} editArgs .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    public calculateProjectDatesForValidatedTasks(editArgs?: Object): void {
        const projectStartDate: Date = typeof this.parent.projectStartDate === 'string' ?
            new Date(this.parent.projectStartDate) : this.parent.projectStartDate;
        const projectEndDate: Date = typeof this.parent.projectEndDate === 'string' ?
            new Date(this.parent.projectEndDate) : this.parent.projectEndDate;
        let minStartDate: Date | string = null; let maxEndDate: Date | string = null;
        const flatData: object[] = (getValue('dataOperation.dataArray', this.parent));
        if ((!projectStartDate || !projectEndDate) && (flatData && flatData.length === 0)) {
            minStartDate = this.getDateFromFormat(new Date());
            maxEndDate = this.getDateFromFormat(new Date(minStartDate.getTime()));
        } else if (flatData.length > 0) {
            const sortedStartDate: object[] = flatData.slice().sort((a: ITaskData, b: ITaskData) =>
                ((new Date(a[this.parent.taskFields.startDate])).getTime() -
                (new Date(b[this.parent.taskFields.startDate])).getTime()));
            const sortedEndDate: object[] = flatData.slice().sort((a: ITaskData, b: ITaskData) =>
                ((new Date(b[this.parent.taskFields.endDate])).getTime() - (new Date(a[this.parent.taskFields.endDate])).getTime()));
            minStartDate = sortedStartDate[0][this.parent.taskFields.startDate];
            maxEndDate = sortedEndDate[sortedEndDate.length - 1][this.parent.taskFields.endDate];
        }
        this.parent.cloneProjectStartDate = projectStartDate ? new Date(projectStartDate.getTime()) :
            typeof minStartDate === 'string' ? new Date(minStartDate) : minStartDate;
        this.parent.cloneProjectEndDate = projectEndDate ? new Date(projectEndDate.getTime()) :
            typeof maxEndDate === 'string' ? new Date(maxEndDate) : maxEndDate;
    }
    /**
     *
     * @param {object} editArgs .
     * @returns {void} .
     * @private
     */
    public calculateProjectDates(editArgs?: Object): void {
        if (this.parent.isLoad && this.parent.enablePersistence &&
            this.parent.cloneProjectStartDate && this.parent.cloneProjectEndDate) {
            this.parent.cloneProjectStartDate = this.getDateFromFormat(this.parent.cloneProjectStartDate);
            this.parent.cloneProjectEndDate = this.getDateFromFormat(this.parent.cloneProjectEndDate);
            return;
        }
        const sDate: Date = typeof this.parent.projectStartDate === 'string' ?
            new Date(this.parent.projectStartDate) : this.parent.projectStartDate;
        const eDate: Date = typeof this.parent.projectEndDate === 'string' ?
            new Date(this.parent.projectEndDate) : this.parent.projectEndDate;
        const projectStartDate: Date = this.parent.timelineModule.isZooming && this.parent.cloneProjectStartDate
            ? this.getDateFromFormat(this.parent.cloneProjectStartDate) : this.getDateFromFormat(sDate);
        const projectEndDate: Date = this.parent.timelineModule.isZooming && this.parent.cloneProjectEndDate
            ? this.getDateFromFormat(this.parent.cloneProjectEndDate) : this.getDateFromFormat(eDate);
        let minStartDate: Date = null; let maxEndDate: Date = null;
        const flatData: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        let taskRange: Date[] = [];
        const addDateToList: Function = (date: Date): void => {
            if (!isNullOrUndefined(date)) {
                taskRange.push(date);
            }
        };
        const sortDates: Function = (dates: Date[]): void => {
            if (dates.length > 0) {
                dates.sort((a: Date, b: Date) => {
                    return a.getTime() - b.getTime();
                });
                minStartDate = new Date(dates[0].getTime());
                maxEndDate = dates.length > 1 ? new Date(dates[dates.length - 1].getTime()) : null;
            }
        };
        if (((!projectStartDate || !projectEndDate) && flatData.length > 0) || editArgs || this.parent.timelineModule.isZoomToFit) {
            let viewData: IGanttData[];
            if (currentViewData.length > 0 && this.parent.timelineModule.isZoomToFit &&
                this.parent.treeGrid.filterModule &&
                this.parent.treeGrid.filterModule.filteredResult.length > 0) {
                viewData = currentViewData;
            } else {
                viewData = flatData;
            }
            viewData.forEach((data: IGanttData) => {
                taskRange = [];
                const task: ITaskData = data.ganttProperties;
                let tempStartDate: Date;
                let tempEndDate: Date;
                if (isNullOrUndefined(task.startDate) && isNullOrUndefined(task.endDate)) {
                    tempStartDate = null;
                    tempEndDate = null;
                }
                else {
                    tempStartDate = this.getValidStartDate(task);
                    tempEndDate = this.getValidEndDate(task);
                }
                addDateToList(minStartDate);
                addDateToList(maxEndDate);
                addDateToList(tempStartDate);
                addDateToList(tempEndDate);
                if (this.parent.renderBaseline && !this.parent.timelineModule.isZoomToFit) {
                    addDateToList(task.baselineStartDate);
                    addDateToList(task.baselineEndDate);
                }
                if (task.indicators && task.indicators.length > 0 && !this.parent.timelineModule.isZoomToFit) {
                    task.indicators.forEach((item: IIndicator) => {
                        addDateToList(this.getDateFromFormat(item.date));
                    });
                }
                sortDates(taskRange);
            });
            taskRange = [];
            addDateToList(minStartDate);
            addDateToList(maxEndDate);
            //update schedule dates as per holiday and strip line collection
            if (this.parent.eventMarkers.length > 0 && !this.parent.timelineModule.isZoomToFit) {
                const eventMarkers: EventMarkerModel[] = this.parent.eventMarkers;
                // eslint-disable-next-line
                eventMarkers.forEach((marker: EventMarkerModel, index: number) => {
                    addDateToList(this.getDateFromFormat(marker.day));
                });
            }
            if (this.parent.totalHolidayDates.length > 0 && !this.parent.timelineModule.isZoomToFit) {
                const holidays: number[] = this.parent.totalHolidayDates;
                // eslint-disable-next-line
                holidays.forEach((holiday: number, index: number) => {
                    addDateToList(new Date(holiday));
                });
            }
            sortDates(taskRange);

            if (!minStartDate || !maxEndDate) {
                if (!minStartDate) {
                    minStartDate = isNullOrUndefined(minStartDate) ? this.getDateFromFormat(new Date()) : minStartDate;
                    minStartDate.setHours(0, 0, 0, 0);
                }
                else {
                    minStartDate = isNullOrUndefined(minStartDate) ? this.getDateFromFormat(new Date()) : minStartDate;
                }
                maxEndDate = this.getDateFromFormat(new Date(minStartDate.getTime()));
                maxEndDate.setDate(maxEndDate.getDate() + 20);
            }
        } else if ((!projectStartDate || !projectEndDate) && flatData.length === 0) {
            minStartDate = this.getDateFromFormat(new Date());
            maxEndDate = this.getDateFromFormat(new Date(minStartDate.getTime()));
        }

        if (!editArgs) {
            this.prevProjectStartDate = this.parent.cloneProjectStartDate;
            this.parent.cloneProjectStartDate = minStartDate ? (!this.parent.timelineModule.isZoomToFit) ?
                (!isNullOrUndefined(projectStartDate)) ? new Date(projectStartDate.getTime()) :
                    minStartDate : minStartDate : new Date(projectStartDate.getTime());
            this.parent.cloneProjectEndDate = maxEndDate ? (!this.parent.timelineModule.isZoomToFit) ?
                (!isNullOrUndefined(projectEndDate)) ? new Date(projectEndDate.getTime()) :
                    maxEndDate : maxEndDate : new Date(projectEndDate.getTime());
        } else {
            setValue('minStartDate', minStartDate, editArgs);
            setValue('maxEndDate', maxEndDate, editArgs);
        }
        this.parent['isProjectDateUpdated'] = true;
    }
    /**
     *
     * @param {ITaskSegment} segments .
     * @returns {number} .
     * @private
     */
    public splitTasksDuration(segments: ITaskSegment[]): number {
        let duration: number = 0;
        for (let i: number = 0; i < segments.length; i++) {
            const segment: ITaskSegment = segments[i as number];
            const sDate: Date = segment.startDate;
            const eDate: Date = segment.endDate;
            if (this.parent.timelineModule.bottomTier === 'Hour') {
                duration += Math.ceil(this.getTimeDifference(sDate, eDate) / (1000 * 60 * 60));
            }
            else if (this.parent.timelineModule.bottomTier === 'Minutes') {
                duration += Math.ceil(this.getTimeDifference(sDate, eDate) / (1000 * 60));
            }
            else {
                duration += Math.ceil(this.getTimeDifference(sDate, eDate) / (1000 * 60 * 60 * 24));
            }
        }
        return duration;
    }
}
