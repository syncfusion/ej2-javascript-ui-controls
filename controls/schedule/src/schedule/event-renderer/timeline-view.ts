import { isNullOrUndefined, setStyleAttribute, extend, EventHandler } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';
import { MonthEvent } from './month';
import { TdData } from '../base/interface';

const EVENT_GAP: number = 2;
/**
 * Timeline view events render
 */
export class TimelineEvent extends MonthEvent {
    private startHour: Date = this.parent.activeView.getStartHour();
    private endHour: Date = this.parent.activeView.getEndHour();
    private slotCount: number = this.parent.activeViewOptions.timeScale.slotCount;
    private interval: number = this.parent.activeViewOptions.timeScale.interval;
    private day: number = 0;
    private renderType: string;
    private appContainers: HTMLElement[];
    private dayLength: number;
    private slotsPerDay: number;
    private content: HTMLElement;
    /**
     * Constructor for timeline views
     */
    constructor(parent: Schedule, type: string) {
        super(parent);
        this.renderType = type;
        this.appContainers = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        this.dayLength = this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr')[0].children.length;
        this.content = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
    }

    public getSlotDates(): void {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }));
    }

    public getOverlapEvents(date: Date, appointments: { [key: string]: Object }[]): Object[] {
        let appointmentsList: Object[] = [];
        if (this.renderType === 'day') {
            for (let app of appointments) {
                if ((util.resetTime(<Date>app[this.fields.startTime]).getTime() <= util.resetTime(new Date(date.getTime())).getTime()) &&
                    (util.resetTime(<Date>app[this.fields.endTime]).getTime() >= util.resetTime(new Date(date.getTime())).getTime())) {
                    appointmentsList.push(app);
                }
            }
        } else {
            for (let app of appointments) {
                let eventData: { [key: string]: Object } = app.data as { [key: string]: Object };
                if ((<Date>eventData[this.fields.startTime]).getTime() <= date.getTime() &&
                    (<Date>eventData[this.fields.endTime]).getTime() > date.getTime()) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    }

    public renderResourceEvents(): void {
        let resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel;
        for (let i: number = 0; i < resources.length; i++) {
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, resources[i]);
        }
    }

    public renderEvents(event: { [key: string]: Object }, resIndex: number): void {
        if (this.parent.headerRows.length > 0 &&
            this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour') {
            this.renderType = 'day';
            this.cellWidth = this.content.offsetWidth / this.dateRender.length;
            this.slotsPerDay = 1;
        } else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
        let wrapIndex: number = this.parent.uiStateValues.isGroupAdaptive ? 0 : resIndex;
        let eventData: { [key: string]: Object } = event.data as { [key: string]: Object };
        let startTime: Date = this.getStartTime(event, eventData);
        let endTime: Date = this.getEndTime(event, eventData);
        this.day = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        if (this.day < 0) {
            return;
        }
        let currentDate: Date = util.resetTime(new Date(this.dateRender[this.day].getTime()));
        let schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let overlapCount: number = this.getIndex(startTime);
        event.Index = overlapCount;
        let appHeight: number = this.eventHeight;
        let diffInDays: number = eventData.count as number;
        if (startTime <= endTime) {
            let appWidth: number = 0;
            let appLeft: number = 0;
            let appRight: number = 0;
            let position: number = 0;
            if (this.renderType === 'day' || event[this.fields.isAllDay]) {
                appWidth = this.renderType === 'day' ? (((diffInDays * this.slotsPerDay) * this.cellWidth) - 2) :
                    ((diffInDays * this.slotsPerDay) * this.cellWidth);
                position = ((this.day * this.slotsPerDay) * this.cellWidth);
            } else {
                appWidth = this.getNormalEventsWidth(startTime, endTime, diffInDays);
                position = this.getPosition(schedule, startTime, endTime, this.day);
                position = position * this.cellWidth;
            }
            appWidth = (appWidth === 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
            this.renderedEvents.push(extend({}, event, null, true));
            let cellTd: Element = this.appContainers[wrapIndex];
            let top: number = this.getRowTop(resIndex);
            let appTop: number = (top + EVENT_GAP) + (overlapCount * (appHeight + EVENT_GAP));
            appLeft = (this.parent.enableRtl) ? 0 : position;
            appRight = (this.parent.enableRtl) ? position : 0;
            if (this.cellHeight > ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight) {
                let appointmentElement: HTMLElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                this.wireAppointmentEvents(appointmentElement);
                setStyleAttribute(appointmentElement, {
                    'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                });
                this.renderEventElement(event, appointmentElement, cellTd);
            } else {
                for (let i: number = 0; i < diffInDays; i++) {
                    let cellTd: HTMLElement = this.appContainers[wrapIndex] as HTMLElement;
                    let moreIndicator: HTMLElement = cellTd.querySelector('.' + cls.MORE_INDICATOR_CLASS) as HTMLElement;
                    let appPos: number = (this.parent.enableRtl) ? appRight : appLeft;
                    appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
                    if ((cellTd && isNullOrUndefined(moreIndicator)) ||
                        (!this.isAlreadyAvail(appPos, cellTd))) {
                        let interval: number = this.interval / this.slotCount;
                        let startDate: Date = new Date(this.dateRender[this.day + i].getTime());
                        let endDate: Date = util.addDays(this.dateRender[this.day + i], 1);
                        let slotStartTime: Date =
                            (new Date(startTime.setMinutes(Math.floor(startTime.getMinutes() / interval) * interval)));
                        let slotEndTime: Date = new Date(slotStartTime.getTime() + (60000 * interval));
                        let groupIndex: string;
                        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(resIndex)) {
                            groupIndex = resIndex.toString();
                        }
                        let filterEvents: Object[] = this.getFilterEvents(startDate, endDate, slotStartTime, slotEndTime, groupIndex);
                        let appArea: number = this.cellHeight - this.moreIndicatorHeight;
                        let renderedAppCount: number = Math.floor(appArea / (appHeight + EVENT_GAP));
                        let count: number = (filterEvents.length - renderedAppCount) <= 0 ? 1 : (filterEvents.length - renderedAppCount);
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
            }
        }
    }

    private getStartTime(event: { [key: string]: Object }, eventData: { [key: string]: Object }): Date {
        let startTime: Date = event[this.fields.startTime] as Date;
        let schedule: { [key: string]: Date } = util.getStartEndHours(startTime, this.startHour, this.endHour);
        if (schedule.startHour.getTime() >= eventData[this.fields.startTime]) {
            startTime = schedule.startHour;
        } else if (schedule.endHour.getTime() <= eventData[this.fields.startTime]) {
            startTime = this.getNextDay(schedule.startHour, eventData);
        } else {
            startTime = eventData[this.fields.startTime] as Date;
        }
        // To overcome the overflow
        if (event[this.fields.isAllDay]) {
            eventData[this.fields.startTime] = schedule.startHour;
        }
        return startTime;
    }

    private getNextDay(startTime: Date, eventData: { [key: string]: Object }): Date {
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
    private getEndTime(event: { [key: string]: Object }, eventData: { [key: string]: Object }): Date {
        let endTime: Date = event[this.fields.endTime] as Date;
        let schedule: { [key: string]: Date } = util.getStartEndHours(endTime, this.startHour, this.endHour);
        if (schedule.endHour.getTime() <= eventData[this.fields.endTime]) {
            endTime = schedule.endHour;
        } else {
            endTime = eventData[this.fields.endTime] as Date;
        }
        // To overcome the overflow
        if (event[this.fields.isAllDay]) {
            eventData[this.fields.endTime] = schedule.endHour;
        }
        return endTime;
    }

    private getNormalEventsWidth(startDate: Date, endDate: Date, diffInDays: number): number {
        if (this.isSameDay(startDate, endDate)) {
            return this.getSameDayEventsWidth(startDate, endDate);
        } else {
            return this.getSpannedEventsWidth(startDate, endDate, diffInDays);
        }
    }

    private getSameDayEventsWidth(startDate: Date, endDate: Date): number {
        return (((endDate.getTime() - startDate.getTime())) / (60 * 1000) * (this.cellWidth * this.slotCount) / this.interval);
    }

    private getSpannedEventsWidth(startDate: Date, endDate: Date, diffInDays: number): number {
        let width: number = (diffInDays * this.slotsPerDay) * this.cellWidth;
        let startWidth: number;
        let endWidth: number;
        let start: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        startWidth = this.getSameDayEventsWidth(start.startHour, startDate);
        if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(endDate.getTime()))) === -1) {
            endWidth = 0;
        } else {
            let end: { [key: string]: Date } =
                util.getStartEndHours(util.resetTime(new Date(endDate.getTime())), this.startHour, this.endHour);
            endWidth = this.getSameDayEventsWidth(endDate, end.endHour);
            endWidth = ((this.slotsPerDay * this.cellWidth) === endWidth) ? 0 : endWidth;
        }
        let spannedWidth: number = startWidth + endWidth;
        return (width > spannedWidth) ? width - spannedWidth : endWidth - startWidth;
    }

    private isSameDay(startTime: Date, endTime: Date): boolean {
        let startDay: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()) as Date));
        let endDay: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(endTime.getTime()) as Date));
        return (startDay === endDay);
    }

    private getAppointmentLeft(schedule: { [key: string]: Date }, startTime: Date, endTime: Date, day: number): number {
        let slotTd: number = (this.isSameDay(startTime, schedule.startHour as Date)) ?
            ((startTime.getTime() - schedule.startHour.getTime()) / ((60 * 1000) * this.interval)) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        } else {
            let daySlot: number =
                (((schedule.endHour.getTime() - schedule.startHour.getTime()) / (60 * 1000)) / this.interval) * this.slotCount;
            return (daySlot * day) + slotTd;
        }
    }

    private getPosition(schedule: { [key: string]: Date }, startTime: Date, endTime: Date, day: number): number {
        if (schedule.endHour.getTime() <= endTime.getTime() && schedule.startHour.getTime() >= startTime.getTime()) {
            return this.getAppointmentLeft(schedule, schedule.startHour, schedule.endHour, day);
        } else if (schedule.endHour.getTime() <= endTime.getTime()) {
            return this.getAppointmentLeft(schedule, startTime, schedule.endHour, day);
        } else if (schedule.startHour.getTime() >= startTime.getTime()) {
            return this.getAppointmentLeft(schedule, schedule.startHour, endTime, day);
        } else {
            return this.getAppointmentLeft(schedule, startTime, endTime, day);
        }
    }

    private getFilterEvents(startDate: Date, endDate: Date, startTime: Date, endTime: Date, gIndex: string): Object[] {
        if (this.renderType === 'day') {
            return this.getFilteredEvents(startDate, endDate, gIndex);
        } else {
            return this.getFilteredEvents(startTime, endTime, gIndex);
        }
    }

    private isAlreadyAvail(appPos: number, cellTd: HTMLElement): boolean {
        let moreIndicator: HTMLElement[] = [].slice.call(cellTd.querySelectorAll('.' + cls.MORE_INDICATOR_CLASS));
        for (let i: number = 0; i < moreIndicator.length; i++) {
            let indicatorPos: string;
            if (moreIndicator) {
                indicatorPos = (this.parent.enableRtl) ? moreIndicator[i].style.right : moreIndicator[i].style.left;
            }
            if (parseInt(indicatorPos, 10) === Math.floor(appPos)) {
                return true;
            }
        }
        return false;
    }

    private getRowTop(resIndex: number): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            let tr: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                ' tbody tr:nth-child(' + (resIndex + 1) + ')') as HTMLElement;
            return tr.offsetTop;
        }
        return 0;
    }
}
