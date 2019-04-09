import { Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, closest, compile, createElement, deleteObject, extend, formatUnit, getValue, isNullOrUndefined, isObject, isObjectArray, isUndefined, merge, remove, removeClass, setValue } from '@syncfusion/ej2-base';
import { Dialog, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Edit, Filter, ForeignKey, Grid, Page, Predicate, Selection, Toolbar, filterAfterOpen, getActualProperties, getFilterMenuPostion, getUid, parentsUntil, setCssInGridPopUp } from '@syncfusion/ej2-grids';
import { CacheAdaptor, DataManager, DataUtil, ODataAdaptor, Query, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from '@syncfusion/ej2-data';
import { Edit as Edit$1, Filter as Filter$1, Reorder, Resize, Sort, TreeGrid } from '@syncfusion/ej2-treegrid';
import { MaskedTextBox, NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { CheckBoxSelection, ComboBox, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { Splitter } from '@syncfusion/ej2-layouts';
import { Tab, Toolbar as Toolbar$1 } from '@syncfusion/ej2-navigations';
import { Count, HtmlEditor, Link, QuickToolbar, RichTextEditor, Toolbar as Toolbar$2 } from '@syncfusion/ej2-richtexteditor';
import { CheckBox } from '@syncfusion/ej2-buttons';

/**
 * Common methods used in Gantt
 */
/** @hidden */
function parentsUntil$1(elem, selector, isID) {
    let parent = elem;
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            break;
        }
        parent = parent.parentElement;
    }
    return parent;
}
function isScheduledTask(ganttProp) {
    if (isNullOrUndefined(ganttProp.startDate) && isNullOrUndefined(ganttProp.endDate) &&
        isNullOrUndefined(ganttProp.duration)) {
        return null;
    }
    else if (isNullOrUndefined(ganttProp.startDate) || isNullOrUndefined(ganttProp.endDate) ||
        isNullOrUndefined(ganttProp.duration)) {
        return false;
    }
    else {
        return true;
    }
}
function getSwapKey(obj) {
    let temp = {};
    for (let key of Object.keys(obj)) {
        temp[obj[key]] = key;
    }
    return temp;
}
function isRemoteData(dataSource) {
    if (dataSource instanceof DataManager) {
        let adaptor = dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}
function getTaskData(records) {
    let result = [];
    for (let i = 0; i < records.length; i++) {
        let data = extend({}, records[i].taskData, {}, true);
        result.push(data);
    }
    return result;
}
function formatString(str, args) {
    let regx;
    for (let i = 0; i < args.length; i++) {
        regx = new RegExp('\\{' + (i) + '\\}', 'gm');
        str = str.replace(regx, args[i].toString());
    }
    return str;
}
/* tslint:disable-next-line */
function getIndex(value, key1, collection, key2) {
    let index = -1;
    for (let i = 0; i < collection.length; i++) {
        if (getValue(key1, collection[i]) === getValue(key1, value) && isNullOrUndefined(key2)
            || (!isNullOrUndefined(key2) && getValue(key1, collection[i]) === getValue(key1, value)
                && getValue(key2, collection[i]) === getValue(key2, value))) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * @hidden
 */
var DurationUnits;
(function (DurationUnits) {
    DurationUnits["Minute"] = "minute";
    DurationUnits["Hour"] = "hour";
    DurationUnits["Day"] = "day";
})(DurationUnits || (DurationUnits = {}));
/**
 * To define edit type value for columns
 * @hidden
 */
var EditType;
(function (EditType) {
    EditType["Boolean"] = "booleanedit";
    EditType["DropDown"] = "dropdownedit";
    EditType["DatePicker"] = "datepickeredit";
    EditType["DateTimePicker"] = "datetimepickeredit";
    EditType["Masked"] = "maskededit";
    EditType["Numeric"] = "numericedit";
    EditType["String"] = "stringedit";
})(EditType || (EditType = {}));

/**
 *
 */
class DateProcessor {
    constructor(parent) {
        this.parent = parent;
    }
    /**
     *
     */
    isValidateNonWorkDays(ganttProp) {
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
    checkStartDate(date, ganttProp, validateAsMilestone) {
        if (isNullOrUndefined(date)) {
            return null;
        }
        let cloneStartDate = new Date(date.getTime());
        let hour = this.getSecondsInDecimal(cloneStartDate);
        validateAsMilestone = isNullOrUndefined(validateAsMilestone) ? !isNullOrUndefined(ganttProp) ?
            ganttProp.isMilestone : false : validateAsMilestone;
        if (hour < this.parent.defaultStartTime) {
            this.setTime(this.parent.defaultStartTime, cloneStartDate);
        }
        else if (hour === this.parent.defaultEndTime && (!ganttProp || !validateAsMilestone)) {
            cloneStartDate.setDate(cloneStartDate.getDate() + 1);
            this.setTime(this.parent.defaultStartTime, cloneStartDate);
        }
        else if (hour > this.parent.defaultEndTime) {
            cloneStartDate.setDate(cloneStartDate.getDate() + 1);
            this.setTime(this.parent.defaultStartTime, cloneStartDate);
        }
        else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
            for (let index = 0; index < this.parent.workingTimeRanges.length; index++) {
                let value = this.parent.workingTimeRanges[index];
                if (hour >= value.to && (this.parent.workingTimeRanges[index + 1] &&
                    hour < this.parent.workingTimeRanges[index + 1].from)) {
                    // milestone can fall at end any interval time
                    if (hour === value.to && (!ganttProp || !validateAsMilestone)) {
                        this.setTime(this.parent.workingTimeRanges[index + 1].from, cloneStartDate);
                    }
                    else if (hour !== value.to) {
                        this.setTime(this.parent.workingTimeRanges[index + 1].from, cloneStartDate);
                    }
                    break;
                }
            }
        }
        let tStartDate;
        do {
            tStartDate = new Date(cloneStartDate.getTime());
            let holidayLength = this.parent.totalHolidayDates.length;
            // check holidays and weekends
            if (this.isValidateNonWorkDays(ganttProp)) {
                if (!this.parent.includeWeekend) {
                    let tempDate = new Date(cloneStartDate.getTime());
                    cloneStartDate = this.getNextWorkingDay(cloneStartDate);
                    if (tempDate.getTime() !== cloneStartDate.getTime()) {
                        this.setTime(this.parent.defaultStartTime, cloneStartDate);
                    }
                }
                for (let count = 0; count < holidayLength; count++) {
                    let holidayFrom = this.getDateFromFormat(new Date(this.parent.totalHolidayDates[count]));
                    let holidayTo = new Date(holidayFrom.getTime());
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
    checkEndDate(date, ganttProp) {
        if (isNullOrUndefined(date)) {
            return null;
        }
        let cloneEndDate = new Date(date.getTime());
        let hour = this.getSecondsInDecimal(cloneEndDate);
        if (hour > this.parent.defaultEndTime) {
            this.setTime(this.parent.defaultEndTime, cloneEndDate);
        }
        else if (hour <= this.parent.defaultStartTime) {
            cloneEndDate.setDate(cloneEndDate.getDate() - 1);
            this.setTime(this.parent.defaultEndTime, cloneEndDate);
        }
        else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
            for (let index = 0; index < this.parent.workingTimeRanges.length; index++) {
                let value = this.parent.workingTimeRanges[index];
                if (hour > value.to && (this.parent.workingTimeRanges[index + 1] &&
                    hour <= this.parent.workingTimeRanges[index + 1].from)) {
                    this.setTime(this.parent.workingTimeRanges[index].to, cloneEndDate);
                    break;
                }
            }
        }
        let tempCheckDate;
        do {
            tempCheckDate = new Date(cloneEndDate.getTime());
            let holidayLength = this.parent.totalHolidayDates.length;
            if (this.isValidateNonWorkDays(ganttProp)) {
                if (!this.parent.includeWeekend) {
                    let tempDate = new Date(cloneEndDate.getTime());
                    cloneEndDate = this.getPreviousWorkingDay(cloneEndDate);
                    if (tempDate.getTime() !== cloneEndDate.getTime()) {
                        this.setTime(this.parent.defaultEndTime, cloneEndDate);
                    }
                }
                for (let count = 0; count < holidayLength; count++) {
                    let holidayFrom = this.getDateFromFormat(new Date(this.parent.totalHolidayDates[count]));
                    let holidayTo = new Date(holidayFrom.getTime());
                    let tempHoliday = new Date(cloneEndDate.getTime());
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
    checkBaselineStartDate(date) {
        if (isNullOrUndefined(date)) {
            return null;
        }
        else {
            let cloneDate = new Date(date.getTime());
            let hour = this.getSecondsInDecimal(cloneDate);
            if (hour < this.parent.defaultStartTime) {
                this.setTime(this.parent.defaultStartTime, cloneDate);
            }
            else if (hour >= this.parent.defaultEndTime) {
                cloneDate.setDate(cloneDate.getDate() + 1);
                this.setTime(this.parent.defaultStartTime, cloneDate);
            }
            else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
                for (let i = 0; i < this.parent.workingTimeRanges.length; i++) {
                    let value = this.parent.workingTimeRanges[i];
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
    checkBaselineEndDate(date) {
        if (isNullOrUndefined(date)) {
            return null;
        }
        else {
            let cloneDate = new Date(date.getTime());
            let hour = this.getSecondsInDecimal(cloneDate);
            if (hour > this.parent.defaultEndTime) {
                this.setTime(this.parent.defaultEndTime, cloneDate);
            }
            else if (hour <= this.parent.defaultStartTime) {
                cloneDate.setDate(cloneDate.getDate() - 1);
                this.setTime(this.parent.defaultEndTime, cloneDate);
            }
            else if (hour > this.parent.defaultStartTime && hour < this.parent.defaultEndTime) {
                for (let i = 0; i < this.parent.workingTimeRanges.length; i++) {
                    let value = this.parent.workingTimeRanges[i];
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
    calculateStartDate(ganttData) {
        let ganttProp = ganttData.ganttProperties;
        let tempStartDate = null;
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
    calculateEndDate(ganttData) {
        let ganttProp = ganttData.ganttProperties;
        let tempEndDate = null;
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
     * @param ganttData
     */
    calculateDuration(ganttData) {
        let ganttProperties = ganttData.ganttProperties;
        let tDuration = this.getDuration(ganttProperties.startDate, ganttProperties.endDate, ganttProperties.durationUnit, ganttProperties.isAutoSchedule);
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
    getNonworkingTime(sDate, eDate, isAutoSchedule, isCheckTimeZone) {
        isCheckTimeZone = isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
        let timeDiff = this.getTimeDifference(sDate, eDate, isCheckTimeZone) / 1000; // To convert milliseconds to seconds
        let weekendCount = !this.parent.includeWeekend && isAutoSchedule ? this.getWeekendCount(sDate, eDate) : 0;
        let totalHours = this.getNumberOfSeconds(sDate, eDate, isCheckTimeZone);
        let holidaysCount = isAutoSchedule ? this.getHolidaysCount(sDate, eDate) : 0;
        let totWorkDays = (totalHours - (weekendCount * 86400) - (holidaysCount * 86400)) / 86400; // working days between two dates
        let nonWorkHours = this.getNonWorkingSecondsOnDate(sDate, eDate);
        let totalNonWorkTime = (totWorkDays * (86400 - this.parent.secondsPerDay)) +
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
    getDuration(startDate, endDate, durationUnit, isAutoSchedule, isCheckTimeZone) {
        if (isNullOrUndefined(startDate) || isNullOrUndefined(endDate)) {
            return null;
        }
        isCheckTimeZone = isNullOrUndefined(isCheckTimeZone) ? true : isCheckTimeZone;
        let durationValue = 0;
        let timeDiff = this.getTimeDifference(startDate, endDate, isCheckTimeZone) / 1000;
        let nonWorkHours = this.getNonworkingTime(startDate, endDate, isAutoSchedule, isCheckTimeZone);
        let durationHours = timeDiff - nonWorkHours;
        if (!durationUnit || durationUnit === DurationUnits.Day) {
            durationValue = durationHours / this.parent.secondsPerDay;
        }
        else if (durationUnit === DurationUnits.Minute) {
            durationValue = durationHours / 60;
        }
        else {
            durationValue = durationHours / 3600;
        }
        return parseFloat(durationValue.toString());
    }
    /**
     *
     * @param duration
     * @param durationUnit
     */
    getDurationAsSeconds(duration, durationUnit) {
        let value = 0;
        if (!durationUnit || durationUnit === DurationUnits.Day.toString()) {
            value = this.parent.secondsPerDay * duration;
        }
        else if (durationUnit === DurationUnits.Hour.toString()) {
            value = duration * 3600;
        }
        else {
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
    getEndDate(startDate, duration, durationUnit, ganttProp, validateAsMilestone) {
        let tempStart = new Date(startDate.getTime());
        let endDate = new Date(startDate.getTime());
        let secondDuration = this.getDurationAsSeconds(duration, durationUnit);
        let nonWork = 0;
        let workHours = 0;
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
    getStartDate(endDate, duration, durationUnit, ganttProp) {
        let tempEnd = new Date(endDate.getTime());
        let startDate = new Date(endDate.getTime());
        let secondDuration = this.getDurationAsSeconds(duration, durationUnit);
        let nonWork = 0;
        let workHours = 0;
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
    getProjectStartDate(ganttProp, isLoad) {
        if (!isNullOrUndefined(this.parent.cloneProjectStartDate)) {
            let cloneStartDate = this.checkStartDate(this.parent.cloneProjectStartDate);
            this.parent.cloneProjectStartDate = cloneStartDate;
            return new Date(cloneStartDate.getTime());
        }
        else if (!isNullOrUndefined(this.parent.projectStartDate)) {
            let cloneStartDate = this.getDateFromFormat(this.parent.projectStartDate);
            this.parent.cloneProjectStartDate = this.checkStartDate(cloneStartDate);
        }
        else if (!isNullOrUndefined(isLoad)) {
            let flatData = this.parent.flatData;
            let minStartDate = flatData[0].ganttProperties.startDate;
            for (let index = 1; index < flatData.length; index++) {
                let startDate = flatData[index].ganttProperties.startDate;
                if (!isNullOrUndefined(startDate) && this.compareDates(startDate, minStartDate) === -1) {
                    minStartDate = startDate;
                }
            }
            this.parent.cloneProjectStartDate = this.checkStartDate(minStartDate, ganttProp);
        }
        else {
            return null;
        }
        return new Date(this.parent.cloneProjectStartDate.getTime());
    }
    /**
     * @private
     * @param ganttProp
     */
    getValidStartDate(ganttProp) {
        let sDate = null;
        if (isNullOrUndefined(ganttProp.startDate)) {
            if (!isNullOrUndefined(ganttProp.endDate)) {
                sDate = new Date(ganttProp.endDate.getTime());
                this.setTime(this.parent.defaultStartTime, sDate);
            }
            else if (!isNullOrUndefined(ganttProp.duration)) {
                sDate = this.getProjectStartDate(ganttProp);
            }
        }
        else {
            sDate = new Date(ganttProp.startDate.getTime());
        }
        return sDate;
    }
    /**
     *
     * @param ganttProp
     * @private
     */
    getValidEndDate(ganttProp) {
        let eDate = null;
        if (isNullOrUndefined(ganttProp.endDate)) {
            if (!isNullOrUndefined(ganttProp.startDate)) {
                if (ganttProp.isMilestone) {
                    eDate = this.checkStartDate(ganttProp.startDate);
                }
                else {
                    eDate = new Date(ganttProp.startDate.getTime());
                    this.setTime(this.parent.defaultEndTime, eDate);
                }
            }
            else if (!isNullOrUndefined(ganttProp.duration)) {
                let sDate = this.getValidStartDate(ganttProp);
                if (sDate) {
                    eDate = this.getEndDate(sDate, ganttProp.duration, ganttProp.durationUnit, ganttProp, false);
                }
            }
        }
        else {
            eDate = new Date(ganttProp.endDate.getTime());
        }
        return eDate;
    }
    /**
     * @private
     */
    getSecondsPerDay() {
        let dayWorkingTime = this.parent.dayWorkingTime;
        let length = dayWorkingTime.length;
        let totalSeconds = 0;
        let startDate = new Date('10/11/2018');
        let endDate = new Date('10/12/2018');
        let nonWorkingHours = this.parent.nonWorkingHours;
        let workingTimeRanges = this.parent.workingTimeRanges;
        let nonWorkingTimeRanges = this.parent.nonWorkingTimeRanges;
        for (let count = 0; count < length; count++) {
            let currentRange = dayWorkingTime[count];
            if (!isNullOrUndefined(currentRange.from) && !isNullOrUndefined(currentRange.to)) {
                startDate.setHours(currentRange.from);
                let startHour = new Date(startDate.getTime());
                let tempDate = currentRange.to !== 0 ? startDate : endDate;
                tempDate.setHours(currentRange.to);
                let endHour = new Date(tempDate.getTime());
                let timeDiff = endHour.getTime() - startHour.getTime();
                let sdSeconds = this.getSecondsInDecimal(startHour);
                let edSeconds = this.getSecondsInDecimal(endHour);
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
                }
                else {
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
    getDurationValue(value, isFromDialog) {
        let durationUnit = null;
        let duration = null;
        if (typeof value === 'string') {
            let values = value.match(/(\d*\.*\d+|[A-z]+)/g);
            if (values && values.length <= 2) {
                duration = parseFloat(values[0].toString());
                let unit = values[1] ? values[1].toString().toLowerCase() : null;
                if (getValue('minute', this.parent.durationUnitEditText).indexOf(unit) !== -1) {
                    durationUnit = DurationUnits.Minute.toString();
                }
                else if (getValue('hour', this.parent.durationUnitEditText).indexOf(unit) !== -1) {
                    durationUnit = DurationUnits.Hour.toString();
                }
                else if (getValue('day', this.parent.durationUnitEditText).indexOf(unit) !== -1) {
                    durationUnit = DurationUnits.Day.toString();
                }
            }
        }
        else {
            duration = value;
            durationUnit = null;
        }
        let output = {
            duration: duration,
            durationUnit: durationUnit
        };
        return output;
    }
    /**
     *
     * @param date
     */
    getNextWorkingDay(date) {
        let dayIndex = date.getDay();
        if (this.parent.nonWorkingDayIndex.indexOf(dayIndex) !== -1) {
            date.setDate(date.getDate() + 1);
            date = this.getNextWorkingDay(date);
            return date;
        }
        else {
            return date;
        }
    }
    /**
     * get weekend days between two dates without including args dates
     * @param startDate
     * @param endDate
     */
    getWeekendCount(startDate, endDate) {
        let weekendCount = 0;
        let sDate = new Date(startDate.getTime());
        let eDate = new Date(endDate.getTime());
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
    getNumberOfSeconds(startDate, endDate, isCheckTimeZone) {
        let sDate = new Date(startDate.getTime());
        let eDate = new Date(endDate.getTime());
        let timeDiff = 0;
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
    getHolidaysCount(startDate, endDate) {
        let holidaysCount = 0;
        let holidays = this.parent.totalHolidayDates;
        let sDate = new Date(startDate.getTime());
        let eDate = new Date(endDate.getTime());
        sDate.setDate(sDate.getDate() + 1);
        sDate.setHours(0, 0, 0, 0);
        eDate.setHours(0, 0, 0, 0);
        if (sDate.getTime() < eDate.getTime()) {
            for (let i = 0; i < holidays.length; i++) {
                let currentHoliday = this.getDateFromFormat(new Date(holidays[i]));
                if (sDate.getTime() <= currentHoliday.getTime() && eDate.getTime() >= currentHoliday.getTime()) {
                    if (!this.parent.includeWeekend && this.parent.nonWorkingDayIndex.indexOf(currentHoliday.getDay()) === -1) {
                        holidaysCount += 1;
                    }
                    else if (this.parent.includeWeekend) {
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
    getHolidayDates() {
        let holidays = this.parent.holidays;
        let holidayDates = [];
        for (let i = 0; i < holidays.length; i++) {
            let from = this.getDateFromFormat(holidays[i].from);
            let to = this.getDateFromFormat(holidays[i].to);
            if (isNullOrUndefined(from) && isNullOrUndefined(to)) {
                continue;
            }
            else if (isNullOrUndefined(from) || isNullOrUndefined(to)) {
                let tempDate = from ? from : to;
                tempDate.setHours(0, 0, 0, 0);
                if (holidayDates.indexOf(tempDate.getTime()) === -1) {
                    holidayDates.push(tempDate.getTime());
                }
            }
            else {
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
    isOnHolidayOrWeekEnd(date, checkWeekEnd) {
        checkWeekEnd = !isNullOrUndefined(checkWeekEnd) ? checkWeekEnd : this.parent.includeWeekend;
        if (!checkWeekEnd && this.parent.nonWorkingDayIndex.indexOf(date.getDay()) !== -1) {
            return true;
        }
        let holidays = this.parent.totalHolidayDates;
        for (let count = 0; count < holidays.length; count++) {
            let holidayFrom = this.getDateFromFormat(new Date(holidays[count]));
            let holidayTo = new Date(holidayFrom.getTime());
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
    getNonWorkingSecondsOnDate(startDate, endDate) {
        let sHour = this.getSecondsInDecimal(startDate);
        let eHour = this.getSecondsInDecimal(endDate);
        let startRangeIndex = -1;
        let endRangeIndex = -1;
        let totNonWrkSecs = 0;
        let startOnHoliday = this.isOnHolidayOrWeekEnd(startDate, null);
        let endOnHoliday = this.isOnHolidayOrWeekEnd(endDate, null);
        for (let i = 0; i < this.parent.nonWorkingTimeRanges.length; i++) {
            let val = this.parent.nonWorkingTimeRanges[i];
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
                for (let i = startRangeIndex; i < this.parent.nonWorkingTimeRanges.length; i++) {
                    if (!this.parent.nonWorkingTimeRanges[i].isWorking) {
                        if (i === startRangeIndex) {
                            totNonWrkSecs += (this.parent.nonWorkingTimeRanges[i].to - sHour);
                        }
                        else {
                            totNonWrkSecs += (this.parent.nonWorkingTimeRanges[i].interval);
                        }
                    }
                }
            }
            else {
                totNonWrkSecs += (86400 - sHour);
            }
            if (!endOnHoliday) {
                for (let i = 0; i <= endRangeIndex; i++) {
                    if (!this.parent.nonWorkingTimeRanges[i].isWorking) {
                        if (i === endRangeIndex) {
                            totNonWrkSecs += (eHour - this.parent.nonWorkingTimeRanges[i].from);
                        }
                        else {
                            totNonWrkSecs += this.parent.nonWorkingTimeRanges[i].interval;
                        }
                    }
                }
            }
            else {
                totNonWrkSecs += eHour;
            }
        }
        else {
            if (startRangeIndex !== endRangeIndex) {
                if (!endOnHoliday) {
                    for (let i = startRangeIndex; i <= endRangeIndex; i++) {
                        if (!this.parent.nonWorkingTimeRanges[i].isWorking) {
                            if (i === startRangeIndex) {
                                totNonWrkSecs += (this.parent.nonWorkingTimeRanges[i].to - sHour);
                            }
                            else if (i === endRangeIndex) {
                                totNonWrkSecs += (eHour - this.parent.nonWorkingTimeRanges[i].from);
                            }
                            else {
                                totNonWrkSecs += this.parent.nonWorkingTimeRanges[i].interval;
                            }
                        }
                    }
                }
                else {
                    totNonWrkSecs += (eHour - sHour);
                }
            }
            else {
                if (!endOnHoliday) {
                    let range = this.parent.nonWorkingTimeRanges[startRangeIndex];
                    if (!range.isWorking) {
                        totNonWrkSecs = eHour - sHour;
                    }
                }
                else {
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
    getPreviousWorkingDay(date) {
        let dayIndex = date.getDay();
        let previousIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
        if (this.parent.nonWorkingDayIndex.indexOf(dayIndex) !== -1 || (this.parent.nonWorkingDayIndex.indexOf(previousIndex) !== -1
            && this.parent.defaultEndTime === 86400 && this.getSecondsInDecimal(date) === 0)) {
            date.setDate(date.getDate() - 1);
            if (this.parent.nonWorkingDayIndex.indexOf(date.getDay()) !== -1) {
                date = this.getPreviousWorkingDay(date);
            }
            return date;
        }
        else {
            return date;
        }
    }
    /**
     * To get non-working day indexes.
     * @return {void}
     * @private
     */
    getNonWorkingDayIndex() {
        let weekDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let weekDayLength = weekDay.length;
        if (this.parent.workWeek.length === 0) {
            this.parent.workWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        }
        let workWeek = this.parent.workWeek.slice();
        let length = workWeek.length;
        for (let i = 0; i < length; i++) {
            workWeek[i] = workWeek[i].toLowerCase();
        }
        this.parent.nonWorkingDayIndex = [];
        for (let i = 0; i < weekDayLength; i++) {
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
    setTime(seconds, date) {
        let hour = seconds / 3600;
        let min = (seconds - (hour * 3600)) / 60;
        let sec = seconds - (hour * 3600) - (min * 60);
        date.setHours(hour, min, sec);
    }
    /**
     *
     */
    getTimeDifference(startDate, endDate, isCheckTimeZone) {
        let sDate = new Date(startDate.getTime());
        let eDate = new Date(endDate.getTime());
        if (isCheckTimeZone) {
            this.updateDateWithTimeZone(sDate, eDate);
        }
        return eDate.getTime() - sDate.getTime();
    }
    /**
     *
     */
    updateDateWithTimeZone(sDate, eDate) {
        let sTZ = sDate.getTimezoneOffset();
        let eTZ = eDate.getTimezoneOffset();
        let uTZ;
        let uDate;
        if (sTZ !== eTZ) {
            let standardTZ = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
            if (standardTZ !== sTZ) {
                uDate = sDate;
                uTZ = sTZ;
            }
            else if (standardTZ !== eTZ) {
                uDate = eDate;
                uTZ = eTZ;
            }
            if (standardTZ < 0) {
                let tzDiff = standardTZ - uTZ;
                uDate.setTime(uDate.getTime() + (tzDiff * 60 * 1000));
            }
            else if (standardTZ > 0) {
                let tzDiff = uTZ - standardTZ;
                uDate.setTime(uDate.getTime() - (tzDiff * 60 * 1000));
            }
        }
    }
    /**
     *
     * @param date
     */
    getSecondsInDecimal(date) {
        return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds() + (date.getMilliseconds() / 1000);
    }
    /**
     * @param date
     * @private
     */
    getDateFromFormat(date) {
        if (isNullOrUndefined(date)) {
            return null;
        }
        else if (date instanceof Date) {
            return new Date(date.getTime());
        }
        else {
            let dateObject = this.parent.globalize.parseDate(date, { format: 'MM/dd/yyyy hh:mm a', type: 'dateTime' });
            return isNullOrUndefined(dateObject) ? new Date(date) : dateObject;
        }
    }
    /**
     * @private
     */
    compareDates(date1, date2) {
        if (!isNullOrUndefined(date1) && !isNullOrUndefined(date2)) {
            return (date1.getTime() > date2.getTime()) ? 1 : (date1.getTime() < date2.getTime()) ? -1 : 0;
        }
        else if (!isNullOrUndefined(date1) && isNullOrUndefined(date2)) {
            return 1;
        }
        else if (isNullOrUndefined(date1) && !isNullOrUndefined(date2)) {
            return -1;
        }
        else {
            return null;
        }
    }
    /**
     *
     * @param duration
     * @param durationUnit
     * @private
     */
    getDurationString(duration, durationUnit) {
        let value = '';
        if (!isNullOrUndefined(duration)) {
            value += parseFloat(duration.toFixed(2)) + ' ';
            if (!isNullOrUndefined(durationUnit)) {
                let plural = duration !== 1;
                if (durationUnit === DurationUnits.Day) {
                    value += plural ? this.parent.localeObj.getConstant('days') : this.parent.localeObj.getConstant(DurationUnits.Day);
                }
                else if (durationUnit === DurationUnits.Hour) {
                    value += plural ? this.parent.localeObj.getConstant('hours') : this.parent.localeObj.getConstant(DurationUnits.Hour);
                }
                else if (durationUnit === DurationUnits.Minute) {
                    value += plural ? this.parent.localeObj.getConstant('minutes') :
                        this.parent.localeObj.getConstant(DurationUnits.Minute);
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
    calculateProjectDates(editArgs) {
        let projectStartDate = this.getDateFromFormat(this.parent.projectStartDate);
        let projectEndDate = this.getDateFromFormat(this.parent.projectEndDate);
        let minStartDate = null;
        let maxEndDate = null;
        let flatData = this.parent.flatData;
        if (((!projectStartDate || !projectEndDate) && flatData.length > 0) || editArgs) {
            flatData.forEach((data, index) => {
                let task = data.ganttProperties;
                let tempStartDate = this.getValidStartDate(task);
                let tempEndDate = this.getValidEndDate(task);
                let baselineStartDate = task.baselineStartDate ? new Date(task.baselineStartDate.getTime()) : null;
                let baselineEndDate = task.baselineEndDate ? new Date(task.baselineEndDate.getTime()) : null;
                if (minStartDate) {
                    if (tempStartDate && this.compareDates(minStartDate, tempStartDate) === 1) {
                        minStartDate = tempStartDate;
                    }
                    if (baselineStartDate && this.parent.renderBaseline && this.compareDates(minStartDate, baselineStartDate) === 1) {
                        minStartDate = baselineStartDate;
                    }
                    else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(minStartDate, baselineEndDate) === 1) {
                        minStartDate = baselineEndDate;
                    }
                }
                else {
                    if (baselineStartDate && this.parent.renderBaseline && this.compareDates(tempStartDate, baselineStartDate) === 1) {
                        minStartDate = baselineStartDate;
                    }
                    else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(tempStartDate, baselineEndDate) === 1) {
                        minStartDate = baselineEndDate;
                    }
                    else {
                        minStartDate = tempStartDate;
                    }
                }
                if (maxEndDate) {
                    if (tempEndDate && this.compareDates(maxEndDate, tempEndDate) === -1) {
                        maxEndDate = tempEndDate;
                    }
                    if (baselineEndDate && this.parent.renderBaseline && this.compareDates(maxEndDate, baselineEndDate) === -1) {
                        maxEndDate = baselineStartDate;
                    }
                    else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(maxEndDate, baselineStartDate) === -1) {
                        maxEndDate = baselineEndDate;
                    }
                }
                else {
                    if (baselineEndDate && this.parent.renderBaseline && this.compareDates(tempEndDate, baselineEndDate) === -1) {
                        maxEndDate = baselineStartDate;
                    }
                    else if (baselineEndDate && this.parent.renderBaseline && this.compareDates(tempEndDate, baselineStartDate) === -1) {
                        maxEndDate = baselineEndDate;
                    }
                    else {
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
        }
        else if ((!projectStartDate || !projectEndDate) && flatData.length === 0) {
            minStartDate = this.getDateFromFormat(new Date());
            maxEndDate = this.getDateFromFormat(new Date(minStartDate.getTime()));
        }
        if (!editArgs) {
            this.parent.cloneProjectStartDate = minStartDate ? minStartDate : new Date(projectStartDate.getTime());
            this.parent.cloneProjectEndDate = maxEndDate ? maxEndDate : new Date(projectEndDate.getTime());
        }
        else {
            setValue('minStartDate', minStartDate, editArgs);
            setValue('maxEndDate', maxEndDate, editArgs);
        }
    }
    /**
     *
     * @param startDate
     * @param endDate
     */
    updateProjectDatesByEventMarker(startDate, endDate) {
        let eventMarker = this.parent.eventMarkers;
        if (eventMarker && eventMarker.length > 0) {
            for (let index = 0; index < eventMarker.length; index++) {
                let day = this.getDateFromFormat(eventMarker[index].day);
                if (!(day.getTime() > startDate.getTime()) || !(day.getTime() < endDate.getTime())) {
                    if (day.getTime() < startDate.getTime()) {
                        startDate = new Date(day.getTime());
                    }
                    else {
                        endDate = new Date(day.getTime());
                    }
                }
            }
        }
    }
    updateProjectDatesByHolidays(startDate, endDate) {
        let holidayList = this.parent.totalHolidayDates;
        if (holidayList && holidayList.length > 0) {
            for (let i = 0; i < holidayList.length; i++) {
                let holiday = this.getDateFromFormat(new Date(holidayList[i]));
                if (!(holiday.getTime() > startDate.getTime()) || !(holiday.getTime() < endDate.getTime())) {
                    if (holiday.getTime() < startDate.getTime()) {
                        startDate = new Date(holiday.getTime());
                    }
                    else {
                        endDate = new Date(holiday.getTime());
                    }
                }
            }
        }
    }
}

/**
 * To calculate and update task related values
 */
class TaskProcessor extends DateProcessor {
    constructor(parent) {
        super(parent);
        this.recordIndex = 0;
        this.taskIds = [];
        this.hierarchyData = [];
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on('beforeDataManipulate', this.checkDataBinding.bind(this));
    }
    /**
     * @private
     */
    checkDataBinding() {
        if (isNullOrUndefined(this.parent.dataSource)) {
            this.parent.dataSource = [];
            this.parent.renderGantt();
        }
        else if (this.parent.dataSource instanceof DataManager) {
            this.initDataSource();
        }
        else if (this.parent.dataSource.length > 0) {
            this.dataArray = this.parent.dataSource;
            this.cloneDataSource();
            this.parent.renderGantt();
        }
        else {
            this.parent.renderGantt();
        }
    }
    initDataSource() {
        let queryManager = this.parent.query instanceof Query ? this.parent.query : new Query();
        queryManager.requiresCount();
        let dataManager = this.parent.dataSource;
        dataManager.executeQuery(queryManager).then((e) => {
            this.dataArray = e.result;
            this.cloneDataSource();
            this.parent.renderGantt();
        }).catch((e) => {
            // Trigger action failure event
            this.parent.renderGantt();
            this.parent.trigger('actionFailure', { error: e });
        });
    }
    constructDataSource(dataSource) {
        let mappingData = new DataManager(dataSource).executeLocal(new Query()
            .group(this.parent.taskFields.parentID));
        let rootData = [];
        for (let i = 0; i < mappingData.length; i++) {
            let groupData = mappingData[i];
            if (!isNullOrUndefined(groupData.key)) {
                let index = this.taskIds.indexOf(groupData.key.toString());
                if (index > -1) {
                    if (!isNullOrUndefined(groupData.key)) {
                        dataSource[index][this.parent.taskFields.child] = groupData.items;
                        continue;
                    }
                }
            }
            rootData.push.apply(rootData, groupData.items);
        }
        this.hierarchyData = this.dataReorder(dataSource, rootData);
    }
    cloneDataSource() {
        let taskIdMapping = this.parent.taskFields.id;
        let parentIdMapping = this.parent.taskFields.parentID;
        if (!isNullOrUndefined(taskIdMapping) && !isNullOrUndefined(parentIdMapping)) {
            let data = [];
            for (let i = 0; i < this.dataArray.length; i++) {
                let tempData = this.dataArray[i];
                data.push(extend({}, {}, tempData, true));
                if (!isNullOrUndefined(tempData[taskIdMapping])) {
                    this.taskIds.push(tempData[taskIdMapping].toString());
                }
            }
            if (!this.parent.taskFields.child) {
                this.parent.taskFields.child = 'Children';
            }
            this.constructDataSource(data);
            this.prepareDataSource(this.hierarchyData);
        }
        else {
            this.prepareDataSource(this.dataArray);
        }
    }
    /**
     * Function to manipulate data-source
     * @hidden
     */
    prepareDataSource(data) {
        this.prepareRecordCollection(data, 0);
        if (this.parent.taskFields.dependency) {
            this.parent.predecessorModule.ensurePredecessorCollection();
        }
    }
    prepareRecordCollection(data, level, parentItem) {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let tempData = data[i];
            let ganttData = this.createRecord(tempData, level, parentItem, true);
            ganttData.index = this.recordIndex++;
            this.parent.ids[ganttData.index] = ganttData.ganttProperties.taskId.toString();
            this.parent.flatData.push(ganttData);
            let childData = tempData[this.parent.taskFields.child];
            if (!isNullOrUndefined(childData) && childData.length > 0) {
                this.prepareRecordCollection(childData, ganttData.level + 1, ganttData);
            }
        }
    }
    /**
     * Method to update custom field values in gantt record
     */
    addCustomFieldValue(data, ganttRecord) {
        let columns = this.parent.ganttColumns;
        let length = columns.length;
        if (length) {
            for (let i = 0; i < length; i++) {
                if (ganttRecord[columns[i].field] === undefined) {
                    this.parent.setRecordValue(columns[i].field, data[columns[i].field], ganttRecord);
                }
            }
        }
    }
    /**
     * To populate Gantt record
     * @param data
     * @param level
     * @param parentItem
     * @param isLoad
     * @private
     */
    createRecord(data, level, parentItem, isLoad) {
        let taskSettings = this.parent.taskFields;
        let child = data[taskSettings.child];
        let progress = data[taskSettings.progress];
        progress = progress ? parseFloat(progress.toString()) ? parseFloat(progress.toString()) : 0 : 0;
        let predecessors = data[taskSettings.dependency];
        let baselineStartDate = this.getDateFromFormat(data[taskSettings.baselineStartDate]);
        let baselineEndDate = this.getDateFromFormat(data[taskSettings.baselineEndDate]);
        let ganttData = {};
        let ganttProperties = {};
        this.parent.setRecordValue('ganttProperties', ganttProperties, ganttData);
        this.parent.setRecordValue('taskId', data[taskSettings.id], ganttProperties, true);
        this.parent.setRecordValue('taskName', data[taskSettings.name], ganttProperties, true);
        this.addTaskData(ganttData, data, isLoad);
        this.addCustomFieldValue(data, ganttData);
        this.parent.setRecordValue('isAutoSchedule', true, ganttProperties, true);
        this.parent.setRecordValue('resourceInfo', this.setResourceInfo(data), ganttProperties, true);
        this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
        this.updateResourceName(ganttData);
        this.calculateScheduledValues(ganttData, data, isLoad);
        this.parent.setRecordValue('baselineStartDate', this.checkBaselineStartDate(baselineStartDate), ganttProperties, true);
        // set default end time, if hour is 0
        if (baselineEndDate && baselineEndDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.setTime(this.parent.defaultEndTime, baselineEndDate);
        }
        this.parent.setRecordValue('baselineEndDate', this.checkBaselineEndDate(baselineEndDate), ganttProperties, true);
        this.parent.setRecordValue('progress', progress, ganttProperties, true);
        this.parent.setRecordValue('totalProgress', progress, ganttProperties, true);
        this.parent.setRecordValue('predecessorsName', predecessors, ganttProperties, true);
        this.parent.setRecordValue('indicators', data[taskSettings.indicators], ganttProperties, true);
        this.parent.setRecordValue('notes', data[taskSettings.notes], ganttProperties, true);
        this.parent.setRecordValue('cssClass', data[taskSettings.cssClass], ganttProperties, true);
        this.parent.setRecordValue('parentItem', this.getCloneParent(parentItem), ganttData);
        let parentUniqId = ganttData.parentItem ? ganttData.parentItem.uniqueID : null;
        this.parent.setRecordValue('parentUniqueID', parentUniqId, ganttData);
        this.parent.setRecordValue('level', level, ganttData);
        this.parent.setRecordValue('uniqueID', getUid(this.parent.element.id + '_data_'), ganttData);
        this.parent.setRecordValue('uniqueID', ganttData.uniqueID, ganttProperties, true);
        this.parent.setRecordValue('childRecords', [], ganttData);
        this.parent.setRecordValue('baselineEndDate', this.checkBaselineEndDate(baselineEndDate), ganttProperties, true);
        if (!isNullOrUndefined(data[taskSettings.child]) && data[taskSettings.child].length > 0) {
            this.parent.setRecordValue('hasChildRecords', true, ganttData);
            this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
        }
        else {
            this.parent.setRecordValue('hasChildRecords', false, ganttData);
        }
        this.parent.setRecordValue('expanded', this.parent.collapseAllParentTasks ? false : true, ganttData);
        this.updateExpandStateMappingValue(ganttData, data);
        if (!isLoad) {
            this.parent.setRecordValue('width', this.calculateWidth(ganttProperties), ganttProperties, true);
            this.parent.setRecordValue('left', this.calculateLeft(ganttProperties), ganttProperties, true);
            this.parent.setRecordValue('progressWidth', this.getProgressWidth(ganttProperties.width, progress), ganttProperties, true);
            if (ganttProperties.baselineEndDate && ganttProperties.baselineStartDate) {
                this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(ganttProperties), ganttProperties, true);
                this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(ganttProperties), ganttProperties, true);
            }
        }
        this.updateTaskData(ganttData);
        if (!isNullOrUndefined(parentItem)) {
            parentItem.childRecords.push(ganttData);
        }
        if (predecessors) {
            this.parent.predecessorsCollection.push(ganttData);
        }
        return ganttData;
    }
    /**
     *
     * @param record
     * @param parent
     * @private
     */
    getCloneParent(parent) {
        if (!isNullOrUndefined(parent)) {
            let cloneParent = {};
            cloneParent.uniqueID = parent.uniqueID;
            cloneParent.expanded = parent.expanded;
            cloneParent.level = parent.level;
            cloneParent.index = parent.index;
            cloneParent.taskId = parent.ganttProperties.taskId;
            return cloneParent;
        }
        else {
            return null;
        }
    }
    addTaskData(ganttData, data, isLoad) {
        let taskSettings = this.parent.taskFields;
        let dataManager = this.parent.dataSource;
        if (isLoad) {
            if (taskSettings.parentID || (dataManager instanceof DataManager &&
                dataManager.dataSource.json && dataManager.dataSource.offline)) {
                if (taskSettings.parentID) {
                    let id = data[taskSettings.id];
                    let index = this.taskIds.indexOf(id);
                    let tempData = (index > -1) ? this.dataArray[index] : {};
                    this.parent.setRecordValue('taskData', tempData, ganttData);
                }
                else {
                    this.parent.setRecordValue('taskData', data, ganttData);
                }
            }
            else {
                this.parent.setRecordValue('taskData', data, ganttData);
            }
        }
        else {
            this.parent.setRecordValue('taskData', data, ganttData);
        }
    }
    updateExpandStateMappingValue(ganttData, data) {
        let expandStateMapping = this.parent.taskFields.expandState;
        let mappingValue = data[expandStateMapping];
        let updatableValue;
        if (expandStateMapping && ganttData.hasChildRecords) {
            if (!isNullOrUndefined(mappingValue)) {
                updatableValue = mappingValue.toString() === 'true' ? true : false;
            }
            else if (isNullOrUndefined(mappingValue) && !this.parent.collapseAllParentTasks) {
                updatableValue = true;
            }
            else if (isNullOrUndefined(mappingValue) && this.parent.collapseAllParentTasks) {
                updatableValue = false;
            }
            this.parent.setRecordValue('taskData.' + expandStateMapping, updatableValue, ganttData);
            this.parent.setRecordValue('expandStateMapping', updatableValue, ganttData);
            this.parent.setRecordValue('expanded', updatableValue, ganttData);
        }
    }
    /**
     *
     * @param ganttData
     * @param data
     * @param isLoad
     * @private
     */
    calculateScheduledValues(ganttData, data, isLoad) {
        let taskSettings = this.parent.taskFields;
        let ganttProperties = ganttData.ganttProperties;
        let duration = data[taskSettings.duration];
        duration = isNullOrUndefined(duration) || duration === '' ? null : duration;
        let startDate = this.getDateFromFormat(data[taskSettings.startDate]);
        let endDate = this.getDateFromFormat(data[taskSettings.endDate]);
        let isMileStone = taskSettings.milestone ? data[taskSettings.milestone] ? true : false : false;
        let durationMapping = data[taskSettings.durationUnit] ? data[taskSettings.durationUnit] : '';
        this.parent.setRecordValue('durationUnit', this.validateDurationUnitMapping(durationMapping), ganttProperties, true);
        if (!endDate && !startDate && (isNullOrUndefined(duration) || duration === '')) {
            if (this.parent.allowUnscheduledTasks) {
                return;
            }
            else {
                this.parent.setRecordValue('duration', 1, ganttProperties, true);
                this.parent.setRecordValue('startDate', this.getProjectStartDate(ganttProperties, isLoad), ganttProperties, true);
                this.calculateEndDate(ganttData);
            }
        }
        else if (startDate) {
            this.calculateDateFromStartDate(startDate, endDate, duration, ganttData);
        }
        else if (endDate) {
            this.calculateDateFromEndDate(endDate, duration, ganttData);
        }
        else if (!isNullOrUndefined(duration) && duration !== '') {
            this.updateDurationValue(duration, ganttProperties);
            if (this.parent.allowUnscheduledTasks) {
                this.parent.setRecordValue('startDate', null, ganttProperties, true);
                this.parent.setRecordValue('endDate', null, ganttProperties, true);
            }
            else {
                this.parent.setRecordValue('startDate', this.getProjectStartDate(ganttProperties, isLoad), ganttProperties, true);
                this.calculateEndDate(ganttData);
            }
        }
        if (ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
        if (!isNullOrUndefined(isMileStone) && isMileStone) {
            this.parent.setRecordValue('duration', 0, ganttProperties, true);
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
    }
    calculateDateFromEndDate(endDate, duration, ganttData) {
        let ganttProperties = ganttData.ganttProperties;
        if (endDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.setTime(this.parent.defaultEndTime, endDate);
        }
        this.parent.setRecordValue('endDate', this.checkEndDate(endDate, ganttData.ganttProperties), ganttProperties, true);
        if (isNullOrUndefined(duration) || duration === '') {
            if (this.parent.allowUnscheduledTasks) {
                this.parent.setRecordValue('startDate', null, ganttProperties, true);
                this.parent.setRecordValue('duration', null, ganttProperties, true);
            }
            else {
                this.parent.setRecordValue('duration', 1, ganttProperties, true);
                this.parent.setRecordValue('startDate', this.getStartDate(ganttProperties.endDate, ganttProperties.duration, ganttProperties.durationUnit, ganttProperties), ganttProperties, true);
            }
        }
        else if (!isNullOrUndefined(duration) && duration !== '') {
            this.updateDurationValue(duration, ganttProperties);
            this.parent.setRecordValue('startDate', this.getStartDate(ganttProperties.endDate, ganttProperties.duration, ganttProperties.durationUnit, ganttProperties), ganttProperties, true);
        }
    }
    calculateDateFromStartDate(startDate, endDate, duration, ganttData) {
        let ganttProperties = ganttData.ganttProperties;
        this.parent.setRecordValue('startDate', this.checkStartDate(startDate, ganttProperties), ganttProperties, true);
        if (!endDate && (isNullOrUndefined(duration) || duration === '')) {
            if (this.parent.allowUnscheduledTasks) {
                this.parent.setRecordValue('endDate', null, ganttProperties, true);
                this.parent.setRecordValue('duration', null, ganttProperties, true);
            }
            else {
                this.parent.setRecordValue('duration', 1, ganttProperties, true);
                this.calculateEndDate(ganttData);
            }
        }
        else if (!isNullOrUndefined(duration) && !endDate) {
            this.updateDurationValue(duration, ganttProperties);
            this.calculateEndDate(ganttData);
        }
        else if (endDate && (isNullOrUndefined(duration) || duration === '')) {
            if (endDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
                this.setTime(this.parent.defaultEndTime, endDate);
            }
            this.parent.setRecordValue('endDate', this.checkEndDate(endDate, ganttData.ganttProperties), ganttProperties, true);
            if (this.compareDates(ganttProperties.startDate, ganttProperties.endDate) === 1) {
                this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
                this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
                this.parent.setRecordValue('duration', 0, ganttProperties, true);
            }
            else {
                this.calculateDuration(ganttData);
            }
        }
        else {
            this.updateDurationValue(duration, ganttProperties);
            this.calculateEndDate(ganttData);
        }
    }
    /**
     *
     * @param parentWidth
     * @param percent
     * @private
     */
    getProgressWidth(parentWidth, percent) {
        return (parentWidth * percent) / 100;
    }
    /**
     *
     * @param ganttProp
     * @private
     */
    calculateWidth(ganttProp) {
        let sDate = ganttProp.startDate;
        let eDate = ganttProp.endDate;
        let unscheduledTaskWidth = 3;
        if (isNullOrUndefined(sDate) && isNullOrUndefined(eDate)) {
            sDate = this.getValidStartDate(ganttProp);
            eDate = this.getValidEndDate(ganttProp);
        }
        if (isNullOrUndefined(sDate) || isNullOrUndefined(eDate)) {
            return unscheduledTaskWidth;
        }
        else if (ganttProp.isMilestone) {
            //let taskBarHeight: number = this.getTaskbarHeight();
            return 0;
        }
        else {
            return this.getTaskWidth(sDate, eDate);
        }
    }
    getTaskbarHeight() {
        let rowHeight = this.parent.rowHeight;
        let taskBarHeight = this.parent.taskbarHeight;
        if (taskBarHeight < rowHeight) {
            return taskBarHeight;
        }
        else {
            return rowHeight;
        }
    }
    /**
     * Method to calculate left
     * @param ganttProp
     * @private
     */
    calculateLeft(ganttProp) {
        let sDate = null;
        let left = -300;
        let milestone = ganttProp.isMilestone;
        if (ganttProp.startDate) {
            sDate = new Date(ganttProp.startDate.getTime());
        }
        else if (ganttProp.endDate) {
            sDate = new Date(ganttProp.endDate.getTime());
            milestone = true;
        }
        else {
            sDate = this.getValidStartDate(ganttProp);
        }
        if (!isNullOrUndefined(sDate)) {
            left = this.getTaskLeft(sDate, milestone);
        }
        return left;
    }
    /**
     * calculate the left margin of the baseline element
     * @param ganttData
     * @private
     */
    calculateBaselineLeft(ganttProperties) {
        let baselineStartDate = this.getDateFromFormat(ganttProperties.baselineStartDate);
        let baselineEndDate = this.getDateFromFormat(ganttProperties.baselineEndDate);
        if (baselineStartDate && baselineEndDate) {
            return (this.getTaskLeft(baselineStartDate, ganttProperties.isMilestone));
        }
        else {
            return 0;
        }
    }
    /**
     * calculate the width between baseline start date and baseline end date.
     * @private
     */
    calculateBaselineWidth(ganttProperties) {
        let baselineStartDate = this.getDateFromFormat(ganttProperties.baselineStartDate);
        let baselineEndDate = this.getDateFromFormat(ganttProperties.baselineEndDate);
        if (baselineStartDate && baselineEndDate) {
            return (this.getTaskWidth(baselineStartDate, baselineEndDate));
        }
        else {
            return 0;
        }
    }
    /**
     * To get tasks width value
     * @param startDate
     * @param endDate
     * @private
     */
    getTaskWidth(startDate, endDate) {
        let sDate = new Date(startDate.getTime());
        let eDate = new Date(endDate.getTime());
        let tierMode = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierMode === 'Day') {
            if (this.getSecondsInDecimal(sDate) === this.parent.defaultStartTime) {
                sDate.setHours(0, 0, 0, 0);
            }
            if (this.getSecondsInDecimal(eDate) === this.parent.defaultEndTime) {
                eDate.setHours(24);
            }
        }
        return ((this.getTimeDifference(sDate, eDate) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth);
    }
    /**
     * Get task left value
     * @param startDate
     * @param isMilestone
     * @private
     */
    getTaskLeft(startDate, isMilestone) {
        let date = new Date(startDate.getTime());
        let tierMode = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierMode === 'Day') {
            if (this.getSecondsInDecimal(date) === this.parent.defaultStartTime) {
                date.setHours(0, 0, 0, 0);
            }
            else if (isMilestone && this.getSecondsInDecimal(date) === this.parent.defaultEndTime) {
                date.setHours(24);
            }
        }
        let timelineStartDate = this.parent.timelineModule.timelineStartDate;
        if (timelineStartDate) {
            return (date.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24) * this.parent.perDayWidth;
        }
        else {
            return 0;
        }
    }
    /**
     *
     * @param ganttData
     * @param fieldName
     * @private
     */
    updateMappingData(ganttData, fieldName) {
        let columnMapping = this.parent.columnMapping;
        let ganttProp = ganttData.ganttProperties;
        if (isNullOrUndefined(columnMapping[fieldName])) {
            return;
        }
        if (fieldName === 'predecessorName') {
            //
        }
        else if (fieldName === 'resourceInfo') {
            let resourceData = ganttProp.resourceInfo;
            let resourcesId = [];
            let resourcesName = [];
            for (let i = 0; i < resourceData.length; i++) {
                resourcesId.push(resourceData[i][this.parent.resourceIDMapping]);
                resourcesName.push(resourceData[i][this.parent.resourceNameMapping]);
            }
            this.parent.setRecordValue('resourceNames', resourcesName.join(','), ganttProp, true);
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], resourcesId, ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], resourcesName.join(','), ganttData);
        }
        else if (fieldName === 'startDate' || fieldName === 'endDate') {
            this.setRecordDate(ganttData, ganttProp[fieldName], columnMapping[fieldName]);
        }
        else if (fieldName === 'duration') {
            this.setRecordDuration(ganttData, columnMapping[fieldName]);
        }
        else {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], ganttProp[fieldName], ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], ganttProp[fieldName], ganttData);
        }
    }
    setRecordDate(task, value, mapping) {
        if (!isNullOrUndefined(value)) {
            value = new Date(value.getTime());
        }
        this.parent.setRecordValue(mapping, value, task);
        if (!isNullOrUndefined(value)) {
            value = new Date(value.getTime());
        }
        this.parent.setRecordValue('taskData.' + mapping, value, task);
    }
    getDurationInDay(duration, durationUnit) {
        if (durationUnit === 'day') {
            return duration;
        }
        else if (durationUnit === 'hour') {
            return duration / (this.parent.secondsPerDay / 3600);
        }
        else {
            return duration / (this.parent.secondsPerDay / 60);
        }
    }
    setRecordDuration(task, mapping) {
        let duration = task.ganttProperties.duration;
        let durationUnit = task.ganttProperties.durationUnit;
        if (!isNullOrUndefined(duration)) {
            this.parent.setRecordValue(mapping, this.getDurationInDay(duration, durationUnit), task);
            this.parent.setRecordValue('taskData.' + mapping, this.getDurationString(duration, durationUnit), task);
        }
        else {
            this.parent.setRecordValue(mapping, duration, task);
            this.parent.setRecordValue('taskData.' + mapping, duration, task);
        }
    }
    /**
     *
     * @param ganttData
     * @private
     */
    updateTaskData(ganttData) {
        let dataMapping = this.parent.taskFields;
        let ganttProperties = ganttData.ganttProperties;
        if (!isNullOrUndefined(ganttData.taskData)) {
            let data = ganttData.taskData;
            if (dataMapping.id) {
                this.parent.setRecordValue('taskData.' + dataMapping.id, ganttProperties.taskId, ganttData);
                this.parent.setRecordValue(dataMapping.id, ganttProperties.taskId, ganttData);
            }
            if (dataMapping.name) {
                this.parent.setRecordValue('taskData.' + dataMapping.name, ganttProperties.taskName, ganttData);
                this.parent.setRecordValue(dataMapping.name, ganttProperties.taskName, ganttData);
            }
            if (dataMapping.startDate) {
                this.setRecordDate(ganttData, ganttProperties.startDate, dataMapping.startDate);
            }
            if (dataMapping.endDate) {
                this.setRecordDate(ganttData, ganttProperties.endDate, dataMapping.endDate);
            }
            if (dataMapping.duration) {
                this.setRecordDuration(ganttData, dataMapping.duration);
            }
            if (dataMapping.durationUnit) {
                data[dataMapping.durationUnit] = ganttProperties.durationUnit;
            }
            if (dataMapping.progress) {
                this.parent.setRecordValue('taskData.' + dataMapping.progress, ganttProperties.progress, ganttData);
                this.parent.setRecordValue(dataMapping.progress, ganttProperties.progress, ganttData);
            }
            if (dataMapping.baselineStartDate) {
                this.setRecordDate(ganttData, ganttProperties.baselineStartDate, dataMapping.baselineStartDate);
            }
            if (dataMapping.baselineEndDate) {
                this.setRecordDate(ganttData, ganttProperties.baselineEndDate, dataMapping.baselineEndDate);
            }
            if (dataMapping.notes) {
                this.parent.setRecordValue('taskData.' + dataMapping.notes, ganttProperties.notes, ganttData);
                this.parent.setRecordValue(dataMapping.notes, ganttProperties.notes, ganttData);
            }
            if (dataMapping.cssClass) {
                this.parent.setRecordValue('taskData.' + dataMapping.cssClass, ganttProperties.cssClass, ganttData);
                this.parent.setRecordValue(dataMapping.cssClass, ganttProperties.cssClass, ganttData);
            }
            if (dataMapping.indicators) {
                this.parent.setRecordValue('taskData.' + dataMapping.indicators, ganttProperties.indicators, ganttData);
                this.parent.setRecordValue(dataMapping.indicators, ganttProperties.indicators, ganttData);
            }
        }
    }
    /**
     * To set resource value in Gantt record
     * @private
     */
    setResourceInfo(data) {
        let resourceIdCollection;
        if (isNullOrUndefined(data[this.parent.taskFields.resourceInfo])) {
            return resourceIdCollection;
        }
        resourceIdCollection = data[this.parent.taskFields.resourceInfo];
        let resourceData = this.parent.resources;
        let resourceIDMapping = this.parent.resourceIDMapping;
        let resources = [];
        for (let count = 0; count < resourceIdCollection.length; count++) {
            let resource = resourceData.filter((resourceInfo) => {
                return (resourceIdCollection[count] === resourceInfo[resourceIDMapping]);
            });
            let ganttDataResource = extend({}, resource[0]);
            resources.push(ganttDataResource);
        }
        return resources;
    }
    updateResourceName(data) {
        let resourceInfo = data.ganttProperties.resourceInfo;
        let resourceName = [];
        if (resourceInfo) {
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, [], data);
            for (let i = 0; i < resourceInfo.length; i++) {
                let resource = resourceInfo[i];
                resourceName.push(resource[this.parent.resourceNameMapping]);
                if (data.taskData) {
                    let mapping = this.parent.taskFields.resourceInfo;
                    data.taskData[mapping].push(resource[this.parent.resourceIDMapping]);
                }
            }
            this.parent.setRecordValue('resourceNames', resourceName.join(','), data.ganttProperties, true);
            this.parent.setRecordValue(this.parent.taskFields.resourceInfo, resourceName.join(','), data, true);
        }
    }
    dataReorder(flatCollection, rootCollection) {
        let result = [];
        while (flatCollection.length > 0 && rootCollection.length > 0) {
            let index = rootCollection.indexOf(flatCollection[0]);
            if (index === -1) {
                flatCollection.shift();
            }
            else {
                result.push(flatCollection.shift());
                rootCollection.splice(index, 1);
            }
        }
        return result;
    }
    validateDurationUnitMapping(durationUnit) {
        let unit = durationUnit;
        if (unit === 'minute') {
            unit = DurationUnits.Minute;
        }
        else if (unit === 'hour') {
            unit = DurationUnits.Hour;
        }
        else if (unit === 'day') {
            unit = DurationUnits.Day;
        }
        else {
            unit = this.parent.durationUnit.toLocaleLowerCase();
        }
        return unit;
    }
    /**
     * To update duration value in Task
     * @param duration
     * @param ganttProperties
     * @private
     */
    updateDurationValue(duration, ganttProperties) {
        let tempDuration = this.getDurationValue(duration);
        this.parent.setRecordValue('duration', getValue('duration', tempDuration), ganttProperties, true);
        if (!isNullOrUndefined(getValue('durationUnit', tempDuration))) {
            this.parent.setRecordValue('durationUnit', getValue('durationUnit', tempDuration), ganttProperties, true);
        }
    }
    /**
     * Update all gantt data collection width, progress width and left value
     * @private
     */
    updateGanttData() {
        let flatData = this.parent.flatData;
        let length = flatData.length;
        for (let i = 0; i < length; i++) {
            let data = flatData[i];
            let task = data.ganttProperties;
            if (!data.hasChildRecords) {
                this.updateWidthLeft(data);
            }
            this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(task), task, true);
            this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(task), task, true);
            let childData = [];
            let parentItem;
            if (data.parentItem) {
                parentItem = this.parent.getParentTask(data.parentItem);
                childData = parentItem.childRecords;
            }
            if (parentItem && childData.indexOf(data) === childData.length - 1 && !data.hasChildRecords) {
                if (parentItem.ganttProperties.isAutoSchedule) {
                    this.updateParentItems(parentItem);
                }
            }
        }
    }
    /**
     * @private
     */
    reUpdateGanttDataPosition() {
        let flatData = this.parent.flatData;
        let length = flatData.length;
        for (let i = 0; i < length; i++) {
            let data = flatData[i];
            let task = data.ganttProperties;
            this.updateWidthLeft(data);
            this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(task), task, true);
            this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(task), task, true);
            this.parent.dataOperation.updateTaskData(data);
        }
    }
    /**
     * method to update left, width, progress width in record
     * @param data
     * @private
     */
    updateWidthLeft(data) {
        let ganttRecord = data.ganttProperties;
        this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(ganttRecord), ganttRecord, true);
        this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttRecord), ganttRecord, true);
        this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth(ganttRecord.width, ganttRecord.progress), ganttRecord, true);
    }
    /**
     * To calculate parent progress value
     * @private
     */
    getParentProgress(childGanttRecord) {
        let durationInDay = 0;
        let progressValues = {};
        switch (childGanttRecord.ganttProperties.durationUnit) {
            case 'hour':
                durationInDay = (childGanttRecord.ganttProperties.duration / (this.parent.secondsPerDay / 3600));
                break;
            case 'minute':
                durationInDay = (childGanttRecord.ganttProperties.duration / (this.parent.secondsPerDay / 60));
                break;
            default:
                durationInDay = childGanttRecord.ganttProperties.duration;
        }
        if (childGanttRecord.hasChildRecords) {
            setValue('totalProgress', childGanttRecord.ganttProperties.totalProgress, progressValues);
            setValue('totalDuration', childGanttRecord.ganttProperties.totalDuration, progressValues);
        }
        else {
            setValue('totalProgress', childGanttRecord.ganttProperties.progress * durationInDay, progressValues);
            setValue('totalDuration', durationInDay, progressValues);
        }
        return progressValues;
    }
    /**
     * @private
     */
    updateParentItems(cloneParent) {
        let parentData = this.parent.getParentTask(cloneParent);
        let previousStartDate = parentData.ganttProperties.startDate;
        let previousEndDate = parentData.ganttProperties.endDate;
        let childRecords = parentData.childRecords;
        let childLength = childRecords.length;
        let totalDuration = 0;
        let progressValues = {};
        let minStartDate = null;
        let maxEndDate = null;
        let milestoneCount = 0;
        let totalProgress = 0;
        for (let count = 0; count < childLength; count++) {
            let childData = childRecords[count];
            if (this.parent.isOnDelete && childData.isDelete) {
                continue;
            }
            let startDate = this.getValidStartDate(childData.ganttProperties);
            let endDate = this.getValidEndDate(childData.ganttProperties);
            if (isNullOrUndefined(minStartDate)) {
                minStartDate = this.getDateFromFormat(startDate);
            }
            if (isNullOrUndefined(maxEndDate)) {
                maxEndDate = this.getDateFromFormat(endDate);
            }
            if (!isNullOrUndefined(endDate) && this.compareDates(endDate, maxEndDate) === 1) {
                maxEndDate = this.getDateFromFormat(endDate);
            }
            if (!isNullOrUndefined(startDate) && this.compareDates(startDate, minStartDate) === -1) {
                minStartDate = this.getDateFromFormat(startDate);
            }
            if (!childData.ganttProperties.isMilestone && isScheduledTask(childData.ganttProperties)) {
                progressValues = this.getParentProgress(childData);
                totalProgress += getValue('totalProgress', progressValues);
                totalDuration += getValue('totalDuration', progressValues);
            }
            else {
                milestoneCount++;
            }
        }
        if (this.compareDates(previousStartDate, minStartDate) !== 0) {
            this.parent.setRecordValue('startDate', minStartDate, parentData.ganttProperties, true);
        }
        if (this.compareDates(previousEndDate, maxEndDate) !== 0) {
            this.parent.setRecordValue('endDate', maxEndDate, parentData.ganttProperties, true);
        }
        let taskCount;
        if (this.parent.isOnDelete) {
            taskCount = childLength - milestoneCount - 1;
        }
        else {
            taskCount = childLength - milestoneCount;
        }
        let parentProgress = taskCount > 0 ? (totalProgress / totalDuration) : 0;
        this.calculateDuration(parentData);
        let parentProp = parentData.ganttProperties;
        this.parent.setRecordValue('progress', Math.floor(parentProgress), parentProp, true);
        this.parent.setRecordValue('totalProgress', totalProgress, parentProp, true);
        this.parent.setRecordValue('totalDuration', totalDuration, parentProp, true);
        this.updateWidthLeft(parentData);
        this.updateTaskData(parentData);
        let parentItem = this.parent.getParentTask(parentData.parentItem);
        if (parentItem && parentItem.ganttProperties.isAutoSchedule) {
            this.updateParentItems(parentItem);
        }
    }
}

/**
 * CSS Constants
 */
/** @hidden */
const root = 'e-gantt';
const ganttChartPane = 'e-gantt-chart-pane';
const treeGridPane = 'e-gantt-tree-grid-pane';
const splitter = 'e-gantt-splitter';
const ganttChart = 'e-gantt-chart';
const chartBodyContainer = 'e-chart-root-container';
const toolbar = 'e-gantt-toolbar';
const chartScrollElement = 'e-chart-scroll-container';
const chartBodyContent = 'e-chart-rows-container';
const scrollContent = 'e-content';
// Timeline-Class
const taskTable = 'e-task-table';
const zeroSpacing = 'e-zero-spacing';
const timelineHeaderContainer = 'e-timeline-header-container';
const timelineHeaderTableContainer = 'e-timeline-header-table-container';
const timelineHeaderTableBody = 'e-timeline-header-table-body';
const timelineTopHeaderCell = 'e-timeline-top-header-cell';
const timelineHeaderCellLabel = 'e-header-cell-label';
const weekendHeaderCell = 'e-weekend-header-cell';
const timelineSingleHeaderCell = 'e-timeline-single-header-cell';
const timelineSingleHeaderOuterDiv = 'e-timeline-single-header-outer-div';
// Chart Rows-Class
const leftLabelContainer = 'e-left-label-container';
const leftLabelInnerDiv = 'e-left-label-inner-div';
const rightLabelContainer = 'e-right-label-container';
const rightLabelInnerDiv = 'e-right-label-inner-div';
const taskBarMainContainer = 'e-taskbar-main-container';
const parentTaskBarInnerDiv = 'e-gantt-parent-taskbar-inner-div';
const parentProgressBarInnerDiv = 'e-gantt-parent-progressbar-inner-div';
const taskLabel = 'e-task-label';
const childTaskBarInnerDiv = 'e-gantt-child-taskbar-inner-div';
const childProgressBarInnerDiv = 'e-gantt-child-progressbar-inner-div';
const milestoneTop = 'e-milestone-top';
const milestoneBottom = 'e-milestone-bottom';
const baselineBar = 'e-baseline-bar';
const baselineMilestoneContainer = 'e-baseline-gantt-milestone-container';
const baselineMilestoneDiv = 'e-baseline-gantt-milestone';
const baselineMilestoneTop = 'e-baseline-milestone-top';
const baselineMilestoneBottom = 'e-baseline-milestone-bottom';
const chartRowCell = 'e-chart-row-cell';
const chartRow = 'e-chart-row';
const rowExpand = 'e-row-expand';
const rowCollapse = 'e-row-collapse';
const taskBarLeftResizer = 'e-taskbar-left-resizer';
const taskBarRightResizer = 'e-taskbar-right-resizer';
const childProgressResizer = 'e-child-progress-resizer';
const progressBarHandler = 'e-progressbar-handler';
const progressHandlerElement = 'e-progressbar-handler-element';
const progressBarHandlerAfter = 'e-progressbar-handler-after';
const icon = 'e-icon';
const traceMilestone = 'e-gantt-milestone';
const traceChildTaskBar = 'e-gantt-child-taskbar';
const traceChildProgressBar = 'e-gantt-child-progressbar';
const traceParentTaskBar = 'e-gantt-parent-taskbar';
const traceParentProgressBar = 'e-gantt-parent-progressbar';
const traceUnscheduledTask = 'e-gantt-unscheduled-task';
const taskIndicatorDiv = 'e-indicator-span';
const leftResizeGripper = 'e-left-resize-gripper';
const rightResizeGripper = 'e-right-resize-gripper';
const progressResizeGripper = 'e-progress-resize-gripper';
const label = 'e-label';
//event Markers classes
const eventMarkersContainer = 'e-event-markers-container';
const eventMarkersChild = 'e-event-markers';
const eventMarkersSpan = 'e-span-label';
//holiday classes
const nonworkingContainer = 'e-nonworking-day-container';
const holidayContainer = 'e-holiday-container';
const holidayElement = 'e-holiday';
const holidayLabel = 'e-span';
//weekend classes
const weekendContainer = 'e-weekend-container';
const weekend = 'e-weekend';
//Unscheduled Taskbar
const unscheduledTaskbarLeft = 'e-gantt-unscheduled-taskbar-left';
const unscheduledTaskbarRight = 'e-gantt-unscheduled-taskbar-right';
const unscheduledTaskbar = 'e-gantt-unscheduled-taskbar';
const unscheduledMilestoneTop = 'e-unscheduled-milestone-top';
const unscheduledMilestoneBottom = 'e-unscheduled-milestone-bottom';
//Connector Line
const dependencyViewContainer = 'e-gantt-dependency-view-container';
const connectorLineContainer = 'e-connector-line-container';
const connectorLine = 'e-line';
const connectorLineRightArrow = 'e-connector-line-right-arrow';
const connectorLineLeftArrow = 'e-connector-line-left-arrow';
const connectorLineZIndex = 'e-connector-line-z-index';
const connectorLineHover = 'e-connector-line-hover';
const connectorLineHoverZIndex = 'e-connector-line-hover-z-index';
const connectorLineRightArrowHover = 'e-connector-line-right-arrow-hover';
const connectorLineLeftArrowHover = 'e-connector-line-left-arrow-hover';

const connectorPointLeft = 'e-connectorpoint-left';
const connectorPointRight = 'e-connectorpoint-right';
const connectorPointLeftHover = 'e-connectorpoint-left-hover';
const connectorPointRightHover = 'e-connectorpoint-right-hover';
const falseLine = 'e-gantt-false-line';



const rightConnectorPointOuterDiv = 'e-right-connectorpoint-outer-div';
const leftConnectorPointOuterDiv = 'e-left-connectorpoint-outer-div';
const connectorPointAllowBlock = 'e-connectorpoint-allow-block';
const ganttTooltip = 'e-gantt-tooltip';

/**
 * To handle scroll event on chart and from TreeGrid
 * @hidden
 */
class ChartScroll {
    /**
     * Constructor for the scrolling.
     * @hidden
     */
    constructor(parent) {
        this.previousScroll = { top: 0, left: 0 };
        this.parent = parent;
        this.element = this.parent.ganttChartModule.scrollElement;
        this.addEventListeners();
    }
    /**
     * Bind event
     */
    addEventListeners() {
        this.parent.on('grid-scroll', this.gridScrollHandler, this);
        EventHandler.add(this.element, 'scroll', this.onScroll, this);
    }
    /**
     * Unbind events
     */
    removeEventListeners() {
        EventHandler.remove(this.element, 'scroll', this.onScroll);
        this.parent.off('grid-scroll', this.gridScrollHandler);
    }
    /**
     *
     * @param args
     */
    gridScrollHandler(args) {
        this.element.scrollTop = getValue('top', args);
        this.previousScroll.top = this.element.scrollTop;
    }
    /**
     * Scroll event handler
     */
    onScroll() {
        if (this.element.scrollTop !== this.previousScroll.top) {
            this.parent.notify('chartScroll', { top: this.element.scrollTop });
            this.previousScroll.top = this.element.scrollTop;
        }
        if (this.element.scrollLeft !== this.previousScroll.left) {
            this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
            this.previousScroll.left = this.element.scrollLeft;
        }
    }
    /**
     * To set height for chart scroll container
     * @param height - To set height for scroll container in chart side
     * @private
     */
    setHeight(height) {
        this.element.style.height = formatUnit(height);
    }
    /**
     * To set width for chart scroll container
     * @param width - To set width to scroll container
     * @private
     */
    setWidth(width) {
        this.element.style.width = formatUnit(width);
    }
    /**
     * To set scroll top for chart scroll container
     * @param scrollTop - To set scroll top for scroll container
     * @private
     */
    setScrollTop(scrollTop) {
        this.element.scrollTop = scrollTop;
    }
    /**
     * To set scroll left for chart scroll container
     * @param scrollLeft  - To set scroll left for scroll container
     */
    setScrollLeft(scrollLeft) {
        this.element.scrollLeft = scrollLeft;
        this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
        this.previousScroll.left = this.element.scrollLeft;
    }
    /**
     * Destroy scroll related elements and unbind the events
     * @private
     */
    destroy() {
        this.removeEventListeners();
    }
}

/**
 * module to render gantt chart - project view
 */
class GanttChart {
    constructor(parent) {
        this.isExpandCollapseFromChart = false;
        this.isExpandAll = false;
        this.parent = parent;
        this.chartTimelineContainer = null;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on('renderPanels', this.renderChartContainer, this);
        this.parent.on('recordsUpdated', this.renderChartElements, this);
        this.parent.on('dataReady', this.renderInitialContents, this);
        this.parent.on('tree-grid-created', this.renderChartContents, this);
        this.parent.on('destroy', this.destroy, this);
    }
    renderChartContents() {
        this.parent.notify('refreshDayMarkers', {});
        this.wireEvents();
    }
    /**
     * Method to render top level containers in Gantt chart
     * @private
     */
    renderChartContainer() {
        this.chartElement = createElement('div', { id: this.parent.element.id + 'GanttChart', className: ganttChart });
        this.parent.chartPane.appendChild(this.chartElement);
        this.renderTimelineContainer();
        this.renderBodyContainers();
        // render top level div header and content
        // Get timeline header from timeline class file and append to header div
        // render content div
        // Render scroll able div
        // Render container for all element like, table, weekend and holidays
        // Get rows element from rows renderer class
        // Get label related info label renderer class
        // Get baseline from baseline renderer class
        // Get weekend elements from weekend-holidays renderer class
    }
    /**
     * method to render timeline, holidays, weekends at load time
     */
    renderInitialContents() {
        this.parent.timelineModule.createTimelineSeries();
    }
    renderChartElements() {
        this.parent.chartRowsModule.renderChartRows();
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
        this.updateWidthAndHeight();
        this.parent.notify('selectRowByIndex', {});
    }
    /**
     * @private
     */
    renderTimelineContainer() {
        this.chartTimelineContainer =
            createElement('div', { className: timelineHeaderContainer });
        this.chartElement.appendChild(this.chartTimelineContainer);
    }
    /**
     * initiate chart container
     */
    renderBodyContainers() {
        this.chartBodyContainer = createElement('div', { className: chartBodyContainer });
        this.chartElement.appendChild(this.chartBodyContainer);
        this.scrollElement = createElement('div', {
            className: chartScrollElement + ' ' + scrollContent, styles: 'position:relative;'
        });
        this.chartBodyContainer.appendChild(this.scrollElement);
        this.chartBodyContent = createElement('div', { className: chartBodyContent });
        this.scrollElement.appendChild(this.chartBodyContent);
        // this.parent.chartRowsModule.createChartTable();
        this.scrollObject = new ChartScroll(this.parent);
        //this.scrollObject.setWidth(this.chartProperties.width);
        let toolbarHeight = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        this.scrollObject.
            setHeight(this.parent.ganttHeight - this.chartTimelineContainer.offsetHeight - toolbarHeight);
    }
    updateWidthAndHeight() {
        this.chartBodyContent.style.height = formatUnit(this.parent.contentHeight);
        //let element: HTMLElement = this.chartTimelineContainer.querySelector('.' + cls.timelineHeaderTableContainer);
        this.chartBodyContent.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.parent.notify('updateHeight', {});
        this.parent.updateGridLineContainerHeight();
        this.updateLastRowBottomWidth();
    }
    /**
     * Method to update bottom border for chart rows
     */
    updateLastRowBottomWidth() {
        if (this.parent.currentViewData.length > 0 && this.parent.height !== 'auto') {
            let expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
            let lastExpandedRow = expandedRecords[expandedRecords.length - 1];
            let lastExpandedRowIndex = this.parent.currentViewData.indexOf(lastExpandedRow);
            let lastRow = this.parent.getRowByIndex(lastExpandedRowIndex);
            let table = this.parent.chartRowsModule.ganttChartTableBody;
            if (table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow')) {
                removeClass(table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow'), 'e-lastrow');
            }
            if (this.chartBodyContent.clientHeight < this.chartBodyContainer.clientHeight) {
                if (lastRow) {
                    addClass(lastRow.querySelectorAll('td'), 'e-lastrow');
                }
            }
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('renderPanels', this.renderChartContainer);
        this.parent.off('recordsUpdated', this.renderChartElements);
        this.parent.off('dataReady', this.renderInitialContents);
        this.parent.off('tree-grid-created', this.renderChartContents);
        this.parent.off('destroy', this.destroy);
    }
    /**
     * Click event handler in chart side
     */
    ganttChartMouseDown(e) {
        this.parent.notify('chartMouseDown', e);
        this.parent.element.tabIndex = 0;
    }
    /**
     *
     * @param e
     */
    scrollToTarget(e) {
        let row = closest(e.target, 'tr');
        if (row && this.parent.element.contains(row) &&
            (this.parent.element.querySelectorAll('.e-chart-rows-container')[0].contains(e.target) ||
                this.parent.element.querySelectorAll('.e-gridcontent')[0].contains(e.target)) &&
            this.parent.currentViewData.length > 0) {
            let rowIndex = getValue('rowIndex', closest(e.target, 'tr'));
            let dateObject = this.parent.currentViewData[rowIndex].ganttProperties.startDate;
            if (!isNullOrUndefined(dateObject)) {
                let left = this.parent.dataOperation.getTaskLeft(dateObject, false);
                if (this.parent.autoFocusTasks) {
                    this.updateScrollLeft(left);
                }
            }
        }
    }
    /**
     * To focus selected task in chart side
     * @private
     */
    updateScrollLeft(scrollLeft) {
        scrollLeft = scrollLeft - 50 > 0 ? scrollLeft - 50 : 0;
        scrollLeft = this.scrollElement.scrollWidth <= scrollLeft ? this.scrollElement.scrollWidth : scrollLeft;
        if ((this.scrollElement.offsetWidth + this.parent.ganttChartModule.scrollElement.scrollLeft) < scrollLeft
            || (this.scrollElement.scrollLeft > scrollLeft)) {
            this.scrollObject.setScrollLeft(scrollLeft);
        }
    }
    /**
     *  Method trigger while perform mouse up action.
     * @return {void}
     * @private
     */
    documentMouseUp(e) {
        if (this.parent.isDestroyed) {
            return;
        }
        let isTaskbarEdited = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent) &&
            getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            isTaskbarEdited = true;
        }
        this.parent.notify('chartMouseUp', e);
        if (!isTaskbarEdited) {
            /** Expand/collapse action */
            let target = e.target;
            let isOnTaskbarElement = e.target.classList.contains(taskBarMainContainer)
                || closest(e.target, '.' + taskBarMainContainer);
            if (closest(target, '.e-gantt-parent-taskbar')) {
                this.chartExpandCollapseRequest(e);
            }
            else if (!isOnTaskbarElement && this.parent.autoFocusTasks) {
                this.scrollToTarget(e); /** Scroll to task */
            }
        }
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule) {
            this.parent.editModule.taskbarEditModule.removeFalseLine(true);
        }
    }
    /**
     *  Method trigger while perform mouse leave action.
     * @return {void}
     * @private
     */
    ganttChartLeave(e) {
        this.parent.notify('chartMouseLeave', e);
    }
    /**
     *  Method trigger while perform mouse move action.
     * @return {void}
     * @private
     */
    ganttChartMove(e) {
        this.parent.notify('chartMouseMove', e);
        if (!isNullOrUndefined(this.parent.taskFields.dependency)) {
            this.parent.connectorLineEditModule.updateConnectorLineEditElement(e);
        }
    }
    /**
     * Double click handler for chart
     * @param e
     */
    doubleClickHandler(e) {
        this.parent.notify('chartDblClick', e);
    }
    /**
     * @private
     */
    getRecordByTarget(e) {
        let row = closest(e.target, 'tr');
        let ganttData;
        if (row) {
            let rowIndex = getValue('rowIndex', closest(e.target, 'tr'));
            ganttData = this.parent.currentViewData[rowIndex];
        }
        return ganttData;
    }
    /**
     * To get gantt chart row elements
     * @return {NodeListOf<Element>}
     * @private
     */
    getChartRows() {
        return document.getElementById(this.parent.element.id + 'GanttTaskTableBody').querySelectorAll('.e-chart-row');
    }
    /**
     * Expand Collapse operations from gantt chart side
     * @return {void}
     * @param target
     * @private
     */
    chartExpandCollapseRequest(e) {
        let target = e.target;
        let parentElement = closest(target, '.e-gantt-parent-taskbar');
        let record = this.getRecordByTarget(e);
        let chartRow$$1 = closest(target, 'tr');
        let rowIndex = getValue('rowIndex', chartRow$$1);
        let gridRow = this.parent.treeGrid.getRows()[rowIndex];
        let args = { data: record, gridRow: gridRow, chartRow: chartRow$$1, cancel: false };
        this.isExpandCollapseFromChart = true;
        if (parentElement.classList.contains('e-row-expand')) {
            this.collapseGanttRow(args);
        }
        else if (parentElement.classList.contains('e-row-collapse')) {
            this.expandGanttRow(args);
        }
    }
    /**
     * @private
     */
    reRenderConnectorLines() {
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML = '';
        let expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        this.parent.connectorLineIds = [];
        this.parent.updatedConnectorLineCollection = [];
        this.parent.predecessorModule.createConnectorLinesCollection(expandedRecords);
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
    }
    /**
     * To collapse gantt rows
     * @return {void}
     * @param args
     * @private
     */
    collapseGanttRow(args) {
        let record = getValue('data', args);
        this.parent.trigger('collapsing', args);
        if (getValue('cancel', args)) {
            return;
        }
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
            this.parent.treeGrid.collapseRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        }
        else {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
        }
        this.parent.updateContentHeight();
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        this.parent.trigger('collapsed', args);
    }
    /**
     * To expand gantt rows
     * @return {void}
     * @param args
     * @private
     */
    expandGanttRow(args) {
        let record = getValue('data', args);
        this.parent.trigger('expanding', args);
        if (getValue('cancel', args)) {
            return;
        }
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            this.parent.treeGrid.expandRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        }
        else {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
        }
        this.parent.updateContentHeight();
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        this.parent.trigger('expanded', args);
    }
    /**
     * On expand collapse operation row properties will be updated here.
     * @return {void}
     * @param action
     * @param rowElement
     * @param record
     * @param isChild
     * @private
     */
    expandCollapseChartRows(action, rowElement, record, isChild) {
        let displayType;
        if (action === 'expand') {
            displayType = 'table-row';
            if (!isChild) {
                record.expanded = true;
            }
            let targetElement = rowElement.querySelectorAll('.e-row-collapse');
            for (let t = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-expand');
                removeClass([targetElement[t]], 'e-row-collapse');
            }
        }
        else if (action === 'collapse') {
            displayType = 'none';
            if (!isChild) {
                record.expanded = false;
            }
            let targetElement = rowElement.querySelectorAll('.e-row-expand');
            for (let t = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-collapse');
                removeClass([targetElement[t]], 'e-row-expand');
            }
        }
        let childRecords = record.childRecords;
        let chartRows = this.getChartRows();
        let rows = [];
        chartRows.forEach((item) => {
            if (item.classList.contains('gridrowtaskId' + record.ganttProperties.taskId + 'level' + (record.level + 1))) {
                rows.push(item);
            }
        });
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = displayType;
            if ((childRecords[i].childRecords && childRecords[i].childRecords.length)
                && (action === 'collapse' || childRecords[i].expanded || this.isExpandAll)) {
                this.expandCollapseChartRows(action, rows[i], childRecords[i], true);
            }
        }
    }
    /**
     * Public method to expand or collapse all the rows of Gantt
     * @return {void}
     * @param action
     * @private
     */
    expandCollapseAll(action) {
        if (action === 'expand') {
            this.isExpandAll = true;
            this.parent.treeGrid.expandAll();
        }
        else {
            this.parent.treeGrid.collapseAll();
        }
        this.isExpandAll = false;
    }
    /**
     * Public method to expand particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    expandAtLevel(level) {
        this.parent.treeGrid.expandAtLevel(level);
    }
    /**
     * Public method to collapse particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    collapseAtLevel(level) {
        this.parent.treeGrid.collapseAtLevel(level);
    }
    /**
     * Event Binding for gantt chart click
     */
    wireEvents() {
        let isIE11Pointer = Browser.isPointer;
        let mouseDown = Browser.touchStartEvent;
        let mouseUp = Browser.touchEndEvent;
        let mouseMove = Browser.touchMoveEvent;
        let cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        if (this.parent.editSettings.allowTaskbarEditing) {
            EventHandler.add(this.parent.chartPane, mouseDown, this.ganttChartMouseDown, this);
            EventHandler.add(this.parent.chartPane, cancel, this.ganttChartLeave, this);
            EventHandler.add(this.parent.chartPane, mouseMove, this.ganttChartMove, this);
        }
        EventHandler.add(document.body, mouseUp, this.documentMouseUp, this);
        if (this.parent.editSettings.allowEditing) {
            EventHandler.add(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler, this);
        }
    }
    unWireEvents() {
        let isIE11Pointer = Browser.isPointer;
        let mouseDown = Browser.touchStartEvent;
        let mouseUp = Browser.touchEndEvent;
        let mouseMove = Browser.touchMoveEvent;
        let cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        if (this.parent.editSettings.allowTaskbarEditing) {
            EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, mouseDown, this.ganttChartMouseDown);
            EventHandler.remove(this.parent.chartPane, cancel, this.ganttChartLeave);
            EventHandler.remove(this.parent.chartPane, mouseMove, this.ganttChartMove);
        }
        EventHandler.remove(document.body, mouseUp, this.documentMouseUp);
        if (this.parent.editSettings.allowEditing) {
            EventHandler.remove(this.parent.chartPane, 'dblclick', this.doubleClickHandler);
        }
    }
    /**
     * To get record by taskbar element.
     * @return {IGanttData}
     * @private
     */
    getRecordByTaskBar(target) {
        let item = this.parent.currentViewData[this.getIndexByTaskBar(target)];
        return item;
    }
    /**
     * To get index by taskbar element.
     * @return {number}
     * @private
     */
    getIndexByTaskBar(target) {
        let row = closest(target, 'tr.' + chartRow);
        let recordIndex = [].slice.call(this.parent.chartRowsModule.ganttChartTableBody.childNodes).indexOf(row);
        return recordIndex;
    }
    destroy() {
        this.removeEventListener();
        this.unWireEvents();
        this.scrollObject.destroy();
        this.scrollObject = null;
    }
}

/**
 * Configures the `Timeline` of the gantt.
 */
class Timeline {
    constructor(ganttObj) {
        this.parent = ganttObj;
        this.initProperties();
    }
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    initProperties() {
        this.timelineStartDate = null;
        this.timelineEndDate = null;
        this.totalTimelineWidth = 0;
        this.customTimelineSettings = null;
        this.parent.isTimelineRoundOff = isNullOrUndefined(this.parent.projectStartDate) ? true : false;
    }
    /**
     * To render timeline header series.
     * @return {void}
     * @private
     */
    validateTimelineProp() {
        this.roundOffDays();
        this.processTimelineProperty();
        this.timelineWidthCalculation();
    }
    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    refreshTimeline() {
        this.initProperties();
        this.processTimelineUnit();
        this.parent.dataOperation.calculateProjectDates();
        this.parent.updateProjectDates(this.parent.cloneProjectStartDate, this.parent.cloneProjectEndDate, this.parent.isTimelineRoundOff);
    }
    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    refreshTimelineByTimeSpan() {
        this.validateTimelineProp();
        this.parent.ganttChartModule.chartTimelineContainer.innerHTML = '';
        this.createTimelineSeries();
    }
    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    updateChartByNewTimeline() {
        this.parent.chartRowsModule.refreshChartByTimeline();
        this.parent.notify('refreshDayMarkers', {});
    }
    /**
     * To validate time line unit.
     * @return {void}
     * @private
     */
    processTimelineUnit() {
        let directProperty = ['timelineViewMode', 'timelineUnitSize', 'weekStartDay', 'weekendBackground'];
        let innerProperty = {
            'topTier': ['unit', 'format', 'count', 'formatter'],
            'bottomTier': ['unit', 'format', 'count', 'formatter']
        };
        let tierUnits = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minutes'];
        this.customTimelineSettings = this.extendFunction(this.parent.timelineSettings, directProperty, innerProperty);
        if ((tierUnits.indexOf(this.customTimelineSettings.topTier.unit) === -1) &&
            (tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit) === -1)) {
            this.customTimelineSettings.topTier.unit = tierUnits.indexOf(this.customTimelineSettings.timelineViewMode) !== -1 ?
                this.customTimelineSettings.timelineViewMode : 'Week';
            this.customTimelineSettings.bottomTier.unit = tierUnits.indexOf(this.customTimelineSettings.topTier.unit) !== 5 ?
                tierUnits[tierUnits.indexOf(this.customTimelineSettings.topTier.unit) + 1] : 'None';
        }
        else if ((tierUnits.indexOf(this.customTimelineSettings.topTier.unit) !== -1 &&
            tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit) !== -1)
            && (tierUnits.indexOf(this.customTimelineSettings.topTier.unit) >
                tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit))) {
            this.customTimelineSettings.bottomTier.unit = this.customTimelineSettings.topTier.unit;
        }
        else {
            this.customTimelineSettings.topTier.unit = tierUnits.indexOf(this.customTimelineSettings.topTier.unit) === -1 ?
                'None' : this.customTimelineSettings.topTier.unit;
            this.customTimelineSettings.bottomTier.unit = tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit) === -1 ?
                'None' : this.customTimelineSettings.bottomTier.unit;
        }
        this.topTier = this.customTimelineSettings.topTier.unit;
        this.bottomTier = this.customTimelineSettings.bottomTier.unit;
        this.previousIsSingleTier = this.isSingleTier;
        this.isSingleTier = this.topTier === 'None' || this.bottomTier === 'None' ? true : false;
    }
    /**
     * To validate timeline properties.
     * @return {void}
     * @private
     */
    processTimelineProperty() {
        this.customTimelineSettings.topTier.count = (this.topTier === 'None') ?
            1 : this.validateCount(this.customTimelineSettings.topTier.unit, this.customTimelineSettings.topTier.count, 'topTier');
        this.customTimelineSettings.bottomTier.count = this.customTimelineSettings.bottomTier.unit === 'None' ?
            1 : this.validateCount(this.customTimelineSettings.bottomTier.unit, this.customTimelineSettings.bottomTier.count, 'bottomTier');
        this.customTimelineSettings.bottomTier.format = this.validateFormat(this.customTimelineSettings.bottomTier.unit, this.customTimelineSettings.bottomTier.format);
        this.customTimelineSettings.topTier.format = this.validateFormat(this.topTier, this.customTimelineSettings.topTier.format);
        this.customTimelineSettings.weekStartDay = this.customTimelineSettings.weekStartDay >= 0 &&
            this.customTimelineSettings.weekStartDay <= 6 ? this.customTimelineSettings.weekStartDay : 0;
    }
    /**
     * To create timeline header template.
     * @return {void}
     * @private
     */
    updateTimelineHeaderHeight() {
        if (this.parent.timelineModule.isSingleTier) {
            addClass([this.parent.ganttChartModule.chartTimelineContainer], timelineSingleHeaderOuterDiv);
            if (this.parent.treeGrid.element) {
                addClass(this.parent.treeGrid.element.querySelectorAll('.e-headercell'), timelineSingleHeaderOuterDiv);
                addClass(this.parent.treeGrid.element.querySelectorAll('.e-columnheader'), timelineSingleHeaderOuterDiv);
            }
        }
        else {
            removeClass([this.parent.ganttChartModule.chartTimelineContainer], timelineSingleHeaderOuterDiv);
            if (this.parent.treeGrid.element) {
                removeClass(this.parent.treeGrid.element.querySelectorAll('.e-headercell'), timelineSingleHeaderOuterDiv);
                removeClass(this.parent.treeGrid.element.querySelectorAll('.e-columnheader'), timelineSingleHeaderOuterDiv);
            }
        }
        if (this.previousIsSingleTier !== this.isSingleTier) {
            let toolbarHeight = 0;
            if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
                toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
            }
            this.parent.ganttChartModule.scrollObject.
                setHeight(this.parent.ganttHeight - this.parent.ganttChartModule.chartTimelineContainer.offsetHeight - toolbarHeight);
            this.parent.treeGrid.height = this.parent.ganttHeight - toolbarHeight -
                this.parent.ganttChartModule.chartTimelineContainer.offsetHeight;
        }
    }
    /**
     * To create timeline header template.
     * @return {void}
     * @private
     */
    createTimelineSeries() {
        let tr;
        let td;
        let div;
        let table;
        let thead;
        let loopCount = this.isSingleTier ? 1 : 2;
        let tier = this.topTier === 'None' ? 'bottomTier' : 'topTier';
        this.updateTimelineHeaderHeight();
        for (let count = 0; count < loopCount; count++) {
            table = createElement('table', { className: timelineHeaderTableContainer, styles: 'display: block;' });
            thead = createElement('thead', { className: timelineHeaderTableBody, styles: 'display:block; border-collapse:collapse' });
            tr = createElement('tr', { innerHTML: this.createTimelineTemplate(tier) });
            td = createElement('th');
            div = createElement('div', { styles: 'width: 20px' });
            td.appendChild(div);
            tr.appendChild(td);
            thead.appendChild(tr);
            table.appendChild(thead);
            this.parent.ganttChartModule.chartTimelineContainer.appendChild(table);
            tier = 'bottomTier';
            tr = null;
        }
    }
    /**
     * To validate timeline tier count.
     * @return {number}
     * @private
     */
    validateCount(mode, count, tier) {
        let tierCount = !isNullOrUndefined(count) && parseInt(count.toString(), 10) > 0 ? parseInt(count.toString(), 10) : 1;
        let timeDifference = Math.abs(this.timelineRoundOffEndDate.getTime() - this.timelineStartDate.getTime());
        let difference;
        switch (mode) {
            case 'Year':
                difference = Math.round((timeDifference / (1000 * 3600 * 24)) / (12 * 28));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Month':
                difference = Math.round((timeDifference / (1000 * 3600 * 24)) / 28);
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Week':
                difference = Math.round((timeDifference / (1000 * 3600 * 24)) / 7);
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Day':
                difference = Math.round(timeDifference / (1000 * 3600 * 24));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Hour':
                difference = Math.round(timeDifference / (1000 * 3600));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Minutes':
                difference = Math.round(timeDifference / (1000 * 60));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
        }
        return tierCount;
    }
    /**
     * To validate bottom tier count.
     * @return {number}
     * @private
     */
    validateBottomTierCount(mode, tierCount) {
        let count;
        switch (mode) {
            case 'Year':
                count = tierCount <= this.customTimelineSettings.topTier.count ?
                    tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Month':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * 12) ?
                    tierCount : (this.customTimelineSettings.topTier.count * 12) :
                    tierCount <= this.customTimelineSettings.topTier.count ?
                        tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Week':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 4)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 4)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * 4) ?
                        tierCount : (this.customTimelineSettings.topTier.count * 4) :
                        tierCount <= this.customTimelineSettings.topTier.count ?
                            tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Day':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 28)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 28)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * 28) ?
                        tierCount : (this.customTimelineSettings.topTier.count * 28) :
                        this.topTier === 'Week' ? tierCount <= (this.customTimelineSettings.topTier.count * 7) ?
                            tierCount : (this.customTimelineSettings.topTier.count * 7) :
                            tierCount <= this.customTimelineSettings.topTier.count ? tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Hour':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 28 * 24)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 28 * 24)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * (28 * 24)) ?
                        tierCount : (this.customTimelineSettings.topTier.count * (28 * 24)) :
                        this.topTier === 'Week' ? tierCount <= (this.customTimelineSettings.topTier.count * 7 * 24) ?
                            tierCount : (this.customTimelineSettings.topTier.count * 7 * 24) :
                            this.topTier === 'Day' ? tierCount <= (this.customTimelineSettings.topTier.count * 24) ?
                                tierCount : (this.customTimelineSettings.topTier.count * 24) :
                                tierCount <= this.customTimelineSettings.topTier.count ?
                                    tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Minutes':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 28 * 24 * 60)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 28 * 24 * 60)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * (28 * 24 * 60)) ?
                        tierCount : (this.customTimelineSettings.topTier.count * (28 * 24 * 60)) :
                        this.topTier === 'Week' ? tierCount <= (this.customTimelineSettings.topTier.count * 7 * 24 * 60) ?
                            tierCount : (this.customTimelineSettings.topTier.count * 7 * 24 * 60) :
                            this.topTier === 'Day' ? tierCount <= (this.customTimelineSettings.topTier.count * 24 * 60) ?
                                tierCount : (this.customTimelineSettings.topTier.count * 24 * 60) :
                                this.topTier === 'Hour' ? tierCount <= (this.customTimelineSettings.topTier.count * 60) ?
                                    tierCount : (this.customTimelineSettings.topTier.count * 60) :
                                    tierCount <= this.customTimelineSettings.topTier.count ?
                                        tierCount : this.customTimelineSettings.topTier.count;
                break;
        }
        return count;
    }
    /**
     * To validate timeline tier format.
     * @return {string}
     * @private
     */
    validateFormat(mode, format) {
        let tierFormat;
        switch (mode) {
            case 'Week':
                tierFormat = !format ? 'MMM dd, yyyy' : format;
                break;
            case 'Day':
            case 'None':
                tierFormat = !format ? '' : format;
                break;
            case 'Hour':
                tierFormat = !format ? 'H' : format;
                break;
            case 'Month':
                tierFormat = !format ? 'MMM yyyy' : format;
                break;
            case 'Year':
                tierFormat = !format ? 'yyyy' : format;
                break;
            case 'Minutes':
                tierFormat = !format ? 'm' : format;
                break;
        }
        return tierFormat;
    }
    /**
     * To perform extend operation.
     * @return {object}
     * @private
     */
    extendFunction(cloneObj, propertyCollection, innerProperty) {
        let tempObj = {};
        for (let index = 0; index < propertyCollection.length; index++) {
            tempObj[propertyCollection[index]] = cloneObj[propertyCollection[index]];
        }
        if (innerProperty) {
            Object.keys(innerProperty).forEach((key) => {
                tempObj[key] = this.extendFunction(cloneObj[key], innerProperty[key], null);
            });
        }
        return tempObj;
    }
    /**
     * To format date.
     * @return {string}
     * @private
     */
    formatDateHeader(dayFormat, data) {
        let date = new Date(data.getTime());
        let dateString;
        switch (dayFormat) {
            case '':
                dateString = this.parent.globalize.formatDate(date, { format: 'E' });
                dateString = dateString.slice(0, 1);
                break;
            default:
                dateString = this.parent.globalize.formatDate(date, { format: dayFormat });
        }
        return dateString;
    }
    /**
     * Custom Formatting.
     * @return {string}
     * @private
     */
    customFormat(date, format, tier, mode, formatter) {
        formatter = (typeof formatter === 'string' ? getValue(formatter, window) : formatter);
        return formatter(date, format, tier, mode);
    }
    /**
     * To create timeline template .
     * @return {string}
     * @private
     */
    createTimelineTemplate(tier) {
        let parent = this.parent;
        let parentTh = '';
        let parentTr = '';
        let mode = tier === 'topTier' ?
            parent.timelineModule.customTimelineSettings.topTier.unit : parent.timelineModule.customTimelineSettings.bottomTier.unit;
        let count = tier === 'topTier' ? parent.timelineModule.customTimelineSettings.topTier.count :
            parent.timelineModule.customTimelineSettings.bottomTier.count;
        let increment;
        let newTime;
        let startDate = new Date(this.parent.timelineModule.timelineStartDate.toString());
        let endDate = new Date(this.timelineRoundOffEndDate.toString());
        let scheduleDateCollection = [];
        do {
            parentTr = this.getHeaterTemplateString(new Date(startDate.toString()), mode, tier, false, count);
            scheduleDateCollection.push(new Date(startDate.toString()));
            increment = this.getIncrement(startDate, count, mode);
            newTime = startDate.getTime() + increment;
            startDate.setTime(newTime);
            if (startDate >= endDate) {
                parentTr = this.getHeaterTemplateString(scheduleDateCollection[scheduleDateCollection.length - 1], mode, tier, true, count);
            }
            parentTh = parentTh + parentTr;
            parentTr = '';
        } while (!(startDate >= endDate));
        return parentTh;
    }
    getTimelineRoundOffEndDate(date) {
        let tierMode = this.topTier === 'None' ? this.bottomTier : this.topTier;
        let endDate = new Date(date.toString());
        if (this.parent.isTimelineRoundOff) {
            if (tierMode === 'Hour') {
                endDate.setMinutes(60);
            }
            else if (tierMode === 'Minutes') {
                endDate.setSeconds(60);
            }
            else {
                endDate.setHours(24, 0, 0, 0);
            }
        }
        return endDate;
    }
    /**
     *
     * @param startDate
     * @param count
     * @param mode
     * @private
     */
    getIncrement(startDate, count, mode) {
        let firstDay = new Date(startDate.getTime());
        let lastDay = new Date(startDate.getTime());
        let increment;
        switch (mode) {
            case 'Year':
                firstDay = startDate;
                lastDay = new Date(startDate.getFullYear() + (count - 1), 11, 31);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * 24);
                break;
            case 'Month':
                firstDay = startDate;
                lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + count, 0);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * 24);
                break;
            case 'Week':
                let dayIndex = this.parent.timelineModule.customTimelineSettings.weekStartDay;
                let dayIntervel = startDate.getDay() < dayIndex ? (dayIndex - startDate.getDay()) :
                    (6 - startDate.getDay()) + dayIndex;
                count = dayIntervel > 0 ? count - 1 : 0;
                lastDay.setHours(24, 0, 0, 0);
                dayIntervel = startDate.getDay() < dayIndex ? dayIntervel > 0 ?
                    dayIntervel - 1 : dayIntervel : dayIntervel;
                lastDay.setDate(lastDay.getDate() + (dayIntervel + (6 * count)));
                increment = ((lastDay.getTime() - firstDay.getTime()));
                break;
            case 'Day':
                lastDay.setHours(24, 0, 0, 0);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * 24 * (count - 1));
                break;
            case 'Hour':
                lastDay.setMinutes(60);
                lastDay.setSeconds(0);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * (count - 1));
                break;
            case 'Minutes':
                lastDay.setSeconds(60);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * (count - 1));
                break;
        }
        return increment;
    }
    /**
     * Method to find header cell was weekend or not
     * @param mode
     * @param tier
     * @param day
     */
    isWeekendHeaderCell(mode, tier, day) {
        return mode === 'Day' && this.customTimelineSettings[tier].count === 1 &&
            this.parent.nonWorkingDayIndex.indexOf(day.getDay()) !== -1;
    }
    /**
     * To construct template string.
     * @return {string}
     * @private
     */
    getHeaterTemplateString(scheduleWeeks, mode, tier, isLast, count) {
        let parentTr = '';
        let td = '';
        let format = tier === 'topTier' ?
            this.parent.timelineModule.customTimelineSettings.topTier.format :
            this.parent.timelineModule.customTimelineSettings.bottomTier.format;
        let formatter = tier === 'topTier' ?
            this.parent.timelineModule.customTimelineSettings.topTier.formatter :
            this.parent.timelineModule.customTimelineSettings.bottomTier.formatter;
        let thWidth;
        let cellWidth;
        let isWeekendCell;
        let date = isNullOrUndefined(formatter) ?
            this.parent.globalize.formatDate(scheduleWeeks, { format: this.parent.dateFormat }) :
            this.customFormat(scheduleWeeks, format, tier, mode, formatter);
        thWidth = (this.getIncrement(scheduleWeeks, count, mode) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth;
        cellWidth = thWidth;
        thWidth = isLast ? this.calculateWidthBetweenTwoDate(mode, scheduleWeeks, this.timelineRoundOffEndDate)
            : thWidth;
        isWeekendCell = this.isWeekendHeaderCell(mode, tier, scheduleWeeks);
        let textClassName = tier === 'topTier' ? ' e-gantt-top-cell-text' : '';
        td += this.parent.timelineModule.isSingleTier ?
            '<th class="' + timelineSingleHeaderCell + ' ' : '<th class="' + timelineTopHeaderCell + '';
        td += isWeekendCell ? ' ' + weekendHeaderCell : '';
        td += '" style="width:' + thWidth + 'px;';
        td += isWeekendCell && this.customTimelineSettings.weekendBackground ?
            'background-color:' + this.customTimelineSettings.weekendBackground + ';' : '';
        td += '"><div class="' + timelineHeaderCellLabel + textClassName + '" style="width:' +
            (thWidth - 1) + 'px;' + (this.parent.timelineSettings.showTooltip ? '"title="' + date : '');
        td += isWeekendCell && this.customTimelineSettings.weekendBackground ?
            'background-color:' + this.customTimelineSettings.weekendBackground + ';' : '';
        td += '">' + (isNullOrUndefined(formatter) ? this.formatDateHeader(format, scheduleWeeks) :
            this.customFormat(scheduleWeeks, format, tier, mode, formatter)) + '</div>';
        parentTr += td;
        parentTr += '</th>';
        td = '';
        if ((this.isSingleTier || tier === 'topTier') && !isLast) {
            this.totalTimelineWidth = this.totalTimelineWidth + thWidth;
        }
        else if ((this.isSingleTier || tier === 'topTier') && isLast) {
            this.totalTimelineWidth = (this.totalTimelineWidth - cellWidth) + thWidth;
        }
        return parentTr;
    }
    /**
     * To calculate last 'th' width.
     * @return {number}
     * @private
     */
    calculateWidthBetweenTwoDate(mode, scheduleWeeks, endDate) {
        let balanceDay = ((endDate.getTime() - scheduleWeeks.getTime()) / (1000 * 60 * 60 * 24));
        return balanceDay * this.parent.perDayWidth;
    }
    /**
     * To calculate timeline width.
     * @return {void}
     * @private
     */
    timelineWidthCalculation() {
        let timelineUnitSize = this.customTimelineSettings.timelineUnitSize;
        let bottomTierCount = this.customTimelineSettings.bottomTier.count;
        let topTierCount = this.customTimelineSettings.topTier.count;
        this.bottomTierCellWidth = timelineUnitSize;
        switch (this.bottomTier) {
            case 'None':
                this.parent.perDayWidth = this.getPerDayWidth(timelineUnitSize, topTierCount, this.topTier);
                break;
            default:
                this.parent.perDayWidth = this.getPerDayWidth(timelineUnitSize, bottomTierCount, this.bottomTier);
                break;
        }
        this.topTierCellWidth = this.bottomTier !== 'None' ? this.topTier === 'Week' ?
            this.parent.perDayWidth * 7 : this.topTier === 'Hour' ?
            this.parent.perDayWidth / 24 : this.topTier === 'Minutes' ?
            this.parent.perDayWidth / (24 * 60) : this.parent.perDayWidth : timelineUnitSize;
        this.topTierCellWidth = this.isSingleTier ? this.topTierCellWidth : this.topTierCellWidth * topTierCount;
    }
    /**
     * To validate per day width.
     * @return {number}
     * @private
     */
    getPerDayWidth(timelineUnitSize, bottomTierCount, mode) {
        let perDayWidth;
        switch (mode) {
            case 'Year':
                perDayWidth = (timelineUnitSize / bottomTierCount) / (12 * 28);
                break;
            case 'Month':
                perDayWidth = (timelineUnitSize / bottomTierCount) / 28;
                break;
            case 'Week':
                perDayWidth = (timelineUnitSize / bottomTierCount) / 7;
                break;
            case 'Day':
                perDayWidth = timelineUnitSize / bottomTierCount;
                break;
            case 'Hour':
                perDayWidth = (24 / bottomTierCount) * timelineUnitSize;
                break;
            case 'Minutes':
                perDayWidth = ((60 * 24) / bottomTierCount) * timelineUnitSize;
                break;
        }
        return perDayWidth;
    }
    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    roundOffDays() {
        let startDate = this.parent.cloneProjectStartDate;
        let endDate = this.parent.cloneProjectEndDate;
        let tierMode = this.topTier === 'None' ? this.bottomTier : this.topTier;
        if (this.parent.isTimelineRoundOff) {
            if (tierMode === 'Year') {
                startDate = new Date(startDate.getFullYear(), 0, 1);
                endDate = new Date(endDate.getFullYear(), 11, 31);
            }
            else if (tierMode === 'Month') {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            }
            else if (tierMode === 'Week') {
                let dayIndex = this.parent.timelineModule.customTimelineSettings.weekStartDay;
                let roundOffStartDate = startDate.getDay() < dayIndex ?
                    (startDate.getDate()) - (7 - dayIndex + startDate.getDay()) :
                    (startDate.getDate()) - startDate.getDay() + dayIndex;
                startDate.setDate(roundOffStartDate);
                let first = endDate.getDate() - endDate.getDay();
                let last = first + 6 + dayIndex;
                endDate.setDate(last);
            }
            if (tierMode === 'Hour') {
                startDate.setMinutes(0);
            }
            else if (tierMode === 'Minutes') {
                startDate.setSeconds(0);
            }
            else {
                startDate.setHours(0, 0, 0, 0);
            }
        }
        this.timelineStartDate = startDate;
        this.timelineEndDate = endDate;
        this.timelineRoundOffEndDate = this.getTimelineRoundOffEndDate(this.timelineEndDate);
    }
    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    updateScheduleDatesByToolBar(mode, span, startDate, endDate) {
        if (mode === 'Year') {
            if (span === 'prevTimeSpan') {
                if (startDate.getMonth() === 0) {
                    startDate = new Date(startDate.getFullYear() - 1, 0, 1);
                }
                else {
                    startDate = new Date(startDate.getFullYear(), 0, 1);
                }
            }
            else {
                if (endDate.getMonth() === 11) {
                    endDate = new Date(endDate.getFullYear() + 1, 0, 1);
                }
                else {
                    endDate = new Date(endDate.getFullYear(), 12, 1);
                }
            }
        }
        if (mode === 'Month') {
            if (span === 'prevTimeSpan') {
                if (startDate.getDate() === 1) {
                    startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
                }
                else {
                    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                }
            }
            else {
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);
            }
        }
        if (mode === 'Week') {
            let dayIndex = this.parent.timelineModule.customTimelineSettings.weekStartDay;
            let dayIntervel;
            if (span === 'prevTimeSpan') {
                dayIntervel = startDate.getDay() < dayIndex ? 7 - (dayIndex - startDate.getDay()) :
                    startDate.getDay() - dayIndex;
                startDate.setHours(0, 0, 0, 0);
                if (dayIntervel === 0) {
                    startDate.setDate(startDate.getDate() - 7);
                }
                else {
                    startDate.setDate(startDate.getDate() - dayIntervel);
                }
            }
            else {
                dayIntervel = endDate.getDay() < dayIndex ? (dayIndex - endDate.getDay()) :
                    (7 - endDate.getDay()) + dayIndex;
                endDate.setHours(0, 0, 0, 0);
                if (dayIntervel === 0) {
                    endDate.setDate(endDate.getDate() + 6);
                }
                else {
                    endDate.setDate(endDate.getDate() + dayIntervel);
                }
            }
        }
        if (mode === 'Day') {
            if (span === 'prevTimeSpan') {
                if (startDate.getHours() === 0) {
                    startDate.setTime(startDate.getTime() - (1000 * 60 * 60 * 24));
                }
                else {
                    startDate.setHours(0);
                }
            }
            else {
                if (endDate.getHours() === 0) {
                    endDate.setTime(endDate.getTime() + (1000 * 60 * 60 * 24));
                }
                else {
                    endDate.setHours(24);
                }
            }
        }
        if (mode === 'Hour') {
            if (span === 'prevTimeSpan') {
                if (startDate.getMinutes() === 0) {
                    startDate.setTime(startDate.getTime() - (1000 * 60 * 60));
                }
                else {
                    startDate.setMinutes(0);
                }
            }
            else {
                if (endDate.getMinutes() === 0) {
                    endDate.setTime(endDate.getTime() + (1000 * 60 * 60));
                }
                else {
                    endDate.setMinutes(60);
                }
            }
        }
        if (mode === 'Minutes') {
            if (span === 'prevTimeSpan') {
                if (startDate.getSeconds() === 0) {
                    startDate.setTime(startDate.getTime() - (1000 * 60));
                }
                else {
                    startDate.setSeconds(0);
                }
            }
            else {
                if (endDate.getSeconds() === 0) {
                    endDate.setTime(endDate.getTime() + (1000 * 60));
                }
                else {
                    endDate.setSeconds(60);
                }
            }
        }
        this.parent.cloneProjectStartDate = startDate;
        this.parent.cloneProjectEndDate = endDate;
    }
    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    updateTimeLineOnEditing(tempArray, action) {
        let filteredStartDateRecord = tempArray.filter((pdc) => { return !isNullOrUndefined(pdc.ganttProperties.startDate); });
        let filteredEndDateRecord = tempArray.filter((pdc) => { return !isNullOrUndefined(pdc.ganttProperties.endDate); });
        let minStartDate = filteredStartDateRecord.length > 0 ?
            new Date(DataUtil.aggregates.min(filteredStartDateRecord, 'ganttProperties.startDate')) : null;
        let maxEndDate = filteredEndDateRecord.length > 0 ?
            new Date(DataUtil.aggregates.max(filteredEndDateRecord, 'ganttProperties.endDate')) : null;
        let validStartDate = new Date(this.parent.dataOperation.checkStartDate(this.timelineStartDate).getTime());
        let validEndDate = new Date(this.parent.dataOperation.checkEndDate(this.timelineEndDate).getTime());
        let maxStartLeft = isNullOrUndefined(minStartDate) ?
            null : this.parent.dataOperation.getTaskLeft(minStartDate, false);
        let maxEndLeft = isNullOrUndefined(maxEndDate) ?
            null : this.parent.dataOperation.getTaskLeft(maxEndDate, false);
        let validStartLeft = this.parent.dataOperation.getTaskLeft(validStartDate, false);
        let validEndLeft = this.parent.dataOperation.getTaskLeft(validEndDate, false);
        let isChanged;
        if (!isNullOrUndefined(maxStartLeft) && (maxStartLeft <= this.bottomTierCellWidth || maxStartLeft <= validStartLeft)) {
            isChanged = 'prevTimeSpan';
            minStartDate = minStartDate > this.timelineStartDate ? this.timelineStartDate : minStartDate;
        }
        else {
            minStartDate = this.timelineStartDate;
        }
        if (!isNullOrUndefined(maxEndLeft) && (maxEndLeft >= (this.totalTimelineWidth - this.bottomTierCellWidth) ||
            maxEndLeft >= validEndLeft)) {
            isChanged = isChanged === 'prevTimeSpan' ? 'both' : 'nextTimeSpan';
            maxEndDate = maxEndDate < this.timelineEndDate ? this.timelineEndDate : maxEndDate;
        }
        else {
            maxEndDate = this.timelineEndDate;
        }
        if (isChanged) {
            this.performTimeSpanAction(isChanged, action, minStartDate, maxEndDate);
        }
    }
    /**
     * To validate project start date and end date on editing action
     * @return {void}
     * @private
     */
    performTimeSpanAction(type, isFrom, startDate, endDate, mode) {
        mode = !isNullOrUndefined(mode) ? mode : this.parent.timelineModule.topTier === 'None' ?
            this.parent.timelineModule.bottomTier : this.parent.timelineModule.topTier;
        let projectStartDate = new Date(this.parent.cloneProjectStartDate.getTime());
        let projectEndDate = new Date(this.parent.cloneProjectEndDate.getTime());
        if (isFrom !== 'publicMethod' && type === 'both') {
            this.updateScheduleDatesByToolBar(mode, 'prevTimeSpan', startDate, endDate);
            this.updateScheduleDatesByToolBar(mode, 'nextTimeSpan', new Date(this.parent.cloneProjectStartDate.getTime()), endDate);
        }
        else {
            this.updateScheduleDatesByToolBar(mode, type, startDate, endDate);
        }
        let args = this.timeSpanActionEvent('actionBegin', type, isFrom);
        if (!args.cancel) {
            this.parent.updateProjectDates(args.projectStartDate, args.ProjectEndDate, args.isTimelineRoundOff);
            if (type === 'prevTimeSpan' && isFrom === 'publicMethod') {
                this.parent.ganttChartModule.updateScrollLeft(0);
            }
            else if (type === 'nextTimeSpan' && isFrom === 'publicMethod') {
                this.parent.ganttChartModule.updateScrollLeft(this.parent.timelineModule.totalTimelineWidth);
            }
            this.parent.timelineModule.timeSpanActionEvent('actionComplete', type, isFrom);
        }
        else {
            this.parent.cloneProjectStartDate = projectStartDate;
            this.parent.cloneProjectEndDate = projectEndDate;
        }
    }
    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    timeSpanActionEvent(eventType, requestType, isFrom) {
        let args = {};
        args.projectStartDate = new Date(this.parent.cloneProjectStartDate.getTime());
        args.ProjectEndDate = new Date(this.parent.cloneProjectEndDate.getTime());
        args.requestType = isFrom === 'publicMethod' ? requestType : isFrom === 'beforeAdd' ?
            'TimelineRefreshOnAdd' : isFrom === 'TaskbarEditing' ? 'TimelineRefreshOnEdit' : requestType;
        if (eventType === 'actionBegin') {
            args.isTimelineRoundOff = this.parent.isTimelineRoundOff;
            args.cancel = false;
        }
        this.parent.trigger(eventType, args);
        return args;
    }
}

/**
 * Configures column collection in Gantt
 */
class Column {
    constructor(options) {
        /**
         * If `allowEditing` set to false, then it disables editing of a particular column.
         * By default all columns are editable.
         * @default true
         */
        this.allowEditing = true;
        /**
         * If `allowReordering` set to false, then it disables reorder of a particular column.
         * By default all columns can be reorder.
         * @default true
         */
        this.allowReordering = true;
        /**
         * If `allowResizing` is set to false, it disables resize option of a particular column.
         * By default all the columns can be resized.
         * @default true
         */
        this.allowResizing = true;
        /**
         * If `allowSorting` set to false, then it disables sorting option of a particular column.
         * By default all columns are sortable.
         * @default true
         */
        this.allowSorting = true;
        /**
         * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
         * By default all columns are filterable.
         * @default true
         */
        this.allowFiltering = true;
        /**
         * Defines the `IEditCell` object to customize default edit cell.
         * @default {}
         */
        this.edit = {};
        merge(this, options);
    }
}

/**
 * TreeGrid related code goes here
 */
class GanttTreeGrid {
    constructor(parent) {
        this.previousScroll = { top: 0, left: 0 };
        this.queryCellInfo = (args) => {
            this.parent.trigger('queryCellInfo', args);
        };
        this.headerCellInfo = (args) => {
            this.parent.trigger('headerCellInfo', args);
        };
        this.rowDataBound = (args) => {
            this.parent.trigger('rowDataBound', args);
        };
        this.columnMenuOpen = (args) => {
            this.parent.notify('columnMenuOpen', args);
            this.parent.trigger('columnMenuOpen', args);
        };
        this.columnMenuClick = (args) => {
            this.parent.trigger('columnMenuClick', args);
        };
        this.parent = parent;
        this.parent.treeGrid = new TreeGrid();
        this.parent.treeGrid.allowSelection = false;
        this.treeGridColumns = [];
        this.validateGanttColumns();
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on('renderPanels', this.createContainer, this);
        this.parent.on('chartScroll', this.updateScrollTop, this);
        this.parent.on('destroy', this.destroy, this);
    }
    createContainer() {
        //let height: number = this.parent.ganttHeight - this.parent.toolbarModule.element.offsetHeight - 46;
        this.treeGridElement = createElement('div', {
            id: 'treeGrid' + this.parent.element.id, className: 'e-gantt-tree-grid',
        });
        let tempHeader = createElement('div', { className: 'e-gantt-temp-header' });
        this.parent.treeGridPane.appendChild(this.treeGridElement);
        this.treeGridElement.appendChild(tempHeader);
        this.parent.treeGridPane.classList.add('e-temp-content');
    }
    /**
     * Method to initiate TreeGrid
     */
    renderTreeGrid() {
        this.composeProperties();
        this.bindEvents();
        this.parent.treeGrid.appendTo(this.treeGridElement);
        this.wireEvents();
    }
    composeProperties() {
        this.parent.treeGrid.showColumnMenu = this.parent.showColumnMenu;
        this.parent.treeGrid.childMapping = this.parent.taskFields.child;
        this.parent.treeGrid.treeColumnIndex = this.parent.treeColumnIndex;
        this.parent.treeGrid.columns = this.treeGridColumns;
        this.parent.treeGrid.dataSource = this.parent.flatData;
        this.parent.treeGrid.rowHeight = this.parent.rowHeight;
        this.parent.treeGrid.gridLines = this.parent.gridLines;
        this.parent.treeGrid.searchSettings = this.parent.searchSettings;
        let toolbarHeight = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        this.parent.treeGrid.height = this.parent.ganttHeight - toolbarHeight - 46;
    }
    getContentDiv() {
        return this.treeGridElement.querySelector('.e-content');
    }
    ensureScrollBar() {
        let content = this.getContentDiv();
        //let isScroll: boolean = content.scrollHeight > content.offsetHeight;
        //if (isScroll) {
        content.classList.add('e-gantt-scroll-padding');
        //} else {
        // content.classList.remove('e-gantt-scroll-padding');
        //}
    }
    bindEvents() {
        this.parent.treeGrid.dataBound = this.dataBound.bind(this);
        this.parent.treeGrid.collapsing = this.collapsing.bind(this);
        this.parent.treeGrid.collapsed = this.collapsed.bind(this);
        this.parent.treeGrid.expanding = this.expanding.bind(this);
        this.parent.treeGrid.expanded = this.expanded.bind(this);
        this.parent.treeGrid.actionBegin = this.actionBegin.bind(this);
        this.parent.treeGrid.actionComplete = this.treeActionComplete.bind(this);
        this.parent.treeGrid.created = this.created.bind(this);
        this.parent.treeGrid.actionFailure = this.actionFailure.bind(this);
        this.parent.treeGrid.queryCellInfo = this.queryCellInfo.bind(this);
        this.parent.treeGrid.headerCellInfo = this.headerCellInfo.bind(this);
        this.parent.treeGrid.rowDataBound = this.rowDataBound.bind(this);
        this.parent.treeGrid.columnMenuOpen = this.columnMenuOpen.bind(this);
        this.parent.treeGrid.columnMenuClick = this.columnMenuClick.bind(this);
    }
    dataBound(args) {
        this.ensureScrollBar();
        this.parent.treeDataBound(args);
    }
    collapsing(args) {
        // Collapsing event
    }
    expanding(args) {
        // Collapsing event
    }
    collapsed(args) {
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            let collapsingArgs = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.collapseGanttRow(collapsingArgs);
        }
    }
    expanded(args) {
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            let expandingArgs = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.expandGanttRow(expandingArgs);
        }
    }
    actionBegin(args) {
        this.parent.notify('actionBegin', args);
        this.parent.trigger('actionBegin', args);
    }
    created(args) {
        this.updateKeyConfigSettings();
    }
    actionFailure(args) {
        this.parent.trigger('actionFailure', args);
    }
    createExpandCollapseArgs(args) {
        let record = getValue('data', args);
        let gridRow = getValue('row', args);
        let chartRow = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(record)];
        let eventArgs = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
        return eventArgs;
    }
    treeActionComplete(args) {
        let updatedArgs = extend({}, args, true);
        if (getValue('requestType', args) === 'sorting') {
            this.parent.notify('updateModel', {});
            deleteObject(updatedArgs, 'isFrozen');
        }
        else if (getValue('requestType', args) === 'filtering') {
            this.parent.notify('updateModel', {});
        }
        else if (getValue('type', args) === 'save') {
            if (this.parent.editModule && this.parent.editModule.cellEditModule) {
                this.parent.editModule.cellEditModule.initiateCellEdit(args, this.currentEditRow);
                this.currentEditRow = {};
            }
        }
        if (getValue('requestType', args) === 'filterafteropen') {
            this.parent.notify('actionComplete', args);
        }
        if (getValue('requestType', args) === 'searching') {
            this.parent.notify('actionComplete', args);
        }
        if (!isNullOrUndefined(getValue('batchChanges', args)) && !isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        this.parent.trigger('actionComplete', updatedArgs);
    }
    updateKeyConfigSettings() {
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.delete;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.insert;
    }
    /**
     * Method to bind internal events on TreeGrid element
     */
    wireEvents() {
        let content = this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.add(content, 'scroll', this.scrollHandler, this);
        }
    }
    unWireEvents() {
        let content = this.parent.treeGrid.element &&
            this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.remove(content, 'scroll', this.scrollHandler);
        }
    }
    scrollHandler(e) {
        let content = this.parent.treeGrid.element.querySelector('.e-content');
        if (content.scrollTop !== this.previousScroll.top) {
            this.parent.notify('grid-scroll', { top: content.scrollTop });
        }
        this.previousScroll.top = content.scrollTop;
    }
    validateGanttColumns() {
        let ganttObj = this.parent;
        let length = ganttObj.columns.length;
        let tasks = this.parent.taskFields;
        this.parent.columnMapping = {};
        this.parent.columnByField = {};
        this.parent.customColumns = [];
        let tasksMapping = ['id', 'name', 'startDate', 'endDate', 'duration', 'dependency',
            'progress', 'baselineStartDate', 'baselineEndDate', 'resourceInfo', 'notes'];
        for (let i = 0; i < length; i++) {
            let column = {};
            if (typeof ganttObj.columns[i] === 'string') {
                column.field = ganttObj.columns[i];
            }
            else {
                column = ganttObj.columns[i];
            }
            let columnName = [];
            if (tasksMapping.length > 0) {
                columnName = tasksMapping.filter((name) => {
                    return column.field === tasks[name];
                });
            }
            if (columnName.length === 0) {
                this.parent.customColumns.push(column.field);
                column.headerText = column.headerText ? column.headerText : column.field;
                column.width = column.width ? column.width : 150;
                column.editType = column.editType ? column.editType : 'stringedit';
                column.type = column.type ? column.type : 'string';
                this.bindTreeGridColumnProperties(column, true);
                continue;
            }
            else {
                let index = tasksMapping.indexOf(columnName[0]);
                tasksMapping.splice(index, 1);
                this.createTreeGridColumn(column, true);
                this.parent.columnMapping[columnName[0]] = column.field;
            }
        }
        /** Create default columns with task settings property */
        for (let j = 0; j < tasksMapping.length; j++) {
            let column = {};
            if (!isNullOrUndefined(tasks[tasksMapping[j]])) {
                column.field = tasks[tasksMapping[j]];
                this.createTreeGridColumn(column, length === 0);
                this.parent.columnMapping[tasksMapping[j]] = column.field;
            }
        }
    }
    /**
     *
     * @param column
     * @param isDefined
     */
    createTreeGridColumn(column, isDefined) {
        let taskSettings = this.parent.taskFields;
        if (taskSettings.id !== column.field) {
            column.clipMode = column.clipMode ? column.clipMode : 'EllipsisWithTooltip';
        }
        if (taskSettings.id === column.field) {
            /** Id column */
            this.composeIDColumn(column);
        }
        else if (taskSettings.name === column.field) {
            /** Name column */
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('name');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = column.type ? column.type : 'string';
        }
        else if (taskSettings.startDate === column.field) {
            /** Name column */
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('startDate');
            column.format = column.format ? column.format : { type: 'date', format: this.parent.dateFormat };
            column.editType = column.editType ? column.editType :
                this.parent.dateFormat.toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.width = column.width ? column.width : 150;
            this.initiateFiltering(column);
        }
        else if (taskSettings.endDate === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('endDate');
            column.format = column.format ? column.format : { type: 'date', format: this.parent.dateFormat };
            column.editType = column.editType ? column.editType :
                this.parent.dateFormat.toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            this.initiateFiltering(column);
            column.width = column.width ? column.width : 150;
        }
        else if (taskSettings.duration === column.field) {
            column.width = column.width ? column.width : 150;
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('duration');
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.durationValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
            this.initiateFiltering(column);
        }
        else if (taskSettings.progress === column.field) {
            this.composeProgressColumn(column);
        }
        else if (taskSettings.dependency === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('dependency');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
            column.allowFiltering = column.allowFiltering === false ? false : true;
        }
        else if (taskSettings.resourceInfo === column.field) {
            this.composeResourceColumn(column);
        }
        else if (taskSettings.notes === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('notes');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            if (!this.parent.showInlineNotes) {
                if (!column.template) {
                    column.template = '<div class="e-ganttnotes-info">' +
                        '<span class="e-icons e-notes-info"></span></div>';
                }
            }
            else {
                column.disableHtmlEncode = true;
            }
        }
        else if (taskSettings.baselineStartDate === column.field) {
            column.width = column.width ? column.width : 150;
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('baselineStartDate');
            column.format = column.format ? column.format : { type: 'date', format: this.parent.dateFormat };
            column.editType = column.editType ? column.editType :
                this.parent.dateFormat.toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            this.initiateFiltering(column);
        }
        else if (taskSettings.baselineEndDate === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('baselineEndDate');
            column.width = column.width ? column.width : 150;
            column.format = column.format ? column.format : { type: 'date', format: this.parent.dateFormat };
            column.editType = column.editType ? column.editType :
                this.parent.dateFormat.toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            this.initiateFiltering(column);
        }
        this.bindTreeGridColumnProperties(column, isDefined);
    }
    /**
     * Compose Resource columns
     * @param column
     */
    composeResourceColumn(column) {
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('resourceName');
        column.width = column.width ? column.width : 150;
        column.type = 'string';
        column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.resourceValueAccessor.bind(this);
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getResourceEditor();
        }
        column.allowFiltering = column.allowFiltering === false ? false : true;
    }
    getResourceIds(data) {
        return getValue(this.parent.taskFields.resourceInfo, data.taskData);
    }
    getResourceEditor() {
        let editObject = {};
        let editor;
        MultiSelect.Inject(CheckBoxSelection);
        editObject.write = (args) => {
            this.currentEditRow = {};
            editor = new MultiSelect({
                dataSource: new DataManager(this.parent.resources),
                fields: { text: this.parent.resourceNameMapping, value: this.parent.resourceIDMapping },
                mode: 'CheckBox',
                showDropDownIcon: true,
                popupHeight: '350px',
                delimiterChar: ',',
                value: this.getResourceIds(args.rowData)
            });
            editor.appendTo(args.element);
        };
        editObject.read = (element) => {
            let value = element.ej2_instances[0].value;
            let resourcesName = [];
            if (isNullOrUndefined(value)) {
                value = [];
            }
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < this.parent.resources.length; j++) {
                    if (this.parent.resources[j][this.parent.resourceIDMapping] === value[i]) {
                        resourcesName.push(this.parent.resources[j][this.parent.resourceNameMapping]);
                        break;
                    }
                }
            }
            this.currentEditRow[this.parent.taskFields.resourceInfo] = value;
            return resourcesName.join(',');
        };
        editObject.destroy = () => {
            if (editor) {
                editor.destroy();
            }
        };
        return editObject;
    }
    /**
     * Create Id column
     * @param column
     */
    composeIDColumn(column) {
        column.isPrimaryKey = isNullOrUndefined(column.isPrimaryKey) ? true : column.isPrimaryKey;
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('id');
        column.width = column.width ? column.width : 100;
        column.allowEditing = false;
        column.editType = column.editType ? column.editType : 'numericedit';
        let editParam = {
            min: 0,
            decimals: 0,
            validateDecimalOnType: true,
            format: 'n0',
            showSpinButton: false
        };
        if (isNullOrUndefined(column.edit)) {
            column.edit = {};
            column.edit.params = {};
        }
        else if (isNullOrUndefined(column.edit.params)) {
            column.edit.params = {};
        }
        extend(column.edit.params, editParam);
    }
    /**
     * Create progress column
     * @param column
     */
    composeProgressColumn(column) {
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('progress');
        column.width = column.width ? column.width : 150;
        column.editType = column.editType ? column.editType : 'numericedit';
        let editParam = {
            min: 0,
            max: 100,
            decimals: 0,
            validateDecimalOnType: true,
            format: 'n0'
        };
        if (isNullOrUndefined(column.edit)) {
            column.edit = {};
            column.edit.params = {};
        }
        else if (isNullOrUndefined(column.edit.params)) {
            column.edit.params = {};
        }
        extend(column.edit.params, editParam);
    }
    initiateFiltering(column) {
        column.allowFiltering = column.allowFiltering === false ? false : true;
        column.filter = column.filter ? column.filter : null;
        if (column.allowFiltering && this.parent.filterSettings.type === 'Menu' && !column.filter) {
            column.filter = { ui: this.getCustomFilterUi(column) };
        }
    }
    /**
     * To get filter menu UI
     * @param column
     */
    getCustomFilterUi(column) {
        let settings = this.parent.taskFields;
        let filterUI = {};
        if (column.editType === 'datepickeredit' && (column.field === settings.startDate || column.field === settings.endDate
            || column.field === settings.baselineStartDate || column.field === settings.baselineEndDate)) {
            filterUI = this.getDatePickerFilter(column.field);
        }
        else if (column.editType === 'datetimepickeredit' && (column.field === settings.startDate || column.field === settings.endDate
            || column.field === settings.baselineStartDate || column.field === settings.baselineEndDate)) {
            filterUI = this.getDateTimePickerFilter();
        }
        else if (column.field === settings.duration && column.editType === 'stringedit') {
            filterUI = this.getDurationFilter();
        }
        return filterUI;
    }
    getDatePickerFilter(columnName) {
        let parent = this.parent;
        let timeValue = (columnName === parent.taskFields.startDate) || (columnName === parent.taskFields.baselineStartDate)
            ? parent.defaultStartTime : parent.defaultEndTime;
        let dropDateInstance;
        let filterDateUI = {
            create: (args) => {
                let flValInput = createElement('input', { className: 'flm-input' });
                args.target.appendChild(flValInput);
                dropDateInstance = new DatePicker({ placeholder: this.parent.localeObj.getConstant('enterValue') });
                dropDateInstance.appendTo(flValInput);
            },
            write: (args) => {
                dropDateInstance.value = args.filteredValue;
            },
            read: (args) => {
                if (dropDateInstance.value) {
                    dropDateInstance.value.setSeconds(timeValue);
                }
                args.fltrObj.filterByColumn(args.column.field, args.operator, dropDateInstance.value);
            }
        };
        return filterDateUI;
    }
    getDateTimePickerFilter() {
        let dropInstance;
        let filterDateTimeUI = {
            create: (args) => {
                let flValInput = createElement('input', { className: 'flm-input' });
                args.target.appendChild(flValInput);
                dropInstance = new DateTimePicker({ placeholder: this.parent.localeObj.getConstant('enterValue') });
                dropInstance.appendTo(flValInput);
            },
            write: (args) => {
                dropInstance.value = args.filteredValue;
            },
            read: (args) => {
                args.fltrObj.filterByColumn(args.column.field, args.operator, dropInstance.value);
            }
        };
        return filterDateTimeUI;
    }
    getDurationFilter() {
        let parent = this.parent;
        let textBoxInstance;
        let textValue = '';
        let filterDurationUI = {
            create: (args) => {
                let flValInput = createElement('input', { className: 'e-input' });
                flValInput.setAttribute('placeholder', this.parent.localeObj.getConstant('enterValue'));
                args.target.appendChild(flValInput);
                textBoxInstance = new TextBox();
                textBoxInstance.appendTo(flValInput);
            },
            write: (args) => {
                textBoxInstance.value = args.filteredValue ? textValue : '';
            },
            read: (args) => {
                let durationObj = this.parent.dataOperation.getDurationValue(textBoxInstance.value);
                let intVal = getValue('duration', durationObj);
                let unit = getValue('durationUnit', durationObj);
                if (intVal >= 0) {
                    let dayVal;
                    if (unit === 'minute') {
                        dayVal = (intVal * 60) / parent.secondsPerDay;
                    }
                    else if (unit === 'hour') {
                        dayVal = (intVal * 60 * 60) / parent.secondsPerDay;
                    }
                    else {
                        //Consider it as day unit
                        dayVal = intVal;
                        unit = 'day';
                    }
                    args.fltrObj.filterByColumn(args.column.field, args.operator, dayVal);
                    textValue = this.parent.dataOperation.getDurationString(intVal, unit);
                }
                else {
                    args.fltrObj.filterByColumn(args.column.field, args.operator, null);
                    textValue = null;
                }
            }
        };
        return filterDurationUI;
    }
    /**
     *
     */
    bindTreeGridColumnProperties(newGanttColumn, isDefined) {
        let treeGridColumn = {};
        let ganttColumn = {};
        for (let prop of Object.keys(newGanttColumn)) {
            treeGridColumn[prop] = ganttColumn[prop] = newGanttColumn[prop];
        }
        this.parent.columnByField[ganttColumn.field] = ganttColumn;
        this.parent.ganttColumns.push(new Column(ganttColumn));
        if (isDefined) {
            this.treeGridColumns.push(treeGridColumn);
        }
    }
    durationValueAccessor(field, data, column) {
        let ganttProp = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
        }
        return '';
    }
    resourceValueAccessor(field, data, column) {
        let ganttProp = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.resourceNames;
        }
        return '';
    }
    updateScrollTop(args) {
        this.treeGridElement.querySelector('.e-content').scrollTop = getValue('top', args);
        this.previousScroll.top = this.treeGridElement.querySelector('.e-content').scrollTop;
    }
    removeEventListener() {
        this.parent.off('renderPanels', this.createContainer);
        this.parent.off('chartScroll', this.updateScrollTop);
        this.parent.off('destroy', this.destroy);
    }
    destroy() {
        this.removeEventListener();
        this.unWireEvents();
        if (this.parent.treeGrid.element) {
            this.parent.treeGrid.destroy();
        }
    }
}

/**
 * Defines working time of day in project
 */
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class DayWorkingTime extends ChildProperty {
}
__decorate$1([
    Property(null)
], DayWorkingTime.prototype, "from", void 0);
__decorate$1([
    Property(null)
], DayWorkingTime.prototype, "to", void 0);

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines dialog fields of add dialog and edit dialog
 */
class AddDialogFieldSettings extends ChildProperty {
}
__decorate$2([
    Property(null)
], AddDialogFieldSettings.prototype, "type", void 0);
__decorate$2([
    Property(null)
], AddDialogFieldSettings.prototype, "headerText", void 0);
__decorate$2([
    Property([])
], AddDialogFieldSettings.prototype, "fields", void 0);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines dialog fields of add dialog and edit dialog
 */
class EditDialogFieldSettings extends ChildProperty {
}
__decorate$3([
    Property(null)
], EditDialogFieldSettings.prototype, "type", void 0);
__decorate$3([
    Property(null)
], EditDialogFieldSettings.prototype, "headerText", void 0);
__decorate$3([
    Property([])
], EditDialogFieldSettings.prototype, "fields", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures edit settings of Gantt
 */
class EditSettings extends ChildProperty {
}
__decorate$4([
    Property(false)
], EditSettings.prototype, "allowEditing", void 0);
__decorate$4([
    Property(false)
], EditSettings.prototype, "allowAdding", void 0);
__decorate$4([
    Property(false)
], EditSettings.prototype, "allowDeleting", void 0);
__decorate$4([
    Property('Auto')
], EditSettings.prototype, "mode", void 0);
__decorate$4([
    Property('Top')
], EditSettings.prototype, "newRowPosition", void 0);
__decorate$4([
    Property(false)
], EditSettings.prototype, "showDeleteConfirmDialog", void 0);
__decorate$4([
    Property(false)
], EditSettings.prototype, "allowTaskbarEditing", void 0);

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines event marker collection in Gantt
 */
class EventMarker extends ChildProperty {
}
__decorate$5([
    Property(null)
], EventMarker.prototype, "day", void 0);
__decorate$5([
    Property(null)
], EventMarker.prototype, "label", void 0);
__decorate$5([
    Property(null)
], EventMarker.prototype, "cssClass", void 0);

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the Gantt.
 */
class FilterSettings extends ChildProperty {
}
__decorate$6([
    Collection([], Predicate)
], FilterSettings.prototype, "columns", void 0);
__decorate$6([
    Property('Menu')
], FilterSettings.prototype, "type", void 0);
__decorate$6([
    Property()
], FilterSettings.prototype, "operators", void 0);
__decorate$6([
    Property(false)
], FilterSettings.prototype, "ignoreAccent", void 0);
__decorate$6([
    Property('Parent')
], FilterSettings.prototype, "hierarchyMode", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the Grid.
 */
class SearchSettings extends ChildProperty {
}
__decorate$7([
    Property([])
], SearchSettings.prototype, "fields", void 0);
__decorate$7([
    Property(false)
], SearchSettings.prototype, "ignoreCase", void 0);
__decorate$7([
    Property('contains')
], SearchSettings.prototype, "operator", void 0);
__decorate$7([
    Property('')
], SearchSettings.prototype, "key", void 0);
__decorate$7([
    Property('Parent')
], SearchSettings.prototype, "hierarchyMode", void 0);

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines holidays of project
 */
class Holiday extends ChildProperty {
}
__decorate$8([
    Property(null)
], Holiday.prototype, "from", void 0);
__decorate$8([
    Property(null)
], Holiday.prototype, "to", void 0);
__decorate$8([
    Property(null)
], Holiday.prototype, "label", void 0);
__decorate$8([
    Property(null)
], Holiday.prototype, "cssClass", void 0);

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines labels for task, this will be placed right, left and inner side of taskbar.
 */
class LabelSettings extends ChildProperty {
}
__decorate$9([
    Property(null)
], LabelSettings.prototype, "rightLabel", void 0);
__decorate$9([
    Property(null)
], LabelSettings.prototype, "leftLabel", void 0);
__decorate$9([
    Property(null)
], LabelSettings.prototype, "taskLabel", void 0);

var __decorate$10 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the selection behavior of the Gantt.
 */
class SelectionSettings extends ChildProperty {
}
__decorate$10([
    Property('Row')
], SelectionSettings.prototype, "mode", void 0);
__decorate$10([
    Property('Flow')
], SelectionSettings.prototype, "cellSelectionMode", void 0);
__decorate$10([
    Property('Single')
], SelectionSettings.prototype, "type", void 0);
__decorate$10([
    Property(false)
], SelectionSettings.prototype, "persistSelection", void 0);

var __decorate$11 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures splitter position and splitter bar
 */
class SplitterSettings extends ChildProperty {
}
__decorate$11([
    Property(null)
], SplitterSettings.prototype, "position", void 0);
__decorate$11([
    Property(-1)
], SplitterSettings.prototype, "columnIndex", void 0);
__decorate$11([
    Property(4)
], SplitterSettings.prototype, "separatorSize", void 0);
__decorate$11([
    Property(null)
], SplitterSettings.prototype, "minimum", void 0);
__decorate$11([
    Property('Default')
], SplitterSettings.prototype, "view", void 0);

/**
 * Defines mapping property to get task details from data source
 */
var __decorate$12 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class TaskFields extends ChildProperty {
}
__decorate$12([
    Property(null)
], TaskFields.prototype, "id", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "name", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "parentID", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "startDate", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "endDate", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "dependency", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "progress", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "child", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "milestone", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "duration", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "durationUnit", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "cssClass", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "baselineStartDate", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "baselineEndDate", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "resourceInfo", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "expandState", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "indicators", void 0);
__decorate$12([
    Property(null)
], TaskFields.prototype, "notes", void 0);

var __decorate$13 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures timeline settings of Gantt
 */
class TimelineTierSettings extends ChildProperty {
}
__decorate$13([
    Property('')
], TimelineTierSettings.prototype, "format", void 0);
__decorate$13([
    Property('None')
], TimelineTierSettings.prototype, "unit", void 0);
__decorate$13([
    Property(1)
], TimelineTierSettings.prototype, "count", void 0);
__decorate$13([
    Property(null)
], TimelineTierSettings.prototype, "formatter", void 0);
/**
 * Configures the timeline settings property in the Gantt
 */
class TimelineSettings extends ChildProperty {
}
__decorate$13([
    Property('Week')
], TimelineSettings.prototype, "timelineViewMode", void 0);
__decorate$13([
    Complex({}, TimelineTierSettings)
], TimelineSettings.prototype, "topTier", void 0);
__decorate$13([
    Complex({}, TimelineTierSettings)
], TimelineSettings.prototype, "bottomTier", void 0);
__decorate$13([
    Property(33)
], TimelineSettings.prototype, "timelineUnitSize", void 0);
__decorate$13([
    Property(0)
], TimelineSettings.prototype, "weekStartDay", void 0);
__decorate$13([
    Property(null)
], TimelineSettings.prototype, "weekendBackground", void 0);
__decorate$13([
    Property(true)
], TimelineSettings.prototype, "showTooltip", void 0);
__decorate$13([
    Property(true)
], TimelineSettings.prototype, "updateTimescaleView", void 0);

var __decorate$14 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures tooltip settings for Gantt
 */
class TooltipSettings extends ChildProperty {
}
__decorate$14([
    Property(true)
], TooltipSettings.prototype, "showTooltip", void 0);
__decorate$14([
    Property()
], TooltipSettings.prototype, "taskbar", void 0);
__decorate$14([
    Property()
], TooltipSettings.prototype, "baseline", void 0);
__decorate$14([
    Property()
], TooltipSettings.prototype, "connectorLine", void 0);
__decorate$14([
    Property()
], TooltipSettings.prototype, "editing", void 0);

var __decorate$15 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the field name and direction of sort column.
 */
class SortDescriptor extends ChildProperty {
}
__decorate$15([
    Property()
], SortDescriptor.prototype, "field", void 0);
__decorate$15([
    Property()
], SortDescriptor.prototype, "direction", void 0);
/**
 * Configures the sorting behavior of Gantt
 */
class SortSettings extends ChildProperty {
}
__decorate$15([
    Collection([], SortDescriptor)
], SortSettings.prototype, "columns", void 0);
__decorate$15([
    Property(true)
], SortSettings.prototype, "allowUnsort", void 0);

/**
 * Export all generated models for complex settings
 */

/**
 * To render the chart rows in Gantt
 */
class ChartRows {
    constructor(ganttObj) {
        this.taskBarHeight = 0;
        this.milestoneHeight = 0;
        this.milesStoneRadius = 0;
        this.baselineTop = 0;
        this.baselineHeight = 3;
        this.touchLeftConnectorpoint = '';
        this.touchRightConnectorpoint = '';
        this.parent = ganttObj;
        this.initPublicProp();
        this.addEventListener();
    }
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    initPublicProp() {
        this.ganttChartTableBody = null;
    }
    addEventListener() {
        this.parent.on('renderPanels', this.createChartTable, this);
        this.parent.on('dataReady', this.initiateTemplates, this);
        this.parent.on('destroy', this.destroy, this);
    }
    refreshChartByTimeline() {
        this.taskTable.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.refreshGanttRows();
    }
    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    createChartTable() {
        this.taskTable = createElement('table', {
            className: taskTable + ' ' + zeroSpacing, id: 'GanttTaskTable' + this.parent.element.id,
            styles: 'z-index: 2;position: absolute;width:' + this.parent.timelineModule.totalTimelineWidth + 'px;',
            attrs: { cellspacing: '0.25px' }
        });
        let colgroup = createElement('colgroup');
        let column = createElement('col', { styles: 'width:' + this.parent.timelineModule.totalTimelineWidth + 'px;' });
        colgroup.appendChild(column);
        this.taskTable.appendChild(colgroup);
        this.ganttChartTableBody = createElement('tbody', {
            id: this.parent.element.id + 'GanttTaskTableBody'
        });
        this.taskTable.appendChild(this.ganttChartTableBody);
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.taskTable);
    }
    initiateTemplates() {
        this.taskTable.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.initChartHelperPrivateVariable();
        this.ganttChartTableTemplateInit();
        this.initializeChartTemplate();
    }
    /**
     * To render chart rows.
     * @return {void}
     * @private
     */
    renderChartRows() {
        this.createTaskbarTemplate();
        this.triggerQueryTaskbarInfo();
        this.parent.isGanttChartRendered = true;
    }
    /**
     * To get left task label template string.
     * @return {string}
     * @private
     */
    getTaskbarLeftLabelString(field) {
        let labelString = this.getTaskLabel(field);
        if (labelString) {
            labelString = labelString === 'isCustomTemplate' ? field : labelString;
            let templateString = '<div class="' + leftLabelInnerDiv + '"  style="height:' +
                (this.taskBarHeight) +
                'px;margin-top:' + this.taskBarMarginTop + 'px;"><span class="' + label + '">' +
                labelString + '</span></div>';
            return templateString;
        }
        return null;
    }
    /**
     * To get right task label template string.
     * @return {string}
     * @private
     */
    getTaskbarRightLabelString(field) {
        let labelString = this.getTaskLabel(field);
        if (labelString) {
            labelString = labelString === 'isCustomTemplate' ? field : labelString;
            let templateString = '<div class="' + rightLabelInnerDiv + '"  style="height:'
                + (this.taskBarHeight) + 'px;margin-top:' + this.taskBarMarginTop +
                'px;"><span class="' + label + '">' + labelString + '</span></div>';
            return templateString;
        }
        return null;
    }
    /**
     * To get gantt Indicator.
     * @return {string}
     * @private
     */
    getIndicatorString() {
        let templateString = '<label class="' + taskIndicatorDiv + '"  style="line-height:'
            + (this.parent.rowHeight) + 'px;' +
            'left:${this.chartRowsModule.getIndicatorleft(date) }px;"><i class="${iconCls}"></i> </label>';
        return templateString;
    }
    /**
     * To get gantt Indicator.
     * @return {number}
     * @private
     */
    getIndicatorleft(date) {
        date = this.parent.dateValidationModule.getDateFromFormat(date);
        let left = this.parent.dataOperation.getTaskLeft(date, false);
        return left;
    }
    /**
     * To get parent taskbar template string.
     * @return {string}
     * @private
     */
    getParentTaskbarTemplateString() {
        let labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
        labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
        return '<div class="' + parentTaskBarInnerDiv +
            ' ${this.chartRowsModule.getExpandClass(data) } ' + traceParentTaskBar + '"' +
            ' style="width:${ganttProperties.width}px;height:' + this.taskBarHeight + 'px;">' +
            '<div class="' + parentProgressBarInnerDiv + ' ${this.chartRowsModule.getExpandClass(data) } ' +
            traceParentProgressBar + '"' +
            ' style="border-style:${if(ganttProperties.progressWidth) }solid${else}none${/if};' +
            'width:${ganttProperties.progressWidth}px;' +
            'border-top-right-radius:${this.chartRowsModule.getBorderRadius(data)}px;' +
            'border-bottom-right-radius:${this.chartRowsModule.getBorderRadius(data)}px;height:100%;"><span class="' +
            taskLabel + '" style="line-height:' +
            (this.taskBarHeight - 1) + 'px;height:' + this.taskBarHeight + 'px;">' +
            labelString + '</span></div></div>';
    }
    /**
     * To get child taskbar template string.
     * @return {string}
     * @private
     */
    getChildTaskbarTemplateString() {
        let labelString = this.getTaskLabel(this.parent.labelSettings.taskLabel);
        labelString = labelString === 'isCustomTemplate' ? this.parent.labelSettings.taskLabel : labelString;
        return '${if(ganttProperties.startDate&&ganttProperties.endDate&&ganttProperties.duration)}' +
            '<div class="' + childTaskBarInnerDiv + ' ' + traceChildTaskBar + '"' +
            'style="width:${ganttProperties.width}px;height:' +
            (this.taskBarHeight) + 'px;">' + '<div class="' + childProgressBarInnerDiv + ' ' +
            traceChildProgressBar + '"' +
            ' style="border-style:${if(ganttProperties.progressWidth) }solid${else}none${/if};' +
            'width:${ganttProperties.progressWidth}px;height:100%;' +
            'border-top-right-radius:${this.chartRowsModule.getBorderRadius(ganttProperties) }px;' +
            'border-bottom-right-radius:${this.chartRowsModule.getBorderRadius(ganttProperties) }px;">' +
            '<span class="' + taskLabel + '" style="line-height:' +
            (this.taskBarHeight - 1) + 'px;height:' + this.taskBarHeight + 'px;">' +
            labelString + '</span></div></div>' +
            '${else}' +
            '${if(ganttProperties.startDate&&!ganttProperties.endDate&&!ganttProperties.duration)}' +
            '<div class="' + childProgressBarInnerDiv + ' ' + traceChildTaskBar + ' ' +
            unscheduledTaskbarLeft + '"' +
            'style="left:${ganttProperties.left}px; height:' + this.taskBarHeight + 'px;"></div>' +
            '${else if(ganttProperties.endDate&&!ganttProperties.startDate&&!ganttProperties.duration)}' +
            '<div class="' + childProgressBarInnerDiv + ' ' + traceChildTaskBar + ' ' +
            unscheduledTaskbarRight + '"' +
            'style="left:${ganttProperties.left}px; height:' + this.taskBarHeight + 'px;"></div>' +
            '${else if(ganttProperties.duration&&!ganttProperties.startDate&&!ganttProperties.endDate)}' +
            '<div class="' + childProgressBarInnerDiv + ' ' + traceChildTaskBar + ' ' +
            unscheduledTaskbar + '"' +
            'style="left:${ganttProperties.left}px; width:${ganttProperties.width}px;' +
            ' height:' + this.taskBarHeight + 'px;"></div>' +
            '${/if}' +
            '${/if};';
    }
    /**
     * To get milestone template string.
     * @return {string}
     * @private
     */
    getMilestoneTemplateString() {
        return '<div class="' + traceMilestone + '" style="position:absolute;">' +
            '<div class="' + milestoneTop + '${if(!ganttProperties.startDate&&!ganttProperties.endDate)}' + ' ' +
            unscheduledMilestoneTop + '${/if}' + '" style="border-right-width:' +
            this.milesStoneRadius + 'px;border-left-width:' + this.milesStoneRadius + 'px;border-bottom-width:' +
            this.milesStoneRadius + 'px;"></div>' +
            '<div class="' + milestoneBottom + '${if(!ganttProperties.startDate&&!ganttProperties.endDate)}' + ' ' +
            unscheduledMilestoneBottom + '${/if}' + '" style="top:' +
            (this.milesStoneRadius) + 'px;border-right-width:' + this.milesStoneRadius + 'px; border-left-width:' +
            this.milesStoneRadius + 'px; border-top-width:' + this.milesStoneRadius + 'px;"></div></div>';
    }
    /**
     * To get task baseline template string.
     * @return {string}
     * @private
     */
    getTaskBaselineTemplateString() {
        return '<div class="' + baselineBar + '" style="margin-top:' + this.baselineTop +
            'px;left:${ganttProperties.baselineLeft }px;' +
            'width:${ganttProperties.baselineWidth }px;height:' +
            this.baselineHeight + 'px;' + (this.baselineColor ? 'background-color: ' + this.baselineColor + ';' : '') + '"></div>';
    }
    /**
     * To get milestone baseline template string.
     * @return {string}
     * @private
     */
    getMilestoneBaselineTemplateString() {
        return '<div class="' + baselineMilestoneContainer + '" style="' +
            'left:${(data.ganttProperties.baselineLeft -' + (this.milesStoneRadius) + ')}px;' +
            'margin-top:' + (-Math.floor(this.parent.rowHeight - this.milestoneMarginTop) + 2) +
            'px">' + '<div class="' + baselineMilestoneDiv + '">' + '<div class="' + baselineMilestoneDiv +
            ' ' + baselineMilestoneTop + '"  ' +
            'style="top:' + (-this.milestoneHeight) + 'px;border-right:' + this.milesStoneRadius +
            'px solid transparent;border-left:' + this.milesStoneRadius +
            'px solid transparent;border-top:0px' +
            'solid transparent;border-bottom-width:' + this.milesStoneRadius + 'px;' +
            'border-bottom-style: solid;' + (this.baselineColor ? 'border-bottom-color: ' + this.baselineColor + ';' : '') +
            '"></div>' +
            '<div class="' + baselineMilestoneDiv + ' ' + baselineMilestoneBottom + '"  ' +
            'style="top:' + (this.milesStoneRadius - this.milestoneHeight) + 'px;border-right:' + this.milesStoneRadius +
            'px solid transparent;border-left:' + this.milesStoneRadius +
            'px solid transparent;border-bottom:0px' +
            'solid transparent;border-top-width:' + this.milesStoneRadius + 'px;' +
            'border-top-style: solid;' +
            (this.baselineColor ? 'border-top-color: ' + this.baselineColor + ';' : '') + '"></div>' +
            '</div></div>';
    }
    /**
     * To get taskbar row('TR') template string
     * @return {string}
     * @private
     */
    getTableTrTemplateString() {
        let className = (this.parent.gridLines === 'Horizontal' || this.parent.gridLines === 'Both') ?
            'e-chart-row-border' : '';
        return '<tr class="${this.chartRowsModule.getRowClassName(data)} ' + chartRow + '"' +
            'style="display:${this.chartRowsModule.getExpandDisplayProp(data)};height:' +
            this.parent.rowHeight + 'px;">' +
            '<td class="' + chartRowCell + ' ' + className
            + '" style="width:' + this.parent.timelineModule.totalTimelineWidth + 'px;"></td></tr>';
    }
    /**
     * To initialize chart templates.
     * @return {void}
     * @private
     */
    initializeChartTemplate() {
        this.parentTemplateFunction = isNullOrUndefined(this.templateCompiler(this.parent.parentTaskbarTemplate)) ?
            this.templateCompiler(this.getParentTaskbarTemplateString()) :
            this.templateCompiler(this.parent.parentTaskbarTemplate);
        this.leftTaskLabelTemplateFunction = !isNullOrUndefined(this.parent.labelSettings.leftLabel) &&
            this.parent.labelSettings.leftLabel.indexOf('#') === 0 ? this.templateCompiler(this.parent.labelSettings.leftLabel) :
            this.templateCompiler(this.getTaskbarLeftLabelString(this.parent.labelSettings.leftLabel));
        this.rightTaskLabelTemplateFunction = !isNullOrUndefined(this.parent.labelSettings.rightLabel) &&
            this.parent.labelSettings.rightLabel.indexOf('#') === 0 ? this.templateCompiler(this.parent.labelSettings.rightLabel) :
            this.templateCompiler(this.getTaskbarRightLabelString(this.parent.labelSettings.rightLabel));
        this.childTaskbarTemplateFunction = isNullOrUndefined(this.templateCompiler(this.parent.taskbarTemplate)) ?
            this.templateCompiler(this.getChildTaskbarTemplateString()) : this.templateCompiler(this.parent.taskbarTemplate);
        this.milestoneTemplateFunction = isNullOrUndefined(this.templateCompiler(this.parent.milestoneTemplate)) ?
            this.templateCompiler(this.getMilestoneTemplateString()) : this.templateCompiler(this.parent.milestoneTemplate);
    }
    /**
     * To initialize basic chart table templates.
     * @return {void}
     * @private
     */
    ganttChartTableTemplateInit() {
        let parentTr = this.getTableTrTemplateString();
        this.parentTrFunction = this.templateCompiler(parentTr);
        let parentLeftLabelDiv = '<div class="' + leftLabelContainer + '" style="height:' +
            (this.parent.rowHeight - 1) + 'px;width: ${this.chartRowsModule.taskNameWidth(data)};"></div>';
        this.leftLabelContainerFunction = this.templateCompiler(parentLeftLabelDiv);
        let parentRightLabelDiv = '<div class="' + rightLabelContainer + '" ' +
            ' style="left: ${this.chartRowsModule.getRightLabelLeft(data) }px;height:'
            + (this.parent.rowHeight - 1) + 'px;"></div>';
        this.rightLabelContainerFunction = this.templateCompiler(parentRightLabelDiv);
        let taskbarContainerDiv = '<div class="' + taskBarMainContainer +
            '${this.getUnscheduledTaskClass(ganttProperties)}' +
            '${if(ganttProperties.cssClassMapping)} ${ganttProperties.cssClassMapping}${/if}"' +
            ' style="${if(ganttProperties.isMilestone)}width:' + this.milestoneHeight + 'px;height:' +
            this.milestoneHeight + 'px;margin-top:' +
            this.milestoneMarginTop + 'px;left:${(data.ganttProperties.left - ' +
            (this.milestoneHeight / 2) + ')}px;${else}width:${ganttProperties.width}px;margin-top:' +
            this.taskBarMarginTop + 'px;left:${ganttProperties.left}px;height:' + this.taskBarHeight + 'px;${/if}"></div>';
        this.taskbarContainerFunction = this.templateCompiler(taskbarContainerDiv);
        let childTaskbarLeftResizeDiv = '<div class="' + taskBarLeftResizer + ' ' + icon + '"' +
            ' style="left:-2px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        this.childTaskbarLeftResizerFunction = this.templateCompiler(childTaskbarLeftResizeDiv);
        let childTaskbarRightResizeDiv = '<div class="' + taskBarRightResizer + ' ' + icon + '"' +
            ' style="left:${(data.ganttProperties.width - ' + 10 + ')}px;' +
            'height:' + (this.taskBarHeight) + 'px;"></div>';
        this.childTaskbarRightResizerFunction = this.templateCompiler(childTaskbarRightResizeDiv);
        let childTaskbarProgressResizeDiv = '<div class="' + childProgressResizer + '"' +
            ' style="left:${(data.ganttProperties.progressWidth - 6)}px;margin-top:' +
            this.taskBarHeight + 'px;"><div class="' + progressBarHandler + '"' +
            '><div class="' + progressHandlerElement + '"></div>' +
            '<div class="' + progressBarHandlerAfter + '"></div></div>';
        this.childTaskbarProgressResizerFunction = this.templateCompiler(childTaskbarProgressResizeDiv);
        this.taskIndicatorFunction = this.templateCompiler(this.getIndicatorString());
        this.taskBaselineTemplateFunction = this.templateCompiler(this.getTaskBaselineTemplateString());
        this.milestoneBaselineTemplateFunction = this.templateCompiler(this.getMilestoneBaselineTemplateString());
        let connectorLineLeft = '<div class="' + leftConnectorPointOuterDiv + '" style="${if(ganttProperties.isMilestone)}' +
            'margin-top:' + (this.milesStoneRadius - 5) + 'px;${else}margin-top:' +
            this.connectorPointMargin + 'px;${/if}">' +
            '<div class="' + connectorPointLeft + '${this.getUnscheduledTaskClass(ganttProperties)}' +
            '" style="width: ' + this.connectorPointWidth + 'px;' +
            'height: ' + this.connectorPointWidth + 'px;border-radius:' +
            this.connectorPointRadius + 'px;">' + this.touchLeftConnectorpoint + '</div></div>';
        let connectorLineRight = '<div class="' + rightConnectorPointOuterDiv + '" style="${if(ganttProperties.isMilestone)}' +
            'left:' + this.milestoneHeight + 'px;margin-top:' +
            (this.milesStoneRadius - 5) + 'px;${else}left:${(data.ganttProperties.width)}px;margin-top:' +
            this.connectorPointMargin + 'px;${/if}">' +
            '<div class="' + connectorPointRight + '${this.getUnscheduledTaskClass(ganttProperties)}"' + ' style="' +
            'width:' + this.connectorPointWidth + 'px;height:' + this.connectorPointWidth + 'px;border-radius:' +
            this.connectorPointRadius + 'px;">' + this.touchRightConnectorpoint + '</div></div>';
        this.connectorLineLeftFunction = this.templateCompiler(connectorLineLeft);
        this.connectorLineRightFunction = this.templateCompiler(connectorLineRight);
    }
    /**
     * To get task label.
     * @return {string}
     * @private
     */
    getTaskLabel(field) {
        let length = this.parent.ganttColumns.length;
        let resultString = null;
        if (!isNullOrUndefined(field) && field !== '') {
            if (field === this.parent.taskFields.resourceInfo) {
                resultString = '${this.chartRowsModule.getResourceName(data) }';
            }
            else {
                for (let i = 0; i < length; i++) {
                    if (field === this.parent.ganttColumns[i].field) {
                        resultString = '${this.chartRowsModule.getFieldValue(' + field + ') }';
                        break;
                    }
                }
                if (isNullOrUndefined(resultString)) {
                    return 'isCustomTemplate';
                }
            }
        }
        else {
            resultString = '';
        }
        return resultString;
    }
    getExpandDisplayProp(data) {
        data = this.templateData;
        if (this.parent.getExpandStatus(data)) {
            return 'table-row';
        }
        return 'none';
    }
    getRowClassName(data) {
        data = this.templateData;
        let rowClass = 'gridrowtaskId';
        let parentItem = data.parentItem;
        if (parentItem) {
            rowClass += parentItem.taskId.toString();
        }
        rowClass += 'level';
        rowClass += data.level.toString();
        return rowClass;
    }
    getBorderRadius(data) {
        data = this.templateData;
        let diff = data.ganttProperties.width - data.ganttProperties.progressWidth;
        if (diff <= 4) {
            return 4 - diff;
        }
        else {
            return 0;
        }
    }
    taskNameWidth(ganttData) {
        ganttData = this.templateData;
        let width;
        if (ganttData.ganttProperties.isMilestone) {
            width = (ganttData.ganttProperties.left - (this.parent.getTaskbarHeight() / 2));
        }
        else {
            width = ganttData.ganttProperties.left;
        }
        if (width < 0) {
            width = 0;
        }
        return width + 'px';
    }
    getRightLabelLeft(ganttData) {
        ganttData = this.templateData;
        if (ganttData.ganttProperties.isMilestone) {
            return ganttData.ganttProperties.left + (this.parent.getTaskbarHeight() / 2);
        }
        else {
            return ganttData.ganttProperties.left + ganttData.ganttProperties.width;
        }
    }
    getExpandClass(data) {
        data = this.templateData;
        if (data.expanded) {
            return rowExpand;
        }
        else if (!data.expanded && data.hasChildRecords) {
            return rowCollapse;
        }
        return '';
    }
    getFieldValue(field) {
        return isNullOrUndefined(field) ? '' : field;
    }
    getResourceName(ganttData) {
        ganttData = this.templateData;
        let resource = null;
        if (!isNullOrUndefined(ganttData.ganttProperties.resourceInfo)) {
            let length = ganttData.ganttProperties.resourceInfo.length;
            if (length > 0) {
                for (let i = 0; i < length; i++) {
                    if (isNullOrUndefined(resource)) {
                        resource = ganttData.ganttProperties.resourceInfo[i][this.parent.resourceNameMapping];
                    }
                    else {
                        resource += ' , ' + ganttData.ganttProperties.resourceInfo[i][this.parent.resourceNameMapping];
                    }
                }
                return resource;
            }
            else {
                return '';
            }
        }
        return '';
    }
    /**
     * To initialize private variable help to render task bars.
     * @return {void}
     * @private
     */
    initChartHelperPrivateVariable() {
        this.baselineColor = !isNullOrUndefined(this.parent.baselineColor) &&
            this.parent.baselineColor !== '' ? this.parent.baselineColor : null;
        this.taskBarHeight = isNullOrUndefined(this.parent.taskbarHeight) || this.parent.taskbarHeight >= this.parent.rowHeight ?
            Math.floor(this.parent.rowHeight * 0.62) : this.parent.taskbarHeight; // 0.62 -- Standard Ratio.
        if (this.parent.renderBaseline) {
            let height;
            if ((this.taskBarHeight + this.baselineHeight) <= this.parent.rowHeight) {
                height = this.taskBarHeight;
            }
            else {
                height = this.taskBarHeight - (this.baselineHeight + 1);
            }
            this.taskBarHeight = height;
        }
        this.milestoneHeight = Math.floor(this.taskBarHeight * 0.82); // 0.82 -- Standard Ratio.
        this.taskBarMarginTop = Math.floor((this.parent.rowHeight - this.taskBarHeight) / 2);
        this.milestoneMarginTop = Math.floor((this.parent.rowHeight - this.milestoneHeight) / 2);
        this.milesStoneRadius = Math.floor((this.milestoneHeight) / 2);
        this.baselineTop = -(Math.floor((this.parent.rowHeight - (this.taskBarHeight + this.taskBarMarginTop))) - 1);
        this.connectorPointWidth = 8;
        this.connectorPointRadius = 8 / 2;
        this.connectorPointMargin = Math.floor((this.taskBarHeight / 2) - 5);
    }
    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    refreshGanttRows() {
        this.ganttChartTableBody.innerHTML = '';
        this.parent.currentViewData = this.parent.treeGrid.getCurrentViewRecords().slice();
        this.createTaskbarTemplate();
        this.triggerQueryTaskbarInfo();
    }
    /**
     * To render taskbars.
     * @return {void}
     * @private
     */
    createTaskbarTemplate() {
        this.ganttChartTableBody.innerHTML = '';
        for (let i = 0; i < this.parent.currentViewData.length; i++) {
            let tempTemplateData = this.parent.currentViewData[i];
            this.ganttChartTableBody.appendChild(this.getGanttChartRow(i, tempTemplateData));
        }
    }
    /**
     * To render taskbars.
     * @return {Node}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    getGanttChartRow(i, tempTemplateData) {
        this.templateData = tempTemplateData;
        let taskBaselineTemplateNode = null;
        let parentTrNode = this.parentTrFunction(extend({ index: i }, this.templateData), this.parent, 'parentTr');
        let leftLabelNode = this.leftLabelContainerFunction(extend({ index: i }, this.templateData), this.parent, 'leftLabelContainer');
        if (this.leftTaskLabelTemplateFunction) {
            let leftLabelTemplateNode = this.leftTaskLabelTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'leftLabelTemplate');
            leftLabelNode[0].appendChild([].slice.call(leftLabelTemplateNode)[0]);
        }
        let taskbarContainerNode = this.taskbarContainerFunction(extend({ index: i }, this.templateData), this.parent, 'taskbarContainerDiv');
        if (!this.templateData.hasChildRecords) {
            let connectorLineLeftNode = this.connectorLineLeftFunction(extend({ index: i }, this.templateData), this.parent, 'connectorLinePointLeft');
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineLeftNode)[0]);
        }
        if (this.templateData.hasChildRecords) {
            let parentTaskbarTemplateNode = this.parentTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'parentTaskbarTemplate');
            taskbarContainerNode[0].appendChild([].slice.call(parentTaskbarTemplateNode)[0]);
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.taskBaselineTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'parentTaskbarBaseline');
            }
        }
        else if (this.templateData.ganttProperties.isMilestone) {
            let milestoneTemplateNode = this.milestoneTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'milestoneTemplate');
            taskbarContainerNode[0].appendChild([].slice.call(milestoneTemplateNode)[0]);
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.milestoneBaselineTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'milestoneBaseline');
            }
        }
        else {
            let scheduledTask = isScheduledTask(this.templateData.ganttProperties);
            let childTaskbarProgressResizeNode = null;
            let childTaskbarRightResizeNode = null;
            let childTaskbarLeftResizeNode = null;
            if (!isNullOrUndefined(scheduledTask)) {
                if (scheduledTask || this.templateData.ganttProperties.duration) {
                    if (scheduledTask) {
                        childTaskbarProgressResizeNode = this.childTaskbarProgressResizerFunction(extend({ index: i }, this.templateData), this.parent, 'childProgressResizer');
                        childTaskbarLeftResizeNode = this.childTaskbarLeftResizerFunction(extend({ index: i }, this.templateData), this.parent, 'childLeftResizer');
                        childTaskbarRightResizeNode = this.childTaskbarRightResizerFunction(extend({ index: i }, this.templateData), this.parent, 'childRightResizer');
                    }
                }
                let childTaskbarTemplateNode = this.childTaskbarTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'childTaskbarTemplate');
                if (childTaskbarLeftResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarLeftResizeNode)[0]);
                }
                if (childTaskbarTemplateNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarTemplateNode)[0]);
                }
                if (childTaskbarProgressResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarProgressResizeNode)[0]);
                }
                if (childTaskbarRightResizeNode) {
                    taskbarContainerNode[0].appendChild([].slice.call(childTaskbarRightResizeNode)[0]);
                }
            }
            if (this.parent.renderBaseline && this.templateData.ganttProperties.baselineStartDate &&
                this.templateData.ganttProperties.baselineEndDate) {
                taskBaselineTemplateNode = this.taskBaselineTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'childBaseline');
            }
        }
        if (!this.templateData.hasChildRecords) {
            let connectorLineRightNode = this.connectorLineRightFunction(extend({ index: i }, this.templateData), this.parent, 'connectorLinePointRight');
            taskbarContainerNode[0].appendChild([].slice.call(connectorLineRightNode)[0]);
        }
        let rightLabelNode = this.rightLabelContainerFunction(extend({ index: i }, this.templateData), this.parent, 'rightLabelContainer');
        if (this.rightTaskLabelTemplateFunction) {
            let rightLabelTemplateNode = this.rightTaskLabelTemplateFunction(extend({ index: i }, this.templateData), this.parent, 'rightLabelTemplateTemplate');
            rightLabelNode[0].appendChild([].slice.call(rightLabelTemplateNode)[0]);
        }
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(leftLabelNode)[0]);
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskbarContainerNode)[0]);
        if (this.templateData.ganttProperties.indicators && this.templateData.ganttProperties.indicators.length > 0) {
            let taskIndicatorNode;
            let taskIndicatorTextFunction;
            let taskIndicatorTextNode;
            let indicators = this.templateData.ganttProperties.indicators;
            for (let indicatorIndex = 0; indicatorIndex < indicators.length; indicatorIndex++) {
                taskIndicatorNode = this.taskIndicatorFunction(extend({ index: i }, indicators[indicatorIndex]), this.parent, 'indicatorLabelContainer');
                taskIndicatorTextFunction = isNullOrUndefined(this.templateCompiler(indicators[indicatorIndex].name)) ?
                    this.templateCompiler('${name}') : this.templateCompiler(indicators[indicatorIndex].name);
                taskIndicatorTextNode = taskIndicatorTextFunction(extend({ index: i }, this.templateData), this.parent, 'indicatorLabelText');
                taskIndicatorNode[0].appendChild([].slice.call(taskIndicatorTextNode)[0]);
                taskIndicatorNode[0].title = taskIndicatorNode[0].innerText;
                parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskIndicatorNode)[0]);
            }
        }
        parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(rightLabelNode)[0]);
        if (!isNullOrUndefined(taskBaselineTemplateNode)) {
            parentTrNode[0].childNodes[0].childNodes[0].appendChild([].slice.call(taskBaselineTemplateNode)[0]);
        }
        return parentTrNode[0].childNodes[0];
    }
    /**
     * To trigger query taskbar info event.
     * @return {void}
     * @private
     */
    triggerQueryTaskbarInfo() {
        let length = this.ganttChartTableBody.querySelectorAll('tr').length;
        let trElement;
        let taskbarElement;
        let data;
        for (let index = 0; index < length; index++) {
            trElement = this.ganttChartTableBody.querySelectorAll('tr')[index];
            taskbarElement = trElement.querySelector('.' + taskBarMainContainer);
            data = this.parent.currentViewData[index];
            this.triggerQueryTaskbarInfoByIndex(trElement, data);
        }
    }
    /**
     *
     * @param trElement
     * @param data
     * @private
     */
    triggerQueryTaskbarInfoByIndex(trElement, data) {
        let taskbarElement;
        taskbarElement = trElement.querySelector('.' + taskBarMainContainer);
        let args = {
            ganttModel: this.parent,
            data: data,
            rowElement: trElement,
            taskbarElement: trElement.querySelector('.' + taskBarMainContainer),
            taskbarType: data.hasChildRecords ? 'ParentTask' : data.ganttProperties.isMilestone ? 'Milestone' : 'ChildTask'
        };
        let taskbarClass = '.' + (args.taskbarType === 'ParentTask' ?
            traceParentTaskBar : args.taskbarType === 'ChildTask' ? traceChildTaskBar : milestoneTop);
        let progressBarClass = '.' + (args.taskbarType === 'ParentTask' ?
            traceParentProgressBar : args.taskbarType === 'ChildTask' ? traceChildProgressBar : baselineMilestoneTop);
        if (args.taskbarType === 'Milestone') {
            args.milestoneColor = taskbarElement.querySelector(taskbarClass) ?
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderBottomColor : null;
            args.baselineColor = trElement.querySelector(progressBarClass) ?
                getComputedStyle(trElement.querySelector(progressBarClass)).borderBottomColor : null;
        }
        else {
            args.taskbarBgColor = taskbarElement.querySelector(taskbarClass) ?
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).backgroundColor : null;
            args.taskbarBorderColor = taskbarElement.querySelector(taskbarClass) ?
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderColor : null;
            args.progressBarBgColor = taskbarElement.querySelector(progressBarClass) ?
                getComputedStyle(taskbarElement.querySelector(progressBarClass)).backgroundColor : null;
            // args.progressBarBorderColor = taskbarElement.querySelector(progressBarClass) ?
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor : null;
            args.baselineColor = trElement.querySelector('.' + baselineBar) ?
                getComputedStyle(trElement.querySelector('.' + baselineBar)).backgroundColor : null;
            args.progressLabelColor = taskbarElement.querySelector('.' + taskLabel) ?
                getComputedStyle(taskbarElement.querySelector('.' + taskLabel)).color : null;
        }
        args.rightLabelColor = trElement.querySelector('.' + rightLabelContainer) &&
            (trElement.querySelector('.' + rightLabelContainer)).querySelector('.' + label) ?
            getComputedStyle((trElement.querySelector('.' + rightLabelContainer)).querySelector('.' + label)).color : null;
        args.leftLabelColor = trElement.querySelector('.' + leftLabelContainer) &&
            (trElement.querySelector('.' + leftLabelContainer)).querySelector('.' + label) ?
            getComputedStyle((trElement.querySelector('.' + leftLabelContainer)).querySelector('.' + label)).color : null;
        this.parent.trigger('queryTaskbarInfo', args);
        this.updateQueryTaskbarInfoArgs(args);
    }
    /**
     * To update query taskbar info args.
     * @return {void}
     * @private
     */
    updateQueryTaskbarInfoArgs(args) {
        let trElement = args.rowElement;
        let taskbarElement = args.taskbarElement;
        let taskbarClass = '.' + (args.taskbarType === 'ParentTask' ?
            traceParentTaskBar : args.taskbarType === 'ChildTask' ? traceChildTaskBar : milestoneTop);
        let progressBarClass = '.' + (args.taskbarType === 'ParentTask' ?
            traceParentProgressBar : args.taskbarType === 'ChildTask' ? traceChildProgressBar : baselineMilestoneTop);
        if (args.taskbarType === 'Milestone') {
            if (taskbarElement.querySelector(taskbarClass) &&
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderBottomColor !== args.milestoneColor) {
                taskbarElement.querySelector(taskbarClass).style.borderBottomColor = args.milestoneColor;
                taskbarElement.querySelector('.' + milestoneBottom).style.borderTopColor = args.milestoneColor;
            }
            if (trElement.querySelector(progressBarClass) &&
                getComputedStyle(trElement.querySelector(progressBarClass)).borderTopColor !== args.baselineColor) {
                trElement.querySelector(progressBarClass).style.borderBottomColor = args.baselineColor;
                trElement.querySelector('.' + baselineMilestoneBottom).style.borderTopColor = args.baselineColor;
            }
        }
        else {
            if (taskbarElement.querySelector(taskbarClass) &&
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).backgroundColor !== args.taskbarBgColor) {
                taskbarElement.querySelector(taskbarClass).style.backgroundColor = args.taskbarBgColor;
            }
            if (taskbarElement.querySelector(taskbarClass) &&
                getComputedStyle(taskbarElement.querySelector(taskbarClass)).borderColor !== args.taskbarBorderColor) {
                taskbarElement.querySelector(taskbarClass).style.borderColor = args.taskbarBorderColor;
            }
            if (taskbarElement.querySelector(progressBarClass) &&
                getComputedStyle(taskbarElement.querySelector(progressBarClass)).backgroundColor !== args.progressBarBgColor) {
                taskbarElement.querySelector(progressBarClass).style.backgroundColor = args.progressBarBgColor;
            }
            // if (taskbarElement.querySelector(progressBarClass) &&
            //     getComputedStyle(taskbarElement.querySelector(progressBarClass)).borderColor !== args.progressBarBorderColor) {
            //     (taskbarElement.querySelector(progressBarClass) as HTMLElement).style.borderColor = args.progressBarBorderColor;
            // }
            if (taskbarElement.querySelector('.' + taskLabel) &&
                getComputedStyle(taskbarElement.querySelector('.' + taskLabel)).color !== args.progressLabelColor) {
                taskbarElement.querySelector('.' + taskLabel).style.color = args.progressLabelColor;
            }
            if (trElement.querySelector('.' + baselineBar) &&
                getComputedStyle(trElement.querySelector('.' + baselineBar)).backgroundColor !== args.baselineColor) {
                trElement.querySelector('.' + baselineBar).style.backgroundColor = args.baselineColor;
            }
        }
        if (trElement.querySelector('.' + leftLabelContainer) &&
            (trElement.querySelector('.' + leftLabelContainer)).querySelector('.' + label) &&
            getComputedStyle((trElement.querySelector('.' + leftLabelContainer)).querySelector('.' + label)).color !== args.leftLabelColor) {
            (trElement.querySelector('.' + leftLabelContainer)).querySelector('.' + label).style.color = args.leftLabelColor;
        }
        if (trElement.querySelector('.' + rightLabelContainer) &&
            (trElement.querySelector('.' + rightLabelContainer)).querySelector('.' + label) &&
            getComputedStyle((trElement.querySelector('.' + rightLabelContainer)).querySelector('.' + label)).color !== args.rightLabelColor) {
            (trElement.querySelector('.' + rightLabelContainer)).querySelector('.' + label).style.color = args.rightLabelColor;
        }
    }
    /**
     * To compile template string.
     * @return {Function}
     * @private
     */
    templateCompiler(template) {
        if (!isNullOrUndefined(template) && template !== '') {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim(), this.parent);
                }
                else {
                    return compile(template, this.parent);
                }
            }
            catch (e) {
                return compile(template, this.parent);
            }
        }
        return null;
    }
    /**
     * To refresh edited TR
     * @param index
     * @private
     */
    refreshRow(index) {
        let tr = this.ganttChartTableBody.childNodes[index];
        let selectedItem = this.parent.currentViewData[index];
        if (index !== -1 && selectedItem) {
            let data = selectedItem;
            tr.replaceChild(this.getGanttChartRow(index, data).childNodes[0], tr.childNodes[0]);
            this.triggerQueryTaskbarInfoByIndex(tr, data);
            this.parent.treeGrid.grid.setRowData(data.ganttProperties.taskId, data);
            let row = this.parent.treeGrid.grid.getRowObjectFromUID(this.parent.treeGrid.grid.getDataRows()[index].getAttribute('data-uid'));
            row.data = data;
        }
    }
    /**
     * To refresh all edited records
     * @param items
     * @private
     */
    refreshRecords(items) {
        if (this.parent.isGanttChartRendered) {
            for (let i = 0; i < items.length; i++) {
                let index = this.parent.currentViewData.indexOf(items[i]);
                this.refreshRow(index);
            }
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('renderPanels', this.createChartTable);
        this.parent.off('dataReady', this.initiateTemplates);
        this.parent.off('destroy', this.destroy);
    }
    destroy() {
        this.removeEventListener();
    }
}

class Dependency {
    constructor(gantt) {
        this.validationPredecessor = null;
        this.parent = gantt;
        this.dateValidateModule = this.parent.dateValidationModule;
    }
    /**
     * Method to populate predecessor collections in records
     * @private
     */
    ensurePredecessorCollection() {
        let predecessorTasks = this.parent.predecessorsCollection;
        let length = predecessorTasks.length - 1;
        for (let count = length; count >= 0; count--) {
            let ganttData = predecessorTasks[count];
            let ganttProp = ganttData.ganttProperties;
            this.ensurePredecessorCollectionHelper(ganttData, ganttProp);
        }
    }
    /**
     *
     * @param ganttData
     * @param ganttProp
     * @private
     */
    ensurePredecessorCollectionHelper(ganttData, ganttProp) {
        let predecessorVal = ganttProp.predecessorsName;
        if (predecessorVal && (typeof predecessorVal === 'string' || typeof predecessorVal === 'number')) {
            this.parent.setRecordValue('predecessor', this.calculatePredecessor(predecessorVal, ganttData), ganttProp, true);
        }
        else if (predecessorVal && typeof predecessorVal === 'object' && predecessorVal.length) {
            let preValues = [];
            for (let c = 0; c < predecessorVal.length; c++) {
                let predecessorItem = predecessorVal[c];
                let preValue = {};
                preValue.from = getValue('from', predecessorItem);
                preValue.to = getValue('to', predecessorItem) ? getValue('to', predecessorItem) : ganttProp.taskId;
                preValue.type = getValue('type', predecessorItem) ? getValue('type', predecessorItem) : 'FS';
                let offsetUnits = getValue('offset', predecessorItem);
                if (isNullOrUndefined(offsetUnits)) {
                    preValue.offset = 0;
                    preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                }
                else if (typeof offsetUnits === 'string') {
                    let tempOffsetUnits = this.getOffsetDurationUnit(getValue('offset', predecessorItem));
                    preValue.offset = tempOffsetUnits.duration;
                    preValue.offsetUnit = tempOffsetUnits.durationUnit;
                }
                else {
                    preValue.offset = parseFloat(offsetUnits.toString());
                    preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                }
                let isOwnParent = this.checkIsParent(preValue.from.toString());
                if (!isOwnParent) {
                    preValues.push(preValue);
                }
            }
            this.parent.setRecordValue('predecessor', preValues, ganttProp, true);
        }
        this.parent.setRecordValue('predecessorsName', this.getPredecessorStringValue(ganttData), ganttProp, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, ganttProp.predecessorsName, ganttData);
        this.parent.setRecordValue(this.parent.taskFields.dependency, ganttProp.predecessorsName, ganttData);
    }
    /**
     *
     * @param ganttData Method to check parent dependency in predecessor
     * @param fromId
     */
    checkIsParent(fromId) {
        let boolValue = false;
        let task = this.parent.getRecordByID(fromId);
        if (task.hasChildRecords) {
            boolValue = true;
        }
        return boolValue;
    }
    /**
     * Get predecessor collection object from predecessor string value
     * @param predecessorValue
     * @param ganttRecord
     * @private
     */
    calculatePredecessor(predecessorValue, ganttRecord) {
        let predecessor = predecessorValue.toString();
        let collection = [];
        let match;
        let values;
        let offsetValue;
        let predecessorText;
        predecessor.split(',').forEach((el) => {
            values = el.split('+');
            offsetValue = '+';
            if (el.indexOf('-') >= 0) {
                values = el.split('-');
                offsetValue = '-';
            }
            match = values[0].match(/(\d+|[A-z]+)/g);
            /*Validate for appropriate predecessor*/
            if (match[0] && this.parent.ids.indexOf(match[0]) !== -1) {
                if (match.length > 1) {
                    let type = match[1].toUpperCase();
                    if (type === 'FS' || type === 'FF' || type === 'SF' || type === 'SS') {
                        predecessorText = type;
                    }
                    else {
                        predecessorText = 'FS';
                    }
                }
                else {
                    predecessorText = 'FS';
                }
            }
            else {
                return; // exit current loop for invalid id (match[0])
            }
            const tempOffset = values.length > 1 ? offsetValue + '' + values[1] : '0';
            let offsetUnits = this.getOffsetDurationUnit(tempOffset);
            let obj = {
                from: match[0],
                type: predecessorText,
                isDrawn: false,
                to: ganttRecord.ganttProperties.taskId.toString(),
                offsetUnit: offsetUnits.durationUnit,
                offset: offsetUnits.duration
            };
            let isOwnParent = this.checkIsParent(match[0]);
            if (!isOwnParent) {
                collection.push(obj);
            }
        });
        return collection;
    }
    /**
     * Get predecessor value as string with offset values
     * @param data
     * @private
     */
    getPredecessorStringValue(data) {
        let predecessors = data.ganttProperties.predecessor;
        let durationUnitTexts = this.parent.durationUnitTexts;
        let resultString = '';
        if (predecessors) {
            let length = predecessors.length;
            for (let i = 0; i < length; i++) {
                let currentValue = predecessors[i];
                let temp = '';
                if (currentValue.from !== data.ganttProperties.taskId.toString()) {
                    temp = currentValue.from + currentValue.type;
                    if (currentValue.offset !== 0) {
                        temp += currentValue.offset > 0 ? ('+' + currentValue.offset + ' ') : (currentValue.offset + ' ');
                        let multiple = currentValue.offset !== 1;
                        if (currentValue.offsetUnit === 'day') {
                            temp += multiple ? getValue('days', durationUnitTexts) : getValue('day', durationUnitTexts);
                        }
                        else if (currentValue.offsetUnit === 'hour') {
                            temp += multiple ? getValue('hours', durationUnitTexts) : getValue('hour', durationUnitTexts);
                        }
                        else {
                            temp += multiple ? getValue('minutes', durationUnitTexts) : getValue('minute', durationUnitTexts);
                        }
                    }
                    if (resultString.length > 0) {
                        resultString = resultString + ',' + temp;
                    }
                    else {
                        resultString = temp;
                    }
                }
            }
        }
        return resultString;
    }
    /*Get duration and duration unit value from tasks*/
    getOffsetDurationUnit(val) {
        let duration = 0;
        let durationUnit = this.parent.durationUnit.toLocaleLowerCase();
        let durationUnitLabels = this.parent.durationUnitEditText;
        if (typeof val === 'string') {
            let values = val.match(/[^0-9]+|[0-9]+/g);
            for (let x = 0; x < values.length; x++) {
                values[x] = (values[x]).trim();
            }
            if (values[0] === '-' && values[1]) {
                values[1] = values[0] + values[1];
                values.shift();
            }
            else if (values[0] === '+') {
                values.shift();
            }
            if (values[1] === '.' && !isNaN(parseInt(values[2], 10))) {
                values[0] += values[1] + values[2];
                values.splice(1, 2);
            }
            if (values && values.length <= 2) {
                duration = parseFloat(values[0]);
                durationUnit = values[1] ? (values[1].toLowerCase()).trim() : '';
                if (getValue('minute', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = DurationUnits.Minute;
                }
                else if (getValue('hour', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = DurationUnits.Hour;
                }
                else if (getValue('day', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = DurationUnits.Day;
                }
                else {
                    durationUnit = this.parent.durationUnit.toLocaleLowerCase();
                }
            }
        }
        else {
            duration = val;
            durationUnit = this.parent.durationUnit.toLocaleLowerCase();
        }
        if (isNaN(duration)) {
            duration = 0;
            durationUnit = this.parent.durationUnit.toLocaleLowerCase();
        }
        return {
            duration: duration,
            durationUnit: durationUnit
        };
    }
    /**
     * Update predecessor object in both from and to tasks collection
     * @private
     */
    updatePredecessors() {
        let predecessorsCollection = this.parent.predecessorsCollection;
        let ganttRecord;
        let length = predecessorsCollection.length;
        for (let count = 0; count < length; count++) {
            ganttRecord = predecessorsCollection[count];
            this.updatePredecessorHelper(ganttRecord, predecessorsCollection);
        }
    }
    /**
     * To update predecessor collection to successor tasks
     * @param ganttRecord
     * @param predecessorsCollection
     * @private
     */
    updatePredecessorHelper(ganttRecord, predecessorsCollection) {
        let connectorsCollection;
        let successorGanttRecord;
        let connectorCount;
        predecessorsCollection = isNullOrUndefined(predecessorsCollection) ? [] : predecessorsCollection;
        connectorsCollection = ganttRecord.ganttProperties.predecessor;
        connectorCount = connectorsCollection.length;
        for (let i = 0; i < connectorCount; i++) {
            let connector = connectorsCollection[i];
            successorGanttRecord = this.parent.getRecordByID(connector.from);
            if (connector.from !== ganttRecord.ganttProperties.taskId.toString()) {
                if (successorGanttRecord) {
                    let predecessorCollection;
                    if (successorGanttRecord.ganttProperties.predecessor) {
                        predecessorCollection = (extend([], successorGanttRecord.ganttProperties.predecessor, [], true));
                        predecessorCollection.push(connector);
                        this.parent.setRecordValue('predecessor', predecessorCollection, successorGanttRecord.ganttProperties, true);
                        //  successorGanttRecord.ganttProperties.predecessor.push(connector);
                    }
                    else {
                        predecessorCollection = [];
                        predecessorCollection.push(connector);
                        this.parent.setRecordValue('predecessor', predecessorCollection, successorGanttRecord.ganttProperties, true);
                        // this.parent.setRecordValue('predecessor', [], successorGanttRecord.ganttProperties, true);
                        // successorGanttRecord.ganttProperties.predecessor.push(connector);
                        predecessorsCollection.push(successorGanttRecord);
                    }
                }
            }
        }
    }
    /**
     * Method to validate date of tasks with predecessor values for all records
     * @private
     */
    updatedRecordsDateByPredecessor() {
        let flatData = this.parent.flatData;
        for (let count = 0; count < flatData.length; count++) {
            if (flatData[count].ganttProperties.predecessor && flatData[count].taskData[this.parent.taskFields.dependency]) {
                this.validatePredecessorDates(flatData[count]);
            }
        }
    }
    /**
     * To validate task date values with dependency
     * @param ganttRecord
     * @private
     */
    validatePredecessorDates(ganttRecord) {
        if (ganttRecord.ganttProperties.predecessor) {
            let predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            let count;
            let parentGanttRecord;
            let record = null;
            let currentTaskId = ganttRecord.ganttProperties.taskId.toString();
            let predecessors = predecessorsCollection.filter((data) => {
                if (data.to === currentTaskId) {
                    return data;
                }
                else {
                    return null;
                }
            });
            for (count = 0; count < predecessors.length; count++) {
                let predecessor;
                predecessor = predecessors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
                if (record.ganttProperties.isAutoSchedule) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }
        }
    }
    /**
     * Method to validate task with predecessor
     * @param parentGanttRecord
     * @param childGanttRecord
     */
    validateChildGanttRecord(parentGanttRecord, childGanttRecord) {
        if (this.parent.editedTaskBarItem === childGanttRecord || isNullOrUndefined(isScheduledTask(parentGanttRecord.ganttProperties))
            || isNullOrUndefined(isScheduledTask(childGanttRecord.ganttProperties))) {
            return;
        }
        if (this.parent.isInPredecessorValidation && (childGanttRecord.ganttProperties.isAutoSchedule)) {
            let childRecordProperty = childGanttRecord.ganttProperties;
            let currentTaskId = childRecordProperty.taskId.toString();
            let predecessorsCollection = childRecordProperty.predecessor;
            let childPredecessor = predecessorsCollection.filter((data) => {
                if (data.to === currentTaskId) {
                    return data;
                }
                else {
                    return null;
                }
            });
            let startDate = this.getPredecessorDate(childGanttRecord, childPredecessor);
            this.parent.setRecordValue('startDate', startDate, childRecordProperty, true);
            this.parent.dataOperation.updateMappingData(childGanttRecord, 'startDate');
            this.dateValidateModule.calculateEndDate(childGanttRecord);
            this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(childRecordProperty), childRecordProperty, true);
            this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(childRecordProperty), childRecordProperty, true);
            this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth(childRecordProperty.width, childRecordProperty.progress), childRecordProperty, true);
            if (childGanttRecord.parentItem && this.parent.getParentTask(childGanttRecord.parentItem).ganttProperties.isAutoSchedule
                && this.parent.isInPredecessorValidation) {
                this.parent.dataOperation.updateParentItems(childGanttRecord.parentItem);
            }
        }
    }
    /**
     *
     * @param ganttRecord
     * @param predecessorsCollection
     */
    getPredecessorDate(ganttRecord, predecessorsCollection) {
        let maxStartDate;
        let tempStartDate;
        let parentGanttRecord;
        let childGanttRecord;
        let validatedPredecessor = predecessorsCollection.filter((data) => {
            if (data.to === ganttRecord.ganttProperties.taskId.toString()) {
                return data;
            }
            else {
                return null;
            }
        });
        if (validatedPredecessor) {
            let length = validatedPredecessor.length;
            for (let i = 0; i < length; i++) {
                let predecessor = validatedPredecessor[i];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                childGanttRecord = this.parent.getRecordByID(predecessor.to);
                tempStartDate =
                    this.getValidatedStartDate(childGanttRecord.ganttProperties, parentGanttRecord.ganttProperties, predecessor);
                if (maxStartDate == null) {
                    maxStartDate = tempStartDate;
                }
                else if (this.dateValidateModule.compareDates(tempStartDate, maxStartDate) === 1) {
                    maxStartDate = tempStartDate;
                }
            }
        }
        return maxStartDate;
    }
    /**
     * Get validated start date as per predecessor type
     * @param ganttRecord
     * @param parentGanttRecord
     * @param predecessor
     */
    getValidatedStartDate(ganttProperty, parentRecordProperty, predecessor) {
        let type = predecessor.type;
        let offset = predecessor.offset;
        let tempDate;
        let returnStartDate;
        switch (type) {
            case 'FS':
                tempDate = this.dateValidateModule.getValidEndDate(parentRecordProperty);
                if (!ganttProperty.isMilestone || offset !== 0) {
                    tempDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
                }
                if (offset !== 0) {
                    tempDate = this.updateDateByOffset(tempDate, predecessor, ganttProperty);
                }
                if (!ganttProperty.isMilestone) {
                    returnStartDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
                }
                else {
                    returnStartDate = tempDate;
                }
                break;
            case 'FF':
            case 'SF':
                tempDate = type === 'FF' ? this.dateValidateModule.getValidEndDate(parentRecordProperty) :
                    this.dateValidateModule.getValidStartDate(parentRecordProperty);
                if (offset !== 0) {
                    tempDate = this.updateDateByOffset(tempDate, predecessor, ganttProperty);
                }
                if (!ganttProperty.isMilestone) {
                    tempDate = this.dateValidateModule.checkEndDate(tempDate, ganttProperty);
                }
                returnStartDate = this.dateValidateModule.getStartDate(tempDate, ganttProperty.duration, ganttProperty.durationUnit, ganttProperty);
                break;
            case 'SS':
                tempDate = this.dateValidateModule.getValidStartDate(parentRecordProperty);
                if (offset !== 0) {
                    tempDate = this.updateDateByOffset(tempDate, predecessor, ganttProperty);
                }
                if (!ganttProperty.isMilestone) {
                    returnStartDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
                }
                else {
                    returnStartDate = tempDate;
                }
                break;
        }
        return returnStartDate;
    }
    /**
     *
     * @param date
     * @param predecessor
     * @param isMilestone
     * @param record
     */
    updateDateByOffset(date, predecessor, record) {
        let resultDate;
        let offsetValue = predecessor.offset;
        let durationUnit = predecessor.offsetUnit;
        if (offsetValue < 0) {
            resultDate = this.dateValidateModule.getStartDate(this.dateValidateModule.checkEndDate(date, record), (offsetValue * -1), durationUnit, record);
        }
        else {
            resultDate = this.dateValidateModule.getEndDate(date, offsetValue, durationUnit, record, false);
            if (!record.isMilestone) {
                resultDate = this.dateValidateModule.checkStartDate(resultDate, record);
            }
        }
        return resultDate;
    }
    /**
     *
     * @param records
     * @private
     */
    createConnectorLinesCollection(records) {
        let recordLength = records.length;
        let count;
        let ganttRecord;
        let predecessorsCollection;
        for (count = 0; count < recordLength; count++) {
            ganttRecord = records[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                this.addPredecessorsCollection(predecessorsCollection);
            }
        }
    }
    /**
     *
     * @param predecessorsCollection
     */
    addPredecessorsCollection(predecessorsCollection) {
        let predecessorsLength;
        let predecessorCount;
        let predecessor;
        let parentGanttRecord;
        let childGanttRecord;
        if (predecessorsCollection) {
            predecessorsLength = predecessorsCollection.length;
            for (predecessorCount = 0; predecessorCount < predecessorsLength; predecessorCount++) {
                predecessor = predecessorsCollection[predecessorCount];
                let from = 'from';
                let to = 'to';
                parentGanttRecord = this.parent.getRecordByID(predecessor[from]);
                childGanttRecord = this.parent.getRecordByID(predecessor[to]);
                if (this.parent.currentViewData && this.parent.currentViewData.indexOf(parentGanttRecord) !== -1 &&
                    this.parent.currentViewData.indexOf(childGanttRecord) !== -1) {
                    this.parent.connectorLineEditModule.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                }
            }
        }
    }
    /**
     *
     * @param childGanttRecord
     * @param previousValue
     * @param validationOn
     * @private
     */
    validatePredecessor(childGanttRecord, previousValue, validationOn) {
        if (!this.parent.isInPredecessorValidation) {
            return;
        }
        if (childGanttRecord.ganttProperties.predecessor) {
            let predecessorsCollection = childGanttRecord.ganttProperties.predecessor;
            let parentGanttRecord;
            let record = null;
            let predecessor;
            let currentTaskId = childGanttRecord.ganttProperties.taskId.toString();
            let predecessors = predecessorsCollection.filter((data) => {
                if (data.to === currentTaskId) {
                    return data;
                }
                else {
                    return null;
                }
            });
            let successors = predecessorsCollection.filter((data) => {
                if (data.from === currentTaskId) {
                    return data;
                }
                else {
                    return null;
                }
            });
            for (let count = 0; count < predecessors.length; count++) {
                predecessor = predecessors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
                if (this.parent.isInPredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                }
                else {
                    this.parent.isValidationEnabled = false;
                }
                if ((childGanttRecord.ganttProperties.taskId.toString() === predecessor.to
                    || childGanttRecord.ganttProperties.taskId.toString() === predecessor.from)
                    && (!validationOn || validationOn === 'predecessor')) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }
            for (let count = 0; count < successors.length; count++) {
                predecessor = successors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
                if (this.parent.isInPredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                }
                else {
                    this.parent.isValidationEnabled = false;
                }
                if (validationOn !== 'predecessor' && this.parent.isValidationEnabled) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
                if (parentGanttRecord.expanded === false || record.expanded === false) {
                    if (record) {
                        this.validatePredecessor(record, undefined, 'successor');
                    }
                    continue;
                }
                if (record) {
                    this.validatePredecessor(record, undefined, 'successor');
                }
            }
        }
    }
    /**
     * Predecessor link validation dialog template
     * @param args
     * @private
     */
    validationDialogTemplate(args) {
        let ganttId = this.parent.element.id;
        let contentdiv = createElement('div', {
            className: 'e-ValidationContent'
        });
        let taskData = getValue('task', args);
        let parenttaskData = getValue('parentTask', args);
        let violationType = getValue('violationType', args);
        let recordName = taskData.ganttProperties.taskName;
        let recordNewStartDate = this.parent.getFormatedDate(taskData.ganttProperties.startDate, 'MM/dd/yyyy');
        let parentName = parenttaskData.ganttProperties.taskName;
        let recordArgs = [recordName, parentName];
        let topContent;
        let topContentText;
        if (violationType === 'taskBeforePredecessor_FS') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_FS');
        }
        else if (violationType === 'taskAfterPredecessor_FS') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_FS');
        }
        else if (violationType === 'taskBeforePredecessor_SS') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_SS');
        }
        else if (violationType === 'taskAfterPredecessor_SS') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_SS');
        }
        else if (violationType === 'taskBeforePredecessor_FF') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_FF');
        }
        else if (violationType === 'taskAfterPredecessor_FF') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_FF');
        }
        else if (violationType === 'taskBeforePredecessor_SF') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_SF');
        }
        else if (violationType === 'taskAfterPredecessor_SF') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_SF');
        }
        topContentText = formatString(topContentText, recordArgs);
        topContent = '<div id="' + ganttId + '_ValidationText">' + topContentText + '<div>';
        let innerTable = '<table>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationCancel" name="ValidationRule" checked/><label for="'
            + ganttId + '_ValidationCancel" id= "' + ganttId + '_cancelLink">Cancel, keep the existing link</label></td></tr>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationRemoveline" name="ValidationRule"/><label for="'
            + ganttId + '_ValidationRemoveline" id="' + ganttId + '_removeLink">Remove the link and move <b>'
            + recordName + '</b> to start on <b>' + recordNewStartDate + '</b>.</label></td></tr>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationAddlineOffset" name="ValidationRule"/><label for="'
            + ganttId + '_ValidationAddlineOffset" id="' + ganttId + '_preserveLink">Move the <b>'
            + recordName + '</b> to start on <b>' + recordNewStartDate + '</b> and keep the link.</label></td></tr></table>';
        contentdiv.innerHTML = topContent + innerTable;
        return contentdiv;
    }
    /**
     * To render validation dialog
     * @return {void}
     * @private
     */
    renderValidationDialog() {
        let validationDialog = new Dialog({
            header: 'Validate Editing',
            isModal: true,
            visible: false,
            width: '50%',
            showCloseIcon: true,
            close: this.validationDialogClose.bind(this),
            content: '',
            buttons: [
                {
                    click: this.validationDialogOkButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.validationDialogCancelButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        document.getElementById(this.parent.element.id + '_dialogValidationRule').innerHTML = '';
        validationDialog.appendTo('#' + this.parent.element.id + '_dialogValidationRule');
        this.parent.validationDialogElement = validationDialog;
    }
    validationDialogOkButton() {
        let currentArgs = this.parent.currentEditedArgs;
        currentArgs.validateMode.preserveLinkWithEditing =
            document.getElementById(this.parent.element.id + '_ValidationAddlineOffset').checked;
        currentArgs.validateMode.removeLink =
            document.getElementById(this.parent.element.id + '_ValidationRemoveline').checked;
        currentArgs.validateMode.respectLink =
            document.getElementById(this.parent.element.id + '_ValidationCancel').checked;
        this.applyPredecessorOption();
        this.parent.validationDialogElement.hide();
    }
    validationDialogCancelButton() {
        this.parent.currentEditedArgs.validateMode.respectLink = true;
        this.applyPredecessorOption();
        this.parent.validationDialogElement.hide();
    }
    validationDialogClose(e) {
        if (getValue('isInteraction', e)) {
            this.parent.currentEditedArgs.validateMode.respectLink = true;
            this.applyPredecessorOption();
        }
    }
    /**
     * Validate and apply the predecessor option from validation dialog
     * @param buttonType
     * @return {void}
     * @private
     */
    applyPredecessorOption() {
        let args = this.parent.currentEditedArgs;
        let ganttRecord = args.data;
        if (args.validateMode.respectLink) {
            this.parent.editModule.reUpdatePreviousRecords();
            this.parent.chartRowsModule.refreshRecords([args.data]);
        }
        else if (args.validateMode.removeLink) {
            this.removePredecessors(ganttRecord, this.validationPredecessor);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        }
        else if (args.validateMode.preserveLinkWithEditing) {
            this.calculateOffset(ganttRecord);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        }
    }
    calculateOffset(record) {
        let prevPredecessor = extend([], record.ganttProperties.predecessor, [], true);
        let validPredecessor = this.getValidPredecessor(record);
        for (let i = 0; i < validPredecessor.length; i++) {
            let predecessor = validPredecessor[i];
            let parentTask = this.parent.getRecordByID(predecessor.from);
            let offset;
            if (isScheduledTask(parentTask.ganttProperties)) {
                let tempStartDate;
                let tempEndDate;
                let tempDuration;
                let isNegativeOffset;
                switch (predecessor.type) {
                    case 'FS':
                        tempStartDate = new Date(parentTask.ganttProperties.endDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.startDate.getTime());
                        break;
                    case 'SS':
                        tempStartDate = new Date(parentTask.ganttProperties.startDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.startDate.getTime());
                        break;
                    case 'SF':
                        tempStartDate = new Date(parentTask.ganttProperties.startDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.endDate.getTime());
                        break;
                    case 'FF':
                        tempStartDate = new Date(parentTask.ganttProperties.endDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.endDate.getTime());
                        break;
                }
                if (tempStartDate.getTime() < tempEndDate.getTime()) {
                    tempStartDate = this.dateValidateModule.checkStartDate(tempStartDate);
                    tempEndDate = this.dateValidateModule.checkEndDate(tempEndDate, null);
                    isNegativeOffset = false;
                }
                else {
                    let tempDate = new Date(tempStartDate.getTime());
                    tempStartDate = this.dateValidateModule.checkStartDate(tempEndDate);
                    tempEndDate = this.dateValidateModule.checkEndDate(tempDate, null);
                    isNegativeOffset = true;
                }
                if (tempStartDate.getTime() < tempEndDate.getTime()) {
                    tempDuration = this.dateValidateModule.getDuration(tempStartDate, tempEndDate, predecessor.offsetUnit, true, true);
                    offset = isNegativeOffset ? (tempDuration * -1) : tempDuration;
                }
                else {
                    offset = 0;
                }
            }
            else {
                offset = 0;
            }
            let preIndex = getIndex(predecessor, 'from', prevPredecessor, 'to');
            prevPredecessor[preIndex].offset = offset;
            // Update predecessor in predecessor task
            let parentPredecessors = extend([], parentTask.ganttProperties.predecessor, [], true);
            let parentPreIndex = getIndex(predecessor, 'from', parentPredecessors, 'to');
            parentPredecessors[parentPreIndex].offset = offset;
            this.parent.setRecordValue('predecessor', parentPredecessors, parentTask.ganttProperties, true);
        }
        this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
        let predecessorString = this.getPredecessorStringValue(record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
    }
    /**
     * Update predecessor value with user selection option in predecessor validation dialog
     * @param args
     * @return {void}
     */
    removePredecessors(ganttRecord, predecessor) {
        let prevPredecessor = extend([], [], ganttRecord.ganttProperties.predecessor, true);
        let preLength = predecessor.length;
        for (let i = 0; i < preLength; i++) {
            let parentGanttRecord = this.parent.getRecordByID(predecessor[i].from);
            let parentPredecessor = extend([], [], parentGanttRecord.ganttProperties.predecessor, true);
            let index = getIndex(predecessor[i], 'from', prevPredecessor, 'to');
            prevPredecessor.splice(index, 1);
            let parentIndex = getIndex(predecessor[i], 'from', parentPredecessor, 'to');
            parentPredecessor.splice(parentIndex, 1);
            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
        }
        if (prevPredecessor.length !== ganttRecord.ganttProperties.predecessor.length) {
            this.parent.setRecordValue('predecessor', prevPredecessor, ganttRecord.ganttProperties, true);
            let predecessorString = this.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue('predecessorsName', predecessorString, ganttRecord.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, ganttRecord);
        }
    }
    /**
     * To open predecessor validation dialog
     * @param args
     * @return {void}
     * @private
     */
    openValidationDialog(args) {
        let contentTemplate = this.validationDialogTemplate(args);
        this.parent.validationDialogElement.setProperties({ content: contentTemplate });
        this.parent.validationDialogElement.show();
    }
    /**
     * Method to get validate able predecessor alone from record
     * @param record
     * @private
     */
    getValidPredecessor(record) {
        let validPredecessor = [];
        let recPredecessor = record.ganttProperties.predecessor;
        if (recPredecessor && recPredecessor.length > 0) {
            validPredecessor = recPredecessor.filter((value) => {
                return value.from !== record.ganttProperties.taskId.toString();
            });
        }
        return validPredecessor;
    }
    /**
     * To validate the types while editing the taskbar
     * @param args
     * @return {boolean}
     * @private
     */
    validateTypes(ganttRecord) {
        let predecessor = this.getValidPredecessor(ganttRecord);
        let parentGanttRecord;
        this.validationPredecessor = [];
        let violatedParent;
        let violateType;
        let startDate = this.getPredecessorDate(ganttRecord, predecessor);
        let ganttTaskData = ganttRecord.ganttProperties;
        let endDate = this.dateValidateModule.getEndDate(startDate, ganttTaskData.duration, ganttTaskData.durationUnit, ganttTaskData, false);
        for (let i = 0; i < predecessor.length; i++) {
            parentGanttRecord = this.parent.getRecordByID(predecessor[i].from);
            let violationType = null;
            if (predecessor[i].type === 'FS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_FS';
                }
                else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_FS';
                }
            }
            else if (predecessor[i].type === 'SS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_SS';
                }
                else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SS';
                }
            }
            else if (predecessor[i].type === 'FF') {
                if (endDate < parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_FF';
                }
                else if (endDate > parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_FF';
                }
            }
            else if (predecessor[i].type === 'SF') {
                if (endDate < parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_SF';
                }
                else if (endDate > parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SF';
                }
            }
            if (!isNullOrUndefined(violationType) && isNullOrUndefined(violateType)) {
                violatedParent = parentGanttRecord;
                violateType = violationType;
            }
        }
        let validateArgs = {
            parentTask: violatedParent,
            task: ganttRecord,
            violationType: violateType
        };
        return validateArgs;
    }
    /**
     * Method to remove and update new predecessor collection in successor record
     * @param data
     * @private
     */
    addRemovePredecessor(data) {
        let prevData = this.parent.previousRecords[data.uniqueID];
        let newPredecessor = data.ganttProperties.predecessor.slice();
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            let prevPredecessor = prevData.ganttProperties.predecessor;
            if (!isNullOrUndefined(prevPredecessor)) {
                for (let p = 0; p < prevPredecessor.length; p++) {
                    let parentGanttRecord = this.parent.getRecordByID(prevPredecessor[p].from);
                    if (parentGanttRecord === data) {
                        data.ganttProperties.predecessor.push(prevPredecessor[p]);
                    }
                    else {
                        let parentPredecessor = extend([], [], parentGanttRecord.ganttProperties.predecessor, true);
                        let parentIndex = getIndex(prevPredecessor[p], 'from', parentPredecessor, 'to');
                        if (parentIndex !== -1) {
                            parentPredecessor.splice(parentIndex, 1);
                            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(newPredecessor)) {
                for (let n = 0; n < newPredecessor.length; n++) {
                    let parentGanttRecord = this.parent.getRecordByID(newPredecessor[n].from);
                    let parentPredecessor = extend([], [], parentGanttRecord.ganttProperties.predecessor, true);
                    parentPredecessor.push(newPredecessor[n]);
                    this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                }
            }
        }
    }
}

/**
 * To render the connector line in Gantt
 */
class ConnectorLine {
    constructor(ganttObj) {
        this.parent = ganttObj;
        this.dependencyViewContainer =
            createElement('div', { className: dependencyViewContainer });
        this.initPublicProp();
    }
    /**
     * To get connector line gap.
     * @return {number}
     * @private
     */
    getconnectorLineGap(data) {
        let width = 0;
        width = (data.milestoneChild ?
            ((this.parent.chartRowsModule.milestoneMarginTop / 2) + (this.parent.chartRowsModule.milestoneHeight / 2)) :
            ((this.parent.chartRowsModule.taskBarMarginTop / 2) + (this.parent.chartRowsModule.taskBarHeight / 2)));
        return width;
    }
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    initPublicProp() {
        this.lineColor = this.parent.connectorLineBackground;
        this.lineStroke = (this.parent.connectorLineWidth) > 4 ? 4 : this.parent.connectorLineWidth;
        this.createConnectorLineTooltipTable();
    }
    getTaskbarMidpoint(isMilestone) {
        return Math.floor(isMilestone ?
            (this.parent.chartRowsModule.milestoneMarginTop + (this.parent.chartRowsModule.milestoneHeight / 2)) :
            (this.parent.chartRowsModule.taskBarMarginTop + (this.parent.chartRowsModule.taskBarHeight / 2))) + 1;
    }
    /**
     * To connector line object collection.
     * @return {void}
     * @private
     */
    createConnectorLineObject(parentGanttData, childGanttData, predecessor) {
        let connectorObj = {};
        let updatedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        let parentIndex = updatedRecords.indexOf(parentGanttData);
        let childIndex = updatedRecords.indexOf(childGanttData);
        let parentGanttRecord = parentGanttData.ganttProperties;
        let childGanttRecord = childGanttData.ganttProperties;
        if (parentIndex === -1 || childIndex === -1) {
            return null;
        }
        else {
            connectorObj.parentLeft = parentGanttRecord.isMilestone ?
                parentGanttRecord.left - (this.parent.chartRowsModule.milestoneHeight / 2) : parentGanttRecord.left;
            connectorObj.childLeft = childGanttRecord.isMilestone ?
                childGanttRecord.left - (this.parent.chartRowsModule.milestoneHeight / 2) : childGanttRecord.left;
            connectorObj.parentWidth = parentGanttRecord.width === 0 || parentGanttRecord.isMilestone ?
                (Math.floor(this.parent.chartRowsModule.milestoneHeight)) : parentGanttRecord.width;
            connectorObj.childWidth = childGanttRecord.width === 0 || childGanttRecord.isMilestone ?
                (Math.floor(this.parent.chartRowsModule.milestoneHeight)) : childGanttRecord.width;
            connectorObj.parentIndex = parentIndex;
            connectorObj.childIndex = childIndex;
            connectorObj.rowHeight = this.parent.rowHeight;
            connectorObj.type = predecessor.type;
            connectorObj.connectorLineId = 'parent' + parentGanttRecord.taskId + 'child' + childGanttRecord.taskId;
            connectorObj.milestoneParent = parentGanttRecord.isMilestone ? true : false;
            connectorObj.milestoneChild = childGanttRecord.isMilestone ? true : false;
            if (isNullOrUndefined(isScheduledTask(parentGanttRecord)) || isNullOrUndefined(isScheduledTask(childGanttRecord))) {
                return null;
            }
            else {
                return connectorObj;
            }
        }
    }
    /**
     * To render connector line.
     * @return {void}
     * @private
     */
    renderConnectorLines(connectorLinesCollection) {
        let connectorLine$$1 = '';
        for (let index = 0; index < connectorLinesCollection.length; index++) {
            connectorLine$$1 = connectorLine$$1 + this.getConnectorLineTemplate(connectorLinesCollection[index]);
        }
        this.dependencyViewContainer.innerHTML = connectorLine$$1;
        this.parent.ganttChartModule.scrollElement.appendChild(this.dependencyViewContainer);
    }
    /**
     * To get parent position.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    getParentPosition(data) {
        if (data.parentIndex < data.childIndex) {
            if (data.type === 'FF') {
                if ((data.childLeft + data.childWidth) >= (data.parentLeft + data.parentWidth)) {
                    return 'FFType2';
                }
                else {
                    return 'FFType1';
                }
            }
            else if ((data.parentLeft < data.childLeft) && (data.childLeft > (data.parentLeft + data.parentWidth + 25))) {
                if (data.type === 'FS') {
                    return 'FSType1';
                }
                if (data.type === 'SF') {
                    return 'SFType1';
                }
                else if (data.type === 'SS') {
                    return 'SSType2';
                }
                else if (data.type === 'FF') {
                    return 'FFType2';
                }
            }
            else if ((data.parentLeft < data.childLeft && (data.childLeft < (data.parentLeft + data.parentWidth)))
                || (data.parentLeft === data.childLeft || data.parentLeft > data.childLeft)) {
                if (data.parentLeft > (data.childLeft + data.childWidth + 25)) {
                    if (data.type === 'SF') {
                        return 'SFType2';
                    }
                }
                if (data.parentLeft > data.childLeft) {
                    if (data.type === 'SS') {
                        return 'SSType1';
                    }
                    if (data.type === 'SF') {
                        return 'SFType1';
                    }
                    if (data.type === 'FF') {
                        return 'FFType1';
                    }
                }
                else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType2';
                    }
                }
                if (data.type === 'FS') {
                    return 'FSType2';
                }
                else if (data.type === 'SS') {
                    return 'SSType2';
                }
                else if (data.type === 'FF') {
                    return 'FFType1';
                }
                else if (data.type === 'SF') {
                    return 'SFType1';
                }
            }
            else if ((data.parentLeft) < data.childLeft) {
                if (data.type === 'FS') {
                    return 'FSType2';
                }
                else if (data.type === 'FF') {
                    return 'FFType2';
                }
                else if (data.type === 'SS') {
                    return 'SSType2';
                }
                else if (data.type === 'SF') {
                    return 'SFType1';
                }
            }
        }
        else if (data.parentIndex > data.childIndex) {
            if ((data.parentLeft < data.childLeft) && (data.childLeft > (data.parentLeft + data.parentWidth))) {
                if (data.type === 'FS') {
                    if (30 >= (data.childLeft - (data.milestoneParent ?
                        (data.parentLeft + data.parentWidth + 4) : (data.parentLeft + data.parentWidth)))) {
                        return 'FSType3';
                    }
                    else {
                        return 'FSType4';
                    }
                }
                if (data.parentLeft < data.childLeft || ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth))) {
                    if (data.type === 'SS') {
                        return 'SSType4';
                    }
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                    if (data.type === 'SF') {
                        return 'SFType4';
                    }
                }
                else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                }
            }
            else if ((data.parentLeft < data.childLeft && (data.childLeft < (data.parentLeft + data.parentWidth)))
                || (data.parentLeft === data.childLeft || data.parentLeft > data.childLeft)) {
                if ((data.childLeft + data.childWidth) <= (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType3';
                    }
                    if (data.type === 'SF') {
                        if ((data.childLeft + data.childWidth + 25) < (data.parentLeft)) {
                            return 'SFType3';
                        }
                        else {
                            return 'SFType4';
                        }
                    }
                    if (data.type === 'SS') {
                        if (data.childLeft <= data.parentLeft) {
                            return 'SSType3';
                        }
                        else {
                            return 'SSType4';
                        }
                    }
                }
                else if ((data.childLeft + data.childWidth) > (data.parentLeft + data.parentWidth)) {
                    if (data.type === 'FF') {
                        return 'FFType4';
                    }
                    if (data.type === 'SF') {
                        return 'SFType4';
                    }
                    if (data.type === 'SS') {
                        if (data.childLeft <= data.parentLeft) {
                            return 'SSType3';
                        }
                        else {
                            return 'SSType4';
                        }
                    }
                }
                if (data.type === 'FS') {
                    return 'FSType3';
                }
            }
            else if (data.parentLeft < data.childLeft) {
                if (data.type === 'FS') {
                    return 'FSType3';
                }
                if (data.type === 'SS') {
                    return 'SSType4';
                }
                if (data.type === 'FF') {
                    return 'FFType4';
                }
                if (data.type === 'SF') {
                    return 'SFType4';
                }
            }
        }
        return null;
    }
    /**
     * To get line height.
     * @return {void}
     * @private
     */
    getHeightValue(data) {
        return (data.parentIndex * data.rowHeight) > (data.childIndex * data.rowHeight) ?
            ((data.parentIndex * data.rowHeight) - (data.childIndex * data.rowHeight)) :
            ((data.childIndex * data.rowHeight) - (data.parentIndex * data.rowHeight));
    }
    /**
     * To get sstype2 inner element width.
     * @return {void}
     * @private
     */
    getInnerElementWidthSSType2(data) {
        if (data.parentLeft === data.childLeft) {
            return 10;
        }
        return (data.childLeft - data.parentLeft);
    }
    /**
     * To get sstype2 inner element left.
     * @return {void}
     * @private
     */
    getInnerElementLeftSSType2(data) {
        if (data.parentLeft === data.childLeft) {
            return (data.parentLeft - 20);
        }
        return (data.parentLeft - 10);
    }
    /**
     * To get sstype2 inner child element width.
     * @return {void}
     * @private
     */
    getInnerChildWidthSSType2(data) {
        if ((data.parentLeft + data.parentWidth) < data.childLeft) {
            return 10;
        }
        if (data.parentLeft === data.childLeft) {
            return 20;
        }
        if ((data.parentLeft + data.parentWidth) >= data.childLeft) {
            return 10;
        }
        return (data.childLeft - data.parentLeft);
    }
    getBorderStyles(cssType, unit) {
        let borderWidth = 'border-' + cssType + '-width:' + unit + 'px;';
        let borderStyle = 'border-' + cssType + '-style:solid;';
        let borderColor = !isNullOrUndefined(this.lineColor) ? 'border-' + cssType + '-color:' + this.lineColor + ';' : '';
        return (borderWidth + borderStyle + borderColor);
    }
    /**
     * To get connector line template.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    getConnectorLineTemplate(data) {
        let setInnerChildWidthSSType2 = this.getInnerChildWidthSSType2(data);
        let setInnerElementWidthSSType2 = this.getInnerElementWidthSSType2(data);
        let setInnerElementLeftSSType2 = this.getInnerElementLeftSSType2(data);
        let heightValue = this.getHeightValue(data);
        let isMilestoneParent = data.milestoneParent ? true : false;
        let isMilestone = data.milestoneChild ? true : false;
        let connectorContainer = '';
        if (this.getParentPosition(data)) {
            connectorContainer = '<div id="ConnectorLine' + data.connectorLineId + '" style="background-color=black">';
            let div = '<div class="' + connectorLineContainer + '" style="';
            let eLine = '<div class="' + connectorLine + '" style="';
            let rightArrow = '<div class="' + connectorLineRightArrow + '" style="';
            let leftArrow = '<div class="' + connectorLineLeftArrow + '" style="';
            let duplicateStingOne = leftArrow + (isMilestone ? 'left:0px;' : '') +
                this.getBorderStyles('right', 10) +
                'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
            let duplicateStingTwo = this.getBorderStyles('left', 10) +
                'top:' + (-6) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
            let duplicateStingThree = this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>' + eLine +
                'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                this.getBorderStyles('top', (heightValue - (this.lineStroke - 1))) + 'position:relative;"></div>';
            let duplicateStingFour = leftArrow + 'left:' +
                (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft)) + 10) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft)) + 10)) + 'px;' +
                this.getBorderStyles('right', 10);
            let duplicateStingFive = 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;' +
                this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
            if (this.getParentPosition(data) === 'FSType1') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType1">';
                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? -1 : 0) + 'px;width:' + (isMilestoneParent ?
                    ((((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10) + 1) :
                    (((data.childLeft - (data.parentLeft + data.parentWidth + 10)) + this.lineStroke) - 10)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.childLeft - (data.parentLeft + data.parentWidth + 10))) - 10) + 'px;' +
                    'width:0px;' + this.getBorderStyles('right', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.childLeft - (data.parentLeft + data.parentWidth + 10))) - 10) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FSType2') {
                div = div + 'left:' + data.parentLeft + 'px;top:' + ((data.parentIndex * data.rowHeight) +
                    this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType2">';
                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? data.parentWidth - 1 : data.parentWidth) + 'px;width:' +
                    (isMilestoneParent ? 11 : 10) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (data.parentWidth + 10 - this.lineStroke) + 'px;' +
                    this.getBorderStyles('left', this.lineStroke) + 'width:0px;' +
                    this.getBorderStyles('top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft + data.parentWidth) - data.childLeft) + 20)) + 'px;' +
                    'width:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + 30) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + 20)) + 'px;width:0px;' +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) +
                    this.getBorderStyles('left', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + 20)) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + rightArrow;
                div = div + 'left:' + (data.parentWidth - (((data.parentLeft + data.parentWidth) - data.childLeft) + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;top:' + (-6 - this.lineStroke) +
                    'px;width:0;height:0;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FSType3') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType3">';
                div = div + rightArrow;
                div = div + 'left:10px;' + this.getBorderStyles('left', 10) +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' + (5 + this.lineStroke) + 'px;' +
                    'top:' + (-6) + 'px;width:0;height:0;position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:10px;' + this.getBorderStyles('top', this.lineStroke) +
                    'position:relative;top:' + (-(6 + (5 + this.lineStroke) + Math.round(this.lineStroke / 2))) + 'px;"></div>';
                div = div + eLine;
                div = div + 'width:' + this.lineStroke + 'px;' + this.getBorderStyles('top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke + 1)) +
                    'position:relative;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';
                div = div + eLine;
                div = div + 'width:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + 30) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;top:' +
                    (-(13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) - data.childLeft) + (30 - this.lineStroke)) +
                    'px;width:0px;' + 'height:' + (this.getconnectorLineGap(data) - this.lineStroke) + 'px;' +
                    this.getBorderStyles('left', this.lineStroke) + 'position:relative;' +
                    'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;"></div>';
                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:' + (((data.parentLeft +
                    data.parentWidth) - data.childLeft) + (18 - this.lineStroke)) + 'px;width:' + (12 + this.lineStroke) + 'px;' : 'left:' +
                    (((data.parentLeft + data.parentWidth) - data.childLeft) + 20) + 'px;width:10px;') +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;top:' +
                    (-(13 + ((this.lineStroke - 1) * 2))) + 'px;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FSType4') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FSType4">';
                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth + 10)) + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (data.childLeft - (data.parentLeft + data.parentWidth) - 20) +
                    'px;top:' + (-(6 + (5 + this.lineStroke) + Math.round(this.lineStroke / 2))) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) +
                    'position:relative;"></div>';
                div = div + eLine;
                div = div + 'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;left:' +
                    (data.childLeft - (data.parentLeft + data.parentWidth) - 20) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:-1px;' : '') + 'top:' +
                    (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (isMilestoneParent ? ((data.childLeft - (data.parentLeft + data.parentWidth + 20) + 1) + this.lineStroke) :
                        ((data.childLeft - (data.parentLeft + data.parentWidth + 20)) + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SSType4') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType4">';
                div = div + rightArrow;
                div = div + 'left:' + (data.childLeft - data.parentLeft) + 'px;' + duplicateStingTwo;
                div = div + eLine;
                div = div + 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;width:' +
                    (data.childLeft - data.parentLeft) + 'px;' + duplicateStingThree;
                div = div + eLine;
                div = div + 'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:10px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SSType3') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType3">';
                div = div + rightArrow;
                div = div + 'left:10px;' + duplicateStingTwo;
                div = div + eLine;
                div = div + 'top:' + (-(6 + (5 + this.lineStroke) + (this.lineStroke / 2))) + 'px;width:10px;' + duplicateStingThree;
                div = div + eLine;
                div = div + 'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (data.parentLeft - data.childLeft + 21) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SSType2') {
                div = div + 'left:' + setInnerElementLeftSSType2 + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType2">';
                div = div + eLine;
                div = div + 'width:' + (setInnerChildWidthSSType2 + 1) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:' + setInnerElementWidthSSType2 + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + rightArrow;
                div = div + 'left:' + setInnerElementWidthSSType2 + 'px;' +
                    this.getBorderStyles('left', 10) + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;width:0;' +
                    'height:0;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SSType1') {
                div = div + 'left:' + (data.childLeft - 20) + 'px;top:' + ((data.parentIndex * data.rowHeight) +
                    this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SSType1">';
                div = div + eLine;
                div = div + 'width:' + (data.parentLeft - data.childLeft + 21) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:10px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + rightArrow;
                div = div + 'left:10px;' + this.getBorderStyles('left', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FFType1') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType1">';
                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) - 1) : (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)))) + 'px;' +
                    'width:' + (isMilestoneParent ? (21 + this.lineStroke) : (20 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (isMilestoneParent ? (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) + 20) : (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) + 20)) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (isMilestone ? 4 : 10) + 'px;width:' + (isMilestone ?
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + (16 + this.lineStroke)) :
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + (10 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + leftArrow;
                div = div + (isMilestone ? 'left:0px;' : '') + this.getBorderStyles('right', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) + 'px;' +
                    'border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FFType2') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType2">';
                div = div + eLine;
                div = div + (isMilestoneParent ? 'left:-1px;' : '') + 'width:' +
                    (isMilestoneParent ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) +
                        (21 + this.lineStroke)) : (((data.childLeft + data.childWidth) -
                        (data.parentLeft + data.parentWidth)) + (20 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 20) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) +
                    'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 4) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)) + 10)) + 'px;' +
                    'width:' + (isMilestone ? (16 + this.lineStroke) : (10 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + leftArrow;
                div = div + 'left:' + (isMilestone ? (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth))) :
                    (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth)))) + 'px;' +
                    this.getBorderStyles('right', 10) + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' + (5 + this.lineStroke) +
                    'px;width:0;height:0;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FFType3') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType3">';
                div = div + duplicateStingOne;
                div = div + eLine;
                div = div + (isMilestone ? ('left:4px;width:' +
                    (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + 16)) :
                    ('left:10px;width:' + (((data.parentLeft + data.parentWidth) -
                        (data.childLeft + data.childWidth)) + 10))) + 'px;top:' + (-(6 + (5 + this.lineStroke) +
                    (this.lineStroke / 2))) + 'px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft + data.parentWidth) - (data.childLeft + data.childWidth)) + 20) +
                    'px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + (isMilestoneParent ? ('left:' + (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth)) - 1) + 'px;width:21') : ('left:' + (((data.parentLeft + data.parentWidth) -
                    (data.childLeft + data.childWidth))) + 'px;width:20')) +
                    'px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'FFType4') {
                div = div + 'left:' + (data.parentLeft + data.parentWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="FFType4">';
                div = div + leftArrow;
                div = div + (isMilestone ? ('left:' + ((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth))) :
                    ('left:' + (((data.childLeft + data.childWidth) - (data.parentLeft + data.parentWidth))))) + 'px;' +
                    this.getBorderStyles('right', 10) + 'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;' +
                    'position:relative;"></div>';
                div = div + eLine;
                div = div + (isMilestone ? ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 4) +
                    'px;width:' + (16 + this.lineStroke)) : ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 10) + 'px;width:' + (10 + this.lineStroke))) +
                    'px;' + duplicateStingFive;
                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + 20) + 'px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke + 1)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + (isMilestoneParent ? ('left:-1px;width:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + (21 + this.lineStroke))) : ('width:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft + data.parentWidth)) + (20 + this.lineStroke)))) + 'px;top:' +
                    (-(13 + ((this.lineStroke - 1) * 2))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SFType4') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;width:1px;' +
                    'height:' + heightValue + 'px;position:absolute" data-connectortype="SFType4">';
                div = div + duplicateStingFour + 'top:' + (-5 - this.lineStroke + (this.lineStroke - 1)) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;' +
                    'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (isMilestone ? ((((data.childLeft + data.childWidth) - (data.parentLeft)) + (14 + this.lineStroke)) +
                    'px;width:16') : ((((data.childLeft + data.childWidth) - (data.parentLeft)) + 20) + 'px;width:' +
                    (10 + this.lineStroke))) + 'px;' + duplicateStingFive;
                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + 30) + 'px;top:' +
                    (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.getconnectorLineGap(data) - (this.lineStroke - 1))) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    (((data.childLeft + data.childWidth) - (data.parentLeft)) + (30 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:11px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SFType3') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.childIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType3">';
                div = div + duplicateStingOne;
                div = div + eLine;
                div = div + (isMilestone ? 'left:4px;width:' + (16 + this.lineStroke) : 'left:10px;width:' +
                    (10 + this.lineStroke)) + 'px;top:' + (-(13 + ((this.lineStroke - 1) * 2) - 1)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:20px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:0px;' +
                    this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - (this.lineStroke - 1))) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:20px;top:' + (-(13 + ((this.lineStroke - 1) * 2))) + 'px;width:' +
                    ((data.parentLeft - (data.childLeft + data.childWidth + 20)) + this.lineStroke) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SFType1') {
                div = div + 'left:' + (data.parentLeft - 10) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestone) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType1">';
                div = div + eLine;
                div = div + 'width:11px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'width:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + (30 + this.lineStroke)) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.childLeft + data.childWidth) - (data.parentLeft)) + 30) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (this.getconnectorLineGap(data) - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + (isMilestone ? ('left:' + (((data.childLeft + data.childWidth) -
                    (data.parentLeft)) + 15) + 'px;width:' + (15 + this.lineStroke)) : ('left:' +
                    (((data.childLeft + data.childWidth) - (data.parentLeft)) + 20) + 'px;width:' + (10 + this.lineStroke))) + 'px;' +
                    this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + duplicateStingFour + 'top:' + (-6 - this.lineStroke) + 'px;' +
                    'border-bottom-width:' + (5 + this.lineStroke) + 'px;border-top-width:' +
                    (5 + this.lineStroke) + 'px;position:relative;"></div></div>';
            }
            if (this.getParentPosition(data) === 'SFType2') {
                div = div + 'left:' + (data.childLeft + data.childWidth) + 'px;top:' +
                    ((data.parentIndex * data.rowHeight) + this.getTaskbarMidpoint(isMilestoneParent) - (this.lineStroke - 1)) + 'px;' +
                    'width:1px;height:' + heightValue + 'px;position:absolute" data-connectortype="SFType2">';
                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft) - (data.childLeft + data.childWidth)) - 10) +
                    'px;width:11px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + 'left:' + (((data.parentLeft) - (data.childLeft + data.childWidth)) - 10) +
                    'px;width:0px;' + this.getBorderStyles('left', this.lineStroke) +
                    this.getBorderStyles('top', (heightValue - this.lineStroke)) + 'position:relative;"></div>';
                div = div + eLine;
                div = div + (isMilestone ? ('left:4px;width:' + (((data.parentLeft) - (data.childLeft + data.childWidth))
                    - (14 - this.lineStroke))) : ('left:10px;width:' + (((data.parentLeft) -
                    (data.childLeft + data.childWidth)) - (20 - this.lineStroke)))) +
                    'px;' + this.getBorderStyles('top', this.lineStroke) + 'position:relative;"></div>';
                div = div + leftArrow;
                div = div + 'left:0px;' + this.getBorderStyles('right', 10) +
                    'top:' + (-6 - this.lineStroke) + 'px;border-bottom-width:' + (5 + this.lineStroke) +
                    'px;border-top-width:' + (5 + this.lineStroke) + 'px;width:0;height:0;position:relative;"></div></div>';
            }
            connectorContainer += div;
            connectorContainer += '</div>';
        }
        return connectorContainer;
    }
    /**
     * @private
     */
    createConnectorLineTooltipTable() {
        this.tooltipTable = createElement('table', { className: '.e-tooltiptable', styles: 'margin-top:0px', attrs: { 'cellspacing': '2px', 'cellpadding': '2px' } });
        let tooltipBody = createElement('tbody');
        tooltipBody.innerHTML = '';
        this.tooltipTable.appendChild(tooltipBody);
    }
    /**
     * @param fromTaskName
     * @param fromPredecessorText
     * @param toTaskName
     * @param toPredecessorText
     * @private
     */
    getConnectorLineTooltipInnerTd(fromTaskName, fromPredecessorText, toTaskName, toPredecessorText) {
        let innerTd = '<tr  id="fromPredecessor"><td >' + this.parent.localeObj.getConstant('from') + '</td><td> ';
        innerTd = innerTd + fromTaskName + ' </td><td> ' + this.parent.localeObj.getConstant(fromPredecessorText) + ' </td> </tr>';
        innerTd = innerTd + '<tr id="toPredecessor"><td>' + this.parent.localeObj.getConstant('to') + '</td><td> ' + toTaskName;
        innerTd = innerTd + ' </td><td> ' + this.parent.localeObj.getConstant(toPredecessorText) + ' </td></tr></tbody><table>';
        return innerTd;
    }
}

/**
 * File for handling connector line edit operation in Gantt.
 */
class ConnectorLineEdit {
    constructor(ganttObj) {
        this.parent = ganttObj;
    }
    /**
     * To update connector line edit element.
     * @return {void}
     * @private
     */
    updateConnectorLineEditElement(e) {
        let element = this.getConnectorLineHoverElement(e.target);
        if (!getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            this.highlightConnectorLineElements(element);
        }
    }
    /**
     * To get hovered connector line element.
     * @return {void}
     * @private
     */
    getConnectorLineHoverElement(target) {
        let isOnLine = parentsUntil$1(target, connectorLine);
        let isOnRightArrow = parentsUntil$1(target, connectorLineRightArrow);
        let isOnLeftArrow = parentsUntil$1(target, connectorLineLeftArrow);
        if (isOnLine || isOnRightArrow || isOnLeftArrow) {
            return parentsUntil$1(target, connectorLineContainer);
        }
        else {
            return null;
        }
    }
    /**
     * To highlight connector line while hover.
     * @return {void}
     * @private
     */
    highlightConnectorLineElements(element) {
        if (element) {
            if (element !== this.connectorLineElement) {
                this.removeHighlight();
                this.addHighlight(element);
            }
        }
        else {
            this.removeHighlight();
        }
    }
    /**
     * To add connector line highlight class.
     * @return {void}
     * @private
     */
    addHighlight(element) {
        this.connectorLineElement = element;
        addClass([element], [connectorLineHoverZIndex]);
        addClass(element.querySelectorAll('.' + connectorLine), [connectorLineHover]);
        addClass(element.querySelectorAll('.' + connectorLineRightArrow), [connectorLineRightArrowHover]);
        addClass(element.querySelectorAll('.' + connectorLineLeftArrow), [connectorLineLeftArrowHover]);
    }
    /**
     * To remove connector line highlight class.
     * @return {void}
     * @private
     */
    removeHighlight() {
        if (!isNullOrUndefined(this.connectorLineElement)) {
            removeClass([this.connectorLineElement], [connectorLineHoverZIndex]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + connectorLine), [connectorLineHover]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + connectorLineRightArrow), [connectorLineRightArrowHover]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + connectorLineLeftArrow), [connectorLineLeftArrowHover]);
            this.connectorLineElement = null;
        }
    }
    /**
     * To remove connector line highlight class.
     * @return {void}
     * @private
     */
    getEditedConnectorLineString(records) {
        let ganttRecord;
        let predecessorsCollection;
        let predecessor;
        let parentGanttRecord;
        let childGanttRecord;
        let connectorObj;
        let idArray = [];
        let lineArray = [];
        let editedConnectorLineString = '';
        for (let count = 0; count < records.length; count++) {
            ganttRecord = records[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                for (let predecessorCount = 0; predecessorCount < predecessorsCollection.length; predecessorCount++) {
                    predecessor = predecessorsCollection[predecessorCount];
                    let from = 'from';
                    let to = 'to';
                    this.removeConnectorLineById('parent' + predecessor[from] + 'child' + predecessor[to]);
                    parentGanttRecord = this.parent.getRecordByID(predecessor[from]);
                    childGanttRecord = this.parent.getRecordByID(predecessor[to]);
                    if ((parentGanttRecord && parentGanttRecord.expanded === true) ||
                        (childGanttRecord && childGanttRecord.expanded === true)) {
                        connectorObj = this.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                        if (!isNullOrUndefined(connectorObj)) {
                            let lineIndex = idArray.indexOf(connectorObj.connectorLineId);
                            let lineString = this.parent.connectorLineModule.getConnectorLineTemplate(connectorObj);
                            if (lineIndex !== -1) {
                                lineArray[lineIndex] = lineString;
                            }
                            else {
                                idArray.push(connectorObj.connectorLineId);
                                lineArray.push(lineString);
                            }
                        }
                    }
                }
                editedConnectorLineString = lineArray.join('');
            }
        }
        return editedConnectorLineString;
    }
    /**
     * To refresh connector line object collections
     * @param parentGanttRecord
     * @param childGanttRecord
     * @param predecessor
     * @private
     */
    updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor) {
        let connectorObj;
        connectorObj = this.parent.connectorLineModule.createConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
        if (connectorObj) {
            if (this.parent.connectorLineIds.length > 0 && this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) === -1) {
                this.parent.updatedConnectorLineCollection.push(connectorObj);
                this.parent.connectorLineIds.push(connectorObj.connectorLineId);
            }
            else if (this.parent.connectorLineIds.length === 0) {
                this.parent.updatedConnectorLineCollection.push(connectorObj);
                this.parent.connectorLineIds.push(connectorObj.connectorLineId);
            }
            else if (this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) !== -1) {
                let index = this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId);
                this.parent.updatedConnectorLineCollection[index] = connectorObj;
            }
            predecessor.isDrawn = true;
        }
        return connectorObj;
    }
    /**
     * Tp refresh connector lines of edited records
     * @param editedRecord
     * @private
     */
    refreshEditedRecordConnectorLine(editedRecord) {
        this.removePreviousConnectorLines(this.parent.previousRecords);
        let editedConnectorLineString;
        editedConnectorLineString = this.getEditedConnectorLineString(editedRecord);
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML =
            this.parent.connectorLineModule.dependencyViewContainer.innerHTML + editedConnectorLineString;
    }
    /**
     * Method to remove connector line from DOM
     * @param records
     * @private
     */
    removePreviousConnectorLines(records) {
        let isObjectType;
        if (isObject(records) === true) {
            isObjectType = true;
        }
        else {
            isObjectType = false;
        }
        let length = isObjectType ? Object.keys(records).length : records.length;
        let keys = Object.keys(records);
        for (let i = 0; i < length; i++) {
            let data;
            let predecessors;
            if (isObjectType) {
                let uniqueId = keys[i];
                data = records[uniqueId];
            }
            else {
                data = records[i];
            }
            predecessors = data.ganttProperties && data.ganttProperties.predecessor;
            if (predecessors && predecessors.length > 0) {
                for (let pre = 0; pre < predecessors.length; pre++) {
                    let lineId = 'parent' + predecessors[pre].from + 'child' + predecessors[pre].to;
                    this.removeConnectorLineById(lineId);
                }
            }
        }
    }
    removeConnectorLineById(id) {
        let element = this.parent.connectorLineModule.dependencyViewContainer.querySelector('#ConnectorLine' + id);
        if (!isNullOrUndefined(element)) {
            remove(element);
        }
    }
    idFromPredecessor(pre) {
        let preArray = pre.split(',');
        let preIdArray = [];
        for (let j = 0; j < preArray.length; j++) {
            let strArray = [];
            for (let i = 0; i < preArray[j].length; i++) {
                if (!isNullOrUndefined(preArray[j].charAt(i)) && parseInt(preArray[j].charAt(i), 10).toString() !== 'NaN') {
                    strArray.push(preArray[j].charAt(i));
                }
                else {
                    break;
                }
            }
            preIdArray.push((strArray.join('')));
        }
        return preIdArray;
    }
    predecessorValidation(predecessor, record) {
        let recordId = record.taskId;
        let currentId;
        let currentRecord;
        for (let count = 0; count < predecessor.length; count++) {
            currentId = predecessor[count];
            let visitedIdArray = [];
            let predecessorCollection = predecessor.slice(0);
            predecessorCollection.splice(count, 1);
            while (currentId !== null) {
                let currentIdArray = [];
                if (visitedIdArray.indexOf(currentId) === -1) {
                    //Predecessor id not in records collection
                    if (isNullOrUndefined(this.parent.getRecordByID(currentId))) {
                        return false;
                    }
                    currentRecord = this.parent.getRecordByID(currentId).ganttProperties;
                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentRecord.predecessor.forEach((value) => {
                            if (currentRecord.taskId.toString() !== value.from) {
                                currentIdArray.push(value.from.toString());
                            }
                        });
                    }
                    if (recordId.toString() === currentRecord.taskId.toString() || currentIdArray.indexOf(recordId.toString()) !== -1) {
                        return false;
                    }
                    visitedIdArray.push(currentId);
                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentId = currentRecord.predecessor[0].from;
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
        return true;
    }
    /**
     * To validate predecessor relations
     * @param ganttRecord
     * @param predecessorString
     * @private
     */
    validatePredecessorRelation(ganttRecord, predecessorString) {
        let flag = true;
        let recordId = ganttRecord.ganttProperties.taskId;
        let predecessorIdArray;
        let currentId;
        if (!isNullOrUndefined(predecessorString) && predecessorString.length > 0) {
            predecessorIdArray = this.idFromPredecessor(predecessorString);
            for (let count = 0; count < predecessorIdArray.length; count++) {
                //Check edited item has parent item in predecessor collection
                let checkParent = this.checkParentRelation(ganttRecord, predecessorIdArray);
                if (!checkParent) {
                    return false;
                }
                // Check if predecessor exist more then one 
                let tempIdArray = predecessorIdArray.slice(0);
                let checkArray = [];
                let countFlag = true;
                tempIdArray.forEach((value) => {
                    if (checkArray.indexOf(value) === -1) {
                        checkArray.push(value);
                    }
                    else {
                        countFlag = false;
                    }
                });
                if (!countFlag) {
                    return false;
                }
                //Cyclick check  
                currentId = predecessorIdArray[count];
                let visitedIdArray = [];
                let predecessorCollection = predecessorIdArray.slice(0);
                predecessorCollection.splice(count, 1);
                while (currentId !== null) {
                    let currentIdArray = [];
                    let currentIdIndex;
                    let currentRecord;
                    if (visitedIdArray.indexOf(currentId) === -1) {
                        //Predecessor id not in records collection
                        if (isNullOrUndefined(this.parent.getRecordByID(currentId.toString()))) {
                            return false;
                        }
                        currentRecord = this.parent.getRecordByID(currentId.toString()).ganttProperties;
                        //  let currentPredecessor='';
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            currentRecord.predecessor.forEach((value, index) => {
                                if (currentRecord.taskId.toString() !== value.from) {
                                    currentIdArray.push(value.from.toString());
                                    currentIdIndex = index;
                                }
                            });
                            //    currentPredecessor=currentRecord.predecessor[0].from
                        }
                        if (recordId.toString() === currentRecord.taskId.toString() ||
                            currentIdArray.indexOf(recordId.toString()) !== -1) {
                            //cycylic occurs//break;
                            return false;
                        }
                        visitedIdArray.push(currentId);
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            let result;
                            if (currentIdArray.length > 1) {
                                result = this.predecessorValidation(currentIdArray, ganttRecord.ganttProperties);
                            }
                            else if (currentIdArray.length === 1) {
                                currentId = currentRecord.predecessor[currentIdIndex].from;
                            }
                            if (result === false) {
                                return false;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return flag;
    }
    /**
     * To add dependency for Task
     * @param ganttRecord
     * @param predecessorString
     * @private
     */
    addPredecessor(ganttRecord, predecessorString) {
        let tempPredecessorString = isNullOrUndefined(ganttRecord.ganttProperties.predecessorsName) ||
            ganttRecord.ganttProperties.predecessorsName === '' ?
            predecessorString : (ganttRecord.ganttProperties.predecessorsName + ',' + predecessorString);
        this.updatePredecessorHelper(ganttRecord, tempPredecessorString);
    }
    /**
     * To remove dependency from task
     * @param ganttRecord
     * @private
     */
    removePredecessor(ganttRecord) {
        this.updatePredecessorHelper(ganttRecord, null);
    }
    /**
     * To modify current dependency values of Task
     * @param ganttRecord
     * @param predecessorString
     * @private
     */
    updatePredecessor(ganttRecord, predecessorString) {
        return this.updatePredecessorHelper(ganttRecord, predecessorString);
    }
    updatePredecessorHelper(ganttRecord, predecessorString) {
        if (isUndefined(predecessorString) || this.validatePredecessorRelation(ganttRecord, predecessorString)) {
            this.parent.isOnEdit = true;
            let predecessorCollection = [];
            if (!isNullOrUndefined(predecessorString) && predecessorString !== '') {
                predecessorCollection = this.parent.predecessorModule.calculatePredecessor(predecessorString, ganttRecord);
            }
            this.parent.setRecordValue('predecessor', predecessorCollection, ganttRecord.ganttProperties, true);
            let stringValue = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue('predecessorsName', stringValue, ganttRecord.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, stringValue, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, stringValue, ganttRecord);
            let args = {};
            args.data = ganttRecord;
            this.parent.editModule.initiateUpdateAction(args);
            return true;
        }
        else {
            return false;
        }
    }
    checkParentRelation(ganttRecord, predecessorIdArray) {
        let editingData = ganttRecord;
        let checkParent = true;
        if (editingData && editingData.parentItem) {
            if (predecessorIdArray.indexOf(editingData.parentItem.taskId.toString()) !== -1) {
                return false;
            }
        }
        for (let p = 0; p < predecessorIdArray.length; p++) {
            let record = this.parent.currentViewData.filter((item) => {
                return item && item.ganttProperties.taskId.toString() === predecessorIdArray[p].toString();
            });
            if (record[0] && record[0].hasChildRecords) {
                return false;
            }
        }
        return checkParent;
    }
}

/**
 * Splitter related goes here
 */
class Splitter$1 {
    constructor(ganttObj) {
        this.parent = ganttObj;
        this.parent.on('destroy', this.destroy, this);
    }
    /**
     * @private
     */
    renderSplitter() {
        let toolbarHeight = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        let splitterPosition = this.calculateSplitterPosition(this.parent.splitterSettings);
        this.parent.splitterElement = createElement('div', { className: splitter });
        this.parent.treeGridPane = createElement('div', { className: treeGridPane });
        this.parent.chartPane = createElement('div', { className: ganttChartPane });
        this.parent.splitterElement.appendChild(this.parent.treeGridPane);
        this.parent.splitterElement.appendChild(this.parent.chartPane);
        this.splitterObject = new Splitter({
            height: (this.parent.ganttHeight - toolbarHeight).toString(),
            width: this.parent.ganttWidth.toString(),
            separatorSize: this.parent.splitterSettings.separatorSize,
            paneSettings: [
                {
                    resizable: true,
                    size: splitterPosition,
                    min: this.getSpliterPositionInPercentage(this.parent.splitterSettings.minimum)
                },
                {
                    resizable: true
                }
            ],
            orientation: 'Horizontal',
            resizeStart: (args) => {
                this.splitterPreviousPositionGrid = args.pane[0].scrollWidth + 1 + 'px';
                this.splitterPreviousPositionChart = args.pane[1].scrollWidth + 1 + 'px';
                this.parent.trigger('splitterResizeStart', args);
            },
            resizing: (args) => {
                this.parent.trigger('splitterResizing', args);
            },
            resizeStop: (args) => {
                this.parent.trigger('splitterResized', args);
                if (args.cancel === true) {
                    this.splitterObject.paneSettings[0].size = null;
                    this.splitterObject.paneSettings[0].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionGrid);
                    this.splitterObject.paneSettings[1].size = null;
                    this.splitterObject.paneSettings[1].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionChart);
                }
            }
        });
        this.parent.element.appendChild(this.parent.splitterElement);
        this.splitterObject.appendTo(this.parent.splitterElement);
    }
    /**
     * @private
     */
    calculateSplitterPosition(splitter$$1, isDynamic) {
        if (splitter$$1.view === 'Grid') {
            return '100%';
        }
        else if (splitter$$1.view === 'Chart') {
            return '0%';
        }
        else {
            if (!isNullOrUndefined(splitter$$1.position) && splitter$$1.position !== '') {
                return this.getSpliterPositionInPercentage(splitter$$1.position);
            }
            else if (!isNullOrUndefined(splitter$$1.columnIndex) && splitter$$1.columnIndex >= 0) {
                return isDynamic ? this.getSpliterPositionInPercentage(this.getTotalColumnWidthByIndex(splitter$$1.columnIndex).toString() + 'px') :
                    this.getSpliterPositionInPercentage((splitter$$1.columnIndex * 150) + 'px');
            }
            else {
                return this.getSpliterPositionInPercentage('250px');
            }
        }
    }
    /**
     *
     */
    getSpliterPositionInPercentage(position) {
        let value = !isNullOrUndefined(position) && position !== '' ? position : null;
        if (!isNullOrUndefined(value)) {
            if (position.indexOf('px') !== -1) {
                let intValue = parseInt(position, 10);
                value = (((intValue / this.parent.ganttWidth) * 100) <= 100 ? ((intValue / this.parent.ganttWidth) * 100) + '%' :
                    '100%');
            }
            else {
                value = position.indexOf('%') === -1 ?
                    position + '%' : position;
            }
        }
        return value;
    }
    /**
     *
     */
    getTotalColumnWidthByIndex(index) {
        let width = 0;
        let tr = this.parent.treeGrid.element.querySelectorAll('.e-headercell');
        index = tr.length > index ? index : tr.length;
        for (let column = 0; column < index; column++) {
            width = width + tr[column].offsetWidth;
        }
        return width;
    }
    /**
     * @private
     */
    updateSplitterPosition() {
        this.splitterObject.separatorSize = this.parent.splitterSettings.separatorSize >= 4 ?
            this.parent.splitterSettings.separatorSize : 4;
        let splitterPosition = this.calculateSplitterPosition(this.parent.splitterSettings, true);
        this.splitterObject.paneSettings[0].min = this.getSpliterPositionInPercentage(this.parent.splitterSettings.minimum);
        this.splitterObject.dataBind();
        this.splitterObject.paneSettings[0].size = splitterPosition;
    }
    /**
     * @private
     */
    triggerCustomResizedEvent() {
        let pane1 = this.splitterObject.element.querySelectorAll('.e-pane')[0];
        let pane2 = this.splitterObject.element.querySelectorAll('.e-pane')[1];
        let eventArgs = {
            event: null,
            element: this.splitterObject.element,
            pane: [pane1, pane2],
            index: [0, 1],
            separator: this.splitterObject.element.querySelector('.e-split-bar'),
            paneSize: [pane1.offsetWidth, pane2.offsetWidth]
        };
        this.parent.trigger('splitterResized', eventArgs);
        if (eventArgs.cancel === true) {
            this.splitterObject.paneSettings[0].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionGrid);
            this.splitterObject.paneSettings[1].size = this.getSpliterPositionInPercentage(this.splitterPreviousPositionChart);
        }
    }
    destroy() {
        this.splitterObject.destroy();
        this.parent.off('destroy', this.destroy);
    }
}

/**
 * File for handling tooltip in Gantt.
 */
class Tooltip$1 {
    constructor(gantt) {
        this.parent = gantt;
        this.createTooltip();
        this.parent.on('destroy', this.destroy, this);
    }
    /**
     * To create tooltip.
     * @return {void}
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    createTooltip() {
        this.toolTipObj = new Tooltip();
        this.toolTipObj.target = '.e-header-cell-label, .e-gantt-child-taskbar,' +
            '.e-gantt-parent-taskbar, .e-gantt-milestone, .e-gantt-unscheduled-taskbar' +
            '.e-event-markers, .e-baseline-bar, .e-event-markers,' +
            '.e-connector-line-container, .e-indicator-span, .e-notes-info';
        this.toolTipObj.position = 'BottomCenter';
        this.toolTipObj.openDelay = 700;
        this.toolTipObj.cssClass = ganttTooltip;
        this.toolTipObj.animation = { open: { effect: 'None', delay: 0 }, close: { effect: 'None', delay: 0 } };
        this.toolTipObj.afterOpen = this.updateTooltipPosition.bind(this);
        this.toolTipObj.showTipPointer = false;
        this.toolTipObj.beforeRender = this.tooltipBeforeRender.bind(this);
        this.toolTipObj.afterClose = this.tooltipCloseHandler.bind(this);
        this.toolTipObj.appendTo(this.parent.element);
    }
    tooltipBeforeRender(args) {
        let parent = this.parent;
        if (parent.isOnEdit) {
            args.cancel = true;
        }
        let element = parentsUntil$1(args.target, chartRowCell);
        let data;
        let argsData = {
            data: {},
            args: args,
            content: ''
        };
        if (args.target.classList.contains('e-header-cell-label')) {
            if (parent.timelineSettings.showTooltip) {
                argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('timeline', data, parent, args);
            }
            else {
                args.cancel = true;
            }
        }
        else {
            if (parent.tooltipSettings.showTooltip) {
                if (element) {
                    argsData.data = parent.ganttChartModule.getRecordByTaskBar(element);
                    data = argsData.data;
                }
                if (args.target.classList.contains('e-gantt-child-taskbar') ||
                    args.target.classList.contains('e-gantt-parent-taskbar') ||
                    args.target.classList.contains('e-gantt-milestone') ||
                    args.target.classList.contains('e-gantt-unscheduled-taskbar')) {
                    let taskbarTemplateNode;
                    if (parent.tooltipSettings.taskbar) {
                        taskbarTemplateNode = parent.tooltipModule.templateCompiler(parent.tooltipSettings.taskbar, parent, data);
                    }
                    argsData.content = this.toolTipObj.content = taskbarTemplateNode ? taskbarTemplateNode[0] :
                        parent.tooltipModule.getTooltipContent((data.ganttProperties.isMilestone ? 'milestone' : 'taskbar'), data, parent, args);
                }
                else if (args.target.classList.contains('e-baseline-bar')) {
                    let baseLineTemplateNode;
                    if ((parent.tooltipSettings.baseline)) {
                        baseLineTemplateNode = parent.tooltipModule.templateCompiler(parent.tooltipSettings.baseline, parent, data);
                    }
                    argsData.content = this.toolTipObj.content = baseLineTemplateNode ? baseLineTemplateNode[0] :
                        parent.tooltipModule.getTooltipContent('baseline', data, parent, args);
                }
                else if (args.target.classList.contains('e-event-markers')) {
                    argsData.content = this.toolTipObj.content = parent.tooltipModule.getTooltipContent('marker', data, parent, args);
                }
                else if (args.target.classList.contains('e-connector-line-container')) {
                    let dependencyLineTemplateNode;
                    parent.tooltipModule.predecessorTooltipData = parent.tooltipModule.getPredecessorTooltipData(args);
                    argsData.data = this.predecessorTooltipData;
                    if ((parent.tooltipSettings.connectorLine)) {
                        dependencyLineTemplateNode = parent.tooltipModule.templateCompiler(parent.tooltipSettings.connectorLine, parent, parent.tooltipModule.predecessorTooltipData);
                    }
                    argsData.content = this.toolTipObj.content = dependencyLineTemplateNode ?
                        dependencyLineTemplateNode[0] :
                        parent.tooltipModule.getTooltipContent('connectorLine', data, parent, args);
                }
                else if (args.target.classList.contains('e-indicator-span')) {
                    argsData.content = this.toolTipObj.content =
                        parent.tooltipModule.getTooltipContent('indicator', data, parent, args);
                }
                else if (args.target.classList.contains('e-notes-info')) {
                    let ganttData = this.parent.ganttChartModule.getRecordByTarget(args.event);
                    argsData.content = this.toolTipObj.content = ganttData.ganttProperties.notes;
                    if (isNullOrUndefined(argsData.content)) {
                        args.cancel = true;
                    }
                }
            }
            else {
                args.cancel = true;
            }
        }
        if (args.cancel === false) {
            parent.trigger('beforeTooltipRender', argsData);
            if (args.event.type === 'mouseover') {
                this.currentTarget = args.target;
                EventHandler.add(this.currentTarget, 'mousemove', this.mouseMoveHandler.bind(this));
            }
        }
    }
    tooltipCloseHandler(args) {
        this.tooltipMouseEvent = null;
        EventHandler.remove(this.currentTarget, 'mousemove', this.mouseMoveHandler);
        this.currentTarget = null;
    }
    mouseMoveHandler(e) {
        this.tooltipMouseEvent = e;
    }
    /**
     * Method to update tooltip position
     * @param args
     */
    updateTooltipPosition(args) {
        if (isNullOrUndefined(this.tooltipMouseEvent) || args.target.classList.contains('e-notes-info')) {
            return;
        }
        let postion = this.getPointorPosition(this.tooltipMouseEvent);
        let containerPosition = this.parent.getOffsetRect(this.parent.chartPane);
        let topEnd = containerPosition.top + this.parent.chartPane.offsetHeight;
        let leftEnd = containerPosition.left + this.parent.chartPane.offsetWidth;
        let tooltipPositionX = postion.x;
        let tooltipPositionY = postion.y;
        let tooltipUpdated = false;
        if (leftEnd < (tooltipPositionX + args.element.offsetWidth + 20)) {
            tooltipPositionX = tooltipPositionX - args.element.offsetWidth - 10;
        }
        else {
            tooltipPositionX = tooltipPositionX + 10;
        }
        if (topEnd < (tooltipPositionY + args.element.offsetHeight + 20)) {
            tooltipPositionY = tooltipPositionY - args.element.offsetHeight - 10;
        }
        else {
            tooltipUpdated = true;
            tooltipPositionY = tooltipPositionY + 10;
        }
        if (window.innerHeight < args.element.offsetHeight + tooltipPositionY) {
            tooltipPositionY = tooltipPositionY - args.element.offsetHeight - (tooltipUpdated ? 20 : 10);
        }
        args.element.style.left = tooltipPositionX + 'px';
        args.element.style.top = tooltipPositionY + 'px';
    }
    /**
     * Method to get mouse pointor position
     * @param e
     */
    getPointorPosition(e) {
        let posX;
        let posY;
        if (!isNullOrUndefined(getValue('pageX', e)) || !isNullOrUndefined(getValue('pageY', e))) {
            posX = getValue('pageX', e);
            posY = getValue('pageY', e);
        }
        else if (!isNullOrUndefined(getValue('clientX', e)) || !isNullOrUndefined(getValue('clientY', e))) {
            posX = getValue('clientX', e) + document.body.scrollLeft + document.documentElement.scrollLeft;
            posY = getValue('clientY', e) + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posX, y: posY };
    }
    /**
     *  Getting tooltip content for different elements
     */
    getTooltipContent(elementType, ganttData, parent, args) {
        let content;
        let data;
        if (ganttData) {
            data = ganttData.ganttProperties;
        }
        switch (elementType) {
            case 'milestone':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                    data.taskName + '</td></tr><tr><td class = "e-gantt-tooltip-label"> Date</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.startDate, this.parent.dateFormat) + '</tr></tbody></table>';
                break;
            case 'taskbar':
                let startDate = data.startDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('startDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value"> ' +
                    this.parent.getFormatedDate(data.startDate, this.parent.dateFormat) + '</td></tr>' : '';
                let endDate = data.endDate ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('endDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.endDate, this.parent.dateFormat) + '</td></tr>' : '';
                let duration = !isNullOrUndefined(data.duration) ? '<tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('duration') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value"> ' + this.parent.getDurationString(data.duration, data.durationUnit) +
                    '</td></tr>' : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                    data.taskName + '</td></tr>' + startDate + endDate + duration
                    + '<tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('progress') +
                    '</td><td>:</td><td>' + data.progress + '</td></tr></tbody></table>';
                break;
            case 'baseline':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr class = "e-gantt-tooltip-rowcell"><td colspan="3">' +
                    data.taskName + '</td></tr><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('baselineStartDate') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.baselineStartDate, this.parent.dateFormat) + '</td></tr><tr>' +
                    '<td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('baselineEndDate') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    this.parent.getFormatedDate(data.baselineEndDate, this.parent.dateFormat) + '</td></tr></tbody></table>';
                break;
            case 'marker':
                let markerTooltipElement = parent.tooltipModule.getMarkerTooltipData(args);
                let markerLabel = markerTooltipElement.label ? markerTooltipElement.label : '';
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr><td>' +
                    this.parent.getFormatedDate(this.parent.dateValidationModule.getDateFromFormat(markerTooltipElement.day), this.parent.dateFormat) +
                    '</td></tr><tr><td>' +
                    markerLabel + '</td></tr></tbody></table>';
                break;
            case 'connectorLine':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('from') + '</td><td>:</td>' +
                    '<td class = "e-gantt-tooltip-value">' + parent.tooltipModule.predecessorTooltipData.fromName + ' (' +
                    parent.tooltipModule.predecessorTooltipData.fromId + ')' + '</td></tr><tr><td class = "e-gantt-tooltip-label">' +
                    this.parent.localeObj.getConstant('to') + '</td><td>:</td>' + '<td class = "e-gantt-tooltip-value">' +
                    parent.tooltipModule.predecessorTooltipData.toName +
                    ' (' + parent.tooltipModule.predecessorTooltipData.toId + ')' +
                    '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('taskLink') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value"> ' + parent.tooltipModule.predecessorTooltipData.linkText +
                    '</td></tr><tr><td class = "e-gantt-tooltip-label">' + this.parent.localeObj.getConstant('lag') +
                    '</td><td>:</td><td class = "e-gantt-tooltip-value">' +
                    parent.tooltipModule.predecessorTooltipData.offsetString + '</td></tr></tbody></table>';
                break;
            case 'indicator':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr>' + args.target.title + '</tr></tbody></table>';
                break;
            case 'timeline':
                content = '<table class = "e-gantt-tooltiptable"><tbody><tr>' + args.target.title + '</tr></tbody></table>';
                break;
        }
        return content;
    }
    /**
     * To get the details of an event marker.
     * @private
     */
    getMarkerTooltipData(args) {
        let markerTooltipId = (args.target.id).match(/\d+/g);
        let markerTooltipElement = this.parent.eventMarkers[Number(markerTooltipId)];
        return markerTooltipElement;
    }
    /**
     * To get the details of a connector line.
     * @private
     */
    getPredecessorTooltipData(args) {
        let predeceesorParent = args.target.parentElement.id;
        let taskIds = predeceesorParent.match(/\d+/g);
        let fromTask = this.parent.flatData[this.parent.ids.indexOf(taskIds[0])];
        let toTask = this.parent.flatData[this.parent.ids.indexOf(taskIds[1])];
        let predecessor = fromTask.ganttProperties.predecessor.filter((pdc) => { return pdc.to === taskIds[1]; });
        let predecessorTooltipData = {
            fromId: fromTask.ganttProperties.taskId,
            toId: toTask.ganttProperties.taskId,
            fromName: fromTask.ganttProperties.taskName,
            toName: toTask.ganttProperties.taskName,
            linkType: predecessor[0].type,
            linkText: this.parent.getPredecessorTextValue(predecessor[0].type),
            offset: predecessor[0].offset,
            offsetUnit: predecessor[0].offsetUnit,
            offsetString: this.parent.getDurationString(predecessor[0].offset, fromTask.ganttProperties.durationUnit)
        };
        return predecessorTooltipData;
    }
    /**
     * @private
     * To compile template string.
     */
    templateCompiler(template, parent, data) {
        let tooltipFunction = parent.chartRowsModule.templateCompiler(template);
        let templateNode = tooltipFunction(extend({ index: 0 }, data), parent);
        return templateNode;
    }
    destroy() {
        this.toolTipObj.destroy();
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 *
 * Represents the Gantt chart component.
 * ```html
 * <div id='gantt'></div>
 * <script>
 *  var ganttObject = new Gantt({
 *      taskFields: { id: 'taskId', name: 'taskName', startDate: 'startDate', duration: 'duration' }
 *  });
 *  ganttObject.appendTo('#gantt');
 * </script>
 * ```
 */
let Gantt = class Gantt extends Component {
    constructor(options, element) {
        super(options, element);
        /** @hidden */
        this.previousRecords = {};
        /** @hidden */
        this.editedRecords = [];
        /** @hidden */
        this.isOnEdit = false;
        /** @hidden */
        this.isOnDelete = false;
        /** @hidden */
        this.isConnectorLineUpdate = false;
        /** @hidden */
        this.staticSelectedRowIndex = -1;
        this.needsID = true;
        /**
         * @private
         */
        this.isTreeGridRendered = false;
        /**
         * @private
         */
        this.isGanttChartRendered = false;
    }
    /**
     * To get the module name
     * @private
     */
    getModuleName() {
        return 'gantt';
    }
    /**
     * To perform key interaction in Gantt
     * @private
     */
    onKeyPress(e) {
        switch (e.action) {
            case 'focusGanttChart':
                // console.log("Focus the Gantt Chart");
                break;
            case 'home':
                // console.log("Focus first row");
                break;
            case 'end':
                // console.log("Focus last row");
                break;
            case 'editCell':
                // console.log("edit the focused cell");
                break;
            case 'downArrow':
                // console.log("select next row");
                break;
            case 'upArrow':
                // console.log("select previous row");
                break;
            case 'ctrlDownArrow':
                // console.log("select multiple rows downwards");
                break;
            case 'ctrlUpArrow':
                // console.log("select multiple rows upwards");
                break;
            case 'rightArrow':
                // console.log("expand the record");
                break;
            case 'leftArrow':
                // console.log("collapse the record");
                break;
            case 'totalRowExpand':
                // console.log("expand all the parent");
                break;
            case 'totalRowCollapse':
                // console.log("collapse all the parent");
                break;
            case 'saveRequest':
                // console.log("Save edited cell");
                break;
            case 'cancelRequest':
                if (!isNullOrUndefined(this.editModule) && !isNullOrUndefined(this.editModule.cellEditModule)) {
                    this.editModule.cellEditModule.isCellEdit = false;
                    if (!isNullOrUndefined(this.toolbarModule)) {
                        this.toolbarModule.refreshToolbarItems();
                    }
                }
                break;
            case 'addRow':
                // console.log(" an empty row at the top row if the rows are not selected. If a row is selected," +
                //     "then add an empty row based on the addRowPosition API");
                if (this.editModule && this.editSettings.allowAdding) {
                    e.preventDefault();
                    this.editModule.addRecord();
                }
                break;
            case 'addRowDialog':
                // console.log("add row through dialog");
                if (this.editModule && this.editSettings.allowAdding) {
                    e.preventDefault();
                    this.editModule.dialogModule.openAddDialog();
                }
                break;
            case 'editRowDialog':
                // console.log("add row through dialog");
                if (this.editModule && this.editSettings.allowEditing) {
                    e.preventDefault();
                    this.editModule.dialogModule.openToolbarEditDialog();
                }
                break;
            case 'delete':
                // console.log("delete selected record");
                if (this.selectionModule && this.editModule) {
                    if ((this.selectionSettings.mode === 'Row' && this.selectionModule.selectedRowIndexes.length)
                        || (this.selectionSettings.mode === 'Cell' && this.selectionModule.getSelectedRowCellIndexes().length)) {
                        this.editModule.startDeleteAction();
                    }
                }
                break;
            case 'navigateEditors':
                // console.log("Navigate between navigateEditors");
                break;
            case 'focusTask':
                // console.log("	Focus the selected task");
                break;
        }
    }
    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    preRender() {
        this.initProperties();
    }
    initProperties() {
        this.globalize = new Internationalization(this.locale);
        this.flatData = [];
        this.currentViewData = [];
        this.ids = [];
        this.ganttColumns = [];
        this.localeObj = new L10n(this.getModuleName(), this.getDefaultLocale(), this.locale);
        this.dataOperation = new TaskProcessor(this);
        this.nonWorkingHours = [];
        this.nonWorkingTimeRanges = [];
        this.workingTimeRanges = [];
        this.defaultEndTime = null;
        this.defaultStartTime = null;
        this.durationUnitTexts = {
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            day: 'day',
            hour: 'hour',
            minute: 'minute',
        };
        this.durationUnitEditText = {
            minute: ['m', 'min', 'minute', 'minutes'],
            hour: ['h', 'hr', 'hour', 'hours'],
            day: ['d', 'dy', 'day', 'days']
        };
        this.perDayWidth = null;
        this.isMileStoneEdited = false;
        this.chartVerticalLineContainer = null;
        this.updatedConnectorLineCollection = [];
        this.connectorLineIds = [];
        this.predecessorsCollection = [];
        this.isInPredecessorValidation = this.enablePredecessorValidation;
        this.isValidationEnabled = true;
        this.isLoad = true;
        this.editedTaskBarItem = null;
        this.validationDialogElement = null;
        this.currentEditedArgs = {};
        this.dialogValidateMode = {
            respectLink: false,
            removeLink: false,
            preserveLinkWithEditing: true
        };
        this.secondsPerDay = this.dataOperation.getSecondsPerDay();
        this.nonWorkingDayIndex = [];
        this.dataOperation.getNonWorkingDayIndex();
        this.columnMapping = {};
        this.controlId = this.element.id;
        this.cloneProjectStartDate = null;
        this.cloneProjectEndDate = null;
        this.totalHolidayDates = this.dataOperation.getHolidayDates();
        this.ganttChartModule = new GanttChart(this);
        this.timelineModule = new Timeline(this);
        this.chartRowsModule = new ChartRows(this);
        this.treeGridModule = new GanttTreeGrid(this);
        this.dateValidationModule = new DateProcessor(this);
        this.predecessorModule = new Dependency(this);
        this.connectorLineModule = new ConnectorLine(this);
        this.connectorLineEditModule = new ConnectorLineEdit(this);
        this.splitterModule = new Splitter$1(this);
        this.tooltipModule = new Tooltip$1(this);
        this.keyConfig = {
            focusGanttChart: 'alt+74',
            home: 'home',
            end: 'end',
            editCell: 'f2',
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            totalRowExpand: 'ctrl+rightarrow',
            totalRowCollapse: 'ctrl+leftarrow',
            saveRequest: '13',
            cancelRequest: '27',
            addRow: 'ctrl+187',
            addRowDialog: 'ctrl+shift+65',
            editRowDialog: 'ctrl+shift+69',
            delete: 'delete',
            navigateEditors: 'tab',
            focusTask: 'ctrl+shift+f5',
            indentLevel: 'shift+leftarrow',
            outdentLevel: 'shift+rightarrow',
        };
    }
    /**
     * To validate height and width
     */
    validateDimentionValue(value) {
        if (!isNullOrUndefined(value)) {
            if (typeof (value) === 'string' && value !== 'auto' && value.indexOf('%') === -1) {
                return value.indexOf('px') === -1 ? value + 'px' : value;
            }
            else if (typeof (value) === 'number') {
                return value + 'px';
            }
            else {
                return value.toString();
            }
        }
        else {
            return null;
        }
    }
    /**
     * To calculate dimensions of Gantt control
     */
    calculateDimensions() {
        let settingsHeight = this.validateDimentionValue(this.height);
        let settingsWidth = this.validateDimentionValue(this.width);
        if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
            settingsWidth = this.width;
        }
        let elementStyleHeight = this.element.style.height;
        let elementStyleWidth = this.element.style.width;
        if (settingsWidth) {
            this.element.style.width = settingsWidth;
        }
        if (settingsHeight) {
            this.element.style.height = settingsHeight;
        }
        if (!settingsHeight && !elementStyleHeight) {
            this.element.style.height = 'auto'; // old 450px
        }
        if (!settingsWidth && !elementStyleWidth) {
            this.element.style.width = 'auto';
        }
        this.ganttHeight = this.element.offsetHeight;
        this.ganttWidth = this.element.offsetWidth;
    }
    /**
     * @private
     */
    render() {
        createSpinner({ target: this.element }, this.createElement);
        this.trigger('load', {});
        this.element.classList.add(root);
        this.calculateDimensions();
        if (!isNullOrUndefined(this.toolbarModule)) {
            this.renderToolbar();
        }
        this.splitterModule.renderSplitter();
        this.notify('renderPanels', null);
        this.showSpinner();
        this.dataOperation.checkDataBinding();
    }
    /**
     * To show spinner
     */
    showSpinner() {
        showSpinner(this.element);
    }
    /**
     * To hide spinner
     */
    hideSpinner() {
        hideSpinner(this.element);
    }
    /**
     * @private
     */
    renderGantt() {
        this.timelineModule.processTimelineUnit();
        // predecessor calculation
        if (this.taskFields.dependency) {
            this.predecessorModule.updatePredecessors();
            if (this.isInPredecessorValidation) {
                this.predecessorModule.updatedRecordsDateByPredecessor();
            }
        }
        this.dataOperation.calculateProjectDates();
        this.timelineModule.validateTimelineProp();
        this.dataOperation.updateGanttData();
        this.treeGridPane.classList.remove('e-temp-content');
        remove(this.treeGridPane.querySelector('.e-gantt-temp-header'));
        this.notify('dataReady', {});
        this.renderTreeGrid();
        this.wireEvents();
        if (this.taskFields.dependency && this.isInPredecessorValidation) {
            let dialogElement = createElement('div', {
                id: this.element.id + '_dialogValidationRule',
            });
            this.element.appendChild(dialogElement);
            this.predecessorModule.renderValidationDialog();
        }
        this.splitterModule.updateSplitterPosition();
        if (this.gridLines === 'Vertical' || this.gridLines === 'Both') {
            this.renderChartVerticalLines();
        }
    }
    wireEvents() {
        if (this.allowKeyboard) {
            this.keyboardModule = new KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfig,
                eventName: 'keydown'
            });
        }
    }
    keyActionHandler(e) {
        this.onKeyPress(e);
    }
    /**
     * @private
     */
    renderToolbar() {
        if (!isNullOrUndefined(this.toolbarModule)) {
            this.toolbarModule.renderToolbar();
            this.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * @private
     */
    renderTreeGrid() {
        this.treeGridModule.renderTreeGrid();
    }
    updateCurrentViewData() {
        this.currentViewData = this.treeGrid.getCurrentViewRecords().slice();
    }
    /**
     * @private
     */
    updateContentHeight() {
        let expandedRecords = this.getExpandedRecords(this.currentViewData);
        this.contentHeight = expandedRecords.length * this.rowHeight;
    }
    /**
     * To get expand status.
     * @return {boolean}
     * @private
     */
    getExpandStatus(data) {
        let parentRecord = this.getParentTask(data.parentItem);
        if (!isNullOrUndefined(parentRecord)) {
            if (parentRecord.expanded === false) {
                return false;
            }
            else if (parentRecord.parentItem) {
                let parentData = this.getParentTask(parentRecord.parentItem);
                if (parentData.expanded === false) {
                    return false;
                }
                else {
                    return this.getExpandStatus(this.getParentTask(parentRecord.parentItem));
                }
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    /**
     * Get expanded records from given record collection
     * @param records
     */
    getExpandedRecords(records) {
        let expandedRecords = records.filter((record) => {
            return this.getExpandStatus(record) === true;
        });
        return expandedRecords;
    }
    /**
     *
     * @param date
     * @param format
     */
    getFormatedDate(date, format) {
        if (isNullOrUndefined(date)) {
            return null;
        }
        if (isNullOrUndefined(format)) {
            format = this.dateFormat;
        }
        return this.globalize.formatDate(date, { format: format });
    }
    /**
     * Get duration value as string combined with duration and unit values
     */
    getDurationString(duration, durationUnit) {
        let value = this.dateValidationModule.getDurationString(duration, durationUnit);
        return value;
    }
    /**
     *
     * @param args
     * @private
     */
    treeDataBound(args) {
        this.updateCurrentViewData();
        this.updateContentHeight();
        if (!this.isTreeGridRendered) {
            this.isTreeGridRendered = true;
            this.isLoad = false;
            let toolbarHeight = 0;
            if (!isNullOrUndefined(this.toolbarModule) && !isNullOrUndefined(this.toolbarModule.element)) {
                toolbarHeight = this.toolbarModule.element.offsetHeight;
            }
            if (this.timelineModule.isSingleTier) {
                addClass(this.treeGrid.element.querySelectorAll('.e-headercell'), timelineSingleHeaderOuterDiv);
                addClass(this.treeGrid.element.querySelectorAll('.e-columnheader'), timelineSingleHeaderOuterDiv);
            }
            else {
                removeClass(this.treeGrid.element.querySelectorAll('.e-headercell'), timelineSingleHeaderOuterDiv);
                removeClass(this.treeGrid.element.querySelectorAll('.e-columnheader'), timelineSingleHeaderOuterDiv);
            }
            this.treeGrid.height = this.ganttHeight - toolbarHeight -
                this.treeGrid.grid.getHeaderContent().offsetHeight;
            this.notify('tree-grid-created', {});
            this.createGanttPopUpElement();
            this.hideSpinner();
        }
        if (this.taskFields.dependency) {
            this.connectorLineIds = [];
            this.updatedConnectorLineCollection = [];
            this.predecessorModule.createConnectorLinesCollection(this.currentViewData);
        }
        this.notify('recordsUpdated', {});
        this.trigger('dataBound', args);
    }
    /**
     * Called internally, if any of the property value changed.
     * @param newProp
     * @param oldProp
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowSelection':
                    this.treeGrid.allowSelection = this.allowSelection;
                    this.treeGrid.dataBind();
                    break;
                case 'eventMarkers':
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    break;
                case 'highlightWeekends':
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    break;
                case 'holidays':
                    this.notify('ui-update', { module: 'day-markers', properties: newProp });
                    break;
                case 'sortSettings':
                    this.treeGrid.sortSettings = getActualProperties(this.sortSettings);
                    this.treeGrid.dataBind();
                    break;
                case 'timelineSettings':
                    this.timelineModule.refreshTimeline();
                    break;
                case 'rowHeight':
                case 'taskbarHeight':
                    this.treeGrid.rowHeight = this.rowHeight;
                    this.treeGrid.dataBind();
                    this.chartRowsModule.initiateTemplates();
                    this.timelineModule.updateChartByNewTimeline();
                    if (this.taskFields.dependency) {
                        this.ganttChartModule.reRenderConnectorLines();
                    }
                    break;
                case 'filterSettings':
                    this.treeGrid.filterSettings = getActualProperties(this.filterSettings);
                    this.treeGrid.dataBind();
                    break;
                case 'allowResizing':
                    this.treeGrid.allowResizing = this.allowResizing;
                    this.treeGrid.dataBind();
                    break;
                case 'allowReordering':
                    this.treeGrid.allowReordering = this.allowReordering;
                    this.treeGrid.dataBind();
                    break;
                case 'gridLines':
                    this.treeGrid.gridLines = this.gridLines;
                    this.treeGrid.dataBind();
                    this.renderChartGridLines();
                    break;
                case 'tooltipSettings':
                    if (this.tooltipModule.toolTipObj) {
                        this.tooltipModule.toolTipObj.destroy();
                    }
                    this.tooltipModule.createTooltip();
                    break;
                case 'splitterSettings':
                    this.splitterModule.updateSplitterPosition();
                    break;
                case 'selectionSettings':
                    this.treeGrid.selectionSettings = getActualProperties(this.selectionSettings);
                    this.treeGrid.dataBind();
                    break;
                case 'searchSettings':
                    this.treeGrid.grid.searchSettings = getActualProperties(this.searchSettings);
                    this.treeGrid.grid.dataBind();
                    if (this.toolbarModule) {
                        this.toolbarModule.updateSearchTextBox();
                    }
                    break;
            }
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @private
     */
    getPersistData() {
        let keyEntity = ['allowSelection'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * @private
     */
    destroy() {
        this.notify('destroy', {});
        if (!isNullOrUndefined(this.validationDialogElement) && !this.validationDialogElement.isDestroyed) {
            this.validationDialogElement.destroy();
        }
        let modules = ['ganttChartModule', 'timelineModule', 'chartRowsModule',
            'treeGridModule', 'ganttDataUpdatesModule', 'dateValidationModule', 'tooltipModule'];
        for (let i = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        super.destroy();
        this.chartVerticalLineContainer = null;
        this.element.innerHTML = '';
        removeClass([this.element], root);
        this.element.innerHTML = '';
    }
    /**
     * public method to get taskbarHeight.
     * @return {number}
     * @public
     */
    getTaskbarHeight() {
        return this.chartRowsModule.taskBarHeight;
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        if (this.isDestroyed) {
            return modules;
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this]
            });
        }
        if (this.allowFiltering || (this.toolbar && this.toolbar.indexOf('Search') !== -1)) {
            modules.push({
                member: 'filter',
                args: [this]
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        if (this.toolbar) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowEditing || this.editSettings.allowDeleting
            || this.editSettings.allowTaskbarEditing) {
            modules.push({
                member: 'edit',
                args: [this]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this]
            });
        }
        if (this.tooltipSettings.showTooltip) {
            modules.push({
                member: 'tooltip',
                args: [this]
            });
        }
        if (this.highlightWeekends || (this.holidays && this.holidays.length > 0)
            || (this.eventMarkers && this.eventMarkers.length > 0)) {
            modules.push({
                member: 'dayMarkers',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    sortColumn(columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    }
    /**
     * Clears all the sorted columns of the Gantt.
     * @return {void}
     */
    clearSorting() {
        this.sortModule.clearSorting();
    }
    /**
     * To validate and render chart horizontal and vertical lines in the Gantt
     * @return {void}
     * @hidden
     */
    renderChartGridLines() {
        let className = 'e-chart-row-border';
        let verticalLines = this.chartVerticalLineContainer;
        let chartRowsTD = document.getElementById(this.element.id + 'GanttTaskTableBody').querySelectorAll('td');
        if (this.gridLines === 'Vertical') {
            if (isNullOrUndefined(verticalLines)) {
                this.renderChartVerticalLines();
            }
            else {
                if (verticalLines.style.display === 'none') {
                    verticalLines.style.display = 'block';
                }
            }
            if (chartRowsTD[0].classList.contains(className)) {
                for (let c = 0; c < chartRowsTD.length; c++) {
                    removeClass([chartRowsTD[c]], className);
                }
            }
        }
        else if (this.gridLines === 'Horizontal') {
            if (!isNullOrUndefined(verticalLines)) {
                verticalLines.style.display = 'none';
            }
            if (!chartRowsTD[0].classList.contains(className)) {
                for (let c = 0; c < chartRowsTD.length; c++) {
                    addClass([chartRowsTD[c]], className);
                }
            }
        }
        else if (this.gridLines === 'Both') {
            if (isNullOrUndefined(verticalLines)) {
                this.renderChartVerticalLines();
            }
            else {
                if (verticalLines.style.display === 'none') {
                    verticalLines.style.display = 'block';
                }
            }
            if (!chartRowsTD[0].classList.contains(className)) {
                for (let c = 0; c < chartRowsTD.length; c++) {
                    addClass([chartRowsTD[c]], className);
                }
            }
        }
        else if (this.gridLines === 'None') {
            if (!isNullOrUndefined(verticalLines) && verticalLines.style.display !== 'none') {
                verticalLines.style.display = 'none';
            }
            if (chartRowsTD[0].classList.contains(className)) {
                for (let c = 0; c < chartRowsTD.length; c++) {
                    removeClass([chartRowsTD[c]], className);
                }
            }
        }
    }
    /**
     * To update height of the Grid lines in the Gantt chart side.
     * @return {void}
     * @private
     */
    updateGridLineContainerHeight() {
        if (this.chartVerticalLineContainer) {
            this.chartVerticalLineContainer.style.height = formatUnit(this.contentHeight);
        }
    }
    /**
     * To render vertical lines in the Gantt chart side.
     * @return {void}
     */
    renderChartVerticalLines() {
        if (!this.element.contains(this.chartVerticalLineContainer)) {
            this.chartVerticalLineContainer = createElement('div', {
                id: this.element.id + 'line-container',
                styles: 'position:absolute;height:100%;z-index:1'
            });
            this.element.getElementsByClassName('e-chart-rows-container')[0].appendChild(this.chartVerticalLineContainer);
        }
        this.chartVerticalLineContainer.innerHTML = '';
        let headerTable = this.element.getElementsByClassName('e-timeline-header-table-container')[1];
        if (isNullOrUndefined(headerTable)) {
            headerTable = this.element.getElementsByClassName('e-timeline-header-table-container')[0];
        }
        let thElements = headerTable.getElementsByTagName('th');
        let thLength = thElements.length;
        let thWidth;
        let leftPos = 0;
        let containerDiv = createElement('div');
        for (let n = 0; n < thLength; n++) {
            leftPos = n === 0 ? -1 : (leftPos + parseInt(thWidth, 10));
            thWidth = thElements[n].style.width;
            let divElement = createElement('div', {
                className: 'e-line-container-cell',
                styles: 'left:' + leftPos + 'px'
            });
            containerDiv.appendChild(divElement);
        }
        this.chartVerticalLineContainer.innerHTML = containerDiv.innerHTML;
    }
    /**
     * Remove sorted columns of the Gantt.
     * @return {void}
     */
    getDefaultLocale() {
        let ganttLocale = {
            emptyRecord: 'No records to display',
            id: 'ID',
            name: 'Name',
            startDate: 'Start Date',
            endDate: 'End Date',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Dependency',
            notes: 'Notes',
            baselineStartDate: 'Baseline Start Date',
            baselineEndDate: 'Baseline End Date',
            type: 'Type',
            offset: 'Offset',
            resourceName: 'Resources',
            resourceID: 'Resource ID',
            day: 'day',
            hour: 'hour',
            minute: 'minute',
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            generalTab: 'General',
            customTab: 'Custom Columns',
            writeNotes: 'Write Notes',
            addDialogTitle: 'New Task',
            editDialogTitle: 'Task Information',
            add: 'Add',
            edit: 'Edit',
            update: 'Update',
            delete: 'Delete',
            cancel: 'Cancel',
            search: 'Search',
            task: ' task',
            tasks: ' tasks',
            expandAll: 'Expand all',
            collapseAll: 'Collapse all',
            nextTimeSpan: 'Next timespan',
            prevTimeSpan: 'Previous timespan',
            saveButton: 'Save',
            taskBeforePredecessor_FS: 'You moved "{0}" to start before "{1}" finishes and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_FS: 'You moved "{0}" away from "{1}" and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessor_SS: 'You moved "{0}" to start before "{1}" starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_SS: 'You moved "{0}" to start after "{1}" starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessor_FF: 'You moved "{0}" to finish before "{1}" finishes and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_FF: 'You moved "{0}" to finish after "{1}" finishes and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskBeforePredecessor_SF: 'You moved "{0}" away from "{1}" to starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            taskAfterPredecessor_SF: 'You moved "{0}" to finish after "{1}" starts and the two tasks are linked.'
                + 'As the result, the links cannot be honored. Select one action below to perform',
            okText: 'Ok',
            confirmDelete: 'Are you sure you want to Delete Record?',
            from: 'From',
            to: 'To',
            taskLink: 'Task Link',
            lag: 'Lag',
            start: 'Start',
            finish: 'Finish',
            enterValue: 'Enter the value'
        };
        return ganttLocale;
    }
    /**
     * To clear sorted records with specific to particular column
     * @param columnName
     */
    removeSortColumn(columnName) {
        this.sortModule.removeSortColumn(columnName);
    }
    /**
     *
     * @param args
     * @private
     */
    actionBeginTask(args) {
        this.trigger('actionBegin', args);
    }
    /**
     * To move horizontal scroll bar of Gantt to specific date
     */
    scrollToDate(date) {
        let tempDate = this.dateValidationModule.getDateFromFormat(date);
        let left = this.dataOperation.getTaskLeft(tempDate, false);
        this.ganttChartModule.updateScrollLeft(left);
    }
    /**
     * To move horizontal scroll bar of Gantt to specific date
     */
    scrollToTask(taskId) {
        if (this.ids.indexOf(taskId) !== -1) {
            let left = this.flatData[this.ids.indexOf(taskId)].ganttProperties.left;
            this.ganttChartModule.updateScrollLeft(left);
        }
    }
    /**
     * To set scroll left and top in chart side
     * @param left
     * @param top
     */
    updateChartScrollOffset(left, top) {
        if (!isNullOrUndefined(left)) {
            left = this.ganttChartModule.scrollElement.scrollWidth <= left ?
                this.ganttChartModule.scrollElement.scrollWidth : left;
            this.ganttChartModule.scrollObject.setScrollLeft(left);
        }
        if (!isNullOrUndefined(top)) {
            top = this.ganttChartModule.scrollElement.scrollHeight <= top ? this.ganttChartModule.scrollElement.scrollHeight : top;
            this.ganttChartModule.scrollObject.setScrollTop(top);
        }
    }
    /**
     * Get parent task by clone parent item
     * @param cloneParent
     */
    getParentTask(cloneParent) {
        if (!isNullOrUndefined(cloneParent)) {
            let parent = this.flatData.filter((val) => {
                return cloneParent.uniqueID === val.uniqueID;
            });
            if (parent.length > 0) {
                return parent[0];
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    /**
     * Filters TreeGrid row by column name with the given options.
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match.if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent) {
        this.treeGrid.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent);
    }
    /**
     * Clears all the filtered columns in Gantt.
     * @return {void}
     */
    clearFiltering() {
        this.treeGrid.clearFiltering();
    }
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @return {void}
     * @hidden
     */
    removeFilteredColsByField(field) {
        this.treeGrid.removeFilteredColsByField(field, false);
    }
    /**
     * Method to set holidays and non working days in date time and date picker controls
     * @return {void}
     * @private
     */
    renderWorkingDayCell(args) {
        let nonWorkingDays = this.nonWorkingDayIndex;
        let holidays = this.totalHolidayDates;
        if (nonWorkingDays.length > 0 && nonWorkingDays.indexOf(args.date.getDay()) !== -1) {
            args.isDisabled = true;
        }
        else if (holidays.length > 0) {
            let tempDate = new Date(args.date.getTime());
            tempDate.setHours(0, 0, 0);
            if (holidays.indexOf(tempDate.getTime()) !== -1) {
                args.isDisabled = true;
            }
        }
    }
    /**
     * To update timeline at start point with one unit.
     * @return {void}
     * @public
     */
    previousTimeSpan(mode) {
        this.timelineModule.performTimeSpanAction('prevTimeSpan', 'publicMethod', new Date(this.timelineModule.timelineStartDate.getTime()), new Date(this.timelineModule.timelineEndDate.getTime()), mode);
    }
    /**
     * To update timeline at end point with one unit.
     * @return {void}
     * @public
     */
    nextTimeSpan(mode) {
        this.timelineModule.performTimeSpanAction('nextTimeSpan', 'publicMethod', new Date(this.timelineModule.timelineStartDate.getTime()), new Date(this.timelineModule.timelineEndDate.getTime()), mode);
    }
    /**
     * To validate project start date and end date.
     * @return {void}
     * @public
     */
    updateProjectDates(startDate, endDate, isTimelineRoundOff) {
        this.timelineModule.totalTimelineWidth = 0;
        this.cloneProjectStartDate = startDate;
        this.cloneProjectEndDate = endDate;
        this.isTimelineRoundOff = isTimelineRoundOff;
        this.timelineModule.refreshTimelineByTimeSpan();
        this.dataOperation.reUpdateGanttDataPosition();
        this.timelineModule.updateChartByNewTimeline();
        this.ganttChartModule.chartBodyContent.style.width = formatUnit(this.timelineModule.totalTimelineWidth);
        this.ganttChartModule.updateLastRowBottomWidth();
        if (this.gridLines === 'Vertical' || this.gridLines === 'Both') {
            this.renderChartVerticalLines();
        }
        if (this.taskFields.dependency) {
            this.ganttChartModule.reRenderConnectorLines();
        }
        this.notify('selectRowByIndex', {});
    }
    /**
     * Changes the TreeGrid column positions by field names.
     * @return {void}
     * @public
     */
    reorderColumns(fromFName, toFName) {
        this.treeGrid.reorderColumns(fromFName, toFName);
    }
    /**
     * Method to clear edited collections in gantt set edit flag value
     * @private
     */
    initiateEditAction(isStart) {
        this.isOnEdit = isStart;
        this.previousRecords = {};
        this.editedRecords = [];
    }
    /**
     *
     * @param field Method to update value in Gantt record and make clone record for this
     * @param record
     * @private
     */
    /* tslint:disable-next-line */
    setRecordValue(field, value, record, isTaskData) {
        if (this.isOnEdit || this.isOnDelete) {
            this.makeCloneData(field, record, isTaskData);
            let id = isTaskData ? record.taskId : record.ganttProperties.taskId;
            let task = this.getRecordByID(id);
            if (task && this.editedRecords.indexOf(task) === -1) {
                this.editedRecords.push(task);
            }
        }
        value = isUndefined(value) ? null : value;
        setValue(field, value, record);
    }
    makeCloneData(field, record, isTaskData) {
        let cloneData;
        /* tslint:disable-next-line */
        let value = getValue(field, record);
        /* tslint:disable-next-line */
        let prevValue;
        /* tslint:disable-next-line */
        let clonedValue;
        if (isTaskData) {
            field = 'ganttProperties.' + field;
        }
        if (isNullOrUndefined(this.previousRecords[record.uniqueID])) {
            let tempData = {};
            this.previousRecords[record.uniqueID] = tempData;
        }
        cloneData = this.previousRecords[record.uniqueID];
        prevValue = getValue(field, cloneData);
        if (isUndefined(prevValue)) {
            if (value instanceof Date) {
                clonedValue = new Date(value.getTime());
            }
            else if (isObjectArray(value)) {
                clonedValue = extend([], value, [], true);
            }
            else if (isObject(value)) {
                clonedValue = extend({}, {}, value, true);
            }
            else {
                clonedValue = value;
            }
            if (!isUndefined(clonedValue)) {
                setValue(field, clonedValue, cloneData);
            }
            else {
                setValue(field, null, cloneData);
            }
        }
    }
    closeGanttActions() {
        if (this.editModule) {
            if (this.editModule.cellEditModule && this.editModule.cellEditModule.isCellEdit) {
                this.treeGrid.closeEdit();
                this.editModule.cellEditModule.isCellEdit = false;
                if (!isNullOrUndefined(this.toolbarModule)) {
                    this.toolbarModule.refreshToolbarItems();
                }
            }
            else if (this.editModule.dialogModule && this.editModule.dialogModule.dialogObj &&
                this.editModule.dialogModule.dialogObj.visible) {
                this.editModule.dialogModule.dialogObj.hide();
                this.editModule.dialogModule.dialogClose();
            }
        }
    }
    /**
     * Method to get task by uniqueId value
     * @param id
     */
    getTaskByUniqueID(id) {
        let value = this.flatData.filter((val) => {
            return val.uniqueID === id;
        });
        if (value.length > 0) {
            return value[0];
        }
        else {
            return null;
        }
    }
    /**
     * Method to get task by id value
     * @param id
     */
    getRecordByID(id) {
        if (isNullOrUndefined(id)) {
            return null;
        }
        return this.flatData[this.ids.indexOf(id.toString())];
    }
    /**
     * Method to set splitter position
     * @param {string|number} value - value of the property.
     * @param {string} type - property of SplitterSettings.
     */
    setSplitterPosition(value, type) {
        let tempSplitterSettings = {};
        tempSplitterSettings[type] = value;
        let splitterPosition = this.splitterModule.calculateSplitterPosition(tempSplitterSettings, true);
        let pane1 = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[0];
        let pane2 = this.splitterModule.splitterObject.element.querySelectorAll('.e-pane')[1];
        this.splitterModule.splitterPreviousPositionGrid = pane1.scrollWidth + 1 + 'px';
        this.splitterModule.splitterPreviousPositionChart = pane2.scrollWidth + 1 + 'px';
        this.splitterModule.splitterObject.paneSettings[0].size = splitterPosition;
        this.splitterModule.triggerCustomResizedEvent();
    }
    /**
     * Expand the record by index value.
     * @return {void}
     * @public
     */
    expandByIndex(index) {
        let args = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Expand the record by task id.
     * @return {void}
     * @public
     */
    expandByID(id) {
        let args = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.expandGanttRow(args);
    }
    /**
     * Collapse the record by index value.
     * @return {void}
     * @public
     */
    collapseByIndex(index) {
        let args = this.contructExpandCollapseArgs(null, index);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.collapseGanttRow(args);
    }
    /**
     * Collapse the record by ud value.
     * @return {void}
     * @public
     */
    collapseByID(id) {
        let args = this.contructExpandCollapseArgs(id);
        this.ganttChartModule.isExpandCollapseFromChart = true;
        this.ganttChartModule.collapseGanttRow(args);
    }
    /**
     * Add record public method.
     * @return {void}
     * @public
     */
    addRecord(data, rowPosition, rowIndex) {
        if (this.editModule && this.editSettings.allowAdding) {
            this.editModule.addRecord(data, rowPosition, rowIndex);
        }
    }
    /**
     * Method to update record by ID.
     * @param  {object} data - Defines the data to modify.
     * @return {void}
     * @public
     */
    updateRecordByID(data) {
        if (this.editModule && this.editSettings.allowEditing) {
            this.editModule.updateRecordByID(data);
        }
    }
    /**
     * Method to update record by Index.
     * @param  {number} index - Defines the index of data to modify.
     * @param  {object} data - Defines the data to modify.
     * @return {void}
     * @public
     */
    updateRecordByIndex(index, data) {
        if (this.editModule && this.editSettings.allowEditing) {
            let record;
            let tasks = this.taskFields;
            record = this.currentViewData.length > 0 ?
                !isNullOrUndefined(this.currentViewData[index]) ? this.currentViewData[index] : null : null;
            if (!isNullOrUndefined(record)) {
                data[tasks.id] = record[tasks.id];
                this.editModule.updateRecordByID(data);
            }
        }
    }
    /**
     * To add dependency for Task
     * @param  {String|number} id - Defines the ID of data to modify.
     * @param  {string} predecessorString - Defines the predecessor string to add.
     * @return {void}
     * @public
     */
    addPredecessor(id, predecessorString) {
        let ganttRecord = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord)) {
            this.connectorLineEditModule.addPredecessor(ganttRecord, predecessorString);
        }
    }
    /**
     * To remove dependency from task
     * @param  {String|number} id - Defines the ID of data to modify.
     * @return {void}
     * @public
     */
    removePredecessor(id) {
        let ganttRecord = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord)) {
            this.connectorLineEditModule.removePredecessor(ganttRecord);
        }
    }
    /**
     * To modify current dependency values of Task
     * @param  {String|number} id - Defines the ID of data to modify.
     * @param  {string} predecessorString - Defines the predecessor string to update.
     * @return {void}
     * @public
     */
    updatePredecessor(id, predecessorString) {
        let ganttRecord = this.getRecordByID(id.toString());
        if (this.editModule && !isNullOrUndefined(ganttRecord)) {
            this.connectorLineEditModule.updatePredecessor(ganttRecord, predecessorString);
        }
    }
    /**
     * Public method to open Add dialog.
     * @return {void}
     * @public
     */
    openAddDialog() {
        if (this.editModule && this.editModule.dialogModule && this.editSettings.allowAdding) {
            this.editModule.dialogModule.openAddDialog();
        }
    }
    /**
     * Public method to open Edit dialog.
     * @return {void}
     * @public
     */
    openEditDialog(taskId) {
        if (this.editModule && this.editModule.dialogModule && this.editSettings.allowEditing) {
            this.editModule.dialogModule.openEditDialog(taskId);
        }
    }
    /**
     * Changes the TreeGrid column positions by field names.
     * @return {void}
     * @private
     */
    contructExpandCollapseArgs(id, index) {
        let chartRow$$1;
        let record;
        let rowIndex;
        if (isNullOrUndefined(index)) {
            record = this.getRecordByID(id.toString());
            chartRow$$1 = this.getRowByID(id);
            rowIndex = getValue('rowIndex', chartRow$$1);
        }
        else if (!isNullOrUndefined(index)) {
            chartRow$$1 = this.getRowByIndex(index);
            rowIndex = getValue('rowIndex', chartRow$$1);
            record = this.currentViewData[rowIndex];
        }
        let gridRow = this.treeGrid.getRows()[rowIndex];
        let args;
        return args = { data: record, gridRow: gridRow, chartRow: chartRow$$1, cancel: false };
    }
    /**
     * Method to get chart row value by index.
     * @return {HTMLElement}
     */
    getRowByIndex(index) {
        try {
            let gridRows = this.element.querySelectorAll('.e-chart-row');
            if (!isNullOrUndefined(index)) {
                return gridRows[index];
            }
            else {
                return null;
            }
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Method to get the row element by task id.
     * @return {HTMLElement}
     */
    getRowByID(id) {
        let record = this.getRecordByID(id.toString());
        let index = this.currentViewData.indexOf(record);
        if (index !== -1) {
            return this.getRowByIndex(index);
        }
        else {
            return null;
        }
    }
    /**
     * Method to get class name for unscheduled tasks
     * @param ganttProp
     * @private
     */
    getUnscheduledTaskClass(ganttProp) {
        if (isNullOrUndefined(ganttProp.startDate) && isNullOrUndefined(ganttProp.endDate) &&
            isNullOrUndefined(ganttProp.duration)) {
            return ' ' + traceUnscheduledTask;
        }
        else if (isNullOrUndefined(ganttProp.startDate) || isNullOrUndefined(ganttProp.endDate) ||
            isNullOrUndefined(ganttProp.duration)) {
            return ' ' + traceUnscheduledTask;
        }
        else {
            return '';
        }
    }
    createGanttPopUpElement() {
        let popup = this.createElement('div', { className: 'e-ganttpopup', styles: 'display:none;' });
        let content = this.createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        append([content, this.createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(this.createElement('span'));
        append([content, this.createElement('div', { className: 'e-downtail e-tail' })], popup);
        document.getElementById(this.element.id + 'GanttChart').appendChild(popup);
    }
    /**
     * Method to get predecessor value as string.
     * @return {HTMLElement}
     * @private
     */
    getPredecessorTextValue(type) {
        let textValue;
        switch (type) {
            case 'SS':
                textValue = this.localeObj.getConstant('start') + '-' + this.localeObj.getConstant('start');
                break;
            case 'FF':
                textValue = this.localeObj.getConstant('finish') + '-' + this.localeObj.getConstant('finish');
                break;
            case 'SF':
                textValue = this.localeObj.getConstant('start') + '-' + this.localeObj.getConstant('finish');
                break;
            case 'FS':
                textValue = this.localeObj.getConstant('finish') + '-' + this.localeObj.getConstant('start');
                break;
        }
        return textValue;
    }
    /**
     * Method to perform search action in Gantt
     * @param keyVal  - Search key string
     */
    search(keyVal) {
        this.searchSettings.key = keyVal;
        this.dataBind();
    }
    /**
     * Method to get offset rect value
     * @param element
     * @hidden
     */
    getOffsetRect(element) {
        let box = element.getBoundingClientRect();
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop
            || document.body.scrollTop;
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft ||
            document.body.scrollLeft;
        let clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
        let clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }
    /**
     * Public method to expand all the rows of Gantt
     * @return {void}
     * @public
     */
    expandAll() {
        this.ganttChartModule.expandCollapseAll('expand');
    }
    /**
     * Public method to collapse all the rows of Gantt
     * @return {void}
     * @public
     */
    collapseAll() {
        this.ganttChartModule.expandCollapseAll('collapse');
    }
    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     * @public
     */
    getGridColumns() {
        return this.treeGrid.getColumns();
    }
    /**
     * Gets the Gantt columns.
     * @return {ColumnModel[]}
     * @public
     */
    getGanttColumns() {
        return this.ganttColumns;
    }
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     * @public
     */
    ShowColumn(keys, showBy) {
        this.treeGrid.showColumns(keys, showBy);
    }
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     * @public
     */
    hideColumn(keys, hideBy) {
        this.treeGrid.hideColumns(keys, hideBy);
    }
    /**
     * To set scroll top for chart scroll container
     * @param scrollTop - To set scroll top for scroll container
     * @return {void}
     * @public
     */
    setScrollTop(scrollTop) {
        this.ganttChartModule.scrollObject.setScrollTop(scrollTop);
    }
    /**
     * Cancels edited state.
     * @return {void}
     * @public
     */
    cancelEdit(scrollTop) {
        this.closeGanttActions();
    }
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectCells(cellIndex, isToggle) {
        if (this.selectionModule) {
            this.selectionModule.selectCell(cellIndex, isToggle);
        }
    }
};
__decorate([
    Property(true)
], Gantt.prototype, "allowKeyboard", void 0);
__decorate([
    Property(true)
], Gantt.prototype, "autoFocusTasks", void 0);
__decorate([
    Property(true)
], Gantt.prototype, "allowSelection", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "allowSorting", void 0);
__decorate([
    Property(true)
], Gantt.prototype, "enablePredecessorValidation", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "showColumnMenu", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "collapseAllParentTasks", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "highlightWeekends", void 0);
__decorate([
    Property(0)
], Gantt.prototype, "treeColumnIndex", void 0);
__decorate([
    Property([])
], Gantt.prototype, "dataSource", void 0);
__decorate([
    Property('day')
], Gantt.prototype, "durationUnit", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "query", void 0);
__decorate([
    Property('MM/dd/yyyy')
], Gantt.prototype, "dateFormat", void 0);
__decorate([
    Property('auto')
], Gantt.prototype, "height", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "renderBaseline", void 0);
__decorate([
    Property('Horizontal')
], Gantt.prototype, "gridLines", void 0);
__decorate([
    Complex({}, LabelSettings)
], Gantt.prototype, "labelSettings", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "taskbarTemplate", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "parentTaskbarTemplate", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "milestoneTemplate", void 0);
__decorate([
    Property()
], Gantt.prototype, "baselineColor", void 0);
__decorate([
    Property('auto')
], Gantt.prototype, "width", void 0);
__decorate([
    Property()
], Gantt.prototype, "toolbar", void 0);
__decorate([
    Property(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
], Gantt.prototype, "workWeek", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "includeWeekend", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "allowUnscheduledTasks", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "showInlineNotes", void 0);
__decorate([
    Property(36)
], Gantt.prototype, "rowHeight", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "taskbarHeight", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "projectStartDate", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "projectEndDate", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "resourceIDMapping", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "resourceNameMapping", void 0);
__decorate([
    Property([])
], Gantt.prototype, "resources", void 0);
__decorate([
    Property(null)
], Gantt.prototype, "connectorLineBackground", void 0);
__decorate([
    Property(1)
], Gantt.prototype, "connectorLineWidth", void 0);
__decorate([
    Property([])
], Gantt.prototype, "columns", void 0);
__decorate([
    Property([])
], Gantt.prototype, "addDialogFields", void 0);
__decorate([
    Property([])
], Gantt.prototype, "editDialogFields", void 0);
__decorate([
    Property(-1)
], Gantt.prototype, "selectedRowIndex", void 0);
__decorate([
    Collection([{ from: 8, to: 12 }, { from: 13, to: 17 }], DayWorkingTime)
], Gantt.prototype, "dayWorkingTime", void 0);
__decorate([
    Collection([], Holiday)
], Gantt.prototype, "holidays", void 0);
__decorate([
    Collection([], EventMarker)
], Gantt.prototype, "eventMarkers", void 0);
__decorate([
    Complex({}, TaskFields)
], Gantt.prototype, "taskFields", void 0);
__decorate([
    Complex({}, TimelineSettings)
], Gantt.prototype, "timelineSettings", void 0);
__decorate([
    Complex({}, SortSettings)
], Gantt.prototype, "sortSettings", void 0);
__decorate([
    Complex({}, EditSettings)
], Gantt.prototype, "editSettings", void 0);
__decorate([
    Complex({}, TooltipSettings)
], Gantt.prototype, "tooltipSettings", void 0);
__decorate([
    Complex({}, SelectionSettings)
], Gantt.prototype, "selectionSettings", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "allowFiltering", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "allowReordering", void 0);
__decorate([
    Property(false)
], Gantt.prototype, "allowResizing", void 0);
__decorate([
    Complex({}, FilterSettings)
], Gantt.prototype, "filterSettings", void 0);
__decorate([
    Complex({}, SearchSettings)
], Gantt.prototype, "searchSettings", void 0);
__decorate([
    Complex({}, SplitterSettings)
], Gantt.prototype, "splitterSettings", void 0);
__decorate([
    Event()
], Gantt.prototype, "queryTaskbarInfo", void 0);
__decorate([
    Event()
], Gantt.prototype, "collapsing", void 0);
__decorate([
    Event()
], Gantt.prototype, "collapsed", void 0);
__decorate([
    Event()
], Gantt.prototype, "expanding", void 0);
__decorate([
    Event()
], Gantt.prototype, "expanded", void 0);
__decorate([
    Event()
], Gantt.prototype, "actionBegin", void 0);
__decorate([
    Event()
], Gantt.prototype, "actionComplete", void 0);
__decorate([
    Event()
], Gantt.prototype, "actionFailure", void 0);
__decorate([
    Event()
], Gantt.prototype, "taskbarEdited", void 0);
__decorate([
    Event()
], Gantt.prototype, "endEdit", void 0);
__decorate([
    Event()
], Gantt.prototype, "cellEdit", void 0);
__decorate([
    Event()
], Gantt.prototype, "load", void 0);
__decorate([
    Event()
], Gantt.prototype, "taskbarEditing", void 0);
__decorate([
    Event()
], Gantt.prototype, "dataBound", void 0);
__decorate([
    Event()
], Gantt.prototype, "resizeStart", void 0);
__decorate([
    Event()
], Gantt.prototype, "resizing", void 0);
__decorate([
    Event()
], Gantt.prototype, "resizeStop", void 0);
__decorate([
    Event()
], Gantt.prototype, "splitterResizeStart", void 0);
__decorate([
    Event()
], Gantt.prototype, "splitterResizing", void 0);
__decorate([
    Event()
], Gantt.prototype, "splitterResized", void 0);
__decorate([
    Event()
], Gantt.prototype, "columnDragStart", void 0);
__decorate([
    Event()
], Gantt.prototype, "columnDrag", void 0);
__decorate([
    Event()
], Gantt.prototype, "columnDrop", void 0);
__decorate([
    Event()
], Gantt.prototype, "beforeTooltipRender", void 0);
__decorate([
    Event()
], Gantt.prototype, "rowSelecting", void 0);
__decorate([
    Event()
], Gantt.prototype, "rowSelected", void 0);
__decorate([
    Event()
], Gantt.prototype, "rowDeselecting", void 0);
__decorate([
    Event()
], Gantt.prototype, "rowDeselected", void 0);
__decorate([
    Event()
], Gantt.prototype, "cellSelecting", void 0);
__decorate([
    Event()
], Gantt.prototype, "cellSelected", void 0);
__decorate([
    Event()
], Gantt.prototype, "cellDeselecting", void 0);
__decorate([
    Event()
], Gantt.prototype, "cellDeselected", void 0);
__decorate([
    Event()
], Gantt.prototype, "queryCellInfo", void 0);
__decorate([
    Event()
], Gantt.prototype, "headerCellInfo", void 0);
__decorate([
    Event()
], Gantt.prototype, "rowDataBound", void 0);
__decorate([
    Event()
], Gantt.prototype, "columnMenuOpen", void 0);
__decorate([
    Event()
], Gantt.prototype, "toolbarClick", void 0);
__decorate([
    Event()
], Gantt.prototype, "columnMenuClick", void 0);
Gantt = __decorate([
    NotifyPropertyChanges
], Gantt);

/**
 *  This file was to define all public and internal events
 */
/** @hidden */
const load = 'load';
/** @hidden */
const rowDataBound = 'rowDataBound';
/** @hidden */
const queryCellInfo = 'queryCellInfo';
/** @hidden */
const toolbarClick = 'toolbarClick';
/** @hidden */
const keyPressed = 'key-pressed';

/**
 * Gantt base related properties
 */

/**
 * To handle cell edit action on default columns and custom columns
 */
class CellEdit {
    constructor(ganttObj) {
        /**
         * @private
         */
        this.isCellEdit = false;
        this.parent = ganttObj;
        this.bindTreeGridProperties();
    }
    /**
     * Bind all editing related properties from Gantt to TreeGrid
     */
    bindTreeGridProperties() {
        this.parent.treeGrid.editSettings.allowEditing = this.parent.editSettings.allowEditing;
        this.parent.treeGrid.editSettings.mode = 'Cell';
        this.parent.treeGrid.cellEdit = this.ensureEditCell.bind(this);
        if (this.parent.editSettings.allowEditing) {
            TreeGrid.Inject(Edit$1);
        }
    }
    /**
     * Ensure current cell was editable or not
     * @param args
     */
    ensureEditCell(args) {
        let data = args.rowData;
        let field = args.columnName;
        let taskSettings = this.parent.taskFields;
        if (data.hasChildRecords && (field === taskSettings.endDate || field === taskSettings.duration
            || field === taskSettings.dependency || field === taskSettings.progress)) {
            args.cancel = true;
        }
        if (!args.cancel) {
            this.isCellEdit = true;
            this.parent.trigger('cellEdit', args);
            if (!isNullOrUndefined(this.parent.toolbarModule) && !args.cancel) {
                this.parent.toolbarModule.refreshToolbarItems();
            }
        }
        this.openNotesEditor(args);
    }
    /**
     * To render edit dialog and to focus on notes tab
     * @param args
     */
    openNotesEditor(args) {
        let taskSettings = this.parent.taskFields;
        let data = args.rowData;
        let field = args.columnName;
        if ((field === taskSettings.notes && !this.parent.showInlineNotes)) {
            args.cancel = true;
            let columnTypes = this.parent.editModule.dialogModule.updatedEditFields.map((x) => { return x.type; });
            let index = columnTypes.indexOf('Notes');
            if (index !== -1) {
                this.parent.editModule.dialogModule.openEditDialog(data.ganttProperties.taskId);
                let tabObj = document.getElementById(this.parent.element.id + '_Tab').ej2_instances[0];
                tabObj.selectedItem = index;
            }
        }
    }
    isValueChange(args, field) {
        let data = getValue('data', args);
        let editedValue = data[field];
        let previousValue = getValue('previousData', args);
        if ((isNullOrUndefined(editedValue) && !isNullOrUndefined(previousValue)) || (!isNullOrUndefined(editedValue) && isNullOrUndefined(previousValue))) {
            return true;
        }
        else if (!isNullOrUndefined(editedValue) && !isNullOrUndefined(previousValue)) {
            if (editedValue instanceof Date) {
                return editedValue.getTime() !== data.taskData[field].getTime() ? true : false;
            }
            else if (field === this.parent.taskFields.resourceInfo) {
                return editedValue !== previousValue ? true : false;
            }
            else if (editedValue !== data.taskData[field]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Initiate cell save action on Gantt with arguments from TreeGrid
     * @param args
     * @param editedObj
     * @private
     */
    initiateCellEdit(args, editedObj) {
        let column = getValue('column', args);
        let data = getValue('data', args);
        let editedArgs = {};
        editedArgs.action = 'CellEditing';
        editedArgs.data = this.parent.getTaskByUniqueID(data.uniqueID);
        let editedValue = data[column.field];
        let previousValue = getValue('previousData', args);
        if (this.isValueChange(args, column.field)) {
            data[column.field] = previousValue;
            editedArgs.data[column.field] = previousValue;
            this.parent.initiateEditAction(true);
            this.parent.setRecordValue(column.field, editedValue, editedArgs.data);
            if (column.field === this.parent.taskFields.name) {
                this.taskNameEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.startDate) {
                this.startDateEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.endDate) {
                this.endDateEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.duration) {
                this.durationEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.resourceInfo) {
                this.resourceEdited(editedArgs, editedObj);
            }
            else if (column.field === this.parent.taskFields.progress) {
                this.progressEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.baselineStartDate
                || column.field === this.parent.taskFields.baselineEndDate) {
                this.baselineEdited(editedArgs);
            }
            else if (column.field === this.parent.taskFields.dependency) {
                this.dependencyEdited(editedArgs, previousValue);
            }
            else if (column.field === this.parent.taskFields.notes) {
                this.notedEdited(editedArgs);
            }
            else {
                this.parent.setRecordValue('taskData.' + column.field, data[this.parent.taskFields.name], data);
            }
        }
        else {
            this.parent.editModule.endEditAction(args);
        }
        this.isCellEdit = false;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * To update task name cell with new value
     * @param args
     */
    taskNameEdited(args) {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.name, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('taskName', args.data[this.parent.taskFields.name], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    }
    /**
     * To update task notes cell with new value
     * @param args
     */
    notedEdited(args) {
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.notes, args.data[this.parent.taskFields.name], args.data);
        this.parent.setRecordValue('notes', args.data[this.parent.taskFields.notes], args.data.ganttProperties, true);
        this.updateEditedRecord(args);
    }
    /**
     * To update task start date cell with new value
     * @param args
     */
    startDateEdited(args) {
        let ganttData = args.data;
        let ganttProb = args.data.ganttProperties;
        let currentValue = args.data[this.parent.taskFields.startDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        currentValue = this.parent.dateValidationModule.checkStartDate(currentValue);
        if (isNullOrUndefined(currentValue)) {
            this.parent.setRecordValue('startDate', null, ganttProb, true);
            this.parent.setRecordValue('duration', null, ganttProb, true);
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
        }
        else if (ganttProb.endDate || !isNullOrUndefined(ganttProb.duration)) {
            this.parent.setRecordValue('startDate', new Date(currentValue.getTime()), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(ganttData);
        }
        else if (isNullOrUndefined(ganttProb.endDate) && isNullOrUndefined(ganttProb.duration)) {
            this.parent.setRecordValue('startDate', new Date(currentValue.getTime()), ganttProb, true);
        }
        this.parent.setRecordValue('isMilestone', ganttProb.duration === 0 ? true : false, ganttProb, true);
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(ganttData, 'startDate');
        this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
        this.parent.dataOperation.updateMappingData(ganttData, 'duration');
        this.updateEditedRecord(args);
    }
    /**
     * To update task end date cell with new value
     * @param args
     */
    endDateEdited(args) {
        let ganttProb = args.data.ganttProperties;
        let currentValue = args.data[this.parent.taskFields.endDate];
        currentValue = currentValue ? new Date(currentValue.getTime()) : null;
        if (isNullOrUndefined(currentValue)) {
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            this.parent.setRecordValue('duration', null, ganttProb, true);
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
        }
        else {
            if ((currentValue.getHours() === 0 && this.parent.defaultEndTime !== 86400)) {
                this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, currentValue);
            }
            currentValue = this.parent.dateValidationModule.checkEndDate(currentValue, ganttProb);
            this.parent.setRecordValue('endDate', currentValue, ganttProb, true);
            if (!isNullOrUndefined(ganttProb.startDate) && isNullOrUndefined(ganttProb.duration)) {
                if (this.parent.dateValidationModule.compareDates(ganttProb.endDate, ganttProb.startDate) === -1) {
                    this.parent.setRecordValue('endDate', new Date(ganttProb.startDate.getTime()), ganttProb, true);
                    this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, ganttProb.endDate);
                }
            }
            else if (!isNullOrUndefined(ganttProb.duration) && isNullOrUndefined(ganttProb.startDate)) {
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.getStartDate(ganttProb.endDate, ganttProb.duration, ganttProb.durationUnit, ganttProb), ganttProb, true);
            }
            if (this.compareDatesFromRecord(ganttProb) === -1) {
                this.parent.dateValidationModule.calculateDuration(args.data);
            }
            else {
                this.parent.editModule.revertCellEdit(args);
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            if (ganttProb.isMilestone) {
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.checkStartDate(ganttProb.startDate, ganttProb), ganttProb, true);
            }
            this.parent.dataOperation.updateWidthLeft(args.data);
        }
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
        this.updateEditedRecord(args);
    }
    /**
     * To update duration cell with new value
     * @param args
     */
    durationEdited(args) {
        let ganttProb = args.data.ganttProperties;
        let endDate = this.parent.dateValidationModule.getDateFromFormat(ganttProb.endDate);
        let startDate = this.parent.dateValidationModule.getDateFromFormat(ganttProb.startDate);
        let durationString = args.data[this.parent.taskFields.duration];
        this.parent.dataOperation.updateDurationValue(durationString, ganttProb);
        let currentDuration = ganttProb.duration;
        if (isNullOrUndefined(currentDuration)) {
            this.parent.setRecordValue('isMilestone', false, ganttProb, true);
            this.parent.setRecordValue('endDate', null, ganttProb, true);
        }
        else {
            if (isNullOrUndefined(startDate) && !isNullOrUndefined(endDate)) {
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.getStartDate(endDate, currentDuration, ganttProb.durationUnit, ganttProb), ganttProb, true);
            }
            if (currentDuration !== 0 && ganttProb.isMilestone) {
                this.parent.setRecordValue('isMilestone', false, ganttProb, true);
                this.parent.setRecordValue('startDate', this.parent.dateValidationModule.checkStartDate(ganttProb.startDate, ganttProb), ganttProb, true);
            }
            this.parent.setRecordValue('isMilestone', (ganttProb.duration === 0 ? true : false), ganttProb, true);
            this.parent.dateValidationModule.calculateEndDate(args.data);
        }
        this.parent.dataOperation.updateWidthLeft(args.data);
        this.parent.dataOperation.updateMappingData(args.data, 'endDate');
        this.parent.dataOperation.updateMappingData(args.data, 'startDate');
        this.parent.dataOperation.updateMappingData(args.data, 'duration');
        this.updateEditedRecord(args);
    }
    /**
     * To update progress cell with new value
     * @param args
     */
    progressEdited(args) {
        let ganttRecord = args.data;
        this.parent.setRecordValue('progress', (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]), ganttRecord.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.progress, (ganttRecord[this.parent.taskFields.progress] > 100 ? 100 : ganttRecord[this.parent.taskFields.progress]), args.data);
        if (!args.data.hasChildRecords) {
            this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth(ganttRecord.ganttProperties.width, ganttRecord.ganttProperties.progress), ganttRecord.ganttProperties, true);
        }
        this.updateEditedRecord(args);
    }
    /**
     * To update baselines with new baseline start date and baseline end date
     * @param args
     */
    baselineEdited(args) {
        let ganttRecord = args.data.ganttProperties;
        let baseLineStartDate = args.data[this.parent.taskFields.baselineStartDate];
        let baseLineEndDate = args.data[this.parent.taskFields.baselineEndDate];
        if (baseLineEndDate && baseLineEndDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.parent.dateValidationModule.setTime(this.parent.defaultEndTime, baseLineEndDate);
        }
        this.parent.setRecordValue('baselineStartDate', this.parent.dateValidationModule.checkBaselineStartDate(baseLineStartDate), ganttRecord, true);
        this.parent.setRecordValue('baselineEndDate', this.parent.dateValidationModule.checkBaselineEndDate(baseLineEndDate), ganttRecord, true);
        if (ganttRecord.baselineStartDate && ganttRecord.baselineEndDate) {
            this.parent.setRecordValue('baselineLeft', this.parent.dataOperation.calculateBaselineLeft(ganttRecord), ganttRecord, true);
            this.parent.setRecordValue('baselineWidth', this.parent.dataOperation.calculateBaselineWidth(ganttRecord), ganttRecord, true);
        }
        this.updateEditedRecord(args);
    }
    /**
     * To update task's resource cell with new value
     * @param args
     * @param editedObj
     */
    resourceEdited(args, editedObj) {
        if (editedObj[this.parent.taskFields.resourceInfo]) {
            args.data.ganttProperties.resourceInfo = this.parent.dataOperation.setResourceInfo(editedObj);
            this.parent.dataOperation.updateMappingData(args.data, 'resourceInfo');
            this.updateEditedRecord(args);
        }
    }
    /**
     * To update task's predecessor cell with new value
     * @param editedArgs
     * @param cellEditArgs
     */
    dependencyEdited(editedArgs, cellEditArgs) {
        if (!this.parent.connectorLineEditModule.updatePredecessor(editedArgs.data, editedArgs.data[this.parent.taskFields.dependency])) {
            this.parent.editModule.revertCellEdit(cellEditArgs);
        }
    }
    /**
     * To compare start date and end date from Gantt record
     * @param ganttRecord
     */
    compareDatesFromRecord(ganttRecord) {
        let sDate = this.parent.dateValidationModule.getValidStartDate(ganttRecord);
        let eDate = this.parent.dateValidationModule.getValidEndDate(ganttRecord);
        return this.parent.dateValidationModule.compareDates(sDate, eDate);
    }
    /**
     * To start method save action with edited cell value
     * @param args
     */
    updateEditedRecord(args) {
        this.parent.editModule.initiateUpdateAction(args);
    }
    /**
     * To remove all public private properties
     * @private
     */
    destroy() {
        // Destroy Method
    }
}

/**
 * File for handling taskbar editing tooltip in Gantt.
 */
class EditTooltip {
    constructor(gantt, taskbarEdit) {
        this.parent = gantt;
        this.taskbarEdit = taskbarEdit;
    }
    /**
     * To create tooltip.
     * @return {void}
     * @private
     */
    createTooltip(opensOn, mouseTrail, target) {
        this.toolTipObj = new Tooltip({
            opensOn: opensOn,
            content: this.getTooltipText(),
            position: 'TopRight',
            mouseTrail: mouseTrail,
            cssClass: ganttTooltip,
            target: target ? target : null,
            animation: { open: { effect: 'None' }, close: { effect: 'None' } }
        });
        this.toolTipObj.beforeRender = (args) => {
            let argsData = {
                data: this.taskbarEdit.taskBarEditRecord,
                args: args,
                content: this.toolTipObj.content
            };
            this.parent.trigger('beforeTooltipRender', argsData);
        };
        this.toolTipObj.appendTo(this.parent.chartPane);
    }
    /**
     * To show/hide taskbar edit tooltip.
     * @return {void}
     * @private
     */
    showHideTaskbarEditTooltip(bool) {
        if (bool) {
            this.createTooltip('Custom', false);
            this.parent.tooltipModule.toolTipObj.close();
            this.updateTooltip();
            if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointLeftDrag') {
                this.toolTipObj.open(this.taskbarEdit.connectorSecondElement.querySelector('.' + connectorPointLeft));
            }
            else if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.open(this.taskbarEdit.connectorSecondElement.querySelector('.' + connectorPointRight));
            }
            else {
                this.toolTipObj.open(this.taskbarEdit.taskBarEditElement);
            }
        }
        else if (!isNullOrUndefined(this.toolTipObj)) {
            this.toolTipObj.destroy();
            this.toolTipObj = null;
        }
    }
    /**
     * To update tooltip content and position.
     * @return {void}
     * @private
     */
    updateTooltip() {
        if (!isNullOrUndefined(this.toolTipObj)) {
            if (this.taskbarEdit.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskbarEdit.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.content = this.getTooltipText();
                this.toolTipObj.offsetY = -3;
            }
            else {
                this.toolTipObj.content = this.getTooltipText();
                this.toolTipObj.refresh(this.taskbarEdit.taskBarEditElement);
                if (this.taskbarEdit.taskBarEditAction === 'LeftResizing') {
                    this.toolTipObj.offsetX = -this.taskbarEdit.taskBarEditRecord.ganttProperties.width;
                }
                else if (this.taskbarEdit.taskBarEditAction === 'RightResizing') {
                    this.toolTipObj.offsetX = 0;
                }
                else if (this.taskbarEdit.taskBarEditAction === 'ProgressResizing') {
                    this.toolTipObj.offsetX = -(this.taskbarEdit.taskBarEditRecord.ganttProperties.width -
                        this.taskbarEdit.taskBarEditRecord.ganttProperties.progressWidth);
                }
                else if (this.taskbarEdit.taskBarEditAction === 'MilestoneDrag') {
                    this.toolTipObj.offsetX = -(this.parent.chartRowsModule.milestoneHeight / 2);
                }
                else if (this.taskbarEdit.taskBarEditRecord.ganttProperties.width > 5) {
                    this.toolTipObj.offsetX = -(this.taskbarEdit.taskBarEditRecord.ganttProperties.width +
                        this.taskbarEdit.taskBarEditRecord.ganttProperties.left -
                        this.taskbarEdit.tooltipPositionX);
                }
            }
        }
    }
    /**
     * To get updated tooltip text.
     * @return {void}
     * @private
     */
    getTooltipText() {
        let tooltipString = '';
        let instance = this.parent.globalize;
        let editRecord = this.taskbarEdit.taskBarEditRecord.ganttProperties;
        if (this.parent.tooltipSettings.editing) {
            let templateNode = this.parent.tooltipModule.templateCompiler(this.parent.tooltipSettings.editing, this.parent, editRecord);
            tooltipString = templateNode[0];
        }
        else {
            switch (this.taskbarEdit.taskBarEditAction) {
                case 'ProgressResizing':
                    tooltipString = this.parent.localeObj.getConstant('progress') + ' : ' + editRecord.progress;
                    break;
                case 'LeftResizing':
                    tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                    tooltipString += instance.formatDate(editRecord.startDate, { format: this.parent.dateFormat });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, editRecord.durationUnit);
                    break;
                case 'RightResizing':
                    tooltipString = this.parent.localeObj.getConstant('endDate') + ' : ';
                    tooltipString += instance.formatDate(editRecord.endDate, { format: this.parent.dateFormat });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, editRecord.durationUnit);
                    break;
                case 'ChildDrag':
                case 'ParentDrag':
                case 'MilestoneDrag':
                    if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.startDate)) {
                        tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                        tooltipString += instance.formatDate(editRecord.startDate, { format: this.parent.dateFormat });
                    }
                    if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.endDate)) {
                        tooltipString += tooltipString === '' ? '' : '<br/>';
                        tooltipString += this.parent.localeObj.getConstant('endDate') + ' : ' + instance.formatDate(editRecord.endDate, { format: this.parent.dateFormat });
                    }
                    break;
                case 'ConnectorPointLeftDrag':
                case 'ConnectorPointRightDrag':
                    tooltipString = this.parent.connectorLineModule.tooltipTable;
                    if (isNullOrUndefined(this.toolTipObj)) {
                        this.parent.connectorLineModule.tooltipTable.innerHTML =
                            this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.taskName, this.parent.editModule.taskbarEditModule.fromPredecessorText, '', '');
                    }
                    break;
            }
        }
        return tooltipString;
    }
}

/**
 * File for handling taskbar editing operation in Gantt.
 */
class TaskbarEdit {
    constructor(ganttObj) {
        this.isMouseDragged = false;
        this.parent = ganttObj;
        this.initPublicProp();
        this.wireEvents();
        this.editTooltip = new EditTooltip(this.parent, this);
    }
    wireEvents() {
        this.parent.on('chartMouseDown', this.mouseDownHandler, this);
        this.parent.on('chartMouseUp', this.mouseUpHandler, this);
        this.parent.on('chartMouseLeave', this.mouseLeaveHandler, this);
        this.parent.on('chartMouseMove', this.mouseMoveAction, this);
    }
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    initPublicProp() {
        this.taskBarEditElement = null;
        this.taskBarEditRecord = null;
        this.taskBarEditAction = null;
        this.connectorSecondElement = null;
        this.connectorSecondRecord = null;
        this.connectorSecondAction = null;
        this.highlightedSecondElement = null;
        this.fromPredecessorText = null;
        this.toPredecessorText = null;
        this.finalPredecessor = null;
        this.drawPredecessor = false;
        this.roundOffDuration = true;
        this.dragMouseLeave = false;
        this.isMouseDragged = false;
        this.previousItemProperty = ['left', 'progress', 'duration', 'startDate', 'endDate', 'width', 'progressWidth'];
    }
    mouseDownHandler(e) {
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.updateTaskBarEditElement(e);
        }
    }
    mouseLeaveHandler(e) {
        this.dragMouseLeave = true;
    }
    /**
     * To update taskbar edited elements on mouse down action.
     * @return {void}
     * @private
     */
    updateTaskBarEditElement(e) {
        let element = parentsUntil$1(e.target, taskBarMainContainer);
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.showHideTaskBarEditingElements(element, this.taskBarEditElement);
        }
        this.taskBarEditElement = element;
        this.taskBarEditRecord = isNullOrUndefined(this.taskBarEditElement) ?
            null : this.parent.ganttChartModule.getRecordByTaskBar(this.taskBarEditElement);
        if (element && (e.type === 'mousedown' || e.type === 'pointerdown')) {
            this.roundOffDuration = true;
            this.taskBarEditAction = this.getTaskBarAction(e);
            if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' || this.taskBarEditAction === 'ConnectorPointRightDrag') &&
                isNullOrUndefined(this.parent.taskFields.dependency)) {
                this.taskBarEditAction = null;
            }
            else {
                this.updateMouseDownProperties(e);
                this.isMouseDragged = false;
            }
        }
    }
    /**
     * To show/hide taskbar editing elements.
     * @return {void}
     * @private
     */
    showHideTaskBarEditingElements(element, secondElement, fadeConnectorLine) {
        if (element) {
            if (element.querySelector('.' + taskBarLeftResizer)) {
                addClass([element.querySelector('.' + taskBarLeftResizer)], [leftResizeGripper]);
                addClass([element.querySelector('.' + taskBarRightResizer)], [rightResizeGripper]);
                addClass([element.querySelector('.' + childProgressResizer)], [progressResizeGripper]);
            }
            addClass(this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + connectorLineContainer), [connectorLineZIndex]);
            if (!isNullOrUndefined(this.parent.taskFields.dependency) && element.querySelector('.' + connectorPointLeft)) {
                addClass([element.querySelector('.' + connectorPointLeft)], [connectorPointLeftHover]);
                addClass([element.querySelector('.' + connectorPointRight)], [connectorPointRightHover]);
            }
        }
        else if (!fadeConnectorLine) {
            removeClass(this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + connectorLineContainer), [connectorLineZIndex]);
        }
        if (secondElement && element !== secondElement) {
            if (secondElement.querySelector('.' + taskBarLeftResizer)) {
                removeClass([secondElement.querySelector('.' + taskBarLeftResizer)], [leftResizeGripper]);
                removeClass([secondElement.querySelector('.' + taskBarRightResizer)], [rightResizeGripper]);
                if (secondElement.querySelector('.' + childProgressResizer)) {
                    removeClass([secondElement.querySelector('.' + childProgressResizer)], [progressResizeGripper]);
                }
            }
            if (!isNullOrUndefined(this.parent.taskFields.dependency) && secondElement.querySelector('.' + connectorPointLeft)) {
                removeClass([secondElement.querySelector('.' + connectorPointLeft)], [connectorPointLeftHover]);
                removeClass([secondElement.querySelector('.' + connectorPointRight)], [connectorPointRightHover]);
            }
        }
    }
    /**
     * To get taskbar edit actions.
     * @return {string}
     * @private
     */
    getTaskBarAction(e) {
        let mouseDownElement = e.target;
        return this.taskBarEditRecord.hasChildRecords ? 'ParentDrag' :
            mouseDownElement.classList.contains(taskBarLeftResizer) ? 'LeftResizing' :
                mouseDownElement.classList.contains(taskBarRightResizer) ? 'RightResizing' :
                    mouseDownElement.classList.contains(childProgressResizer) ? 'ProgressResizing' :
                        closest(mouseDownElement, '.' + childProgressResizer) ? 'ProgressResizing' :
                            mouseDownElement.classList.contains(connectorPointLeft) ? 'ConnectorPointLeftDrag' :
                                mouseDownElement.classList.contains(connectorPointRight) ? 'ConnectorPointRightDrag' :
                                    this.taskBarEditRecord.ganttProperties.isMilestone ? 'MilestoneDrag' : 'ChildDrag';
    }
    /**
     * To update property while perform mouse down.
     * @return {void}
     * @private
     */
    updateMouseDownProperties(e) {
        if (e.pageX || e.pageY) {
            let containerPosition = this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
            this.mouseDownX = (e.pageX - containerPosition.left) +
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
            this.tooltipPositionX = this.mouseDownX;
            this.mouseDownY = e.pageY - containerPosition.top +
                this.parent.ganttChartModule.scrollObject.previousScroll.top;
        }
        if (this.taskBarEditAction === 'ConnectorPointLeftDrag' || this.taskBarEditAction === 'ConnectorPointRightDrag') {
            this.fromPredecessorText = this.taskBarEditAction === 'ConnectorPointLeftDrag' ? 'Start' : 'Finish';
            this.parent.connectorLineModule.tooltipTable.innerHTML = this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(this.taskBarEditRecord.ganttProperties.taskName, this.fromPredecessorText, '', '');
        }
    }
    isMouseDragCheck() {
        if (!this.isMouseDragged && this.taskBarEditAction && ((this.mouseDownX !== this.mouseMoveX) &&
            ((this.mouseDownX + 3) < this.mouseMoveX || (this.mouseDownX - 3) > this.mouseMoveX)
            || (this.mouseDownY !== this.mouseMoveY) &&
                ((this.mouseDownY + 3) < this.mouseMoveY || (this.mouseDownY - 3) > this.mouseMoveY))) {
            this.isMouseDragged = true;
            this.parent.initiateEditAction(true);
            let item = this.taskBarEditRecord.ganttProperties;
            this.previousItem = this.parent.timelineModule.extendFunction(item, this.previousItemProperty);
            if (this.taskBarEditAction !== 'ConnectorPointLeftDrag' &&
                this.taskBarEditAction !== 'ConnectorPointRightDrag') {
                this.editTooltip.showHideTaskbarEditTooltip(true);
            }
        }
    }
    /**
     * To handle mouse move action in chart
     * @param e
     * @private
     */
    mouseMoveAction(e) {
        let containerPosition = this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
        this.mouseMoveX = e.pageX - containerPosition.left +
            this.parent.ganttChartModule.scrollObject.previousScroll.left;
        this.mouseMoveY = e.pageY - containerPosition.top +
            this.parent.ganttChartModule.scrollObject.previousScroll.top;
        this.dragMouseLeave = false;
        this.isMouseDragCheck();
        if (this.isMouseDragged && this.taskBarEditAction) {
            if (this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.updateConnectorLineSecondProperties(e);
            }
            this.taskBarEditingAction(e);
        }
        else if (!this.taskBarEditAction) {
            this.updateTaskBarEditElement(e);
        }
    }
    /**
     * Method to update taskbar editing action on mous move.
     * @return {void}
     * @private
     */
    taskBarEditingAction(e) {
        let args = {};
        let recordIndex = this.parent.ganttChartModule.getIndexByTaskBar(this.taskBarEditElement);
        if (this.taskBarEditRecord !== null) {
            args.editingFields = this.taskBarEditRecord.ganttProperties;
            args.data = this.taskBarEditRecord;
            args.recordIndex = recordIndex;
            args.taskBarEditAction = this.taskBarEditAction;
            args.roundOffDuration = this.roundOffDuration;
            this.parent.trigger('taskbarEditing', args);
        }
        if (!args.cancel && this.taskBarEditRecord !== null) {
            this.roundOffDuration = args.roundOffDuration;
            this.updateMouseMoveProperties(e);
            if (this.taskBarEditAction === 'ProgressResizing') {
                this.performProgressResize(e);
            }
            else if (this.taskBarEditAction === 'LeftResizing') {
                this.enableLeftResizing(e);
            }
            else if (this.taskBarEditAction === 'RightResizing') {
                this.enableRightResizing(e);
            }
            else if (this.taskBarEditAction === 'ParentDrag' || this.taskBarEditAction === 'ChildDrag' ||
                this.taskBarEditAction === 'MilestoneDrag') {
                this.enableDragging(e);
            }
            else if (this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.triggerDependencyEvent(e);
                this.drawFalseLine();
            }
            this.setItemPosition();
            this.updateEditedItem();
            this.editTooltip.updateTooltip();
        }
        else {
            this.editTooltip.showHideTaskbarEditTooltip(false);
        }
    }
    /**
     * To update property while perform mouse move.
     * @return {void}
     * @private
     */
    updateMouseMoveProperties(e) {
        let containerPosition = this.parent.getOffsetRect(this.parent.ganttChartModule.chartBodyContainer);
        if (e.pageX || e.pageY) {
            this.mouseMoveX = e.pageX - containerPosition.left +
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
            this.tooltipPositionX = this.mouseMoveX;
            this.mouseMoveY = e.pageY - containerPosition.top +
                this.parent.ganttChartModule.scrollObject.previousScroll.top;
        }
        let isConnectorLineEdit = (this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') ?
            true : false;
        if ((this.taskBarEditRecord.ganttProperties.width > 3 && !((this.taskBarEditAction === 'ProgressResizing' &&
            (this.taskBarEditRecord.ganttProperties.progress === 0 || this.taskBarEditRecord.ganttProperties.progress === 100)))) ||
            isConnectorLineEdit) {
            let mouseX = this.mouseMoveX - this.parent.ganttChartModule.scrollObject.previousScroll.left +
                containerPosition.left;
            let mouseY = this.mouseMoveY - this.parent.ganttChartModule.scrollObject.previousScroll.top +
                containerPosition.top;
            if ((mouseX + 20) >
                containerPosition.left + this.parent.ganttChartModule.chartBodyContainer.offsetWidth) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('right');
            }
            else if ((mouseX - 20) < containerPosition.left) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.left;
                this.startScrollTimer('left');
            }
            else if (isConnectorLineEdit && ((mouseY + 20) >
                containerPosition.top + this.parent.ganttChartModule.chartBodyContainer.offsetHeight)) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.top;
                this.startScrollTimer('bottom');
            }
            else if (isConnectorLineEdit && ((mouseY - 20) < containerPosition.top)) {
                this.timerCount = this.parent.ganttChartModule.scrollObject.previousScroll.top;
                this.startScrollTimer('top');
            }
            else {
                this.stopScrollTimer();
            }
        }
        else {
            this.stopScrollTimer();
        }
    }
    /**
     * To start the scroll timer.
     * @return {void}
     * @private
     */
    startScrollTimer(direction) {
        this.stopScrollTimer();
        this.scrollTimer = window.setInterval(() => {
            if (direction === 'right' || direction === 'bottom') {
                this.timerCount = (this.timerCount + 1) >= this.parent.timelineModule.totalTimelineWidth ?
                    this.parent.timelineModule.totalTimelineWidth : (this.timerCount + 1);
            }
            else {
                this.timerCount = (this.timerCount - 1) < 0 ? 0 : (this.timerCount - 1);
            }
            if (direction === 'bottom' || direction === 'top') {
                this.parent.ganttChartModule.scrollObject.setScrollTop(this.timerCount);
            }
            else {
                this.parent.ganttChartModule.scrollObject.setScrollLeft(this.timerCount);
            }
            if (this.taskBarEditAction === 'ConnectorPointLeftDrag'
                || this.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.drawFalseLine();
            }
        }, 0);
    }
    /**
     * To stop the scroll timer.
     * @return {void}
     * @private
     */
    stopScrollTimer() {
        window.clearInterval(this.scrollTimer);
        this.scrollTimer = null;
    }
    /**
     * To update left and width while perform taskbar drag operation.
     * @return {void}
     * @private
     */
    enableDragging(e) {
        let item = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            diffrenceWidth = this.mouseDownX - this.mouseMoveX;
            if (diffrenceWidth > 0) {
                this.parent.setRecordValue('left', this.previousItem.left - diffrenceWidth, item, true);
            }
        }
        else {
            diffrenceWidth = this.mouseMoveX - this.mouseDownX;
            this.parent.setRecordValue('left', this.previousItem.left + diffrenceWidth, item, true);
        }
        let left = item.left < 0 ? 0 : (item.left + item.width) >= this.parent.timelineModule.totalTimelineWidth ?
            (this.parent.timelineModule.totalTimelineWidth - item.width) : item.left;
        this.parent.setRecordValue('left', left, item, true);
    }
    /**
     * To update left and width while perform progress resize operation.
     * @return {void}
     * @private
     */
    performProgressResize(e) {
        let item = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX > item.left &&
                (this.mouseMoveX < (item.left + item.width)) && item.left > 0) {
                diffrenceWidth = this.mouseMoveX - item.left;
                this.parent.setRecordValue('progressWidth', diffrenceWidth, item, true);
            }
            else {
                if (this.mouseMoveX >= (item.left + item.width)) {
                    this.parent.setRecordValue('progressWidth', item.width, item, true);
                }
                else {
                    this.parent.setRecordValue('progressWidth', 0, item, true);
                }
            }
        }
        else {
            if (this.mouseMoveX > item.left &&
                (this.mouseMoveX < (item.left + item.width))) {
                diffrenceWidth = this.mouseMoveX - item.left;
                this.parent.setRecordValue('progressWidth', diffrenceWidth, item, true);
            }
            else {
                if (this.mouseMoveX <= item.left) {
                    this.parent.setRecordValue('progressWidth', 0, item, true);
                }
                else {
                    this.parent.setRecordValue('progressWidth', item.width, item, true);
                }
            }
        }
        let widthValue = item.progressWidth > item.width ?
            item.width : item.progressWidth;
        widthValue = item.progressWidth < 0 ? 0 : item.progressWidth;
        this.parent.setRecordValue('progressWidth', widthValue, item, true);
        let diff = item.width - item.progressWidth;
        if (diff <= 4) {
            this.progressBorderRadius = 4 - diff;
        }
        else {
            this.progressBorderRadius = 0;
        }
    }
    /**
     * To update left and width while perform taskbar left resize operation.
     * @return {void}
     * @private
     */
    enableLeftResizing(e) {
        let item = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX < (item.left + item.width)) {
                diffrenceWidth = this.mouseDownX - this.mouseMoveX;
                if (item.left > 0) {
                    this.parent.setRecordValue('left', this.previousItem.left - diffrenceWidth, item, true);
                    this.parent.setRecordValue('width', this.previousItem.width + diffrenceWidth, item, true);
                }
            }
            else {
                if (this.mouseMoveX > (item.left + item.width)) {
                    diffrenceWidth = this.mouseDownX - this.mouseMoveX;
                    this.parent.setRecordValue('left', this.previousItem.left - diffrenceWidth, item, true);
                    this.parent.setRecordValue('width', 3, item, true);
                }
            }
        }
        else {
            if (this.mouseMoveX < (item.left + item.width)) {
                diffrenceWidth = this.mouseMoveX - this.mouseDownX;
                if ((item.left) < (item.left + item.width) &&
                    ((this.previousItem.left + diffrenceWidth) <= (this.previousItem.left + this.previousItem.width))) {
                    this.parent.setRecordValue('left', this.previousItem.left + diffrenceWidth, item, true);
                    this.parent.setRecordValue('width', this.previousItem.width - diffrenceWidth, item, true);
                }
            }
            else {
                diffrenceWidth = this.mouseMoveX - this.mouseDownX;
                this.parent.setRecordValue('left', this.previousItem.left + diffrenceWidth, item, true);
                this.parent.setRecordValue('width', 3, item, true);
            }
        }
        this.updateEditPosition(e, item);
        this.parent.setRecordValue('left', (this.previousItem.left + this.previousItem.width - item.width), item, true);
    }
    /**
     * Update mouse position and edited item value
     * @param e
     * @param item
     */
    updateEditPosition(e, item) {
        this.updateIsMilestone(item);
        this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth(item.width, item.progress), item, true);
    }
    /**
     *  To update milestone property.
     * @return {void}
     * @private
     */
    updateIsMilestone(item) {
        if (item.width <= 3) {
            this.parent.setRecordValue('width', 3, item, true);
            this.parent.setRecordValue('isMilestone', true, item, true);
        }
        else {
            this.parent.setRecordValue('width', item.width, item, true);
            this.parent.setRecordValue('isMilestone', false, item, true);
        }
    }
    /**
     * To update left and width while perform taskbar right resize operation.
     * @return {void}
     * @private
     */
    enableRightResizing(e) {
        let item = this.taskBarEditRecord.ganttProperties;
        let diffrenceWidth = 0;
        if (this.mouseDownX > this.mouseMoveX) {
            if (this.mouseMoveX > item.left && (this.mouseDownX - this.mouseMoveX) > 3) {
                diffrenceWidth = this.mouseDownX - this.mouseMoveX;
                this.parent.setRecordValue('width', this.previousItem.width - diffrenceWidth, item, true);
            }
            else {
                if (this.mouseMoveX < item.left) {
                    this.parent.setRecordValue('width', 3, item, true);
                }
            }
        }
        else {
            if (this.mouseMoveX > item.left) {
                diffrenceWidth = this.mouseMoveX - this.mouseDownX;
                this.parent.setRecordValue('width', this.previousItem.width + diffrenceWidth, item, true);
            }
        }
        this.updateEditPosition(e, item);
    }
    /**
     * To updated startDate and endDate while perform taskbar edit operation.
     * @return {void}
     * @private
     */
    updateEditedItem() {
        let item = this.taskBarEditRecord.ganttProperties;
        let left;
        switch (this.taskBarEditAction) {
            case 'ProgressResizing':
                this.parent.setRecordValue('progress', this.getProgressPercent(item.width, item.progressWidth), item, true);
                break;
            case 'LeftResizing':
                left = this.getRoundOffStartLeft(item, this.roundOffDuration);
                let projectStartDate = this.getDateByLeft(left);
                if (isNullOrUndefined(item.endDate)) {
                    let endDate = this.parent.dateValidationModule.getValidEndDate(item);
                    this.parent.setRecordValue('endDate', endDate, item, true);
                }
                let startDate = this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null);
                this.parent.setRecordValue('startDate', new Date(startDate.getTime()), item, true);
                if (this.parent.dateValidationModule.compareDates(item.startDate, item.endDate) === 0
                    && isNullOrUndefined(item.isMilestone) && item.isMilestone === false && item.duration === 0) {
                    this.parent.setRecordValue('duration', 1, item, true);
                }
                this.parent.dateValidationModule.calculateDuration(this.taskBarEditRecord);
                break;
            case 'RightResizing':
                left = this.getRoundOffEndLeft(item, this.roundOffDuration);
                let tempEndDate = this.getDateByLeft(left);
                if (isNullOrUndefined(item.startDate)) {
                    startDate = this.parent.dateValidationModule.getValidStartDate(item);
                    this.parent.setRecordValue('startDate', startDate, item, true);
                }
                let endDate = this.parent.dateValidationModule.checkEndDate(tempEndDate, this.taskBarEditRecord.ganttProperties);
                this.parent.setRecordValue('endDate', new Date(endDate.getTime()), item, true);
                this.parent.dateValidationModule.calculateDuration(this.taskBarEditRecord);
                break;
            case 'ParentDrag':
            case 'ChildDrag':
            case 'MilestoneDrag':
                left = this.getRoundOffStartLeft(item, this.roundOffDuration);
                projectStartDate = this.getDateByLeft(left);
                if (!isNullOrUndefined(item.endDate) && isNullOrUndefined(item.startDate)) {
                    endDate = this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null);
                    endDate = this.parent.dateValidationModule.checkEndDate(endDate, this.taskBarEditRecord.ganttProperties);
                    this.parent.setRecordValue('endDate', endDate, item, true);
                }
                else {
                    this.parent.setRecordValue('startDate', this.parent.dateValidationModule.checkStartDate(projectStartDate, item, null), item, true);
                    if (!isNullOrUndefined(item.duration)) {
                        this.parent.dateValidationModule.calculateEndDate(this.taskBarEditRecord);
                    }
                }
                break;
        }
    }
    /**
     * To get roundoff enddate.
     * @return {number}
     * @private
     */
    getRoundOffEndLeft(ganttRecord, isRoundOff) {
        let tierMode = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        let totalLeft = ganttRecord.width + ganttRecord.left;
        let remainingContribution = (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Day') / (1000 * 60 * 60 * 24)));
        let remainingLeft = this.parent.perDayWidth - (this.parent.perDayWidth / remainingContribution);
        let positionValue = remainingLeft / this.parent.perDayWidth;
        if (isRoundOff === undefined) {
            isRoundOff = false;
        }
        /*Rounding the decimal value for week-month-year schedule mode*/
        if (!isRoundOff) {
            if ((tierMode !== 'Hour' && tierMode !== 'Minutes')) {
                if (positionValue === 0) {
                    totalLeft = totalLeft;
                }
                else if (positionValue > 0.5) {
                    totalLeft = totalLeft - remainingLeft + this.parent.perDayWidth;
                }
                else if (positionValue < 0.5) {
                    totalLeft = (totalLeft - remainingLeft) + (this.parent.perDayWidth / 2);
                }
            }
        }
        else if (isRoundOff) {
            if (tierMode === 'Hour') {
                let inHour = (this.parent.perDayWidth / 24);
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Hour') / (1000 * 60 * 60)));
                remainingLeft = (this.parent.perDayWidth / 24) - ((this.parent.perDayWidth / 24) / remainingContribution);
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + inHour;
                }
            }
            else if (tierMode === 'Minutes') {
                let inMinutes = (this.parent.perDayWidth / (24 * 60));
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(totalLeft), 1, 'Minutes') / (1000 * 60)));
                remainingLeft = (this.parent.perDayWidth / (24 * 60)) - ((this.parent.perDayWidth / (24 * 60)) / remainingContribution);
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + inMinutes;
                }
            }
            else {
                if (remainingLeft !== 0) {
                    totalLeft = (totalLeft - remainingLeft) + this.parent.perDayWidth;
                }
            }
        }
        return totalLeft;
    }
    /**
     * To get roundoff startdate.
     * @return {number}
     * @private
     */
    getRoundOffStartLeft(ganttRecord, isRoundOff) {
        let left = ganttRecord.left;
        let tierMode = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        let remainingContribution = (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left), 1, 'Day') / (1000 * 60 * 60 * 24)));
        let remainDays = this.parent.perDayWidth - (this.parent.perDayWidth / remainingContribution);
        let remainDaysInDecimal = remainDays / this.parent.perDayWidth;
        if (isRoundOff === undefined) {
            isRoundOff = false;
        }
        /*Rounding the decimal value for week-month-year schedule mode*/
        if (!isRoundOff) {
            if ((tierMode !== 'Hour' && tierMode !== 'Minutes')) {
                if (remainDaysInDecimal <= 0.5) {
                    left = ganttRecord.left - remainDays;
                }
                else if (remainDaysInDecimal > 0.5) {
                    left = (ganttRecord.left - remainDays) + this.parent.perDayWidth / 2;
                }
            }
        }
        else if (isRoundOff) {
            if (tierMode === 'Hour') {
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left), 1, 'Hour') / (1000 * 60 * 60)));
                remainDays = (this.parent.perDayWidth / 24) - ((this.parent.perDayWidth / 24) / remainingContribution);
                left = ganttRecord.left - remainDays;
            }
            else if (tierMode === 'Minutes') {
                remainingContribution =
                    (1 / (this.parent.timelineModule.getIncrement(this.getDateByLeft(left), 1, 'Minutes') / (1000 * 60)));
                remainDays = (this.parent.perDayWidth / (24 * 60)) - ((this.parent.perDayWidth / (24 * 60)) / remainingContribution);
                left = ganttRecord.left - remainDays;
            }
            else {
                left = ganttRecord.left - remainDays;
            }
        }
        return left;
    }
    /**
     * To get date by left value.
     * @return {Date}
     * @private
     */
    getDateByLeft(left) {
        let pStartDate = new Date(this.parent.timelineModule.timelineStartDate.toString());
        let milliSecondsPerPixel = (24 * 60 * 60 * 1000) / this.parent.perDayWidth;
        pStartDate.setTime(pStartDate.getTime() + (left * milliSecondsPerPixel));
        let tierMode = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.topTier :
            this.parent.timelineModule.bottomTier;
        if (tierMode !== 'Hour' && tierMode !== 'Minutes') {
            if (this.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && !this.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() + (60 * 60 * 1000));
            }
            else if (!this.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && this.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() - (60 * 60 * 1000));
            }
        }
        return pStartDate;
    }
    /**
     * To get timezone offset.
     * @return {number}
     * @private
     */
    getDefaultTZOffset() {
        let janMonth = new Date(new Date().getFullYear(), 0, 1);
        let julMonth = new Date(new Date().getFullYear(), 6, 1); //Because there is no reagions DST inbetwwen this range
        return Math.max(janMonth.getTimezoneOffset(), julMonth.getTimezoneOffset());
    }
    /**
     * To check whether the date is in DST.
     * @return {boolean}
     * @private
     */
    isInDst(date) {
        return date.getTimezoneOffset() < this.getDefaultTZOffset();
    }
    /**
     * To set item position.
     * @return {void}
     * @private
     */
    setItemPosition() {
        let item = this.taskBarEditRecord.ganttProperties;
        let width = this.taskBarEditAction === 'MilestoneDrag' ?
            this.parent.chartRowsModule.milestoneHeight : item.width;
        let taskBarMainContainer$$1 = closest(this.taskBarEditElement, 'tr.' + chartRow)
            .querySelector('.' + taskBarMainContainer);
        let leftLabelContainer$$1 = closest(this.taskBarEditElement, 'tr.' + chartRow)
            .querySelector('.' + leftLabelContainer);
        let rightLabelContainer$$1 = closest(this.taskBarEditElement, 'tr.' + chartRow)
            .querySelector('.' + rightLabelContainer);
        let traceChildProgressBar$$1 = this.taskBarEditElement.querySelector('.' + traceChildProgressBar);
        let traceChildTaskBar$$1 = this.taskBarEditElement.querySelector('.' + traceChildTaskBar);
        let childProgressResizer$$1 = this.taskBarEditElement.querySelector('.' + childProgressResizer);
        let taskBarRightResizer$$1 = this.taskBarEditElement.querySelector('.' + taskBarRightResizer);
        let traceParentTaskBar$$1 = this.taskBarEditElement.querySelector('.' + traceParentTaskBar);
        let traceParentProgressBar$$1 = this.taskBarEditElement.querySelector('.' + traceParentProgressBar);
        let traceConnectorPointRight = this.taskBarEditElement.querySelector('.' + rightConnectorPointOuterDiv);
        if (this.taskBarEditAction !== 'ConnectorPointRightDrag' &&
            this.taskBarEditAction !== 'ConnectorPointLeftDrag') {
            taskBarMainContainer$$1.style.width = (width) + 'px';
            taskBarMainContainer$$1.style.left = (item.left) + 'px';
            leftLabelContainer$$1.style.width = (item.left) + 'px';
            rightLabelContainer$$1.style.left = (item.left + width) + 'px';
            if (traceConnectorPointRight) {
                traceConnectorPointRight.style.left = (width) + 'px';
            }
            if (this.taskBarEditAction === 'MilestoneDrag') {
                taskBarMainContainer$$1.style.left = (item.left - (width / 2)) + 'px';
                leftLabelContainer$$1.style.width = (item.left - (width / 2)) + 'px';
                rightLabelContainer$$1.style.left = (item.left + (width / 2)) + 'px';
            }
            else if (this.taskBarEditAction === 'ProgressResizing') {
                traceChildProgressBar$$1.style.width = item.progressWidth + 'px';
                traceChildProgressBar$$1.style.borderBottomRightRadius = this.progressBorderRadius + 'px';
                traceChildProgressBar$$1.style.borderTopRightRadius = this.progressBorderRadius + 'px';
                traceChildTaskBar$$1.style.left = (item.left + item.progressWidth - 10) + 'px';
                childProgressResizer$$1.style.left = item.progressWidth - 8 + 'px';
            }
            else if (this.taskBarEditAction === 'RightResizing') {
                traceChildTaskBar$$1.style.width = (width) + 'px';
                traceChildProgressBar$$1.style.width = (item.progressWidth) + 'px';
                taskBarRightResizer$$1.style.left = (width - 10) + 'px';
                childProgressResizer$$1.style.left = (item.progressWidth - 10) + 'px';
            }
            else if (this.taskBarEditAction === 'ParentDrag') {
                traceParentTaskBar$$1.style.width = (width) + 'px';
                traceParentProgressBar$$1.style.width = (item.progressWidth) + 'px';
            }
            else {
                traceChildTaskBar$$1.style.width = (width) + 'px';
                if (!isNullOrUndefined(traceChildProgressBar$$1)) {
                    taskBarRightResizer$$1.style.left = (width - 10) + 'px';
                    traceChildProgressBar$$1.style.width = (item.progressWidth) + 'px';
                    childProgressResizer$$1.style.left = item.progressWidth - 10 + 'px';
                }
            }
        }
    }
    /**
     * To handle mouse up event in chart
     * @param e
     * @private
     */
    mouseUpHandler(e) {
        this.editTooltip.showHideTaskbarEditTooltip(false);
        if (this.taskBarEditAction && this.isMouseDragged) {
            if (!this.dragMouseLeave && this.taskBarEditedAction) {
                this.taskBarEditedAction(e);
            }
            else {
                this.cancelTaskbarEditActionInMouseLeave();
            }
        }
        this.initPublicProp();
        this.stopScrollTimer();
    }
    /**
     * To perform taskbar edit operation.
     * @return {void}
     * @private
     */
    taskBarEditedAction(e) {
        let args = {};
        let x1 = this.mouseDownX;
        let y1 = this.mouseDownY;
        let item = this.taskBarEditRecord;
        let recordIndex = this.parent.ganttChartModule.getIndexByTaskBar(this.taskBarEditElement);
        let x2;
        let y2;
        let resMouseY;
        x2 = this.mouseMoveX;
        y2 = this.mouseMoveY;
        resMouseY = e.pageY - this.parent.ganttChartModule.chartBodyContainer.offsetTop;
        if ((this.taskBarEditAction === 'ConnectorPointLeftDrag' ||
            this.taskBarEditAction === 'ConnectorPointRightDrag') && this.drawPredecessor) {
            this.parent.connectorLineEditModule.updatePredecessor(this.connectorSecondRecord, this.finalPredecessor);
        }
        else {
            if (x1 !== x2 || (Math.abs(y1 - resMouseY) >= (this.parent.rowHeight - this.parent.taskbarHeight) / 2)) {
                if (item !== null) {
                    args.editingFields = item.ganttProperties;
                    args.data = item;
                    args.recordIndex = recordIndex;
                    args.previousData = this.previousItem;
                    args.taskBarEditAction = this.taskBarEditAction;
                    args.action = 'TaskbarEditing';
                    args.roundOffDuration = this.roundOffDuration;
                    this.taskbarEditedArgs = args;
                    this.taskbarEdited(args);
                }
            }
        }
    }
    /**
     * To cancel the taskbar edt action.
     * @return {void}
     * @private
     */
    cancelTaskbarEditActionInMouseLeave() {
        this.parent.editModule.reUpdatePreviousRecords(true);
    }
    /**
     * To trigger taskbar edited event.
     * @return {void}
     * @private
     */
    taskbarEdited(arg) {
        let args = extend({}, arg);
        let ganttRecord = args.data;
        let taskData = ganttRecord.ganttProperties;
        if (args.taskBarEditAction === 'ProgressResizing') {
            if (args.previousData.progress !== taskData.progress) {
                this.parent.setRecordValue('progress', this.getProgressPercent(taskData.width, taskData.progressWidth), taskData, true);
                if (ganttRecord.parentItem) {
                    this.parent.editModule.updateParentProgress(ganttRecord.parentItem);
                }
            }
        }
        else {
            this.parent.dataOperation.updateWidthLeft(args.data);
        }
        this.parent.dataOperation.updateTaskData(ganttRecord);
        this.parent.editModule.initiateUpdateAction(args);
    }
    /**
     * To get progress in percentage.
     * @return {number}
     * @private
     */
    getProgressPercent(parentwidth, progresswidth) {
        return Math.ceil(((progresswidth / parentwidth) * 100));
    }
    /**
     * false line implementation.
     * @return {void}
     * @private
     */
    drawFalseLine() {
        let x1 = this.mouseDownX;
        let y1 = this.mouseDownY;
        let x2 = this.mouseMoveX;
        let y2 = this.mouseMoveY;
        let length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        let transform = 'rotate(' + angle + 'deg)';
        let left;
        let top;
        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            left = (this.taskBarEditElement.offsetLeft - (this.parent.chartRowsModule.connectorPointWidth / 2)) -
                this.parent.ganttChartModule.scrollObject.previousScroll.left;
        }
        if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            left = (this.taskBarEditElement.offsetLeft + this.taskBarEditElement.offsetWidth) +
                (this.parent.chartRowsModule.connectorPointWidth / 2) - this.parent.ganttChartModule.scrollObject.previousScroll.left;
        }
        top = ((this.taskBarEditElement.offsetTop) + (this.taskBarEditElement.offsetHeight / 2) +
            this.parent.ganttChartModule.chartBodyContainer.offsetTop) - this.parent.ganttChartModule.scrollObject.previousScroll.top;
        this.removeFalseLine(false);
        this.falseLine = createElement('div', {
            className: falseLine, id: 'ganttfalseline' + this.parent.element.id,
            styles: 'transform-origin: 0% 100%;right: auto;position: absolute;transform:' + transform + ';' +
                'border-top-width: 1px;border-top-style: dashed;z-index: 5;width:' + (length - 3) + 'px;' +
                'left:' + left + 'px;top:' + top + 'px;'
        });
        this.parent.ganttChartModule.chartBodyContainer.appendChild(this.falseLine);
    }
    /**
     *
     * @param isRemoveConnectorPointDisplay
     * @private
     */
    removeFalseLine(isRemoveConnectorPointDisplay) {
        if (this.falseLine) {
            remove(this.falseLine);
            this.falseLine = null;
            if (isRemoveConnectorPointDisplay) {
                removeClass(this.parent.ganttChartModule.scrollElement.querySelectorAll('.' + connectorLineContainer), [connectorLineZIndex]);
            }
        }
    }
    /**
     *
     * @param e
     * @private
     */
    updateConnectorLineSecondProperties(e) {
        let element = parentsUntil$1(e.target, taskBarMainContainer);
        this.connectorSecondAction = null;
        if (parentsUntil$1(e.target, connectorPointLeft)) {
            this.connectorSecondAction = 'ConnectorPointLeftDrag';
            this.toPredecessorText = 'Start';
        }
        else if (parentsUntil$1(e.target, connectorPointRight)) {
            this.connectorSecondAction = 'ConnectorPointRightDrag';
            this.toPredecessorText = 'Finish';
        }
        else {
            this.connectorSecondAction = null;
            this.toPredecessorText = null;
        }
        if (this.taskBarEditElement !== element && this.taskBarEditElement !== this.highlightedSecondElement) {
            this.showHideTaskBarEditingElements(element, this.highlightedSecondElement, true);
        }
        if (isNullOrUndefined(this.connectorSecondAction) && !isNullOrUndefined(this.connectorSecondElement)) {
            this.editTooltip.showHideTaskbarEditTooltip(false);
            removeClass([this.connectorSecondElement.querySelector('.' + connectorPointLeft)], [connectorPointAllowBlock]);
            removeClass([this.connectorSecondElement.querySelector('.' + connectorPointRight)], [connectorPointAllowBlock]);
        }
        this.connectorSecondElement = this.connectorSecondAction ? element : null;
        this.highlightedSecondElement = element;
        this.connectorSecondRecord = isNullOrUndefined(this.connectorSecondElement) ?
            null : this.parent.ganttChartModule.getRecordByTaskBar(this.connectorSecondElement);
    }
    triggerDependencyEvent(e, mouseUp) {
        let fromItem = this.taskBarEditRecord.ganttProperties;
        let toItem = this.connectorSecondRecord ? this.connectorSecondRecord.ganttProperties : null;
        let predecessor;
        let currentTarget;
        let element = e.target;
        if (this.taskBarEditAction === 'ConnectorPointLeftDrag') {
            predecessor = fromItem.taskId + 'S';
        }
        else if (this.taskBarEditAction === 'ConnectorPointRightDrag') {
            predecessor = fromItem.taskId + 'F';
        }
        if (this.connectorSecondAction) {
            if (this.connectorSecondAction === 'ConnectorPointLeftDrag') {
                predecessor += 'S';
                currentTarget = 'Start';
            }
            else if (this.connectorSecondAction === 'ConnectorPointRightDrag') {
                predecessor += 'F';
                currentTarget = 'Finish';
            }
        }
        if (isNullOrUndefined(toItem)) {
            this.drawPredecessor = false;
            return;
        }
        if (toItem.predecessorsName) {
            this.finalPredecessor = toItem.predecessorsName + ',' + predecessor;
        }
        else {
            this.finalPredecessor = predecessor;
        }
        let isValidLink = this.parent.connectorLineEditModule.validatePredecessorRelation(this.connectorSecondRecord, this.finalPredecessor);
        let args = {};
        args.fromItem = fromItem;
        args.toItem = toItem;
        args.newPredecessorString = this.finalPredecessor;
        args.isValidLink = isValidLink;
        args.requestType = 'ValidateDependency';
        this.parent.trigger('actionBegin', args);
        args.isValidLink = !isValidLink && args.isValidLink ? false : args.isValidLink;
        if (args.isValidLink) {
            if (!this.editTooltip.toolTipObj) {
                this.editTooltip.showHideTaskbarEditTooltip(true);
            }
            if (this.editTooltip.toolTipObj) {
                this.parent.connectorLineModule.tooltipTable.innerHTML = this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.taskName, this.parent.editModule.taskbarEditModule.fromPredecessorText, '', '');
                let table = this.parent.connectorLineModule.tooltipTable.querySelector('#toPredecessor').querySelectorAll('td');
                table[1].innerText = toItem.taskName;
                table[2].innerText = currentTarget;
            }
            this.drawPredecessor = true;
        }
        else {
            addClass([element], [connectorPointAllowBlock]);
            this.drawPredecessor = false;
        }
    }
    unWireEvents() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('chartMouseDown', this.mouseDownHandler);
        this.parent.off('chartMouseUp', this.mouseUpHandler);
        this.parent.off('chartMouseLeave', this.mouseLeaveHandler);
        this.parent.off('chartMouseMove', this.mouseMoveAction);
    }
    /**
     * @private
     */
    destroy() {
        this.unWireEvents();
        this.stopScrollTimer();
    }
}

/**
 *
 * @hidden
 */
class DialogEdit {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        /**
         * @private
         */
        this.updatedEditFields = null;
        this.updatedAddFields = null;
        this.addedRecord = null;
        this.dialogEditValidationFlag = false;
        this.ganttResources = [];
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.beforeOpenArgs = { cancel: false };
        this.types = this.getPredecessorType();
        this.rowData = {};
        this.editedRecord = {};
        this.inputs = {
            booleanedit: CheckBox,
            dropdownedit: DropDownList,
            datepickeredit: DatePicker,
            datetimepickeredit: DateTimePicker,
            maskededit: MaskedTextBox,
            numericedit: NumericTextBox,
            stringedit: TextBox,
        };
        this.processDialogFields();
        this.wireEvents();
    }
    wireEvents() {
        this.parent.on('chartDblClick', this.dblClickHandler, this);
    }
    dblClickHandler(e) {
        let ganttData = this.parent.ganttChartModule.getRecordByTarget(e);
        if (!isNullOrUndefined(ganttData)) {
            this.openEditDialog(ganttData);
        }
    }
    /**
     * Method to validate add and edit dialog fields property.
     */
    processDialogFields() {
        if (isNullOrUndefined(this.parent.editDialogFields) ||
            this.parent.editDialogFields && this.parent.editDialogFields.length === 0) {
            this.updatedEditFields = this.getDefaultDialogFields();
            this.updatedEditFields = this.validateDialogFields(this.updatedEditFields);
        }
        else {
            this.updatedEditFields = this.validateDialogFields(this.parent.editDialogFields);
        }
        if (isNullOrUndefined(this.parent.addDialogFields) ||
            this.parent.addDialogFields && this.parent.addDialogFields.length === 0) {
            this.updatedAddFields = this.getDefaultDialogFields();
            this.updatedAddFields = this.validateDialogFields(this.updatedAddFields);
        }
        else {
            this.updatedAddFields = this.validateDialogFields(this.parent.addDialogFields);
        }
    }
    validateDialogFields(dialogFields) {
        let newDialogFields = [];
        let emptyCustomColumn = 0;
        for (let i = 0; i < dialogFields.length; i++) {
            let fieldItem = getActualProperties(dialogFields[i]);
            if (fieldItem.type === 'General' && (isNullOrUndefined(fieldItem.fields) || fieldItem.fields.length === 0)) {
                fieldItem.fields = this.getGeneralColumnFields();
            }
            if (fieldItem.type === 'Dependency' && isNullOrUndefined(this.parent.taskFields.dependency)
                || fieldItem.type === 'Resources' && isNullOrUndefined(this.parent.taskFields.resourceInfo)
                || fieldItem.type === 'Notes' && isNullOrUndefined(this.parent.taskFields.notes)) {
                continue;
            }
            if (fieldItem.type === 'Custom' && (isNullOrUndefined(fieldItem.fields) || fieldItem.fields.length === 0)) {
                emptyCustomColumn += 1;
                fieldItem.fields = this.getCustomColumnFields();
            }
            if (emptyCustomColumn > 1) {
                continue;
            }
            newDialogFields.push(fieldItem);
        }
        return newDialogFields;
    }
    /**
     * Method to get general column fields
     */
    getGeneralColumnFields() {
        let fields = [];
        for (let key of Object.keys(this.parent.columnMapping)) {
            if (key === 'dependency' || key === 'resourceInfo' || key === 'notes') {
                continue;
            }
            fields.push(this.parent.columnMapping[key]);
        }
        return fields;
    }
    /**
     * Method to get custom column fields
     */
    getCustomColumnFields() {
        let fields = [];
        for (let i = 0; i < this.parent.customColumns.length; i++) {
            fields.push(this.parent.customColumns[i]);
        }
        return fields;
    }
    /**
     * Get default dialog fields when fields are not defined for add and edit dialogs
     */
    getDefaultDialogFields() {
        let dialogFields = [];
        let fieldItem = {};
        let fields;
        if (Object.keys(this.parent.columnMapping).length !== 0) {
            fieldItem.type = 'General';
            fields = this.getGeneralColumnFields();
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('dependency', this.parent.columnMapping))) {
            fieldItem = {};
            fieldItem.type = 'Dependency';
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('resourceInfo', this.parent.columnMapping))) {
            fieldItem = {};
            fieldItem.type = 'Resources';
            dialogFields.push(fieldItem);
        }
        if (!isNullOrUndefined(getValue('notes', this.parent.columnMapping))) {
            fieldItem = {};
            fieldItem.type = 'Notes';
            dialogFields.push(fieldItem);
        }
        if (this.parent.customColumns.length > 0) {
            fieldItem = {};
            fieldItem.type = 'Custom';
            dialogFields.push(fieldItem);
        }
        return dialogFields;
    }
    /**
     * @private
     */
    openAddDialog() {
        this.isEdit = false;
        this.editedRecord = this.composeAddRecord();
        this.createDialog();
    }
    /**
     *
     * @return {Date}
     * @private
     */
    getMinimumStartDate() {
        let minDate = DataUtil.aggregates.min(this.parent.flatData, 'ganttProperties.startDate');
        if (!isNullOrUndefined(minDate)) {
            return new Date(minDate.getTime());
        }
        else {
            return new Date(this.parent.timelineModule.timelineStartDate.getTime());
        }
    }
    /**
     * @private
     */
    composeAddRecord() {
        let tempData = {};
        tempData.ganttProperties = {};
        let columns = this.parent.ganttColumns;
        let taskSettings = this.parent.taskFields;
        let id = this.parent.editModule.getNewTaskId();
        for (let i = 0; i < columns.length; i++) {
            let field = columns[i].field;
            if (field === taskSettings.id) {
                tempData[field] = id;
                tempData.ganttProperties.taskId = tempData[field];
            }
            else if (columns[i].field === taskSettings.startDate) {
                if (isNullOrUndefined(tempData[taskSettings.endDate])) {
                    tempData[field] = this.getMinimumStartDate();
                }
                else {
                    tempData[field] = new Date(tempData[taskSettings.endDate]);
                }
                tempData.ganttProperties.startDate = new Date(tempData[field]);
            }
            else if (columns[i].field === taskSettings.endDate) {
                if (isNullOrUndefined(tempData[taskSettings.startDate])) {
                    tempData[field] = this.getMinimumStartDate();
                }
                else {
                    tempData[field] = new Date(tempData[taskSettings.startDate]);
                }
                tempData.ganttProperties.endDate = new Date(tempData[field]);
            }
            else if (columns[i].field === taskSettings.duration) {
                tempData[field] = 1;
                tempData.ganttProperties.duration = tempData[field];
                tempData.ganttProperties.durationUnit = this.parent.durationUnit.toLocaleLowerCase();
            }
            else if (columns[i].field === taskSettings.name) {
                tempData[field] = 'New Task ' + id;
                tempData.ganttProperties.taskName = tempData[field];
            }
            else if (columns[i].field === taskSettings.progress) {
                tempData[field] = 0;
                tempData.ganttProperties.progress = tempData[field];
            }
            else {
                tempData[this.parent.ganttColumns[i].field] = '';
            }
        }
        return tempData;
    }
    /**
     * @private
     */
    openToolbarEditDialog() {
        let gObj = this.parent;
        if (gObj.editModule && gObj.editSettings.allowEditing) {
            let selectedRowId = gObj.selectionModule ?
                (gObj.selectionSettings.mode === 'Row' || gObj.selectionSettings.mode === 'Both') &&
                    gObj.selectionModule.selectedRowIndexes.length === 1 ?
                    gObj.currentViewData[gObj.selectionModule.selectedRowIndexes[0]].ganttProperties.taskId :
                    gObj.selectionSettings.mode === 'Cell' &&
                        gObj.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        gObj.currentViewData[gObj.selectionModule.getSelectedRowCellIndexes()[0].rowIndex].ganttProperties.taskId :
                        null : null;
            if (!isNullOrUndefined(selectedRowId)) {
                this.openEditDialog(selectedRowId);
            }
        }
    }
    /**
     * @param taskId
     * @private
     */
    openEditDialog(taskId) {
        let ganttObj = this.parent;
        if (typeof taskId === 'object') {
            this.rowIndex = this.parent.currentViewData.indexOf(taskId);
            if (this.rowIndex > -1) {
                this.rowData = taskId;
            }
        }
        else if (!isNullOrUndefined(taskId)) {
            this.rowIndex = ganttObj.ids.indexOf(taskId.toString());
            if (this.rowIndex > -1) {
                this.rowData = ganttObj.flatData[this.rowIndex];
            }
        }
        else if (ganttObj.selectedRowIndex > -1) {
            this.rowData = ganttObj.currentViewData[ganttObj.selectedRowIndex];
            this.rowIndex = ganttObj.selectedRowIndex;
        }
        this.isEdit = true;
        this.editedRecord = extend({}, {}, this.rowData, true);
        this.createDialog();
    }
    createDialog() {
        let ganttObj = this.parent;
        let dialogModel = {};
        this.beforeOpenArgs.dialogModel = dialogModel;
        this.beforeOpenArgs.rowData = this.editedRecord;
        this.beforeOpenArgs.rowIndex = this.rowIndex;
        this.dialog = this.parent.createElement('div', { id: ganttObj.element.id + '_dialog', styles: 'max-width:600px' });
        ganttObj.element.appendChild(this.dialog);
        let position = { X: 'center', Y: 'center' };
        dialogModel.animationSettings = { effect: 'Zoom' };
        dialogModel.header = this.l10n.getConstant(this.isEdit ? 'editDialogTitle' : 'addDialogTitle');
        dialogModel.isModal = true;
        dialogModel.cssClass = 'e-gantt-dialog';
        dialogModel.allowDragging = true;
        dialogModel.showCloseIcon = true;
        dialogModel.position = position;
        //dialogModel.width = '750px';
        dialogModel.target = this.parent.element;
        dialogModel.close = this.dialogClose.bind(this);
        dialogModel.closeOnEscape = true;
        dialogModel.open = (args) => {
            let generalTabElement = getValue('element', args);
            generalTabElement = generalTabElement.querySelector('#' + this.parent.element.id + 'GeneralTabContainer');
            if (generalTabElement && generalTabElement.scrollHeight > generalTabElement.offsetHeight) {
                generalTabElement.classList.add('e-scroll');
            }
            if (this.tabObj.selectedItem === 0) {
                this.tabObj.select(0);
            }
        };
        dialogModel.locale = this.parent.locale;
        dialogModel.buttons = [{
                buttonModel: {
                    content: this.l10n.getConstant('saveButton'), cssClass: 'e-primary'
                },
                click: this.buttonClick.bind(this)
            }, {
                buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('cancel') },
                click: this.buttonClick.bind(this)
            }];
        let tabElement = this.createTab();
        if (!this.beforeOpenArgs.cancel) {
            dialogModel.content = tabElement;
            this.dialogObj = new Dialog(dialogModel);
            this.dialogObj.appendTo(this.dialog);
            let args = {
                requestType: this.isEdit ? 'openEditDialog' : 'openAddDialog',
                data: this.beforeOpenArgs.rowData,
                element: this.dialog,
                cancel: false
            };
            this.parent.trigger('actionComplete', args);
            if (args.cancel) {
                this.resetValues();
            }
        }
    }
    buttonClick(e) {
        let target = e.target;
        target.style.pointerEvents = 'none';
        if ((this.l10n.getConstant('cancel')).toLowerCase() === e.target.innerText.trim().toLowerCase()) {
            if (this.dialog && !this.dialogObj.isDestroyed) {
                this.dialogObj.hide();
                this.dialogClose();
            }
        }
        else {
            this.initiateDialogSave();
            target.style.pointerEvents = 'auto';
        }
    }
    /**
     * @private
     */
    dialogClose() {
        if (this.dialog) {
            this.resetValues();
        }
    }
    resetValues() {
        this.isEdit = false;
        this.editedRecord = {};
        this.rowData = {};
        this.rowIndex = -1;
        this.addedRecord = null;
        this.ganttResources = [];
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.destroyDialogInnerElements();
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    }
    destroyDialogInnerElements() {
        let ganttObj = this.parent;
        let tabModel = this.beforeOpenArgs.tabModel;
        let items = tabModel.items;
        for (let i = 0; i < items.length; i++) {
            let element = items[i].content;
            let id = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.destroyCustomField(element);
                }
                else if (id === 'Dependency') {
                    let gridObj = element.ej2_instances[0];
                    gridObj.destroy();
                }
                else if (id === 'Notes') {
                    let rte = element.ej2_instances[0];
                    rte.destroy();
                }
                else if (id === 'Resources') {
                    let gridObj = element.ej2_instances[0];
                    gridObj.destroy();
                }
                else if (id.indexOf('Custom') !== -1) {
                    this.destroyCustomField(element);
                }
            }
        }
    }
    destroyCustomField(element) {
        let childNodes = element.childNodes;
        let ganttObj = this.parent;
        for (let i = 0; i < childNodes.length; i++) {
            let div = childNodes[i];
            let inputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                let fieldName = inputElement.id.replace(ganttObj.element.id, '');
                /* tslint:disable-next-line:no-any */
                let controlObj = div.querySelector('#' + ganttObj.element.id + fieldName).ej2_instances[0];
                if (controlObj) {
                    controlObj.destroy();
                }
            }
        }
    }
    /**
     * @private
     */
    destroy() {
        this.resetValues();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('chartDblClick', this.dblClickHandler);
    }
    /**
     * Method to get current edit dialog fields value
     */
    getEditFields() {
        if (this.isEdit) {
            return this.updatedEditFields;
        }
        else {
            return this.updatedAddFields;
        }
    }
    createTab() {
        let ganttObj = this.parent;
        let tabModel = {};
        let tabItems = [];
        let dialogSettings = this.getEditFields();
        let tabElement;
        let tasks = ganttObj.taskFields;
        let length = dialogSettings.length;
        tabModel.items = tabItems;
        tabModel.locale = this.parent.locale;
        this.beforeOpenArgs.tabModel = tabModel;
        let index = 0;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                let dialogField = dialogSettings[i];
                let tabItem = {};
                if (dialogField.type === 'General') {
                    if (Object.keys(ganttObj.columnMapping).length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.l10n.getConstant('generalTab');
                    }
                    tabItem.content = 'General';
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
                }
                else if (dialogField.type === 'Dependency') {
                    if (isNullOrUndefined(tasks.dependency)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.l10n.getConstant('dependency');
                    }
                    tabItem.content = 'Dependency';
                    this.beforeOpenArgs[tabItem.content] = this.getPredecessorModel(dialogField.fields);
                }
                else if (dialogField.type === 'Resources') {
                    if (isNullOrUndefined(tasks.resourceInfo)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.l10n.getConstant('resourceName');
                    }
                    tabItem.content = 'Resources';
                    this.beforeOpenArgs[tabItem.content] = this.getResourcesModel(dialogField.fields);
                }
                else if (dialogField.type === 'Notes') {
                    if (isNullOrUndefined(tasks.notes)) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.l10n.getConstant('notes');
                    }
                    tabItem.content = 'Notes';
                    this.beforeOpenArgs[tabItem.content] = this.getNotesModel(dialogField.fields);
                }
                else {
                    if (isNullOrUndefined(dialogField.fields) || dialogField.fields.length === 0) {
                        continue;
                    }
                    if (isNullOrUndefined(dialogField.headerText)) {
                        dialogField.headerText = this.l10n.getConstant('customTab');
                        
                    }
                    tabItem.content = 'Custom' + '' + index++;
                    this.beforeOpenArgs[tabItem.content] = this.getFieldsModel(dialogField.fields);
                }
                tabItem.header = { text: dialogField.headerText };
                tabItems.push(tabItem);
            }
        }
        this.beforeOpenArgs.requestType = this.isEdit ? 'beforeOpenEditDialog' : 'beforeOpenAddDialog';
        this.renderTabItems();
        this.parent.trigger('actionBegin', this.beforeOpenArgs);
        if (this.beforeOpenArgs.cancel) {
            return tabElement;
        }
        this.tabObj = new Tab(tabModel);
        tabElement = this.parent.createElement('div', { id: ganttObj.element.id + '_Tab' });
        this.tabObj.appendTo(tabElement);
        return tabElement;
    }
    getFieldsModel(fields) {
        let fieldsModel = {};
        let columnByField = this.parent.columnByField;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] === this.parent.taskFields.dependency ||
                fields[i] === this.parent.taskFields.resourceInfo ||
                fields[i] === this.parent.taskFields.notes) {
                continue;
            }
            if (!isNullOrUndefined(columnByField[fields[i]])) {
                let fieldName = fields[i];
                this.createInputModel(columnByField[fieldName], fieldsModel);
            }
        }
        return fieldsModel;
    }
    createInputModel(column, fieldsModel) {
        let ganttObj = this.parent;
        let locale = this.parent.locale;
        let taskSettings = this.parent.taskFields;
        let common = {
            placeholder: column.headerText,
            floatLabelType: 'Auto',
        };
        switch (column.editType) {
            case EditType.Boolean:
                let checkboxModel = {
                    label: column.headerText,
                    locale: locale,
                };
                fieldsModel[column.field] = checkboxModel;
                break;
            case EditType.String:
                let textBox = common;
                if (column.field === ganttObj.columnMapping.duration) {
                    textBox.change = (args) => {
                        this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = common;
                break;
            case EditType.Numeric:
                let numeric = common;
                fieldsModel[column.field] = numeric;
                break;
            case EditType.DatePicker:
                let datePickerObj = common;
                datePickerObj.format = this.parent.dateFormat;
                datePickerObj.firstDayOfWeek = ganttObj.timelineModule.customTimelineSettings.weekStartDay;
                if (column.field === ganttObj.columnMapping.startDate ||
                    column.field === ganttObj.columnMapping.endDate) {
                    datePickerObj.renderDayCell = this.parent.renderWorkingDayCell.bind(this.parent);
                    datePickerObj.change = (args) => {
                        this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = datePickerObj;
                break;
            case EditType.DateTimePicker:
                let dateTimePickerObj = common;
                dateTimePickerObj.format = this.parent.dateFormat;
                dateTimePickerObj.firstDayOfWeek = ganttObj.timelineModule.customTimelineSettings.weekStartDay;
                if (column.field === ganttObj.columnMapping[taskSettings.startDate] ||
                    column.field === ganttObj.columnMapping[taskSettings.endDate]) {
                    dateTimePickerObj.renderDayCell = this.parent.renderWorkingDayCell.bind(this.parent);
                    dateTimePickerObj.change = (args) => {
                        this.validateScheduleFields(args, column, ganttObj);
                    };
                }
                fieldsModel[column.field] = dateTimePickerObj;
                break;
            case EditType.DropDown:
                fieldsModel[column.field] = common;
                break;
            case EditType.Masked:
                fieldsModel[column.field] = common;
                break;
        }
        if (!isNullOrUndefined(column.edit)) {
            extend(fieldsModel[column.field], column.edit.params);
        }
        return fieldsModel;
    }
    validateScheduleFields(args, column, ganttObj) {
        let dialog = ganttObj.editModule.dialogModule.dialog;
        let targetId = null;
        let inputElement;
        let currentData = ganttObj.editModule.dialogModule.editedRecord;
        if (!isNullOrUndefined(args.element)) {
            inputElement = args.element;
            targetId = inputElement.getAttribute('id');
        }
        else if (!isNullOrUndefined(args.container)) {
            inputElement = args.container;
            targetId = inputElement.querySelector('input').getAttribute('id');
            inputElement = inputElement.querySelector('#' + targetId);
        }
        let cellValue = inputElement.value;
        let colName = targetId.replace(ganttObj.element.id, '');
        this.validateScheduleValuesByCurrentField(colName, cellValue, this.editedRecord);
        let ganttProp = currentData.ganttProperties;
        let tasks = ganttObj.taskFields;
        if (!isNullOrUndefined(tasks.startDate)) {
            this.updateScheduleFields(dialog, ganttProp, 'startDate');
        }
        if (!isNullOrUndefined(tasks.endDate)) {
            this.updateScheduleFields(dialog, ganttProp, 'endDate');
        }
        if (!isNullOrUndefined(tasks.duration)) {
            this.updateScheduleFields(dialog, ganttProp, 'duration');
        }
        this.dialogEditValidationFlag = false;
        return true;
    }
    updateScheduleFields(dialog, ganttProp, ganttField) {
        let ganttObj = this.parent;
        let ganttId = ganttObj.element.id;
        let columnName = getValue(ganttField, ganttObj.columnMapping);
        let col = ganttObj.columnByField[columnName];
        let tempValue;
        if (col.editType === EditType.String) {
            let textBox = dialog.querySelector('#' + ganttId + columnName).ej2_instances[0];
            tempValue = this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
            if (textBox.value !== tempValue) {
                textBox.value = tempValue;
                textBox.dataBind();
            }
        }
        else if (col.editType === EditType.DatePicker || col.editType === EditType.DateTimePicker) {
            let picker = col.editType === EditType.DatePicker ?
                dialog.querySelector('#' + ganttId + columnName).ej2_instances[0] :
                dialog.querySelector('#' + ganttId + columnName).ej2_instances[0];
            tempValue = ganttProp[ganttField];
            if (((isNullOrUndefined(picker.value)) && !isNullOrUndefined(tempValue)) ||
                (isNullOrUndefined(tempValue) && !isNullOrUndefined(picker.value)) ||
                (picker.value !== tempValue && picker.value.toString() !== tempValue.toString())) {
                picker.value = tempValue;
                picker.dataBind();
            }
        }
    }
    validateDuration(ganttData) {
        let ganttProp = ganttData.ganttProperties;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.duration)) {
                this.parent.setRecordValue('endDate', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            }
            else if (isScheduledTask(ganttProp) || !isNullOrUndefined(ganttProp.startDate)) {
                if (ganttData.ganttProperties.isMilestone && ganttData.ganttProperties.duration !== 0) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                this.parent.dateValidationModule.calculateEndDate(ganttData);
            }
            else if (!isScheduledTask(ganttProp) && !isNullOrUndefined(ganttProp.endDate)) {
                this.parent.dateValidationModule.calculateStartDate(ganttData);
            }
            let milestone = ganttProp.duration === 0 ? true : false;
            this.parent.setRecordValue('isMilestone', milestone, ganttProp, true);
            this.dialogEditValidationFlag = true;
        }
    }
    validateStartDate(ganttData) {
        let ganttProp = ganttData.ganttProperties;
        let tasks = this.parent.taskFields;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.startDate)) {
                this.parent.setRecordValue('endDate', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            }
            else if (isScheduledTask(ganttProp)) {
                if (isNullOrUndefined(tasks.duration)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
                else if (isNullOrUndefined(tasks.endDate)) {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
                else {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
            }
            else {
                if (!isNullOrUndefined(ganttProp.endDate)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
                else if (!isNullOrUndefined(ganttProp.duration)) {
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
            }
            this.dialogEditValidationFlag = true;
        }
    }
    validateEndDate(ganttData) {
        let ganttProp = ganttData.ganttProperties;
        let tasks = this.parent.taskFields;
        if (!this.dialogEditValidationFlag) {
            if (isNullOrUndefined(ganttProp.endDate)) {
                this.parent.setRecordValue('duration', null, ganttProp, true);
                this.parent.setRecordValue('isMilestone', false, ganttProp, true);
            }
            else if (isScheduledTask(ganttProp)) {
                if (isNullOrUndefined(tasks.duration)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
                else if (isNullOrUndefined(ganttProp.startDate)) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                else {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
            }
            else {
                if (!isNullOrUndefined(ganttProp.duration)) {
                    this.parent.dateValidationModule.calculateStartDate(ganttData);
                }
                else if (!isNullOrUndefined(ganttProp.startDate)) {
                    this.parent.dateValidationModule.calculateDuration(ganttData);
                }
            }
            this.dialogEditValidationFlag = true;
        }
    }
    /**
     *
     * @param columnName
     * @param value
     * @param currentData
     * @private
     */
    validateScheduleValuesByCurrentField(columnName, value, currentData) {
        let ganttObj = this.parent;
        let ganttProp = currentData.ganttProperties;
        let taskSettings = ganttObj.taskFields;
        if (taskSettings.duration === columnName) {
            if (!isNullOrUndefined(value) && value !== '') {
                ganttObj.dataOperation.updateDurationValue(value, ganttProp);
            }
            else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('duration', null, ganttProp, true);
                }
            }
            this.validateDuration(currentData);
        }
        if (taskSettings.startDate === columnName) {
            if (value !== '') {
                let startDate = this.parent.dateValidationModule.getDateFromFormat(value);
                startDate = this.parent.dateValidationModule.checkStartDate(startDate);
                this.parent.setRecordValue('startDate', startDate, ganttProp, true);
            }
            else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('startDate', null, ganttProp, true);
                }
            }
            this.validateStartDate(currentData);
        }
        if (taskSettings.endDate === columnName) {
            if (value !== '') {
                let endDate = this.parent.dateValidationModule.getDateFromFormat(value);
                if (endDate.getHours() === 0 && ganttObj.defaultEndTime !== 86400) {
                    this.parent.dateValidationModule.setTime(ganttObj.defaultEndTime, endDate);
                }
                endDate = this.parent.dateValidationModule.checkEndDate(endDate, ganttProp);
                this.parent.setRecordValue('endDate', endDate, ganttProp, true);
            }
            else {
                if (ganttObj.allowUnscheduledTasks) {
                    this.parent.setRecordValue('endDate', null, ganttProp, true);
                }
            }
            this.validateEndDate(currentData);
        }
        return true;
    }
    getPredecessorModel(fields) {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['ID', 'Name', 'Type', 'Offset'];
        }
        let inputModel = {};
        inputModel.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
        inputModel.locale = this.parent.locale;
        inputModel.dataSource = [];
        inputModel.toolbar = [
            {
                id: this.parent.element.id + 'DependencyTabContainer' + '_add', prefixIcon: 'e-add',
                text: this.l10n.getConstant('add'), tooltipText: this.l10n.getConstant('add'), align: 'Right'
            },
            {
                id: this.parent.element.id + 'DependencyTabContainer' + '_delete', prefixIcon: 'e-delete',
                text: this.l10n.getConstant('delete'), tooltipText: this.l10n.getConstant('delete'), align: 'Right'
            }
        ];
        let columns = [];
        for (let i = 0; i < fields.length; i++) {
            let column = {};
            if (fields[i].toLowerCase() === 'id') {
                column = {
                    field: 'id', headerText: this.l10n.getConstant('id'), allowEditing: false, width: '70px'
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'name') {
                column = {
                    field: 'name', headerText: this.l10n.getConstant('name'), editType: EditType.String, width: '250px',
                    validationRules: { required: true }
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'type') {
                column = {
                    field: 'type', headerText: this.l10n.getConstant('type'), editType: EditType.DropDown,
                    dataSource: this.types, foreignKeyField: 'id', foreignKeyValue: 'text',
                    defaultValue: 'FS', validationRules: { required: true }
                };
                columns.push(column);
            }
            else if (fields[i].toLowerCase() === 'offset') {
                column = {
                    field: 'offset', headerText: this.l10n.getConstant('offset'), editType: EditType.String,
                    defaultValue: '0 days', validationRules: { required: true }
                };
                columns.push(column);
            }
        }
        inputModel.columns = columns;
        inputModel.height = '117px';
        return inputModel;
    }
    getResourcesModel(fields) {
        let ganttObj = this.parent;
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = [ganttObj.resourceIDMapping, ganttObj.resourceNameMapping];
        }
        let inputModel = {
            allowFiltering: true,
            locale: this.parent.locale,
            allowSelection: true,
            filterSettings: { type: 'Menu' },
            selectionSettings: { checkboxOnly: true, checkboxMode: 'ResetOnRowClick', persistSelection: true, type: 'Multiple' }
        };
        let columns = [
            { type: 'checkbox', allowEditing: false, allowSorting: false, allowFiltering: false, width: 60 },
        ];
        for (let i = 0; i < fields.length; i++) {
            let column = {};
            if (fields[i] === ganttObj.resourceIDMapping) {
                column = {
                    field: ganttObj.resourceIDMapping,
                    headerText: this.l10n.getConstant('id'), isPrimaryKey: true, width: '100px'
                };
                columns.push(column);
            }
            else if (fields[i] === ganttObj.resourceNameMapping) {
                column = {
                    field: ganttObj.resourceNameMapping, headerText: this.l10n.getConstant('name'),
                };
                columns.push(column);
            }
        }
        inputModel.columns = columns;
        inputModel.height = '160px';
        return inputModel;
    }
    getNotesModel(fields) {
        if (isNullOrUndefined(fields) || fields.length === 0) {
            fields = ['Bold', 'Italic', 'Underline', 'StrikeThrough',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                'LowerCase', 'UpperCase', '|',
                'Alignments', 'OrderedList', 'UnorderedList',
                'Outdent', 'Indent', '|', 'CreateTable',
                'CreateLink', '|', 'ClearFormat', 'Print',
                '|', 'Undo', 'Redo'];
        }
        let inputModel = {
            placeholder: this.l10n.getConstant('writeNotes'),
            toolbarSettings: {
                items: fields
            },
            locale: this.parent.locale
        };
        return inputModel;
    }
    createDivElement(className, id) {
        return createElement('div', { className: className, id: id });
    }
    createInputElement(className, id, fieldName, type) {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', id: id, name: fieldName,
                title: fieldName
            }
        });
    }
    renderTabItems() {
        let tabModel = this.beforeOpenArgs.tabModel;
        let items = tabModel.items;
        let index = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.content instanceof HTMLElement) {
                continue;
            }
            else if (item.content === 'General') {
                item.content = this.renderGeneralTab(item.content);
            }
            else if (item.content === 'Dependency') {
                if (this.editedRecord.hasChildRecords) {
                    item.disabled = true;
                }
                item.content = this.renderPredecessorTab(item.content);
            }
            else if (item.content === 'Resources') {
                item.content = this.renderResourceTab(item.content);
            }
            else if (item.content === ('Custom' + '' + index)) {
                item.content = this.renderCustomTab(item.content);
                index++;
            }
            else if (item.content === 'Notes') {
                item.content = this.renderNotesTab(item.content);
            }
        }
    }
    renderGeneralTab(itemName) {
        let ganttObj = this.parent;
        let itemModel = this.beforeOpenArgs[itemName];
        let divElement = this.createDivElement('e-edit-form-row', ganttObj.element.id
            + '' + itemName + 'TabContainer');
        for (let key of Object.keys(itemModel)) {
            let column = this.parent.columnByField[key];
            let inputModel = itemModel[key];
            divElement.appendChild(this.renderInputElements(inputModel, column));
        }
        return divElement;
    }
    isCheckIsDisabled(column) {
        let disabled = false;
        if (this.isEdit) {
            if (column.field === this.parent.taskFields.id) {
                disabled = true;
            }
            if (this.editedRecord.hasChildRecords) {
                if (column.field === this.parent.taskFields.endDate) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.duration) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.progress) {
                    disabled = true;
                }
                else if (column.field === this.parent.taskFields.progress) {
                    disabled = true;
                }
            }
        }
        return disabled;
    }
    renderPredecessorTab(itemName) {
        let ganttObj = this.parent;
        let gridModel = this.beforeOpenArgs[itemName];
        let ganttData = this.beforeOpenArgs.rowData;
        let preData = [];
        this.taskNameCollection();
        if (this.isEdit) {
            preData = this.predecessorEditCollection(ganttData);
            this.updatePredecessorDropDownData(ganttData);
        }
        gridModel.dataSource = preData;
        let columns = gridModel.columns;
        columns[1].edit = {
            write: (args) => {
                let field = 'name';
                let autoObj = new ComboBox({
                    dataSource: new DataManager(this.preTableCollection),
                    popupHeight: '180px',
                    allowCustom: false,
                    fields: { value: 'text' },
                    value: args.rowData[field],
                    change: (args) => {
                        let tr = closest(args.element, 'tr');
                        let idInput = tr.querySelector('#' + this.parent.element.id + 'DependencyTabContainerid');
                        idInput.value = args.itemData.id;
                    },
                    autofill: true,
                });
                autoObj.appendTo(args.element);
            },
            read: (args) => {
                let ej2Instance = args.ej2_instances[0];
                return ej2Instance.value;
            }
        };
        Grid.Inject(Edit, Page, Toolbar, ForeignKey);
        let gridObj = new Grid(gridModel);
        let divElement = this.createDivElement('e-dependent-div', ganttObj.element.id + '' + itemName + 'TabContainer');
        gridObj.appendTo(divElement);
        return divElement;
    }
    updateResourceCollection(args, resourceGridId) {
        if (!isNullOrUndefined(args.data)) {
            let ganttObj = this.parent;
            let resourceGrid = ganttObj.element.querySelector('#' + resourceGridId).ej2_instances[0];
            if (!isNullOrUndefined(resourceGrid) && resourceGrid.selectionModule.getSelectedRecords().length > 0) {
                this.ganttResources = extend([], resourceGrid.selectionModule.getSelectedRecords());
            }
            else {
                this.ganttResources = [];
            }
        }
    }
    renderResourceTab(itemName) {
        let ganttObj = this.parent;
        let ganttData = this.beforeOpenArgs.rowData;
        let inputModel = this.beforeOpenArgs[itemName];
        let resourceGridId = ganttObj.element.id + '' + itemName + 'TabContainer';
        inputModel.dataSource = ganttObj.resources;
        let resourceInfo = ganttData.ganttProperties.resourceInfo;
        if (this.isEdit && !isNullOrUndefined(resourceInfo)) {
            for (let i = 0; i < resourceInfo.length; i++) {
                this.ganttResources.push(resourceInfo[i]);
            }
        }
        inputModel.rowSelected = (args) => {
            this.updateResourceCollection(args, resourceGridId);
        };
        inputModel.rowDeselected = (args) => {
            this.updateResourceCollection(args, resourceGridId);
        };
        let tabModel = this.beforeOpenArgs.tabModel;
        tabModel.selected = (args) => {
            let title = getValue('selectedItem.textContent', args);
            if (title === 'Resources') {
                let resourceGrid = ganttObj.element.querySelector('#' + resourceGridId).ej2_instances[0];
                let resources = this.ganttResources;
                if (resources && resources.length > 0) {
                    resourceGrid.currentViewData.forEach((data, index) => {
                        for (let i = 0; i < resources.length; i++) {
                            if (data[ganttObj.resourceIDMapping] === resources[i][ganttObj.resourceIDMapping] &&
                                resourceGrid.selectionModule.selectedRowIndexes.indexOf(index) === -1) {
                                resourceGrid.selectRow(index);
                            }
                        }
                    });
                }
            }
            if (title === 'Notes') {
                let notesTabId = '#' + ganttObj.element.id + 'Notes' + 'TabContainer';
                let notesObj = ganttObj.element.querySelector(notesTabId).ej2_instances[0];
                notesObj.refresh();
            }
        };
        let divElement = this.createDivElement('e-resource-div', resourceGridId);
        Grid.Inject(Selection, Filter);
        let gridObj = new Grid(inputModel);
        gridObj.appendTo(divElement);
        return divElement;
    }
    renderCustomTab(itemName) {
        return this.renderGeneralTab(itemName);
    }
    renderNotesTab(itemName) {
        let ganttObj = this.parent;
        let inputModel = this.beforeOpenArgs[itemName];
        let ganttProp = this.editedRecord.ganttProperties;
        let divElement = this.createDivElement('', ganttObj.element.id + '' + itemName + 'TabContainer');
        RichTextEditor.Inject(Toolbar$2, Link, HtmlEditor, QuickToolbar, Count);
        inputModel.value = ganttProp.notes;
        let rteObj = new RichTextEditor(inputModel);
        rteObj.appendTo(divElement);
        return divElement;
    }
    renderInputElements(inputModel, column) {
        let ganttId = this.parent.element.id;
        let ganttData = this.editedRecord;
        let divElement = this.createDivElement('e-edit-form-column');
        let inputElement = this.createInputElement('', ganttId + '' + column.field, column.field);
        divElement.appendChild(inputElement);
        inputModel.enabled = !this.isCheckIsDisabled(column);
        if (column.field === this.parent.taskFields.duration) {
            let ganttProp = ganttData.ganttProperties;
            inputModel.value = this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
        }
        else {
            inputModel.value = ganttData[column.field];
        }
        let inputObj = new this.inputs[column.editType](inputModel);
        inputObj.appendTo(inputElement);
        return divElement;
    }
    ;
    taskNameCollection() {
        let flatData = this.parent.flatData;
        this.preTaskIds = [];
        this.preTableCollection = [];
        for (let i = 0; i < flatData.length; i++) {
            let data = flatData[i];
            if (data.hasChildRecords) {
                continue;
            }
            let tempObject = {
                id: data.ganttProperties.taskId.toString(),
                text: (data.ganttProperties.taskId.toString() + '-' + data.ganttProperties.taskName),
                value: data.ganttProperties.taskId.toString()
            };
            this.preTaskIds.push(tempObject.id);
            this.preTableCollection.push(tempObject);
        }
    }
    predecessorEditCollection(ganttData) {
        let preDataCollection = [];
        let ganttProp = ganttData.ganttProperties;
        if (this.isEdit && !isNullOrUndefined(this.parent.taskFields.dependency) && !isNullOrUndefined(ganttData) &&
            !isNullOrUndefined(ganttProp.predecessor)) {
            let predecessor = ganttProp.predecessor;
            let idCollection = this.preTableCollection;
            for (let i = 0; i < predecessor.length; i++) {
                let from = predecessor[i].from.toString();
                let preData = {};
                if (ganttProp.taskId.toString() !== from) {
                    preData.id = from;
                    for (let index = 0; index < idCollection.length; index++) {
                        if (idCollection[index].value === from) {
                            preData.name = idCollection[index].text;
                            break;
                        }
                    }
                    preData.type = predecessor[i].type;
                    let offset = Math.abs(predecessor[i].offset);
                    let offsetUnit = predecessor[i].offsetUnit;
                    preData.offset = this.parent.dataOperation.getDurationString(offset, offsetUnit);
                    preDataCollection.push(preData);
                }
            }
        }
        return preDataCollection;
    }
    updatePredecessorDropDownData(ganttData) {
        let index = -1;
        let id = ganttData.ganttProperties.taskId.toString();
        index = this.preTaskIds.indexOf(id);
        this.preTableCollection.splice(index, 1);
        this.preTaskIds.splice(index, 1);
        this.validSuccessorTasks(ganttData, this.preTaskIds, this.preTableCollection);
    }
    validSuccessorTasks(data, ids, idCollection) {
        let ganttProp = data.ganttProperties;
        if (ganttProp.predecessor && ganttProp.predecessor.length > 0) {
            let predecessor = ganttProp.predecessor;
            let fromId = ganttProp.taskId.toString();
            predecessor.forEach((item) => {
                if (item.from.toString() === fromId) {
                    let toId = item.to;
                    let idIndex = -1;
                    idIndex = ids.indexOf(toId);
                    if (idIndex > -1) {
                        ids.splice(idIndex, 1);
                        idCollection.splice(idIndex, 1);
                    }
                    let ganttData = this.parent.getRecordByID(toId);
                    this.validSuccessorTasks(ganttData, ids, idCollection);
                }
            });
        }
    }
    getPredecessorType() {
        let localeObj = this.parent.localeObj;
        let typeText = [this.parent.getPredecessorTextValue('SS'), this.parent.getPredecessorTextValue('SF'),
            this.parent.getPredecessorTextValue('FS'), this.parent.getPredecessorTextValue('FF')];
        let types = [
            { id: 'FS', text: typeText[2], value: typeText[2] },
            { id: 'FF', text: typeText[3], value: typeText[3] },
            { id: 'SS', text: typeText[0], value: typeText[0] },
            { id: 'SF', text: typeText[1], value: typeText[1] }
        ];
        return types;
    }
    initiateDialogSave() {
        if (this.isEdit) {
            this.parent.initiateEditAction(true);
        }
        else {
            this.addedRecord = {};
        }
        let ganttObj = this.parent;
        let tabModel = this.beforeOpenArgs.tabModel;
        let items = tabModel.items;
        for (let i = 0; i < items.length; i++) {
            let element = items[i].content;
            let id = element.id;
            if (!isNullOrUndefined(id) || id !== '') {
                id = id.replace(ganttObj.element.id, '');
                id = id.replace('TabContainer', '');
                if (id === 'General') {
                    this.updateGeneralTab(element, false);
                }
                else if (id === 'Dependency') {
                    this.updatePredecessorTab(element);
                }
                else if (id === 'Notes') {
                    this.updateNotesTab(element);
                }
                else if (id === 'Resources') {
                    this.updateResourceTab(element);
                }
                else if (id.indexOf('Custom') !== -1) {
                    this.updateCustomTab(element);
                }
            }
        }
        if (this.isEdit) {
            /**
             * If any update on edited task do it here
             */
            this.parent.dataOperation.updateWidthLeft(this.rowData);
            let editArgs = {
                data: this.rowData,
                action: 'DialogEditing'
            };
            this.parent.editModule.initiateUpdateAction(editArgs);
        }
        else {
            this.parent.editModule.addRecord(this.addedRecord, this.parent.editSettings.newRowPosition);
        }
        return true;
    }
    updateGeneralTab(generalForm, isCustom) {
        let ganttObj = this.parent;
        let childNodes = generalForm.childNodes;
        let tasksData = {};
        if (!this.isEdit) {
            tasksData = this.addedRecord;
        }
        for (let i = 0; i < childNodes.length; i++) {
            let div = childNodes[i];
            let inputElement = div.querySelector('input[id^="' + ganttObj.element.id + '"]');
            if (inputElement) {
                let fieldName = inputElement.id.replace(ganttObj.element.id, '');
                let controlObj = div.querySelector('#' + ganttObj.element.id + fieldName).ej2_instances[0];
                tasksData[fieldName] = controlObj.value;
            }
        }
        if (this.isEdit) {
            this.updateScheduleProperties(this.editedRecord, this.rowData);
            ganttObj.editModule.validateUpdateValues(tasksData, this.rowData, true);
        }
    }
    updateScheduleProperties(fromRecord, toRecord) {
        this.parent.setRecordValue('startDate', fromRecord.ganttProperties.startDate, toRecord.ganttProperties, true);
        this.parent.setRecordValue('endDate', fromRecord.ganttProperties.endDate, toRecord.ganttProperties, true);
        this.parent.setRecordValue('duration', fromRecord.ganttProperties.duration, toRecord.ganttProperties, true);
        this.parent.setRecordValue('durationUnit', fromRecord.ganttProperties.durationUnit, toRecord.ganttProperties, true);
        if (!isNullOrUndefined(this.parent.taskFields.startDate)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.startDate);
        }
        if (!isNullOrUndefined(this.parent.taskFields.endDate)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.endDate);
        }
        if (!isNullOrUndefined(this.parent.taskFields.duration)) {
            this.parent.dataOperation.updateMappingData(this.rowData, this.parent.taskFields.duration);
            this.parent.setRecordValue('durationUnit', fromRecord.ganttProperties.durationUnit, this.rowData, true);
            if (this.rowData.ganttProperties.duration === 0) {
                this.parent.setRecordValue('isMilestone', true, this.rowData.ganttProperties, true);
            }
            else {
                this.parent.setRecordValue('isMilestone', false, this.rowData.ganttProperties, true);
            }
        }
    }
    updatePredecessorTab(preElement) {
        let gridObj = preElement.ej2_instances[0];
        if (gridObj.isEdit) {
            gridObj.endEdit();
        }
        let dataSource = gridObj.dataSource;
        let predecessorName = [];
        let newValues = [];
        let predecessorString = '';
        let ids = [];
        for (let i = 0; i < dataSource.length; i++) {
            let preData = dataSource[i];
            if (ids.indexOf(preData.id) === -1) {
                let name = preData.id + preData.type;
                if (preData.offset && preData.offset.indexOf('-') !== -1) {
                    name += preData.offset;
                }
                else {
                    name += ('+' + preData.offset);
                }
                predecessorName.push(name);
                ids.push(preData.id);
            }
        }
        if (this.isEdit) {
            if (predecessorName.length > 0) {
                newValues = this.parent.predecessorModule.calculatePredecessor(predecessorName.join(','), this.rowData);
                this.parent.setRecordValue('predecessor', newValues, this.rowData.ganttProperties, true);
                predecessorString = this.parent.predecessorModule.getPredecessorStringValue(this.rowData);
            }
            else {
                newValues = [];
                this.parent.setRecordValue('predecessor', newValues, this.rowData.ganttProperties, true);
                predecessorString = '';
            }
            this.parent.setRecordValue('predecessorsName', predecessorString, this.rowData.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, this.rowData);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, this.rowData);
        }
        else {
            this.addedRecord[this.parent.taskFields.dependency] = predecessorName.length > 0 ? predecessorName.join(',') : '';
        }
    }
    updateResourceTab(resourceElement) {
        let gridObj = resourceElement.ej2_instances[0];
        let selectedItems = this.ganttResources;
        let idArray = [];
        if (this.isEdit) {
            this.parent.setRecordValue('resourceInfo', selectedItems, this.rowData.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(this.rowData, 'resourceInfo');
        }
        else {
            for (let i = 0; i < selectedItems.length; i++) {
                idArray.push(selectedItems[i][this.parent.resourceIDMapping]);
            }
            this.addedRecord[this.parent.taskFields.resourceInfo] = idArray;
        }
    }
    updateNotesTab(notesElement) {
        let ganttObj = this.parent;
        let rte = notesElement.ej2_instances[0];
        if (this.isEdit) {
            this.parent.setRecordValue('notes', rte.getHtml(), this.rowData.ganttProperties, true);
            ganttObj.dataOperation.updateMappingData(this.rowData, 'notes');
        }
        else {
            this.addedRecord[this.parent.taskFields.notes] = rte.getHtml();
        }
    }
    updateCustomTab(customElement) {
        this.updateGeneralTab(customElement, true);
    }
}

/**
 * Gantt Edit Module
 */
class Edit$2 {
    constructor(parent) {
        this.isFromDeleteMethod = false;
        this.targetedRecords = [];
        this.confirmDialog = null;
        this.taskbarMoved = false;
        this.predecessorUpdated = false;
        this.isBreakLoop = false;
        /**
         * @private
         */
        this.deletedTaskDetails = [];
        this.parent = parent;
        this.validatedChildItems = [];
        if (this.parent.editSettings.allowEditing && this.parent.editSettings.mode === 'Auto') {
            this.cellEditModule = new CellEdit(this.parent);
        }
        if (this.parent.editSettings.allowAdding || (this.parent.editSettings.allowEditing &&
            (this.parent.editSettings.mode === 'Dialog' || this.parent.editSettings.mode === 'Auto'))) {
            this.dialogModule = new DialogEdit(this.parent);
            if (this.parent.editSettings.mode === 'Dialog') {
                this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
            }
        }
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.taskbarEditModule = new TaskbarEdit(this.parent);
        }
        if (this.parent.editSettings.allowDeleting) {
            let confirmDialog = createElement('div', {
                id: this.parent.element.id + '_deleteConfirmDialog',
            });
            this.parent.element.appendChild(confirmDialog);
            this.renderDeleteConfirmDialog();
        }
        this.parent.treeGrid.editSettings.allowAdding = this.parent.editSettings.allowAdding;
        this.parent.treeGrid.editSettings.allowDeleting = this.parent.editSettings.allowDeleting;
        this.parent.treeGrid.editSettings.showDeleteConfirmDialog = this.parent.editSettings.showDeleteConfirmDialog;
    }
    getModuleName() {
        return 'edit';
    }
    recordDoubleClick(args) {
        let ganttData;
        if (args.row) {
            let rowIndex = getValue('rowIndex', args.row);
            ganttData = this.parent.currentViewData[rowIndex];
        }
        if (!isNullOrUndefined(ganttData) && this.parent.editSettings.allowEditing) {
            this.dialogModule.openEditDialog(ganttData);
        }
    }
    /**
     * @private
     */
    destroy() {
        if (this.cellEditModule) {
            this.cellEditModule.destroy();
        }
        if (this.taskbarEditModule) {
            this.taskbarEditModule.destroy();
        }
        if (this.dialogModule) {
            this.dialogModule.destroy();
        }
        if (this.confirmDialog && !this.confirmDialog.isDestroyed) {
            this.confirmDialog.destroy();
        }
    }
    /**
     * Method to update task with new values
     */
    updateRecordByID(data) {
        let tasks = this.parent.taskFields;
        let ganttData = this.parent.getRecordByID(data[tasks.id]);
        if (!isNullOrUndefined(this.parent.editModule) && ganttData) {
            this.parent.isOnEdit = true;
            this.validateUpdateValues(data, ganttData, true);
            let keys = Object.keys(data);
            if (keys.indexOf(tasks.startDate) !== -1 || keys.indexOf(tasks.endDate) !== -1 ||
                keys.indexOf(tasks.duration) !== -1) {
                this.parent.dataOperation.calculateScheduledValues(ganttData, ganttData.taskData, false);
            }
            this.parent.dataOperation.updateWidthLeft(ganttData);
            if (!isUndefined(data[this.parent.taskFields.dependency]) &&
                data[this.parent.taskFields.dependency] !== ganttData.ganttProperties.predecessorsName) {
                this.parent.connectorLineEditModule.updatePredecessor(ganttData, data[this.parent.taskFields.dependency]);
            }
            else {
                let args = {};
                args.data = ganttData;
                this.parent.editModule.initiateUpdateAction(args);
            }
        }
    }
    /**
     *
     * @param data
     * @param ganttData
     * @param isFromDialog
     * @private
     */
    validateUpdateValues(data, ganttData, isFromDialog) {
        let ganttObj = this.parent;
        let tasks = ganttObj.taskFields;
        let ganttPropByMapping = getSwapKey(ganttObj.columnMapping);
        let scheduleFieldNames = [];
        let isScheduleValueUpdated = false;
        for (let key of Object.keys(data)) {
            if (isNullOrUndefined(key)) {
                continue;
            }
            if ([tasks.startDate, tasks.endDate, tasks.duration].indexOf(key) !== -1) {
                if (isFromDialog) {
                    if (tasks.duration === key) {
                        ganttObj.dataOperation.updateDurationValue(data[key], ganttData.ganttProperties);
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key]);
                    }
                    else {
                        ganttObj.setRecordValue(ganttPropByMapping[key], data[key], ganttData.ganttProperties, true);
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key]);
                    }
                }
                else {
                    scheduleFieldNames.push(key);
                    isScheduleValueUpdated = true;
                }
            }
            else if (tasks.resourceInfo === key) {
                let resourceData = ganttObj.dataOperation.setResourceInfo(data);
                ganttData.ganttProperties.resourceInfo = resourceData;
                ganttObj.dataOperation.updateMappingData(ganttData, 'resourceInfo');
            }
            else if (tasks.dependency === key) {
                //..
            }
            else if ([tasks.progress, tasks.notes, tasks.durationUnit, tasks.expandState,
                tasks.milestone, tasks.name, tasks.baselineStartDate,
                tasks.baselineEndDate, tasks.indicators, tasks.id].indexOf(key) !== -1) {
                let column = ganttObj.columnByField[key];
                /* tslint:disable-next-line */
                let value = data[key];
                if (column.editType === EditType.DatePicker || column.editType === EditType.DateTimePicker) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                let ganttPropKey = ganttPropByMapping[key];
                if (key === tasks.id) {
                    ganttPropKey = 'taskId';
                }
                else if (key === tasks.name) {
                    ganttPropKey = 'taskName';
                }
                ganttObj.setRecordValue(ganttPropKey, value, ganttData.ganttProperties, true);
                if ((key === tasks.baselineStartDate || key === tasks.baselineEndDate) &&
                    (ganttData.ganttProperties.baselineStartDate && ganttData.ganttProperties.baselineEndDate)) {
                    ganttObj.setRecordValue('baselineLeft', ganttObj.dataOperation.calculateBaselineLeft(ganttData.ganttProperties), ganttData.ganttProperties, true);
                    ganttObj.setRecordValue('baselineWidth', ganttObj.dataOperation.calculateBaselineWidth(ganttData.ganttProperties), ganttData.ganttProperties, true);
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            }
            else if (ganttObj.customColumns.indexOf(key) !== -1) {
                let column = ganttObj.columnByField[key];
                /* tslint:disable-next-line */
                let value = data[key];
                if (column.editType === EditType.DatePicker || column.editType === EditType.DateTimePicker) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            }
        }
        if (isScheduleValueUpdated) {
            this.validateScheduleValues(scheduleFieldNames, ganttData, data);
        }
    }
    validateScheduleValues(fieldNames, ganttData, data) {
        let ganttObj = this.parent;
        if (fieldNames.length > 2) {
            ganttObj.dataOperation.calculateScheduledValues(ganttData, data, false);
        }
        else if (fieldNames.length > 1) {
            this.validateScheduleByTwoValues(data, fieldNames, ganttData);
        }
        else {
            this.dialogModule.validateScheduleValuesByCurrentField(fieldNames[0], data[fieldNames[0]], ganttData);
        }
    }
    validateScheduleByTwoValues(data, fieldNames, ganttData) {
        let ganttObj = this.parent;
        let startDate;
        let endDate;
        let duration;
        let tasks = ganttObj.taskFields;
        let ganttProp = ganttData.ganttProperties;
        let isUnscheduledTask = ganttObj.allowUnscheduledTasks;
        if (fieldNames.indexOf(tasks.startDate) !== -1) {
            startDate = data[tasks.startDate];
        }
        if (fieldNames.indexOf(tasks.endDate) !== -1) {
            endDate = data[tasks.endDate];
        }
        if (fieldNames.indexOf(tasks.duration) !== -1) {
            duration = data[tasks.duration];
        }
        if (startDate && endDate || (isUnscheduledTask && (fieldNames.indexOf(tasks.startDate) !== -1) &&
            (fieldNames.indexOf(tasks.endDate) !== -1))) {
            ganttObj.setRecordValue('startDate', ganttObj.dataOperation.getDateFromFormat(startDate), ganttProp, true);
            ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(endDate), ganttProp, true);
            ganttObj.dataOperation.calculateDuration(ganttData);
        }
        else if (endDate && duration || (isUnscheduledTask &&
            (fieldNames.indexOf(tasks.endDate) !== -1) && (fieldNames.indexOf(tasks.duration) !== -1))) {
            ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(endDate), ganttProp, true);
            ganttObj.dataOperation.updateDurationValue(duration, ganttProp);
        }
        else if (startDate && duration || (isUnscheduledTask && (fieldNames.indexOf(tasks.startDate) !== -1)
            && (fieldNames.indexOf(tasks.duration) !== -1))) {
            ganttObj.setRecordValue('startDate', ganttObj.dataOperation.getDateFromFormat(startDate), ganttProp, true);
            ganttObj.dataOperation.updateDurationValue(duration, ganttProp);
        }
    }
    isTaskbarMoved(data) {
        let isMoved = false;
        let taskData = data.ganttProperties;
        let prevData = this.parent.previousRecords[data.uniqueID];
        if (prevData.ganttProperties) {
            let prevStart = getValue('ganttProperties.startDate', prevData);
            let prevEnd = getValue('ganttProperties.endDate', prevData);
            let prevDuration = getValue('ganttProperties.duration', prevData);
            let prevDurationUnit = getValue('ganttProperties.durationUnit', prevData);
            let keys = Object.keys(prevData.ganttProperties);
            if (keys.indexOf('startDate') !== -1 || keys.indexOf('endDate') !== -1 ||
                keys.indexOf('duration') !== -1 || keys.indexOf('durationUnit') !== -1) {
                if ((isNullOrUndefined(prevStart) && !isNullOrUndefined(taskData.startDate)) ||
                    (isNullOrUndefined(prevEnd) && !isNullOrUndefined(taskData.endDate)) ||
                    (isNullOrUndefined(taskData.startDate) && !isNullOrUndefined(prevStart)) ||
                    (isNullOrUndefined(taskData.endDate) && !isNullOrUndefined(prevEnd)) ||
                    (prevStart && prevStart.getTime() !== taskData.startDate.getTime())
                    || (prevEnd && prevEnd.getTime() !== taskData.endDate.getTime())
                    || (!isNullOrUndefined(prevDuration) && prevDuration !== taskData.duration)
                    || (!isNullOrUndefined(prevDuration) && prevDuration === taskData.duration &&
                        prevDurationUnit !== taskData.durationUnit)) {
                    isMoved = true;
                }
            }
        }
        return isMoved;
    }
    isPredecessorUpdated(data) {
        let isPredecessorUpdated = false;
        let prevData = this.parent.previousRecords[data.uniqueID];
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            if (data.ganttProperties.predecessorsName !== prevData.ganttProperties.predecessorsName) {
                isPredecessorUpdated = true;
            }
            else {
                this.parent.setRecordValue('predecessor', prevData.ganttProperties.predecessor, data.ganttProperties, true);
            }
        }
        return isPredecessorUpdated;
    }
    /**
     * Method to check need to open predecessor validate dialog
     * @param data
     */
    isCheckPredecessor(data) {
        let isValidatePredecessor = false;
        let prevData = this.parent.previousRecords[data.uniqueID];
        if (prevData && this.parent.taskFields.dependency && this.parent.isInPredecessorValidation &&
            this.parent.predecessorModule.getValidPredecessor(data).length > 0) {
            if (this.isTaskbarMoved(data)) {
                isValidatePredecessor = true;
            }
        }
        return isValidatePredecessor;
    }
    /**
     * Method to update all dependent record on edit action
     * @param args
     * @private
     */
    initiateUpdateAction(args) {
        let isValidatePredecessor = this.isCheckPredecessor(args.data);
        this.taskbarMoved = this.isTaskbarMoved(args.data);
        this.predecessorUpdated = this.isPredecessorUpdated(args.data);
        if (this.predecessorUpdated) {
            this.parent.isConnectorLineUpdate = true;
            this.parent.predecessorModule.addRemovePredecessor(args.data);
        }
        let validateObject = {};
        if (isValidatePredecessor) {
            validateObject = this.parent.predecessorModule.validateTypes(args.data);
            this.parent.isConnectorLineUpdate = true;
            if (!isNullOrUndefined(getValue('violationType', validateObject))) {
                let newArgs = this.validateTaskEvent(args);
                if (newArgs.validateMode.preserveLinkWithEditing === false &&
                    newArgs.validateMode.removeLink === false &&
                    newArgs.validateMode.respectLink === false) {
                    this.parent.predecessorModule.openValidationDialog(validateObject);
                }
                else {
                    this.parent.predecessorModule.applyPredecessorOption();
                }
            }
            else {
                this.updateEditedTask(args);
            }
        }
        else {
            if (this.taskbarMoved) {
                this.parent.isConnectorLineUpdate = true;
            }
            this.updateEditedTask(args);
        }
    }
    /**
     *
     * @param data method to trigger validate predecessor link by dialog
     */
    validateTaskEvent(editedEventArgs) {
        let newArgs = {};
        this.resetValidateArgs();
        this.parent.currentEditedArgs = newArgs;
        newArgs.cancel = false;
        newArgs.data = editedEventArgs.data;
        newArgs.requestType = 'validateLinkedTask';
        newArgs.validateMode = this.parent.dialogValidateMode;
        newArgs.editEventArgs = editedEventArgs;
        this.parent.actionBeginTask(newArgs);
        return newArgs;
    }
    resetValidateArgs() {
        this.parent.dialogValidateMode.preserveLinkWithEditing = true;
        this.parent.dialogValidateMode.removeLink = false;
        this.parent.dialogValidateMode.respectLink = false;
    }
    /**
     *
     * @param args - Edited event args like taskbar editing, dialog editing, cell editing
     * @private
     */
    updateEditedTask(args) {
        let ganttRecord = args.data;
        /** Update parent up-to zeroth level */
        if (ganttRecord.parentItem) {
            this.parent.dataOperation.updateParentItems(ganttRecord.parentItem);
        }
        this.updateParentChildRecord(ganttRecord);
        if (this.parent.isConnectorLineUpdate) {
            /* validating predecessor for updated child items */
            for (let i = 0; i < this.validatedChildItems.length; i++) {
                let child = this.validatedChildItems[i];
                if (child.ganttProperties.predecessor && child.ganttProperties.predecessor.length > 0) {
                    this.parent.editedTaskBarItem = child;
                    this.parent.predecessorModule.validatePredecessor(child, [], '');
                }
            }
            /** validating predecessor for current edited records */
            if (ganttRecord.ganttProperties.predecessor) {
                this.parent.isMileStoneEdited = ganttRecord.ganttProperties.isMilestone;
                if (this.taskbarMoved) {
                    this.parent.editedTaskBarItem = ganttRecord;
                }
                this.parent.predecessorModule.validatePredecessor(ganttRecord, [], '');
            }
        }
        this.initiateSaveAction(args);
    }
    /**
     * To update parent records while perform drag action.
     * @return {void}
     * @private
     */
    updateParentChildRecord(data) {
        let ganttRecord = data;
        if (ganttRecord.hasChildRecords && this.taskbarMoved) {
            this.updateChildItems(ganttRecord);
        }
    }
    /**
     *
     * @param data
     * @param newStartDate
     */
    calculateDateByRoundOffDuration(data, newStartDate) {
        let ganttRecord = data;
        let taskData = ganttRecord.ganttProperties;
        let projectStartDate = new Date(newStartDate.getTime());
        if (!isNullOrUndefined(taskData.endDate) && isNullOrUndefined(taskData.startDate)) {
            let endDate = this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, null);
            this.parent.setRecordValue('endDate', this.parent.dateValidationModule.checkEndDate(endDate, ganttRecord.ganttProperties), taskData, true);
        }
        else {
            this.parent.setRecordValue('startDate', this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData), taskData, true);
            if (!isNullOrUndefined(taskData.duration)) {
                this.parent.dateValidationModule.calculateEndDate(ganttRecord);
            }
        }
        this.parent.dataOperation.updateWidthLeft(data);
        this.parent.dataOperation.updateTaskData(ganttRecord);
    }
    /**
     * To update progress value of parent tasks
     * @param cloneParent
     * @private
     */
    updateParentProgress(cloneParent) {
        let parentProgress = 0;
        let parent = this.parent.getParentTask(cloneParent);
        let childRecords = parent.childRecords;
        let childCount = childRecords ? childRecords.length : 0;
        let totalProgress = 0;
        let milesStoneCount = 0;
        let taskCount = 0;
        let totalDuration = 0;
        let progressValues = {};
        if (childRecords) {
            for (let i = 0; i < childCount; i++) {
                if ((!childRecords[i].ganttProperties.isMilestone || childRecords[i].hasChildRecords) &&
                    isScheduledTask(childRecords[i].ganttProperties)) {
                    progressValues = this.parent.dataOperation.getParentProgress(childRecords[i]);
                    totalProgress += getValue('totalProgress', progressValues);
                    totalDuration += getValue('totalDuration', progressValues);
                }
                else {
                    milesStoneCount += 1;
                }
            }
            taskCount = childCount - milesStoneCount;
            parentProgress = taskCount > 0 ? Math.round(totalProgress / totalDuration) : 0;
            if (isNaN(parentProgress)) {
                parentProgress = 0;
            }
            this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth(parent.ganttProperties.width, parentProgress), parent.ganttProperties, true);
            this.parent.setRecordValue('progress', Math.floor(parentProgress), parent.ganttProperties, true);
            this.parent.setRecordValue('totalProgress', totalProgress, parent.ganttProperties, true);
            this.parent.setRecordValue('totalDuration', totalDuration, parent.ganttProperties, true);
        }
        this.parent.dataOperation.updateTaskData(parent);
        if (parent.parentItem) {
            this.updateParentProgress(parent.parentItem);
        }
    }
    /**
     * Method to revert cell edit action
     * @param args
     * @private
     */
    revertCellEdit(args) {
        this.parent.editModule.reUpdatePreviousRecords(false, true);
        this.resetEditProperties();
    }
    /**
     *
     * @return {void}
     * @private
     */
    reUpdatePreviousRecords(isRefreshChart, isRefreshGrid) {
        let collection = this.parent.previousRecords;
        let keys = Object.keys(collection);
        for (let i = 0; i < keys.length; i++) {
            let uniqueId = keys[i];
            let prevTask = collection[uniqueId];
            let originalData = this.parent.getTaskByUniqueID(uniqueId);
            this.copyTaskData(originalData.taskData, prevTask.taskData);
            delete prevTask.taskData;
            this.copyTaskData(originalData.ganttProperties, prevTask.ganttProperties);
            delete prevTask.ganttProperties;
            this.copyTaskData(originalData, prevTask);
            let rowIndex = this.parent.currentViewData.indexOf(originalData);
            if (isRefreshChart) {
                this.parent.chartRowsModule.refreshRow(rowIndex);
            }
            if (isRefreshGrid) {
                this.parent.treeGrid.grid.setRowData(originalData.ganttProperties.taskId, originalData);
                let row = this.parent.treeGrid.grid.getRowObjectFromUID(this.parent.treeGrid.grid.getDataRows()[rowIndex].getAttribute('data-uid'));
                row.data = originalData;
            }
        }
    }
    /**
     * Copy previous task data value to edited task data
     * @param existing
     * @param newValue
     */
    copyTaskData(existing, newValue) {
        if (!isNullOrUndefined(newValue)) {
            extend(existing, newValue);
        }
    }
    /**
     * To update schedule date on editing.
     * @return {void}
     * @private
     */
    updateScheduleDatesOnEditing(args) {
        //..
    }
    /**
     *
     * @param ganttRecord
     */
    updateChildItems(ganttRecord) {
        let previousData = this.parent.previousRecords[ganttRecord.uniqueID];
        let previousStartDate;
        if (isNullOrUndefined(previousData) ||
            (isNullOrUndefined(previousData) && !isNullOrUndefined(previousData.ganttProperties))) {
            previousStartDate = new Date(ganttRecord.ganttProperties.startDate.getTime());
        }
        else {
            previousStartDate = new Date(previousData.ganttProperties.startDate.getTime());
        }
        let currentStartDate = ganttRecord.ganttProperties.startDate;
        let childRecords = [];
        let validStartDate;
        let validEndDate;
        let calcEndDate;
        let isRightMove;
        let durationDiff;
        this.getUpdatableChildRecords(ganttRecord, childRecords);
        if (childRecords.length === 0) {
            return;
        }
        if (previousStartDate.getTime() > currentStartDate.getTime()) {
            validStartDate = this.parent.dateValidationModule.checkStartDate(currentStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(previousStartDate, ganttRecord.ganttProperties);
            isRightMove = false;
        }
        else {
            validStartDate = this.parent.dateValidationModule.checkStartDate(previousStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(currentStartDate, ganttRecord.ganttProperties);
            isRightMove = true;
        }
        //Get Duration
        if (validStartDate.getTime() >= validEndDate.getTime()) {
            durationDiff = 0;
        }
        else {
            durationDiff = this.parent.dateValidationModule.getDuration(validStartDate, validEndDate, 'minute', true);
        }
        for (let i = 0; i < childRecords.length; i++) {
            if (childRecords[i].ganttProperties.isAutoSchedule) {
                if (durationDiff > 0) {
                    let startDate = isScheduledTask(childRecords[i].ganttProperties) ?
                        childRecords[i].ganttProperties.startDate : childRecords[i].ganttProperties.startDate ?
                        childRecords[i].ganttProperties.startDate : childRecords[i].ganttProperties.endDate ?
                        childRecords[i].ganttProperties.endDate : new Date(previousStartDate.toString());
                    if (isRightMove) {
                        calcEndDate = this.parent.dateValidationModule.getEndDate(this.parent.dateValidationModule.checkStartDate(startDate, childRecords[i].ganttProperties, childRecords[i].ganttProperties.isMilestone), durationDiff, 'minute', childRecords[i].ganttProperties, false);
                    }
                    else {
                        calcEndDate = this.parent.dateValidationModule.getStartDate(this.parent.dateValidationModule.checkEndDate(startDate, childRecords[i].ganttProperties), durationDiff, 'minute', childRecords[i].ganttProperties);
                    }
                    this.calculateDateByRoundOffDuration(childRecords[i], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i]) === -1) {
                        this.validatedChildItems.push(childRecords[i]);
                    }
                }
                else if (isNullOrUndefined(previousData)) {
                    calcEndDate = previousStartDate;
                    this.calculateDateByRoundOffDuration(childRecords[i], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i]) === -1) {
                        this.validatedChildItems.push(childRecords[i]);
                    }
                }
            }
        }
    }
    /**
     * To get updated child records.
     * @param parentRecord
     * @param childLists
     */
    getUpdatableChildRecords(parentRecord, childLists) {
        let childRecords = parentRecord.childRecords;
        for (let i = 0; i < childRecords.length; i++) {
            if (childRecords[i].ganttProperties.isAutoSchedule) {
                childLists.push(childRecords[i]);
                if (childRecords[i].hasChildRecords) {
                    this.getUpdatableChildRecords(childRecords[i], childLists);
                }
            }
        }
    }
    initiateSaveAction(args) {
        this.parent.showSpinner();
        let eventArgs = {};
        eventArgs.requestType = 'beforeSave';
        eventArgs.data = args.data;
        eventArgs.modifiedRecords = this.parent.editedRecords;
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords);
        this.parent.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) {
            this.reUpdatePreviousRecords();
            this.parent.chartRowsModule.refreshRecords([args.data]);
            this.resetEditProperties();
            // Trigger action complete event with save canceled request type
        }
        else {
            if (isRemoteData(this.parent.dataSource)) {
                let data = this.parent.dataSource;
                let updatedData = {
                    changedRecords: eventArgs.modifiedTaskData
                };
                let crud = data.saveChanges(updatedData, null, null, new Query());
                crud.then((e) => this.dmSuccess(e, args))
                    .catch((e) => this.dmFailure(e, args));
            }
            else {
                this.saveSuccess(args);
            }
        }
    }
    dmSuccess(e, args) {
        this.saveSuccess(args);
    }
    dmFailure(e, args) {
        if (this.deletedTaskDetails.length) {
            let deleteRecords = this.deletedTaskDetails;
            for (let d = 0; d < deleteRecords.length; d++) {
                deleteRecords[d].isDelete = false;
            }
            this.deletedTaskDetails = [];
        }
        this.reUpdatePreviousRecords(true, true);
        this.resetEditProperties();
        this.parent.trigger('actionFailure', { error: e });
    }
    /**
     * Method for save action success for local and remote data
     */
    saveSuccess(args) {
        let eventArgs = {};
        if (this.parent.timelineSettings.updateTimescaleView) {
            let tempArray = this.parent.editedRecords;
            this.parent.timelineModule.updateTimeLineOnEditing(tempArray, args.action);
        }
        this.parent.chartRowsModule.refreshRecords(this.parent.editedRecords);
        if (this.parent.isConnectorLineUpdate) {
            this.parent.updatedConnectorLineCollection = [];
            this.parent.connectorLineIds = [];
            this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(this.parent.editedRecords);
            this.updateScheduleDatesOnEditing(args);
        }
        eventArgs.requestType = 'save';
        eventArgs.modifiedRecords = this.parent.editedRecords;
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords);
        setValue('action', args.action, eventArgs);
        this.endEditAction(args);
        this.parent.trigger('actionComplete', eventArgs);
    }
    resetEditProperties() {
        this.parent.currentEditedArgs = {};
        this.resetValidateArgs();
        this.parent.editedTaskBarItem = null;
        this.parent.isOnEdit = false;
        this.validatedChildItems = [];
        this.parent.isConnectorLineUpdate = false;
        this.parent.editedTaskBarItem = null;
        this.taskbarMoved = false;
        this.predecessorUpdated = false;
        if (!isNullOrUndefined(this.dialogModule)) {
            this.dialogModule.dialogClose();
        }
        this.parent.hideSpinner();
        this.parent.initiateEditAction(false);
    }
    /**
     * @private
     */
    endEditAction(args) {
        this.resetEditProperties();
        if (args.action === 'TaskbarEditing') {
            this.parent.trigger('taskbarEdited', args);
        }
        else if (args.action === 'CellEditing') {
            this.parent.trigger('endEdit', args);
        }
        else if (args.action === 'DialogEditing') {
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
    }
    saveFailed(args) {
        this.reUpdatePreviousRecords();
        this.parent.hideSpinner();
        //action failure event trigger
    }
    /**
     * To render delete confirmation dialog
     * @return {void}
     */
    renderDeleteConfirmDialog() {
        let dialogObj = new Dialog({
            width: '320px',
            isModal: true,
            visible: false,
            content: this.parent.localeObj.getConstant('confirmDelete'),
            buttons: [
                {
                    click: this.confirmDeleteOkButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.closeConfirmDialog.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        dialogObj.appendTo('#' + this.parent.element.id + '_deleteConfirmDialog');
        this.confirmDialog = dialogObj;
    }
    closeConfirmDialog() {
        this.confirmDialog.hide();
    }
    confirmDeleteOkButton() {
        this.deleteSelectedItems();
        this.confirmDialog.hide();
    }
    /**
     * @private
     */
    startDeleteAction() {
        if (this.parent.editSettings.allowDeleting) {
            if (this.parent.editSettings.showDeleteConfirmDialog) {
                this.confirmDialog.show();
            }
            else {
                this.deleteSelectedItems();
            }
        }
    }
    deleteSelectedItems() {
        if (!this.isFromDeleteMethod) {
            let selectedRecords = [];
            if (this.parent.selectionSettings.mode === 'Row') {
                selectedRecords = this.parent.selectionModule.getSelectedRecords();
            }
            else if (this.parent.selectionSettings.mode === 'Cell') {
                selectedRecords = this.parent.selectionModule.getCellSelectedRecords();
            }
            this.deleteRow(selectedRecords);
        }
        else {
            if (this.targetedRecords.length) {
                this.deleteRow(this.targetedRecords);
            }
            this.isFromDeleteMethod = false;
        }
    }
    /**
     * Public method for deleting a record
     * @param taskDetail
     * @private
     */
    deleteRecord(taskDetail) {
        this.isFromDeleteMethod = true;
        let variableType = typeof (taskDetail);
        this.targetedRecords = [];
        switch (variableType) {
            case 'number':
            case 'string':
                let taskId = taskDetail.toString();
                if (!isNullOrUndefined(taskId) && this.parent.ids.indexOf(taskId) !== -1) {
                    this.targetedRecords.push(this.parent.getRecordByID(taskId));
                }
                break;
            case 'object':
                if (!Array.isArray(taskDetail)) {
                    this.targetedRecords.push(taskDetail.valueOf());
                }
                else {
                    this.updateTargetedRecords(taskDetail);
                }
                break;
            default:
        }
        this.startDeleteAction();
    }
    /**
     * To update 'targetedRecords collection' from given array collection
     * @param taskDetailArray
     */
    updateTargetedRecords(taskDetailArray) {
        if (taskDetailArray.length) {
            let variableType = typeof (taskDetailArray[0]);
            if (variableType === 'object') {
                this.targetedRecords = taskDetailArray;
            }
            else {
                // Get record from array of task ids
                for (let i = 0; i < taskDetailArray.length; i++) {
                    let taskId = taskDetailArray[i].toString();
                    if (!isNullOrUndefined(taskId) && this.parent.ids.indexOf(taskId) !== -1) {
                        this.targetedRecords.push(this.parent.getRecordByID(taskId));
                    }
                }
            }
        }
    }
    deleteRow(tasks) {
        let flatData = this.parent.flatData;
        let rowItems = tasks && tasks.length ? tasks :
            this.parent.selectionModule.getSelectedRecords();
        if (rowItems.length) {
            this.parent.isOnDelete = true;
            for (let i = 0; i < rowItems.length; i++) {
                let deleteRecord = rowItems[i];
                if (this.deletedTaskDetails.indexOf(deleteRecord) !== -1) {
                    continue;
                }
                deleteRecord.isDelete = true;
                if (deleteRecord.parentItem) {
                    let childLength = this.parent.getParentTask(deleteRecord.parentItem).childRecords.length;
                    if (childLength > 1) {
                        this.parent.dataOperation.updateParentItems(deleteRecord.parentItem);
                    }
                }
                let predecessor = deleteRecord.ganttProperties.predecessor;
                if (predecessor && predecessor.length) {
                    this.removePredecessorOnDelete(deleteRecord);
                }
                this.deletedTaskDetails.push(deleteRecord);
                if (deleteRecord.hasChildRecords) {
                    this.deleteChildRecords(deleteRecord);
                }
            }
            // clear selection
            this.parent.selectionModule.clearSelection();
            let delereArgs = {};
            delereArgs.deletedRecordCollection = this.deletedTaskDetails;
            delereArgs.updatedRecordCollection = this.parent.editedRecords;
            delereArgs.cancel = false;
            delereArgs.action = 'delete';
            this.initiateDeleteAction(delereArgs);
            this.parent.isOnDelete = false;
        }
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    removePredecessorOnDelete(record) {
        let predecessors = record.ganttProperties.predecessor;
        for (let i = 0; i < predecessors.length; i++) {
            let predecessor = predecessors[i];
            if (predecessor.from.toString() === record.ganttProperties.taskId.toString()) {
                let toRecord = this.parent.getRecordByID(predecessor.to.toString());
                let toRecordPredcessor = extend([], [], toRecord.ganttProperties.predecessor, true);
                let index;
                for (let t = 0; t < toRecordPredcessor.length; t++) {
                    if (toRecordPredcessor[t].to.toString() === toRecord.ganttProperties.taskId.toString()
                        && toRecordPredcessor[t].from.toString() === record.ganttProperties.taskId.toString()) {
                        index = t;
                        break;
                    }
                }
                toRecordPredcessor.splice(index, 1);
                this.updatePredecessorValues(toRecord, toRecordPredcessor);
            }
            else if (predecessor.to.toString() === record.ganttProperties.taskId.toString()) {
                let fromRecord = this.parent.getRecordByID(predecessor.from.toString());
                let fromRecordPredcessor = extend([], [], fromRecord.ganttProperties.predecessor, true);
                let index;
                for (let t = 0; t < fromRecordPredcessor.length; t++) {
                    if (fromRecordPredcessor[t].from.toString() === fromRecord.ganttProperties.taskId.toString()
                        && fromRecordPredcessor[t].to.toString() === record.ganttProperties.taskId.toString()) {
                        index = t;
                        break;
                    }
                }
                fromRecordPredcessor.splice(index, 1);
                this.updatePredecessorValues(fromRecord, fromRecordPredcessor);
            }
        }
    }
    updatePredecessorValues(record, predcessorArray) {
        this.parent.setRecordValue('predecessor', predcessorArray, record.ganttProperties, true);
        let predecessorString = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
    }
    deleteChildRecords(record) {
        let childRecords = record.childRecords;
        for (let c = 0; c < childRecords.length; c++) {
            let childRecord = childRecords[c];
            if (this.deletedTaskDetails.indexOf(childRecord) !== -1) {
                continue;
            }
            let predecessor = childRecord.ganttProperties.predecessor;
            if (predecessor && predecessor.length) {
                this.removePredecessorOnDelete(childRecord);
            }
            this.deletedTaskDetails.push(childRecord);
            if (childRecord.hasChildRecords) {
                this.deleteChildRecords(childRecord);
            }
        }
    }
    removeFromDataSource(deleteRecordIDs) {
        let dataSource;
        let taskFields = this.parent.taskFields;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        else {
            dataSource = this.parent.dataSource;
        }
        this.removeData(dataSource, deleteRecordIDs);
        this.isBreakLoop = false;
    }
    removeData(dataCollection, record) {
        for (let i = 0; i < dataCollection.length; i++) {
            if (this.isBreakLoop) {
                break;
            }
            if (record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i]).toString()) !== -1) {
                if (dataCollection[i][this.parent.taskFields.child]) {
                    let childRecords = dataCollection[i][this.parent.taskFields.child];
                    this.removeData(childRecords, record);
                }
                record.splice(record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i]).toString()), 1);
                dataCollection.splice(i, 1);
                if (record.length === 0) {
                    this.isBreakLoop = true;
                    break;
                }
            }
            else if (dataCollection[i][this.parent.taskFields.child]) {
                let childRecords = dataCollection[i][this.parent.taskFields.child];
                this.removeData(childRecords, record);
            }
        }
    }
    initiateDeleteAction(args) {
        this.parent.showSpinner();
        let eventArgs = {};
        eventArgs.requestType = 'beforeDelete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection);
        this.parent.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) {
            let deleteRecords = this.deletedTaskDetails;
            for (let d = 0; d < deleteRecords.length; d++) {
                deleteRecords[d].isDelete = false;
            }
            this.deletedTaskDetails = [];
            this.reUpdatePreviousRecords();
            this.parent.initiateEditAction(false);
            this.parent.hideSpinner();
        }
        else {
            if (isRemoteData(this.parent.dataSource)) {
                let data = this.parent.dataSource;
                let updatedData = {
                    deletedRecords: eventArgs.data,
                    changedRecords: eventArgs.modifiedTaskData
                };
                let crud = data.saveChanges(updatedData);
                crud.then((e) => this.deleteSuccess(args))
                    .catch((e) => this.dmFailure(e, args));
            }
            else {
                this.deleteSuccess(args);
            }
        }
    }
    deleteSuccess(args) {
        let flatData = this.parent.flatData;
        let currentData = this.parent.currentViewData;
        let deletedRecords = args.deletedRecordCollection;
        let deleteRecordIDs = [];
        for (let i = 0; i < deletedRecords.length; i++) {
            let deleteRecord = deletedRecords[i];
            let currentIndex = currentData.indexOf(deleteRecord);
            let flatIndex = flatData.indexOf(deleteRecord);
            let treeGridParentIndex = this.parent.treeGrid.parentData.indexOf(deleteRecord);
            let childIndex;
            if (currentIndex !== -1) {
                currentData.splice(currentIndex, 1);
            }
            if (flatIndex !== -1) {
                flatData.splice(flatIndex, 1);
            }
            deleteRecordIDs.push(deleteRecord.ganttProperties.taskId.toString());
            if (flatIndex !== -1) {
                this.parent.ids.splice(flatIndex, 1);
            }
            if (deleteRecord.level === 0 && treeGridParentIndex !== -1) {
                this.parent.treeGrid.parentData.splice(treeGridParentIndex, 1);
            }
            if (deleteRecord.parentItem) {
                let parentItem = this.parent.getParentTask(deleteRecord.parentItem);
                if (parentItem) {
                    let childRecords = parentItem.childRecords;
                    childIndex = childRecords.indexOf(deleteRecord);
                    if (childIndex !== -1) {
                        childRecords.splice(childIndex, 1);
                    }
                    if (!childRecords.length) {
                        parentItem.hasChildRecords = false;
                    }
                }
            }
        }
        if (deleteRecordIDs.length > 0) {
            this.removeFromDataSource(deleteRecordIDs);
        }
        let eventArgs = {};
        this.parent.updatedConnectorLineCollection = [];
        this.parent.connectorLineIds = [];
        this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        // this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(flatData);
        this.parent.treeGrid.refresh();
        // Trigger actioncomplete event for delete action
        eventArgs.requestType = 'delete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection);
        setValue('action', args.action, eventArgs);
        this.parent.trigger('actionComplete', eventArgs);
        this.deletedTaskDetails = [];
        this.parent.initiateEditAction(false);
        this.parent.hideSpinner();
    }
    /**
     *
     * @return {number | string}
     * @private
     */
    getNewTaskId() {
        let maxId = DataUtil.aggregates.max(this.parent.flatData, this.parent.taskFields.id);
        if (!isNullOrUndefined(maxId)) {
            return parseInt(maxId.toString(), 10) + 1;
        }
        else {
            return 1;
        }
    }
    /**
     *
     * @return {void}
     * @private
     */
    prepareNewlyAddedData(obj, rowPosition) {
        let taskModel = this.parent.taskFields;
        let id;
        let ids = this.parent.ids;
        /*Validate Task Id of data*/
        if (obj[taskModel.id]) {
            if (ids.indexOf(obj[taskModel.id].toString()) !== -1) {
                obj[taskModel.id] = null;
            }
            else {
                obj[taskModel.id] = isNullOrUndefined(obj[taskModel.id]) ? null : parseInt(obj[taskModel.id], 10);
            }
        }
        if (!obj[taskModel.id]) {
            id = this.getNewTaskId();
            obj[taskModel.id] = id;
        }
        if (taskModel.name && !obj[taskModel.name]) {
            obj[taskModel.name] = 'New Task' + ' ' + obj[taskModel.id];
        }
        if (!this.parent.allowUnscheduledTasks && !obj[taskModel.startDate]) {
            obj[taskModel.startDate] = this.parent.projectStartDate;
        }
        if (!this.parent.allowUnscheduledTasks && taskModel.duration && isNullOrUndefined(obj[taskModel.duration])) {
            if (!obj[taskModel.endDate]) {
                obj[taskModel.duration] = '5';
            }
        }
        if (taskModel.progress) {
            obj[taskModel.progress] = obj[taskModel.progress] ? (obj[taskModel.progress] > 100 ? 100 : obj[taskModel.progress]) : 0;
        }
        if (!this.parent.allowUnscheduledTasks && !obj[taskModel.endDate] && taskModel.endDate) {
            if (!obj[taskModel.duration]) {
                let startDate = this.parent.dataOperation.getDateFromFormat(this.parent.projectStartDate);
                startDate.setDate(startDate.getDate() + 4);
                obj[taskModel.endDate] = this.parent.getFormatedDate(startDate, this.parent.dateFormat);
            }
        }
    }
    /**
     *
     * @return {IGanttData}
     * @private
     */
    updateNewlyAddedDataBeforeAjax(obj, level, rowPosition, parentItem) {
        let cAddedRecord;
        cAddedRecord = this.parent.dataOperation.createRecord(obj, level);
        cAddedRecord.index = parseInt(cAddedRecord.ganttProperties.taskId.toString(), 10) - 1;
        if (!isNullOrUndefined(parentItem)) {
            this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), cAddedRecord);
            let pIndex = cAddedRecord.parentItem ? cAddedRecord.parentItem.index : null;
            this.parent.setRecordValue('parentIndex', pIndex, cAddedRecord);
            let parentUniqId = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
            this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
            if (!isNullOrUndefined(this.parent.taskFields.id) &&
                !isNullOrUndefined(this.parent.taskFields.parentID) && cAddedRecord.parentItem) {
                this.parent.setRecordValue(this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord.taskData, true);
            }
        }
        this.backUpAndPushNewlyAddedRecord(cAddedRecord, rowPosition, parentItem);
        // need to push in dataSource also.
        this.parent.isOnEdit = true;
        if (this.parent.taskFields.dependency && cAddedRecord.ganttProperties.predecessorsName) {
            this.parent.predecessorModule.ensurePredecessorCollectionHelper(cAddedRecord, cAddedRecord.ganttProperties);
            this.parent.predecessorModule.updatePredecessorHelper(cAddedRecord);
            this.parent.predecessorModule.validatePredecessorDates(cAddedRecord);
        }
        else {
            if (cAddedRecord.parentItem && this.parent.getParentTask(cAddedRecord.parentItem).ganttProperties.isAutoSchedule) {
                this.parent.dataOperation.updateParentItems(cAddedRecord.parentItem);
            }
        }
        return cAddedRecord;
    }
    /**
     *
     * @return {number}
     * @private
     */
    getChildCount(record, count) {
        let currentRecord;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }
    /**
     *
     * @return {number}
     * @private
     */
    getVisibleChildRecordCount(data, count, collection) {
        let childRecords;
        let length;
        if (data.hasChildRecords) {
            childRecords = data.childRecords;
            length = childRecords.length;
            for (let i = 0; i < length; i++) {
                if (collection.indexOf(childRecords[i]) !== -1) {
                    count++;
                }
                if (childRecords[i].hasChildRecords) {
                    count = this.getVisibleChildRecordCount(childRecords[i], count, collection);
                }
            }
        }
        else {
            if (collection.indexOf(data) !== -1) {
                count++;
            }
        }
        return count;
    }
    /**
     *
     * @return {void}
     * @private
     */
    updatePredecessorOnIndentOutdent(parentRecord) {
        let len = parentRecord.ganttProperties.predecessor.length;
        let parentRecordTaskData = parentRecord.ganttProperties;
        let predecessorCollection = parentRecordTaskData.predecessor;
        let childRecord;
        let predecessorIndex;
        let updatedPredecessor = [];
        for (let count = 0; count < len; count++) {
            if (predecessorCollection[count].to === parentRecordTaskData.taskId.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].from);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                let predecessorCollections;
                predecessorCollections = (extend([], childRecord.ganttProperties.predecessor, [], true));
                predecessorCollections.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', predecessorCollections, childRecord.ganttProperties, true);
            }
            else if (predecessorCollection[count].from === parentRecordTaskData.taskId.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].to);
                let stringPredecessor = this.predecessorToString(childRecord.ganttProperties.predecessor, parentRecord);
                let prdcList = (childRecord.ganttProperties.predecessorsName.toString()).split(',');
                let str = predecessorCollection[count].from + predecessorCollection[count].type;
                let ind = prdcList.indexOf(str);
                prdcList.splice(ind, 1);
                this.parent.setRecordValue('predecessorsName', prdcList.join(','), childRecord.ganttProperties, true);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                let temppredecessorCollection;
                temppredecessorCollection = (extend([], childRecord.ganttProperties.predecessor, [], true));
                temppredecessorCollection.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', temppredecessorCollection, childRecord.ganttProperties, true);
                this.parent.predecessorModule.validatePredecessorDates(childRecord);
            }
        }
        this.parent.setRecordValue('predecessor', updatedPredecessor, parentRecord.ganttProperties, true);
        this.parent.setRecordValue('predecessorsName', '', parentRecord.ganttProperties, true);
    }
    /**
     *
     * @return {string}
     * @private
     */
    predecessorToString(predecessorCollection, record) {
        let predecessorString = [];
        let count = 0;
        let length = predecessorCollection.length;
        for (count; count < length; count++) {
            if (record.ganttProperties.taskId.toString() !== predecessorCollection[count].from) {
                let tem = predecessorCollection[count].from + predecessorCollection[count].type;
                predecessorCollection[count].offset =
                    isNaN(predecessorCollection[count].offset) ? 0 : predecessorCollection[count].offset;
                if (predecessorCollection[count].offset !== 0) {
                    if (predecessorCollection[count].offset < 0) {
                        tem += predecessorCollection[count].offset.toString() + 'd';
                    }
                    else if (predecessorCollection[count].offset > 0) {
                        tem += '+' + predecessorCollection[count].offset.toString() + 'd';
                    }
                }
                predecessorString.push(tem);
            }
        }
        return predecessorString.join(',');
    }
    /**
     *
     * @return {void}
     * @private
     */
    backUpAndPushNewlyAddedRecord(record, rowPosition, parentItem) {
        let flatRecords = this.parent.flatData;
        let currentViewData = this.parent.currentViewData;
        let ids = this.parent.ids;
        let currentItemIndex;
        switch (rowPosition) {
            case 'Top':
                flatRecords.splice(0, 0, record);
                currentViewData.splice(0, 0, record);
                ids.splice(0, 0, record.ganttProperties.taskId.toString()); // need to check NAN
                break;
            case 'Bottom':
                flatRecords.push(record);
                currentViewData.push(record);
                ids.push(record.ganttProperties.taskId.toString()); // need to check NAN
                break;
            case 'Above':
                let childIndex;
                /*Record Updates*/
                let recordIndex = flatRecords.indexOf(this.addRowSelectedItem);
                let updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem);
                this.recordCollectionUpdate(childIndex, recordIndex, updatedCollectionIndex, record, parentItem);
                break;
            case 'Below':
                currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
                if (this.addRowSelectedItem.hasChildRecords) {
                    let dataChildCount = this.getChildCount(this.addRowSelectedItem, 0);
                    recordIndex = currentItemIndex + dataChildCount + 1;
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
                }
                else {
                    recordIndex = currentItemIndex + 1;
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
                }
                this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem);
                break;
            case 'Child':
                currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
                if (this.addRowSelectedItem.hasChildRecords) {
                    let dataChildCount = this.getChildCount(this.addRowSelectedItem, 0);
                    recordIndex = currentItemIndex + dataChildCount + 1;
                    //Expand Add record's parent item 
                    if (!this.addRowSelectedItem.expanded) {
                        this.parent.expandByID(this.addRowSelectedItem.ganttProperties.taskId);
                    }
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
                }
                else {
                    this.addRowSelectedItem.hasChildRecords = true;
                    this.addRowSelectedItem.childRecords = [];
                    this.addRowSelectedItem.expanded = true;
                    this.addRowSelectedItem.ganttProperties.isMilestone = false;
                    recordIndex = currentItemIndex + 1;
                    updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
                    if (this.addRowSelectedItem.ganttProperties.predecessor) {
                        this.updatePredecessorOnIndentOutdent(this.addRowSelectedItem);
                    }
                }
                this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem);
                break;
        }
        this.newlyAddedRecordBackup = record;
    }
    /**
     *
     * @return {ITaskAddedEventArgs}
     * @private
     */
    recordCollectionUpdate(childIndex, recordIndex, updatedCollectionIndex, record, parentItem) {
        let flatRecords = this.parent.flatData;
        let currentViewData = this.parent.currentViewData;
        let ids = this.parent.ids;
        /* Record collection update */
        flatRecords.splice(recordIndex, 0, record);
        currentViewData.splice(updatedCollectionIndex, 0, record);
        ids.splice(recordIndex, 0, record.ganttProperties.taskId.toString());
        /* data Source update */
        if (!isNullOrUndefined(parentItem)) {
            childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem);
            /*Child collection update*/
            parentItem.childRecords.splice(childIndex, 0, record);
        }
    }
    /**
     *
     * @return {ITaskAddedEventArgs}
     * @private
     */
    constructTaskAddedEventArgs(cAddedRecord, modifiedRecords, event) {
        let eventArgs = {};
        eventArgs.action = event;
        eventArgs.data = cAddedRecord;
        eventArgs.newTaskData = getTaskData([cAddedRecord])[0];
        eventArgs.recordIndex = cAddedRecord.index;
        eventArgs.modifiedRecords = modifiedRecords;
        eventArgs.modifiedTaskData = getTaskData(modifiedRecords);
        return eventArgs;
    }
    /**
     *
     * @return {void}
     * @private
     */
    addSuccess(args) {
        // let addedRecords: IGanttData = args.addedRecord;
        // let eventArgs: IActionBeginEventArgs = {};
        // this.parent.updatedConnectorLineCollection = [];
        // this.parent.connectorLineIds = [];
        // this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        this.parent.treeGrid.refresh();
    }
    /**
     *
     * @return {void}
     * @private
     */
    updateRealDataSource(addedRecord, rowPosition) {
        let dataSource;
        let taskFields = this.parent.taskFields;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        else {
            dataSource = this.parent.dataSource;
        }
        if (rowPosition === 'Top') {
            dataSource.splice(0, 0, addedRecord.taskData);
        }
        else if (rowPosition === 'Bottom') {
            dataSource.push(addedRecord);
        }
        else {
            if (!isNullOrUndefined(taskFields.id) && !isNullOrUndefined(taskFields.parentID)) {
                dataSource.push(addedRecord.taskData);
            }
            else {
                this.addDataInRealDataSource(dataSource, addedRecord.taskData, rowPosition);
            }
        }
        this.isBreakLoop = false;
    }
    /**
     *
     * @return {boolean | void}
     * @private
     */
    addDataInRealDataSource(dataCollection, record, rowPosition) {
        for (let i = 0; i < dataCollection.length; i++) {
            if (this.isBreakLoop) {
                break;
            }
            if (getValue(this.parent.taskFields.id, dataCollection[i]).toString() ===
                this.addRowSelectedItem.ganttProperties.taskId.toString()) {
                if (rowPosition === 'Above') {
                    dataCollection.splice(i, 0, record);
                }
                else if (rowPosition === 'Below') {
                    dataCollection.splice(i + 1, 0, record);
                }
                else if (rowPosition === 'Child') {
                    /* tslint:disable-next-line */
                    if (dataCollection[i]['subtasks'] && dataCollection[i]['subtasks'].length > 0) {
                        /* tslint:disable-next-line */
                        dataCollection[i]['subtasks'].push(record);
                    }
                    else {
                        /* tslint:disable-next-line */
                        dataCollection[i]['subtasks'] = [];
                        /* tslint:disable-next-line */
                        dataCollection[i]['subtasks'].push(record);
                    }
                }
                this.isBreakLoop = true;
                break;
            }
            else if (dataCollection[i][this.parent.taskFields.child]) {
                let childRecords = dataCollection[i][this.parent.taskFields.child];
                this.addDataInRealDataSource(childRecords, record, rowPosition);
            }
        }
    }
    /**
     *
     * @return {void}
     * @private
     */
    addRecord(data, rowPosition, rowIndex) {
        let selectedRowIndex = isNullOrUndefined(rowIndex) || isNaN(parseInt(rowIndex.toString(), 10)) ?
            this.parent.selectionModule ?
                (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both') &&
                    this.parent.selectionModule.selectedRowIndexes.length === 1 ?
                    this.parent.selectionModule.selectedRowIndexes[0] :
                    this.parent.selectionSettings.mode === 'Cell' && this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        this.parent.selectionModule.getSelectedRowCellIndexes()[0].rowIndex : null : null : rowIndex;
        this.addRowSelectedItem = isNullOrUndefined(selectedRowIndex) ? null : this.parent.currentViewData[selectedRowIndex];
        rowPosition = isNullOrUndefined(rowPosition) ? this.parent.editSettings.newRowPosition : rowPosition;
        data = isNullOrUndefined(data) ? this.parent.editModule.dialogModule.composeAddRecord() : data;
        if (((isNullOrUndefined(selectedRowIndex) || selectedRowIndex < 0 ||
            isNullOrUndefined(this.addRowSelectedItem)) && (rowPosition === 'Above'
            || rowPosition === 'Below'
            || rowPosition === 'Child')) || !rowPosition || (rowPosition !== 'Above'
            && rowPosition !== 'Below'
            && rowPosition !== 'Child' && rowPosition !== 'Top' &&
            rowPosition !== 'Bottom')) {
            rowPosition = 'Top';
        }
        let level = 0;
        let cAddedRecord;
        let args = {};
        let parentItem;
        switch (rowPosition) {
            case 'Top':
            case 'Bottom':
                level = 0;
                break;
            case 'Above':
            case 'Below':
                level = this.addRowSelectedItem.level;
                parentItem = this.parent.getParentTask(this.addRowSelectedItem.parentItem);
                break;
            case 'Child':
                level = this.addRowSelectedItem.level + 1;
                parentItem = this.addRowSelectedItem;
                break;
        }
        //Add Action Init.
        this.prepareNewlyAddedData(data, rowPosition);
        cAddedRecord = this.updateNewlyAddedDataBeforeAjax(data, level, rowPosition, parentItem);
        args = this.constructTaskAddedEventArgs(cAddedRecord, this.parent.editedRecords, 'beforeAdd');
        this.parent.showSpinner();
        this.parent.trigger('actionBegin', args);
        if (!args.cancel) {
            if (isRemoteData(this.parent.dataSource)) {
                let data = this.parent.dataSource;
                let updatedData = {
                    addedRecords: [args.newTaskData],
                    changedRecords: args.modifiedTaskData
                };
                let crud = data.saveChanges(updatedData, null, null, new Query());
                crud.then((e) => {
                    if (this.parent.taskFields.id && !isNullOrUndefined(e.addedRecords[0][this.parent.taskFields.id]) &&
                        e.addedRecords[0][this.parent.taskFields.id] !== args.data.ganttProperties.taskId) {
                        this.parent.setRecordValue('taskId', e.addedRecords[0][this.parent.taskFields.id], args.data.ganttProperties, true);
                        this.parent.setRecordValue('taskData.' + this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data);
                        this.parent.setRecordValue(this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data);
                    }
                    if (cAddedRecord.level === 0) {
                        this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                    }
                    this.RefreshNewlyAddedRecord(args, cAddedRecord);
                }).catch((e) => {
                    this.removeAddedRecord();
                    this.dmFailure(e, args);
                });
            }
            else {
                this.updateRealDataSource(args.data, rowPosition);
                if (cAddedRecord.level === 0) {
                    this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                }
                this.RefreshNewlyAddedRecord(args, cAddedRecord);
            }
        }
        else {
            this.removeAddedRecord();
            this.reUpdatePreviousRecords();
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
        this.parent.isOnEdit = false;
        this.parent.hideSpinner();
        this.addRowSelectedItem = null;
        this.newlyAddedRecordBackup = null;
        this.isBreakLoop = false;
        this.parent.element.tabIndex = 0;
        this.parent.initiateEditAction(false);
    }
    RefreshNewlyAddedRecord(args, cAddedRecord) {
        if (this.parent.selectionModule && this.parent.allowSelection &&
            (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both')) {
            this.parent.staticSelectedRowIndex = this.parent.currentViewData.indexOf(args.data);
        }
        if (this.parent.timelineSettings.updateTimescaleView) {
            let tempArray = [];
            if (args.modifiedRecords.length > 0) {
                tempArray.push(args.data);
                tempArray.push.apply(tempArray, args.modifiedRecords);
            }
            else {
                tempArray = [args.data];
            }
            this.parent.timelineModule.updateTimeLineOnEditing(tempArray, args.action);
        }
        this.addSuccess(args);
        args = this.constructTaskAddedEventArgs(cAddedRecord, args.modifiedRecords, 'add');
        this.parent.trigger('actionComplete', args);
        if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
            this.dialogModule.dialogObj.hide();
        }
        this.dialogModule.dialogClose();
    }
    /**
     *
     * @return {void}
     * @private
     */
    removeAddedRecord() {
        let flatRecords = this.parent.flatData;
        let currentViewData = this.parent.currentViewData;
        let ids = this.parent.ids;
        let flatRecordsIndex = flatRecords.indexOf(this.newlyAddedRecordBackup);
        let currentViewDataIndex = currentViewData.indexOf(this.newlyAddedRecordBackup);
        let idsIndex = ids.indexOf(this.newlyAddedRecordBackup.ganttProperties.taskId.toString());
        deleteObject(this.parent.previousRecords, flatRecords[flatRecordsIndex].uniqueID);
        if (this.newlyAddedRecordBackup.parentItem) {
            let parentItem = this.parent.getParentTask(this.newlyAddedRecordBackup.parentItem);
            let parentIndex = parentItem.childRecords.indexOf(this.newlyAddedRecordBackup);
            parentItem.childRecords.splice(parentIndex, 1);
        }
        flatRecords.splice(flatRecordsIndex, 1);
        currentViewData.splice(currentViewDataIndex, 1);
        ids.splice(idsIndex, 1);
    }
}

/**
 * To handle column reorder action from TreeGrid
 */
class Reorder$1 {
    constructor(gantt) {
        this.parent = gantt;
        TreeGrid.Inject(Reorder);
        this.parent.treeGrid.allowReordering = this.parent.allowReordering;
        this.bindEvents();
    }
    /**
     * Get module name
     */
    getModuleName() {
        return 'reorder';
    }
    /**
     * To bind reorder events.
     * @return {void}
     * @private
     */
    bindEvents() {
        this.parent.treeGrid.columnDragStart = (args) => {
            this.parent.trigger('columnDragStart', args);
        };
        this.parent.treeGrid.columnDrag = (args) => {
            this.parent.trigger('columnDrag', args);
        };
        this.parent.treeGrid.columnDrop = (args) => {
            this.parent.trigger('columnDrop', args);
        };
    }
    /**
     * To destroy the column-reorder.
     * @return {void}
     * @private
     */
    destroy() {
        // Destroy Method
    }
}

/**
 * Column resize action related code goes here
 */
class Resize$1 {
    constructor(gantt) {
        this.parent = gantt;
        TreeGrid.Inject(Resize);
        this.parent.treeGrid.allowResizing = this.parent.allowResizing;
        this.bindEvents();
    }
    /**
     * Get module name
     */
    getModuleName() {
        return 'resize';
    }
    /**
     * To bind resize events.
     * @return {void}
     * @private
     */
    bindEvents() {
        this.parent.treeGrid.resizeStart = (args) => {
            this.parent.trigger('resizeStart', args);
        };
        this.parent.treeGrid.resizing = (args) => {
            this.parent.trigger('resizing', args);
        };
        this.parent.treeGrid.resizeStop = (args) => {
            this.parent.trigger('resizeStop', args);
        };
    }
    /**
     * To destroy the column-resizer.
     * @return {void}
     * @private
     */
    destroy() {
        // Destroy Method
    }
}

/**
 * Filter action related code goes here
 */
class Filter$2 {
    constructor(gantt) {
        this.parent = gantt;
        TreeGrid.Inject(Filter$1);
        this.parent.treeGrid.allowFiltering = this.parent.allowFiltering ||
            (this.parent.toolbar.indexOf('Search') !== -1 ? true : false);
        this.parent.treeGrid.filterSettings = getActualProperties(this.parent.filterSettings);
        this.addEventListener();
    }
    getModuleName() {
        return 'filter';
    }
    updateModel() {
        this.parent.filterSettings = this.parent.treeGrid.filterSettings;
    }
    addEventListener() {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('actionBegin', this.actionBegin, this);
        this.parent.on('actionComplete', this.actionComplete, this);
        this.parent.on('columnMenuOpen', this.columnMenuOpen, this);
    }
    /**
     * Remove filter menu while opening column chooser menu
     * @param args
     */
    columnMenuOpen(args) {
        if (this.filterMenuElement && this.parent.element.contains(this.filterMenuElement)) {
            remove(this.filterMenuElement);
        }
        this.filterMenuElement = null;
    }
    actionBegin(args) {
        // ...
    }
    actionComplete(args) {
        if (args.requestType === filterAfterOpen) {
            this.filterMenuElement = getValue('filterModel.dlgObj.element', args);
            this.updateFilterMenuPosition(this.filterMenuElement, args);
            // To set default values as 'contains' in filter dialog
            let taskID = this.parent.taskFields.id;
            let predecessor = this.parent.taskFields.dependency;
            let resource = this.parent.taskFields.resourceInfo;
            let filterObj = this.parent.treeGrid.grid.filterModule;
            let filterValues = getValue('values', filterObj);
            if ((args.columnName === predecessor && isNullOrUndefined(getValue(predecessor, filterValues)))
                || (args.columnName === resource && isNullOrUndefined(getValue(resource, filterValues)))) {
                let element = this.filterMenuElement.querySelector('.e-dropdownlist');
                let instanceObj = getValue('ej2_instances[0]', element);
                instanceObj.index = 2;
                instanceObj.dataBind();
            }
            else if (args.columnName === taskID && isNullOrUndefined(getValue(taskID, filterValues))) {
                let element = this.filterMenuElement.querySelector('.e-numerictextbox');
                let instanceObj = getValue('ej2_instances[0]', element);
                if (!isNullOrUndefined(instanceObj) && isNullOrUndefined(this.parent.columnByField[args.columnName].format)) {
                    instanceObj.format = 'n';
                }
            }
        }
    }
    setPosition(li, ul) {
        let gridPos = this.parent.element.getBoundingClientRect();
        let liPos = li.getBoundingClientRect();
        let left = liPos.left - gridPos.left;
        let top = liPos.top - gridPos.top;
        if (gridPos.height < top) {
            top = top - ul.offsetHeight + liPos.height;
        }
        else if (gridPos.height < top + ul.offsetHeight) {
            top = gridPos.height - ul.offsetHeight;
        }
        if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
            top = window.innerHeight - ul.offsetHeight - gridPos.top;
        }
        left += (this.parent.enableRtl ? -ul.offsetWidth : liPos.width);
        if (gridPos.width <= left + ul.offsetWidth) {
            left -= liPos.width + ul.offsetWidth;
        }
        else if (left < 0) {
            left += ul.offsetWidth + liPos.width;
        }
        ul.style.top = top + 7 + 'px';
        ul.style.left = left + 7 + 'px';
    }
    updateFilterMenuPosition(element, args) {
        this.parent.element.appendChild(element);
        let targetElement;
        if (this.parent.showColumnMenu) {
            targetElement = document.querySelector('#treeGrid' + this.parent.controlId + '_gridcontrol_colmenu_Filter');
            this.setPosition(targetElement, getValue('filterModel.dlgObj.element', args));
        }
        else {
            targetElement = this.parent.treeGrid.grid.getColumnHeaderByField(args.columnName).querySelector('.e-filtermenudiv');
            getFilterMenuPostion(targetElement, getValue('filterModel.dlgObj', args), this.parent.treeGrid.grid);
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('actionBegin', this.actionBegin);
        this.parent.off('actionComplete', this.actionComplete);
        this.parent.off('columnMenuOpen', this.columnMenuOpen);
    }
    /**
     * @private
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * Sort operation in Gantt
 */
class Sort$1 {
    constructor(gantt) {
        this.parent = gantt;
        TreeGrid.Inject(Sort);
        this.parent.treeGrid.allowSorting = this.parent.allowSorting;
        this.parent.treeGrid.sortSettings = getActualProperties(this.parent.sortSettings);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'sort';
    }
    /**
     * @private
     */
    addEventListener() {
        this.parent.on('updateModel', this.updateModel, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
    }
    /**
     * Destroys the Sorting of TreeGrid.
     * @private
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     *
     * @param columnName
     * @param direction
     * @param isMultiSort
     */
    sortColumn(columnName, direction, isMultiSort) {
        this.parent.treeGrid.sortByColumn(columnName, direction, isMultiSort);
    }
    /**
     * method for clear all sorted columns
     */
    clearSorting() {
        this.parent.treeGrid.clearSorting();
    }
    /**
     * The function used to update sortSettings of TreeGrid.
     * @return {void}
     * @hidden
     */
    updateModel() {
        this.parent.sortSettings = this.parent.treeGrid.sortSettings;
    }
    /**
     * To clear sorting for specific column
     * @param columnName
     */
    removeSortColumn(columnName) {
        this.parent.treeGrid.grid.removeSortColumn(columnName);
    }
}

/**
 * Column reorder action related code goes here
 */
class Selection$1 {
    constructor(gantt) {
        this.isSelectionFromChart = false;
        this.selectedRowIndexes = [];
        this.enableSelectMultiTouch = false;
        this.parent = gantt;
        this.bindEvents();
        this.parent.treeGrid.selectedRowIndex = this.parent.selectedRowIndex;
        this.parent.treeGrid.allowSelection = this.parent.allowSelection;
        this.parent.treeGrid.selectionSettings = getActualProperties(this.parent.selectionSettings);
        this.wireEvents();
    }
    /**
     * Get module name
     */
    getModuleName() {
        return 'selection';
    }
    wireEvents() {
        this.parent.on('selectRowByIndex', this.selectRowByIndex, this);
        this.parent.on('chartMouseUp', this.mouseUpHandler, this);
    }
    selectRowByIndex() {
        if (this.parent.selectedRowIndex !== -1 || this.parent.staticSelectedRowIndex !== -1) {
            this.selectRow(this.parent.staticSelectedRowIndex !== -1 ? this.parent.staticSelectedRowIndex : this.parent.selectedRowIndex);
            this.parent.staticSelectedRowIndex = -1;
        }
    }
    /**
     * To bind selection events.
     * @return {void}
     * @private
     */
    bindEvents() {
        this.parent.treeGrid.rowSelecting = this.rowSelecting.bind(this);
        this.parent.treeGrid.rowSelected = this.rowSelected.bind(this);
        this.parent.treeGrid.rowDeselecting = this.rowDeselecting.bind(this);
        this.parent.treeGrid.rowDeselected = this.rowDeselected.bind(this);
        this.parent.treeGrid.cellSelecting = this.cellSelecting.bind(this);
        this.parent.treeGrid.cellSelected = this.cellSelected.bind(this);
        this.parent.treeGrid.cellDeselecting = this.cellDeselecting.bind(this);
        this.parent.treeGrid.cellDeselected = this.cellDeselected.bind(this);
    }
    rowSelecting(args) {
        this.parent.trigger('rowSelecting', args);
        this.isMultiCtrlRequest = args.isCtrlPressed;
        this.isMultiShiftRequest = args.isShiftPressed;
        if (!this.isSelectionFromChart) {
            this.selectedRowIndexes.push(args.rowIndex);
        }
    }
    rowSelected(args) {
        let rowIndexes = 'rowIndexes';
        let index = args[rowIndexes] || [args.rowIndex];
        this.addClass(index);
        this.parent.selectedRowIndex = this.parent.treeGrid.selectedRowIndex;
        if (this.isMultiShiftRequest) {
            this.selectedRowIndexes = index;
        }
        if (this.parent.autoFocusTasks) {
            this.parent.ganttChartModule.updateScrollLeft(getValue('data.ganttProperties.left', args));
        }
        this.parent.trigger('rowSelected', args);
        this.prevRowIndex = args.rowIndex;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    rowDeselecting(args) {
        this.parent.trigger('rowDeselecting', args);
        if (!args.cancel) {
            this.removeClass(args.rowIndex);
        }
    }
    rowDeselected(args) {
        this.parent.trigger('rowDeselected', args);
        if (!this.isSelectionFromChart) {
            this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(args.rowIndex[0]), 1);
        }
        let rowIndexes = 'rowIndexes';
        let index = args[rowIndexes] || args.rowIndex;
        this.removeClass(index);
        this.parent.selectedRowIndex = -1;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    cellSelecting(args) {
        this.parent.trigger('cellSelecting', args);
    }
    cellSelected(args) {
        this.parent.trigger('cellSelected', args);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    cellDeselecting(args) {
        this.parent.trigger('cellDeselecting', args);
    }
    cellDeselected(args) {
        this.parent.trigger('cellDeselected', args);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectCell(cellIndex, isToggle) {
        this.parent.treeGrid.selectCell(cellIndex, isToggle);
    }
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectRow(index, isToggle) {
        let selectedRow = this.parent.getRowByIndex(index);
        if (index === -1 || isNullOrUndefined(selectedRow)) {
            return;
        }
        let isRowSelected = selectedRow.hasAttribute('aria-selected');
        let can = 'cancel';
        if (isRowSelected && isToggle) {
            let rowDeselectObj = {
                rowIndex: index, data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                row: selectedRow, cancel: false, target: this.actualTarget
            };
            this.parent.trigger('rowDeSelecting', rowDeselectObj);
            this.clearSelection();
        }
        else {
            let args = {
                data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, row: selectedRow,
                previousRow: this.parent.getRowByIndex(this.prevRowIndex),
                previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
            };
            this.parent.trigger('rowSelecting', args);
            if (!args[can]) {
                this.addClass([index]);
                this.parent.treeGrid.selectRow(index, isToggle);
            }
        }
        this.prevRowIndex = index;
    }
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    selectRows(records) {
        let rowIndex = records[records.length - 1];
        records = this.parent.selectionSettings.type === 'Single' ? [rowIndex] : records;
        let can = 'cancel';
        let selectedRow = this.parent.getRowByIndex(rowIndex);
        let args = {
            data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
            rowIndexes: records, rowIndex: rowIndex, row: selectedRow,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            previousRow: this.parent.getRowByIndex(this.prevRowIndex),
            previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
        };
        this.parent.trigger('rowSelecting', args);
        if (!args[can]) {
            for (let i = 0; i < records.length; i++) {
                this.addClass([records[i]]);
            }
        }
        this.parent.treeGrid.selectRows(records);
    }
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    getSelectedRowIndexes() {
        return this.parent.treeGrid.getSelectedRowIndexes();
    }
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    getSelectedRowCellIndexes() {
        return this.parent.treeGrid.getSelectedRowCellIndexes();
    }
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    getSelectedRecords() {
        return this.parent.treeGrid.getSelectedRecords();
    }
    /**
     * To get the selected records for cell selection
     * @return {IGanttData[]}
     */
    getCellSelectedRecords() {
        let cellDetails = this.parent.selectionModule.getSelectedRowCellIndexes();
        let cellSelectedRecords = [];
        for (let i = 0; i < cellDetails.length; i++) {
            cellSelectedRecords.push(this.parent.currentViewData[cellDetails[i].rowIndex]);
        }
        return cellSelectedRecords;
    }
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    getSelectedRows() {
        return this.parent.treeGrid.getSelectedRows();
    }
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    clearSelection() {
        this.removeClass(this.selectedRowIndexes);
        this.parent.treeGrid.clearSelection();
        this.parent.selectedRowIndex = -1;
        this.selectedRowIndexes = [];
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    highlightSelectedRows(e, fromChart) {
        let rows = closest(e.target, 'tbody').children;
        let selectedRow = closest(e.target, 'tr.e-chart-row');
        let rIndex = [].slice.call(rows).indexOf(selectedRow);
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.actualTarget = e.target;
        this.isSelectionFromChart = fromChart;
        if (fromChart) {
            if (this.parent.selectionSettings.type === 'Single' || (!this.isMultiCtrlRequest && !this.isMultiShiftRequest)) {
                this.selectedRowIndexes = [];
                this.selectedRowIndexes.push(rIndex);
                this.selectRow(rIndex, true);
            }
            else {
                if (this.isMultiShiftRequest) {
                    this.selectRowsByRange(isNullOrUndefined(this.prevRowIndex) ? rIndex : this.prevRowIndex, rIndex);
                }
                else {
                    this.addRowsToSelection(rIndex);
                }
            }
        }
    }
    /**
     * Select rows with existing row selection by passing row indexes.
     * @return {void}
     * @hidden
     */
    addRowsToSelection(index) {
        let rowIndex = this.selectedRowIndexes.indexOf(index);
        let selectedRow = this.parent.getRowByIndex(index);
        let can = 'cancel';
        if (rowIndex > -1) {
            this.selectedRowIndexes.splice(rowIndex, 1);
            let rowDeselectObj = {
                rowIndex: index, data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                row: selectedRow, cancel: false, target: this.actualTarget
            };
            this.parent.trigger('rowDeSelecting', rowDeselectObj);
        }
        else {
            this.selectedRowIndexes.push(index);
            let args = {
                data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                rowIndexes: this.selectedRowIndexes, rowIndex: rowIndex, row: selectedRow,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                previousRow: this.parent.getRowByIndex(this.prevRowIndex),
                previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
            };
            this.parent.trigger('rowSelecting', args);
            if (!args[can]) {
                this.addClass([index]);
            }
        }
        this.parent.treeGrid.grid.selectionModule.addRowsToSelection([index]);
    }
    getselectedrowsIndex(startIndex, endIndex) {
        let indexes = [];
        let { i, max } = (startIndex < endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex };
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        this.selectedRowIndexes = indexes;
    }
    /**
     * Selects a range of rows from start and end row indexes.
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @return {void}
     */
    selectRowsByRange(startIndex, endIndex) {
        this.isSelectionFromChart = true;
        this.getselectedrowsIndex(startIndex, endIndex);
        this.selectRows(this.selectedRowIndexes);
    }
    addClass(records) {
        let ganttRow = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
        for (let i = 0; i < records.length; i++) {
            addClass([ganttRow[records[i]]], 'e-active');
            ganttRow[records[i]].setAttribute('aria-selected', 'true');
        }
    }
    removeClass(records) {
        if (!this.parent.selectionSettings.persistSelection) {
            let ganttRow = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
            for (let i = 0; i < records.length; i++) {
                removeClass([ganttRow[records[i]]], 'e-active');
                ganttRow[records[i]].removeAttribute('aria-selected');
            }
        }
    }
    showPopup(e) {
        if (this.isSelectionFromChart) {
            setCssInGridPopUp(this.parent.element.querySelector('.e-ganttpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
                ((this.getSelectedRecords().length > 1 || this.getSelectedRowCellIndexes().length > 1) ? ' e-spanclicked' : ''));
            document.getElementsByClassName('e-gridpopup')[0].style.display = 'none';
        }
        else {
            this.hidePopUp();
        }
    }
    hidePopUp() {
        document.getElementsByClassName('e-ganttpopup')[0].style.display = 'none';
    }
    popUpClickHandler(e) {
        let target = e.target;
        let grid = this.parent.treeGrid.grid;
        if (closest(target, '.e-ganttpopup') || closest(target, '.e-gridpopup')) {
            if (!target.classList.contains('e-spanclicked')) {
                this.enableSelectMultiTouch = true;
                if (closest(target, '.e-ganttpopup')) {
                    target.classList.add('e-spanclicked');
                }
            }
            else {
                this.hidePopUp();
                this.enableSelectMultiTouch = false;
                if (closest(target, '.e-ganttpopup')) {
                    target.classList.remove('e-spanclicked');
                }
            }
        }
        else {
            this.hidePopUp();
        }
        if (grid) {
            setValue('enableSelectMultiTouch', this.enableSelectMultiTouch, grid.selectionModule);
        }
    }
    /**
     * @return {void}
     * @private
     */
    mouseUpHandler(e) {
        let isTaskbarEdited = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent)) {
            isTaskbarEdited = true;
        }
        if (!isTaskbarEdited && this.parent.element.contains(e.target)) {
            let parent = parentsUntil(e.target, 'e-chart-row');
            let isSelected = e.target.classList.contains('e-rowcell') ||
                e.target.classList.contains('e-row') ||
                e.target.classList.contains('e-treegridexpand') ||
                e.target.classList.contains('e-treegridcollapse') || !isNullOrUndefined(parent);
            this.popUpClickHandler(e);
            if (this.parent.selectionSettings.mode !== 'Cell' && isSelected) {
                if (closest(e.target, 'tr.e-chart-row')) {
                    this.highlightSelectedRows(e, true);
                }
                else {
                    this.highlightSelectedRows(e, false);
                }
                if (this.parent.selectionSettings.type === 'Multiple' && Browser.isDevice) {
                    this.showPopup(e);
                }
            }
            else {
                this.isSelectionFromChart = false;
            }
        }
    }
    /**
     * To destroy the column-resizer.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('selectRowByIndex', this.selectRowByIndex);
        this.parent.off('chartMouseUp', this.mouseUpHandler);
    }
}

class Toolbar$3 {
    constructor(parent) {
        this.predefinedItems = {};
        this.items = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'];
        this.parent = parent;
        this.id = this.parent.element.id;
    }
    getModuleName() {
        return 'toolbar';
    }
    /**
     * @private
     */
    renderToolbar() {
        let toolbarItems = this.parent.toolbar || [];
        if (toolbarItems.length > 0) {
            this.element = createElement('div', { id: this.parent.controlId + '_Gantt_Toolbar', className: toolbar });
            this.parent.element.appendChild(this.element);
            let preItems = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                'PrevTimeSpan', 'NextTimeSpan'];
            for (let item of preItems) {
                let itemStr = item.toLowerCase();
                let localeName = item[0].toLowerCase() + item.slice(1);
                this.predefinedItems[item] = {
                    id: this.parent.element.id + '_' + itemStr, prefixIcon: 'e-' + itemStr,
                    text: this.parent.localeObj.getConstant(localeName),
                    tooltipText: this.parent.localeObj.getConstant(localeName) + ((localeName === 'add' ||
                        localeName === 'edit' || localeName === 'delete') ? this.parent.localeObj.getConstant('task') :
                        (localeName === 'expandAll' || localeName === 'collapseAll') ?
                            this.parent.localeObj.getConstant('tasks') : '')
                };
            }
            let searchLocalText = this.parent.localeObj.getConstant('search');
            this.predefinedItems.Search = {
                id: this.id + '_search',
                template: '<div class="e-input-group e-search" role="search">\
            <input id="' + this.id + '_searchbar" class="e-input" name="input" type="search" \
            placeholder= \"' + searchLocalText + '\"/>\
            <span id="' + this.id + '_searchbutton" class="e-input-group-icon e-search-icon e-icons" \
            tabindex="-1" title="' + searchLocalText + '" aria-label= "search"></span> \
            </div>',
                tooltipText: searchLocalText,
                align: 'Right', cssClass: 'e-search-wrapper'
            };
            this.createToolbar();
        }
    }
    createToolbar() {
        let items = this.getItems();
        this.toolbar = new Toolbar$1({
            items: items,
            clicked: this.toolbarClickHandler.bind(this)
        });
        this.toolbar.appendTo(this.element);
        this.searchElement = this.element.querySelector('#' + this.parent.element.id + '_searchbar');
        if (this.parent.filterModule) {
            this.wireEvent();
            if (this.parent.searchSettings) {
                this.updateSearchTextBox();
            }
        }
    }
    wireEvent() {
        if (this.searchElement) {
            EventHandler.add(this.searchElement, 'keyup', this.keyUpHandler, this);
            EventHandler.add(this.searchElement, 'focus', this.focusHandler, this);
            EventHandler.add(this.searchElement, 'blur', this.blurHandler, this);
        }
        if (this.toolbar) {
            let mouseDown = Browser.touchStartEvent;
            EventHandler.add(this.toolbar.element, mouseDown, this.mouseDownHandler, this);
        }
    }
    unWireEvent() {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
            EventHandler.remove(this.searchElement, 'focus', this.focusHandler);
            EventHandler.remove(this.searchElement, 'blur', this.blurHandler);
        }
        if (this.toolbar) {
            let mouseDown = Browser.touchStartEvent;
            EventHandler.remove(this.toolbar.element, mouseDown, this.mouseDownHandler);
        }
    }
    keyUpHandler(e) {
        if (e.keyCode === 13 && this.parent.searchSettings.key !== this.searchElement.value) {
            this.parent.searchSettings.key = this.searchElement.value;
            this.parent.dataBind();
        }
    }
    mouseDownHandler(e) {
        if (e.target) {
            let element = closest(e.target, '.e-toolbar-item');
            if (!isNullOrUndefined(element) && !isNullOrUndefined(element.querySelector('.e-cancel'))) {
                this.parent.editModule.cellEditModule.isCellEdit = false;
                this.parent.treeGrid.closeEdit();
            }
        }
    }
    focusHandler(e) {
        e.target.parentElement.classList.add('e-input-focus');
    }
    blurHandler(e) {
        e.target.parentElement.classList.remove('e-input-focus');
    }
    /**
     * Method to set value for search input box
     * @hidden
     */
    updateSearchTextBox() {
        if (this.searchElement && this.searchElement.value !== this.parent.searchSettings.key) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    }
    getItems() {
        let items = [];
        let toolbarItems = this.parent.toolbar || [];
        if (typeof (this.parent.toolbar) === 'string') {
            return [];
        }
        for (let item of toolbarItems) {
            switch (typeof item) {
                case 'number':
                    items.push(this.getItemObject(this.items[item]));
                    break;
                case 'string':
                    items.push(this.getItemObject(item));
                    break;
                default:
                    items.push(this.getItem(item));
            }
        }
        return items;
    }
    getItem(itemObject) {
        let item = this.predefinedItems[itemObject.text];
        return item ? extend(item, item, itemObject) : itemObject;
    }
    getItemObject(itemName) {
        return this.predefinedItems[itemName] || { text: itemName, id: this.id + '_' + itemName };
    }
    toolbarClickHandler(args) {
        let gObj = this.parent;
        let gID = this.id;
        extend(args, { cancel: false });
        gObj.trigger(toolbarClick, args);
        if (args.cancel) {
            return;
        }
        switch (!isNullOrUndefined(args.item) && args.item.id) {
            case gID + '_edit':
                if (gObj.editModule && gObj.editSettings.allowEditing) {
                    gObj.editModule.dialogModule.openToolbarEditDialog();
                }
                break;
            case gID + '_update':
                gObj.editModule.cellEditModule.isCellEdit = false;
                gObj.treeGrid.endEdit();
                break;
            case gID + '_cancel':
                // gObj.editModule.cellEditModule.isCellEdit = false;
                // gObj.treeGrid.closeEdit();
                // console.log('Cancel editing');
                event.stopPropagation();
                break;
            case gID + '_add':
                if (gObj.editModule && gObj.editSettings.allowAdding) {
                    gObj.editModule.dialogModule.openAddDialog();
                }
                break;
            case gID + '_delete':
                if (this.parent.selectionModule && this.parent.editModule) {
                    if ((this.parent.selectionSettings.mode === 'Row' && this.parent.selectionModule.selectedRowIndexes.length)
                        || (this.parent.selectionSettings.mode === 'Cell' &&
                            this.parent.selectionModule.getSelectedRowCellIndexes().length)) {
                        this.parent.editModule.startDeleteAction();
                    }
                }
                break;
            case gID + '_search':
                let searchButtonId = getValue('originalEvent.target.id', args);
                if (searchButtonId === this.parent.element.id + '_searchbutton' && this.parent.filterModule) {
                    let keyVal = this.element.querySelector('#' + this.parent.element.id + '_searchbar').value;
                    if (this.parent.searchSettings.key !== keyVal) {
                        this.parent.searchSettings.key = keyVal;
                        this.parent.dataBind();
                    }
                }
                break;
            case gID + '_expandall':
                this.parent.ganttChartModule.expandCollapseAll('expand');
                break;
            case gID + '_collapseall':
                this.parent.ganttChartModule.expandCollapseAll('collapse');
                break;
            case gID + '_prevtimespan':
                this.parent.previousTimeSpan();
                break;
            case gID + '_nexttimespan':
                this.parent.nextTimeSpan();
                break;
        }
    }
    /**
     * To refresh toolbar items bases current state of tasks
     */
    refreshToolbarItems() {
        let gObj = this.parent;
        let enableItems = [];
        let disableItems = [];
        let edit = gObj.editSettings;
        let gID = this.id;
        let isSelected = gObj.selectionModule ? gObj.selectionModule.selectedRowIndexes.length === 1 ||
            gObj.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        let toolbarItems = this.toolbar.items;
        let toolbarDefaultItems = [gID + '_add', gID + '_edit', gID + '_delete',
            gID + '_update', gID + '_cancel'];
        if (!isNullOrUndefined(this.parent.editModule)) {
            let hasData = gObj.currentViewData && gObj.currentViewData.length;
            edit.allowAdding ? enableItems.push(gID + '_add') : disableItems.push(gID + '_add');
            edit.allowEditing && hasData && isSelected ? enableItems.push(gID + '_edit') : disableItems.push(gID + '_edit');
            let isDeleteSelected = gObj.selectionModule ? gObj.selectionModule.selectedRowIndexes.length > 0 ||
                gObj.selectionModule.getSelectedRowCellIndexes().length > 0 ? true : false : false;
            edit.allowDeleting && hasData && isDeleteSelected ? enableItems.push(gID + '_delete') : disableItems.push(gID + '_delete');
            if (gObj.editSettings.mode === 'Auto' && !isNullOrUndefined(gObj.editModule.cellEditModule)
                && gObj.editModule.cellEditModule.isCellEdit) {
                // New initialization for enableItems and disableItems during isCellEdit
                enableItems = [];
                enableItems.push(gID + '_update', gID + '_cancel');
                disableItems = [];
                for (let t = 0; t < toolbarItems.length; t++) {
                    if (toolbarItems[t].id !== gID + '_update' && toolbarItems[t].id !== gID + '_cancel' &&
                        toolbarDefaultItems.indexOf(toolbarItems[t].id) !== -1) {
                        disableItems.push(toolbarItems[t].id);
                    }
                }
            }
            else {
                disableItems.push(gID + '_update', gID + '_cancel');
                for (let t = 0; t < toolbarItems.length; t++) {
                    if (enableItems.indexOf(toolbarItems[t].id) === -1 && disableItems.indexOf(toolbarItems[t].id) === -1) {
                        enableItems.push(toolbarItems[t].id);
                    }
                }
            }
        }
        else {
            disableItems.push(gID + '_delete');
            disableItems.push(gID + '_add');
            disableItems.push(gID + '_edit');
            disableItems.push(gID + '_update');
            disableItems.push(gID + '_cancel');
        }
        for (let e = 0; e < enableItems.length; e++) {
            let index;
            for (let t = 0; t < toolbarItems.length; t++) {
                if (toolbarItems[t].id === enableItems[e]) {
                    index = t;
                    break;
                }
            }
            this.toolbar.hideItem(index, false);
        }
        for (let d = 0; d < disableItems.length; d++) {
            let index;
            for (let t = 0; t < toolbarItems.length; t++) {
                if (toolbarItems[t].id === disableItems[d]) {
                    index = t;
                    break;
                }
            }
            this.toolbar.hideItem(index, true);
        }
    }
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    enableItems(items, isEnable) {
        for (let item of items) {
            let element = this.element.querySelector('#' + item);
            if (element) {
                this.toolbar.enableItems(element.parentElement, isEnable);
            }
        }
    }
    /**
     * Destroys the Sorting of TreeGrid.
     * @method destroy
     * @return {void}
     * @private
     */
    destroy() {
        this.searchElement = null;
        if (this.parent.isDestroyed) {
            return;
        }
        this.toolbar.destroy();
        if (this.parent.filterModule) {
            this.unWireEvent();
        }
        remove(this.element);
    }
}

class NonWorkingDay {
    constructor(gantt) {
        this.parent = gantt;
        this.nonworkingContainer = null;
        this.holidayContainer = null;
        this.weekendContainer = null;
    }
    /**
     * Method append nonworking container
     */
    createNonworkingContainer() {
        if (!this.parent.ganttChartModule.chartBodyContent.contains(this.nonworkingContainer)) {
            this.nonworkingContainer = createElement('div', {
                className: nonworkingContainer
            });
            this.parent.ganttChartModule.chartBodyContent.appendChild(this.nonworkingContainer);
        }
    }
    /**
     * calculation for holidays rendering.
     * @private
     */
    renderHolidays() {
        if (this.parent.holidays && this.parent.holidays.length > 0) {
            this.createNonworkingContainer();
            if (!this.nonworkingContainer.contains(this.holidayContainer)) {
                this.holidayContainer = createElement('div', {
                    className: holidayContainer
                });
                this.nonworkingContainer.appendChild(this.holidayContainer);
            }
            this.holidayContainer.innerHTML = this.getHolidaysElement().innerHTML;
        }
        else if (this.holidayContainer) {
            remove(this.holidayContainer);
            if (this.nonworkingContainer && this.nonworkingContainer.childNodes.length === 0) {
                remove(this.nonworkingContainer);
            }
        }
    }
    /**
     * Method to return holidays as html string
     */
    getHolidaysElement() {
        let fromDate;
        let toDate;
        let container = createElement('div');
        let height = this.parent.contentHeight;
        let scrollElement = this.parent.ganttChartModule.scrollElement;
        let viewportHeight = parseInt(scrollElement.style.height, 10);
        for (let i = 0; i < this.parent.holidays.length; i++) {
            if (this.parent.holidays[i].from && this.parent.holidays[i].to) {
                fromDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].from);
                toDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].to);
                toDate.setDate(toDate.getDate() + 1);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(0, 0, 0, 0);
            }
            else if (this.parent.holidays[i].from) {
                fromDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].from);
                fromDate.setHours(0, 0, 0, 0);
            }
            else if (this.parent.holidays[i].to) {
                fromDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].to);
                fromDate.setHours(0, 0, 0, 0);
            }
            let width = (this.parent.holidays[i].from && this.parent.holidays[i].to) ?
                this.parent.dataOperation.getTaskWidth(fromDate, toDate) : this.parent.perDayWidth;
            let left = this.parent.dataOperation.getTaskLeft(fromDate, false);
            let holidayDiv = createElement('div', {
                className: holidayElement, styles: `left:${left}px; width:${width}px; height:100%;`
            });
            let spanTop = (viewportHeight < height) ? viewportHeight / 2 : height / 2;
            let spanElement = createElement('span', {
                className: holidayLabel, innerHTML: this.parent.holidays[i].label ? `${this.parent.holidays[i].label}` : '',
                styles: `top:${spanTop}px;left:${(width / 2)}px;`
            });
            holidayDiv.appendChild(spanElement);
            if (this.parent.holidays[i].cssClass) {
                holidayDiv.classList.add(this.parent.holidays[i].cssClass);
            }
            container.appendChild(holidayDiv);
        }
        return container;
    }
    /**
     * @private
     */
    renderWeekends() {
        if (this.parent.highlightWeekends) {
            this.createNonworkingContainer();
            if (!this.nonworkingContainer.contains(this.weekendContainer)) {
                this.weekendContainer = createElement('div', {
                    className: weekendContainer
                });
                this.nonworkingContainer.appendChild(this.weekendContainer);
            }
            this.weekendContainer.innerHTML = this.getWeekendElements().innerHTML;
        }
        else if (this.weekendContainer) {
            remove(this.weekendContainer);
            if (this.nonworkingContainer && this.nonworkingContainer.childNodes.length === 0) {
                remove(this.nonworkingContainer);
            }
        }
    }
    /**
     * Method to get weekend html string
     */
    getWeekendElements() {
        let container = createElement('div');
        let startDate = new Date(this.parent.timelineModule.timelineStartDate.getTime());
        let endDate = new Date(this.parent.timelineModule.timelineEndDate.getTime());
        let nonWorkingIndex = this.parent.nonWorkingDayIndex;
        let isFirstCell = true;
        do {
            if (nonWorkingIndex.indexOf(startDate.getDay()) !== -1) {
                let left = this.parent.dataOperation.getTaskLeft(startDate, false);
                let width = this.parent.perDayWidth;
                if (isFirstCell) {
                    let start = new Date(startDate.getTime());
                    let tempEnd = new Date(start.getTime());
                    tempEnd.setDate(tempEnd.getDate() + 1);
                    tempEnd.setHours(0, 0, 0, 0);
                    width = this.parent.dataOperation.getTaskWidth(start, tempEnd);
                    isFirstCell = false;
                }
                let weekendDiv = createElement('div', {
                    className: weekend, styles: `left:${left}px;width:${width}px;height:100%;`
                });
                container.appendChild(weekendDiv);
            }
            startDate.setDate(startDate.getDate() + 1);
            startDate.setHours(0, 0, 0, 0);
        } while (startDate < endDate);
        return container;
    }
    updateHolidayLabelHeight() {
        let height = this.parent.contentHeight;
        let scrollElement = this.parent.ganttChartModule.scrollElement;
        let viewportHeight = parseInt(scrollElement.style.height, 10);
        let top = (viewportHeight < height) ? viewportHeight / 2 : height / 2;
        let labels = this.holidayContainer.querySelectorAll('.' + holidayLabel);
        labels.forEach((element) => {
            element.style.top = formatUnit(top);
        });
    }
    /**
     * Method to update height for all internal containers
     * @private
     */
    updateContainerHeight() {
        if (this.holidayContainer) {
            this.holidayContainer.style.height = formatUnit(this.parent.contentHeight);
            this.updateHolidayLabelHeight();
        }
        if (this.weekendContainer) {
            this.weekendContainer.style.height = formatUnit(this.parent.contentHeight);
        }
    }
    /**
     * Method to remove containers of holiday and weekend
     */
    removeContainers() {
        if (this.holidayContainer) {
            remove(this.holidayContainer);
        }
        if (this.weekendContainer) {
            remove(this.weekendContainer);
        }
        if (this.nonworkingContainer) {
            remove(this.nonworkingContainer);
        }
    }
}

class EventMarker$1 {
    constructor(gantt) {
        this.parent = gantt;
        this.eventMarkersContainer = null;
    }
    /**
     * @private
     */
    renderEventMarkers() {
        if (this.parent.eventMarkers && this.parent.eventMarkers.length > 0) {
            if (!this.parent.ganttChartModule.chartBodyContent.contains(this.eventMarkersContainer)) {
                this.eventMarkersContainer = createElement('div', {
                    className: eventMarkersContainer
                });
                this.parent.ganttChartModule.chartBodyContent.appendChild(this.eventMarkersContainer);
            }
            this.eventMarkersContainer.innerHTML = '';
            this.getEventMarkersElements(this.eventMarkersContainer);
        }
        else if (this.eventMarkersContainer) {
            remove(this.eventMarkersContainer);
        }
    }
    /**
     * @private
     */
    removeContainer() {
        if (this.eventMarkersContainer) {
            remove(this.eventMarkersContainer);
        }
    }
    /**
     * Method to get event markers as html string
     */
    getEventMarkersElements(container) {
        let left;
        let eventMarkerElement;
        let spanElement;
        let rightArrow;
        for (let i = 0; i < this.parent.eventMarkers.length; i++) {
            left = this.parent.dataOperation.getTaskLeft(this.parent.dateValidationModule.getDateFromFormat(this.parent.eventMarkers[i].day), false);
            eventMarkerElement = createElement('div', {
                className: eventMarkersChild, styles: `left:${left}px;  height:100%;`,
                id: 'stripline' + i
            });
            if (this.parent.eventMarkers[i].label) {
                spanElement = createElement('div', {
                    className: eventMarkersSpan, innerHTML: `${this.parent.eventMarkers[i].label}`
                });
                eventMarkerElement.appendChild(spanElement);
                rightArrow = createElement('div', {
                    className: 'e-gantt-right-arrow'
                });
                eventMarkerElement.appendChild(rightArrow);
            }
            if (this.parent.eventMarkers[i].cssClass) {
                eventMarkerElement.classList.add(this.parent.eventMarkers[i].cssClass);
            }
            container.appendChild(eventMarkerElement);
        }
    }
    /**
     * @private
     */
    updateContainerHeight() {
        if (this.eventMarkersContainer) {
            this.eventMarkersContainer.style.height = formatUnit(this.parent.contentHeight);
        }
    }
}

/**
 *
 */
class DayMarkers {
    constructor(parent) {
        this.parent = parent;
        this.nonworkingDayRender = new NonWorkingDay(this.parent);
        this.eventMarkerRender = new EventMarker$1(this.parent);
        this.wireEvents();
    }
    wireEvents() {
        this.parent.on('refreshDayMarkers', this.refreshMarkers, this);
        this.parent.on('updateHeight', this.updateHeight, this);
        this.parent.on('ui-update', this.propertyChanged, this);
    }
    propertyChanged(property) {
        let keys = Object.keys(getValue('properties', property));
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            switch (key) {
                case 'eventMarkers':
                    this.eventMarkerRender.renderEventMarkers();
                    break;
                case 'highlightWeekends':
                    this.nonworkingDayRender.renderWeekends();
                    break;
                case 'holidays':
                    this.nonworkingDayRender.renderHolidays();
                    break;
            }
        }
    }
    refreshMarkers() {
        this.eventMarkerRender.renderEventMarkers();
        this.nonworkingDayRender.renderWeekends();
        this.nonworkingDayRender.renderHolidays();
    }
    updateHeight() {
        this.nonworkingDayRender.updateContainerHeight();
        this.eventMarkerRender.updateContainerHeight();
    }
    /**
     * @private
     */
    getModuleName() {
        return 'dayMarkers';
    }
    /**
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.nonworkingDayRender.removeContainers();
        this.eventMarkerRender.removeContainer();
        this.parent.off('refreshDayMarkers', this.refreshMarkers);
        this.parent.off('updateHeight', this.updateHeight);
        this.parent.off('ui-update', this.propertyChanged);
    }
}

/**
 * Gantt Action Modules
 */

/**
 * Gantt Component exported items
 */

/**
 * Gantt index file
 */

export { Gantt, parentsUntil$1 as parentsUntil, isScheduledTask, getSwapKey, isRemoteData, getTaskData, formatString, getIndex, DurationUnits, EditType, load, rowDataBound, queryCellInfo, toolbarClick, keyPressed, Edit$2 as Edit, Reorder$1 as Reorder, Resize$1 as Resize, Filter$2 as Filter, Sort$1 as Sort, Dependency, Selection$1 as Selection, Toolbar$3 as Toolbar, DayMarkers, Column, DayWorkingTime, AddDialogFieldSettings, EditDialogFieldSettings, EditSettings, EventMarker, FilterSettings, SearchSettings, Holiday, LabelSettings, SelectionSettings, SplitterSettings, TaskFields, TimelineTierSettings, TimelineSettings, TooltipSettings, SortDescriptor, SortSettings };
//# sourceMappingURL=ej2-gantt.es2015.js.map
