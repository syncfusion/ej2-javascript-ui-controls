/* eslint-disable @typescript-eslint/no-explicit-any */
import { addClass, append, createElement, extend, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { setStyleAttribute, EventHandler } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { EventRenderedArgs, TdData } from '../base/interface';
import { TimelineEvent } from './timeline-view';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

const EVENT_GAP: number = 2;

/**
 * Year view events render
 */

export class YearEvent extends TimelineEvent {
    public cellHeader: number;
    private isResource: boolean = false;

    constructor(parent: Schedule) {
        super(parent, 'day');
    }

    public renderAppointments(): void {
        if (this.parent.dragAndDropModule) {
            this.parent.dragAndDropModule.setDragArea();
        }
        this.fields = this.parent.eventFields;
        const elementSelector: string = (this.parent.currentView === 'Year') ? '.' + cls.WORK_CELLS_CLASS + ' ' + '.' + cls.APPOINTMENT_CLASS :
            '.' + cls.APPOINTMENT_WRAPPER_CLASS + ',.' + cls.MORE_INDICATOR_CLASS;
        const eventWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
        for (const wrapper of eventWrappers) {
            remove(wrapper);
        }
        this.renderedEvents = [];
        if (this.parent.currentView === 'Year') {
            this.yearViewEvents();
        } else {
            this.removeCellHeight();
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                this.isResource = true;
                this.timelineResourceEvents();
            } else {
                this.timelineYearViewEvents();
            }
        }
        this.parent.renderTemplates();
        this.parent.notify(events.contentReady, {});
    }

    private yearViewEvents(): void {
        const months: number[] = this.getMonths();
        for (const month of months) {
            const queryString: string = `.e-month-calendar:nth-child(${months.indexOf(month) + 1}) td.e-work-cells`;
            const workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(queryString));
            const monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            const monthStart: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            const monthEnd: Date = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            let startDate: Date = util.getWeekFirstDate(monthStart, this.parent.activeViewOptions.firstDayOfWeek);
            const endDate: Date = util.addDays(util.getWeekLastDate(monthEnd, this.parent.activeViewOptions.firstDayOfWeek), 1);
            for (let index: number = 0; startDate.getTime() < endDate.getTime(); index++) {
                const start: Date = util.resetTime(new Date(startDate.getTime()));
                const end: Date = util.addDays(new Date(start.getTime()), 1);
                startDate = util.addDays(new Date(startDate.getTime()), 1);
                if (!this.parent.isMinMaxDate(start as Date)) {
                    continue;
                }
                const filterEvents: Record<string, any>[] = this.parent.eventBase.filterEvents(start, end);
                if (filterEvents.length > 0) {
                    const workCell: HTMLElement = workCells[parseInt(index.toString(), 10)];
                    if (workCell) {
                        workCell.appendChild(createElement('div', { className: cls.APPOINTMENT_CLASS }));
                    }
                }
            }
        }
    }

    private timelineYearViewEvents(): void {
        const workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS + ':not(.' + cls.OTHERMONTH_CLASS + ')');
        this.cellWidth = this.parent.getElementWidth(workCell);
        this.cellHeader = util.getOuterHeight(workCell.querySelector('.' + cls.DATE_HEADER_CLASS));
        const eventTable: Element = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.eventHeight = this.parent.getElementHeightFromClass(eventTable, cls.APPOINTMENT_CLASS);
        const selector: string =
            `.${cls.MONTH_HEADER_WRAPPER} tbody tr,.${cls.RESOURCE_COLUMN_TABLE_CLASS} tbody tr,.${cls.CONTENT_TABLE_CLASS} tbody tr`;
        this.addCellHeight(selector, this.eventHeight, EVENT_GAP, this.cellHeader, this.moreIndicatorHeight);
        const wrapperCollection: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        const months: number[] = this.getMonths();
        const groupIndex: number = (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.uiStateValues.isGroupAdaptive) ?
            this.parent.uiStateValues.groupIndex : undefined;
        for (let row: number = 0; row < months.length; row++) {
            const wrapper: Element = wrapperCollection[parseInt(row.toString(), 10)];
            let td: number = row + 1;
            let eventWrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(eventWrapper);
            let monthStart: Date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(row.toString(), 10)], 1);
            const monthEnd: Date = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
            let dayIndex: number = monthStart.getDay();
            const isSpannedCollection: Record<string, any>[] = [];
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                this.renderedEvents = [];
            }
            while (monthStart.getTime() <= monthEnd.getTime()) {
                let leftValue: number;
                let rightValue: number;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    const wrapper: Element = wrapperCollection[parseInt(dayIndex.toString(), 10)];
                    td = dayIndex + 1;
                    eventWrapper = wrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
                    if (!eventWrapper) {
                        eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                        wrapper.appendChild(eventWrapper);
                    }
                    if (this.parent.enableRtl) {
                        rightValue = row * this.cellWidth;
                    } else {
                        leftValue = row * this.cellWidth;
                    }
                } else {
                    if (this.parent.enableRtl) {
                        rightValue = ((dayIndex + monthStart.getDate()) - 1) * this.cellWidth;
                    } else {
                        leftValue = ((dayIndex + monthStart.getDate()) - 1) * this.cellWidth;
                    }
                }
                const rowTd: HTMLElement = this.parent.element.querySelector(`.e-content-wrap tr:nth-child(${td}) td`) as HTMLElement;
                this.cellHeight = rowTd.offsetHeight;
                const dayStart: Date = util.resetTime(new Date(monthStart.getTime()));
                const dayEnd: Date = util.addDays(new Date(dayStart.getTime()), 1);
                let resource: TdData;
                if (this.parent.uiStateValues.isGroupAdaptive) {
                    resource = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                }
                let dayEvents: Record<string, any>[] = this.parent.eventBase.filterEvents(dayStart, dayEnd, undefined, resource);
                dayEvents = this.parent.eventBase.sortByDateTime(dayEvents);
                for (let index: number = 0, count: number = dayEvents.length; index < count; index++) {
                    const eventData: Record<string, any> =
                        extend({}, dayEvents[parseInt(index.toString(), 10)], null, true) as Record<string, any>;
                    this.updateSpannedEvents(eventData, dayStart, dayEnd);
                    const overlapIndex: number = this.getIndex(dayStart as Date);
                    eventData.Index = overlapIndex;
                    const availedHeight: number = this.cellHeader + (this.eventHeight * (overlapIndex + 1)) + EVENT_GAP +
                        this.moreIndicatorHeight;
                    const appArea: number = this.cellHeight - this.cellHeader - this.moreIndicatorHeight;
                    const renderedAppCount: number = Math.floor(appArea / (this.eventHeight + EVENT_GAP));
                    const eventsPerRow: number = this.parent.rowAutoHeight ? 1 : this.parent.activeViewOptions.maxEventsPerRow;
                    const moreIndicatorCount: number = this.parent.activeViewOptions.maxEventsPerRow ? count - eventsPerRow
                        : (count - renderedAppCount) <= 0 ? 1 : count - renderedAppCount;
                    if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                        const isRendered: Record<string, any>[] = this.renderedEvents.filter((eventObj: Record<string, any>) =>
                            eventObj.Guid === eventData.Guid);
                        const isSpanned: Record<string, any>[] = isSpannedCollection.filter((eventObj: Record<string, any>) =>
                            eventObj.Guid === eventData.Guid);
                        if (isRendered.length > 0 && isRendered[0].MoreIndicator || isSpanned.length > 0 && isSpanned[0].MoreIndicator) {
                            const moreIndex: number = this.parent.activeViewOptions.orientation === 'Horizontal' ? row : dayIndex;
                            this.renderMoreIndicator(eventWrapper, moreIndicatorCount,
                                                     dayStart, moreIndex, leftValue, rightValue, groupIndex);
                            continue;
                        } else if (isRendered.length > 0 || isSpanned.length > 0) {
                            continue;
                        }
                    }
                    if (this.maxHeight && this.parent.currentView.indexOf('Timeline') !== -1 && overlapIndex > 0) {
                        continue;
                    }
                    if (this.parent.rowAutoHeight || this.shouldRenderAppointment(overlapIndex, availedHeight)) {
                        this.renderEvent(eventWrapper, eventData, row, leftValue, rightValue, monthStart, dayIndex);
                        if (this.parent.rowAutoHeight || this.cellHeight > availedHeight) {
                            this.updateCellHeight(rowTd, availedHeight);
                        }
                        isSpannedCollection.push(eventData);
                    } else {
                        const moreIndex: number = this.parent.activeViewOptions.orientation === 'Horizontal' ? row : dayIndex;
                        this.renderMoreIndicator(eventWrapper, moreIndicatorCount, dayStart, moreIndex, leftValue, rightValue, groupIndex);
                        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                            eventData.MoreIndicator = true;
                            this.renderedEvents.push(eventData);
                            isSpannedCollection.push(eventData);
                        }
                    }
                }
                monthStart = util.addDays(new Date(monthStart.getTime()), 1);
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    dayIndex++;
                    this.renderedEvents = [];
                }
            }
        }
        if (this.parent.rowAutoHeight && this.parent.activeViewOptions.orientation === 'Vertical') {
            const appContainer: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
            const tr: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr'));
            appContainer.forEach((ele: HTMLElement, index: number) => {
                const app: HTMLElement[] = [].slice.call(ele.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
                const appTop: number = tr[parseInt(index.toString(), 10)].offsetTop + this.cellHeader + EVENT_GAP;
                app.forEach((app: HTMLElement) => {
                    const overlap: number = parseInt(app.getAttribute('data-index'), 10);
                    app.style.top = appTop + (overlap * this.eventHeight) + 'px';
                    app.removeAttribute('data-index');
                });
            });
        }
    }

    private updateSpannedEvents(eventObj: Record<string, any>, dayStart: Date, dayEnd: Date): void {
        const isLeftRightResize: boolean = (this.isResource && this.parent.activeViewOptions.orientation === 'Vertical') ||
            (!this.isResource && this.parent.activeViewOptions.orientation === 'Horizontal');
        const data: Record<string, any> = { isLeft: true, isRight: true, isBottom: true, isTop: true };
        if (dayStart.getTime() <= (eventObj[this.fields.startTime] as Date).getTime()) {
            if (isLeftRightResize) {
                data.isLeft = false;
            } else {
                data.isTop = false;
            }
        }
        if ((dayEnd.getTime() >= (eventObj[this.fields.endTime] as Date).getTime()) || (isLeftRightResize && !this.isResource &&
            util.addDays(dayEnd, -1).getMonth() === (eventObj[this.fields.endTime] as Date).getMonth()) ||
            (isLeftRightResize && this.isResource && (dayEnd.getTime() <= eventObj[this.fields.endTime].getTime()))) {
            if (isLeftRightResize) {
                data.isRight = false;
            } else {
                data.isBottom = false;
            }
        }
        eventObj.data = data;
    }

    private timelineResourceEvents(): void {
        const contentTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        const isVerticalScrollbarAvail: boolean = contentTable.offsetWidth > contentTable.clientWidth;
        const workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        this.cellWidth = this.parent.getElementWidth(workCell);
        this.cellHeader = 0;
        const eventTable: Element = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.eventHeight = this.parent.getElementHeightFromClass(eventTable, cls.APPOINTMENT_CLASS);
        const selector: string =
            `.${cls.MONTH_HEADER_WRAPPER} tbody tr,.${cls.RESOURCE_COLUMN_TABLE_CLASS} tbody tr,.${cls.CONTENT_TABLE_CLASS} tbody tr`;
        this.addCellHeight(selector, this.eventHeight, EVENT_GAP, this.cellHeader, this.moreIndicatorHeight);
        const wrapperCollection: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        const resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.activeViewOptions.allowVirtualScrolling ? this.parent.resourceBase.renderedResources :
                this.parent.resourceBase.lastResourceLevel;
        const months: number[] = this.getMonths();
        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
            for (let month: number = 0; month < months.length; month++) {
                const monthStart: Date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(month.toString(), 10)], 1);
                for (let i: number = 0, len: number = resources.length; i < len; i++) {
                    this.renderedEvents = [];
                    this.renderResourceEvent(wrapperCollection[parseInt(month.toString(), 10)], resources[parseInt(i.toString(), 10)],
                                             month, i, monthStart);
                }
            }
        } else {
            for (let i: number = 0, len: number = resources.length; i < len; i++) {
                this.renderedEvents = [];
                for (let month: number = 0; month < months.length; month++) {
                    const monthStart: Date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(month.toString(), 10)], 1);
                    this.renderResourceEvent(wrapperCollection[parseInt(i.toString(), 10)], resources[parseInt(i.toString(), 10)], month,
                                             i, monthStart);
                }
            }
        }
        if (this.parent.rowAutoHeight && !isVerticalScrollbarAvail && contentTable.offsetWidth > contentTable.clientWidth) {
            const appointments: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
            appointments.forEach((ele: HTMLElement) => {
                ele.style.removeProperty('left');
                ele.style.removeProperty('right');
            });
            const appContainer: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
            const conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS);
            const tr: HTMLElement[] = [].slice.call(conTable.querySelectorAll('tbody tr'));
            appContainer.forEach((ele: HTMLElement, index: number) => {
                const appWrapper: HTMLElement[] = [].slice.call(ele.children);
                const row: HTMLElement = tr[parseInt(index.toString(), 10)];
                appWrapper.forEach((appWrap: HTMLElement, cellIndex: number) => {
                    const td: HTMLElement = row.querySelector(`td:nth-child(${cellIndex + 1})`);
                    const app: HTMLElement[] = [].slice.call(appWrap.children);
                    const width: number = this.parent.getElementWidth(td);
                    const left: number = td.offsetLeft;
                    if (this.parent.enableRtl) {
                        const right: number = conTable.offsetWidth - left - td.offsetWidth;
                        app.forEach((app: HTMLElement) => {
                            app.style.width = Math.floor(parseInt(app.style.width, 10) / width) * width + 'px';
                            app.style.right = right + 'px';
                        });
                    } else {
                        app.forEach((app: HTMLElement) => {
                            app.style.width = Math.floor(parseInt(app.style.width, 10) / width) * width + 'px';
                            app.style.left = left + 'px';
                        });
                    }
                });
            });
        }
    }

    private shouldRenderAppointment(overlapIndex: number, availedHeight: number): boolean {
        const eventsPerRow: number = this.parent.rowAutoHeight ? 1 : this.parent.activeViewOptions.maxEventsPerRow;
        if (this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight &&
            !this.parent.eventSettings.enableIndicator) {
            return overlapIndex < eventsPerRow;
        } else if (this.maxOrIndicator) {
            return overlapIndex < 1;
        } else {
            return this.cellHeight > availedHeight;
        }
    }

    private renderResourceEvent(wrapper: Element, resource: TdData, month: number, index: number, monthStart: Date): void {
        const eventWrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
        wrapper.appendChild(eventWrapper);
        const monthEnd: Date = util.addDays(util.lastDateOfMonth(new Date(monthStart.getTime())), 1);
        const eventDatas: Record<string, any>[] = this.parent.eventBase.filterEvents(monthStart, monthEnd, undefined, resource);
        const rowIndex: number = this.parent.activeViewOptions.orientation === 'Vertical' ? index : month;
        const td: HTMLElement = this.parent.element.querySelector(`.e-content-wrap tr:nth-child(${rowIndex + 1}) td`) as HTMLElement;
        this.cellHeight = td.offsetHeight;
        this.groupOrder = resource.groupOrder;
        const isSpannedCollection: Record<string, any>[] = [];
        for (let a: number = 0; a < eventDatas.length; a++) {
            const data: Record<string, any> = eventDatas[parseInt(a.toString(), 10)];
            let overlapIndex: number;
            const eventData: Record<string, any> = extend({}, data, null, true) as Record<string, any>;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                const eventObj: Record<string, any> = this.isSpannedEvent(eventData, monthStart);
                overlapIndex = this.getIndex(eventObj[this.fields.startTime] as Date);
                eventData.Index = overlapIndex;
            } else {
                overlapIndex = this.getIndex(eventData[this.fields.startTime] as Date);
                eventData.Index = overlapIndex;
            }
            const availedHeight: number = this.cellHeader + (this.eventHeight * (a + 1)) + EVENT_GAP + this.moreIndicatorHeight;
            const leftValue: number = (this.parent.activeViewOptions.orientation === 'Vertical') ?
                month * this.cellWidth : index * this.cellWidth;
            if (!this.parent.isMinMaxDate(eventData[this.fields.startTime] as Date)) {
                return;
            }
            if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0) {
                const isRendered: Record<string, any>[] = this.renderedEvents.filter((eventObj: Record<string, any>) =>
                    eventObj.Guid === eventData.Guid);
                const isSpanned: Record<string, any>[] = isSpannedCollection.filter((eventObj: Record<string, any>) =>
                    eventObj.Guid === eventData.Guid);
                if (isRendered.length > 0 || isSpanned.length > 0) {
                    continue;
                }
            }
            if (this.maxHeight && this.parent.currentView.indexOf('Timeline') !== -1 && overlapIndex > 0) {
                continue;
            }
            if (this.parent.rowAutoHeight || this.shouldRenderAppointment(overlapIndex, availedHeight)) {
                this.renderEvent(eventWrapper, eventData, month, leftValue, leftValue, monthStart, index);
                this.updateCellHeight(td, availedHeight);
                isSpannedCollection.push(eventData);
            } else {
                const moreIndex: number = this.parent.activeViewOptions.orientation === 'Horizontal' ? month : index;
                this.renderMoreIndicator(eventWrapper, eventDatas.length - a, monthStart, moreIndex, leftValue, leftValue, index);
                if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                    for (let i: number = index; i < eventDatas.length; i++) {
                        this.renderedEvents.push(extend({}, eventDatas[parseInt(i.toString(), 10)],
                                                        { Index: overlapIndex + i }, true) as Record<string, any>);
                    }
                }
                break;
            }
        }
    }

    public setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void {
        const height: number = (cell.offsetHeight - this.cellHeader) - (this.maxHeight ? 0 : this.moreIndicatorHeight);
        setStyleAttribute(event, { 'height': height + 'px', 'align-items': 'center' });
    }

    // eslint-disable-next-line max-len
    private renderEvent(wrapper: HTMLElement, eventData: Record<string, any>, row: number, left: number, right: number, monthDate: Date, rowIndex?: number): void {
        const eventObj: Record<string, any> = this.isSpannedEvent(eventData, monthDate);
        const wrap: HTMLElement = this.createEventElement(eventObj);
        let width: number;
        let index: number;
        if (eventObj.isSpanned.count === 1) {
            const endTime: Date = util.addDays(eventObj[this.fields.endTime] as Date, -1);
            eventObj[this.fields.endTime] = (endTime > eventObj[this.fields.startTime]) ? endTime : eventObj[this.fields.endTime];
        }
        if (eventObj[this.fields.startTime] > eventObj[this.fields.endTime]) {
            return;
        }
        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
            index = row + 1;
            if ((eventObj[this.fields.startTime] as Date).getTime() === (eventObj[this.fields.endTime] as Date).getTime()) {
                eventObj.isSpanned.count = 1;
            }
            width = eventObj.isSpanned.count * this.cellWidth;
        } else {
            index = rowIndex + 1;
            width = this.isResource ? eventObj.isSpanned.count * this.cellWidth : this.cellWidth;
        }
        const rowTd: HTMLElement = this.parent.element.querySelector(`.e-content-wrap tr:nth-child(${index}) td`) as HTMLElement;
        const top: number = rowTd.offsetTop + this.cellHeader + (this.eventHeight * <number>eventObj.Index) + EVENT_GAP;
        setStyleAttribute(wrap, {
            'width': width + 'px', 'height': this.eventHeight + 'px', 'left': left + 'px', 'right': right + 'px', 'top': top + 'px'
        });
        if (this.maxOrIndicator && this.parent.currentView.indexOf('Timeline') !== -1) {
            this.setMaxEventHeight(wrap, rowTd);
        }
        if (!this.isResource && this.parent.rowAutoHeight && this.parent.activeViewOptions.orientation === 'Vertical') {
            wrap.setAttribute('data-index', eventObj.Index.toString());
        }
        const args: EventRenderedArgs = { data: eventObj, element: wrap, cancel: false, type: 'event' };
        this.parent.trigger(events.eventRendered, args, (eventArgs: EventRenderedArgs) => {
            if (!eventArgs.cancel) {
                wrapper.appendChild(wrap);
                this.wireAppointmentEvents(wrap, eventObj);
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    this.renderedEvents.push(extend({}, eventObj, null, true) as Record<string, any>);
                } else if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    this.renderedEvents.push(extend({}, eventObj, null, true) as Record<string, any>);
                } else if ((eventObj.isSpanned.isRight || eventObj.isSpanned.isLeft) && this.parent.activeViewOptions.orientation === 'Horizontal'
                    || !eventObj.isSpanned.isRight) {
                    this.renderedEvents.push(extend({}, eventObj, null, true) as Record<string, any>);
                }
            }
        });
    }

    // eslint-disable-next-line max-len
    private renderMoreIndicator(wrapper: HTMLElement, count: number, startDate: Date, row: number, left: number, right: number, index?: number): void {
        if (this.parent.activeViewOptions.group.resources.length === 0 && wrapper.querySelector('[data-start-date="' + startDate.getTime() + '"]')) {
            return;
        }
        let endDate: Date;
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            endDate = util.addDays(util.lastDateOfMonth(new Date(startDate.getTime())), 1);
        } else {
            endDate = util.addDays(new Date(startDate.getTime()), 1);
        }
        const moreIndicator: HTMLElement = this.getMoreIndicatorElement(count, startDate, endDate);
        const rowTr: HTMLElement = this.parent.element.querySelector(`.e-content-wrap tr:nth-child(${row + 1})`) as HTMLElement;
        const top: number = rowTr.offsetTop + (this.cellHeight - this.moreIndicatorHeight);
        left = (Math.floor(left / this.cellWidth) * this.cellWidth);
        right = (Math.floor(right / this.cellWidth) * this.cellWidth);
        setStyleAttribute(moreIndicator, { 'width': this.cellWidth + 'px', 'left': left + 'px', 'right': right + 'px', 'top': top + 'px' });
        if (!isNullOrUndefined(index)) {
            moreIndicator.setAttribute('data-group-index', index.toString());
        }
        wrapper.appendChild(moreIndicator);
        EventHandler.add(moreIndicator, 'click', this.moreIndicatorClick, this);
    }

    private createEventElement(record: Record<string, any>): HTMLElement {
        const eventSubject: string = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default
            || this.parent.localeObj.getConstant('addTitle')) as string;
        const eventWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'data-guid': record.Guid as string,
                'role': 'button', 'tabindex': '0',
                'aria-disabled': this.parent.eventBase.getReadonlyAttribute(record),
                'aria-label': this.parent.getAnnouncementString(record)
            }
        });
        if (this.cssClass) {
            addClass([eventWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([eventWrapper], cls.READ_ONLY);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            const resIndex: number = this.getGroupIndexFromEvent(record);
            eventWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        let templateElement: HTMLElement[] = [];
        const eventObj: Record<string, any> = extend({}, record, null, true) as Record<string, any>;
        if (this.parent.activeViewOptions.eventTemplate) {
            const templateId: string = this.parent.element.id + '_' + this.parent.activeViewOptions.eventTemplateName + 'eventTemplate';
            templateElement = this.parent.getAppointmentTemplate()(eventObj, this.parent, 'eventTemplate', templateId, false,
                                                                   undefined, undefined, this.parent.root);
        } else {
            const locationEle: string = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '') as string;
            const subjectEle: HTMLElement = createElement('div', {
                className: cls.SUBJECT_CLASS,
                innerHTML: (eventSubject + (locationEle ? ';&nbsp' + locationEle : ''))
            });
            const startTimeEle: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventObj[this.fields.startTime] as Date)
            });
            const endTimeEle: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventObj[this.fields.endTime] as Date)
            });
            addClass([subjectEle], 'e-text-center');
            if (record[this.fields.isAllDay]) {
                templateElement = [subjectEle];
            } else if (!eventObj.isLeft && !eventObj.isRight) {
                templateElement = [startTimeEle, subjectEle, endTimeEle];
            } else {
                if (!eventObj.isLeft) {
                    templateElement.push(startTimeEle);
                }
                templateElement.push(subjectEle);
                if (!eventObj.isRight) {
                    templateElement.push(endTimeEle);
                }
            }
        }
        const appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        append(templateElement, appointmentDetails);
        eventWrapper.appendChild(appointmentDetails);
        this.parent.eventBase.renderSpannedIcon(eventWrapper, record.isSpanned);
        this.renderResizeHandler(eventWrapper, record.data as Record<string, any>, record[this.fields.isReadonly] as boolean);
        this.applyResourceColor(eventWrapper, eventObj, 'backgroundColor', this.groupOrder);
        return eventWrapper;
    }

    public isSpannedEvent(eventObj: Record<string, any>, monthDate: Date): Record<string, any> {
        const monthStart: Date = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd: Date = util.addDays(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0), 1);
        const eventData: Record<string, any> = extend({}, eventObj, null, true) as Record<string, any>;
        const eventStart: Date = eventData[this.fields.startTime] as Date;
        const eventEnd: Date = eventData[this.fields.endTime] as Date;
        const isSpanned: Record<string, any> = { isLeft: false, isRight: false, count: 1 };
        const yearStart: Date = new Date(this.parent.selectedDate.getFullYear(), this.parent.firstMonthOfYear, 1);
        const yearEnd: Date = util.addMonths(yearStart, this.parent.monthsCount);
        if (this.isResource) {
            this.updateSpannedEvents(eventObj, monthStart, monthEnd);
        }
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0) {
            this.updateSpannedEventDetails(eventStart, eventEnd, yearStart, yearEnd, eventData, isSpanned);
            const originalStartTime: Date = eventData[this.fields.startTime];
            const originalEndTime: Date = new Date(eventData[this.fields.endTime] - 1);
            isSpanned.count = (originalEndTime.getMonth() - originalStartTime.getMonth()) +
                (this.parent.monthsCount * (originalEndTime.getFullYear() - originalStartTime.getFullYear())) + 1;
        }
        else {
            this.updateSpannedEventDetails(eventStart, eventEnd, monthStart, monthEnd, eventData, isSpanned);
            if (this.parent.activeViewOptions.group.resources.length === 0 || this.parent.uiStateValues.isGroupAdaptive) {
                let end: number = util.resetTime(eventData[this.fields.endTime]).getTime();
                const start: number = util.resetTime(eventData[this.fields.startTime]).getTime();
                if (eventObj[this.fields.isAllDay] && end === eventObj[this.fields.endTime].getTime() || isSpanned.isRight) {
                    end = util.addDays(new Date(end), -1).getTime();
                }
                isSpanned.count = Math.round((end - start) / util.MS_PER_DAY) + 1;
            }
        }
        eventData.isSpanned = isSpanned;
        if (util.resetTime(eventStart).getTime() < util.resetTime(this.parent.minDate).getTime()) {
            eventData[this.fields.startTime] = this.parent.minDate;
        }
        if (util.resetTime(eventEnd).getTime() > util.resetTime(this.parent.maxDate).getTime()) {
            eventData[this.fields.endTime] = this.parent.maxDate;
        }
        return eventData;
    }

    private updateSpannedEventDetails(eventStart: Date, eventEnd: Date, viewStart: Date, viewEnd: Date,
                                      eventObj: Record<string, any>, isSpanned: Record<string, any>): void {
        if (eventStart.getTime() < viewStart.getTime()) {
            eventObj[this.fields.startTime] = viewStart;
            isSpanned.isLeft = true;
        }
        if (eventEnd.getTime() > viewEnd.getTime()) {
            eventObj[this.fields.endTime] = viewEnd;
            isSpanned.isRight = true;
        }
    }

    public getOverlapEvents(date: Date, appointments: Record<string, any>[]): Record<string, any>[] {
        const appointmentsList: Record<string, any>[] = [];
        let dateStart: number;
        let dateEnd: number;
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            const monthStart: Date = this.parent.calendarUtil.getMonthStartDate(new Date(date.getTime()));
            const monthEnd: Date = util.addDays(this.parent.calendarUtil.getMonthEndDate(new Date(date.getTime())), -1);
            dateStart = util.resetTime(new Date(monthStart.getTime())).getTime();
            dateEnd = util.resetTime(new Date(monthEnd.getTime())).getTime();
        } else {
            if (this.parent.rowAutoHeight) {
                dateStart = util.resetTime(new Date(date.getTime())).getTime();
                dateEnd = util.addDays(util.resetTime(new Date(date.getTime())), 1).getTime();
            } else {
                dateStart = dateEnd = util.resetTime(new Date(date.getTime())).getTime();
            }
        }
        for (const app of appointments) {
            const appStart: Date = new Date(app[this.fields.startTime].getTime());
            const appEnd: Date = new Date(app[this.fields.endTime].getTime());
            const timeCondition: boolean = app[this.fields.isAllDay] ? util.resetTime(appEnd).getTime() > dateStart :
                util.resetTime(appEnd).getTime() >= dateStart;
            if (((util.resetTime(appStart).getTime() <= dateStart) && (timeCondition)) ||
                (util.resetTime(appStart).getTime() >= dateStart) && (util.resetTime(appEnd).getTime() <= dateEnd)) {
                appointmentsList.push(app);
            }
            else if (this.parent.activeViewOptions.orientation === 'Vertical') {
                if (util.resetTime(appStart).getTime() >= dateStart && util.resetTime(appEnd).getTime() >= dateEnd) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    }

    private getMonths(): number[] {
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, { length: this.parent.monthsCount }).map((value: number, index: number) =>
            this.parent.firstMonthOfYear + index);
    }

    private removeCellHeight(): void {
        const elementSelector: string =
            `.${cls.MONTH_HEADER_WRAPPER} tbody tr,.${cls.RESOURCE_COLUMN_TABLE_CLASS} tbody tr,.${cls.CONTENT_TABLE_CLASS} tbody tr`;
        const rows: HTMLElement[] = [].slice.call(this.element.querySelectorAll(elementSelector));
        for (const row of rows) {
            (row.firstElementChild as HTMLElement).style.height = '';
        }
    }

    public destroy(): void {
        super.destroy();
        this.parent = null;
    }

}
