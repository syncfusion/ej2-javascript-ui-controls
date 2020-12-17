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
    /**
     * Constructor for timeline views
     */
    constructor(parent: Schedule, type: string) {
        super(parent);
        this.renderType = type;
        this.eventContainers = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        let tr: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr'));
        this.dayLength = tr.length === 0 ? 0 : tr[0].children.length;
        this.content = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
    }

    public getSlotDates(): void {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }));
        if (this.parent.headerRows.length > 0 &&
            this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour') {
            this.renderType = 'day';
            this.cellWidth = this.content.offsetWidth / this.dateRender.length;
            this.slotsPerDay = 1;
        } else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
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
                if ((<Date>eventData.trimStartTime).getTime() <= date.getTime() &&
                    (<Date>eventData.trimEndTime).getTime() > date.getTime()) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    }

    public renderResourceEvents(): void {
        this.removeHeightProperty(cls.RESOURCE_COLUMN_TABLE_CLASS);
        let resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.renderedResources;
        if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
            for (let i: number = 0, len: number = this.parent.crudModule.crudObj.sourceEvent.length; i < len; i++) {
                let source: TdData = this.parent.crudModule.crudObj.sourceEvent[i];
                this.rowIndex = source.groupIndex;
                this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, source);
                if (this.parent.crudModule.crudObj.sourceEvent[i].groupIndex !==
                    this.parent.crudModule.crudObj.targetEvent[i].groupIndex) {
                    let target: TdData = this.parent.crudModule.crudObj.targetEvent[i];
                    this.rowIndex = target.groupIndex;
                    this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, target);
                }
            }
            this.parent.crudModule.crudObj.isCrudAction = false;
        } else {
            for (let i: number = 0; i < resources.length; i++) {
                this.rowIndex = i;
                this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, resources[i]);
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    public renderEvents(event: { [key: string]: Object }, resIndex: number, appointmentsList?: { [key: string]: Object }[]): void {
        let startTime: Date = event[this.fields.startTime] as Date;
        let endTime: Date = event[this.fields.endTime] as Date;
        if ((startTime.getTime() < this.parent.minDate.getTime()) || (endTime.getTime() > this.parent.maxDate.getTime())) {
            return;
        }
        let eventData: { [key: string]: Object } = event.data as { [key: string]: Object };
        startTime = this.getStartTime(event, eventData);
        endTime = this.getEndTime(event, eventData);
        this.day = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        if (this.day < 0) {
            return;
        }
        let cellTd: HTMLElement = this.getCellTd();
        let overlapCount: number = this.getIndex(startTime);
        event.Index = overlapCount;
        let elem: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_CLASS);
        let appHeight: number = (elem && elem.offsetHeight > 0) ? elem.offsetHeight : this.eventHeight;
        let diffInDays: number = eventData.count as number;
        let eventObj: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
        eventObj[this.fields.startTime] = eventData[this.fields.startTime];
        eventObj[this.fields.endTime] = eventData[this.fields.endTime];
        let currentDate: Date = util.resetTime(new Date(this.dateRender[this.day].getTime()));
        let schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let isValidEvent: boolean = this.isValidEvent(eventObj, startTime, endTime, schedule);
        if (startTime <= endTime && isValidEvent) {
            let appWidth: number = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay] as boolean, diffInDays);
            appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
            let appLeft: number = 0;
            let appRight: number = 0;
            let position: number = this.getPosition(startTime, endTime, event[this.fields.isAllDay] as boolean, this.day);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
            this.renderedEvents.push(extend({}, event, null, true));
            let top: number = this.getRowTop(resIndex);
            let appTop: number = (top + (this.maxHeight ? 0 : EVENT_GAP)) + (overlapCount * (appHeight + EVENT_GAP));
            appLeft = (this.parent.enableRtl) ? 0 : position;
            appRight = (this.parent.enableRtl) ? position : 0;
            let height: number = ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            let renderApp: boolean = this.maxOrIndicator ? overlapCount < 1 ? true : false : this.cellHeight > height;
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
                this.renderEventElement(event, appointmentElement, cellTd);
                if (this.parent.rowAutoHeight) {
                    let firstChild: HTMLElement = this.getFirstChild(resIndex);
                    this.updateCellHeight(firstChild, height);
                }
                if (appointmentElement.offsetWidth < this.cellWidth && this.parent.activeViewOptions.timeScale.enable
                    && this.parent.activeViewOptions.option !== 'TimelineMonth') {
                    let resizeHandlers: HTMLElement[] = [].slice.call(appointmentElement.querySelectorAll('.' + cls.EVENT_RESIZE_CLASS));
                    resizeHandlers.forEach((resizeHandler: HTMLElement) => {
                        resizeHandler.style.width = Math.ceil(appointmentElement.offsetWidth / resizeHandler.offsetWidth) + 'px';
                    });
                }
            } else {
                for (let i: number = 0; i < diffInDays; i++) {
                    let moreIndicator: HTMLElement = cellTd.querySelector('.' + cls.MORE_INDICATOR_CLASS) as HTMLElement;
                    let appPos: number = (this.parent.enableRtl) ? appRight : appLeft;
                    appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
                    if ((cellTd && isNullOrUndefined(moreIndicator)) ||
                        (!this.isAlreadyAvail(appPos, cellTd))) {
                        let interval: number = this.interval / this.slotCount;
                        let startDate: Date = new Date(this.dateRender[this.day + i].getTime());
                        let endDate: Date = util.addDays(this.dateRender[this.day + i], 1);
                        let startDateTime: Date = new Date(+startTime);
                        let slotStartTime: Date =
                            (new Date(startDateTime.setMinutes(Math.floor(startDateTime.getMinutes() / interval) * interval)));
                        let slotEndTime: Date = new Date(slotStartTime.getTime() + (60000 * interval));
                        let groupIndex: string;
                        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(resIndex)) {
                            groupIndex = resIndex.toString();
                        }
                        let filterEvents: Object[] =
                            this.getFilterEvents(startDate, endDate, slotStartTime, slotEndTime, groupIndex, appointmentsList);
                        let appArea: number = this.cellHeight - this.moreIndicatorHeight;
                        appHeight = this.withIndicator ? appArea - EVENT_GAP : appHeight;
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
        this.parent.renderTemplates();
    }

    public updateCellHeight(cell: HTMLElement, height: number): void {
        if ((height > cell.offsetHeight)) {
            setStyleAttribute(cell, { 'height': height + 'px' });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                let resourceCell: HTMLElement = this.parent.element.querySelector
                    ('.' + cls.RESOURCE_COLUMN_TABLE_CLASS + ' ' + 'tbody td[data-group-index="' +
                        cell.getAttribute('data-group-index') + '"]') as HTMLElement;
                if (resourceCell) {
                    setStyleAttribute(resourceCell, { 'height': height + 'px' });
                }
            }
            let monthHeader: HTMLElement = this.parent.element.querySelector('.e-month-header-wrapper table tr:nth-child(' +
                ((cell.parentElement as HTMLTableRowElement).rowIndex + 1) + ') td') as HTMLElement;
            if (monthHeader) {
                setStyleAttribute(monthHeader, { 'height': height + 'px' });
            }
        }
    }

    private getFirstChild(index: number): HTMLElement {
        let query: string = '.' + cls.CONTENT_TABLE_CLASS + ' tbody td';
        let groupIndex: string = '';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            groupIndex = '[data-group-index="' + index.toString() + '"]';
        }
        let td: HTMLElement = this.parent.element.querySelector(query + groupIndex) as HTMLElement;
        return td;
    }

    public updateBlockElements(): void {
        let blockElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            let firstChild: HTMLElement = this.getFirstChild(resIndex);
            element.style.height = firstChild.offsetHeight + 'px';
            let width: number = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
        let blockIndicator: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_INDICATOR_CLASS));
        for (let element of blockIndicator) {
            let resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            element.style.top = this.getRowTop(resIndex) +
                this.getFirstChild(resIndex).offsetHeight - BLOCK_INDICATOR_HEIGHT + 'px';
        }
    }

    public getStartTime(event: { [key: string]: Object }, eventData: { [key: string]: Object }): Date {
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
        eventData.trimStartTime = (event[this.fields.isAllDay]) ? schedule.startHour : eventData[this.fields.startTime];
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

    public getEndTime(event: { [key: string]: Object }, eventData: { [key: string]: Object }): Date {
        let endTime: Date = event[this.fields.endTime] as Date;
        let schedule: { [key: string]: Date } = util.getStartEndHours(endTime, this.startHour, this.endHour);
        if (schedule.endHour.getTime() <= eventData[this.fields.endTime]) {
            endTime = schedule.endHour;
        } else {
            endTime = eventData[this.fields.endTime] as Date;
        }
        // To overcome the overflow
        eventData.trimEndTime = (event[this.fields.isAllDay]) ? schedule.endHour : eventData[this.fields.endTime];
        return endTime;
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

    private getAppointmentLeft(schedule: { [key: string]: Date }, startTime: Date, day: number): number {
        let slotTd: number = (this.isSameDay(startTime, schedule.startHour as Date)) ?
            ((startTime.getTime() - schedule.startHour.getTime()) / ((60 * 1000) * this.interval)) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        } else {
            let daySlot: number =
                Math.round((((schedule.endHour.getTime() - schedule.startHour.getTime()) / (60 * 1000)) / this.interval) * this.slotCount);
            return (daySlot * day) + slotTd;
        }
    }

    public getPosition(startTime: Date, endTime: Date, isAllDay: boolean, day: number): number {
        if (this.renderType === 'day' || isAllDay) {
            return (day * this.slotsPerDay) * this.cellWidth;
        }
        let currentDate: Date = util.resetTime(new Date(this.dateRender[day].getTime()));
        let schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
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

    //tslint:disable-next-line:max-line-length
    private getFilterEvents(startDate: Date, endDate: Date, startTime: Date, endTime: Date, gIndex: string, eventsList?: { [key: string]: Object }[]): Object[] {
        if (this.renderType === 'day') {
            return this.getFilteredEvents(startDate, endDate, gIndex, eventsList);
        } else {
            return this.getFilteredEvents(startTime, endTime, gIndex, eventsList);
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

    public getRowTop(resIndex: number): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return ((this.parent.activeViewOptions.group.resources.length > 1 || this.parent.virtualScrollModule ||
                this.parent.rowAutoHeight) ? (<HTMLElement>this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                    ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"]')).offsetTop : this.cellHeight * resIndex);
        }
        return 0;
    }


    public getCellTd(): HTMLElement {
        let wrapIndex: number = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.eventContainers[wrapIndex] as HTMLElement;
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
            let blockIndicator: HTMLElement = createElement('div', { className: 'e-icons ' + cls.BLOCK_INDICATOR_CLASS });
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

    public setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void {
        setStyleAttribute(event, {
            'height': (this.cellHeight - (this.maxHeight ? 0 : EVENT_GAP) -
                (this.maxHeight ? 0 : this.moreIndicatorHeight)) + 'px'
        });
    }
}