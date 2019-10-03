import { append, prepend, createElement, extend, EventHandler, closest, addClass, isBlazor, getElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { EventFieldsMapping, EventClickArgs, EventRenderedArgs, TdData, NotifyEventArgs, MoreEventsClickArgs } from '../base/interface';
import { Schedule } from '../base/schedule';
import { EventBase } from './event-base';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';

const EVENT_GAP: number = 0;
/**
 * Month view events render
 */
export class MonthEvent extends EventBase {
    public element: HTMLElement;
    public fields: EventFieldsMapping;
    public dateRender: Date[];
    public renderedEvents: Object[] = [];
    public eventHeight: number;
    private monthHeaderHeight: number = 0;
    public workCells: HTMLElement[];
    public cellWidth: number;
    public cellHeight: number;
    public moreIndicatorHeight: number = 19;
    public renderType: string = 'day';

    /**
     * Constructor for month events
     */
    constructor(parent: Schedule) {
        super(parent);
        this.element = this.parent.activeView.getPanel();
        this.fields = this.parent.eventFields;
        this.addEventListener();
    }

    public renderAppointments(): void {
        let conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (this.parent.rowAutoHeight) {
            this.parent.uiStateValues.top = conWrap.scrollTop;
            this.parent.uiStateValues.left = conWrap.scrollLeft;
        }
        let appointmentWrapper: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS));
        for (let wrap of appointmentWrapper) {
            remove(wrap);
        }
        this.removeHeightProperty(cls.CONTENT_TABLE_CLASS);
        if (!this.element.querySelector('.' + cls.WORK_CELLS_CLASS)) {
            return;
        }
        this.eventHeight = util.getElementHeightFromClass(this.element, cls.APPOINTMENT_CLASS);
        let scrollTop: number = conWrap.scrollTop;
        if (this.parent.rowAutoHeight && this.parent.virtualScrollModule && !isNullOrUndefined(this.parent.currentAction)) {
            conWrap.scrollTop = conWrap.scrollTop - 1;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.renderResourceEvents();
        } else {
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays);
        }
        if (this.parent.rowAutoHeight) {
            this.updateBlockElements();
            let data: NotifyEventArgs = {
                cssProperties: this.parent.getCssProperties(),
                module: this.parent.getModuleName(),
                isPreventScrollUpdate: true,
                scrollPosition: { left: this.parent.uiStateValues.left, top: this.parent.uiStateValues.top }
            };
            if (this.parent.virtualScrollModule) {
                if (this.parent.currentAction) {
                    conWrap.scrollTop = scrollTop;
                    this.parent.currentAction = null;
                } else {
                    this.parent.virtualScrollModule.updateVirtualScrollHeight();
                }
            }
            this.parent.notify(events.scrollUiUpdate, data);
        }
    }

    public renderEventsHandler(dateRender: Date[], workDays: number[], resData?: TdData): void {
        this.renderedEvents = [];
        let eventsList: { [key: string]: Object }[];
        let blockList: { [key: string]: Object }[];
        let resIndex: number = 0;
        if (resData) {
            resIndex = resData.groupIndex;
            this.cssClass = resData.cssClass;
            this.groupOrder = resData.groupOrder;
            eventsList = this.parent.eventBase.filterEventsByResource(resData, this.parent.eventsProcessed) as { [key: string]: Object }[];
            blockList = this.parent.eventBase.filterEventsByResource(resData, this.parent.blockProcessed) as { [key: string]: Object }[];
            this.workCells = [].slice.call(this.element.querySelectorAll
                ('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        } else {
            eventsList = <{ [key: string]: Object }[]>this.parent.eventsProcessed;
            blockList = <{ [key: string]: Object }[]>this.parent.blockProcessed;
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        }
        this.sortByDateTime(eventsList);
        this.sortByDateTime(blockList);
        this.cellWidth = this.workCells.slice(-1)[0].offsetWidth;
        this.cellHeight = this.workCells.slice(-1)[0].offsetHeight;
        this.dateRender = dateRender;
        this.getSlotDates(workDays);
        this.processBlockEvents(blockList, resIndex, resData);
        for (let event of eventsList) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            let splittedEvents: { [key: string]: Object }[] = this.splitEvent(event, this.dateRender);
            for (let event of splittedEvents) {
                this.updateIndicatorIcon(<{ [key: string]: Object }>event);
                this.renderEvents(<{ [key: string]: Object }>event, resIndex, eventsList);
            }
        }
        this.cssClass = null;
        this.groupOrder = null;
    }

    private processBlockEvents(blockEvents: { [key: string]: Object }[], resIndex: number, resData?: TdData): void {
        for (let event of blockEvents) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            let blockSpannedList: { [key: string]: Object }[] = [];
            if (this.renderType === 'day' && !event[this.fields.isAllDay]) {
                let temp: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
                let isSameDate: boolean = this.isSameDate(temp[this.fields.startTime] as Date, temp[this.fields.endTime] as Date);
                temp.isBlockIcon = isSameDate;
                if (!isSameDate && util.getDateInMs(temp[this.fields.startTime] as Date) > 0) {
                    let e: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
                    e[this.fields.endTime] = util.addDays(util.resetTime(new Date(event[this.fields.startTime] + '')), 1);
                    e.isBlockIcon = true;
                    temp[this.fields.startTime] = e[this.fields.endTime];
                    blockSpannedList.push(e);
                }
                isSameDate = this.isSameDate(temp[this.fields.startTime] as Date, temp[this.fields.endTime] as Date);
                if (!isSameDate && util.getDateInMs(temp[this.fields.endTime] as Date) > 0) {
                    let e: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
                    e[this.fields.startTime] = util.resetTime(new Date(event[this.fields.endTime] + ''));
                    e.isBlockIcon = true;
                    blockSpannedList.push(e);
                    temp[this.fields.endTime] = e[this.fields.startTime];
                }
                blockSpannedList.push(temp);
            } else {
                blockSpannedList.push(event);
            }
            for (let blockEvent of blockSpannedList) {
                let splittedEvents: { [key: string]: Object }[] = this.splitEvent(blockEvent, this.dateRender);
                for (let event of splittedEvents) {
                    this.renderBlockEvents(event, resIndex, !!blockEvent.isBlockIcon);
                }
            }
        }
    }

    private isSameDate(start: Date, end: Date): boolean {
        return new Date(+start).setHours(0, 0, 0, 0) === new Date(+end).setHours(0, 0, 0, 0);
    }

    public renderBlockEvents(event: { [key: string]: Object }, resIndex: number, isIcon: boolean): void {
        let eventData: { [key: string]: Object } = event.data as { [key: string]: Object };
        let startTime: Date = this.getStartTime(event, eventData);
        let endTime: Date = this.getEndTime(event, eventData);
        let day: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        if (day < 0 || startTime > endTime) {
            return;
        }
        let cellTd: HTMLElement = this.getCellTd(day);
        let position: number = this.getPosition(startTime, endTime, event[this.fields.isAllDay] as boolean, day);
        if (!isIcon) {
            let diffInDays: number = eventData.count as number;
            let appWidth: number = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay] as boolean, diffInDays);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth;
            let appLeft: number = (this.parent.enableRtl) ? 0 : position;
            let appRight: number = (this.parent.enableRtl) ? position : 0;
            this.renderWrapperElement(cellTd as HTMLElement);
            let appHeight: number = this.cellHeight - this.monthHeaderHeight;
            let appTop: number = this.getRowTop(resIndex);
            let blockElement: HTMLElement = this.createBlockAppointmentElement(event, resIndex);
            setStyleAttribute(blockElement, {
                'width': appWidth + 'px', 'height': appHeight + 1 + 'px', 'left': appLeft + 'px',
                'right': appRight + 'px', 'top': appTop + 'px'
            });
            this.renderEventElement(event, blockElement, cellTd);
        } else {
            this.renderBlockIndicator(cellTd, position, resIndex);
        }
    }

    public renderBlockIndicator(cellTd: HTMLElement, position: number, resIndex: number): void {
        let blockIndicator: HTMLElement = createElement('div', { className: 'e-icons ' + cls.BLOCK_INDICATOR_CLASS });
        if (isNullOrUndefined(cellTd.querySelector('.' + cls.BLOCK_INDICATOR_CLASS))) {
            cellTd.appendChild(blockIndicator);
        }
    }

    public getStartTime(event: { [key: string]: Object }, eventData: { [key: string]: Object }): Date {
        return event[this.fields.startTime] as Date;
    }

    public getEndTime(event: { [key: string]: Object }, eventData: { [key: string]: Object }): Date {
        return event[this.fields.endTime] as Date;
    }

    public getCellTd(day: number): HTMLElement {
        return this.workCells[day];
    }

    public getEventWidth(startDate: Date, endDate: Date, isAllDay: boolean, count: number): number {
        return count * this.cellWidth - 1;
    }

    public getPosition(startTime: Date, endTime: Date, isAllDay: boolean, day: number): number {
        return 0;
    }

    public getRowTop(resIndex: number): number {
        return 0;
    }

    public updateIndicatorIcon(event: { [key: string]: Object }): void {
        if (this.parent.currentView.indexOf('Timeline') === -1 || this.parent.currentView === 'TimelineMonth'
            || event[this.fields.isAllDay]) {
            return;
        }
        let cloneData: { [key: string]: Object } = event.data as { [key: string]: Object };
        let startHour: { [key: string]: Date } = util.getStartEndHours
            (event[this.fields.startTime] as Date, this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        let endHour: { [key: string]: Date } = util.getStartEndHours
            (event[this.fields.endTime] as Date, this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        cloneData.isLeft = cloneData.isLeft || (<Date>cloneData[this.fields.startTime]).getTime() < startHour.startHour.getTime();
        cloneData.isRight = cloneData.isRight || (<Date>cloneData[this.fields.endTime]).getTime() > endHour.endHour.getTime();
    }

    public renderResourceEvents(): void {
        let resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel;
        for (let slotData of resources) {
            this.renderEventsHandler(slotData.renderDates, slotData.workDays, slotData);
        }
    }

    public getSlotDates(workDays?: number[]): void {
        this.slots = [];
        let dates: number[] = this.dateRender.map((date: Date) => { return +date; });
        let noOfDays: number = this.parent.activeViewOptions.showWeekend ? util.WEEK_LENGTH : workDays.length;
        while (dates.length > 0) {
            this.slots.push(dates.splice(0, noOfDays));
        }
    }

    public createAppointmentElement(record: { [key: string]: Object }, resIndex: number, isCloneElement: boolean = false): HTMLElement {
        let eventSubject: string = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default) as string;
        let appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'role': 'button', 'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record), 'aria-selected': 'false', 'aria-grabbed': 'true',
                'aria-label': eventSubject
            }
        });
        if (!isCloneElement) {
            appointmentWrapper.setAttribute('data-guid', record.Guid as string);
        }
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        let appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        let templateElement: HTMLElement[];
        let eventData: { [key: string]: Object } = record.data as { [key: string]: Object };
        let eventObj: { [key: string]: Object } = this.getEventData(record);
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            let scheduleId: string = this.parent.element.id + '_';
            let viewName: string = this.parent.activeViewOptions.eventTemplateName;
            let templateId: string = scheduleId + viewName + 'eventTemplate';
            templateElement = this.parent.getAppointmentTemplate()(eventObj, this.parent, 'eventTemplate', templateId, false);
        } else {
            let eventLocation: string = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '') as string;
            let appointmentSubject: HTMLElement = createElement('div', {
                className: cls.SUBJECT_CLASS,
                innerHTML: (eventSubject + (eventLocation ? ';&nbsp' + eventLocation : ''))
            });
            let appointmentStartTime: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.startTime] as Date)
            });
            let appointmentEndTime: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.endTime] as Date)
            });
            if (this.parent.currentView === 'Month') {
                if (record[this.fields.isAllDay]) {
                    templateElement = [appointmentSubject];
                    addClass([appointmentSubject], 'e-text-center');
                } else if (eventData.count <= 1 && !eventData.isLeft && !eventData.isRight) {
                    templateElement = [appointmentStartTime, appointmentSubject];
                } else {
                    templateElement = [];
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            } else {
                let innerElement: HTMLElement[];
                if (record[this.fields.isAllDay]) {
                    let allDayString: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME, innerHTML: this.parent.localeObj.getConstant('allDay')
                    });
                    innerElement = [appointmentSubject, allDayString];
                } else {
                    let timeString: string = this.parent.getTimeString(eventData[this.fields.startTime] as Date)
                        + ' - ' + this.parent.getTimeString(eventData[this.fields.endTime] as Date);
                    let appTime: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''), innerHTML: timeString,
                    });
                    let appLocation: HTMLElement = createElement('div', { className: cls.LOCATION_CLASS, innerHTML: eventLocation });
                    innerElement = [appointmentSubject, appTime, appLocation];
                }
                let wrap: HTMLElement = createElement('div', { className: 'e-inner-wrap' });
                append(innerElement, wrap);
                templateElement = [wrap];
            }
        }
        append(templateElement, appointmentDetails);
        this.appendEventIcons(record, appointmentDetails);
        this.renderResizeHandler(appointmentWrapper, record.data as { [key: string]: Object }, record[this.fields.isReadonly] as boolean);
        return appointmentWrapper;
    }

    private appendEventIcons(record: { [key: string]: Object }, appointmentDetails: HTMLElement): void {
        let eventData: { [key: string]: Object } = record.data as { [key: string]: Object };
        if (!isNullOrUndefined(record[this.fields.recurrenceRule]) || !isNullOrUndefined(record[this.fields.recurrenceID])) {
            let iconClass: string = (record[this.fields.id] === record[this.fields.recurrenceID]) ?
                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appointmentDetails.appendChild(createElement('div', {
                className: cls.ICON + ' ' + iconClass + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : '')
            }));
        }
        if (eventData.isLeft) {
            let iconLeft: HTMLElement = createElement('div', {
                className: cls.EVENT_INDICATOR_CLASS + ' ' + cls.ICON + ' ' + cls.EVENT_ICON_LEFT_CLASS
            });
            prepend([iconLeft], appointmentDetails);
        }
        if (eventData.isRight) {
            let iconRight: HTMLElement = createElement('div', {
                className: cls.EVENT_INDICATOR_CLASS + ' ' + cls.ICON + ' ' + cls.EVENT_ICON_RIGHT_CLASS
            });
            append([iconRight], appointmentDetails);
        }
    }

    public renderEvents(event: { [key: string]: Object }, resIndex: number, eventsList?: { [key: string]: Object }[]): void {
        let startTime: Date = event[this.fields.startTime] as Date;
        let endTime: Date = event[this.fields.endTime] as Date;
        let day: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(startTime));
        if (day < 0) {
            return;
        }
        let overlapCount: number = this.getIndex(startTime);
        event.Index = overlapCount;
        let appHeight: number = this.eventHeight;
        this.renderedEvents.push(extend({}, event, null, true));
        let diffInDays: number = (event.data as { [key: string]: Object }).count as number;
        if (startTime.getTime() <= endTime.getTime()) {
            let appWidth: number = (diffInDays * this.cellWidth) - 5;
            let cellTd: Element = this.workCells[day];
            let appTop: number = (overlapCount * (appHeight + EVENT_GAP));
            this.renderWrapperElement(cellTd as HTMLElement);
            let height: number =
                this.monthHeaderHeight + ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            if ((this.cellHeight > height) || this.parent.rowAutoHeight) {
                let appointmentElement: HTMLElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                this.wireAppointmentEvents(appointmentElement, false, event);
                setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'top': appTop + 'px' });
                this.renderEventElement(event, appointmentElement, cellTd);
                if (this.parent.rowAutoHeight) {
                    let firstChild: HTMLElement = cellTd.parentElement.firstChild as HTMLElement;
                    this.updateCellHeight(firstChild, height);
                }
            } else {
                for (let i: number = 0; i < diffInDays; i++) {
                    let cellTd: HTMLElement = this.workCells[day + i];
                    if (cellTd && isNullOrUndefined(cellTd.querySelector('.' + cls.MORE_INDICATOR_CLASS))) {
                        let startDate: Date = new Date(this.dateRender[day + i].getTime());
                        let endDate: Date = util.addDays(this.dateRender[day + i], 1);
                        let groupIndex: string = cellTd.getAttribute('data-group-index');
                        let filterEvents: Object[] = this.getFilteredEvents(startDate, endDate, groupIndex);
                        let appArea: number = this.cellHeight - this.monthHeaderHeight - this.moreIndicatorHeight;
                        let renderedAppCount: number = Math.floor(appArea / (appHeight + EVENT_GAP));
                        let count: number = (filterEvents.length - renderedAppCount) <= 0 ? 1 : (filterEvents.length - renderedAppCount);
                        let moreIndicatorElement: HTMLElement = this.getMoreIndicatorElement(count, startDate, endDate);
                        if (!isNullOrUndefined(groupIndex)) {
                            moreIndicatorElement.setAttribute('data-group-index', groupIndex);
                        }
                        moreIndicatorElement.style.top = appArea + 'px';
                        moreIndicatorElement.style.width = cellTd.offsetWidth - 2 + 'px';
                        this.renderElement(cellTd, moreIndicatorElement);
                        EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
                    }
                }
            }
        }
    }

    public updateCellHeight(cell: HTMLElement, height: number): void {
        if ((height > cell.offsetHeight)) {
            setStyleAttribute(cell as HTMLElement, { 'height': height + 'px' });
        }
    }

    public updateBlockElements(): void {
        let blockElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let target: HTMLElement = closest(element, 'tr') as HTMLElement;
            this.monthHeaderHeight = (<HTMLElement>element.offsetParent).offsetTop - target.offsetTop;
            element.style.height = ((target.offsetHeight - 1) - this.monthHeaderHeight) + 'px';
            let firstChild: HTMLElement = target.firstChild as HTMLElement;
            let width: number = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
    }

    public getFilteredEvents(startDate: Date, endDate: Date, groupIndex: string, eventsList?: { [key: string]: Object }[]): Object[] {
        let filteredEvents: Object[];
        if (isNullOrUndefined(groupIndex)) {
            filteredEvents = this.filterEvents(startDate, endDate);
        } else {
            let data: TdData = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            filteredEvents = this.filterEvents(startDate, endDate, isNullOrUndefined(eventsList) ? undefined : eventsList, data);
        }
        return filteredEvents;
    }

    public getOverlapEvents(date: Date, appointments: { [key: string]: Object }[]): Object[] {
        let appointmentsList: Object[] = [];
        for (let app of appointments) {
            if ((util.resetTime(<Date>app[this.fields.startTime]).getTime() <= util.resetTime(date).getTime()) &&
                (util.resetTime(<Date>app[this.fields.endTime]).getTime() >= util.resetTime(date).getTime())) {
                appointmentsList.push(app);
            }
        }
        return appointmentsList;
    }

    public getIndex(date: Date): number {
        let appIndex: number = -1;
        let appointments: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.renderedEvents;
        if (appointments.length > 0) {
            let appointmentsList: Object[] = this.getOverlapEvents(date, appointments);
            let appLevel: Object[] = appointmentsList.map((obj: { [key: string]: Object }) => { return obj.Index; });
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }

    public moreIndicatorClick(event: Event): void {
        let target: Element = closest((event.target as Element), '.' + cls.MORE_INDICATOR_CLASS);
        let startDate: Date = new Date(parseInt(target.getAttribute('data-start-date'), 10));
        let endDate: Date = new Date(parseInt(target.getAttribute('data-end-date'), 10));
        let groupIndex: string = target.getAttribute('data-group-index');
        let moreArgs: MoreEventsClickArgs = {
            cancel: false, event: event, element: target, isPopupOpen: true,
            startTime: startDate, endTime: endDate, viewName: this.parent.getNavigateView()
        };
        if (groupIndex) {
            moreArgs.groupIndex = parseInt(groupIndex, 10);
        }
        this.parent.trigger(events.moreEventsClick, moreArgs, (clickArgs: MoreEventsClickArgs) => {
            if (isBlazor()) {
                clickArgs.startTime = new Date('' + clickArgs.startTime);
                clickArgs.endTime = new Date('' + clickArgs.endTime);
                clickArgs.element = getElement(clickArgs.element);
            }
            if (!clickArgs.cancel) {
                if (clickArgs.isPopupOpen) {
                    let filteredEvents: Object[] = this.getFilteredEvents(startDate, endDate, groupIndex);
                    let moreEventArgs: EventClickArgs = { date: startDate, event: filteredEvents, element: event.target } as EventClickArgs;
                    this.parent.quickPopup.moreEventClick(moreEventArgs, endDate, groupIndex);
                } else {
                    this.parent.setProperties({ selectedDate: startDate }, true);
                    this.parent.changeView(clickArgs.viewName, event);
                }
            }
        });
    }

    public renderEventElement(event: { [key: string]: Object }, appointmentElement: HTMLElement, cellTd: Element): void {
        let eventType: string = appointmentElement.classList.contains(cls.BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        let eventObj: { [key: string]: Object } = this.getEventData(event);
        let args: EventRenderedArgs = { data: eventObj, element: appointmentElement, cancel: false, type: eventType };
        this.parent.trigger(events.eventRendered, args, (eventArgs: EventRenderedArgs) => {
            if (eventArgs.cancel) {
                this.renderedEvents.pop();
            } else {
                this.renderElement(cellTd, appointmentElement);
            }
        });
    }

    public getEventData(event: { [key: string]: Object }): { [key: string]: Object } {
        let eventObj: { [key: string]: Object } = extend({}, event, null, true) as { [key: string]: Object };
        eventObj[this.fields.startTime] = (event.data as { [key: string]: Object })[this.fields.startTime];
        eventObj[this.fields.endTime] = (event.data as { [key: string]: Object })[this.fields.endTime];
        return eventObj;
    }

    public renderElement(cellTd: HTMLElement | Element, element: HTMLElement): void {
        if (cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS)) {
            cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS).appendChild(element);
        } else {
            let wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    }

    private renderWrapperElement(cellTd: HTMLElement): void {
        let element: HTMLElement = cellTd.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        if (!isNullOrUndefined(element)) {
            this.monthHeaderHeight = element.offsetTop - (<HTMLElement>cellTd).offsetTop;
        } else {
            let wrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            cellTd.appendChild(wrapper);
            this.monthHeaderHeight = wrapper.offsetTop - (<HTMLElement>cellTd).offsetTop;
        }
    }

    public getMoreIndicatorElement(count: number, startDate: Date, endDate: Date): HTMLElement {
        let moreIndicatorElement: HTMLElement = createElement('div', {
            className: cls.MORE_INDICATOR_CLASS,
            innerHTML: '+' + count + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more')),
            attrs: {
                'tabindex': '0',
                'data-start-date': startDate.getTime().toString(),
                'data-end-date': endDate.getTime().toString()
            }
        });
        return moreIndicatorElement;
    }

    public removeHeightProperty(selector: string): void {
        let rows: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + selector + ' tbody tr'));
        for (let row of rows) {
            (row.firstChild as HTMLElement).style.height = '';
        }
    }
}
