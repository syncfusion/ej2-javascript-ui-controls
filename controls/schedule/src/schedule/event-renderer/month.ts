import { append, prepend, createElement, extend, EventHandler, closest, addClass } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { EventFieldsMapping, EventClickArgs, EventRenderedArgs, TdData } from '../base/interface';
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
    private monthHeaderHeight: number;
    public workCells: HTMLElement[];
    public cellWidth: number;
    public cellHeight: number;
    public moreIndicatorHeight: number = 19;

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
        let appointmentWrapper: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS));
        for (let wrap of appointmentWrapper) {
            remove(wrap);
        }
        this.eventHeight = util.getElementHeightFromClass(this.element, cls.APPOINTMENT_CLASS);
        if (this.parent.currentView === 'Month') {
            this.monthHeaderHeight = util.getOuterHeight(this.element.querySelector('.' + cls.DATE_HEADER_CLASS) as HTMLElement);
        } else {
            this.monthHeaderHeight = 0;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.renderResourceEvents();
        } else {
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays);
        }
    }

    public renderEventsHandler(dateRender: Date[], workDays: number[], resData?: TdData): void {
        this.renderedEvents = [];
        let eventsList: { [key: string]: Object }[];
        let resIndex: number = 0;
        if (resData) {
            resIndex = resData.groupIndex;
            this.cssClass = resData.cssClass;
            this.groupOrder = resData.groupOrder;
            eventsList = this.parent.eventBase.filterEventsByResource(resData) as { [key: string]: Object }[];
            this.workCells = [].slice.call(this.element.querySelectorAll
                ('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        } else {
            eventsList = <{ [key: string]: Object }[]>this.parent.eventsProcessed;
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        }
        this.sortByDateTime(eventsList);
        this.cellWidth = this.workCells.slice(-1)[0].offsetWidth;
        this.cellHeight = this.workCells.slice(-1)[0].offsetHeight;
        this.dateRender = dateRender;
        this.getSlotDates(workDays);
        for (let event of eventsList) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            let splittedEvents: { [key: string]: Object }[] = this.splitEvent(event, this.dateRender);
            for (let event of splittedEvents) {
                this.updateIndicatorIcon(<{ [key: string]: Object }>event);
                this.renderEvents(<{ [key: string]: Object }>event, resIndex);
            }
        }
        this.cssClass = null;
        this.groupOrder = null;
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

    public createAppointmentElement(record: { [key: string]: Object }, resIndex: number): HTMLElement {
        let eventSubject: string = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default) as string;
        let appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'data-guid': record.Guid as string, 'role': 'button', 'tabindex': '0',
                'aria-readonly': 'false', 'aria-selected': 'false', 'aria-grabbed': 'true',
                'aria-label': eventSubject
            }
        });
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        let appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        let templateElement: HTMLElement[];
        let eventData: { [key: string]: Object } = record.data as { [key: string]: Object };
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
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
        this.renderResizeHandler(appointmentWrapper, record.data as { [key: string]: Object });
        return appointmentWrapper;
    }

    private appendEventIcons(record: { [key: string]: Object }, appointmentDetails: HTMLElement): void {
        let eventData: { [key: string]: Object } = record.data as { [key: string]: Object };
        if (!isNullOrUndefined(record[this.fields.recurrenceRule])) {
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

    public renderEvents(event: { [key: string]: Object }, resIndex: number): void {
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
            let appWidth: number = (diffInDays * this.cellWidth) - 3;
            let cellTd: Element = this.workCells[day];
            let appTop: number = (overlapCount * (appHeight + EVENT_GAP));
            if (this.cellHeight > this.monthHeaderHeight + ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight) {
                let appointmentElement: HTMLElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                this.wireAppointmentEvents(appointmentElement);
                setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'top': appTop + 'px' });
                this.renderEventElement(event, appointmentElement, cellTd);
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

    public getFilteredEvents(startDate: Date, endDate: Date, groupIndex: string): Object[] {
        let filteredEvents: Object[];
        if (isNullOrUndefined(groupIndex)) {
            filteredEvents = this.filterEvents(startDate, endDate);
        } else {
            let data: TdData = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            filteredEvents = this.filterEvents(startDate, endDate, undefined, data);
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
        if (!isNullOrUndefined(startDate) && this.parent.isAdaptive) {
            this.parent.setProperties({ selectedDate: startDate }, true);
            this.parent.changeView(this.parent.getNavigateView());
        } else {
            let endDate: Date = new Date(parseInt(target.getAttribute('data-end-date'), 10));
            let groupIndex: string = target.getAttribute('data-group-index');
            let filteredEvents: Object[] = this.getFilteredEvents(startDate, endDate, groupIndex);
            let moreEventArgs: EventClickArgs = { date: startDate, event: filteredEvents, element: event.target } as EventClickArgs;
            this.parent.quickPopup.moreEventClick(moreEventArgs, endDate, groupIndex);
        }
    }

    public renderEventElement(event: { [key: string]: Object }, appointmentElement: HTMLElement, cellTd: Element): void {
        let args: EventRenderedArgs = { data: event, element: appointmentElement, cancel: false };
        this.parent.trigger(events.eventRendered, args);
        if (args.cancel) {
            this.renderedEvents.pop();
            return;
        }
        this.renderElement(cellTd, appointmentElement);
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
}
