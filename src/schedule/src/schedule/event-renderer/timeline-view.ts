/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, setStyleAttribute, extend, EventHandler, createElement } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { MonthEvent } from './month';
import { TdData } from '../base/interface';

const EVENT_GAP: number = 2;
const BLOCK_INDICATOR_WIDTH: number = 22;
const BLOCK_INDICATOR_HEIGHT: number = 18;
/**
 * Timeline view events render
 */
export class TimelineEvent extends MonthEvent {
    private startHour: Date = this.parent.activeView.getStartHour();
    private endHour: Date = this.parent.activeView.getEndHour();
    public slotCount: number = this.parent.activeViewOptions.timeScale.slotCount;
    private interval: number = this.parent.activeViewOptions.timeScale.interval;
    private day: number = 0;
    public eventContainers: HTMLElement[];
    private dayLength: number;
    public slotsPerDay: number;
    private content: HTMLElement;
    private rowIndex: number = 0;
    public inlineValue: boolean;
    private cellTops: number[] = [];

    constructor(parent: Schedule, type: string) {
        super(parent);
        this.renderType = type;
        this.eventContainers = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        const tr: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr'));
        this.dayLength = tr.length === 0 ? 0 : tr[0].children.length;
        this.content = this.parent.element.querySelector('.' + cls.SCHEDULE_TABLE_CLASS + '.' + cls.CONTENT_TABLE_CLASS);
    }

    public getSlotDates(): void {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }) as any);
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            this.renderType = 'day';
            const workCell: HTMLTableCellElement = this.content.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLTableCellElement;
            this.cellWidth = this.parent.getElementWidth(workCell) / +(workCell.getAttribute('colspan') || 1);
            this.slotsPerDay = 1;
        } else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
    }

    public getOverlapEvents(date: Date, appointments: Record<string, any>[]): Record<string, any>[] {
        const appointmentsList: Record<string, any>[] = [];
        if (this.renderType === 'day') {
            for (const app of appointments) {
                if ((util.resetTime(<Date>app[this.fields.startTime]).getTime() <= util.resetTime(new Date(date.getTime())).getTime()) &&
                    (util.resetTime(<Date>app[this.fields.endTime]).getTime() >= util.resetTime(new Date(date.getTime())).getTime())) {
                    appointmentsList.push(app);
                }
            }
        } else {
            for (const app of appointments) {
                const eventData: Record<string, any> = app.data as Record<string, any>;
                if (((<Date>eventData.trimStartTime).getTime() <= date.getTime() &&
                    (<Date>eventData.trimEndTime).getTime() > date.getTime()) ||
                    ((<Date>eventData.trimStartTime).getTime() === date.getTime() &&
                        (<Date>eventData.trimEndTime).getTime() === date.getTime())) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    }

    public getSortComparerIndex(startDate: Date, endDate: Date): number {
        let appIndex: number = -1;
        const appointments: Record<string, any>[] = <Record<string, any>[]>this.renderedEvents;
        if (appointments.length > 0) {
            const appointmentsList: Record<string, any>[] = this.getOverlapSortComparerEvents(startDate, endDate, appointments);
            const appLevel: number[] = appointmentsList.map((obj: Record<string, any>) => obj.Index) as number[];
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }

    public getOverlapSortComparerEvents(startDate: Date, endDate: Date, appointmentsCollection: Record<string, any>[]): Record<string, any>[] {
        const appointments: Record<string, any>[] = [];
        for (const app of appointmentsCollection) {
            if (this.renderType === 'day') {
                const start: number = util.resetTime(startDate).getTime();
                const end: number = util.resetTime(endDate).getTime();
                const appStart: number = util.resetTime(<Date>app[this.fields.startTime]).getTime();
                const appEnd: number = util.resetTime(<Date>app[this.fields.endTime]).getTime();
                const isEndOverlap : () => boolean = () => {
                    let endTime: number = (end - (util.getDateInMs(endDate) <= 0 ? util.MS_PER_DAY : 0));
                    endTime = start > endTime ? start : endTime;
                    return appEnd >= endTime && appStart <= endTime;
                };
                if (appStart <= start && appEnd >= start || isEndOverlap() || appStart > start && appEnd < end) {
                    appointments.push(app);
                }
            } else {
                const eventData: Record<string, any> = app.data as Record<string, any>;
                if (((eventData.trimStartTime.getTime() <= startDate.getTime()) && (startDate.getTime() < eventData.trimEndTime.getTime())) ||
                    ((startDate.getTime() <= eventData.trimStartTime.getTime()) && (eventData.trimStartTime.getTime() < endDate.getTime()))) {
                    appointments.push(app);
                }
            }
        }
        return appointments;
    }

    public renderResourceEvents(): void {
        this.removeHeightProperty(cls.RESOURCE_COLUMN_TABLE_CLASS);
        const selector: string = '.' + cls.RESOURCE_COLUMN_TABLE_CLASS + ' tbody tr';
        this.addCellHeight(selector, this.eventHeight, EVENT_GAP, this.moreIndicatorHeight, 0, false);
        const resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.renderedResources;
        if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
            for (let i: number = 0, len: number = this.parent.crudModule.crudObj.sourceEvent.length; i < len; i++) {
                const source: TdData = this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)];
                this.rowIndex = source.groupIndex;
                if (!this.parent.uiStateValues.isGroupAdaptive ||
                    (this.parent.uiStateValues.groupIndex === source.groupIndex && this.parent.uiStateValues.isGroupAdaptive)) {
                    this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, source);
                }
                if (this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)] && this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex !==
                    this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex) {
                    const target: TdData = this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)];
                    this.rowIndex = target.groupIndex;
                    this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, target);
                }
            }
            this.parent.crudModule.crudObj.isCrudAction = false;
        } else {
            for (let i: number = 0; i < resources.length; i++) {
                this.rowIndex = i;
                this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, resources[parseInt(i.toString(), 10)]);
            }
        }
    }

    public renderEvents(event: Record<string, any>, resIndex: number, appointmentsList?: Record<string, any>[]): void {
        let startTime: Date = event[this.fields.startTime] as Date;
        let endTime: Date = event[this.fields.endTime] as Date;
        if ((startTime.getTime() < this.parent.minDate.getTime()) || (endTime.getTime() > this.parent.maxDate.getTime())) {
            return;
        }
        const eventData: Record<string, any> = event.data as Record<string, any>;
        startTime = this.getStartTime(event, eventData);
        endTime = this.getEndTime(event, eventData);
        const startEndHours: Record<string, Date> = util.getStartEndHours(event[this.fields.startTime], this.startHour, this.endHour);
        const eventDates: Record<string, Date> = this.updateEventMinimumDuration(startEndHours, startTime, endTime);
        startTime = eventDates.startDate;
        endTime = eventDates.endDate;
        this.day = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        if (this.day < 0) {
            return;
        }
        const cellTd: HTMLElement = this.getCellTd();
        const eventsPerRow: number = this.parent.rowAutoHeight ? 1 : this.parent.activeViewOptions.maxEventsPerRow;
        const overlapCount: number = (isNullOrUndefined(this.parent.eventSettings.sortComparer)) ? this.getIndex(startTime) : this.getSortComparerIndex(startTime, endTime);
        event.Index = overlapCount;
        const appHeight: number = this.eventHeight;
        const diffInDays: number = eventData.count as number;
        const eventObj: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        eventObj[this.fields.startTime] = eventData[this.fields.startTime];
        eventObj[this.fields.endTime] = eventData[this.fields.endTime];
        const currentDate: Date = util.resetTime(new Date(this.dateRender[this.day].getTime()));
        const schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let isValidEvent: boolean = true;
        if (this.isDayProcess() || eventObj[this.fields.isAllDay]) {
            isValidEvent = true;
        } else {
            isValidEvent = this.isValidEvent(eventObj, startTime, endTime, schedule);
        }
        if (startTime <= endTime && isValidEvent) {
            let appWidth: number = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay] as boolean, diffInDays);
            appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
            let appLeft: number = 0;
            let appRight: number = 0;
            const position: number = this.getPosition(startTime, endTime, event[this.fields.isAllDay] as boolean, this.day);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
            this.renderedEvents.push(extend({}, event, null, true) as Record<string, any>);
            if (isNullOrUndefined(this.cellTops[parseInt(resIndex.toString(), 10)])) {
                this.cellTops[parseInt(resIndex.toString(), 10)] = this.getRowTop(resIndex);
            }
            const top: number = this.cellTops[parseInt(resIndex.toString(), 10)];
            const appTop: number = (top + (this.maxHeight ? 0 : EVENT_GAP)) + (overlapCount * (appHeight + EVENT_GAP));
            appLeft = (this.parent.enableRtl) ? 0 : position;
            appRight = (this.parent.enableRtl) ? position : 0;
            const height: number = ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            const renderApp: boolean = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight && !this.parent.eventSettings.enableIndicator
                ? overlapCount < eventsPerRow : this.maxOrIndicator ? overlapCount < 1 ? true : false : this.cellHeight > height;
            if (this.parent.rowAutoHeight || renderApp) {
                let appointmentElement: HTMLElement;
                if (isNullOrUndefined(this.inlineValue)) {
                    appointmentElement = this.createAppointmentElement(event, resIndex);
                } else {
                    appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
                }
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                setStyleAttribute(appointmentElement, {
                    'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                });
                this.wireAppointmentEvents(appointmentElement, event);
                if (this.parent.rowAutoHeight) {
                    const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
                    const conWidth: number = this.parent.getElementWidth(conWrap);
                    const isWithoutScroll: boolean = conWrap.offsetHeight === conWrap.clientHeight &&
                        conWrap.offsetWidth === conWrap.clientWidth;
                    this.renderEventElement(event, appointmentElement, cellTd);
                    const firstChild: HTMLElement = this.getFirstChild(resIndex);
                    this.updateCellHeight(firstChild, height);
                    if (isWithoutScroll &&
                        (conWrap.offsetWidth > conWrap.clientWidth || conWidth !== this.parent.getElementWidth(conWrap))) {
                        this.adjustAppointments(conWidth);
                    }
                } else {
                    this.renderEventElement(event, appointmentElement, cellTd);
                }
            } else {
                for (let i: number = 0; i < diffInDays; i++) {
                    const moreIndicator: HTMLElement = cellTd.querySelector('.' + cls.MORE_INDICATOR_CLASS) as HTMLElement;
                    let appPos: number = (this.parent.enableRtl) ? appRight : appLeft;
                    appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
                    const interval: number = this.interval / this.slotCount;
                    let startDate: Date = (this.parent.activeViewOptions.option === 'TimelineMonth' || this.renderType === 'day' || i !== 0) ?
                        new Date(this.dateRender[this.day + i].getTime()) : new Date(startTime);
                    let endDate: Date = util.addDays(this.dateRender[this.day + i], 1);
                    if (this.parent.activeViewOptions.option === 'TimelineMonth' || this.renderType === 'day') {
                        const position: number = this.getPosition(startDate, endDate, event[this.fields.isAllDay], (this.day + i));
                        this.renderTimelineMoreIndicator(startTime, startDate, endDate, appHeight, interval, resIndex, appointmentsList, top, appLeft, appRight, cellTd, moreIndicator, appPos, position);
                    } else {
                        const slotCount: number = (util.getUniversalTime(endTime) - util.getUniversalTime(startTime)) / util.MS_PER_MINUTE *
                            this.slotCount / this.interval;
                        for (let k: number = 0; k < slotCount; k++) {
                            startDate = (k === 0) ? new Date(startDate.getTime()) : new Date(startDate.getTime() + (60000 * interval));
                            if (slotCount < 1) {
                                startDate = this.adjustToNearestTimeSlot(startDate, interval);
                            }
                            endDate = new Date(startDate.getTime() + (60000 * interval));
                            if (slotCount >= 1 && endDate.getTime() > endTime.getTime()) {
                                break;
                            }
                            const position: number = this.getPosition(startDate, endDate, false, (this.day + i));
                            if (appPos > position) {
                                break;
                            }
                            appPos = position;
                            this.renderTimelineMoreIndicator(startTime, startDate, endDate, appHeight, interval, resIndex, appointmentsList, top, appLeft, appRight, cellTd, moreIndicator, appPos, position);
                        }
                    }
                }
            }
        }
        this.parent.renderTemplates();
    }

    private adjustToNearestTimeSlot(inputTime: Date, interval: number): Date {
        // Parse the input time
        const parsedTime: Date = new Date(inputTime);

        // Get the minutes of the input time in milliseconds
        const minutesInMilliseconds: number = parsedTime.getHours() * 60 * 60 * 1000 + parsedTime.getMinutes() * 60 * 1000;

        // Calculate the adjusted time in milliseconds (nearest time slot)
        const adjustedMinutesInMilliseconds: number = Math.floor(minutesInMilliseconds / (interval * 60 * 1000)) * (interval * 60 * 1000);

        // Create a new Date object with the adjusted time
        const adjustedTime: Date = new Date(parsedTime.getTime());
        adjustedTime.setHours(adjustedMinutesInMilliseconds / (60 * 60 * 1000) % 24);
        adjustedTime.setMinutes((adjustedMinutesInMilliseconds % (60 * 60 * 1000)) / (60 * 1000));

        // Return the adjusted time in string format
        return adjustedTime;
    }

    private renderTimelineMoreIndicator(startTime: Date, startDate: Date, endDate: Date, appHeight: number, interval: number, resIndex: number, appointmentsList: Record<string, any>[], top: number, appLeft: number, appRight: number, cellTd: HTMLElement, moreIndicator: HTMLElement, appPos: number, position: number): void {
        appLeft = (this.parent.enableRtl) ? appRight = position : position;
        appPos = (this.parent.enableRtl) ? appRight : appLeft;
        appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
        if ((cellTd && isNullOrUndefined(moreIndicator)) ||
            (!this.isAlreadyAvail(appPos, cellTd))) {
            const startDateTime: Date = (this.parent.activeViewOptions.option === 'TimelineMonth' || this.renderType === 'day') ? new Date(+startTime) : startDate;
            const slotStartTime: Date =
                (new Date(startDateTime.setMinutes(Math.floor(startDateTime.getMinutes() / interval) * interval)));
            const slotEndTime: Date = new Date(slotStartTime.getTime() + (60000 * interval));
            let groupIndex: string;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(resIndex)) {
                groupIndex = resIndex.toString();
            }
            const filterEvents: Record<string, any>[] =
                this.getFilterEvents(startDate, endDate, slotStartTime, slotEndTime, groupIndex, appointmentsList);
            const appArea: number = this.cellHeight - this.moreIndicatorHeight;
            appHeight = this.withIndicator ? appArea - EVENT_GAP : appHeight;
            const renderedAppCount: number = Math.floor(appArea / (appHeight + EVENT_GAP));
            const count: number = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.eventSettings.enableIndicator
                ? filterEvents.length - this.parent.activeViewOptions.maxEventsPerRow : (filterEvents.length - renderedAppCount) <= 0 ? 1
                    : filterEvents.length - renderedAppCount;
            let moreIndicatorElement: HTMLElement;
            if (this.renderType === 'day') {
                moreIndicatorElement = this.getMoreIndicatorElement(count, startDate, endDate);
            } else {
                moreIndicatorElement = this.getMoreIndicatorElement(count, slotStartTime, slotEndTime);
            }
            if (!isNullOrUndefined(groupIndex)) {
                moreIndicatorElement.setAttribute('data-group-index', groupIndex);
            }
            moreIndicatorElement.style.top = top + appArea + 'px';
            moreIndicatorElement.style.width = this.cellWidth + 'px';
            moreIndicatorElement.style.left = (Math.floor(appLeft / this.cellWidth) * this.cellWidth) + 'px';
            moreIndicatorElement.style.right = (Math.floor(appRight / this.cellWidth) * this.cellWidth) + 'px';
            this.renderElement(cellTd, moreIndicatorElement);
            EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
        }
    }
    public updateCellHeight(cell: HTMLElement, height: number): void {
        const cellHeight: number = cell.style.height === '' ? this.cellHeight : parseInt(cell.style.height, 10);
        if (height > cellHeight) {
            setStyleAttribute(cell, { 'height': height + 'px' });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                const resourceCell: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_TABLE_CLASS + ' ' + 'tbody td[data-group-index="' +
                    cell.getAttribute('data-group-index') + '"]') as HTMLElement;
                if (resourceCell) {
                    setStyleAttribute(resourceCell, { 'height': height + 'px' });
                }
            }
            const monthHeader: HTMLElement = this.parent.element.querySelector('.e-month-header-wrapper table tr:nth-child(' +
                ((cell.parentElement as HTMLTableRowElement).rowIndex + 1) + ') td') as HTMLElement;
            if (monthHeader) {
                setStyleAttribute(monthHeader, { 'height': height + 'px' });
            }
        }
    }

    private getFirstChild(index: number): HTMLElement {
        const query: string = '.' + cls.CONTENT_TABLE_CLASS + ' tbody td';
        let groupIndex: string = '';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            groupIndex = '[data-group-index="' + index.toString() + '"]';
        }
        const td: HTMLElement = this.parent.element.querySelector(query + groupIndex) as HTMLElement;
        return td;
    }

    public updateBlockElements(): void {
        const blockElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (const element of blockElement) {
            const resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            const firstChild: HTMLElement = this.getFirstChild(resIndex);
            element.style.height = (firstChild.offsetHeight - 1) + 'px';
            const width: number = element.offsetWidth / firstChild.offsetWidth;
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
        const blockIndicator: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_INDICATOR_CLASS));
        for (const element of blockIndicator) {
            const resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            element.style.top = this.getRowTop(resIndex) +
                this.getFirstChild(resIndex).offsetHeight - BLOCK_INDICATOR_HEIGHT + 'px';
        }
    }

    public getStartTime(event: Record<string, any>, eventData: Record<string, any>): Date {
        let startTime: Date = event[this.fields.startTime] as Date;
        const schedule: { [key: string]: Date } = util.getStartEndHours(startTime, this.startHour, this.endHour);
        if (this.isDayProcess()) {
            startTime = event[this.fields.startTime] as Date;
        } else {
            if (schedule.startHour.getTime() >= eventData[this.fields.startTime]) {
                startTime = schedule.startHour;
            } else if (schedule.endHour.getTime() <= eventData[this.fields.startTime]) {
                startTime = this.getNextDay(schedule.startHour, eventData);
            } else {
                startTime = eventData[this.fields.startTime] as Date;
            }
        }
        // To overcome the overflow
        eventData.trimStartTime = (event[this.fields.isAllDay]) ? schedule.startHour : eventData[this.fields.startTime];
        return startTime;
    }

    private getNextDay(startTime: Date, eventData: Record<string, any>): Date {
        let startDate: Date;
        for (let i: number = 1; i <= this.dateRender.length; i++) {
            startDate = util.addDays(startTime, i);
            if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()))) !== -1) {
                eventData.count = eventData.count as number - 1;
                return startDate;
            }
        }
        return startDate;
    }

    public getEndTime(event: Record<string, any>, eventData: Record<string, any>): Date {
        let endTime: Date = event[this.fields.endTime] as Date;
        const schedule: { [key: string]: Date } = util.getStartEndHours(endTime, this.startHour, this.endHour);
        if (this.isDayProcess()) {
            endTime = eventData[this.fields.endTime] as Date;
        } else {
            endTime = eventData[this.fields.endTime] as Date;
            if (schedule.endHour.getTime() <= eventData[this.fields.endTime] || event[this.fields.isAllDay]) {
                endTime = schedule.endHour;
            }
            if (schedule.startHour.getTime() >= eventData[this.fields.endTime].getTime() && !event[this.fields.isAllDay]) {
                endTime = this.getPreviousDay(schedule.startHour, schedule.endHour, eventData);
            }
        }
        // To overcome the overflow
        eventData.trimEndTime = (event[this.fields.isAllDay]) ? schedule.endHour : eventData[this.fields.endTime];
        return endTime;
    }

    private getPreviousDay(startTime: Date, endTime: Date, eventData: Record<string, any>): Date {
        for (let i: number = 1; i <= this.dateRender.length; i++) {
            let endDate: Date = util.addDays(endTime, -i);
            if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()))) !== -1) {
                endDate = util.resetTime(new Date(endDate.getTime()));
                endDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                const count: number = eventData.count as number;
                const actualEndTime: Date = eventData[this.fields.endTime] as Date;
                eventData.count = actualEndTime.getHours() !== 0 || actualEndTime.getMinutes() !== 0 ? count - 1 : count;
                return endDate;
            }
        }
        return eventData[this.fields.endTime];
    }

    public getEventWidth(startDate: Date, endDate: Date, isAllDay: boolean, count: number): number {
        if (this.renderType === 'day' || isAllDay) {
            return (count * this.slotsPerDay) * this.cellWidth;
        }
        if (this.isSameDay(startDate, endDate)) {
            return this.getSameDayEventsWidth(startDate, endDate);
        } else {
            return this.getSpannedEventsWidth(startDate, endDate, count);
        }
    }

    private getSameDayEventsWidth(startDate: Date, endDate: Date): number {
        return ((util.getUniversalTime(endDate) - util.getUniversalTime(startDate)) /
            util.MS_PER_MINUTE * (this.cellWidth * this.slotCount) / this.getIntervalInMinutes(startDate));
    }

    private getSpannedEventsWidth(startDate: Date, endDate: Date, diffInDays: number): number {
        const width: number = (diffInDays * this.slotsPerDay) * this.cellWidth;
        let endWidth: number;
        const start: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        const startWidth: number = this.getSameDayEventsWidth(start.startHour, startDate);
        if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(endDate.getTime()))) === -1) {
            endWidth = 0;
        } else {
            const { startHour, endHour }: { [key: string]: Date } =
                util.getStartEndHours(util.resetTime(new Date(endDate.getTime())), this.startHour, this.endHour);
            const interval: number = this.interval / this.slotCount;
            const lastSlotEndTime: Date = this.getEndTimeOfLastSlot(startHour, endHour, interval);
            const adjustedEndDate: Date = endHour < lastSlotEndTime ? endHour : lastSlotEndTime;
            endWidth = this.getSameDayEventsWidth(endDate, adjustedEndDate);
            endWidth = ((this.slotsPerDay * this.cellWidth) === endWidth) ? 0 : endWidth;
        }
        const spannedWidth: number = startWidth + endWidth;
        return (width > spannedWidth) ? width - spannedWidth : width - startWidth;
    }

    private getEndTimeOfLastSlot(startHour: Date, endHour: Date, interval: number): Date {
        const minutesInDay: number = (endHour.getTime() - startHour.getTime()) / (1000 * 60);
        const lastSlotEndMinutes: number = Math.floor(minutesInDay / interval) * interval;
        const lastSlotEndTime: Date = new Date(startHour);
        lastSlotEndTime.setMinutes(lastSlotEndMinutes);
        return lastSlotEndTime;
    }

    private isSameDay(startTime: Date, endTime: Date): boolean {
        const startDay: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()) as Date));
        const endDay: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(endTime.getTime()) as Date));
        return (startDay === endDay);
    }

    private getAppointmentLeft(schedule: { [key: string]: Date }, startTime: Date, day: number): number {
        const slotTd: number = (this.isSameDay(startTime, schedule.startHour as Date)) ?
            ((util.getUniversalTime(startTime) - util.getUniversalTime(schedule.startHour)) /
                (util.MS_PER_MINUTE * this.getIntervalInMinutes(startTime))) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        } else {
            const daySlot: number = Math.round(((util.getUniversalTime(schedule.endHour) - util.getUniversalTime(schedule.startHour)) /
                this.interval / util.MS_PER_MINUTE) * this.slotCount);
            return (daySlot * day) + slotTd;
        }
    }

    public getPosition(startTime: Date, endTime: Date, isAllDay: boolean, day: number): number {
        if (this.renderType === 'day' || isAllDay) {
            return (day * this.slotsPerDay) * this.cellWidth;
        }
        const currentDate: Date = util.resetTime(new Date(this.dateRender[parseInt(day.toString(), 10)].getTime()));
        const schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let cellIndex: number;
        if (schedule.endHour.getTime() <= endTime.getTime() && schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        } else if (schedule.endHour.getTime() <= endTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        } else if (schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        } else {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        }
        return cellIndex * this.cellWidth;
    }

    private getFilterEvents(startDate: Date, endDate: Date, startTime: Date, endTime: Date, gIndex: string, eventsList?: Record<string, any>[]): Record<string, any>[] {
        if (this.renderType === 'day') {
            return this.getFilteredEvents(startDate, endDate, gIndex, eventsList);
        } else {
            return this.getFilteredEvents(startTime, endTime, gIndex, eventsList);
        }
    }

    private getIntervalInMinutes(startDate: Date): number {
        if (this.slotsPerDay !== 1) {
            return this.interval;
        }
        const hoursRange: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        return (hoursRange.endHour.getTime() - hoursRange.startHour.getTime()) / util.MS_PER_MINUTE;
    }

    private isAlreadyAvail(appPos: number, cellTd: HTMLElement): boolean {
        const moreIndicator: HTMLElement[] = [].slice.call(cellTd.querySelectorAll('.' + cls.MORE_INDICATOR_CLASS));
        for (let i: number = 0; i < moreIndicator.length; i++) {
            let indicatorPos: string;
            if (moreIndicator) {
                indicatorPos = (this.parent.enableRtl) ? moreIndicator[parseInt(i.toString(), 10)].style.right : moreIndicator[parseInt(i.toString(), 10)].style.left;
            }
            if (parseInt(indicatorPos, 10) === Math.floor(appPos)) {
                return true;
            }
        }
        return false;
    }

    public getRowTop(resIndex: number): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return (<HTMLElement>this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"]')).offsetTop;
        }
        return 0;
    }

    public getCellTd(): HTMLElement {
        const wrapIndex: number = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.eventContainers[parseInt(wrapIndex.toString(), 10)] as HTMLElement;
    }

    public renderBlockIndicator(cellTd: HTMLElement, position: number, resIndex: number): void {
        // No need to render block icon for Year, Month and Week header rows
        if (this.parent.headerRows.length > 0 &&
            (this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour' ||
                this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Date')) {
            return;
        }
        position = (Math.floor(position / this.cellWidth) * this.cellWidth) + this.cellWidth - BLOCK_INDICATOR_WIDTH;
        if (!this.isAlreadyAvail(position, cellTd)) {
            const blockIndicator: HTMLElement = createElement('div', { className: 'e-icons ' + cls.BLOCK_INDICATOR_CLASS });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                blockIndicator.setAttribute('data-group-index', resIndex.toString());
            }
            if (this.parent.enableRtl) {
                blockIndicator.style.right = position + 'px';
            } else {
                blockIndicator.style.left = position + 'px';
            }
            blockIndicator.style.top = this.getRowTop(resIndex) + this.cellHeight - BLOCK_INDICATOR_HEIGHT + 'px';
            this.renderElement(cellTd, blockIndicator);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void {
        setStyleAttribute(event, {
            'height': (this.cellHeight - (this.maxHeight ? 0 : EVENT_GAP) - (this.maxHeight ? 0 : this.moreIndicatorHeight)) + 'px'
        });
    }

    private isDayProcess(): boolean {
        if (this.parent.currentView === 'TimelineMonth' || !this.parent.activeViewOptions.timeScale.enable ||
        (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour')) {
            return true;
        }
        return false;
    }

    public destroy(): void {
        this.renderType = null;
        this.eventContainers = null;
        this.dayLength = null;
        this.content = null;
        super.destroy();
        this.parent = null;
    }

}
