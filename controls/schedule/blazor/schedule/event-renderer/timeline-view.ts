import { setStyleAttribute, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { MonthEvent } from './month';
import { SfSchedule } from '../../schedule';
import { NotifyEventArgs } from '../base/interface';

const EVENT_GAP: number = 2;
const BLOCK_INDICATOR_WIDTH: number = 22;
const BLOCK_INDICATOR_HEIGHT: number = 18;
/**
 * Timeline view events render
 */
export class TimelineEvent extends MonthEvent {
    public startHour: Date = this.parent.activeView.getStartHour();
    public endHour: Date = this.parent.activeView.getEndHour();
    public slotCount: number = this.parent.activeViewOptions.timeScale.slotCount;
    private interval: number = this.parent.activeViewOptions.timeScale.interval;
    private day: number = 0;
    public eventContainers: HTMLElement[];
    public slotsPerDay: number;
    private dayLength: number;
    public inlineValue: boolean;
    private renderType: string;
    private rowIndex: number = 0;
    private content: HTMLElement;

    /**
     * Constructor for timeline views
     */

    constructor(parent: SfSchedule, type: string) {
        super(parent);
        this.renderType = type;
        let tr: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr'));
        this.dayLength = tr.length === 0 ? 0 : tr[0].children.length;
        this.content = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
    }

    public getSlotDates(): void {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }));
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows[this.parent.activeViewOptions.headerRows.length - 1].option !== 'Hour') {
            this.renderType = 'day';
            this.cellWidth = this.content.offsetWidth / this.dateRender.length;
            this.slotsPerDay = 1;
        } else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
    }

    public renderAppointments(): void {
        let eventTable: HTMLElement = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        if (!isNullOrUndefined(eventTable)) {
            setStyleAttribute(eventTable, {
                'display': 'block'
            });
        }
        let eventsClass: string = '.' + cls.APPOINTMENT_CLASS + ', .' + cls.MORE_INDICATOR_CLASS;
        let blockEventClass: string = '.' + cls.BLOCK_APPOINTMENT_CLASS + ', .' + cls.BLOCK_INDICATOR_CLASS;
        let elementList: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(eventsClass + ', ' + blockEventClass));
        let workcell: HTMLElement = this.parent.element.querySelector('.e-work-cells');
        if (!workcell) {
            return;
        }
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.options.rowAutoHeight) {
            this.parent.uiStateValues.top = conWrap.scrollTop;
            this.parent.uiStateValues.left = conWrap.scrollLeft;
        }
        this.removeHeightProperty(cls.CONTENT_TABLE_CLASS);
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.removeHeightProperty(cls.RESOURCE_COLUMN_TABLE_CLASS);
        }
        this.cellHeight = workcell.getBoundingClientRect().height;
        this.cellWidth = workcell.getBoundingClientRect().width;
        let currentPanel: HTMLElement = this.parent.element.querySelector('.e-current-panel');
        let appHeight: number = util.getElementHeightFromClass(currentPanel, cls.APPOINTMENT_CLASS);
        this.dateRender = this.parent.activeView.renderDates;
        this.getSlotDates();
        for (let i: number = 0; i < elementList.length; i++) {
            let ele: HTMLElement = elementList[i] as HTMLElement;
            ele.removeAttribute('style');
            let startTime: Date = new Date(this.getStartTime(ele));
            let endTime: Date = this.getEndTime(ele);
            this.day = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
            if (this.day >= 0) {
                let overlapCount: number = this.getOverLapCount(ele);
                let diffInDays: number = this.getDataCount(ele);
                let isAllDay: boolean = this.isAllDayData(ele) === 'true' ? true : false;
                let appWidth: number = this.getEventWidth(startTime, endTime, isAllDay, diffInDays);
                appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
                let appLeft: number = 0;
                let appRight: number = 0;
                let position: number = this.getPosition(startTime, endTime, isAllDay, this.day);
                appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
                let resIndex: number = this.getGroupIndex(ele);
                let top: number = this.getRowTop(resIndex);
                let appTop: number = (ele.classList.contains('e-block-appointment')) ? top :
                    (top + EVENT_GAP) + (overlapCount * (appHeight + EVENT_GAP));
                appLeft = (this.parent.options.enableRtl) ? 0 : position;
                appRight = (this.parent.options.enableRtl) ? position : 0;
                let height: number = ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
                if (!ele.classList.contains('e-more-indicator')) {
                    if (!ele.classList.contains('e-block-indicator')) {
                        setStyleAttribute(ele, {
                            'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                        });
                        if (this.maxOrIndicator) {
                            this.setMaxEventHeight(ele);
                        }
                        if (ele.classList.contains('e-block-appointment')) {
                            setStyleAttribute(ele, {
                                'height': this.cellHeight + 'px'
                            });
                        }
                        if (ele.classList.contains('e-appointment')) {
                            this.parent.eventBase.applyResourceColor(ele);
                            this.parent.eventBase.wireAppointmentEvents(ele);
                        }
                        if (this.parent.options.rowAutoHeight) {
                            let firstChild: HTMLElement = this.getFirstChild(resIndex);
                            this.updateCellHeight(firstChild, height);
                        }
                    } else {
                        position = (Math.floor(position / this.cellWidth) * this.cellWidth) + this.cellWidth - BLOCK_INDICATOR_WIDTH;
                        if (this.parent.options.enableRtl) {
                            ele.style.right = position + 'px';
                        } else {
                            ele.style.left = position + 'px';
                        }
                        ele.style.top = top + this.cellHeight - BLOCK_INDICATOR_HEIGHT + 'px';
                    }
                } else {
                    let appArea: number = this.cellHeight - this.moreIndicatorHeight;
                    ele.style.top = top + appArea + 'px';
                    ele.style.width = this.cellWidth + 'px';
                    ele.style.left = (Math.floor(appLeft / this.cellWidth) * this.cellWidth) + 'px';
                    ele.style.right = (Math.floor(appRight / this.cellWidth) * this.cellWidth) + 'px';
                }
            }

        }
        this.updateRowHeight();
    }

    public updateRowHeight(): void {
        if (this.parent.options.rowAutoHeight) {
            this.updateBlockElements();
            let data: NotifyEventArgs = {
                cssProperties: this.parent.getCssProperties(),
                isPreventScrollUpdate: true,
                scrollPosition: { left: this.parent.uiStateValues.left, top: this.parent.uiStateValues.top }
            };
            if (this.parent.virtualScrollModule) {
                // if (this.parent.currentAction) {
                //     conWrap.scrollTop = scrollTop;
                //     this.parent.currentAction = null;
                // } else {
                this.parent.virtualScrollModule.updateVirtualScrollHeight();
                // }
            }
            this.parent.onScrollUiUpdate(data);
        }
    }

    public updateBlockElements(): void {
        let blockElement: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            let firstChild: HTMLElement = this.getFirstChild(resIndex);
            element.style.height = firstChild.offsetHeight + 'px';
            let width: number = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
        let blockIndicator: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.BLOCK_INDICATOR_CLASS));
        for (let element of blockIndicator) {
            let resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            element.style.top = this.getRowTop(resIndex) +
                this.getFirstChild(resIndex).offsetHeight - BLOCK_INDICATOR_HEIGHT + 'px';
        }
    }

    public setMaxEventHeight(event: HTMLElement): void {
        setStyleAttribute(event, {
            'height': (this.cellHeight - (this.maxHeight ? 0 : EVENT_GAP) -
                (this.maxHeight ? 0 : this.moreIndicatorHeight)) + 'px'
        });
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

    private isAllDayData(ele: HTMLElement): string {
        return ele.getAttribute('data-all-day');
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

    public getRowTop(resIndex: number): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return ((this.parent.activeViewOptions.group.resources.length > 1 || this.parent.virtualScrollModule ||
                this.parent.options.rowAutoHeight) ? (<HTMLElement>this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                    ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"]')).offsetTop : this.cellHeight * resIndex);
        }
        return 0;
    }

    public renderEvents(event: { [key: string]: Object }, resIndex: number, appointmentsList?: { [key: string]: Object }[]): void {
        let eventData: { [key: string]: Object } = event.data as { [key: string]: Object };
        let startTime: Date = event.startTime as Date;
        let endTime: Date = event.endTime as Date;
        this.dateRender = this.parent.activeView.renderDates;
        this.day = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        let cellTd: HTMLElement = this.getCellTd();
        let appHeight: number = this.eventHeight;
        let diffInDays: number = eventData.count as number;
        let appWidth: number = this.getEventWidth(startTime, endTime, event.isAllDay as boolean, diffInDays);
        appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
        let position: number = this.getPosition(startTime, endTime, event.isAllDay as boolean, this.day);
        appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
        let top: number = this.getRowTop(resIndex);
        let appTop: number = (top + EVENT_GAP) + (/*overlapCount */ (appHeight + EVENT_GAP));
        let appLeft: number = (this.parent.options.enableRtl) ? 0 : position;
        let appRight: number = (this.parent.options.enableRtl) ? position : 0;
        let appointmentElement: HTMLElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        setStyleAttribute(appointmentElement, {
            'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
        });
        this.renderEventElement(appointmentElement, cellTd);
    }
    public getCellTd(): HTMLElement {
        let wrapIndex: number = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.eventContainers[wrapIndex] as HTMLElement;
    }

}